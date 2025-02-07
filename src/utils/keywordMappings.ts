/**
 * src/utils/keywordMappings.ts
 * ============================================
 * Purpose:
 *   This file provides centralized mapping dictionaries that convert various natural language
 *   variations into standardized property attribute keywords. These mappings ensure consistent
 *   extraction of property attributes (such as property type, city, district, and features) 
 *   from user search queries.
 *
 * Role & Relation:
 *   - Used by parsing utilities (for example, in structuredQuery.ts and search.ts) to map free-form
 *     user input into consistent attribute values.
 *   - Centralizing these mappings makes it easier to update or add new variations in one place.
 *
 * Workflow:
 *   1. Each dictionary object maps multiple possible variations (keys) to a standardized value.
 *   2. For example, different spellings of "فيلا" (e.g. "فيلا", "فله", "فلة") are all mapped to "فيلا".
 *   3. Similarly, the featureMapping includes room count variations and other feature keywords.
 *
 * Educational Comments:
 *   - This modular approach simplifies future updates. To add a new variation,
 *     simply add a new key/value pair in the corresponding mapping.
 *   - In this update, the term "وحوش" has been added to the featureMapping and is mapped to "حديقة".
 */

export const typeMapping: { [key: string]: string } = {
  "بيوت فخمه": "فيلا",
  "فيلا": "فيلا",
  "فله": "فيلا",
  "فلة": "فيلا",
  "شقة": "شقة",
  "دوبلكس": "دوبلكس",
  "دبلوكس": "دوبلكس",
  "قصر": "قصر",
};

export const cityMapping: { [key: string]: string } = {
  "الرياض": "الرياض",
  "جده": "جدة",
  "جدة": "جدة",
  "مكة": "مكة",
  "مكه": "مكة",
  "الدمام": "الدمام",
};

export const districtMapping: { [key: string]: string } = {
  "النرجس": "النرجس",
  "الياسمين": "الياسمين",
  "الملقا": "الملقا",
  "العليا": "العليا",
};

export const featureMapping: { [key: string]: string } = {
  "حوض سباحه": "مسبح",
  "حمام سباحه": "مسبح",
  "مسبح": "مسبح",
  "مجلس كبير": "مجلس",
  "مجلس": "مجلس",
  "حديقه": "حديقة",
  "جنينة": "حديقة",
  // Room and bathroom counts:
  "ست غرف": "6 غرف",
  "ستة غرف": "6 غرف",
  "سته غرف": "6 غرف", // Added missing variation "سته غرف"
  "٦ غرف": "6 غرف",
  "6 غرف": "6 غرف",
  "4 غرف": "4 غرف",
  "٤ غرف": "4 غرف",
  // New mapping: Map "وحوش" to "حديقة"
  "وحوش": "حديقة",
};
