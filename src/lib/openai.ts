/**
 * OpenAI service for processing voice input and extracting search parameters
 */
import { SearchFilters } from '@/types';

export async function processVoiceInput(text: string): Promise<SearchFilters> {
  try {
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to process voice input');
    }

    const data = await response.json();
    return {
      query: text,
      location: data.location,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      type: data.propertyType,
    };
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw error;
  }
} 