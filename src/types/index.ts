export interface Property {
  id: number;
  type: 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';
  title: string;
  description: string;
  price: number;
  location: string;
  features: string[];
  images: string[];
}

export interface PropertyWithEmbedding extends Property {
  embedding: number[];  // Required in this interface
} 