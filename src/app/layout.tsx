/**
 * layout.tsx
 * =====================
 * Purpose:
 *   This is the root layout file for the bilingual real‑estate search application.
 *   It defines the global HTML structure and includes common elements such as the header.
 *
 * Role & Relation:
 *   - Wraps all pages and components of the application.
 *   - Provides a global header that now uses an improved language switch UI element.
 *   - The language switcher is implemented as a separate client component (LanguageSwitcher.tsx)
 *     that handles dynamic locale switching.
 *
 * Workflow & Design Decisions:
 *   - The layout is a server component that imports the client-side LanguageSwitcher.
 *   - The LanguageSwitcher uses the current pathname to detect the active locale and to build
 *     links for switching languages.
 *
 * Educational Comments:
 *   - This separation between server and client components allows the layout to remain static
 *     while delegating interactive behavior (such as language switching) to a client component.
 *   - The global header styling is kept simple with Tailwind CSS for quick iteration in this POC.
 */

import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata = {
  title: "AI Voice Search - Real Estate",
  description: "Search properties using voice commands in Arabic/English",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <header className="p-4 bg-gray-200 flex justify-end items-center space-x-4">
          {/* Improved language switcher that dynamically indicates the active locale */}
          <LanguageSwitcher />
        </header>
        {children}
      </body>
    </html>
  );
}
