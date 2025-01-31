import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { languages, isValidLanguage, defaultLanguage } from '@/config/languages';

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const validLang = isValidLanguage(lang) ? lang : defaultLanguage;
  
  return (
    <html lang={validLang}>
      <body>
        <LanguageProvider defaultLanguage={validLang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 