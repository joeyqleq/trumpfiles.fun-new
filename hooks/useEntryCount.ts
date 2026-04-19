"use client";

import { useState, useEffect } from "react";

interface EntryCountData {
    count: number;
    formatted: string;
    loading: boolean;
    lastScraped: string | null;
    lastScrapedFormatted: string;
}

export function useEntryCount(): EntryCountData {
    const [data, setData] = useState<EntryCountData>({
        count: 1100,
        formatted: "1100",
        loading: true,
        lastScraped: null,
        lastScrapedFormatted: "",
    });

    useEffect(() => {
        fetch("/api/entry-count")
            .then((res) => res.json())
            .then((result) => {
                let formattedDate = "";
                if (result.lastScraped) {
                    const d = new Date(result.lastScraped);
                    formattedDate = d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });
                }
                setData({
                    count: result.count,
                    formatted: result.formatted,
                    loading: false,
                    lastScraped: result.lastScraped || null,
                    lastScrapedFormatted: formattedDate,
                });
            })
            .catch(() => {
                setData((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return data;
}

export async function getEntryCount(): Promise<{ count: number; formatted: string }> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/entry-count`, {
            next: { revalidate: 3600 },
        });
        return res.json();
    } catch {
        return { count: 1100, formatted: "1100" };
    }
}
