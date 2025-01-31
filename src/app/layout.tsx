import { useLanguage } from '@/context/LanguageContext';

/**
 * 📌 Root Layout Component
 * -------------------------------------
 * - Dynamically sets the **`lang` attribute** for correct RTL/LTR handling.
 * - Ensures UI updates automatically when **language toggles**.
 * - Wraps the entire application structure.
 * 
 * 🔹 Used in:
 * - `LanguageContext.tsx` → Fetches the current language state.
 * - `page.tsx` → Ensures bilingual UI adjustments.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <html lang={language}>
      <body>{children}</body>
    </html>
  );
}
