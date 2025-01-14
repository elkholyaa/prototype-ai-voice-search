export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(price);
}; 