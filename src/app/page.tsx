'use client';

import { useState } from 'react';
import Image from "next/image";
import { properties } from '@/data/properties';
import { Property } from '@/types';
import { formatPrice } from '@/utils/format';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  // Enhanced text-based filtering
  const filteredProperties = properties.filter(property => {
    if (!searchQuery && !filters.type && !filters.minPrice && !filters.maxPrice) {
      return true;
    }

    const query = searchQuery.toLowerCase();
    const words = query.split(/\s+/);

    // Check if all words match somewhere in the property data
    const matchesSearch = !searchQuery || words.every(word => {
      // Match in title
      if (property.title.toLowerCase().includes(word)) return true;
      
      // Match in location (city or district)
      if (property.location.toLowerCase().includes(word)) return true;
      
      // Match in features
      if (property.features.some(f => f.toLowerCase().includes(word))) return true;

      // Match room numbers
      const roomMatch = property.features.find(f => f.includes('غرف'))?.match(/\d+/);
      if (roomMatch && word === roomMatch[0]) return true;

      // Match property type
      if (property.type.toLowerCase().includes(word)) return true;

      return false;
    });

    const matchesType = !filters.type || property.type === filters.type;
    
    const matchesPrice =
      (!filters.minPrice || property.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || property.price <= parseInt(filters.maxPrice));

    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-right">العقارات المتاحة</h1>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="mb-6">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="ابحث عن العقارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(searchQuery || filters.type || filters.minPrice || filters.maxPrice) && (
              <p className="mt-2 text-sm text-gray-600 text-right">
                {filteredProperties.length} نتيجة
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              id="propertyType"
              name="propertyType"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="فيلا">فيلا</option>
              <option value="شقة">شقة</option>
              <option value="قصر">قصر</option>
              <option value="دوبلكس">دوبلكس</option>
            </select>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="الحد الأدنى للسعر"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="الحد الأقصى للسعر"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property: Property, index: number) => (
            <article key={property.id} className="bg-white rounded-xl shadow overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-[300px]">
                <Image
                  src={property.images[0] || '/placeholder.jpg'}
                  alt={property.title}
                  fill
                  priority={index < 6}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-row-reverse justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {property.type}
                  </span>
                </div>
                <div className="space-y-3 text-right">
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(property.price)} ريال
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end mt-4">
                  {property.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 