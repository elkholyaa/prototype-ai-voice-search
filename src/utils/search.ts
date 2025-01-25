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
  type?: string[];
  city?: string;
  districts?: string[];
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
    'النرجس': ['النرجس', 'حي النرجس', 'نرجس'],
    'الملقا': ['الملقا', 'حي الملقا', 'ملقا'],
    'الياسمين': ['الياسمين', 'حي الياسمين', 'ياسمين'],
    'الورود': ['الورود', 'حي الورود', 'ورود']
  };

  // Feature variations - keeping all existing variations
  const featureVariations = {
    'مسبح': ['مسبح', 'حوض سباحة', 'حمام سباحة', 'حوض سباحه', 'حمام سباحه'],
    'مجلس': ['مجلس', 'مجالس', 'صالة استقبال', 'صاله استقبال', 'مجلس كبير', 'مجلس للعايله', 'مجلس عائلي', 'مجلس واسع'],
    'مصعد': ['مصعد', 'اسانسير', 'ليفت', 'مصعد كهربائي'],
    'مدخلين': ['مدخلين', 'بابين', 'مدخل رئيسي ومدخل خدمة', 'مدخل رجال ومدخل نساء'],
    'حديقة': ['حديقة', 'حديقه', 'جنينة'],
    '6 غرف': ['6 غرف', '٦ غرف', 'ست غرف', 'ستة غرف', '6 غرف نوم', '٦ غرف نوم', 'ست غرف نوم', 'ستة غرف نوم'],
    '4 غرف': ['4 غرف', '٤ غرف', 'اربع غرف', 'اربعة غرف', '4 غرف نوم', '٤ غرف نوم', 'اربع غرف نوم', 'اربعة غرف نوم']
  };

  // Extract property types - now handles luxury homes as villa only
  if (normalizedQuery.includes('بيوت فخمه') || normalizedQuery.includes('بيوت فخمة')) {
    criteria.type = ['فيلا'];
  } else {
    for (const [type, variations] of Object.entries(typeVariations)) {
      if (variations.some(v => normalizedQuery.includes(v))) {
        criteria.type = [type];
        break;
      }
    }
  }

  // Extract city
  for (const [city, variations] of Object.entries(cityVariations)) {
    if (variations.some(v => normalizedQuery.includes(v))) {
      criteria.city = city;
      break;
    }
  }

  // Extract districts - now handles multiple with 'او' (or)
  const districts = Object.entries(districtVariations)
    .filter(([_, variations]) => 
      variations.some(v => normalizedQuery.includes(v))
    )
    .map(([district, _]) => district);

  if (districts.length > 0) {
    criteria.districts = districts;
  }

  // Extract features - now handles all variations
  criteria.features = Object.entries(featureVariations)
    .filter(([_, variations]) => 
      variations.some(v => normalizedQuery.includes(v))
    )
    .map(([feature, _]) => feature);

  // Price patterns
  const pricePatterns = [
    {
      pattern: /ما تطلع فوق ([٠-٩\d]+)(?:\s*مليون\s*ونص|\s*مليون\s*ونصف)/,
      multiplier: 1000000,
      addHalf: true
    },
    {
      pattern: /ما تطلع فوق ([٠-٩\d]+)(?:\s*مليون|\s*م)/,
      multiplier: 1000000,
      addHalf: false
    },
    {
      pattern: /([٠-٩\d]+(?:\\.\\d+)?)(?:\s*مليون\s*ونص|\s*مليون\s*ونصف)/,
      multiplier: 1000000,
      addHalf: true
    },
    {
      pattern: /([٠-٩\d]+(?:\\.\\d+)?)(?:\s*مليون|\s*م)/,
      multiplier: 1000000,
      addHalf: false
    }
  ];

  // Extract price
  console.log('Searching for price in query:', normalizedQuery);
  for (const { pattern, multiplier, addHalf } of pricePatterns) {
    const match = normalizedQuery.match(pattern);
    if (match) {
      console.log('Price match found:', { pattern: pattern.toString(), matched: match[0], number: match[1], multiplier, addHalf });
      
      // Convert Arabic numerals to English
      const number = match[1].replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
      const baseNumber = parseFloat(number);
      console.log('Number conversion:', { original: match[1], converted: number, baseNumber });

      // Calculate final price
      let finalPrice = baseNumber * multiplier;
      if (addHalf) {
        finalPrice += 0.5 * multiplier;
      }
      console.log('Price calculation:', { baseNumber, multiplier, addHalf, finalPrice });

      criteria.maxPrice = finalPrice;
      console.log('Set maxPrice to:', criteria.maxPrice);
      break;
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

  // Extract search criteria
  const criteria = extractSearchCriteria(query);
  console.log('Search criteria:', criteria);

  let filtered = properties.filter(property => {
    // Type check
    if (criteria.type?.length && !criteria.type.includes(property.type)) {
      console.log('Filtered out by type:', property.type);
      return false;
    }

    // City check
    if (criteria.city && property.city !== criteria.city) {
      console.log('Filtered out by city:', property.city);
      return false;
    }

    // District check
    if (criteria.districts?.length && !criteria.districts.includes(property.district)) {
      console.log('Filtered out by district:', property.district);
      return false;
    }

    // Features check
    if (criteria.features?.length) {
      for (const feature of criteria.features) {
        // Special handling for room numbers
        if (feature.includes('غرف')) {
          const roomCount = feature.split(' ')[0];
          const hasExactRooms = property.features.some(f => f.startsWith(roomCount));
          if (!hasExactRooms) {
            console.log('Filtered out by room count:', feature);
            return false;
          }
        } else {
          const hasFeature = property.features.some(f => f.includes(feature));
          if (!hasFeature) {
            console.log('Filtered out by missing feature:', feature);
            return false;
          }
        }
      }
    }

    // Price check
    if (criteria.maxPrice && property.price > criteria.maxPrice) {
      console.log(`Filtered out by price: ${property.price} > ${criteria.maxPrice}`);
      return false;
    }

    return true;
  });

  console.log('Filtered results count: ' + filtered.length);
  console.log('First few results: ' + JSON.stringify(filtered.map(p => ({
    price: p.price,
    district: p.district,
    type: p.type,
    features: p.features
  })), null, 2));

  return filtered.map(property => ({
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
      error: 'حدث خطأ في البحث. الرجاء المحاولة مرة أخرى.',
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

// Test both queries
const queries = [
  'ودني اشوف بيوت فخمه بالنرجس بشرت تكون نضيفه وفيها حوض سباحه ومجلس كبير للعايله وما تطلع فوق 3 مليون ونص وست غرف وحديقه',
  'ابي فله في النرجس، يكون عندها مسبح ومجلس واسع وما يزيد سعرها عن ٣ مليون ونص و٦ غرف وحديقه'
];

console.log('\n=== TESTING BOTH QUERIES ===');
for (const query of queries) {
  console.log('\nQuery:', query);
  const results = searchProperties(query);
  console.log('Total results:', results.length);
  
  // Count results with 6 rooms
  const sixRoomResults = results.filter(r => r.features.includes('6 غرف'));
  console.log('Results with 6 rooms:', sixRoomResults.length);
  
  // Count results under 3.5M
  const underPriceResults = results.filter(r => r.price <= 3500000);
  console.log('Results under 3.5M:', underPriceResults.length);
  
  // Count results meeting both conditions
  const matchingResults = results.filter(r => 
    r.features.includes('6 غرف') && 
    r.price <= 3500000 &&
    r.features.includes('حديقة')
  );
  console.log('Results meeting all conditions:', matchingResults.length);
  
  // Log matching properties
  console.log('\nMatching properties:');
  matchingResults.forEach(p => {
    console.log(`- Price: ${p.price.toLocaleString()} SAR`);
    console.log(`  Features: ${p.features.join(', ')}`);
    console.log('---');
  });
}