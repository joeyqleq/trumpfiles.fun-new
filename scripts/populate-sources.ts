    // Script to check and populate sources for Trump entries
// Run with: npx tsx scripts/populate-sources.ts

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Manually read .env.local
function loadEnv() {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value.trim();
        }
    }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL not found. Check .env.local file.');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkSourceStatus() {
    console.log('Connecting to Neon database...\n');

    try {
        // Get total entries
        const totalEntries = await sql`SELECT COUNT(*) as count FROM trump_entries`;
        console.log(`✓ Total entries in trump_entries: ${totalEntries[0].count}`);

        // Get entries with sources
        const entriesWithSources = await sql`
      SELECT COUNT(DISTINCT entry_number) as count FROM trump_sources
    `;
        console.log(`✓ Entries with sources: ${entriesWithSources[0].count}`);

        // Get entry number ranges
        const sourceRange = await sql`
      SELECT MIN(entry_number) as min_entry, MAX(entry_number) as max_entry 
      FROM trump_sources
    `;
        console.log(`✓ Source entries range: ${sourceRange[0].min_entry} to ${sourceRange[0].max_entry}`);

        // Get entries without sources
        const entriesWithoutSources = await sql`
      SELECT te.entry_number, te.title, te.category
      FROM trump_entries te
      LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
      WHERE ts.source_id IS NULL
      ORDER BY te.entry_number
      LIMIT 20
    `;

        console.log(`\n📋 Sample entries WITHOUT sources:`);
        entriesWithoutSources.forEach((e: any) => {
            console.log(`  #${e.entry_number}: ${e.title.substring(0, 60)}... [${e.category}]`);
        });

        // Count entries missing sources
        const missingCount = await sql`
      SELECT COUNT(*) as count
      FROM trump_entries te
      LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
      WHERE ts.source_id IS NULL
    `;
        console.log(`\n⚠️  Total entries missing sources: ${missingCount[0].count}`);

    } catch (error) {
        console.error('Database error:', error);
    }
}

checkSourceStatus();
