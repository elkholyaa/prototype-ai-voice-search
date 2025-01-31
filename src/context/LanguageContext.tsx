import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * 📌 Language Context
 * -------------------------------------
 * - Manages the **selected language** (English or Arabic).
 * - Provides a **toggle function** to switch between languages.
 * - Ensures **language persistence** across the app.
 * 
 * 🔹 Used in:
 * - `layout.tsx` → Sets the `lang` attribute dynamically.
 * - `page.tsx` → Allows UI elements to update based on language.
 */

type Language = 'en' | 'ar';

const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void }>({
  language: 'ar', // Default language is Arabic
  toggleLanguage: () => {}, // Placeholder function
});

/**
 * 🎛️ Language Provider Component
 * 
 * Wraps the application and provides **language state management**.
 * 
 * @param children - The React components inside the provider.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  /**
   * 🔄 Toggle Language Function
   * - Switches between **English (`en`)** and **Arabic (`ar`)**.
   */
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 🔹 Custom Hook: `useLanguage()`
 * - Allows **easy access** to the current language and toggle function.
 */
export const useLanguage = () => useContext(LanguageContext);
