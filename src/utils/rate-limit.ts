import { LRUCache } from 'lru-cache';

export interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export interface RateLimiter {
  check: (limit: number, token: string) => Promise<void>;
}

export function rateLimit(options: RateLimitOptions): RateLimiter {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const timestamps = tokenCache.get(token) || [];
      const validTimestamps = timestamps.filter(ts => now - ts < options.interval);

      if (validTimestamps.length >= limit) {
        throw new Error('Rate limit exceeded');
      }

      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps);
    },
  };
} 