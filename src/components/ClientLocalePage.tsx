// src/components/ClientLocalePage.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { searchProperties } from '@/utils/search';
import { Property, PropertyType } from '@/types';

// Dynamically load the PropertyCard component
const PropertyCard = dynamic(() => import('@/components/PropertyCard'), {
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[500px] animate-pulse" />
  ),
});

interface ClientLocalePageProps {
  locale: string;
  propertyList: Property[]; // propertyList comes from the server (ar or en)
}

export default function ClientLocalePage({
  locale,
  propertyList,
}: ClientLocalePageProps) {
  // Our state holds objects that extend Property with a similarityScore field.
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<
    (Property & { similarityScore: number; id: string })[]
  >([]);

  // On mount, show all properties (convert each to include similarityScore, id, title, description)
  useEffect(() => {
    const allResults = propertyList.map((property) => ({
      id: property.id.toString(), // ensure id is a string
      title: property.title,
      description: property.description,
      type: property.type as PropertyType,
      features: property.features,
      price: property.price,
      district: property.district,
      city: property.city,
      images: property.images || [],
      similarityScore: 1,
    }));
    setSearchResults(allResults);
  }, [propertyList]);

  const handleSearch = useCallback((query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // searchProperties now returns full property objects
      const results = searchProperties(query);
      setSearchResults(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while searching'
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (!query.trim()) {
        handleSearch('');
        return;
      }

      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [handleSearch]
  );

  // Generate structured query display (in Arabic)
  const getStructuredQuery = (query: string): string => {
    const parts: string[] = [];

    if (query.includes('فيلا') || query.includes('فله')) {
      parts.push(
        '<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">فيلا</span></div>'
      );
    } else if (query.includes('دوبلكس') || query.includes('دبلوكس')) {
      parts.push(
        '<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">دوبلكس</span></div>'
      );
    } else if (query.includes('شقة')) {
      parts.push(
        '<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">شقة</span></div>'
      );
    } else if (query.includes('قصر')) {
      parts.push(
        '<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">قصر</span></div>'
      );
    }

    if (query.includes('النرجس')) {
      parts.push(
        '<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">النرجس</span></div>'
      );
    } else if (query.includes('الملقا')) {
      parts.push(
        '<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">الملقا</span></div>'
      );
    } else if (query.includes('الياسمين')) {
      parts.push(
        '<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">الياسمين</span></div>'
      );
    }

    if (
      query.includes('6 غرف') ||
      query.includes('٦ غرف') ||
      query.includes('ست غرف')
    ) {
      parts.push(
        '<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">6 غرف</span></div>'
      );
    }

    if (query.includes('مسبح')) {
      parts.push(
        '<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مسبح</span></div>'
      );
    }
    if (query.includes('مجلس')) {
      parts.push(
        '<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مجلس</span></div>'
      );
    }
    if (query.includes('حديقة')) {
      parts.push(
        '<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">حديقة</span></div>'
      );
    }

    const priceMatch = query.match(/([٢٣]|2|3)\s*(?:مليون)/);
    if (priceMatch) {
      const price = priceMatch[1].replace('٢', '2').replace('٣', '3');
      parts.push(
        `<div><span class="text-red-500">الحد الأقصى للسعر</span>: <span class="text-blue-500">${price} مليون</span></div>`
      );
    }

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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 text-right">
          <h1 className="text-3xl font-bold">عقاري</h1>
          {/* Language switch can be added here if desired */}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="mb-6">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="ابحث عن العقارات..."
              value={searchQuery}
              onChange={handleSearchChange}
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

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">جاري البحث...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-right">{error}</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <p className="mt-2 mb-6 text-sm text-gray-600 text-right">
              {searchResults.length} نتيجة
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  id: property.id,
                  title: `${property.city} - حي ${property.district}`,
                  description: property.features.join('، '),
                  type: property.type as PropertyType,
                  features: property.features,
                  price: property.price,
                  city: property.city,
                  district: property.district,
                  images: property.images || [],
                }}
                priority={false}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
