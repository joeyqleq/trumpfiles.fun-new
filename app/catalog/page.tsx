import { getEntryStats } from "@/lib/entries";
import { Suspense } from "react";
import CatalogClient from "./CatalogClient";

function CatalogLoading() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-orange-300">
            Loading catalogue index…
        </div>
    );
}

export default async function CatalogPage() {
    // Fetch only stats on server; entries are fetched client-side with pagination
    const stats = await getEntryStats();

    return (
        <Suspense fallback={<CatalogLoading />}>
            <CatalogClient totalCount={stats.count} />
        </Suspense>
    );
}
