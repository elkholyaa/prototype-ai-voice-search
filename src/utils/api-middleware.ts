import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { rateLimit } from '@/utils/rate-limit';

const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;
type ApiHandlers = {
  GET?: ApiHandler;
  POST?: ApiHandler;
};

export function withApiMiddleware(handlers: ApiHandlers) {
  const wrappedHandlers: ApiHandlers = {};

  for (const [method, handler] of Object.entries(handlers)) {
    if (!handler) continue;

    wrappedHandlers[method as keyof ApiHandlers] = async (req: NextRequest) => {
      try {
        // Apply rate limiting
        const limiter = rateLimit({
          interval: 60 * 1000, // 1 minute
          uniqueTokenPerInterval: 500,
        });

        const identifier = req.ip || 'anonymous';
        await limiter.check(10, identifier); // 10 requests per minute

        // Check cache for GET requests
        if (method === 'GET') {
          const cacheKey = req.url;
          const cachedResponse = cache.get(cacheKey);
          if (cachedResponse) {
            return NextResponse.json(cachedResponse);
          }
        }

        // Call the original handler
        const response = await handler(req);

        // Cache successful GET responses
        if (method === 'GET' && response.status === 200) {
          const cacheKey = req.url;
          const responseData = await response.json();
          cache.set(cacheKey, responseData);
          return NextResponse.json(responseData);
        }

        return response;
      } catch (error: any) {
        if (error?.message === 'Rate limit exceeded') {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }

        console.error('API Error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  }

  return wrappedHandlers;
} 