// src/utils/search.ts
import { Property, PropertyType } from '@/types';
import { properties } from '@/data/properties';

export interface SearchResult extends Property {
  similarityScore: number;
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

  // Extract property types (with variations)
  const typeVariations = {
    'فيلا': ['فيلا', 'فله', 'فلة', 'فيلة', 'فلل', 'بيت'],
    'شقة': ['شقة', 'شقه', 'شقق', 'شقت'],
    'دوبلكس': ['دوبلكس', 'دوبلكسات', 'دبلكس', 'دبلكسات'],
    'قصر': ['قصر', 'قصور']
  };

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

  // Extract city variations
  const cityVariations = {
    'الرياض': ['الرياض', 'رياض'],
    'جدة': ['جدة', 'جده'],
    'مكة': ['مكة', 'مكه', 'مكة المكرمة'],
    'الدمام': ['الدمام', 'دمام']
  };

  for (const [city, variations] of Object.entries(cityVariations)) {
    if (variations.some(v => normalizedQuery.includes(v))) {
      criteria.city = city;
      break;
    }
  }

  // Extract district variations
  const districtVariations = {
    'النرجس': ['النرجس', 'حي النرجس', 'نرجس'],
    'الملقا': ['الملقا', 'حي الملقا', 'ملقا'],
    'الياسمين': ['الياسمين', 'حي الياسمين', 'ياسمين'],
    'الورود': ['الورود', 'حي الورود', 'ورود']
  };

  const districts = Object.entries(districtVariations)
    .filter(([_, variations]) => variations.some(v => normalizedQuery.includes(v)))
    .map(([district]) => district);

  if (districts.length > 0) {
    criteria.districts = districts;
  }

  // Extract feature variations
  const featureVariations = {
    'مسبح': ['مسبح', 'حوض سباحة', 'حمام سباحة', 'حوض سباحه', 'حمام سباحه'],
    'مجلس': ['مجلس', 'مجالس', 'صالة استقبال', 'صاله استقبال', 'مجلس كبير', 'مجلس للعايله', 'مجلس عائلي', 'مجلس واسع'],
    'مصعد': ['مصعد', 'اسانسير', 'ليفت', 'مصعد كهربائي'],
    'مدخلين': ['مدخلين', 'بابين', 'مدخل رئيسي ومدخل خدمة', 'مدخل رجال ومدخل نساء'],
    'حديقة': ['حديقة', 'حديقه', 'جنينة'],
    '6 غرف': ['6 غرف', '٦ غرف', 'ست غرف', 'ستة غرف', '6 غرف نوم', '٦ غرف نوم', 'ست غرف نوم', 'ستة غرف نوم'],
    '4 غرف': ['4 غرف', '٤ غرف', 'اربع غرف', 'اربعة غرف', '4 غرف نوم', '٤ غرف نوم', 'اربع غرف نوم', 'اربعة غرف نوم']
  };

  criteria.features = Object.entries(featureVariations)
    .filter(([_, variations]) => variations.some(v => normalizedQuery.includes(v)))
    .map(([feature]) => feature);

  // Price extraction
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
      pattern: /([٠-٩\d]+(?:\.\d+)?)(?:\s*مليون\s*ونص|\s*مليون\s*ونصف)/,
      multiplier: 1000000,
      addHalf: true
    },
    {
      pattern: /([٠-٩\d]+(?:\.\d+)?)(?:\s*مليون|\s*م)/,
      multiplier: 1000000,
      addHalf: false
    }
  ];

  for (const { pattern, multiplier, addHalf } of pricePatterns) {
    const match = normalizedQuery.match(pattern);
    if (match) {
      // Convert Arabic numerals to English digits
      const number = match[1].replace(/[٠-٩]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1632 + 48)
      );
      const baseNumber = parseFloat(number);
      let finalPrice = baseNumber * multiplier;
      if (addHalf) {
        finalPrice += 0.5 * multiplier;
      }
      criteria.maxPrice = finalPrice;
      break;
    }
  }

  return criteria;
}

export function searchProperties(query: string): SearchResult[] {
  // If query is empty, return all properties (with full fields)
  if (!query.trim()) {
    return properties.map((property) => ({
      id: property.id.toString(),
      title: property.title,
      description: property.description,
      type: property.type,
      features: property.features,
      price: property.price,
      district: property.district,
      city: property.city,
      images: property.images || [],
      similarityScore: 1,
    }));
  }

  const criteria = extractSearchCriteria(query);

  const filtered = properties.filter((property) => {
    if (criteria.type && !criteria.type.includes(property.type)) {
      return false;
    }
    if (criteria.city && property.city !== criteria.city) {
      return false;
    }
    if (
      criteria.districts &&
      criteria.districts.length > 0 &&
      !criteria.districts.includes(property.district)
    ) {
      return false;
    }
    if (criteria.features && criteria.features.length > 0) {
      for (const feature of criteria.features) {
        if (feature.includes('غرف')) {
          const roomCount = feature.split(' ')[0];
          const hasExactRooms = property.features.some((f) =>
            f.startsWith(roomCount)
          );
          if (!hasExactRooms) {
            return false;
          }
        } else {
          if (!property.features.some((f) => f.includes(feature))) {
            return false;
          }
        }
      }
    }
    if (criteria.maxPrice && property.price > criteria.maxPrice) {
      return false;
    }
    return true;
  });

  return filtered.map((property) => ({
    id: property.id.toString(),
    title: property.title,
    description: property.description,
    type: property.type,
    features: property.features,
    price: property.price,
    district: property.district,
    city: property.city,
    images: property.images || [],
    similarityScore: 1,
  }));
}
