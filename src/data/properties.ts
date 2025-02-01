/*
 * properties.ts
 * =====================
 * Purpose: This file exports property data for the application.
 * It imports the Arabic property data from 'properties-ar.json' and the English property data
 * from 'properties-en.json'. By default, it exports 'properties' as the Arabic property data,
 * but it also provides named exports 'propertiesArData' and 'propertiesEnData' so that the app
 * can switch between languages.
 *
 * Usage: Import { properties } from '@/data/properties' to use the Arabic data by default.
 *        Alternatively, use the named exports to access the specific dataset.
 */

import propertiesAr from './static/properties-ar.json';
import propertiesEn from './static/properties-en.json';

export const properties = propertiesAr;
export const propertiesArData = propertiesAr;
export const propertiesEnData = propertiesEn;
