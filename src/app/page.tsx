'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { properties } from '@/data/properties';

const PropertyCard = dynamic(() => import('@/components/PropertyCard'), {
  loading: () => <div className="bg-gray-100 rounded-xl h-[500px] animate-pulse" />
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  // Memoize filter conditions
  const filterConditions = useMemo(() => ({
    type: filters.type.toLowerCase(),
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : 0,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
  }), [filters]);

  // Memoize filtered properties
  const filteredProperties = useMemo(() => {
    // First apply price and type filters (fast)
    const priceAndTypeFiltered = properties.filter(property => {
      if (filterConditions.type && property.type.toLowerCase() !== filterConditions.type) {
        return false;
      }
      if (property.price < filterConditions.minPrice || property.price > filterConditions.maxPrice) {
        return false;
      }
      return true;
    });

    // Then apply text search if needed (slower)
    if (!searchQuery) {
      return priceAndTypeFiltered;
    }

    const searchWords = searchQuery.toLowerCase().split(' ');
    return priceAndTypeFiltered.filter(property => {
      return searchWords.every(word => {
        // Check title
        if (property.title.toLowerCase().includes(word)) return true;
        // Check location
        if (property.location.toLowerCase().includes(word)) return true;
        // Check features
        if (property.features.some(feature => 
          feature.toLowerCase().includes(word)
        )) return true;
        // Check room numbers
        if (property.features.some(feature => {
          if (feature.includes('غرف') || feature.includes('غرفة')) {
            const roomCount = feature.match(/\d+/);
            return roomCount && roomCount[0] === word;
          }
          return false;
        })) return true;
        return false;
      });
    });
  }, [searchQuery, filterConditions]);

  // Memoize handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="ابحث عن عقار..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.stopPropagation()}
            className="flex-1 p-3 border rounded-lg text-right"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg text-right"
          >
            <option value="">نوع العقار</option>
            <option value="فيلا">فيلا</option>
            <option value="شقة">شقة</option>
            <option value="قصر">قصر</option>
            <option value="دوبلكس">دوبلكس</option>
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <input
            type="number"
            name="minPrice"
            placeholder="السعر الأدنى"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg text-right w-40"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="السعر الأعلى"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg text-right w-40"
          />
        </div>
      </div>

      {(searchQuery || filters.type || filters.minPrice || filters.maxPrice) && (
        <p className="mt-2 text-sm text-gray-600 text-right">
          {filteredProperties.length} نتيجة
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          {filteredProperties.map((property, index) => (
            <PropertyCard
              key={index}
              property={property}
              priority={index < 6}
            />
          ))}
        </Suspense>
      </div>
    </main>
  );
} 