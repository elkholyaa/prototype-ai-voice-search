'use client';

import { useState } from 'react';
import properties from '../../data/static/properties-ar.json';

export default function ArabicHome() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-right mb-6">البحث عن العقارات</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن العقارات..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-8 rtl text-right"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-right mb-2">{property.title}</h2>
                <p className="text-gray-600 text-right mb-2">{property.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">{property.price} درهم</span>
                  <span className="text-gray-500">{property.city}, {property.district}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 