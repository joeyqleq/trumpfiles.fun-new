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
    entry_number: 587,
    title: 'Fires Acting AG Sally Yates for Refusing Travel Ban Defense',
    synopsis: 'After Sally Yates directed the Justice Department not to defend the travel ban, Trump fired the acting attorney general, triggering warnings about retaliation against DOJ independence.',
    rationale: 'Removed the acting attorney general after she refused to defend the travel ban.',
    category: 'Authoritarianism',
    subcategory: 'Government Power Abuse',
    phase: 'White House 1',
    date_start: '2017-01-30',
    date_end: '2017-01-30',
    age: 70,
    keywords: ['Sally Yates', 'travel ban', 'DOJ', 'fired'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 3,
      lawlessness: 5,
      impact_scope: 6,
      rationale_short: 'Fired the acting attorney general after she declined to defend the travel ban.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Authoritarianism: Government Power Abuse. On Jan. 30, 2017, Trump fired acting AG Sally Yates after she refused to defend the travel ban.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2017/jan/30/justice-department-trump-immigration-acting-attorney-general-sally-yates',
      title: 'Sally Yates fired by Trump after acting US attorney general defied travel ban',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 588,
    title: 'Withdraws U.S. from the Trans-Pacific Partnership',
    synopsis: 'Trump signed a memorandum directing the United States to withdraw as a signatory to the Trans-Pacific Partnership, reversing participation in the multilateral trade pact.',
    rationale: 'Pulled the U.S. from a major multilateral trade agreement on day one.',
    category: 'Foreign Policy',
    subcategory: 'Economic Warfare',
    phase: 'White House 1',
    date_start: '2017-01-23',
    date_end: '2017-01-23',
    age: 70,
    keywords: ['TPP', 'trade', 'withdrawal'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 1,
      impact_scope: 7,
      rationale_short: 'Withdrew the U.S. from the TPP, undoing a major trade pact.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Economic Warfare. On Jan. 23, 2017, Trump ordered withdrawal from the Trans-Pacific Partnership.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-regarding-withdrawal-united-states-trans-pacific-partnership-negotiations-agreement/',
      title: 'Presidential Memorandum Regarding Withdrawal of the United States from the Trans-Pacific Partnership Negotiations and Agreement',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 589,
    title: 'Revives Keystone XL Pipeline',
    synopsis: 'Trump signed a presidential memorandum inviting Keystone XL to proceed, reversing the prior halt to the cross-border oil pipeline.',
    rationale: 'Prioritized fossil fuel expansion despite environmental concerns.',
    category: 'Environmental Destruction',
    subcategory: 'Fossil Fuel Expansion and Climate Science Elimination',
    phase: 'White House 1',
    date_start: '2017-01-24',
    date_end: '2017-01-24',
    age: 70,
    keywords: ['Keystone XL', 'pipeline', 'fossil fuels'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Revived Keystone XL by presidential memorandum.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Fossil Fuel Expansion and Climate Science Elimination. On Jan. 24, 2017, Trump directed approval of the Keystone XL pipeline.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-regarding-construction-keystone-xl-pipeline/',
      title: 'Presidential Memorandum Regarding Construction of the Keystone XL Pipeline',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 590,
    title: 'Orders Dakota Access Pipeline to Proceed',
    synopsis: 'Trump signed a memorandum directing agencies to expedite review and approval of the Dakota Access Pipeline after its prior delay.',
    rationale: 'Fast-tracked the pipeline despite environmental and tribal objections.',
    category: 'Environmental Destruction',
    subcategory: 'Public Lands Resource Extraction and Environmental Protection Elimination',
    phase: 'White House 1',
    date_start: '2017-01-24',
    date_end: '2017-01-24',
    age: 70,
    keywords: ['Dakota Access', 'DAPL', 'pipeline'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Directed agencies to move forward on Dakota Access.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Environmental Destruction: Public Lands Resource Extraction and Environmental Protection Elimination. On Jan. 24, 2017, Trump ordered the Dakota Access Pipeline to proceed.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.presidency.ucsb.edu/documents/memorandum-construction-the-dakota-access-pipeline',
      title: 'Memorandum on Construction of the Dakota Access Pipeline',
      publisher: 'The American Presidency Project'
    }
  },
  {
    entry_number: 591,
    title: 'Pressures Comey to Drop Flynn Investigation',
    synopsis: 'In a private Oval Office conversation, Trump told FBI Director James Comey he hoped the bureau would let the Michael Flynn investigation go.',
    rationale: 'Sought to impede an investigation involving a close adviser.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2017-02-14',
    date_end: '2017-02-14',
    age: 70,
    keywords: ['Comey', 'Flynn', 'FBI', 'obstruction'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 2,
      lawlessness: 7,
      impact_scope: 7,
      rationale_short: 'Asked the FBI director to drop the Flynn probe.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Government Corruption: Cronyism / Obstruction. On Feb. 14, 2017, Trump asked Comey to let the Flynn investigation go.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2017/06/07/comey-will-say-trump-told-him-i-hope-you-can-let-this-go-on-flynn-investigation.html',
      title: "Comey to testify Trump requested he 'drop' Flynn investigation",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 592,
    title: 'Shares Classified Intelligence with Russian Officials',
    synopsis: 'Trump disclosed highly classified intelligence to Russian Foreign Minister Sergei Lavrov and Ambassador Sergey Kislyak in the Oval Office, alarming U.S. allies and intelligence officials.',
    rationale: 'Revealed sensitive intelligence to Russian officials, risking sources and methods.',
    category: 'National Security Violations',
    subcategory: 'Foreign Adversary Alignment',
    phase: 'White House 1',
    date_start: '2017-05-10',
    date_end: '2017-05-10',
    age: 70,
    keywords: ['Lavrov', 'Kislyak', 'classified intelligence', 'Russia'],
    scores: {
      danger: 8,
      insanity: 2,
      absurdity: 2,
      lawlessness: 6,
      impact_scope: 8,
      rationale_short: 'Shared sensitive intelligence with Russian officials in the Oval Office.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'National Security Violations: Foreign Adversary Alignment. On May 10, 2017, Trump shared highly classified intelligence with Russian officials.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.washingtonpost.com/world/national-security/trump-revealed-highly-classified-information-to-russian-foreign-minister-and-ambassador/2017/05/15/530c172a-3960-11e7-9e48-c4f199710b69_story.html',
      title: 'Trump revealed highly classified information to Russian foreign minister and ambassador',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 593,
    title: "Admits 'Russia Thing' Behind Comey Firing",
    synopsis: 'In an NBC interview, Trump said he was thinking about "this Russia thing" when he decided to fire FBI Director James Comey, undercutting the official rationale.',
    rationale: 'Linked the Comey firing to the Russia investigation in a televised interview.',
    category: 'Government Corruption',
    subcategory: 'Transparency Obstruction',
    phase: 'White House 1',
    date_start: '2017-05-11',
    date_end: '2017-05-11',
    age: 70,
    keywords: ['Lester Holt', 'Russia thing', 'Comey firing'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 5,
      impact_scope: 6,
      rationale_short: 'Said the Russia investigation factored into firing Comey.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Government Corruption: Transparency Obstruction. On May 11, 2017, Trump tied the Comey firing to the Russia investigation in an NBC interview.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.washingtonpost.com/news/politics/wp/2018/01/04/what-weve-learned-about-trumps-campaign-and-russia-since-trump-first-denied-collusion/',
      title: "What we've learned about Trump's campaign and Russia since Trump first denied collusion",
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 594,
    title: "Calls NFL Protesters 'Sons of Bitches'",
    synopsis: 'At an Alabama rally, Trump said NFL owners should fire players who knelt during the anthem, calling them "sons of bitches."',
    rationale: 'Used abusive rhetoric to encourage retaliation against peaceful protest.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Threats / Incitement',
    phase: 'White House 1',
    date_start: '2017-09-22',
    date_end: '2017-09-22',
    age: 71,
    keywords: ['NFL', 'anthem protests', 'sons of bitches'],
    scores: {
      danger: 4,
      insanity: 3,
      absurdity: 4,
      lawlessness: 2,
      impact_scope: 5,
      rationale_short: 'Urged owners to fire protesting players using abusive language.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Violent Rhetoric / Threats: Threats / Incitement. On Sept. 22, 2017, Trump urged NFL owners to fire anthem protesters and called them "sons of bitches."',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.washingtonpost.com/sports/cris-collinsworth-president-trump-should-apologize-to-nfl-players/2017/09/24/b25bf16e-c835-4cd4-95c8-3d6aaae9b566_story.html',
      title: 'Cris Collinsworth: President Trump should apologize to NFL players',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 595,
    title: 'Withdraws U.S. from UNESCO',
    synopsis: 'The State Department announced the U.S. would withdraw from UNESCO, reducing U.S. participation in the UN cultural agency.',
    rationale: 'Pulled the U.S. from a major UN organization focused on education and culture.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-10-12',
    date_end: '2017-10-12',
    age: 71,
    keywords: ['UNESCO', 'UN', 'withdrawal'],
    scores: {
      danger: 4,
      insanity: 2,
      absurdity: 2,
      lawlessness: 1,
      impact_scope: 5,
      rationale_short: 'Announced U.S. withdrawal from UNESCO.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Oct. 12, 2017, the U.S. announced withdrawal from UNESCO.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.un.org/unispal/document/the-united-states-withdraws-from-unesco-us-department-of-state-press-release/',
      title: 'The United States Withdraws From UNESCO – US Department of State Press Release',
      publisher: 'U.S. Department of State'
    }
  },
  {
    entry_number: 596,
    title: 'Pulls U.S. from Global Compact on Migration Talks',
    synopsis: 'The Trump administration withdrew the U.S. from the UN Global Compact on Migration process, rejecting the international migration framework.',
    rationale: 'Abandoned the multilateral migration compact process.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-12-03',
    date_end: '2017-12-03',
    age: 71,
    keywords: ['Global Compact', 'migration', 'UN'],
    scores: {
      danger: 4,
      insanity: 2,
      absurdity: 2,
      lawlessness: 1,
      impact_scope: 5,
      rationale_short: 'Withdrew the U.S. from UN migration compact talks.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Dec. 3, 2017, the U.S. pulled out of the UN Global Compact on Migration process.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/world/2017/dec/03/donald-trump-pulls-us-out-of-un-global-compact-on-migration',
      title: 'Donald Trump pulls US out of UN global compact on migration',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 597,
    title: "Recognizes Jerusalem as Israel's Capital",
    synopsis: 'Trump formally recognized Jerusalem as Israel\'s capital and directed the State Department to begin moving the U.S. embassy.',
    rationale: 'Unilaterally recognized Jerusalem as Israel\'s capital and ordered embassy relocation.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2017-12-06',
    date_end: '2017-12-06',
    age: 71,
    keywords: ['Jerusalem', 'embassy', 'Israel'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Recognized Jerusalem as Israel\'s capital and ordered embassy move.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Dec. 6, 2017, Trump recognized Jerusalem as Israel\'s capital and ordered the embassy move.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-president-trump-jerusalem/',
      title: 'Statement by President Trump on Jerusalem',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 598,
    title: 'FCC Repeals Net Neutrality Under Trump Appointees',
    synopsis: 'The Trump-era FCC voted to repeal the 2015 net neutrality rules, rolling back federal protections for open internet access.',
    rationale: 'Regulatory rollback favored broadband providers by ending net neutrality rules.',
    category: 'Government Corruption',
    subcategory: 'Cronyism / Obstruction',
    phase: 'White House 1',
    date_start: '2017-12-14',
    date_end: '2017-12-14',
    age: 71,
    keywords: ['net neutrality', 'FCC', 'Ajit Pai'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Trump-appointed FCC rolled back net neutrality rules.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Government Corruption: Cronyism / Obstruction. On Dec. 14, 2017, the FCC voted to repeal net neutrality rules.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.business-standard.com/article/reuters/u-s-federal-communications-commission-repeals-net-neutrality-rules-117121401689_1.html',
      title: 'U.S. Federal Communications Commission repeals net neutrality rules',
      publisher: 'Reuters'
    }
  },
  {
    entry_number: 599,
    title: 'Denies Puerto Rico Hurricane Death Toll',
    synopsis: 'Trump claimed the Hurricane Maria death toll in Puerto Rico was inflated, disputing official estimates after a major study pegged deaths near 3,000.',
    rationale: 'Disputed official disaster death toll figures instead of acknowledging the scale of loss.',
    category: 'Medical Misinformation',
    subcategory: 'Death Toll Denial',
    phase: 'White House 1',
    date_start: '2018-09-13',
    date_end: '2018-09-13',
    age: 72,
    keywords: ['Puerto Rico', 'Hurricane Maria', 'death toll'],
    scores: {
      danger: 5,
      insanity: 3,
      absurdity: 4,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Publicly disputed Puerto Rico\'s Hurricane Maria death toll.',
      authoritarianism: 3,
      credibility_risk: 2,
      rationale_detail: 'Medical Misinformation: Death Toll Denial. On Sept. 13, 2018, Trump claimed the Hurricane Maria death toll was inflated.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.theguardian.com/us-news/2018/sep/13/donald-trump-says-hurricane-maria-death-toll-number-was-made-up-by-democrats',
      title: 'Trump says Hurricane Maria death toll number was made up by Democrats',
      publisher: 'The Guardian'
    }
  },
  {
    entry_number: 600,
    title: "Launches 'Remain in Mexico' Asylum Policy",
    synopsis: 'DHS announced the Migrant Protection Protocols, requiring certain asylum seekers to wait in Mexico for their U.S. immigration proceedings.',
    rationale: 'Forced asylum seekers to remain in Mexico while their cases were processed.',
    category: 'Human Rights Violations',
    subcategory: 'Refugee and Asylum Protection System Elimination',
    phase: 'White House 1',
    date_start: '2019-01-24',
    date_end: '2019-01-24',
    age: 72,
    keywords: ['Remain in Mexico', 'MPP', 'asylum'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 2,
      lawlessness: 5,
      impact_scope: 7,
      rationale_short: 'Implemented the Migrant Protection Protocols for asylum seekers.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Refugee and Asylum Protection System Elimination. On Jan. 24, 2019, DHS launched the Migrant Protection Protocols.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.dhs.gov/archive/news/2019/01/24/migrant-protection-protocols',
      title: 'Migrant Protection Protocols',
      publisher: 'U.S. Department of Homeland Security'
    }
  },
  {
    entry_number: 601,
    title: 'Withdraws from the INF Nuclear Treaty',
    synopsis: 'Trump announced the U.S. would suspend obligations under the INF Treaty and begin the process of withdrawal, ending a major arms-control pact with Russia.',
    rationale: 'Ended a landmark nuclear arms-control treaty.',
    category: 'National Security Violations',
    subcategory: 'War / Militarization',
    phase: 'White House 1',
    date_start: '2019-02-01',
    date_end: '2019-02-01',
    age: 72,
    keywords: ['INF Treaty', 'arms control', 'Russia'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 8,
      rationale_short: 'Announced U.S. withdrawal from the INF Treaty.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'National Security Violations: War / Militarization. On Feb. 1, 2019, Trump announced withdrawal from the INF Treaty.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-president-regarding-intermediate-range-nuclear-forces-inf-treaty/',
      title: 'Statement from the President Regarding the Intermediate-Range Nuclear Forces (INF) Treaty',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 602,
    title: 'Recognizes Israeli Sovereignty over the Golan Heights',
    synopsis: 'Trump signed a proclamation recognizing the Golan Heights as part of Israel, reversing decades of U.S. policy on the disputed territory.',
    rationale: 'Unilaterally recognized Israeli sovereignty over the Golan Heights.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-03-25',
    date_end: '2019-03-25',
    age: 72,
    keywords: ['Golan Heights', 'Israel', 'proclamation'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Recognized Israeli sovereignty over the Golan Heights.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Mar. 25, 2019, Trump recognized Israeli sovereignty over the Golan Heights.',
      recency_intensity: 2
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-recognizing-golan-heights-part-state-israel/',
      title: 'Proclamation on Recognizing the Golan Heights as Part of the State of Israel',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 603,
    title: 'Orders Withdrawal from Northern Syria, Abandoning Kurdish Allies',
    synopsis: 'Trump ordered U.S. troops to withdraw from northern Syria, a move that enabled a Turkish offensive against Kurdish forces aligned with the U.S. fight against ISIS.',
    rationale: 'Abruptly pulled U.S. forces from northern Syria, weakening allied partners.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'White House 1',
    date_start: '2019-10-14',
    date_end: '2019-10-14',
    age: 73,
    keywords: ['Syria', 'Kurds', 'troop withdrawal'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 3,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Withdrew U.S. troops from northern Syria, exposing Kurdish allies.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Oct. 14, 2019, Trump ordered U.S. troops out of northern Syria.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.cnbc.com/2019/10/14/trumps-syria-withdrawal-opens-middle-east-door-to-putin.html',
      title: "Trump's Syria withdrawal opens Middle East door to Putin",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 604,
    title: "Expands 'Public Charge' Rule for Green Cards",
    synopsis: 'USCIS published the DHS final rule broadening public charge criteria, making it harder for immigrants who used public benefits to obtain permanent residency.',
    rationale: 'Expanded public charge criteria to restrict immigration eligibility.',
    category: 'Human Rights Violations',
    subcategory: 'Immigration Crackdown',
    phase: 'White House 1',
    date_start: '2019-08-14',
    date_end: '2019-08-14',
    age: 73,
    keywords: ['public charge', 'green cards', 'immigration'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 3,
      impact_scope: 6,
      rationale_short: 'Finalized a rule broadening public charge restrictions.',
      authoritarianism: 5,
      credibility_risk: 2,
      rationale_detail: 'Human Rights Violations: Immigration Crackdown. On Aug. 14, 2019, DHS issued the public charge final rule.',
      recency_intensity: 2
    },
    source: {
      url: 'https://www.uscis.gov/archive/final-rule-on-public-charge-ground-of-inadmissibility',
      title: 'Final Rule on Public Charge Ground of Inadmissibility',
      publisher: 'USCIS'
    }
  },
  {
    entry_number: 605,
    title: 'Announces U.S. Exit from Open Skies Treaty',
    synopsis: 'The Trump administration announced it would withdraw from the Open Skies Treaty, ending U.S. participation in the aerial surveillance pact.',
    rationale: 'Withdrew from another major arms-control and transparency agreement.',
    category: 'National Security Violations',
    subcategory: 'War / Militarization',
    phase: 'White House 1',
    date_start: '2020-05-21',
    date_end: '2020-05-21',
    age: 73,
    keywords: ['Open Skies', 'treaty', 'withdrawal'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 2,
      lawlessness: 2,
      impact_scope: 7,
      rationale_short: 'Announced U.S. withdrawal from the Open Skies Treaty.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'National Security Violations: War / Militarization. On May 21, 2020, the U.S. announced its exit from the Open Skies Treaty.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.cnbc.com/2020/05/21/trump-withdraws-us-from-open-skies-surveillance-treaty.html',
      title: 'Trump withdraws US from Open Skies surveillance treaty',
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 606,
    title: "Tweets 'LIBERATE' to Encourage Anti-Lockdown Protests",
    synopsis: 'Trump tweeted "LIBERATE MICHIGAN", "LIBERATE MINNESOTA", and "LIBERATE VIRGINIA", cheering protests against COVID-19 restrictions in Democratic-led states.',
    rationale: 'Encouraged unrest against state public health measures during the pandemic.',
    category: 'Violent Rhetoric / Threats',
    subcategory: 'Political Violence Incitement',
    phase: 'White House 1',
    date_start: '2020-04-17',
    date_end: '2020-04-17',
    age: 73,
    keywords: ['LIBERATE', 'COVID-19', 'protests'],
    scores: {
      danger: 5,
      insanity: 3,
      absurdity: 4,
      lawlessness: 3,
      impact_scope: 5,
      rationale_short: 'Publicly urged protests against COVID restrictions.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Violent Rhetoric / Threats: Political Violence Incitement. On Apr. 17, 2020, Trump tweeted "LIBERATE" calls to protest lockdowns.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.axios.com/2020/04/17/trump-unrest-coronavirus',
      title: 'Trump accelerates the unrest',
      publisher: 'Axios'
    }
  },
  {
    entry_number: 607,
    title: "Says He Wanted COVID Testing 'Slowed Down'",
    synopsis: 'At a Tulsa rally, Trump said he told his team to slow down COVID-19 testing, arguing that more tests meant more reported cases.',
    rationale: 'Undercut public health response by discouraging testing.',
    category: 'Medical Misinformation',
    subcategory: 'Public Health Sabotage',
    phase: 'White House 1',
    date_start: '2020-06-20',
    date_end: '2020-06-20',
    age: 74,
    keywords: ['COVID-19', 'testing', 'Tulsa rally'],
    scores: {
      danger: 6,
      insanity: 4,
      absurdity: 5,
      lawlessness: 2,
      impact_scope: 6,
      rationale_short: 'Said he wanted testing slowed to reduce case counts.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Medical Misinformation: Public Health Sabotage. On Jun. 20, 2020, Trump said he told officials to slow COVID-19 testing.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.washingtonpost.com/nation/2020/06/20/coronavirus-live-updates-us/',
      title: 'Trump tells Oklahoma rally he directed officials to slow virus testing to find fewer cases',
      publisher: 'The Washington Post'
    }
  },
  {
    entry_number: 608,
    title: 'Orders Census Apportionment Excluding Undocumented Immigrants',
    synopsis: 'Trump issued a memorandum directing that undocumented immigrants be excluded from the apportionment base following the 2020 census.',
    rationale: 'Sought to alter representation by excluding undocumented residents from apportionment.',
    category: 'Racism / Discrimination',
    subcategory: 'Census Manipulation',
    phase: 'White House 1',
    date_start: '2020-07-21',
    date_end: '2020-07-21',
    age: 74,
    keywords: ['apportionment', 'census', 'undocumented'],
    scores: {
      danger: 6,
      insanity: 2,
      absurdity: 3,
      lawlessness: 4,
      impact_scope: 7,
      rationale_short: 'Issued a memo to exclude undocumented residents from apportionment.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: Census Manipulation. On Jul. 21, 2020, Trump ordered exclusion of undocumented immigrants from apportionment data.',
      recency_intensity: 3
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/memorandum-excluding-illegal-aliens-apportionment-base-following-2020-census/',
      title: 'Memorandum on Excluding Illegal Aliens From the Apportionment Base Following the 2020 Census',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 609,
    title: 'Bans Federal Diversity Training on Race and Sex Stereotyping',
    synopsis: 'Trump signed Executive Order 13950 restricting federal diversity training and prohibiting certain concepts in federal workplaces and contracts.',
    rationale: 'Used executive power to restrict anti-racism training in government and contractors.',
    category: 'Racism / Discrimination',
    subcategory: 'DEI Program Criminalization',
    phase: 'White House 1',
    date_start: '2020-09-22',
    date_end: '2020-09-22',
    age: 74,
    keywords: ['diversity training', 'executive order', 'EO 13950'],
    scores: {
      danger: 5,
      insanity: 2,
      absurdity: 3,
      lawlessness: 3,
      impact_scope: 5,
      rationale_short: 'Signed EO 13950 restricting federal diversity training.',
      authoritarianism: 4,
      credibility_risk: 2,
      rationale_detail: 'Racism / Discrimination: DEI Program Criminalization. On Sept. 22, 2020, Trump signed EO 13950 restricting diversity training.',
      recency_intensity: 3
    },
    source: {
      url: 'https://trumpwhitehouse.archives.gov/presidential-actions/executive-order-combating-race-sex-stereotyping/',
      title: 'Executive Order on Combating Race and Sex Stereotyping',
      publisher: 'The White House'
    }
  },
  {
    entry_number: 610,
    title: 'Refuses to Commit to Peaceful Transfer of Power',
    synopsis: 'When asked if he would accept a peaceful transfer of power after the 2020 election, Trump refused to commit and blamed mail ballots.',
    rationale: 'Undermined a core democratic norm by refusing to commit to a peaceful transfer.',
    category: 'Insurrection / Coup Attempts',
    subcategory: 'Democratic Norm Destruction',
    phase: 'White House 1',
    date_start: '2020-09-23',
    date_end: '2020-09-23',
    age: 74,
    keywords: ['peaceful transfer', '2020 election', 'mail ballots'],
    scores: {
      danger: 7,
      insanity: 2,
      absurdity: 3,
      lawlessness: 5,
      impact_scope: 8,
      rationale_short: 'Refused to commit to a peaceful transfer of power.',
      authoritarianism: 7,
      credibility_risk: 2,
      rationale_detail: 'Insurrection / Coup Attempts: Democratic Norm Destruction. On Sept. 23, 2020, Trump refused to commit to a peaceful transfer of power.',
      recency_intensity: 3
    },
    source: {
      url: 'https://www.cnbc.com/2020/09/23/trump-wont-commit-to-peaceful-transfer-of-power-if-he-loses-the-election.html',
      title: "Trump won't commit to peaceful transfer of power if he loses the election",
      publisher: 'CNBC'
    }
  },
  {
    entry_number: 611,
    title: "Says He Would Let Russia Attack NATO Members Who 'Don't Pay'",
    synopsis: 'At a 2024 rally, Trump said he would encourage Russia to do whatever it wanted to NATO allies that did not meet defense spending targets.',
    rationale: 'Threatened collective defense commitments and emboldened adversaries.',
    category: 'Foreign Policy',
    subcategory: 'Authoritarian Alignment',
    phase: 'Presidential Campaign',
    date_start: '2024-02-10',
    date_end: '2024-02-10',
    age: 77,
    keywords: ['NATO', 'Russia', 'do whatever they want'],
    scores: {
      danger: 7,
      insanity: 3,
      absurdity: 3,
      lawlessness: 3,
      impact_scope: 8,
      rationale_short: 'Said he would encourage Russia to attack NATO allies who do not pay.',
      authoritarianism: 6,
      credibility_risk: 2,
      rationale_detail: 'Foreign Policy: Authoritarian Alignment. On Feb. 10, 2024, Trump said he would encourage Russia to attack delinquent NATO allies.',
      recency_intensity: 5
    },
    source: {
      url: 'https://www.cnbc.com/2024/02/11/trump-says-he-warned-nato-ally-spend-more-on-defense-or-russia-can-do-whatever-the-hell-they-want.html',
      title: 'Trump says he warned NATO ally to spend more on defense or he would encourage Russia to do whatever the hell they want',
      publisher: 'CNBC'
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
