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

  // Handle empty query case - IMPORTANT: Return all properties when no search criteria
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

  // Extract search criteria with variations and synonyms
  const isVilla = ['فيلا', 'فله', 'فلة', 'فيلة', 'فلل'].some(v => normalizedQuery.includes(v));
  const inNarjis = ['النرجس', 'نرجس', 'الترجس'].some(v => normalizedQuery.includes(v));
  const inYasmin = ['الياسمين', 'ياسمين', 'الياسمبن'].some(v => normalizedQuery.includes(v));

  // Pool synonyms
  const poolTerms = ['مسبح', 'حمام سباحة', 'حمام السباحة'];
  const wantsPool = poolTerms.some(term => normalizedQuery.includes(term));

  // Majlis variations
  const majlisTerms = ['مجلس', 'مجالس'];
  const wantsMajlis = majlisTerms.some(term => normalizedQuery.includes(term));

  const maxPrice = 3500000; // 3.5M SAR

  // Debug log to help track search criteria
  console.log('Search criteria:', { isVilla, inNarjis, inYasmin, wantsPool, wantsMajlis, maxPrice });

  return properties
    .filter(property => {
      // Check property type - only if villa is specifically requested
      if (isVilla && property.type !== 'فيلا') return false;

      // Fixed location check - property must be in one of the requested locations
      // Previous logic was wrong as it used OR condition incorrectly
      const isInRequestedLocation = 
        (inNarjis && property.location.includes('النرجس')) || 
        (inYasmin && property.location.includes('الياسمين'));
      if ((inNarjis || inYasmin) && !isInRequestedLocation) return false;

      // Pool check - match any pool term
      const hasPool = property.features.some(f => 
          poolTerms.some(term => f.includes(term))
      );
      if (wantsPool && !hasPool) return false;

      // Majlis check - match any majlis term
      const hasMajlis = property.features.some(f => 
          majlisTerms.some(term => f.includes(term))
      );
      if (wantsMajlis && !hasMajlis) return false;

      // Price must be within budget
      if (property.price > maxPrice) return false;

      return true;
    })
    .map(property => ({
      type: property.type,
      features: property.features,
      price: property.price,
      similarityScore: 1, // Keeping this for interface compatibility
      district: parseLocation(property.location).district,
      city: parseLocation(property.location).city,
      location: formatLocation(property.location),
      images: property.images || []
    }));
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