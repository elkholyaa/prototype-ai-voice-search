/**
 * Property search utilities for filtering and searching real estate properties
 */
import { Property, PropertySearchQuery } from '../types';
import { processArabicQuery } from './arabicNLP';

/**
 * Extracts district name from a location string
 */
const extractDistrictFromQuery = (location: string): string | null => {
  // Basic district extraction - just check if location contains حي
  if (location.includes('حي ')) {
    const parts = location.split('حي ');
    if (parts[1]) {
      return parts[1].split(/[,،\s]+/)[0].trim();
    }
  }
  return null;
};

/**
 * Filters properties based on search criteria
 */
export const filterProperties = (
  properties: Property[],
  query: Partial<PropertySearchQuery>
): Property[] => {
  console.log('\nFiltering with query:', query);
  
  return properties.filter(property => {
    // Match property type
    if (query.type && property.type !== query.type) {
      return false;
    }

    // Basic location matching
    if (query.location) {
      const propertyLoc = property.location.toLowerCase();
      const queryLoc = query.location.toLowerCase();
      
      // Extract district from query if present
      const queryDistrict = extractDistrictFromQuery(query.location);
      
      if (queryDistrict) {
        // If district specified, check both city and district
        if (!propertyLoc.includes('الرياض') || !propertyLoc.includes(queryDistrict.toLowerCase())) {
          return false;
        }
      } else {
        // If no district, just check if property location includes query location
        if (!propertyLoc.includes(queryLoc)) {
          return false;
        }
      }
    }

    // Simplified feature matching
    if (query.features && query.features.length > 0) {
      // Remove موقف from query features as it's automatically added
      const queryFeatures = query.features.filter(f => f !== 'موقف');
      
      const hasAllFeatures = queryFeatures.every(qf => {
        // Basic feature matching - check if property has a feature that includes query feature
        // or query feature includes property feature
        return property.features.some(pf => {
          const queryFeature = qf.toLowerCase();
          const propertyFeature = pf.toLowerCase();
          return propertyFeature.includes(queryFeature) || 
                 queryFeature.includes(propertyFeature) ||
                 // Handle مسبح للأطفال matching with مسبح
                 (queryFeature.includes('مسبح') && propertyFeature.includes('مسبح'));
        });
      });
      
      if (!hasAllFeatures) {
        return false;
      }
    }

    // Match price range
    if (query.price) {
      const { min, max } = query.price;
      if (min && property.price < min) return false;
      if (max && property.price > max) return false;
    }

    return true;
  });
};

/**
 * Searches properties using either NLP or traditional search
 */
export const searchProperties = (
  properties: Property[],
  searchText: string,
  useNLP: boolean = false
): Property[] => {
  if (!searchText) {
    return properties;
  }

  if (useNLP) {
    const { query, confidence } = processArabicQuery(searchText);
    console.log('\nProcessed NLP query:', query);
    console.log('Confidence:', confidence);
    
    // Only apply NLP filtering if we have sufficient confidence
    if (confidence > 0) {
      // Create a copy of the query without موقف if it was automatically added
      const cleanedQuery = {
        ...query,
        features: query.features?.filter(f => f !== 'موقف') || []
      };
      return filterProperties(properties, cleanedQuery);
    }
  }

  // Traditional search (fallback)
  const searchLower = searchText.toLowerCase();
  return properties.filter(
    property =>
      property.title.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.features.some(f => f.toLowerCase().includes(searchLower))
  );
}; 