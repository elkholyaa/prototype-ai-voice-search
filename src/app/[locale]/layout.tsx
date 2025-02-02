// src/app/[locale]/layout.tsx
//
// Educational Note:
// In Next.js 15+, dynamic route parameters (props.params) might be asynchronous.
// Therefore, before using any property (like params.locale), you must await the params.
// One way to fix this is to declare params as a Promise in our type and then await it
// inside the async component. This allows Next.js to resolve the dynamic params first.

import '../globals.css';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  // Declare that params will resolve to an object with a locale string.
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Await the params before destructuring.
  const { locale } = await params;
  
  // Validate that the locale is one of the supported ones.
  if (!['ar', 'en'].includes(locale)) {
    notFound();
  }
  
  // Render the children.
  return <>{children}</>;
}
