/**
 * src/utils/search.ts
 * ================================
 * Purpose:
 *   Provides a text‑based search function that filters property data based on a natural language query.
 *   It supports bilingual search by selecting the English dataset when locale === "en" and the Arabic dataset otherwise.
 *
 * Role & Relation:
 *   - This module is used both by the API route (to process POST requests) and by client‑side search components.
 *   - It returns an array of SearchResult objects (which extend the Property type) with a default similarityScore.
 *
 * Workflow & Design Decisions:
 *   - The function extractSearchCriteria parses the query for property type, city, district, features, and price.
 *   - The price extraction has been enhanced to correctly handle units such as "thousand" (or "k"), "million" (or "m"),
 *     as well as defaulting to dollars when no unit is specified.
 *   - This update fixes the issue where a query like "less than 3 thousands dollars" was previously interpreted as 3 dollars.
 *
 * Educational Comments:
 *   - Using a flexible regular expression to capture both numeric values and an optional unit allows us to scale the price
 *     appropriately based on the unit. For example, if the unit is "thousand" or "k" we multiply by 1,000, and for "million"
 *     or "m" we multiply by 1,000,000.
 *   - All extracted text is normalized to lowercase for consistency in comparisons.
 */

import { Property } from "@/types";
import { propertiesArData, propertiesEnData } from "@/data/properties";

export interface SearchResult extends Property {
  similarityScore: number;
}

/**
 * Extracts simple search criteria from the query.
 * (This implementation is simplified for the PoC.)
 * @param query The search query.
 * @returns An object containing the extracted criteria.
 */
function extractSearchCriteria(query: string): {
  type?: string;
  city?: string;
  districts?: string[];
  features?: string[];
  maxPrice?: number;
} {
  const normalized = query.toLowerCase();
  const criteria: {
    type?: string;
    city?: string;
    districts?: string[];
    features?: string[];
    maxPrice?: number;
  } = {};

  // --- Extract property type ---
  if (normalized.includes("duplex")) {
    criteria.type = "Duplex";
  } else if (normalized.includes("apartment")) {
    criteria.type = "Apartment";
  } else if (normalized.includes("villa")) {
    criteria.type = "Villa";
  } else if (normalized.includes("mansion")) {
    criteria.type = "Mansion";
  }

  // --- Extract district if mentioned ---
  if (normalized.includes("queens")) {
    criteria.districts = ["Queens"];
  } else if (normalized.includes("upper east side")) {
    criteria.districts = ["Upper East Side"];
  } else if (normalized.includes("upper west side")) {
    criteria.districts = ["Upper West Side"];
  } else if (normalized.includes("bronx")) {
    criteria.districts = ["Bronx"];
  } else if (normalized.includes("staten island")) {
    criteria.districts = ["Staten Island"];
  }

  // --- Price extraction ---
  // Updated regex to capture a number and an optional unit:
  // Supports units: "thousand", "k", "million", "m", "dollar", "dollars".
  const priceMatch = normalized.match(
    /(?:under|less than|below|no more than|not exceeding)\s*([0-9]+(?:\.[0-9]+)?)\s*(thousand|k|million|m|dollar|dollars)?/i
  );
  if (priceMatch) {
    const value = parseFloat(priceMatch[1]);
    const unit = priceMatch[2] ? priceMatch[2].toLowerCase() : "";
    // Multiply value based on the extracted unit.
    if (unit === "thousand" || unit === "k") {
      criteria.maxPrice = value * 1000;
    } else if (unit === "million" || unit === "m") {
      criteria.maxPrice = value * 1000000;
    } else if (unit === "dollar" || unit === "dollars" || unit === "") {
      criteria.maxPrice = value;
    }
  }

  // --- Extract features (basic extraction) ---
  criteria.features = [];
  if (normalized.includes("2 bedroms") || normalized.includes("2 bedrooms") || normalized.includes("2 bdrms")) {
    criteria.features.push("2 bedrooms");
  }
  if (normalized.includes("1 bth") || normalized.includes("1 bath") || normalized.includes("1 bth")) {
    criteria.features.push("1 bathroom");
  }
  if (normalized.includes("balcony")) {
    criteria.features.push("balcony");
  }
  if (normalized.includes("kitchen")) {
    criteria.features.push("kitchen");
  }
  if (normalized.includes("living room")) {
    criteria.features.push("living room");
  }
  // Check for room count if "6" and "bed" are mentioned.
  if (normalized.includes("6") && normalized.includes("bed")) {
    if (!criteria.features.includes("6 bedrooms")) {
      criteria.features.push("6 bedrooms");
    }
  }
  return criteria;
}

/**
 * Searches for properties matching the query in the dataset corresponding to the locale.
 * @param query The search query.
 * @param locale Optional; if "en", uses the English dataset; default is "ar".
 * @returns An array of SearchResult objects with a default similarityScore of 1.
 */
export function searchProperties(query: string, locale: string = "ar"): SearchResult[] {
  const dataset: Property[] = locale === "en" ? propertiesEnData : propertiesArData;

  // If the query is empty, return all properties.
  if (!query.trim()) {
    return dataset.map((property) => ({
      id: property.id,
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

  // Extract criteria from the query.
  const criteria = extractSearchCriteria(query);

  // Filter dataset based on extracted criteria.
  const filtered = dataset.filter((property) => {
    if (criteria.type && property.type.toLowerCase() !== criteria.type.toLowerCase()) {
      return false;
    }
    if (criteria.city && property.city.toLowerCase() !== criteria.city.toLowerCase()) {
      return false;
    }
    if (criteria.districts && criteria.districts.length > 0) {
      if (!criteria.districts.includes(property.district)) return false;
    }
    if (criteria.maxPrice && property.price > criteria.maxPrice) {
      return false;
    }
    if (criteria.features && criteria.features.length > 0) {
      if (
        !criteria.features.every((feat: string) =>
          property.features.map((f: string) => f.toLowerCase()).includes(feat.toLowerCase())
        )
      ) {
        return false;
      }
    }
    return true;
  });

  // Map the filtered properties into SearchResult objects.
  return filtered.map((property) => ({
    id: property.id,
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
