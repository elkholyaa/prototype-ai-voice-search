import { SearchResult } from '@/utils/search';
import fetch from 'node-fetch';

jest.setTimeout(10000);

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
        name: 'Generic house search with features',
        query: 'ابي بيت كبير بالنرجس عندو اربع غرف ومسبح',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            (r.type === 'فيلا' || r.type === 'قصر') &&
            r.district.includes('النرجس') &&
            r.features.some(f => f.includes('4 غرف') || f.includes('٤ غرف')) &&
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'Apartment search with minimal rooms',
        query: 'محتاج شقه بالملقا مافيها كثير غرف بس يكون فيها مطبخ كبير',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' &&
            r.district.includes('الملقا') &&
            r.features.some(f => f.includes('مطبخ'))
          );
        }
      },
      {
        name: 'Palace search with price range',
        query: 'دور لي قصر في النرجس بالرياض سعرو مايزيد عن عشرين الف',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'قصر' &&
            r.district.includes('النرجس') &&
            r.city === 'الرياض' &&
            r.price <= 20000
          );
        }
      },
      {
        name: 'Villa search with multiple features',
        query: 'ابغا فله في الرياض تكون واسعه وعندها حديقه ومسبح ومجلس',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'فيلا' &&
            r.city === 'الرياض' &&
            r.features.some(f => f.includes('حديقة')) &&
            r.features.some(f => f.includes('مسبح')) &&
            r.features.some(f => f.includes('مجلس'))
          );
        }
      },
      {
        name: 'Apartment search with room count',
        query: 'دورولي شقه بجده فيها تلت غرف وحمامين ومطبخ',
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' &&
            r.city === 'جدة' &&
            r.features.some(f => f.includes('3 غرف') || f.includes('٣ غرف')) &&
            r.features.some(f => f.includes('2 حمامات') || f.includes('٢ حمامات')) &&
            r.features.some(f => f.includes('مطبخ'))
          );
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
        console.log(`Results for "${name}":`, results.map((r: SearchResult) => ({
          type: r.type,
          location: r.location,
          features: r.features,
          price: r.price,
          similarityScore: r.similarityScore
        })));
        expect(validate(results)).toBe(true);
      });
    });
  });

  describe('Complex Queries', () => {
    const COMPLEX_CASES = [
      {
        name: 'Multiple property types in district',
        query: 'فيلا او قصر في حي الملقا في الرياض مع مسبح', // Villa or palace in Al Malqa, Riyadh with pool
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            (r.type === 'فيلا' || r.type === 'قصر') &&
            r.district.includes('الملقا') &&
            r.city === 'الرياض' &&
            r.features.some(f => f.includes('مسبح'))
          );
        }
      },
      {
        name: 'Property with multiple rooms',
        query: 'شقة في حي الياسمين في الرياض ٣ غرف', // 3-bedroom apartment in Al Yasmin, Riyadh
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' &&
            r.district.includes('الياسمين') &&
            r.city === 'الرياض' &&
            r.features.some(f => f.includes('3 غرف') || f.includes('٣ غرف'))
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
        console.log(`Results for "${name}":`, results.map((r: SearchResult) => ({
          type: r.type,
          location: r.location,
          features: r.features,
          similarityScore: r.similarityScore
        })));
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

  describe('Price-Based Searches', () => {
    const PRICE_CASES = [
      {
        name: 'Price range search',
        query: 'شقة في حي الملقا في الرياض سعر من مليون الى مليونين', // Apartment in Malqa, Riyadh price 1M to 2M
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'شقة' &&
            r.district.includes('الملقا') &&
            r.city === 'الرياض' &&
            r.price >= 1000000 &&
            r.price <= 2000000
          );
        }
      },
      {
        name: 'Maximum price with different expressions',
        query: 'فيلا في حي النرجس في الرياض ما يتجاوز ٣ مليون', // Villa in Narjis, Riyadh not exceeding 3M
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'فيلا' &&
            r.district.includes('النرجس') &&
            r.city === 'الرياض' &&
            r.price <= 3000000
          );
        }
      },
      {
        name: 'Cheap properties sorted by price',
        query: 'شقة رخيصة في حي الياسمين في الرياض', // Cheap apartment in Yasmin, Riyadh
        validate: (results: SearchResult[]) => {
          // Check if results are sorted by price ascending
          return results.every(r => 
            r.type === 'شقة' &&
            r.district.includes('الياسمين') &&
            r.city === 'الرياض'
          ) && 
          results.every((r, i) => 
            i === 0 || r.price >= results[i-1].price
          );
        }
      },
      {
        name: 'Reasonable price (around average)',
        query: 'فيلا سعر معقول في حي النرجس في الرياض', // Villa with reasonable price in Narjis, Riyadh
        validate: (results: SearchResult[]) => {
          // For POC: Consider "reasonable" as between 2K and 142K based on our data
          const MIN_REASONABLE = 2000;
          const MAX_REASONABLE = 142000;
          
          return results.length > 0 && // Should return some results
            results.length <= 10 && // Not too many results
            results.every(r => 
              r.type === 'فيلا' &&
              r.district.includes('النرجس') &&
              r.city === 'الرياض' &&
              r.price >= MIN_REASONABLE &&
              r.price <= MAX_REASONABLE
            );
        }
      },
      {
        name: 'Maximum price alternative expression',
        query: 'فيلا في حي النرجس في الرياض سعر مو اكثر من ٣ مليون', // Villa in Narjis, Riyadh price not more than 3M
        validate: (results: SearchResult[]) => {
          return results.every(r => 
            r.type === 'فيلا' &&
            r.district.includes('النرجس') &&
            r.city === 'الرياض' &&
            r.price <= 3000000
          );
        }
      }
    ];

    PRICE_CASES.forEach(({ name, query, validate }) => {
      it(name, async () => {
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        expect(response.ok).toBe(true);
        const { results } = await response.json();
        console.log(`Results for "${name}":`, results.map((r: SearchResult) => ({
          type: r.type,
          location: r.location,
          price: r.price,
          similarityScore: r.similarityScore
        })));
        expect(validate(results)).toBe(true);
      });
    });
  });
});