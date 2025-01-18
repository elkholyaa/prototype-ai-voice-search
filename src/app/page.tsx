'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { SearchResult } from '@/utils/search';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Load initial properties
  useEffect(() => {
    // Convert properties to SearchResult format
    const initialProperties = properties.map(property => {
      const [city = '', district = ''] = property.location.split('،').map(s => s.trim());
      const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
      const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;
      
      return {
        ...property,
        city,
        district,
        rooms,
        similarityScore: 1 // Default score for initial properties
      };
    });
    setSearchResults(initialProperties);
  }, []);

  // Handle search API call
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Show all properties when search is cleared
      const initialProperties = properties.map(property => {
        const [city = '', district = ''] = property.location.split('،').map(s => s.trim());
        const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
        const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;
        
        return {
          ...property,
          city,
          district,
          rooms,
          similarityScore: 1
        };
      });
      setSearchResults(initialProperties);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If query is empty, reset immediately
    if (!query.trim()) {
      handleSearch('');
      return;
    }
    
    // Debounce non-empty queries
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [handleSearch]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Filter search results
  const filteredResults = searchResults.filter(property => {
    if (filters.type && property.type.toLowerCase() !== filters.type.toLowerCase()) {
      return false;
    }
    const price = property.price || 0;
    if (filters.minPrice && price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-right">العقارات المتاحة</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="mb-6">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="ابحث عن العقارات..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              id="propertyType"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
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
              onChange={handleFilterChange}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="الحد الأقصى للسعر"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-4 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">جاري البحث...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-right">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {searchResults.length > 0 && (
          <p className="mt-2 mb-6 text-sm text-gray-600 text-right">
            {filteredResults.length} نتيجة
          </p>
        )}

        {/* No Results State */}
        {searchQuery && !isLoading && searchResults.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600">لم يتم العثور على نتائج</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<div className="bg-white rounded-xl shadow animate-pulse h-[500px]" />}>
            {filteredResults.map((property, index) => (
              <PropertyCard
                key={index}
                property={{
                  ...property,
                  location: `${property.district}، ${property.city}`,
                  images: property.images || [],
                }}
                priority={index < 6}
              />
            ))}
          </Suspense>
        </div>

        {/* Development Mode: Show Similarity Scores */}
        {process.env.NODE_ENV === 'development' && searchResults.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-right">درجات التطابق (وضع التطوير)</h3>
            <div className="space-y-2">
              {filteredResults.map((property, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-blue-600">{(property.similarityScore * 100).toFixed(1)}%</span>
                  <span className="text-gray-700">{property.type} - {property.district}، {property.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 