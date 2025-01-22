import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '@/utils/api-middleware';
import { z } from 'zod';
import { findSimilarProperties } from '@/utils/embeddings';
import { Property } from '@/types';
import { SearchResult } from '@/utils/search';
import { properties } from '@/data/properties';

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

    // Empty query: just return all properties directly (no search processing)
    if (!query.trim()) {
      return NextResponse.json({ 
        results: properties.map(p => ({ ...p, similarityScore: 1 }))
      });
    }

    // Only do search for non-empty queries
    const results = await findSimilarProperties(query, limit);
    
    // Extract city and district from query (simple exact match for POC)
    const cities = ['الرياض', 'جدة', 'الدمام'].filter(city => query.includes(city));
    const districtNames = ['النرجس', 'الياسمين', 'الملقا', 'العليا'];
    const districts = districtNames.filter(district => 
      query.includes(`حي ${district}`) || query.includes(district)
    );
    
    // Filter results based on city and district if mentioned in query
    let filteredResults = results;
    if (cities.length > 0) {
      filteredResults = filteredResults.filter(r => {
        const [propertyCity] = r.location.split('،').map(s => s.trim());
        return cities.some(city => propertyCity === city);
      });
    }
    
    if (districts.length > 0) {
      filteredResults = filteredResults.filter(r => {
        const [, propertyDistrict = ''] = r.location.split('،').map(s => s.trim());
        return districts.some(district => 
          propertyDistrict === `حي ${district}` || propertyDistrict.endsWith(district)
        );
      });
    }

    return NextResponse.json({ results: filteredResults });
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