import { Property } from '@/types';
import { properties } from '@/data/properties';

export interface SearchResult extends Property {
  similarityScore: number;
}

export function searchProperties(query: string): SearchResult[] {
  // Helper function to format location as "city، حي district"
  const formatLocation = (location: string) => {
    const parts = location?.split('،') || [];
    const city = parts[0]?.trim() || 'غير محدد';
    const district = parts[1]?.trim().replace('حي ', '') || 'غير محدد';
    return `${city}، حي ${district}`;
  };

  // Empty query: return all properties
  if (!query.trim()) {
    return properties.map(p => ({
      ...p,
      similarityScore: 1,
      location: formatLocation(p.location),
      features: p.features || [],
      images: p.images || [],
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  return properties
    .map(property => {
      let score = 0;
      if (property.title?.toLowerCase().includes(normalizedQuery)) score += 0.5;
      if (property.type?.toLowerCase().includes(normalizedQuery)) score += 0.3;
      if (property.location?.toLowerCase().includes(normalizedQuery)) score += 0.3;
      if (property.features?.some(f => f?.toLowerCase().includes(normalizedQuery))) score += 0.2;
      
      return {
        ...property,
        similarityScore: score,
        location: formatLocation(property.location),
        features: property.features || [],
        images: property.images || [],
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