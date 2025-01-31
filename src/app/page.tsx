'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types';
import { searchProperties, SearchResult } from '@/utils/search';
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
    // Temporarily using direct search while API is disabled
    const results = searchProperties('');
    setSearchResults(results);
    
    /* API-based implementation - temporarily disabled
    const initialProperties = properties.map(property => {
      const roomFeature = property.features.find(f => f.includes('غرف') || f.includes('غرفة'));
      const rooms = roomFeature ? parseInt(roomFeature.match(/\d+/)?.[0] || '0') : 0;
      
      return {
        ...property,
        rooms,
        similarityScore: 1 // Default score for initial properties
      };
    });
    setSearchResults(initialProperties);
    */
  }, []);

  const handleSearch = useCallback((query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Temporarily using direct search while API is disabled
      const results = searchProperties(query);
      setSearchResults(results);

      /* API-based implementation - temporarily disabled
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }

      const data = await response.json();
      setSearchResults(data.results);
      */
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
    const price = Number(property.price);
    if (filters.minPrice && price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && price > Number(filters.maxPrice)) {
      return false;
    }
    return true;
  });

  // Function to structure the query
  const getStructuredQuery = (query: string): string => {
    const parts: string[] = [];
    
    // Property Type and Location (Column 1)
    if (query.includes('فيلا') || query.includes('فله') || query.includes('بيوت فخمه')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">فيلا</span></div>');
    } else if (query.includes('دوبلكس') || query.includes('دبلوكس')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">دوبلكس</span></div>');
    }

    if (query.includes('النرجس') || query.includes('بالنرجس')) {
      parts.push('<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">النرجس</span></div>');
    } else if (query.includes('جده') || query.includes('جدة')) {
      parts.push('<div><span class="text-red-500">المدينة</span>: <span class="text-blue-500">جدة</span></div>');
    }

    // Features and Price (Column 2)
    if (query.includes('6 غرف') || query.includes('٦ غرف') || 
        query.includes('ست غرف') || query.includes('سته غرف') || 
        query.includes('و6 غرف') || query.includes('و٦ غرف')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">6 غرف</span></div>');
    }

    if (query.includes('مسبح') || query.includes('حوض سباح')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مسبح</span></div>');
    }
    if (query.includes('مجلس')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مجلس</span></div>');
    }
    if (query.includes('حديقه') || query.includes('حديقة') || query.includes('حوش')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">حديقة</span></div>');
    }

    // Price - ensure consistent label
    const priceMatch = query.match(/([٢٣]|2|3)\s*مليو[وn]?/);
    if (priceMatch) {
      const price = priceMatch[1].replace('٢', '2').replace('٣', '3');
      if (query.match(/(اقل من|تحت|ما تطلع فوق|ما يزيد|لا يزيد|معقول)/)) {
        parts.push(`<div><span class="text-red-500">الحد الأقصى للسعر</span>: <span class="text-blue-500">${price} مليون</span></div>`);
      }
    }

    // Split parts into two columns
    const midPoint = Math.ceil(parts.length / 2);
    const column1 = parts.slice(0, midPoint);
    const column2 = parts.slice(midPoint);

    return `
      <div class="grid grid-cols-2 gap-2 text-right">
        <div>${column1.join('')}</div>
        <div>${column2.join('')}</div>
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-right">
            jعقاري
          </h1>
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
            {searchQuery && (
              <div 
                className="mt-2 text-sm" 
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: getStructuredQuery(searchQuery) }}
              />
            )}
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
                  id: `search-result-${index}`,
                  title: `${property.city} - حي ${property.district}`,
                  description: property.features.join('، '),
                  type: property.type,
                  features: property.features,
                  price: Number(property.price),
                  city: property.city,
                  district: property.district,
                  images: property.images || []
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