import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SearchFilters } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

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
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing voice input:', error);
    return NextResponse.json({ error: 'Failed to process voice input' }, { status: 500 });
  }
} 