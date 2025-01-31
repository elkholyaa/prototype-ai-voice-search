'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Language } from '@/config/languages';

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

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
});

/**
 * 🎛️ Language Provider Component
 * 
 * Wraps the application and provides **language state management**.
 * 
 * @param children - The React components inside the provider.
 * @param defaultLanguage - The default language to initialize the state.
 */
export function LanguageProvider({ children, defaultLanguage }: { children: ReactNode; defaultLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  /**
   * 🔄 Toggle Language Function
   * - Switches between **English (`en`)** and **Arabic (`ar`)**.
   */
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    window.location.href = `/${newLang}`;
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
