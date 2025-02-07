/**
 * src/types/index.ts
 * ========================
 * Purpose:
 *   This file contains shared TypeScript type definitions for the project.
 *   It defines the structure for Property objects used throughout the application.
 *
 * Role & Relation:
 *   - These types are used in data generation, search utilities, API responses, and UI components.
 *
 * Educational Comments:
 *   - The Property interface defines the expected shape of property objects.
 *   - The PropertyType type is a union of allowed property types.
 *   - The id field now accepts a string or a number to match our JSON data.
 */

export interface Property {
  id: string | number;
  title: string;
  description: string;
  type: string; // You can further restrict this to PropertyType if desired.
  features: string[];
  price: number;
  city: string;
  district: string;
  images?: string[];
}

export type PropertyType =
  | "فيلا"
  | "شقة"
  | "قصر"
  | "دوبلكس"
  | "Apartment"
  | "Villa"
  | "Mansion"
  | "Duplex";
