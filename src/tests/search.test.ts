import { searchProperties } from "@/utils/search";
import { Property } from "@/types";

/**
 * 📌 Search Tests (Advanced Natural Language Processing)
 * -------------------------------------
 * - Preserves the `Advanced Natural Language Searches` test suite.
 * - Validates **bilingual support (English & Arabic)**.
 * - Ensures **Arabic price filtering logic** (اقل من, تحت, ما يزيد).
 * - Confirms **dataset separation (`properties-ar.json` vs. `properties-en.json`).**
 * - **Restores all complex Arabic test cases** including informal expressions.
 */

describe("Advanced Natural Language Searches", () => {

  /** 🔍 Basic Keyword Search */
  test("Search finds results in Arabic dataset", () => {
    const results = searchProperties("فيلا مع مسبح", "ar");
    expect(results.length).toBeGreaterThan(0);
  });

  test("Search finds results in English dataset", () => {
    const results = searchProperties("villa with pool", "en");
    expect(results.length).toBeGreaterThan(0);
  });

  /** 🔍 Complex Arabic Natural Language Queries */
  test("Handles advanced Arabic query with multiple conditions", () => {
    const query = "ودني اشوف بيوت فخمه بالنرجس بشرت تكون نضيفه وفيها حوض سباحه ومجلس كبير للعايله وما تطلع فوق 3 مليون وست غرف";
    const results = searchProperties(query, "ar");
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.price <= 3000000)).toBe(true);
    expect(results.every((p: Property) => p.features.includes("Swimming Pool"))).toBe(true);
    expect(results.every((p: Property) => p.features.includes("Majlis"))).toBe(true);
    expect(results.every((p: Property) => p.features.includes("6 Bedrooms"))).toBe(true);
  });

  test("Handles Arabic search with informal pricing", () => {
    const query = "ابي شقة بالرياض بسعر معقول تكون ثلاث غرف";
    const results = searchProperties(query, "ar");

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.features.includes("3 Bedrooms"))).toBe(true);
  });

  test("Handles Arabic query with negative filtering", () => {
    const query = "شقة بالرياض لا تكون فوق مليون";
    const results = searchProperties(query, "ar");

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.price <= 1000000)).toBe(true);
  });

  /** 🔍 Price Filtering in Arabic */
  test("Arabic query - Price filtering: أقل من مليون", () => {
    const results = searchProperties("شقة اقل من مليون", "ar");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.price < 1000000)).toBe(true);
  });

  test("Arabic query - Price filtering: فوق ٢ مليون", () => {
    const results = searchProperties("قصر فوق ٢ مليون", "ar");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.price > 2000000)).toBe(true);
  });

  test("Arabic query - Price filtering: لا يزيد عن ٥٠٠ الف", () => {
    const results = searchProperties("شقة لا يزيد عن ٥٠٠ الف", "ar");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p: Property) => p.price <= 500000)).toBe(true);
  });

  /** 🔍 Dataset Separation (Arabic vs English) */
  test("Arabic searches do not return English dataset results", () => {
    const arabicResults = searchProperties("فيلا", "ar");
    expect(
      arabicResults.every((p: Property) => p.city.match(/الرياض|جدة|الدمام/))
    ).toBe(true);
  });

  test("English searches do not return Arabic dataset results", () => {
    const englishResults = searchProperties("villa", "en");
    expect(
      englishResults.every((p: Property) => p.city.match(/Los Angeles|New York|Miami/))
    ).toBe(true);
  });

  /** 🔍 Case Insensitivity */
  test("Search is case-insensitive (Arabic)", () => {
    const lowerCaseResults = searchProperties("فيلا", "ar");
    const upperCaseResults = searchProperties("فِيلا", "ar");
    expect(lowerCaseResults.length).toBe(upperCaseResults.length);
  });

  test("Search is case-insensitive (English)", () => {
    const lowerCaseResults = searchProperties("villa", "en");
    const upperCaseResults = searchProperties("VILLA", "en");
    expect(lowerCaseResults.length).toBe(upperCaseResults.length);
  });

  /** 🔍 Partial Word Matching */
  test("Partial word match works (Arabic)", () => {
    const results = searchProperties("في", "ar"); // Should match "فيلا"
    expect(results.length).toBeGreaterThan(0);
  });

  test("Partial word match works (English)", () => {
    const results = searchProperties("vil", "en"); // Should match "villa"
    expect(results.length).toBeGreaterThan(0);
  });

  /** 🔍 Edge Cases */
  test("Empty query returns no results", () => {
    const arabicResults = searchProperties("", "ar");
    const englishResults = searchProperties("", "en");
    expect(arabicResults.length).toBe(0);
    expect(englishResults.length).toBe(0);
  });

  test("Long irrelevant query returns no results", () => {
    const longQuery = "thisisaverylongquerythatshouldnotmatchanything";
    const arabicResults = searchProperties(longQuery, "ar");
    const englishResults = searchProperties(longQuery, "en");
    expect(arabicResults.length).toBe(0);
    expect(englishResults.length).toBe(0);
  });

  test("Special characters do not affect search", () => {
    const results = searchProperties("!@#$%^&*()_+فيلا", "ar");
    expect(results.length).toBeGreaterThan(0);
  });
});
