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
const rows = await sql`select max(entry_number) as max from trump_entries`;
console.log(rows[0]);
