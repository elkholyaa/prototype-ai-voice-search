import { Property, PropertySearchQuery } from '../types';
import { processArabicQuery } from './arabicNLP';

export const filterProperties = (properties: Property[], query: PropertySearchQuery): Property[] => {
  return properties.filter(property => {
    // Type matching
    if (query.type && property.type.toLowerCase() !== query.type.toLowerCase()) {
      return false;
    }

    // Location matching
    if (query.location && !property.location.toLowerCase().includes(query.location.toLowerCase())) {
      return false;
    }

    // Features matching - all requested features must be present
    if (query.features && query.features.length > 0) {
      const hasAllFeatures = query.features.every(feature =>
        property.features.some(propFeature => 
          propFeature.toLowerCase() === feature.toLowerCase()
        )
      );
      if (!hasAllFeatures) {
        return false;
      }
    }

    // Price range matching
    if (query.price) {
      const { min, max } = query.price;
      if (min !== undefined && property.price < min) {
        return false;
      }
      if (max !== undefined && property.price > max) {
        return false;
      }
    }

    return true;
  });
};

export const searchProperties = (
  properties: Property[],
  searchText: string,
  useNLP: boolean = false
): Property[] => {
  if (!searchText.trim()) {
    return properties;
  }

  if (useNLP) {
    const { query } = processArabicQuery(searchText);
    return filterProperties(properties, query);
  }

  // Fallback to traditional search if NLP is not enabled
  const searchLower = searchText.toLowerCase();
  return properties.filter(property => {
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.features.some(feature =>
        feature.toLowerCase().includes(searchLower)
      )
    );
  });
}; 