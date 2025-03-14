/**
 * PropertyCard.tsx
 * =====================
 * Purpose:
 *   This component renders a single property card for the real‑estate search application.
 *   It displays the property image, title, type, price, and features.
 *
 * Role & Relation:
 *   - Used within ClientLocalePage.tsx (and any other property listing page) to show individual
 *     property details in a responsive grid.
 *   - The component now relies on the passed-in property object’s title. The title is pre‑formatted
 *     in the calling page (ClientLocalePage.tsx) so that for the English locale the prefix "حي" is removed.
 *
 * Workflow & Design Decisions:
 *   - Previously, the component hardcoded the title format as "{city} - حي {district}".
 *     This has been changed to use the pre‑formatted `property.title` so that English pages (e.g.
 *     http://localhost:3000/en) display titles like "New York - Upper East Side" (without "حي").
 *   - Educational comments have been added to explain the rationale behind these changes.
 *
 * Implementation Details:
 *   - Uses Next.js’ Image component for optimized image loading with a fallback image.
 *   - Applies Tailwind CSS for styling and responsive design.
 */

import Image from "next/image";
import { Property } from "@/types";
import { formatPrice } from "@/utils/format";

// Fallback image URL in case the property does not have any images.
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
  return (
    <article className="bg-white rounded-xl shadow overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-[300px]">
        <Image
          // Use the first image from the property’s images array if available; otherwise, use the fallback.
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
          {/* 
            Instead of re-building the title from city and district (and hardcoding the Arabic "حي"),
            we now use the pre‑formatted property.title passed in from ClientLocalePage.tsx.
            This allows the English locale to display without the "حي" prefix.
          */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {property.title}
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
