import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      const value = valueParts.join('=').replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      process.env[key.trim()] = value.trim();
    }
  }
}

loadEnv();

const sql = neon(process.env.DATABASE_URL);

const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
const birthDate = new Date('1946-06-14T00:00:00Z');

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function calcAge(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  let age = d.getUTCFullYear() - birthDate.getUTCFullYear();
  const hadBirthday = (d.getUTCMonth() > birthDate.getUTCMonth()) ||
    (d.getUTCMonth() === birthDate.getUTCMonth() && d.getUTCDate() >= birthDate.getUTCDate());
  if (!hadBirthday) age -= 1;
  return age;
}

function recency(dateStr) {
  const y = new Date(`${dateStr}T00:00:00Z`).getUTCFullYear();
  if (y >= 2023) return 5;
  if (y === 2022) return 4;
  if (y >= 2020) return 3;
  return 2;
}

function makeScores({ date_start, category, subcategory, danger, lawlessness, impact_scope, authoritarianism, insanity = 2, absurdity = 2, rationale_short }) {
  return {
    danger,
    insanity,
    absurdity,
    lawlessness,
    impact_scope,
    rationale_short,
    authoritarianism,
    credibility_risk: 2,
    rationale_detail: `${category}: ${subcategory}. On ${formatDate(date_start)}, ${rationale_short}`,
    recency_intensity: recency(date_start)
  };
}

const guardianGreenlandSource = {
  url: 'https://www.theguardian.com/us-news/2026/jan/19/trump-sent-message-to-norways-pm-linking-greenland-claim-to-nobel-peace-prize-snub',
  title: 'Trump sent message to Norway’s PM linking Greenland claim to Nobel peace prize snub',
  publisher: 'The Guardian'
};

const guardianMachadoSource = {
  url: 'https://www.theguardian.com/us-news/2026/jan/11/maria-corina-machado-nobel-peace-prize-donald-trump',
  title: 'Venezuelan opposition leader offers to share Nobel Peace Prize with Trump',
  publisher: 'The Guardian'
};

const entries = [
  {
    entry_number: 1081,
    title: 'Threatens Tariffs on Allies Over Greenland Bid',
    synopsis: 'Trump threatened punitive tariffs on imports from Denmark, Norway, and Germany unless they dropped objections to his push to acquire Greenland.',
    rationale: 'Used trade threats against allies to pressure acceptance of territorial demands.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 2',
    date_start: '2026-01-17',
    date_end: '2026-01-17',
    keywords: ['Greenland', 'tariffs', 'Denmark', 'Norway', 'Germany'],
    scores: makeScores({
      date_start: '2026-01-17',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'threatened tariffs on allies to force concessions over Greenland.'
    }),
    source: guardianGreenlandSource
  },
  {
    entry_number: 1082,
    title: 'Says U.S. Will Take Greenland “One Way or the Other”',
    synopsis: 'In a message to Norway’s prime minister, Trump said the U.S. would take complete and total control of Greenland “one way or the other,” and would not rule out military force.',
    rationale: 'Threatened territorial acquisition and declined to rule out force against an ally’s territory.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 2',
    date_start: '2026-01-18',
    date_end: '2026-01-18',
    keywords: ['Greenland', 'territorial control', 'use of force', 'Norway'],
    scores: makeScores({
      date_start: '2026-01-18',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      insanity: 3,
      absurdity: 3,
      rationale_short: 'said the U.S. would take Greenland “one way or the other.”'
    }),
    source: guardianGreenlandSource
  },
  {
    entry_number: 1083,
    title: 'Says He Would Accept Machado’s Nobel Peace Prize Offer',
    synopsis: 'After María Corina Machado said she would share her Nobel Peace Prize with Trump, he said he would accept it, while Nobel officials said the prize cannot be transferred.',
    rationale: 'Signaled willingness to accept a non-transferable Nobel prize amid political controversy in Venezuela.',
    category: 'Personal Awareness',
    subcategory: 'Public Gaffe',
    phase: 'White House 2',
    date_start: '2026-01-11',
    date_end: '2026-01-11',
    keywords: ['Nobel Peace Prize', 'Machado', 'Venezuela', 'offer'],
    scores: makeScores({
      date_start: '2026-01-11',
      category: 'Personal Awareness',
      subcategory: 'Public Gaffe',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 4,
      rationale_short: 'said he would accept a Nobel prize offer that is not transferable.'
    }),
    source: guardianMachadoSource
  }
];

for (const entry of entries) {
  entry.age = calcAge(entry.date_start);
}

async function run() {
  let inserted = 0;
  let sourcesInserted = 0;

  for (const entry of entries) {
    const existing = await sql`select 1 from trump_entries where entry_number = ${entry.entry_number}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO trump_entries (
          entry_number, title, synopsis, rationale, category, subcategory, phase,
          date_start, date_end, age, keywords, scores, fact_check,
          fact_check_sources, sources, suggested_source_query
        ) VALUES (
          ${entry.entry_number},
          ${entry.title},
          ${entry.synopsis},
          ${entry.rationale},
          ${entry.category},
          ${entry.subcategory},
          ${entry.phase},
          ${entry.date_start},
          ${entry.date_end},
          ${entry.age},
          ${entry.keywords},
          ${JSON.stringify(entry.scores)},
          ${null},
          ${null},
          ${JSON.stringify(['news'])},
          ${null}
        )
      `;
      inserted++;
    }

    const sourceExists = await sql`
      select 1 from trump_sources where entry_number = ${entry.entry_number} and url = ${entry.source.url}
    `;
    if (sourceExists.length === 0) {
      await sql`
        INSERT INTO trump_sources (entry_number, url, title, publisher, source_type)
        VALUES (
          ${entry.entry_number},
          ${entry.source.url},
          ${entry.source.title},
          ${entry.source.publisher},
          'news'
        )
      `;
      sourcesInserted++;
    }
  }

  const allEntries = await sql`SELECT * FROM trump_entries ORDER BY entry_number`;
  fs.writeFileSync('logs/entries_snapshot.json', JSON.stringify(allEntries, null, 2));

  console.log(`Inserted ${inserted} entries.`);
  console.log(`Inserted ${sourcesInserted} sources.`);
  console.log(`Total entries: ${allEntries.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
