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
    entry_number: 1084,
    title: 'Mazars Drops Trump Org and Disavows Financial Statements',
    synopsis: 'Trump’s longtime accounting firm Mazars ended its relationship with the Trump Organization and said years of financial statements should no longer be relied upon.',
    rationale: 'Accounting firm withdrew and disclaimed past statements tied to Trump’s business filings.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2022-02-14',
    date_end: '2022-02-14',
    keywords: ['Mazars', 'financial statements', 'Trump Organization'],
    scores: makeScores({
      date_start: '2022-02-14',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'accounting firm ended ties and said statements should not be relied upon.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/02/14/trump-tax-firm-says-documents-not-reliable.html',
      title: 'Trump tax firm says documents not reliable',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1085,
    title: 'Held in Contempt for Failing to Comply with NY AG Subpoena',
    synopsis: 'A New York judge held Trump in civil contempt for failing to comply with a subpoena in the state attorney general’s investigation and imposed a $10,000-per-day fine.',
    rationale: 'Court sanctioned Trump for obstructing a lawful subpoena in a civil fraud probe.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-04-25',
    date_end: '2022-04-25',
    keywords: ['contempt', 'subpoena', 'Letitia James', 'civil probe'],
    scores: makeScores({
      date_start: '2022-04-25',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'was held in contempt and fined for noncompliance with a subpoena.'
    }),
    source: {
      url: 'https://ag.ny.gov/press-release/2022/court-rules-donald-j-trump-contempt-court-failure-comply-judges-order-attorney',
      title: 'Court Rules Donald J. Trump in Contempt of Court for Failure to Comply with Judge’s Order in Attorney General James’ Investigation',
      publisher: 'New York Attorney General'
    }
  },
  {
    entry_number: 1086,
    title: 'Pays $110,000 Toward Contempt Fine, Order Not Lifted',
    synopsis: 'Trump paid $110,000 toward a contempt fine in the New York attorney general’s investigation, but the contempt order remained in place pending additional conditions.',
    rationale: 'Paid fines while continuing to face court enforcement over subpoena compliance.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-05-20',
    date_end: '2022-05-20',
    keywords: ['contempt fine', 'subpoena', 'Trump Organization'],
    scores: makeScores({
      date_start: '2022-05-20',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 3,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'paid $110,000 toward a contempt fine while order remained active.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/05/20/trump-pays-110000-fine-contempt-order-not-lifted-new-york-ags-office-says.html',
      title: 'Trump pays $110,000 fine, contempt order not lifted: New York AG',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1087,
    title: 'Invokes Fifth Amendment in NY AG Deposition',
    synopsis: 'Trump said he invoked the Fifth Amendment in a deposition for the New York attorney general’s civil investigation into the Trump Organization’s business practices.',
    rationale: 'Refused to answer substantive questions in a civil fraud investigation.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-08-10',
    date_end: '2022-08-10',
    keywords: ['Fifth Amendment', 'deposition', 'Letitia James'],
    scores: makeScores({
      date_start: '2022-08-10',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'invoked the Fifth in a deposition for the NY AG civil probe.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/08/10/trump-says-he-refused-to-answer-ny-attorney-generals-questions-in-probe-of-his-business.html',
      title: 'Trump says he refused to answer NY attorney general’s questions in probe of his business',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1088,
    title: 'GSA Approves Sale of Trump D.C. Hotel Lease',
    synopsis: 'The GSA approved the sale of Trump’s D.C. hotel lease to CGI Merchant Group, moving the deal forward after years of conflict-of-interest controversy.',
    rationale: 'Federal agency approved transfer of a controversial government lease tied to Trump’s business.',
    category: 'Government Corruption',
    subcategory: 'Conflicts of Interest',
    phase: 'Post-Presidency',
    date_start: '2022-03-25',
    date_end: '2022-03-25',
    keywords: ['GSA', 'Trump hotel', 'lease sale', 'CGI Merchant Group'],
    scores: makeScores({
      date_start: '2022-03-25',
      category: 'Government Corruption',
      subcategory: 'Conflicts of Interest',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'GSA approved sale of the Trump D.C. hotel lease to CGI.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/business/2022/03/25/gsa-approves-trump-dc-hotel-sale/',
      title: 'GSA approves sale of Trump’s D.C. hotel to CGI Merchant Group',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 1089,
    title: 'Senate Finance Probes Trump Interference in Halkbank Case',
    synopsis: 'Senate Finance Committee Chair Ron Wyden said his investigation continued into alleged Trump administration interference in the Halkbank sanctions-evasion prosecution after lobbying by Turkey.',
    rationale: 'Congressional oversight raised concerns about political interference in a major sanctions case.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'Post-Presidency',
    date_start: '2021-03-11',
    date_end: '2021-03-11',
    keywords: ['Halkbank', 'Turkey', 'sanctions', 'Wyden'],
    scores: makeScores({
      date_start: '2021-03-11',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Senate Finance said it was probing alleged interference in Halkbank case.'
    }),
    source: {
      url: 'https://www.finance.senate.gov/chairmans-news/wyden-continues-investigation-into-trump-interference-in-halkbank-case-on-behalf-of-turkey',
      title: 'Wyden Continues Investigation into Trump Interference in Halkbank Case on Behalf of Turkey',
      publisher: 'U.S. Senate Finance Committee'
    }
  },
  {
    entry_number: 1090,
    title: 'Fined $5,000 for Violating Gag Order in Civil Fraud Trial',
    synopsis: 'A New York judge fined Trump $5,000 for violating a gag order during his civil fraud trial after a disparaging post about a court staffer remained on his campaign website.',
    rationale: 'Court sanctioned Trump for violating a gag order protecting court staff.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'Post-Presidency',
    date_start: '2023-10-20',
    date_end: '2023-10-20',
    keywords: ['gag order', 'civil fraud trial', 'Engoron', 'fine'],
    scores: makeScores({
      date_start: '2023-10-20',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 2,
      lawlessness: 3,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'was fined for violating a gag order protecting court staff.'
    }),
    source: {
      url: 'https://apnews.com/article/ce593e3ee07d95bb6ec7e2de23f47dc9',
      title: 'Judge fines Donald Trump $5,000 after post maligning court staffer is found on campaign website',
      publisher: 'Associated Press'
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
