export interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  features: string[];
  images: string[];
  description: string;
}

// To be implemented in next task:
// export interface PropertyWithEmbedding extends Property {
//   embedding: number[];       // OpenAI text embedding vector
// } 