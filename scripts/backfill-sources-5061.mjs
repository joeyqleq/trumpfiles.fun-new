import pkg from '/home/jq/Desktop/trumpfiles.fun-new/node_modules/@neondatabase/serverless/index.js';

const { neon } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const EXA_API_KEY = process.env.EXA_API_KEY;
if (!EXA_API_KEY) {
  console.error('EXA_API_KEY not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const ACCEPTED_DOMAINS = [
  'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com',
  'cnn.com', 'bbc.com', 'bbc.co.uk', 'politico.com', 'theguardian.com',
  'nbcnews.com', 'npr.org', 'cnbc.com', 'theatlantic.com', 'axios.com',
  'propublica.org', 'cbsnews.com', 'abcnews.go.com', 'pbs.org', 'vox.com',
  'newyorker.com', 'texastribune.org', 'thehill.com'
];

function isAccepted(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return ACCEPTED_DOMAINS.some(d => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

async function searchExa(query) {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': EXA_API_KEY
    },
    body: JSON.stringify({
      query,
      numResults: 1,
      type: 'neural',
      useAutoprompt: false
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Exa error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function main() {
  const rows = await sql`
    SELECT entry_number, title, date_start
    FROM trump_entries
    WHERE entry_number BETWEEN 5061 AND 5350
      AND (sources IS NULL OR sources::text = 'null')
    ORDER BY entry_number
    LIMIT 60
  `;

  console.log(`Found ${rows.length} entries to process`);

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const year = row.date_start ? String(row.date_start).slice(0, 4) : '';
    const query = year ? `${row.title} ${year}` : row.title;

    let results = [];
    try {
      results = await searchExa(query);
    } catch (err) {
      // retry with simplified query
      try {
        const simplified = row.title.split(' ').slice(0, 6).join(' ') + (year ? ` ${year}` : '');
        results = await searchExa(simplified);
      } catch (err2) {
        console.log(`  [${row.entry_number}] search error: ${err2.message}`);
        skipped++;
        continue;
      }
    }

    const match = results.find(r => isAccepted(r.url));

    if (match) {
      const sources = JSON.stringify([{ url: match.url, title: match.title, source_type: 'news' }]);
      await sql`
        UPDATE trump_entries
        SET sources = ${sources}::jsonb
        WHERE entry_number = ${row.entry_number}
      `;
      console.log(`  ✓ [${row.entry_number}] ${row.title.slice(0, 60)} → ${match.url}`);
      updated++;
    } else {
      console.log(`  ✗ [${row.entry_number}] ${row.title.slice(0, 60)} — no accepted source`);
      skipped++;
    }

    // small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
