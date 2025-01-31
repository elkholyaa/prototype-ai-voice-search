export const languages = ['en', 'ar'] as const;
export const defaultLanguage = 'ar';

export function isValidLanguage(lang: string): lang is 'en' | 'ar' {
  return languages.includes(lang as any);
} 