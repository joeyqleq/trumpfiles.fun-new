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
    entry_number: 1136,
    title: 'Sessions Recuses from Russia Investigation',
    synopsis: 'Attorney General Jeff Sessions announced he would recuse himself from DOJ matters related to the 2016 campaign and Russia.',
    rationale: 'Sessions stepped aside amid conflict concerns over the Russia investigation.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2017-03-02',
    date_end: '2017-03-02',
    keywords: ['Sessions', 'recusal', 'Russia investigation', 'DOJ'],
    scores: makeScores({
      date_start: '2017-03-02',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Sessions recused himself from Russia-related matters.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/watch-live-jeff-sessions-expected-to-address-russia-investigation-in-news-briefing',
      title: 'WATCH: Jeff Sessions recuses himself from Russia investigation',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1137,
    title: 'DOJ Appoints Robert Mueller as Special Counsel',
    synopsis: 'Deputy AG Rod Rosenstein appointed Robert Mueller as special counsel to oversee the Russia investigation.',
    rationale: 'The appointment created an independent probe into Russian interference and Trump campaign ties.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2017-05-17',
    date_end: '2017-05-17',
    keywords: ['Mueller', 'special counsel', 'Russia investigation', 'DOJ'],
    scores: makeScores({
      date_start: '2017-05-17',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Rosenstein appointed Mueller as special counsel.'
    }),
    source: {
      url: 'https://www.justice.gov/archives/opa/pr/appointment-special-counsel',
      title: 'Appointment of Special Counsel',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 1138,
    title: 'Trump Creates Election Integrity Commission',
    synopsis: 'Trump signed an executive order establishing the Presidential Advisory Commission on Election Integrity.',
    rationale: 'Commission was formed amid baseless voter-fraud claims and sought sweeping election data.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2017-05-11',
    date_end: '2017-05-11',
    keywords: ['Election Integrity Commission', 'executive order', 'voter fraud', 'Pence'],
    scores: makeScores({
      date_start: '2017-05-11',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Trump created the Election Integrity Commission by executive order.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-executive-order-establishment-presidential-advisory-commission-election-integrity/',
      title: 'Presidential Executive Order on the Establishment of Presidential Advisory Commission on Election Integrity',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 1139,
    title: 'Trump Claims Millions of Illegal Votes Without Evidence',
    synopsis: 'Trump asserted that 3 to 5 million illegal votes cost him the popular vote.',
    rationale: 'Baseless fraud claims undermined trust in the election system.',
    category: 'Conspiracy Theories / Disinformation',
    subcategory: 'Election Fraud Claims',
    phase: 'White House 1',
    date_start: '2017-01-23',
    date_end: '2017-01-23',
    keywords: ['illegal votes', 'popular vote', 'voter fraud', '2016'],
    scores: makeScores({
      date_start: '2017-01-23',
      category: 'Conspiracy Theories / Disinformation',
      subcategory: 'Election Fraud Claims',
      danger: 2,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'Trump claimed millions of illegal votes without evidence.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/ap-report-trump-advances-false-claim-3-5-million-voted-illegally',
      title: 'AP report: Trump advances false claim that 3-5 million voted illegally',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1140,
    title: 'White House Claims Record Inauguration Crowd Size',
    synopsis: 'Press secretary Sean Spicer said Trump’s inauguration drew the largest audience ever, a claim disputed by evidence and fact-checkers.',
    rationale: 'The administration opened with a high-profile false crowd-size claim.',
    category: 'Conspiracy Theories / Disinformation',
    subcategory: 'Systematic Presidential Lying',
    phase: 'White House 1',
    date_start: '2017-01-21',
    date_end: '2017-01-21',
    keywords: ['inauguration', 'crowd size', 'Spicer', 'false claims'],
    scores: makeScores({
      date_start: '2017-01-21',
      category: 'Conspiracy Theories / Disinformation',
      subcategory: 'Systematic Presidential Lying',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'the White House claimed a record inauguration crowd size.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/news/fact-checker/wp/2017/01/22/spicer-earns-four-pinocchios-for-a-series-of-false-claims-on-inauguration-crowd-size/',
      title: 'Spicer earns Four Pinocchios for false claims on inauguration crowd size',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 1141,
    title: 'House Votes to Form Jan. 6 Select Committee',
    synopsis: 'The House approved a select committee to investigate the Jan. 6 attack and Trump’s role.',
    rationale: 'Congress launched a formal investigation into the insurrection and Trump’s actions.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2021-06-30',
    date_end: '2021-06-30',
    keywords: ['Jan. 6 committee', 'House vote', 'insurrection', 'investigation'],
    scores: makeScores({
      date_start: '2021-06-30',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the House formed the Jan. 6 select committee.'
    }),
    source: {
      url: 'https://www.cnbc.com/2021/06/30/house-approves-select-committee-to-investigate-pro-trump-capitol-insurrection-.html',
      title: 'House approves select committee to investigate pro-Trump Capitol insurrection',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1142,
    title: 'Jan. 6 Committee Holds First Public Hearing',
    synopsis: 'The committee opened televised hearings presenting evidence about Trump’s efforts to overturn the 2020 election.',
    rationale: 'Public hearings detailed a coordinated effort to reverse the election outcome.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-06-09',
    date_end: '2022-06-09',
    keywords: ['Jan. 6 hearing', 'public hearing', 'committee', 'Capitol attack'],
    scores: makeScores({
      date_start: '2022-06-09',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the committee held its first public hearing.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/06/09/trump-capitol-riot-hearing-jan-6-investigators-release-new-findings.html',
      title: 'Trump Capitol riot hearing: Jan. 6 investigators release new findings',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1143,
    title: 'Jan. 6 Committee Releases Final Report',
    synopsis: 'The select committee released its final report detailing its findings on Trump and the Capitol attack.',
    rationale: 'Final report consolidated evidence and conclusions about the insurrection.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-12-22',
    date_end: '2022-12-22',
    keywords: ['final report', 'Jan. 6 committee', 'insurrection', 'findings'],
    scores: makeScores({
      date_start: '2022-12-22',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Jan. 6 committee released its final report.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/read-the-final-report-from-the-jan-6-committee',
      title: 'Read the final report from the Jan. 6 committee',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1144,
    title: 'Supreme Court Allows Release of Trump Jan. 6 Records',
    synopsis: 'The Supreme Court rejected Trump’s bid to block the Jan. 6 committee from obtaining presidential records.',
    rationale: 'Court decision cleared the way for Congress to access White House records.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-01-19',
    date_end: '2022-01-19',
    keywords: ['Supreme Court', 'Jan. 6 records', 'executive privilege', 'National Archives'],
    scores: makeScores({
      date_start: '2022-01-19',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Supreme Court allowed records to be turned over to the committee.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/supreme-court-allows-jan-6-committee-to-get-trump-presidential-documents',
      title: 'Supreme Court allows Jan. 6 committee to get Trump presidential documents',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1145,
    title: 'Supreme Court Clears Way for House to Obtain Tax Returns',
    synopsis: 'The Supreme Court rejected Trump’s request to block the House from obtaining his tax returns.',
    rationale: 'Decision ended a long legal battle over congressional oversight of Trump’s finances.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-11-22',
    date_end: '2022-11-22',
    keywords: ['tax returns', 'Supreme Court', 'House Ways and Means', 'oversight'],
    scores: makeScores({
      date_start: '2022-11-22',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Supreme Court cleared the way for House access to tax returns.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/supreme-court-clears-way-for-handover-of-trump-tax-returns-to-congress',
      title: 'Supreme Court clears way for handover of Trump tax returns to Congress',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1146,
    title: 'Mar-a-Lago Search Warrant and Receipt Unsealed',
    synopsis: 'A judge unsealed the Mar-a-Lago search warrant and property receipt showing classified documents seized.',
    rationale: 'Court filings revealed the scope of classified records recovered by the FBI.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2022-08-12',
    date_end: '2022-08-12',
    keywords: ['Mar-a-Lago', 'search warrant', 'classified documents', 'property receipt'],
    scores: makeScores({
      date_start: '2022-08-12',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'the Mar-a-Lago search warrant and receipt were unsealed.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/read-the-warrant-behind-fbi-search-of-trumps-mar-a-lago',
      title: 'Read the warrant behind FBI search of Trump’s Mar-a-Lago',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1147,
    title: 'Judge Orders Partial Unsealing of Mar-a-Lago Affidavit',
    synopsis: 'A federal judge said parts of the affidavit used to obtain the Mar-a-Lago search warrant could be unsealed.',
    rationale: 'The ruling opened the door to public disclosure in the classified-documents probe.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2022-08-18',
    date_end: '2022-08-18',
    keywords: ['Mar-a-Lago', 'affidavit', 'unsealed', 'FBI search'],
    scores: makeScores({
      date_start: '2022-08-18',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'a judge ordered partial unsealing of the search affidavit.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/08/18/affidavit-used-in-search-of-trumps-mar-a-lago-to-be-partially-unsealed-judge-says.html',
      title: 'Affidavit used in search of Trump’s Mar-a-Lago to be partially unsealed, judge says',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1148,
    title: 'Judge Grants Special Master Review of Mar-a-Lago Seized Records',
    synopsis: 'A federal judge granted Trump’s request for a special master to review records seized at Mar-a-Lago.',
    rationale: 'Special master order temporarily slowed DOJ access to seized materials.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2022-09-05',
    date_end: '2022-09-05',
    keywords: ['special master', 'Mar-a-Lago', 'classified documents', 'Aileen Cannon'],
    scores: makeScores({
      date_start: '2022-09-05',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'a judge granted a special master review in the Mar-a-Lago case.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/nation/judge-grants-trump-bid-for-special-master-to-review-documents-in-mar-a-lago-case',
      title: 'Judge grants Trump bid for special master to review documents in Mar-a-Lago case',
      publisher: 'PBS News'
    }
  },
  {
    entry_number: 1149,
    title: 'Appeals Court Ends Special Master Review in Mar-a-Lago Case',
    synopsis: 'The 11th Circuit halted the special master review, clearing DOJ access to seized records.',
    rationale: 'Appeals court removed a major obstacle in the classified-documents investigation.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2022-12-01',
    date_end: '2022-12-01',
    keywords: ['11th Circuit', 'special master', 'Mar-a-Lago', 'classified documents'],
    scores: makeScores({
      date_start: '2022-12-01',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the appeals court halted the special master review.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/federal-appeals-court-halts-special-master-review-of-trumps-mar-a-lago-documents',
      title: 'Federal appeals court halts special master review of Trump’s Mar-a-Lago documents',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1150,
    title: 'DWAC and Trump Media Announce Merger Deal',
    synopsis: 'Trump Media & Technology Group and DWAC announced a merger agreement to take the company public.',
    rationale: 'SPAC deal launched Trump Media’s plan to go public.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2021-10-20',
    date_end: '2021-10-20',
    keywords: ['DWAC', 'Trump Media', 'merger', 'SPAC'],
    scores: makeScores({
      date_start: '2021-10-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'DWAC and Trump Media announced a merger agreement.'
    }),
    source: {
      url: 'https://www.sec.gov/Archives/edgar/data/1849635/000110465921128231/tm2130724d1_ex99-1.htm',
      title: 'Trump Media & Technology Group and Digital World Acquisition Corp. Merger Announcement',
      publisher: 'U.S. Securities and Exchange Commission'
    }
  },
  {
    entry_number: 1151,
    title: 'SEC Charges DWAC Over Merger Disclosures',
    synopsis: 'The SEC announced settled charges against DWAC for misstatements about its Trump Media merger.',
    rationale: 'Regulators said DWAC misled investors about merger discussions.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2023-07-20',
    date_end: '2023-07-20',
    keywords: ['SEC', 'DWAC', 'charges', 'disclosures'],
    scores: makeScores({
      date_start: '2023-07-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 2,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the SEC charged DWAC over merger disclosure failures.'
    }),
    source: {
      url: 'https://www.sec.gov/newsroom/press-releases/2023-135',
      title: 'SEC Charges Digital World SPAC for Material Misrepresentations to Investors',
      publisher: 'U.S. Securities and Exchange Commission'
    }
  },
  {
    entry_number: 1152,
    title: 'Trump Media Begins Trading on Nasdaq as DJT',
    synopsis: 'Trump Media & Technology Group began trading on Nasdaq under the ticker DJT after the DWAC merger.',
    rationale: 'Public listing completed the SPAC path to market.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2024-03-26',
    date_end: '2024-03-26',
    keywords: ['DJT', 'Nasdaq', 'Trump Media', 'DWAC'],
    scores: makeScores({
      date_start: '2024-03-26',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Trump Media began trading publicly as DJT.'
    }),
    source: {
      url: 'https://apnews.com/article/12187a6de91561798a68780ed48cf511',
      title: "Trump's social media company to start trading on the Nasdaq on Tuesday",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1153,
    title: 'Google Play Bars Truth Social Over Moderation Issues',
    synopsis: 'Google said Truth Social could not launch on Google Play due to content-moderation concerns.',
    rationale: 'Platform moderation failures kept the app off Android distribution.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2022-08-30',
    date_end: '2022-08-30',
    keywords: ['Truth Social', 'Google Play', 'content moderation', 'Android'],
    scores: makeScores({
      date_start: '2022-08-30',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Google blocked Truth Social on the Play Store over moderation issues.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/08/30/trump-truth-social-barred-from-google-play-store-content-moderation-concerns.html',
      title: "Trump's Truth Social barred from Google Play store over content moderation concerns",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1154,
    title: 'Trump Launches $99 NFT Trading Cards',
    synopsis: 'Trump unveiled a paid NFT trading card collection featuring stylized images of himself.',
    rationale: 'New licensing-driven product monetized Trump’s image.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Product / Licensing Failure',
    phase: 'Post-Presidency',
    date_start: '2022-12-15',
    date_end: '2022-12-15',
    keywords: ['NFT', 'digital trading cards', 'CIC Digital', 'collectibles'],
    scores: makeScores({
      date_start: '2022-12-15',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Product / Licensing Failure',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'Trump launched a $99 NFT trading card collection.'
    }),
    source: {
      url: 'https://www.forbes.com/sites/saradorn/2022/12/15/trumps-major-announcement-was-to-hawk-his-99-nfts/',
      title: "Trump’s ‘Major Announcement’ Was To Hawk His $99 NFTs",
      publisher: 'Forbes'
    }
  },
  {
    entry_number: 1155,
    title: 'Trump Promotes Mugshot NFT Series and Dinner Offer',
    synopsis: 'Trump promoted a new NFT series tied to his mugshot, offering suit pieces and a dinner as incentives.',
    rationale: 'Campaign leveraged criminal-case notoriety for merchandising.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Product / Licensing Failure',
    phase: 'Post-Presidency',
    date_start: '2023-12-12',
    date_end: '2023-12-12',
    keywords: ['mugshot', 'NFT', 'Mar-a-Lago dinner', 'merchandising'],
    scores: makeScores({
      date_start: '2023-12-12',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Product / Licensing Failure',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'Trump marketed a mugshot NFT series with merchandise incentives.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/12/12/trump-sells-mugshot-suit-mar-a-lago-dinner-in-latest-nft-promotion.html',
      title: 'Trump sells mugshot suit, Mar-a-Lago dinner in latest NFT promotion',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1156,
    title: 'Trump Unveils $399 “Never Surrender” Sneakers',
    synopsis: 'Trump launched a line of branded sneakers at Sneaker Con in Philadelphia.',
    rationale: 'Merchandise rollout continued Trump’s licensing and branding ventures.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Product / Licensing Failure',
    phase: 'Post-Presidency',
    date_start: '2024-02-17',
    date_end: '2024-02-17',
    keywords: ['sneakers', 'merchandise', 'Sneaker Con', 'branding'],
    scores: makeScores({
      date_start: '2024-02-17',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Product / Licensing Failure',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'Trump unveiled branded sneakers at Sneaker Con.'
    }),
    source: {
      url: 'https://apnews.com/article/4de093eda6f8d1c68baf8fe8095f777b',
      title: "Trump hawks $399 branded shoes at 'Sneaker Con,' a day after a $355 million ruling against him",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1157,
    title: 'Trump Markets “God Bless the USA” Bible',
    synopsis: 'Trump promoted a branded Bible product sold under a licensing arrangement.',
    rationale: 'Commercial tie-in blended political branding with retail sales.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Product / Licensing Failure',
    phase: 'Post-Presidency',
    date_start: '2024-03-26',
    date_end: '2024-03-26',
    keywords: ['Bible', 'merchandising', 'license', 'Lee Greenwood'],
    scores: makeScores({
      date_start: '2024-03-26',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Product / Licensing Failure',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 2,
      rationale_short: 'Trump promoted a branded “God Bless the USA” Bible.'
    }),
    source: {
      url: 'https://apnews.com/article/2713fda3efdfa297d0f024efb1ca3003',
      title: "Trump is selling 'God Bless the USA' Bibles for $59.99 as he faces mounting legal bills",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1158,
    title: 'Trump Signs USMCA Trade Agreement',
    synopsis: 'Trump signed the USMCA with Canada and Mexico at the G20 summit.',
    rationale: 'Deal replaced NAFTA and reshaped North American trade rules.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2018-11-30',
    date_end: '2018-11-30',
    keywords: ['USMCA', 'NAFTA', 'trade deal', 'G20'],
    scores: makeScores({
      date_start: '2018-11-30',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 2,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Trump signed the USMCA trade agreement.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/economy/trump-signs-new-trade-pact-with-canada-mexico-leaders',
      title: 'Trump signs new trade pact with Canada, Mexico leaders',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1159,
    title: 'USMCA Trade Deal Enters Into Force',
    synopsis: 'USMCA entered into force, replacing NAFTA across North America.',
    rationale: 'Implementation locked in the new trade framework negotiated by Trump.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2020-07-01',
    date_end: '2020-07-01',
    keywords: ['USMCA', 'trade', 'NAFTA replacement', 'implementation'],
    scores: makeScores({
      date_start: '2020-07-01',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 2,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'USMCA entered into force across North America.'
    }),
    source: {
      url: 'https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement',
      title: 'United States-Mexico-Canada Agreement',
      publisher: 'U.S. Trade Representative'
    }
  },
  {
    entry_number: 1160,
    title: 'Mueller Says Report Did Not Exonerate Trump',
    synopsis: 'Robert Mueller testified that his report did not exonerate Trump on obstruction of justice.',
    rationale: 'Testimony reinforced that the report did not clear Trump of obstruction.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2019-07-24',
    date_end: '2019-07-24',
    keywords: ['Mueller testimony', 'obstruction', 'Russia investigation', 'Congress'],
    scores: makeScores({
      date_start: '2019-07-24',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Mueller said his report did not exonerate Trump.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/watch-mueller-dismisses-trumps-claim-of-exoneration',
      title: "WATCH: Mueller dismisses Trump's claim of 'exoneration'",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1161,
    title: 'Trump Arraigned in Manhattan Hush Money Case',
    synopsis: 'Trump was arraigned in New York and pleaded not guilty to falsifying business records tied to hush money payments.',
    rationale: 'Arraignment marked the first criminal case against a former U.S. president.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2023-04-04',
    date_end: '2023-04-04',
    keywords: ['arraignment', 'hush money', 'business records', 'Manhattan'],
    scores: makeScores({
      date_start: '2023-04-04',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Trump was arraigned and pleaded not guilty in the hush money case.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/show/trump-pleads-not-guilty-to-34-felony-counts-of-falsification-of-business-records',
      title: 'Trump pleads not guilty to 34 felony counts of falsification of business records',
      publisher: 'PBS News'
    }
  },
  {
    entry_number: 1162,
    title: 'Trump Refuses to Concede 2020 Election',
    synopsis: 'Trump continued to refuse to concede after major outlets called the race for Biden.',
    rationale: 'Public refusal to concede fueled election denial and mistrust.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Election Denial and Democratic Legitimacy Destruction',
    phase: 'White House 1',
    date_start: '2020-11-16',
    date_end: '2020-11-16',
    keywords: ['refuse to concede', '2020 election', 'Biden win', 'Stop the Steal'],
    scores: makeScores({
      date_start: '2020-11-16',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Election Denial and Democratic Legitimacy Destruction',
      danger: 3,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Trump refused to concede the 2020 election.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/show/trump-repeats-false-election-claims-as-his-supporters-gather-in-d-c',
      title: 'Trump repeats false election claims as his supporters gather in D.C.',
      publisher: 'PBS News'
    }
  },
  {
    entry_number: 1163,
    title: 'Trump Urges DOJ to Declare Election “Corrupt”',
    synopsis: 'Notes from a Dec. 27 call show Trump pressed DOJ leaders to say the election was corrupt.',
    rationale: 'Pressure campaign sought to enlist DOJ in overturning results.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Justice Department Politicization',
    phase: 'White House 1',
    date_start: '2020-12-27',
    date_end: '2020-12-27',
    keywords: ['DOJ pressure', 'Rosen', 'Donoghue notes', 'election corrupt'],
    scores: makeScores({
      date_start: '2020-12-27',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Justice Department Politicization',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Trump pressed DOJ leaders to declare the election corrupt.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/trump-urged-justice-officials-to-declare-election-corrupt',
      title: "Trump urged Justice officials to declare election 'corrupt'",
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1164,
    title: 'Senate Opens First Trump Impeachment Trial',
    synopsis: 'The Senate began Trump’s first impeachment trial with Chief Justice Roberts presiding.',
    rationale: 'Trial opened the Senate’s adjudication of abuse-of-power charges.',
    category: 'Authoritarianism',
    subcategory: 'Abuse of Power',
    phase: 'White House 1',
    date_start: '2020-01-16',
    date_end: '2020-01-16',
    keywords: ['impeachment trial', 'Senate', 'abuse of power', 'Roberts'],
    scores: makeScores({
      date_start: '2020-01-16',
      category: 'Authoritarianism',
      subcategory: 'Abuse of Power',
      danger: 2,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Senate opened Trump’s first impeachment trial.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/watch-live-senate-opens-to-hear-articles-of-impeachment-against-trump',
      title: 'WATCH: Senate opens to hear articles of impeachment against Trump',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1165,
    title: 'Senate Opens Second Trump Impeachment Trial',
    synopsis: 'The Senate opened Trump’s second impeachment trial over incitement of the Jan. 6 attack.',
    rationale: 'Trial addressed Trump’s role in the Capitol attack and efforts to overturn the election.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Violent Government Overthrow and Constitutional Insurrection',
    phase: 'Post-Presidency',
    date_start: '2021-02-09',
    date_end: '2021-02-09',
    keywords: ['second impeachment', 'Senate trial', 'Jan. 6', 'incitement'],
    scores: makeScores({
      date_start: '2021-02-09',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Violent Government Overthrow and Constitutional Insurrection',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Senate opened Trump’s second impeachment trial.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/watch-live-trumps-second-impeachment-trial-begins-in-senate',
      title: "WATCH: Trump's second impeachment trial begins in Senate",
      publisher: 'Associated Press'
    }
  }
];

async function run() {
  let inserted = 0;
  let sourcesInserted = 0;

  for (const entry of entries) {
    const exists = await sql`select 1 from trump_entries where entry_number = ${entry.entry_number}`;
    if (exists.length === 0) {
      await sql`
        INSERT INTO trump_entries (
          entry_number,
          title,
          synopsis,
          rationale,
          category,
          subcategory,
          phase,
          date_start,
          date_end,
          age,
          keywords,
          scores,
          fact_check,
          fact_check_sources,
          sources,
          suggested_source_query
        )
        VALUES (
          ${entry.entry_number},
          ${entry.title},
          ${entry.synopsis},
          ${entry.rationale},
          ${entry.category},
          ${entry.subcategory},
          ${entry.phase},
          ${entry.date_start},
          ${entry.date_end},
          ${calcAge(entry.date_start)},
          ${entry.keywords},
          ${JSON.stringify(entry.scores)},
          ${null},
          ${[]},
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
