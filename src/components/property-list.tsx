'use client';

import Image from 'next/image';
import type { Property } from '@/types';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لم يتم العثور على عقارات</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="relative w-1/3 min-h-[200px]">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                <span className="text-primary font-bold text-lg">
                  {property.price.toLocaleString('ar-SA')} ريال
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">{property.location}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded">{property.type}</span>
                <span>{property.area} م²</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.bedrooms}</span>
                  <span>غرف</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span>حمامات</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.features.length}</span>
                  <span>مميزات</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {property.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {property.features.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{property.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 