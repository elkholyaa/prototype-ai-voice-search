'use client';

import { useState } from 'react';
import SearchBox from '@/components/search-box';
import FilterBar from '@/components/filter-bar';
import PropertyList from '@/components/property-list';
import { properties as initialProperties } from '@/data/properties';
import type { Property, SearchFilters } from '@/types';

export default function Home() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = initialProperties;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      filtered = filtered.filter((property) => property.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((property) => property.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((property) => property.price <= filters.maxPrice!);
    }

    if (filters.minBedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= filters.minBedrooms!
      );
    }

    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">البحث عن العقارات</h1>
      
      <div className="space-y-6">
        <SearchBox onSearch={handleSearch} />
        <FilterBar onFilter={handleSearch} />
        <PropertyList properties={filteredProperties} />
      </div>
    </main>
  );
} 