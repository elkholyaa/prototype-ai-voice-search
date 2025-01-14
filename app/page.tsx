'use client';

import { useState } from 'react';
import Image from "next/image";
import { properties } from '../data/properties';
import { Property } from '../types';
import { formatPrice } from '../utils';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Property Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Image</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Title</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Location</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="relative h-16 w-24">
                    <Image
                      src={property.images[0] || '/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{property.title}</td>
                <td className="px-4 py-3 text-sm">{property.location}</td>
                <td className="px-4 py-3 text-sm">{formatPrice(property.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
} 