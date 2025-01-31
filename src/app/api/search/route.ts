import { searchProperties } from "@/utils/search";
import { NextResponse } from "next/server";

/**
 * 📌 API Route: Search Properties
 * -------------------------------------
 * - Handles search requests and returns results based on user queries.
 * - Loads the correct dataset (`properties-ar.json` or `properties-en.json`) based on `lang` parameter.
 * - Supports **Arabic price filtering (`اقل من`, `تحت`, `ما يزيد`)**.
 * - Ensures **bilingual dataset separation** (Arabic searches do not return English properties and vice versa).
 *
 * 🔹 Used in:
 * - `page.tsx` → Calls this API when the user enters a search query.
 * - `search.test.ts` → Tests search logic for correctness.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const language = searchParams.get("lang") || "ar"; // Default to Arabic

  // Ensure only valid language values are accepted
  if (!["ar", "en"].includes(language)) {
    return NextResponse.json({ error: "Invalid language parameter" }, { status: 400 });
  }

  // Fetch search results from the correct dataset
  const results = searchProperties(query, language);

  return NextResponse.json(results);
}