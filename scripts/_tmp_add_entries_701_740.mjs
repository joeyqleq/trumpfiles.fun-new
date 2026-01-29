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

const clemencySource = {
  url: 'https://www.justice.gov/pardon/clemency-grants',
  title: 'Clemency Grants',
  publisher: 'U.S. Department of Justice'
};

const entries = [
  {
    entry_number: 701,
    title: 'Imposes Federal Hiring Freeze',
    synopsis: 'Trump issued a presidential memorandum imposing an immediate federal hiring freeze across executive agencies.',
    rationale: 'Ordered a government-wide hiring freeze on day one.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2017-01-23',
    date_end: '2017-01-23',
    keywords: ['hiring freeze', 'memorandum', 'federal workforce'],
    scores: makeScores({
      date_start: '2017-01-23',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 3,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'ordered a government-wide federal hiring freeze.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-regarding-hiring-freeze/',
      title: 'Presidential Memorandum Regarding the Hiring Freeze',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 702,
    title: 'Issues Regulatory Freeze Memorandum',
    synopsis: 'Trump directed agencies to delay pending regulations through a government-wide regulatory freeze memorandum.',
    rationale: 'Delayed pending federal regulations with a blanket freeze.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2017-01-20',
    date_end: '2017-01-20',
    keywords: ['regulatory freeze', 'memorandum', 'regulations'],
    scores: makeScores({
      date_start: '2017-01-20',
      category: 'Environmental Destruction',
      subcategory: 'Systematic Deregulation',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'directed agencies to pause or delay pending regulations.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/memorandum-heads-executive-departments-agencies/',
      title: 'Memorandum for the Heads of Executive Departments and Agencies',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 703,
    title: 'Orders Border Security and Immigration Enforcement Changes',
    synopsis: 'Signed Executive Order 13767 to accelerate border wall planning and expand immigration enforcement priorities.',
    rationale: 'Expanded border security and enforcement priorities by executive order.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2017-01-25',
    date_end: '2017-01-25',
    keywords: ['EO 13767', 'border security', 'immigration enforcement', 'wall'],
    scores: makeScores({
      date_start: '2017-01-25',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 5,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'signed EO 13767 expanding border enforcement and wall planning.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-border-security-immigration-enforcement-improvements/',
      title: 'Executive Order: Border Security and Immigration Enforcement Improvements',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 704,
    title: 'Targets Sanctuary Cities and Interior Enforcement',
    synopsis: 'Signed Executive Order 13768 expanding interior enforcement and threatening federal funding for sanctuary jurisdictions.',
    rationale: 'Expanded interior immigration enforcement and targeted sanctuary cities.',
    category: 'Human Rights Violations',
    subcategory: 'Mass Deportation',
    phase: 'White House 1',
    date_start: '2017-01-25',
    date_end: '2017-01-25',
    keywords: ['EO 13768', 'sanctuary cities', 'interior enforcement'],
    scores: makeScores({
      date_start: '2017-01-25',
      category: 'Human Rights Violations',
      subcategory: 'Mass Deportation',
      danger: 6,
      lawlessness: 4,
      impact_scope: 6,
      authoritarianism: 5,
      rationale_short: 'signed EO 13768 expanding interior enforcement and targeting sanctuary jurisdictions.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-enhancing-public-safety-interior-united-states/',
      title: 'Executive Order: Enhancing Public Safety in the Interior of the United States',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 705,
    title: 'Orders Review of Financial Regulation Core Principles',
    synopsis: 'Signed Executive Order 13772 directing regulators to reconsider Dodd-Frank-era financial rules.',
    rationale: 'Directed a review to roll back financial regulations.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corporate Crime Protection',
    phase: 'White House 1',
    date_start: '2017-02-03',
    date_end: '2017-02-03',
    keywords: ['EO 13772', 'financial regulation', 'Dodd-Frank'],
    scores: makeScores({
      date_start: '2017-02-03',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corporate Crime Protection',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      rationale_short: 'ordered regulators to rethink core financial rules.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-core-principles-regulating-united-states-financial-system/',
      title: 'Executive Order: Core Principles for Regulating the United States Financial System',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 706,
    title: 'Creates Regulatory Reform Task Forces',
    synopsis: 'Signed Executive Order 13777 to establish regulatory reform task forces across agencies.',
    rationale: 'Mandated agency task forces to identify rules to repeal or weaken.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2017-02-24',
    date_end: '2017-02-24',
    keywords: ['EO 13777', 'regulatory reform', 'task forces'],
    scores: makeScores({
      date_start: '2017-02-24',
      category: 'Environmental Destruction',
      subcategory: 'Systematic Deregulation',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'created agency task forces to roll back regulations.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-enforcing-regulatory-reform-agenda/',
      title: 'Executive Order: Enforcing the Regulatory Reform Agenda',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 707,
    title: 'Signs Revised Travel Ban Executive Order',
    synopsis: 'Signed Executive Order 13780 revising the travel ban and suspending entry from several countries.',
    rationale: 'Reissued a travel ban targeting several majority-Muslim countries.',
    category: 'Racism / Discrimination',
    subcategory: 'Anti-Muslim Policy',
    phase: 'White House 1',
    date_start: '2017-03-06',
    date_end: '2017-03-06',
    keywords: ['EO 13780', 'travel ban', 'immigration'],
    scores: makeScores({
      date_start: '2017-03-06',
      category: 'Racism / Discrimination',
      subcategory: 'Anti-Muslim Policy',
      danger: 6,
      lawlessness: 4,
      impact_scope: 6,
      authoritarianism: 5,
      rationale_short: 'signed EO 13780 reissuing a travel ban targeting several countries.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-protecting-nation-foreign-terrorist-entry-united-states/',
      title: 'Executive Order Protecting the Nation From Foreign Terrorist Entry Into the United States',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 708,
    title: 'Orders Energy Independence and Climate Rollbacks',
    synopsis: 'Signed Executive Order 13783 to dismantle climate rules and promote fossil fuel development.',
    rationale: 'Directed agencies to undo climate and energy regulations.',
    category: 'Environmental Destruction',
    subcategory: 'Climate Solutions Elimination',
    phase: 'White House 1',
    date_start: '2017-03-28',
    date_end: '2017-03-28',
    keywords: ['EO 13783', 'energy independence', 'climate rollback'],
    scores: makeScores({
      date_start: '2017-03-28',
      category: 'Environmental Destruction',
      subcategory: 'Climate Solutions Elimination',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'signed EO 13783 to unwind climate and energy regulations.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-promoting-energy-independence-economic-growth/',
      title: 'Executive Order Promoting Energy Independence and Economic Growth',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 709,
    title: 'Issues “Buy American, Hire American” Order',
    synopsis: 'Signed Executive Order 13788 directing agencies to tighten immigration and procurement rules.',
    rationale: 'Ordered agencies to tighten immigration and procurement rules.',
    category: 'Racism / Discrimination',
    subcategory: 'Immigration Xenophobia',
    phase: 'White House 1',
    date_start: '2017-04-18',
    date_end: '2017-04-18',
    keywords: ['EO 13788', 'Buy American', 'Hire American', 'immigration'],
    scores: makeScores({
      date_start: '2017-04-18',
      category: 'Racism / Discrimination',
      subcategory: 'Immigration Xenophobia',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'signed EO 13788 tightening immigration and procurement rules.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-buy-american-hire-american/',
      title: 'Executive Order Buy American and Hire American',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 710,
    title: 'Orders Review of National Monuments',
    synopsis: 'Signed Executive Order 13792 directing a review of national monument designations, a precursor to monument reductions.',
    rationale: 'Ordered a review to shrink or revise national monument protections.',
    category: 'Environmental Destruction',
    subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-04-26',
    date_end: '2017-04-26',
    keywords: ['EO 13792', 'national monuments', 'Antiquities Act'],
    scores: makeScores({
      date_start: '2017-04-26',
      category: 'Environmental Destruction',
      subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'ordered a review of national monument designations.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-reviewing-designations-under-the-antiquities-act/',
      title: 'Executive Order Reviewing Designations Under the Antiquities Act',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 711,
    title: 'Expands Short-Term and Association Health Plans',
    synopsis: 'Signed Executive Order 13813 directing agencies to expand short-term and association health plans outside ACA protections.',
    rationale: 'Directed expansion of short-term plans outside ACA consumer protections.',
    category: 'Human Rights Violations',
    subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
    phase: 'White House 1',
    date_start: '2017-10-12',
    date_end: '2017-10-12',
    keywords: ['EO 13813', 'short-term plans', 'association health plans', 'ACA'],
    scores: makeScores({
      date_start: '2017-10-12',
      category: 'Human Rights Violations',
      subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'signed EO 13813 to expand short-term and association health plans.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-promoting-healthcare-choice-competition-across-united-states/',
      title: 'Executive Order Promoting Healthcare Choice and Competition Across the United States',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 712,
    title: 'Issues Travel Ban Proclamation 9645',
    synopsis: 'Signed Proclamation 9645 imposing travel restrictions on several countries after earlier travel ban orders.',
    rationale: 'Issued Proclamation 9645 imposing travel restrictions on multiple countries.',
    category: 'Racism / Discrimination',
    subcategory: 'Anti-Muslim Policy',
    phase: 'White House 1',
    date_start: '2017-09-24',
    date_end: '2017-09-24',
    keywords: ['Proclamation 9645', 'travel ban', 'immigration'],
    scores: makeScores({
      date_start: '2017-09-24',
      category: 'Racism / Discrimination',
      subcategory: 'Anti-Muslim Policy',
      danger: 6,
      lawlessness: 4,
      impact_scope: 6,
      authoritarianism: 5,
      rationale_short: 'signed Proclamation 9645 imposing travel restrictions on multiple countries.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-countries/',
      title: 'Proclamation 9645: Suspension of Entry of Immigrants and Nonimmigrants of Certain Countries',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 713,
    title: 'Supreme Court Upholds Travel Ban',
    synopsis: 'The Supreme Court upheld Trump’s travel ban in Trump v. Hawaii, allowing the restrictions to take effect.',
    rationale: 'The Supreme Court upheld the travel ban restrictions.',
    category: 'Racism / Discrimination',
    subcategory: 'Anti-Muslim Policy',
    phase: 'White House 1',
    date_start: '2018-06-26',
    date_end: '2018-06-26',
    keywords: ['Trump v. Hawaii', 'Supreme Court', 'travel ban'],
    scores: makeScores({
      date_start: '2018-06-26',
      category: 'Racism / Discrimination',
      subcategory: 'Anti-Muslim Policy',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'the Supreme Court upheld the travel ban restrictions.'
    }),
    source: {
      url: 'https://www.supremecourt.gov/opinions/17pdf/17-965_h315.pdf',
      title: 'Trump v. Hawaii (Opinion)',
      publisher: 'U.S. Supreme Court'
    }
  },
  {
    entry_number: 714,
    title: 'Sets FY2018 Refugee Cap at 45,000',
    synopsis: 'Trump issued a determination limiting FY2018 refugee admissions to 45,000.',
    rationale: 'Lowered the refugee admissions cap for FY2018.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2017-09-27',
    date_end: '2017-09-27',
    keywords: ['refugee cap', 'FY2018', 'determination'],
    scores: makeScores({
      date_start: '2017-09-27',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'set the FY2018 refugee admissions ceiling at 45,000.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-determination-refugee-admissions-fiscal-year-2018/',
      title: 'Presidential Determination on Refugee Admissions for Fiscal Year 2018',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 715,
    title: 'Cuts FY2019 Refugee Cap to 30,000',
    synopsis: 'Trump issued a determination setting the FY2019 refugee admissions ceiling at 30,000.',
    rationale: 'Further reduced the refugee admissions cap for FY2019.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2018-09-17',
    date_end: '2018-09-17',
    keywords: ['refugee cap', 'FY2019', 'determination'],
    scores: makeScores({
      date_start: '2018-09-17',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'set the FY2019 refugee admissions ceiling at 30,000.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-determination-refugee-admissions-fiscal-year-2019/',
      title: 'Presidential Determination on Refugee Admissions for Fiscal Year 2019',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 716,
    title: 'Sets FY2021 Refugee Cap at 15,000',
    synopsis: 'Trump issued a determination setting the FY2021 refugee admissions ceiling at 15,000.',
    rationale: 'Set the refugee admissions cap at a historic low.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2020-10-01',
    date_end: '2020-10-01',
    keywords: ['refugee cap', 'FY2021', 'determination'],
    scores: makeScores({
      date_start: '2020-10-01',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 6,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'set the FY2021 refugee admissions ceiling at 15,000.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-determination-refugee-admissions-fiscal-year-2021/',
      title: 'Presidential Determination on Refugee Admissions for Fiscal Year 2021',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 717,
    title: 'Declares National Emergency for Border Wall',
    synopsis: 'Trump issued a proclamation declaring a national emergency at the southern border to access additional wall funding.',
    rationale: 'Declared a national emergency to redirect funds for the wall.',
    category: 'Authoritarianism',
    subcategory: 'Abuse of Power',
    phase: 'White House 1',
    date_start: '2019-02-15',
    date_end: '2019-02-15',
    keywords: ['national emergency', 'border wall', 'funding'],
    scores: makeScores({
      date_start: '2019-02-15',
      category: 'Authoritarianism',
      subcategory: 'Abuse of Power',
      danger: 6,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 6,
      rationale_short: 'declared a national emergency to redirect wall funding.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-declaring-national-emergency-concerning-southern-border-united-states/',
      title: 'Proclamation Declaring a National Emergency Concerning the Southern Border of the United States',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 718,
    title: 'Announces “Zero Tolerance” Criminal Prosecution Policy',
    synopsis: 'Attorney General Jeff Sessions announced a zero tolerance policy for illegal entry, accelerating family separations.',
    rationale: 'Announced a zero tolerance policy that drove family separations.',
    category: 'Human Rights Violations',
    subcategory: 'Family Separation and Child Detention',
    phase: 'White House 1',
    date_start: '2018-04-06',
    date_end: '2018-04-06',
    keywords: ['zero tolerance', 'Sessions', 'family separation', 'DOJ'],
    scores: makeScores({
      date_start: '2018-04-06',
      category: 'Human Rights Violations',
      subcategory: 'Family Separation and Child Detention',
      danger: 7,
      lawlessness: 5,
      impact_scope: 6,
      authoritarianism: 6,
      rationale_short: 'announced a zero tolerance policy that drove family separations.'
    }),
    source: {
      url: 'https://www.justice.gov/opa/pr/attorney-general-announces-zero-tolerance-policy-criminal-illegal-entry',
      title: 'Attorney General Announces Zero Tolerance Policy for Criminal Illegal Entry',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 719,
    title: 'Imposes Section 201 Tariffs on Solar Panels and Washing Machines',
    synopsis: 'Trump issued a proclamation imposing safeguard tariffs on imported solar cells and washing machines.',
    rationale: 'Imposed Section 201 tariffs on solar panels and washing machines.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2018-01-23',
    date_end: '2018-01-23',
    keywords: ['Section 201', 'solar tariffs', 'washing machines', 'trade'],
    scores: makeScores({
      date_start: '2018-01-23',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 2,
      rationale_short: 'imposed safeguard tariffs on solar panels and washing machines.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-proclamation-safeguard-measures-imports-solar-cells-modules-washing-machines/',
      title: 'Presidential Proclamation on Safeguard Measures on Imports of Solar Cells and Modules and Large Residential Washers',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 720,
    title: 'Signs Tax Cuts and Jobs Act',
    synopsis: 'Trump signed the Tax Cuts and Jobs Act, delivering sweeping tax cuts skewed toward corporations and high-income earners.',
    rationale: 'Signed a major tax law favoring corporations and high-income earners.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'National Fiscal Collapse and Economic Destruction',
    phase: 'White House 1',
    date_start: '2017-12-22',
    date_end: '2017-12-22',
    keywords: ['Tax Cuts and Jobs Act', 'tax cuts', 'corporations'],
    scores: makeScores({
      date_start: '2017-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'National Fiscal Collapse and Economic Destruction',
      danger: 5,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 2,
      rationale_short: 'signed the Tax Cuts and Jobs Act favoring corporations and wealthy households.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/president-donald-j-trump-signs-h-r-1-tax-cuts-jobs-act/',
      title: 'President Donald J. Trump Signs H.R. 1: Tax Cuts and Jobs Act',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 721,
    title: 'Finalizes Affordable Clean Energy Rule',
    synopsis: 'EPA finalized the Affordable Clean Energy rule, replacing the Clean Power Plan and weakening power plant emissions limits.',
    rationale: 'Replaced the Clean Power Plan with a weaker emissions rule.',
    category: 'Environmental Destruction',
    subcategory: 'Climate Solutions Elimination',
    phase: 'White House 1',
    date_start: '2019-06-19',
    date_end: '2019-06-19',
    keywords: ['ACE rule', 'Clean Power Plan', 'EPA', 'emissions'],
    scores: makeScores({
      date_start: '2019-06-19',
      category: 'Environmental Destruction',
      subcategory: 'Climate Solutions Elimination',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'finalized the Affordable Clean Energy rule replacing the Clean Power Plan.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-finalizes-affordable-clean-energy-rule',
      title: 'EPA Finalizes Affordable Clean Energy Rule',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 722,
    title: 'Issues HHS Conscience Rule',
    synopsis: 'HHS finalized a conscience rule expanding providers’ ability to refuse care based on religious objections.',
    rationale: 'Expanded refusal rights for healthcare providers via HHS rulemaking.',
    category: 'Human Rights Violations',
    subcategory: 'Healthcare Religious Refusal',
    phase: 'White House 1',
    date_start: '2019-05-02',
    date_end: '2019-05-02',
    keywords: ['conscience rule', 'HHS', 'religious refusal', 'healthcare'],
    scores: makeScores({
      date_start: '2019-05-02',
      category: 'Human Rights Violations',
      subcategory: 'Healthcare Religious Refusal',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'finalized a conscience rule expanding refusals of care.'
    }),
    source: {
      url: 'https://www.hhs.gov/about/news/2019/05/02/hhs-issues-final-rule-protect-conscience-rights-in-health-care.html',
      title: 'HHS Issues Final Rule to Protect Conscience Rights in Health Care',
      publisher: 'U.S. Department of Health & Human Services'
    }
  },
  {
    entry_number: 723,
    title: 'Finalizes Title X “Gag Rule”',
    synopsis: 'HHS issued a final rule restructuring Title X and restricting providers that offer abortion referrals.',
    rationale: 'Imposed a Title X rule restricting providers and abortion referrals.',
    category: 'Human Rights Violations',
    subcategory: 'Family Planning Program Elimination',
    phase: 'White House 1',
    date_start: '2019-02-22',
    date_end: '2019-02-22',
    keywords: ['Title X', 'gag rule', 'HHS', 'family planning'],
    scores: makeScores({
      date_start: '2019-02-22',
      category: 'Human Rights Violations',
      subcategory: 'Family Planning Program Elimination',
      danger: 6,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'issued a Title X rule restricting providers and abortion referrals.'
    }),
    source: {
      url: 'https://www.hhs.gov/about/news/2019/02/22/hhs-issues-final-rule-to-protect-title-x-family-planning-program.html',
      title: 'HHS Issues Final Rule to Protect Title X Family Planning Program',
      publisher: 'U.S. Department of Health & Human Services'
    }
  },
  {
    entry_number: 724,
    title: 'Creates Schedule F to Purge Civil Service',
    synopsis: 'Trump signed Executive Order 13957 creating “Schedule F,” enabling mass reclassification of civil servants.',
    rationale: 'Created Schedule F to allow political purges of career civil servants.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Civil Service Destruction',
    phase: 'White House 1',
    date_start: '2020-10-21',
    date_end: '2020-10-21',
    keywords: ['Schedule F', 'civil service', 'EO 13957', 'purge'],
    scores: makeScores({
      date_start: '2020-10-21',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Civil Service Destruction',
      danger: 7,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 6,
      rationale_short: 'created Schedule F to enable mass civil service reclassification.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-creating-schedule-f-excepted-service/',
      title: 'Executive Order on Creating Schedule F in the Excepted Service',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 725,
    title: 'Finalizes “Secret Science” Rule',
    synopsis: 'EPA finalized a rule restricting use of certain scientific studies in rulemaking, weakening environmental protections.',
    rationale: 'Finalized a rule limiting which scientific studies EPA can use.',
    category: 'Environmental Destruction',
    subcategory: 'Scientific Research Suppression and Researcher Persecution',
    phase: 'White House 1',
    date_start: '2021-01-06',
    date_end: '2021-01-06',
    keywords: ['EPA', 'secret science', 'regulatory science', 'rule'],
    scores: makeScores({
      date_start: '2021-01-06',
      category: 'Environmental Destruction',
      subcategory: 'Scientific Research Suppression and Researcher Persecution',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'finalized a rule limiting which scientific studies EPA can use.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-finalizes-rule-strengthen-transparency-regulatory-science',
      title: 'EPA Finalizes Rule to Strengthen Transparency in Regulatory Science',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 726,
    title: 'Rescinds DACA Protections',
    synopsis: 'DHS issued a memorandum rescinding DACA, ending protections for hundreds of thousands of Dreamers.',
    rationale: 'Ordered the rescission of DACA protections for Dreamers.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-09-05',
    date_end: '2017-09-05',
    keywords: ['DACA', 'Dreamers', 'rescission', 'DHS'],
    scores: makeScores({
      date_start: '2017-09-05',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 6,
      lawlessness: 4,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'ordered the rescission of DACA protections for Dreamers.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2017/09/05/memorandum-rescission-daca',
      title: 'Memorandum on the Rescission of DACA',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 727,
    title: 'Terminates TPS for Haiti',
    synopsis: 'DHS announced termination of Temporary Protected Status for Haiti, forcing many immigrants toward removal.',
    rationale: 'Terminated TPS for Haiti, threatening lawful status for many residents.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-11-20',
    date_end: '2017-11-20',
    keywords: ['TPS', 'Haiti', 'DHS', 'termination'],
    scores: makeScores({
      date_start: '2017-11-20',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for Haiti.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2017/11/20/secretary-elaine-duke-terminates-temporary-protected-status-haiti',
      title: 'Secretary Elaine Duke Terminates Temporary Protected Status for Haiti',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 728,
    title: 'Terminates TPS for El Salvador',
    synopsis: 'DHS announced termination of Temporary Protected Status for El Salvador, jeopardizing legal status for many residents.',
    rationale: 'Terminated TPS for El Salvador, threatening lawful status for many residents.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-01-08',
    date_end: '2018-01-08',
    keywords: ['TPS', 'El Salvador', 'DHS', 'termination'],
    scores: makeScores({
      date_start: '2018-01-08',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for El Salvador.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2018/01/08/secretary-nielsen-terminates-temporary-protected-status-el-salvador',
      title: 'Secretary Nielsen Terminates Temporary Protected Status for El Salvador',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 729,
    title: 'Pardons Navy Sailor Kristian Saucier',
    synopsis: 'Trump granted a pardon to Kristian Saucier, a former Navy sailor convicted in a classified photos case.',
    rationale: 'Granted clemency to a political ally in a sensitive security case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-03-09',
    date_end: '2018-03-09',
    keywords: ['Kristian Saucier', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2018-03-09',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Kristian Saucier.'
    }),
    source: clemencySource
  },
  {
    entry_number: 730,
    title: 'Pardons Scooter Libby',
    synopsis: 'Trump granted a pardon to I. Lewis “Scooter” Libby, convicted in the Valerie Plame investigation.',
    rationale: 'Granted a political pardon to Scooter Libby.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-04-13',
    date_end: '2018-04-13',
    keywords: ['Scooter Libby', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2018-04-13',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Scooter Libby.'
    }),
    source: clemencySource
  },
  {
    entry_number: 731,
    title: 'Grants Posthumous Pardon to Jack Johnson',
    synopsis: 'Trump granted a posthumous pardon to boxer Jack Johnson.',
    rationale: 'Issued a high-profile posthumous pardon.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-05-24',
    date_end: '2018-05-24',
    keywords: ['Jack Johnson', 'posthumous pardon', 'clemency'],
    scores: makeScores({
      date_start: '2018-05-24',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'issued a posthumous pardon for Jack Johnson.'
    }),
    source: clemencySource
  },
  {
    entry_number: 732,
    title: 'Pardons Dinesh D’Souza',
    synopsis: 'Trump granted a pardon to conservative commentator Dinesh D’Souza after a campaign finance conviction.',
    rationale: 'Granted clemency to an ideological ally convicted of campaign finance violations.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-05-31',
    date_end: '2018-05-31',
    keywords: ['Dinesh D’Souza', 'pardon', 'campaign finance'],
    scores: makeScores({
      date_start: '2018-05-31',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Dinesh D’Souza.'
    }),
    source: clemencySource
  },
  {
    entry_number: 733,
    title: 'Commutes Sentence of Alice Johnson',
    synopsis: 'Trump commuted the sentence of Alice Marie Johnson after advocacy by Kim Kardashian West.',
    rationale: 'Granted high-profile clemency after celebrity lobbying.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-06-06',
    date_end: '2018-06-06',
    keywords: ['Alice Johnson', 'commutation', 'clemency'],
    scores: makeScores({
      date_start: '2018-06-06',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'commuted the sentence of Alice Johnson.'
    }),
    source: clemencySource
  },
  {
    entry_number: 734,
    title: 'Pardons Conrad Black',
    synopsis: 'Trump granted a pardon to Conrad Black, a media executive convicted of fraud and obstruction.',
    rationale: 'Granted clemency to a convicted associate.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2019-05-15',
    date_end: '2019-05-15',
    keywords: ['Conrad Black', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2019-05-15',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Conrad Black.'
    }),
    source: clemencySource
  },
  {
    entry_number: 735,
    title: 'Pardons Michael Milken',
    synopsis: 'Trump granted a pardon to financier Michael Milken, convicted in a major securities fraud case.',
    rationale: 'Granted clemency to a financier convicted of securities fraud.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Michael Milken', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Michael Milken.'
    }),
    source: clemencySource
  },
  {
    entry_number: 736,
    title: 'Pardons Bernard Kerik',
    synopsis: 'Trump granted a pardon to Bernard Kerik, a former NYPD commissioner convicted of fraud and tax crimes.',
    rationale: 'Granted clemency to a politically connected ally.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Bernard Kerik', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to Bernard Kerik.'
    }),
    source: clemencySource
  },
  {
    entry_number: 737,
    title: 'Commutes Sentence of Rod Blagojevich',
    synopsis: 'Trump commuted the sentence of former Illinois Gov. Rod Blagojevich, convicted on corruption charges.',
    rationale: 'Granted clemency to a former governor convicted of corruption.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Rod Blagojevich', 'commutation', 'clemency'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'commuted the sentence of Rod Blagojevich.'
    }),
    source: clemencySource
  },
  {
    entry_number: 738,
    title: 'Pardons Rep. Duncan Hunter',
    synopsis: 'Trump granted a pardon to former Rep. Duncan Hunter after a campaign finance conviction.',
    rationale: 'Granted clemency to a former congressman convicted of campaign finance crimes.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-22',
    date_end: '2020-12-22',
    keywords: ['Duncan Hunter', 'pardon', 'campaign finance'],
    scores: makeScores({
      date_start: '2020-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to former Rep. Duncan Hunter.'
    }),
    source: clemencySource
  },
  {
    entry_number: 739,
    title: 'Pardons Rep. Chris Collins',
    synopsis: 'Trump granted a pardon to former Rep. Chris Collins after a conviction for insider trading.',
    rationale: 'Granted clemency to a former congressman convicted of insider trading.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-22',
    date_end: '2020-12-22',
    keywords: ['Chris Collins', 'pardon', 'insider trading'],
    scores: makeScores({
      date_start: '2020-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to former Rep. Chris Collins.'
    }),
    source: clemencySource
  },
  {
    entry_number: 740,
    title: 'Pardons George Papadopoulos',
    synopsis: 'Trump granted a pardon to former campaign adviser George Papadopoulos after his conviction in the Russia probe.',
    rationale: 'Granted clemency to a former campaign adviser in the Russia probe.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-22',
    date_end: '2020-12-22',
    keywords: ['George Papadopoulos', 'pardon', 'Russia probe'],
    scores: makeScores({
      date_start: '2020-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'granted clemency to George Papadopoulos.'
    }),
    source: clemencySource
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
