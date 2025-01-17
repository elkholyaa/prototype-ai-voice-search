import fs from 'fs';
import path from 'path';
import { Property, PropertyWithEmbedding } from '@/types';

interface EmbeddingMetadata {
  lastProcessedId: number;
  lastUpdateTimestamp: string;
  totalProcessed: number;
  binaryFormat: {
    dimensions: number;
    count: number;
    bytesPerFloat: number;
  };
}

export function loadEmbeddings() {
  const staticDir = path.join(process.cwd(), 'src', 'data', 'static');
  const metadataPath = path.join(staticDir, 'embedding-metadata.json');
  const binaryPath = path.join(staticDir, 'embeddings.bin');
  const propertiesPath = path.join(staticDir, 'properties.json');

  // Load metadata
  const metadata: EmbeddingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Load properties
  const properties: Property[] = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
  
  // Load binary embeddings
  const buffer = fs.readFileSync(binaryPath);
  const embeddings: number[][] = [];
  
  // Convert binary data back to embeddings
  for (let i = 0; i < metadata.binaryFormat.count; i++) {
    const start = i * metadata.binaryFormat.dimensions * metadata.binaryFormat.bytesPerFloat;
    const end = start + metadata.binaryFormat.dimensions * metadata.binaryFormat.bytesPerFloat;
    const slice = buffer.slice(start, end);
    const embedding = Array.from(new Float32Array(slice.buffer));
    embeddings.push(embedding);
  }

  // Combine properties with their embeddings
  const propertiesWithEmbeddings: PropertyWithEmbedding[] = properties.map((property, index) => ({
    ...property,
    embedding: embeddings[index]
  }));

  return {
    properties: propertiesWithEmbeddings,
    metadata
  };
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Find similar properties by embedding
export function findSimilarProperties(
  queryEmbedding: number[],
  properties: PropertyWithEmbedding[],
  limit: number = 5
): PropertyWithEmbedding[] {
  return properties
    .map(property => ({
      ...property,
      similarity: cosineSimilarity(queryEmbedding, property.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
} 