import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Initialize LRU cache for search results
const searchCache = new LRUCache<string, any>({
  max: 100, // Maximum number of items
  ttl: 1000 * 60 * 5, // Time to live: 5 minutes
});

// Initialize rate limit counters
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

/**
 * Rate limiting middleware
 */
export function rateLimit(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const userRateLimit = rateLimits.get(ip);

  if (!userRateLimit || now > userRateLimit.resetTime) {
    // Reset rate limit for this IP
    rateLimits.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return null;
  }

  if (userRateLimit.count >= RATE_LIMIT) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  // Increment request count
  userRateLimit.count += 1;
  return null;
}

/**
 * Cache middleware for search results
 */
export function getCachedResults(query: string, limit: number) {
  const cacheKey = `${query}-${limit}`;
  return searchCache.get(cacheKey);
}

export function cacheResults(query: string, limit: number, results: any) {
  const cacheKey = `${query}-${limit}`;
  searchCache.set(cacheKey, results);
}

/**
 * Clear expired rate limits
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetTime) {
      rateLimits.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW); 