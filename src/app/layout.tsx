import type { Metadata } from 'next';
import './globals.css';

/**
 * 📌 Root Layout Component
 * -------------------------------------
 * - Provides language context to the entire application.
 * - Ensures proper HTML structure.
 * - Wraps the entire application structure.
 */
export const metadata: Metadata = {
  title: 'Property Search',
  description: 'Search properties in Arabic and English',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
} 