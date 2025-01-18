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

export async function findSimilarProperties(
  query: string,
  limit: number = 10
): Promise<Array<Property & { similarityScore: number; city: string; district: string; rooms: number }>> {
  try {
    // Load embeddings and properties
    const { embeddings, properties } = await loadEmbeddings();

    // Get embedding for the search query
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    const queryEmbedding = response.data[0].embedding;

    // Calculate similarity scores
    const propertyScores = properties.map((property, index) => {
      const start = index * 1536; // Each embedding is 1536 dimensions
      const end = start + 1536;
      const propertyEmbedding = Array.from(embeddings.slice(start, end));
      const similarityScore = cosineSimilarity(queryEmbedding, propertyEmbedding);

      // Extract city, district, and rooms from property data
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