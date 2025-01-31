'use client';

import React, { useState, useEffect } from 'react';

// src/components/LanguageSwitcher.tsx
// Switches between Arabic and English with instant UI updates

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const preferredLanguage = localStorage.getItem('preferredLanguage') as 'ar' | 'en';
    if (preferredLanguage) {
      setLanguage(preferredLanguage);
      document.documentElement.lang = preferredLanguage; // Ensure correct HTML lang attribute
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang; // Update page language attribute
    window.location.reload(); // Reload to fully apply language change
  };

  return (
    <button onClick={toggleLanguage} className="p-2 bg-gray-200 rounded">
      {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    </button>
  );
} 
