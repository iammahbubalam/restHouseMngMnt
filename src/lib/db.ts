import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string');
}

// Single export of the sql instance to be reused across the app
export const sql = neon(process.env.DATABASE_URL);
