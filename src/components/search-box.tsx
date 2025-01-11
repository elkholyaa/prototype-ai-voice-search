'use client';

import { useState } from 'react';
import { Search, Mic, MicOff } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { processVoiceInput } from '@/lib/openai';
import type { SearchFilters } from '@/types';

interface SearchBoxProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query });
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      speechService.stop();
      setIsListening(false);
    } else {
      speechService.start(
        async (text) => {
          setQuery(text);
          setIsListening(false);
          const filters = await processVoiceInput(text);
          onSearch(filters);
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن عقار..."
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          dir="rtl"
        />
        <button
          type="submit"
          className="absolute left-2 p-2 text-gray-500 hover:text-primary"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={toggleVoiceSearch}
          className="absolute right-2 p-2 text-gray-500 hover:text-primary"
        >
          {isListening ? (
            <MicOff className="h-5 w-5 text-red-500" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
} 