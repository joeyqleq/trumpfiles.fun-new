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
    entry_number: 647,
    title: 'Signs Two-for-One Deregulation Executive Order',
    synopsis: 'Trump signed Executive Order 13771 requiring agencies to eliminate two regulations for every new rule, embedding a government-wide deregulation mandate.',
    rationale: 'Imposed a blanket deregulation requirement across federal agencies.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2017-01-30',
    date_end: '2017-01-30',
    keywords: ['EO 13771', 'deregulation', 'two-for-one', 'regulatory costs'],
    scores: makeScores({
      date_start: '2017-01-30',
      category: 'Environmental Destruction',
      subcategory: 'Systematic Deregulation',
      danger: 5,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'signed EO 13771 imposing a two-for-one deregulation requirement.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/executive-order-13771-reducing-regulation-and-controlling-regulatory-costs',
      title: 'Executive Order 13771—Reducing Regulation and Controlling Regulatory Costs',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 648,
    title: 'Repeals Stream Protection Rule',
    synopsis: 'Trump signed legislation to nullify the Stream Protection Rule, rolling back Obama-era protections for streams near coal mining operations.',
    rationale: 'Eliminated federal protections for waterways affected by coal mining.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2017-02-16',
    date_end: '2017-02-16',
    keywords: ['Stream Protection Rule', 'coal mining', 'CRA', 'waterways'],
    scores: makeScores({
      date_start: '2017-02-16',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 5,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'signed legislation repealing the Stream Protection Rule.'
    }),
    source: {
      url: 'https://www.congress.gov/bill/115th-congress/house-joint-resolution/38',
      title: 'H.J.Res.38 - Disapproving the rule submitted by the Department of the Interior known as the "Stream Protection Rule"',
      publisher: 'Congress.gov'
    }
  },
  {
    entry_number: 649,
    title: 'Lifts Federal Coal Leasing Moratorium',
    synopsis: 'Interior revoked the moratorium on new federal coal leases, reopening public lands to expanded coal extraction.',
    rationale: 'Reopened federal coal leasing on public lands.',
    category: 'Environmental Destruction',
    subcategory: 'Fossil Fuel Expansion and Climate Science Elimination',
    phase: 'White House 1',
    date_start: '2017-03-29',
    date_end: '2017-03-29',
    keywords: ['coal leasing', 'Interior', 'public lands', 'moratorium'],
    scores: makeScores({
      date_start: '2017-03-29',
      category: 'Environmental Destruction',
      subcategory: 'Fossil Fuel Expansion and Climate Science Elimination',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'lifted the federal coal leasing moratorium on public lands.'
    }),
    source: {
      url: 'https://climate.law.columbia.edu/content/secretarial-order-revocation-secretarial-order-3338-revocation-secretarial-order',
      title: 'Secretarial Order on Revocation of Secretarial Order 3338, "Revocation of the Secretarial Order Establishing a Moratorium on Federal Coal Leasing"',
      publisher: 'Sabin Center for Climate Change Law'
    }
  },
  {
    entry_number: 650,
    title: 'Revokes Federal Flood Risk Management Standard',
    synopsis: 'Trump signed an executive order revoking the federal flood risk management standard for infrastructure projects, weakening resilience requirements.',
    rationale: 'Eliminated federal flood risk safeguards for infrastructure.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2017-08-15',
    date_end: '2017-08-15',
    keywords: ['flood risk', 'infrastructure', 'EO 13807', 'resilience'],
    scores: makeScores({
      date_start: '2017-08-15',
      category: 'Environmental Destruction',
      subcategory: 'Systematic Deregulation',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'revoked the federal flood risk management standard for infrastructure.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/executive-order-13807-establishing-discipline-and-accountability-the',
      title: 'Executive Order 13807—Establishing Discipline and Accountability in the Environmental Review and Permitting Process for Infrastructure Projects',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 651,
    title: 'EPA Rejects Chlorpyrifos Ban',
    synopsis: 'EPA denied petitions to ban the pesticide chlorpyrifos, keeping the chemical on the market despite health concerns.',
    rationale: 'Refused to ban chlorpyrifos despite health risks.',
    category: 'Environmental Destruction',
    subcategory: 'Anti-Science Policy',
    phase: 'White House 1',
    date_start: '2017-03-29',
    date_end: '2017-03-29',
    keywords: ['chlorpyrifos', 'EPA', 'pesticide', 'health risks'],
    scores: makeScores({
      date_start: '2017-03-29',
      category: 'Environmental Destruction',
      subcategory: 'Anti-Science Policy',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'rejected petitions to ban the pesticide chlorpyrifos.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-denies-petitions-ban-chlorpyrifos',
      title: 'EPA Denies Petitions to Ban Chlorpyrifos',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 652,
    title: 'Proposes Massive Offshore Drilling Expansion',
    synopsis: 'Interior announced plans to open most U.S. coastal waters to offshore oil and gas leasing in a new proposed program.',
    rationale: 'Pushed a sweeping expansion of offshore drilling.',
    category: 'Environmental Destruction',
    subcategory: 'Fossil Fuel Expansion and Climate Science Elimination',
    phase: 'White House 1',
    date_start: '2018-01-04',
    date_end: '2018-01-04',
    keywords: ['offshore drilling', 'Interior', 'oil and gas', 'OCS'],
    scores: makeScores({
      date_start: '2018-01-04',
      category: 'Environmental Destruction',
      subcategory: 'Fossil Fuel Expansion and Climate Science Elimination',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'announced a plan to open most U.S. waters to offshore drilling.'
    }),
    source: {
      url: 'https://www.axios.com/2018/01/04/trump-offshore-drilling-oil-gas',
      title: 'Trump to open 90 percent of U.S. waters to drilling',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 653,
    title: 'Advances ANWR Oil and Gas Leasing Program',
    synopsis: 'The Bureau of Land Management announced a record of decision for oil and gas leasing in the Arctic National Wildlife Refuge coastal plain.',
    rationale: 'Advanced oil and gas leasing in the Arctic National Wildlife Refuge.',
    category: 'Environmental Destruction',
    subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
    phase: 'White House 1',
    date_start: '2020-08-17',
    date_end: '2020-08-17',
    keywords: ['ANWR', 'BLM', 'coastal plain', 'leasing'],
    scores: makeScores({
      date_start: '2020-08-17',
      category: 'Environmental Destruction',
      subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'advanced oil and gas leasing in the Arctic National Wildlife Refuge.'
    }),
    source: {
      url: 'https://www.blm.gov/press-release/blm-announces-record-decision-coastal-plain-oil-and-gas-leasing-program',
      title: 'BLM announces record of decision for coastal plain oil and gas leasing program',
      publisher: 'Bureau of Land Management'
    }
  },
  {
    entry_number: 654,
    title: 'Rescinds BLM Methane Waste Prevention Rule',
    synopsis: 'Interior finalized a rule rescinding key parts of the methane waste prevention rule for oil and gas operations on public lands.',
    rationale: 'Rolled back methane waste prevention standards on public lands.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2018-09-18',
    date_end: '2018-09-18',
    keywords: ['BLM', 'methane', 'waste prevention', 'public lands'],
    scores: makeScores({
      date_start: '2018-09-18',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'rescinded the methane waste prevention rule for public lands.'
    }),
    source: {
      url: 'https://www.doi.gov/pressreleases/secretary-zinke-announces-final-rule-rescinding-unnecessary-burdensome',
      title: 'Secretary Zinke Announces Final Rule Rescinding Unnecessary, Burdensome Regulations',
      publisher: 'U.S. Department of the Interior'
    }
  },
  {
    entry_number: 655,
    title: 'EPA Weakens Coal Ash Disposal Rules',
    synopsis: 'EPA issued a final rule amending coal ash disposal regulations, loosening requirements for coal ash facilities.',
    rationale: 'Weakened federal coal ash disposal protections.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2018-07-18',
    date_end: '2018-07-18',
    keywords: ['coal ash', 'EPA', 'waste', 'power plants'],
    scores: makeScores({
      date_start: '2018-07-18',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'issued amendments weakening coal ash disposal requirements.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-issues-final-rule-amending-coal-ash-disposal-regulations',
      title: 'EPA Issues Final Rule Amending Coal Ash Disposal Regulations',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 656,
    title: 'Weakens Mercury and Air Toxics Standards Finding',
    synopsis: 'EPA finalized a rule rescinding the "appropriate and necessary" finding underpinning mercury and air toxics standards for power plants.',
    rationale: 'Undermined the legal basis for mercury emissions limits.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2020-05-22',
    date_end: '2020-05-22',
    keywords: ['MATS', 'mercury', 'EPA', 'power plants'],
    scores: makeScores({
      date_start: '2020-05-22',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'reversed the legal finding supporting mercury emissions limits.'
    }),
    source: {
      url: 'https://www.epa.gov/haps/mats-2020-action',
      title: 'MATS 2020 Action',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 657,
    title: 'Finalizes SAFE Rule Rolling Back Auto Emissions Standards',
    synopsis: 'EPA and DOT finalized the SAFE rule reducing federal vehicle emissions and fuel economy requirements.',
    rationale: 'Rolled back federal vehicle emissions and efficiency standards.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2020-03-31',
    date_end: '2020-03-31',
    keywords: ['SAFE rule', 'auto emissions', 'EPA', 'fuel economy'],
    scores: makeScores({
      date_start: '2020-03-31',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'finalized the SAFE rule rolling back auto emissions standards.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-and-dot-finalize-one-national-program-rule',
      title: 'EPA and DOT Finalize One National Program Rule',
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 658,
    title: 'Revokes California Clean Air Waiver',
    synopsis: 'EPA and NHTSA withdrew California’s waiver to set stricter vehicle emissions standards.',
    rationale: 'Revoked California’s authority to set stricter emissions rules.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2019-09-19',
    date_end: '2019-09-19',
    keywords: ['California waiver', 'auto emissions', 'EPA', 'NHTSA'],
    scores: makeScores({
      date_start: '2019-09-19',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'revoked California’s clean air waiver for vehicle standards.'
    }),
    source: {
      url: 'https://www.nhtsa.gov/safe',
      title: 'The Safer Affordable Fuel-Efficient (SAFE) Vehicles Rule',
      publisher: 'National Highway Traffic Safety Administration'
    }
  },
  {
    entry_number: 659,
    title: 'Issues Navigable Waters Protection Rule',
    synopsis: 'EPA and the Army Corps issued the Navigable Waters Protection Rule, narrowing federal Clean Water Act protections.',
    rationale: 'Narrowed federal Clean Water Act protections for waterways.',
    category: 'Environmental Destruction',
    subcategory: 'Systematic Deregulation',
    phase: 'White House 1',
    date_start: '2020-04-21',
    date_end: '2020-04-21',
    keywords: ['NWPR', 'Clean Water Act', 'EPA', 'Army Corps'],
    scores: makeScores({
      date_start: '2020-04-21',
      category: 'Environmental Destruction',
      subcategory: 'Systematic Deregulation',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'issued the Navigable Waters Protection Rule narrowing Clean Water Act coverage.'
    }),
    source: {
      url: 'https://www.epa.gov/newsreleases/epa-and-army-deliver-navigable-waters-protection-rule',
      title: "EPA and Army Deliver on Navigable Waters Protection Rule to Define 'Waters of the United States'",
      publisher: 'U.S. Environmental Protection Agency'
    }
  },
  {
    entry_number: 660,
    title: 'Ends FCC Broadband Privacy Rules',
    synopsis: 'Trump signed legislation repealing FCC broadband privacy rules that limited ISPs from selling customers’ browsing data.',
    rationale: 'Repealed FCC privacy protections for broadband users.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Online Privacy and Surveillance Infrastructure',
    phase: 'White House 1',
    date_start: '2017-04-03',
    date_end: '2017-04-03',
    keywords: ['FCC privacy', 'broadband', 'ISPs', 'browsing data'],
    scores: makeScores({
      date_start: '2017-04-03',
      category: 'Violent Rhetoric / Threats',
      subcategory: 'Online Privacy and Surveillance Infrastructure',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'signed legislation ending FCC broadband privacy rules.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/04/03/trump-signs-bill-ending-fcc-broadband-privacy-rules.html',
      title: 'Trump signs bill ending FCC broadband privacy rules',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 661,
    title: 'Repeals Fair Pay and Safe Workplaces Rule',
    synopsis: 'Trump signed a resolution nullifying the Fair Pay and Safe Workplaces rule that required contractors to disclose labor law violations.',
    rationale: 'Eliminated contractor disclosure requirements for labor violations.',
    category: 'Human Rights Violations',
    subcategory: 'Worker Rights Elimination and Union Destruction',
    phase: 'White House 1',
    date_start: '2017-04-03',
    date_end: '2017-04-03',
    keywords: ['Fair Pay', 'Safe Workplaces', 'contractors', 'labor violations'],
    scores: makeScores({
      date_start: '2017-04-03',
      category: 'Human Rights Violations',
      subcategory: 'Worker Rights Elimination and Union Destruction',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'repealed the Fair Pay and Safe Workplaces rule for contractors.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/president-donald-j-trump-signs-h-j-res-37/',
      title: 'President Donald J. Trump Signs H.J.Res. 37',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 662,
    title: 'Delays Fiduciary Rule for Retirement Advisors',
    synopsis: 'The Labor Department issued a final rule delaying the fiduciary rule requiring retirement advisors to act in clients’ best interests.',
    rationale: 'Delayed the retirement fiduciary rule protecting savers.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corporate Crime Protection',
    phase: 'White House 1',
    date_start: '2017-02-03',
    date_end: '2017-02-03',
    keywords: ['fiduciary rule', 'retirement', 'DOL', 'advisors'],
    scores: makeScores({
      date_start: '2017-02-03',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corporate Crime Protection',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      rationale_short: 'delayed the fiduciary rule protecting retirement savers.'
    }),
    source: {
      url: 'https://www.dol.gov/newsroom/releases/ebsa/ebsa20170203',
      title: 'US Department of Labor Saves American Retirement Savings with Final Rule to Delay Fiduciary Rule',
      publisher: 'U.S. Department of Labor'
    }
  },
  {
    entry_number: 663,
    title: 'Appoints Mick Mulvaney to Lead CFPB',
    synopsis: 'Trump named budget director Mick Mulvaney as acting CFPB director, shifting the consumer watchdog toward deregulatory priorities.',
    rationale: 'Installed a deregulatory ally to run the CFPB.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Consumer Fraud',
    phase: 'White House 1',
    date_start: '2017-11-24',
    date_end: '2017-11-24',
    keywords: ['CFPB', 'Mulvaney', 'consumer protection', 'deregulation'],
    scores: makeScores({
      date_start: '2017-11-24',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Consumer Fraud',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      rationale_short: 'appointed Mick Mulvaney as acting CFPB director.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2017/nov/24/mick-mulvaney-cfpb-consumer-financial-protection-bureau-trump',
      title: 'Trump appoints Mick Mulvaney acting head of consumer protection agency',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 664,
    title: 'Plans G-7 Summit at Trump Doral Resort',
    synopsis: 'The White House announced plans to hold the G-7 summit at Trump’s Doral resort, then reversed the decision after backlash over conflicts of interest.',
    rationale: 'Proposed hosting a G-7 summit at a Trump-owned resort.',
    category: 'Government Corruption',
    subcategory: 'Conflicts of Interest',
    phase: 'White House 1',
    date_start: '2019-10-19',
    date_end: '2019-10-19',
    keywords: ['G-7', 'Doral', 'conflicts of interest', 'resort'],
    scores: makeScores({
      date_start: '2019-10-19',
      category: 'Government Corruption',
      subcategory: 'Conflicts of Interest',
      danger: 5,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'proposed hosting the G-7 at his Doral resort before reversing.'
    }),
    source: {
      url: 'https://apnews.com/article/93aff6f51dc849ba97353de7f146f468',
      title: 'Trump ditches plan to host G-7 at his Florida resort',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 665,
    title: 'Ivanka Trump Receives China Trademarks',
    synopsis: 'China approved trademarks for Ivanka Trump’s brand while she served as a White House adviser, raising ethics concerns.',
    rationale: 'Family business received foreign trademarks during her White House role.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Emoluments Violations',
    phase: 'White House 1',
    date_start: '2017-04-18',
    date_end: '2017-04-18',
    keywords: ['Ivanka Trump', 'China trademarks', 'emoluments', 'brand'],
    scores: makeScores({
      date_start: '2017-04-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Emoluments Violations',
      danger: 5,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'China granted trademarks to Ivanka Trump while she served in the White House.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/04/18/china-approves-ivanka-trump-trademarks-as-trump-preps-for-first-trip.html',
      title: 'China approves Ivanka Trump trademarks as Trump preps for first trip',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 666,
    title: 'Overrides Kushner Security Clearance Concerns',
    synopsis: 'Reports said Jared Kushner was initially denied a security clearance and later approved after presidential intervention.',
    rationale: 'Overrode security clearance concerns for a close family adviser.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2019-02-28',
    date_end: '2019-02-28',
    keywords: ['Jared Kushner', 'security clearance', 'nepotism', 'intervention'],
    scores: makeScores({
      date_start: '2019-02-28',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 5,
      lawlessness: 5,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'approved Kushner’s clearance after initial denial concerns.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/02/28/trump-family-adviser-jared-kushner-was-denied-security-clearance-then-approved-after-trump-intervened-nbc.html',
      title: 'Trump family adviser Jared Kushner was denied security clearance then approved after Trump intervened: NBC News',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 667,
    title: 'Commutes Roger Stone Sentence',
    synopsis: 'Trump commuted the prison sentence of longtime ally Roger Stone, sparking criticism of political favoritism.',
    rationale: 'Granted clemency to a close political ally.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-07-10',
    date_end: '2020-07-10',
    keywords: ['Roger Stone', 'commutation', 'clemency', 'ally'],
    scores: makeScores({
      date_start: '2020-07-10',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 6,
      lawlessness: 6,
      impact_scope: 5,
      authoritarianism: 5,
      rationale_short: 'commuted the sentence of Roger Stone, a close ally.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-regarding-commutation-sentence-roger-stone/',
      title: 'Statement from the Press Secretary Regarding the Commutation of the Sentence of Roger Stone',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 668,
    title: 'Invites Taliban to Camp David, Then Cancels',
    synopsis: 'Trump disclosed secret plans to host Taliban leaders at Camp David, then canceled the meeting after a Taliban attack.',
    rationale: 'Attempted to host Taliban leaders at Camp David before canceling.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-09-07',
    date_end: '2019-09-07',
    keywords: ['Taliban', 'Camp David', 'Afghanistan', 'talks'],
    scores: makeScores({
      date_start: '2019-09-07',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'revealed a plan to host Taliban leaders at Camp David before canceling.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/09/07/trump-cancels-secret-meeting-with-taliban-after-attack-kills-us-soldier.html',
      title: 'Trump cancels secret meeting with Taliban after attack kills U.S. soldier',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 669,
    title: 'Signs Doha Agreement with the Taliban',
    synopsis: 'The U.S. and Taliban signed the Doha agreement outlining a U.S. troop withdrawal from Afghanistan.',
    rationale: 'Signed a withdrawal agreement with the Taliban.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2020-02-29',
    date_end: '2020-02-29',
    keywords: ['Doha agreement', 'Taliban', 'Afghanistan', 'withdrawal'],
    scores: makeScores({
      date_start: '2020-02-29',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'signed the Doha agreement outlining U.S. withdrawal from Afghanistan.'
    }),
    source: {
      url: 'https://www.theguardian.com/world/2020/feb/29/us-and-taliban-sign-agreement-to-end-18-year-war',
      title: 'US and Taliban sign agreement to end 18-year war',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 670,
    title: 'Orders Troop Reduction in Germany',
    synopsis: 'Trump ordered a reduction of U.S. troops stationed in Germany, alarming NATO allies.',
    rationale: 'Directed a major reduction of U.S. forces in Germany.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2020-06-15',
    date_end: '2020-06-15',
    keywords: ['Germany', 'troop withdrawal', 'NATO', 'Pentagon'],
    scores: makeScores({
      date_start: '2020-06-15',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'ordered a reduction of U.S. troops stationed in Germany.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/06/15/trump-orders-withdrawal-of-9500-us-troops-from-germany.html',
      title: 'Trump orders withdrawal of 9,500 U.S. troops from Germany',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 671,
    title: 'Meets Kim Jong Un in Singapore Summit',
    synopsis: 'Trump held a summit with North Korea’s Kim Jong Un in Singapore, granting international legitimacy to the regime.',
    rationale: 'Held a high-profile summit with Kim Jong Un in Singapore.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2018-06-12',
    date_end: '2018-06-12',
    keywords: ['Singapore summit', 'Kim Jong Un', 'North Korea', 'diplomacy'],
    scores: makeScores({
      date_start: '2018-06-12',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'held a summit with Kim Jong Un in Singapore.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/06/12/trump-kim-summit-north-korea-singapore.html',
      title: 'Trump, Kim summit in Singapore: Here’s what happened',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 672,
    title: 'Hanoi Summit with Kim Jong Un Collapses',
    synopsis: 'Trump’s second summit with Kim Jong Un in Hanoi ended without an agreement after talks broke down.',
    rationale: 'Held a second summit with Kim Jong Un that ended without a deal.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-02-27',
    date_end: '2019-02-27',
    keywords: ['Hanoi summit', 'Kim Jong Un', 'North Korea', 'no deal'],
    scores: makeScores({
      date_start: '2019-02-27',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'held a second summit with Kim Jong Un that ended without agreement.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/02/27/trump-says-he-would-walk-away-from-no-deal-at-north-korea-summit.html',
      title: 'Trump says he would walk away from no-deal at North Korea summit',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 673,
    title: 'Crosses into North Korea at DMZ',
    synopsis: 'Trump briefly crossed into North Korea at the DMZ, becoming the first sitting U.S. president to do so.',
    rationale: 'Stepped into North Korea during a DMZ meeting with Kim Jong Un.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-06-30',
    date_end: '2019-06-30',
    keywords: ['DMZ', 'North Korea', 'Kim Jong Un', 'border'],
    scores: makeScores({
      date_start: '2019-06-30',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'crossed into North Korea during a DMZ meeting with Kim Jong Un.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/06/30/trump-crosses-into-north-korea-after-inviting-kim-to-meet-at-dmz.html',
      title: 'Trump crosses into North Korea after inviting Kim to meet at DMZ',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 674,
    title: 'Disbands NSC Pandemic Response Unit',
    synopsis: 'The White House eliminated the National Security Council’s global health security team, weakening pandemic preparedness.',
    rationale: 'Disbanded the NSC global health security unit.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Infrastructure Destruction',
    phase: 'White House 1',
    date_start: '2018-05-10',
    date_end: '2018-05-10',
    keywords: ['NSC', 'pandemic', 'global health security', 'preparedness'],
    scores: makeScores({
      date_start: '2018-05-10',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Infrastructure Destruction',
      danger: 6,
      lawlessness: 2,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'disbanded the NSC global health security team.'
    }),
    source: {
      url: 'https://time.com/5516277/global-health-security-trump/',
      title: 'The Trump Administration Disbanded the White House Pandemic Response Unit',
      publisher: 'Time'
    }
  },
  {
    entry_number: 675,
    title: 'Rescinds Campus Sexual Assault Guidance',
    synopsis: 'Education Secretary Betsy DeVos withdrew Obama-era guidance on handling campus sexual assault cases.',
    rationale: 'Rescinded federal guidance for campus sexual assault cases.',
    category: 'Human Rights Violations',
    subcategory: 'Domestic Violence and Sexual Assault Support Elimination',
    phase: 'White House 1',
    date_start: '2017-09-22',
    date_end: '2017-09-22',
    keywords: ['campus sexual assault', 'DeVos', 'Title IX', 'guidance'],
    scores: makeScores({
      date_start: '2017-09-22',
      category: 'Human Rights Violations',
      subcategory: 'Domestic Violence and Sexual Assault Support Elimination',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'rescinded Obama-era campus sexual assault guidance.'
    }),
    source: {
      url: 'https://www.wbur.org/edify/2017/09/22/devos-campus-sexual-assault-guidelines',
      title: 'DeVos Rescinds Campus Sexual Assault Guidelines',
      publisher: 'WBUR'
    }
  },
  {
    entry_number: 676,
    title: 'Rolls Back ACA Nondiscrimination Protections',
    synopsis: 'HHS finalized a rule rolling back Affordable Care Act nondiscrimination protections, including for LGBTQ patients.',
    rationale: 'Finalized ACA Section 1557 rollback for nondiscrimination protections.',
    category: 'Human Rights Violations',
    subcategory: 'Transgender Healthcare Ban',
    phase: 'White House 1',
    date_start: '2020-06-12',
    date_end: '2020-06-12',
    keywords: ['Section 1557', 'HHS', 'LGBTQ', 'nondiscrimination'],
    scores: makeScores({
      date_start: '2020-06-12',
      category: 'Human Rights Violations',
      subcategory: 'Transgender Healthcare Ban',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'finalized a rollback of ACA nondiscrimination protections.'
    }),
    source: {
      url: 'https://www.federalregister.gov/documents/2020/06/19/2020-11758/nondiscrimination-in-health-and-health-education-programs-or-activities',
      title: 'Nondiscrimination in Health and Health Education Programs or Activities',
      publisher: 'Federal Register'
    }
  },
  {
    entry_number: 677,
    title: 'Suspends New Green Cards During COVID-19',
    synopsis: 'Trump signed Proclamation 10014 suspending entry of many immigrants during the pandemic.',
    rationale: 'Suspended new green card immigration during the pandemic.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2020-04-22',
    date_end: '2020-04-22',
    keywords: ['Proclamation 10014', 'immigration suspension', 'green cards', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-04-22',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'suspended entry of many immigrants through Proclamation 10014.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/proclamation-10014-suspension-entry-immigrants-who-present-risk-the',
      title: 'Proclamation 10014—Suspension of Entry of Immigrants Who Present a Risk to the U.S. Labor Market During the Economic Recovery Following the 2019 Novel Coronavirus Outbreak',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 678,
    title: 'Suspends H-1B and Other Work Visas',
    synopsis: 'Trump issued Proclamation 10052 suspending several categories of nonimmigrant work visas, including H-1B.',
    rationale: 'Suspended major categories of work visas during the pandemic.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2020-06-22',
    date_end: '2020-06-22',
    keywords: ['H-1B', 'work visas', 'Proclamation 10052', 'nonimmigrant'],
    scores: makeScores({
      date_start: '2020-06-22',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 6,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'suspended multiple categories of work visas by proclamation.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/proclamation-10052-suspension-entry-certain-nonimmigrants-who-present',
      title: 'Proclamation 10052—Suspension of Entry of Certain Nonimmigrants Who Present a Risk to the U.S. Labor Market Following the Coronavirus Outbreak',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 679,
    title: 'Expands Travel Ban to Additional Countries',
    synopsis: 'Trump issued a proclamation expanding travel restrictions to several additional countries including Nigeria and Eritrea.',
    rationale: 'Expanded the travel ban to additional countries.',
    category: 'Racism / Discrimination',
    subcategory: 'Immigration Xenophobia',
    phase: 'White House 1',
    date_start: '2020-01-31',
    date_end: '2020-01-31',
    keywords: ['travel ban', 'Nigeria', 'Eritrea', 'proclamation'],
    scores: makeScores({
      date_start: '2020-01-31',
      category: 'Racism / Discrimination',
      subcategory: 'Immigration Xenophobia',
      danger: 5,
      lawlessness: 3,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'issued a proclamation expanding travel restrictions to additional countries.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-suspension-entry-immigrants-nonimmigrants-certain-additional-countries/',
      title: 'Proclamation on the Suspension of Entry of Immigrants and Nonimmigrants of Certain Additional Countries',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 680,
    title: 'Proposes Allowing Shelters to Deny Transgender People',
    synopsis: 'HUD proposed a rule allowing federally funded shelters to deny access based on biological sex, affecting transgender people.',
    rationale: 'Proposed allowing shelters to deny access based on gender identity.',
    category: 'Human Rights Violations',
    subcategory: 'Transgender Identity Criminalization',
    phase: 'White House 1',
    date_start: '2020-05-22',
    date_end: '2020-05-22',
    keywords: ['HUD', 'shelters', 'transgender', 'rule'],
    scores: makeScores({
      date_start: '2020-05-22',
      category: 'Human Rights Violations',
      subcategory: 'Transgender Identity Criminalization',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'proposed allowing shelters to deny access based on gender identity.'
    }),
    source: {
      url: 'https://www.federalregister.gov/documents/2020/05/22/2020-10573/making-admission-or-placement-determinations-based-on-sex-in-facilities-under',
      title: 'Making Admission or Placement Determinations Based on Sex in Facilities Under Community Planning and Development Programs',
      publisher: 'Federal Register'
    }
  },
  {
    entry_number: 681,
    title: 'Lifts Ban on Lead Ammunition and Tackle',
    synopsis: 'Interior moved to lift the ban on lead ammunition and fishing tackle on federal lands and waters.',
    rationale: 'Reversed restrictions on lead ammunition and tackle on federal lands.',
    category: 'Environmental Destruction',
    subcategory: 'Environmental Rollbacks',
    phase: 'White House 1',
    date_start: '2017-02-07',
    date_end: '2017-02-07',
    keywords: ['lead ammunition', 'Interior', 'wildlife refuges', 'tackle'],
    scores: makeScores({
      date_start: '2017-02-07',
      category: 'Environmental Destruction',
      subcategory: 'Environmental Rollbacks',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'moved to lift the ban on lead ammunition and fishing tackle.'
    }),
    source: {
      url: 'https://biologicaldiversity.org/w/news/press-releases/trump-administration-moves-lift-ban-lead-ammunition-fishing-tackle-2017-02-07/',
      title: 'Trump Administration Moves to Lift Ban on Lead Ammunition, Fishing Tackle',
      publisher: 'Center for Biological Diversity'
    }
  },
  {
    entry_number: 682,
    title: 'FBI Searches Mar-a-Lago for Classified Documents',
    synopsis: 'The FBI executed a search warrant at Mar-a-Lago as part of the classified documents investigation.',
    rationale: 'Triggered a federal search over classified documents retention.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2022-08-08',
    date_end: '2022-08-08',
    keywords: ['Mar-a-Lago', 'search warrant', 'classified documents', 'FBI'],
    scores: makeScores({
      date_start: '2022-08-08',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 7,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'prompted an FBI search over classified documents at Mar-a-Lago.'
    }),
    source: {
      url: 'https://www.justice.gov/opa/speech/attorney-general-merrick-garland-delivers-remarks',
      title: 'Attorney General Merrick Garland Delivers Remarks',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 683,
    title: 'DOJ Appoints Special Counsel Jack Smith',
    synopsis: 'Attorney General Merrick Garland appointed Jack Smith as special counsel to oversee investigations into Trump.',
    rationale: 'A special counsel was appointed for Trump investigations.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-11-18',
    date_end: '2022-11-18',
    keywords: ['Jack Smith', 'special counsel', 'DOJ', 'investigations'],
    scores: makeScores({
      date_start: '2022-11-18',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 5,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'prompted appointment of a special counsel for Trump investigations.'
    }),
    source: {
      url: 'https://www.justice.gov/opa/pr/attorney-general-merrick-garland-appoints-special-counsel',
      title: 'Attorney General Merrick Garland Appoints Special Counsel',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 684,
    title: 'Trump Organization Convicted of Tax Fraud',
    synopsis: 'A jury convicted the Trump Organization on criminal tax fraud charges related to a long-running scheme.',
    rationale: 'Trump Organization was convicted of criminal tax fraud.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2022-12-06',
    date_end: '2022-12-06',
    keywords: ['Trump Organization', 'tax fraud', 'conviction', 'jury'],
    scores: makeScores({
      date_start: '2022-12-06',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'the Trump Organization was convicted of criminal tax fraud.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/12/06/trump-organization-convicted-criminal-tax-fraud.html',
      title: 'Trump Organization convicted on all counts in criminal tax fraud trial',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 685,
    title: 'Jan. 6 Committee Subpoenas Trump',
    synopsis: 'The House Jan. 6 committee voted to subpoena Trump for testimony and documents about the attack on the Capitol.',
    rationale: 'Congress issued a subpoena seeking Trump’s testimony and records.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-10-13',
    date_end: '2022-10-13',
    keywords: ['Jan. 6 committee', 'subpoena', 'Capitol attack', 'testimony'],
    scores: makeScores({
      date_start: '2022-10-13',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 5,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'was subpoenaed by the Jan. 6 committee for testimony and documents.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/10/13/jan-6-committee-approves-trump-subpoena.html',
      title: 'Jan. 6 House committee votes to subpoena Trump',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 686,
    title: 'Jan. 6 Committee Refers Trump for Criminal Charges',
    synopsis: 'The House Jan. 6 committee voted to refer Trump to the Justice Department for criminal charges related to the insurrection.',
    rationale: 'Congress issued a criminal referral related to the Jan. 6 attack.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Accountability Destruction',
    phase: 'Post-Presidency',
    date_start: '2022-12-19',
    date_end: '2022-12-19',
    keywords: ['Jan. 6 committee', 'criminal referral', 'DOJ', 'insurrection'],
    scores: makeScores({
      date_start: '2022-12-19',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Accountability Destruction',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'was referred for criminal charges by the Jan. 6 committee.'
    }),
    source: {
      url: 'https://time.com/6241365/jan-6-committee-criminal-referrals-trump/',
      title: 'Jan. 6 Committee to Refer Trump for Criminal Charges',
      publisher: 'Time'
    }
  },
  {
    entry_number: 687,
    title: 'New York AG Files Civil Fraud Lawsuit',
    synopsis: 'New York Attorney General Letitia James filed a civil fraud lawsuit accusing Trump and his company of inflating assets.',
    rationale: 'New York filed a civil fraud lawsuit over asset inflation.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2022-09-21',
    date_end: '2022-09-21',
    keywords: ['Letitia James', 'civil fraud', 'New York', 'asset inflation'],
    scores: makeScores({
      date_start: '2022-09-21',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'New York filed a civil fraud lawsuit over inflated assets.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/09/21/ny-ag-letitia-james-sues-donald-trump-organization.html',
      title: 'NY AG Letitia James sues Donald Trump, Trump Organization, family members for fraud',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 688,
    title: 'Judge Finds Trump Liable for Business Fraud',
    synopsis: 'A New York judge ruled that Trump committed fraud by overstating asset values in the civil case brought by the state attorney general.',
    rationale: 'A judge ruled Trump committed business fraud in the NY case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2023-09-26',
    date_end: '2023-09-26',
    keywords: ['summary judgment', 'civil fraud', 'New York', 'assets'],
    scores: makeScores({
      date_start: '2023-09-26',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'was found liable for business fraud in a civil case.'
    }),
    source: {
      url: 'https://www.reuters.com/world/us/judge-finds-trump-committed-fraud-in-civil-lawsuit-by-new-york-attorney-general-2023-09-26/',
      title: 'Judge finds Trump committed fraud in civil lawsuit by New York attorney general',
      publisher: 'Reuters'
    }
  },
  {
    entry_number: 689,
    title: 'New York Civil Fraud Trial Begins',
    synopsis: 'Trump’s civil fraud trial in New York began over allegations of inflating asset values.',
    rationale: 'Civil fraud trial opened over alleged asset inflation.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2023-10-02',
    date_end: '2023-10-02',
    keywords: ['civil fraud trial', 'New York', 'assets', 'Trump Organization'],
    scores: makeScores({
      date_start: '2023-10-02',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'went to trial over allegations of inflated asset values.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/10/02/trump-civil-fraud-trial-begins-in-new-york.html',
      title: 'Trump civil fraud trial begins in New York',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 690,
    title: 'Indicted in Manhattan Hush Money Case',
    synopsis: 'Trump was arraigned in Manhattan after being indicted on charges tied to hush money payments.',
    rationale: 'Indicted and arraigned on hush money charges.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2023-04-04',
    date_end: '2023-04-04',
    keywords: ['hush money', 'Manhattan', 'arraignment', 'campaign finance'],
    scores: makeScores({
      date_start: '2023-04-04',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'was arraigned in Manhattan on hush money-related charges.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/04/04/trump-pleads-not-guilty-after-arraignment-in-hush-money-case.html',
      title: 'Trump pleads not guilty after arraignment in hush money case',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 691,
    title: 'Indicted on Federal Classified Documents Charges',
    synopsis: 'A federal indictment charged Trump with retaining classified documents and obstruction in the Mar-a-Lago case.',
    rationale: 'Indicted for retaining classified documents and obstruction.',
    category: 'National Security Violations',
    subcategory: 'Classified Information Theft',
    phase: 'Post-Presidency',
    date_start: '2023-06-09',
    date_end: '2023-06-09',
    keywords: ['classified documents', 'indictment', 'Mar-a-Lago', 'obstruction'],
    scores: makeScores({
      date_start: '2023-06-09',
      category: 'National Security Violations',
      subcategory: 'Classified Information Theft',
      danger: 7,
      lawlessness: 7,
      impact_scope: 7,
      authoritarianism: 5,
      rationale_short: 'was indicted on federal classified documents charges.'
    }),
    source: {
      url: 'https://www.justice.gov/sco/pr/statement-special-counsel-jack-smith',
      title: 'Statement of Special Counsel Jack Smith',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 692,
    title: 'Indicted for 2020 Election Interference in Federal Case',
    synopsis: 'A federal grand jury indicted Trump on charges tied to efforts to overturn the 2020 election.',
    rationale: 'Indicted for federal charges related to 2020 election interference.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Election Certification Sabotage',
    phase: 'Post-Presidency',
    date_start: '2023-08-01',
    date_end: '2023-08-01',
    keywords: ['2020 election', 'indictment', 'Jan. 6', 'federal case'],
    scores: makeScores({
      date_start: '2023-08-01',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Election Certification Sabotage',
      danger: 8,
      lawlessness: 8,
      impact_scope: 7,
      authoritarianism: 6,
      rationale_short: 'was federally indicted over efforts to overturn the 2020 election.'
    }),
    source: {
      url: 'https://www.justice.gov/sco/pr/statement-special-counsel-jack-smith-0',
      title: 'Statement of Special Counsel Jack Smith',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 693,
    title: 'Indicted in Georgia Election Case',
    synopsis: 'A Georgia grand jury indicted Trump and allies in the Fulton County election interference case.',
    rationale: 'Indicted on Georgia election interference charges.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'State Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-08-14',
    date_end: '2023-08-14',
    keywords: ['Georgia', 'Fulton County', 'indictment', 'election'],
    scores: makeScores({
      date_start: '2023-08-14',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'State Election Interference',
      danger: 8,
      lawlessness: 8,
      impact_scope: 7,
      authoritarianism: 6,
      rationale_short: 'was indicted in Georgia for election interference.'
    }),
    source: {
      url: 'https://apnews.com/article/trump-georgia-indictment-fulton-county-da-willis-29279bc3f5d1a0c6f0a74a64b3e63cc6',
      title: 'Trump indicted in Georgia in election interference case',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 694,
    title: 'Ordered to Pay $83.3M in E. Jean Carroll Defamation Case',
    synopsis: 'A jury ordered Trump to pay $83.3 million in damages for defaming E. Jean Carroll.',
    rationale: 'A jury awarded major damages in the Carroll defamation case.',
    category: 'Misogyny / Sexual Misconduct',
    subcategory: 'Sexual Abuse / Defamation',
    phase: 'Post-Presidency',
    date_start: '2024-01-26',
    date_end: '2024-01-26',
    keywords: ['E. Jean Carroll', 'defamation', 'damages', 'verdict'],
    scores: makeScores({
      date_start: '2024-01-26',
      category: 'Misogyny / Sexual Misconduct',
      subcategory: 'Sexual Abuse / Defamation',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'a jury ordered $83.3 million in Carroll defamation damages.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/01/26/trump-ordered-to-pay-83point3-million-in-e-jean-carroll-defamation-case.html',
      title: 'Trump ordered to pay $83.3 million in E. Jean Carroll defamation case',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 695,
    title: 'Hit with Massive New York Civil Fraud Judgment',
    synopsis: 'A New York judge ordered Trump to pay hundreds of millions in penalties in the civil fraud case.',
    rationale: 'Judge imposed massive penalties in the NY civil fraud case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2024-02-16',
    date_end: '2024-02-16',
    keywords: ['civil fraud', 'judgment', 'New York', 'penalties'],
    scores: makeScores({
      date_start: '2024-02-16',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 3,
      rationale_short: 'a judge ordered massive penalties in the New York civil fraud case.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/02/16/judge-orders-trump-to-pay-354point9-million-in-civil-fraud-trial.html',
      title: 'Judge orders Trump to pay $354.9 million in civil fraud trial',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 696,
    title: 'Convicted in Hush Money Criminal Trial',
    synopsis: 'A jury found Trump guilty on criminal charges in the Manhattan hush money case.',
    rationale: 'Convicted on criminal charges tied to hush money payments.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'Post-Presidency',
    date_start: '2024-05-30',
    date_end: '2024-05-30',
    keywords: ['hush money', 'conviction', 'Manhattan', 'criminal trial'],
    scores: makeScores({
      date_start: '2024-05-30',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 7,
      lawlessness: 8,
      impact_scope: 7,
      authoritarianism: 5,
      rationale_short: 'was convicted on criminal charges in the hush money case.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/05/30/trump-convicted-in-hush-money-trial.html',
      title: 'Trump convicted in hush money trial',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 697,
    title: 'House Impeaches Trump for Abuse of Power and Obstruction',
    synopsis: 'The House of Representatives impeached Trump on charges of abuse of power and obstruction of Congress related to Ukraine.',
    rationale: 'Impeached by the House for abuse of power and obstruction.',
    category: 'Authoritarianism',
    subcategory: 'Abuse of Power',
    phase: 'White House 1',
    date_start: '2019-12-18',
    date_end: '2019-12-18',
    keywords: ['impeachment', 'House', 'abuse of power', 'Ukraine'],
    scores: makeScores({
      date_start: '2019-12-18',
      category: 'Authoritarianism',
      subcategory: 'Abuse of Power',
      danger: 7,
      lawlessness: 7,
      impact_scope: 7,
      authoritarianism: 6,
      rationale_short: 'was impeached by the House for abuse of power and obstruction.'
    }),
    source: {
      url: 'https://www.cbsnews.com/live-updates/trump-impeachment-vote-house-of-representatives-live-updates-2019-12-18/',
      title: 'Trump impeachment vote in the House of Representatives: Live updates',
      publisher: 'CBS News'
    }
  },
  {
    entry_number: 698,
    title: 'Senate Acquits Trump in First Impeachment Trial',
    synopsis: 'The Senate voted to acquit Trump on the first impeachment charges in the Ukraine case.',
    rationale: 'Acquitted by the Senate in the first impeachment trial.',
    category: 'Authoritarianism',
    subcategory: 'Abuse of Power',
    phase: 'White House 1',
    date_start: '2020-02-05',
    date_end: '2020-02-05',
    keywords: ['Senate', 'acquittal', 'impeachment', 'trial'],
    scores: makeScores({
      date_start: '2020-02-05',
      category: 'Authoritarianism',
      subcategory: 'Abuse of Power',
      danger: 6,
      lawlessness: 7,
      impact_scope: 6,
      authoritarianism: 5,
      rationale_short: 'was acquitted by the Senate in the first impeachment trial.'
    }),
    source: {
      url: 'https://apnews.com/article/donald-trump-ap-top-news-bills-impeachments-archive-impeachments-1b6f4438ae94776d5c3268ae0a5283b4',
      title: 'Today in History: February 5',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 699,
    title: 'House Impeaches Trump for Incitement of Insurrection',
    synopsis: 'The House impeached Trump for incitement of insurrection following the Jan. 6 attack.',
    rationale: 'Impeached by the House for incitement of insurrection.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Violent Government Overthrow and Constitutional Insurrection',
    phase: 'White House 1',
    date_start: '2021-01-13',
    date_end: '2021-01-13',
    keywords: ['impeachment', 'incitement', 'Jan. 6', 'House'],
    scores: makeScores({
      date_start: '2021-01-13',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Violent Government Overthrow and Constitutional Insurrection',
      danger: 8,
      lawlessness: 8,
      impact_scope: 7,
      authoritarianism: 6,
      rationale_short: 'was impeached for incitement of insurrection after Jan. 6.'
    }),
    source: {
      url: 'https://time.com/5927207/house-impeach-trump-second-time/',
      title: 'House Impeaches Trump for a Second Time',
      publisher: 'Time'
    }
  },
  {
    entry_number: 700,
    title: 'Senate Acquits Trump in Second Impeachment Trial',
    synopsis: 'The Senate voted to acquit Trump in the second impeachment trial after the Jan. 6 insurrection.',
    rationale: 'Acquitted by the Senate in the second impeachment trial.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Accountability Destruction',
    phase: 'Post-Presidency',
    date_start: '2021-02-13',
    date_end: '2021-02-13',
    keywords: ['Senate', 'acquittal', 'impeachment', 'Jan. 6'],
    scores: makeScores({
      date_start: '2021-02-13',
      category: 'Insurrection / Coup Attempts',
      subcategory: 'Accountability Destruction',
      danger: 7,
      lawlessness: 7,
      impact_scope: 7,
      authoritarianism: 6,
      rationale_short: 'was acquitted by the Senate after the Jan. 6 impeachment trial.'
    }),
    source: {
      url: 'https://www.axios.com/2021/02/13/trump-impeachment-acquittal',
      title: 'Trump acquitted in impeachment trial',
      publisher: 'Axios'
    }
  }
];

for (const entry of entries) {
  entry.age = calcAge(entry.date_start);
  entry.scores = entry.scores;
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
