/**
 * src/utils/structuredQuery.ts
 * ============================================
 * Purpose:
 *   Provides the function `extractStructuredQuery` that parses a raw search input
 *   string and extracts property attributes into a structured HTML display.
 *   Extracted attributes include property type, city, features, and price information.
 *   The output is formatted into two columns with attribute labels in red and their values in blue.
 *
 * Role & Relation:
 *   - Used by the client-side search UI component (ClientLocalePage.tsx) to show a structured
 *     representation of the user's query beneath the search box.
 *   - Leverages standardized keyword mappings from "keywordMappings.ts" for consistency.
 *
 * Workflow:
 *   1. Normalize the input query (trim and lowercase).
 *   2. Extract attributes (type, city, district, price info, features) using the imported mappings.
 *   3. For price, a regex extracts the numeral, converts Arabic digits to English, and appends " مليون".
 *   4. Features are split so that room-related features (e.g., "6 غرف") appear first.
 *   5. Builds and returns an HTML string with a two-column grid using Tailwind CSS classes.
 *
 * Educational Comments:
 *   - This design decouples the mapping definitions from the parsing logic.
 *   - The ordering of attributes is set to match the main branch's output: type, city,
 *     then features (with room counts first), and finally price info.
 */

import { typeMapping, cityMapping, districtMapping, featureMapping } from '@/utils/keywordMappings';

/**
 * Converts Arabic digits in a string to English digits.
 * @param input - The string that may contain Arabic digits.
 * @returns The string with Arabic digits replaced by their English equivalents.
 */
function convertArabicDigits(input: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let output = '';
  for (const char of input) {
    const index = arabicDigits.indexOf(char);
    output += index !== -1 ? index.toString() : char;
  }
  return output;
}

// Regular expression to match price phrases (e.g., "تحت ٢ مليوون")
const pricePattern = /(?:تحت|ما(?:\s*يتجاوز)?|ما\s+يزيد\s+عن)\s*([٠-٩\d]+(?:\.\d+)?)(?:\s*(?:مليون|م))?/i;

export interface StructuredQuery {
  type?: string;
  city?: string;
  district?: string;
  priceInfo?: string;
  features: string[];
  others: string[];
}

/**
 * Extracts a structured query from a raw search input and returns an HTML string
 * that displays the extracted attributes in two columns with attribute labels in red
 * and their values in blue.
 * @param query - The raw search input.
 * @returns An HTML string representing the structured query.
 */
export function extractStructuredQuery(query: string): string {
  // Normalize the query.
  const normalized = query.trim().toLowerCase();
  const structured: StructuredQuery = { features: [], others: [] };

  // Extract property type.
  for (const key in typeMapping) {
    if (normalized.includes(key)) {
      structured.type = typeMapping[key];
      break;
    }
  }

  // Extract city.
  for (const key in cityMapping) {
    if (normalized.includes(key)) {
      structured.city = cityMapping[key];
      break;
    }
  }

  // Extract district.
  for (const key in districtMapping) {
    if (normalized.includes(key)) {
      structured.district = districtMapping[key];
      break;
    }
  }

  // Extract price info.
  const priceMatch = normalized.match(pricePattern);
  if (priceMatch) {
    const arabicNumber = priceMatch[1].trim();
    const englishNumber = convertArabicDigits(arabicNumber);
    structured.priceInfo = `${englishNumber} مليون`;
  }

  // Extract features using featureMapping.
  for (const key in featureMapping) {
    if (normalized.includes(key)) {
      const mapped = featureMapping[key];
      if (!structured.features.includes(mapped)) {
        structured.features.push(mapped);
      }
    }
  }

  // Order features: room-related features (containing "غرف") first.
  const roomFeatures = structured.features.filter(f => f.includes('غرف'));
  const otherFeatures = structured.features.filter(f => !f.includes('غرف'));
  structured.features = [...roomFeatures, ...otherFeatures];

  // Build HTML parts.
  const parts: string[] = [];
  if (structured.type) {
    parts.push(`<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">${structured.type}</span></div>`);
  }
  if (structured.city) {
    parts.push(`<div><span class="text-red-500">المدينة</span>: <span class="text-blue-500">${structured.city}</span></div>`);
  }
  // Include district only if defined.
  if (structured.district) {
    parts.push(`<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">${structured.district}</span></div>`);
  }
  // Add each feature with the label "ميزة".
  structured.features.forEach(feature => {
    parts.push(`<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">${feature}</span></div>`);
  });
  // Finally, add price info with the label "الحد الأقصى للسعر".
  if (structured.priceInfo) {
    parts.push(`<div><span class="text-red-500">الحد الأقصى للسعر</span>: <span class="text-blue-500">${structured.priceInfo}</span></div>`);
  }
  
  if (parts.length === 0) {
    return '';
  }
  
  // Split the parts into two columns.
  const midPoint = Math.ceil(parts.length / 2);
  const column1 = parts.slice(0, midPoint);
  const column2 = parts.slice(midPoint);
  
  return `<div class="grid grid-cols-2 gap-2 text-right">
            <div>${column1.join('')}</div>
            <div>${column2.join('')}</div>
          </div>`;
}
