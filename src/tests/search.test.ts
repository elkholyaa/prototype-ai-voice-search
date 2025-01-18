import { Property } from '@/types';
import { SearchResult } from '@/app/api/search/route';

const TEST_CASES = [
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
  },
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
  },
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

async function runTests() {
  console.log('Starting search API tests...\n');
  
  for (const test of TEST_CASES) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Query: "${test.query}"`);
      
      const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: test.query })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${await response.text()}`);
      }

      const { results } = await response.json();
      const isValid = test.validate(results);
      
      console.log(`Results: ${results.length} properties found`);
      console.log(`Validation: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (!isValid) {
        console.log('First few results:', JSON.stringify(results.slice(0, 3), null, 2));
      }
    } catch (error) {
      console.error(`❌ Test failed with error:`, error);
    }
    console.log('\n---\n');
  }
}

runTests().catch(console.error); 