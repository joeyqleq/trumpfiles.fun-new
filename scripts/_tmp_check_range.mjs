import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const content = fs.readFileSync(envPath, 'utf-8');
for (const line of content.split('\n')) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    const value = valueParts.join('=').replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    process.env[key.trim()] = value.trim();
  }
}

const sql = neon(process.env.DATABASE_URL);
const entries = await sql`select entry_number, title from trump_entries where entry_number between 587 and 611 order by entry_number`;
const missing = await sql`
  select te.entry_number
  from trump_entries te
  left join trump_sources ts on te.entry_number = ts.entry_number
  where te.entry_number between 587 and 611 and ts.source_id is null
  order by te.entry_number
`;
console.log({ count: entries.length, missing: missing.map(m => m.entry_number) });
