import { getCachedEntries, getEntryStats } from "@/lib/entries";
import HomeClient from "./HomeClient";

/**
 * Next.js 16/15 Server Component
 * This page fetches data directly from Neon on the server and passes it to the Client Component.
 * This eliminates the initial loading state and provides better SEO and performance.
 */
export default async function Home() {
    // Fetch data in parallel on the server
    const [entries, stats] = await Promise.all([
        getCachedEntries(30), // Fetch 30 entries for the marquee
        getEntryStats()       // Fetch entry count and last update date
    ]);

    return (
        <HomeClient 
            initialEntries={entries} 
            entryCount={stats.count}
            lastScrapedFormatted={stats.lastScrapedFormatted}
        />
    );
}
