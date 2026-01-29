// Restore corrupted entries from JSON source
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

async function restoreFromJSON() {
    // Load original JSON
    const jsonPath = '/Users/joeyq/Desktop/trump_data/trump_data_maximum copy 2.json';
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`Loaded ${jsonData.length} entries from JSON source\n`);

    // Get current DB entries
    const dbEntries = await sql`SELECT entry_number, title FROM trump_entries`;
    const dbMap = new Map(dbEntries.map((e: any) => [e.entry_number, e.title]));

    let restored = 0;
    let skipped = 0;

    for (const entry of jsonData) {
        const dbTitle = dbMap.get(entry.entry_number);

        // Check if DB has corrupted/placeholder data for this entry
        const isCorrupted = dbTitle && (
            dbTitle.includes('Entry ') &&
            !entry.title.includes('Entry ')
        );

        const isMismatch = dbTitle && dbTitle !== entry.title;

        if (isCorrupted || isMismatch) {
            // Restore from JSON - using correct column names
            await sql`
        UPDATE trump_entries SET
          title = ${entry.title},
          synopsis = ${entry.synopsis},
          rationale = ${entry.rationale || null},
          category = ${entry.category || 'Uncategorized'},
          subcategory = ${entry.subcategory || null},
          phase = ${entry.phase || 'Unknown'},
          date_start = ${entry.date_start || null},
          date_end = ${entry.date_end || null},
          age = ${entry.age || null},
          keywords = ${entry.keywords || []},
          scores = ${JSON.stringify(entry.scores || {})},
          fact_check = ${entry.fact_check || null},
          fact_check_sources = ${entry.fact_check_sources || []},
          sources = ${JSON.stringify(entry.sources || [])},
          suggested_source_query = ${entry.suggested_source_query || null}
        WHERE entry_number = ${entry.entry_number}
      `;

            console.log(`✅ Restored #${entry.entry_number}: ${entry.title.substring(0, 50)}...`);
            restored++;
        } else if (!dbTitle) {
            // Entry doesn't exist in DB - insert it
            await sql`
        INSERT INTO trump_entries (
          entry_number, title, synopsis, rationale, category, subcategory, phase,
          date_start, date_end, age, keywords, scores, fact_check, 
          fact_check_sources, sources, suggested_source_query
        ) VALUES (
          ${entry.entry_number},
          ${entry.title},
          ${entry.synopsis},
          ${entry.rationale || null},
          ${entry.category || 'Uncategorized'},
          ${entry.subcategory || null},
          ${entry.phase || 'Unknown'},
          ${entry.date_start || null},
          ${entry.date_end || null},
          ${entry.age || null},
          ${entry.keywords || []},
          ${JSON.stringify(entry.scores || {})},
          ${entry.fact_check || null},
          ${entry.fact_check_sources || []},
          ${JSON.stringify(entry.sources || [])},
          ${entry.suggested_source_query || null}
        )
      `;

            console.log(`➕ Inserted #${entry.entry_number}: ${entry.title.substring(0, 50)}...`);
            restored++;
        } else {
            skipped++;
        }
    }

    console.log(`\n=== RESTORATION COMPLETE ===`);
    console.log(`Restored/inserted: ${restored}`);
    console.log(`Already correct (skipped): ${skipped}`);

    // Count remaining placeholders (entries NOT in JSON that are garbage)
    const remainingPlaceholders = await sql`
    SELECT COUNT(*) as count FROM trump_entries
    WHERE title ~ 'Entry [0-9]+$'
    AND synopsis LIKE 'Documented%Comprehensive synopsis%'
  `;

    console.log(`\n⚠️ Remaining garbage placeholders to delete: ${remainingPlaceholders[0].count}`);
}

restoreFromJSON().catch(console.error);
