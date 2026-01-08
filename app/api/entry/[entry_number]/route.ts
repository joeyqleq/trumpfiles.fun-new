import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entry_number: string }> }
) {
  try {
    const { entry_number } = await params;
    const entryNum = parseInt(entry_number);

    if (isNaN(entryNum)) {
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

    return NextResponse.json(entry[0]);
  } catch (error) {
    console.error("Error fetching entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}
