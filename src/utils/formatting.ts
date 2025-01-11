/**
 * @fileoverview Formatting utility functions
 * @module utils/formatting
 */

/**
 * Formats a price in Saudi Riyal
 * @param price - Price to format
 * @returns Formatted price string
 * 
 * @example
 * const formattedPrice = formatPrice(1500000); // "1,500,000 ريال"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats a date in Arabic
 * @param date - Date to format
 * @returns Formatted date string
 * 
 * @example
 * const formattedDate = formatDate(new Date()); // "١٥ يناير ٢٠٢٤"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
} 