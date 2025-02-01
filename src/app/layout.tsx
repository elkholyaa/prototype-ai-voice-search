// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AI Voice Search - Real Estate',
  description: 'Search properties using voice commands in Arabic/English',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <header className="p-4 bg-gray-200 flex justify-end space-x-4">
          {/* Use plain links – the app router does not support the locale prop */}
          <Link href="/ar">العربية</Link>
          <Link href="/en">English</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
