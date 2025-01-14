import { Property } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    location: 'Downtown',
    type: 'Apartment',
    price: 500000,
    features: ['2 Bedrooms', '2 Bathrooms', 'Parking'],
    images: ['/placeholder.jpg']
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    location: 'Suburbs',
    type: 'House',
    price: 750000,
    features: ['4 Bedrooms', '3 Bathrooms', 'Garden'],
    images: ['/placeholder.jpg']
  },
  {
    id: '3',
    title: 'Luxury Penthouse',
    location: 'City Center',
    type: 'Penthouse',
    price: 1200000,
    features: ['3 Bedrooms', '3 Bathrooms', 'Terrace'],
    images: ['/placeholder.jpg']
  }
]; 