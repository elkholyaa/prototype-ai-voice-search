/**
 * @fileoverview OpenAI API integration for processing voice input
 * @module lib/api/openai
 */

import OpenAI from 'openai';
import { SearchFilters } from '@/types/property';

/**
 * OpenAI client configuration
 * @private
 */
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

/**
 * Processes Arabic voice input using OpenAI to extract search parameters
 * @param text - The transcribed voice input in Arabic
 * @returns Promise<SearchFilters> - Structured search parameters
 */
export async function processVoiceInput(text: string): Promise<SearchFilters> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts real estate search parameters from Arabic text. Return JSON only.'
        },
        {
          role: 'user',
          content: `Extract search parameters from: ${text}`
        }
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return {
      location: result.location,
      minPrice: result.minPrice,
      maxPrice: result.maxPrice,
      propertyType: result.propertyType,
    };
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw error;
  }
} 