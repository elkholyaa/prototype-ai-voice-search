import './globals.css';

export const metadata = {
  title: 'AI Voice Search - Real Estate',
  description: 'Search properties using voice commands in Arabic',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
} 