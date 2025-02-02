// src/components/ClientLocalePage.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load the PropertyCard component to reduce initial bundle size.
const PropertyCard = dynamic(() => import('@/components/PropertyCard'), {
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[500px] animate-pulse" />
  ),
});

interface ClientLocalePageProps {
  locale: string;
  propertyList: any[]; // propertyList is passed from the server (Arabic or English)
}

export default function ClientLocalePage({ locale, propertyList }: ClientLocalePageProps) {
  // State for search query, loading status, error message, and search results.
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // On component mount, show all properties by default.
  useEffect(() => {
    const allResults = propertyList.map(property => ({
      ...property,
      similarityScore: 1,
      id: property.id.toString(), // Ensure id is a string for React key
    }));
    setSearchResults(allResults);
  }, [propertyList]);

  // Rapid PoC: Temporarily disable API use.
  // Here we dynamically import and call the local text-based search function.
  // To re-enable API calls, comment out the block below and uncomment the API fetch block.
  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Direct local search (text-based) for rapid development:
      const { searchProperties } = await import('@/utils/search');
      const results = searchProperties(query).map(r => ({ ...r, id: r.id.toString() }));
      setSearchResults(results);

      // To re-enable API usage, comment out the above block and uncomment the code below:
      /*
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }
      const data = await response.json();
      const results = data.results.map((r: any) => ({ ...r, id: r.id.toString() }));
      setSearchResults(results);
      */
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the search input to reduce rapid requests.
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [handleSearch]);

  // Generate a structured query display from the user's query.
  // This helps users understand how their natural language query is being parsed.
  const getStructuredQuery = (query: string): string => {
    const parts: string[] = [];

    // Check for property type keywords.
    if (query.includes('فيلا') || query.includes('فله')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">فيلا</span></div>');
    } else if (query.includes('دوبلكس') || query.includes('دبلوكس')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">دوبلكس</span></div>');
    } else if (query.includes('شقة')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">شقة</span></div>');
    } else if (query.includes('قصر')) {
      parts.push('<div><span class="text-red-500">النوع</span>: <span class="text-blue-500">قصر</span></div>');
    }

    // Check for district keywords.
    if (query.includes('النرجس')) {
      parts.push('<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">النرجس</span></div>');
    } else if (query.includes('الملقا')) {
      parts.push('<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">الملقا</span></div>');
    } else if (query.includes('الياسمين')) {
      parts.push('<div><span class="text-red-500">الحي</span>: <span class="text-blue-500">الياسمين</span></div>');
    }

    // Check for room count keywords.
    if (query.includes('6 غرف') || query.includes('٦ غرف') || query.includes('ست غرف')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">6 غرف</span></div>');
    }

    // Check for other features.
    if (query.includes('مسبح')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مسبح</span></div>');
    }
    if (query.includes('مجلس')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">مجلس</span></div>');
    }
    if (query.includes('حديقة')) {
      parts.push('<div><span class="text-red-500">ميزة</span>: <span class="text-blue-500">حديقة</span></div>');
    }

    // Extract price-related information.
    const priceMatch = query.match(/([٢٣]|2|3)\s*(?:مليون)/);
    if (priceMatch) {
      const price = priceMatch[1].replace('٢', '2').replace('٣', '3');
      parts.push(`<div><span class="text-red-500">الحد الأقصى للسعر</span>: <span class="text-blue-500">${price} مليون</span></div>`);
    }

    // Split the parts into two columns for display.
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
                  type: property.type,
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
