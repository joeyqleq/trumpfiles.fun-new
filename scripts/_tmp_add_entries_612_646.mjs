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

const entries = [
  {
    entry_number: 612,
    title: 'Creates Presidential Advisory Commission on Election Integrity',
    synopsis: 'Signed an executive order creating the Presidential Advisory Commission on Election Integrity, led by Vice President Pence and Kris Kobach, to investigate claims of voter fraud.',
    rationale: 'Established a federal commission to investigate voter fraud claims and election data.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Election System Intimidation',
    phase: 'White House 1',
    date_start: '2017-05-11',
    date_end: '2017-05-11',
    age: 70,
    keywords: ['Election Integrity Commission', 'voter fraud', 'Pence', 'Kobach'],
    scores: {
      danger: 4,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 5,
      rationale_short: 'Created a commission to investigate voter fraud claims.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Insurrection / Coup Attempts: Election System Intimidation. On May 11, 2017, Trump signed an executive order creating the Presidential Advisory Commission on Election Integrity.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-executive-order-establishment-presidential-advisory-commission-election-integrity/',
      title: 'Presidential Executive Order on the Establishment of Presidential Advisory Commission on Election Integrity',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 613,
    title: 'Kobach Requests Nationwide Voter Data for Commission',
    synopsis: 'Commission vice chair Kris Kobach sent letters to states requesting voter rolls and personal data for the Election Integrity Commission.',
    rationale: 'Sought extensive voter data from states through the commission.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Systematic Voter Suppression and Electoral Manipulation',
    phase: 'White House 1',
    date_start: '2017-06-28',
    date_end: '2017-06-28',
    age: 71,
    keywords: ['Kobach', 'voter data', 'states', 'commission'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 4,
      impact_scope: 6,
      rationale_short: 'Requested extensive voter data from states for the commission.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Insurrection / Coup Attempts: Systematic Voter Suppression and Electoral Manipulation. On June 28, 2017, Kobach asked states for voter data on behalf of the commission.',
      recency_intensity: 2
    },
    source: {
      url: 'https://time.com/4840695/trump-voter-fraud-commission-personal-data/',
      title: "California, New York and Virginia Refuse to Give Personal Data to President Trump's Voter Fraud Commission",
      publisher: 'Time'
    }
  },
  {
    entry_number: 614,
    title: 'Rescinds Transgender Student Protections Guidance',
    synopsis: 'The Departments of Education and Justice withdrew Obama-era guidance that protected transgender students access to facilities.',
    rationale: 'Removed federal guidance safeguarding transgender students in schools.',
    category: 'Human Rights Violations',
    subcategory: 'Educational LGBTQ+ Persecution',
    phase: 'White House 1',
    date_start: '2017-02-22',
    date_end: '2017-02-22',
    age: 70,
    keywords: ['transgender students', 'Title IX', 'Education Department', 'DOJ'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Withdrew federal guidance protecting transgender students.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Educational LGBTQ+ Persecution. On Feb. 22, 2017, the administration rescinded Obama-era transgender student guidance.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2017/feb/22/transgender-students-bathroom-trump-obama',
      title: 'Trump administration rescinds Obama-era protections for transgender students',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 615,
    title: 'Orders Review of Waters of the United States Rule',
    synopsis: 'Signed an executive order directing agencies to review and rescind or revise the 2015 WOTUS clean water rule.',
    rationale: 'Set in motion rollback of clean water protections.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2017-02-28',
    date_end: '2017-02-28',
    age: 70,
    keywords: ['WOTUS', 'Clean Water Rule', 'EPA', 'Army Corps'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Directed agencies to roll back the WOTUS rule.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Systematic Deregulation. On Feb. 28, 2017, Trump ordered review of the Waters of the United States rule.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-executive-order-restoring-rule-law-federalism-economic-growth-reviewing-waters-united-states-rule/',
      title: 'Presidential Executive Order on Restoring the Rule of Law, Federalism, and Economic Growth by Reviewing the "Waters of the United States" Rule',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 616,
    title: 'EPA Proposes Repeal of the Clean Power Plan',
    synopsis: 'EPA announced a proposed repeal of the Clean Power Plan, reversing the Obama-era climate rule for power plants.',
    rationale: 'Moved to dismantle a major federal climate rule.',
    category: 'Environmental Destruction',
    subcategory: 'Climate Solutions Elimination',
    phase: 'White House 1',
    date_start: '2017-10-10',
    date_end: '2017-10-10',
    age: 71,
    keywords: ['Clean Power Plan', 'EPA', 'Pruitt', 'climate'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Proposed repealing the Clean Power Plan.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Climate Solutions Elimination. On Oct. 10, 2017, EPA proposed repealing the Clean Power Plan.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.epa.gov/archive/epa/newsreleases/epa-takes-another-step-advance-president-trumps-america-first-strategy-proposes-repeal.html',
      title: "EPA Takes Another Step To Advance President Trump's America First Strategy, Proposes Repeal Of 'Clean Power Plan'",
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 617,
    title: 'Shrinks Bears Ears and Grand Staircase-Escalante',
    synopsis: 'Signed proclamations reducing Bears Ears and Grand Staircase-Escalante national monuments in Utah.',
    rationale: 'Cut protections for major public lands and sacred sites.',
    category: 'Environmental Destruction',
    subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-12-04',
    date_end: '2017-12-04',
    age: 71,
    keywords: ['Bears Ears', 'Grand Staircase', 'national monuments', 'Utah'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Reduced protections for Bears Ears and Grand Staircase.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Public Lands Resource Extraction and Environmental Protection Elimination. On Dec. 4, 2017, Trump shrank the Bears Ears and Grand Staircase-Escalante monuments.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2017/12/04/trump-rescinds-national-monument-protections-on-1-point-9-million-acres-of-utah-canyon-land.html',
      title: 'Trump rescinds national monument protections on 1.9 million acres of Utah canyon land',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 618,
    title: 'Ends ACA Cost-Sharing Reduction Payments',
    synopsis: 'The administration stopped federal CSR payments to insurers under the Affordable Care Act.',
    rationale: 'Cut subsidies that reduced out-of-pocket costs for low-income enrollees.',
    category: 'Human Rights Violations',
    subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
    phase: 'White House 1',
    date_start: '2017-10-12',
    date_end: '2017-10-12',
    age: 71,
    keywords: ['ACA', 'CSR payments', 'Obamacare', 'insurers'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 7,
      rationale_short: 'Stopped cost-sharing reduction payments to insurers.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Social Safety Net Destruction and Vulnerable Population Abandonment. On Oct. 12, 2017, the administration ended CSR payments.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2017/10/12/obamacare-bombshell-trump-kills-key-payments-to-health-insurers.html',
      title: 'Obamacare bombshell: Trump kills key payments to health insurers',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 619,
    title: 'Ends U.S. Funding for UNRWA',
    synopsis: 'The State Department announced the U.S. would end funding for the U.N. agency for Palestinian refugees.',
    rationale: 'Cut humanitarian funding for Palestinian refugees.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2018-08-31',
    date_end: '2018-08-31',
    age: 72,
    keywords: ['UNRWA', 'Palestinian refugees', 'State Department', 'aid'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Ended U.S. funding for UNRWA.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On Aug. 31, 2018, the administration ended U.S. funding for UNRWA.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2018/08/31/us-ends-funding-of-un-agency-for-palestinian-refugees.html',
      title: 'US ends funding of UN agency for Palestinian refugees',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 620,
    title: 'Orders Closure of PLO Office in Washington',
    synopsis: 'The State Department ordered the Palestine Liberation Organization office in Washington, D.C. to close.',
    rationale: 'Shut down a key Palestinian diplomatic presence in the U.S.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2018-09-10',
    date_end: '2018-09-10',
    age: 72,
    keywords: ['PLO', 'Washington', 'State Department', 'Palestinians'],
    scores: {
      danger: 4,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 5,
      rationale_short: 'Ordered the PLO office in D.C. to close.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Sept. 10, 2018, the State Department ordered the PLO office in Washington to close.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.axios.com/2018/09/10/state-department-palestine-liberation-organization-plo-dc-office',
      title: 'State Department announces closure of Palestine Liberation Organization D.C. office',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 621,
    title: "Recognizes Jerusalem as Israel's Capital",
    synopsis: "Announced U.S. recognition of Jerusalem as Israel's capital and ordered the embassy move.",
    rationale: 'Shifted U.S. policy on Jerusalem with major diplomatic fallout.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-12-06',
    date_end: '2017-12-06',
    age: 71,
    keywords: ['Jerusalem', 'embassy', 'Israel', 'recognition'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Recognized Jerusalem as Israel\'s capital and ordered the embassy move.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Dec. 6, 2017, Trump announced U.S. recognition of Jerusalem as Israel\'s capital.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-president-trump-jerusalem/',
      title: 'Statement by President Trump on Jerusalem',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 622,
    title: 'Sets Refugee Admissions Cap at 18,000',
    synopsis: 'Issued a determination setting the FY2020 refugee admissions ceiling at 18,000.',
    rationale: 'Lowered refugee admissions to a record low level.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-11-01',
    date_end: '2019-11-01',
    age: 73,
    keywords: ['refugee cap', 'FY2020', 'admissions', 'determination'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Set the refugee admissions cap at 18,000 for FY2020.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On Nov. 1, 2019, Trump set the FY2020 refugee ceiling at 18,000.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-determination-refugee-admissions-fiscal-year-2020/',
      title: 'Presidential Determination on Refugee Admissions for Fiscal Year 2020',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 623,
    title: 'Bans Asylum for Migrants Crossing Between Ports',
    synopsis: 'The administration announced a rule to bar asylum for migrants who crossed the border outside ports of entry.',
    rationale: 'Restricted access to asylum based on entry location.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2018-11-08',
    date_end: '2018-11-08',
    age: 72,
    keywords: ['asylum ban', 'ports of entry', 'proclamation', 'DHS'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 4,
      impact_scope: 6,
      rationale_short: 'Barred asylum for migrants crossing between ports of entry.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On Nov. 8, 2018, the administration announced a rule to bar asylum for migrants who crossed between ports.',
      recency_intensity: 2
    },
    source: {
      url: 'https://time.com/5449845/white-house-moves-bar-migrants-asylum/',
      title: 'White House Moves to Bar Some Migrants From Obtaining Asylum in the U.S.',
      publisher: 'Time'
    }
  },
  {
    entry_number: 624,
    title: 'Imposes Third-Country Transit Asylum Ban',
    synopsis: 'DHS and DOJ issued a rule barring asylum for migrants who did not seek protection in a third country during transit.',
    rationale: 'Created a transit bar to asylum for most migrants.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-07-16',
    date_end: '2019-07-16',
    age: 73,
    keywords: ['asylum', 'third-country transit', 'DHS', 'DOJ'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 4,
      impact_scope: 6,
      rationale_short: 'Created a third-country transit bar to asylum.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On July 16, 2019, DHS and DOJ issued a third-country transit asylum rule.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.dhs.gov/archive/news/2019/07/15/dhs-and-doj-issue-third-country-asylum-rule',
      title: 'DHS and DOJ Issue Third-Country Asylum Rule',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 625,
    title: 'Signs Asylum Cooperative Agreement with Guatemala',
    synopsis: 'Guatemala signed a "safe third country" asylum cooperative agreement with the U.S. after Trump pressure.',
    rationale: 'Pushed asylum seekers to seek protection in Guatemala instead of the U.S.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-07-26',
    date_end: '2019-07-26',
    age: 73,
    keywords: ['Guatemala', 'asylum agreement', 'safe third country', 'DHS'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Signed a "safe third country" asylum agreement with Guatemala.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On July 26, 2019, Guatemala signed an asylum cooperative agreement with the U.S.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.axios.com/2019/07/26/guatemala-trump-immigration-asylum-deal',
      title: 'Guatemala signs "safe third country" asylum deal after Trump threats',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 626,
    title: 'Calls MS-13 Members "Animals" in Immigration Remarks',
    synopsis: 'At a White House roundtable, Trump referred to MS-13 members as "animals" while discussing immigration enforcement.',
    rationale: 'Used dehumanizing rhetoric about immigrants in a public setting.',
    category: 'Racism / Discrimination',
    subcategory: 'Immigrant Dehumanization and Xenophobic Campaign Launch',
    phase: 'White House 1',
    date_start: '2018-05-16',
    date_end: '2018-05-16',
    age: 71,
    keywords: ['MS-13', 'animals', 'immigrants', 'rhetoric'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 3,
      lawlessness: 1,
      impact_scope: 5,
      rationale_short: 'Dehumanized immigrants during an immigration roundtable.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: Immigrant Dehumanization and Xenophobic Campaign Launch. On May 16, 2018, Trump called MS-13 gang members "animals" during immigration remarks.',
      recency_intensity: 2
    },
    source: {
      url: 'https://time.com/5279995/they-arent-people-president-trump-calls-deported-gang-members-animals/',
      title: "'They Aren't People.' President Trump Calls Deported Gang Members 'Animals'",
      publisher: 'Time'
    }
  },
  {
    entry_number: 627,
    title: 'Tells Four Congresswomen to "Go Back"',
    synopsis: 'Trump tweeted that four Democratic congresswomen should return to the countries they came from.',
    rationale: 'Used xenophobic rhetoric to attack U.S. lawmakers of color.',
    category: 'Racism / Discrimination',
    subcategory: 'Immigrant Dehumanization and Xenophobic Campaign Launch',
    phase: 'White House 1',
    date_start: '2019-07-14',
    date_end: '2019-07-14',
    age: 73,
    keywords: ['go back tweets', 'congresswomen', 'xenophobia', 'twitter'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 3,
      lawlessness: 1,
      impact_scope: 5,
      rationale_short: 'Used xenophobic attacks against four congresswomen.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: Immigrant Dehumanization and Xenophobic Campaign Launch. On July 14, 2019, Trump told four congresswomen to "go back" in tweets.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2019/07/14/trump-tells-progressive-congresswomen-to-go-back-to-where-they-came-from.html',
      title: "Trump tells progressive congresswomen to 'go back' to where they came from",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 628,
    title: 'Reverses U.S. Position on Israeli Settlements',
    synopsis: 'Secretary of State Pompeo announced the U.S. would no longer view Israeli settlements as illegal.',
    rationale: 'Shifted U.S. policy to favor Israeli settlements.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-11-18',
    date_end: '2019-11-18',
    age: 73,
    keywords: ['settlements', 'Pompeo', 'West Bank', 'international law'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Declared U.S. would no longer view settlements as illegal.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Nov. 18, 2019, the U.S. announced it no longer viewed Israeli settlements as illegal.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.axios.com/2019/11/18/pompeo-israel-settlements-west-bank-illegal',
      title: 'Pompeo announces U.S. will no longer view Israeli settlements as illegal',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 629,
    title: 'DOJ Overrides Prosecutors on Roger Stone Sentencing',
    synopsis: 'After Trump criticized the sentencing recommendation, DOJ moved to reduce prosecutors\' request and four prosecutors withdrew.',
    rationale: 'Interfered in sentencing of a close ally through DOJ actions.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2020-02-11',
    date_end: '2020-02-11',
    age: 73,
    keywords: ['Roger Stone', 'sentencing', 'DOJ', 'interference'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 2,
      lawlessness: 7,
      impact_scope: 6,
      rationale_short: 'DOJ overruled prosecutors on Stone\'s sentence.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Government Corruption: Cronyism / Obstruction. On Feb. 11, 2020, DOJ reversed prosecutors on Roger Stone\'s sentencing recommendation.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.cnbc.com/2020/02/11/trump-ally-roger-stone-will-get-lower-prison-sentence-recommendation.html',
      title: "Roger Stone prosecutors quit after furor over Trump ally's sentence",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 630,
    title: 'DOJ Moves to Drop Michael Flynn Case',
    synopsis: 'The Justice Department filed a motion to dismiss the criminal case against former national security adviser Michael Flynn.',
    rationale: 'DOJ sought to end prosecution of a Trump ally.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2020-05-07',
    date_end: '2020-05-07',
    age: 73,
    keywords: ['Michael Flynn', 'DOJ', 'motion to dismiss', 'Russia probe'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 6,
      impact_scope: 6,
      rationale_short: 'DOJ moved to dismiss the Flynn case.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Government Corruption: Cronyism / Obstruction. On May 7, 2020, DOJ moved to drop the criminal case against Michael Flynn.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2020/may/07/michael-flynn-criminal-case-trump-russia',
      title: 'Michael Flynn: justice department moves to drop criminal case against ex-Trump aide',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 631,
    title: 'Pardons Michael Flynn',
    synopsis: 'Trump granted a full pardon to former national security adviser Michael Flynn.',
    rationale: 'Issued clemency to a close ally.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-11-25',
    date_end: '2020-11-25',
    age: 74,
    keywords: ['Flynn', 'pardon', 'clemency', 'Trump'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 6,
      impact_scope: 5,
      rationale_short: 'Granted a full pardon to Michael Flynn.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Grift / Financial Exploitation: Corrupt Pardons. On Nov. 25, 2020, Trump granted a full pardon to Michael Flynn.',
      recency_intensity: 3
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-regarding-executive-grant-clemency-general-michael-t-flynn/',
      title: 'Statement from the Press Secretary Regarding Executive Grant of Clemency for General Michael T. Flynn',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 632,
    title: 'Pardons Paul Manafort',
    synopsis: 'Trump granted a pardon to former campaign chairman Paul Manafort.',
    rationale: 'Issued clemency to a key campaign associate convicted in the Russia probe.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-23',
    date_end: '2020-12-23',
    age: 74,
    keywords: ['Manafort', 'pardon', 'Russia probe', 'clemency'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 6,
      impact_scope: 5,
      rationale_short: 'Granted a pardon to Paul Manafort.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Grift / Financial Exploitation: Corrupt Pardons. On Dec. 23, 2020, Trump pardoned Paul Manafort.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2020/dec/23/donald-trumps-latest-wave-of-pardons-includes-paul-manafort-and-charles-kunsher',
      title: "Donald Trump's latest wave of pardons includes Paul Manafort and Charles Kushner",
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 633,
    title: 'Pardons Steve Bannon',
    synopsis: 'Trump pardoned former adviser Steve Bannon in his final hours in office.',
    rationale: 'Issued clemency to a close ally facing federal charges.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    age: 74,
    keywords: ['Bannon', 'pardon', 'clemency', 'We Build the Wall'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 6,
      impact_scope: 5,
      rationale_short: 'Granted clemency to Steve Bannon.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Grift / Financial Exploitation: Corrupt Pardons. On Jan. 20, 2021, Trump pardoned Steve Bannon.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.upi.com/Top_News/US/2021/01/20/Trump-grants-Bannon-Broidy-and-141-others-clemency-in-final-hours-as-president/2421611127910/',
      title: 'Trump grants Bannon, Broidy and 141 others clemency in final hours as president',
      publisher: 'UPI'
    }
  },
  {
    entry_number: 634,
    title: 'Threatens North Korea with "Fire and Fury"',
    synopsis: 'Trump warned North Korea it would be met with "fire and fury like the world has never seen."',
    rationale: 'Escalated nuclear tensions with inflammatory threats.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Threats / Incitement',
    phase: 'White House 1',
    date_start: '2017-08-08',
    date_end: '2017-08-08',
    age: 71,
    keywords: ['North Korea', 'fire and fury', 'nuclear', 'threat'],
    scores: {
      danger: 6,
      insanity: 3,
      absurdity: 2,
      lawlessness: 1,
      impact_scope: 6,
      rationale_short: 'Issued "fire and fury" threat toward North Korea.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Violent Rhetoric / Threats: Threats / Incitement. On Aug. 8, 2017, Trump warned North Korea it would face "fire and fury."',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2017/aug/08/donald-trump-north-korea-missile-threats-fire-fury',
      title: "Donald Trump vows to answer North Korea nuclear threats with 'fire and fury'",
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 635,
    title: 'Imposes Section 232 Steel Tariffs',
    synopsis: 'Signed a proclamation imposing 25% tariffs on steel imports under Section 232.',
    rationale: 'Launched protectionist tariffs that escalated trade tensions.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2018-03-08',
    date_end: '2018-03-08',
    age: 71,
    keywords: ['steel tariffs', 'Section 232', 'trade', 'proclamation'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Imposed Section 232 steel tariffs.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Economic Warfare. On March 8, 2018, Trump imposed Section 232 tariffs on steel imports.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-proclamation-adjusting-imports-steel-united-states/',
      title: 'Presidential Proclamation on Adjusting Imports of Steel into the United States',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 636,
    title: 'Orders Section 301 Actions Against China',
    synopsis: 'Signed a memorandum directing actions after the Section 301 investigation into China, laying groundwork for tariffs.',
    rationale: 'Directed tariff and trade actions against China.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2018-03-22',
    date_end: '2018-03-22',
    age: 71,
    keywords: ['Section 301', 'China', 'tariffs', 'USTR'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Directed Section 301 actions against China.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Economic Warfare. On March 22, 2018, Trump directed Section 301 actions targeting China.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-actions-united-states-related-section-301-investigation/',
      title: 'Presidential Memorandum on the Actions by the United States Related to the Section 301 Investigation',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 637,
    title: 'Finalizes Endangered Species Act Rollbacks',
    synopsis: 'Interior announced final rules revising Endangered Species Act regulations.',
    rationale: 'Weakened ESA protections through regulatory changes.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2019-08-12',
    date_end: '2019-08-12',
    age: 73,
    keywords: ['Endangered Species Act', 'Interior', 'rollbacks', 'Bernhardt'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Finalized regulatory rollbacks under the ESA.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Environmental Rollbacks. On Aug. 12, 2019, Interior announced final ESA regulatory changes.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.doi.gov/pressreleases/endangered-species-act',
      title: 'Trump Administration Improves the Implementing Regulations of the Endangered Species Act',
      publisher: 'U.S. Department of the Interior'
    }
  },
  {
    entry_number: 638,
    title: 'Rescinds DOJ Phase-Out of Private Prisons',
    synopsis: 'Attorney General Jeff Sessions reversed the Obama-era plan to phase out private federal prisons.',
    rationale: 'Restored reliance on private prisons for federal inmates.',
    category: 'Human Rights Violations',
    subcategory: 'Mass Prison Privatization and Forced Labor',
    phase: 'White House 1',
    date_start: '2017-02-21',
    date_end: '2017-02-21',
    age: 70,
    keywords: ['private prisons', 'Sessions', 'DOJ', 'phase-out'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Reversed the DOJ plan to phase out private prisons.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Mass Prison Privatization and Forced Labor. On Feb. 21, 2017, Sessions rescinded the DOJ private-prison phase-out policy.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.upi.com/Top_News/US/2017/02/23/Justice-Department-reverses-plan-to-phase-out-private-prisons/4381487896921/',
      title: 'Justice Department reverses plan to phase out private prisons',
      publisher: 'UPI'
    }
  },
  {
    entry_number: 639,
    title: 'Announces Resumption of Federal Executions',
    synopsis: 'The Justice Department announced federal executions would resume after a 16-year hiatus.',
    rationale: 'Expanded federal use of capital punishment.',
    category: 'Human Rights Violations',
    subcategory: 'Capital Punishment Expansion',
    phase: 'White House 1',
    date_start: '2019-07-25',
    date_end: '2019-07-25',
    age: 73,
    keywords: ['federal executions', 'DOJ', 'death penalty', 'Barr'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 5,
      rationale_short: 'Announced resumption of federal executions.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Capital Punishment Expansion. On July 25, 2019, DOJ announced the resumption of federal executions.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/world/2019/jul/25/death-penalty-capital-punishment-us-justice-department-resumes-executions',
      title: 'US justice department resumes use of death penalty and schedules five executions',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 640,
    title: 'Revokes Drone Strike Civilian Casualty Reporting Requirement',
    synopsis: 'Signed an executive order revoking the requirement to publish annual civilian casualty reports for strikes outside war zones.',
    rationale: 'Reduced transparency on civilian deaths from drone strikes.',
    category: 'National Security Violations',
    subcategory: 'Intelligence Suppression',
    phase: 'White House 1',
    date_start: '2019-03-06',
    date_end: '2019-03-06',
    age: 72,
    keywords: ['drone strikes', 'civilian casualties', 'reporting', 'executive order'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Revoked the annual civilian casualty reporting requirement.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'National Security Violations: Intelligence Suppression. On March 6, 2019, Trump revoked the civilian casualty reporting requirement.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-revocation-reporting-requirement/',
      title: 'Executive Order on Revocation of Reporting Requirement',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 641,
    title: 'Threatens to Challenge NBC Broadcast License',
    synopsis: 'Trump tweeted that NBC\'s license should be challenged after a critical report.',
    rationale: 'Used presidential platform to intimidate a major news outlet.',
    category: 'Press Freedom',
    subcategory: 'Media Intimidation',
    phase: 'White House 1',
    date_start: '2017-10-11',
    date_end: '2017-10-11',
    age: 71,
    keywords: ['NBC', 'license', 'media', 'tweets'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 3,
      lawlessness: 2,
      impact_scope: 5,
      rationale_short: 'Suggested NBC\'s license should be challenged.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Press Freedom: Media Intimidation. On Oct. 11, 2017, Trump suggested challenging NBC\'s broadcast license.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2017/10/11/trump-threatens-to-challenge-nbcs-license-comcast-shares-dip-slightly.html',
      title: "Trump threatens to 'challenge' NBC's license; Comcast shares dip slightly",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 642,
    title: 'Signs Executive Orders Targeting TikTok and WeChat',
    synopsis: 'Signed executive orders banning U.S. transactions with ByteDance\'s TikTok and Tencent\'s WeChat.',
    rationale: 'Moved to ban major social media apps through emergency powers.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'White House 1',
    date_start: '2020-08-06',
    date_end: '2020-08-06',
    age: 74,
    keywords: ['TikTok', 'WeChat', 'executive order', 'ByteDance'],
    scores: {
      danger: 4,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Signed executive orders targeting TikTok and WeChat.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Social Media: Communication Chaos. On Aug. 6, 2020, Trump signed executive orders targeting TikTok and WeChat.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.theguardian.com/technology/2020/aug/06/us-senate-tiktok-ban',
      title: 'Trump bans US transactions with Chinese-owned TikTok and WeChat',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 643,
    title: 'EPA Rolls Back Methane Rules for Oil and Gas',
    synopsis: 'EPA issued final rules rescinding methane standards and loosening requirements for oil and gas operations.',
    rationale: 'Reduced federal methane emissions controls.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2020-08-13',
    date_end: '2020-08-13',
    age: 74,
    keywords: ['methane', 'EPA', 'oil and gas', 'rollback'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Rolled back federal methane standards for oil and gas.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Environmental Rollbacks. On Aug. 13, 2020, EPA issued final rules rolling back methane standards.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.epa.gov/controlling-air-pollution-oil-and-natural-gas-operations/2020-final-policy-and-technical-amendments',
      title: '2020 Final Policy and Technical Amendments to New Source Performance Standards for the Oil and Natural Gas Industry and Related Congressional Review Act Resolution',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 644,
    title: 'Issues NEPA Rollback Final Rule',
    synopsis: 'Council on Environmental Quality issued a final rule revising NEPA regulations to speed permitting.',
    rationale: 'Weakened environmental review requirements.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2020-07-16',
    date_end: '2020-07-16',
    age: 74,
    keywords: ['NEPA', 'CEQ', 'environmental review', 'rollback'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Issued a final rule rolling back NEPA regulations.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Systematic Deregulation. On July 16, 2020, CEQ issued a final rule revising NEPA regulations.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.energy.gov/nepa/articles/ceq-2020-final-rule',
      title: 'CEQ 2020 Final Rule',
      publisher: 'U.S. Department of Energy'
    }
  },
  {
    entry_number: 645,
    title: 'HUD Terminates 2015 AFFH Rule',
    synopsis: 'HUD announced it would terminate the 2015 Affirmatively Furthering Fair Housing rule and replace it with a weaker standard.',
    rationale: 'Rolled back fair housing enforcement requirements.',
    category: 'Racism / Discrimination',
    subcategory: 'Federal Housing Discrimination',
    phase: 'White House 1',
    date_start: '2020-07-23',
    date_end: '2020-07-23',
    age: 74,
    keywords: ['AFFH', 'HUD', 'fair housing', 'Ben Carson'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Terminated the 2015 AFFH rule.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: Federal Housing Discrimination. On July 23, 2020, HUD announced termination of the 2015 AFFH rule.',
      recency_intensity: 3
    },
    source: {
      url: 'https://archives.hud.gov/news/2020/pr20-109.cfm',
      title: 'Secretary Carson Terminates 2015 AFFH Rule',
      publisher: 'U.S. Department of Housing and Urban Development'
    }
  },
  {
    entry_number: 646,
    title: 'Rescinds Obama-Era School Discipline Guidance',
    synopsis: 'Education and Justice departments withdrew 2014 guidance aimed at reducing racial disparities in school discipline.',
    rationale: 'Removed federal guidance meant to curb discriminatory discipline.',
    category: 'Racism / Discrimination',
    subcategory: 'Civil Rights Monitoring Elimination',
    phase: 'White House 1',
    date_start: '2018-12-21',
    date_end: '2018-12-21',
    age: 72,
    keywords: ['school discipline', 'guidance rescinded', 'civil rights', 'Education Department'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 5,
      rationale_short: 'Rescinded Obama-era school discipline guidance.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: Civil Rights Monitoring Elimination. On Dec. 21, 2018, ED and DOJ rescinded the 2014 school discipline guidance.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.washingtonpost.com/local/education/trump-administration-revokes-effort-to-reduce-racial-bias-in-school-discipline/2018/12/21/3f67312a-055e-11e9-9122-82e98f91ee6f_story.html',
      title: 'Trump administration revokes effort to reduce racial bias in school discipline',
      publisher: 'The Washington Post'
    }
  }
];

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
