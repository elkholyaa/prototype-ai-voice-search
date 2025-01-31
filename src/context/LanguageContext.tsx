'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

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

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * 🎛️ Language Provider Component
 * 
 * Wraps the application and provides **language state management**.
 * 
 * @param children - The React components inside the provider.
 * @param defaultLanguage - The default language to initialize the state.
 */
export function LanguageProvider({ children, defaultLanguage = 'ar' }: { children: React.ReactNode, defaultLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  /**
   * 🔄 Toggle Language Function
   * - Switches between **English (`en`)** and **Arabic (`ar`)**.
   */
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
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
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
