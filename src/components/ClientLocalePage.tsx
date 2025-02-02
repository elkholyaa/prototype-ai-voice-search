/**
 * src/components/ClientLocalePage.tsx
 * =============================================
 * Purpose:
 *   This client component renders the bilingual property listing page.
 *   It displays a search input, calls the text-based search function, and updates
 *   the property list in real time. Additionally, it shows the structured query
 *   (extracted from the search input) below the search box.
 *
 * Role & Relation:
 *   - Integrates with the search utilities (text search and the new structured query extraction).
 *   - Uses data from the server (property list) and updates via client-side state.
 *
 * Workflow:
 *   1. On mount, it displays all properties.
 *   2. As the user types in the search input, the handleSearchChange function is invoked.
 *   3. It calls the text-based search function to filter properties.
 *   4. Simultaneously, the new `extractStructuredQuery` function is called to update the structured query display.
 *
 * Educational Comments:
 *   - We removed the old inline structured query logic and replaced it with a dedicated utility.
 *   - This modular approach improves clarity, reusability, and maintainability.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
// Import the new structured query extractor
import { extractStructuredQuery } from '@/utils/structuredQuery';

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
  const [structuredQueryHtml, setStructuredQueryHtml] = useState<string>('');

  // On component mount, show all properties by default.
  useEffect(() => {
    const allResults = propertyList.map(property => ({
      ...property,
      similarityScore: 1,
      id: property.id.toString(), // Ensure id is a string for React key
    }));
    setSearchResults(allResults);
  }, [propertyList]);

  // Handle search functionality using the text-based search function.
  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Direct local search (text-based) for rapid development:
      const { searchProperties } = await import('@/utils/search');
      const results = searchProperties(query).map(r => ({ ...r, id: r.id.toString() }));
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input and update structured query in real time.
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Update the structured query display using our new extractor
    setStructuredQueryHtml(extractStructuredQuery(query));

    if (!query.trim()) {
      handleSearch('');
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

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
                // Use the structured query HTML generated from the extractor
                dangerouslySetInnerHTML={{ __html: structuredQueryHtml }}
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
