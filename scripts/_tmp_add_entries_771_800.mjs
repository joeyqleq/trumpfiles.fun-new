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
    entry_number: 771,
    title: 'Terminates TPS for Sudan',
    synopsis: 'The Federal Register announced termination of Temporary Protected Status for Sudan, starting a wind-down for Sudanese TPS holders.',
    rationale: 'Ended humanitarian protections for Sudanese TPS beneficiaries.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-10-11',
    date_end: '2017-10-11',
    keywords: ['TPS', 'Sudan', 'termination'],
    scores: makeScores({
      date_start: '2017-10-11',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for Sudan.'
    }),
    source: {
      url: 'https://www.federalregister.gov/documents/2017/10/11/2017-22217/termination-of-the-designation-of-sudan-for-temporary-protected-status',
      title: 'Termination of the Designation of Sudan for Temporary Protected Status',
      publisher: 'Federal Register'
    }
  },
  {
    entry_number: 772,
    title: 'Terminates TPS for Honduras',
    synopsis: 'DHS announced the termination of Temporary Protected Status for Honduras, starting a wind-down period.',
    rationale: 'Ended humanitarian protections for Honduran TPS beneficiaries.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-05-04',
    date_end: '2018-05-04',
    keywords: ['TPS', 'Honduras', 'DHS'],
    scores: makeScores({
      date_start: '2018-05-04',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated Temporary Protected Status for Honduras.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2018/05/04/secretary-nielsen-announces-termination-temporary-protected-status-honduras',
      title: 'Secretary Nielsen Announces Termination of Temporary Protected Status for Honduras',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 773,
    title: 'Signs Asylum Cooperative Agreement with El Salvador',
    synopsis: 'The U.S. signed an Asylum Cooperative Agreement with El Salvador, redirecting asylum seekers to apply there.',
    rationale: 'Expanded third-country asylum arrangements to block access at the U.S. border.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-09-20',
    date_end: '2019-09-20',
    keywords: ['asylum', 'El Salvador', 'cooperative agreement'],
    scores: makeScores({
      date_start: '2019-09-20',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 5,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'signed an asylum cooperative agreement with El Salvador.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2019/09/20/us-government-signs-asylum-cooperative-agreement-el-salvador',
      title: 'U.S. Government Signs Asylum Cooperative Agreement with El Salvador',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 774,
    title: 'Signs Asylum Cooperative Agreement with Honduras',
    synopsis: 'The U.S. signed an Asylum Cooperative Agreement with Honduras, redirecting asylum seekers to apply there.',
    rationale: 'Expanded third-country asylum arrangements to block access at the U.S. border.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-09-25',
    date_end: '2019-09-25',
    keywords: ['asylum', 'Honduras', 'cooperative agreement'],
    scores: makeScores({
      date_start: '2019-09-25',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 5,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'signed an asylum cooperative agreement with Honduras.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2019/09/25/us-government-signs-asylum-cooperative-agreement-honduras',
      title: 'U.S. Government Signs Asylum Cooperative Agreement with Honduras',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 775,
    title: 'Imposes Title 42 Expulsions at the Border',
    synopsis: 'The CDC issued a Title 42 order to expel migrants and asylum seekers at the border under public health authority.',
    rationale: 'Used public health authority to block asylum access at the border.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2020-03-20',
    date_end: '2020-03-20',
    keywords: ['Title 42', 'asylum', 'CDC order'],
    scores: makeScores({
      date_start: '2020-03-20',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 6,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'ordered Title 42 expulsions to block asylum processing.'
    }),
    source: {
      url: 'https://www.cdc.gov/coronavirus/2019-ncov/order/archived-order-suspending-introduction-of-persons.html',
      title: 'Order Suspending Introduction of Persons From Countries Where a Communicable Disease Exists',
      publisher: 'Centers for Disease Control and Prevention'
    }
  },
  {
    entry_number: 776,
    title: 'Halts U.S. Funding to the WHO',
    synopsis: 'Trump announced the U.S. would halt funding to the World Health Organization during the COVID-19 pandemic.',
    rationale: 'Withdrew critical funding from the WHO during a global health emergency.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Infrastructure Destruction',
    phase: 'White House 1',
    date_start: '2020-04-14',
    date_end: '2020-04-14',
    keywords: ['WHO', 'funding halt', 'COVID-19'],
    scores: makeScores({
      date_start: '2020-04-14',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Infrastructure Destruction',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'announced a halt to U.S. funding for the WHO.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/04/14/trump-says-us-will-halt-funding-to-who-over-coronavirus-response.html',
      title: 'Trump says U.S. will halt funding to WHO over coronavirus response',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 777,
    title: 'Fires Attorney General Jeff Sessions',
    synopsis: 'Trump forced Attorney General Jeff Sessions to resign after months of pressure over the Russia probe.',
    rationale: 'Removed the attorney general amid the Russia investigation fallout.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2018-11-07',
    date_end: '2018-11-07',
    keywords: ['Jeff Sessions', 'attorney general', 'fired'],
    scores: makeScores({
      date_start: '2018-11-07',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'forced Attorney General Jeff Sessions to resign.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/11/07/jeff-sessions-resigns-as-attorney-general-at-trumps-request.html',
      title: 'Jeff Sessions resigns as attorney general at Trump’s request',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 778,
    title: 'Names Matthew Whitaker Acting Attorney General',
    synopsis: 'Trump appointed Matthew Whitaker as acting attorney general immediately after Sessions’s resignation.',
    rationale: 'Installed a loyalist to oversee the Justice Department during the Russia probe.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2018-11-07',
    date_end: '2018-11-07',
    keywords: ['Matthew Whitaker', 'acting AG', 'DOJ'],
    scores: makeScores({
      date_start: '2018-11-07',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'appointed Matthew Whitaker as acting attorney general.'
    }),
    source: {
      url: 'https://www.axios.com/2018/11/07/trump-names-matthew-whitaker-acting-attorney-general',
      title: 'Trump names Matthew Whitaker acting attorney general',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 779,
    title: 'Disbands Voter Fraud Commission After Data Grab',
    synopsis: 'Trump terminated the Presidential Advisory Commission on Election Integrity after controversy over data requests.',
    rationale: 'Shut down the voter fraud commission after aggressive voter data demands.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2018-01-03',
    date_end: '2018-01-03',
    keywords: ['voter fraud commission', 'election integrity', 'data'],
    scores: makeScores({
      date_start: '2018-01-03',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'terminated the voter fraud commission after data controversies.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/executive-order-13848-termination-executive-order-13799-establishing-presidential',
      title: 'Executive Order 13848—Termination of Executive Order 13799',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 780,
    title: 'Boasts “My Nuclear Button Is Bigger”',
    synopsis: 'Trump tweeted a nuclear threat to North Korea, boasting about the size of his “nuclear button.”',
    rationale: 'Issued a reckless nuclear threat on social media.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Threats / Incitement',
    phase: 'White House 1',
    date_start: '2018-01-02',
    date_end: '2018-01-02',
    keywords: ['nuclear button', 'North Korea', 'tweet'],
    scores: makeScores({
      date_start: '2018-01-02',
      category: 'Violent Rhetoric / Threats',
      subcategory: 'Threats / Incitement',
      danger: 5,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'boasted online about a bigger nuclear button.'
    }),
    source: {
      url: 'https://time.com/5081353/trump-kim-jong-un-nuclear-button/',
      title: "Trump Just Countered Kim Jong Un's ‘Nuclear Button’ Threat With His Own ‘Button’ Tweet",
      publisher: 'TIME'
    }
  },
  {
    entry_number: 781,
    title: 'Rolls Back Obama-Era Cuba Opening',
    synopsis: 'Trump announced a rollback of the Obama-era opening toward Cuba, tightening travel and business rules.',
    rationale: 'Reversed U.S. engagement policy with Cuba and tightened restrictions.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-06-16',
    date_end: '2017-06-16',
    keywords: ['Cuba', 'policy rollback', 'travel restrictions'],
    scores: makeScores({
      date_start: '2017-06-16',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 3,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'announced a rollback of the Obama-era Cuba opening.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-policy-united-states-towards-cuba/',
      title: 'Remarks by President Trump on the Policy of the United States Towards Cuba',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 782,
    title: 'Threatens Mexico with Tariffs Over Migration',
    synopsis: 'Trump announced plans to impose tariffs on all Mexican goods unless Mexico stopped migration across the border.',
    rationale: 'Used tariff threats to coerce Mexico on migration enforcement.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2019-05-30',
    date_end: '2019-05-30',
    keywords: ['Mexico', 'tariffs', 'migration'],
    scores: makeScores({
      date_start: '2019-05-30',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'threatened tariffs on Mexico over migration.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/05/30/trump-says-us-will-impose-tariff-on-all-mexican-goods-until-immigration-problem-solved.html',
      title: 'Trump says U.S. will impose tariff on all Mexican goods until immigration problem solved',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 783,
    title: 'Revokes John Brennan’s Security Clearance',
    synopsis: 'The White House announced it was revoking former CIA Director John Brennan’s security clearance.',
    rationale: 'Used security clearance revocations to punish critics.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2018-08-15',
    date_end: '2018-08-15',
    keywords: ['John Brennan', 'security clearance', 'retaliation'],
    scores: makeScores({
      date_start: '2018-08-15',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'revoked John Brennan’s security clearance.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/08/15/trump-revokes-john-brennans-security-clearance.html',
      title: 'Trump revokes John Brennan’s security clearance',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 784,
    title: 'Supreme Court Allows Transgender Military Ban',
    synopsis: 'The Supreme Court allowed Trump’s transgender military ban to take effect while legal challenges continued.',
    rationale: 'Cleared the way for a discriminatory military ban to be implemented.',
    category: 'Human Rights Violations',
    subcategory: 'Transgender Identity Criminalization',
    phase: 'White House 1',
    date_start: '2019-01-22',
    date_end: '2019-01-22',
    keywords: ['transgender', 'military ban', 'Supreme Court'],
    scores: makeScores({
      date_start: '2019-01-22',
      category: 'Human Rights Violations',
      subcategory: 'Transgender Identity Criminalization',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'the Supreme Court allowed the transgender military ban to take effect.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2019/jan/22/supreme-court-allows-trump-transgender-military-ban',
      title: 'Supreme court allows Trump transgender military ban to take effect',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 785,
    title: 'Pentagon Transgender Military Ban Takes Effect',
    synopsis: 'The Defense Department’s transgender military policy took effect, sharply restricting service and enlistment.',
    rationale: 'Implemented the ban restricting transgender military service.',
    category: 'Human Rights Violations',
    subcategory: 'Transgender Identity Criminalization',
    phase: 'White House 1',
    date_start: '2019-04-12',
    date_end: '2019-04-12',
    keywords: ['transgender', 'military policy', 'Pentagon'],
    scores: makeScores({
      date_start: '2019-04-12',
      category: 'Human Rights Violations',
      subcategory: 'Transgender Identity Criminalization',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'the Pentagon’s transgender military ban took effect.'
    }),
    source: {
      url: 'https://www.military.com/daily-news/2019/04/12/new-pentagon-transgender-enlistment-ban-takes-effect.html',
      title: 'New Pentagon Transgender Enlistment Ban Takes Effect',
      publisher: 'Military.com'
    }
  },
  {
    entry_number: 786,
    title: 'Pardons Charles Kushner',
    synopsis: 'Trump granted a pardon to Charles Kushner, Jared Kushner’s father, who had been convicted of fraud and tax crimes.',
    rationale: 'Granted clemency to a family member convicted of serious crimes.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-23',
    date_end: '2020-12-23',
    keywords: ['Charles Kushner', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2020-12-23',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'pardoned Charles Kushner.'
    }),
    source: clemencySource
  },
  {
    entry_number: 787,
    title: 'Pardons Elliott Broidy',
    synopsis: 'Trump pardoned Elliott Broidy, a former fundraiser who had pleaded guilty in a foreign lobbying case.',
    rationale: 'Issued a political pardon to a convicted fundraiser.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Elliott Broidy', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 5,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'pardoned Elliott Broidy.'
    }),
    source: clemencySource
  },
  {
    entry_number: 788,
    title: 'Commutes Sentence of Kwame Kilpatrick',
    synopsis: 'Trump commuted the sentence of former Detroit Mayor Kwame Kilpatrick, convicted of corruption.',
    rationale: 'Granted clemency to a public corruption convict.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Kwame Kilpatrick', 'commutation', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'commuted the sentence of Kwame Kilpatrick.'
    }),
    source: clemencySource
  },
  {
    entry_number: 789,
    title: 'Pardons Lil Wayne',
    synopsis: 'Trump pardoned rapper Lil Wayne after a federal gun case.',
    rationale: 'Issued high-profile clemency in a federal gun case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Lil Wayne', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Lil Wayne.'
    }),
    source: clemencySource
  },
  {
    entry_number: 790,
    title: 'Commutes Sentence of Kodak Black',
    synopsis: 'Trump commuted the sentence of rapper Kodak Black in a federal case.',
    rationale: 'Granted clemency in a high-profile federal case.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Kodak Black', 'commutation', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'commuted Kodak Black’s sentence.'
    }),
    source: clemencySource
  },
  {
    entry_number: 791,
    title: 'Pardons Albert J. Pirro Jr.',
    synopsis: 'Trump pardoned Albert J. Pirro Jr., who had been convicted of tax crimes.',
    rationale: 'Issued a pardon to a politically connected ally.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Albert Pirro', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Albert J. Pirro Jr.'
    }),
    source: clemencySource
  },
  {
    entry_number: 792,
    title: 'Pardons Ken Kurson',
    synopsis: 'Trump pardoned Ken Kurson, a friend of Jared Kushner who had been charged with cyberstalking.',
    rationale: 'Issued a pardon for a politically connected associate.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Ken Kurson', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Ken Kurson.'
    }),
    source: clemencySource
  },
  {
    entry_number: 793,
    title: 'Signs Bill Allowing States to Defund Planned Parenthood',
    synopsis: 'Trump signed a bill letting states withhold federal family-planning funds from Planned Parenthood.',
    rationale: 'Enabled states to cut off Planned Parenthood from Title X funding.',
    category: 'Human Rights Violations',
    subcategory: 'Reproductive Healthcare Funding Elimination',
    phase: 'White House 1',
    date_start: '2017-04-13',
    date_end: '2017-04-13',
    keywords: ['Planned Parenthood', 'Title X', 'defund'],
    scores: makeScores({
      date_start: '2017-04-13',
      category: 'Human Rights Violations',
      subcategory: 'Reproductive Healthcare Funding Elimination',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'signed a bill allowing states to defund Planned Parenthood.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/politics/trump-signs-bill-letting-states-defund-planned-parenthood/2017/04/13/026d2be2-2045-11e7-bb59-a74ccaf1d02f_story.html',
      title: 'Trump signs bill letting states defund Planned Parenthood',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 794,
    title: 'DOJ Limits Federal Police Consent Decrees',
    synopsis: 'Attorney General Jeff Sessions issued a memo restricting DOJ use of consent decrees with police departments.',
    rationale: 'Curtailed federal oversight of police departments through consent decrees.',
    category: 'Human Rights Violations',
    subcategory: 'Police Militarization and Law Enforcement Weaponization',
    phase: 'White House 1',
    date_start: '2017-03-31',
    date_end: '2017-03-31',
    keywords: ['DOJ', 'consent decrees', 'police oversight'],
    scores: makeScores({
      date_start: '2017-03-31',
      category: 'Human Rights Violations',
      subcategory: 'Police Militarization and Law Enforcement Weaponization',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'limited DOJ consent decrees for police departments.'
    }),
    source: {
      url: 'https://www.justice.gov/opa/press-release/file/954916/download',
      title: 'Memorandum on Principles and Procedures for Civil Consent Decrees and Settlement Agreements',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 795,
    title: 'Decertifies the Iran Nuclear Deal',
    synopsis: 'Trump announced he would not certify Iran’s compliance with the JCPOA to Congress.',
    rationale: 'Undermined the Iran nuclear deal by refusing to certify compliance.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2017-10-13',
    date_end: '2017-10-13',
    keywords: ['JCPOA', 'Iran deal', 'decertification'],
    scores: makeScores({
      date_start: '2017-10-13',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'refused to certify Iran’s compliance with the JCPOA.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/10/13/trump-says-iran-deal-not-in-national-interest-decertifies-agreement.html',
      title: 'Trump says Iran deal not in national interest, decertifies agreement',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 796,
    title: 'NYT Reports Trump Paid $750 in Federal Income Tax',
    synopsis: 'The New York Times reported Trump paid $750 in federal income taxes in 2016 and 2017.',
    rationale: 'Tax reporting revealed minimal federal income tax payments while claiming large losses.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2020-09-27',
    date_end: '2020-09-27',
    keywords: ['tax returns', 'NYT', 'federal income tax'],
    scores: makeScores({
      date_start: '2020-09-27',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'reports showed Trump paid $750 in federal income taxes in 2016 and 2017.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/09/27/nyt-trump-paid-750-in-federal-income-tax-in-2016-and-2017.html',
      title: 'NYT: Trump paid $750 in federal income tax in 2016 and 2017',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 797,
    title: 'House Committee Releases Trump Tax Returns',
    synopsis: 'The House Ways and Means Committee released six years of Trump’s tax returns after a long legal fight.',
    rationale: 'Tax returns were released after years of stonewalling and litigation.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Post-Presidency',
    date_start: '2022-12-30',
    date_end: '2022-12-30',
    keywords: ['tax returns', 'Ways and Means', 'release'],
    scores: makeScores({
      date_start: '2022-12-30',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 3,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'Congress released Trump’s tax returns after prolonged obstruction.'
    }),
    source: {
      url: 'https://www.pbs.org/newshour/politics/house-ways-and-means-committee-releases-6-years-of-trump-tax-returns',
      title: 'House Ways and Means Committee releases 6 years of Trump tax returns',
      publisher: 'PBS NewsHour'
    }
  },
  {
    entry_number: 798,
    title: 'Says He Wants the Economy Reopened by Easter',
    synopsis: 'Trump said he wanted the U.S. economy reopened by Easter despite COVID-19 risks.',
    rationale: 'Pushed to reopen the economy early in the pandemic.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
    phase: 'White House 1',
    date_start: '2020-03-24',
    date_end: '2020-03-24',
    keywords: ['COVID-19', 'Easter', 'reopen'],
    scores: makeScores({
      date_start: '2020-03-24',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'pushed to reopen the economy by Easter despite pandemic risks.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/03/24/trump-says-he-wants-america-back-open-by-easter.html',
      title: 'Trump says he wants America back open by Easter',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 799,
    title: 'Ends DED for Liberians with One-Year Wind-Down',
    synopsis: 'Trump ordered termination of Deferred Enforced Departure (DED) for Liberians with a one-year wind-down period.',
    rationale: 'Ended DED protections for Liberians and set a wind-down toward removal.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-03-27',
    date_end: '2018-03-27',
    keywords: ['DED', 'Liberia', 'wind-down'],
    scores: makeScores({
      date_start: '2018-03-27',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated DED for Liberians with a wind-down period.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-secretary-state-secretary-homeland-security/',
      title: 'Presidential Memorandum for the Secretary of State and the Secretary of Homeland Security',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 800,
    title: 'Sessions Restricts Asylum for Domestic Violence and Gang Victims',
    synopsis: 'Attorney General Jeff Sessions issued a decision narrowing asylum eligibility for domestic violence and gang violence survivors.',
    rationale: 'Restricted asylum protections for victims of domestic and gang violence.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2018-06-11',
    date_end: '2018-06-11',
    keywords: ['asylum', 'domestic violence', 'Matter of A-B-'],
    scores: makeScores({
      date_start: '2018-06-11',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 5,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'restricted asylum protections for domestic and gang violence survivors.'
    }),
    source: {
      url: 'https://www.texastribune.org/2018/06/11/attorney-general-sessions-limits-asylum-protections-domestic-violence-gang-violence/',
      title: 'Sessions limits asylum protections for domestic, gang violence victims',
      publisher: 'The Texas Tribune'
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
