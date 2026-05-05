import { getAllEntries } from "@/lib/entries";
import VisualizerClient from "./VisualizerClient";

export default async function VisualizerPage() {
    // Parallel fetch on server
    const entries = await getAllEntries();

    return (
        <VisualizerClient entries={entries} />
    );
}
