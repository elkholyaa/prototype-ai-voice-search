import { NextResponse } from 'next/server';
import { handleSearchRequest } from '@/utils/search';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, limit } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const { results, error } = await handleSearchRequest(query, limit);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Enable CORS for development
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
} 