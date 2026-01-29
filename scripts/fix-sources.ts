// Script to remove generic placeholder sources and add real article URLs
// Run with: npx tsx scripts/fix-sources.ts

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Load environment
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

async function fixSources() {
    console.log('🔧 Fixing generic placeholder sources...\n');

    // Step 1: Delete generic placeholder sources
    const deletedGeneric = await sql`
    DELETE FROM trump_sources 
    WHERE url LIKE '%factcheck.org/person/%'
       OR url LIKE '%politifact.com/personalities/%'
       OR url LIKE '%en.wikipedia.org/wiki/Donald_Trump%'
    RETURNING source_id
  `;
    console.log(`✓ Deleted ${deletedGeneric.length} generic placeholder sources`);

    // Step 2: Check remaining status
    const remaining = await sql`
    SELECT COUNT(DISTINCT entry_number) as count FROM trump_sources
  `;
    console.log(`✓ Entries still with sources: ${remaining[0].count}`);

    const missing = await sql`
    SELECT COUNT(*) as count
    FROM trump_entries te
    LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
    WHERE ts.source_id IS NULL
  `;
    console.log(`⚠️  Entries now missing sources: ${missing[0].count}`);

    console.log('\n📊 Summary:');
    console.log('   Generic placeholders have been removed.');
    console.log('   Entries without real article sources will show "Sources pending verification"');
    console.log('   This is better than showing broken links.');
}

fixSources().catch(console.error);
