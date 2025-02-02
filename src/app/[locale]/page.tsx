// src/app/[locale]/page.tsx
//
// Educational Note:
// Similarly, in this async page component, we must await the dynamic params before
// using their properties. This change prevents the error about accessing params.locale
// synchronously.

import ClientLocalePage from '@/components/ClientLocalePage';
import { propertiesArData, propertiesEnData } from '@/data/properties';

interface PageProps {
  // Declare that params will resolve to an object with a locale string.
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
  // Await the params before using them.
  const { locale } = await params;
  
  // Choose the correct property list based on the locale.
  const propertyList = locale === 'en' ? propertiesEnData : propertiesArData;
  
  return <ClientLocalePage locale={locale} propertyList={propertyList} />;
}
