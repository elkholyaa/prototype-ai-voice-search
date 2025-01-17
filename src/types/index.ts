export interface Property {
  id: number;
  title: string;
  type: "فيلا" | "شقة" | "قصر" | "دوبلكس";
  location: string;
  price: number;
  features: string[];
  images: string[];
  description: string;
  embedding?: number[];  // Optional for backward compatibility
}

export interface PropertyWithEmbedding extends Property {
  embedding: number[];  // Required in this interface
} 