import { neon } from '/home/jq/Desktop/trumpfiles.fun-new/node_modules/@neondatabase/serverless/index.mjs';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_UtmAiIbTx51q@ep-fancy-queen-aaooa4ag.westus3.azure.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

const entries = [
  {
    entry_number: 5765,
    title: "Trump Announces Candidacy With 'Mexicans Are Rapists' Speech",
    synopsis: "On June 16, 2015, Donald Trump descended Trump Tower's golden escalator to announce his presidential candidacy, immediately claiming Mexico was sending criminals, drug dealers, and rapists across the border. The speech was widely condemned as racist demagoguery, yet it galvanized a base of anti-immigration voters and set the inflammatory tone for his entire campaign. NBC, Univision, and Macy's quickly severed ties with Trump in response. Despite universal mockery from political pundits, Trump shot to the top of Republican primary polls within weeks.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2015-06-16",
    people_tags: ["Donald Trump"],
    danger: 7, authoritarianism: 6, lawlessness: 4, insanity: 7, absurdity: 8
  },
  {
    entry_number: 5766,
    title: "Trump: McCain 'Not a War Hero' Because He Was Captured",
    synopsis: "At the Family Leadership Summit in Ames, Iowa on July 18, 2015, Trump dismissed Senator John McCain's celebrated military record, saying 'He's not a war hero. He's a war hero because he was captured. I like people who weren't captured.' McCain spent over five years as a prisoner of war in Vietnam, enduring torture and refusing early release. The remarks horrified veterans groups and Republican leaders, yet Trump's poll numbers continued to rise, revealing how immune his base was to traditional political norms. McCain, who would later cast the decisive vote against repealing the ACA, died of brain cancer in 2018.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2015-07-18",
    people_tags: ["Donald Trump", "John McCain"],
    danger: 5, authoritarianism: 5, lawlessness: 3, insanity: 7, absurdity: 8
  },
  {
    entry_number: 5767,
    title: "Trump Retweets White Supremacist Fabricated Crime Statistics",
    synopsis: "On November 22, 2015, Trump retweeted a graphic from the neo-Nazi account @SeanSean252 falsely claiming that 81% of white homicide victims are killed by Black people. The actual FBI figure is approximately 15%. The tweet remained up for days even after news outlets debunked it. When confronted by Bill O'Reilly on Fox News, Trump shrugged it off saying 'Bill, am I gonna check every statistic?' The incident demonstrated Trump's willingness to amplify white supremacist content to millions of followers.",
    category: "Conspiracy Theories / Disinformation",
    phase: "Campaign 2016",
    date_start: "2015-11-22",
    people_tags: ["Donald Trump"],
    danger: 7, authoritarianism: 5, lawlessness: 3, insanity: 7, absurdity: 7
  },
  {
    entry_number: 5768,
    title: "Trump Mocks Disabled Reporter Serge Kovaleski at Rally",
    synopsis: "On November 24, 2015, at a campaign rally in Myrtle Beach, South Carolina, Trump physically mocked New York Times reporter Serge Kovaleski, flailing his arms and contorting his hands in an apparent imitation of Kovaleski's arthrogryposis, a congenital joint condition. Trump was retaliating against Kovaleski for saying he did not remember a 2001 story Trump claimed proved Muslims in New Jersey celebrated 9/11. The incident drew near-universal condemnation from disability rights organizations and was widely replayed throughout the campaign. Trump denied the mockery, insisting he had never met Kovaleski despite a paper trail of interactions.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2015-11-24",
    people_tags: ["Donald Trump", "Serge Kovaleski"],
    danger: 5, authoritarianism: 4, lawlessness: 3, insanity: 7, absurdity: 9
  },
  {
    entry_number: 5769,
    title: "Trump Calls for 'Total and Complete Shutdown' of Muslim Entry",
    synopsis: "On December 7, 2015, Trump issued a formal campaign press release calling for 'a total and complete shutdown of Muslims entering the United States until our country's representatives can figure out what the hell is going on.' The announcement was condemned by Republican rivals, leaders of both parties, and foreign governments; British and German leaders proposed banning Trump from their countries. The proposal was widely deemed unconstitutional as a religious test for entry. The policy eventually became the basis for Trump's executive order travel bans, which were upheld in a 2018 Supreme Court ruling.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2015-12-07",
    people_tags: ["Donald Trump"],
    danger: 9, authoritarianism: 9, lawlessness: 8, insanity: 7, absurdity: 6
  },
  {
    entry_number: 5770,
    title: "Trump University Civil Fraud Lawsuits Multiply",
    synopsis: "Throughout 2015 and 2016, multiple civil fraud lawsuits targeting Trump University multiplied, including a class-action suit in California and a case brought by New York Attorney General Eric Schneiderman alleging Trump University was an unlicensed educational institution that defrauded over 5,000 students of more than $40 million. Former students testified they were pressured into spending up to $35,000 for mentorship programs that delivered little value. Court documents showed Trump was personally involved in approving sales scripts and marketing materials. Instructors were hired based on their sales ability, not real estate expertise.",
    category: "Grift / Financial Exploitation",
    phase: "Campaign 2016",
    date_start: "2015-06-01",
    people_tags: ["Donald Trump", "Eric Schneiderman"],
    danger: 6, authoritarianism: 4, lawlessness: 8, insanity: 5, absurdity: 7
  },
  {
    entry_number: 5771,
    title: "Trump: Megyn Kelly Had 'Blood Coming Out of Her Wherever'",
    synopsis: "Following the August 6, 2015 Republican primary debate in which Fox News anchor Megyn Kelly challenged Trump about his history of calling women 'fat pigs, dogs, slobs, and disgusting animals,' Trump went on CNN and told Don Lemon that Kelly had 'blood coming out of her eyes, blood coming out of her wherever.' The remark was widely understood as a menstrual reference. Trump was disinvited from a subsequent RedState conservative conference. The feud with Kelly continued for months and illustrated Trump's pattern of viciously attacking women who challenged him.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2015-08-07",
    people_tags: ["Donald Trump", "Megyn Kelly"],
    danger: 5, authoritarianism: 5, lawlessness: 3, insanity: 7, absurdity: 9
  },
  {
    entry_number: 5772,
    title: "Trump Threatens to Sue Ted Cruz Over Canadian Birth",
    synopsis: "In February 2016, as Senator Ted Cruz surged in Iowa polls, Trump threatened to file a lawsuit challenging Cruz's eligibility for the presidency on the grounds that Cruz was born in Calgary, Canada. Legal scholars broadly agreed Cruz qualified as a natural-born citizen through his American mother, but Trump used the threat to destabilize Cruz's campaign and introduce public doubt. Trump had previously promoted the same 'birther' conspiracy theory against President Barack Obama for years. The tactic was part of Trump's pattern of weaponizing legal threats to suppress rivals rather than engaging on policy.",
    category: "Authoritarianism",
    phase: "Campaign 2016",
    date_start: "2016-02-12",
    people_tags: ["Donald Trump", "Ted Cruz"],
    danger: 5, authoritarianism: 6, lawlessness: 5, insanity: 6, absurdity: 7
  },
  {
    entry_number: 5773,
    title: "Paul Manafort Joins Trump Campaign, Hides Pro-Putin Ukraine Work",
    synopsis: "In March 2016, Paul Manafort was hired as Trump's campaign chairman, despite having worked for years as a political consultant for pro-Russian Ukrainian President Viktor Yanukovych and associated oligarchs, earning tens of millions of dollars. Manafort failed to register as a foreign agent as required by law. He also had deep financial ties to Russian oligarch Oleg Deripaska, to whom he reportedly offered private briefings on the Trump campaign. Manafort was convicted in 2018 on eight counts of tax and bank fraud and later pleaded guilty to additional charges including conspiracy against the United States.",
    category: "National Security Violations",
    phase: "Campaign 2016",
    date_start: "2016-03-29",
    people_tags: ["Donald Trump", "Paul Manafort", "Oleg Deripaska", "Viktor Yanukovych"],
    danger: 9, authoritarianism: 7, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5774,
    title: "Papadopoulos Told Russia Has 'Dirt' on Clinton — Campaign Stays Silent",
    synopsis: "In April 2016, George Papadopoulos, a Trump foreign policy adviser, met with Maltese professor Joseph Mifsud in London, who told him Russia possessed 'thousands' of emails containing damaging information about Hillary Clinton. Papadopoulos relayed this to Australian diplomat Alexander Downer at a London bar in May 2016. When Downer alerted Australian intelligence after the DNC hack became public, it triggered the FBI's Crossfire Hurricane investigation. Papadopoulos later pleaded guilty to lying to FBI agents about his Russia contacts and was sentenced to 14 days in prison.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-04-26",
    people_tags: ["George Papadopoulos", "Donald Trump", "Joseph Mifsud", "Alexander Downer"],
    danger: 9, authoritarianism: 6, lawlessness: 8, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5775,
    title: "Trump Sweeps Super Tuesday Amid Mounting Controversies",
    synopsis: "On March 1, 2016, Super Tuesday, Donald Trump won seven of eleven Republican primary contests, cementing his frontrunner status despite weeks of controversy including refusing to disavow KKK support, mocking a disabled reporter, proposing a Muslim ban, and near-daily inflammatory statements. His wins across states from Georgia to Massachusetts demonstrated his base was energized, not repelled, by controversy. Rival campaigns scrambled to mount a coordinated 'Stop Trump' effort. Republican establishment figures began contemplating a contested convention to deny Trump the nomination.",
    category: "Authoritarianism",
    phase: "Campaign 2016",
    date_start: "2016-03-01",
    people_tags: ["Donald Trump"],
    danger: 7, authoritarianism: 7, lawlessness: 4, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5776,
    title: "Carter Page Joins Trump Campaign — Later an FBI FISA Target",
    synopsis: "In March 2016, Carter Page joined the Trump campaign as a foreign policy adviser despite his extensive business ties to Russia and prior contact with Russian intelligence officers. In 2014, the FBI had investigated Page for contact with a Russian intelligence operative who attempted to recruit him. After Page's July 2016 trip to Moscow, the FBI obtained a FISA warrant to surveil him, believing he may have been coordinating with the Russian government. The Justice Department inspector general later found significant errors and omissions in the warrant applications, though the underlying investigation was deemed legitimately predicated.",
    category: "National Security Violations",
    phase: "Campaign 2016",
    date_start: "2016-03-21",
    people_tags: ["Donald Trump", "Carter Page"],
    danger: 8, authoritarianism: 5, lawlessness: 7, insanity: 5, absurdity: 5
  },
  {
    entry_number: 5777,
    title: "Trump Tower Meeting: Don Jr. and Manafort Meet Russian Lawyer for Clinton Dirt",
    synopsis: "On June 9, 2016, Donald Trump Jr., Jared Kushner, and Paul Manafort met in Trump Tower with Russian lawyer Natalia Veselnitskaya and others after Trump Jr. received an email promising 'official documents and information that would incriminate Hillary' as 'part of Russia and its government's support for Mr. Trump.' Trump Jr. responded, 'If it's what you say I love it.' The meeting was not disclosed to U.S. intelligence officials. Special Counsel Mueller declined to charge Trump Jr., citing difficulty proving he understood it might be illegal, but the episode provided documented evidence of willingness to accept foreign election assistance.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-06-09",
    people_tags: ["Donald Trump Jr.", "Jared Kushner", "Paul Manafort", "Natalia Veselnitskaya", "Donald Trump"],
    danger: 9, authoritarianism: 7, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5778,
    title: "Trump University Fraud 'Playbook' Released by Court Order",
    synopsis: "In June 2016, a federal judge ordered the release of Trump University's internal sales playbook, a detailed manual instructing salespeople to exploit students' financial insecurities, push them to use retirement savings, and upsell from $1,500 seminars to $35,000 'Gold Elite' packages. The playbook included scripts for overcoming objections about affordability and instructions not to let students think overnight before signing. Former instructors testified they were real estate agents with no particular expertise. The release severely damaged Trump's campaign and was used extensively by political opponents throughout the election.",
    category: "Grift / Financial Exploitation",
    phase: "Campaign 2016",
    date_start: "2016-06-01",
    people_tags: ["Donald Trump"],
    danger: 6, authoritarianism: 4, lawlessness: 8, insanity: 5, absurdity: 7
  },
  {
    entry_number: 5779,
    title: "Trump Defends Roger Ailes After Fox News Sexual Harassment Ouster",
    synopsis: "In July 2016, Fox News CEO Roger Ailes was ousted after anchor Gretchen Carlson filed a sexual harassment lawsuit against him, followed by dozens of additional women coming forward with similar allegations. Rather than condemning the behavior, Trump publicly defended Ailes, suggesting the accusers were motivated by a desire for attention and noting how much Ailes had helped them. Ailes had been a key ally in shaping Trump's favorable coverage on Fox News. Ailes died in May 2017 with multiple sexual harassment settlements on record; Fox News ultimately paid $90 million to settle related claims.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2016-07-19",
    people_tags: ["Donald Trump", "Roger Ailes", "Gretchen Carlson"],
    danger: 5, authoritarianism: 5, lawlessness: 4, insanity: 6, absurdity: 7
  },
  {
    entry_number: 5780,
    title: "Trump Attacks Gold Star Family Khan After DNC Speech",
    synopsis: "On July 28, 2016, Khizr Khan, whose son Army Captain Humayun Khan was killed in Iraq in 2004, delivered a powerful DNC speech producing a copy of the Constitution and saying Trump had 'sacrificed nothing and no one.' Trump responded by suggesting Khizr's wife Ghazala was not allowed to speak due to her religion, and claiming his business construction was a form of personal sacrifice. The attacks on a Gold Star family drew rebukes from Republican veterans including John McCain and dozens of military leaders. Ghazala Khan later wrote she was silent at the podium because of grief, not religious restriction.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2016-07-30",
    people_tags: ["Donald Trump", "Khizr Khan", "Ghazala Khan", "Humayun Khan"],
    danger: 6, authoritarianism: 6, lawlessness: 3, insanity: 7, absurdity: 8
  },
  {
    entry_number: 5781,
    title: "'Russia, If You're Listening' — Trump Invites Election Espionage",
    synopsis: "At a press conference in Doral, Florida on July 27, 2016, Donald Trump publicly called on Russia to hack Hillary Clinton's emails, saying 'Russia, if you're listening, I hope you're able to find the 30,000 emails that are missing.' According to the Mueller Report's indictment of 12 GRU officers, Russian intelligence began targeting Clinton's personal office for hacking within hours of the statement. The comment was unprecedented in American political history — a major party candidate publicly soliciting a hostile foreign power to commit espionage against a domestic rival. Trump later claimed he was 'being sarcastic.'",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-07-27",
    people_tags: ["Donald Trump"],
    danger: 10, authoritarianism: 8, lawlessness: 10, insanity: 8, absurdity: 7
  },
  {
    entry_number: 5782,
    title: "WikiLeaks Releases Hacked DNC Emails Coordinated With Russian GRU",
    synopsis: "On July 22, 2016, three days before the Democratic National Convention, WikiLeaks published approximately 20,000 emails stolen from the Democratic National Committee by Russian military intelligence (GRU Unit 26165). The release was timed to maximize convention disruption, sowing division between Clinton and Sanders supporters. The Mueller Report documented that WikiLeaks coordinated with GRU operative 'Guccifer 2.0' and that Roger Stone communicated with WikiLeaks and relayed information to the Trump campaign. Stone was convicted of witness tampering, obstruction, and false statements; Trump later commuted and then pardoned his sentence.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-07-22",
    people_tags: ["Donald Trump", "Roger Stone", "Julian Assange"],
    danger: 10, authoritarianism: 7, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5783,
    title: "Trump Foundation Used to Pay Personal Legal Bills and Buy Self-Portraits",
    synopsis: "A 2016 New York Attorney General investigation revealed that the Donald J. Trump Foundation had been used to pay at least $258,000 to settle legal disputes involving Trump's for-profit businesses, including $100,000 to settle a lawsuit over a flagpole at Mar-a-Lago and $158,000 to settle a Palm Beach legal complaint. The foundation also purchased portraits of Trump for $20,000 and $10,000 to hang in his businesses. In 2019, Trump agreed to pay $2 million in court-ordered damages to charities and dissolved the foundation after a judge found he had misused charitable funds for personal and business purposes.",
    category: "Grift / Financial Exploitation",
    phase: "Campaign 2016",
    date_start: "2016-09-01",
    people_tags: ["Donald Trump", "Eric Schneiderman"],
    danger: 6, authoritarianism: 5, lawlessness: 8, insanity: 5, absurdity: 7
  },
  {
    entry_number: 5784,
    title: "Trump Claims Election Is 'Rigged' Weeks Before Voting",
    synopsis: "Throughout October 2016, Donald Trump repeatedly claimed the upcoming election was 'rigged,' alleging widespread voter fraud, corrupt media, and establishment conspiracy without evidence. At the October 19 presidential debate, Trump refused to commit to accepting the election results, saying he would 'look at it at the time.' The statements alarmed democracy scholars, foreign observers, and Republican leaders including Paul Ryan and Condoleezza Rice. The rhetoric primed Trump's supporters to reject any outcome he lost — laying critical groundwork for his post-2020 election denial and the January 6 insurrection four years later.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-10-01",
    people_tags: ["Donald Trump"],
    danger: 10, authoritarianism: 9, lawlessness: 7, insanity: 7, absurdity: 7
  },
  {
    entry_number: 5785,
    title: "Access Hollywood Tape: 'Grab Them by the Pussy'",
    synopsis: "On October 7, 2016, The Washington Post published a 2005 Access Hollywood recording in which Trump told host Billy Bush he could sexually assault women with impunity because of his celebrity: 'When you're a star, they let you do it. You can do anything. Grab them by the pussy.' The tape prompted a cascade of Republican politicians to withdraw endorsements or call for Trump to step down from the ticket. Trump issued an apology calling it 'locker room talk' — his only notable campaign apology — then quickly pivoted to attacking Bill Clinton. Rather than ending his campaign, the tape was followed within hours by the WikiLeaks Podesta email dump.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2016-10-07",
    people_tags: ["Donald Trump", "Billy Bush"],
    danger: 7, authoritarianism: 5, lawlessness: 6, insanity: 8, absurdity: 8
  },
  {
    entry_number: 5786,
    title: "20+ Women Accuse Trump of Sexual Assault Following Access Hollywood",
    synopsis: "In the weeks after the October 7, 2016 Access Hollywood tape, more than twenty women publicly accused Donald Trump of sexual misconduct ranging from groping and forcible kissing to rape. Accusers included Jessica Leeds, who said Trump groped her on a plane in the 1980s; Natasha Stoynoff, who wrote that Trump pinned her against a wall at Mar-a-Lago; and E. Jean Carroll, who later won a 2023 civil case in which a jury found Trump liable for sexual abuse and defamation, awarding her $5 million. Trump denied all allegations and threatened to sue every accuser, though no such suits were filed before the election.",
    category: "Human Rights Violations",
    phase: "Campaign 2016",
    date_start: "2016-10-08",
    people_tags: ["Donald Trump", "E. Jean Carroll", "Jessica Leeds", "Natasha Stoynoff"],
    danger: 7, authoritarianism: 5, lawlessness: 7, insanity: 7, absurdity: 7
  },
  {
    entry_number: 5787,
    title: "WikiLeaks Podesta Dump Begins Same Hour as Access Hollywood Tape",
    synopsis: "On October 7, 2016 — the same day the Access Hollywood tape was published — WikiLeaks began releasing thousands of emails stolen from Clinton campaign chairman John Podesta, continuing daily dumps through Election Day. Intelligence officials and the Mueller Report concluded the simultaneous timing was coordinated to dominate news cycles and bury the tape story. Roger Stone, a Trump adviser, had predicted Podesta's 'time in the barrel' weeks earlier. The coordinated information operation between Russian GRU hackers and WikiLeaks represented a sophisticated foreign interference campaign directly benefiting the Trump campaign.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-10-07",
    people_tags: ["Donald Trump", "Roger Stone", "Julian Assange", "John Podesta"],
    danger: 9, authoritarianism: 6, lawlessness: 8, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5788,
    title: "Comey Letter Reopens Clinton Email Probe 11 Days Before Election",
    synopsis: "On October 28, 2016, FBI Director James Comey sent Congress a letter announcing he was reopening the investigation into Hillary Clinton's private email server after agents discovered emails on a laptop belonging to Anthony Weiner, husband of Clinton aide Huma Abedin. Comey closed the investigation again November 6, two days before the election, finding nothing new. Statistical analyses suggested the letter significantly shifted polling against Clinton in the final stretch. Former DOJ officials from both parties widely criticized the norm-breaking disclosure; Comey himself later expressed regret about the letter's electoral impact.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-10-28",
    people_tags: ["James Comey", "Hillary Clinton", "Huma Abedin", "Anthony Weiner"],
    danger: 8, authoritarianism: 6, lawlessness: 6, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5789,
    title: "Cambridge Analytica Harvests 87 Million Facebook Profiles for Trump Campaign",
    synopsis: "During the 2016 election, Cambridge Analytica — a data firm backed by Trump donor Robert Mercer and employing former Trump adviser Steve Bannon as a board member — harvested Facebook profiles of approximately 87 million users without consent through a third-party quiz app. The data was used to build psychographic profiles for targeted political advertising on behalf of the Trump campaign. Facebook did not publicly disclose the breach until 2018 after whistleblower Christopher Wylie went public. Facebook was fined $5 billion by the FTC in 2019, and Cambridge Analytica dissolved amid the scandal.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-01-01",
    people_tags: ["Donald Trump", "Steve Bannon", "Robert Mercer", "Christopher Wylie"],
    danger: 8, authoritarianism: 6, lawlessness: 8, insanity: 5, absurdity: 6
  },
  {
    entry_number: 5790,
    title: "Russian IRA Troll Farms Run Massive US Election Interference Operation",
    synopsis: "Throughout 2016, Russia's Internet Research Agency (IRA), a St. Petersburg operation funded by Kremlin-linked oligarch Yevgeny Prigozhin, deployed hundreds of operatives creating thousands of fake American social media accounts across Facebook, Twitter, Instagram, and YouTube, reaching an estimated 126 million Americans on Facebook alone. The IRA organized both pro-Trump rallies and fake progressive protests designed to suppress minority turnout. Mueller's February 2018 indictment charged 13 Russian nationals and 3 entities with conspiracy to defraud the United States. The operation constituted the most extensive foreign interference in American electoral history.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-01-01",
    people_tags: ["Donald Trump", "Yevgeny Prigozhin"],
    danger: 10, authoritarianism: 7, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5791,
    title: "Flynn Secretly Paid $530K by Turkey While Advising Trump Campaign",
    synopsis: "During the 2016 campaign and transition, retired General Michael Flynn worked as an unregistered foreign agent for Turkish government interests, ultimately earning approximately $530,000 for work that included writing a pro-Turkey op-ed published on Election Day calling for extradition of cleric Fethullah Gulen. Flynn failed to disclose these foreign payments on his security clearance application and did not register as a foreign agent until March 2017, retroactively. Flynn was also paid $45,000 by Russian state media RT for a 2015 dinner appearance seated alongside Vladimir Putin, and Trump named him as his national security adviser.",
    category: "National Security Violations",
    phase: "Campaign 2016",
    date_start: "2016-06-01",
    people_tags: ["Michael Flynn", "Donald Trump"],
    danger: 9, authoritarianism: 6, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5792,
    title: "Trump Wins Electoral College, Loses Popular Vote by 2.9 Million",
    synopsis: "On November 8, 2016, Donald Trump defeated Hillary Clinton in the Electoral College 306 to 232 despite losing the national popular vote by approximately 2.87 million votes, receiving 46.1% to Clinton's 48.2%. Trump became the fifth president in American history to win without a popular vote majority. Multiple post-election analyses found that Russian interference, the Comey letter, and Cambridge Analytica micro-targeting each contributed to the narrow margins in decisive states. Trump, who had previously called the Electoral College 'a disaster for democracy' in 2012, now celebrated it as 'genius.'",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-11-08",
    people_tags: ["Donald Trump", "Hillary Clinton"],
    danger: 8, authoritarianism: 7, lawlessness: 5, insanity: 5, absurdity: 6
  },
  {
    entry_number: 5793,
    title: "Trump University $25 Million Settlement Days After Election Win",
    synopsis: "On November 18, 2016, just ten days after his election victory, Donald Trump agreed to a $25 million settlement resolving three fraud lawsuits over Trump University, including New York AG's case and two California class actions. Trump had previously vowed never to settle, calling students' claims 'lies.' The settlement provided restitution to approximately 6,000 students who paid for Trump University programs. Trump paid without admitting wrongdoing. The timing — cases held until after the election — raised questions about how resolution might have affected voters had it occurred sooner.",
    category: "Grift / Financial Exploitation",
    phase: "Campaign 2016",
    date_start: "2016-11-18",
    people_tags: ["Donald Trump", "Eric Schneiderman"],
    danger: 6, authoritarianism: 4, lawlessness: 8, insanity: 4, absurdity: 6
  },
  {
    entry_number: 5794,
    title: "Flynn Secretly Calls Russian Ambassador to Discuss Sanctions",
    synopsis: "In late December 2016, while President Obama was imposing sanctions on Russia for its election interference, National Security Adviser-designate Michael Flynn held multiple phone calls with Russian Ambassador Sergey Kislyak in which he discussed the sanctions and implied they might be revisited under the new administration. The calls violated the Logan Act's prohibition on unauthorized citizens conducting U.S. foreign policy, and Flynn lied to FBI investigators about the conversations in January 2017. The calls were captured by U.S. intelligence surveillance of Kislyak. Flynn pleaded guilty in December 2017 to making false statements to the FBI; Trump pardoned him in November 2020.",
    category: "National Security Violations",
    phase: "Campaign 2016",
    date_start: "2016-12-22",
    people_tags: ["Michael Flynn", "Sergey Kislyak", "Donald Trump"],
    danger: 9, authoritarianism: 7, lawlessness: 9, insanity: 6, absurdity: 6
  },
  {
    entry_number: 5795,
    title: "Kushner Omits Over 100 Foreign Contacts on Security Clearance Form",
    synopsis: "When filing his SF-86 security clearance application in early 2017, Jared Kushner initially omitted all foreign contacts — over 100 — including the June 2016 Trump Tower meeting with Russian nationals, his December 2016 conversations with Ambassador Kislyak about establishing a secret back-channel to Moscow using Russian diplomatic facilities, and meetings with Russian banker Sergey Gorkov. Kushner amended his form multiple times. Career intelligence officials reportedly recommended denying his clearance, but Trump overruled them in 2018. A House oversight investigation found the White House personnel security office documented 'grave concerns' about Kushner's application.",
    category: "National Security Violations",
    phase: "Campaign 2016",
    date_start: "2017-01-18",
    people_tags: ["Jared Kushner", "Donald Trump", "Sergey Kislyak", "Sergey Gorkov"],
    danger: 9, authoritarianism: 7, lawlessness: 8, insanity: 5, absurdity: 6
  },
  {
    entry_number: 5796,
    title: "Electoral College Certified Despite Protests and Faithless Electors",
    synopsis: "On December 19, 2016, the Electoral College met in state capitals to formally cast votes, with Trump receiving 304 — two fewer than expected as two Republican electors defected. An unprecedented lobbying effort by advocacy groups had urged electors to vote their conscience; ultimately seven cast faithless votes, the most since 1872. When Congress certified the results on January 6, 2017, several Democratic House members attempted to object but could not find a Senate co-sponsor. Vice President Biden, presiding over the certification, gaveled down each objection — the same ceremony he would oversee again in January 2021.",
    category: "Election Interference",
    phase: "Campaign 2016",
    date_start: "2016-12-19",
    people_tags: ["Donald Trump", "Joe Biden"],
    danger: 7, authoritarianism: 7, lawlessness: 5, insanity: 5, absurdity: 6
  },
  {
    entry_number: 5797,
    title: "Trump Inaugural Crowd Size Lies — Spicer vs. Photographic Evidence",
    synopsis: "On January 21, 2017, the first full day of the Trump presidency, Press Secretary Sean Spicer convened an unscheduled press briefing to claim, falsely and without evidence, that Trump's inauguration drew 'the largest audience ever to witness an inauguration, period, both in person and around the globe.' Side-by-side aerial photographs, Washington Metro ridership data, and sworn testimony from National Park Service officials all contradicted the claim. The incident set the tone for four years of deliberate government disinformation and introduced the phrase 'alternative facts,' coined by adviser Kellyanne Conway when pressed on the lie by NBC's Chuck Todd.",
    category: "Conspiracy Theories / Disinformation",
    phase: "White House 1",
    date_start: "2017-01-21",
    people_tags: ["Donald Trump", "Sean Spicer", "Kellyanne Conway"],
    danger: 6, authoritarianism: 7, lawlessness: 4, insanity: 7, absurdity: 10
  },
  {
    entry_number: 5798,
    title: "Kellyanne Conway Coins 'Alternative Facts' to Defend Crowd Lies",
    synopsis: "On January 22, 2017, Kellyanne Conway appeared on NBC's Meet the Press to defend Sean Spicer's false crowd-size claims, telling host Chuck Todd that Spicer had offered 'alternative facts.' Todd replied that 'alternative facts are not facts, they are falsehoods.' The phrase instantly became a cultural touchstone for the Trump administration's relationship with truth. Conway's coinage was compared to George Orwell's doublespeak; 'Nineteen Eighty-Four' shot to the top of Amazon's bestseller list. The moment crystallized the administration's strategy of aggressive, shameless assertion of falsehood as a tool to confuse the public and dominate news cycles.",
    category: "Conspiracy Theories / Disinformation",
    phase: "White House 1",
    date_start: "2017-01-22",
    people_tags: ["Kellyanne Conway", "Sean Spicer", "Donald Trump", "Chuck Todd"],
    danger: 6, authoritarianism: 8, lawlessness: 3, insanity: 7, absurdity: 10
  },
  {
    entry_number: 5799,
    title: "Trump CIA Speech: Self-Promotion Before Wall of Fallen Officers",
    synopsis: "On January 23, 2017, Trump delivered his first official presidential visit to CIA headquarters in Langley, Virginia. Standing before the Memorial Wall — 117 stars carved to honor CIA officers killed in service — Trump spent most of his remarks boasting about his intelligence, magazine cover appearances, and crowd sizes, calling journalists 'the most dishonest human beings on earth' and asking the audience to raise their hands if they liked him. Former CIA Director John Brennan called the speech 'inappropriate and divisive.' CIA officers reported the audience was largely White House staff bused in, with CIA personnel standing at the back.",
    category: "Authoritarianism",
    phase: "White House 1",
    date_start: "2017-01-23",
    people_tags: ["Donald Trump", "John Brennan"],
    danger: 6, authoritarianism: 7, lawlessness: 3, insanity: 8, absurdity: 9
  },
  {
    entry_number: 5800,
    title: "Trump Signs First Muslim Travel Ban — Airport Chaos Nationwide",
    synopsis: "On January 27, 2017, Trump signed Executive Order 13769, suspending refugee admissions for 120 days, halting Syrian refugee entry indefinitely, and banning nationals from seven Muslim-majority countries — Iran, Iraq, Libya, Somalia, Sudan, Syria, and Yemen — for 90 days. The order took effect immediately, stranding travelers mid-flight and causing chaos at airports nationwide. Customs officers detained green card holders and U.S. permanent residents. Federal judges in multiple states issued immediate emergency stays. Hundreds of volunteer lawyers rushed to airports; the ACLU raised $24 million in a single weekend from outraged donors.",
    category: "Human Rights Violations",
    phase: "White House 1",
    date_start: "2017-01-27",
    people_tags: ["Donald Trump", "Stephen Miller"],
    danger: 9, authoritarianism: 9, lawlessness: 8, insanity: 7, absurdity: 6
  },
  {
    entry_number: 5801,
    title: "Trump Claims 3-5 Million Illegal Votes Cost Him the Popular Vote",
    synopsis: "In the days following his inauguration, Trump told congressional leaders in a private meeting that between 3 and 5 million people voted illegally in the 2016 election, accounting for his 2.87 million popular vote deficit to Hillary Clinton. Trump repeated the claim publicly on January 25, 2017 via Twitter. No evidence supported the claim. Election officials from both parties rejected it, including Republicans in states Trump won. The Pew Research Center study Trump cited explicitly stated it provided no evidence of voter fraud. Adding absurdity, Trump's own lawyers simultaneously argued in Pennsylvania court that the election there was 'not tainted by fraud.'",
    category: "Conspiracy Theories / Disinformation",
    phase: "White House 1",
    date_start: "2017-01-25",
    people_tags: ["Donald Trump"],
    danger: 7, authoritarianism: 8, lawlessness: 5, insanity: 8, absurdity: 9
  },
  {
    entry_number: 5802,
    title: "Emoluments Violations Begin Day One — Foreign Governments Book Trump Hotel",
    synopsis: "From January 20, 2017, the day of Trump's inauguration, foreign diplomats and government officials began booking rooms and events at the Trump International Hotel in Washington, D.C., just blocks from the White House — in what legal scholars identified as potential violations of the Constitution's Emoluments Clause, which prohibits federal officeholders from receiving payments from foreign governments. Saudi Arabia spent over $270,000 at Trump properties in 2017 alone. Three separate lawsuits alleged emoluments violations; courts ultimately dismissed them on standing grounds in 2021, never ruling on the merits.",
    category: "Government Corruption",
    phase: "White House 1",
    date_start: "2017-01-20",
    people_tags: ["Donald Trump"],
    danger: 8, authoritarianism: 7, lawlessness: 9, insanity: 5, absurdity: 7
  },
  {
    entry_number: 5803,
    title: "Trump Voter Fraud Commission Under Kobach Targets Election Access",
    synopsis: "On May 11, 2017, Trump signed an executive order establishing the Presidential Advisory Commission on Election Integrity, co-chaired by Kansas Secretary of State Kris Kobach, a leading architect of restrictive voting laws. The commission requested sensitive voter data from all 50 states, including Social Security numbers, party affiliation, and voting histories. Over 40 states refused the request. The commission was sued multiple times for violations of federal transparency laws, and internal emails later showed Kobach used it to build a national voter file for partisan purposes. Trump dissolved the commission in January 2018 after it produced no evidence of widespread fraud.",
    category: "Election Interference",
    phase: "White House 1",
    date_start: "2017-05-11",
    people_tags: ["Donald Trump", "Kris Kobach", "Mike Pence"],
    danger: 8, authoritarianism: 9, lawlessness: 7, insanity: 6, absurdity: 7
  },
  {
    entry_number: 5804,
    title: "White House Record Turnover: Six Chiefs of Staff, Historic Year-One Chaos",
    synopsis: "In 2017, the Trump White House experienced historically unprecedented staff turnover. In year one alone, the administration fired or forced out the National Security Adviser (Flynn), Acting Attorney General (Yates), FBI Director (Comey), Press Secretary (Spicer), Chief of Staff (Priebus), Communications Director (Scaramucci, after just 11 days), and Health Secretary (Price). The Brookings Institution tracked a 65% turnover rate among top White House officials by year's end — the highest of any modern president. Across the full Trump presidency, six individuals served as chief of staff.",
    category: "Authoritarianism",
    phase: "White House 1",
    date_start: "2017-01-20",
    people_tags: ["Donald Trump", "Reince Priebus", "John Kelly", "Sean Spicer", "Michael Flynn", "Anthony Scaramucci", "James Comey"],
    danger: 7, authoritarianism: 8, lawlessness: 6, insanity: 9, absurdity: 9
  }
];

let entryCount = 0;
let scoreCount = 0;

for (const e of entries) {
  const entryRes = await sql`
    INSERT INTO trump_entries (entry_number, title, synopsis, category, phase, date_start, people_tags)
    VALUES (${e.entry_number}, ${e.title}, ${e.synopsis}, ${e.category}, ${e.phase}, ${e.date_start}, ${e.people_tags})
    ON CONFLICT DO NOTHING
  `;
  entryCount += entryRes.length !== undefined ? 0 : (entryRes.rowCount ?? 0);

  const scoreRes = await sql`
    INSERT INTO trump_individual_scores (entry_number, danger, authoritarianism, lawlessness, insanity, absurdity)
    VALUES (${e.entry_number}, ${e.danger}, ${e.authoritarianism}, ${e.lawlessness}, ${e.insanity}, ${e.absurdity})
    ON CONFLICT DO NOTHING
  `;
}

console.log(`Attempted to insert ${entries.length} entries`);

// Verify by count
const check = await sql`SELECT COUNT(*) as cnt FROM trump_entries WHERE entry_number BETWEEN 5765 AND 5804`;
const checkScores = await sql`SELECT COUNT(*) as cnt FROM trump_individual_scores WHERE entry_number BETWEEN 5765 AND 5804`;
console.log(`trump_entries rows for 5765-5804: ${check[0].cnt}`);
console.log(`trump_individual_scores rows for 5765-5804: ${checkScores[0].cnt}`);
