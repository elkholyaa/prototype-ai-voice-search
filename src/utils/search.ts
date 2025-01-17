import { OpenAI } from 'openai';
import { Property, PropertyWithEmbedding } from '@/types';
import { loadEmbeddings, findSimilarProperties } from './embeddings';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SearchResult {
  property: Property;
  similarityScore: number;
}

/**
 * Generates an embedding for the given query text using OpenAI's text-embedding-ada-002 model
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  return response.data[0].embedding;
}

/**
 * Searches for properties using natural language queries
 * @param query Natural language query (e.g., "فيلا مع مسبح وحديقة في الرياض")
 * @param limit Maximum number of results to return (default: 10)
 * @returns Array of properties with their similarity scores
 */
export async function searchProperties(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  // Load precomputed property embeddings
  const { properties } = loadEmbeddings();
  
  // Generate embedding for the search query
  const queryEmbedding = await generateQueryEmbedding(query);
  
  // Find similar properties using cosine similarity
  const similarProperties = findSimilarProperties(queryEmbedding, properties, limit);
  
  // Format results
  return similarProperties.map(property => ({
    property: {
      id: property.id,
      type: property.type,
      title: property.title,
      price: property.price,
      location: property.location,
      features: property.features,
      image: property.image,
    },
    similarityScore: property.similarity || 0,
  }));
}

/**
 * Server-side function to handle search requests
 * This can be used in API routes or server components
 */
export async function handleSearchRequest(
  query: string,
  limit?: number
): Promise<{ results: SearchResult[]; error?: string }> {
  try {
    const results = await searchProperties(query, limit);
    return { results };
  } catch (error) {
    console.error('Search error:', error);
    return {
      results: [],
      error: 'Failed to process search request. Please try again.',
    };
  }
} 