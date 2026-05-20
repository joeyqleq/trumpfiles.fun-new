import { getEntryStats } from "@/lib/entries";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage() {
    // Fetch only stats on server; entries are fetched client-side with pagination
    const stats = await getEntryStats();

    return (
        <CatalogClient 
            totalCount={stats.count} 
        />
    );
}
