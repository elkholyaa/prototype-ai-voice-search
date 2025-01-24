import { Property, PropertyType } from '@/types';
import { properties } from '@/data/properties';

export interface SearchResult {
  type: PropertyType;
  features: string[];
  price: number;
  similarityScore: number;
  district: string;
  city: string;
  images?: string[];
}

interface PropertyCriteria {
  type?: string;
  city?: string;
  district?: string;
  features?: string[];
  maxPrice?: number;
}

function extractSearchCriteria(query: string): PropertyCriteria {
  const normalizedQuery = query.toLowerCase().trim();
  const criteria: PropertyCriteria = {};

  // Property Type variations - keeping all existing variations
  const typeVariations = {
    'فيلا': ['فيلا', 'فله', 'فلة', 'فيلة', 'فلل', 'بيت'],
    'شقة': ['شقة', 'شقه', 'شقق', 'شقت'],
    'دوبلكس': ['دوبلكس', 'دوبلكسات', 'دبلكس', 'دبلكسات'],
    'قصر': ['قصر', 'قصور', 'قصور', 'قصر']
  };

  // City variations
  const cityVariations = {
    'الرياض': ['الرياض', 'رياض'],
    'جدة': ['جدة', 'جده', 'جدة'],
    'مكة': ['مكة', 'مكه', 'مكة المكرمة'],
    'الدمام': ['الدمام', 'دمام']
  };

  // District variations
  const districtVariations = {
    'النرجس': ['النرجس', 'حي النرجس'],
    'الملقا': ['الملقا', 'حي الملقا'],
    'الياسمين': ['الياسمين', 'حي الياسمين'],
    'الورود': ['الورود', 'حي الورود']
  };

  // Feature variations - keeping all existing variations
  const featureVariations = {
    'مسبح': ['مسبح', 'حوض سباحة', 'حمام سباحة'],
    'مجلس': ['مجلس', 'مجالس', 'صالة استقبال'],
    'مصعد': ['مصعد', 'اسانسير', 'ليفت'],
    'حديقة': ['حديقة', 'حديقه', 'جنينة']
  };

  // Extract property type from query
  for (const [type, variations] of Object.entries(typeVariations)) {
    if (variations.some(v => normalizedQuery.includes(v))) {
      criteria.type = type;
      break;
    }
  }

  // Extract city
  for (const [city, variations] of Object.entries(cityVariations)) {
    if (variations.some(v => normalizedQuery.includes(v))) {
      criteria.city = city;
      break;
    }
  }

  // Extract district
  for (const [district, variations] of Object.entries(districtVariations)) {
    if (variations.some(v => normalizedQuery.includes(v))) {
      criteria.district = district;
      break;
    }
  }

  // Extract features
  criteria.features = Object.entries(featureVariations)
    .filter(([_, variations]) => 
      variations.some(v => normalizedQuery.includes(v))
    )
    .map(([feature, _]) => feature);

  // Extract price if mentioned (looking for numbers followed by variations of million)
  const priceMatch = normalizedQuery.match(/(\d+(\.\d+)?)\s*(مليون|م)/);
  if (priceMatch) {
    const price = parseFloat(priceMatch[1]);
    if (!isNaN(price)) {
      criteria.maxPrice = price * 1000000; // Convert to actual number
    }
  }

  console.log('Extracted criteria:', criteria);
  return criteria;
}

export function searchProperties(query: string): SearchResult[] {
  // Handle empty query case - Return all properties directly
  if (!query.trim()) {
    return properties.map(property => ({
      type: property.type,
      features: property.features,
      price: property.price,
      similarityScore: 1,
      district: property.district,
      city: property.city,
      images: property.images || []
    }));
  }

  // Only extract search criteria if we have a query
  const criteria = extractSearchCriteria(query);
  console.log('Extracted criteria:', criteria);

  return properties
    .filter(property => {
      // Type check
      if (criteria.type && property.type !== criteria.type) return false;

      // City check
      if (criteria.city && property.city !== criteria.city) return false;

      // District check
      if (criteria.district && property.district !== criteria.district) return false;

      // Features check - must have ALL requested features
      if (criteria.features?.length) {
        for (const feature of criteria.features) {
          const hasFeature = property.features.some(f => f.includes(feature));
          if (!hasFeature) return false;
        }
      }

      // Price check
      if (criteria.maxPrice && property.price > criteria.maxPrice) return false;

      return true;
    })
    .map(property => ({
      type: property.type,
      features: property.features,
      price: property.price,
      similarityScore: 1,
      district: property.district,
      city: property.city,
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

// Debug logging for available properties
console.log('Available properties:', properties.map(p => ({
  type: p.type,
  district: p.district,
  features: p.features,
  price: p.price
})));