/**
 * src/tests/structuredQuery.test.ts
 * =============================================
 * Purpose:
 *   This test suite verifies that the function `extractStructuredQuery` correctly parses
 *   the search input and returns the expected structured query HTML.
 *
 * Role & Relation:
 *   - This file tests our new utility function in src/utils/structuredQuery.ts.
 *   - It ensures that all attributes from the search input are detected and mapped correctly.
 *
 * Workflow:
 *   1. Provide sample search inputs.
 *   2. Verify that the output HTML contains the correct mapping for each attribute.
 *
 * Educational Comments:
 *   - We test various cases including different dialects and free-form text.
 *   - These tests help prevent regression in our extraction logic.
 */

import { extractStructuredQuery } from '@/utils/structuredQuery';

describe('Structured Query Extraction', () => {
  it('should extract all attributes for a sample input with multiple features', () => {
    const input = "ودني اشوف بيوت فخمه بالنرجس بشرت تكون نضيفه وفيها حوض سباحه ومجلس كبير للعايله وما تطلع فوق 3 مليون وست غرف";
    const htmlOutput = extractStructuredQuery(input);
    // Expect the output to contain mappings for property type (بيوت فخمه -> فيلا), district, price info, 6 غرف, swimming pool and مجلس
    expect(htmlOutput).toMatch(/النوع.*فيلا/);
    expect(htmlOutput).toMatch(/الحي.*النرجس/);
    expect(htmlOutput).toMatch(/السعر/);
    expect(htmlOutput).toMatch(/6 غرف/);
    // Check that the swimming pool mapping is present
    expect(htmlOutput).toMatch(/مسبح/);
    // Check for مجلس
    expect(htmlOutput).toMatch(/مجلس/);
  });

  it('should extract all attributes for the duplex input', () => {
    const input = "محتاجين دبلوكس ف مدينه جده يكون سته غرف نوم و#سعره معقول تحت ٢ مليوون ريال سعودى && يكون معاه حديقه واسعه";
    const htmlOutput = extractStructuredQuery(input);
    // Expect the output to include type, city, room count, price info, and feature for حديقه.
    expect(htmlOutput).toMatch(/النوع.*دوبلكس/);
    expect(htmlOutput).toMatch(/المدينة.*جدة/);
    expect(htmlOutput).toMatch(/6 غرف/);
    expect(htmlOutput).toMatch(/السعر/);
    expect(htmlOutput).toMatch(/حديقة/);
  });

  it('should return an empty structured query when input is empty', () => {
    const input = "";
    const htmlOutput = extractStructuredQuery(input);
    expect(htmlOutput.trim()).toBe('');
  });
});
