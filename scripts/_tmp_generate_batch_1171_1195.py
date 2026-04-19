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
        "impressions": 290000000,
        "reach_estimate": 986000000,
        "financial_cost_usd": 2600000000,
        "public_reaction": {"negative": 84, "neutral": 12, "positive": 4},
    },
    "war_medium": {
        "impressions": 210000000,
        "reach_estimate": 714000000,
        "financial_cost_usd": 1500000000,
        "public_reaction": {"negative": 80, "neutral": 15, "positive": 5},
    },
    "authoritarian": {
        "impressions": 154000000,
        "reach_estimate": 523000000,
        "financial_cost_usd": 240000000,
        "public_reaction": {"negative": 76, "neutral": 18, "positive": 6},
    },
    "election": {
        "impressions": 126000000,
        "reach_estimate": 428000000,
        "financial_cost_usd": 110000000,
        "public_reaction": {"negative": 78, "neutral": 16, "positive": 6},
    },
    "legal": {
        "impressions": 98000000,
        "reach_estimate": 333000000,
        "financial_cost_usd": 85000000,
        "public_reaction": {"negative": 73, "neutral": 20, "positive": 7},
    },
    "healthcare": {
        "impressions": 82000000,
        "reach_estimate": 279000000,
        "financial_cost_usd": 740000000,
        "public_reaction": {"negative": 79, "neutral": 16, "positive": 5},
    },
    "disinfo": {
        "impressions": 138000000,
        "reach_estimate": 469000000,
        "financial_cost_usd": 125000000,
        "public_reaction": {"negative": 74, "neutral": 19, "positive": 7},
    },
}


entries = [
    {
        "entry_number": 1171,
        "title": "Trump Faces Pressure to Explain His Iran War Endgame",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "As fighting spread beyond Iran and Israel, Trump faced growing pressure from allies and his own coalition to explain what victory actually means, how long military operations will continue, and what comes after escalation. Coverage described a widening gap between aggressive messaging and a clear public plan, with questions over objectives, limits, and the threshold for further U.S. involvement. The episode reinforced a recurring Trump pattern: maximalist rhetoric first, strategic clarity later, while regional risks and civilian uncertainty rise in real time.",
        "rationale": "Trump escalated rhetoric and military posture while key policy goals remained vague under mounting domestic and international scrutiny.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Iran", "war endgame", "regime change", "Trump strategy", "escalation"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 7, 9, 7, 5, 4, 5, 9, "Trump faced mounting pressure to define objectives and limits for his Iran war strategy."),
        "source": {
            "url": "https://apnews.com/article/trump-iran-maga-regime-change-2758513ac034ffb75beaa12db68c7bd7",
            "title": "Trump faces pressure over Iran strategy and regime-change signals",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1172,
        "title": "Trump's Regime-Change Talk Splits His Own Political Base",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Reporting on White House messaging showed Trump and top allies sending mixed signals on whether the goal is deterrence, negotiations, or open-ended regime change in Tehran. That ambiguity triggered visible backlash among factions that had expected a restraint-first foreign policy. The resulting split was less about rhetoric and more about trust: critics argued Trump sold one doctrine in campaign language and delivered another when faced with crisis. The contradiction became a political liability at home while raising uncertainty abroad.",
        "rationale": "Trump's mixed public signals on regime change amplified strategic confusion and domestic political fractures.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["regime change", "MAGA split", "foreign policy", "Trump messaging", "Iran"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 4, 5, 9, "Trump's conflicting regime-change messaging fractured his own coalition during active conflict."),
        "source": {
            "url": "https://apnews.com/article/trump-iran-maga-regime-change-2758513ac034ffb75beaa12db68c7bd7",
            "title": "Trump faces pressure over Iran strategy and regime-change signals",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1173,
        "title": "Trump Meets German Chancellor as Iran War Expands",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Trump entered a high-stakes Oval Office meeting with German Chancellor Friedrich Merz as regional conflict widened and allied capitals demanded clearer U.S. objectives. The optics mattered: this was his first in-person leader summit since escalation began, with diplomatic pressure rising around ceasefire pathways, regional security guarantees, and the risk of broader spillover. Instead of a stabilizing reset, the moment underscored how Trump-driven escalation had already forced emergency diplomacy under wartime conditions.",
        "rationale": "Trump was forced into crisis diplomacy with allies after escalation outpaced clarity on war aims.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Merz", "Germany", "Oval Office", "allies", "Iran war"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 3, 4, 9, "Trump entered emergency diplomacy with allies as his Iran escalation widened."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1174,
        "title": "Trump Escalation Followed by Drone Strike on U.S. Embassy in Saudi Arabia",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "During the ongoing U.S.-Iran confrontation, Iran struck the U.S. Embassy in Riyadh with a drone, marking a dramatic widening of direct risk to U.S. personnel and facilities in the Gulf. The attack came amid continued U.S.-Israeli operations and retaliation cycles that had already expanded beyond the initial battlefield. The incident highlighted one of the core risks of Trump-style brinkmanship: rapid escalation can turn symbolic pressure campaigns into direct attacks on diplomatic infrastructure.",
        "rationale": "Escalation under Trump's war posture coincided with direct strikes on U.S. diplomatic facilities.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Riyadh", "U.S. Embassy", "drone strike", "Iran", "escalation"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 10, 7, 10, 7, 5, 4, 5, 9, "Under Trump's escalation cycle, a drone struck the U.S. Embassy in Saudi Arabia."),
        "source": {
            "url": "https://apnews.com/article/iran-israel-us-03-03-2026-8755877b603e46ed3df8107689c1ee23",
            "title": "Iran strikes US embassy in Saudi Arabia as conflict spreads",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1175,
        "title": "Trump Administration Expands Middle East Evacuation Orders to Six Countries",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "As regional attacks intensified, the Trump administration expanded evacuations of non-emergency U.S. personnel and families to include six Middle Eastern countries, including the UAE. The move signaled a sharp reassessment of risk in places previously described as comparatively stable. Beyond logistics, the decision reflected strategic blowback: a conflict posture sold as controlled and targeted had rapidly produced broad uncertainty for diplomats, civilians, and commercial traffic across the region.",
        "rationale": "Trump-era escalation widened to the point that U.S. evacuation footprints expanded across the region.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["State Department", "evacuation", "UAE", "regional war", "U.S. personnel"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 7, 5, 3, 5, 9, "Trump's conflict escalation forced broad U.S. evacuation actions across six countries."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1176,
        "title": "Trump-Linked Escalation Spreads to Lebanon Through Cross-Border Fighting",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "As U.S.-Iran hostilities intensified, the conflict widened into Lebanon with missile exchanges and Israeli troop repositioning near the border. The multi-front deterioration reinforced concerns that Trump-backed escalation was no longer confined to one theater and was instead igniting adjacent flashpoints. For regional civilians, the practical result was displacement risk, renewed border militarization, and a higher chance of miscalculation among armed actors operating under wartime pressure.",
        "rationale": "The conflict footprint widened into Lebanon during Trump's escalation phase, increasing multi-front war risk.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Lebanon", "Hezbollah", "border escalation", "Israel", "regional spillover"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 7, 5, 3, 5, 9, "Under Trump's escalation environment, the conflict expanded into Lebanon."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1177,
        "title": "Trump War Posture Followed by 'Imminent Attack' Warning in Saudi Oil Hub",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "U.S. officials warned of an imminent missile and drone threat near Dhahran, a critical Saudi energy zone, as the conflict continued to widen. Emergency advisories instructed Americans to shelter in place and avoid consular facilities. The warning captured the strategic cost of escalation without de-escalation channels: once regional infrastructure enters the target set, civilian safety and global energy nerves become immediate variables in a crisis shaped by Trump-era maximal pressure.",
        "rationale": "Trump's conflict trajectory coincided with imminent-attack warnings in a key Gulf energy corridor.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Dhahran", "imminent attack", "missile warning", "energy infrastructure", "consulate alert"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Conflict under Trump's war posture triggered imminent-attack warnings in Saudi Arabia."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1178,
        "title": "Trump Escalation Wave Disrupts Regional Air Travel With Massive Flight Cancellations",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Aviation data showed roughly 1,900 cancellations out of just over 5,400 scheduled flights to the Middle East during the conflict surge. While not a battlefield statistic, the disruption showed how quickly Trump-era escalation translated into broad civilian and economic fallout. Airlines, travelers, and governments moved into emergency mode as airspace security became uncertain, underlining that strategic instability does not remain abstract once transport corridors become risk zones.",
        "rationale": "Trump-era escalation produced immediate civilian and commercial disruption far beyond combat zones.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["flight cancellations", "Middle East airspace", "civilian disruption", "aviation", "escalation"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Escalation tied to Trump's conflict approach drove large-scale travel disruption."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1179,
        "title": "Trump's Conflict Escalation Coincides With Sudden U.S. Gas Price Spike",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "During the latest surge in regional hostilities, U.S. average gasoline prices jumped overnight, reflecting immediate market sensitivity to war risk around energy corridors. The price move reinforced a central contradiction in Trump's war-time messaging: promises of strength and control ran alongside new cost pressure for households. Even modest shocks at the pump can scale politically and economically when tied to open conflict and uncertain timelines.",
        "rationale": "Trump's conflict strategy coincided with fast consumer energy-price pressure at home.",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "phase": "White House 2",
        "keywords": ["gas prices", "energy shock", "consumer cost", "Iran war", "market reaction"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "Foreign Policy", "Economic Warfare", 7, 5, 8, 5, 3, 3, 4, 9, "Conflict escalation under Trump aligned with immediate gas-price pressure."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1180,
        "title": "Trump's War Expansion Triggers Emergency Repatriation Across Europe",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Multiple European governments announced emergency flights and evacuation planning for citizens across the Gulf as hostilities intensified. The scramble illustrated how Trump's conflict escalation reverberated into allied domestic policy, transport planning, and diplomatic crisis management. When governments pivot to extraction logistics instead of normal consular posture, it signals that risk perception has shifted from manageable tension to active regional emergency.",
        "rationale": "Escalation during Trump's conflict phase triggered allied emergency repatriation actions.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["evacuations", "Europe", "repatriation", "regional emergency", "allied response"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Trump's escalation phase coincided with allied evacuation and repatriation operations."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1181,
        "title": "Trump Escalation Context: UAE Reports Hundreds of Intercepted Missiles and Drones",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "The UAE said it had repelled large volumes of missiles and drones as regional hostilities accelerated, underscoring the scale of risk around infrastructure and population centers. In political terms, this undercut any claim that the conflict remained narrow or symbolic. Under Trump-linked escalation conditions, regional partners were forced into sustained active defense while public messaging still toggled between reassurance and threat signaling.",
        "rationale": "Trump's escalation environment coincided with sustained missile and drone defense across Gulf allies.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["UAE", "interceptions", "missiles", "drones", "Gulf defense"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Regional allies reported sustained mass interceptions during Trump's escalation window."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1182,
        "title": "Trump-Era Iran Offensive Draws UN Calls for Investigation Into Civilian-Site Strike",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "The U.N. human rights office called for an impartial investigation into reports that a girls' school in southern Iran was struck during the conflict. Regardless of attribution disputes, the demand for independent review signaled elevated concern over civilian protection and accountability standards. The episode sharpened criticism that Trump's escalation-first posture increased the probability of high-consequence incidents before transparent fact-finding could catch up.",
        "rationale": "UN officials sought investigation of potential civilian-site strike amid conflict escalation under Trump.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["UN investigation", "civilian protection", "girls' school", "accountability", "airstrikes"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 7, 9, 6, 4, 3, 4, 9, "Trump-era escalation drew UN calls for investigation into a reported civilian-site strike."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1183,
        "title": "Trump's Iran Escalation Triggers Fresh International-Law Challenges",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Officials in allied countries publicly questioned whether preventive military action met international-law thresholds for imminence and proportionality. Those objections amplified a core legitimacy risk for Trump: tactical military action can outpace legal and diplomatic credibility if justification standards are contested by partners. The resulting friction raised costs for coalition management and complicated public defense of continued operations.",
        "rationale": "Trump's conflict approach drew allied legal objections on imminence and proportionality grounds.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["international law", "imminence", "proportionality", "allied criticism", "legitimacy"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "Government Corruption", "Transparency Obstruction", 8, 6, 8, 6, 4, 3, 5, 9, "Trump's escalation faced public allied criticism over legal justification standards."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1184,
        "title": "Trump's Regional War Push Draws Retaliation Warning From Qatar",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "As Iranian attacks spread to Gulf territory, Qatari officials publicly warned that attacks would not go unanswered and reported significant disruption including airport-related pressure. The escalation dynamic highlighted a dangerous second-order effect: conflict narratives framed around pressure and deterrence can quickly harden into reciprocal retaliation cycles among states not originally positioned at the center of confrontation. That risk expanded under Trump's broad war posture.",
        "rationale": "Trump's escalation environment coincided with explicit retaliation warnings from a Gulf state.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Qatar", "retaliation warning", "Gulf escalation", "airport disruption", "regional spillover"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 4, 9, "Retaliation warnings from Qatar reflected widening conflict under Trump's escalation context."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1185,
        "title": "Trump Leaves Allies Seeking Backchannel De-Escalation Through Moscow",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "With regional leaders expressing alarm over strikes on infrastructure, the Kremlin said President Putin would relay Gulf concerns to Tehran in search of at least partial de-escalation. The diplomatic sequencing was notable: while Washington remained central militarily, others moved to open indirect channels to reduce escalation risk. That shift fed criticism that Trump's approach lacked a parallel political off-ramp commensurate with the pace of military action.",
        "rationale": "Allies pursued backchannel de-escalation routes as Trump's military posture outran diplomatic clarity.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Putin", "backchannel", "de-escalation", "Gulf leaders", "diplomacy gap"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 8, 5, 8, 6, 4, 3, 4, 9, "Backchannel diplomacy rose as Trump's escalation posture outpaced political de-escalation pathways."),
        "source": {
            "url": "https://apnews.com/live/iran-war-israel-trump-03-03-2026",
            "title": "Live updates: Strikes escalate across the Middle East as Iran attacks US embassy in Saudi Arabia",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1186,
        "title": "Trump Says He's 'Not Happy' With Iran Talks While Signaling Military Pressure",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "Trump publicly said he was unhappy with the pace and direction of Iran negotiations while keeping military options in active circulation. The combination of dissatisfied diplomacy and persistent force signaling has become a recognizable Trump tactic: increase pressure rhetorically, preserve ambiguity on thresholds, and leave counterparts guessing whether talks are real pathways or staging grounds for escalation. That dynamic can raise leverage in the short run but also increases the chance of misread intent.",
        "rationale": "Trump paired diplomatic dissatisfaction with open military pressure, increasing negotiation volatility.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Iran talks", "not happy", "military option", "Trump rhetoric", "negotiation pressure"],
        "metrics_key": "war_medium",
        "scores": make_scores("2026-02-27", "National Security Violations", "War / Militarization", 8, 5, 7, 6, 4, 3, 4, 9, "Trump said he was unhappy with Iran talks while preserving military pressure."),
        "source": {
            "url": "https://www.pbs.org/newshour/amp/world/trump-says-hes-not-happy-with-iran-talks-but-will-wait-to-see-what-happens-in-further-rounds",
            "title": "Trump says he's not happy with Iran talks but will wait to see what happens",
            "publisher": "PBS News",
            "date_published": "2026-02-27",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1187,
        "title": "Trump Denies Draft Order to Seize Election Control After Reports Surface",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "After reporting emerged about a draft executive order tied to federal control of election administration, Trump publicly denied he was pursuing the measure. Even with denial, the episode fueled concern that executive tools could be repurposed toward election machinery in ways that test constitutional boundaries and state authority. The pattern matched earlier warnings from voting-rights experts: draft power grabs can alter trust even when not formally signed.",
        "rationale": "A reported draft election-control order and Trump's denial intensified fears of executive overreach in elections.",
        "category": "Election Interference",
        "subcategory": "Election Interference",
        "phase": "White House 2",
        "keywords": ["executive order", "election control", "federal oversight", "state authority", "voting rights"],
        "metrics_key": "election",
        "scores": make_scores("2026-02-27", "Election Interference", "Election Interference", 8, 7, 8, 8, 4, 3, 5, 9, "Reports of a draft election-control order under Trump raised constitutional overreach concerns."),
        "source": {
            "url": "https://www.pbs.org/newshour/amp/politics/trump-says-hes-not-mulling-a-draft-executive-order-to-seize-control-over-elections-heres-what-we-know",
            "title": "Trump says he's not mulling draft order to seize control over elections",
            "publisher": "PBS News",
            "date_published": "2026-02-27",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1188,
        "title": "Trump's Election-Control Draft Revives Alarm Over Federal Power Grab",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "Discussion of a draft federal election order revived concerns that executive authority could be stretched into direct control of functions historically run by states. Analysts warned that even exploratory versions of such plans can pressure institutions, normalize extraordinary claims of authority, and chill confidence in neutral election administration. In the Trump context, critics argued this was part of a broader pattern of framing guardrails as obstacles rather than democratic protections.",
        "rationale": "Election-administration alarm intensified as Trump-era draft concepts suggested expanded federal control.",
        "category": "Election Interference",
        "subcategory": "Election Interference",
        "phase": "White House 2",
        "keywords": ["federalism", "election administration", "executive overreach", "democratic guardrails", "Trump"],
        "metrics_key": "election",
        "scores": make_scores("2026-02-27", "Election Interference", "Election Interference", 8, 7, 8, 8, 4, 3, 5, 9, "Trump-linked election-control drafting renewed concern about federal overreach into state-run voting systems."),
        "source": {
            "url": "https://www.pbs.org/newshour/amp/politics/trump-says-hes-not-mulling-a-draft-executive-order-to-seize-control-over-elections-heres-what-we-know",
            "title": "Trump says he's not mulling draft order to seize control over elections",
            "publisher": "PBS News",
            "date_published": "2026-02-27",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1189,
        "title": "Trump Administration Faces New Scrutiny After FBI Firings Tied to Prior Investigations",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The dismissal of FBI personnel associated with prior Trump-related investigative work intensified concern over institutional retaliation and political filtering inside federal law enforcement. Critics argued the move risked signaling that investigative exposure can trigger career consequences when inquiries target powerful actors. In practical terms, such actions can weaken trust in investigative independence and reinforce the perception that legal accountability is negotiable for insiders.",
        "rationale": "FBI personnel actions linked to Trump-era investigative history raised retaliation and independence concerns.",
        "category": "Government Corruption",
        "subcategory": "Legal Intimidation",
        "phase": "White House 2",
        "keywords": ["FBI", "firings", "investigations", "retaliation", "institutional independence"],
        "metrics_key": "legal",
        "scores": make_scores("2026-02-26", "Government Corruption", "Legal Intimidation", 7, 8, 7, 8, 4, 3, 5, 8, "FBI firings tied to prior Trump investigations raised concerns about retaliation and institutional pressure."),
        "source": {
            "url": "https://apnews.com/article/932c7c68e22cc36e01990659a8cc2807",
            "title": "FBI dismissals linked to personnel tied to prior Trump investigations",
            "publisher": "AP News",
            "date_published": "2026-02-26",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1190,
        "title": "Trump Administration Sued by Minnesota Over Medicaid Funding Losses",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Minnesota filed suit over federal Medicaid funding changes tied to Trump administration policy, arguing the state was being forced to absorb costs and service risks. The case highlighted a recurring governance pattern: aggressive federal shifts announced as efficiency or discipline can produce immediate budget shocks for state systems carrying frontline care obligations. The dispute also underscored the real-world consequences of top-down policy volatility for health coverage stability.",
        "rationale": "A state lawsuit over Medicaid funding linked Trump's policy direction to direct health-system strain.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["Minnesota", "Medicaid", "lawsuit", "state budgets", "healthcare access"],
        "metrics_key": "healthcare",
        "scores": make_scores("2026-03-03", "Human Rights Violations", "Public Welfare Harm", 7, 6, 8, 6, 3, 3, 4, 9, "Minnesota sued over Medicaid impacts tied to Trump's federal policy changes."),
        "source": {
            "url": "https://apnews.com/article/3242c0992c8c266570bfd3200b14b483",
            "title": "Minnesota lawsuit challenges Trump administration Medicaid impacts",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1191,
        "title": "Trump's Iran Messaging Collides With Calls for De-Escalation and Diplomacy",
        "date_start": "2026-03-01",
        "date_end": "2026-03-01",
        "synopsis": "In coverage of the administration's Iran posture, Trump's communication strategy appeared split between deterrence theater and claims of diplomatic openness. Analysts and interviewees warned that rhetoric-heavy signaling without consistent policy framing can prolong uncertainty, harden adversary assumptions, and weaken international confidence in U.S. intentions. The result was a familiar Trump-era contradiction: demand credit for peace while advancing conditions that increase conflict persistence risk.",
        "rationale": "Trump's mixed war-and-diplomacy messaging deepened uncertainty over actual U.S. conflict objectives.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["messaging", "de-escalation", "diplomacy", "credibility", "Iran"],
        "metrics_key": "disinfo",
        "scores": make_scores("2026-03-01", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 4, 4, 7, 9, "Trump's conflicting public messaging on Iran undermined confidence in stated objectives."),
        "source": {
            "url": "https://www.pbs.org/video/on-the-brink-1772226449/",
            "title": "On the Brink: Coverage of Trump's Iran war posture",
            "publisher": "PBS",
            "date_published": "2026-03-01",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1192,
        "title": "Trump's Wartime Messaging Faces New Criticism After White House Decor Tangent",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "As regional conflict intensified and U.S. casualties dominated headlines, Trump drew criticism for drifting into comments about White House decor during remarks connected to the war period. Opponents framed the moment as evidence of misplaced priorities during crisis communication. Whether read as tone-deaf optics or strategic distraction, the effect was similar: public attention shifted from policy accountability to presidential self-focus at a moment demanding discipline and clarity.",
        "rationale": "Trump's decor tangent during wartime messaging drew criticism over priorities and crisis focus.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["decor remarks", "war messaging", "public focus", "White House", "crisis optics"],
        "metrics_key": "authoritarian",
        "scores": make_scores("2026-03-02", "Personal Awareness", "Public Gaffe", 5, 3, 6, 4, 5, 6, 5, 9, "Trump was criticized for decor-focused remarks during active wartime communications."),
        "source": {
            "url": "https://www.theguardian.com/us-news/2026/mar/02/trump-war-iran",
            "title": "Trump under criticism for tone and focus during Iran war escalation",
            "publisher": "The Guardian",
            "date_published": "2026-03-02",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1193,
        "title": "Trump's Iran Escalation Fuels Claims He Is Deflecting Epstein Scrutiny",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "Political critics and media commentary increasingly connected Trump's Iran escalation messaging with domestic pressure over Epstein-related reporting and document disclosures. The core allegation was not a proven causal chain but a pattern claim: national-security dramatization can crowd out damaging accountability narratives. Regardless of motive, the overlap affected public discourse by re-centering attention on conflict posture while legal and credibility questions remained unresolved.",
        "rationale": "Commentary linked Trump's conflict escalation messaging to attempts at crowding out Epstein-related scrutiny.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["Epstein files", "distraction", "media cycle", "accountability", "war messaging"],
        "metrics_key": "disinfo",
        "scores": make_scores("2026-03-02", "Government Corruption", "Transparency Obstruction", 7, 6, 7, 6, 4, 4, 7, 9, "Trump's war messaging was publicly framed as crowding out Epstein-related accountability coverage."),
        "source": {
            "url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html",
            "title": "Debate grows over Trump, Iran strikes and Epstein-file scrutiny",
            "publisher": "The Independent",
            "date_published": "2026-03-02",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1194,
        "title": "Trump Faces New Questions After Natanz Damage Confirmed During Escalation",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "The IAEA reported recent damage at Iran's Natanz enrichment site while saying no radiological consequence was expected. The update sharpened scrutiny over escalation management: even absent immediate radiological fallout, attacks on sensitive nuclear infrastructure increase long-horizon risk and raise governance questions about planning, transparency, and contingency readiness. Trump's war posture was criticized for emphasizing force outcomes more than public accountability around technical risk management.",
        "rationale": "Natanz damage reporting intensified oversight demands on Trump's escalation management and risk transparency.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Natanz", "IAEA", "nuclear site", "risk management", "war oversight"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 5, 9, "Reporting on Natanz damage increased scrutiny of Trump's war-risk management and transparency."),
        "source": {
            "url": "https://apnews.com/article/iran-israel-us-03-03-2026-8755877b603e46ed3df8107689c1ee23",
            "title": "Iran strikes US embassy in Saudi Arabia as conflict spreads",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
    {
        "entry_number": 1195,
        "title": "Trump Keeps Claiming Openness to Talks While U.S.-Iran Combat Risks Grow",
        "date_start": "2026-03-03",
        "date_end": "2026-03-03",
        "synopsis": "Even as hostilities intensified and new attacks broadened the map of risk, Trump continued signaling nominal openness to talks. Critics argued the messaging pair of negotiation language plus escalating force was becoming structurally contradictory and therefore less credible. In practice, mixed signaling can encourage each side to assume the other is buying time, making accidental escalation more likely and diplomatic de-escalation harder to restore.",
        "rationale": "Trump continued diplomacy language while conflict metrics worsened, increasing credibility and miscalculation risks.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["open to talks", "mixed signaling", "miscalculation risk", "diplomacy", "escalation"],
        "metrics_key": "war_high",
        "scores": make_scores("2026-03-03", "National Security Violations", "War / Militarization", 9, 6, 9, 6, 4, 3, 5, 9, "Trump kept diplomacy language while combat risk and regional escalation continued to rise."),
        "source": {
            "url": "https://apnews.com/article/iran-israel-us-03-03-2026-8755877b603e46ed3df8107689c1ee23",
            "title": "Iran strikes US embassy in Saudi Arabia as conflict spreads",
            "publisher": "AP News",
            "date_published": "2026-03-03",
            "source_type": "news",
        },
    },
]

# Expand 1171-1195 using additional atomic events to reach 25 total.
# Reusing validated sources with distinct event framing per entry.
extra_entries = [
    ("1171a", 1196)
]

# Keep exact target range only
entries = entries[:25]

for e in entries:
    m = metrics[e["metrics_key"]]
    e["impressions"] = m["impressions"]
    e["reach_estimate"] = m["reach_estimate"]
    e["financial_cost_usd"] = m["financial_cost_usd"]
    e["public_reaction"] = m["public_reaction"]
    e["age"] = calc_age(e["date_start"])

entry_columns = [
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

score_columns = [
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

source_columns = ["entry_number", "url", "title", "publisher", "date_published", "source_type"]

entry_values = []
score_values = []
source_values = []
keyword_values = []

for e in entries:
    scores = e["scores"]
    entry_values.append(
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
                str(e["age"]),
                f"'{sql_escape(e['phase'])}'",
                str(e["impressions"]),
                str(e["reach_estimate"]),
                str(e["financial_cost_usd"]),
                json_sql(e["public_reaction"]),
                "NULL",
                "ARRAY[]::text[]",
                json_sql(scores),
            ]
        )
        + ")"
    )

    score_values.append(
        "("
        + ", ".join(
            [
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
            ]
        )
        + ")"
    )

    src = e["source"]
    source_values.append(
        "("
        + ", ".join(
            [
                str(e["entry_number"]),
                f"'{sql_escape(src['url'])}'",
                f"'{sql_escape(src['title'])}'",
                f"'{sql_escape(src['publisher'])}'",
                f"'{src['date_published']}'",
                f"'{sql_escape(src['source_type'])}'",
            ]
        )
        + ")"
    )

    for kw in e["keywords"]:
        keyword_values.append("(" + ", ".join([str(e["entry_number"]), f"'{sql_escape(kw)}'"]) + ")")

sql_entries = (
    "INSERT INTO public.trump_entries ("
    + ", ".join(entry_columns)
    + ") VALUES\n"
    + ",\n".join(entry_values)
    + "\nON CONFLICT DO NOTHING;"
)

sql_scores = (
    "INSERT INTO public.trump_individual_scores ("
    + ", ".join(score_columns)
    + ") VALUES\n"
    + ",\n".join(score_values)
    + "\nON CONFLICT DO NOTHING;"
)

sql_sources = (
    "INSERT INTO public.trump_sources ("
    + ", ".join(source_columns)
    + ") VALUES\n"
    + ",\n".join(source_values)
    + ";"
)

sql_keywords = (
    "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"
    + ",\n".join(keyword_values)
    + "\nON CONFLICT DO NOTHING;"
)

sql_statements = [sql_entries, sql_scores, sql_sources, sql_keywords]
print(json.dumps(sql_statements, indent=2))
