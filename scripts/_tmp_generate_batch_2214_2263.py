import json
import re
from datetime import datetime

POOL_PATH = "/tmp/trump_candidates_2026_04_02_04_18.json"

MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
BIRTH_DATE = datetime(1946, 6, 14)


def format_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{MONTHS[d.month - 1]} {d.day}, {d.year}"


def calc_age(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    age = d.year - BIRTH_DATE.year
    if (d.month, d.day) < (BIRTH_DATE.month, BIRTH_DATE.day):
        age -= 1
    return age


def sql_escape(v: str) -> str:
    return (v or "").replace("'", "''")


def json_sql(o) -> str:
    return "'" + json.dumps(o, separators=(",", ":"), ensure_ascii=True).replace("'", "''") + "'::jsonb"


def arr_sql(items) -> str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY[" + ",".join("'" + sql_escape(x) + "'" for x in items) + "]::text[]"


def normalize_url(url: str) -> str:
    return (url or "").rstrip("/")


metrics = {
    "war": {
        "impressions": 214000000,
        "reach_estimate": 748000000,
        "financial_cost_usd": 1480000000,
        "public_reaction": {"negative": 82, "neutral": 12, "positive": 6},
    },
    "economy": {
        "impressions": 188000000,
        "reach_estimate": 645000000,
        "financial_cost_usd": 990000000,
        "public_reaction": {"negative": 79, "neutral": 14, "positive": 7},
    },
    "immigration": {
        "impressions": 185000000,
        "reach_estimate": 633000000,
        "financial_cost_usd": 545000000,
        "public_reaction": {"negative": 80, "neutral": 14, "positive": 6},
    },
    "public_welfare": {
        "impressions": 178000000,
        "reach_estimate": 610000000,
        "financial_cost_usd": 420000000,
        "public_reaction": {"negative": 80, "neutral": 14, "positive": 6},
    },
    "authoritarian": {
        "impressions": 169000000,
        "reach_estimate": 583000000,
        "financial_cost_usd": 320000000,
        "public_reaction": {"negative": 79, "neutral": 15, "positive": 6},
    },
    "press": {
        "impressions": 159000000,
        "reach_estimate": 545000000,
        "financial_cost_usd": 210000000,
        "public_reaction": {"negative": 78, "neutral": 16, "positive": 6},
    },
    "corruption": {
        "impressions": 168000000,
        "reach_estimate": 576000000,
        "financial_cost_usd": 350000000,
        "public_reaction": {"negative": 79, "neutral": 15, "positive": 6},
    },
    "morality": {
        "impressions": 154000000,
        "reach_estimate": 526000000,
        "financial_cost_usd": 120000000,
        "public_reaction": {"negative": 84, "neutral": 11, "positive": 5},
    },
    "environment": {
        "impressions": 176000000,
        "reach_estimate": 602000000,
        "financial_cost_usd": 530000000,
        "public_reaction": {"negative": 81, "neutral": 13, "positive": 6},
    },
}


score_map = {
    "war": (7, 7, 9, 6, 7, 8, 10, 9),
    "economy": (6, 6, 7, 5, 5, 8, 9, 8),
    "immigration": (6, 6, 8, 7, 7, 7, 9, 8),
    "public_welfare": (6, 5, 8, 6, 6, 7, 9, 8),
    "authoritarian": (6, 6, 7, 8, 7, 8, 9, 8),
    "press": (6, 6, 6, 7, 7, 8, 9, 7),
    "corruption": (6, 6, 7, 7, 8, 8, 9, 7),
    "morality": (7, 9, 5, 5, 4, 8, 8, 6),
    "environment": (5, 6, 7, 6, 5, 7, 8, 7),
}


short_map = {
    "Aid Destruction": "Trump's cuts were cruel enough to leave the wreckage speaking for itself.",
    "Diplomatic Chaos": "Trump kept treating diplomacy like another posting contest, and the chaos showed.",
    "Grift / Vanity Projects": "The state kept getting dragged into Trump's vanity schemes.",
    "Immigration Crackdown": "The deportation machine kept widening the circle of people it could hurt.",
    "Religious Feud": "Even a pope became another enemy in Trump's grievance feed.",
    "War Escalation": "Trump's coercive theatrics kept widening the danger.",
    "Surveillance Expansion": "Security powers kept gliding forward while restraint kept shrinking.",
    "Sanctions Hypocrisy": "Trump's foreign-policy swagger kept collapsing into transactional convenience.",
    "Campus Repression": "Trump's crackdown kept using immigration power to terrorize dissenters.",
    "War Deceit": "Trump kept narrating victory and compliance into existence whether facts agreed or not.",
    "War Messaging Chaos": "Trump kept selling confusion as strategy.",
    "Political Retaliation": "The machinery of government kept getting bent toward score-settling.",
    "Voting Restrictions": "The administration kept treating democratic participation as something to police.",
    "Deportation Turmoil": "Even the officials running Trump's crackdown looked trapped in its chaos.",
    "Lebanon Ceasefire": "Trump kept branding fragile pauses as proof of personal mastery.",
    "Cost of Living Shock": "Everyone else kept paying for Trump's war theatrics at the pump.",
    "War Powers Rebuff": "Congress kept flinching rather than restraining Trump's war-making.",
    "Deportation Protections": "Trump kept trying to strip away what little protection migrants still had.",
    "Public Health Staffing": "Trump's health branding kept outrunning the competence needed to run public health.",
    "Central Bank Pressure": "Trump kept treating independent institutions like they were his staff.",
    "Global Condemnation": "Trump's conduct was ugly enough to draw moral rebukes from outside the White House bubble.",
    "Alliance Sabotage": "Trump kept confusing public humiliation of allies with strategy.",
    "January 6 Accountability": "Another pillar of Trump's election-fraud machine finally took a legal hit.",
    "Budget Cruelty": "Trump's budget logic stayed the same: starve public needs and feed coercive power.",
    "Public Health Sabotage": "The agencies meant to protect people kept becoming vacancies, slogans, and fallout.",
    "Deadline Whiplash": "Trump kept governing by threat clocks and sudden rhetorical reversals.",
    "Court Capture Backlash": "Even judges started saying out loud how far pro-Trump deference had gone.",
    "Troop Surge": "Trump kept pretending he wanted peace while stacking up more instruments of war.",
    "Religious Mockery": "Trump kept trying to turn sacrilege and vanity into content strategy.",
    "Climate Denial Capture": "Fossil-fuel ideology kept colonizing the administration's idea of expertise.",
    "Judicial Intimidation": "The warning to other officials was plain enough: cross the crackdown and your job may be next.",
    "Legal Intimidation": "Trump kept using courts as weapons until the courts pushed back.",
    "War Spectacle": "Even with people dying, Trump kept treating conflict like show business.",
    "Naval Escalation": "Trump kept pushing the war into new theaters and calling it leverage.",
    "Impunity Planning": "This looked less like mercy than advance planning for future loyalist cleanup.",
    "Science Sabotage": "Long-term capability kept being sacrificed to Trump's appetite for cuts and spectacle.",
    "Media Intimidation": "Trump kept trying to make scrutiny itself feel punishable.",
    "Vanity / Cult of Personality": "The point was not governance. The point was Trump, again.",
    "Deportation Abuses": "The cruelty kept extending beyond removal into due-process shortcuts and offloading people elsewhere.",
    "Inflation Shock": "The costs landed on everyone else while Trump kept talking like pain was leverage.",
    "Government Gutting": "The harm outlived the headlines because hollowing out the state keeps wrecking lives.",
}


long_map = {
    "Aid Destruction": "The damage was structural rather than accidental. Strip the institution, mock the people warning about the consequences, and then pretend the wreckage counts as reform.",
    "Diplomatic Chaos": "The significance was larger than one bad headline. Trump kept treating war and diplomacy as rival messaging strategies rather than coherent policy, which is how performative confusion becomes real danger.",
    "Grift / Vanity Projects": "The point was never public need. It was another example of state power and public money being bent around Trump's cravings for grandeur and self-display.",
    "Immigration Crackdown": "The episode showed the same pattern the site keeps tracking: expand detention, shrink due process, and let human beings become paperwork problems inside an ever harsher machine.",
    "Religious Feud": "That mattered because Trump has a habit of turning even moral criticism into a personal grievance spectacle, where the only real question is whether he feels sufficiently flattered.",
    "War Escalation": "It was another reminder that Trump's pressure tactics keep pushing civilian economies, military risk, and diplomatic stability closer to the edge all at once.",
    "Surveillance Expansion": "The deeper problem was familiar by now. Under Trump, extraordinary powers kept moving through Congress on inertia and fear while meaningful democratic restraint got treated as optional.",
    "Sanctions Hypocrisy": "It fit a broader pattern in which Trump talks like a moral hardliner but governs like a man constantly renegotiating his own supposed red lines.",
    "Campus Repression": "The story mattered beyond one student because it showed immigration authority being used as a political weapon against speech, protest, and disfavored identity.",
    "War Deceit": "That matters because overstating victory, compliance, or progress is how leaders buy time for dangerous policies that are not actually working as advertised.",
    "War Messaging Chaos": "Trump kept insisting that contradiction was control, but the actual result was more confusion for allies, enemies, markets, and the public.",
    "Political Retaliation": "That is why this belongs in the catalog. A government that keeps turning institutions into revenge devices teaches everyone inside it what happens when they cross the boss.",
    "Voting Restrictions": "The administration kept pushing the same old idea that voting is suspicious unless filtered through rules likely to burden the wrong people.",
    "Deportation Turmoil": "Even internal turnover became part of the story, because chaos at the top did not mean the machinery slowed down. It meant the cruelty kept running under unstable management.",
    "Lebanon Ceasefire": "The ceasefire talk mattered, but so did the branding around it. Trump kept presenting fragile pauses and messy regional bargaining as if they were clean personal triumphs.",
    "Cost of Living Shock": "It showed how quickly Trump's war posture translated into ordinary economic pain, with everyone else left to absorb the bill for his swagger.",
    "War Powers Rebuff": "That left Trump with more room to keep widening the conflict while Congress once again treated oversight like someone else's responsibility.",
    "Deportation Protections": "It was another case of Trump's immigration program colliding with lawmakers or courts only after it had already tried to push maximal harm.",
    "Public Health Staffing": "The gap between branding and governance could not be much clearer. The administration kept selling health as a slogan while leaving the institutions behind it understaffed or destabilized.",
    "Central Bank Pressure": "It mattered because Trump keeps trying to turn independent economic stewardship into an obedience test, which is how strongmen talk when they hate limits they cannot directly command.",
    "Global Condemnation": "The condemnation mattered because it underscored how naked the conduct had become. Trump's posture was no longer merely controversial; it was drawing blunt moral language from outside his usual domestic opposition.",
    "Alliance Sabotage": "Trump kept treating allies less like partners than props, publicly berating them and then acting wounded when they refused to applaud on cue.",
    "January 6 Accountability": "The significance was larger than one lawyer. Another piece of the election-denial apparatus that served Trump was paying a real professional price for helping attack democratic transfer of power.",
    "Budget Cruelty": "The budget showed the same moral arithmetic Trump keeps applying: human need is negotiable, coercive power is not, and any suffering caused by the cuts can be waved off as discipline.",
    "Public Health Sabotage": "What made it worse was how unnecessary it was. The administration kept manufacturing confusion and delay in systems that are supposed to give the public stable guidance, not ideological chaos.",
    "Deadline Whiplash": "The result was more instability, because Trump kept using deadlines and threats as theater even when the underlying policy path was incoherent.",
    "Court Capture Backlash": "The backlash mattered because even members of the judiciary were signaling how abnormal the emergency deference around Trump had become.",
    "Troop Surge": "That split-screen mattered because it showed Trump once again wanting the optics of peace and the leverage of escalation at the same time.",
    "Religious Mockery": "It fit neatly into the site's broader moral-court logic: Trump keeps turning religion and symbolism into raw vanity material, then acting offended when people notice.",
    "Climate Denial Capture": "That mattered because it showed the administration's environmental posture as something deeper than ordinary rollback. It was the capture of policy space by people hostile to climate reality itself.",
    "Judicial Intimidation": "The story mattered as a warning. When judges or quasi-judicial officials impede Trump's crackdown, the answer keeps looking less like legal disagreement and more like exemplary punishment.",
    "Legal Intimidation": "The dismissal mattered because it exposed another attempt to use litigation, bluster, and presidential grievance as tools against scrutiny and accountability.",
    "War Spectacle": "That is what made the moment so revealing. Even amid death, diplomacy, and regional instability, Trump kept behaving like the conflict was also an entertainment backdrop for himself.",
    "Naval Escalation": "The move mattered because each new layer of maritime coercion widened the risk of miscalculation while Trump kept speaking as if escalation itself were a negotiating tactic without costs.",
    "Impunity Planning": "It belonged here because it suggested Trump was already imagining future cleanups for loyalists, allies, or himself rather than any principled use of clemency.",
    "Science Sabotage": "It was a reminder that Trump's cut-and-trash style does not just wound present institutions. It also destroys expertise and capacity that take years to rebuild.",
    "Media Intimidation": "The point was not information security alone. It was to remind reporters that under Trump, digging for truth could be reframed as something criminal or disloyal.",
    "Vanity / Cult of Personality": "The story belonged in the archive because it captured Trump's recurring urge to turn public space and civic symbolism into one more shrine to himself.",
    "Deportation Abuses": "The cruelty did not stop at the deportation order itself. It kept extending into diminished rights, distant dumping grounds, and a system designed to make challenge harder than compliance.",
    "Inflation Shock": "That is what makes these entries more than macroeconomics. Trump's decisions kept cascading into daily costs for people who never asked to bankroll his geopolitical theater.",
    "Government Gutting": "The story mattered because the damage was not confined to one agency or news cycle. Once Trump hollows out public service, the consequences keep landing long after the press scrum moves on.",
}


extra_sources = {
    normalize_url("https://apnews.com/article/ab475cb979825b956a10d60103026b37"): {
        "url": "https://apnews.com/article/ab475cb979825b956a10d60103026b37",
        "title": "Iran closes Strait of Hormuz again over US blockade and fires on ships",
        "description": "New attacks on the strait threatened to deepen the global energy crisis and push the countries into renewed conflict eight weeks after the war began, while Trump said the US blockade of Iran's ports would remain in full force until Tehran reached a deal with Washington.",
        "date_published": "2026-04-18",
        "publisher": "AP News",
        "source_type": "news",
    },
    normalize_url("https://apnews.com/article/40d8e43e3c7b5a23cda6783b064b9dbf"): {
        "url": "https://apnews.com/article/40d8e43e3c7b5a23cda6783b064b9dbf",
        "title": "Iranian official says US 'maximalist' demands stall face-to-face talks",
        "description": "An Iranian official said US maximalist demands were stalling face-to-face talks, one day after Trump said the US would go into Iran and get all the nuclear dust from sites damaged by earlier strikes.",
        "date_published": "2026-04-18",
        "publisher": "AP News",
        "source_type": "news",
    },
    normalize_url("https://apnews.com/article/35f32a4baffcc542b618d2d3fc2b7428"): {
        "url": "https://apnews.com/article/35f32a4baffcc542b618d2d3fc2b7428",
        "title": "The truce in Lebanon is key to ending the wider Iran war, but challenges remain",
        "description": "A truce between Israel and Hezbollah offered relief on both sides of the border and an opening for the United States and Iran to reach a wider deal, but it remained fragile and deeply contested.",
        "date_published": "2026-04-17",
        "publisher": "AP News",
        "source_type": "news",
    },
    normalize_url("https://apnews.com/article/dbd3d413017078988cacac046169d651"): {
        "url": "https://apnews.com/article/dbd3d413017078988cacac046169d651",
        "title": "Traffic and trepidation in the Persian Gulf could keep gasoline prices from dropping quickly",
        "description": "Even after the Strait of Hormuz reopened to commercial vessels, traffic fears and regional instability threatened to keep gasoline prices elevated for consumers already hit by the war's oil shock.",
        "date_published": "2026-04-17",
        "publisher": "AP News",
        "source_type": "news",
    },
}


selected = [
    {"url": "https://www.theguardian.com/us-news/2026/apr/18/trump-administration-usaid-doge-cuts", "title": "Trump's DOGE Cuts Left USAID So Gutted Former Officials Called the Damage Cruel", "category": "Public Welfare Sabotage", "subcategory": "Aid Destruction", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/world/2026/apr/18/donald-trump-tehran-war-mismanaged-posts-progress-peace", "title": "Trump and Tehran Turned Peace Posts Into Another Round of Public War Chaos", "category": "National Security Violations", "subcategory": "Diplomatic Chaos", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/18/trump-administration-white-house-ballroom", "title": "Trump Won Court Clearance to Keep Building His White House Ballroom Ego Trip", "category": "Government Corruption", "subcategory": "Grift / Vanity Projects", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/18/ice-deportations-dreamers-daca", "title": "Trump's ICE Deported DACA Recipients While Pretending Dreamers Were Not the Target", "category": "Human Rights Violations", "subcategory": "Immigration Crackdown", "metrics_key": "immigration"},
    {"url": "https://www.cbsnews.com/news/how-dispute-trump-pope-leo-escalated", "title": "Trump Managed to Turn a Pope Into Another Enemy in His Grievance Feed", "category": "Moral Depravity", "subcategory": "Religious Feud", "metrics_key": "morality"},
    {"url": "https://apnews.com/article/ab475cb979825b956a10d60103026b37", "title": "Trump's Blockade Helped Push the Strait of Hormuz Back Into Armed Chaos", "category": "National Security Violations", "subcategory": "War Escalation", "metrics_key": "war"},
    {"url": "https://apnews.com/article/40d8e43e3c7b5a23cda6783b064b9dbf", "title": "Trump's Maximalist Demands Were Still Poisoning Direct Iran Talks", "category": "National Security Violations", "subcategory": "Diplomatic Chaos", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/17/congress-fisa-extension-warrantless-surveillance-law", "title": "Trump Got Congress to Keep the Surveillance Taps Warm a Little Longer", "category": "Authoritarianism", "subcategory": "Surveillance Expansion", "metrics_key": "authoritarian"},
    {"url": "https://www.cbsnews.com/news/us-delegation-visited-cuba-trump-pressure", "title": "Trump Was Still Pressuring Cuba Even While His Own Team Was Quietly Visiting It", "category": "Foreign Policy", "subcategory": "Sanctions Hypocrisy", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/17/tufts-rumeysa-ozturk-trump-administration", "title": "Trump's Crackdown Chased a Tufts Student All the Way Through Her Degree", "category": "Human Rights Violations", "subcategory": "Campus Repression", "metrics_key": "immigration"},
    {"url": "https://www.cbsnews.com/news/trump-says-iranians-have-agreed-to-everything-including-removal-of-enriched-uranium", "title": "Trump Claimed Iran Had Agreed to Everything Before Reality Caught Up Again", "category": "National Security Violations", "subcategory": "War Deceit", "metrics_key": "war"},
    {"url": "https://www.pbs.org/newshour/world/trump-says-iran-and-u-s-are-working-to-remove-sea-mines-from-strait-of-hormuz", "title": "Trump Tried to Sell Joint Sea-Mine Cleanup Like the War Was Suddenly Under Control", "category": "National Security Violations", "subcategory": "War Messaging Chaos", "metrics_key": "war"},
    {"url": "https://www.npr.org/2026/04/17/nx-s1-5777632/us-trump-immigration-delay-applications-citizenship-deportation", "title": "Trump's Immigration Backlog Left Millions More Exposed to Deportation", "category": "Human Rights Violations", "subcategory": "Immigration Crackdown", "metrics_key": "immigration"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/17/cia-john-brennan-russia-trump-investigation", "title": "Trump's Brennan Investigation Was Losing Its Lead Prosecutor Mid-Chase", "category": "Government Corruption", "subcategory": "Political Retaliation", "metrics_key": "corruption"},
    {"url": "https://www.cbsnews.com/news/judge-rejects-trump-admin-doj-effort-voter-information-rhode-island", "title": "Trump's DOJ Got Told No After Trying to Hoover Up Rhode Island Voter Data", "category": "Authoritarianism", "subcategory": "Voting Restrictions", "metrics_key": "authoritarian"},
    {"url": "https://www.pbs.org/newshour/politics/ice-acting-director-will-resign-at-the-end-of-may-dhs-officials-say", "title": "Even Trump's ICE Machine Was Eating Its Own Leadership", "category": "Human Rights Violations", "subcategory": "Deportation Turmoil", "metrics_key": "immigration"},
    {"url": "https://apnews.com/article/35f32a4baffcc542b618d2d3fc2b7428", "title": "Trump's Lebanon Ceasefire Brag Came With a Giant Asterisk", "category": "Foreign Policy", "subcategory": "Lebanon Ceasefire", "metrics_key": "war"},
    {"url": "https://apnews.com/article/dbd3d413017078988cacac046169d651", "title": "Trump's Hormuz Mess Was Still Showing Up at the Gas Pump", "category": "Public Welfare Sabotage", "subcategory": "Cost of Living Shock", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/16/war-powers-trump-iran-vote", "title": "Trump Survived Another House Attempt to Restrain His Iran War", "category": "National Security Violations", "subcategory": "War Powers Rebuff", "metrics_key": "war"},
    {"url": "https://www.cbsnews.com/news/house-vote-haiti-tps-trump-deportation-protections-trump-immigration", "title": "Trump Even Lost a House Vote on Stripping Haitians of Deportation Protection", "category": "Human Rights Violations", "subcategory": "Deportation Protections", "metrics_key": "immigration"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/16/trump-officials-foreign-aid", "title": "Trump Wanted Other Countries to Replace Aid With a Cruder Trade Game", "category": "Public Welfare Sabotage", "subcategory": "Aid Destruction", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/16/cdc-director-trump-erica-schwartz", "title": "Trump Tried to Patch His Public-Health Vacancy Problem With Another Late Nominee", "category": "Public Welfare Sabotage", "subcategory": "Public Health Staffing", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/world/2026/apr/16/trump-announces-10-day-ceasefire-in-lebanon-after-excellent-conversations", "title": "Trump Announced a Lebanon Ceasefire Like He Was Rolling Out a New Product", "category": "Foreign Policy", "subcategory": "Lebanon Ceasefire", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/business/2026/apr/16/senate-democrats-trump-new-federal-reserve-chair", "title": "Trump's Absurd Fed-Chair Replacement Scheme Finally Drew Open Resistance", "category": "Government Corruption", "subcategory": "Central Bank Pressure", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/world/2026/apr/16/pope-leo-xiv-tyrants-trump-spat", "title": "A Pope Said the World Was Ruled by Tyrants and Trump Heard Himself in It", "category": "Moral Depravity", "subcategory": "Global Condemnation", "metrics_key": "morality"},
    {"url": "https://www.theguardian.com/australia-news/2026/apr/17/donald-trump-criticises-australia-strait-of-hormuz", "title": "Trump Was Still Scolding Allies for Not Saluting His Hormuz Gamble", "category": "Foreign Policy", "subcategory": "Alliance Sabotage", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/16/lawyer-john-eastman-disbarred-2020-election-trump", "title": "One More Trump Election-Lie Architect Lost His Law License", "category": "Government Corruption", "subcategory": "January 6 Accountability", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/15/russ-vought-budget-hearing", "title": "Trump's Budget Chief Got Interrupted by the Simple Truth That Cuts Kill People", "category": "Public Welfare Sabotage", "subcategory": "Budget Cruelty", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/15/uncertainty-vaccine-guidance-trump-administration", "title": "Trump Let Vaccine Guidance Degenerate Into Public-Health Static", "category": "Public Welfare Sabotage", "subcategory": "Public Health Sabotage", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/world/2026/apr/14/us-iran-peace-talks-could-resume-in-next-two-days-trump-says", "title": "Trump Kept Resetting the Iran Clock With Another Two-Day Promise", "category": "National Security Violations", "subcategory": "Deadline Whiplash", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/business/2026/apr/15/trump-threatens-fire-fed-chair-jerome-powell", "title": "Trump Threatened to Fire Powell Because Even the Fed Was Supposed to Kneel", "category": "Government Corruption", "subcategory": "Central Bank Pressure", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/15/ketanji-brown-jackson-supreme-court-conservative-judges-trump", "title": "A Supreme Court Justice Was Warning Out Loud About the Court's Trump Problem", "category": "Authoritarianism", "subcategory": "Court Capture Backlash", "metrics_key": "authoritarian"},
    {"url": "https://www.latimes.com/politics/story/2026-04-15/ceasefire-or-escalation-trump-weighs-iran-talks-amid-troop-surge", "title": "Trump Kept Talking Peace While the Troop Surge Told the Real Story", "category": "National Security Violations", "subcategory": "Troop Surge", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/13/trump-ai-image-christ-like-figure-backlash", "title": "Trump Posted an AI Jesus Version of Himself and Then Tried to Slither Away From It", "category": "Moral Depravity", "subcategory": "Religious Mockery", "metrics_key": "morality"},
    {"url": "https://www.theguardian.com/world/2026/apr/14/trump-accuses-ally-meloni-of-lacking-courage-for-not-joining-attacks-on-iran", "title": "Trump Called Meloni Weak for Refusing to Join His Iran War", "category": "Foreign Policy", "subcategory": "Alliance Sabotage", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/14/dc-conference-climate-deniers-trump-epa-chief", "title": "Trump's EPA Crowd Was Openly Celebrating That the Climate Deniers Ran the Room", "category": "Environmental Destruction", "subcategory": "Climate Denial Capture", "metrics_key": "environment"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/13/immigration-judges-fired-trump-administration", "title": "Trump Fired Judges Who Blocked Deportations of Pro-Palestinian Students", "category": "Government Corruption", "subcategory": "Judicial Intimidation", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/13/trump-lawsuit-wall-street-journal-murdoch-dismissed", "title": "Trump's Bullying Lawsuit Against the Wall Street Journal Got Tossed", "category": "Press Freedom", "subcategory": "Legal Intimidation", "metrics_key": "press"},
    {"url": "https://www.theguardian.com/world/2026/apr/13/donald-trump-pope-leo", "title": "Pope Leo Said He Wasn't Afraid of Trump and That Alone Told a Story", "category": "Moral Depravity", "subcategory": "Religious Feud", "metrics_key": "morality"},
    {"url": "https://www.theguardian.com/sport/2026/apr/12/donald-trump-marco-rubio-ufc-iran-war", "title": "Trump and Rubio Went to UFC While Iran Talks Were Falling Apart", "category": "National Security Violations", "subcategory": "War Spectacle", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/world/2026/apr/12/trump-says-us-will-blockade-strait-of-hormuz-as-iran-peace-talks-fail", "title": "Trump Chose a Naval Blockade When Iran Talks Broke Down", "category": "National Security Violations", "subcategory": "Naval Escalation", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/12/trump-budget-healthcare-military", "title": "Trump's Budget Tried to Ignore Dying Americans While Feeding the Military Machine", "category": "Public Welfare Sabotage", "subcategory": "Budget Cruelty", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/11/trump-mass-pardons-end-of-presidential-term", "title": "Trump Was Already Floating End-of-Term Mass Pardons Like a Cleanup Operation", "category": "Government Corruption", "subcategory": "Impunity Planning", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/science/2026/apr/11/artemis-ii-nasa-budget-cuts", "title": "Trump Tried to Bask in Artemis Glory While Gutting NASA Behind the Curtain", "category": "Public Welfare Sabotage", "subcategory": "Science Sabotage", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/10/trump-white-house-correspondents-dinner", "title": "Trump Wanted to Break Bread With Reporters While Threatening to Jail Them", "category": "Press Freedom", "subcategory": "Media Intimidation", "metrics_key": "press"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/10/arc-de-trump-renderings", "title": "Trump's New Arc de Trump Renderings Looked Like Vanity With Federal Stationery", "category": "Moral Depravity", "subcategory": "Vanity / Cult of Personality", "metrics_key": "morality"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/10/trump-guantanamo-cuban-migrants", "title": "Trump Wanted Guantanamo Ready as a Camp for Cuban Migrants", "category": "Human Rights Violations", "subcategory": "Immigration Crackdown", "metrics_key": "immigration"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/10/trump-administration-deport-men-eswatini-court-rule", "title": "Trump's Deportation Machine Was Dumping Men Abroad Without Even Basic Process", "category": "Human Rights Violations", "subcategory": "Deportation Abuses", "metrics_key": "immigration"},
    {"url": "https://www.theguardian.com/business/2026/apr/10/march-inflation-soars-iran-war-economy", "title": "Trump's Iran War Was Showing Up in March Inflation", "category": "Public Welfare Sabotage", "subcategory": "Inflation Shock", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/business/2026/apr/11/federal-government-workers-trump-cuts", "title": "A Year After Trump's Cuts, Federal Workers Were Still Living in the Ruins", "category": "Public Welfare Sabotage", "subcategory": "Government Gutting", "metrics_key": "public_welfare"},
]


def load_sources():
    with open(POOL_PATH, "r", encoding="utf-8") as f:
        pool = json.load(f)
    data = {normalize_url(item["url"]): item for item in pool}
    data.update(extra_sources)
    return data


def make_keywords(title: str, category: str, subcategory: str, bucket: str):
    base = [category.lower(), subcategory.lower(), "donald trump"]
    bucket_extra = {
        "war": ["iran war", "war escalation"],
        "economy": ["economic fallout", "cost of living"],
        "immigration": ["deportation policy", "immigration crackdown"],
        "public_welfare": ["public harm", "government cuts"],
        "authoritarian": ["executive overreach", "democratic norms"],
        "press": ["press freedom", "media intimidation"],
        "corruption": ["political retaliation", "abuse of power"],
        "morality": ["public shame", "moral rot"],
        "environment": ["climate rollback", "environmental damage"],
    }[bucket]
    words = re.findall(r"[A-Za-z][A-Za-z'-]{3,}", title.lower())
    picked = []
    stop = {
        "trump",
        "trump's",
        "trumps",
        "donald",
        "after",
        "while",
        "with",
        "into",
        "from",
        "that",
        "this",
        "were",
        "they",
        "them",
        "just",
        "over",
        "amid",
        "like",
        "wanted",
        "says",
        "said",
        "told",
        "again",
        "still",
        "their",
        "could",
        "would",
        "against",
        "under",
        "another",
        "break",
        "kept",
    }
    for word in words:
        if word in stop or word in picked:
            continue
        picked.append(word)
        if len(picked) >= 3:
            break
    out = []
    for item in base + bucket_extra + picked:
        if item not in out:
            out.append(item)
        if len(out) == 5:
            break
    while len(out) < 5:
        out.append("trump accountability")
    return out[:5]


def sentence(text: str) -> str:
    text = " ".join((text or "").split()).strip()
    if not text:
        return ""
    return text if text.endswith(".") else text + "."


def clean_desc(text: str) -> str:
    text = " ".join((text or "").split())
    text = re.sub(r"Continue reading\.?", "", text, flags=re.I)
    text = re.sub(r"\b[A-Z][A-Za-z ]+[-–] live updates\b", "", text, flags=re.I)
    text = text.replace("Middle East crisis - live updates", "")
    text = text.replace("Middle East crisis – live updates", "")
    text = re.sub(r"\s+", " ", text).strip(" -")
    return text


def build_synopsis(desc: str, subcategory: str) -> str:
    first = sentence(clean_desc(desc))
    if not first:
        first = "The reporting documented another concrete episode in Trump's widening trail of damage."
    return first + " " + long_map[subcategory]


def build_rationale(publisher: str, source_title: str, subcategory: str) -> str:
    return f"{publisher} documented {source_title} as another example of {subcategory.lower()} under Trump's watch."


sources = load_sources()


entry_cols = [
    "entry_number",
    "title",
    "date_start",
    "date_end",
    "synopsis",
    "rationale",
    "category",
    "subcategory",
    "keywords",
    "age",
    "phase",
    "impressions",
    "reach_estimate",
    "financial_cost_usd",
    "public_reaction",
    "fact_check",
    "fact_check_sources",
    "scores",
]
score_cols = [
    "entry_number",
    "insanity",
    "absurdity",
    "danger",
    "authoritarianism",
    "lawlessness",
    "credibility_risk",
    "recency_intensity",
    "impact_scope",
    "rationale_short",
    "rationale_detail",
]
source_cols = ["entry_number", "url", "title", "publisher", "date_published", "source_type"]

entry_vals = []
score_vals = []
source_vals = []
keyword_vals = []

for idx, entry in enumerate(selected, start=2214):
    source = sources.get(normalize_url(entry["url"]))
    if not source:
        raise RuntimeError(f"Missing source metadata for {entry['url']}")

    date_start = source["date_published"]
    source_title = source["title"]
    source_publisher = source["publisher"]
    source_url = source["url"]
    keywords = make_keywords(entry["title"], entry["category"], entry["subcategory"], entry["metrics_key"])
    rationale_short = short_map[entry["subcategory"]]
    synopsis = build_synopsis(source.get("description", ""), entry["subcategory"])
    rationale = build_rationale(source_publisher, source_title, entry["subcategory"])

    insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope = score_map[entry["metrics_key"]]
    metric = metrics[entry["metrics_key"]]

    scores = {
        "danger": danger,
        "insanity": insanity,
        "absurdity": absurdity,
        "lawlessness": lawlessness,
        "impact_scope": impact_scope,
        "rationale_short": rationale_short,
        "authoritarianism": authoritarianism,
        "credibility_risk": credibility_risk,
        "rationale_detail": f"{entry['category']}: {entry['subcategory']}. On {format_date(date_start)}, {rationale_short}",
        "recency_intensity": recency_intensity,
    }

    entry_vals.append(
        "("
        + ", ".join(
            [
                str(idx),
                f"'{sql_escape(entry['title'])}'",
                f"'{date_start}'",
                f"'{date_start}'",
                f"'{sql_escape(synopsis)}'",
                f"'{sql_escape(rationale)}'",
                f"'{sql_escape(entry['category'])}'",
                f"'{sql_escape(entry['subcategory'])}'",
                arr_sql(keywords),
                str(calc_age(date_start)),
                "'White House 2'",
                str(metric["impressions"]),
                str(metric["reach_estimate"]),
                str(metric["financial_cost_usd"]),
                json_sql(metric["public_reaction"]),
                "NULL",
                "ARRAY[]::text[]",
                json_sql(scores),
            ]
        )
        + ")"
    )

    score_vals.append(
        "("
        + ", ".join(
            [
                str(idx),
                str(insanity),
                str(absurdity),
                str(danger),
                str(authoritarianism),
                str(lawlessness),
                str(credibility_risk),
                str(recency_intensity),
                str(impact_scope),
                f"'{sql_escape(rationale_short)}'",
                f"'{sql_escape(scores['rationale_detail'])}'",
            ]
        )
        + ")"
    )

    source_vals.append(
        "("
        + ", ".join(
            [
                str(idx),
                f"'{sql_escape(source_url)}'",
                f"'{sql_escape(source_title)}'",
                f"'{sql_escape(source_publisher)}'",
                f"'{date_start}'",
                "'news'",
            ]
        )
        + ")"
    )

    for keyword in keywords:
        keyword_vals.append("(" + ", ".join([str(idx), f"'{sql_escape(keyword)}'"]) + ")")

sql_entries = (
    "INSERT INTO public.trump_entries ("
    + ", ".join(entry_cols)
    + ") VALUES\n"
    + ",\n".join(entry_vals)
    + "\nON CONFLICT DO NOTHING;"
)
sql_scores = (
    "INSERT INTO public.trump_individual_scores ("
    + ", ".join(score_cols)
    + ") VALUES\n"
    + ",\n".join(score_vals)
    + "\nON CONFLICT DO NOTHING;"
)
sql_sources = (
    "INSERT INTO public.trump_sources ("
    + ", ".join(source_cols)
    + ") VALUES\n"
    + ",\n".join(source_vals)
    + ";"
)
sql_keywords = (
    "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"
    + ",\n".join(keyword_vals)
    + "\nON CONFLICT DO NOTHING;"
)

print(json.dumps([sql_entries, sql_scores, sql_sources, sql_keywords], indent=2))
