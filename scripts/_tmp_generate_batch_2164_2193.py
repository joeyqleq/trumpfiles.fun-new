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
        "entry_number": 2164,
        "title": "Trump Snapped 'Get Your Own Oil' at Europe for Refusing His Iran War",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "war",
        "keywords": ["europe allies", "iran war", "get your own oil", "hormuz", "trump tirade"],
        "scores": (6, 7, 7, 6, 6, 8, 10, 8),
        "rationale_short": "Trump treated alliance politics like a mob shakedown once Europe refused to salute his war.",
        "synopsis": "Trump lashed out at European governments that would not join the US-Israel war on Iran, barking that they should 'get your own oil' instead of expecting help with the Strait of Hormuz. The point of the story is not only that he was rude. It is that he responded to allied resistance with open contempt while the war he helped inflame was already straining diplomacy, shipping, and civilian nerves across the region.",
        "rationale": "The Guardian documented Trump turning alliance management into public blackmail once key partners refused to back his war.",
        "source_url": "https://www.theguardian.com/world/2026/mar/31/trump-launches-tirade-against-european-countries-not-joining-iran-war",
        "source_title": "‘Get your own oil’: Trump launches tirade against Europe for not joining Iran war",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2165,
        "title": "Trump's Gulf Drilling Push Put One of Earth's Rarest Whales in the Crosshairs",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Environmental Destruction",
        "subcategory": "Fossil Fuel Expansion",
        "metrics_key": "environment",
        "keywords": ["Rice's whale", "gulf drilling", "endangered species", "oil expansion", "extinction risk"],
        "scores": (5, 6, 7, 5, 6, 7, 9, 8),
        "rationale_short": "Trump's drilling obsession was reckless enough to put an almost-extinct whale directly in the blast radius.",
        "synopsis": "PBS explained that Rice's whale, one of the rarest large mammals on Earth, sits directly in the path of Trump's push for more oil and gas drilling in the Gulf. That makes this more than a dry permitting fight. It is a clean example of the administration treating a vanishing species as expendable background noise so fossil-fuel extraction can keep swaggering forward.",
        "rationale": "PBS tied Trump's drilling agenda to a specific, immediate extinction risk instead of treating environmental harm as an abstract side effect.",
        "source_url": "https://www.pbs.org/newshour/science/what-to-know-about-rices-whale-a-rare-species-in-the-way-of-trumps-plans-for-more-gulf-drilling",
        "source_title": "What to know about Rice's whale, a rare species in the way of Trump's plans for more Gulf drilling",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2166,
        "title": "A Judge Actually Ordered Trump to Stop His White House Ballroom Ego Project",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Government Corruption",
        "subcategory": "Grift / Vanity Projects",
        "metrics_key": "corruption",
        "keywords": ["white house ballroom", "ego project", "east wing", "judge blocks", "vanity"],
        "scores": (6, 8, 4, 5, 7, 8, 9, 6),
        "rationale_short": "A federal judge had to step in because Trump's palace-addition fantasy was not remotely normal governance.",
        "synopsis": "A judge ordered Trump to halt construction of the massive White House ballroom project he had tried to jam through after demolishing the East Wing. The significance is not merely aesthetic. It shows how easily public property and executive prestige were being bent around one man's gaudy need to leave a gold-plated monument to himself on the nation's front lawn.",
        "rationale": "The Guardian showed Trump's White House makeover as an abuse of office wrapped in tasteless real-estate bravado.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/judge-blocks-trump-white-house-ballroom-plan",
        "source_title": "US judge orders Trump to halt $400m White House ballroom project",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2167,
        "title": "Trump's Iran War Helped Push U.S. Gas Above $4 a Gallon",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["gas prices", "oil shock", "iran war", "economic fallout", "pump prices"],
        "scores": (5, 5, 7, 5, 5, 7, 9, 8),
        "rationale_short": "Trump's war swagger landed where it always lands: on other people's bills.",
        "synopsis": "Fuel prices in the United States climbed above $4 a gallon for the first time in four years as Trump's Iran war kept oil markets on edge. This is what his macho foreign policy looks like once the television graphics fade: a self-inflicted economic shock that ricochets through household budgets while he keeps selling escalation as strength and temporary inconvenience as someone else's problem.",
        "rationale": "The Guardian linked Trump's war directly to a concrete consumer hit instead of treating oil volatility like weather.",
        "source_url": "https://www.theguardian.com/business/2026/mar/31/us-average-fuel-prices-iran-war",
        "source_title": "US average fuel price passes $4 a gallon for first time in four years amid Iran war",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2168,
        "title": "Trump's Gold-Plated Presidential Library Fantasy Turned Into a Public Joke",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Moral Depravity",
        "subcategory": "Vanity / Cult of Personality",
        "metrics_key": "morality",
        "keywords": ["presidential library", "miami skyscraper", "gold decor", "cult of personality", "vanity"],
        "scores": (6, 9, 3, 5, 4, 6, 9, 5),
        "rationale_short": "The proposed library looked less like history and more like a dictator-themed casino brochure.",
        "synopsis": "Plans for Trump's presidential library in Miami drew instant ridicule after a rendering showed a gargantuan, gold-dripped tower that looked more like a luxury ego shrine than a civic archive. It belongs in the catalog because it captures the aesthetic soul of Trumpism in one image: public memory repackaged as self-worship, bad taste, and a permanent plea to keep clapping.",
        "rationale": "The Guardian captured a vanity project so absurd it functioned as a perfect visual summary of Trump's cult-of-self politics.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/trump-presidential-library-plans-miami-ridicule",
        "source_title": "Plans for gaudy Trump presidential library in Miami spark ridicule",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2169,
        "title": "Trump's 'God Squad' Let Gulf Drilling Jump the Line Over Endangered Wildlife",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Environmental Destruction",
        "subcategory": "Species Rollback",
        "metrics_key": "environment",
        "keywords": ["god squad", "gulf drilling", "species rules", "oil and gas", "rice's whale"],
        "scores": (5, 7, 7, 5, 7, 7, 9, 8),
        "rationale_short": "Trump's administration literally assembled the species-killing exemption crew and treated it like routine business.",
        "synopsis": "PBS reported that Trump's Endangered Species Committee, nicknamed the 'God Squad', exempted Gulf oil and gas drilling from protections that had been meant to shield rare marine life. The move matters because it shows the administration reaching for the emergency backdoor whenever fossil-fuel interests wanted quicker clearance. Wildlife law became another obstacle to bulldoze, not a boundary to respect.",
        "rationale": "PBS documented the administration using one of the harshest regulatory escape hatches to privilege drilling over survival.",
        "source_url": "https://www.pbs.org/newshour/science/trumps-endangered-species-committee-exempts-oil-and-gas-drilling-in-the-gulf-from-rules",
        "source_title": "Trump's Endangered Species Committee exempts oil and gas drilling in the Gulf from rules",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2170,
        "title": "Trump Signed an Order to Squeeze Mail-In Voting Without Congress",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Authoritarianism",
        "subcategory": "Voting Restrictions",
        "metrics_key": "authoritarian",
        "keywords": ["mail-in voting", "executive order", "voter lists", "mail ballots", "election restrictions"],
        "scores": (6, 6, 6, 8, 7, 9, 9, 8),
        "rationale_short": "Trump tried to use executive power to do what his election lies have wanted all along: make voting harder.",
        "synopsis": "Trump signed an order targeting mail-in ballots and federally managed voter lists, reaching for nationwide controls he did not get from Congress. The authoritarian tell here is familiar. He treats administrative power as a crowbar for old election grievances, wrapping partisan distrust and false fraud mythology in the language of order and verification.",
        "rationale": "CBS showed Trump using the presidency to pursue a voting crackdown grounded in the same anti-mail-ballot paranoia he has pushed for years.",
        "source_url": "https://www.cbsnews.com/news/trump-vote-by-mail-executive-order",
        "source_title": "Trump signs order on mail-in ballots and federally run voter lists",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2171,
        "title": "Trump Told Allies to Handle Hormuz Themselves While Still Refusing to Leave",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "war",
        "keywords": ["strait of hormuz", "allies", "go get your own oil", "war contradictions", "trump messaging"],
        "scores": (7, 7, 7, 6, 6, 9, 9, 8),
        "rationale_short": "Trump tried to dump the shipping mess on allies even while keeping the war machine idling nearby.",
        "synopsis": "Trump told allies they needed to 'come in and take care of' the Strait of Hormuz while also saying he was not ready to fully walk away from efforts to force it back open. That contradiction is the entry. He wanted the credit for command, the distance from consequences, and the option to lunge back in whenever the next headline tempted him.",
        "rationale": "CBS captured Trump's habit of declaring disengagement and leverage at the same time, which is how confusion becomes policy.",
        "source_url": "https://www.cbsnews.com/news/trump-iran-strait-of-hormuz-not-ready-quite-yet-to-leave",
        "source_title": "Trump says allies must \"come in and take care of\" Strait of Hormuz",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2172,
        "title": "Trump's Birthright Citizenship Attack Reached the Supreme Court",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Authoritarianism",
        "subcategory": "Birthright Citizenship Attack",
        "metrics_key": "authoritarian",
        "keywords": ["birthright citizenship", "supreme court", "14th amendment", "executive order", "citizenship attack"],
        "scores": (6, 6, 7, 9, 7, 8, 9, 8),
        "rationale_short": "Trump's attempt to narrow who counts as American reached the court because he keeps governing by exclusion fantasy.",
        "synopsis": "The Supreme Court agreed to weigh Trump's bid to end or limit birthright citizenship, putting one of his most openly exclusionary constitutional attacks into the legal center of gravity. The moral rot is obvious enough even before the doctrine: he keeps trying to redefine belonging so citizenship becomes a prize distributed upward by power instead of a right recognized at birth.",
        "rationale": "CBS documented Trump's citizenship attack as a live constitutional project rather than campaign noise.",
        "source_url": "https://www.cbsnews.com/news/supreme-court-birthright-citizenship-trump-v-barbara",
        "source_title": "Supreme Court to weigh Trump's bid to end birthright citizenship",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2173,
        "title": "A Federal Judge Blocked Trump's Order to Strangle NPR and PBS Funding",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Press Freedom",
        "subcategory": "Media Intimidation",
        "metrics_key": "press",
        "keywords": ["NPR", "PBS", "funding cut", "first amendment", "media intimidation"],
        "scores": (5, 5, 5, 8, 7, 8, 9, 7),
        "rationale_short": "Trump tried to choke public media with executive muscle and got told no in court.",
        "synopsis": "A federal judge blocked Trump's order to end funding for NPR and PBS, calling the move unlawful and unenforceable. This matters because public-media bullying was never just a budget spat. It was another attempt to use state power to punish institutions he dislikes and teach every newsroom that criticism can carry a price tag.",
        "rationale": "The Guardian framed the funding order as unconstitutional retaliation against disfavored media outlets.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/judge-blocks-trump-npr-pbs-funding-cut",
        "source_title": "Federal judge blocks Trump order to end funding for NPR and PBS",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2174,
        "title": "Trump's EEOC Started Rewriting Civil Rights Around White Grievance",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Authoritarianism",
        "subcategory": "Civil Rights Rollback",
        "metrics_key": "authoritarian",
        "keywords": ["EEOC", "DEI", "white grievance", "civil rights", "Andrea Lucas"],
        "scores": (6, 6, 5, 8, 7, 8, 9, 7),
        "rationale_short": "Trump's appointees started turning civil-rights enforcement into a stage for white resentment politics.",
        "synopsis": "NPR reported that Trump's EEOC was reorienting itself around attacks on DEI and a new emphasis on alleged discrimination against white men. The damage here is institutional. An agency built to protect vulnerable workers was being repurposed to flatter backlash politics and make long-running inequality look like the real unfairness was finally diversity itself.",
        "rationale": "NPR documented the ideological inversion at the EEOC as a concrete policy turn, not just a culture-war soundbite.",
        "source_url": "https://www.npr.org/2026/03/31/nx-s1-5763966/eeoc-trump-white-men-civil-rights-dei-discrimination",
        "source_title": "How Trump's EEOC is attacking DEI and emphasizing white people",
        "source_publisher": "NPR",
    },
    {
        "entry_number": 2175,
        "title": "Agents Who Investigated Trump Sued After Getting Fired for It",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Government Corruption",
        "subcategory": "Political Retaliation",
        "metrics_key": "corruption",
        "keywords": ["FBI agents", "retaliation", "wrongful termination", "justice department", "trump cases"],
        "scores": (5, 5, 6, 8, 8, 8, 9, 7),
        "rationale_short": "Investigating Trump remained the kind of thing that could still get agents purged after the fact.",
        "synopsis": "Former FBI agents who worked on Trump-related cases sued the bureau and the Justice Department, saying they were wrongfully fired for doing their jobs. This is why cataloging retaliation matters. It tells future officials exactly what sort of personal risk comes with crossing him, and it keeps showing how the apparatus of government gets bent toward vengeance instead of accountability.",
        "rationale": "The Guardian documented a live retaliation pipeline against personnel tied to investigations of Trump.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/ex-fbi-agents-trump-cases-lawsuit-firings",
        "source_title": "Ex-FBI agents who worked on Trump cases sue agency and DoJ over firings",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2176,
        "title": "Trump's Iran War Was Bad Enough That Americans Started Whispering About a Draft",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "National Security Violations",
        "subcategory": "War / Political Fallout",
        "metrics_key": "war",
        "keywords": ["military draft", "war anxiety", "iran war", "public panic", "troop escalation"],
        "scores": (6, 6, 6, 5, 5, 7, 9, 7),
        "rationale_short": "Trump's war got chaotic enough that draft panic became part of the public mood.",
        "synopsis": "As the Iran war dragged on, public chatter and fear about a possible draft started surfacing even though a draft remained unlikely. That fear is still a political fact. It shows how thoroughly Trump's escalatory style erodes trust, because people no longer hear war reassurances as reassurance. They hear them as the prelude to the next lie.",
        "rationale": "The Guardian captured public anxiety as a consequence of Trump's incoherent war management, not a random internet rumor.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/31/us-military-draft-fears-trump-iran-war",
        "source_title": "Chatter and fear about US military draft emerge as Trump’s Iran war drags on",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2177,
        "title": "Trump Moved to Strip Gulf Wildlife Protections in the Name of 'National Security'",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "Environmental Destruction",
        "subcategory": "Species Rollback",
        "metrics_key": "environment",
        "keywords": ["endangered species", "gulf of mexico", "national security", "god squad", "wildlife protections"],
        "scores": (5, 7, 6, 5, 7, 7, 8, 8),
        "rationale_short": "Trump slapped the label 'national security' on fossil-fuel appetites and called that a governing principle.",
        "synopsis": "Trump moved to revoke protections for endangered species in the Gulf of Mexico by invoking national-security logic around drilling and energy supply. This is one of his favorite frauds: use a grave word like security to excuse a grubby policy that mainly serves extraction interests. The species still die the same way, only now the paperwork pretends patriotism did it.",
        "rationale": "The Guardian showed how Trump used security language to bulldoze ecological safeguards for drilling interests.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/30/trump-protections-endangered-species-gulf-of-mexico",
        "source_title": "Trump to revoke protections for endangered species in Gulf of Mexico",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2178,
        "title": "Trump Threatened to 'Obliterate' Iran's Energy Grid",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "National Security Violations",
        "subcategory": "Infrastructure Threats",
        "metrics_key": "war",
        "keywords": ["energy grid", "obliterate", "infrastructure threat", "iran war", "escalation"],
        "scores": (7, 8, 9, 7, 7, 8, 8, 9),
        "rationale_short": "Trump was openly threatening civilian-linked infrastructure like that was just normal wartime chest-thumping.",
        "synopsis": "Trump threatened to 'obliterate' Iran's energy grid if no ceasefire came quickly, keeping civilian-linked infrastructure squarely inside his public threat vocabulary. Even when formal war-crime language is debated, this is still morally revealing. He reaches instinctively for maximal punishment, broad disruption, and the kind of damage that cascades far beyond the men actually holding rifles.",
        "rationale": "The Guardian documented Trump's willingness to threaten sweeping infrastructure destruction as public leverage.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/30/trump-threatens-to-obliterate-irans-energy-grid-if-ceasefire-not-reached-shortly",
        "source_title": "Trump threatens to ‘obliterate’ Iran’s energy grid if ceasefire not reached ‘shortly’",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2179,
        "title": "Trump Claimed 'Serious' Talks Were Happening While Threatening Iran's Energy and Water Sites",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "National Security Violations",
        "subcategory": "Infrastructure Threats",
        "metrics_key": "war",
        "keywords": ["serious talks", "energy sites", "water sites", "war contradictions", "iran threats"],
        "scores": (7, 7, 9, 7, 7, 9, 8, 9),
        "rationale_short": "Trump kept pairing peace-talk chatter with threats to hit the systems civilians rely on to live.",
        "synopsis": "Trump said 'serious' talks were underway even as he threatened strikes on Iran's energy and water infrastructure. That split-screen matters because it is the real Trump doctrine: call it diplomacy while waving a flamethrower at the systems people need for ordinary life. The rhetoric of negotiation becomes cover for a louder threat, not an alternative to it.",
        "rationale": "The Los Angeles Times captured the contradiction between Trump's peace branding and his readiness to threaten essential infrastructure.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-30/trump-says-serious-talks-are-occurring-threatens-strikes-on-iran-energy-water-sites",
        "source_title": "Trump says 'serious' talks are occurring, threatens strikes on Iran energy, water sites",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2180,
        "title": "Trump's Medicaid Cuts Were Costing States Millions Before Anyone Even Lost Coverage",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "Public Welfare Sabotage",
        "subcategory": "Safety-Net Cuts",
        "metrics_key": "public_welfare",
        "keywords": ["medicaid", "snap", "contractors", "state costs", "red tape"],
        "scores": (5, 5, 7, 6, 6, 7, 8, 8),
        "rationale_short": "Trump's safety-net cruelty was expensive even before the human losses fully arrived.",
        "synopsis": "States were already paying contractors millions just to comply with the administrative burdens in Trump's Medicaid and SNAP crackdown. That is an especially Trumpian form of damage: spend public money to make public help harder to reach, then call the resulting chaos efficiency. The cruelty is not just in the lost benefits. It is in making government burn money to rough people up more efficiently.",
        "rationale": "CBS documented the immediate public cost of Trump's welfare-cut architecture before the deeper human fallout had even finished landing.",
        "source_url": "https://www.cbsnews.com/news/trump-medicaid-snap-aid-states-consultants",
        "source_title": "States pay contractors millions to comply with Trump law to cut Medicaid rolls",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2181,
        "title": "Trump Kept Stacking More Troops in the Middle East for an Even Bigger Iran Fight",
        "date_start": "2026-03-30",
        "date_end": "2026-03-30",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["special operations", "marines", "army troops", "middle east deployment", "iran options"],
        "scores": (6, 6, 8, 6, 6, 8, 8, 9),
        "rationale_short": "Trump's war was supposedly narrowing while the troop menu kept getting bigger and more dangerous.",
        "synopsis": "CBS reported that Special Operations Forces, Marines, and Army troops were in the region giving Trump additional military options around Iran, Hormuz, and nuclear stockpiles. That is not the profile of a president gently backing away from conflict. It is the profile of someone expanding the menu and pretending the waiter is de-escalation.",
        "rationale": "CBS showed that Trump's claimed off-ramp rhetoric sat alongside a very real expansion of military options.",
        "source_url": "https://www.cbsnews.com/news/special-operations-forces-marines-army-troops-middle-east-sources-say",
        "source_title": "Special Operations Forces, Marines and Army troops now in Middle East, sources say",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2182,
        "title": "Trump Softened the Tone of His Deportation Campaign Only After It Got Deeply Unpopular",
        "date_start": "2026-03-28",
        "date_end": "2026-03-28",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["deportation campaign", "unpopularity", "Kristi Noem", "Gregory Bovino", "image management"],
        "scores": (5, 6, 7, 7, 6, 7, 7, 8),
        "rationale_short": "Trump's team adjusted the packaging of the crackdown, not the cruelty at its core.",
        "synopsis": "The Guardian reported that the deportation campaign changed tone after it became deeply unpopular, with personnel shifts and rhetorical smoothing even as arrests continued. That matters because it shows how often the administration responds to backlash. Not by stopping the abuse, but by rebranding it until the public stops noticing the same machinery underneath.",
        "rationale": "The Guardian showed Trump treating political optics as the real problem while the deportation apparatus kept running.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/28/trump-deportation-campaign-noem-bovino-change",
        "source_title": "How Trump’s deportation campaign has changed tack after deep unpopularity",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2183,
        "title": "Trump Had to Order DHS to Pay TSA Agents Because His Own Funding Chaos Blew Up the System",
        "date_start": "2026-03-27",
        "date_end": "2026-03-27",
        "category": "Government Corruption",
        "subcategory": "Manufactured Governance Crisis",
        "metrics_key": "corruption",
        "keywords": ["TSA pay", "DHS funding", "executive order", "shutdown chaos", "air travel"],
        "scores": (6, 6, 5, 6, 6, 7, 7, 7),
        "rationale_short": "Trump created funding chaos and then cast the cleanup order as leadership.",
        "synopsis": "Trump signed an executive order instructing DHS to immediately pay TSA agents after Republican dysfunction helped create a funding mess around key homeland-security functions. It is one of his classic loops: help generate a preventable crisis, then swagger in front of the cameras as the man reluctantly forced to save everybody from the mess with a signature.",
        "rationale": "The Guardian documented Trump's use of executive theater to mop up damage born from his own side's governance failure.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/27/trump-executive-order-tsa-payment-dhs",
        "source_title": "Trump signs executive order instructing DHS to immediately pay TSA agents",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2184,
        "title": "Trump's EPA Let Industry Science Weaken Formaldehyde Cancer Rules",
        "date_start": "2026-03-27",
        "date_end": "2026-03-27",
        "category": "Environmental Destruction",
        "subcategory": "Public Health Rollback",
        "metrics_key": "environment",
        "keywords": ["EPA", "formaldehyde", "cancer rules", "industry science", "chemical lobby"],
        "scores": (5, 5, 7, 5, 7, 8, 7, 8),
        "rationale_short": "Trump's EPA let chemical-industry convenience write over cancer protections again.",
        "synopsis": "Documents showed Trump's EPA relying on industry-backed science to weaken formaldehyde cancer rules, reversing stricter public-health limits. This is the kind of slow violence the administration excels at: nothing explodes on camera, but toxic exposure rules get sanded down until ordinary people carry more risk and corporations carry less inconvenience.",
        "rationale": "The Guardian tied the rollback directly to industry influence and to a concrete carcinogen that affects public health.",
        "source_url": "https://www.theguardian.com/environment/2026/mar/27/trump-epa-cancer-rules-formaldehyde",
        "source_title": "Trump EPA relied on industry science to weaken formaldehyde cancer rules, documents show",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2185,
        "title": "An Election Conspiracy Theorist Had Trump's Ear on Voting Laws and the Midterms",
        "date_start": "2026-03-27",
        "date_end": "2026-03-27",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Voting Restrictions",
        "metrics_key": "authoritarian",
        "keywords": ["Peter Ticktin", "election conspiracy", "midterms", "voting laws", "restriction plan"],
        "scores": (7, 6, 6, 8, 7, 9, 7, 7),
        "rationale_short": "Trump was still taking advice from people who think restricting voting is a form of democratic hygiene.",
        "synopsis": "The Guardian reported that election conspiracy theorist Peter Ticktin had Trump's ear on voting laws and midterm strategy, pushing ideas experts said could sharply restrict voting rights. The danger here is structural. Fringe delusion does not stay fringe once it gets a direct line to presidential power and a chance to harden into law.",
        "rationale": "The Guardian showed how Trump's appetite for election fantasy kept feeding concrete policy proposals aimed at voting access.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/27/trump-voting-election-conspiracy-midterms",
        "source_title": "How an election conspiracy theorist has Trump's ear on voting laws and midterms",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2186,
        "title": "Trump Said He Wants Federalized Troops in Los Angeles and San Francisco",
        "date_start": "2026-03-26",
        "date_end": "2026-03-26",
        "category": "Authoritarianism",
        "subcategory": "Domestic Militarization",
        "metrics_key": "authoritarian",
        "keywords": ["federalized troops", "Los Angeles", "San Francisco", "domestic militarization", "crime politics"],
        "scores": (7, 7, 7, 9, 7, 8, 7, 8),
        "rationale_short": "Trump floated sending federally controlled force into blue cities because local democracy annoys him.",
        "synopsis": "Trump said he wanted federalized troops in Los Angeles and San Francisco, framing the move as a crime response while singling out Democratic-led cities. This belongs in the catalog because it is not merely bluster about law and order. It is a recurring fantasy of overriding local governance with centralized force whenever he dislikes who voters chose.",
        "rationale": "The Los Angeles Times documented Trump openly reviving the authoritarian impulse to use federal force against politically disfavored cities.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-26/trump-says-he-wants-to-send-federal-agents-to-la-s-f",
        "source_title": "Trump says he wants to send federalized troops to L.A., San Francisco",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2187,
        "title": "Trump's Housing Chief Tried to Sic Another Criminal Investigation on Letitia James",
        "date_start": "2026-03-25",
        "date_end": "2026-03-25",
        "category": "Government Corruption",
        "subcategory": "Political Retaliation",
        "metrics_key": "corruption",
        "keywords": ["Letitia James", "Bill Pulte", "criminal investigation", "vendetta", "retaliation"],
        "scores": (6, 6, 6, 8, 7, 8, 7, 7),
        "rationale_short": "Trump world kept trying to turn federal power into a revenge subscription service.",
        "synopsis": "Trump's housing chief, Bill Pulte, reportedly pushed for a fresh criminal investigation of Letitia James, extending the long retribution arc against one of Trump's most prominent legal antagonists. This matters because it shows how retaliation survives past the headline feud. Once his people gain access to the state, grudges start shopping for official stationery.",
        "rationale": "The Guardian documented the use of executive-adjacent power to keep Trump's personal vendettas alive.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/25/trump-letitia-james-mortgage-fraud-investigation-referral",
        "source_title": "Trump housing chief requests new criminal investigation into Letitia James",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2188,
        "title": "Trump's Name Kept Getting Slapped on Public Infrastructure Like a Tacky Regime Gift Shop",
        "date_start": "2026-03-31",
        "date_end": "2026-03-31",
        "category": "Moral Depravity",
        "subcategory": "Vanity / Cult of Personality",
        "metrics_key": "morality",
        "keywords": ["Palm Beach airport", "cult of personality", "renaming", "DeSantis", "public flattery"],
        "scores": (5, 8, 3, 5, 4, 6, 8, 5),
        "rationale_short": "Another airport got offered to the cult because apparently the buildings still were not flattering enough.",
        "synopsis": "Ron DeSantis signed a bill renaming Palm Beach's airport after Trump, adding one more public object to the growing pile of institutions and infrastructure recruited into personal flattery. On its own it is ridiculous. In pattern, it is more revealing: the surrounding movement keeps treating public space as tribute inventory for one man's ego, as if democracy were supposed to come with branded monuments.",
        "rationale": "The Guardian captured a small but telling cult-of-personality gesture that fits Trump's broader regime aesthetic.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/30/donald-trump-palm-beach-airport-ron-desantis",
        "source_title": "Ron DeSantis signs bill renaming Palm Beach airport after Donald Trump",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2189,
        "title": "Trump's Iran War Came With an Openly Grabby Lust for Iranian Oil",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Foreign Policy",
        "subcategory": "Resource Extraction",
        "metrics_key": "economy",
        "keywords": ["iranian oil", "resource grab", "fossil-fuel imperialism", "extraction politics", "trump motives"],
        "scores": (6, 7, 8, 6, 6, 8, 10, 8),
        "rationale_short": "Trump's war rhetoric kept circling back to the same old imperial itch: the oil underneath someone else's country.",
        "synopsis": "The Guardian laid out how Trump's appetite for Iranian oil fit a much older pattern of fossil-fuel imperial thinking, the belief that the United States is entitled to resources it covets. That matters because it helps explain the greed lurking under the posture. The war was sold in security language, but the underlying imagination kept sounding like a burglar with a flag pin.",
        "rationale": "The Guardian connected Trump's war politics to a long-running extraction mindset rather than treating oil talk as incidental color.",
        "source_url": "https://www.theguardian.com/us-news/2026/apr/01/trump-iran-oil-fossil-fuel-imperialism",
        "source_title": "‘Fossil-fuel imperialism’: Trump’s hankering for Iranian oil runs deep",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2190,
        "title": "Trump Threatened to Drag the U.S. Out of NATO Because Allies Wouldn't Join His War",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Foreign Policy",
        "subcategory": "Alliance Sabotage",
        "metrics_key": "war",
        "keywords": ["NATO", "allies", "withdrawal threat", "iran war", "alliance sabotage"],
        "scores": (7, 7, 8, 7, 6, 8, 10, 8),
        "rationale_short": "Trump reacted to allied refusal with a threat to blow up the alliance itself.",
        "synopsis": "Trump said he was 'absolutely' considering withdrawing the United States from NATO after allies refused to join the war on Iran. The threat matters even if it never fully lands. It shows how quickly he treats alliances as extortion rackets that deserve punishment when other countries decline to underwrite his latest escalation or applaud loudly enough.",
        "rationale": "The Guardian documented Trump's readiness to turn alliance commitments into collateral damage once partners refused his war demands.",
        "source_url": "https://www.theguardian.com/world/2026/apr/01/trump-says-he-is-absolutely-considering-withdrawing-us-from-nato",
        "source_title": "Trump says he is ‘absolutely’ considering withdrawing US from Nato",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2191,
        "title": "Trump Lost Another Shield as a Judge Said He Could Be Sued Over Jan. 6",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Government Corruption",
        "subcategory": "January 6 Accountability",
        "metrics_key": "corruption",
        "keywords": ["Jan. 6", "civil claims", "incitement", "immunity", "Amit Mehta"],
        "scores": (5, 4, 6, 6, 7, 7, 10, 7),
        "rationale_short": "A judge said Trump still has to face civil claims over the speech that fed the riot.",
        "synopsis": "A federal judge ruled that Trump is not immune from civil claims alleging his Jan. 6 rally speech incited the Capitol attack. That ruling matters beyond the courtroom. It chips away at the larger Trump project of turning public office into a liability eraser, where every abuse becomes untouchable the second it is draped in presidential ritual and sham self-importance.",
        "rationale": "PBS documented a concrete legal refusal to let Trump's office launder away accountability for Jan. 6 conduct.",
        "source_url": "https://www.pbs.org/newshour/politics/trump-isnt-immune-from-civil-claims-that-his-jan-6-rally-speech-incited-riot-judge-rules",
        "source_title": "Trump isn't immune from civil claims that his Jan. 6 rally speech incited riot, judge rules",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2192,
        "title": "A Judge Made Trump Restore Legal Status He Tried to Rip From Biden-Era Migrants",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["legal status", "migrants", "CBP One", "federal judge", "asylum seekers"],
        "scores": (5, 5, 7, 7, 7, 7, 10, 8),
        "rationale_short": "Trump tried to disappear migrants' status by decree and got forced to reverse part of it in court.",
        "synopsis": "A federal judge ordered the Trump administration to restore legal status for migrants who had been allowed into the country under a Biden-era border program. This is exactly why the catalog tracks court reversals. They show the administration repeatedly trying maximal cruelty first, then backing off only when a judge intervenes and reminds it that migrants are not props to be switched on and off for theater.",
        "rationale": "CBS documented another instance of Trump's immigration machine overshooting the law and needing a court to pull it back.",
        "source_url": "https://www.cbsnews.com/news/judge-orders-trump-restore-legal-status-migrants-biden-cbp-one",
        "source_title": "Judge orders Trump admin. to restore legal status of migrants allowed in under Biden",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2193,
        "title": "Trump's Voting Crackdown Started Spreading Through Proof-of-Citizenship Laws",
        "date_start": "2026-04-01",
        "date_end": "2026-04-01",
        "category": "Authoritarianism",
        "subcategory": "Voting Restrictions",
        "metrics_key": "authoritarian",
        "keywords": ["proof of citizenship", "voting laws", "Florida", "Mississippi", "Save Act"],
        "scores": (6, 5, 6, 8, 7, 8, 10, 7),
        "rationale_short": "Trump's anti-voter politics kept metastasizing through state proof-of-citizenship laws.",
        "synopsis": "Florida and Mississippi signed proof-of-citizenship voting bills as Trump's broader push for tighter voting restrictions kept spreading through state-level lawmaking. This is how democratic erosion usually looks in practice. Not one dramatic coup, but a trail of paperwork, hurdles, and exclusion rules built atop a constant insinuation that participation itself is suspicious unless the right people are doing it.",
        "rationale": "The Guardian documented state-level expansion of the same restrictive voting logic Trump has been normalizing nationally.",
        "source_url": "https://www.theguardian.com/us-news/2026/apr/01/florida-new-voter-id-laws-proof-citizenship",
        "source_title": "Florida and Mississippi governors sign proof-of-citizenship voting bills",
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
