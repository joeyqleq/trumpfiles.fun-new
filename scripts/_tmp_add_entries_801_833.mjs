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

const clemencyPardonsSource = {
  url: 'https://www.justice.gov/pardon/pardons-granted-president-donald-j-trump-2017-2021',
  title: 'Pardons Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

const clemencyCommutationsSource = {
  url: 'https://www.justice.gov/pardon/commutations-granted-president-donald-j-trump-2017-2021',
  title: 'Commutations Granted by President Donald J. Trump (2017-2021)',
  publisher: 'U.S. Department of Justice'
};

const whiteHouseClemencyMay2018 = {
  url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-regarding-executive-grants-clemency/',
  title: 'Statement from the Press Secretary Regarding Executive Grants of Clemency',
  publisher: 'The White House'
};

const whiteHouseClemencyFeb2020 = {
  url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-regarding-executive-grants-clemency-3/',
  title: 'Statement from the Press Secretary Regarding Executive Grants of Clemency',
  publisher: 'The White House'
};

const whiteHouseClemencyJan2021 = {
  url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-regarding-executive-grants-clemency-4/',
  title: 'Statement from the Press Secretary Regarding Executive Grants of Clemency',
  publisher: 'The White House'
};

const entries = [
  {
    entry_number: 801,
    title: 'Fires Secretary of State Rex Tillerson',
    synopsis: 'Trump fired Rex Tillerson as Secretary of State and nominated Mike Pompeo to replace him.',
    rationale: 'Removed the nation’s top diplomat amid policy clashes and instability in foreign policy leadership.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2018-03-13',
    date_end: '2018-03-13',
    keywords: ['Rex Tillerson', 'Secretary of State', 'Pompeo'],
    scores: makeScores({
      date_start: '2018-03-13',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'fired Secretary of State Rex Tillerson in a sudden leadership shake-up.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/03/13/trump-fires-tillerson-tweets-pompeo-named-secretary-of-state.html',
      title: 'Trump fires Tillerson, taps CIA Director Pompeo as Secretary of State',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 802,
    title: 'Fires FBI Deputy Director Andrew McCabe',
    synopsis: 'Trump fired FBI Deputy Director Andrew McCabe shortly before his retirement amid the Russia probe.',
    rationale: 'Removed a top FBI official amid investigations touching the White House.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2018-03-16',
    date_end: '2018-03-16',
    keywords: ['Andrew McCabe', 'FBI', 'fired'],
    scores: makeScores({
      date_start: '2018-03-16',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'fired FBI Deputy Director Andrew McCabe during the Russia investigation era.'
    }),
    source: {
      url: 'https://www.cbsnews.com/news/trump-fires-fbi-deputy-director-andrew-mccabe/',
      title: 'Trump fires FBI deputy director Andrew McCabe',
      publisher: 'CBS News'
    }
  },
  {
    entry_number: 803,
    title: 'Pardons Dwight and Steven Hammond',
    synopsis: 'Trump granted pardons to Oregon ranchers Dwight and Steven Hammond, convicted of arson on federal lands.',
    rationale: 'Issued clemency to convicted ranchers in a case tied to extremist anti-government standoffs.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2018-05-29',
    date_end: '2018-05-29',
    keywords: ['Hammond', 'pardon', 'arson'],
    scores: makeScores({
      date_start: '2018-05-29',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Dwight and Steven Hammond after their arson convictions.'
    }),
    source: whiteHouseClemencyMay2018
  },
  {
    entry_number: 804,
    title: 'Announces Withdrawal of U.S. Troops from Syria',
    synopsis: 'Trump announced he would withdraw U.S. troops from Syria, citing defeat of ISIS.',
    rationale: 'Abruptly ordered a Syria withdrawal that alarmed allies and reshaped regional security.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2018-12-19',
    date_end: '2018-12-19',
    keywords: ['Syria', 'troop withdrawal', 'ISIS'],
    scores: makeScores({
      date_start: '2018-12-19',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 4,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'announced a full withdrawal of U.S. troops from Syria.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/12/19/trump-to-withdraw-all-us-troops-from-syria.html',
      title: 'Trump to withdraw all U.S. troops from Syria',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 805,
    title: 'Defense Secretary Mattis Resigns',
    synopsis: 'Defense Secretary Jim Mattis resigned after Trump ordered a Syria troop withdrawal and clashed over alliances.',
    rationale: 'Triggered a top national security resignation over policy disputes and alliance commitments.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2018-12-20',
    date_end: '2018-12-20',
    keywords: ['Jim Mattis', 'resignation', 'Pentagon'],
    scores: makeScores({
      date_start: '2018-12-20',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 3,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'prompted Defense Secretary Jim Mattis to resign over Syria and alliance policy.'
    }),
    source: {
      url: 'https://www.cnbc.com/2018/12/20/defense-secretary-james-mattis-resigns.html',
      title: 'Defense Secretary James Mattis resigns',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 806,
    title: 'Government Shutdown Begins Over Border Wall Funding',
    synopsis: 'The federal government shut down after Trump and Congress failed to reach a deal on border wall funding.',
    rationale: 'Triggered a shutdown to pressure Congress into funding the border wall.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2018-12-22',
    date_end: '2018-12-22',
    keywords: ['shutdown', 'border wall', 'funding'],
    scores: makeScores({
      date_start: '2018-12-22',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'triggered a federal shutdown to force border wall funding.'
    }),
    source: {
      url: 'https://www.dw.com/en/us-government-shuts-down-over-border-wall-funds/a-46824770',
      title: 'US government shuts down over border wall funds',
      publisher: 'DW'
    }
  },
  {
    entry_number: 807,
    title: 'Government Shutdown Ends After 35 Days',
    synopsis: 'Trump agreed to reopen the government after the longest shutdown in U.S. history without securing wall funding.',
    rationale: 'Ended the shutdown after weeks of disruption without the demanded wall funding.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2019-01-25',
    date_end: '2019-01-25',
    keywords: ['shutdown', 'reopen government', 'border wall'],
    scores: makeScores({
      date_start: '2019-01-25',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'ended the shutdown after 35 days without wall funding.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/01/25/government-shutdown-ends-trump-to-sign-bill-ending-it.html',
      title: 'Government shutdown ends, Trump to sign bill ending it',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 808,
    title: 'Declares National Emergency for Border Wall',
    synopsis: 'Trump declared a national emergency to access funds for his border wall after Congress refused full funding.',
    rationale: 'Invoked emergency powers to bypass Congress and finance the border wall.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2019-02-15',
    date_end: '2019-02-15',
    keywords: ['national emergency', 'border wall', 'Congress'],
    scores: makeScores({
      date_start: '2019-02-15',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 4,
      lawlessness: 5,
      impact_scope: 4,
      authoritarianism: 5,
      rationale_short: 'declared a national emergency to bypass Congress for wall funds.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/02/15/trump-declares-national-emergency-to-build-border-wall.html',
      title: 'Trump declares national emergency to build border wall',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 809,
    title: 'Vetoes Resolution to End Border Emergency',
    synopsis: 'Trump vetoed a congressional resolution seeking to terminate his border wall national emergency declaration.',
    rationale: 'Overrode congressional action to keep emergency powers for border wall funding.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2019-03-15',
    date_end: '2019-03-15',
    keywords: ['veto', 'border emergency', 'Congress'],
    scores: makeScores({
      date_start: '2019-03-15',
      category: 'Authoritarianism',
      subcategory: 'Government Power Abuse',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'vetoed Congress’s resolution ending the border emergency.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/03/15/trump-vetoes-congressional-resolution-to-end-border-emergency.html',
      title: 'Trump vetoes congressional resolution to end border emergency',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 810,
    title: 'Barr Issues Mueller Report Summary Letter',
    synopsis: 'Attorney General William Barr released a summary letter of the Mueller report before the report itself was made public.',
    rationale: 'Released a short summary of the Mueller report that critics said obscured key findings.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2019-03-24',
    date_end: '2019-03-24',
    keywords: ['Barr letter', 'Mueller report', 'summary'],
    scores: makeScores({
      date_start: '2019-03-24',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'issued a short Mueller report summary that critics said misled the public.'
    }),
    source: {
      url: 'https://www.justice.gov/ag/page/file/1147981/download',
      title: 'Letter from Attorney General William P. Barr to Congressional Leaders',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 811,
    title: 'Cuts U.S. Aid to Central America',
    synopsis: 'Trump ordered an end to U.S. aid for Honduras, Guatemala, and El Salvador amid migration disputes.',
    rationale: 'Cut off aid to Central American countries as leverage over migration.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-03-30',
    date_end: '2019-03-30',
    keywords: ['aid cut', 'Central America', 'migration'],
    scores: makeScores({
      date_start: '2019-03-30',
      category: 'Human Rights Violations',
      subcategory: 'Refugee and Asylum Protection System Elimination',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'ordered an end to aid for Honduras, Guatemala, and El Salvador.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/03/30/trump-orders-end-to-aid-for-honduras-guatemala-and-el-salvador.html',
      title: 'Trump orders end to aid for Honduras, Guatemala and El Salvador',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 812,
    title: 'Threatens to Close the U.S.-Mexico Border',
    synopsis: 'Trump threatened to close the U.S.-Mexico border if Mexico did not stop migrant flows.',
    rationale: 'Threatened a full border closure as leverage over migration enforcement.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2019-04-05',
    date_end: '2019-04-05',
    keywords: ['border closure', 'Mexico', 'migration'],
    scores: makeScores({
      date_start: '2019-04-05',
      category: 'Human Rights Violations',
      subcategory: 'Immigration Crackdown',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'threatened to close the U.S.-Mexico border over migration.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/04/05/trump-says-mexico-not-doing-enough-to-stop-migrants.html',
      title: 'Trump says Mexico not doing enough to stop migrants, threatens to close border',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 813,
    title: 'Mueller Report Released with Redactions',
    synopsis: 'The Justice Department released the Mueller report in redacted form after weeks of controversy over disclosure.',
    rationale: 'Released the Mueller report only after significant redactions and resistance to full transparency.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2019-04-18',
    date_end: '2019-04-18',
    keywords: ['Mueller report', 'redactions', 'DOJ'],
    scores: makeScores({
      date_start: '2019-04-18',
      category: 'Government Corruption',
      subcategory: 'Transparency Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'released the Mueller report with extensive redactions.'
    }),
    source: {
      url: 'https://www.justice.gov/archives/sco/file/1373816/download',
      title: 'Report on the Investigation into Russian Interference in the 2016 Presidential Election',
      publisher: 'U.S. Department of Justice'
    }
  },
  {
    entry_number: 814,
    title: 'Announces Withdrawal from the Arms Trade Treaty',
    synopsis: 'Trump declared the U.S. would withdraw from the Arms Trade Treaty during an NRA event.',
    rationale: 'Pulled the U.S. out of a global arms control treaty.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-04-26',
    date_end: '2019-04-26',
    keywords: ['Arms Trade Treaty', 'withdrawal', 'NRA'],
    scores: makeScores({
      date_start: '2019-04-26',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 3,
      lawlessness: 2,
      impact_scope: 4,
      authoritarianism: 2,
      rationale_short: 'announced the U.S. would withdraw from the Arms Trade Treaty.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-president-regarding-arms-trade-treaty/',
      title: 'Statement by the President Regarding the Arms Trade Treaty',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 815,
    title: 'Pardons Michael Behenna',
    synopsis: 'Trump pardoned former Army officer Michael Behenna, convicted in a 2008 Iraq killing case.',
    rationale: 'Granted clemency in a war-crimes case, undermining military justice.',
    category: 'Human Rights Violations',
    subcategory: 'War Crime Pardons',
    phase: 'White House 1',
    date_start: '2019-05-06',
    date_end: '2019-05-06',
    keywords: ['Michael Behenna', 'pardon', 'Iraq'],
    scores: makeScores({
      date_start: '2019-05-06',
      category: 'Human Rights Violations',
      subcategory: 'War Crime Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Michael Behenna after his war-crimes conviction.'
    }),
    source: clemencyPardonsSource
  },
  {
    entry_number: 816,
    title: 'Vetoes Resolutions Blocking Saudi Arms Sales',
    synopsis: 'Trump vetoed multiple congressional resolutions aimed at stopping arms sales to Saudi Arabia and the UAE.',
    rationale: 'Used veto power to push forward controversial arms sales to Saudi Arabia.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-07-24',
    date_end: '2019-07-24',
    keywords: ['Saudi Arabia', 'arms sales', 'veto'],
    scores: makeScores({
      date_start: '2019-07-24',
      category: 'Foreign Policy',
      subcategory: 'Authoritarian Alignment',
      danger: 4,
      lawlessness: 3,
      impact_scope: 4,
      authoritarianism: 3,
      rationale_short: 'vetoed bipartisan resolutions blocking Saudi arms sales.'
    }),
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/veto-message-s-j-res-36/',
      title: 'Veto Message to the Senate for S.J. Res. 36',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 817,
    title: 'Announces DNI Dan Coats Will Leave Office',
    synopsis: 'Trump announced that Director of National Intelligence Dan Coats would depart, signaling a leadership shake-up.',
    rationale: 'Removed the nation’s top intelligence official amid public disagreements.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2019-08-07',
    date_end: '2019-08-07',
    keywords: ['Dan Coats', 'DNI', 'intelligence'],
    scores: makeScores({
      date_start: '2019-08-07',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'announced DNI Dan Coats would leave his post.'
    }),
    source: {
      url: 'https://www.cnbc.com/2019/08/07/trump-says-national-intelligence-director-dan-coats-will-leave-on-aug-15.html',
      title: 'Trump says national intelligence director Dan Coats will leave on Aug. 15',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 818,
    title: 'Pardons Edward J. DeBartolo Jr.',
    synopsis: 'Trump pardoned former San Francisco 49ers owner Edward DeBartolo Jr., who had pleaded guilty in a corruption case.',
    rationale: 'Granted clemency to a well-connected figure convicted in a corruption scandal.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Edward DeBartolo', 'pardon', 'corruption'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Edward DeBartolo Jr. for a corruption conviction.'
    }),
    source: whiteHouseClemencyFeb2020
  },
  {
    entry_number: 819,
    title: 'Commutes Sentence of Judith Negron',
    synopsis: 'Trump commuted the sentence of Judith Negron, convicted in a major Medicare fraud case.',
    rationale: 'Granted clemency to a large-scale fraud convict.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Judith Negron', 'commutation', 'Medicare fraud'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'commuted Judith Negron’s sentence in a major fraud case.'
    }),
    source: clemencyCommutationsSource
  },
  {
    entry_number: 820,
    title: 'Pardons Angela Stanton',
    synopsis: 'Trump pardoned Angela Stanton, who had been convicted of a conspiracy to transport stolen vehicles.',
    rationale: 'Issued clemency to a politically connected convict.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-02-18',
    date_end: '2020-02-18',
    keywords: ['Angela Stanton', 'pardon', 'clemency'],
    scores: makeScores({
      date_start: '2020-02-18',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned Angela Stanton after her vehicle theft conviction.'
    }),
    source: whiteHouseClemencyFeb2020
  },
  {
    entry_number: 821,
    title: 'Appoints Richard Grenell Acting DNI',
    synopsis: 'Trump appointed Richard Grenell as acting director of national intelligence, bypassing Senate confirmation.',
    rationale: 'Installed a loyalist as acting DNI without Senate confirmation.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2020-02-19',
    date_end: '2020-02-19',
    keywords: ['Richard Grenell', 'acting DNI', 'intelligence'],
    scores: makeScores({
      date_start: '2020-02-19',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'appointed Richard Grenell as acting DNI without Senate confirmation.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/02/19/trump-names-richard-grenell-acting-director-of-national-intelligence.html',
      title: 'Trump names Richard Grenell acting director of national intelligence',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 822,
    title: 'Fires Intelligence Community Inspector General',
    synopsis: 'Trump removed intelligence community inspector general Michael Atkinson, who handled the Ukraine whistleblower complaint.',
    rationale: 'Retaliated against an inspector general involved in a whistleblower case.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2020-04-03',
    date_end: '2020-04-03',
    keywords: ['Michael Atkinson', 'inspector general', 'whistleblower'],
    scores: makeScores({
      date_start: '2020-04-03',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'fired IC inspector general Michael Atkinson after the whistleblower case.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2020/apr/04/trump-fired-intelligence-community-inspector-general-michael-atkinson',
      title: 'Trump fired intelligence community inspector general Michael Atkinson',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 823,
    title: 'Removes Pentagon IG Glenn Fine from Oversight',
    synopsis: 'Trump removed Pentagon inspector general Glenn Fine from the panel overseeing pandemic relief oversight.',
    rationale: 'Blocked an inspector general from leading coronavirus oversight.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2020-04-07',
    date_end: '2020-04-07',
    keywords: ['Glenn Fine', 'inspector general', 'oversight'],
    scores: makeScores({
      date_start: '2020-04-07',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'removed Glenn Fine from a key coronavirus oversight role.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/04/07/trump-removes-pentagon-ig-glenn-fine-who-was-to-lead-coronavirus-oversight-committee.html',
      title: 'Trump removes Pentagon IG Glenn Fine, who was to lead coronavirus oversight committee',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 824,
    title: 'Fires State Department Inspector General Steve Linick',
    synopsis: 'Trump fired State Department inspector general Steve Linick amid investigations involving Secretary of State Mike Pompeo.',
    rationale: 'Removed a watchdog investigating the State Department leadership.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2020-05-15',
    date_end: '2020-05-15',
    keywords: ['Steve Linick', 'inspector general', 'State Department'],
    scores: makeScores({
      date_start: '2020-05-15',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'fired State Department IG Steve Linick amid investigations.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/05/16/trump-fires-state-department-inspector-general-steve-linick.html',
      title: 'Trump fires State Department inspector general Steve Linick',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 825,
    title: 'Says U.S. Will Designate Antifa a Terrorist Organization',
    synopsis: 'Trump tweeted that the U.S. would designate Antifa as a terrorist organization during nationwide protests.',
    rationale: 'Promised a terrorist designation for protesters amid unrest, escalating political criminalization.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Political Protest Criminalization and Terrorism Classification',
    phase: 'White House 1',
    date_start: '2020-05-31',
    date_end: '2020-05-31',
    keywords: ['Antifa', 'terrorist designation', 'protests'],
    scores: makeScores({
      date_start: '2020-05-31',
      category: 'Violent Rhetoric / Threats',
      subcategory: 'Political Protest Criminalization and Terrorism Classification',
      danger: 4,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 4,
      insanity: 3,
      absurdity: 3,
      rationale_short: 'said the U.S. would designate Antifa as a terrorist organization.'
    }),
    source: {
      url: 'https://www.axios.com/2020/05/31/trump-antifa-terrorist-organization',
      title: 'Trump says U.S. will designate Antifa a terrorist organization',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 826,
    title: 'Forces Out U.S. Attorney Geoffrey Berman',
    synopsis: 'Trump and Attorney General Barr moved to remove SDNY U.S. Attorney Geoffrey Berman, sparking a standoff.',
    rationale: 'Tried to replace a federal prosecutor overseeing sensitive investigations.',
    category: 'Government Corruption',
    subcategory: 'Legal Intimidation',
    phase: 'White House 1',
    date_start: '2020-06-19',
    date_end: '2020-06-19',
    keywords: ['Geoffrey Berman', 'SDNY', 'U.S. Attorney'],
    scores: makeScores({
      date_start: '2020-06-19',
      category: 'Government Corruption',
      subcategory: 'Legal Intimidation',
      danger: 3,
      lawlessness: 4,
      impact_scope: 3,
      authoritarianism: 4,
      rationale_short: 'attempted to remove SDNY U.S. Attorney Geoffrey Berman.'
    }),
    source: {
      url: 'https://time.com/5854875/geoffrey-berman-trump-barr/',
      title: 'Here’s What to Know About the Firing and Reinstatement of U.S. Attorney Geoffrey Berman',
      publisher: 'Time'
    }
  },
  {
    entry_number: 827,
    title: 'Deploys Federal Agents to Portland Protests',
    synopsis: 'Federal agents were deployed to Portland amid protests, drawing criticism over aggressive tactics.',
    rationale: 'Used federal law enforcement to suppress protests in Portland.',
    category: 'Human Rights Violations',
    subcategory: 'Protest Criminalization',
    phase: 'White House 1',
    date_start: '2020-07-22',
    date_end: '2020-07-22',
    keywords: ['Portland', 'federal agents', 'protests'],
    scores: makeScores({
      date_start: '2020-07-22',
      category: 'Human Rights Violations',
      subcategory: 'Protest Criminalization',
      danger: 5,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 4,
      rationale_short: 'deployed federal agents to Portland to confront protesters.'
    }),
    source: {
      url: 'https://time.com/5872732/doj-dhs-watchdogs-federal-response-portland/',
      title: 'DOJ and DHS Watchdogs Launch Investigation Into Federal Response to Portland Protests',
      publisher: 'Time'
    }
  },
  {
    entry_number: 828,
    title: 'Floats Delaying the 2020 Election',
    synopsis: 'Trump tweeted about delaying the 2020 election, prompting immediate bipartisan condemnation.',
    rationale: 'Suggested postponing a federal election, undermining democratic norms.',
    category: 'Election Interference',
    subcategory: 'Election Interference',
    phase: 'White House 1',
    date_start: '2020-07-30',
    date_end: '2020-07-30',
    keywords: ['delay election', '2020 election', 'tweet'],
    scores: makeScores({
      date_start: '2020-07-30',
      category: 'Election Interference',
      subcategory: 'Election Interference',
      danger: 4,
      lawlessness: 4,
      impact_scope: 4,
      authoritarianism: 5,
      rationale_short: 'floated delaying the 2020 election in a public tweet.'
    }),
    source: {
      url: 'https://www.cnbc.com/2020/07/30/trump-floats-delaying-election-in-tweet.html',
      title: 'Trump floats delaying election in tweet',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 829,
    title: 'Woodward Tapes Reveal Trump Downplayed COVID',
    synopsis: 'Bob Woodward’s recordings showed Trump privately acknowledged COVID-19 was deadly while publicly downplaying it.',
    rationale: 'Privately admitted the virus was deadly while publicly minimizing the threat.',
    category: 'Human Rights Violations',
    subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
    phase: 'White House 1',
    date_start: '2020-09-09',
    date_end: '2020-09-09',
    keywords: ['Woodward tapes', 'COVID-19', 'downplayed'],
    scores: makeScores({
      date_start: '2020-09-09',
      category: 'Human Rights Violations',
      subcategory: 'Public Health Sabotage and Deadly Medical Misinformation',
      danger: 5,
      lawlessness: 2,
      impact_scope: 5,
      authoritarianism: 2,
      rationale_short: 'privately acknowledged COVID-19’s deadliness while downplaying it publicly.'
    }),
    source: {
      url: 'https://www.cnn.com/2020/09/09/politics/bob-woodward-trump-coronavirus/index.html',
      title: "Woodward book: Trump said coronavirus was 'deadly' as early as February",
      publisher: 'CNN'
    }
  },
  {
    entry_number: 830,
    title: 'Fires Defense Secretary Mark Esper',
    synopsis: 'Trump fired Defense Secretary Mark Esper after the 2020 election.',
    rationale: 'Removed the defense secretary amid post-election turmoil.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2020-11-09',
    date_end: '2020-11-09',
    keywords: ['Mark Esper', 'Pentagon', 'fired'],
    scores: makeScores({
      date_start: '2020-11-09',
      category: 'Government Corruption',
      subcategory: 'Cronyism / Obstruction',
      danger: 3,
      lawlessness: 3,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'fired Defense Secretary Mark Esper after the 2020 election.'
    }),
    source: {
      url: 'https://www.theguardian.com/us-news/2020/nov/09/trump-fires-defence-secretary-mark-esper',
      title: 'Trump fires defense secretary Mark Esper',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 831,
    title: 'Commutes Sentence of Philip Esformes',
    synopsis: 'Trump commuted the sentence of Philip Esformes, convicted in a major Medicare fraud case.',
    rationale: 'Granted clemency to a convicted fraudster.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-22',
    date_end: '2020-12-22',
    keywords: ['Philip Esformes', 'commutation', 'Medicare fraud'],
    scores: makeScores({
      date_start: '2020-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'commuted Philip Esformes’s sentence in a major fraud case.'
    }),
    source: clemencyCommutationsSource
  },
  {
    entry_number: 832,
    title: 'Pardons Steve Stockman',
    synopsis: 'Trump pardoned former Rep. Steve Stockman, convicted on multiple corruption counts.',
    rationale: 'Issued clemency to a former lawmaker convicted of corruption.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'White House 1',
    date_start: '2020-12-22',
    date_end: '2020-12-22',
    keywords: ['Steve Stockman', 'pardon', 'corruption'],
    scores: makeScores({
      date_start: '2020-12-22',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned former Rep. Steve Stockman after corruption convictions.'
    }),
    source: clemencyPardonsSource
  },
  {
    entry_number: 833,
    title: 'Pardons Rick Renzi',
    synopsis: 'Trump pardoned former Rep. Rick Renzi, who had been convicted on corruption charges.',
    rationale: 'Issued clemency to a former lawmaker convicted of corruption offenses.',
    category: 'Grift / Financial Exploitation',
    subcategory: 'Corrupt Pardons',
    phase: 'Between Terms',
    date_start: '2021-01-20',
    date_end: '2021-01-20',
    keywords: ['Rick Renzi', 'pardon', 'corruption'],
    scores: makeScores({
      date_start: '2021-01-20',
      category: 'Grift / Financial Exploitation',
      subcategory: 'Corrupt Pardons',
      danger: 4,
      lawlessness: 5,
      impact_scope: 3,
      authoritarianism: 3,
      rationale_short: 'pardoned former Rep. Rick Renzi after corruption convictions.'
    }),
    source: whiteHouseClemencyJan2021
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
