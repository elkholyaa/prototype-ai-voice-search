export type PropertyType = 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';

export interface Property {
  id: string;
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
  embedding: number[];
} 