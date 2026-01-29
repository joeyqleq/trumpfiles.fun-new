"use client";

import { useState, useEffect } from "react";

interface EntryCountData {
    count: number;
    formatted: string;
    loading: boolean;
}

/**
 * Hook to get the dynamic entry count from the database.
 * Use this anywhere you need to display the number of entries.
 */
export function useEntryCount(): EntryCountData {
    const [data, setData] = useState<EntryCountData>({
        count: 514, // Fallback
        formatted: "514",
        loading: true,
    });

    useEffect(() => {
        fetch("/api/entry-count")
            .then((res) => res.json())
            .then((result) => {
                setData({
                    count: result.count,
                    formatted: result.formatted,
                    loading: false,
                });
            })
            .catch(() => {
                setData((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return data;
}

/**
 * Static entry count for server components.
 * Gets the count directly from the API.
 */
export async function getEntryCount(): Promise<{ count: number; formatted: string }> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/entry-count`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        return res.json();
    } catch {
        return { count: 514, formatted: "514" };
    }
}
