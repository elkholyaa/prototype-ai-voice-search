/**
 * Formats a number as a price with thousands separators
 * @param price - The price to format
 * @returns The formatted price string
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ar-SA');
} 