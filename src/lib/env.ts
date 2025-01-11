/**
 * @fileoverview Environment variable validation
 * @module lib/env
 */

/**
 * Validates required environment variables
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_OPENAI_API_KEY',
  ] as const;

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

/**
 * Get environment variables with type safety
 */
export const env = {
  openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
} as const; 