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
    "environment": {
        "impressions": 176000000,
        "reach_estimate": 602000000,
        "financial_cost_usd": 530000000,
        "public_reaction": {"negative": 81, "neutral": 13, "positive": 6},
    },
}


entries = [
    {
        "entry_number": 2194,
        "title": "Trump's White House Declared His Iran War Objectives 'Unchanging' After Weeks of Contradictions",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "National Security Violations",
        "subcategory": "War Propaganda",
        "metrics_key": "war",
        "keywords": ["white house release", "operation epic fury", "iran war", "propaganda", "contradictions"],
        "scores": (7, 7, 6, 7, 5, 10, 10, 8),
        "rationale_short": "The White House had to turn Trump's war whiplash into a glossy myth of steady genius.",
        "synopsis": "The White House published an official release insisting Trump's objectives against Iran had been clear and unchanging all along, even after days of mixed signals about surrender, regime change, diplomacy, and escalation. That is not just spin. It is the state memo version of gaslighting, where public contradiction gets laundered into a story of iron discipline because admitting chaos would expose how recklessly the war was being sold to the public.",
        "rationale": "The White House itself supplied the evidence of narrative laundering by trying to rewrite Trump's visibly inconsistent war messaging into a tale of strategic coherence.",
        "source_url": "https://www.whitehouse.gov/releases/2026/04/president-trumps-clear-and-unchanging-objectives-drive-decisive-success-against-iranian-regime/",
        "source_title": "President Trump's Clear and Unchanging Objectives Drive Decisive Success Against Iranian Regime",
        "source_publisher": "The White House",
    },
    {
        "entry_number": 2195,
        "title": "Trump Addressed the Nation on Iran While His Own White House Was Sending Mixed Signals",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "National Security Violations",
        "subcategory": "War Messaging Chaos",
        "metrics_key": "war",
        "keywords": ["address to nation", "mixed signals", "iran war", "white house chaos", "messaging"],
        "scores": (7, 6, 7, 6, 5, 9, 10, 8),
        "rationale_short": "Trump tried to play wartime father of the nation while his own team could not keep the story straight.",
        "synopsis": "NPR framed Trump's national address on Iran around the obvious problem: the White House was already emitting conflicting signals about the war. That matters because the speech was not arriving into clarity. It was arriving into confusion manufactured by Trump himself, a president who likes the aura of command but keeps governing by contradictory improvisation, then asks the country to hear certainty in the static.",
        "rationale": "NPR made the contradiction itself the story, showing Trump's address as an attempt to impose authority after his own camp had scrambled the message.",
        "source_url": "https://www.npr.org/2026/04/01/nx-s1-5770091/amidst-conflicting-signals-trump-addresses-nation-on-iran-war",
        "source_title": "Amidst conflicting signals, Trump addresses nation on Iran war",
        "source_publisher": "NPR",
    },
    {
        "entry_number": 2196,
        "title": "Trump Turned a Supreme Court Hearing Into Another Presidential Power Flex",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Authoritarianism",
        "subcategory": "Institutional Intimidation",
        "metrics_key": "authoritarian",
        "keywords": ["supreme court", "front row", "birthright citizenship", "presidential flex", "institutional intimidation"],
        "scores": (6, 8, 5, 8, 6, 7, 10, 7),
        "rationale_short": "Even sitting quietly, Trump managed to make a Supreme Court argument feel like a dominance display.",
        "synopsis": "PBS described Trump taking a front-row public seat at Supreme Court arguments, something no sitting president had done before, while his administration defended its attack on birthright citizenship. The point was not courtroom etiquette alone. It was the performance of presence, a silent reminder that he treats institutions as stages to loom over, with power performed as proximity, spectacle, and barely disguised pressure.",
        "rationale": "PBS captured the appearance as a historically abnormal power move tied directly to one of Trump's most exclusionary legal projects.",
        "source_url": "https://www.pbs.org/newshour/politics/whispers-in-the-supreme-court-as-trump-takes-a-front-row-seat-for-oral-arguments",
        "source_title": "Whispers in the Supreme Court as Trump takes a front-row seat for oral arguments",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2197,
        "title": "Trump's Deportation Machine Was So Warehousing-Obsessed DHS Had to Pause New Immigrant Holding Deals",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["immigrant warehouses", "detention contracts", "DHS", "mass deportation", "Noem-era contracts"],
        "scores": (6, 7, 7, 7, 6, 7, 10, 8),
        "rationale_short": "Trump's mass-deportation project got so warehouse-hungry that DHS had to freeze the latest deals and take a look around.",
        "synopsis": "PBS reported that DHS paused the purchase of new warehouses meant to hold immigrants while it reviewed contracts signed during the department's most scandal-soaked stretch. The pause does not redeem the policy. It reveals the scale and crudity of what Trump built: an industrial detention pipeline where migrants become inventory, storage space becomes strategy, and administrative excess is just another word for planned cruelty.",
        "rationale": "PBS tied the contract pause directly to the same detention-and-deportation machinery Trump has kept pushing as a flagship project.",
        "source_url": "https://www.pbs.org/newshour/politics/dhs-pauses-new-immigrant-warehouse-purchases-as-all-noem-era-contracts-are-reviewed",
        "source_title": "DHS pauses new immigrant warehouse purchases as all Noem-era contracts are reviewed",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2198,
        "title": "Trump Started Rewriting the Foreign Service Exam Around 'America First' Loyalty",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Authoritarianism",
        "subcategory": "Ideological Vetting",
        "metrics_key": "authoritarian",
        "keywords": ["foreign service officer test", "america first", "state department", "ideological vetting", "loyalty filter"],
        "scores": (6, 7, 5, 8, 6, 8, 10, 7),
        "rationale_short": "Trump wanted diplomats tested not just on competence, but on how well they fit the creed.",
        "synopsis": "CBS reported that the State Department was modifying the Foreign Service Officer Test to reflect Trump's foreign-policy goals. That sounds bureaucratic until you say it plainly: the administration was retooling the gateway exam for diplomacy so career service bends harder toward ideology. A government that keeps confusing public service with personal doctrine eventually starts grading loyalty like it is merit.",
        "rationale": "CBS documented a concrete mechanism by which Trumpism was being written into the pipeline that selects future diplomats.",
        "source_url": "https://www.cbsnews.com/news/foreign-service-officer-test-state-department-overhaul",
        "source_title": "State Department overhauls Foreign Service Officer Test",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2199,
        "title": "Trump Dropped Sanctions on Venezuela's New Strongman Months After Pretending This Was About Freedom",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Foreign Policy",
        "subcategory": "Authoritarian Alignment",
        "metrics_key": "war",
        "keywords": ["venezuela", "delcy rodriguez", "sanctions lifted", "authoritarian alignment", "foreign policy hypocrisy"],
        "scores": (6, 6, 6, 6, 5, 8, 10, 7),
        "rationale_short": "Trump's freedom talk kept collapsing the second a new deal with strongmen looked more convenient.",
        "synopsis": "CBS reported that the Trump administration lifted sanctions on Delcy Rodriguez as it moved to normalize relations with Venezuela's new leadership. The hypocrisy is the entry. Trump wraps foreign policy in sermons about strength and liberty, then drops the moral costume the second transactional convenience arrives, proving again that his principles are mostly decorative packaging for whatever bargain flatters him next.",
        "rationale": "CBS showed Trump abandoning punitive posturing when rapprochement with an authoritarian-friendly government became politically useful.",
        "source_url": "https://www.cbsnews.com/news/trump-administration-lifts-sanctions-delcy-rodriguez-venezuela-acting-president",
        "source_title": "Trump admin. lifts sanctions on Delcy Rodriguez, Venezuela's acting president",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2200,
        "title": "Trump Moved the Forest Service Out of Washington in Another Attack on Scientists Who Wouldn't Play Along",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Environmental Destruction",
        "subcategory": "Scientific Integrity Rollback",
        "metrics_key": "environment",
        "keywords": ["forest service", "salt lake city", "scientists", "agency hollowing", "reorganization"],
        "scores": (5, 6, 6, 6, 5, 7, 10, 7),
        "rationale_short": "Moving the Forest Service looked less like reform than another round of making expertise quit on cue.",
        "synopsis": "The Guardian reported that Trump's administration would move the US Forest Service headquarters from Washington to Salt Lake City, reviving a familiar relocation tactic critics described as an attack on science and scientists. The cruelty here is managerial rather than theatrical. Shift the office, shred the continuity, and watch experienced staff disappear while calling the self-inflicted hollowing-out a commonsense efficiency measure.",
        "rationale": "The Guardian framed the move as part of a deliberate pattern in which structural disruption is used to drain agencies of expertise.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/us-forest-service-washington-dc-salt-lake-city",
        "source_title": "US Forest Service to move headquarters from Washington DC to Salt Lake City",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2201,
        "title": "Trump's Clean-Energy Sabotage Helped Turn Great Lakes Hydropower Into a Desperate Scramble",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Environmental Destruction",
        "subcategory": "Clean-Energy Sabotage",
        "metrics_key": "environment",
        "keywords": ["hydropower", "great lakes", "clean energy", "energy prices", "rollback"],
        "scores": (5, 5, 6, 5, 4, 6, 9, 7),
        "rationale_short": "Trump kept kneecapping cleaner options, then acted shocked when everyone scrambled for the leftovers.",
        "synopsis": "The Guardian described surging demand for hydropower in the Great Lakes region as Trump kept clamping down on clean energy more broadly. The article was about energy markets, but the political story is uglier. When a president spends months slowing the cleaner transition, every surviving alternative gets pushed into emergency-duty mode while households and regions absorb the higher cost of his fossil-fuel nostalgia.",
        "rationale": "The Guardian linked Trump-era clean-energy repression to a real scramble for replacement generation rather than treating rollback as an abstract ideological fight.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/30/hydropower-great-lakes-clean-energy",
        "source_title": "Demand for hydropower surges as Trump clamps down on clean energy",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2202,
        "title": "Trump Relaxed His Cuba Oil Blockade the Second It Became Inconvenient",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "Foreign Policy",
        "subcategory": "Sanctions Hypocrisy",
        "metrics_key": "war",
        "keywords": ["cuba", "oil blockade", "russian tanker", "sanctions hypocrisy", "policy whiplash"],
        "scores": (5, 6, 5, 5, 5, 8, 8, 6),
        "rationale_short": "Trump's blockade toughness lasted exactly as long as it remained theatrically useful.",
        "synopsis": "The Guardian reported that Trump appeared to relax the oil blockade on Cuba as a Russian tanker approached the island, with the president suddenly sounding far less rigid about who could ship fuel there. The episode belongs here because it captures the hollowness of so much Trump policy bravado. The moral line is always painted thickest right before it is quietly stepped over for convenience.",
        "rationale": "The Guardian documented a sudden sanctions softening that exposed how performative Trump's posture on Cuba had been.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/29/us-russian-oil-tanker-cuba-blockade",
        "source_title": "Trump appears to relax oil blockade on Cuba as Russian tanker arrives",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2203,
        "title": "Trump's FBI Kept Chasing a Smear File on Eric Swalwell for the Politics of It",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "Government Corruption",
        "subcategory": "Political Retaliation",
        "metrics_key": "corruption",
        "keywords": ["Eric Swalwell", "FBI", "Kash Patel", "smear", "political retaliation"],
        "scores": (5, 6, 5, 7, 7, 8, 8, 7),
        "rationale_short": "Trump's FBI still knew how to turn stale innuendo into a fresh political weapon.",
        "synopsis": "The Guardian reported that Trump's FBI pushed for the release of an Eric Swalwell file tied to a decade-old inquiry in which he was not accused of wrongdoing. This is one of the cleaner examples of retaliatory governance: use the prestige of law enforcement to fling grime at an opponent, not because the case is alive, but because the smear still has mileage.",
        "rationale": "The Guardian showed the bureau's file release push as a political act, not a neutral disclosure in service of public safety.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/30/eric-swalwell-fbi-kash-patel",
        "source_title": "Democrats decry 'smear' as Trump FBI pushes for release of Eric Swalwell file",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2204,
        "title": "Trump Called Mail Voting 'Cheating' Days After Using It Himself",
        "date_start": "2026-03-24",
        "date_end": "2026-03-24",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Voting Restrictions",
        "metrics_key": "authoritarian",
        "keywords": ["mail voting", "cheating", "hypocrisy", "florida ballot", "election lies"],
        "scores": (6, 8, 5, 7, 6, 10, 8, 7),
        "rationale_short": "Trump kept demonizing a voting method he had just personally used, because shamelessness is part of the product.",
        "synopsis": "The Guardian reported that Trump called mail voting 'cheating' at an event only days after casting his own ballot by mail in Florida. This is not mere hypocrisy in the ordinary political sense. It is a live demonstration of how he weaponizes cynicism: he does the thing, condemns the thing, and counts on supporters treating the contradiction as proof of strength rather than fraudulence.",
        "rationale": "The Guardian captured Trump's anti-mail-voting rhetoric colliding immediately with his own conduct, which is exactly how his election mythmaking keeps operating.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/24/trump-mail-in-voting-cheating-ballot",
        "source_title": "Trump calls voting by mail 'cheating' just days after voting by mail",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2205,
        "title": "Trump Put His Signature on U.S. Currency Like the Country Was Another Piece of Merch",
        "date_start": "2026-03-26",
        "date_end": "2026-03-26",
        "category": "Moral Depravity",
        "subcategory": "Vanity / Cult of Personality",
        "metrics_key": "morality",
        "keywords": ["currency", "signature", "cult of personality", "vanity", "merch politics"],
        "scores": (6, 9, 4, 5, 4, 7, 8, 6),
        "rationale_short": "Trump's instinct on national symbolism remained the same as ever: slap his name on it and call that history.",
        "synopsis": "The Guardian reported that Trump's signature would appear on US currency in a break with longstanding practice. The reason this belongs in the catalog is not paperwork trivia. It is the permanent Trump urge to turn institutions, buildings, and symbols of shared public life into branded surfaces for himself, as if the republic were just a luxury product line with better security.",
        "rationale": "The Guardian documented a literal cult-of-personality flourish disguised as commemorative administration business.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/26/trump-signature-us-bills-currency",
        "source_title": "Trump signature to appear on US currency in first for sitting president",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2206,
        "title": "Trump Dragged a Columbus Statue Onto White House Grounds for Another Culture-War Spectacle",
        "date_start": "2026-03-23",
        "date_end": "2026-03-23",
        "category": "Moral Depravity",
        "subcategory": "Culture-War Spectacle",
        "metrics_key": "morality",
        "keywords": ["christopher columbus", "white house grounds", "culture war", "monument politics", "spectacle"],
        "scores": (6, 9, 4, 5, 4, 6, 7, 6),
        "rationale_short": "Trump kept treating the White House lawn like a stage set for grievance nostalgia.",
        "synopsis": "The Guardian reported that Trump erected a Christopher Columbus statue on White House grounds using fragments from a monument thrown into Baltimore's harbor in 2020. It was a perfect little Trump vignette: turn historical conflict into set decoration, canonize resentment as leadership, and substitute symbolic trolling for anything remotely resembling humane national memory.",
        "rationale": "The Guardian showed the statue stunt as pure culture-war theater, designed less to honor history than to inflame and signal allegiance.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/23/trump-christopher-columbus-statue",
        "source_title": "Trump erects statue of Christopher Columbus in White House grounds",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2207,
        "title": "Trump Made a Manosphere Troll America's Tourism Envoy Because Even Patronage Has Become a Bit",
        "date_start": "2026-03-24",
        "date_end": "2026-03-24",
        "category": "Government Corruption",
        "subcategory": "Crony Absurdity",
        "metrics_key": "corruption",
        "keywords": ["Nick Adams", "tourism envoy", "manosphere", "patronage", "MAGA influencer"],
        "scores": (7, 10, 4, 6, 5, 7, 7, 5),
        "rationale_short": "Trump handed a public-facing role to a professional troll because the administration keeps mistaking sycophancy for talent.",
        "synopsis": "The Guardian reported that Trump named MAGA influencer Nick Adams, a manosphere-style provocateur, to a tourism and values role. This is not just a goofy appointment. It shows how the administration keeps stocking public offices with people chosen for flattery, online performance, and ideological noise instead of competence, dignity, or anything resembling adult judgment.",
        "rationale": "The Guardian documented the appointment as a comic but revealing example of Trumpist patronage culture.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/24/trump-nick-adams-presidential-envoy",
        "source_title": "Welcome to America! Trump names 'manosphere' troll as tourism envoy",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2208,
        "title": "Trump Claimed 'Productive' Iran Talks Were Happening and Tehran Said That Never Happened",
        "date_start": "2026-03-24",
        "date_end": "2026-03-24",
        "category": "National Security Violations",
        "subcategory": "Diplomatic Deceit",
        "metrics_key": "war",
        "keywords": ["productive talks", "tehran denies contact", "iran war", "deadline extension", "diplomatic deceit"],
        "scores": (7, 7, 7, 6, 5, 10, 7, 8),
        "rationale_short": "Trump kept narrating diplomacy into existence even when the other side said the call never happened.",
        "synopsis": "The Guardian reported that Trump described talks with Iran as productive while Tehran denied any contact at all, even as he extended a deadline tied to the Strait of Hormuz and energy infrastructure. That combination is textbook Trump: invent forward motion, attach it to a threat, and hope the performance of negotiation is enough to obscure the fact that he is freelancing reality again.",
        "rationale": "The Guardian documented a direct contradiction between Trump's diplomatic boasting and Iran's denial that such contact occurred.",
        "source_url": "https://www.theguardian.com/world/2026/mar/23/trump-extends-iran-deadline-five-days-energy-infrastructure",
        "source_title": "Trump claims 'productive' talks with Iran but Tehran denies contact",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2209,
        "title": "Trump Floated a 15-Point 'Peace' Plan While Sending More Troops Into the Region",
        "date_start": "2026-03-25",
        "date_end": "2026-03-25",
        "category": "National Security Violations",
        "subcategory": "False Peace Branding",
        "metrics_key": "war",
        "keywords": ["15-point plan", "peace plan", "troop deployment", "iran", "false peace branding"],
        "scores": (7, 7, 8, 6, 5, 9, 8, 9),
        "rationale_short": "Trump's peace plan arrived with extra Marines in the background, which tells you what kind of peace he meant.",
        "synopsis": "The Los Angeles Times reported that the Trump administration pushed a 15-point ceasefire plan to Iran while the Pentagon simultaneously sent more Marines, paratroopers, and naval force into the region. The contradiction is the whole entry. Trump keeps marketing coercion as peacemaking, as if a ceasefire offer flanked by fresh troop movements is statesmanship rather than leverage theater with bloodier options parked just offshore.",
        "rationale": "The Los Angeles Times laid out the split-screen between Trump's peace branding and the administration's continued military buildup.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-25/iran-dismisses-trumps-peace-plan-as-deceptive-as-u-s-deploys-more-troops-to-mideast",
        "source_title": "Iran dismisses Trump's peace plan as 'deceptive,' as U.S. deploys more troops to Mideast",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2210,
        "title": "Trump Bragged That Iran's Missile Threat Was Basically Gone and Intelligence Said Not Even Close",
        "date_start": "2026-03-28",
        "date_end": "2026-03-28",
        "category": "National Security Violations",
        "subcategory": "War Deceit",
        "metrics_key": "war",
        "keywords": ["missile arsenal", "intelligence", "exaggeration", "iran war", "war deceit"],
        "scores": (6, 6, 7, 5, 5, 10, 8, 8),
        "rationale_short": "Trump sold a triumph that intelligence reporting said was nowhere near as complete as advertised.",
        "synopsis": "The Guardian reported on intelligence suggesting the US had destroyed only about a third of Iran's missile capacity, directly undercutting Trump's much grander claims. The significance is bigger than one boast. Inflating battlefield success is how leaders manufacture patience for longer wars, conceal failed objectives, and keep the public one victory speech behind the truth.",
        "rationale": "The Guardian, citing Reuters reporting, placed a hard reality check on Trump's efforts to oversell the military results.",
        "source_url": "https://www.theguardian.com/world/2026/mar/28/us-destroyed-third-iran-missiles-intelligence-suggests-trump",
        "source_title": "US has destroyed only a third of Iran's missiles, intelligence suggests",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2211,
        "title": "Trump's 'Make America Healthy Again' Slogan Could Not Even Fill the Jobs Needed to Run Public Health",
        "date_start": "2026-03-26",
        "date_end": "2026-03-26",
        "category": "Public Welfare Sabotage",
        "subcategory": "Public Health Sabotage",
        "metrics_key": "public_welfare",
        "keywords": ["MAHA", "CDC", "surgeon general", "public health vacancies", "Casey Means"],
        "scores": (6, 6, 7, 6, 6, 8, 8, 8),
        "rationale_short": "Trump's health slogan looked especially hollow next to empty leadership posts at the agencies that actually keep people alive.",
        "synopsis": "The Guardian reported that Trump's 'Make America Healthy Again' agenda had stalled while the CDC lacked a permanent director and his surgeon general pick remained stuck. The gap between branding and governance could not be much cleaner. He had a slogan, a merchable acronym, and plenty of culture-war fog, but not the ordinary administrative seriousness required to run the agencies responsible for public health in the first place.",
        "rationale": "The Guardian documented the mismatch between the administration's health branding and its failure to staff basic public-health leadership.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/26/trump-maha-agenda-cdc-surgeon-general",
        "source_title": "Trump's Maha agenda stalled as top CDC and surgeon general roles sit empty",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2212,
        "title": "Trump Mocked Britain's Aircraft Carriers as 'Toys' While Demanding Allies Back His War",
        "date_start": "2026-03-26",
        "date_end": "2026-03-26",
        "category": "Foreign Policy",
        "subcategory": "Alliance Sabotage",
        "metrics_key": "war",
        "keywords": ["UK aircraft carriers", "toys", "anti-NATO", "allies", "iran war"],
        "scores": (6, 8, 6, 6, 5, 8, 8, 7),
        "rationale_short": "Trump wanted allied obedience and still could not resist publicly humiliating the allies he was trying to use.",
        "synopsis": "The Guardian reported that Trump described Britain's aircraft carriers as 'toys' while lashing out again over allied reluctance to join his Iran war. This belongs in the archive because it captures the toxic core of his alliance politics. He wants subordination, not partnership; public belittling, not coalition maintenance; and he somehow keeps expecting insult to function as strategy.",
        "rationale": "The Guardian showed Trump's contempt for allies surfacing as open mockery during an already dangerous regional war.",
        "source_url": "https://www.theguardian.com/politics/2026/mar/26/donald-trump-uk-aircraft-carriers-toys-nato-keir-starmer-iran",
        "source_title": "Trump describes UK aircraft carriers as 'toys' in latest anti-Nato jibe",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2213,
        "title": "Trump Kept Talking Deal While Israel Moved to Seize More of Southern Lebanon",
        "date_start": "2026-03-24",
        "date_end": "2026-03-24",
        "category": "Foreign Policy",
        "subcategory": "Lebanon Escalation",
        "metrics_key": "war",
        "keywords": ["southern lebanon", "defensive buffer", "israel", "deal hopes", "war expansion"],
        "scores": (6, 6, 8, 5, 5, 8, 7, 9),
        "rationale_short": "Trump kept chatting up deal hopes while the war footprint widened into Lebanon anyway.",
        "synopsis": "The Guardian reported that Israel said it would seize parts of southern Lebanon as a 'defensive buffer' even while Trump continued talking up hopes for a deal with Iran. That split matters because it shows how fraudulent the calming rhetoric was. The regional fire was spreading into new territory while Trump kept dressing escalation in the language of looming resolution, as if optimism itself could erase the expansion on the ground.",
        "rationale": "The Guardian tied Lebanon escalation directly to the same moment in which Trump was still trying to market the crisis as negotiable and under control.",
        "source_url": "https://www.theguardian.com/world/2026/mar/24/netanyahu-vows-further-strikes-iran-lebanon-missile-hits-tel-aviv-middle-east-crisis",
        "source_title": "Israel says it will seize parts of southern Lebanon as 'defensive buffer'",
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
