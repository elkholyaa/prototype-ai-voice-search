/**
 * LanguageSwitcher.tsx
 * =====================
 * Purpose:
 *   This component provides an improved UI element for switching between Arabic and English.
 *   It displays two buttons that allow the user to toggle between the locales. The active language
 *   button is highlighted.
 *
 * Role & Relation:
 *   - Used in the global layout (src/app/layout.tsx) to let users switch the app's language.
 *   - It reads the current URL pathname using Next.js's usePathname hook and computes the correct
 *     link for each language.
 *
 * Workflow & Design Decisions:
 *   - The component is declared as a client component (using "use client") because it uses hooks
 *     (usePathname) for dynamic behavior.
 *   - We extract the locale from the pathname assuming that the URL structure is /{locale}/...
 *     and then rebuild the URL to switch the locale.
 *   - Tailwind CSS classes are used to style the buttons and to highlight the active language.
 *
 * Educational Comments:
 *   - Separating this functionality into a dedicated client component keeps our server‑side layout
 *     simple and focused on static rendering while the interactive part is isolated.
 *   - Conditional styling using Tailwind makes it easy to indicate the active language.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  // Retrieve the current pathname to determine the active locale.
  const pathname = usePathname() || "/";
  
  // Determine current locale based on the pathname prefix.
  const isArabic = pathname.startsWith("/ar");
  const isEnglish = pathname.startsWith("/en");

  // Generate a new path by switching the locale.
  // Assumes the URL structure is "/{locale}/..."
  const getSwitchPath = (lang: "ar" | "en") => {
    const segments = pathname.split("/");
    // If the first segment (after the slash) is a recognized locale, replace it.
    if (segments.length > 1 && (segments[1] === "ar" || segments[1] === "en")) {
      segments[1] = lang;
    } else {
      // Otherwise, insert the locale after the empty first segment.
      segments.splice(1, 0, lang);
    }
    return segments.join("/") || "/";
  };

  return (
    <div className="flex space-x-2">
      {/* Button for Arabic */}
      <Link
        href={getSwitchPath("ar")}
        className={`px-4 py-2 rounded transition-colors duration-300 ${
          isArabic ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        العربية
      </Link>
      {/* Button for English */}
      <Link
        href={getSwitchPath("en")}
        className={`px-4 py-2 rounded transition-colors duration-300 ${
          isEnglish ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        English
      </Link>
    </div>
  );
}
