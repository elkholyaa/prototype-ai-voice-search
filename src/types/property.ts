/**
 * @fileoverview Type definitions for the real estate property listings and related functionality
 * @module types/property
 */

/**
 * Represents a real estate property listing in Saudi Arabia
 * @interface Property
 * @since 1.0.0
 * 
 * @property {string} id - Unique identifier for the property
 * @property {string} title - Property title in Arabic (عنوان)
 * @property {string} location - Property location including city and district (الموقع)
 * @property {number} price - Property price in Saudi Riyal (السعر)
 * @property {string} propertyType - Type of property: شقة (apartment), فيلا (villa), دوبلكس (duplex)
 * @property {string} description - Detailed property description in Arabic (وصف)
 * @property {string[]} features - List of property features in Arabic (المميزات)
 * 
 * @example
 * const property: Property = {
 *   id: '1',
 *   title: 'شقة فاخرة في حي النرجس',
 *   location: 'الرياض - حي النرجس',
 *   price: 1200000,
 *   propertyType: 'شقة',
 *   description: 'شقة حديثة في مجمع سكني راقي',
 *   features: ['3 غرف نوم', '2 حمام']
 * };
 */
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  description: string;
  features: string[];
}

/**
 * Search filter parameters for property listings
 * @interface SearchFilters
 * @since 1.0.0
 * 
 * @property {string} [location] - Optional location filter
 * @property {number} [minPrice] - Optional minimum price filter in SAR
 * @property {number} [maxPrice] - Optional maximum price filter in SAR
 * @property {string} [propertyType] - Optional property type filter
 * 
 * @example
 * const filters: SearchFilters = {
 *   location: 'الرياض',
 *   minPrice: 1000000,
 *   maxPrice: 2000000,
 *   propertyType: 'شقة'
 * };
 */
export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
}

/**
 * Props for the VoiceSearch component
 * @interface VoiceSearchProps
 * @since 1.0.0
 * 
 * @property {function} onSearchResult - Callback function when voice search results are ready
 * @property {boolean} isListening - Current listening state of the voice search
 * @property {function} setIsListening - Function to update the listening state
 * 
 * @example
 * const VoiceSearch: React.FC<VoiceSearchProps> = ({
 *   onSearchResult,
 *   isListening,
 *   setIsListening
 * }) => {
 *   // Component implementation
 * };
 */
export interface VoiceSearchProps {
  onSearchResult: (filters: SearchFilters) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
} 