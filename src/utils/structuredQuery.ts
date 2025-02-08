/**
 * src/utils/structuredQuery.ts
 * ============================================
 * Purpose:
 *   Provides the function `extractStructuredQuery` that parses a raw search input string
 *   and extracts property attributes (type, city, district, features, and price) into a structured
 *   HTML display. This structured query is shown beneath the search box to give users a clear view
 *   of how their input is interpreted.
 *
 * Role & Relation:
 *   - Used by the client‑side search UI component (ClientLocalePage.tsx) to display a two‑column grid
 *     of extracted query attributes.
 *   - Leverages dedicated keyword mappings (based on the chosen language) to normalize attribute names.
 *
 * Workflow & Design Decisions:
 *   1. Normalize the query and (for English) replace hyphens and punctuation with spaces.
 *   2. Extract attributes (city, district, type, price, features) using dedicated mapping objects.
 *   3. For price extraction, the regex now handles both "thousand" (or "k") and "million" (or "m") units.
 *      – For example, "less than 3 thousand dollars" is now correctly parsed as 3000 dollars.
 *   4. Build an HTML string with a two‑column grid for clear visualization.
 *
 * Educational Comments:
 *   - Splitting the extraction logic based on language ensures that locale‑specific rules are applied.
 *   - The conversion of Arabic digits to English is handled by a helper function to keep our comparisons
 *     uniform.
 */

interface StructuredQuery {
  type?: string;
  city?: string;
  district?: string;
  priceInfo?: string;
  features: string[];
  others: string[];
}

/**
 * Converts Arabic digits in a string to English digits.
 * @param input - The string that may contain Arabic digits.
 * @returns The string with Arabic digits replaced by their English equivalents.
 */
function convertArabicDigits(input: string): string {
  const arabicDigits: string[] = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let output = "";
  for (const char of input) {
    const index = arabicDigits.indexOf(char);
    output += index !== -1 ? index.toString() : char;
  }
  return output;
}

/**
 * Returns keyword mapping objects based on language.
 * For English, the pricePattern now captures an optional unit among
 * "thousand", "k", "million", "m", "dollar", or "dollars".
 */
function getMappings(lang: "ar" | "en"): {
  typeMapping: Record<string, string>;
  cityMapping: Record<string, string>;
  districtMapping: Record<string, string>;
  featureMapping: Record<string, string>;
  pricePattern: RegExp;
} {
  if (lang === "en") {
    return {
      typeMapping: {
        "duplex": "Duplex",
        "apartment": "Apartment",
        "villa": "Villa",
        "mansion": "Mansion",
      },
      cityMapping: {
        "new york": "New York",
      },
      districtMapping: {
        "queens": "Queens",
        "upper east side": "Upper East Side",
        "upper west side": "Upper West Side",
        "bronx": "Bronx",
        "staten island": "Staten Island",
      },
      featureMapping: {
        "1 bedroom": "1 bedroom",
        "2 bedrooms": "2 bedrooms",
        "2 bathrooms": "2 bathrooms",
        "1 bathroom": "1 bathroom",
        "2 bath": "2 bathrooms",
        "balcony": "balcony",
        "kitchen": "kitchen",
        "living room": "living room",
        "6 bedrooms": "6 bedrooms",
      },
      // Updated English price pattern to capture "thousand", "k", "million", "m", "dollar(s)".
      pricePattern: /(?:under|less than|below|no more than|not exceeding)\s*([0-9]+(?:\.[0-9]+)?)\s*(thousand|k|million|m|dollar|dollars)?/i,
    };
  } else {
    return {
      typeMapping: {
        "بيوت فخمه": "فيلا",
        "فيلا": "فيلا",
        "فله": "فيلا",
        "فلة": "فيلا",
        "شقة": "شقة",
        "دوبلكس": "دوبلكس",
        "دبلوكس": "دوبلكس",
        "قصر": "قصر",
      },
      cityMapping: {
        "الرياض": "الرياض",
        "جده": "جدة",
        "مكة": "مكة",
        "مكه": "مكة",
        "الدمام": "الدمام",
      },
      districtMapping: {
        "النرجس": "النرجس",
        "الياسمين": "الياسمين",
        "الملقا": "الملقا",
        "العليا": "العليا",
      },
      featureMapping: {
        "حوض سباحه": "مسبح",
        "حمام سباحه": "مسبح",
        "مسبح": "مسبح",
        "مجلس كبير": "مجلس",
        "مجلس": "مجلس",
        "حديقه": "حديقة",
        "جنينة": "حديقة",
        "ست غرف": "6 غرف",
        "ستة غرف": "6 غرف",
        "سته غرف": "6 غرف", // Added missing variation "سته غرف"
        "٦ غرف": "6 غرف",
        "6 غرف": "6 غرف",
        "4 غرف": "4 غرف",
        "٤ غرف": "4 غرف",
        "وحوش": "حديقة",
      },
      // Updated Arabic price pattern to capture both million and thousand units.
      // Capturing group 1: numeric value (in Arabic digits or Latin digits).
      // Group 2: Optional million unit.
      // Group 3: Optional thousand unit.
      pricePattern: /(?:تحت|ما(?:\s*يتجاوز)?|ما\s+يزيد(?:\s+\S+)*?\s+عن|ما\s+تطلع\s+فوق|اقل\s+من)\s*([٠-٩\d]+(?:\.\d+)?)(?:\s*(مليون|م))?(?:\s*(ألف|الف))?/i,
    };
  }
}

/**
 * Extracts a structured query from a raw search input and returns an HTML string
 * that displays the extracted attributes in a two‑column grid.
 * @param query - The raw search input.
 * @param lang - The language code ("ar" for Arabic, "en" for English). Defaults to "ar".
 * @returns An HTML string representing the structured query.
 */
export function extractStructuredQuery(query: string, lang: "ar" | "en" = "ar"): string {
  // Normalize the query.
  let normalized = query.trim().toLowerCase();

  // For English queries, replace hyphens and certain punctuation with spaces (but keep periods).
  if (lang === "en") {
    normalized = normalized.replace(/-/g, " ").replace(/[(),]/g, " ");
  }

  const structured: StructuredQuery = { features: [], others: [] };
  const { typeMapping, cityMapping, districtMapping, featureMapping, pricePattern } = getMappings(lang);

  // --- Extract City ---
  // Use relaxed matching (substring search) to catch variations.
  for (const key in cityMapping) {
    if (normalized.indexOf(key) !== -1) {
      structured.city = cityMapping[key];
      break;
    }
  }

  // --- Extract District ---
  // Use word-boundary matching to ensure proper detection.
  for (const key in districtMapping) {
    const regex = new RegExp(`\\b${key}\\b`);
    if (regex.test(normalized)) {
      structured.district = districtMapping[key];
      break;
    }
  }

  // --- Extract Property Type ---
  for (const key in typeMapping) {
    if (normalized.indexOf(key) !== -1) {
      structured.type = typeMapping[key];
      break;
    }
  }

  // --- Extract Price Information ---
  const priceMatch = normalized.match(pricePattern);
  if (priceMatch) {
    const numberStr = priceMatch[1].trim();
    const unit = priceMatch[2] ? priceMatch[2].trim().toLowerCase() : "";
    // For Arabic, capture an additional thousand unit if present.
    let thousandUnit = "";
    if (lang === "ar" && priceMatch[3]) {
      thousandUnit = priceMatch[3].trim().toLowerCase();
    }
    // Convert the number (for Arabic, also convert digits)
    const priceValue = lang === "ar" ? convertArabicDigits(numberStr) : numberStr;
    if (lang === "en") {
      const numericVal = parseFloat(priceValue);
      if (unit === "thousand" || unit === "k") {
        structured.priceInfo = `${numericVal * 1000} dollars`;
      } else if (unit === "million" || unit === "m") {
        structured.priceInfo = `${numericVal} million dollars`;
      } else if (unit === "dollar" || unit === "dollars" || unit === "") {
        structured.priceInfo = `${numericVal} dollars`;
      }
    } else {
      // For Arabic: if thousand unit is present, multiply by 1000.
      if (thousandUnit === "ألف" || thousandUnit === "الف") {
        structured.priceInfo = `${parseFloat(priceValue) * 1000} ريال`;
      } else if (unit === "مليون" || unit === "م") {
        structured.priceInfo = `${priceValue} مليون`;
      } else {
        structured.priceInfo = `${priceValue} ريال`;
      }
    }
  }

  // --- Extract Features ---
  // Iterate through featureMapping and record their occurrences.
  interface FeatureOccurrence {
    index: number;
    value: string;
  }
  const featureOccurrences: FeatureOccurrence[] = [];
  for (const key in featureMapping) {
    const idx = normalized.indexOf(key);
    if (idx !== -1) {
      const standardized = featureMapping[key];
      // If the same standardized feature is found at an earlier index, keep the earlier one.
      const existing = featureOccurrences.find(item => item.value === standardized);
      if (existing) {
        if (idx < existing.index) {
          existing.index = idx;
        }
      } else {
        featureOccurrences.push({ index: idx, value: standardized });
      }
    }
  }

  // Fallback for room count if no bedroom information is found.
  if (!featureOccurrences.some(item => item.value.includes("bedroom") || item.value.includes("غرف"))) {
    if (lang === "en") {
      const roomPatternEn = /([0-9]+)\s*(bedroom|bathroom)s?/;
      const roomMatchEn = normalized.match(roomPatternEn);
      if (roomMatchEn && roomMatchEn.index !== undefined) {
        featureOccurrences.push({
          index: roomMatchEn.index,
          value: `${roomMatchEn[1]} ${roomMatchEn[2]}${roomMatchEn[1] === "1" ? "" : "s"}`
        });
      }
    } else {
      const roomPattern = /([٠-٩\d]+)\s*غرف/;
      const roomMatch = normalized.match(roomPattern);
      if (roomMatch && roomMatch.index !== undefined) {
        const roomNumber = convertArabicDigits(roomMatch[1]);
        featureOccurrences.push({ index: roomMatch.index, value: `${roomNumber} غرف` });
      } else {
        const roomWordPattern = /\b(ستة|سته|ست)\s*غرف\b/;
        const roomWordMatch = normalized.match(roomWordPattern);
        if (roomWordMatch && roomWordMatch.index !== undefined) {
          featureOccurrences.push({ index: roomWordMatch.index, value: "6 غرف" });
        }
      }
    }
  }
  // Sort features by occurrence order.
  featureOccurrences.sort((a, b) => a.index - b.index);
  structured.features = featureOccurrences.map(item => item.value);

  // --- Build HTML Output ---
  // Choose text alignment and direction based on language.
  const alignmentClass = lang === "en" ? "text-left" : "text-right";
  const dirAttr = lang === "en" ? "ltr" : "rtl";

  // Build individual HTML parts for each extracted attribute.
  const parts: string[] = [];
  if (structured.type) {
    parts.push(
      `<div><span class="text-red-500">${lang === "en" ? "Type" : "النوع"}</span>: <span class="text-blue-500">${structured.type}</span></div>`
    );
  }
  if (structured.city) {
    parts.push(
      `<div><span class="text-red-500">${lang === "en" ? "City" : "المدينة"}</span>: <span class="text-blue-500">${structured.city}</span></div>`
    );
  }
  if (structured.district) {
    parts.push(
      `<div><span class="text-red-500">${lang === "en" ? "District" : "الحي"}</span>: <span class="text-blue-500">${structured.district}</span></div>`
    );
  }
  structured.features.forEach((feature) => {
    parts.push(
      `<div><span class="text-red-500">${lang === "en" ? "Feature" : "ميزة"}</span>: <span class="text-blue-500">${feature}</span></div>`
    );
  });
  if (structured.priceInfo) {
    parts.push(
      `<div><span class="text-red-500">${lang === "en" ? "Maximum Price" : "الحد الأقصى للسعر"}</span>: <span class="text-blue-500">${structured.priceInfo}</span></div>`
    );
  }

  if (parts.length === 0) {
    return "";
  }

  // Split the parts into two columns.
  const midPoint = Math.ceil(parts.length / 2);
  const column1 = parts.slice(0, midPoint);
  const column2 = parts.slice(midPoint);

  return `<div class="grid grid-cols-2 gap-2 ${alignmentClass}" dir="${dirAttr}">
            <div>${column1.join("")}</div>
            <div>${column2.join("")}</div>
          </div>`;
}
