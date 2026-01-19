import { neon } from '@neondatabase/serverless';

// Handle missing DATABASE_URL gracefully during build time
// Vercel builds first without env vars to collect static data
const getDatabaseUrl = (): string | undefined => {
  return process.env.DATABASE_URL;
};

const databaseUrl = getDatabaseUrl();

// Export sql function - will throw meaningful error if DATABASE_URL not set at runtime
export const sql = databaseUrl
  ? neon(databaseUrl)
  : (() => {
    // Return a function that throws when called (for build-time safety)
    const throwError = () => {
      throw new Error('DATABASE_URL environment variable is not configured. Please add it to your Vercel project settings.');
    };
    return Object.assign(throwError, {
      transaction: throwError,
    });
  })();
