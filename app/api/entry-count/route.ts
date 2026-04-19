import { NextResponse } from "next/server";
import { sql } from "@/lib/neonClient";

export async function GET() {
    try {
        const result = await sql`
      SELECT COUNT(*) as count, MAX(date_start) as last_date FROM trump_entries
    `;

        const count = parseInt(result[0].count);
        const lastDate = result[0].last_date;

        return NextResponse.json({
            count,
            formatted: count.toLocaleString(),
            lastScraped: lastDate || null,
        });
    } catch (error) {
        console.error("Error fetching entry count:", error);
        return NextResponse.json({ count: 514, formatted: "514", lastScraped: null }, { status: 200 });
    }
}
