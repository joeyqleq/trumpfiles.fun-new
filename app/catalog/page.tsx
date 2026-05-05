import { getAllEntries, getEntryStats } from "@/lib/entries";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage() {
    // Parallel fetch on server
    const [entries, stats] = await Promise.all([
        getAllEntries(),
        getEntryStats()
    ]);

    return (
        <CatalogClient 
            initialEntries={entries} 
            maxEntry={stats.count} 
        />
    );
}
