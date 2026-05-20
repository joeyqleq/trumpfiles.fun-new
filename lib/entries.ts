import { sql } from './neonClient';
import { AICompleteTrumpData } from '@/types/database';
import { unstable_cache } from 'next/cache';

/**
 * Fetch entries directly from Neon on the server.
 * This is faster than hitting an internal API route from the client.
 */
export const getCachedEntries = unstable_cache(
    async (limit: number = 20): Promise<AICompleteTrumpData[]> => {
        try {
            // Reusing your logic for dev speed
            const isDev = process.env.NODE_ENV === 'development';
            const finalLimit = isDev ? Math.min(limit, 15) : limit;

            const rows = await sql`
                SELECT * FROM ai_complete_trump_data 
                ORDER BY entry_number DESC 
                LIMIT ${finalLimit}
            `;
            return rows as unknown as AICompleteTrumpData[];
        } catch (error) {
            console.error('Error fetching entries from Neon:', error);
            return [];
        }
    },
    ['all-entries-cache'],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ['entries'],
    }
);

export const getEntryStats = unstable_cache(
    async () => {
        try {
            const result = await sql`
                SELECT COUNT(*) as count, MAX(date_start) as last_date FROM trump_entries
            `;

            const count = parseInt(result[0].count);
            const lastDate = result[0].last_date;
            let formattedDate = "";

            if (lastDate) {
                const d = new Date(lastDate);
                formattedDate = d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            }

            return {
                count: count || 2300,
                lastScrapedFormatted: formattedDate
            };
        } catch (error) {
            console.error('Error fetching entry stats:', error);
            return { count: 2300, lastScrapedFormatted: "" };
        }
    },
    ['entry-stats-cache'],
    {
        revalidate: 3600,
        tags: ['stats'],
    }
);

/**
 * Fetch all entries for catalog/visualizer.
 * NOTE: Catalog and Visualizer pages now use client-side API fetching
 * from /api/catalog-data and /api/visualizer-data respectively.
 * This function is kept for backward compatibility but no longer used.
 */
export const getAllEntries = unstable_cache(
    async (): Promise<AICompleteTrumpData[]> => {
        try {
            const isDev = process.env.NODE_ENV === 'development';
            const limit = isDev ? 500 : 10000;

            const rows = await sql`
                SELECT * FROM ai_complete_trump_data 
                ORDER BY entry_number DESC 
                LIMIT ${limit}
            `;
            return rows as unknown as AICompleteTrumpData[];
        } catch (error) {
            console.error('Error fetching all entries from Neon:', error);
            return [];
        }
    },
    ['all-entries-full-cache'],
    {
        revalidate: 3600,
        tags: ['entries', 'full-catalog'],
    }
);
