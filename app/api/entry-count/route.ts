import { NextResponse } from "next/server";
import { sql } from "@/lib/neonClient";

export async function GET() {
    try {
        const result = await sql`
      SELECT COUNT(*) as count FROM trump_entries
    `;

        return NextResponse.json({
            count: parseInt(result[0].count),
            formatted: parseInt(result[0].count).toLocaleString()
        });
    } catch (error) {
        console.error("Error fetching entry count:", error);
        return NextResponse.json({ count: 514, formatted: "514" }, { status: 200 });
    }
}
