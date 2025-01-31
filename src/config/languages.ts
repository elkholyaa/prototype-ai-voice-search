export const languages = ['ar', 'en'] as const;
export type Language = typeof languages[number];
export const defaultLanguage = 'ar';

export function isValidLanguage(lang: string): lang is Language {
  return languages.includes(lang as Language);
} 