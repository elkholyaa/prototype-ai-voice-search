/**
 * @fileoverview Style utility functions
 * @module utils/styles
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