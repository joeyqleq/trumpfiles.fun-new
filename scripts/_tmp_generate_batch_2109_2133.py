import json
from datetime import datetime

months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
birth_date = datetime(1946, 6, 14)


def format_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{months[d.month - 1]} {d.day}, {d.year}"


def calc_age(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    age = d.year - birth_date.year
    if (d.month, d.day) < (birth_date.month, birth_date.day):
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
}


entries = [
    {
        "entry_number": 2109,
        "title": "Trump's Iran War Threatened to Shock the Global Economy",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["iran war economy", "oil prices", "inflation risk", "global growth", "trump war fallout"],
        "scores": (6, 5, 8, 6, 6, 7, 10, 9),
        "rationale_short": "Experts warned Trump's Iran war could hit oil, inflation, and growth long after the missiles stop.",
        "synopsis": "The Guardian framed Trump's Iran war as more than a regional bloodbath: it threatened to send oil prices higher, feed inflation, slow growth, and export economic pain far beyond the battlefield. That matters because one of Trump's oldest scams is treating war like a macho television segment with no spreadsheet attached. The spreadsheet arrives anyway, and ordinary people end up paying for the swagger at the pump, in prices, and in public finances.",
        "rationale": "The Guardian tied Trump's escalation directly to long-tail economic shocks, making the fallout part of the event rather than an afterthought.",
        "source_url": "https://www.theguardian.com/news/ng-interactive/2026/mar/22/iran-war-global-economy-donald-trump-oil-prices-inflation",
        "source_title": "‘The stakes are enormous’: how a prolonged Iran war could shock the global economy",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2110,
        "title": "Trump Kept Open the Option of Hitting Iranian Power Plants Even After War-Crime Warnings",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["iran plants", "war crime warning", "energy infrastructure", "waltz", "trump escalation"],
        "scores": (7, 5, 10, 8, 8, 8, 10, 10),
        "rationale_short": "Even after war-crime warnings, Trump's camp still bragged that nothing was off the table on Iranian plants.",
        "synopsis": "CBS reported that Mike Waltz said the administration would 'never take anything off the table' on hitting Iranian plants even as the UN secretary-general warned attacks on energy infrastructure could amount to a war crime. That is the kind of sentence that strips away the euphemisms: civilian-linked systems are not a side issue to this crowd but leverage. When the menu stays open after the war-crime warning, the warning was never the point.",
        "rationale": "CBS documented the Trump camp treating civilian infrastructure as a live target set instead of backing away from it.",
        "source_url": "https://www.cbsnews.com/news/mike-waltz-iran-bombing-nuclear-plants-trump",
        "source_title": "Waltz: \"never take anything off the table\" on U.S. hitting Iran plants",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2111,
        "title": "Trump Gloated Over Robert Mueller's Death With a 'Good, I'm Glad'",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Moral Depravity",
        "subcategory": "Cruelty / Public Sadism",
        "metrics_key": "morality",
        "keywords": ["mueller death", "truth social cruelty", "public sadism", "trump quote", "moral depravity"],
        "scores": (6, 9, 6, 7, 5, 7, 9, 6),
        "rationale_short": "Trump responded to Mueller's death with schoolyard cruelty from the Oval Office equivalent.",
        "synopsis": "After Robert Mueller died, Trump went on Truth Social and said he was 'glad', turning a former federal official's death into one more cheap little revenge ritual. The reaction was revealing because there was no policy argument hiding behind it, no legal theory, just raw petty malice from a president who treats public life like a grudge jar. In a moral archive, this belongs right next to the big-ticket abuses because it shows the character underneath them.",
        "rationale": "The Guardian captured a quote-level moment of public sadism that no normal political whitewash can make respectable.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/trump-robert-mueller-death",
        "source_title": "‘Vile’ Trump condemned for gloating over Robert Mueller death",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2112,
        "title": "Trump's Iran War Started Stirring Anger Even in MAGA Country",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["maga backlash", "kentucky", "iran war anger", "war spending", "trump base"],
        "scores": (6, 4, 8, 7, 7, 7, 9, 8),
        "rationale_short": "Even some of Trump's own voters started asking why billions were going to war instead of back home.",
        "synopsis": "The Guardian reported anger in deeply red Kentucky as Trump's Iran war kept eating headlines, money, and attention while poor communities were told, as usual, to wait their turn. The significance is political as well as moral: even parts of the base could see the scam of endless patriotic theater abroad paired with domestic abandonment at home. When the backlash reaches MAGA country, the lie that this kind of war is automatically popular starts to crack.",
        "rationale": "The Guardian documented home-front blowback from a war Trump was still trying to sell as strength.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/trump-iran-war-stirs-anger-maga-kentucky",
        "source_title": "Trump’s Iran war stirs anger in Maga country Kentucky",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2113,
        "title": "Trump Sent ICE Into America's Airports as if the TSA Wasn't Already a Crisis Enough",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["ice airports", "tsa delays", "mission creep", "airport security", "trump crackdown"],
        "scores": (6, 5, 8, 8, 8, 7, 10, 8),
        "rationale_short": "Trump tried to turn airport chaos into another excuse to militarize everyday life with ICE.",
        "synopsis": "Trump announced that ICE agents would deploy to U.S. airports, effectively treating travel delays as an invitation to expand the immigration-policing state into one more ordinary civilian space. That move matters because it normalizes the idea that the answer to bureaucratic dysfunction is always more armed enforcement, more fear, and more mission creep. It is governance by uniform fetish: everything becomes a border, everyone becomes a suspect.",
        "rationale": "The Los Angeles Times reported a concrete Trump directive that widened ICE's role far beyond its already abusive footprint.",
        "source_url": "https://www.latimes.com/california/story/2026-03-22/trump-border-advisor-says-ice-to-deploy-to-u-s-airports-monday",
        "source_title": "Trump says ICE agents will deploy to U.S. airports Monday",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2114,
        "title": "Trump Used Viktor Orban's Far-Right Circus as a Networking Event",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Foreign Policy",
        "subcategory": "Authoritarian Alignment",
        "metrics_key": "authoritarian",
        "keywords": ["viktor orban", "far-right leaders", "budapest", "authoritarian alliance", "trump praise"],
        "scores": (6, 6, 7, 9, 6, 7, 10, 7),
        "rationale_short": "Trump publicly embraced Orban while Europe's far right gathered around the Hungarian strongman.",
        "synopsis": "Trump praised Viktor Orban as Europe’s far-right leaders converged in Budapest, effectively using the gathering to bless one of the modern right's favorite illiberal poster boys. This is not just atmosphere. Public admiration between strongmen helps launder authoritarian politics into normal conservative fellowship, as if muzzling institutions and demonizing minorities were merely a lifestyle brand. The point of cataloging it is to mark the alliance-making, not just the speeches.",
        "rationale": "The Guardian tied Trump's public praise to a broader far-right international scene rather than treating it as harmless flattery.",
        "source_url": "https://www.theguardian.com/world/2026/mar/22/trump-lauds-viktor-orban-far-right-leaders-gather-budapest",
        "source_title": "Trump lauds Viktor Orbán as Europe’s far-right leaders gather in Budapest",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2115,
        "title": "Trump and RFK Jr Hyped an Autism Drug the FDA Had to Quietly Walk Back",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Medical Disinformation",
        "metrics_key": "public_welfare",
        "keywords": ["autism drug", "leucovorin", "medical disinformation", "rfk jr", "fda walkback"],
        "scores": (7, 7, 8, 6, 6, 9, 10, 8),
        "rationale_short": "Trump helped sell false hope on autism treatment and left the cleanup to medicine after the headline.",
        "synopsis": "Trump and RFK Jr touted leucovorin as an autism treatment, only for the FDA to later narrow the approval back to folate deficiency after prescriptions surged. That sequence matters because medical crankery from the top is not merely embarrassing; it distorts care, fuels opportunism, and turns vulnerable families into an audience for political theater. The lie gets the microphone, the correction gets the footnote, and patients absorb the fallout.",
        "rationale": "The Guardian documented a classic Trump pattern: hype first, walk-back later, public confusion throughout.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/22/trump-rfk-jr-leucovorin-autism-fda",
        "source_title": "Trump and RFK Jr touted leucovorin as a treatment for autism. The FDA quietly walked it back",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2116,
        "title": "Trump Kept Rebuilding Homeland Security Around Loyalists by Pushing Markwayne Mullin",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Government Corruption",
        "subcategory": "Institutional Capture",
        "metrics_key": "corruption",
        "keywords": ["markwayne mullin", "dhs", "institutional capture", "homeland security", "trump loyalists"],
        "scores": (6, 5, 7, 8, 7, 7, 10, 7),
        "rationale_short": "Trump moved another loyalist toward the top of DHS after already torching the department for political use.",
        "synopsis": "The Senate advanced Markwayne Mullin to lead DHS after Trump had already fired Kristi Noem, underscoring how the department keeps being reshaped around personal loyalty and escalation rather than restraint. In this project, personnel moves count when the office in question controls surveillance, borders, detention, and emergency power. A hardline loyalist at DHS is not backstage gossip; it is architecture.",
        "rationale": "The Guardian treated Mullin's advance as the next institutional step in Trump's hard-power remaking of DHS.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/22/senate-advances-mullin-nomination-dhs-secretary",
        "source_title": "Senate advances Mullin nomination to lead DHS, paving way for confirmation",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2117,
        "title": "Trump Turned UFO File Theater Into Another Government Spectacle at aliens.gov",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "metrics_key": "morality",
        "keywords": ["aliens.gov", "ufo files", "spectacle politics", "uap release", "trump absurdity"],
        "scores": (8, 10, 4, 5, 4, 9, 10, 5),
        "rationale_short": "Trump transformed UFO disclosure into a kitschy government sideshow because even paranoia has to be branded.",
        "synopsis": "A month after Trump directed agencies to release UAP material, the government registered aliens.gov, which tells you almost everything you need to know about how spectacle colonizes governance in the Trump era. Even when the subject is supposedly official disclosure, the instinct is still branding, teasing, and attention harvesting. Funny, yes. Also revealing: the state gets refashioned as content.",
        "rationale": "The Guardian documented a concrete, weirdly perfect example of Trump-style clownshow governance leaking into official infrastructure.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/22/ufos-uaps-us-trump-files-release",
        "source_title": "Is the truth out there? US registers aliens.gov as Trump pledges UFO files release",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2118,
        "title": "Trump's Power-Plant Threat Prompted Iran to Threaten Regional Water and Energy Systems",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["power plants", "regional escalation", "water infrastructure", "energy systems", "trump threat"],
        "scores": (7, 5, 9, 8, 8, 8, 10, 10),
        "rationale_short": "Trump's infrastructure threats widened the list of systems millions of civilians depend on and put more of them at risk.",
        "synopsis": "After Trump's threat against Iranian power plants, Tehran responded by threatening Middle Eastern water and energy facilities relied on by millions. That does not dilute Trump's responsibility; it shows how quickly collective-punishment language spreads once one side starts treating civilian infrastructure like a chess piece. The threat chain is the story here: reckless escalation begets wider civilian peril.",
        "rationale": "The Guardian showed Trump's rhetoric producing a larger infrastructure-hostage logic across the region.",
        "source_url": "https://www.theguardian.com/world/2026/mar/22/iran-says-destroy-middle-east-infrastructure-us-energy-sites",
        "source_title": "Iran vows to destroy Middle East water and energy facilities if US attacks power plants",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2119,
        "title": "Trump's Student-Loan Chaos Left Millions Without a Clear Way to Pay",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "metrics_key": "public_welfare",
        "keywords": ["student loans", "save plan", "borrower confusion", "public welfare harm", "trump chaos"],
        "scores": (6, 5, 7, 6, 6, 7, 9, 8),
        "rationale_short": "Trump's education-policy churn stranded borrowers in confusion, delay, and bureaucratic whiplash.",
        "synopsis": "The Guardian reported frustration, anger, and confusion as the administration's handling of student loans left millions of borrowers without a clear path forward. This is the less cinematic version of cruelty that Trumpism excels at: not one giant speech, but a maze of institutional sabotage that exhausts ordinary people until they give up. When the government cannot answer basic questions about repayment, the chaos is not incidental. It is the harm.",
        "rationale": "The Guardian tied borrower confusion to concrete Trump-era policy churn and administrative disarray.",
        "source_url": "https://www.theguardian.com/money/2026/mar/21/student-loans-save-plan-frustration",
        "source_title": "‘Frustration, anger, confusion’: Trump administration leaves millions without clear path to paying off student loans",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2120,
        "title": "Trump's Economic Shocks Started Derailing Building Plans Abroad Too",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["britain building plans", "economic shocks", "housing pressure", "public amenities", "trump fallout"],
        "scores": (6, 5, 7, 6, 6, 7, 9, 8),
        "rationale_short": "Trump's economic chaos was hitting housing, public amenities, and development plans far beyond the United States.",
        "synopsis": "The Guardian tracked major developments in Britain faltering as Trump's economic shocks rippled outward, pressuring local governments to cut affordable housing and public amenities. That matters because Trump's economic vandalism is never confined to one flag or one press room. The blast radius includes other countries' budgets, other communities' homes, and other governments' capacity to govern.",
        "rationale": "The Guardian treated Trump's instability as a real export with visible consequences abroad.",
        "source_url": "https://www.theguardian.com/business/2026/mar/21/trumps-economic-shocks-are-derailing-britains-building-plans",
        "source_title": "Trump’s economic shocks are derailing Britain’s building plans",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2121,
        "title": "Record Deaths in Immigration Custody Kept Mounting Under Trump's System",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["immigration custody deaths", "detention deaths", "poor care", "ice detention", "trump system"],
        "scores": (6, 5, 9, 8, 8, 7, 9, 9),
        "rationale_short": "Deaths in custody turned Trump's detention machine into a body-count story as well as a policy one.",
        "synopsis": "The Guardian reported record deaths in U.S. immigration custody amid complaints of poor care, opaque investigations, and a bureaucracy built to swallow accountability. This is what happens when cruelty gets institutionalized and then explained away with paperwork. The archive has to count these stories because detention deaths are not background conditions; they are the moral output of the system Trump keeps hardening.",
        "rationale": "The Guardian documented the human toll of a detention regime Trump continued to expand and normalize.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/ice-deaths-trump-administration",
        "source_title": "Record deaths in US immigration custody expose systemic failures",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2122,
        "title": "Trump's Crackdown Started Undermining Even Legal Immigrants",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["legal immigrants", "status insecurity", "immigration crackdown", "state harassment", "trump administration"],
        "scores": (6, 5, 8, 8, 8, 7, 9, 8),
        "rationale_short": "Trump's immigration machinery was no longer just about the undocumented; it was chewing through legal status too.",
        "synopsis": "The Guardian detailed how the administration was targeting not just people accused of violating the law but many who were in the country legally, showing again how fast 'border security' mutates into generalized state harassment. That distinction matters because the sales pitch for crackdowns always starts narrower than the machine that gets built. Once the apparatus grows, legality stops being a shield and becomes another hoop the government can set on fire.",
        "rationale": "The Guardian showed Trump's immigration offensive expanding into legally present populations, not just the usual political targets.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/trump-administration-legal-immigration",
        "source_title": "How the Trump administration is undermining legal immigrants",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2123,
        "title": "Trump Was 'Very Surprised' Allies Wouldn't Join His Hormuz Adventure",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "war",
        "keywords": ["australia", "strait of hormuz", "allies refused", "fuel crisis", "trump surprise"],
        "scores": (6, 6, 8, 7, 7, 8, 9, 8),
        "rationale_short": "Trump acted shocked that Australia would not sign up for a conflict he was already making more combustible.",
        "synopsis": "Trump said he was 'very surprised' Australia declined to send troops to the Strait of Hormuz, which is rich coming from a president who spent the week oscillating between begging allies for help and insisting he didn't need them. The significance is diplomatic and psychological at once: he keeps treating allied reluctance as betrayal rather than as a rational response to bad strategy. That is how coalition politics turns into a toddler grievance.",
        "rationale": "The Guardian captured another moment where Trump's war posture collided with allied refusal and exposed the brittleness of his diplomacy.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/donald-trump-surprised-australia-strait-of-hormuz-fuel-prices",
        "source_title": "Donald Trump ‘very surprised’ Australia declined to send troops to strait of Hormuz amid fuel crisis",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2124,
        "title": "Trump Swung From Begging for Help in Hormuz to Claiming 'We Don't Need' It",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "metrics_key": "war",
        "keywords": ["we don't need hormuz", "allies refused", "strategic whiplash", "trump quote", "strait of hormuz"],
        "scores": (7, 7, 8, 7, 7, 9, 9, 8),
        "rationale_short": "Trump rewrote the Strait of Hormuz story on the fly after allies refused to play along.",
        "synopsis": "When allies would not help escort ships, Trump abruptly said the United States did not need the Strait of Hormuz anyway, as if a chokepoint suddenly stopped mattering because the coalition did. That kind of rhetorical whiplash is not just unserious; it is a lie-management strategy designed to make every contradiction feel disposable. If the facts become inconvenient, he simply declares a new reality and dares memory to keep up.",
        "rationale": "PBS captured Trump's attempt to spin allied rejection into fake strategic confidence.",
        "source_url": "https://www.pbs.org/newshour/politics/watch-trump-says-we-dont-need-strait-of-hormuz-after-allies-wont-help-u-s-escort-ships",
        "source_title": "WATCH: Trump says 'we don't need' Strait of Hormuz after allies won't help U.S. escort ships",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2125,
        "title": "Trump's Team Began Preparing for Ground Troops in Iran",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["ground troops", "iran preparations", "escalation ladder", "boots on the ground", "trump team"],
        "scores": (7, 5, 10, 8, 8, 8, 9, 10),
        "rationale_short": "The administration moved from leaving the door open to actually preparing for ground troops in Iran.",
        "synopsis": "CBS reported preparations for the potential use of U.S. ground troops in Iran, showing the escalation ladder had moved beyond casual rhetorical flirting. This is exactly why 'he's just talking' is such a stupid defense in Trump-world. The talk keeps turning into planning, and the planning keeps narrowing the distance to catastrophe.",
        "rationale": "CBS documented a concrete escalation step beyond Trump's earlier refusal to rule ground troops out.",
        "source_url": "https://www.cbsnews.com/news/trump-administration-iran-ground-troop-preparations",
        "source_title": "U.S. preparing for potential use of ground troops in Iran",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2126,
        "title": "Trump Made a Pearl Harbor Joke With Japan's Prime Minister Right There",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Moral Depravity",
        "subcategory": "Humiliating Absurdity",
        "metrics_key": "morality",
        "keywords": ["pearl harbor joke", "japan prime minister", "war absurdity", "trump quote", "diplomatic disgrace"],
        "scores": (7, 10, 6, 6, 4, 8, 8, 6),
        "rationale_short": "Trump treated one of history's most traumatic attacks like open-mic material while discussing another war.",
        "synopsis": "Asked about surprise attacks on Iran, Trump joked about Pearl Harbor with Japan's prime minister sitting nearby: 'Who knows better about surprise than Japan?' The line was grotesque and revealing at the same time. Even in war, even in diplomacy, even in front of a visiting leader, he reaches for the same cheap comic instinct that turns memory, death, and catastrophe into props for himself.",
        "rationale": "The Los Angeles Times documented a quote-level Trump moment too debased and too revealing to let drift away.",
        "source_url": "https://www.latimes.com/world-nation/story/2026-03-19/trump-cracks-joke-about-pearl-harbor",
        "source_title": "Trump cracks a joke about Pearl Harbor, with Japanese PM sitting nearby",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2127,
        "title": "Trump Started Gaming Out How to Seize Iran's Nuclear Stockpiles",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["nuclear stockpiles", "seizure planning", "iran nuclear materials", "mission creep", "trump strategy"],
        "scores": (7, 6, 9, 8, 8, 8, 9, 10),
        "rationale_short": "Trump's team was already planning how to physically grab Iran's nuclear material as the war widened.",
        "synopsis": "CBS reported that the administration was strategizing ways to secure or extract Iran's nuclear materials, which tells you the conflict was already mutating beyond airstrikes and bluffing into occupation-style fantasies. This matters because wars expand first in the planning rooms, long before the public is told how much deeper the mission has become. The phrase 'secure the stockpiles' may sound technocratic, but it hides a much larger appetite underneath.",
        "rationale": "CBS documented the war moving into seizure scenarios rather than remaining a limited strike campaign.",
        "source_url": "https://www.cbsnews.com/news/trump-is-strategizing-means-to-seize-irans-nuclear-stockpiles-sources-say",
        "source_title": "Trump is strategizing means to seize Iran's nuclear stockpiles, sources say",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2128,
        "title": "Trump Lifted Sanctions on Iranian Oil at Sea After Helping Drive Prices Up",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["iranian oil", "sanctions relief", "oil prices", "economic incoherence", "trump administration"],
        "scores": (6, 6, 7, 6, 6, 8, 9, 8),
        "rationale_short": "Trump helped light the fire and then loosened sanctions when the oil market started punishing him for it.",
        "synopsis": "CBS reported that the administration temporarily authorized purchases of Iranian oil already at sea as high fuel prices squeezed the White House politically. The move mattered because it exposed the incoherence at the heart of Trump's Iran posture: maximum aggression in public, policy improvisation in private once the market bites back. Strongman theater is easy until gas prices start talking.",
        "rationale": "CBS showed Trump bending his own economic-warfare posture once the blowback became politically inconvenient.",
        "source_url": "https://www.cbsnews.com/news/trump-administration-temporarily-lifts-sanctions-on-iranian-oil-at-sea",
        "source_title": "Trump administration temporarily lifts sanctions on Iranian oil at sea",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2129,
        "title": "Trump Used Antisemitism Claims as Another Club Against Harvard",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Authoritarianism",
        "subcategory": "Academic Crackdown",
        "metrics_key": "authoritarian",
        "keywords": ["harvard lawsuit", "academic crackdown", "weaponized civil rights", "institutional pressure", "trump administration"],
        "scores": (6, 5, 7, 8, 7, 8, 9, 7),
        "rationale_short": "Trump's team sued Harvard again, turning civil-rights language into another instrument of institutional intimidation.",
        "synopsis": "The Guardian reported that the administration sued Harvard again over antisemitism claims, continuing a pattern in which Trump uses a real social evil as a pretext for raw pressure on disfavored institutions. That is what makes the move worth cataloging. It is not only about the lawsuit itself but about the habit of converting rights language into a cudgel for political control.",
        "rationale": "The Guardian framed the Harvard case as part of a wider Trump pattern of weaponized institutional pressure.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/20/trump-administration-new-harvard-lawsuit-antisemitism",
        "source_title": "Trump administration sues Harvard again over accusations of antisemitism",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2130,
        "title": "Trump Lost in Court After the Pentagon Tried to Choke Reporter Access",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Press Freedom",
        "subcategory": "Media Intimidation",
        "metrics_key": "press",
        "keywords": ["pentagon reporters", "new york times", "press access", "media intimidation", "court block"],
        "scores": (6, 5, 7, 8, 7, 8, 9, 7),
        "rationale_short": "A federal judge blocked Trump's Pentagon access rules because even the court could see the press squeeze for what it was.",
        "synopsis": "A federal judge sided with The New York Times and blocked key parts of the Pentagon policy limiting reporters' access, ruling that the Trump administration's new restrictions were unlawful. This is exactly how press intimidation works in practice: not always one dramatic ban, but a thicket of access rules designed to punish scrutiny and domesticate coverage. When a court has to tell the Pentagon not to play games with the press, the game was already obvious.",
        "rationale": "PBS documented a concrete legal setback for Trump's ongoing effort to squeeze reporters through access rules.",
        "source_url": "https://www.pbs.org/newshour/politics/judge-sides-with-new-york-times-in-challenge-to-pentagon-policy-limiting-reporters-access",
        "source_title": "Judge sides with New York Times in challenge to Pentagon policy limiting reporters' access",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2131,
        "title": "Trump's FBI Purge Blew Back Into Court",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Government Corruption",
        "subcategory": "Political Retaliation",
        "metrics_key": "corruption",
        "keywords": ["fbi agents", "2020 election probe", "political retaliation", "federal lawsuit", "trump purge"],
        "scores": (6, 5, 7, 8, 8, 8, 9, 8),
        "rationale_short": "Former FBI agents say they were fired because they worked on the Trump election probe, turning vengeance into staffing policy.",
        "synopsis": "Two former FBI agents said in a federal lawsuit that they were fired solely because of their roles in the investigation into Trump's effort to overturn the 2020 election. That belongs in the archive because retaliation is one of the cleanest through-lines in Trumpism: use power, settle scores, punish investigators, repeat. The lawsuit turns rumor into a documented allegation about how the state gets bent around the leader's grudges.",
        "rationale": "PBS reported a formal legal challenge alleging Trump-world retaliation inside federal law enforcement.",
        "source_url": "https://www.pbs.org/newshour/politics/2-former-fbi-agents-say-they-were-fired-over-their-roles-in-trump-2020-election-probe",
        "source_title": "2 former FBI agents say they were fired over their roles in Trump 2020 election probe",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2132,
        "title": "Trump's Health Department Started Targeting States Over Abortion Coverage",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Human Rights Violations",
        "subcategory": "Reproductive Rights Rollback",
        "metrics_key": "public_welfare",
        "keywords": ["abortion coverage", "weldon amendment", "reproductive rights", "hhs investigation", "trump administration"],
        "scores": (6, 5, 8, 7, 7, 7, 9, 8),
        "rationale_short": "Trump's administration opened a new front against abortion access by pressuring states over insurance coverage.",
        "synopsis": "The federal health department opened investigations into 13 states that require some insurance plans to cover abortion, using the Weldon amendment as the newest weapon in the administration's rights rollback. This is the sort of bureaucratic assault that can look technical until you remember what it means in real life: narrower care, greater fear, and more state power over intimate decisions. The paperwork is the method, not the excuse.",
        "rationale": "The Guardian documented a concrete Trump-era escalation against abortion coverage at the state level.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/20/trump-administration-abortion-mandate-investigation",
        "source_title": "US health department investigates 13 states that require insurance plans to cover abortion",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2133,
        "title": "Trump's Iran War Sent Americans Looking at EVs Because Gas Prices Were Getting Mugged",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["gas prices", "electric vehicles", "consumer behavior", "iran war", "trump fallout"],
        "scores": (6, 6, 8, 6, 6, 7, 9, 8),
        "rationale_short": "Trump's war helped jack up fuel costs hard enough to reshape consumer behavior at home.",
        "synopsis": "The Guardian reported a surge in U.S. interest in electric and hybrid cars as war-linked gas prices jumped to their highest level in nearly three years. Even this strange secondary effect is worth cataloging because it shows how foreign-policy vanity gets translated into everyday economic behavior. Trump's war posture did not stay on the cable-news set; it followed people to the pump.",
        "rationale": "The Guardian tied consumer reaction and fuel-price pressure directly to the war Trump helped intensify.",
        "source_url": "https://www.theguardian.com/business/2026/mar/21/us-gas-price-surge-iran-electric-cars",
        "source_title": "US interest in electric vehicles surges as gas prices jump amid Iran war",
        "source_publisher": "The Guardian",
    },
]


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

for e in entries:
    insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope = e["scores"]
    rationale_short = e["rationale_short"]

    scores = {
        "danger": danger,
        "insanity": insanity,
        "absurdity": absurdity,
        "lawlessness": lawlessness,
        "impact_scope": impact_scope,
        "rationale_short": rationale_short,
        "authoritarianism": authoritarianism,
        "credibility_risk": credibility_risk,
        "rationale_detail": f"{e['category']}: {e['subcategory']}. On {format_date(e['date_start'])}, {rationale_short}",
        "recency_intensity": recency_intensity,
    }

    metric = metrics[e["metrics_key"]]

    entry_vals.append(
        "("
        + ", ".join(
            [
                str(e["entry_number"]),
                f"'{sql_escape(e['title'])}'",
                f"'{e['date_start']}'",
                f"'{e['date_end']}'",
                f"'{sql_escape(e['synopsis'])}'",
                f"'{sql_escape(e['rationale'])}'",
                f"'{sql_escape(e['category'])}'",
                f"'{sql_escape(e['subcategory'])}'",
                arr_sql(e["keywords"]),
                str(calc_age(e["date_start"])),
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
                str(e["entry_number"]),
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
                str(e["entry_number"]),
                f"'{sql_escape(e['source_url'])}'",
                f"'{sql_escape(e['source_title'])}'",
                f"'{sql_escape(e['source_publisher'])}'",
                f"'{e['date_start']}'",
                "'news'",
            ]
        )
        + ")"
    )

    for kw in e["keywords"]:
        keyword_vals.append("(" + ", ".join([str(e["entry_number"]), f"'{sql_escape(kw)}'"]) + ")")

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
