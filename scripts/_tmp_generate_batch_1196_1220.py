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


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def json_sql(obj) -> str:
    return "'" + json.dumps(obj, separators=(",", ":"), ensure_ascii=True).replace("'", "''") + "'::jsonb"


def arr_sql(items) -> str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY[" + ",".join("'" + sql_escape(x) + "'" for x in items) + "]::text[]"


def make_scores(
    date_start,
    category,
    subcategory,
    danger,
    lawlessness,
    impact_scope,
    authoritarianism,
    insanity,
    absurdity,
    credibility_risk,
    recency_intensity,
    rationale_short,
):
    return {
        "danger": danger,
        "insanity": insanity,
        "absurdity": absurdity,
        "lawlessness": lawlessness,
        "impact_scope": impact_scope,
        "rationale_short": rationale_short,
        "authoritarianism": authoritarianism,
        "credibility_risk": credibility_risk,
        "rationale_detail": f"{category}: {subcategory}. On {format_date(date_start)}, {rationale_short}",
        "recency_intensity": recency_intensity,
    }


metrics = {
    "war_high": {
        "impressions": 285000000,
        "reach_estimate": 940000000,
        "financial_cost_usd": 2450000000,
        "public_reaction": {"negative": 84, "neutral": 12, "positive": 4},
    },
    "war_medium": {
        "impressions": 205000000,
        "reach_estimate": 676000000,
        "financial_cost_usd": 1300000000,
        "public_reaction": {"negative": 80, "neutral": 15, "positive": 5},
    },
    "election": {
        "impressions": 118000000,
        "reach_estimate": 389000000,
        "financial_cost_usd": 95000000,
        "public_reaction": {"negative": 76, "neutral": 18, "positive": 6},
    },
    "authoritarian": {
        "impressions": 132000000,
        "reach_estimate": 436000000,
        "financial_cost_usd": 165000000,
        "public_reaction": {"negative": 77, "neutral": 17, "positive": 6},
    },
    "disinfo": {
        "impressions": 124000000,
        "reach_estimate": 409000000,
        "financial_cost_usd": 105000000,
        "public_reaction": {"negative": 75, "neutral": 18, "positive": 7},
    },
    "human_rights": {
        "impressions": 146000000,
        "reach_estimate": 482000000,
        "financial_cost_usd": 320000000,
        "public_reaction": {"negative": 82, "neutral": 14, "positive": 4},
    },
    "personal": {
        "impressions": 91000000,
        "reach_estimate": 300000000,
        "financial_cost_usd": 48000000,
        "public_reaction": {"negative": 69, "neutral": 22, "positive": 9},
    },
}

entries = [
    {
        "entry_number": 1196,
        "title": "Trump Escalation Followed by UNIFIL Reports of Cross-Border Israeli Forays in Lebanon",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "U.N. peacekeepers reported Israeli ground forays across sections of the Lebanon border during the widening regional conflict. In the context of Trump's escalation posture, the incident signaled a dangerous broadening of operational fronts beyond core U.S.-Iran confrontation points. Each additional active border zone raises the odds of miscalculation, local civilian displacement, and a sustained conflict tempo that becomes harder to contain politically or militarily.",
        "rationale": "Trump-era escalation coincided with additional cross-border military movement in Lebanon.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["UNIFIL", "Lebanon border", "cross-border forays", "regional escalation", "Trump Iran war"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "UNIFIL reported cross-border military forays as Trump's regional escalation widened."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1197,
        "title": "Trump War Footprint Reaches Oman After Drone Strike on Salalah Port",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Authorities in Oman reported a drone strike at the port of Salalah and additional drone interceptions in Dhofar. The event illustrated how quickly conflict externalities spread when escalation dynamics intensify across neighboring states and logistical corridors. Under Trump's high-pressure war posture, infrastructure nodes previously treated as peripheral became potential targets in a conflict geography that kept expanding.",
        "rationale": "Trump-linked escalation coincided with drone incidents hitting Omani infrastructure zones.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Oman", "Salalah", "drone strike", "infrastructure", "regional spread"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Drone incidents in Oman reflected the widening footprint of Trump's escalation environment."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1198,
        "title": "Trump Escalation Context: Thousands of Syrians Flee Lebanon in 24 Hours",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Refugee-agency reporting cited a sharp jump in crossings from Lebanon into Syria as violence expanded. The displacement surge demonstrated the human cost of rapid regional escalation: civilians absorb the immediate burden while strategic narratives remain focused on deterrence and signaling. In Trump-era war framing, this humanitarian dimension was often secondary in official messaging, even as numbers showed clear stress on cross-border civilian safety.",
        "rationale": "Large civilian displacement spikes emerged as conflict widened under Trump's escalation narrative.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["displacement", "Syrian crossings", "Lebanon", "humanitarian fallout", "regional war"],
        "metrics_key": "human_rights",
        "scores": make_scores("2026-03-03", "Human Rights Violations", "Public Welfare Harm", 8, 5, 9, 5, 3, 3, 4, 9, "Displacement from Lebanon surged during Trump's regional escalation period."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1199,
        "title": "Trump Crisis Cycle Triggers German Diplomatic Protest Against Iranian Attacks",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Germany summoned Iran's ambassador and condemned indiscriminate missile and drone attacks amid the expanded conflict. The move reflected mounting diplomatic stress among allies trying to prevent further spread while military action accelerated. Under Trump's escalation-first climate, partner governments increasingly shifted from supportive rhetoric to explicit crisis signaling and legal framing around civilian-target risks.",
        "rationale": "Allied diplomatic protest intensified as Trump's conflict environment kept widening.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Germany", "diplomatic protest", "ambassador", "missile attacks", "allied concern"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "A major ally issued formal diplomatic protest during Trump's escalation phase."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1200,
        "title": "Trump Escalation Forces UK to Plan Emergency Citizen Flights From Oman",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Britain announced charter planning for nationals in Oman as conflict uncertainty spread across regional transport routes. Emergency repatriation planning by a close ally is a strong signal that risk conditions have crossed normal diplomatic thresholds. The episode underscored the operational spillover of Trump's conflict trajectory: even states outside the immediate strike chain shifted into contingency and extraction mode.",
        "rationale": "Allied emergency-flight planning increased as Trump's regional conflict posture intensified.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["UK", "charter flights", "Oman", "evacuation", "allied contingency"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "The UK moved into emergency repatriation planning during Trump's escalation window."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1201,
        "title": "Trump War Escalation Leaves Thousands Stranded as Qatar Airspace Closes",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Qatari officials reported that attacks and airspace disruption left thousands stranded while warning that strikes would not go unanswered. The interruption illustrated how quickly strategic conflict cascades into civil-mobility breakdown, especially in major aviation hubs. Under Trump's pressure-heavy conflict framing, these systemic disruptions became immediate social and economic costs across a region far broader than the initial flashpoint.",
        "rationale": "Trump's conflict trajectory coincided with stranded civilians and closed airspace in Qatar.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Qatar", "airspace closure", "stranded travelers", "retaliation", "regional disruption"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Conflict conditions under Trump left thousands stranded in Qatar amid airspace closure."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1202,
        "title": "Trump Conflict Spillover Prompts Austria to Launch Repatriation Flights",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Austrian officials announced flights for vulnerable nationals as regional security conditions deteriorated. Such moves are a practical indicator of heightened threat assessments among partner governments. The broader pattern remained consistent: Trump's escalation climate generated not just battlefield events but a rolling chain of civilian extraction decisions across allied capitals.",
        "rationale": "Allied repatriation steps expanded as Trump's conflict posture increased regional insecurity.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Austria", "repatriation", "vulnerable nationals", "evacuation", "allied response"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Austria expanded repatriation actions as Trump's regional conflict climate deepened."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1203,
        "title": "Trump Escalation Forces Poland to Ready Emergency Evacuation Aircraft",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Poland said it prepared planes for further evacuation scenarios as the regional security situation worsened. Preparing fleet-level extraction capability reflects a high confidence that conditions can deteriorate quickly and unpredictably. In Trump's conflict context, allied governments repeatedly moved ahead of Washington messaging to protect citizens against widening theater risk.",
        "rationale": "Poland's evacuation-aircraft preparation reflected growing instability during Trump's escalation cycle.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Poland", "evacuation aircraft", "contingency", "citizen protection", "regional instability"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Poland prepared evacuation aircraft as Trump's escalation climate intensified regional risk."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1204,
        "title": "Trump Conflict Fallout Drives Italy to Organize Multi-Flight Airlifts",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Italy announced multiple flights from Gulf hubs to repatriate citizens as the conflict destabilized travel and safety assumptions. The repeated use of emergency transport planning across Europe marked a shift from monitoring to active crisis response. Under Trump's war-escalation environment, downstream policy burdens landed quickly on allied governments managing civilian mobility and political accountability at home.",
        "rationale": "Italy's emergency airlift planning expanded as Trump's conflict environment increased regional civilian risk.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Italy", "airlift", "repatriation flights", "citizens abroad", "crisis response"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Italy moved into active airlift operations amid Trump's widening conflict context."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1205,
        "title": "Trump Escalation Panic Sends Romanian Pilgrims on Emergency Exit Route",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Romanian pilgrims described emergency flight paths and fear during evacuation movements tied to the expanded conflict environment. Personal accounts of overnight uncertainty and improvised transit reinforced how strategic escalation translates into immediate civilian trauma. The incident added another on-the-ground data point to criticism that Trump's conflict framing underestimated the social cost of rapid regional spread.",
        "rationale": "Civilian testimony from emergency exits highlighted human-impact costs during Trump's escalation phase.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["Romania", "pilgrims", "evacuation", "civilian fear", "emergency transit"],
        "metrics_key": "human_rights",
        "scores": make_scores("2026-03-03", "Human Rights Violations", "Public Welfare Harm", 8, 5, 8, 5, 3, 3, 4, 9, "Civilian evacuation accounts underscored humanitarian costs of Trump's regional escalation climate."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1206,
        "title": "Trump Escalation Draws Turkish Call for Immediate Halt and Return to Diplomacy",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Turkey publicly called for immediate cessation of reciprocal attacks and renewed diplomacy as regional instability deepened. The appeal reflected wider concern that escalation had entered a self-reinforcing loop where military signaling displaced off-ramp planning. In Trump's policy context, allies increasingly framed de-escalation as urgent rather than optional.",
        "rationale": "Regional diplomatic actors called for immediate de-escalation under Trump's war-pressure environment.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Turkey", "diplomacy", "ceasefire calls", "de-escalation", "regional instability"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Turkey urged immediate diplomacy as Trump's escalation climate widened conflict risks."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1207,
        "title": "Trump War Narrative Challenged as Norway Questions Legal Basis for Preemptive Strikes",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Norwegian officials publicly argued that preemptive attacks require imminent threat standards under international law. The statement pushed back on broad justifications for ongoing strikes and highlighted a legal credibility gap among partners. Under Trump's approach, legal framing increasingly became a diplomatic battleground alongside military operations.",
        "rationale": "Allied legal objections intensified as Trump's strike justifications faced international-law scrutiny.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["Norway", "preemptive strike", "international law", "imminent threat", "legal scrutiny"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "Government Corruption", "Transparency Obstruction", 8, 6, 8, 6, 4, 3, 5, 9, "Trump's strike narrative faced allied legal objections over imminence standards."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1208,
        "title": "Trump Conflict Expansion Spurs Ukrainian Offer to Help UAE Counter Drone Threats",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Ukraine offered technical support to help the UAE counter Iranian-style drone attacks during the broader conflict surge. That offer highlighted how quickly war pressure propagated into cross-theater security cooperation and emergency defense planning. The diplomatic signal was clear: Trump's escalation conditions had pushed regional defense needs into urgent multinational coordination.",
        "rationale": "Trump's escalation climate triggered emergency cross-theater cooperation on drone defense.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Ukraine", "UAE", "drone defense", "security cooperation", "conflict spillover"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "International emergency cooperation expanded under Trump's conflict escalation environment."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1209,
        "title": "Trump Escalation Draws UN Demand for Public Accountability on Civilian Harm Reports",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "U.N. rights officials called for prompt, impartial investigations and publication of findings on reported civilian-site strikes. The accountability demand underscored concern that operational tempo was outpacing verification and transparency. Under Trump's escalation frame, critics argued that legitimacy risks grow when public oversight mechanisms trail military action.",
        "rationale": "UN rights officials demanded public accountability mechanisms as conflict expanded under Trump's escalation posture.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["UN rights", "accountability", "civilian harm", "investigation", "transparency"],
        "metrics_key": "human_rights",
        "scores": make_scores("2026-03-03", "Government Corruption", "Transparency Obstruction", 8, 6, 8, 6, 4, 3, 5, 9, "UN officials demanded transparent accountability during Trump's escalation phase."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1210,
        "title": "Trump War Posture Leaves Civilians Repeatedly Running to Shelters in Jerusalem",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "As sirens sounded in Jerusalem, residents repeatedly moved into shelters during incoming-attack alerts. Civilian shelter cycles are a direct indicator that conflict has moved from strategic signaling to sustained public-security stress. In the Trump escalation context, the scene reinforced criticism that rhetoric about control and deterrence did not match ground-level civilian exposure.",
        "rationale": "Frequent civilian shelter alerts reflected sustained insecurity during Trump's escalation window.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["Jerusalem", "sirens", "shelters", "civilian risk", "war exposure"],
        "metrics_key": "human_rights",
        "scores": make_scores("2026-03-03", "Human Rights Violations", "Public Welfare Harm", 8, 5, 8, 5, 3, 3, 4, 9, "Civilian shelter alerts persisted as Trump's regional escalation conditions intensified."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1211,
        "title": "Trump Escalation Week Intensifies U.S. Embassy Shelter-In-Place Advisories",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Embassy messaging instructed Americans to shelter in place and avoid certain facilities under imminent-threat warnings. Such advisories reflect a high-risk operating environment for diplomatic missions and civilians alike. Under Trump's conflict trajectory, protective advisories expanded as a practical counterweight to worsening threat assessments across the Gulf.",
        "rationale": "U.S. embassy shelter advisories widened as Trump's escalation environment heightened threat levels.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["embassy advisory", "shelter in place", "threat warning", "diplomatic risk", "Gulf"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Expanded U.S. shelter advisories tracked with rising threats during Trump's escalation period."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1212,
        "title": "Trump Strategy Raises Global Energy Anxiety as Gulf Infrastructure Comes Under Fire",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Attacks and warnings around Gulf corridors critical to oil and gas flows increased concern over supply reliability and price volatility. Even without sustained outages, risk premiums can rise quickly when infrastructure enters the threat perimeter. In Trump's escalation environment, energy markets were forced to price conflict persistence rather than short-lived disruption.",
        "rationale": "Energy-security anxiety rose as infrastructure threats expanded under Trump's conflict posture.",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "phase": "White House 2",
        "keywords": ["energy markets", "oil and gas", "Gulf infrastructure", "price volatility", "supply risk"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "Foreign Policy", "Economic Warfare", 8, 5, 8, 5, 3, 3, 4, 9, "Energy-risk pressure intensified during Trump's conflict escalation phase."),
        "source": {"url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026", "title": "Live updates: Strikes escalate across the Middle East", "publisher": "AP News", "date_published": "2026-03-03", "source_type": "news"},
    },
    {
        "entry_number": 1213,
        "title": "AP Promise Tracker Shows Trump Behind on Core 2024 Campaign Commitments",
        "date_start": "2026-02-28",
        "date_end": "2026-02-28",
        "synopsis": "The AP promise tracker categorized a large share of major campaign commitments as unresolved, in progress, or complicated rather than complete. The gap undercut Trump's repeated claim of near-total delivery and highlighted how declarative rhetoric can outpace measurable implementation. In accountability terms, the tracker reframed the presidency around outcomes rather than speeches.",
        "rationale": "Independent tracking showed Trump lagging behind rhetoric on major campaign commitments.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["AP tracker", "campaign promises", "delivery gap", "accountability", "policy outcomes"],
        "metrics_key": "authoritarian",
        "scores": make_scores("2026-02-28", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 8, "AP tracking contradicted Trump's broad claims of comprehensive promise fulfillment."),
        "source": {"url": "https://apnews.com/projects/trump-campaign-promise-tracker/", "title": "Tracking Trump's presidential promises", "publisher": "AP News", "date_published": "2026-02-28", "source_type": "news"},
    },
    {
        "entry_number": 1214,
        "title": "AP Tracker Lists Multiple Trump Promises as 'Complicated' or Stalled",
        "date_start": "2026-02-28",
        "date_end": "2026-02-28",
        "synopsis": "AP's categorized tracker showed numerous campaign pledges marked as complicated, unresolved, or still in progress. That classification challenged simplistic success narratives by emphasizing execution barriers, legal limits, and policy reversals. The result strengthened criticism that Trump's communications style rewards headline claims even when governing outcomes remain mixed.",
        "rationale": "Promise-tracker classifications showed many Trump pledges were stalled or unresolved.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["stalled promises", "complicated pledges", "governance gap", "AP data", "fact-based tracking"],
        "metrics_key": "authoritarian",
        "scores": make_scores("2026-02-28", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 8, "AP classifications showed many Trump promises were not fully delivered."),
        "source": {"url": "https://apnews.com/projects/trump-campaign-promise-tracker/", "title": "Tracking Trump's presidential promises", "publisher": "AP News", "date_published": "2026-02-28", "source_type": "news"},
    },
    {
        "entry_number": 1215,
        "title": "AP Data Contradicts Trump's Claim That He Kept Nearly All Promises",
        "date_start": "2026-02-28",
        "date_end": "2026-02-28",
        "synopsis": "Public promise-tracker data offered a measurable counterpoint to Trump's all-promises-kept narrative. The discrepancy matters because repeated overclaiming can erode baseline trust in official messaging and shift political debate from evidence to branding. By publishing status categories and source-backed timelines, the tracker created a structured check against narrative inflation.",
        "rationale": "Promise-tracking data directly challenged Trump's sweeping completion claim.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["promise completion", "narrative inflation", "evidence tracking", "public trust", "Trump claims"],
        "metrics_key": "authoritarian",
        "scores": make_scores("2026-02-28", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 8, "AP tracker evidence contradicted Trump's broad claim of near-total promise completion."),
        "source": {"url": "https://apnews.com/projects/trump-campaign-promise-tracker/", "title": "Tracking Trump's presidential promises", "publisher": "AP News", "date_published": "2026-02-28", "source_type": "news"},
    },
    {
        "entry_number": 1216,
        "title": "PBS/PolitiFact Review Rebuts Trump's 'I Kept All My Promises' Claim",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "A PBS review citing PolitiFact's MAGA meter concluded Trump's blanket claim of universal promise fulfillment did not match available tracking evidence. The segment highlighted an accountability mechanism Trump often attacks: independent verification that separates rhetorical assertions from policy reality. The finding added to concerns about truth decay in high-volume political messaging.",
        "rationale": "Independent fact-checking contradicted Trump's claim that he fulfilled all campaign promises.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["PolitiFact", "MAGA meter", "PBS", "fact-check", "promise claims"],
        "metrics_key": "disinfo",
        "scores": make_scores("2026-02-27", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 8, "PBS and PolitiFact analysis contradicted Trump's total-promises-kept claim."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact data says otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1217,
        "title": "Amnesty Says Trump's First-100-Days Agenda Expanded Rights Crackdowns",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty International said policy actions in Trump's first 100 days intensified attacks on core rights protections, including immigrant and dissent-related safeguards. The report framed these shifts as structural rather than isolated events, arguing that legal tools and administrative pressure were being used to normalize rights restrictions. The findings supported a broader thesis in the Trump Files corpus: institutions can be weakened incrementally through repeated exceptionalism.",
        "rationale": "Amnesty documented broad rights rollbacks during Trump's early second-term governing phase.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["Amnesty", "first 100 days", "rights rollbacks", "civil liberties", "governance"],
        "metrics_key": "human_rights",
        "scores": make_scores("2025-04-30", "Human Rights Violations", "Public Welfare Harm", 8, 7, 8, 8, 3, 3, 6, 8, "Amnesty reported systematic rights rollbacks during Trump's early second-term governance."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's first 100 days: attacks on human rights", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1218,
        "title": "Amnesty Flags Trump-Era Policies as Sustained Attacks on Migrant and Asylum Rights",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty's assessment argued that migrant and asylum protections were being narrowed through a mix of administrative actions and enforcement posture. The report tied legal design choices to practical harm risks for vulnerable populations, especially where due-process protections were weakened. In Trump accountability terms, the critique emphasized that rights erosion can happen through paperwork and procedure, not only dramatic headline events.",
        "rationale": "Amnesty identified policy pathways under Trump that weakened migrant and asylum protections.",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "phase": "White House 2",
        "keywords": ["asylum rights", "migrant protections", "due process", "Amnesty findings", "policy harm"],
        "metrics_key": "human_rights",
        "scores": make_scores("2025-04-30", "Human Rights Violations", "Immigration Crackdown", 8, 7, 8, 8, 3, 3, 6, 8, "Amnesty said Trump's policy architecture weakened asylum and migrant protections."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's first 100 days: attacks on human rights", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1219,
        "title": "Guardian Catalog of Concerning Moments Adds to Pattern of Trump Volatility",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "A Guardian compilation highlighted repeated Trump incidents that critics viewed as signs of erratic leadership behavior and degraded decision discipline. While each moment alone may appear anecdotal, the cumulative pattern matters for governance risk assessment: volatility at the top can alter how institutions interpret orders, allocate crisis attention, and manage uncertainty. The catalog framing aligned with the Trump Files goal of preserving pattern memory over isolated snapshots.",
        "rationale": "A compiled record of concerning episodes reinforced the pattern-risk profile of Trump's leadership style.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["concerning moments", "pattern risk", "leadership volatility", "Guardian", "institutional stress"],
        "metrics_key": "personal",
        "scores": make_scores("2026-01-23", "Personal Awareness", "Public Gaffe", 5, 3, 6, 4, 6, 6, 6, 8, "A pattern catalog of concerning moments reinforced concerns about Trump's leadership volatility."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump concerning moments", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1220,
        "title": "Trump's Wartime Optics Criticized as Crisis Messaging and Self-Focus Collide",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "During a period of active regional conflict and rising casualty anxiety, Trump's public style drew criticism for blending self-referential messaging with war communication. Critics argued the contrast weakened confidence in strategic seriousness and distracted from concrete policy accountability. In practical terms, crisis optics matter because they shape public trust in whether leadership attention is aligned with the scale and urgency of events.",
        "rationale": "Trump's wartime communication style drew criticism for self-focus amid high-stakes conflict conditions.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["wartime optics", "crisis messaging", "self-focus", "leadership trust", "public perception"],
        "metrics_key": "personal",
        "scores": make_scores("2026-03-02", "Personal Awareness", "Public Gaffe", 5, 3, 6, 4, 6, 6, 6, 9, "Trump's war-time optics drew criticism for misaligned focus during crisis communications."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/mar/02/trump-war-iran", "title": "Trump under criticism for tone and focus during Iran war escalation", "publisher": "The Guardian", "date_published": "2026-03-02", "source_type": "news"},
    },
]

entry_columns = [
    "entry_number", "title", "date_start", "date_end", "synopsis", "rationale", "category", "subcategory", "keywords", "age", "phase", "impressions", "reach_estimate", "financial_cost_usd", "public_reaction", "fact_check", "fact_check_sources", "scores"
]
score_columns = [
    "entry_number", "insanity", "absurdity", "danger", "authoritarianism", "lawlessness", "credibility_risk", "recency_intensity", "impact_scope", "rationale_short", "rationale_detail"
]
source_columns = ["entry_number", "url", "title", "publisher", "date_published", "source_type"]

entry_values = []
score_values = []
source_values = []
keyword_values = []

for e in entries:
    m = metrics[e["metrics_key"]]
    e["impressions"] = m["impressions"]
    e["reach_estimate"] = m["reach_estimate"]
    e["financial_cost_usd"] = m["financial_cost_usd"]
    e["public_reaction"] = m["public_reaction"]
    e["age"] = calc_age(e["date_start"])

    scores = e["scores"]
    entry_values.append(
        "(" + ", ".join([
            str(e["entry_number"]),
            f"'{sql_escape(e['title'])}'",
            f"'{e['date_start']}'",
            f"'{e['date_end']}'",
            f"'{sql_escape(e['synopsis'])}'",
            f"'{sql_escape(e['rationale'])}'",
            f"'{sql_escape(e['category'])}'",
            f"'{sql_escape(e['subcategory'])}'",
            arr_sql(e["keywords"]),
            str(e["age"]),
            f"'{sql_escape(e['phase'])}'",
            str(e["impressions"]),
            str(e["reach_estimate"]),
            str(e["financial_cost_usd"]),
            json_sql(e["public_reaction"]),
            "NULL",
            "ARRAY[]::text[]",
            json_sql(scores),
        ]) + ")"
    )

    score_values.append(
        "(" + ", ".join([
            str(e["entry_number"]),
            str(scores["insanity"]),
            str(scores["absurdity"]),
            str(scores["danger"]),
            str(scores["authoritarianism"]),
            str(scores["lawlessness"]),
            str(scores["credibility_risk"]),
            str(scores["recency_intensity"]),
            str(scores["impact_scope"]),
            f"'{sql_escape(scores['rationale_short'])}'",
            f"'{sql_escape(scores['rationale_detail'])}'",
        ]) + ")"
    )

    src = e["source"]
    source_values.append(
        "(" + ", ".join([
            str(e["entry_number"]),
            f"'{sql_escape(src['url'])}'",
            f"'{sql_escape(src['title'])}'",
            f"'{sql_escape(src['publisher'])}'",
            f"'{src['date_published']}'",
            f"'{sql_escape(src['source_type'])}'",
        ]) + ")"
    )

    for kw in e["keywords"]:
        keyword_values.append("(" + ", ".join([str(e["entry_number"]), f"'{sql_escape(kw)}'"]) + ")")

sql_entries = "INSERT INTO public.trump_entries (" + ", ".join(entry_columns) + ") VALUES\n" + ",\n".join(entry_values) + "\nON CONFLICT DO NOTHING;"
sql_scores = "INSERT INTO public.trump_individual_scores (" + ", ".join(score_columns) + ") VALUES\n" + ",\n".join(score_values) + "\nON CONFLICT DO NOTHING;"
sql_sources = "INSERT INTO public.trump_sources (" + ", ".join(source_columns) + ") VALUES\n" + ",\n".join(source_values) + ";"
sql_keywords = "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n" + ",\n".join(keyword_values) + "\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries, sql_scores, sql_sources, sql_keywords], indent=2))
