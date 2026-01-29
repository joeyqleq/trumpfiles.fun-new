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
    entry_number: 1049,
    title: 'Pushes Military Parade for Washington, D.C.',
    synopsis: 'Trump directed the Pentagon to plan a large military parade in Washington, D.C., drawing comparisons to authoritarian displays of force.',
    rationale: 'Sought a public military spectacle that critics saw as authoritarian theater.',
    category: 'Authoritarianism',
    subcategory: 'Domestic Militarization',
    phase: 'White House 1',
    date_start: '2018-02-06',
    date_end: '2018-02-06',
    keywords: ['military parade', 'Pentagon', 'Washington DC'],
    scores: makeScores({
      date_start: '2018-02-06',
      category: 'Authoritarianism',
      subcategory: 'Domestic Militarization',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'ordered planning for a large military parade in Washington, D.C.'
    }),
    source: {
      url: 'https://www.militarytimes.com/flashpoints/2018/02/06/trump-wants-huge-military-parade-in-washington/',
      title: 'Trump wants huge military parade in Washington',
      publisher: 'Military Times'
    }
  },
  {
    entry_number: 1050,
    title: 'Claims “Total Authority” to Reopen States',
    synopsis: 'Trump claimed he had “total authority” to order states to reopen during the COVID-19 pandemic.',
    rationale: 'Asserted sweeping authority over states’ public health decisions.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2020-04-13',
    date_end: '2020-04-13',
    keywords: ['total authority', 'COVID-19', 'reopen states'],
    scores: makeScores({
      date_start: '2020-04-13',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 5,
      rationale_short: 'claimed “total authority” to reopen states during the pandemic.'
    }),
    source: {
      url: 'https://www.politifact.com/factchecks/2020/apr/13/donald-trump/trump-claims-total-authority-over-states-reopen/',
      title: 'Trump claims “total authority” over states to reopen',
      publisher: 'PolitiFact'
    }
  },
  {
    entry_number: 1051,
    title: 'Tells Staff to “Slow the Testing Down”',
    synopsis: 'At a rally, Trump said he told staff to slow coronavirus testing, undercutting public health efforts.',
    rationale: 'Publicly urged reducing testing amid a deadly pandemic.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
    phase: 'White House 1',
    date_start: '2020-06-20',
    date_end: '2020-06-20',
    keywords: ['slow testing', 'COVID-19', 'rally'],
    scores: makeScores({
      date_start: '2020-06-20',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      insanity: 4,
      absurdity: 4,
      rationale_short: 'said he told staff to slow COVID-19 testing.'
    }),
    source: {
      url: 'https://www.forbes.com/sites/tommybeer/2020/06/20/trump-calls-for-slowing-down-coronavirus-testing-at-tulsa-rally/',
      title: 'Trump Calls For Slowing Down Coronavirus Testing At Tulsa Rally',
      publisher: 'Forbes'
    }
  },
  {
    entry_number: 1052,
    title: 'GAO Says Ukraine Aid Hold Broke the Law',
    synopsis: 'The Government Accountability Office found the Trump administration broke the law by withholding congressionally approved Ukraine military aid.',
    rationale: 'Withheld congressionally appropriated security assistance, prompting a GAO finding of illegality.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2019-12-22',
    date_end: '2019-12-22',
    keywords: ['Ukraine aid', 'GAO', 'withheld aid'],
    scores: makeScores({
      date_start: '2019-12-22',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'the GAO said the administration violated the law by holding Ukraine aid.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/12/22/trump-administration-decision-to-hold-ukraine-aid-broke-law.html',
      title: 'Trump administration decision to hold Ukraine aid broke law, watchdog says',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1053,
    title: 'CDC Changes Testing Guidance for Asymptomatic Exposure',
    synopsis: 'The CDC changed guidance to say people exposed to COVID-19 didn’t necessarily need a test, drawing criticism.',
    rationale: 'Shifted CDC testing guidance amid political pressure and backlash.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
    phase: 'White House 1',
    date_start: '2020-08-24',
    date_end: '2020-08-24',
    keywords: ['CDC guidance', 'testing', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-08-24',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'the CDC revised testing guidance for asymptomatic exposure.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/08/24/cdc-quietly-changes-covid-19-testing-guidelines.html',
      title: 'CDC quietly changes Covid-19 testing guidelines',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1054,
    title: 'Signs NDAA Creating the U.S. Space Force',
    synopsis: 'Trump signed the 2020 defense bill establishing the U.S. Space Force as a new military branch.',
    rationale: 'Expanded U.S. militarization by creating a new military branch.',
    category: 'National Security Violations',
    subcategory: 'War / Militarization',
    phase: 'White House 1',
    date_start: '2019-12-20',
    date_end: '2019-12-20',
    keywords: ['Space Force', 'NDAA', 'military branch'],
    scores: makeScores({
      date_start: '2019-12-20',
      category: 'National Security Violations',
      subcategory: 'War / Militarization',
      danger: 3,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'signed the defense bill creating the U.S. Space Force.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/12/20/trump-signs-2020-defense-bill-creating-the-space-force.html',
      title: 'Trump signs 2020 defense bill creating the Space Force',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1055,
    title: 'Restricts Travel from China Over COVID-19',
    synopsis: 'Trump issued a proclamation suspending entry of certain travelers from China due to the coronavirus outbreak.',
    rationale: 'Imposed sweeping travel restrictions tied to the pandemic response.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2020-01-31',
    date_end: '2020-01-31',
    keywords: ['China', 'travel restriction', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-01-31',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'issued a proclamation restricting entry from China due to COVID-19.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-persons-pose-risk-transmitting-2019-novel-coronavirus/',
      title: 'Proclamation on Suspension of Entry as Immigrants and Nonimmigrants of Certain Additional Persons Who Pose a Risk of Transmitting 2019 Novel Coronavirus',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1056,
    title: 'Restricts Travel from Iran Over COVID-19',
    synopsis: 'Trump issued a proclamation suspending entry of certain travelers from Iran due to the coronavirus outbreak.',
    rationale: 'Expanded pandemic travel restrictions to Iran.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2020-02-29',
    date_end: '2020-02-29',
    keywords: ['Iran', 'travel restriction', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-02-29',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'issued a proclamation restricting entry from Iran due to COVID-19.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-persons-pose-risk-transmitting-coronavirus/',
      title: 'Proclamation on Suspension of Entry as Immigrants and Nonimmigrants of Certain Additional Persons Who Pose a Risk of Transmitting Coronavirus',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1057,
    title: 'Restricts Travel from the Schengen Area',
    synopsis: 'Trump issued a proclamation suspending entry of certain travelers from the Schengen Area due to COVID-19.',
    rationale: 'Expanded pandemic travel bans to Europe’s Schengen Area.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2020-03-11',
    date_end: '2020-03-11',
    keywords: ['Schengen', 'Europe travel ban', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-03-11',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'issued a proclamation restricting entry from the Schengen Area.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-persons-pose-risk-transmitting-novel-coronavirus/',
      title: 'Proclamation on Suspension of Entry as Immigrants and Nonimmigrants of Certain Additional Persons Who Pose a Risk of Transmitting Novel Coronavirus',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1058,
    title: 'Restricts Travel from the U.K. and Ireland',
    synopsis: 'Trump issued a proclamation suspending entry of certain travelers from the U.K. and Ireland due to COVID-19.',
    rationale: 'Extended pandemic travel restrictions to the U.K. and Ireland.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2020-03-14',
    date_end: '2020-03-14',
    keywords: ['UK', 'Ireland', 'COVID-19 travel ban'],
    scores: makeScores({
      date_start: '2020-03-14',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'issued a proclamation restricting entry from the U.K. and Ireland.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-persons-pose-risk-transmitting-coronavirus-2/',
      title: 'Proclamation on Suspension of Entry as Immigrants and Nonimmigrants of Certain Additional Persons Who Pose a Risk of Transmitting Coronavirus',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1059,
    title: 'Restricts Travel from Brazil Over COVID-19',
    synopsis: 'Trump issued a proclamation suspending entry of certain travelers from Brazil due to the coronavirus outbreak.',
    rationale: 'Expanded pandemic travel restrictions to Brazil.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2020-05-24',
    date_end: '2020-05-24',
    keywords: ['Brazil', 'travel restriction', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-05-24',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'issued a proclamation restricting entry from Brazil.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-persons-pose-risk-transmitting-coronavirus-3/',
      title: 'Proclamation on Suspension of Entry as Immigrants and Nonimmigrants of Certain Additional Persons Who Pose a Risk of Transmitting Coronavirus',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1060,
    title: 'Terminates TPS for Haiti',
    synopsis: 'The Federal Register published the termination of Temporary Protected Status for Haiti, ending protections for Haitian TPS holders.',
    rationale: 'Ended humanitarian protections for Haitian TPS beneficiaries.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-01-18',
    date_end: '2018-01-18',
    keywords: ['TPS', 'Haiti', 'termination'],
    scores: makeScores({
      date_start: '2018-01-18',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for Haiti.'
    }),
    source: {
      url: 'https://www.federalregister.gov/documents/2018/01/18/2018-00886/termination-of-the-designation-of-haiti-for-temporary-protected-status',
      title: 'Termination of the Designation of Haiti for Temporary Protected Status',
      publisher: 'Federal Register'
    }
  },
  {
    entry_number: 1061,
    title: 'Terminates TPS for El Salvador',
    synopsis: 'The Federal Register published the termination of Temporary Protected Status for El Salvador, ending protections for Salvadoran TPS holders.',
    rationale: 'Ended humanitarian protections for Salvadoran TPS beneficiaries.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-01-18',
    date_end: '2018-01-18',
    keywords: ['TPS', 'El Salvador', 'termination'],
    scores: makeScores({
      date_start: '2018-01-18',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for El Salvador.'
    }),
    source: {
      url: 'https://www.federalregister.gov/documents/2018/01/18/2018-00885/termination-of-the-designation-of-el-salvador-for-temporary-protected-status',
      title: 'Termination of the Designation of El Salvador for Temporary Protected Status',
      publisher: 'Federal Register'
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
