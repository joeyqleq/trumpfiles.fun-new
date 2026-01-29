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

function phaseFor(dateStr) {
  return dateStr >= '2021-01-20' ? 'Between Terms' : 'White House 1';
}

const pardonsSource = {
  url: 'https://www.justice.gov/pardon/pardons-granted-president-donald-j-trump-2017-2021',
  title: 'Pardons Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

const commutationsSource = {
  url: 'https://www.justice.gov/pardon/commutations-granted-president-donald-j-trump-2017-2021',
  title: 'Commutations Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

const baseCategory = 'Grift / Financial Exploitation';
const baseSubcategory = 'Corrupt Pardons';

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
  return {
    entry_number,
    title,
    synopsis,
    rationale,
    category: baseCategory,
    subcategory: baseSubcategory,
    phase: phaseFor(date_start),
    date_start,
    date_end: date_start,
    keywords: [name, isPardon ? 'pardon' : 'commutation', 'clemency'],
    scores: makeScores({
      date_start,
      category: baseCategory,
      subcategory: baseSubcategory,
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: rationaleShort
    }),
    source: isPardon ? pardonsSource : commutationsSource
  };
}

const items = [
  // Commutations
  { type: 'commutation', name: 'Sholom Rubashkin', date_start: '2017-12-20' },
  { type: 'commutation', name: 'Tanya Santos', date_start: '2018-01-19' },

  // Pardons - May 24, 2018
  { type: 'pardon', name: 'Peter Y. Atkinson', date_start: '2018-05-24' },
  { type: 'pardon', name: 'John A. Boultbee', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Andrew Barron Worden', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Mary Ballard McCarty', date_start: '2018-05-24' },
  { type: 'pardon', name: 'James J. Kassouf', date_start: '2018-05-24' },
  { type: 'pardon', name: 'John Frederick Tate', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Jesse R. Benton', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Christopher Michael Wade', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Joseph Martin Stephens', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Christopher II X', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Aviem Sella', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Robert C. Sherrill', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Syrita Rashida Steib-Martin', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Patrick Lee Swisher', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Casey Urlacher', date_start: '2018-05-24' },
  { type: 'pardon', name: 'John Harold Wall', date_start: '2018-05-24' },
  { type: 'pardon', name: 'Robert Zangrillo', date_start: '2018-05-24' },

  // Commutations - Dec 24, 2018
  { type: 'commutation', name: 'Joseph Frederick', date_start: '2018-12-24' },
  { type: 'commutation', name: 'Mathew G. Charles', date_start: '2018-12-24' },

  // Pardons - 2019
  { type: 'pardon', name: 'Patrick James Nolan', date_start: '2019-05-15' },
  { type: 'pardon', name: 'Michael A. Tedesco', date_start: '2019-07-29' },
  { type: 'pardon', name: 'Roy McKeever', date_start: '2019-07-29' },
  { type: 'pardon', name: 'John Richard Bubala', date_start: '2019-07-29' },
  { type: 'pardon', name: 'Chalmer Lee Williams', date_start: '2019-07-29' },
  { type: 'pardon', name: 'Rodney M. Takumi', date_start: '2019-07-29' },
  { type: 'pardon', name: 'Zay Jeffries', date_start: '2019-10-10' },

  // Pardons - Feb 18, 2020
  { type: 'pardon', name: 'Ariel Manuel Friedler', date_start: '2020-02-18' },
  { type: 'pardon', name: 'David Hossein Safavian', date_start: '2020-02-18' },
  { type: 'pardon', name: 'Paul Harvey Pogue', date_start: '2020-02-18' },

  // Pardons - Aug 2020
  { type: 'pardon', name: 'Susan B. Anthony', date_start: '2020-08-18' },
  { type: 'pardon', name: 'Jon Donyae Ponder', date_start: '2020-08-25' },

  // Commutations - Oct 21, 2020
  { type: 'commutation', name: 'Lenora M. Logan', date_start: '2020-10-21' },
  { type: 'commutation', name: 'Curtis Lee McDonald', date_start: '2020-10-21' },
  { type: 'commutation', name: 'Charles Tanner', date_start: '2020-10-21' },
  { type: 'commutation', name: 'John Thomas Bolen', date_start: '2020-10-21' },
  { type: 'commutation', name: 'Rashella D. Reed', date_start: '2020-10-21' },

  // Pardons - Dec 22, 2020
  { type: 'pardon', name: 'Phillip Kay Lyman', date_start: '2020-12-22' },
  { type: 'pardon', name: 'Otis W. Gordon', date_start: '2020-12-22' },
  { type: 'pardon', name: 'Weldon Angelos', date_start: '2020-12-22' },

  // Commutations - Dec 22, 2020
  { type: 'commutation', name: 'Tynice Nichole Hall', date_start: '2020-12-22' },
  { type: 'commutation', name: 'Crystal Munoz', date_start: '2020-12-22' },

  // Pardons - Jan 13, 2021
  { type: 'pardon', name: 'Lynn Wade Barney', date_start: '2021-01-13' },
  { type: 'pardon', name: 'Paul L. Behrens', date_start: '2021-01-13' },
  { type: 'pardon', name: 'Thaddeus M.S. Bereday', date_start: '2021-01-13' },
  { type: 'pardon', name: 'Peter E. Clay', date_start: '2021-01-13' },

  // Pardons - Jan 19, 2021
  { type: 'pardon', name: 'Alex Adjmi', date_start: '2021-01-19' },
  { type: 'pardon', name: 'Fred Keith Alford', date_start: '2021-01-19' },
  { type: 'pardon', name: 'Mahmoud Reza Banki', date_start: '2021-01-19' }
];

const entries = items.map((item, index) => clemencyEntry({
  entry_number: 834 + index,
  ...item
}));

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
