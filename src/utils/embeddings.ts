import { OpenAI } from 'openai';
import { Property } from '@/types';
import { SearchResult } from './search';
import { promises as fs } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PropertyWithEmbedding extends Property {
  embedding: number[];
}

interface EmbeddingMetadata {
  lastProcessedId: number;
  lastUpdateTimestamp: string;
  totalProcessed: number;
}

export async function loadEmbeddings(): Promise<{
  embeddings: Float32Array;
  properties: Property[];
  metadata: EmbeddingMetadata;
}> {
  try {
    const staticDir = path.join(process.cwd(), 'src/data/static');
    const metadataPath = path.join(staticDir, 'embedding-metadata.json');
    const embeddingsBinaryPath = path.join(staticDir, 'embeddings.bin');
    const propertiesPath = path.join(staticDir, 'properties-with-embeddings.json');

    const [metadataContent, embeddingsBuffer, propertiesContent] = await Promise.all([
      fs.readFile(metadataPath, 'utf-8'),
      fs.readFile(embeddingsBinaryPath),
      fs.readFile(propertiesPath, 'utf-8'),
    ]);

    const metadata: EmbeddingMetadata = JSON.parse(metadataContent);
    const properties: Property[] = JSON.parse(propertiesContent);
    const embeddings = new Float32Array(embeddingsBuffer.buffer);

    return { embeddings, properties, metadata };
  } catch (error) {
    console.error('Error loading embeddings:', error);
    throw new Error('Failed to load embeddings data');
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

interface ExactCriteria {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  districts?: string[];
  rooms?: number;
  bathrooms?: number;
  features?: {
    required: string[];
    optional: string[];
  };
}

function extractFeatures(query: string): { required: string[]; optional: string[] } {
  const features = {
    required: [] as string[],
    optional: [] as string[]
  };

  // Common features to look for
  const allFeatures = [
    'مسبح', 'مجلس', 'حديقة', 'مصعد', 'تكييف مركزي', 'شرفة', 'مدخل خاص',
    'غرفة خادمة', 'غرفة سينما', 'مجلس نساء', 'مجلس رجال'
  ];

  // Split query into segments by 'او' (or)
  const segments = query.split(/\s+او\s+/);
  
  for (const segment of segments) {
    // Split each segment by 'و' (and)
    const andFeatures = segment.split(/\s+و\s+/);
    
    // If this segment has multiple parts joined by و, they are required together
    if (andFeatures.length > 1) {
      // Check each part for features
      for (const part of andFeatures) {
        for (const feature of allFeatures) {
          if (part.includes(feature)) {
            features.required.push(feature);
          }
        }
      }
    } else {
      // Single feature in this segment - check if it's in allFeatures
      for (const feature of allFeatures) {
        if (segment.includes(feature)) {
          features.optional.push(feature);
        }
      }
    }
  }

  return features;
}

function extractExactCriteria(query: string): ExactCriteria {
  const criteria: ExactCriteria = {};
  
  // Extract property type
  const propertyTypes = {
    'فيلا': ['فيلا', 'فلة', 'فله'],
    'شقة': ['شقة', 'شقه'],
    'قصر': ['قصر'],
    'دوبلكس': ['دوبلكس', 'دوبليكس']
  };

  for (const [type, variations] of Object.entries(propertyTypes)) {
    if (variations.some(v => query.includes(v))) {
      criteria.type = type;
      break;
    }
  }

  // Extract districts - with all variations and common patterns
  const districtVariations = {
    'النرجس': ['النرجس', 'نرجس'],
    'الياسمين': ['الياسمين', 'ياسمين'],
    'الملقا': ['الملقا', 'ملقا'],
    'العليا': ['العليا', 'عليا']
  };

  const prefixes = ['حي', 'في', 'ب', 'بحي', 'في حي'];
  criteria.districts = [];

  // Extract all matching districts (supports OR relationship)
  for (const [district, variations] of Object.entries(districtVariations)) {
    const matched = variations.some(variation => {
      if (query.includes(variation)) return true;
      return prefixes.some(prefix => {
        const withPrefix = `${prefix} ${variation}`;
        const attached = `${prefix}${variation}`;
        return query.includes(withPrefix) || query.includes(attached);
      });
    });
    
    if (matched) {
      criteria.districts.push(district);
    }
  }

  // Extract features
  criteria.features = extractFeatures(query);
  
  return criteria;
}

function propertyMatchesCriteria(property: Property & { similarityScore: number }, criteria: ExactCriteria): boolean {
  // Check each criteria
  if (criteria.type && property.type !== criteria.type) return false;
  if (criteria.city && property.city !== criteria.city) return false;
  if (criteria.districts && criteria.districts.length > 0 && !criteria.districts.includes(property.district)) return false;
  if (criteria.rooms && !property.features.some(f => f.includes(`${criteria.rooms} غرف`))) return false;
  if (criteria.bathrooms && !property.features.some(f => f.includes(`${criteria.bathrooms} حمامات`))) return false;
  if (criteria.minPrice && property.price < criteria.minPrice) return false;
  if (criteria.maxPrice && property.price > criteria.maxPrice) return false;

  // Check features
  if (criteria.features) {
    // All required features must be present
    if (criteria.features.required.length > 0) {
      if (!criteria.features.required.every(f => property.features.includes(f))) {
        return false;
      }
    }

    // At least one optional feature must be present if there are any
    if (criteria.features.optional.length > 0) {
      if (!criteria.features.optional.some(f => property.features.includes(f))) {
        return false;
      }
    }
  }

  return true;
}

export async function findSimilarProperties(query: string, limit: number = 10): Promise<SearchResult[]> {
  try {
    // Get query embedding
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryEmbedding = response.data[0].embedding;

    // Load embeddings and properties
    const { embeddings, properties } = await loadEmbeddings();

    // Extract exact criteria from query
    const criteria = extractExactCriteria(query);

    // Calculate similarity scores and filter by exact criteria
    const results = properties
      .map((property, index) => {
        const propertyEmbedding = Array.from(embeddings.slice(index * 1536, (index + 1) * 1536));
        const similarityScore = cosineSimilarity(queryEmbedding, propertyEmbedding);
        const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
        const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;

        return { ...property, similarityScore, rooms };
      })
      .filter(property => propertyMatchesCriteria(property, criteria))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error('Error finding similar properties:', error);
    throw new Error('Failed to find similar properties');
  }
} 