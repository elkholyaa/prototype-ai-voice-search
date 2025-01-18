import { OpenAI } from 'openai';
import { Property } from '@/types';
import { findSimilarProperties } from './embeddings';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SearchResult extends Property {
  similarityScore: number;
  city: string;
  district: string;
  rooms: number;
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
  return findSimilarProperties(query, limit);
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