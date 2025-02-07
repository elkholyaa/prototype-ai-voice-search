/**
 * src/utils/structuredQuery.ts
 * ============================================
 * Purpose:
 *   Provides the function `extractStructuredQuery` that parses a raw search input
 *   string and extracts property attributes into a structured HTML display.
 *   Extracted attributes include property type, city, district, features (such as room counts
 *   and other property features), and price information.
 *   The output is formatted into two columns with attribute labels in red and their values in blue.
 *
 * Role & Relation:
 *   - Used by the client-side search UI component (ClientLocalePage.tsx) to show a structured
 *     representation of the user's query beneath the search box.
 *   - Leverages standardized keyword mappings imported from "keywordMappings.ts" for consistency.
 *
 * Workflow:
 *   1. Normalize the input query (trim and lowercase).
 *   2. Extract attributes (type, city, district, price info, features) using the imported mappings.
 *   3. For price, a regex extracts the numeral, converts Arabic digits to English, and appends " مليون".
 *      The regex now supports phrases like "ما تطلع فوق", "ما يزيد سعرها عن", and "اقل من".
 *   4. For features, we scan the query for each mapping key and record its first occurrence so that the
 *      features are displayed in the same order as in the search text.
 *   5. If no room count is found from the mappings, a fallback regex is used to detect numeric or word-based
 *      room counts (such as “سته غرف”) and add it.
 *   6. Builds and returns an HTML string with a two‑column grid using Tailwind CSS classes.
 *
 * Educational Comments:
 *   - This design decouples the mapping definitions from the extraction logic (they reside in keywordMappings.ts).
 *   - Recording the index of each found feature and then sorting preserves the order in which features are mentioned.
 */

import { typeMapping, cityMapping, districtMapping, featureMapping } from "./keywordMappings";

/**
 * Converts Arabic digits in a string to English digits.
 * @param input - The string that may contain Arabic digits.
 * @returns The string with Arabic digits replaced by their English equivalents.
 */
function convertArabicDigits(input: string): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let output = "";
  for (const char of input) {
    const index = arabicDigits.indexOf(char);
    output += index !== -1 ? index.toString() : char;
  }
  return output;
}

// Updated regular expression to match price phrases.
// Now includes "اقل من" along with "تحت", "ما يتجاوز", "ما يزيد ... عن", and "ما تطلع فوق".
// This should capture queries like "اقل من 2 مليون".
const pricePattern = /(?:تحت|ما(?:\s*يتجاوز)?|ما\s+يزيد(?:\s+\S+)*?\s+عن|ما\s+تطلع\s+فوق|اقل\s+من)\s*([٠-٩\d]+(?:\.\d+)?)(?:\s*(?:مليون|م))?/i;

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

  // --- Extract simple attributes using the mappings ---

  // Property type.
  for (const key in typeMapping) {
    if (normalized.includes(key)) {
      structured.type = typeMapping[key];
      break;
    }
  }

  // City.
  for (const key in cityMapping) {
    if (normalized.includes(key)) {
      structured.city = cityMapping[key];
      break;
    }
  }

  // District.
  for (const key in districtMapping) {
    if (normalized.includes(key)) {
      structured.district = districtMapping[key];
      break;
    }
  }

  // Price info.
  const priceMatch = normalized.match(pricePattern);
  if (priceMatch) {
    const arabicNumber = priceMatch[1].trim();
    const englishNumber = convertArabicDigits(arabicNumber);
    structured.priceInfo = `${englishNumber} مليون`;
  }

  // --- Extract features preserving the order in the search text ---
  // We'll scan for each feature key from featureMapping, record its index, and then sort.
  interface FeatureOccurrence {
    index: number;
    value: string;
  }
  const featureOccurrences: FeatureOccurrence[] = [];

  for (const key in featureMapping) {
    const idx = normalized.indexOf(key);
    if (idx !== -1) {
      const standardized = featureMapping[key];
      // If already recorded, update the index if found earlier.
      const existing = featureOccurrences.find((item) => item.value === standardized);
      if (existing) {
        if (idx < existing.index) {
          existing.index = idx;
        }
      } else {
        featureOccurrences.push({ index: idx, value: standardized });
      }
    }
  }
  
  // --- Fallback for room count ---
  // If no feature containing "غرف" was found, try numeric pattern first.
  if (!featureOccurrences.some(item => item.value.includes("غرف"))) {
    const roomPattern = /([٠-٩\d]+)\s*غرف/;
    const roomMatch = normalized.match(roomPattern);
    if (roomMatch && roomMatch.index !== undefined) {
      const roomNumber = convertArabicDigits(roomMatch[1]);
      featureOccurrences.push({ index: roomMatch.index, value: `${roomNumber} غرف` });
    } else {
      // Fallback for spelled-out room numbers (e.g., "ستة", "سته", or "ست").
      const roomWordPattern = /\b(ستة|سته|ست)\s*غرف\b/;
      const roomWordMatch = normalized.match(roomWordPattern);
      if (roomWordMatch && roomWordMatch.index !== undefined) {
        featureOccurrences.push({ index: roomWordMatch.index, value: "6 غرف" });
      }
    }
  }
  
  // Sort the features by the order they appear in the query.
  featureOccurrences.sort((a, b) => a.index - b.index);
  structured.features = featureOccurrences.map(item => item.value);

  // --- Build the HTML parts ---
  const parts: string[] = [];
  if (structured.type) {
    parts.push(`<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">${structured.type}</span></div>`);
  }
  if (structured.city) {
    parts.push(`<div><span class="text-red-500">المدينة</span>: <span class="text-blue-500">${structured.city}</span></div>`);
  }
  if (structured.district) {
    parts.push(`<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">${structured.district}</span></div>`);
  }
  structured.features.forEach((feature) => {
    parts.push(`<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">${feature}</span></div>`);
  });
  if (structured.priceInfo) {
    parts.push(`<div><span class="text-red-500">الحد الأقصى للسعر</span>: <span class="text-blue-500">${structured.priceInfo}</span></div>`);
  }

  if (parts.length === 0) {
    return "";
  }

  // Split the parts into two columns.
  const midPoint = Math.ceil(parts.length / 2);
  const column1 = parts.slice(0, midPoint);
  const column2 = parts.slice(midPoint);

  return `<div class="grid grid-cols-2 gap-2 text-right">
            <div>${column1.join("")}</div>
            <div>${column2.join("")}</div>
          </div>`;
}
