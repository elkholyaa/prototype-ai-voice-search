'use client';

import { useState } from 'react';
import type { SearchFilters } from '@/types';

interface FilterBarProps {
  onFilter: (filters: SearchFilters) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleChange = (key: keyof SearchFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        value={filters.type || ''}
        onChange={(e) => handleChange('type', e.target.value)}
        className="p-2 rounded-lg border border-gray-300"
      >
        <option value="">نوع العقار</option>
        <option value="شقة">شقة</option>
        <option value="فيلا">فيلا</option>
        <option value="دوبلكس">دوبلكس</option>
      </select>

      <input
        type="number"
        placeholder="السعر الأدنى"
        value={filters.minPrice || ''}
        onChange={(e) => handleChange('minPrice', Number(e.target.value))}
        className="p-2 rounded-lg border border-gray-300"
      />

      <input
        type="number"
        placeholder="عدد الغرف"
        value={filters.minBedrooms || ''}
        onChange={(e) => handleChange('minBedrooms', Number(e.target.value))}
        className="p-2 rounded-lg border border-gray-300"
      />

      <input
        type="number"
        placeholder="المساحة (متر مربع)"
        value={filters.minArea || ''}
        onChange={(e) => handleChange('minArea', Number(e.target.value))}
        className="p-2 rounded-lg border border-gray-300"
      />
    </div>
  );
} 