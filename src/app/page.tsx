import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { Property } from '@/types';

/**
 * 📌 Home Page Component (Search UI)
 * -------------------------------------
 * - Implements **bilingual support** for the search interface.
 * - Dynamically **switches UI text** based on selected language.
 * - Ensures **RTL (Arabic) and LTR (English) compatibility**.
 * - **Fetches search results** while preserving existing functionality.
 * 
 * 🔹 Uses:
 * - `LanguageContext.tsx` → Manages language selection.
 * - `/api/search` → Fetches results from the correct dataset.
 */

const translations = {
  en: {
    searchPlaceholder: "Search for properties...",
    results: "Results",
    noResults: "No results found",
    toggleLanguage: "Switch to Arabic",
  },
  ar: {
    searchPlaceholder: "ابحث عن العقارات...",
    results: "نتيجة",
    noResults: "لم يتم العثور على نتائج",
    toggleLanguage: "التبديل إلى الإنجليزية",
  },
};

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true);
      fetch(`/api/search?query=${query}&lang=${language}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query, language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Toggle Button */}
      <div className="container mx-auto px-4 py-6 flex justify-between">
        <h1 className="text-2xl font-semibold">{language === "ar" ? "البحث عن العقارات" : "Property Search"}</h1>
        <button onClick={toggleLanguage} className="bg-gray-200 p-2 rounded-md">
          {t.toggleLanguage}
        </button>
      </div>

      {/* Search Input */}
      <div className="container mx-auto px-4 py-6">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full p-4 border border-gray-300 rounded-lg ${
            language === 'ar' ? 'rtl text-right' : 'ltr text-left'
          }`}
        />
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-500">{language === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
        ) : results.length > 0 ? (
          results.map((property) => (
            <div key={property.id} className="p-4 border-b">
              <h3 className="text-lg font-bold">{property.title}</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>
          ))
        ) : (
          query.length > 1 && <p className="text-center text-gray-500">{t.noResults}</p>
        )}
      </div>
    </div>
  );
}
