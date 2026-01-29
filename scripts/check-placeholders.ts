// Compare JSON source vs database
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

async function compareData() {
  // Load original JSON
  const jsonPath = '/Users/joeyq/Desktop/trump_data/trump_data_maximum copy 2.json';
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`=== JSON Source ===`);
  console.log(`Total entries in JSON: ${jsonData.length}`);
  console.log(`Entry numbers range: ${jsonData[0].entry_number} to ${jsonData[jsonData.length - 1].entry_number}`);

  // Check database
  const dbEntries = await sql`SELECT entry_number, title, synopsis FROM trump_entries ORDER BY entry_number`;
  console.log(`\n=== Database ===`);
  console.log(`Total entries in DB: ${dbEntries.length}`);

  // Check for placeholder entries in DB
  const placeholders = dbEntries.filter((e: any) => e.title.includes('Entry ') && e.synopsis.includes('Documented'));
  console.log(`Placeholder entries in DB: ${placeholders.length}`);

  // Check if JSON entry titles match placeholder titles
  console.log('\n=== Sample Comparison ===');

  // Pick a few entry numbers that are placeholders in DB
  const samplePlaceholderNums = placeholders.slice(0, 5).map((p: any) => p.entry_number);

  for (const num of samplePlaceholderNums) {
    const jsonEntry = jsonData.find((j: any) => j.entry_number === num);
    const dbEntry = dbEntries.find((d: any) => d.entry_number === num);

    if (jsonEntry && dbEntry) {
      console.log(`\nEntry #${num}:`);
      console.log(`  JSON title: ${jsonEntry.title.substring(0, 60)}...`);
      console.log(`  DB title:   ${dbEntry.title.substring(0, 60)}...`);
      console.log(`  MATCH: ${jsonEntry.title === dbEntry.title ? 'YES' : 'NO - MISMATCH!'}`);
    }
  }

  // Count mismatches
  let mismatches = 0;
  let matches = 0;
  for (const dbEntry of dbEntries) {
    const jsonEntry = jsonData.find((j: any) => j.entry_number === dbEntry.entry_number);
    if (jsonEntry) {
      if (jsonEntry.title !== dbEntry.title) {
        mismatches++;
      } else {
        matches++;
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Title matches: ${matches}`);
  console.log(`Title mismatches: ${mismatches}`);
  console.log(`\nConclusion: ${mismatches > 0 ? '⚠️ DATA CORRUPTION - Entries were overwritten with placeholders!' : '✅ Data intact'}`);
}

compareData().catch(console.error);
