import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { Property } from '@/types';
import { SearchResult } from '@/app/api/search/route';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type for property with embedding
export interface PropertyWithEmbedding extends Property {
  embedding: number[];
}

// Type for metadata
interface EmbeddingMetadata {
  lastProcessedId: number;
  lastUpdateTimestamp: string;
  totalProcessed: number;
}

// Constants
const STATIC_DIR = path.join(process.cwd(), 'src', 'data', 'static');
const EMBEDDINGS_PATH = path.join(STATIC_DIR, 'embeddings.bin');
const PROPERTIES_PATH = path.join(STATIC_DIR, 'properties-with-embeddings.json');
const METADATA_PATH = path.join(STATIC_DIR, 'embedding-metadata.json');

/**
 * Load embeddings and properties from disk
 */
export async function loadEmbeddings() {
  // Read metadata to verify embeddings exist
  const metadata: EmbeddingMetadata = JSON.parse(
    fs.readFileSync(METADATA_PATH, 'utf-8')
  );

  if (!metadata.totalProcessed) {
    throw new Error('No embeddings found. Please generate embeddings first.');
  }

  // Load properties with embeddings
  const properties: PropertyWithEmbedding[] = JSON.parse(
    fs.readFileSync(PROPERTIES_PATH, 'utf-8')
  );

  // Load binary embeddings for faster processing
  const embeddingsBuffer = fs.readFileSync(EMBEDDINGS_PATH);
  const embeddings = new Float32Array(embeddingsBuffer.buffer);

  return { embeddings, properties, metadata };
}

/**
 * Calculate cosine similarity between two vectors
 */
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

/**
 * Find similar properties based on query
 */
export async function findSimilarProperties(
  query: string,
  embeddings: Float32Array,
  properties: PropertyWithEmbedding[],
  limit: number = 10
): Promise<SearchResult[]> {
  // Get embedding for the query
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });
  
  const queryEmbedding = response.data[0].embedding;

  // Calculate similarity scores
  const propertiesWithScores = properties.map(property => {
    // Extract city and district from location
    const [city = '', district = ''] = property.location.split('،').map(s => s.trim());
    
    // Extract room count from features
    const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
    const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;

    return {
      ...property,
      city,
      district,
      rooms,
      similarityScore: cosineSimilarity(queryEmbedding, property.embedding)
    };
  });

  // Sort by similarity score and take top results
  return propertiesWithScores
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map(({ embedding, ...rest }) => rest); // Remove embedding from response
} 