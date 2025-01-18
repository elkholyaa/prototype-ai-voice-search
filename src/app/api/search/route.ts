import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiMiddleware } from '@/utils/api-middleware';
import { loadEmbeddings, findSimilarProperties } from '@/utils/embeddings';

// Input validation schema
const searchSchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().min(1).max(50).optional().default(10),
});

// Types for the response
export type SearchResult = {
  type: string;
  city: string;
  district: string;
  rooms: number;
  features: string[];
  similarityScore: number;
};

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { query, limit } = searchSchema.parse(body);

    // Load embeddings and find similar properties
    const { embeddings, properties } = await loadEmbeddings();
    const results = await findSimilarProperties(query, embeddings, properties, limit);

    // Format and return results
    return NextResponse.json({
      results,
      query,
      totalResults: results.length,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting and other middleware
export const { GET, POST: RawPOST } = withApiMiddleware({
  POST,
}); 