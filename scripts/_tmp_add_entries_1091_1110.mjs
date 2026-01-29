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
    entry_number: 1091,
    title: 'Gag Order Imposed in Hush Money Trial',
    synopsis: 'Judge Juan Merchan imposed a gag order limiting Trump’s public attacks on witnesses, jurors, and court staff in the New York hush money case.',
    rationale: 'Court restricted statements to protect trial participants and integrity of proceedings.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2024-03-26',
    date_end: '2024-03-26',
    keywords: ['gag order', 'hush money', 'Merchan', 'trial'],
    scores: makeScores({
      date_start: '2024-03-26',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 2,
      lawlessness: 2,
      impact_scope: 2,
      authoritarianism: 2,
      rationale_short: 'a judge imposed a gag order to protect trial participants.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/03/26/trump-hit-with-gag-order-in-new-york-hush-money-case-after-slamming-judge.html',
      title: 'Trump hit with gag order in New York hush money case after slamming judge',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1092,
    title: 'Fined for Violating Hush Money Gag Order',
    synopsis: 'Judge Merchan fined Trump $9,000 for multiple violations of the gag order during the hush money trial and warned of possible jail time for further breaches.',
    rationale: 'Held in contempt for violating court-ordered speech restrictions.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2024-04-30',
    date_end: '2024-04-30',
    keywords: ['gag order', 'contempt', 'fine', 'hush money'],
    scores: makeScores({
      date_start: '2024-04-30',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 2,
      lawlessness: 3,
      impact_scope: 2,
      authoritarianism: 2,
      rationale_short: 'was fined after repeated gag order violations.'
    }),
    source: {
      url: 'https://apnews.com/article/08898a4c2ad3824a3e98684b5e233aad',
      title: 'The Latest | Hush money trial enters 9th day, begins with gag order ruling and $9K fine for Trump',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1093,
    title: 'Hush Money Trial Begins with Jury Selection',
    synopsis: 'The first criminal trial of a former U.S. president began in Manhattan as jury selection opened in Trump’s hush money case.',
    rationale: 'Historic criminal trial against Trump commenced in New York state court.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2024-04-15',
    date_end: '2024-04-15',
    keywords: ['hush money', 'trial begins', 'jury selection', 'Manhattan'],
    scores: makeScores({
      date_start: '2024-04-15',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'the hush money criminal trial began with jury selection.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/03/25/trump-attends-hush-money-case-hearing-as-he-seeks-trial-delay.html',
      title: 'Trump hush money trial will start April 15, judge rules',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1094,
    title: 'Arraigned on Federal Classified Documents Charges',
    synopsis: 'Trump pleaded not guilty in Miami federal court to charges related to retaining classified documents and obstruction in the Mar-a-Lago case.',
    rationale: 'Entered a not-guilty plea in the federal documents prosecution.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2023-06-13',
    date_end: '2023-06-13',
    keywords: ['classified documents', 'arraignment', 'Mar-a-Lago', 'federal court'],
    scores: makeScores({
      date_start: '2023-06-13',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'pleaded not guilty at arraignment in the classified documents case.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2023/jun/13/trump-arraignment-not-guilty-charges-mar-a-lago-documents-court',
      title: 'Trump pleads not guilty to 37 federal criminal counts in Mar-a-Lago case',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1095,
    title: 'Superseding Indictment Adds New Charges in Documents Case',
    synopsis: 'Prosecutors filed a superseding indictment adding charges and a third defendant in the classified documents case, including allegations tied to surveillance footage deletion.',
    rationale: 'New federal charges expanded the scope of the documents case.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2023-07-27',
    date_end: '2023-07-27',
    keywords: ['superseding indictment', 'classified documents', 'obstruction', 'Mar-a-Lago'],
    scores: makeScores({
      date_start: '2023-07-27',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'a superseding indictment added new charges and a third defendant.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/07/27/third-defendant-added-to-trump-classified-documents-case.html',
      title: 'Trump hit with new charges in classified documents case',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1096,
    title: 'Classified Documents Case Dismissed by Judge Cannon',
    synopsis: 'Judge Aileen Cannon dismissed the federal classified documents case, citing issues with the special counsel’s appointment; the Justice Department said it would appeal.',
    rationale: 'Dismissal halted the federal documents prosecution pending appeal.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2024-07-15',
    date_end: '2024-07-15',
    keywords: ['classified documents', 'dismissed', 'Aileen Cannon', 'special counsel'],
    scores: makeScores({
      date_start: '2024-07-15',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'a judge dismissed the classified-documents case pending appeal.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/07/15/trump-classified-documents-case-dismissed-by-judge-over-special-counsel-appointment.html',
      title: 'Trump classified documents case dismissed by judge over special counsel appointment',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1097,
    title: 'Arraigned in Federal Election Interference Case',
    synopsis: 'Trump pleaded not guilty in Washington, D.C., to federal charges related to efforts to overturn the 2020 election.',
    rationale: 'Entered a not-guilty plea in the federal election interference prosecution.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-08-03',
    date_end: '2023-08-03',
    keywords: ['arraignment', 'federal election case', 'D.C.', 'not guilty'],
    scores: makeScores({
      date_start: '2023-08-03',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 5,
      lawlessness: 5,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'pleaded not guilty in the federal election interference case.'
    }),
    source: {
      url: 'https://time.com/6301412/trump-arraignment-jan-6-indictment/',
      title: 'Trump Pleads Not Guilty on Election Charges as Lawyers Argue Over Trial Schedule',
      publisher: 'Time'
    }
  },
  {
    entry_number: 1098,
    title: 'Gag Order Imposed in Federal Election Case',
    synopsis: 'Judge Tanya Chutkan imposed a limited gag order restricting Trump from targeting prosecutors, court staff and witnesses in the federal election case.',
    rationale: 'Court restricted statements to reduce intimidation risks and protect proceedings.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-10-16',
    date_end: '2023-10-16',
    keywords: ['gag order', 'Tanya Chutkan', 'election case', 'witnesses'],
    scores: makeScores({
      date_start: '2023-10-16',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'a federal judge imposed a limited gag order in the election case.'
    }),
    source: {
      url: 'https://apnews.com/article/b5f59c6688504c952df5f70029228f9e',
      title: 'Trump has narrow gag order imposed on him by federal judge overseeing 2020 election subversion case',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1099,
    title: 'Gag Order Reimposed in Federal Election Case',
    synopsis: 'Judge Chutkan reinstated the gag order in the federal election interference case after a temporary pause during appeal.',
    rationale: 'Court reimposed speech restrictions to protect the case after appeal arguments.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-10-30',
    date_end: '2023-10-30',
    keywords: ['gag order', 'reinstated', 'federal election case', 'Chutkan'],
    scores: makeScores({
      date_start: '2023-10-30',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'a federal judge reinstated the gag order after a temporary pause.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/10/30/trump-gag-order-reinstated-in-jack-smith-federal-election-case.html',
      title: 'Trump gag order reinstated in Jack Smith federal election case',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1100,
    title: 'Appeals Court Narrows but Upholds Gag Order',
    synopsis: 'The D.C. Circuit largely upheld the gag order in the federal election case while narrowing parts of the restrictions.',
    rationale: 'Appeals court kept speech limits in place with modifications.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-12-08',
    date_end: '2023-12-08',
    keywords: ['appeals court', 'gag order', 'D.C. Circuit', 'election case'],
    scores: makeScores({
      date_start: '2023-12-08',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'appeals court upheld the gag order with narrower limits.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2023/dec/08/trump-special-counsel-federal-election-case-gag-order',
      title: 'Appeals court largely upholds Trump gag order in election interference case',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1101,
    title: 'Appeals Court Rejects Immunity Claim in Election Case',
    synopsis: 'The D.C. Circuit rejected Trump’s claim of presidential immunity in the federal election interference case.',
    rationale: 'Appellate court ruled Trump is not immune from prosecution in the election case.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2024-02-06',
    date_end: '2024-02-06',
    keywords: ['immunity claim', 'D.C. Circuit', 'election case', 'appeal'],
    scores: makeScores({
      date_start: '2024-02-06',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 3,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'appeals court rejected Trump’s immunity claim in the election case.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/02/06/trump-election-case-appeals-court-denies-ex-president-immunity.html',
      title: 'Trump loses immunity appeal in 2020 election case',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1102,
    title: 'Supreme Court Grants Immunity for Official Acts',
    synopsis: 'The U.S. Supreme Court ruled that presidents have immunity for official acts, reshaping the scope of federal prosecution in the election case.',
    rationale: 'High court expanded presidential immunity for official acts, affecting accountability.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'Post-Presidency',
    date_start: '2024-07-01',
    date_end: '2024-07-01',
    keywords: ['Supreme Court', 'immunity', 'official acts', 'election case'],
    scores: makeScores({
      date_start: '2024-07-01',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 5,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 5,
      rationale_short: 'the Supreme Court ruled presidents have immunity for official acts.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/07/01/donald-trump-immunity-supreme-court-ruling.html',
      title: 'Supreme Court rules Trump has immunity for official acts',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1103,
    title: 'Booked and Mugshot Taken in Georgia Election Case',
    synopsis: 'Trump surrendered at the Fulton County jail in Georgia and was booked and photographed in the state election interference case.',
    rationale: 'Surrendered and booked in the Georgia election racketeering case.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-08-24',
    date_end: '2023-08-24',
    keywords: ['Georgia', 'mugshot', 'Fulton County', 'booking'],
    scores: makeScores({
      date_start: '2023-08-24',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 3,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'was booked and photographed in the Georgia election case.'
    }),
    source: {
      url: 'https://apnews.com/article/7f4e9860859fbb71221b6a5163aaa42f',
      title: 'Mug shot of Donald Trump shows scowling former president during speedy booking at Atlanta jail',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1104,
    title: 'Judge Allows Willis to Stay on Georgia Case if Wade Leaves',
    synopsis: 'A Georgia judge ruled that District Attorney Fani Willis could remain on the case if special prosecutor Nathan Wade resigned, which he did.',
    rationale: 'Ruling preserved the Georgia prosecution while addressing appearance of impropriety.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2024-03-15',
    date_end: '2024-03-15',
    keywords: ['Fani Willis', 'Nathan Wade', 'Georgia case', 'ruling'],
    scores: makeScores({
      date_start: '2024-03-15',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'judge allowed the Georgia case to proceed if Wade stepped aside.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2024/mar/15/fani-willis-hearing-decision-trump-georgia',
      title: "Fani Willis can stay on Trump Georgia case as judge criticizes 'lapse in judgment'",
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1105,
    title: 'Engoron Rules Trump Liable for Fraud in NY Civil Case',
    synopsis: 'Judge Arthur Engoron granted partial summary judgment, finding Trump and his company liable for fraud and canceling business certificates in New York.',
    rationale: 'Court found fraudulent financial statements in the NY civil case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2023-09-26',
    date_end: '2023-09-26',
    keywords: ['civil fraud', 'summary judgment', 'Engoron', 'New York'],
    scores: makeScores({
      date_start: '2023-09-26',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 3,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'judge found Trump liable for fraud and canceled business certificates.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/09/26/trump-and-company-liable-for-fraud-in-new-york-lawsuit-judge-rules.html',
      title: 'Trump and company liable for fraud in New York lawsuit, judge rules',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1106,
    title: 'Appeals Court Cuts Civil Fraud Bond to $175 Million',
    synopsis: 'A New York appeals court reduced Trump’s bond requirement in the civil fraud case from $464 million to $175 million and granted time to post it.',
    rationale: 'Court reduced bond while appeal proceeds in the civil fraud case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2024-03-25',
    date_end: '2024-03-25',
    keywords: ['civil fraud', 'bond reduction', 'appeals court', 'New York'],
    scores: makeScores({
      date_start: '2024-03-25',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      rationale_short: 'appeals court reduced the bond required to pause enforcement.'
    }),
    source: {
      url: 'https://www.ft.com/content/a3223d98-82ea-40b2-b7c8-40ee4ff7f088',
      title: "Donald Trump's bond reduced to $175mn in civil fraud case",
      publisher: 'Financial Times'
    }
  },
  {
    entry_number: 1107,
    title: 'Colorado Supreme Court Disqualifies Trump from Ballot',
    synopsis: 'Colorado’s Supreme Court ruled that Trump is disqualified from the state’s 2024 primary ballot under the 14th Amendment’s insurrection clause, pending appeal.',
    rationale: 'State high court invoked Section 3 to bar Trump from the ballot.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-12-19',
    date_end: '2023-12-19',
    keywords: ['Colorado', 'ballot', '14th Amendment', 'disqualification'],
    scores: makeScores({
      date_start: '2023-12-19',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'Colorado’s Supreme Court ruled him disqualified under Section 3.'
    }),
    source: {
      url: 'https://apnews.com/article/d16dd8f354eeaf450558378c65fd79a2',
      title: 'Donald Trump banned from Colorado ballot in historic ruling by state\'s Supreme Court',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1108,
    title: 'Supreme Court Keeps Trump on Ballots Nationwide',
    synopsis: 'The U.S. Supreme Court unanimously ruled that states cannot bar Trump from the ballot under the 14th Amendment, reversing Colorado’s decision.',
    rationale: 'High court said states lack authority to disqualify presidential candidates under Section 3.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2024-03-04',
    date_end: '2024-03-04',
    keywords: ['Supreme Court', 'ballot', '14th Amendment', 'Colorado'],
    scores: makeScores({
      date_start: '2024-03-04',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'the Supreme Court ruled states cannot bar Trump from ballots.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/03/04/supreme-court-rules-in-trump-colorado-ballot-case.html',
      title: 'Supreme Court: States can\'t block Trump from ballot',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1109,
    title: 'Maine Secretary of State Disqualifies Trump from Primary Ballot',
    synopsis: 'Maine’s secretary of state ruled Trump ineligible for the 2024 Republican primary ballot under the 14th Amendment, pending appeal.',
    rationale: 'State official invoked Section 3 to bar Trump from the primary ballot.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-12-28',
    date_end: '2023-12-28',
    keywords: ['Maine', 'ballot', '14th Amendment', 'disqualification'],
    scores: makeScores({
      date_start: '2023-12-28',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'Maine’s secretary of state ruled him ineligible under Section 3.'
    }),
    source: {
      url: 'https://apnews.com/article/081fd38ce1f20be9b8423cb2f8c66dee',
      title: 'Maine bars Trump from ballot as US Supreme Court weighs states\' authority to block former president',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1110,
    title: 'Illinois Judge Removes Trump from Primary Ballot',
    synopsis: 'An Illinois judge ruled that Trump should be removed from the state’s Republican primary ballot under the 14th Amendment, with the decision stayed pending appeal.',
    rationale: 'State judge applied Section 3 disqualification to Trump’s primary ballot access.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2024-02-28',
    date_end: '2024-02-28',
    keywords: ['Illinois', 'ballot', '14th Amendment', 'disqualification'],
    scores: makeScores({
      date_start: '2024-02-28',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'an Illinois judge ordered Trump removed from the primary ballot.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/02/28/trump-is-disqualified-from-illinois-ballot-judge-rules.html',
      title: 'Trump is disqualified from Illinois ballot, judge rules',
      publisher: 'CNBC'
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
