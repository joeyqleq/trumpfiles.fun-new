// Script to get entries that need sources
// Run with: npx tsx scripts/get-entries-for-sources.ts

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

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

const sql = neon(process.env.DATABASE_URL!);

async function getEntries() {
    console.log('📋 Getting entries that need verified sources...\n');

    // First, remove all generic sources
    const deleted = await sql`
    DELETE FROM trump_sources 
    WHERE url LIKE '%factcheck.org/person/%'
       OR url LIKE '%politifact.com/personalities/%'
       OR url LIKE '%wikipedia.org/wiki/Donald_Trump%'
    RETURNING source_id
  `;
    console.log(`🗑️  Deleted ${deleted.length} generic placeholder sources\n`);

    // Get entries without valid sources
    const entriesWithoutSources = await sql`
    SELECT te.entry_number, te.title, te.category
    FROM trump_entries te
    LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
    WHERE ts.source_id IS NULL
    ORDER BY te.entry_number
    LIMIT 50
  `;

    console.log(`📝 First 50 entries needing sources:\n`);
    entriesWithoutSources.forEach((e: any) => {
        console.log(`#${e.entry_number}: ${e.title}`);
    });

    // Count total
    const total = await sql`
    SELECT COUNT(*) as count
    FROM trump_entries te
    LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
    WHERE ts.source_id IS NULL
  `;
    console.log(`\n⚠️  Total entries needing sources: ${total[0].count}`);
}

getEntries().catch(console.error);
