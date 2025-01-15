/// <reference types="jest" />
import { Property } from '../../types';
import { filterProperties, searchProperties } from '../propertySearch';

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'فيلا فاخرة في حي النرجس',
    location: 'الرياض، حي النرجس',
    type: 'فيلا',
    price: 2500000,
    features: ['مسبح', 'حديقة خاصة', 'مصعد'],
    images: ['image1.jpg']
  },
  {
    id: '2',
    title: 'شقة حديثة في جدة',
    location: 'جدة، شارع الأمير سلطان',
    type: 'شقة',
    price: 1200000,
    features: ['مطبخ مجهز', 'موقف خاص'],
    images: ['image2.jpg']
  }
];

describe('Property Search', () => {
  describe('filterProperties', () => {
    test('filters by type', () => {
      const result = filterProperties(mockProperties, { type: 'فيلا' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters by location', () => {
      const result = filterProperties(mockProperties, { location: 'الرياض' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters by features', () => {
      const result = filterProperties(mockProperties, { features: ['مسبح', 'حديقة خاصة'] });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters by price range', () => {
      const result = filterProperties(mockProperties, { 
        price: { min: 2000000, max: 3000000 } 
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('combines multiple filters', () => {
      const result = filterProperties(mockProperties, {
        type: 'فيلا',
        location: 'الرياض',
        features: ['مسبح'],
        price: { max: 3000000 }
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('searchProperties', () => {
    test('performs traditional search', () => {
      const result = searchProperties(mockProperties, 'فيلا', false);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('performs NLP search', () => {
      const result = searchProperties(
        mockProperties,
        'أريد فيلا في الرياض مع مسبح وحديقة خاصة',
        true
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('returns all properties for empty search', () => {
      const result = searchProperties(mockProperties, '', true);
      expect(result).toHaveLength(2);
    });
  });
}); 