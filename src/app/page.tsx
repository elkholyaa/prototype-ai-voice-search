'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { SearchResult } from './api/search/route';

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

  // Handle search API call
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
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
    
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          {filteredResults.map((property, index) => (
            <PropertyCard
              key={index}
              property={{
                ...property,
                location: `${property.district}، ${property.city}`,
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
    </main>
  );
} 