import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const id = Number(process.argv[2]);
if (!id) throw new Error('Provide entry number');

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
const rows = await sql`select entry_number, title, synopsis from trump_entries where entry_number=${id}`;
console.log(rows[0]);
