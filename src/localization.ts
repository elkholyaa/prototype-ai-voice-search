/*
 * localization.ts
 * =====================
 * Purpose: Provides bilingual (Arabic and English) translation dictionaries for the UI.
 * Relation: Used by UI components (e.g., PropertyCard.tsx, page.tsx) to display text in the selected language.
 * Workflow: Language selection triggers UI re-rendering using these dictionaries.
 */

export const translations = {
    ar: {
      welcome: 'مرحبا',
      search: 'بحث',
      no_results: 'لا توجد نتائج',
      language: 'اللغة',
      property_title: 'العنوان',
      price: 'السعر',
      city: 'المدينة',
      district: 'الحي',
      majlis: 'مجلس'
    },
    en: {
      welcome: 'Welcome',
      search: 'Search',
      no_results: 'No results found',
      language: 'Language',
      property_title: 'Title',
      price: 'Price',
      city: 'City',
      district: 'District',
      // For USA properties, we replace the Arabic-specific "majlis" with an attribute relevant to USA listings.
      living_room: 'Living Room'
    }
  };
  