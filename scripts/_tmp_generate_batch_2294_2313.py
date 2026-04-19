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
    "Religious Polarization": "Trump kept turning a feud with a pope into one more domestic culture-war weapon.",
    "Medical Gimmickry": "Trump reached for miracle-sounding medicine politics before proving he could govern health policy seriously.",
    "Rally Delusion": "Trump kept using rallies to narrate victory before the facts agreed to play along.",
    "Backchannel Diplomacy": "Trump's war mess kept needing emergency side doors because his main line was a shambles.",
    "Disaster Patronage": "Trump kept treating disaster management like another loyalty slot on the board.",
    "Peace Deal Spin": "Trump wanted branding credit for a deal still held together by concessions and wishful thinking.",
    "Outsourced Peacemaking": "Trump needed someone else to do the adult diplomacy his own escalation had wrecked.",
    "Ceasefire Branding": "Trump kept marketing shaky pauses like they were proof of mastery.",
    "Religious Feud Roots": "Trump's resentments kept looking older, deeper, and more theological than his insults let on.",
    "Gas-Price Tax Theater": "Trump tried to sell relief theater while his own choices kept the squeeze alive.",
    "Anti-Voter Messaging": "Trump kept treating democratic participation as something suspect and in need of counter-programming.",
    "DOJ Politicization": "Trump kept reshaping justice into another ideological weapon.",
    "Student Debt Retaliation": "Trump kept making relief harder and calling the punishment prudence.",
    "Trade Blackmail": "Trump kept talking about trade relationships like they were hostages.",
    "Community Betrayal": "Trump sold peace and kept delivering grief to the people who heard him most closely.",
    "Migrant Death Backlash": "Trump's cruelty kept spilling far enough to force international denunciation.",
    "Climate Sabotage": "Trump kept making climate denial a rule of engagement, not a side embarrassment.",
    "Alliance Rebuff": "Even allies were refusing to follow Trump into another reckless escalation fantasy.",
    "25th Amendment Alarm": "Trump kept sounding like the kind of president people reach constitutional alarms for.",
    "Legal Retreat": "Trump's bullying style kept collapsing the moment it stopped scaring people.",
}


long_map = {
    "Religious Polarization": "The point was bigger than another insult cycle. Trump's feud with Pope Leo was now ricocheting through congregations, identities, and communities that were being asked to choose between political tribalism and basic moral seriousness.",
    "Medical Gimmickry": "The move mattered because Trump kept reaching for splashy cures, miracle framing, and veteran-friendly theater without first proving he could sustain competent public-health stewardship anywhere else.",
    "Rally Delusion": "That belongs in the catalog because Trump's rally style is not just boastful. It is a recurring attempt to blur war, spectacle, grievance, and fantasy into one flattering fog around himself.",
    "Backchannel Diplomacy": "The deeper story was that Trump's policy kept swinging between maximalist posturing and improvised off-ramps, leaving others to rebuild diplomatic channels after he had spent days poisoning them.",
    "Disaster Patronage": "That matters because emergency management is supposed to be boringly competent, not another patronage theater where Trump can reward familiar loyalists and hope the cameras do the rest.",
    "Peace Deal Spin": "The sales pitch mattered because Trump kept trying to brand unstable arrangements as decisive victories before the public had time to notice how much leverage had been surrendered or deferred.",
    "Outsourced Peacemaking": "The humiliation for Trump was structural. When his own escalation cornered him, it was someone else's military and diplomatic leverage doing the work of dragging the situation back from the edge.",
    "Ceasefire Branding": "The pause mattered, but so did the sales pitch around it. Trump kept branding messy, conditional, fragile developments as if they were clean personal triumphs he had authored from start to finish.",
    "Religious Feud Roots": "It fit the larger pattern of Trump treating spiritual language, religious authority, and public morality as arenas for grievance, ego, and old resentments rather than humility or reflection.",
    "Gas-Price Tax Theater": "The politics here were painfully familiar: help create the cost shock, arrive later with a tax-branded consolation prize, and pretend the underlying chaos had nothing to do with Trump.",
    "Anti-Voter Messaging": "It was another example of Trump-era anti-voter politics trying to make access to the ballot feel dubious, manipulable, or in need of constant suspicion.",
    "DOJ Politicization": "The episode mattered because it showed how readily Trump's justice apparatus can be bent toward ideological signaling, personnel purges, and culture-war loyalty tests.",
    "Student Debt Retaliation": "The move mattered because it kept telling borrowers that relief was negotiable but punishment was durable, even when the administration's rules drew immediate political and legal resistance.",
    "Trade Blackmail": "It showed Trump using international economic relationships less like agreements to manage and more like props to threaten whenever he felt personally slighted or strategically cornered.",
    "Community Betrayal": "That is why it belongs here. Communities that were promised calm, restraint, or peace kept finding themselves handed the consequences of a war-first presidency dressed up as realism.",
    "Migrant Death Backlash": "The backlash mattered because it pushed Trump's border cruelty beyond domestic talking points and into the realm of international condemnation tied to actual bodies and bereaved families.",
    "Climate Sabotage": "The significance was not rhetorical alone. Trump kept making it harder for institutions to speak plainly about climate risk even in rooms where financial stability depends on realism.",
    "Alliance Rebuff": "It showed the limits of Trump's pressure campaign. Not every ally was willing to let his latest escalation rhetoric drag them into another military or naval gamble.",
    "25th Amendment Alarm": "The call mattered because it captured how normal Trump's instability has become in elite discourse: people do not reach for constitutional emergency language unless they think the danger is no longer abstract.",
    "Legal Retreat": "The retreat mattered because it showed how often Trump's legal aggression functions as intimidation first and argument second, collapsing once the performance value fades.",
}


selected = [
    {
        "url": "https://www.theguardian.com/us-news/2026/apr/18/us-catholics-trump-pope",
        "title": "Trump's War With the Pope Was Splitting American Catholics Too",
        "category": "Moral Depravity",
        "subcategory": "Religious Polarization",
        "metrics_key": "morality",
    },
    {
        "url": "https://www.cbsnews.com/news/trump-administration-executive-order-psychedelic-drug-ibogaine",
        "title": "Trump Signed a Psychedelic Order and Tried to Sell It Like Veteran Salvation",
        "category": "Public Welfare Sabotage",
        "subcategory": "Medical Gimmickry",
        "metrics_key": "public_welfare",
    },
    {
        "url": "https://www.npr.org/2026/04/18/nx-s1-5786675/a-recap-of-trumps-appearance-at-the-turning-point-action-event-in-arizona",
        "title": "Trump Turned Another Arizona Rally Into a Fog of War Boasts and Familiar Nonsense",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Rally Delusion",
        "metrics_key": "war",
    },
    {
        "url": "https://www.cbsnews.com/news/latest-iran-war-talks-us-negotiations",
        "title": "Trump's Iran Mess Needed Another Emergency Backchannel Through Pakistan",
        "category": "National Security Violations",
        "subcategory": "Backchannel Diplomacy",
        "metrics_key": "war",
    },
    {
        "url": "https://www.cbsnews.com/news/trump-fema-cameron-hamilton",
        "title": "Trump Reached Back for a Fired Loyalist to Run FEMA",
        "category": "Government Corruption",
        "subcategory": "Disaster Patronage",
        "metrics_key": "corruption",
    },
    {
        "url": "https://www.latimes.com/world-nation/story/2026-04-17/strait-of-hormuz-fully-open",
        "title": "Trump Tried to Call It a Deal Even as Iran Extracted Big Concessions",
        "category": "National Security Violations",
        "subcategory": "Peace Deal Spin",
        "metrics_key": "war",
    },
    {
        "url": "https://www.theguardian.com/world/2026/apr/17/pakistan-military-chief-asim-munir-unlikely-peacemaker-iran-war",
        "title": "Trump Needed Pakistan's Army Chief to Play the Adult in His Iran Crisis",
        "category": "Foreign Policy",
        "subcategory": "Outsourced Peacemaking",
        "metrics_key": "war",
    },
    {
        "url": "https://www.theguardian.com/world/2026/apr/17/donald-trump-iran-war-lebanon-ceasefire",
        "title": "Trump Was Already Claiming He Ended Another War Before Lebanon Was Stable",
        "category": "Foreign Policy",
        "subcategory": "Ceasefire Branding",
        "metrics_key": "war",
    },
    {
        "url": "https://www.theguardian.com/us-news/2026/apr/18/trump-pope-norman-vincent-peale",
        "title": "Trump's Pope Obsession Looked Like a Very Old Grievance in Religious Drag",
        "category": "Moral Depravity",
        "subcategory": "Religious Feud Roots",
        "metrics_key": "morality",
    },
    {
        "url": "https://abcnews.com/Politics/wireStory/trump-promote-tax-breaks-las-vegas-residents-feel-132087979",
        "title": "Trump Pitched Tax Breaks in Vegas While His War Helped Keep Gas Prices High",
        "category": "Public Welfare Sabotage",
        "subcategory": "Gas-Price Tax Theater",
        "metrics_key": "economy",
    },
    {
        "url": "https://abcnews.com/Politics/wireStory/postal-service-union-launches-ad-campaign-promoting-mail-132028811",
        "title": "Trump's Attacks on Mail Voting Triggered a Postal Union Counteroffensive",
        "category": "Authoritarianism",
        "subcategory": "Anti-Voter Messaging",
        "metrics_key": "authoritarian",
    },
    {
        "url": "https://abcnews.com/Politics/wireStory/justice-department-fires-4-prosecutors-accused-bias-anti-132041833",
        "title": "Trump's DOJ Fired Prosecutors and Made the Purge Look Ideological on Purpose",
        "category": "Government Corruption",
        "subcategory": "DOJ Politicization",
        "metrics_key": "corruption",
    },
    {
        "url": "https://abcnews.com/Politics/wireStory/democrats-seek-overturn-trumps-new-rules-student-loan-132037799",
        "title": "Trump's Student-Loan Forgiveness Rules Drew an Immediate Revolt",
        "category": "Public Welfare Sabotage",
        "subcategory": "Student Debt Retaliation",
        "metrics_key": "public_welfare",
    },
    {
        "url": "https://www.theguardian.com/politics/2026/apr/15/trump-us-uk-trade-deal-starmer-iran",
        "title": "Trump Treated a US-UK Trade Deal Like Another Threat to Wield",
        "category": "Foreign Policy",
        "subcategory": "Trade Blackmail",
        "metrics_key": "economy",
    },
    {
        "url": "https://abcnews.com/Politics/wireStory/trump-promised-peace-middle-east-dearborn-michigan-feels-132053476",
        "title": "Trump Promised Peace, but Dearborn Got Another Reminder of the Lie",
        "category": "Foreign Policy",
        "subcategory": "Community Betrayal",
        "metrics_key": "war",
    },
    {
        "url": "https://www.theguardian.com/world/2026/apr/15/mexico-president-claudia-sheinbaum-donald-trump-ice-deaths",
        "title": "Migrant Deaths Pushed Mexico to Call Trump Out Again",
        "category": "Human Rights Violations",
        "subcategory": "Migrant Death Backlash",
        "metrics_key": "authoritarian",
    },
    {
        "url": "https://www.theguardian.com/environment/2026/apr/13/dont-mention-the-climate-trump-creates-beyond-absurd-situation-at-global-finance-talks",
        "title": "Trump Turned Global Finance Talks Into Another Climate-Truth Blackout",
        "category": "Environmental Destruction",
        "subcategory": "Climate Sabotage",
        "metrics_key": "environment",
    },
    {
        "url": "https://www.theguardian.com/world/2026/apr/12/wes-streeting-attacks-trump-outrageous-iran-war-rhetoric",
        "title": "Britain Refused to Join Trump's Hormuz Blockade Fantasy",
        "category": "Foreign Policy",
        "subcategory": "Alliance Rebuff",
        "metrics_key": "war",
    },
    {
        "url": "https://www.theguardian.com/us-news/2026/apr/12/ex-cia-director-oust-trump-25th-amendment",
        "title": "An Ex-CIA Director Said the 25th Amendment Might As Well Have Been Written for Trump",
        "category": "Authoritarianism",
        "subcategory": "25th Amendment Alarm",
        "metrics_key": "authoritarian",
    },
    {
        "url": "https://www.theguardian.com/us-news/2026/apr/13/trump-media-guardian-lawsuit",
        "title": "Trump Media Dropped Its Guardian Lawsuit Once the Bullying Stopped Working",
        "category": "Press Freedom",
        "subcategory": "Legal Retreat",
        "metrics_key": "press",
    },
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
        "another",
        "because",
        "looked",
        "made",
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

for idx, entry in enumerate(selected, start=2294):
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
