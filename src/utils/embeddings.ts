import { OpenAI } from 'openai';
import { Property } from '@/types';
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
  district?: string;
  rooms?: number;
  bathrooms?: number;
}

function extractExactCriteria(query: string): ExactCriteria {
  const criteria: ExactCriteria = {};
  
  // Extract property type - checking all possible types from Property interface
  const propertyTypes = {
    'فيلا': ['فيلا', 'فلة', 'فله'], // Including common variations
    'شقة': ['شقة', 'شقه'],
    'قصر': ['قصر'],
    'دوبلكس': ['دوبلكس', 'دوبليكس'] // Including common misspelling
  };

  for (const [type, variations] of Object.entries(propertyTypes)) {
    if (variations.some(v => query.includes(v))) {
      criteria.type = type;
      break;
    }
  }
  
  // Extract city - all possible cities
  const cities = ['الرياض', 'جدة', 'الدمام'];
  for (const city of cities) {
    if (query.includes(city)) {
      criteria.city = city;
      break;
    }
  }
  
  // Extract district - with all variations and common patterns
  const districtVariations = {
    'النرجس': ['النرجس', 'نرجس', 'الترجس', 'نارجس'], // Common typos and variations
    'الياسمين': ['الياسمين', 'ياسمين', 'الياسمبن'], // Common typos
    'الملقا': ['الملقا', 'ملقا', 'الملقى', 'ملقى'], // Different spellings
    'العليا': ['العليا', 'عليا', 'العلية'] // Different spellings
  };
  
  // Common prefixes that might come before district names
  const prefixes = ['حي', 'في', 'ب', 'بحي', 'في حي', 'منطقة', 'منطقه'];

  // Add feature variations and synonyms
  type FeatureKey = 'تكييف مركزي' | 'مسبح' | 'حديقة' | 'مجلس' | 'شرفة';
  const featureVariations: Record<FeatureKey, string[]> = {
    'تكييف مركزي': ['تكييف', 'تكيف', 'مكيف', 'تبريد', 'تبريد مركزي', 'تكييف مركزي'],
    'مسبح': ['مسبح', 'حوض سباحة', 'بركة سباحة'],
    'حديقة': ['حديقة', 'حديقه', 'جنينة'],
    'مجلس': ['مجلس', 'صالة استقبال', 'غرفة ضيوف'],
    'شرفة': ['شرفة', 'شرفه', 'بلكونة', 'بلكونه']
  };

  // Function to check if a feature is present in the query
  function hasFeature(query: string, feature: FeatureKey): boolean {
    return featureVariations[feature].some((variation: string) => query.includes(variation));
  }

  // Extract district
  for (const [district, variations] of Object.entries(districtVariations)) {
    // Check each variation with each possible prefix
    const matched = variations.some(variation => {
      // Direct match
      if (query.includes(variation)) return true;
      
      // Match with prefixes
      return prefixes.some(prefix => {
        const withPrefix = `${prefix} ${variation}`;
        const attached = `${prefix}${variation}`;
        return query.includes(withPrefix) || query.includes(attached);
      });
    });
    
    if (matched) {
      criteria.district = district;
      break;
    }
  }
  
  // Extract room count - handling multiple formats and variations
  const roomPatterns = [
    /(\d+|[٠-٩]+)\s*(غرف|غرفة|غرفه)/,  // Direct number + rooms
    /(اربع|أربع|ثلاث|خمس|ست|سبع|ثمان|تسع|عشر)\s*(غرف|غرفة|غرفه)/,  // Written numbers
    /(غرفتين|غرفتان)/  // Special cases
  ];

  for (const pattern of roomPatterns) {
    const match = query.match(pattern);
    if (match) {
      const numStr = match[1];
      if (numStr) {
        // Convert Arabic numerals to English
        if (/[٠-٩]/.test(numStr)) {
          criteria.rooms = Number(numStr.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
        } 
        // Convert written numbers to digits
        else if (/^[ا-ي]+$/.test(numStr)) {
          const numberMap: { [key: string]: number } = {
            'غرفتين': 2,
            'غرفتان': 2,
            'ثلاث': 3,
            'اربع': 4,
            'أربع': 4,
            'خمس': 5,
            'ست': 6,
            'سبع': 7,
            'ثمان': 8,
            'تسع': 9,
            'عشر': 10
          };
          criteria.rooms = numberMap[numStr] || 0;
        } else {
          criteria.rooms = Number(numStr);
        }
        break;
      }
    }
  }
  
  // Extract bathroom count - similar pattern to rooms
  const bathPatterns = [
    /(\d+|[٠-٩]+)\s*(حمام|حمامات)/,
    /(حمامين)/,
    /(ثلاث|اربع|أربع|خمس)\s*(حمامات)/
  ];

  for (const pattern of bathPatterns) {
    const match = query.match(pattern);
    if (match) {
      if (match[0] === 'حمامين') {
        criteria.bathrooms = 2;
      } else {
        const numStr = match[1];
        if (/[٠-٩]/.test(numStr)) {
          criteria.bathrooms = Number(numStr.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
        } else if (/^[ا-ي]+$/.test(numStr)) {
          const numberMap: { [key: string]: number } = {
            'ثلاث': 3,
            'اربع': 4,
            'أربع': 4,
            'خمس': 5
          };
          criteria.bathrooms = numberMap[numStr] || 0;
        } else {
          criteria.bathrooms = Number(numStr);
        }
      }
      break;
    }
  }
  
  // Extract price range - handling multiple formats
  const pricePatterns = [
    // Maximum price patterns
    /(مايزيد عن|اقل من|تحت|حد اقصى|لا يتجاوز|ما يتجاوز|اقصى سعر)\s*(\d+|[٠-٩]+)\s*(الف|مليون)/,
    // Minimum price patterns
    /(اكثر من|فوق|يزيد عن)\s*(\d+|[٠-٩]+)\s*(الف|مليون)/,
    // Range patterns
    /من\s*(\d+|[٠-٩]+)\s*(الف|مليون)\s*الى\s*(\d+|[٠-٩]+)\s*(الف|مليون)/
  ];

  for (const pattern of pricePatterns) {
    const match = query.match(pattern);
    if (match) {
      const processNumber = (numStr: string, unit: string): number => {
        const base = Number(numStr.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
        return unit === 'مليون' ? base * 1000000 : base * 1000;
      };

      if (match[0].startsWith('من')) {
        // Price range
        criteria.minPrice = processNumber(match[1], match[2]);
        criteria.maxPrice = processNumber(match[3], match[4]);
      } else if (match[0].match(/(اكثر من|فوق|يزيد عن)/)) {
        // Minimum price
        criteria.minPrice = processNumber(match[2], match[3]);
      } else {
        // Maximum price
        criteria.maxPrice = processNumber(match[2], match[3]);
      }
      break;
    }
  }
  
  return criteria;
}

function propertyMatchesCriteria(property: Property, criteria: ExactCriteria): boolean {
  // Type check
  if (criteria.type && property.type !== criteria.type) return false;
  
  // Price check
  if (criteria.maxPrice && property.price > criteria.maxPrice) return false;
  if (criteria.minPrice && property.price < criteria.minPrice) return false;
  
  // Location check
  const [city = '', district = ''] = property.location.split('،').map(s => s.trim());
  if (criteria.city && city !== criteria.city) return false;
  if (criteria.district && !district.includes(criteria.district)) return false;
  
  // Room count check
  if (criteria.rooms) {
    const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
    if (!roomFeature) return false;
    const roomCount = parseInt(roomFeature.match(/\d+/)?.[0] || '0');
    if (roomCount !== criteria.rooms) return false;
  }
  
  // Bathroom count check
  if (criteria.bathrooms) {
    const bathFeature = property.features.find(f => f.includes('حمام'));
    if (!bathFeature) return false;
    const bathCount = parseInt(bathFeature.match(/\d+/)?.[0] || '0');
    if (bathCount !== criteria.bathrooms) return false;
  }
  
  return true;
}

export async function findSimilarProperties(
  query: string,
  limit: number = 10
): Promise<Array<Property & { similarityScore: number; city: string; district: string; rooms: number }>> {
  try {
    // Load embeddings and properties
    const { embeddings, properties } = await loadEmbeddings();
    
    // Extract exact criteria from query
    const criteria = extractExactCriteria(query);
    
    // First, filter properties based on exact criteria
    const filteredIndices = properties
      .map((prop, idx) => ({ prop, idx }))
      .filter(({ prop }) => propertyMatchesCriteria(prop, criteria))
      .map(({ idx }) => idx);
    
    if (filteredIndices.length === 0) {
      return [];
    }
    
    // Get embedding for the search query
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    const queryEmbedding = response.data[0].embedding;
    
    // Calculate similarity scores only for filtered properties
    const propertyScores = filteredIndices.map(index => {
      const property = properties[index];
      const start = index * 1536; // Each embedding is 1536 dimensions
      const end = start + 1536;
      const propertyEmbedding = Array.from(embeddings.slice(start, end));
      const similarityScore = cosineSimilarity(queryEmbedding, propertyEmbedding);
      
      // Extract city and district
      const [city = '', district = ''] = property.location.split('،').map(s => s.trim());
      const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
      const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;
      
      return {
        ...property,
        city,
        district,
        rooms,
        similarityScore,
      };
    });
    
    // Sort by similarity score and return top results
    return propertyScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding similar properties:', error);
    throw error;
  }
} 