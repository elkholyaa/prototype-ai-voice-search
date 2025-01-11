/**
 * @fileoverview Type definitions for the application
 */

/**
 * Property interface representing a real estate listing
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: 'شقة' | 'فيلا' | 'دوبلكس';
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
}

/**
 * Search filters for property listings
 */
export interface SearchFilters {
  query?: string;
  type?: Property['type'];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  location?: string;
}

/**
 * Props for the voice search component
 */
export interface VoiceSearchProps {
  onResult: (text: string) => void;
  onError?: (error: Error) => void;
  isListening?: boolean;
}

/**
 * Property card component props
 */
export interface PropertyCardProps {
  property: Property;
}

/**
 * Property list component props
 */
export interface PropertyListProps {
  properties: Property[];
} 