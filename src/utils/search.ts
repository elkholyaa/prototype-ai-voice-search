import propertiesAR from "@/data/static/properties-ar.json";
import propertiesEN from "@/data/static/properties-en.json";
import { Property, PropertyType } from '@/types';

/**
 * 📌 Search Utility (Bilingual Dataset Support)
 * -------------------------------------
 * - Loads the correct dataset based on **selected language**.
 * - Supports **Arabic price filtering** (اقل من, تحت, ما يزيد).
 * - Ensures **efficient text-based searching**.
 *
 * 🔹 Used in:
 * - `page.tsx` → Fetches correct dataset based on user language.
 * - `route.ts` (API) → Calls this function to return search results.
 */

// Arabic price filtering phrases (for numeric comparisons)
const priceFilters = {
  lessThan: /(اقل من|تحت|ما يزيد|لا يزيد|معقول)/, // Detect "less than" keywords
  moreThan: /(اكثر من|فوق|ما ينزل تحت|ما يقل|لا يقل)/, // Detect "more than" keywords
};

/**
 * 🔄 Extract Price Filter from Query (Arabic Only)
 * - Detects if a query includes **price filtering terms**.
 * - Extracts the price and **determines whether it's a min/max constraint**.
 * 
 * @param query - Arabic search query
 * @returns { type: 'less' | 'more', price: number } | null
 */
function extractPriceFilter(query: string) {
  let match;
  if ((match = query.match(priceFilters.lessThan))) {
    const price = extractNumber(query);
    return price ? { type: "less", price } : null;
  } else if ((match = query.match(priceFilters.moreThan))) {
    const price = extractNumber(query);
    return price ? { type: "more", price } : null;
  }
  return null;
}

/**
 * 🔢 Extract Number from Query
 * - Converts Arabic or mixed-number format to a standard numeric value.
 * - Example: "اقل من مليون" → 1000000
 * 
 * @param query - Search query with potential numbers
 * @returns Extracted number or null if not found
 */
function extractNumber(query: string): number | null {
  const match = query.match(/\d+/g); // Find numbers
  return match ? parseInt(match.join("")) : null;
}

/**
 * 🔍 Search Properties by Query
 *
 * - **Loads the correct dataset** (`properties-ar.json` or `properties-en.json`).
 * - **Performs a text-based search** on **title & description**.
 * - **Filters by price (Arabic queries only)** if applicable.
 * 
 * @param query - Search text (Arabic or English)
 * @param language - 'ar' (Arabic) or 'en' (English)
 * @returns List of matching properties
 */
export function searchProperties(query: string, language: string): Property[] {
  const dataset = language === "ar" ? propertiesAR : propertiesEN;

  // If Arabic query contains price filtering logic
  const priceFilter = language === "ar" ? extractPriceFilter(query) : null;

  const results = dataset.filter((property) => {
    const matchesText =
      property.description.toLowerCase().includes(query.toLowerCase()) ||
      property.title.toLowerCase().includes(query.toLowerCase());

    if (!matchesText) return false;

    // Apply price filter if present
    if (priceFilter) {
      if (priceFilter.type === "max" && property.price > priceFilter.price) {
        return false;
      }
      if (priceFilter.type === "min" && property.price < priceFilter.price) {
        return false;
      }
    }

    return true;
  });

  return results.map(p => ({
    ...p,
    id: String(p.id),
    type: p.type as PropertyType
  })) as Property[];
}
