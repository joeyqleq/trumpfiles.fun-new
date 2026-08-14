import pkg from '/home/jq/Desktop/trumpfiles.fun-new/node_modules/@neondatabase/serverless/index.js';
const { neon } = pkg;

const sql = neon(process.env.DATABASE_URL);
const EXA_KEY = process.env.EXA_API_KEY;

const ALLOWED_DOMAINS = [
  'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com',
  'cnn.com', 'bbc.com', 'bbc.co.uk', 'politico.com', 'theguardian.com',
  'nbcnews.com', 'npr.org', 'cnbc.com', 'theatlantic.com', 'axios.com',
  'propublica.org', 'cbsnews.com', 'abcnews.go.com', 'pbs.org',
  'vox.com', 'newyorker.com', 'texastribune.org', 'thehill.com'
];

function isAllowedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  } catch { return false; }
}

async function searchExa(query) {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_KEY },
    body: JSON.stringify({ query, numResults: 3, type: 'neural' })
  });
  if (!res.ok) throw new Error(`Exa HTTP ${res.status}`);
  return res.json();
}

const START = parseInt(process.env.START_ENTRY || '4537');
const rows = await sql`
  SELECT entry_number, title, date_start
  FROM trump_entries
  WHERE entry_number BETWEEN ${START} AND 5000
    AND (sources IS NULL OR sources::text = 'null')
  ORDER BY entry_number
  LIMIT 60
`;

console.log(`Found ${rows.length} entries missing sources`);

let updated = 0;
let skipped = 0;

for (const row of rows) {
  const year = row.date_start ? new Date(row.date_start).getFullYear() : '';
  const query = `${row.title} ${year}`;

  try {
    const data = await searchExa(query);
    const results = data.results || [];

    // Find first result from allowed domain
    let match = null;
    for (const r of results) {
      if (isAllowedDomain(r.url)) {
        match = r;
        break;
      }
    }

    if (match) {
      const sources = JSON.stringify([{ url: match.url, title: match.title, source_type: 'news' }]);
      await sql`UPDATE trump_entries SET sources = ${sources}::jsonb WHERE entry_number = ${row.entry_number}`;
      console.log(`✓ ${row.entry_number}: ${match.url}`);
      updated++;
    } else {
      // Retry with simplified title (first 8 words)
      const shortTitle = row.title.split(' ').slice(0, 8).join(' ');
      const shortQuery = `${shortTitle} ${year} news`;
      const data2 = await searchExa(shortQuery);
      const results2 = data2.results || [];
      let match2 = null;
      for (const r of results2) {
        if (isAllowedDomain(r.url)) { match2 = r; break; }
      }
      if (match2) {
        const sources = JSON.stringify([{ url: match2.url, title: match2.title, source_type: 'news' }]);
        await sql`UPDATE trump_entries SET sources = ${sources}::jsonb WHERE entry_number = ${row.entry_number}`;
        console.log(`✓ ${row.entry_number} (retry): ${match2.url}`);
        updated++;
      } else {
        console.log(`✗ ${row.entry_number}: no accepted source — "${row.title.substring(0, 60)}"`);
        skipped++;
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 150));
  } catch (err) {
    console.error(`! ${row.entry_number}: ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
