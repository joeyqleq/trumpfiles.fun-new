// Re-export from neonClient for backward compatibility
// This file exists because some API routes import from '@/lib/neon'
export { sql } from './neonClient';

// Note: If you need pool-style queries, use sql from neonClient like this:
// const result = await sql`SELECT * FROM table`;
