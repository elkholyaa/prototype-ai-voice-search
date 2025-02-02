// src/app/api/search/route.ts
//
// Educational Note:
// For rapid PoC development, we are temporarily disabling the API middleware and
// the embeddings‑based semantic search. Instead, we call our text‑based search function
// directly. To restore the full search functionality from the main branch, please:
//   1. Uncomment the API middleware import and usage below.
//   2. Replace the call to searchProperties() with findSimilarProperties().
//   3. Adjust the request handling as needed.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// For rapid PoC, we use the text-based search function from utils/search.
import { searchProperties } from '@/utils/search';

// To re-enable the semantic search, comment out the above line and uncomment below:
// import { findSimilarProperties } from '@/utils/embeddings';

// Also, to re-enable API middleware, uncomment the next line:
// import { withApiMiddleware } from '@/utils/api-middleware';

const searchSchema = z.object({
  query: z.string(),
  // The "limit" parameter is optional; defaults to 10 if not provided.
  limit: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Parse and validate the incoming search query
    const { query } = searchSchema.parse(body);

    // For rapid PoC, use the local text-based search.
    // To use the semantic search with embeddings, replace this call with:
    // const results = await findSimilarProperties(query, limit ?? 10);
    const results = searchProperties(query);

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

// To re-enable API middleware, uncomment the block below:
//
// const handler = withApiMiddleware({
//   POST: handlePost, // Ensure that handlePost is defined if using middleware.
// });
//
// export const POST = handler.POST;
