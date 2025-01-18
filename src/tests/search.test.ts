import { SearchResult } from '@/utils/search';
import fetch from 'node-fetch';

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('Search API Validation', () => {
  describe('Simple Searches', () => {
    const SIMPLE_CASES = [
      {
        name: 'Empty query returns all properties',
        query: '',
        validate: (results: SearchResult[]) => {
          return results.length > 0;
        }
      },
      {
        name: 'Basic property type search with spelling mistake',
        query: 'فللا', // Common spelling mistake for فيلا
        validate: (results: SearchResult[]) => {
          // Should still find villas despite the spelling mistake
          return results.some(r => r.type === 'فيلا');
        }
      }
    ];

    SIMPLE_CASES.forEach(({ name, query, validate }) => {
      it(name, async () => {
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        expect(response.ok).toBe(true);
        const { results } = await response.json();
        expect(validate(results)).toBe(true);
      });
    });
  });

  describe('Natural Language Searches', () => {
    const NATURAL_CASES = [
      {
        name: 'Colloquial property search',
        query: 'ابي فيلا فيها مسبح',  // Colloquial way of saying "I want a villa with a pool"
        validate: (results: SearchResult[]) => {
          // Should find villas with pools, ranked by relevance
          return results.some(r => 
            r.type === 'فيلا' && 
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'Search with spelling variations',
        query: 'شقه في حي النرجس معاها مسباح', // Multiple common variations/mistakes
        validate: (results: SearchResult[]) => {
          // Should still find relevant apartments despite spelling variations
          return results.some(r => 
            r.type === 'شقة' && 
            r.district.includes('النرجس') &&
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'Natural price description',
        query: 'دور شي رخيص في الرياض', // Looking for something cheap in Riyadh
        validate: (results: SearchResult[]) => {
          // Should return properties in Riyadh, likely sorted by price
          return results.some(r => r.city === 'الرياض');
        }
      }
    ];

    NATURAL_CASES.forEach(({ name, query, validate }) => {
      it(name, async () => {
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        expect(response.ok).toBe(true);
        const { results } = await response.json();
        expect(validate(results)).toBe(true);
      });
    });
  });

  describe('Complex Queries', () => {
    const COMPLEX_CASES = [
      {
        name: 'Mixed dialect query',
        query: 'ابغى فيلا او قصر في الرياض بس مو غالي مره', // Mix of formal and informal Arabic
        validate: (results: SearchResult[]) => {
          return results.some(r => 
            (r.type === 'فيلا' || r.type === 'قصر') &&
            r.city === 'الرياض'
          );
        }
      },
      {
        name: 'Feature description variations',
        query: 'شقة كبيرة مع حوض سباحة حلو في حي الياسمين', // Different ways to describe features
        validate: (results: SearchResult[]) => {
          return results.some(r => 
            r.type === 'شقة' &&
            r.district.includes('الياسمين') &&
            r.features.some(f => f.includes('مسبح'))
          );
        }
      }
    ];

    COMPLEX_CASES.forEach(({ name, query, validate }) => {
      it(name, async () => {
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        expect(response.ok).toBe(true);
        const { results } = await response.json();
        expect(validate(results)).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid requests gracefully', async () => {
      const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Missing query
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });
});