/**
 * src/app/page.tsx
 * =====================
 * Purpose:
 *   This file serves as the entry point for the root URL ("/") of the bilingual proof‑of‑concept
 *   application. Instead of displaying a 404 error, it immediately redirects users to a default locale route.
 *
 * Role & Relation:
 *   - Acts as the root page that handles redirection.
 *   - It works together with the dynamic [locale] routes (located in src/app/[locale]/) to provide
 *     a localized experience. In this case, users are sent to the Arabic version ("/ar") by default.
 *
 * Workflow:
 *   1. When a user visits the root URL ("/"), the component immediately calls the Next.js redirect function.
 *   2. The user is then redirected to "/ar" (the Arabic locale). You can change this to "/en" if desired.
 *
 * Educational Comments:
 *   - Using the `redirect` function from "next/navigation" ensures that users do not encounter a 404
 *     page and are automatically sent to the appropriate localized route.
 *   - This approach keeps the URL structure clean and guides users into the proper context for the app.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the default language route.
  // Change '/ar' to '/en' if you want English to be the default.
  redirect('/ar');
}
