"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { extractStructuredQuery } from "@/utils/structuredQuery";

const PropertyCard = dynamic(() => import("@/components/PropertyCard"), {
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[500px] animate-pulse" />
  ),
});

interface ClientLocalePageProps {
  locale: string;
  propertyList: any[]; // propertyList is passed from the server (English or Arabic)
}

export default function ClientLocalePage({ locale, propertyList }: ClientLocalePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [structuredQueryHtml, setStructuredQueryHtml] = useState<string>("");

  // On component mount, show all properties by default.
  useEffect(() => {
    const allResults = propertyList.map((property: any) => ({
      ...property,
      similarityScore: 1,
      id: property.id,
    }));
    setSearchResults(allResults);
  }, [propertyList]);

  // Handle search functionality using the text-based search function.
  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { searchProperties } = await import("@/utils/search");
      const results = searchProperties(query, locale).map((r: any) => ({ ...r, id: r.id }));
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  // Debounce search input and update structured query in real time.
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setStructuredQueryHtml(extractStructuredQuery(query, locale === "en" ? "en" : "ar"));

    if (!query.trim()) {
      handleSearch("");
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [handleSearch, locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 text-right">
          <h1 className="text-3xl font-bold">{locale === "en" ? "Real Estate Search" : "عقاري"}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="mb-6">
            <input
              type="text"
              id="search"
              name="search"
              placeholder={locale === "en" ? "Search properties..." : "ابحث عن العقارات..."}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <div
                className="mt-2 text-sm"
                dir={locale === "en" ? "ltr" : "rtl"}
                dangerouslySetInnerHTML={{ __html: structuredQueryHtml }}
              />
            )}
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">{locale === "en" ? "Searching..." : "جاري البحث..."}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <p className="mt-2 mb-6 text-sm text-gray-600">
              {searchResults.length} {locale === "en" ? "result" : "نتيجة"}{searchResults.length > 1 ? (locale === "en" ? "s" : "") : ""}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={{
                  id: property.id,
                  title: `${property.city} - ${locale === "en" ? property.district : "حي " + property.district}`,
                  description: property.features.join(locale === "en" ? ", " : "، "),
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
