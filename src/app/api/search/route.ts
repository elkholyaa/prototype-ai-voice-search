import { NextResponse } from 'next/server';
import { handleSearchRequest } from '@/utils/search';
import { rateLimit, getCachedResults, cacheResults } from '@/utils/api-middleware';
import { z } from 'zod';

// Input validation schema
const searchSchema = z.object({
  query: z.string().min(2).max(200),
  limit: z.number().min(1).max(50).optional().default(10),
});

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search for properties using natural language
 *     description: |
 *       Searches for properties using natural language queries and returns the most relevant matches
 *       based on semantic similarity using OpenAI embeddings.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Natural language search query
 *                 example: "فيلا مع مسبح وحديقة في الرياض"
 *               limit:
 *                 type: number
 *                 description: Maximum number of results to return
 *                 default: 10
 *                 minimum: 1
 *                 maximum: 50
 *     responses:
 *       200:
 *         description: Successful search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       city:
 *                         type: string
 *                       district:
 *                         type: string
 *                       rooms:
 *                         type: integer
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                       similarityScore:
 *                         type: number
 *                         format: float
 *                 total:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export async function POST(request: Request) {
  try {
    console.log('Received search request');
    
    // Check rate limit
    const rateLimitResponse = rateLimit(request as any);
    if (rateLimitResponse) {
      console.log('Rate limit exceeded');
      return rateLimitResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = searchSchema.safeParse(body);
    if (!validatedData.success) {
      console.log('Validation failed:', validatedData.error);
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedData.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { query, limit } = validatedData.data;
    console.log('Validated query:', query, 'limit:', limit);

    // Check cache first
    const cachedResults = getCachedResults(query, limit);
    if (cachedResults) {
      console.log('Returning cached results');
      return NextResponse.json(cachedResults);
    }

    // Process search request
    console.log('Processing search request...');
    const { results, error } = await handleSearchRequest(query, limit);

    if (error) {
      console.error('Search processing error:', error);
      return NextResponse.json(
        { 
          error: 'Search processing failed',
          message: error 
        },
        { status: 500 }
      );
    }

    if (!results.length) {
      const response = {
        results: [],
        message: 'No matching properties found for your search criteria.'
      };
      cacheResults(query, limit, response);
      return NextResponse.json(response, { status: 200 });
    }

    // Format response to match requirements
    const formattedResults = results.map(({ property, similarityScore }) => ({
      type: property.type,
      city: property.location.split(',')[0].trim(),
      district: property.location.split(',')[1]?.trim() || '',
      rooms: property.features.find(f => f.includes('غرف'))
        ? parseInt(property.features.find(f => f.includes('غرف'))?.match(/\d+/)?.[0] || '0')
        : 0,
      features: property.features,
      similarityScore: Number(similarityScore.toFixed(3)),
      // Include additional fields that might be useful for the frontend
      id: property.id,
      title: property.title,
      price: property.price,
      image: property.image,
    }));

    const response = {
      results: formattedResults,
      total: formattedResults.length,
      message: `Found ${formattedResults.length} matching properties.`
    };

    // Cache the results
    cacheResults(query, limit, response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('API error details:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Enable CORS for development
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 