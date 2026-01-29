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
const categories = [
  'Foreign Policy',
  'Authoritarianism',
  'Election Interference',
  'Government Corruption',
  'Corruption',
  'Human Rights Violations',
  'Press Freedom',
  'Violent Rhetoric / Threats',
  'Racial Discrimination',
  'Racism / Discrimination',
  'National Security Violations',
  'Grift / Financial Exploitation'
];

const rows = await sql`
  select category, subcategory
  from trump_entries
  where category = any(${categories})
  group by category, subcategory
  order by category, subcategory
`;

let current = '';
for (const row of rows) {
  if (row.category !== current) {
    current = row.category;
    console.log(`\n${current}`);
  }
  console.log(`- ${row.subcategory || '(null)'}`);
}
