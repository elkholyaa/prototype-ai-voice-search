// src/types/index.ts

// Updated PropertyType now includes both Arabic and English values.
export type PropertyType =
  | 'فيلا'
  | 'شقة'
  | 'قصر'
  | 'دوبلكس'
  | 'Apartment'
  | 'Villa'
  | 'Mansion'
  | 'Duplex';

export interface Property {
  // Accept either string or number to cover JSON data differences.
  id: string | number;
  title: string;
  description: string;
  type: PropertyType;
  features: string[];
  price: number;
  city: string;
  district: string;
  images?: string[];
}

export interface PropertyWithEmbedding extends Property {
  embedding: number[];  // Required in this interface
}
