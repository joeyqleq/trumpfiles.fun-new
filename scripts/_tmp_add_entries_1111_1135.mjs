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
    entry_number: 1111,
    title: 'Twitter Permanently Suspends Trump Account',
    synopsis: 'Twitter permanently suspended Trump’s account after the January 6 attack, citing risk of further incitement of violence.',
    rationale: 'Major platform removed Trump’s account over incitement concerns after the Capitol attack.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'White House 1',
    date_start: '2021-01-08',
    date_end: '2021-01-08',
    keywords: ['Twitter', 'ban', 'incitement', 'January 6'],
    scores: makeScores({
      date_start: '2021-01-08',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 2,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Twitter permanently suspended his account after Jan. 6 violence.'
    }),
    source: {
      url: 'https://time.com/5928170/twitter-bans-donald-trump/',
      title: 'Twitter Permanently Suspends President Donald Trump\'s Account',
      publisher: 'Time'
    }
  },
  {
    entry_number: 1112,
    title: 'Facebook and Instagram Suspend Trump Indefinitely',
    synopsis: 'Facebook and Instagram blocked Trump from posting indefinitely after the Capitol attack, citing risks to public safety.',
    rationale: 'Meta platforms suspended Trump’s access following January 6 and concerns about incitement.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'White House 1',
    date_start: '2021-01-07',
    date_end: '2021-01-07',
    keywords: ['Facebook', 'Instagram', 'suspension', 'January 6'],
    scores: makeScores({
      date_start: '2021-01-07',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 2,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Facebook and Instagram suspended him indefinitely after Jan. 6.'
    }),
    source: {
      url: 'https://www.cnbc.com/2021/01/07/facebook-will-block-trump-from-posting-for-the-remainder-of-his-term.html',
      title: 'Facebook will block Trump from posting for the remainder of his term',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1113,
    title: 'YouTube Suspends Trump Channel and Disables Comments',
    synopsis: 'YouTube suspended Trump’s channel and disabled comments after violations related to incitement concerns.',
    rationale: 'YouTube restricted his channel in response to policy violations after Jan. 6.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'White House 1',
    date_start: '2021-01-12',
    date_end: '2021-01-12',
    keywords: ['YouTube', 'suspension', 'incitement', 'January 6'],
    scores: makeScores({
      date_start: '2021-01-12',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 2,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'YouTube suspended his channel and disabled comments.'
    }),
    source: {
      url: 'https://www.cnbc.com/2021/01/12/google-suspends-trumps-youtube-account-disables-comments.html',
      title: 'YouTube suspends Trump\'s account, barring uploads and comments',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1114,
    title: 'Oversight Board Upholds Facebook Suspension',
    synopsis: 'Facebook’s Oversight Board upheld the suspension of Trump’s accounts while criticizing the indefinite nature of the penalty.',
    rationale: 'Oversight Board affirmed the suspension but required a defined penalty.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'Post-Presidency',
    date_start: '2021-05-05',
    date_end: '2021-05-05',
    keywords: ['Oversight Board', 'Facebook', 'suspension', 'decision'],
    scores: makeScores({
      date_start: '2021-05-05',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 1,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'the Oversight Board upheld the Facebook suspension decision.'
    }),
    source: {
      url: 'https://www.oversightboard.com/news/226612455899839-oversight-board-upholds-former-president-trump-s-suspension-finds-facebook-failed-to-impose-proper-penalty/',
      title: 'Oversight Board Upholds Former President Trump’s Suspension, Finds Facebook Failed to Impose Proper Penalty',
      publisher: 'Oversight Board'
    }
  },
  {
    entry_number: 1115,
    title: 'Facebook Sets Two-Year Suspension for Trump',
    synopsis: 'Meta said Trump’s suspension would last two years, with reinstatement conditioned on safety assessments.',
    rationale: 'Set a fixed suspension term after the Oversight Board decision.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'Post-Presidency',
    date_start: '2021-06-04',
    date_end: '2021-06-04',
    keywords: ['Facebook', 'two-year suspension', 'Meta', 'oversight board'],
    scores: makeScores({
      date_start: '2021-06-04',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 1,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Meta set a two-year suspension after the Oversight Board ruling.'
    }),
    source: {
      url: 'https://about.fb.com/news/2021/06/facebook-response-to-oversight-board-recommendations-trump/',
      title: 'In Response to Oversight Board, Trump Suspended for Two Years; Will Only Be Reinstated if Conditions Permit',
      publisher: 'Meta'
    }
  },
  {
    entry_number: 1116,
    title: 'Elon Musk Reinstates Trump’s Twitter Account',
    synopsis: 'Elon Musk announced Trump’s Twitter account would be reinstated after a poll on the platform.',
    rationale: 'Twitter reversed the ban and restored Trump’s account after Musk’s poll.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'Post-Presidency',
    date_start: '2022-11-19',
    date_end: '2022-11-19',
    keywords: ['Twitter', 'reinstatement', 'Musk', 'poll'],
    scores: makeScores({
      date_start: '2022-11-19',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 2,
      lawlessness: 1,
      impact_scope: 4,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'Musk reinstated Trump’s Twitter account after a poll.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/11/19/elon-musk-announces-he-will-reinstate-twitter-account-of-former-president-donald-trump.html',
      title: 'Elon Musk says he will reinstate Twitter account of former President Donald Trump after online poll',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1117,
    title: 'Meta Announces Trump Account Reinstatement',
    synopsis: 'Meta said it would restore Trump’s Facebook and Instagram accounts after the two-year suspension.',
    rationale: 'Meta ended the two-year ban and announced account restoration.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'Post-Presidency',
    date_start: '2023-01-25',
    date_end: '2023-01-25',
    keywords: ['Meta', 'Facebook', 'Instagram', 'reinstatement'],
    scores: makeScores({
      date_start: '2023-01-25',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 1,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Meta announced Trump’s accounts would be reinstated.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/01/25/facebook-will-reinstate-trump-after-two-year-ban.html',
      title: 'Facebook and Instagram will reinstate Trump after two-year ban',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1118,
    title: 'YouTube Lifts Trump Account Restrictions',
    synopsis: 'YouTube lifted restrictions on Trump’s channel, allowing new uploads after the post–Jan. 6 suspension.',
    rationale: 'YouTube restored posting access to Trump’s channel after a two-year restriction.',
    category: 'Social Media',
    subcategory: 'Communication Chaos',
    phase: 'Post-Presidency',
    date_start: '2023-03-17',
    date_end: '2023-03-17',
    keywords: ['YouTube', 'reinstatement', 'restrictions lifted'],
    scores: makeScores({
      date_start: '2023-03-17',
      category: 'Social Media',
      subcategory: 'Communication Chaos',
      danger: 1,
      lawlessness: 1,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'YouTube lifted restrictions and restored uploads.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/03/17/trump-youtube-account-restrictions-lifted.html',
      title: 'Trump YouTube account restrictions lifted',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1119,
    title: 'Ordered to Pay $2 Million in Trump Foundation Case',
    synopsis: 'A judge ordered Trump to pay $2 million to settle a lawsuit alleging misuse of Trump Foundation funds.',
    rationale: 'Court ordered a settlement payment for charity misuse tied to the foundation.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Charity Fraud and Illegal Political Donations',
    phase: 'White House 1',
    date_start: '2019-11-07',
    date_end: '2019-11-07',
    keywords: ['Trump Foundation', 'settlement', 'charity misuse'],
    scores: makeScores({
      date_start: '2019-11-07',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Charity Fraud and Illegal Political Donations',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'was ordered to pay $2 million over foundation misuse.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/11/07/trump-ordered-to-pay-2-million-to-settle-trump-foundation-suit.html',
      title: 'Trump ordered to pay $2 million to settle Trump Foundation suit',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1120,
    title: 'Trump Organization Criminal Tax Fraud Trial Begins',
    synopsis: 'The Trump Organization’s criminal tax fraud trial began in New York over alleged compensation schemes.',
    rationale: 'Company faced criminal trial over long-running tax fraud allegations.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Federal Tax Fraud and Inheritance Schemes',
    phase: 'Post-Presidency',
    date_start: '2022-10-24',
    date_end: '2022-10-24',
    keywords: ['Trump Organization', 'tax fraud', 'trial begins'],
    scores: makeScores({
      date_start: '2022-10-24',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Federal Tax Fraud and Inheritance Schemes',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'the Trump Organization criminal tax fraud trial began.'
    }),
    source: {
      url: 'https://time.com/6223424/trump-organization-trial-charges/',
      title: "The Trump Organization's Tax-Fraud Trial Is Starting. Here's What's at Stake",
      publisher: 'Time'
    }
  },
  {
    entry_number: 1121,
    title: 'Engoron Issues Gag Order in Civil Fraud Trial',
    synopsis: 'Judge Arthur Engoron issued a gag order after Trump posted a disparaging comment about the judge’s law clerk.',
    rationale: 'Court restricted public attacks on staff following Trump’s post.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'Post-Presidency',
    date_start: '2023-10-03',
    date_end: '2023-10-03',
    keywords: ['gag order', 'Engoron', 'law clerk', 'civil fraud trial'],
    scores: makeScores({
      date_start: '2023-10-03',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 2,
      lawlessness: 2,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'a judge imposed a gag order after Trump attacked court staff.'
    }),
    source: {
      url: 'https://apnews.com/article/371675a2482c1de01f516f29b5a43d33',
      title: 'New York judge issues limited gag order after Trump sends disparaging post about court clerk',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1122,
    title: 'Fined $10,000 for Second Gag Order Violation',
    synopsis: 'Judge Engoron fined Trump $10,000 for a second violation of the civil fraud trial gag order.',
    rationale: 'Court sanctioned Trump for repeated gag order violations.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'Post-Presidency',
    date_start: '2023-10-25',
    date_end: '2023-10-25',
    keywords: ['gag order', 'fine', 'civil fraud trial'],
    scores: makeScores({
      date_start: '2023-10-25',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 2,
      lawlessness: 3,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'was fined $10,000 for a second gag order violation.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/10/25/trump-fraud-trial-michael-cohen-testifies-in-fraud-trial.html',
      title: 'Trump fraud trial: Ex-president storms out, judge issues gag order fine',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1123,
    title: 'Trump Testifies in New York Civil Fraud Trial',
    synopsis: 'Trump took the witness stand in the New York civil fraud trial and sparred with the judge and attorney general.',
    rationale: 'Testimony highlighted the stakes of the civil fraud case and Trump’s defenses.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2023-11-06',
    date_end: '2023-11-06',
    keywords: ['testimony', 'civil fraud trial', 'Engoron', 'Letitia James'],
    scores: makeScores({
      date_start: '2023-11-06',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'testified in the New York civil fraud trial.'
    }),
    source: {
      url: 'https://apnews.com/article/dca74420da0f92ee9bc9caff7a92c3b2',
      title: 'Trump lashes out from the witness stand at judge, NY attorney general as he testifies in fraud trial',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1124,
    title: 'Appeals Court Temporarily Lifts Federal Gag Order',
    synopsis: 'The D.C. Circuit temporarily lifted the gag order in Trump’s federal election interference case while considering his appeal.',
    rationale: 'Federal appeals court paused speech restrictions during review.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-11-03',
    date_end: '2023-11-03',
    keywords: ['gag order', 'D.C. Circuit', 'election case', 'appeal'],
    scores: makeScores({
      date_start: '2023-11-03',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'appeals court temporarily lifted the federal gag order.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/11/03/appeals-court-temporarily-lifts-trumps-gag-order-as-he-fights-the-restrictions-on-his-speech-.html',
      title: 'Appeals court temporarily lifts Trump’s gag order as he fights the restrictions on his speech',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1125,
    title: 'Chutkan Pauses Federal Election Case Pending Immunity Appeal',
    synopsis: 'Judge Tanya Chutkan paused Trump’s federal election interference case while he appealed a ruling rejecting presidential immunity.',
    rationale: 'Case was stayed pending an immunity appeal, delaying trial timelines.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-12-13',
    date_end: '2023-12-13',
    keywords: ['immunity appeal', 'case stayed', 'Chutkan', 'federal election case'],
    scores: makeScores({
      date_start: '2023-12-13',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Chutkan paused the election case pending Trump’s immunity appeal.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/12/13/judge-pauses-trump-dc-election-case-pending-appeal.html',
      title: 'Judge pauses Trump DC election case pending appeal',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1126,
    title: 'Minnesota Supreme Court Keeps Trump on Primary Ballot',
    synopsis: 'Minnesota’s Supreme Court dismissed a challenge to bar Trump from the primary ballot under the 14th Amendment.',
    rationale: 'State court rejected an insurrection clause challenge to Trump’s primary eligibility.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-11-08',
    date_end: '2023-11-08',
    keywords: ['Minnesota', 'ballot', '14th Amendment', 'insurrection clause'],
    scores: makeScores({
      date_start: '2023-11-08',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Minnesota’s court kept Trump on the primary ballot.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/11/08/minnesota-supreme-court-dismisses-insurrection-clause-challenge-and-allows-trump-on-primary-ballot.html',
      title: 'Minnesota Supreme Court dismisses “insurrection clause” challenge and allows Trump on primary ballot',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1127,
    title: 'Michigan Supreme Court Keeps Trump on Primary Ballot',
    synopsis: 'Michigan’s Supreme Court rejected an appeal seeking to disqualify Trump from the 2024 primary ballot.',
    rationale: 'State court declined to remove Trump from the primary ballot.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2023-12-27',
    date_end: '2023-12-27',
    keywords: ['Michigan', 'ballot', 'disqualification', 'primary'],
    scores: makeScores({
      date_start: '2023-12-27',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Michigan’s court rejected an effort to disqualify Trump.'
    }),
    source: {
      url: 'https://www.cnbc.com/2023/12/27/michigan-court-rejects-appeal-to-disqualify-trump-from-2024-ballot.html',
      title: 'Michigan court rejects appeal to disqualify Trump from 2024 ballot',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1128,
    title: 'Supreme Court Agrees to Hear Trump Immunity Appeal',
    synopsis: 'The Supreme Court agreed to decide whether Trump has criminal immunity in the federal election interference case.',
    rationale: 'High court took up the presidential immunity question in the election case.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'Post-Presidency',
    date_start: '2024-02-28',
    date_end: '2024-02-28',
    keywords: ['Supreme Court', 'immunity', 'election case', 'Jack Smith'],
    scores: makeScores({
      date_start: '2024-02-28',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'the Supreme Court agreed to hear Trump’s immunity appeal.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/02/28/trump-election-case-supreme-court-will-rule-on-immunity.html',
      title: 'Trump election case: Supreme Court to hear presidential immunity claim',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1129,
    title: 'Supreme Court Sets April 25 Immunity Arguments',
    synopsis: 'The Supreme Court scheduled oral arguments on Trump’s immunity claim for April 25, pausing the election case.',
    rationale: 'High court set a hearing date for the immunity dispute.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'Post-Presidency',
    date_start: '2024-03-06',
    date_end: '2024-03-06',
    keywords: ['Supreme Court', 'immunity', 'oral arguments', 'April 25'],
    scores: makeScores({
      date_start: '2024-03-06',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'the Supreme Court scheduled April 25 arguments on immunity.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/03/06/supreme-court-will-hear-trump-presidential-immunity-argument-april-25.html',
      title: 'Supreme Court will hear Trump presidential immunity argument April 25',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1130,
    title: 'Civil Fraud Trial Closing Arguments Begin',
    synopsis: 'Closing arguments began in Trump’s New York civil fraud trial over alleged asset inflation.',
    rationale: 'The civil fraud case moved to closing arguments after months of testimony.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Real Estate Fraud Allegations',
    phase: 'Post-Presidency',
    date_start: '2024-01-11',
    date_end: '2024-01-11',
    keywords: ['civil fraud trial', 'closing arguments', 'Engoron', 'Letitia James'],
    scores: makeScores({
      date_start: '2024-01-11',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Real Estate Fraud Allegations',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 2,
      absurdity: 1,
      rationale_short: 'closing arguments began in the New York civil fraud trial.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2024/jan/11/donald-trump-fraud-trial-closing-arguments',
      title: 'Trump New York fraud trial draws to an end with closing arguments',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 1131,
    title: 'DWAC Shareholders Approve Trump Media Merger',
    synopsis: 'DWAC shareholders approved a merger with Trump Media & Technology Group, moving Truth Social toward public trading.',
    rationale: 'Shareholder vote cleared the path for the Trump Media merger.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2024-03-22',
    date_end: '2024-03-22',
    keywords: ['DWAC', 'Trump Media', 'merger', 'Truth Social'],
    scores: makeScores({
      date_start: '2024-03-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'DWAC shareholders approved the Trump Media merger.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/03/22/trump-could-net-3-billion-from-dwac-social-media-merger-vote.html',
      title: 'Trump social media merger approved by DWAC shareholders',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1132,
    title: 'Trump Asks Supreme Court to Overturn Colorado Ballot Ruling',
    synopsis: 'Trump petitioned the Supreme Court to reverse Colorado’s decision removing him from the primary ballot.',
    rationale: 'Appealed the Colorado disqualification ruling to the Supreme Court.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'Post-Presidency',
    date_start: '2024-01-03',
    date_end: '2024-01-03',
    keywords: ['Colorado', 'ballot', 'Supreme Court', 'appeal'],
    scores: makeScores({
      date_start: '2024-01-03',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 2,
      lawlessness: 2,
      impact_scope: 3,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'asked the Supreme Court to overturn Colorado’s ballot ruling.'
    }),
    source: {
      url: 'https://www.cnbc.com/2024/01/03/trump-asks-supreme-court-to-overturn-colorado-ballot-eligibility-ruling.html',
      title: 'Trump asks Supreme Court to overturn Colorado ballot eligibility ruling',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1133,
    title: 'Appeals Court Upholds Civil Fraud Gag Order',
    synopsis: 'A New York appeals court again upheld the gag order barring Trump from commenting about court staff in the civil fraud case.',
    rationale: 'Appeals court reaffirmed the gag order protecting court staff.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'Post-Presidency',
    date_start: '2024-01-09',
    date_end: '2024-01-09',
    keywords: ['appeals court', 'gag order', 'civil fraud trial'],
    scores: makeScores({
      date_start: '2024-01-09',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 2,
      lawlessness: 2,
      impact_scope: 2,
      authoritarianism: 2,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'appeals court reaffirmed the civil-fraud gag order.'
    }),
    source: {
      url: 'https://apnews.com/article/911addba1400627c13830c0207e6d2f1',
      title: 'Appeals court again upholds gag order barring Donald Trump from commenting about judge\'s staff',
      publisher: 'Associated Press'
    }
  },
  {
    entry_number: 1134,
    title: 'Truth Social Launches on Apple App Store',
    synopsis: 'Trump’s social media app Truth Social launched on Apple’s App Store but many users were waitlisted.',
    rationale: 'Truth Social debuted publicly on iOS amid heavy demand and access issues.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2022-02-21',
    date_end: '2022-02-21',
    keywords: ['Truth Social', 'App Store', 'launch', 'waitlist'],
    scores: makeScores({
      date_start: '2022-02-21',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Truth Social launched on the App Store with waitlists.'
    }),
    source: {
      url: 'https://www.cnbc.com/2022/02/21/trumps-truth-social-app-tops-downloads-on-apple-app-store.html',
      title: "Trump's Truth Social app tops downloads on Apple App Store",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 1135,
    title: 'Truth Social Approved for Google Play Store',
    synopsis: 'Truth Social became available in Google’s Play Store after earlier moderation concerns delayed approval.',
    rationale: 'App gained Android distribution after meeting Google’s content policies.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Social Media Platform Fraud',
    phase: 'Post-Presidency',
    date_start: '2022-10-12',
    date_end: '2022-10-12',
    keywords: ['Truth Social', 'Google Play', 'Android', 'approval'],
    scores: makeScores({
      date_start: '2022-10-12',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Social Media Platform Fraud',
      danger: 1,
      lawlessness: 1,
      impact_scope: 2,
      authoritarianism: 1,
      insanity: 1,
      absurdity: 1,
      rationale_short: 'Truth Social was approved for the Google Play Store.'
    }),
    source: {
      url: 'https://techcrunch.com/2022/10/12/truth-social-google-play-android/',
      title: 'Truth Social debuts in the Google Play Store',
      publisher: 'TechCrunch'
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
