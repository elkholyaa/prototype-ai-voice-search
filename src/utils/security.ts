/**
 * @fileoverview Security utility functions
 * @module utils/security
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param content - Content to sanitize
 * @returns Sanitized content
 * 
 * @example
 * const safeHtml = sanitizeHtml('<p>Hello</p><script>alert("xss")</script>');
 * // Returns: '<p>Hello</p>'
 */
export function sanitizeHtml(content: string): string {
  if (typeof window === 'undefined') return content;
  return DOMPurify.sanitize(content);
}

/**
 * Validates and sanitizes a search query
 * @param query - Search query to validate
 * @returns Sanitized query
 * 
 * @example
 * const safeQuery = sanitizeSearchQuery('شقة في <script>alert("xss")</script> الرياض');
 * // Returns: 'شقة في الرياض'
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove HTML tags and special characters
  return query.replace(/<[^>]*>?/gm, '').replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * Validates a price value
 * @param price - Price to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * const isValid = validatePrice(1500000);
 */
export function validatePrice(price: number): boolean {
  return !isNaN(price) && price >= 0 && price <= 1000000000;
}

/**
 * Validates a location string
 * @param location - Location to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * const isValid = validateLocation('الرياض');
 */
export function validateLocation(location: string): boolean {
  return /^[\p{L}\s-]+$/u.test(location) && location.length <= 100;
} 