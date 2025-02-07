/**
 * src/utils/search.ts
 * ================================
 * Purpose:
 *   Provides a text‑based search function that filters property data based on a query.
 *   It now accepts an optional locale parameter so that it uses the English dataset when locale === "en"
 *   and the Arabic dataset otherwise.
 *
 * Role & Relation:
 *   - Used by both the API route and the client-side search components.
 *   - Returns an array of SearchResult objects (which extend the Property type) with a similarityScore field.
 *
 * Educational Comments:
 *   - The search function uses simple keyword matching to filter properties.
 *   - Extraction logic is simplified for this PoC.
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
 * @returns An object containing extracted criteria.
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

  // Extract property type.
  if (normalized.includes("duplex")) {
    criteria.type = "Duplex";
  } else if (normalized.includes("apartment")) {
    criteria.type = "Apartment";
  } else if (normalized.includes("villa")) {
    criteria.type = "Villa";
  } else if (normalized.includes("mansion")) {
    criteria.type = "Mansion";
  }

  // Extract district if mentioned.
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

  // Price extraction.
  const priceMatch = normalized.match(/(?:under|less than|below|no more than|not exceeding)\s*([0-9\.]+)/);
  if (priceMatch) {
    criteria.maxPrice = parseFloat(priceMatch[1]) * 1000000;
  }

  // Extract features (basic extraction).
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
 * @returns An array of SearchResult.
 */
export function searchProperties(query: string, locale: string = "ar"): SearchResult[] {
  const dataset: Property[] = locale === "en" ? propertiesEnData : propertiesArData;

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

  const criteria = extractSearchCriteria(query);

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
