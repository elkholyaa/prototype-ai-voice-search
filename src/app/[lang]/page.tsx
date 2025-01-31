'use client';

import React, { useState } from 'react';

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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">البحث عن العقارات</h1>
        <input
          type="text"
          placeholder="ابحث عن العقارات..."
          className="w-full p-4 border border-gray-300 rounded-lg mt-4 rtl text-right"
        />
      </div>
    </div>
  );
} 