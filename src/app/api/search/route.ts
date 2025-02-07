/**
 * src/app/api/search/route.ts
 *
 * Purpose:
 *   Implements the API endpoint for search. For this PoC, the endpoint uses the text‑based search
 *   function from utils/search. It validates incoming requests using Zod, then calls the search function.
 *
 * Role & Relation:
 *   - Receives a POST request with a search query and an optional locale (defaults to Arabic).
 *   - Returns a JSON response with search results.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchProperties } from "@/utils/search";

const searchSchema = z.object({
  query: z.string(),
  limit: z.number().optional(),
  locale: z.string().optional(), // optional locale parameter
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, locale } = searchSchema.parse(body);

    // Pass the locale (default "ar" if not provided) to searchProperties.
    const results = searchProperties(query, locale ?? "ar");

    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to process search request" },
      { status: 500 }
    );
  }
}
