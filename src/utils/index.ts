/**
 * @fileoverview Utility functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

/**
 * Merges Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats price in Saudi Riyal
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats date in Arabic
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

/**
 * Sanitizes HTML content
 */
export function sanitizeHtml(content: string): string {
  if (typeof window === 'undefined') return content;
  return DOMPurify.sanitize(content);
}

/**
 * Sanitizes search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query.replace(/<[^>]*>?/gm, '').replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * Validates price
 */
export function validatePrice(price: number): boolean {
  return !isNaN(price) && price >= 0 && price <= 1000000000;
}

/**
 * Validates location
 */
export function validateLocation(location: string): boolean {
  return /^[\p{L}\s-]+$/u.test(location) && location.length <= 100;
} 