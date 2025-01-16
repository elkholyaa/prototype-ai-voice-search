import { processArabicQuery } from '@/utils/arabicNLP';

describe('Arabic NLP Processing', () => {
  it('processes complete query with all fields', () => {
    const input = 'أريد فيلا مع مسبح وحديقة خاصة في الرياض بميزانية تصل إلى 3 مليون';
    const result = processArabicQuery(input);
    
    expect(result.query.type).toBe('فيلا');
    expect(result.query.location).toBe('الرياض');
    expect(result.query.features).toEqual(expect.arrayContaining(['مسبح', 'حديقة خاصة']));
    expect(result.query.price).toEqual({ max: 3000000 });
    expect(result.confidence).toBeGreaterThan(0.75);
  });
  
  it('processes query with missing price', () => {
    const input = 'أبحث عن فيلا في الرياض مع مسبح';
    const result = processArabicQuery(input);
    
    expect(result.query).toEqual({
      type: 'فيلا',
      location: 'الرياض',
      features: ['مسبح'],
      price: {}
    });
    expect(result.confidence).toBe(0.75);
  });
  
  it('processes query with only location and type', () => {
    const input = 'شقة في جدة';
    const result = processArabicQuery(input);
    
    expect(result.query).toEqual({
      type: 'شقة',
      location: 'جدة',
      features: [],
      price: {}
    });
    expect(result.confidence).toBe(0.5);
  });
  
  it('extracts minimum price correctly', () => {
    const input = 'فيلا في الرياض فوق 2 مليون';
    const result = processArabicQuery(input);
    
    expect(result.query.price).toEqual({ min: 2000000 });
  });
  
  it('extracts maximum price correctly', () => {
    const input = 'فيلا في الرياض أقل من 4 مليون';
    const result = processArabicQuery(input);
    
    expect(result.query.price).toEqual({ max: 4000000 });
  });
}); 