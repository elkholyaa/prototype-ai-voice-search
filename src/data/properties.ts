/**
 * src/data/properties.ts
 * ========================
 * Purpose:
 *   Exports the property data for Arabic and English.
 *   Note: The JSON files may contain id as a number. The Property type now allows string | number.
 *
 * Educational Comments:
 *   - This file imports JSON data and casts them to the Property[] type.
 */

import propertiesAr from "./static/properties-ar.json";
import propertiesEn from "./static/properties-en.json";
import { Property } from "@/types";

export const propertiesArData = propertiesAr as Property[];
export const propertiesEnData = propertiesEn as Property[];
// Default properties; not used in locale‑aware search.
export const properties = propertiesAr as Property[];
