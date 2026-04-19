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
    "war": (7, 7, 9, 6, 7, 8, 9, 9),
    "economy": (6, 6, 7, 5, 5, 8, 8, 8),
    "public_welfare": (6, 5, 8, 6, 6, 7, 8, 8),
    "authoritarian": (6, 6, 7, 8, 7, 8, 8, 8),
    "press": (6, 6, 6, 7, 7, 8, 8, 7),
    "corruption": (6, 6, 7, 7, 8, 8, 8, 7),
    "morality": (7, 9, 5, 5, 4, 8, 7, 6),
    "environment": (5, 6, 7, 6, 5, 7, 8, 7),
}


short_map = {
    "Ceasefire Branding": "Trump kept marketing shaky pauses like they were proof of mastery.",
    "Climate Denial Capture": "Climate denial kept getting promoted from fringe posture to governing instinct.",
    "False Peace Branding": "Trump kept calling the chaos progress because the branding mattered more than the truth.",
    "Lebanon Escalation": "Trump kept talking peace while the region kept burning into new territory.",
    "Science Sabotage": "Trump kept praising institutions he was busy gutting behind the scenes.",
    "Infrastructure Threats": "Trump kept reaching for threats against systems civilians rely on to live.",
    "Safety Rollback": "The cuts kept landing on ordinary people long after the slogan-writing stopped.",
    "War-Crimes Warnings": "Trump's threats were lurid enough to make war-crime language unavoidable.",
    "Energy Shock": "Everyone else kept eating the economic cost of Trump's war posture.",
    "War-Crimes Threats": "Trump kept talking about annihilation like it was a normal negotiating style.",
    "Media Intimidation": "Trump kept trying to make scrutiny itself feel punishable.",
    "War Deceit": "Trump kept inventing reassuring stories the facts did not support.",
    "Civil Rights Rollback": "Trump kept stripping protections from targeted groups and calling it order.",
    "Carceral Spectacle": "Trump kept reaching for theatrical punishment instead of anything resembling policy seriousness.",
    "Narrative Blowback": "Even people close to the military story were drifting away from the official script.",
    "Vanity / Cult of Personality": "The point was not governance. The point was Trump, again.",
    "Budget Cruelty": "Trump's spending choices kept saying human need was negotiable and force was not.",
    "Manufactured Governance Crisis": "Trump kept creating the chaos his own emergency orders then claimed to solve.",
    "Alliance Sabotage": "Trump kept confusing public humiliation of allies with strategy.",
    "Fraud Crackdown": "Trump kept dressing partisan theater up as anti-fraud law enforcement.",
    "Voting Restrictions": "The administration kept treating democratic participation as something to police.",
    "Intelligence Chaos": "Trump kept treating national-security jobs like positions in a loyalty pageant.",
    "Loyalty Purge": "Even loyalists were disposable the second Trump decided they were a bad prop.",
    "War Rationale Collapse": "Trump kept undercutting his own war case the second he opened his mouth.",
    "Market Shock": "The market kept translating Trump's threats into instant public pain.",
}


long_map = {
    "Ceasefire Branding": "The pause mattered, but so did the sales pitch around it. Trump kept branding messy, conditional, fragile developments as if they were clean personal triumphs he had authored from start to finish.",
    "Climate Denial Capture": "It showed the administration's environmental posture as something deeper than rollback. Climate denial was not an embarrassment hiding in the wings any more. It was getting stage time.",
    "False Peace Branding": "That mattered because Trump kept using the language of peace to describe situations that were still violent, unstable, and strategically incoherent beneath the headline.",
    "Lebanon Escalation": "The deeper significance was the same pattern this archive keeps tracking: Trump talks de-escalation while allied or US-linked violence keeps widening the footprint of the crisis.",
    "Science Sabotage": "The lie mattered because it captured a recurring Trump move: bask in the prestige of institutions and scientific achievements he is simultaneously trying to starve, shrink, or break.",
    "Infrastructure Threats": "That belongs here because threatening essential infrastructure is not some harmless flourish. It is the language of maximum disruption, with civilian consequences built into the logic of the threat.",
    "Safety Rollback": "The harm outlived the headline because once Trump cuts preventive work, the fallout keeps arriving in communities that never volunteered to be part of his austerity theater.",
    "War-Crimes Warnings": "The warnings mattered because they showed how openly Trump's rhetoric was colliding with the laws and norms that are supposed to constrain state violence in wartime.",
    "Energy Shock": "This is what makes the story larger than a commodity chart. Trump's choices kept turning geopolitical recklessness into higher costs and deeper economic insecurity for everyone else.",
    "War-Crimes Threats": "The threat mattered because it showed how instinctively Trump reaches for civilizational-scale punishment and then calls the resulting horror leverage.",
    "Media Intimidation": "The point was not information security alone. It was to remind journalists that under Trump, truth-seeking can be reframed as something criminal, hostile, or personally disloyal.",
    "War Deceit": "That is why it belongs in the catalog. Trump kept narrating outcomes and public sentiment into existence as if saying them loudly enough could replace evidence.",
    "Civil Rights Rollback": "The move mattered because it kept shrinking the official space in which vulnerable groups can expect the government to defend their rights rather than casually trade them away.",
    "Carceral Spectacle": "The story was revealing because it showed Trump's fascination with theatrical punishment and iconic cruelty as branding tools, not just policy preferences.",
    "Narrative Blowback": "It showed the limits of propaganda. Even in pro-military online spaces, the official story was fraying because the lived reality of the war kept leaking through.",
    "Vanity / Cult of Personality": "The significance was not aesthetic alone. Trump keeps trying to turn public life, national symbolism, and state architecture into oversized props for his ego.",
    "Budget Cruelty": "The budget logic remained brutally familiar: starve social need, reward coercive capacity, and call the resulting hierarchy common sense.",
    "Manufactured Governance Crisis": "That matters because Trump keeps manufacturing dysfunction and then posing as the only man strong enough to patch the crisis he helped cause.",
    "Alliance Sabotage": "Trump kept treating allies less like partners than props, publicly belittling them and then acting surprised when solidarity got harder to maintain.",
    "Fraud Crackdown": "The story mattered because Trump's favorite governance trick remains the same: invent a threat, aim the state at a political target, and call the spectacle integrity.",
    "Voting Restrictions": "It was another example of Trump-era anti-voter politics trying to push participation through narrower and more punitive gates.",
    "Intelligence Chaos": "The episode mattered because it showed how lightly Trump treats roles that are supposed to anchor serious national-security judgment.",
    "Loyalty Purge": "That is why the firing mattered beyond one cabinet fight. Under Trump, loyalty is never a shield for long. It is just a temporary costume until he needs a fresh sacrifice.",
    "War Rationale Collapse": "The line mattered because it showed Trump casually kneecapping one of the central justifications for the war the moment it became inconvenient to sound consistent.",
    "Market Shock": "It showed how quickly Trump's latest threat could cascade into oil spikes, market losses, and wider public anxiety, long before any alleged strategic gain became visible.",
}


selected = [
    {"url": "https://www.theguardian.com/us-news/2026/apr/07/trump-iran-war-ceasefire", "title": "Trump Declared a Provisional Ceasefire While the War Was Still Smoldering", "category": "Foreign Policy", "subcategory": "Ceasefire Branding", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/08/epa-chief-zeldin-climate-denying-group-event", "title": "Trump's EPA Chief Went Onstage With a Climate-Denial Crowd Like It Was Perfectly Normal", "category": "Environmental Destruction", "subcategory": "Climate Denial Capture", "metrics_key": "environment"},
    {"url": "https://www.latimes.com/politics/story/2026-04-08/iran-ceasefire-deal-frays-as-attacks-continue-trumps-peace-terms-remain-unclear", "title": "Trump's Ceasefire Pitch Started Fraying Before the Ink Was Dry", "category": "National Security Violations", "subcategory": "False Peace Branding", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/world/2026/apr/08/israel-operations-in-lebanon-to-continue-despite-trump-ceasefire-iran-pakistan-hezbollah", "title": "Trump's Peace Talk Could Not Stop Another Mass Killing in Lebanon", "category": "Foreign Policy", "subcategory": "Lebanon Escalation", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/science/2026/apr/07/trump-artemis-ii-crew-call-nasa-cuts", "title": "Trump Told Astronauts He Saved NASA While Trying to Gut It", "category": "Public Welfare Sabotage", "subcategory": "Science Sabotage", "metrics_key": "public_welfare"},
    {"url": "https://www.latimes.com/politics/story/2026-04-07/trumps-message-to-iran-on-deadline-day-a-whole-civilization-will-die-tonight", "title": "Trump Backed Off for Two Weeks Only After Threatening to Destroy a Whole Civilization", "category": "National Security Violations", "subcategory": "Infrastructure Threats", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/07/gun-violence-funding-cuts-california-trump", "title": "Trump Cut Gun-Violence Prevention and Left Communities to Take the Hit", "category": "Public Welfare Sabotage", "subcategory": "Safety Rollback", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/07/trump-iran-threats-retired-military-war-crimes", "title": "Retired Officers Looked at Trump's Iran Threats and Saw Possible War Crimes", "category": "National Security Violations", "subcategory": "War-Crimes Warnings", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/business/2026/apr/07/oil-prices-donald-trump-iran-stock-market-imf-inflation", "title": "Trump's Iran War Was Threatening an Energy Shock Bigger Than Three Historic Crises Combined", "category": "Public Welfare Sabotage", "subcategory": "Energy Shock", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/world/2026/apr/07/israel-warns-iran-lives-at-risk-if-they-use-trains-trump-deadline", "title": "Trump Threatened That a Whole Civilization Could Die if Iran Refused Him", "category": "National Security Violations", "subcategory": "War-Crimes Threats", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/06/trump-threats-journalist-missing-airman-iran", "title": "Trump Threatened to Jail a Journalist for Reporting on His Missing Airman Problem", "category": "Press Freedom", "subcategory": "Media Intimidation", "metrics_key": "press"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/06/trump-iranians-strikes-on-infrastructure", "title": "Trump Claimed Iranians Welcomed US Infrastructure Strikes Without Proof", "category": "Conspiracy Theories / Disinformation", "subcategory": "War Deceit", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/06/trump-administration-ends-civil-rights-settlements-trans-students", "title": "Trump Started Unwinding Civil-Rights Deals That Protected Trans Students", "category": "Authoritarianism", "subcategory": "Civil Rights Rollback", "metrics_key": "authoritarian"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/trump-alcatraz-prison", "title": "Trump Wanted Federal Money for an Alcatraz Prison Spectacle", "category": "Government Corruption", "subcategory": "Carceral Spectacle", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/04/military-tiktok-iran-war-trump-hegseth", "title": "Even MilitaryTok Was Starting to Drift Away From Trump's Iran Story", "category": "National Security Violations", "subcategory": "Narrative Blowback", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/artanddesign/2026/apr/03/donald-trump-presidential-library-gaudy-monstrosity-architecture-bling", "title": "Trump's Presidential Library Looked Like a Self-Worship Casino in Waiting", "category": "Moral Depravity", "subcategory": "Vanity / Cult of Personality", "metrics_key": "morality"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/defense-spending-trump-budget-proposal", "title": "Trump's Budget Poured Money Into the Pentagon While Slashing the Rest", "category": "Public Welfare Sabotage", "subcategory": "Budget Cruelty", "metrics_key": "public_welfare"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/trump-executive-order-dhs-pay-partial-shutdown", "title": "Trump Had to Order DHS Payroll Because His Own Chaos Was Breaking the Government", "category": "Government Corruption", "subcategory": "Manufactured Governance Crisis", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/trump-claims-starmer-weak-mocks-pm-uk-aircraft-carriers-iran-war", "title": "Trump Called Starmer Weak and Went Back to Mocking British Carriers", "category": "Foreign Policy", "subcategory": "Alliance Sabotage", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/trump-vance-fraud-arrest-crackdown-california", "title": "Trump Rolled Out a Fraud Crackdown That Started With Democratic Territory", "category": "Authoritarianism", "subcategory": "Fraud Crackdown", "metrics_key": "authoritarian"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/03/attorneys-general-trump-mail-in-voting-lawsuit", "title": "Trump's Mail-Voting Restrictions Drew a Multi-State Lawsuit Almost Immediately", "category": "Authoritarianism", "subcategory": "Voting Restrictions", "metrics_key": "authoritarian"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/02/trump-iran-war-address-backlash", "title": "Trump's Prime-Time Iran Address Landed as a Litany of Lies", "category": "Conspiracy Theories / Disinformation", "subcategory": "War Deceit", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/world/2026/apr/02/trump-warns-tehran-more-to-follow-after-strike-destroys-irans-largest-bridge", "title": "Trump Blew Up Iran's Largest Bridge and Then Promised More to Come", "category": "National Security Violations", "subcategory": "Infrastructure Threats", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/02/trump-100-tariff-us-pharmaceutical-drug-makers", "title": "Trump Threatened Drug Makers With 100% Tariffs While Pretending It Was About Lower Prices", "category": "Public Welfare Sabotage", "subcategory": "Market Shock", "metrics_key": "economy"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/02/trump-tulsi-gabbard-intelligence-chief", "title": "Trump Was Already Polling Advisers About Replacing His Intelligence Chief", "category": "Government Corruption", "subcategory": "Intelligence Chaos", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/02/trump-pam-bondi-attorney-general", "title": "Trump Dumped Pam Bondi the Moment Her Loyal Service Stopped Helping Him", "category": "Government Corruption", "subcategory": "Loyalty Purge", "metrics_key": "corruption"},
    {"url": "https://www.theguardian.com/us-news/2026/apr/02/republicans-trump-leave-nato", "title": "Even Republican Senators Started Breaking With Trump on NATO", "category": "Foreign Policy", "subcategory": "Alliance Sabotage", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/world/2026/apr/02/trump-iran-war-rationale-uranium-stockpiles", "title": "Trump Shrugged That He Didn't Care About Iran's Uranium Stockpiles and Undercut His Own War Case", "category": "National Security Violations", "subcategory": "War Rationale Collapse", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/world/2026/apr/02/you-have-to-be-serious-macron-criticises-trumps-mixed-messages-about-nato-and-iran", "title": "Macron Had to Tell Trump to Get Serious About NATO and Iran", "category": "Foreign Policy", "subcategory": "Alliance Sabotage", "metrics_key": "war"},
    {"url": "https://www.theguardian.com/business/2026/apr/02/oil-price-rises-markets-slide-following-trump-iran-war-address", "title": "Trump's Latest Iran Warning Immediately Rattled Oil and Markets Again", "category": "Public Welfare Sabotage", "subcategory": "Market Shock", "metrics_key": "economy"},
]


def load_sources():
    with open(POOL_PATH, "r", encoding="utf-8") as f:
        pool = json.load(f)
    return {normalize_url(item["url"]): item for item in pool}


def make_keywords(title: str, category: str, subcategory: str, bucket: str):
    base = [category.lower(), subcategory.lower(), "donald trump"]
    bucket_extra = {
        "war": ["iran war", "war escalation"],
        "economy": ["economic fallout", "cost of living"],
        "public_welfare": ["public harm", "government cuts"],
        "authoritarian": ["executive overreach", "democratic norms"],
        "press": ["press freedom", "media intimidation"],
        "corruption": ["abuse of power", "institutional damage"],
        "morality": ["public shame", "moral rot"],
        "environment": ["climate rollback", "environmental damage"],
    }[bucket]
    words = re.findall(r"[A-Za-z][A-Za-z'-]{3,}", title.lower())
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
        "kept",
        "again",
        "even",
        "started",
        "about",
    }
    picked = []
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

for idx, entry in enumerate(selected, start=2264):
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
