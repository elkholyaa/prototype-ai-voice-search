import { SearchResult } from '@/utils/search';

describe('Search API Validation', () => {
  describe('Simple Searches', () => {
    const SIMPLE_CASES = [
      {
        name: 'Empty query returns all properties',
        query: '',
        validate: (results: SearchResult[]) => {
          return results.length > 0 && results.every(r => r.similarityScore === 1);
        }
      },
      {
        name: 'Basic property type search',
        query: 'فيلا',
        validate: (results: SearchResult[]) => {
          return results.every(r => r.type === 'فيلا');
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

  describe('Moderate Searches', () => {
    const MODERATE_CASES = [
      {
        name: 'Cheap property search with sorting',
        query: 'فيلا رخيصة',
        validate: (results: SearchResult[]) => {
          return results.every(r => r.type === 'فيلا') && 
                 results.every((r, i) => i === 0 || results[i-1].price <= r.price);
        }
      },
      {
        name: 'Property with feature search',
        query: 'فيلا مع مسبح',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'فيلا' && 
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'Property with rooms search',
        query: 'شقة ثلاث غرف',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' && 
            r.features.some(f => f.includes('3 غرف'))
          );
        }
      }
    ];

    MODERATE_CASES.forEach(({ name, query, validate }) => {
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

  describe('Complex Searches', () => {
    const COMPLEX_CASES = [
      {
        name: 'Combined location and feature search',
        query: 'شقة في حي النرجس مع مسبح',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' && 
            r.district === 'حي النرجس' &&
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'OR condition with type search',
        query: 'فيلا او قصر في الرياض',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            (r.type === 'فيلا' || r.type === 'قصر') &&
            r.city === 'الرياض'
          );
        }
      },
      {
        name: 'Natural language search with price sorting',
        query: 'ابحث عن ارخص شقة في حي الياسمين مع مسبح',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' &&
            r.district === 'حي الياسمين' &&
            r.features.some(f => f.includes('مسبح'))
          ) &&
          results.every((r, i) => i === 0 || results[i-1].price <= r.price);
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