import pkg from '/home/jq/Desktop/trumpfiles.fun-new/node_modules/@neondatabase/serverless/index.js';
const { neon } = pkg;

const sql = neon(process.env.DATABASE_URL);

// Get entries missing sources
const rows = await sql`
  SELECT entry_number, title, date_start
  FROM trump_entries
  WHERE entry_number BETWEEN 1207 AND 1999
    AND (sources IS NULL OR sources::text = 'null')
  ORDER BY entry_number
  LIMIT 60
`;

console.log(`Found ${rows.length} entries missing sources`);

const ALLOWED_DOMAINS = [
  'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com',
  'cnn.com', 'bbc.com', 'bbc.co.uk', 'politico.com', 'theguardian.com',
  'nbcnews.com', 'npr.org', 'cnbc.com', 'theatlantic.com', 'axios.com',
  'propublica.org', 'cbsnews.com', 'abcnews.go.com', 'pbs.org'
];

function isAllowedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some(d => hostname.endsWith(d));
  } catch {
    return false;
  }
}

// Write results to a file for the MCP-based search step
import { writeFileSync } from 'fs';
writeFileSync('/tmp/entries-to-search.json', JSON.stringify(rows, null, 2));
console.log('Written entries to /tmp/entries-to-search.json');
console.log('Entries:', rows.map(r => `${r.entry_number}: ${r.title?.substring(0, 60)}`).join('\n'));
