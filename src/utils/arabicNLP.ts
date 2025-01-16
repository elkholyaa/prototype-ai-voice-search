/**
 * Arabic Natural Language Processing (NLP) module that understands semantic meanings
 * rather than just matching explicit words.
 */

import { PropertySearchQuery, NLPResult } from '../types';

// Core property types with their semantic variations
const PROPERTY_CONCEPTS = {
  'فيلا': {
    synonyms: ['بيت', 'منزل', 'مسكن عائلي'],
    indicators: ['كبير', 'مستقل', 'دورين', 'طابقين', 'عائلي']
  },
  'شقة': {
    synonyms: ['أبارتمنت', 'سكن', 'وحدة سكنية'],
    indicators: ['دور', 'طابق', 'مدخل مستقل']
  },
  'قصر': {
    synonyms: ['فيلا فاخرة', 'منزل فخم'],
    indicators: ['فخم', 'واسع', 'كبير جداً', 'ملكي']
  },
  'دوبلكس': {
    synonyms: ['شقة دورين', 'طابقين'],
    indicators: ['درج داخلي', 'دورين متصلين']
  }
};

// Semantic understanding of price concepts
const PRICE_CONCEPTS = {
  maximum: {
    // Phrases indicating an upper limit
    patterns: [
      /لا\s+[يت][تز]((يد)|(جاوز))/,  // "لا يتجاوز" or "لا يزيد"
      /في\s+حدود/,                    // "في حدود"
      /أقل\s+من/,                     // "أقل من"
      /حت[ىي]/,                       // "حتى"
      /بحدود/,                        // "بحدود"
      /تحت/,                          // "تحت"
      /ميزانيت[يى]\s+[^.،؟!]+?(\d)/   // "ميزانيتي" followed by number
    ]
  },
  minimum: {
    // Phrases indicating a lower limit
    patterns: [
      /فوق/,                          // "فوق"
      /أكثر\s+من/,                    // "أكثر من"
      /يبدأ\s+من/,                    // "يبدأ من"
      /يزيد\s+عن/,                    // "يزيد عن"
      /أقل\s+شيء/                     // "أقل شيء"
    ]
  }
};

// Semantic understanding of features
const FEATURE_CONCEPTS = {
  'مسبح': {
    related: ['حمام سباحة', 'بركة', 'مسبح للأطفال', 'مسبح داخلي', 'مسبح خارجي'],
    context: ['سباحة', 'تسبح', 'يسبح']
  },
  'حديقة': {
    related: ['حديقة خاصة', 'حوش', 'فناء خارجي', 'مساحة خضراء'],
    context: ['خضراء', 'أشجار', 'جلسة خارجية']
  },
  'مصعد': {
    related: ['مصعد خاص', 'لفت', 'أسانسير'],
    context: ['يصعد', 'ينزل', 'طوابق']
  },
  'مطبخ': {
    related: ['مطبخ مجهز', 'مطبخ راكب', 'مطبخ حديث'],
    context: ['تجهيزات المطبخ', 'مجهز بالكامل']
  },
  'موقف': {
    related: ['موقف خاص', 'موقف سيارات', 'كراج', 'جراج'],
    context: ['سيارات', 'خاص', 'مغطى']
  }
};

// Semantic understanding of locations
const LOCATION_CONCEPTS = {
  cities: {
    'الرياض': {
      context: ['العاصمة', 'وسط المملكة'],
      districts: ['حي النرجس', 'حي الياسمين', 'حي الشاطئ', 'حي السفارات', 'حي الروابي', 'حي الروضة', 'حي النزهة', 'حي الملقا']
    },
    'جدة': {
      context: ['على البحر', 'غرب المملكة'],
      districts: ['حي الشاطئ', 'حي السلامة', 'حي الروضة']
    },
    'مكة المكرمة': {
      context: ['المدينة المقدسة', 'العاصمة المقدسة'],
      districts: ['العزيزية', 'الششة', 'العوالي']
    },
    'الدمام': {
      context: ['شرق المملكة', 'الخليج'],
      districts: ['حي البحيرة', 'حي الشاطئ']
    },
    'الخبر': {
      context: ['الشرقية', 'على الخليج'],
      districts: ['العقربية', 'الثقبة']
    }
  },
  // Common words indicating location context
  indicators: {
    district: ['حي', 'منطقة', 'في', 'ب', 'داخل'],
    city: ['مدينة', 'في', 'ب', 'داخل']
  }
};

/**
 * Analyzes text semantically to understand property type based on context and descriptions
 */
const extractPropertyType = (text: string): string | undefined => {
  const normalizedText = text.toLowerCase();
  
  // Check each property type and its semantic variations
  for (const [type, concept] of Object.entries(PROPERTY_CONCEPTS)) {
    // Direct match with type or synonyms
    if (concept.synonyms.some(syn => normalizedText.includes(syn)) || 
        normalizedText.includes(type)) {
      return type;
    }
    
    // Check for contextual indicators
    const hasIndicators = concept.indicators.some(ind => normalizedText.includes(ind));
    if (hasIndicators) {
      return type;
    }
  }
};

/**
 * Extracts features based on semantic understanding and context
 */
const extractFeatures = (text: string): string[] => {
  const normalizedText = text.toLowerCase();
  const features = new Set<string>();
  
  // First pass: Check for compound features
  for (const [feature, concept] of Object.entries(FEATURE_CONCEPTS)) {
    // Check for exact compound feature matches first
    const exactCompoundMatches = concept.related.filter(term => 
      normalizedText.includes(term.toLowerCase())
    );
    if (exactCompoundMatches.length > 0) {
      features.add(exactCompoundMatches[0]); // Add the exact compound feature
      continue;
    }
    
    // Check for direct feature mention
    if (normalizedText.includes(feature.toLowerCase())) {
      features.add(feature);
      continue;
    }
    
    // Check contextual mentions
    if (concept.context.some(ctx => normalizedText.includes(ctx.toLowerCase()))) {
      features.add(feature);
      continue;
    }
  }
  
  return Array.from(features);
};

/**
 * Extracts price information using semantic pattern matching
 */
const extractPrice = (text: string): { min?: number; max?: number } => {
  const normalizedText = text.toLowerCase();
  const result: { min?: number; max?: number } = {};
  
  // Match any number followed by million variations
  const priceMatches = normalizedText.match(/(\d+(?:\.\d+)?)\s*(?:مليون|م)/g);
  if (!priceMatches) return result;
  
  for (const priceMatch of priceMatches) {
    const amount = parseFloat(priceMatch.replace(/[^0-9.]/g, '')) * 1000000;
    
    // Check the context before this price
    const priceIndex = normalizedText.indexOf(priceMatch);
    const contextBefore = normalizedText.substring(Math.max(0, priceIndex - 50), priceIndex);
    
    // Check for maximum price patterns
    if (PRICE_CONCEPTS.maximum.patterns.some(pattern => pattern.test(contextBefore))) {
      result.max = amount;
    }
    // Check for minimum price patterns
    else if (PRICE_CONCEPTS.minimum.patterns.some(pattern => pattern.test(contextBefore))) {
      result.min = amount;
    }
    // Default to max if context is unclear
    else {
      result.max = amount;
    }
  }
  
  return result;
};

/**
 * Enhanced location extraction using semantic understanding
 * Understands both explicit mentions and contextual references
 */
const extractLocation = (text: string): string | undefined => {
  const normalizedText = text.toLowerCase();
  let city: string | undefined;
  let district: string | undefined;
  
  // First check for city mentions
  for (const [cityName, info] of Object.entries(LOCATION_CONCEPTS.cities)) {
    if (normalizedText.includes(cityName.toLowerCase())) {
      city = cityName;
      break;
    }
    // Check contextual mentions of the city
    if (info.context.some(ctx => normalizedText.includes(ctx.toLowerCase()))) {
      city = cityName;
      break;
    }
  }

  // Then look for district mentions
  const hayIndex = normalizedText.indexOf('حي');
  if (hayIndex !== -1) {
    const afterHay = normalizedText.substring(hayIndex + 2).trim();
    if (afterHay) {
      const districtName = afterHay.split(/[,،\s]+/)[0].trim();
      console.log('Extracted district from حي:', districtName);
      
      // Check if this is a valid district name
      for (const [_, info] of Object.entries(LOCATION_CONCEPTS.cities)) {
        const matchingDistrict = info.districts.find(d => 
          d.toLowerCase().replace('حي ', '').includes(districtName) ||
          districtName.includes(d.toLowerCase().replace('حي ', ''))
        );
        
        if (matchingDistrict) {
          district = matchingDistrict;
          break;
        }
      }
    }
  }

  // If we found both city and district
  if (city && district) {
    return `${city}، ${district}`;
  }
  
  // If we found only district, assume Riyadh
  if (district) {
    return `الرياض، ${district}`;
  }
  
  // If we found only city
  if (city) {
    return city;
  }
  
  // Default to Riyadh if no specific location found but the query seems to be about location
  if (LOCATION_CONCEPTS.indicators.city.some(ind => normalizedText.includes(ind))) {
    return 'الرياض';
  }
  
  return undefined;
};

/**
 * Processes Arabic natural language query into structured search criteria
 */
export const processArabicQuery = (text: string): NLPResult => {
  // Normalize the input text
  const normalizedText = text.toLowerCase().trim();
  console.log('\nProcessing query:', normalizedText);
  
  const query: PropertySearchQuery = {
    features: [],
    price: {}
  };
  
  // Extract property type
  const type = extractPropertyType(normalizedText);
  if (type) {
    query.type = type;
    console.log('Extracted type:', type);
  }
  
  // Extract location with district
  // First check for explicit district mention
  if (normalizedText.includes('حي ')) {
    const parts = normalizedText.split('حي ');
    const afterHay = parts[parts.length - 1];
    const district = afterHay.split(/[,،\s]+/)[0].trim();
    query.location = `الرياض، حي ${district}`;
    console.log('Extracted location from حي:', query.location);
  } else {
    // If no explicit district, try the general location extraction
    const location = extractLocation(normalizedText);
    if (location) {
      query.location = location;
      console.log('Extracted location:', location);
    } else if (normalizedText.includes('الرياض')) {
      query.location = 'الرياض';
      console.log('Defaulting to الرياض');
    }
  }
  
  // Extract features
  const features = extractFeatures(normalizedText);
  if (features.length > 0) {
    query.features = features;
    console.log('Extracted features:', features);
  }
  
  // Extract price range
  const price = extractPrice(normalizedText);
  if (Object.keys(price).length > 0) {
    query.price = price;
    console.log('Extracted price:', price);
  }
  
  const confidence = calculateConfidence(query);
  console.log('Final query:', query);
  console.log('Confidence:', confidence);
  
  return { query, confidence };
};

// Helper function to calculate confidence in the extracted query
const calculateConfidence = (query: PropertySearchQuery): number => {
  let score = 0;
  let total = 0;
  
  // Property type confidence
  if (query.type) {
    score += 1;
  }
  total += 1;
  
  // Location confidence
  if (query.location) {
    score += 1;
  }
  total += 1;
  
  // Features confidence
  if (query.features && query.features.length > 0) {
    score += 1;
  }
  total += 1;
  
  // Price confidence
  if (query.price && Object.keys(query.price).length > 0) {
    score += 1;
  }
  total += 1;
  
  return score / total;
}; 