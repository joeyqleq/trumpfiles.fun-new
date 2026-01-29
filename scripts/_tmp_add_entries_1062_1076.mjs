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
    entry_number: 1062,
    title: 'Trump Organization and CFO Indicted for Tax Fraud',
    synopsis: 'Manhattan prosecutors indicted the Trump Organization and CFO Allen Weisselberg on tax fraud charges over an alleged compensation scheme.',
    rationale: 'Company and top executive were charged with long-running tax fraud tied to fringe benefits.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2021-07-01',
    date_end: '2021-07-01',
    keywords: ['Trump Organization', 'Allen Weisselberg', 'tax fraud', 'indictment'],
    scores: makeScores({
      date_start: '2021-07-01',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'was indicted on tax fraud charges involving employee compensation.'
    }),
    source: {
      url: 'https://www.cnbc.com/2021/07/01/trump-organization-cfo-indicted-on-tax-fraud-charges.html',
      title: 'Trump Organization schemed to dodge taxes, indictment charges',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1063,
    title: 'Weisselberg Pleads Guilty in Trump Organization Tax Scheme',
    synopsis: 'Former CFO Allen Weisselberg pleaded guilty to tax fraud charges tied to the Trump Organization’s compensation practices.',
    rationale: 'Trump Org CFO admitted to tax crimes in the company’s benefits scheme.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2022-08-18',
    date_end: '2022-08-18',
    keywords: ['Allen Weisselberg', 'guilty plea', 'tax fraud', 'Trump Organization'],
    scores: makeScores({
      date_start: '2022-08-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'pleaded guilty to tax fraud tied to Trump Organization compensation.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/08/18/ex-trump-org-cfo-allen-weisselberg-pleads-guilty-to-tax-fraud.html',
      title: 'Ex-Trump Org. CFO Allen Weisselberg pleads guilty to tax fraud',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1064,
    title: 'Weisselberg Sentenced to Jail for Tax Fraud',
    synopsis: 'A judge sentenced former Trump Organization CFO Allen Weisselberg to five months in jail following his tax fraud guilty plea.',
    rationale: 'Trump Org CFO was sentenced for tax fraud in the company’s compensation scheme.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2023-01-10',
    date_end: '2023-01-10',
    keywords: ['Allen Weisselberg', 'sentencing', 'tax fraud', 'Trump Organization'],
    scores: makeScores({
      date_start: '2023-01-10',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 2,
      lawlessness: 4,
      impact_scope: 2,
      authoritarianism: 1,
      rationale_short: 'was sentenced to jail for tax fraud after a guilty plea.'
    }),
    source: {
      url: 'https://apnews.com/article/trump-organization-criminal-tax-fraud-weisselberg-4d78a0a81f31614f95e6b2bb4e71a2a4',
      title: 'Trump executive Allen Weisselberg gets 5-month jail sentence',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1065,
    title: 'Trump Organization Fined $1.6M After Tax Fraud Conviction',
    synopsis: 'The Trump Organization was sentenced to pay a $1.6 million fine following its criminal tax fraud conviction.',
    rationale: 'Company penalized for tax crimes after a criminal conviction.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2023-01-13',
    date_end: '2023-01-13',
    keywords: ['Trump Organization', 'fine', 'tax fraud', 'sentencing'],
    scores: makeScores({
      date_start: '2023-01-13',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 2,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 1,
      rationale_short: 'was fined after a criminal tax fraud conviction.'
    }),
    source: {
      url: 'https://apnews.com/article/trump-organization-criminal-tax-fraud-sentencing-6b35c9fd6f2d45f1a9c3b7a83c2e8f1d',
      title: 'Trump Organization fined $1.6 million for tax fraud',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1066,
    title: 'Federal Prosecutors Subpoena Trump Inaugural Committee Records',
    synopsis: 'Federal prosecutors issued a broad subpoena to the Trump inaugural committee seeking records on donors and spending.',
    rationale: 'Inaugural fundraising came under criminal scrutiny by federal prosecutors.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Campaign Finance Fraud',
    phase: 'White House 1',
    date_start: '2019-02-04',
    date_end: '2019-02-04',
    keywords: ['inaugural committee', 'subpoena', 'federal prosecutors', 'donors'],
    scores: makeScores({
      date_start: '2019-02-04',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Campaign Finance Fraud',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'federal prosecutors subpoenaed records on inaugural donors and spending.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/national-security/federal-prosecutors-subpoena-trump-inaugural-committee/2019/02/04/88079cd0-28c7-11e9-90cd-dedb0c92dc17_story.html',
      title: 'Federal prosecutors issue sweeping subpoena for documents from Trump inaugural committee, a sign of a deepening criminal probe',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 1067,
    title: 'D.C. AG Sues Trump Inaugural Committee Over Hotel Payments',
    synopsis: 'The D.C. attorney general sued the Trump inaugural committee and Trump’s hotel, alleging nonprofit funds were used to enrich the president’s business.',
    rationale: 'Inaugural funds were alleged to have been steered to Trump’s hotel.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Campaign Finance Fraud',
    phase: 'White House 1',
    date_start: '2020-01-22',
    date_end: '2020-01-22',
    keywords: ['inaugural committee', 'lawsuit', 'Trump hotel', 'D.C. AG'],
    scores: makeScores({
      date_start: '2020-01-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Campaign Finance Fraud',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'D.C. sued over alleged misuse of inaugural funds at Trump’s hotel.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/01/22/trump-inauguration-committee-sued-for-overpaying-trump-hotel.html',
      title: "Trump inauguration committee sued for overpaying Trump's hotel",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1068,
    title: 'Kuwait Embassy Holds National Day Event at Trump D.C. Hotel',
    synopsis: 'Kuwait’s embassy held its National Day celebration at Trump’s Washington hotel, raising emoluments concerns.',
    rationale: 'A foreign government patronized a Trump property while he was president.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Emoluments Violations',
    phase: 'White House 1',
    date_start: '2017-02-25',
    date_end: '2017-02-25',
    keywords: ['Kuwait', 'embassy', 'Trump hotel', 'emoluments'],
    scores: makeScores({
      date_start: '2017-02-25',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Emoluments Violations',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'Kuwait’s embassy booked Trump’s D.C. hotel for a national event.'
    }),
    source: {
      url: 'https://www.wypr.org/wypr-news/2017-02-25/kuwait-celebration-at-trump-hotel-raises-conflict-of-interest-questions',
      title: 'Kuwait Celebration At Trump Hotel Raises Conflict Of Interest Questions',
      publisher: 'WYPR'
    }
  },
  {
    entry_number: 1069,
    title: 'Kuwait Embassy Returns to Trump Hotel for National Day',
    synopsis: 'Kuwait’s embassy again hosted its National Day celebration at Trump’s D.C. hotel the following year.',
    rationale: 'Repeat foreign-government spending at a Trump property while in office.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Emoluments Violations',
    phase: 'White House 1',
    date_start: '2018-01-26',
    date_end: '2018-01-26',
    keywords: ['Kuwait', 'embassy', 'Trump hotel', 'national day'],
    scores: makeScores({
      date_start: '2018-01-26',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Emoluments Violations',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'Kuwait’s embassy again held its national event at Trump’s hotel.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/politics/kuwaiti-embassy-to-hold-national-day-celebration-at-trumps-hotel-for-second-year-in-a-row/2018/01/26/c31b5a8c-02c2-11e8-bb03-722769454f82_story.html',
      title: 'Kuwaiti Embassy to hold National Day celebration at Trump’s hotel for second year in a row',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 1070,
    title: 'Saudi Lobbyists Book Trump Hotel Rooms After Election',
    synopsis: 'A Saudi-funded lobbying firm paid for hundreds of rooms at Trump’s D.C. hotel, drawing scrutiny over foreign influence.',
    rationale: 'Foreign lobbyists funneled money into a Trump property while he was president.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Emoluments Violations',
    phase: 'White House 1',
    date_start: '2018-12-05',
    date_end: '2018-12-05',
    keywords: ['Saudi Arabia', 'lobbyists', 'Trump hotel', 'emoluments'],
    scores: makeScores({
      date_start: '2018-12-05',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Emoluments Violations',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'Saudi-backed lobbyists spent heavily at Trump’s D.C. hotel.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/news/post-politics/wp/2018/12/05/saudi-funded-lobbyist-paid-for-500-rooms-at-trumps-hotel-after-2016-election/',
      title: 'Saudi-funded lobbyist paid for 500 rooms at Trump’s hotel after 2016 election',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 1071,
    title: 'GSA Clears Trump D.C. Hotel Lease Despite Conflict Concerns',
    synopsis: 'The General Services Administration said Trump’s company remained in compliance with its Old Post Office lease despite conflict-of-interest criticism.',
    rationale: 'Federal agency allowed Trump to keep a federal lease while president.',
    category: 'Government Corruption',
    subcategory: 'Conflicts of Interest',
    phase: 'White House 1',
    date_start: '2017-03-23',
    date_end: '2017-03-23',
    keywords: ['GSA', 'Old Post Office', 'Trump hotel', 'conflict of interest'],
    scores: makeScores({
      date_start: '2017-03-23',
      category: 'Government Corruption',
      subcategory: 'Conflicts of Interest',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'GSA declared the Trump hotel lease compliant despite conflict concerns.'
    }),
    source: {
      url: 'https://www.gsa.gov/about-us/newsroom/news-releases/gsa-informs-of-legal-review-of-post-office-building-leased-to-the-trump-organization-03232017',
      title: 'GSA informs of legal review of Post Office Building leased to the Trump Organization',
      publisher: 'U.S. General Services Administration'
    }
  },
  {
    entry_number: 1072,
    title: 'Trump Organization Ousted from Panama Hotel Branded Trump',
    synopsis: 'Owners of the Panama Trump hotel removed the Trump Organization from management after a dispute over the property.',
    rationale: 'A major overseas Trump-branded hotel severed ties amid conflict with owners.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Product / Licensing Failure',
    phase: 'White House 1',
    date_start: '2018-03-06',
    date_end: '2018-03-06',
    keywords: ['Panama', 'Trump Ocean Club', 'hotel', 'management dispute'],
    scores: makeScores({
      date_start: '2018-03-06',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Product / Licensing Failure',
      danger: 2,
      lawlessness: 2,
      impact_scope: 2,
      authoritarianism: 1,
      rationale_short: 'Panama hotel owners removed Trump Organization branding and management.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2018/mar/06/panama-trump-hotel-standoff-ends-as-president-surrenders-physical-control',
      title: 'Panama: Trump hotel standoff ends as president surrenders physical control',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1073,
    title: 'Senators Call for DOJ Probe of Trump Organization’s Azerbaijan Deal',
    synopsis: 'Senators urged the Justice Department to investigate the Trump Organization’s Azerbaijan project over corruption concerns.',
    rationale: 'Lawmakers sought investigation into foreign business ties while Trump was president.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Policy Business Conflicts',
    phase: 'White House 1',
    date_start: '2017-03-30',
    date_end: '2017-03-30',
    keywords: ['Azerbaijan', 'Baku', 'Trump Organization', 'DOJ probe'],
    scores: makeScores({
      date_start: '2017-03-30',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Policy Business Conflicts',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'senators requested a DOJ investigation into the Azerbaijan project.'
    }),
    source: {
      url: 'https://www.foreign.senate.gov/press/dem/release/senators-cardin-mccain-shaheen-call-on-doj-to-investigate-trump-organizations-deal-in-azerbaijan',
      title: 'Senators Cardin, McCain, Shaheen call on DOJ to investigate Trump Organization’s deal in Azerbaijan',
      publisher: 'U.S. Senate Foreign Relations Committee'
    }
  },
  {
    entry_number: 1074,
    title: 'Cambridge Analytica Tied to Trump Campaign Data Operations',
    synopsis: 'Reports revealed Cambridge Analytica’s role in the Trump campaign and its use of Facebook data to influence voters.',
    rationale: 'Data firm linked to Trump campaign targeting operations and privacy abuses.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'White House 1',
    date_start: '2017-03-17',
    date_end: '2017-03-17',
    keywords: ['Cambridge Analytica', 'Facebook data', 'Trump campaign', 'targeting'],
    scores: makeScores({
      date_start: '2017-03-17',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'reports tied Cambridge Analytica’s data practices to the Trump campaign.'
    }),
    source: {
      url: 'https://www.theguardian.com/news/2017/mar/17/cambridge-analytica-facebook-influence-us-election',
      title: 'Cambridge Analytica: the shady data analytics firm that came in from the cold',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1075,
    title: 'CREW Files Emoluments Lawsuit Against Trump',
    synopsis: 'The watchdog group CREW sued Trump, alleging violations of the Constitution’s emoluments clause over his business income.',
    rationale: 'Legal challenge targeted Trump’s profiting from office.',
    category: 'Government Corruption',
    subcategory: 'Conflicts of Interest',
    phase: 'White House 1',
    date_start: '2017-01-23',
    date_end: '2017-01-23',
    keywords: ['emoluments', 'CREW', 'lawsuit', 'conflicts'],
    scores: makeScores({
      date_start: '2017-01-23',
      category: 'Government Corruption',
      subcategory: 'Conflicts of Interest',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'CREW sued alleging unconstitutional emoluments from Trump businesses.'
    }),
    source: {
      url: 'https://www.npr.org/2017/01/23/511331608/trump-sued-over-possible-violation-of-emoluments-clause',
      title: 'Trump Sued Over Possible Violation Of Emoluments Clause',
      publisher: 'NPR'
    }
  },
  {
    entry_number: 1076,
    title: 'D.C. and Maryland Sue Trump Over Emoluments Clause',
    synopsis: 'The District of Columbia and Maryland filed suit alleging Trump’s businesses received unconstitutional benefits from foreign and domestic governments.',
    rationale: 'State governments sued over alleged emoluments violations tied to Trump properties.',
    category: 'Government Corruption',
    subcategory: 'Conflicts of Interest',
    phase: 'White House 1',
    date_start: '2017-06-12',
    date_end: '2017-06-12',
    keywords: ['emoluments', 'Maryland', 'D.C.', 'lawsuit'],
    scores: makeScores({
      date_start: '2017-06-12',
      category: 'Government Corruption',
      subcategory: 'Conflicts of Interest',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'D.C. and Maryland sued over alleged emoluments from Trump businesses.'
    }),
    source: {
      url: 'https://www.cnn.com/2017/06/12/politics/dc-maryland-sue-trump-emoluments/index.html',
      title: 'Maryland, DC sue Trump over emoluments clause',
      publisher: 'CNN'
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
