import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/neonClient";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entry_number: string }> }
) {
  try {
    const { entry_number } = await params;
    const entryNum = Number(entry_number);

    if (!/^\d+$/.test(entry_number) || !Number.isInteger(entryNum) || entryNum <= 0) {
      return NextResponse.json(
        { error: "Invalid entry number" },
        { status: 400 }
      );
    }

    // Fetch entry from ai_complete_trump_data view
    const entry = await sql`
      SELECT * FROM ai_complete_trump_data
      WHERE entry_number = ${entryNum}
      LIMIT 1
    `;

    if (!entry || entry.length === 0) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    const [sources, navigationRows] = await Promise.all([
      sql`
        SELECT DISTINCT ON (url)
          url,
          title,
          publisher,
          source_type
        FROM trump_sources
        WHERE entry_number = ${entryNum}
          AND url IS NOT NULL
          AND btrim(url) <> ''
        ORDER BY url, source_id
      `,
      sql`
        SELECT
          (
            SELECT entry_number
            FROM ai_complete_trump_data
            WHERE entry_number < ${entryNum}
            ORDER BY entry_number DESC
            LIMIT 1
          ) AS previous,
          (
            SELECT entry_number
            FROM ai_complete_trump_data
            WHERE entry_number > ${entryNum}
            ORDER BY entry_number ASC
            LIMIT 1
          ) AS next
      `,
    ]);

    // Keep entry fields at the top level: Trumpstein's inline citation preview
    // consumes title/synopsis/danger from this public endpoint.
    return NextResponse.json(
      {
        ...entry[0],
        sources,
        navigation: {
          previous: navigationRows[0]?.previous ? Number(navigationRows[0].previous) : null,
          next: navigationRows[0]?.next ? Number(navigationRows[0].next) : null,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      },
    );
  } catch (error) {
    console.error("Error fetching entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}
