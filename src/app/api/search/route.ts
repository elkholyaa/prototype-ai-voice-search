import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '@/utils/api-middleware';
import { z } from 'zod';
import { findSimilarProperties } from '@/utils/embeddings';
import { Property } from '@/types';
import { SearchResult } from '@/utils/search';

// Define the search request schema
const searchSchema = z.object({
  query: z.string(),
  limit: z.number().min(1).max(50).optional().default(10),
});

// Handle POST requests
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit } = searchSchema.parse(body);

    // Return all properties for empty queries
    if (!query.trim()) {
      const results = await findSimilarProperties('', limit);
      return NextResponse.json({ results });
    }

    const results = await findSimilarProperties(query, limit);
    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}

// Apply rate limiting and other middleware
const handler = withApiMiddleware({
  POST: handlePost,
});

export const POST = handler.POST; 