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
    entry_number: 741,
    title: 'Calls for Muslim Immigration Ban',
    synopsis: 'Trump issued a campaign statement calling for a total shutdown of Muslims entering the United States.',
    rationale: 'Called for a blanket ban on Muslim immigration.',
    category: 'Racism / Discrimination',
    subcategory: 'Anti-Muslim Policy',
    phase: 'Campaign Trail',
    date_start: '2015-12-07',
    date_end: '2015-12-07',
    keywords: ['Muslim ban', 'campaign statement', 'immigration'],
    scores: makeScores({
      date_start: '2015-12-07',
      category: 'Racism / Discrimination',
      subcategory: 'Anti-Muslim Policy',
      danger: 6,
      lawlessness: 4,
      impact_scope: 6,
      authoritarianism: 5,
      rationale_short: 'called for a blanket ban on Muslim immigration.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/statement-donald-j-trump-statement-preventing-muslim-immigration',
      title: 'Statement by Donald J. Trump on Preventing Muslim Immigration',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 742,
    title: 'Trump Tower Meeting for Russian Dirt',
    synopsis: 'Senior campaign figures met with a Russian lawyer at Trump Tower after being offered damaging information on Hillary Clinton.',
    rationale: 'Campaign officials sought foreign-sourced opposition research from Russia.',
    category: 'Election Interference',
    subcategory: 'Foreign Interference Solicitation',
    phase: 'Campaign Trail',
    date_start: '2016-06-09',
    date_end: '2016-06-09',
    keywords: ['Trump Tower meeting', 'Russia', 'opposition research'],
    scores: makeScores({
      date_start: '2016-06-09',
      category: 'Election Interference',
      subcategory: 'Foreign Interference Solicitation',
      danger: 5,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'campaign officials sought opposition research from a Russian source.'
    }),
    source: {
      url: 'https://www.intelligence.senate.gov/sites/default/files/documents/report_volume5.pdf',
      title: 'Report on Russian Active Measures Campaigns and Interference in the 2016 U.S. Election, Volume 5',
      publisher: 'U.S. Senate Select Committee on Intelligence'
    }
  },
  {
    entry_number: 743,
    title: "Says 'Russia, if you're listening'",
    synopsis: 'At a press conference, Trump publicly urged Russia to find Clinton email files.',
    rationale: 'Publicly solicited Russian interference in the election.',
    category: 'Election Interference',
    subcategory: 'Foreign Interference Solicitation',
    phase: 'Campaign Trail',
    date_start: '2016-07-27',
    date_end: '2016-07-27',
    keywords: ['Russia if youre listening', 'emails', 'election'],
    scores: makeScores({
      date_start: '2016-07-27',
      category: 'Election Interference',
      subcategory: 'Foreign Interference Solicitation',
      danger: 5,
      lawlessness: 6,
      impact_scope: 6,
      authoritarianism: 4,
      rationale_short: 'publicly urged Russia to obtain Clinton emails.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/news-conference-doral-florida',
      title: 'News Conference in Doral, Florida',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 744,
    title: 'NY AG Orders Trump Foundation to Stop Fundraising',
    synopsis: 'New Yorks attorney general ordered the Trump Foundation to stop soliciting donations for failing to comply with state charity laws.',
    rationale: 'Foundation was barred from fundraising over legal compliance failures.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Charity Fraud and Illegal Political Donations',
    phase: 'Campaign Trail',
    date_start: '2016-10-03',
    date_end: '2016-10-03',
    keywords: ['Trump Foundation', 'New York AG', 'fundraising'],
    scores: makeScores({
      date_start: '2016-10-03',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Charity Fraud and Illegal Political Donations',
      danger: 3,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'the foundation was ordered to stop fundraising by New York regulators.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2016/oct/03/donald-trump-foundation-donations-new-york',
      title: 'New York attorney general orders Trump Foundation to stop fundraising',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 745,
    title: 'Doubles Mar-a-Lago Membership Fee After Election',
    synopsis: 'After winning the election, Trump doubled Mar-a-Lago membership fees, raising conflict of interest concerns.',
    rationale: 'Raised fees at a personal business while entering office.',
    category: 'Corruption',
    subcategory: 'Conflict of Interest',
    phase: 'Presidential Transition',
    date_start: '2017-01-25',
    date_end: '2017-01-25',
    keywords: ['Mar-a-Lago', 'membership fee', 'conflict of interest'],
    scores: makeScores({
      date_start: '2017-01-25',
      category: 'Corruption',
      subcategory: 'Conflict of Interest',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'raised membership fees at Mar-a-Lago as he entered office.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/01/25/mar-a-lago-membership-fee-doubles-to-200000.html',
      title: 'Mar-a-Lago membership fee doubles to $200,000',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 746,
    title: 'Issues ACA Sabotage Executive Order',
    synopsis: 'Trump signed Executive Order 13765 directing agencies to minimize enforcement of ACA provisions.',
    rationale: 'Ordered agencies to weaken ACA enforcement on day one.',
    category: 'Human Rights Violations',
    subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
    phase: 'White House 1',
    date_start: '2017-01-20',
    date_end: '2017-01-20',
    keywords: ['EO 13765', 'ACA', 'healthcare'],
    scores: makeScores({
      date_start: '2017-01-20',
      category: 'Human Rights Violations',
      subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'directed agencies to reduce ACA enforcement.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/executive-order-13765-minimizing-the-economic-burden-the-patient-protection-and-affordable',
      title: 'Executive Order 13765: Minimizing the Economic Burden of the ACA',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 747,
    title: 'Presses Comey for Loyalty',
    synopsis: 'In a private dinner, Trump asked FBI Director James Comey for personal loyalty.',
    rationale: 'Sought personal loyalty from the FBI director.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2017-01-27',
    date_end: '2017-01-27',
    keywords: ['Comey', 'loyalty', 'FBI'],
    scores: makeScores({
      date_start: '2017-01-27',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 5,
      rationale_short: 'asked the FBI director for personal loyalty.'
    }),
    source: {
      url: 'https://www.intelligence.senate.gov/2017/06/01/hearings-open-hearing-former-fbi-director-james-comey/',
      title: 'Open Hearing with Former FBI Director James Comey',
      publisher: 'U.S. Senate Select Committee on Intelligence'
    }
  },
  {
    entry_number: 748,
    title: 'Pressures Comey to Publicly Clear Him',
    synopsis: 'Trump asked Comey to publicly state that he was not under investigation in the Russia probe.',
    rationale: 'Pressed the FBI director for public exoneration.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2017-03-30',
    date_end: '2017-03-30',
    keywords: ['Comey', 'under investigation', 'Russia probe'],
    scores: makeScores({
      date_start: '2017-03-30',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 5,
      rationale_short: 'pressed the FBI director to publicly clear him.'
    }),
    source: {
      url: 'https://www.intelligence.senate.gov/2017/06/01/hearings-open-hearing-former-fbi-director-james-comey/',
      title: 'Open Hearing with Former FBI Director James Comey',
      publisher: 'U.S. Senate Select Committee on Intelligence'
    }
  },
  {
    entry_number: 749,
    title: "Calls NATO 'Obsolete'",
    synopsis: 'In an interview, Trump called NATO obsolete.',
    rationale: 'Undermined U.S. alliances by branding NATO obsolete.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'Presidential Transition',
    date_start: '2017-01-15',
    date_end: '2017-01-15',
    keywords: ['NATO', 'obsolete', 'alliance'],
    scores: makeScores({
      date_start: '2017-01-15',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'called NATO obsolete in a public interview.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/01/16/germany-says-nato-concerned-about-trump-obsolete-remark.html',
      title: 'Germany says NATO concerned about Trump "obsolete" remark',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 750,
    title: 'Refuses to Endorse NATO Article 5 at Summit',
    synopsis: 'At the NATO summit in Brussels, Trump did not affirm the mutual-defense Article 5 commitment.',
    rationale: 'Withheld explicit support for NATOs mutual defense pledge.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-05-25',
    date_end: '2017-05-25',
    keywords: ['NATO', 'Article 5', 'Brussels'],
    scores: makeScores({
      date_start: '2017-05-25',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'refused to affirm NATOs Article 5 mutual defense pledge.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/05/25/trump-does-not-mention-support-for-article-5-in-nato-speech.html',
      title: 'Trump does not mention support for Article 5 in NATO speech',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 751,
    title: 'Fires U.S. Attorney Preet Bharara',
    synopsis: 'Trumps Justice Department fired U.S. Attorney Preet Bharara after he refused to resign.',
    rationale: 'Removed a prominent U.S. attorney overseeing major corruption cases.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2017-03-11',
    date_end: '2017-03-11',
    keywords: ['Preet Bharara', 'U.S. attorney', 'fired'],
    scores: makeScores({
      date_start: '2017-03-11',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'fired U.S. attorney Preet Bharara after he refused to resign.'
    }),
    source: {
      url: 'https://time.com/4699086/us-attorney-preet-bharara-fired/',
      title: 'U.S. Attorney Preet Bharara Fired After Refusing to Resign',
      publisher: 'TIME'
    }
  },
  {
    entry_number: 752,
    title: 'Rescinds DAPA Protections',
    synopsis: 'DHS rescinded the DAPA program that would have deferred deportation for parents of U.S. citizens and lawful permanent residents.',
    rationale: 'Ended planned protections for undocumented parents.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-06-15',
    date_end: '2017-06-15',
    keywords: ['DAPA', 'DHS', 'deferred action'],
    scores: makeScores({
      date_start: '2017-06-15',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'rescinded the DAPA program for undocumented parents.'
    }),
    source: {
      url: 'https://www.dhs.gov/archive/news/2017/06/15/rescission-memorandum-providing-deferred-action-parents-americans-and-lawful',
      title: 'Rescission Memorandum for DAPA',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 753,
    title: 'Says He Fired Comey Because of Russia',
    synopsis: 'In a television interview, Trump said he decided to fire FBI Director James Comey because of the Russia investigation.',
    rationale: 'Admitted firing the FBI director amid the Russia probe.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2017-05-11',
    date_end: '2017-05-11',
    keywords: ['Comey', 'NBC interview', 'Russia investigation'],
    scores: makeScores({
      date_start: '2017-05-11',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 5,
      lawlessness: 5,
      impact_scope: 5,
      authoritarianism: 5,
      rationale_short: 'said he fired Comey because of the Russia investigation.'
    }),
    source: {
      url: 'https://www.cnbc.com/2017/05/11/trump-i-was-going-to-fire-comey-regardless-of-recommendation-that-was-given-to-me.html',
      title: 'Trump says he was going to fire Comey regardless of recommendation',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 754,
    title: 'Orders McGahn to Fire Mueller',
    synopsis: 'Reports revealed Trump directed White House counsel Don McGahn to have Special Counsel Robert Mueller fired.',
    rationale: 'Sought to shut down the special counsel investigation.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2018-01-25',
    date_end: '2018-01-25',
    keywords: ['McGahn', 'Mueller', 'special counsel'],
    scores: makeScores({
      date_start: '2018-01-25',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 5,
      lawlessness: 6,
      impact_scope: 5,
      authoritarianism: 5,
      rationale_short: 'directed White House counsel to have Mueller removed.'
    }),
    source: {
      url: 'https://time.com/5113686/trump-mueller-fired-mcgahn/',
      title: 'Trump Directed McGahn to Have Mueller Fired, New York Times Reports',
      publisher: 'TIME'
    }
  },
  {
    entry_number: 755,
    title: 'Imposes Aluminum Tariffs Under Section 232',
    synopsis: 'Trump issued Proclamation 9704 imposing 10 percent tariffs on aluminum imports under Section 232.',
    rationale: 'Used national security tariffs to launch a trade war on aluminum.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2018-03-08',
    date_end: '2018-03-08',
    keywords: ['Proclamation 9704', 'aluminum tariffs', 'Section 232'],
    scores: makeScores({
      date_start: '2018-03-08',
      category: 'Foreign Policy',
      subcategory: 'Economic Warfare',
      danger: 4,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      rationale_short: 'issued Proclamation 9704 imposing aluminum tariffs.'
    }),
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/proclamation-9704-adjusting-imports-aluminum-into-the-united-states',
      title: 'Proclamation 9704: Adjusting Imports of Aluminum Into the United States',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 756,
    title: 'DOJ Urges Court to Strike the ACA',
    synopsis: 'The Trump Justice Department argued that the Affordable Care Act should be struck down in court.',
    rationale: 'Sided with a lawsuit seeking to eliminate the ACA.',
    category: 'Human Rights Violations',
    subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
    phase: 'White House 1',
    date_start: '2018-06-07',
    date_end: '2018-06-07',
    keywords: ['ACA', 'DOJ', 'lawsuit'],
    scores: makeScores({
      date_start: '2018-06-07',
      category: 'Human Rights Violations',
      subcategory: 'Social Safety Net Destruction and Vulnerable Population Abandonment',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'the DOJ urged a court to strike down the ACA.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/06/07/justice-dept-asks-judge-to-strike-down-obamacare-provisions-protecting-people-with-pre-existing-conditions.html',
      title: 'Justice Department asks judge to strike down Obamacare protections',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 757,
    title: 'Moves U.S. Embassy to Jerusalem',
    synopsis: 'The United States opened its embassy in Jerusalem, formalizing the relocation from Tel Aviv.',
    rationale: 'Carried out the embassy move to Jerusalem.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2018-05-14',
    date_end: '2018-05-14',
    keywords: ['Jerusalem', 'embassy move', 'Israel'],
    scores: makeScores({
      date_start: '2018-05-14',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'moved the U.S. embassy to Jerusalem.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-president-trump-opening-united-states-embassy-jerusalem-israel/',
      title: 'Statement by President Trump on the Opening of the U.S. Embassy in Jerusalem',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 758,
    title: 'AMI Non-Prosecution for Catch-and-Kill Scheme',
    synopsis: 'Federal prosecutors described how American Media, Inc. paid for Karen McDougal\'s story to suppress it on Trumps behalf.',
    rationale: 'Campaign benefited from a catch-and-kill scheme to hide damaging allegations.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'White House 1',
    date_start: '2018-08-21',
    date_end: '2018-08-21',
    keywords: ['AMI', 'Karen McDougal', 'catch and kill'],
    scores: makeScores({
      date_start: '2018-08-21',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'the campaign benefited from a catch-and-kill scheme.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/08/23/national-enquirer-owner-ami-given-immunity-in-probe-of-trump-hush-money-scheme.html',
      title: 'National Enquirer owner AMI given immunity in probe of Trump hush-money scheme',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 759,
    title: 'Cohen Pleads Guilty to Campaign Finance Violations',
    synopsis: 'Michael Cohen pleaded guilty to campaign finance violations tied to hush-money payments.',
    rationale: 'Hush-money payments were treated as illegal campaign contributions.',
    category: 'Election Interference',
    subcategory: 'Campaign Finance',
    phase: 'White House 1',
    date_start: '2018-08-21',
    date_end: '2018-08-21',
    keywords: ['Michael Cohen', 'campaign finance', 'hush money'],
    scores: makeScores({
      date_start: '2018-08-21',
      category: 'Election Interference',
      subcategory: 'Campaign Finance',
      danger: 4,
      lawlessness: 6,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'Cohen pleaded guilty to campaign finance violations.'
    }),
    source: {
      url: 'https://www.justice.gov/usao-sdny/pr/michael-cohen-pleads-guilty',
      title: 'Michael Cohen Pleads Guilty',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 760,
    title: 'Sends Troops to Border for Migrant Caravan',
    synopsis: 'Trump ordered active-duty troops to the southern border ahead of the migrant caravan.',
    rationale: 'Militarized the border response to asylum seekers.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2018-10-29',
    date_end: '2018-10-29',
    keywords: ['caravan', 'border troops', 'Pentagon'],
    scores: makeScores({
      date_start: '2018-10-29',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 5,
      lawlessness: 3,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'ordered active-duty troops to the southern border.'
    }),
    source: {
      url: 'https://www.washingtonpost.com/world/national-security/trump-orders-troops-to-southern-border-as-caravan-advances/2018/10/29/0cfb2a6e-db75-11e8-b732-3c72cbf131f2_story.html',
      title: 'Trump orders troops to southern border as caravan advances',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 761,
    title: 'Revokes Jim Acosta Press Pass',
    synopsis: 'The White House revoked CNN reporter Jim Acosta\'s press credentials after a contentious briefing.',
    rationale: 'Retaliated against a reporter by pulling press credentials.',
    category: 'Press Freedom',
    subcategory: 'Media Intimidation',
    phase: 'White House 1',
    date_start: '2018-11-07',
    date_end: '2018-11-07',
    keywords: ['Jim Acosta', 'press pass', 'CNN'],
    scores: makeScores({
      date_start: '2018-11-07',
      category: 'Press Freedom',
      subcategory: 'Media Intimidation',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'revoked CNN reporter Jim Acosta\'s press pass.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2018/nov/07/jim-acosta-trump-white-house-cnn-press-pass',
      title: 'White House revokes CNN reporter Jim Acosta\'s press pass',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 762,
    title: 'Trump Foundation Agrees to Dissolve After NY AG Suit',
    synopsis: 'The Trump Foundation agreed to dissolve amid a New York attorney general lawsuit alleging misuse of charitable funds.',
    rationale: 'Foundation shut down after allegations of illegal self-dealing.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Charity Fraud and Illegal Political Donations',
    phase: 'White House 1',
    date_start: '2018-12-18',
    date_end: '2018-12-18',
    keywords: ['Trump Foundation', 'NYAG', 'dissolution'],
    scores: makeScores({
      date_start: '2018-12-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Charity Fraud and Illegal Political Donations',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 2,
      rationale_short: 'agreed to dissolve the foundation amid a NYAG lawsuit.'
    }),
    source: {
      url: 'https://www.axios.com/2018/12/18/trump-foundation-to-dissolve-lawsuit-new-york-attorney-general',
      title: 'Trump Foundation to dissolve after lawsuit with New York attorney general',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 763,
    title: 'Terminates TPS for Nicaragua',
    synopsis: 'DHS announced the termination of Temporary Protected Status for Nicaragua.',
    rationale: 'Ended humanitarian protections for Nicaraguan TPS holders.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-11-06',
    date_end: '2017-11-06',
    keywords: ['TPS', 'Nicaragua', 'DHS'],
    scores: makeScores({
      date_start: '2017-11-06',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated TPS for Nicaragua.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2017/11/06/secretary-duke-announces-termination-temporary-protected-status-tps',
      title: 'Secretary Duke Announces Termination of Temporary Protected Status for Nicaragua',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 764,
    title: 'Terminates TPS for Nepal',
    synopsis: 'DHS announced the termination of Temporary Protected Status for Nepal.',
    rationale: 'Ended humanitarian protections for Nepalese TPS holders.',
    category: 'Human Rights Violations',
    subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
    phase: 'White House 1',
    date_start: '2018-04-26',
    date_end: '2018-04-26',
    keywords: ['TPS', 'Nepal', 'DHS'],
    scores: makeScores({
      date_start: '2018-04-26',
      category: 'Human Rights Violations',
      subcategory: 'Legal Immigration Status Revocation and Humanitarian Protection Elimination',
      danger: 5,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'terminated TPS for Nepal.'
    }),
    source: {
      url: 'https://www.dhs.gov/news/2018/04/26/secretary-nielsen-announces-termination-temporary-protected-status-nepal',
      title: 'Secretary Nielsen Announces Termination of Temporary Protected Status for Nepal',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 765,
    title: 'Vetoes Yemen War Powers Resolution',
    synopsis: 'Trump vetoed a bipartisan resolution to end U.S. involvement in the Yemen war.',
    rationale: 'Used veto power to keep U.S. support for the Yemen war.',
    category: 'National Security Violations',
    subcategory: 'War / Militarization',
    phase: 'White House 1',
    date_start: '2019-04-16',
    date_end: '2019-04-16',
    keywords: ['Yemen', 'War Powers', 'veto'],
    scores: makeScores({
      date_start: '2019-04-16',
      category: 'National Security Violations',
      subcategory: 'War / Militarization',
      danger: 6,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'vetoed the Yemen War Powers resolution.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/04/16/trump-vetoes-yemen-war-powers-resolution.html',
      title: 'Trump vetoes Yemen war powers resolution',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 766,
    title: 'Approves Emergency Arms Sales to Saudi and UAE',
    synopsis: 'The administration invoked an emergency to bypass Congress and approve arms sales to Saudi Arabia and the UAE.',
    rationale: 'Bypassed Congress to expedite arms sales to Gulf allies.',
    category: 'National Security Violations',
    subcategory: 'War / Militarization',
    phase: 'White House 1',
    date_start: '2019-05-24',
    date_end: '2019-05-24',
    keywords: ['arms sales', 'Saudi Arabia', 'UAE'],
    scores: makeScores({
      date_start: '2019-05-24',
      category: 'National Security Violations',
      subcategory: 'War / Militarization',
      danger: 6,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'bypassed Congress to approve emergency arms sales.'
    }),
    source: {
      url: 'https://www.iranwatch.org/news/2019/05/24/press-statement-michael-r-pompeo-emergency-notification-sale-arms-and-related',
      title: 'Press Statement: Emergency Notification of Sale of Arms and Related Support',
      publisher: 'Iran Watch'
    }
  },
  {
    entry_number: 767,
    title: 'Says He Would Accept Foreign Dirt',
    synopsis: 'In a TV interview, Trump said he would listen to foreign-sourced opposition research.',
    rationale: 'Signaled willingness to accept foreign election help.',
    category: 'Election Interference',
    subcategory: 'Foreign Interference Solicitation',
    phase: 'White House 1',
    date_start: '2019-06-12',
    date_end: '2019-06-12',
    keywords: ['foreign dirt', 'election', 'opposition research'],
    scores: makeScores({
      date_start: '2019-06-12',
      category: 'Election Interference',
      subcategory: 'Foreign Interference Solicitation',
      danger: 4,
      lawlessness: 5,
      impact_scope: 5,
      authoritarianism: 3,
      rationale_short: 'said he would accept foreign opposition research.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2019/jun/12/trump-foreign-interference-election-fbi',
      title: 'Trump says he would accept foreign election help',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 768,
    title: 'Senate Acquits Trump in First Impeachment Trial',
    synopsis: 'The Senate voted to acquit Trump in his first impeachment trial over Ukraine.',
    rationale: 'Avoided accountability for abuse-of-power and obstruction charges.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2020-02-05',
    date_end: '2020-02-05',
    keywords: ['impeachment', 'Senate acquittal', 'Ukraine'],
    scores: makeScores({
      date_start: '2020-02-05',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 5,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'the Senate voted to acquit Trump in his first impeachment trial.'
    }),
    source: {
      url: 'https://www.cbsnews.com/news/trump-impeachment-trial-senate-acquits-president-on-abuse-of-power-obstruction-of-congress-charges-2020-02-05/',
      title: 'Senate acquits Trump on abuse of power, obstruction of Congress',
      publisher: 'CBS News'
    }
  },
  {
    entry_number: 769,
    title: 'Trump Hotels Fined for Cuba Embargo Violation',
    synopsis: 'Trump Hotels and Casino Resorts paid a federal fine for violating the U.S. embargo on Cuba.',
    rationale: 'Company was fined for unauthorized business linked to Cuba.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Foreign Policy Business Conflicts',
    phase: 'Trump Organization CEO',
    date_start: '1997-04-23',
    date_end: '1997-04-23',
    keywords: ['Cuba embargo', 'Trump Hotels', 'fine'],
    scores: makeScores({
      date_start: '1997-04-23',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Foreign Policy Business Conflicts',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 1,
      rationale_short: 'Trump Hotels paid a fine for violating the Cuba embargo.'
    }),
    source: {
      url: 'https://www.cnbc.com/2015/09/30/donald-trump-hotel-casino-fined-for-cuba-embargo-violations.html',
      title: 'Donald Trump hotel-casino fined for Cuba embargo violations',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 770,
    title: 'Senate Acquits Trump in Second Impeachment Trial',
    synopsis: 'The Senate acquitted Trump in his second impeachment trial after the January 6 attack.',
    rationale: 'Avoided conviction for incitement of insurrection.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'Between Terms',
    date_start: '2021-02-13',
    date_end: '2021-02-13',
    keywords: ['impeachment', 'Senate acquittal', 'January 6'],
    scores: makeScores({
      date_start: '2021-02-13',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 6,
      lawlessness: 4,
      impact_scope: 5,
      authoritarianism: 4,
      rationale_short: 'the Senate acquitted Trump in his second impeachment trial.'
    }),
    source: {
      url: 'https://www.cbsnews.com/live-updates/trump-impeachment-trial-senate-vote-acquit-convict/',
      title: 'Senate votes to acquit Trump in second impeachment trial',
      publisher: 'CBS News'
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
