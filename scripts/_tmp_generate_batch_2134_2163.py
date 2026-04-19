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
        "entry_number": 2134,
        "title": "Trump Got Blamed by a Former CIA Chief for the Iran Crisis He Helped Create",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Foreign Policy",
        "subcategory": "War Responsibility",
        "metrics_key": "war",
        "keywords": ["leon panetta", "iran crisis", "hormuz closure", "no exit strategy", "trump responsibility"],
        "scores": (5, 4, 7, 6, 6, 8, 10, 9),
        "rationale_short": "A former CIA and defense chief directly pinned the crisis on Trump instead of treating it like weather.",
        "synopsis": "Leon Panetta told the Guardian that Trump was naive, trapped between a rock and a hard place, and facing the chickens coming home to roost after three weeks of war. The value of the piece is blunt attribution. It rejects the lazy habit of describing regional catastrophe as if it floated into being on its own and instead points to the man who kept escalating without an exit plan.",
        "rationale": "The Guardian gave direct, establishment-level attribution for the crisis to Trump's decisions and lack of strategy.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/22/trump-iran-leon-panetta",
        "source_title": "‘Nobody else is responsible’: Trump to blame for Iran crisis, ex-CIA chief says",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2135,
        "title": "Trump's Iran War Started an 'Extremely Ugly' Civil War Inside MAGA Media",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "National Security Violations",
        "subcategory": "War / Political Fallout",
        "metrics_key": "war",
        "keywords": ["maga media", "base fracture", "iran war backlash", "rightwing pundits", "trump war"],
        "scores": (5, 7, 5, 5, 5, 7, 10, 7),
        "rationale_short": "Even Trump's own megaphones started clawing at each other over the war he sold as strength.",
        "synopsis": "The Guardian reported a schism among pro-Trump media figures as the Iran war dragged on. That matters because this crowd usually exists to launder his impulses into destiny. When even the professional flatterers start brawling on air, it is evidence that the war is harder to spin than to start.",
        "rationale": "The Guardian documented political blowback and factional fighting inside Trump's own amplification machinery.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/22/maga-media-fight-trump-iran-war",
        "source_title": "‘Extremely ugly’: Maga media figures squabble among themselves over Trump’s Iran war",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2136,
        "title": "Trump's Iran War Was Also Pushing the World Toward a Food Crisis",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "metrics_key": "economy",
        "keywords": ["food crisis", "fertilizer costs", "supply chains", "hormuz shipping", "trump war fallout"],
        "scores": (5, 4, 7, 6, 6, 7, 10, 9),
        "rationale_short": "The war was not just an oil story; it was starting to squeeze food, fertilizer, and shipping too.",
        "synopsis": "The Guardian warned that the Iran war was rippling outward through fertilizer prices, fuel costs, and shipping choke points, putting food systems under pressure far from the battlefield. Trump's war theater keeps producing invoices in places far from the White House. When shipping lanes, fuel, and fertilizer get hit together, the damage ends up on dinner tables that had no vote in his swagger.",
        "rationale": "The Guardian linked Trump's war escalation to global food and supply-chain stress rather than treating it as an oil-only shock.",
        "source_url": "https://www.theguardian.com/business/2026/mar/22/energy-shock-iran-war-also-driving-world-towards-food-crisis",
        "source_title": "Energy shock talk grabs headlines but the Iran war is also driving the world towards a food crisis | Heather Stewart",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2137,
        "title": "Trump Loved Exposing Other People's Health While Hiding His Own",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Moral Depravity",
        "subcategory": "Hypocrisy / Secrecy",
        "metrics_key": "morality",
        "keywords": ["health hypocrisy", "medical privacy", "congressman diagnosis", "trump rash", "double standard"],
        "scores": (6, 6, 4, 5, 5, 8, 9, 6),
        "rationale_short": "Trump was happy to publicize other people's medical details while staying cagey about his own.",
        "synopsis": "The Guardian noted Trump's willingness to reveal a congressman's terminal diagnosis while still dodging basic questions about his own health, including a recent rash. It is a small but perfect Trump pattern: privacy for the boss, exposure for everyone else. The cruelty is not just nosiness but the assumption that other people's bodies exist for his theater.",
        "rationale": "The Guardian captured a clean example of Trump's double standard on privacy, disclosure, and public humiliation.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/trump-health-privacy",
        "source_title": "Trump is eager to disclose details on others’ health – but not his own",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2138,
        "title": "Trump's Former Counterterror Chief Said He Expected Retaliation for Telling the Truth on Iran",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Government Corruption",
        "subcategory": "Retaliatory Intimidation",
        "metrics_key": "corruption",
        "keywords": ["joe kent", "retaliation", "iran war truth", "fbi investigation", "trump retribution"],
        "scores": (5, 4, 6, 7, 8, 8, 9, 7),
        "rationale_short": "Joe Kent said he feared retaliation, which is what happens when honesty collides with Trump's need for loyalty.",
        "synopsis": "After resigning over the Iran war, former counterterrorism chief Joe Kent said he feared retaliation but had no regrets because the facts were on his side. That is not normal national-security governance; it is omerta with lapel pins. When officials think telling the truth about war will invite punishment, the rot is not incidental. It is the management style.",
        "rationale": "The Guardian documented how Trump's loyalty culture turned honest dissent on war into a personal risk.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/21/joe-kent-trump-retribution-iran-war",
        "source_title": "US counter-terrorism chief who resigned says he fears retaliation but has no regrets",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2139,
        "title": "Trump-Era Election Lies Crept Back Through a Puerto Rico Voting-Machine Conspiracy",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Election Lies",
        "metrics_key": "authoritarian",
        "keywords": ["puerto rico voting machines", "venezuela conspiracy", "2020 lie", "gabbard testimony", "election disinformation"],
        "scores": (7, 6, 5, 7, 6, 9, 8, 7),
        "rationale_short": "A recycled Venezuela voting-machine fantasy was back in circulation through official testimony.",
        "synopsis": "The Guardian reported that Tulsi Gabbard's testimony about seizing voting machines in Puerto Rico raised fresh questions about an old Venezuela-themed conspiracy theory tied to Trump's 2020 election lies. This is how poisoned ideas stay alive: they do not disappear, they get laundered through officials, hearings, and new jurisdictions. The costume changes; the fraud stays stupid.",
        "rationale": "The Guardian showed how Trump-style election lies were being repackaged through official channels rather than abandoned.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/20/puerto-rico-voting-machines-trump-2020-election-loss-venezuela",
        "source_title": "Gabbard testimony on Puerto Rico voting machines raises questions about role of Venezuela conspiracy theory",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2140,
        "title": "Trump's EPA Tried to Erase the Finding That Greenhouse Gases Endanger People",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Environmental Destruction",
        "subcategory": "Climate Rollback",
        "metrics_key": "environment",
        "keywords": ["endangerment finding", "climate rollback", "epa lawsuit", "greenhouse gases", "public health"],
        "scores": (5, 4, 7, 7, 7, 8, 8, 9),
        "rationale_short": "States sued because Trump's EPA tried to delete the basic legal finding that climate pollution harms people.",
        "synopsis": "States sued after Trump's EPA moved to repeal the endangerment finding, the bedrock determination that greenhouse gases threaten public health. This is bigger than one regulatory tweak. It is an attempt to blindfold the law so fossil-fuel politics can pretend the smoke is not there. The administration was not merely loosening a rule; it was trying to unplug reality from policy.",
        "rationale": "The Guardian documented a foundational climate rollback aimed at stripping the law of its basic public-health premise.",
        "source_url": "https://www.theguardian.com/environment/2026/mar/19/us-states-trump-climate-crisis-endangerment-finding",
        "source_title": "US states sue Trump EPA over decision to repeal bedrock climate finding",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2141,
        "title": "Trump's Deportation Machine Was Sending Parents Away Without Their Children",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Human Rights Violations",
        "subcategory": "Family Separation / Deportation",
        "metrics_key": "immigration",
        "keywords": ["deported parents", "children left behind", "family separation", "short notice deportation", "trump policy"],
        "scores": (6, 4, 8, 8, 8, 7, 8, 9),
        "rationale_short": "Parents were being deported without time to arrange care for their children, which is family destruction by bureaucratic speedrun.",
        "synopsis": "A report cited by the Guardian found that deported parents often were not given a real chance to arrange care for their children before removal. It is the same cruelty Trumpism keeps rediscovering in slightly different paperwork. Whether the state literally takes the child or simply ejects the parent before the child is safe, the result is still trauma designed by policy.",
        "rationale": "The Guardian tied short-notice deportations to concrete family trauma rather than treating the removals as neutral paperwork.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/19/trump-deportation-children-trauma",
        "source_title": "Trump administration is deporting parents without their children in violation of its own policies, report finds",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2142,
        "title": "A 19-Year-Old Became the Youngest Person to Die in ICE Detention in Trump's Second Term",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["ice detention death", "florida detention", "custody death", "trump second term", "immigration abuse"],
        "scores": (6, 4, 8, 8, 8, 7, 8, 9),
        "rationale_short": "A teenager died in ICE custody, turning detention policy into another obituary generator.",
        "synopsis": "The Guardian reported that 19-year-old Royer Perez-Jimenez was found unresponsive in a Florida detention center, making him the youngest known death in ICE detention of Trump's second term. These stories matter because detention deaths are not random lightning strikes inside a neutral system. They are what a system produces when care is thin, oversight is weaker, and human beings become inventory.",
        "rationale": "The Guardian documented the human cost of a detention regime Trump kept hardening and normalizing.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/19/teenager-ice-detention-florida-dies",
        "source_title": "Teenager becomes youngest person to die in ICE detention in Trump’s second term",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2143,
        "title": "Trump Claimed He Didn't Know About a Gasfield Strike That Enraged Gulf Allies",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Foreign Policy",
        "subcategory": "Deceit / Recklessness",
        "metrics_key": "war",
        "keywords": ["south pars", "gasfield strike", "netanyahu", "trump ignorance", "gulf allies"],
        "scores": (6, 5, 7, 6, 6, 9, 8, 8),
        "rationale_short": "Trump tried to distance himself from a major strike by acting like he had warned against it and somehow still didn't know.",
        "synopsis": "After an Israeli strike on Iran's South Pars gas field angered Gulf allies, Trump claimed he told Netanyahu not to do it and did not know it would happen. Even if you took that at face value, it would still describe a stunning level of incoherence between partners at war. More likely it was another familiar dodge: when the consequences land, he suddenly becomes a spectator.",
        "rationale": "The Guardian captured Trump's effort to wriggle out of ownership once a major strike started generating blowback.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/19/israeli-strike-iranian-gas-field-trump",
        "source_title": "Strike on Iran gasfield exposes US-Israel rift as Trump claims he did not know",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2144,
        "title": "Trump's $400 Million White House Ballroom Fantasy Started Looking Illegal in Court",
        "date_start": "2026-03-18",
        "date_end": "2026-03-18",
        "category": "Government Corruption",
        "subcategory": "Grift / Vanity Projects",
        "metrics_key": "corruption",
        "keywords": ["white house ballroom", "congressional approval", "vanity project", "court challenge", "trump grift"],
        "scores": (6, 8, 4, 6, 6, 7, 8, 6),
        "rationale_short": "A judge had to ask whether Trump's giant ballroom vanity project was even lawful.",
        "synopsis": "A federal judge signaled he might halt Trump's $400 million White House ballroom plan, questioning whether it counted as an alteration that could proceed without congressional approval. The point is not just that the idea is tacky. It is that Trump keeps treating public property as a stage set for his tastes, then acting offended when the law remembers the building is not his hotel.",
        "rationale": "The Guardian showed Trump's vanity-project instincts colliding with basic legal limits on public property and spending.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/18/trump-white-house-ballroom-plan-lawsuit",
        "source_title": "Judge indicates he might shut down Trump’s $400m White House ballroom plan",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2145,
        "title": "Trump Said It Would Be His 'Honour' to Take Cuba",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Foreign Policy",
        "subcategory": "Imperial Threats",
        "metrics_key": "war",
        "keywords": ["take cuba", "oil blockade", "imperial threat", "power blackout", "trump quote"],
        "scores": (7, 7, 7, 7, 6, 8, 8, 8),
        "rationale_short": "Trump talked about 'taking Cuba' like imperial conquest was a personal bucket-list item.",
        "synopsis": "Amid a Cuban power blackout worsened by oil pressure, Trump said it would be his 'honour' to take Cuba and boasted he could do anything he wanted. There is a specific kind of menace in that phrasing: conquest recast as prestige. It turns another country's hardship into a daydream about how strong and entitled he can sound.",
        "rationale": "The Guardian preserved a quote-level imperial threat that laid bare Trump's entitlement and appetite for domination.",
        "source_url": "https://www.theguardian.com/world/2026/mar/17/donald-trump-can-take-cuba-oil",
        "source_title": "Trump predicts he will have ‘honour of taking Cuba’ amid power blackout",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2146,
        "title": "Trump Got the Senate to Advance a Proof-of-Citizenship Voting Crackdown",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Authoritarianism",
        "subcategory": "Voting Restrictions",
        "metrics_key": "authoritarian",
        "keywords": ["save america act", "proof of citizenship", "voter suppression", "senate vote", "trump voting bill"],
        "scores": (5, 5, 6, 8, 8, 8, 8, 8),
        "rationale_short": "The Senate moved forward on a Trump-backed bill that would put new barriers between voters and the ballot.",
        "synopsis": "The Senate voted to begin debate on the Save America Act, a Trump-backed bill requiring proof of citizenship for new voters. This is voter suppression dressed in clerical language. The authoritarian trick is always the same: make disenfranchisement sound like housekeeping, then act surprised when the people most burdened by paperwork are the people you already wanted sidelined.",
        "rationale": "The Guardian documented a concrete Trump-backed voting restriction moving through Congress under procedural camouflage.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/17/save-act-senate-voting-bill",
        "source_title": "US Senate heeds Trump’s call to debate restrictive Save America Act voting bill",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2147,
        "title": "Trump Reopened a Spill-Tainted California Pipeline by Order",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Environmental Destruction",
        "subcategory": "Fossil-Fuel Expansion",
        "metrics_key": "environment",
        "keywords": ["california pipeline", "2015 spill", "oil order", "fossil fuel expansion", "iran war supply"],
        "scores": (5, 5, 6, 6, 6, 7, 8, 8),
        "rationale_short": "A pipeline shut since a major spill started flowing again because Trump wanted more oil amid the war.",
        "synopsis": "The Guardian reported that oil started flowing again through a California pipeline closed since a huge 2015 spill after Trump invoked war-related supply needs. That is Trumpism in one ugly knot: a foreign crisis used as cover for domestic fossil-fuel rollback. Environmental memory gets treated the same way as political memory around him, something to bulldoze when it becomes inconvenient.",
        "rationale": "The Guardian tied Trump's war posture directly to a domestic fossil-fuel reopening with a long local environmental history.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/17/oil-california-pipeline-iran",
        "source_title": "Oil flows again through controversial California pipeline after Trump order",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2148,
        "title": "Trump's Greenland Threats Were Serious Enough That Denmark Readied Blood Bags and Runway Charges",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Foreign Policy",
        "subcategory": "Threats Against Allies",
        "metrics_key": "war",
        "keywords": ["greenland threat", "denmark blood bags", "runway explosives", "allied panic", "trump menace"],
        "scores": (7, 8, 7, 7, 6, 8, 8, 8),
        "rationale_short": "Denmark reportedly prepared for a U.S. attack on Greenland because Trump's threats were not being treated as a joke anymore.",
        "synopsis": "Danish media reported that Copenhagen flew blood bags to Greenland and even prepared explosives for runways because of fears that Trump might actually attack. That is an astonishing sentence to have to write about an American president and an ally. It captures what happens when deranged imperial talk stops sounding like a stunt and starts forcing governments into emergency planning.",
        "rationale": "The Guardian showed that Trump's threats toward Greenland were generating real allied defense planning, not just mockery.",
        "source_url": "https://www.theguardian.com/world/2026/mar/19/denmark-prepared-for-us-attack-donald-trump-greenland",
        "source_title": "Denmark reportedly flew blood bags to Greenland in preparation for a US attack",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2149,
        "title": "Trump's Iran War Looked Even Dirtier After Oman Said a Deal Had Been Possible",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Sabotage",
        "metrics_key": "war",
        "keywords": ["oman foreign minister", "deal was possible", "israel pressure", "diplomacy sabotaged", "iran war"],
        "scores": (5, 4, 7, 6, 6, 8, 8, 8),
        "rationale_short": "Oman said diplomacy was still alive before Israel pushed Trump into a catastrophic miscalculation.",
        "synopsis": "Oman's foreign minister said a deal had been possible and that Israel persuaded Trump into a grave miscalculation by going to war instead. Whether every diplomatic detail can be reconstructed or not, the article is important because it restores the lost alternative: this was not fate. There were off-ramps, and Trump chose the people promising fireworks.",
        "rationale": "The Guardian documented a credible claim that Trump had diplomatic alternatives and still chose escalation.",
        "source_url": "https://www.theguardian.com/world/2026/mar/19/us-lost-control-of-its-own-foreign-policy-oman-foreign-minister",
        "source_title": "Oman claims Israel pushed US into Iran war when deal was possible",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2150,
        "title": "Trump's Iran War Entered Week Four With No Clear End and No Clean Exit",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "National Security Violations",
        "subcategory": "Forever War",
        "metrics_key": "war",
        "keywords": ["week four", "no end in sight", "war creep", "sanctions at sea", "trump off-ramp"],
        "scores": (5, 4, 8, 6, 7, 7, 9, 9),
        "rationale_short": "By week four, the war had outgrown the swagger that started it and still had no real exit.",
        "synopsis": "NPR reported that the Iran war had entered its fourth week with no clear end even as Trump floated a possible wind-down and loosened sanctions on Iranian oil stranded at sea. The contradiction is the point. He wants the theater of escalation and the optics of an off-ramp at the same time, which is how messy wars get stretched instead of ended.",
        "rationale": "NPR captured the widening gap between Trump's rhetoric about winding down and the strategic reality of an open-ended war.",
        "source_url": "https://www.npr.org/2026/03/21/nx-s1-5755539/iran-war-fourth-week",
        "source_title": "Iran war enters its fourth week with no clear end in sight",
        "source_publisher": "NPR",
    },
    {
        "entry_number": 2151,
        "title": "Trump Played Trophy Host While His War Team Sat in the Situation Room",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Moral Depravity",
        "subcategory": "War-as-Spectacle",
        "metrics_key": "morality",
        "keywords": ["navy trophy", "situation room", "war spectacle", "white house ceremony", "trump optics"],
        "scores": (6, 8, 5, 5, 4, 7, 9, 6),
        "rationale_short": "Trump kept doing pageant-president business while boasting that the real war table was just down the hall.",
        "synopsis": "At a ceremony for the Commander-in-Chief's Trophy, Trump noted that Pete Hegseth and Gen. Dan Caine were in the Situation Room handling the war. The image is almost too on-brand: one room staging patriotic kitsch while another manages escalation. It is not that presidents cannot do ceremonial events during crises. It is the way Trump makes the ceremony feel like part of the show.",
        "rationale": "PBS preserved a surreal but concrete image of Trump folding war into his usual pageant politics.",
        "source_url": "https://www.pbs.org/newshour/world/watch-trump-presents-commander-in-chiefs-trophy-to-navy-football-team-says-hegseth-and-caine-are-in-the-situation-room",
        "source_title": "WATCH: Trump presents Commander-in-Chief's Trophy to Navy football team, says Hegseth and Caine are in the Situation Room",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2152,
        "title": "Trump Let DHS Funding Degenerate Into Another Manufactured Crisis",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "Government Corruption",
        "subcategory": "Manufactured Governance Crisis",
        "metrics_key": "corruption",
        "keywords": ["dhs funding", "shutdown deadlock", "manufactured crisis", "congress stalemate", "trump governance"],
        "scores": (5, 5, 5, 7, 7, 7, 8, 7),
        "rationale_short": "Homeland Security funding turned into another Trump-era hostage situation instead of a basic act of governance.",
        "synopsis": "PBS summarized a continuing deadlock over DHS funding with no sign of resolution, the kind of manufactured dysfunction that Trump-world keeps normalizing. This style of rule is less about governing than about keeping every institution on edge and every deadline available for extortion. A state run as constant brinkmanship does not fail accidentally. It is being operated that way.",
        "rationale": "PBS documented the deliberate conversion of ordinary budgeting into another Trump-branded governance crisis.",
        "source_url": "https://www.pbs.org/newshour/show/news-wrap-deadlock-over-dhs-funding-shows-no-signs-of-ending",
        "source_title": "News Wrap: Deadlock over DHS funding shows no signs of ending",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2153,
        "title": "Trump Used Newsom's Dyslexia as an Insult and a Disqualifier",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Moral Depravity",
        "subcategory": "Ableist Mockery",
        "metrics_key": "morality",
        "keywords": ["newsom dyslexia", "ableism", "learning disability insult", "trump cruelty", "2028 taunt"],
        "scores": (7, 7, 4, 4, 4, 8, 8, 6),
        "rationale_short": "Trump called Newsom dumb and treated dyslexia like proof a person is unfit for office.",
        "synopsis": "Trump said Gavin Newsom should never be allowed to be president because he had admitted to dyslexia, pairing the claim with his usual dumb-guy taunts. This belongs in the archive not because it is the worst thing he has ever done but because it is such a clean moral sample. The reflex is mockery, the target is disability, and the point is public humiliation.",
        "rationale": "The Los Angeles Times captured a quote-level insult that revealed Trump's ableist instinct with unusual clarity.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-17/trump-newsom-dyslexia-2028",
        "source_title": "Trump attacks Newsom again for having dyslexia, says it disqualifies him from being president",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2154,
        "title": "Trump's Bid to Strip Haitians and Syrians of Protections Reached the Supreme Court",
        "date_start": "2026-03-16",
        "date_end": "2026-03-16",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "metrics_key": "immigration",
        "keywords": ["temporary protected status", "haitians", "syrians", "supreme court", "status rollback"],
        "scores": (5, 4, 7, 8, 7, 7, 8, 8),
        "rationale_short": "Trump's effort to rip protections away from Haitians and Syrians was serious enough to land before the Supreme Court.",
        "synopsis": "The Supreme Court agreed to rule on Trump's plan to end temporary protections for Haitians and Syrians after lower courts had blocked earlier attempts. This is the bureaucratic version of cruelty: take people who built lives under legal protection and turn their status into a political toy. The promise is instability first, legal cleanup later, and human fear all the way through.",
        "rationale": "The Los Angeles Times showed Trump's temporary-protection rollback moving toward a decisive high-court test.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-16/supreme-court-will-rule-on-trumps-plan-to-end-temporary-protection-for-haitians-syrians",
        "source_title": "Supreme Court will rule on Trump's plan to end temporary protection for Haitians, Syrians",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2155,
        "title": "Trump's FCC Started Threatening TV Licenses Over Iran Coverage",
        "date_start": "2026-03-16",
        "date_end": "2026-03-16",
        "category": "Press Freedom",
        "subcategory": "Media Intimidation",
        "metrics_key": "press",
        "keywords": ["fcc threats", "tv licenses", "iran coverage", "brendan carr", "press intimidation"],
        "scores": (5, 6, 5, 8, 7, 8, 8, 7),
        "rationale_short": "The administration's answer to bad Iran coverage was to mutter about pulling broadcast licenses.",
        "synopsis": "The Los Angeles Times reported that FCC chair Brendan Carr threatened television licenses as negative Iran-war coverage mounted. Whether the threat would hold up legally is not the only point. Trumpism keeps using regulators as mood rings, turning oversight bodies into instruments of intimidation whenever reporting becomes inconvenient.",
        "rationale": "The Los Angeles Times documented another instance of Trump-world using regulators to menace disfavored media.",
        "source_url": "https://www.latimes.com/entertainment-arts/business/story/2026-03-16/why-fcc-is-unlikely-to-pull-tv-licenses-over-iran-news-coverage",
        "source_title": "FCC chair threatens to pull TV licenses over Iran news coverage. Why that's highly unlikely",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2156,
        "title": "Trump Tried to Roll Back Fair-Housing Protections and Got Sued by States",
        "date_start": "2026-03-16",
        "date_end": "2026-03-16",
        "category": "Human Rights Violations",
        "subcategory": "Housing Discrimination",
        "metrics_key": "public_welfare",
        "keywords": ["fair housing", "lgbtq protections", "landlord bias", "state lawsuit", "trump rollback"],
        "scores": (5, 4, 6, 7, 7, 7, 8, 8),
        "rationale_short": "States sued because Trump's team tried to weaken rules that protect renters from discrimination.",
        "synopsis": "California and other states sued over Trump's effort to roll back fair-housing protections that bar certain forms of bias, including against LGBTQ+ people. This is how the administration keeps attacking vulnerable groups: not always with one screaming speech, but by quietly loosening the rules that make exclusion a little harder. The paperwork comes first; the human damage follows.",
        "rationale": "The Los Angeles Times documented a concrete Trump rollback aimed at weakening anti-discrimination protections in housing.",
        "source_url": "https://www.latimes.com/california/story/2026-03-16/california-other-states-sue-to-block-trump-effort-to-roll-back-fair-housing-protections",
        "source_title": "California, other states sue to block Trump effort to roll back fair housing protections",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2157,
        "title": "Trump's DHS Pick Came With Warnings About More FEMA Cuts",
        "date_start": "2026-03-18",
        "date_end": "2026-03-18",
        "category": "Government Corruption",
        "subcategory": "Disaster Response Undermining",
        "metrics_key": "corruption",
        "keywords": ["markwayne mullin", "fema cuts", "disaster response", "staffing worries", "dhs readiness"],
        "scores": (5, 5, 6, 7, 6, 7, 8, 7),
        "rationale_short": "Officials were already warning that Trump's DHS choice could mean more cuts and worse disaster readiness.",
        "synopsis": "The Guardian reported fears that Markwayne Mullin would bring further FEMA cuts and weaker readiness to a department already stretched thin. This matters because disaster response is one of the least glamorous ways cruelty shows up in government. You do not need a viral quote to hurt people; sometimes you just hollow out the agency they will need when everything floods, burns, or blows apart.",
        "rationale": "The Guardian tied Trump's DHS staffing choices to concrete risks for disaster preparedness and agency capacity.",
        "source_url": "https://www.theguardian.com/us-news/2026/mar/18/trump-dhs-markwayne-mullin-fema",
        "source_title": "Trump’s DHS pick, Markwayne Mullin, stokes fears of more Fema cuts",
        "source_publisher": "The Guardian",
    },
    {
        "entry_number": 2158,
        "title": "Trump's EPA Moved to Weaken Limits on a Carcinogen Used on Medical Devices",
        "date_start": "2026-03-13",
        "date_end": "2026-03-13",
        "category": "Environmental Destruction",
        "subcategory": "Public Health Rollback",
        "metrics_key": "environment",
        "keywords": ["ethylene oxide", "carcinogen", "medical devices", "epa rollback", "toxic exposure"],
        "scores": (5, 4, 7, 6, 6, 7, 8, 8),
        "rationale_short": "The administration moved to loosen limits on a known carcinogen because even toxic air apparently needed deregulation.",
        "synopsis": "The EPA moved to roll back recent limits on ethylene oxide, a known carcinogen used to sterilize many medical devices. The detail that makes this especially Trumpian is the tradeoff being forced into existence: public health versus industrial convenience, as if poisoned communities were just another cost column. When the cleanup rule becomes the villain, you know who government is serving.",
        "rationale": "The Los Angeles Times documented a Trump-era public-health rollback that favored industry over toxic-exposure protections.",
        "source_url": "https://www.latimes.com/environment/story/2026-03-13/trump-epa-moves-to-roll-back-recent-limits-on-ethyene-oxide-carcinogen",
        "source_title": "Federal EPA moves to roll back recent limits on ethylene oxide, a carcinogen",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2159,
        "title": "A California DACA Recipient Had to Sue Trump After Being Deported Anyway",
        "date_start": "2026-03-11",
        "date_end": "2026-03-11",
        "category": "Human Rights Violations",
        "subcategory": "Deportation Abuse",
        "metrics_key": "immigration",
        "keywords": ["daca recipient", "wrongful deportation", "lawsuit", "california immigrant", "trump administration"],
        "scores": (5, 4, 7, 8, 7, 7, 8, 8),
        "rationale_short": "A DACA recipient had to sue just to try to undo a deportation that should not have happened.",
        "synopsis": "Mara de Jesus Estrada Juarez, a California DACA recipient, sued the Trump administration after being deported despite the protection that program was supposed to provide. The case captures the deep insecurity built into Trump-era immigration policy. Even when people follow the rules, the state reserves the right to ruin their lives first and litigate later.",
        "rationale": "The Los Angeles Times documented a concrete deportation case that exposed how fragile legal protections became under Trump.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-11/california-daca-recipient-sues-trump-administration-over-her-deportation",
        "source_title": "California DACA recipient sues Trump administration over her deportation",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2160,
        "title": "Trump Turned Congress Into an Afterthought in the Iran War",
        "date_start": "2026-03-15",
        "date_end": "2026-03-15",
        "category": "Government Corruption",
        "subcategory": "War Powers Abuse",
        "metrics_key": "war",
        "keywords": ["congress sidelined", "war powers", "iran war", "republican block", "authorization"],
        "scores": (5, 5, 7, 8, 8, 7, 8, 8),
        "rationale_short": "Republicans helped Trump treat Congress like optional scenery in a war that still needed legal authority.",
        "synopsis": "The Los Angeles Times detailed how Congress became an afterthought as Republicans blocked measures that would have forced Trump to seek approval for further hostilities in Iran. This is one of those constitutional crimes with a necktie on. The law does not disappear in a war; the political will to enforce it does, and Trump counts on that collapse every time.",
        "rationale": "The Los Angeles Times documented Trump's reliance on congressional surrender rather than lawful war authorization.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-15/how-congress-became-afterthought-in-war-with-iran",
        "source_title": "How Congress became an afterthought in the war with Iran",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2161,
        "title": "Trump Talked About 'Winding Down' the War While Sending More Marines",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["winding down", "2500 marines", "middle east deployment", "war contradiction", "trump escalation"],
        "scores": (5, 5, 8, 6, 7, 8, 8, 9),
        "rationale_short": "Trump sold a wind-down narrative at the exact moment the Pentagon was dispatching thousands more Marines.",
        "synopsis": "Trump said the United States was considering winding down the war even as the Pentagon sent about 2,500 California-based Marines and more warships to the region. That contradiction deserves its own entry because it is the core Trump move: announce restraint while operational reality keeps escalating. The lie is not a side effect. It is part of the deployment.",
        "rationale": "The Los Angeles Times captured Trump's gap between de-escalation rhetoric and actual force movements.",
        "source_url": "https://www.latimes.com/politics/story/2026-03-20/iran-war-oil-prices",
        "source_title": "Trump weighs 'winding down' war as Pentagon sends 2,500 California Marines to Mideast",
        "source_publisher": "Los Angeles Times",
    },
    {
        "entry_number": 2162,
        "title": "Trump's Iran War Raised the Danger for Americans Already Trapped in Iranian Prisons",
        "date_start": "2026-03-20",
        "date_end": "2026-03-20",
        "category": "National Security Violations",
        "subcategory": "Hostage Endangerment",
        "metrics_key": "war",
        "keywords": ["iran detainees", "american prisoners", "heightened danger", "evin prison", "trump war"],
        "scores": (5, 4, 7, 6, 6, 7, 8, 7),
        "rationale_short": "Former detainees warned that Trump's war put imprisoned Americans in even deeper danger.",
        "synopsis": "Former Iran detainees told CBS they feared Americans still held in Iranian prisons faced heightened danger as the war widened. This is the sort of consequence hawks always talk around because it complicates the macho script. Real human beings become leverage, shields, or retaliation targets while the adults on television keep saying the campaign is going well.",
        "rationale": "CBS documented a direct human-security consequence of the war beyond headlines about strategy and markets.",
        "source_url": "https://www.cbsnews.com/news/former-iran-detainee-fears-americans-iranian-prisons-danger",
        "source_title": "Former Iran detainees fear Americans held in Iranian prisons face heightened danger",
        "source_publisher": "CBS News",
    },
    {
        "entry_number": 2163,
        "title": "Most Americans Said Trump's Iran War Wasn't Going Well",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "National Security Violations",
        "subcategory": "War / Political Fallout",
        "metrics_key": "war",
        "keywords": ["iran war poll", "public backlash", "not going well", "maga support", "trump confidence"],
        "scores": (5, 5, 5, 5, 5, 7, 9, 7),
        "rationale_short": "Polling showed the war was losing the country even while Trump loyalists kept cheering it on.",
        "synopsis": "A CBS poll found most Americans thought the Iran war was not going well, even as many Republicans and especially MAGA voters kept expressing confidence in Trump himself. That split matters because it shows how personal loyalty keeps overpowering plain evidence. The war can look bad, feel bad, and still remain protected inside the cult.",
        "rationale": "CBS provided a clean snapshot of public disapproval colliding with Trump-personality insulation inside the GOP.",
        "source_url": "https://www.cbsnews.com/news/opinion-poll-iran-war-regime-2028-03-22",
        "source_title": "Poll: Most say Iran war not going well, but don't want regime left in power",
        "source_publisher": "CBS News",
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
