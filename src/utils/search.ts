import { Property, PropertyType } from '@/types';
import { properties } from '@/data/properties';

export interface SearchResult {
  type: PropertyType;
  features: string[];
  price: number;
  similarityScore: number;
  district: string;
  city: string;
  location: string;
  images?: string[];
}

export function searchProperties(query: string): SearchResult[] {
  // Helper function to format location as "city، حي district"
  const formatLocation = (location: string) => {
    const parts = location?.split('،') || [];
    const city = parts[0]?.trim() || 'غير محدد';
    const district = parts[1]?.trim().replace('حي ', '') || 'غير محدد';
    return `${city}، حي ${district}`;
  };

  // Helper function to parse location into city and district
  const parseLocation = (location: string): { city: string; district: string } => {
    const parts = location?.split('،') || [];
    return {
      city: parts[0]?.trim() || 'غير محدد',
      district: parts[1]?.trim().replace('حي ', '') || 'غير محدد'
    };
  };

  // Empty query: return all properties
  if (!query.trim()) {
    return properties.map(p => ({
      type: p.type,
      features: p.features || [],
      price: Number(p.price),
      similarityScore: 1,
      district: parseLocation(p.location).district,
      city: parseLocation(p.location).city,
      location: formatLocation(p.location),
      images: p.images || []
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Enhanced scoring for feature combinations
  return properties
    .map(property => {
      let score = 0;
      const { city, district } = parseLocation(property.location);

      // Type matching
      if (normalizedQuery.includes('فيلا') && property.type === 'فيلا') score += 0.5;
      
      // Location matching
      if (property.location.includes('النرجس') || property.location.includes('الياسمين')) score += 0.3;
      
      // Feature combination matching
      const hasPool = property.features.some(f => f.includes('مسبح'));
      const hasMajlis = property.features.some(f => f.includes('مجلس'));
      
      if (normalizedQuery.includes('مسبح') && hasPool) score += 0.3;
      if (normalizedQuery.includes('مجلس') && hasMajlis) score += 0.3;
      
      // Bonus for having both requested features
      if (normalizedQuery.includes('مسبح') && normalizedQuery.includes('مجلس') && hasPool && hasMajlis) {
        score += 0.2; // Bonus for matching combination
      }

      return {
        type: property.type,
        features: property.features || [],
        price: Number(property.price),
        similarityScore: score,
        district,
        city,
        location: formatLocation(property.location),
        images: property.images || []
      };
    })
    .filter(result => result.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * Server-side function to handle search requests
 * This can be used in API routes or server components
 */
export async function handleSearchRequest(
  query: string,
  limit?: number
): Promise<{ results: SearchResult[]; error?: string }> {
  try {
    const results = searchProperties(query);
    return { results };
  } catch (error) {
    console.error('Search error:', error);
    return {
      results: [],
      error: 'Failed to process search request. Please try again.',
    };
  }
}

// First, let's examine the available properties
console.log('Available properties:', properties.map(p => ({
  type: p.type,
  district: p.location.split('،')[1]?.trim().replace('حي ', ''),
  features: p.features,
  price: p.price
}))); 