/**
 * Formats a number as a price with thousands separators
 * @param price - The price to format
 * @returns The formatted price string
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ar-SA');
}

/**
 * Generates a human-readable description of a property
 * @param property - The property object
 * @returns A descriptive text combining key property details
 */
export function generatePropertyDescription(property: {
  type: string;
  location: string;
  features: string[];
}): string {
  // Extract city and district from location
  const [city, district] = property.location.split('،').map(s => s.trim());
  
  // Start with property type and location
  let description = `${property.type} في `;
  
  // Add location details
  if (district && district !== city) {
    description += `${district}، ${city}`;
  } else {
    description += city;
  }
  
  // Add features if present
  if (property.features.length > 0) {
    // Filter out room and bathroom counts as they're usually part of the title
    const specialFeatures = property.features.filter(f => 
      !f.includes('غرف') && 
      !f.includes('حمامات') &&
      !f.includes('صالة') &&
      !f.includes('مطبخ') &&
      !f.includes('موقف سيارات')
    );
    
    if (specialFeatures.length > 0) {
      description += ' تحتوي على ';
      if (specialFeatures.length === 1) {
        description += specialFeatures[0];
      } else {
        const lastFeature = specialFeatures.pop();
        description += specialFeatures.join('، ');
        description += `، و${lastFeature}`;
      }
    }
  }
  
  return description + '.';
} 