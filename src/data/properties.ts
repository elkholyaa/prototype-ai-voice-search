// src/data/properties.ts

import propertiesAr from './static/properties-ar.json';
import propertiesEn from './static/properties-en.json';
import { Property } from '@/types';

// Cast the imported JSON arrays to Property[]
export const properties = propertiesAr as Property[];
export const propertiesArData = propertiesAr as Property[];
export const propertiesEnData = propertiesEn as Property[];
