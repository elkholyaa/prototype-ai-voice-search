import { NextRequest, NextResponse } from 'next/server';
// Temporarily commenting out API middleware for local development
// import { withApiMiddleware } from '@/utils/api-middleware';
import { z } from 'zod';
// Commenting out embeddings search in favor of simple text search
// import { findSimilarProperties } from '@/utils/embeddings';
import { searchProperties } from '@/utils/search';

// Remove limit validation, only keep query requirement
const searchSchema = z.object({
  query: z.string(),
  // Removed limit validation to allow unlimited results
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Only destructure query since limit is removed
    const { query } = searchSchema.parse(body);
    
    // Pass undefined as limit to get all results
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

// Temporarily disabling API middleware
// const handler = withApiMiddleware({
//   POST: handlePost,
// });
// 
// export const POST = handler.POST; 