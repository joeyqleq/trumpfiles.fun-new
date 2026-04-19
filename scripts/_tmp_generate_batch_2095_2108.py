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
        "impressions": 205000000,
        "reach_estimate": 718000000,
        "financial_cost_usd": 1320000000,
        "public_reaction": {"negative": 81, "neutral": 13, "positive": 6},
    },
    "rights": {
        "impressions": 181000000,
        "reach_estimate": 622000000,
        "financial_cost_usd": 500000000,
        "public_reaction": {"negative": 79, "neutral": 15, "positive": 6},
    },
    "corruption": {
        "impressions": 166000000,
        "reach_estimate": 570000000,
        "financial_cost_usd": 340000000,
        "public_reaction": {"negative": 79, "neutral": 15, "positive": 6},
    },
}


entries = [
    {
        "entry_number": 2095,
        "title": "Trump's Iran War Opened With a School Bombing the Evidence Points Back to the U.S.",
        "date_start": "2026-03-06",
        "date_end": "2026-03-06",
        "category": "Human Rights Violations",
        "subcategory": "Civilian Harm",
        "metrics_key": "rights",
        "keywords": ["iran school bombing", "minab girls school", "civilian harm", "blame shifting", "trump war"],
        "scores": (8, 4, 10, 8, 9, 9, 10, 10),
        "rationale_short": "Evidence indicated Trump's opening salvo hit a girls' school and then got wrapped in blame-shifting spin.",
        "synopsis": "Satellite imagery and video evidence suggested the deadly blast at a girls' school in Minab was likely caused by the U.S.-Israeli opening attack, not by some self-serving alternate story floated after the fact. If a war begins with schoolchildren dead and the evidence points back to Trump's side, that is not just collateral-damage jargon waiting to happen; it is a moral catastrophe. This entry exists because polite war language is built to launder exactly this kind of civilian bloodshed.",
        "rationale": "AP's reporting and imagery analysis tied one of the war's earliest mass-casualty events to the U.S.-Israeli assault Trump launched and defended.",
        "source_url": "https://apnews.com/article/iran-minab-girls-school-airstrike-us-israel-c3095dc9729881b567277a1c5c47efb2",
        "source_title": "Evidence suggests the deadly blast at an Iranian school was likely a US airstrike",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2096,
        "title": "Trump Demanded 'Unconditional Surrender' While the War Spread Into Lebanon",
        "date_start": "2026-03-06",
        "date_end": "2026-03-06",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["unconditional surrender", "lebanon strikes", "regional escalation", "trump ultimatum", "war spillover"],
        "scores": (8, 5, 10, 8, 8, 8, 10, 10),
        "rationale_short": "Trump paired maximalist surrender rhetoric with a widening war that had already spilled into Lebanon.",
        "synopsis": "Trump treated diplomacy as weakness and elevated 'unconditional surrender' rhetoric while Israeli strikes hit Lebanon, widening the conflict beyond the original Iran front. That combination matters because it frames escalation as a feature rather than a failure: impossible public demands up top, expanding civilian risk below. The point of cataloging this is simple: he was not searching for an off-ramp, he was helping market a bigger fire.",
        "rationale": "PBS documented Trump's refusal to entertain talks and the simultaneous expansion of the conflict into Lebanon, making the regional spillover part of the same political choice.",
        "source_url": "https://www.pbs.org/newshour/world/trump-rules-out-talks-absent-irans-unconditional-surrender-as-israel-strikes-lebanon",
        "source_title": "Trump rules out talks absent Iran's 'unconditional surrender' as Israel strikes Lebanon",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2097,
        "title": "Trump's Own Prewar Intelligence Said the Iran War Wasn't Likely to Change the Regime",
        "date_start": "2026-03-09",
        "date_end": "2026-03-09",
        "category": "Government Corruption",
        "subcategory": "Intelligence Suppression",
        "metrics_key": "corruption",
        "keywords": ["prewar intelligence", "regime change fantasy", "intelligence suppression", "war pretext", "trump iran"],
        "scores": (6, 4, 9, 8, 8, 9, 9, 9),
        "rationale_short": "Trump escalated toward war even though prewar intelligence said intervention was unlikely to topple Iran's leadership.",
        "synopsis": "An intelligence assessment completed before the war reportedly found that military intervention in Iran was unlikely to produce regime change, which makes Trump's later rhetoric look less like strategy and more like knowingly selling fantasy escalation. If your own analysts are telling you the war won't accomplish the political outcome being implied in public, the bluff stops being clever and starts looking fraudulent. This is where bad judgment bleeds into deliberate misrepresentation.",
        "rationale": "AP showed that key intelligence ran against the implied promise of regime-change success, yet Trump kept driving the public story toward a harder war.",
        "source_url": "https://apnews.com/article/iran-intelligence-assessment-trump-ad20c1f1168d4318af516d7b19d372e7",
        "source_title": "Prewar US intel assessment found intervention in Iran wasn't likely to change leadership",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2098,
        "title": "New Footage Undercut Trump's Blame-Shifting Story About the Minab School Blast",
        "date_start": "2026-03-09",
        "date_end": "2026-03-09",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "metrics_key": "corruption",
        "keywords": ["minab footage", "blame shifting", "school blast lie", "bellingcat", "trump disinformation"],
        "scores": (6, 5, 9, 7, 8, 10, 9, 9),
        "rationale_short": "New footage strengthened the case that Trump was pushing a false story about who caused the school blast.",
        "synopsis": "Fresh video evidence increased the likelihood that the Minab school explosion came from the U.S.-Israeli attack, not from the convenient story Trump floated afterward. That makes the lie almost as indicting as the strike itself: first the children die, then the blame gets shoved somewhere politically useful. This is exactly why the archive exists, to pin the factual sequence in place before the next outrage steamrolls the memory of it.",
        "rationale": "AP reported that newly released footage contradicted Trump's public blame-shifting about one of the war's deadliest early incidents.",
        "source_url": "https://apnews.com/article/iran-war-strike-school-minab-us-3f55b6ca193a3295bef5735a45a06368",
        "source_title": "New footage raises likelihood the US struck an Iranian school where a blast killed at least 165",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2099,
        "title": "Trump Left the Door Open to Sending Ground Troops Into Iran",
        "date_start": "2026-03-16",
        "date_end": "2026-03-16",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["ground troops", "boots on the ground", "escalation ladder", "iran invasion threat", "trump war"],
        "scores": (7, 5, 10, 8, 8, 8, 9, 10),
        "rationale_short": "Trump normalized the possibility of U.S. ground troops in Iran instead of closing off a catastrophic escalation path.",
        "synopsis": "Trump left the door open to sending U.S. ground troops into Iran, which is the sort of phrase presidents use right before pretending everyone else misunderstood them. The significance is not just military; it reveals how casually he treats escalation ladders that would cost other people their bodies, homes, and futures. Once a president says it on camera, the Overton window shifts and the war machine hears permission.",
        "rationale": "PBS captured Trump declining to rule out one of the most dangerous escalation steps available in the conflict.",
        "source_url": "https://www.pbs.org/video/iran-politics-w-lisa-liz-dis-1772489524/",
        "source_title": "Trump leaves door open for ground troops in Iran",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2100,
        "title": "Trump's Endgame for the Iran War Was 'More of the Same'",
        "date_start": "2026-03-11",
        "date_end": "2026-03-11",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["more of the same", "no endgame", "war doctrine", "trump quote", "iran war"],
        "scores": (7, 6, 9, 7, 8, 8, 9, 9),
        "rationale_short": "Trump answered a question about ending the war with a line that amounted to escalation without an endgame.",
        "synopsis": "Asked what the United States needed to do to end the Iran war, Trump answered with the strategic equivalent of stomping the accelerator and calling it a peace plan: 'more of the same.' The quote condensed the whole project into one sentence. No clear exit condition, no proportionality language, no visible limit, just brute repetition as policy and vibes as doctrine.",
        "rationale": "PBS captured Trump articulating an endgame so empty and violent that it functioned as an admission of strategic drift.",
        "source_url": "https://www.pbs.org/newshour/politics/watch-asked-what-u-s-needs-to-do-to-end-iran-war-trump-says-more-of-the-same",
        "source_title": "WATCH: Asked what U.S. needs to do to end Iran war, Trump says 'more of the same'",
        "source_publisher": "PBS NewsHour",
    },
    {
        "entry_number": 2101,
        "title": "Trump Blew Past Diplomacy on the Way to War, Then Asked China and Others to Clean Up the Mess",
        "date_start": "2026-03-16",
        "date_end": "2026-03-16",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "war",
        "keywords": ["diplomatic breakdown", "china mediation", "gut decision", "coordination collapse", "trump iran"],
        "scores": (7, 6, 8, 7, 7, 8, 9, 9),
        "rationale_short": "Trump sidelined diplomacy going into war and then hunted for outside help once the fallout spread.",
        "synopsis": "AP described Trump as relying on his gut and largely side-stepping diplomatic coordination on the way into war, then turning around to ask China and others for help once the consequences got harder to contain. That is classic Trump statecraft: sneer at process, improvise catastrophe, then act shocked that adults with mops are required. The entry matters because it captures not only aggression but the incompetence wired into the aggression.",
        "rationale": "AP's framing tied Trump's decision-making style directly to the diplomatic vacuum that followed the early strikes.",
        "source_url": "https://apnews.com/article/trump-china-iran-strait-hormuz-7ce3b6cd9ca6bd222dfe3236e10f8266",
        "source_title": "Trump side-stepped diplomacy on his way to war in Iran. Now, he's asking China and others for help",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2102,
        "title": "Trump's Iran War Cost Him a Counterterrorism Chief Who Said There Was No Imminent Threat",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Government Corruption",
        "subcategory": "Intelligence Suppression",
        "metrics_key": "corruption",
        "keywords": ["kent resignation", "no imminent threat", "war pretext", "counterterrorism chief", "trump iran"],
        "scores": (6, 4, 9, 8, 8, 9, 9, 9),
        "rationale_short": "A top counterterrorism official resigned and said the threat premise for Trump's war did not exist.",
        "synopsis": "A top counterterrorism official resigned over Trump's Iran war and said Iran posed no imminent threat, which goes directly to the heart of the justification story. When a senior official walks and publicly strips the urgency out of the casus belli, the administration is no longer arguing over tactics but over whether the premise was cooked in the first place. This belongs in a prosecutor's timeline and in a moral ledger at the same time.",
        "rationale": "AP reported a resignation that turned the war's public rationale into an internal credibility crisis.",
        "source_url": "https://apnews.com/article/trump-iran-war-kent-resignation-e2e17a76d79617a68370f076c0291208",
        "source_title": "Top counterterrorism official Kent resigns over Trump's Iran war, says Iran posed no imminent threat",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2103,
        "title": "Trump Fumed at NATO for Refusing to Secure Hormuz and Chose Unilateral Escalation Anyway",
        "date_start": "2026-03-17",
        "date_end": "2026-03-17",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "war",
        "keywords": ["nato split", "strait of hormuz", "ally isolation", "going it alone", "trump escalation"],
        "scores": (6, 5, 8, 7, 7, 8, 9, 8),
        "rationale_short": "Trump treated allied refusal as a dare to escalate alone instead of a warning sign that the war project was toxic.",
        "synopsis": "Trump demanded help securing the Strait of Hormuz, got rebuffed by NATO allies, and responded by leaning harder into unilateral swagger. That matters because it exposes the isolation cost of his war politics: he talks like a Caesar, but even allies started treating the scheme like radioactive luggage. Instead of reading the rejection as a caution light, he appeared to take it as permission to go even more cowboy.",
        "rationale": "AP showed that allied rejection did not moderate Trump's approach; it hardened the performative unilateralism.",
        "source_url": "https://apnews.com/article/trump-iran-nato-strait-of-hormuz-europe-4e0cf38708e9c3ba8ea2a36148620067",
        "source_title": "Trump fumes at NATO for refusing to help secure the Strait of Hormuz, and embraces going it alone",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2104,
        "title": "Trump's War Put Iran's South Pars Gas Lifeline in the Crosshairs",
        "date_start": "2026-03-18",
        "date_end": "2026-03-18",
        "category": "Human Rights Violations",
        "subcategory": "Civilian Harm",
        "metrics_key": "rights",
        "keywords": ["south pars", "energy lifeline", "civilian infrastructure", "collective punishment", "iran war"],
        "scores": (6, 4, 9, 7, 8, 8, 9, 9),
        "rationale_short": "Attacks touching Iran's main gas lifeline pushed Trump's war deeper into civilian-linked infrastructure pressure.",
        "synopsis": "South Pars is not some random patch of industrial scenery; it is a major energy lifeline for Iran, which is exactly why attacks around it carry civilian and economic consequences well beyond battlefield theatrics. Under Trump's war logic, pressure on civilian-linked systems gets wrapped in the language of leverage and deterrence. The archive has to translate that euphemism back into plain English: threatening the systems people need to live is part of the violence.",
        "rationale": "AP's South Pars reporting captured how the conflict was threatening infrastructure ordinary people depend on to survive.",
        "source_url": "https://apnews.com/article/iran-gas-field-south-pars-attack-5ad45090d3b66444467cc255ee966a37",
        "source_title": "The attacked South Pars natural gas field is an energy lifeline for Iran",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2105,
        "title": "Trump Hollowed Out the State Department and Then Needed It for the Iran War",
        "date_start": "2026-03-19",
        "date_end": "2026-03-19",
        "category": "Foreign Policy",
        "subcategory": "Diplomatic Breakdown",
        "metrics_key": "corruption",
        "keywords": ["state department cuts", "experts gone", "foreign policy incompetence", "bureau gaps", "trump war"],
        "scores": (6, 5, 8, 7, 7, 8, 9, 8),
        "rationale_short": "Trump's staffing cuts left the government short on exactly the expertise a regional war demanded.",
        "synopsis": "The widening Iran war exposed how badly the Trump team had hollowed out the State Department and the expertise a crisis like this actually requires. This is one of those entries that looks less cinematic than a missile strike and is therefore easy to forget, even though the incompetence compounds every other danger. A government that purges experts and then stumbles into war is not merely reckless; it is structurally stupid.",
        "rationale": "AP tied staffing and expertise cuts directly to the government's weakened capacity during the war.",
        "source_url": "https://apnews.com/article/iran-state-department-doge-trump-expertise-staffing-007f0976bb17c4f3a6bc33aeb759e9d9",
        "source_title": "Where did the experts go? State Department cuts limit the Iran war effort",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2106,
        "title": "Congress Started Asking for Trump's Exit Plan Because He Took the Country to War Without One",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "metrics_key": "war",
        "keywords": ["exit plan", "war powers", "congress backlash", "unconstitutional war", "trump iran"],
        "scores": (6, 5, 9, 8, 8, 8, 9, 9),
        "rationale_short": "Lawmakers were left asking the most basic war question because Trump launched the conflict without a credible endgame.",
        "synopsis": "Congress started asking for Trump's exit plan because he dragged the country into war without a vote of support and without offering a convincing answer about how it ends. That is not a minor process gripe. It is the constitutional skeleton showing through the costume, with lawmakers essentially asking whether the president confused 'I can start this' with 'I thought this through.'",
        "rationale": "AP's congressional reporting highlighted that the war had a trigger-happy beginning and a conspicuously thin theory of termination.",
        "source_url": "https://apnews.com/article/iran-war-powers-exit-strategy-congress-trump-781ef538fbb493cf0973c6a89698f36e",
        "source_title": "Congress looks for Trump's exit plan as the Iran war drags on",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2107,
        "title": "Trump Claimed the Iran War Was 'Winding Down' While Adding Troops and Floating Sanction Relief",
        "date_start": "2026-03-21",
        "date_end": "2026-03-21",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "metrics_key": "corruption",
        "keywords": ["mixed messages", "adding troops", "sanction relief", "contradictory strategy", "trump iran"],
        "scores": (7, 6, 9, 7, 8, 9, 9, 9),
        "rationale_short": "Trump tried to sell de-escalation optics while his own moves pointed toward a murkier and still dangerous war.",
        "synopsis": "Trump claimed the Iran war was 'winding down' and even floated easing sanctions while also adding troops and generating fresh uncertainty about the administration's goals. The chaos here is not background noise; it is the method. Contradictory messaging lets him posture as strongman, peacemaker, and dealmaker all at once, which is useful politics but deranged strategy.",
        "rationale": "AP framed the troop moves and sanctions talk as part of a contradiction problem that Trump himself was intensifying.",
        "source_url": "https://apnews.com/article/trump-iran-war-oil-sanctions-troops-contradictions-eb10ac163be642ad4d738bab9f0ae2a6",
        "source_title": "Trump's mixed messages on Iran: 'Winding down' the war and easing sanctions but adding more troops",
        "source_publisher": "AP News",
    },
    {
        "entry_number": 2108,
        "title": "Trump Threatened to 'Obliterate' Iranian Power Plants Over a Strait of Hormuz Deadline",
        "date_start": "2026-03-22",
        "date_end": "2026-03-22",
        "category": "Violent Rhetoric / Threats",
        "subcategory": "Political Violence / Threats",
        "metrics_key": "war",
        "keywords": ["obliterate power plants", "hormuz ultimatum", "collective punishment language", "infrastructure threat", "trump rhetoric"],
        "scores": (7, 5, 10, 8, 9, 8, 10, 10),
        "rationale_short": "Trump used collective-punishment language against civilian infrastructure as if extortion were a foreign-policy instrument.",
        "synopsis": "Trump threatened to 'obliterate' Iranian power plants if Tehran failed to reopen the Strait of Hormuz on his deadline, which is gangster extortion dressed up as statecraft. Civilian infrastructure became a rhetorical hostage in a war he had already helped widen. This is the kind of sentence that belongs in the archive even if it never becomes its own criminal count, because it tells you who he is and how quickly he reaches for collective-punishment language.",
        "rationale": "AP captured Trump openly threatening essential infrastructure in language that reads less like diplomacy than revenge fantasies with a podium.",
        "source_url": "https://apnews.com/article/iran-us-israel-trump-lebanon-march-22-2026-16cc60862529b873666ce4c1f6529d78",
        "source_title": "Trump threatens attacks on Iranian power plants over opening Strait of Hormuz",
        "source_publisher": "AP News",
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
