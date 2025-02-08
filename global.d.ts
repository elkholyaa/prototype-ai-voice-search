/**
 * global.d.ts
 * =====================
 * Purpose:
 *   This file instructs TypeScript that any file with a ".json" extension can be imported as a module.
 *
 * Role & Relation:
 *   - It prevents TypeScript from raising errors when JSON files are imported.
 *   - It applies globally and is essential for projects that import JSON configuration or data.
 *
 * Educational Comments:
 *   - Although using "any" is not as strict as providing detailed types for JSON files,
 *     this approach is acceptable for a proof-of-concept demo.
 */

declare module "*.json" {
  const value: any;
  export default value;
}
