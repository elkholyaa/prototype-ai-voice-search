/**
 * Test suite for property search functionality.
 * Uses Jest testing framework with TypeScript.
 * 
 * Key testing concepts demonstrated:
 * - Unit testing of search and filter functions
 * - Test organization using describe blocks
 * - Mock data setup
 * - Testing different search scenarios
 */

import { Property } from '@/types';
import { filterProperties, searchProperties } from '@/utils/propertySearch';

// Mock property data for testing
// In real tests, we often use mock data instead of real data to:
// 1. Make tests predictable
// 2. Avoid external dependencies
// 3. Focus on specific test scenarios
const mockProperties: Property[] = [
  {
    id: 1,
    title: 'فيلا فاخرة في حي الروابي',
    location: 'الرياض، حي الروابي',
    type: 'فيلا',
    price: 2500000,
    features: ['مسبح', 'حديقة خاصة', 'مصعد'],
    images: ['image1.jpg']
  },
  {
    id: 2,
    title: 'شقة حديثة في جدة',
    location: 'جدة، شارع الأمير سلطان',
    type: 'شقة',
    price: 1200000,
    features: ['مطبخ مجهز', 'موقف خاص'],
    images: ['image2.jpg']
  }
];

// Main test suite
describe('Property Search', () => {
  // Group related tests using describe blocks
  describe('filterProperties', () => {
    // Test filtering by single property type
    test('filters by type', () => {
      const result = filterProperties(mockProperties, { type: 'فيلا' });
      // expect() is used for assertions
      expect(result).toHaveLength(1);  // Check array length
      expect(result[0].id).toBe(1);    // Check specific property
    });

    // Test filtering by location
    test('filters by location', () => {
      const result = filterProperties(mockProperties, { location: 'الرياض' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test filtering by multiple features
    test('filters by features', () => {
      const result = filterProperties(mockProperties, { features: ['مسبح', 'حديقة خاصة'] });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test filtering by price range
    test('filters by price range', () => {
      const result = filterProperties(mockProperties, { 
        price: { min: 2000000, max: 3000000 } 
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test combining multiple filter criteria
    test('combines multiple filters', () => {
      const result = filterProperties(mockProperties, {
        type: 'فيلا',
        location: 'الرياض',
        features: ['مسبح'],
        price: { max: 3000000 }
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  // Test suite for search functionality
  describe('searchProperties', () => {
    // Test basic text search without NLP
    test('performs traditional search', () => {
      const result = searchProperties(mockProperties, 'فيلا', false);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test NLP-based search with natural language query
    test('performs NLP search', () => {
      const result = searchProperties(
        mockProperties,
        'أريد فيلا في الرياض مع مسبح وحديقة خاصة',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test NLP search with compound features
    test('performs NLP search with compound features', () => {
      const result = searchProperties(
        mockProperties,
        'البحث عن فيلا في الرياض مع مسبح و مصعد خاص',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test searching by specific fields
    test('performs traditional search by title', () => {
      const result = searchProperties(mockProperties, 'فيلا فاخرة', false);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test('performs traditional search by location', () => {
      const result = searchProperties(mockProperties, 'شارع الأمير', false);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('performs traditional search by feature', () => {
      const result = searchProperties(mockProperties, 'مطبخ مجهز', false);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    // Test NLP search with price information
    test('performs NLP search with price', () => {
      const result = searchProperties(
        mockProperties,
        'فيلا في الرياض سعر أقل من 3 مليون',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    // Test NLP search with multiple criteria
    test('performs NLP search with multiple fields', () => {
      const result = searchProperties(
        mockProperties,
        'شقة في جدة مع مطبخ مجهز وموقف خاص',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('handles complex natural language query', () => {
      const result = searchProperties(
        mockProperties,
        'أبحث عن فيلا مناسبة للعائلة في حي الروابي بالرياض، أريدها مع مسبح للأطفال وحديقة خاصة، والميزانية ما تتجاوز 3 مليون',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('فيلا');
      expect(result[0].location).toContain('حي الروابي');
      expect(result[0].location).toContain('الرياض');
      expect(result[0].features).toEqual(expect.arrayContaining(['مسبح', 'حديقة خاصة']));
      expect(result[0].price).toBeLessThanOrEqual(3000000);
    });

    // Test edge case: empty search
    test('returns all properties for empty search', () => {
      const result = searchProperties(mockProperties, '', true);
      expect(result).toHaveLength(2);
    });
  });
}); 