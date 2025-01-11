/**
 * @fileoverview Utility functions for the application
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with Tailwind CSS classes
 * @param inputs - Class names to merge
 * @returns Merged class names string
 * 
 * @example
 * const className = cn('text-red-500', 'bg-blue-500', { 'p-4': true });
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Debounces a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => searchProperties(query), 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
} 