// src/app/[locale]/layout.tsx
import '../globals.css';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Destructure locale from params (server component – async/await is allowed)
  const { locale } = params;

  // Only allow supported locales; if not, trigger a notFound page.
  if (!['ar', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
