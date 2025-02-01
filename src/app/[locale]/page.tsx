// src/app/[locale]/page.tsx
import ClientLocalePage from '@/components/ClientLocalePage';
import { propertiesArData, propertiesEnData } from '@/data/properties';

interface PageProps {
  params: { locale: string };
}

export default function LocalePage({ params }: PageProps) {
  const { locale } = params;
  // Select the correct property data based on locale.
  const propertyList = locale === 'en' ? propertiesEnData : propertiesArData;
  return <ClientLocalePage locale={locale} propertyList={propertyList} />;
}
