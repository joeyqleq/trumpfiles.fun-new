import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const BATCH_SIZE = 80;
const PARDONS_HTML = '/tmp/trump_pardons.html';
const COMMUTATIONS_HTML = '/tmp/trump_commutations.html';
const PARDONS_URL = 'https://www.justice.gov/pardon/pardons-granted-president-donald-j-trump-2017-2021';
const COMMUTATIONS_URL = 'https://www.justice.gov/pardon/commutations-granted-president-donald-j-trump-2017-2021';

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

function decodeHtml(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(str) {
  return str.replace(/<[^>]*>/g, '');
}

function parseDate(dateStr) {
  const parts = dateStr.replace(',', '').split(' ');
  if (parts.length < 3) return null;
  const [monthName, day, year] = parts;
  const months = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
  };
  const mm = months[monthName];
  if (!mm) return null;
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function normalizeName(name) {
  let n = name.toLowerCase();
  n = n.replace(/aka/g, ' ');
  n = n.replace(/[^a-z\s]/g, ' ');
  const tokens = n.split(/\s+/).filter(Boolean);
  const stop = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);
  const cleaned = tokens.filter(t => !stop.has(t) && t.length > 1);
  if (cleaned.length === 0) return '';
  return `${cleaned[0]} ${cleaned[cleaned.length - 1]}`;
}

function parseHtmlList(html, type) {
  const sections = [];
  const h2 = /<h2[^>]*>([^<]+)<\/h2>/g;
  let match;
  while ((match = h2.exec(html)) !== null) {
    sections.push({ date: match[1].trim(), index: match.index });
  }
  const results = [];
  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].index;
    const end = i + 1 < sections.length ? sections[i + 1].index : html.length;
    const chunk = html.slice(start, end);
    const dateIso = parseDate(sections[i].date);
    if (!dateIso) continue;
    const rows = [...chunk.matchAll(/<tr>\s*<td[^>]*>(.*?)<\/td>/gs)];
    for (const row of rows) {
      const raw = row[1];
      const name = decodeHtml(stripTags(raw));
      if (!name) continue;
      results.push({ type, name, date: dateIso });
    }
  }
  return results;
}

async function ensureHtml(url, filepath) {
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, 'utf-8');
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(filepath, text);
  return text;
}

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

function phaseFor(dateStr) {
  return dateStr >= '2021-01-20' ? 'Between Terms' : 'White House 1';
}

const pardonsSource = {
  url: PARDONS_URL,
  title: 'Pardons Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

const commutationsSource = {
  url: COMMUTATIONS_URL,
  title: 'Commutations Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

function clemencyEntry({ entry_number, name, date_start, type }) {
  const isPardon = type === 'pardon';
  const title = isPardon ? `Pardons ${name}` : `Commutes Sentence of ${name}`;
  const synopsis = isPardon
    ? `Trump granted a presidential pardon to ${name} as part of a clemency list.`
    : `Trump commuted the sentence of ${name} as part of a clemency list.`;
  const rationale = isPardon
    ? `Granted clemency to ${name}.`
    : `Commuted the sentence of ${name}.`;
  const rationaleShort = isPardon
    ? `granted a presidential pardon to ${name}.`
    : `commuted the sentence of ${name}.`;
  const category = 'Grift / Financial Exploitation';
  const subcategory = 'Corrupt Pardons';
  return {
    entry_number,
    title,
    synopsis,
    rationale,
    category,
    subcategory,
    phase: phaseFor(date_start),
    date_start,
    date_end: date_start,
    keywords: [name, isPardon ? 'pardon' : 'commutation', 'clemency'],
    scores: makeScores({
      date_start,
      category,
      subcategory,
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: rationaleShort
    }),
    source: isPardon ? pardonsSource : commutationsSource
  };
}

loadEnv();
const sql = neon(process.env.DATABASE_URL);

async function run() {
  const pardonsHtml = await ensureHtml(PARDONS_URL, PARDONS_HTML);
  const commutationsHtml = await ensureHtml(COMMUTATIONS_URL, COMMUTATIONS_HTML);

  const parsedPardons = parseHtmlList(pardonsHtml, 'pardon');
  const parsedComms = parseHtmlList(commutationsHtml, 'commutation');

  const candidates = [...parsedPardons, ...parsedComms];

  const snapshot = JSON.parse(fs.readFileSync('logs/entries_snapshot.json', 'utf-8'));
  const existingKeys = new Set();
  for (const entry of snapshot) {
    const title = entry.title || '';
    if (title.startsWith('Pardons ')) {
      const name = title.replace('Pardons ', '').trim();
      existingKeys.add(normalizeName(name));
    }
    if (title.startsWith('Commutes Sentence of ')) {
      const name = title.replace('Commutes Sentence of ', '').trim();
      existingKeys.add(normalizeName(name));
    }
  }

  const filtered = candidates.filter(c => !existingKeys.has(normalizeName(c.name)));
  if (filtered.length === 0) {
    console.log('No new clemency entries found.');
    return;
  }

  const batch = filtered.slice(0, BATCH_SIZE);

  const maxRow = await sql`select max(entry_number) as max from trump_entries`;
  let nextNumber = (maxRow[0]?.max || 0) + 1;

  let inserted = 0;
  let sourcesInserted = 0;

  for (const item of batch) {
    const entry = clemencyEntry({
      entry_number: nextNumber,
      name: item.name,
      date_start: item.date,
      type: item.type
    });
    entry.age = calcAge(entry.date_start);

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

    nextNumber += 1;
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
