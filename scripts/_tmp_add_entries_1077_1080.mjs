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

const entries = [
  {
    entry_number: 1077,
    title: 'Links Greenland Push to Nobel Snub',
    synopsis: 'Trump messaged Norway’s prime minister saying that after being denied the Nobel Peace Prize he no longer felt obliged to think purely of peace and argued the U.S. needed complete control of Greenland.',
    rationale: 'Used Nobel resentment to justify aggressive rhetoric about taking Greenland and tariffs against Europe.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 2',
    date_start: '2026-01-19',
    date_end: '2026-01-19',
    keywords: ['Greenland', 'Nobel Peace Prize', 'Norway', 'tariffs'],
    scores: makeScores({
      date_start: '2026-01-19',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      insanity: 3,
      absurdity: 3,
      rationale_short: 'linked Nobel snub to threats over Greenland and trade retaliation.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/world/norwegian-leader-says-he-received-trump-message-that-reportedly-ties-greenland-to-nobel-peace-prize',
      title: 'Norwegian leader says he received Trump message that reportedly ties Greenland to not receiving Nobel Peace Prize',
      publisher: 'PBS News'
    }
  },
  {
    entry_number: 1078,
    title: 'Accepts Nobel Peace Prize Medal Gift From Machado',
    synopsis: 'Venezuelan opposition leader María Corina Machado presented Trump with her Nobel Peace Prize medal; Nobel officials reiterated that the prize is not transferable.',
    rationale: 'Accepted a symbolic Nobel medal gift and publicized it despite the Nobel Committee’s non-transfer rule.',
    category: 'Personal Awareness',
    subcategory: 'Public Gaffe',
    phase: 'White House 2',
    date_start: '2026-01-15',
    date_end: '2026-01-15',
    keywords: ['Nobel Peace Prize', 'Machado', 'Venezuela', 'medal'],
    scores: makeScores({
      date_start: '2026-01-15',
      category: 'Personal Awareness',
      subcategory: 'Public Gaffe',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 4,
      rationale_short: 'publicly accepted a Nobel medal gift while the committee stressed it cannot be transferred.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2026/jan/15/trump-at-a-glance-nobel-peace-prize',
      title: 'Trump news at a glance: The medal may be in Trump’s hands, but peace prize is not his, Nobel officials say',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1079,
    title: 'Routes Venezuelan Oil Proceeds Through Qatar Account Under U.S. Control',
    synopsis: 'The administration announced Venezuela’s sanctioned oil sales would be allowed with revenues routed through an account in Qatar under U.S. control for approved public spending.',
    rationale: 'Set up a foreign escrow-style account to control another country’s oil revenue distribution.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 2',
    date_start: '2026-01-29',
    date_end: '2026-01-29',
    keywords: ['Venezuela', 'oil', 'Qatar', 'sanctions'],
    scores: makeScores({
      date_start: '2026-01-29',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'directed Venezuelan oil revenues into a Qatar account controlled by the U.S.'
    }),
    source: {
      url: 'https://apnews.com/article/61ad64e8a983db7faaa80beb71ba1aa4',
      title: "Rubio details how the Trump administration will control Venezuela's oil money",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1080,
    title: 'Awards Venezuela Oil Licenses to Firms With Bribery Records',
    synopsis: 'The administration granted licenses to global traders with prior bribery cases to sell sanctioned Venezuelan oil, sparking transparency and corruption concerns.',
    rationale: 'Approved contracts to firms with documented bribery histories for high-stakes oil sales.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corporate Crime Protection',
    phase: 'White House 2',
    date_start: '2026-01-29',
    date_end: '2026-01-29',
    keywords: ['Venezuela', 'oil', 'licenses', 'bribery'],
    scores: makeScores({
      date_start: '2026-01-29',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corporate Crime Protection',
      danger: 3,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'authorized oil-sales firms with bribery records under limited oversight.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/business/2026/01/29/trump-venezuela-oil-vitol-trafigura-bribes/',
      title: 'Trump officials awarded Venezuela oil-sale contracts to firms tied to bribery',
      publisher: 'The Washington Post'
    }
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
