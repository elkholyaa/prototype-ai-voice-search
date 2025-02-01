import Image from "next/image";
import { Property } from '@/types';
import { formatPrice } from '@/utils/format';

/*
  PropertyCard.tsx
  =====================
  Purpose: Displays a single property card in the UI.
  Relation: Used in pages to show property listings.
  Workflow: Receives a property object and renders its image, title, type, price, and features.
  Note: Supports bilingual display by relying on unified property attributes.
        Context-specific attributes (e.g., 'majlis' in Arabic vs 'Living Room' in English) are handled by the data files.
*/

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800';

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
  return (
    <article className="bg-white rounded-xl shadow overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-[300px]">
        <Image
          src={property.images && property.images.length > 0 ? property.images[0] : FALLBACK_IMAGE}
          alt={property.title || 'Property Image'}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-row-reverse justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {property.city} - حي {property.district}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {property.type}
          </span>
        </div>
        <div className="space-y-3 text-right">
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {formatPrice(property.price)} {property.type === "Apartment" ? "USD" : "ريال"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end mt-4">
          {property.features?.map((feature: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
