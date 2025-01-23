export type PropertyType = 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  features: string[];
  price: number;
  location: string;
  images?: string[];
  city?: string;
  district?: string;
} 