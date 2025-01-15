import { PropertySearchQuery, NLPResult } from '../types';

const PROPERTY_TYPES = ['فيلا', 'شقة', 'قصر', 'دوبلكس'];
const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'الدمام', 'الخبر'];
const FEATURES = ['مسبح', 'حديقة خاصة', 'حديقة', 'مصعد', 'غرفة سائق', 'غرفة خادمة', 'ملعب تنس']
  .sort((a, b) => b.length - a.length);

const extractPrice = (text: string): { min?: number; max?: number } => {
  const priceRegex = /(\d+(?:\.\d+)?)\s*مليون/;
  const match = text.match(priceRegex);
  
  if (match) {
    const amount = parseFloat(match[1]) * 1000000;
    if (text.includes('حتى') || text.includes('تصل إلى') || text.includes('أقل من')) {
      return { max: amount };
    } else if (text.includes('فوق') || text.includes('أكثر من')) {
      return { min: amount };
    }
    return { max: amount }; // Default to max if no specific indicator
  }
  return {};
};

const extractFeatures = (text: string): string[] => {
  // Normalize text by adding spaces around conjunctions
  const normalizedText = text.toLowerCase()
    .replace(/\s*و\s*/g, ' و ')  // Add spaces around Arabic 'and'
    .replace(/\s+/g, ' ')        // Normalize multiple spaces
    .trim();
  
  const foundFeatures = new Set<string>();
  
  // Process features in order (longest first due to sorting)
  for (const feature of FEATURES) {
    const normalizedFeature = feature.toLowerCase();
    // Check for exact feature match considering Arabic text patterns
    const parts = normalizedText.split(' و ');
    for (const part of parts) {
      if (part.trim() === normalizedFeature || part.trim().includes(normalizedFeature)) {
        // Only add if no longer version of this feature was already found
        const hasLongerVersion = Array.from(foundFeatures).some(f => 
          f.toLowerCase().includes(normalizedFeature) && f.length > feature.length
        );
        if (!hasLongerVersion) {
          foundFeatures.add(feature);
        }
      }
    }
  }
  
  return Array.from(foundFeatures);
};

const extractPropertyType = (text: string): string | undefined => {
  return PROPERTY_TYPES.find(type => text.includes(type));
};

const extractLocation = (text: string): string | undefined => {
  return CITIES.find(city => text.includes(city));
};

export const processArabicQuery = (query: string): NLPResult => {
  const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();
  
  const searchQuery: PropertySearchQuery = {
    type: extractPropertyType(normalizedQuery),
    location: extractLocation(normalizedQuery),
    features: extractFeatures(normalizedQuery),
    price: extractPrice(normalizedQuery)
  };

  // Calculate confidence based on how many fields were extracted
  const filledFields = Object.values(searchQuery).filter(value => 
    value !== undefined && (
      typeof value === 'string' || 
      Array.isArray(value) && value.length > 0 ||
      typeof value === 'object' && Object.keys(value).length > 0
    )
  ).length;
  
  const confidence = filledFields / 4; // 4 is the total number of possible fields

  return {
    query: searchQuery,
    confidence
  };
}; 