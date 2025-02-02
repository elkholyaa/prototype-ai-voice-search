/**
 * src/utils/structuredQuery.ts
 * ============================================
 * Purpose:
 *   This file provides the function `extractStructuredQuery` which parses a raw
 *   search input string and extracts all property attributes into a structured
 *   HTML display. The attributes include property type, city, district, price info,
 *   and all additional features mentioned by the user.
 *
 * Role & Relation:
 *   - This file is used by the search UI component (ClientLocalePage.tsx) to show the
 *     structured query below the search input in real time.
 *   - It integrates with our overall search functionality by mapping natural language
 *     expressions to predefined attributes.
 *
 * Workflow:
 *   1. The function scans the entire search input string.
 *   2. It uses comprehensive dictionaries (for types, cities, districts, features, and price)
 *      to map input text to attribute values.
 *   3. Returns an HTML string that displays the structured query in two columns.
 *
 * Educational Notes:
 *   - We use a unified parsing approach to handle free-form text in an order-agnostic way.
 *   - The keyword dictionaries include variations to account for colloquial language and dialects.
 *   - This design avoids repetitive loops and ensures that all attributes are extracted in one pass.
 */

export interface StructuredQuery {
    type?: string;
    city?: string;
    district?: string;
    priceInfo?: string;
    features: string[];
    others: string[];
  }
  
  const typeMapping: { [key: string]: string } = {
    "بيوت فخمه": "فيلا",
    "فيلا": "فيلا",
    "فله": "فيلا",
    "فلة": "فيلا",
    "شقة": "شقة",
    "دوبلكس": "دوبلكس",
    "دبلوكس": "دوبلكس",
    "قصر": "قصر",
  };
  
  const cityMapping: { [key: string]: string } = {
    "الرياض": "الرياض",
    "جده": "جدة",
    "جدة": "جدة",
    "مكة": "مكة",
    "مكه": "مكة",
    "الدمام": "الدمام",
  };
  
  const districtMapping: { [key: string]: string } = {
    "النرجس": "النرجس",
    "الياسمين": "الياسمين",
    "الملقا": "الملقا",
    "العليا": "العليا",
  };
  
  const featureMapping: { [key: string]: string } = {
    "حوض سباحه": "مسبح",
    "حمام سباحه": "مسبح",
    "مسبح": "مسبح",
    "مجلس كبير": "مجلس",
    "مجلس": "مجلس",
    "حديقه": "حديقة",
    "جنينة": "حديقة",
    // Include room counts and bathroom counts as raw strings
    "ست غرف": "6 غرف",
    "٦ غرف": "6 غرف",
    "ستة غرف": "6 غرف",
    "6 غرف": "6 غرف",
    "4 غرف": "4 غرف",
    "٤ غرف": "4 غرف",
    // You can add more mappings as needed.
  };
  
  const pricePattern = /(?:تحت|ما(?:\s*يتجاوز)?|ما\s+يزيد\s+عن)\s*([٠-٩\d]+(?:\.\d+)?)(?:\s*(?:مليون|م))?/i;
  
  /**
   * Extracts a structured query from a raw search input.
   * @param query The raw search input string.
   * @returns An HTML string representing the structured query with all extracted attributes.
   */
  export function extractStructuredQuery(query: string): string {
    // Normalize query by trimming whitespace and converting to lower-case.
    const normalized = query.trim().toLowerCase();
    const structured: StructuredQuery = { features: [], others: [] };
  
    // Extract property type
    for (const key in typeMapping) {
      if (normalized.includes(key)) {
        structured.type = typeMapping[key];
        break;
      }
    }
  
    // Extract city
    for (const key in cityMapping) {
      if (normalized.includes(key)) {
        structured.city = cityMapping[key];
        break;
      }
    }
  
    // Extract district
    for (const key in districtMapping) {
      if (normalized.includes(key)) {
        structured.district = districtMapping[key];
        break;
      }
    }
  
    // Extract price info using regex
    const priceMatch = normalized.match(pricePattern);
    if (priceMatch) {
      structured.priceInfo = priceMatch[0].trim();
    }
  
    // Extract features: iterate over featureMapping and check if each key is in the query.
    for (const key in featureMapping) {
      if (normalized.includes(key)) {
        const mapped = featureMapping[key];
        if (!structured.features.includes(mapped)) {
          structured.features.push(mapped);
        }
      }
    }
  
    // Optionally, add any unmatched parts as "others"
    // (This can be enhanced to capture additional free-form attributes.)
    // For now, we leave others empty.
  
    // Format the structured query into HTML in two columns.
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
    if (structured.priceInfo) {
      parts.push(`<div><span class="text-red-500">السعر</span>: <span class="text-blue-500">${structured.priceInfo}</span></div>`);
    }
    structured.features.forEach(feature => {
      parts.push(`<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">${feature}</span></div>`);
    });
    structured.others.forEach(other => {
      parts.push(`<div><span class="text-red-500">أخرى</span>: <span class="text-blue-500">${other}</span></div>`);
    });
  
    // Split parts into two columns for a cleaner display
    const midPoint = Math.ceil(parts.length / 2);
    const column1 = parts.slice(0, midPoint);
    const column2 = parts.slice(midPoint);
  
    return `
      <div class="grid grid-cols-2 gap-2 text-right">
        <div>${column1.join('')}</div>
        <div>${column2.join('')}</div>
      </div>
    `;
  }
  