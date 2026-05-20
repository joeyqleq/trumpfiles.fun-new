import { getEntryStats } from "@/lib/entries";
import VisualizerClient from "./VisualizerClient";

export default async function VisualizerPage() {
    // Only fetch the real count on server; entries loaded client-side
    const stats = await getEntryStats();

    return (
        <VisualizerClient totalCount={stats.count} />
    );
}
