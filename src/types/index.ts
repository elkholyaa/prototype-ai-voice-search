export interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  features: string[];
  images: string[];
}

export interface PropertySearchQuery {
  type?: string;
  location?: string;
  features?: string[];
  price?: {
    min?: number;
    max?: number;
  };
}

export interface NLPResult {
  query: PropertySearchQuery;
  confidence: number;
} 