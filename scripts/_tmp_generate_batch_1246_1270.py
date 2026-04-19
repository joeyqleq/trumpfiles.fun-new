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


def make_scores(date_start, category, subcategory, danger, lawlessness, impact_scope, authoritarianism, insanity, absurdity, credibility_risk, recency_intensity, rationale_short):
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
    "epstein": {"impressions": 172000000, "reach_estimate": 585000000, "financial_cost_usd": 138000000, "public_reaction": {"negative": 82, "neutral": 13, "positive": 5}},
    "war": {"impressions": 214000000, "reach_estimate": 728000000, "financial_cost_usd": 1680000000, "public_reaction": {"negative": 81, "neutral": 14, "positive": 5}},
    "rights": {"impressions": 141000000, "reach_estimate": 480000000, "financial_cost_usd": 260000000, "public_reaction": {"negative": 83, "neutral": 13, "positive": 4}},
}

entries = [
    {
        "entry_number": 1246,
        "title": "Trump-Era Epstein Release Omitted Three FBI 302 Reports Reviewed by The Guardian",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian reported obtaining three missing FBI form-302 reports summarizing interviews that were not included in DOJ's public Epstein-file release. The omission became a transparency flashpoint because these were not random artifacts but core interview records tied to high-profile allegations. Even without proving allegations, withholding central interview documents undermines confidence that disclosure standards were applied consistently.",
        "rationale": "The Guardian reported missing FBI 302 documents absent from DOJ's public Epstein release.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["FBI 302", "Guardian", "missing records", "DOJ release", "Epstein files"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Missing FBI 302 reports raised transparency concerns in Trump's Epstein-file release context."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1247,
        "title": "Trump Epstein Controversy Deepened as Only One of Four FBI Sessions Appeared Publicly",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian said only the first of four interview sessions appeared in the public release, while subsequent sessions remained outside the posted archive. This partial publication pattern raised immediate suspicion that file selection was not neutral. In accountability terms, partial disclosure often produces more distrust than delayed disclosure because it suggests active curation of narrative risk.",
        "rationale": "Guardian reporting described a selective release pattern where only one of four interview sessions was public.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["four interviews", "partial release", "selective disclosure", "DOJ", "transparency"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Only part of the interview sequence appeared public, indicating selective disclosure risk."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1248,
        "title": "Trump-Era DOJ Faced Scrutiny After Authenticity of Missing Epstein Reports Was Confirmed",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "An administration official confirmed to The Guardian that the missing reports were authentic, while DOJ maintained that withheld material was duplicative or privileged. That combination, authenticity plus non-release, intensified demands for a full accounting. Once authenticity is conceded, the burden shifts from whether documents exist to why the public cannot review them.",
        "rationale": "Confirmation that missing reports were authentic increased pressure on DOJ's withholding explanation.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["authentic reports", "DOJ explanation", "duplicative claim", "withholding", "accountability"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Authenticity confirmation sharpened demands for explanation of withheld Epstein records."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1249,
        "title": "Trump Epstein Claims in Missing Memos Remained Unsubstantiated and Uncharged",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian emphasized that allegations in the missing interview memos were explicit but unsubstantiated, and that no charges were brought on those claims. This distinction is critical: reporting on document handling does not establish guilt, but it does establish whether institutions are transparently presenting what they investigated. In the Trump context, the procedural question itself became politically explosive.",
        "rationale": "Guardian reporting stressed unsubstantiated status while highlighting transparency failures in disclosure.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["unsubstantiated", "no charges", "document handling", "due process", "public disclosure"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "Allegations remained uncharged, but disclosure handling still triggered major transparency concerns."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1250,
        "title": "Trump Epstein Timeline Faced Contradiction Warnings in Guardian Review",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian noted that parts of the allegations conflicted with known timeline details about Epstein's life in the early 1980s and what is publicly known about when Trump and Epstein knew each other. That contradiction did not resolve the missing-document controversy; instead, it underscored why full records matter. Transparency allows external reviewers to separate credible claims from weak ones rather than trusting selective summaries.",
        "rationale": "Timeline contradictions increased the need for complete, reviewable records rather than selective disclosure.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["timeline contradiction", "1980s records", "Epstein chronology", "source reliability", "full disclosure"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "Contradictions in chronology highlighted the need for complete public records to assess claims."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1251,
        "title": "Trump Epstein-File Dispute Expanded as Bipartisan Oversight Interest Emerged",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian reported that not only Rep. Robert Garcia but also Oversight Chair James Comer said lawmakers would examine allegations that Trump-related records were removed. Bipartisan interest raised the institutional stakes beyond partisan messaging. Once both sides signal inquiry, disclosure controversy can evolve from media cycle into longer-term committee pressure.",
        "rationale": "Bipartisan oversight signals widened pressure for explanation of missing Trump-related Epstein records.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["James Comer", "Robert Garcia", "bipartisan oversight", "removed records", "committee review"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Bipartisan oversight attention intensified around allegedly removed Epstein records mentioning Trump."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1252,
        "title": "Trump Epstein-File Handling Criticized After 'Cover-Up' Allegation by Oversight Democrat",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian cited Rep. Garcia saying there was evidence of a cover-up after he reviewed files and could not locate certain records. Such claims remain political assertions, but they materially increase pressure for auditable disclosure logs and independent verification. In high-conflict cases, perception of concealment can become as damaging as the underlying allegations.",
        "rationale": "Cover-up allegations from oversight leaders escalated pressure for auditable release procedures.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["cover-up claim", "Garcia", "missing files", "audit trail", "DOJ oversight"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Cover-up allegations intensified demands for transparent and auditable file-release processes."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1253,
        "title": "Trump Epstein Case Questions Grew After Matching Jane Doe Lawsuit Was Dropped",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian reported that a Jane Doe lawsuit with matching biographical contours was later dropped, with settlement status unknown. That detail complicated public interpretation: dropped civil actions do not erase allegations but they do reduce formal adjudicative clarity. In this environment, complete record transparency becomes more important to prevent narrative manipulation from either side.",
        "rationale": "A dropped matching civil case added ambiguity, raising the value of complete documentary transparency.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["Jane Doe", "dropped lawsuit", "civil case", "ambiguity", "record transparency"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "Dropped civil litigation increased ambiguity and the need for full documentary disclosure."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1254,
        "title": "Trump Administration Reiterated 'Non-Credible' Label for Missing-Epstein Allegations",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "As document disputes escalated, administration officials described the allegations as non-credible and argued omitted files were not legally required under their interpretation. That position may be legally arguable, but it did not eliminate scrutiny over completeness and process consistency. The public issue remained procedural integrity: who decides what counts as duplicative in a politically sensitive archive.",
        "rationale": "Administration dismissal of credibility did not resolve ongoing disputes over completeness of the public release.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["non-credible", "administration response", "duplicative files", "legal interpretation", "release completeness"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 3, 8, 9, "Officials dismissed allegations while withholding disputes over file completeness continued."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1255,
        "title": "Trump Epstein Fallout Intensified After Demand for 'Full Accounting' Sent to AG",
        "date_start": "2026-02-26",
        "date_end": "2026-02-26",
        "synopsis": "The Guardian reported that Rep. Garcia sent a letter to Attorney General Pam Bondi demanding a full accounting of why specific files were withheld. Formal demand letters create a traceable oversight trail and can force agencies to commit to detailed procedural explanations. In the Trump case, this moved the dispute from public accusation into structured accountability channels.",
        "rationale": "A formal demand to the attorney general elevated the missing-files controversy into structured oversight process.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["Pam Bondi", "full accounting", "oversight letter", "withheld files", "accountability"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-26", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "A formal oversight letter demanded full accounting for withheld Epstein records."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi", "title": "Epstein files contain explicit but unsubstantiated claim that Trump abused minor", "publisher": "The Guardian", "date_published": "2026-02-26", "source_type": "news"},
    },
    {
        "entry_number": 1256,
        "title": "Trump Faced Republican Rebuke as Massie Said Iran Bombing Wouldn't Erase Epstein Scrutiny",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent reported Rep. Thomas Massie warning that bombing Iran would not make Epstein-file controversy disappear. The criticism was notable because it came from within Trump's broader political camp, framing the war narrative as potential distraction rather than strategic necessity. Intra-party skepticism can erode executive latitude during conflict by raising motive questions alongside policy questions.",
        "rationale": "A Republican lawmaker publicly linked Trump's Iran strikes to attempted distraction from Epstein scrutiny.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Thomas Massie", "Iran strikes", "Epstein files", "distraction claim", "intra-party criticism"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 3, 6, 9, "Massie argued Trump's Iran strikes would not deflect Epstein-file accountability."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1257,
        "title": "Trump War Push Drew Constitutional War-Powers Warning From Rand Paul",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent cited Sen. Rand Paul arguing that war initiation authority belongs to Congress and opposing another presidential war. That intervention revived a central legal critique of Trump's Iran posture: executive momentum was outrunning legislative authorization. Even when framed as urgent security action, bypass concerns can quickly become constitutional conflict.",
        "rationale": "Rand Paul invoked constitutional war-powers limits to oppose Trump's conflict expansion.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["Rand Paul", "war powers", "Congress", "constitutional limits", "executive war"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "Authoritarianism", "Government Power Abuse", 8, 7, 8, 8, 4, 3, 6, 9, "Constitutional warnings argued Trump's war approach exceeded congressional authority norms."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1258,
        "title": "Trump's Iran Escalation Triggered 'America First' Backlash From Former MAGA Ally",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent reported that Marjorie Taylor Greene attacked Trump's move toward regime-change warfare, saying it betrayed campaign-era America-first commitments. The criticism mattered because it attacked strategic coherence rather than tactical detail. When core-brand allies frame policy as betrayal, leadership narrative control weakens quickly.",
        "rationale": "A former MAGA ally framed Trump's Iran escalation as a breach of America-first commitments.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["Marjorie Taylor Greene", "America First", "regime change", "MAGA backlash", "Iran"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 3, 6, 9, "Trump's Iran posture drew backlash from former MAGA allies over strategic inconsistency."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1259,
        "title": "Trump's Iran Campaign Faced Polling Headwind as Support Reportedly Fell to One in Four",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent cited early polling suggesting only about one in four Americans supported the administration's Iran actions. Low support during opening conflict phases can constrain escalation options and increase political pressure for a defined off-ramp. In Trump's case, weak backing undercut claims that the war posture reflected broad national consensus.",
        "rationale": "Reported low support levels signaled a legitimacy problem for Trump's Iran military strategy.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["polling", "one in four", "public support", "Iran action", "legitimacy"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 3, 6, 9, "Reported one-in-four support exposed weak public backing for Trump's Iran campaign."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1260,
        "title": "Trump's Iran Offensive Was Framed by Critics as News-Cycle Distraction From Epstein Files",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent described critics arguing that renewed overseas conflict had pushed Epstein-file scrutiny down the domestic news agenda. The claim is political rather than proven causation, but it reflects how timing and media bandwidth influence accountability outcomes. In contested democracies, attention allocation can function as a form of power.",
        "rationale": "Critics publicly framed timing of Trump's Iran offensive as diluting Epstein-file attention.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["news agenda", "distraction claim", "timing", "Epstein scrutiny", "Iran offensive"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "Government Corruption", "Transparency Obstruction", 7, 6, 7, 6, 4, 3, 7, 9, "Critics argued Trump's Iran escalation shifted attention away from Epstein-file accountability."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1261,
        "title": "Trump Faced Criticism for Discussing Multi-Week Iran Mission Horizon Without Congressional Vote",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent described reporting that Trump anticipated operations continuing for several weeks, while critics highlighted absent congressional authorization. Long-duration war language without explicit legislative grounding intensified accusations of executive overreach. Timeline signaling is not neutral; it implies strategic commitment that should ordinarily be anchored in constitutional process.",
        "rationale": "Multi-week mission language and war-powers concerns reinforced claims of executive overreach.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["four to five weeks", "congressional vote", "executive overreach", "war timeline", "constitutional process"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "Authoritarianism", "Government Power Abuse", 8, 7, 8, 8, 4, 3, 6, 9, "Trump's multi-week war horizon language deepened concerns about bypassing congressional war authorization."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1262,
        "title": "Trump's Iran Operation Drew GOP Split Between Hawkish Defenders and Constitutional Critics",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent reported visible Republican division: some leaders strongly backed strikes while others opposed the constitutional and strategic framing. The split matters because party fragmentation can reduce policy durability and increase reversal risk under stress. For Trump, managing internal legitimacy became part of the conflict itself.",
        "rationale": "Republican split over Trump's Iran operation exposed internal legitimacy and strategy fractures.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["GOP split", "hawkish support", "constitutional critics", "war debate", "party fracture"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "National Security Violations", "War / Militarization", 8, 6, 8, 6, 4, 3, 6, 9, "Trump's Iran action exposed a split between hawkish allies and constitutional critics."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1263,
        "title": "Trump's Iran Messaging Was Mocked as 'Distraction' Even in Mainstream Satire",
        "date_start": "2026-03-02",
        "date_end": "2026-03-02",
        "synopsis": "The Independent noted satire segments mocking the idea that war rhetoric could distract from Epstein-file fallout. Satire is not direct evidence of policy intent, but it can signal how quickly a narrative has entered mainstream political culture. In this case, the distraction frame moved beyond partisan corners into broad public discourse.",
        "rationale": "Mainstream satire echoed the distraction narrative around Trump's Iran escalation and Epstein scrutiny.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["satire", "distraction narrative", "public discourse", "Iran messaging", "Epstein"],
        "metrics_key": "war",
        "scores": make_scores("2026-03-02", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 4, 4, 7, 9, "The distraction framing around Trump's war messaging entered mainstream discourse and satire."),
        "source": {"url": "https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html", "title": "Attacking Iran won't make the Epstein files go away, lawmaker warns Trump", "publisher": "The Independent", "date_published": "2026-03-02", "source_type": "news"},
    },
    {
        "entry_number": 1264,
        "title": "Amnesty Said Trump's First 100 Days Created a Human Rights Emergency",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty International said Trump's first 100 days amounted to a human-rights emergency marked by suppression of dissent, institutional erosion and discriminatory policy direction. The report's framing treated harms as compounding and systemic, not isolated incidents. That distinction aligns with the Trump Files mission: track cumulative governance patterns rather than one-off controversies.",
        "rationale": "Amnesty characterized Trump's early second-term governance as a compounding human-rights emergency.",
        "category": "Human Rights Violations",
        "subcategory": "Public Welfare Harm",
        "phase": "White House 2",
        "keywords": ["Amnesty", "human rights emergency", "first 100 days", "systemic harm", "institutional erosion"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Human Rights Violations", "Public Welfare Harm", 8, 7, 8, 8, 3, 3, 6, 8, "Amnesty described Trump's first 100 days as a compounding human-rights emergency."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1265,
        "title": "Amnesty Linked Trump's First-100-Days Agenda to Suppression of Dissent",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty's report said suppression of dissent was a core feature of Trump's first 100-day governing posture. By framing dissent management as a rights issue, the report moved criticism beyond policy disagreement into democratic-process concern. This classification matters because it identifies speech restrictions as structural warning signs, not routine political friction.",
        "rationale": "Amnesty identified suppression of dissent as a central rights concern in Trump's early second term.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["suppression of dissent", "civic space", "democratic norms", "Amnesty report", "authoritarian practice"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Authoritarianism", "Government Power Abuse", 8, 7, 8, 9, 3, 3, 6, 8, "Amnesty said suppression of dissent was a defining feature of Trump's first-100-days agenda."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1266,
        "title": "Amnesty Said Trump Policies Targeted Immigrants Through Racist and Discriminatory Practices",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty described Trump's early second-term immigration posture as discriminatory and racist, citing targeting rhetoric and deportation-oriented enforcement patterns. The report emphasized overlap between anti-immigrant policy and erosion of due-process safeguards. In accountability terms, it framed migration policy as a human-rights test rather than a purely administrative issue.",
        "rationale": "Amnesty identified discriminatory anti-immigrant practices as central to Trump's first-100-days policy impact.",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "phase": "White House 2",
        "keywords": ["immigrants", "discriminatory policy", "deportation targeting", "due process", "Amnesty"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Human Rights Violations", "Immigration Crackdown", 8, 7, 8, 8, 3, 3, 6, 8, "Amnesty said Trump's first-100-days agenda used discriminatory anti-immigrant practices."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1267,
        "title": "Amnesty Cited Mahmoud Khalil Case as Emblem of Trump's Rights Crackdown",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty described the Mahmoud Khalil detention and deportation proceedings as emblematic of broader rights suppression under Trump, arguing it sent a chilling message to people speaking on human-rights issues. The report's concern was cumulative: if legal residents can be targeted around protected speech contexts, fear effects spread beyond the immediate case.",
        "rationale": "Amnesty framed the Khalil case as emblematic of speech-linked rights suppression in Trump's first 100 days.",
        "category": "Human Rights Violations",
        "subcategory": "Immigration Crackdown",
        "phase": "White House 2",
        "keywords": ["Mahmoud Khalil", "detention", "deportation proceedings", "chilling effect", "rights activism"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Human Rights Violations", "Immigration Crackdown", 8, 7, 8, 8, 3, 3, 6, 8, "Amnesty said the Khalil case symbolized rights suppression and chilling effects under Trump's agenda."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1268,
        "title": "Amnesty Warned Trump's Agenda Undermined Rule-of-Law Institutions in First 100 Days",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty argued that Trump's early second-term actions undermined institutions and norms designed to protect rule-of-law safeguards. The report linked policy volatility with durable institutional damage risk, warning that enforcement and governance systems can be hollowed gradually through compounding exceptional measures. The claim centered on system resilience, not one policy outcome.",
        "rationale": "Amnesty said Trump's first-100-days actions eroded rule-of-law institutions and protective norms.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["rule of law", "institutional erosion", "norms", "compounding harms", "Amnesty warning"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Authoritarianism", "Government Power Abuse", 8, 7, 8, 9, 3, 3, 6, 8, "Amnesty warned Trump's early governance style eroded institutions and rule-of-law safeguards."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1269,
        "title": "Amnesty Said Trump's Global Retreat From Rights Bodies Increased Worldwide Instability",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty said Trump's first-100-days posture included retreat from multilateral structures that support international rights enforcement, and warned this trend worsened instability beyond U.S. borders. The report framed the impact as geopolitical as well as domestic: when major states step back from rights frameworks, authoritarian drift can accelerate internationally.",
        "rationale": "Amnesty linked Trump's multilateral retreat to broader global rights and stability risks.",
        "category": "National Security Violations",
        "subcategory": "War / Militarization",
        "phase": "White House 2",
        "keywords": ["multilateral retreat", "rights bodies", "global instability", "international norms", "Amnesty"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "National Security Violations", "War / Militarization", 7, 6, 8, 7, 3, 3, 6, 8, "Amnesty warned Trump's retreat from rights bodies worsened international instability risks."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
    {
        "entry_number": 1270,
        "title": "Amnesty Said Trump's First-100-Days Strategy Turbocharged Existing Authoritarian Trends",
        "date_start": "2025-04-30",
        "date_end": "2025-04-30",
        "synopsis": "Amnesty concluded that Trump's rights posture did not merely mirror global authoritarian trends but accelerated them by signaling tolerance for repression and institutional rollback. The report positioned this as a multiplier effect, where one powerful government's choices reshape norms elsewhere. In that frame, domestic rights decisions carried international consequences far beyond U.S. policy boundaries.",
        "rationale": "Amnesty said Trump's early second-term model accelerated pre-existing global authoritarian trends.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["authoritarian trends", "multiplier effect", "global norms", "repression", "rights rollback"],
        "metrics_key": "rights",
        "scores": make_scores("2025-04-30", "Authoritarianism", "Government Power Abuse", 8, 7, 8, 9, 3, 3, 6, 8, "Amnesty said Trump's first-100-days approach accelerated global authoritarian trendlines."),
        "source": {"url": "https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/", "title": "President Trump's First 100 Days: Attacks on Human Rights, Cruelty and Chaos", "publisher": "Amnesty International", "date_published": "2025-04-30", "source_type": "news"},
    },
]

entry_columns = ["entry_number", "title", "date_start", "date_end", "synopsis", "rationale", "category", "subcategory", "keywords", "age", "phase", "impressions", "reach_estimate", "financial_cost_usd", "public_reaction", "fact_check", "fact_check_sources", "scores"]
score_columns = ["entry_number", "insanity", "absurdity", "danger", "authoritarianism", "lawlessness", "credibility_risk", "recency_intensity", "impact_scope", "rationale_short", "rationale_detail"]
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
    entry_values.append("(" + ", ".join([
        str(e["entry_number"]), f"'{sql_escape(e['title'])}'", f"'{e['date_start']}'", f"'{e['date_end']}'", f"'{sql_escape(e['synopsis'])}'", f"'{sql_escape(e['rationale'])}'",
        f"'{sql_escape(e['category'])}'", f"'{sql_escape(e['subcategory'])}'", arr_sql(e["keywords"]), str(e["age"]), f"'{sql_escape(e['phase'])}'",
        str(e["impressions"]), str(e["reach_estimate"]), str(e["financial_cost_usd"]), json_sql(e["public_reaction"]), "NULL", "ARRAY[]::text[]", json_sql(scores)
    ]) + ")")

    score_values.append("(" + ", ".join([
        str(e["entry_number"]), str(scores["insanity"]), str(scores["absurdity"]), str(scores["danger"]), str(scores["authoritarianism"]), str(scores["lawlessness"]),
        str(scores["credibility_risk"]), str(scores["recency_intensity"]), str(scores["impact_scope"]), f"'{sql_escape(scores['rationale_short'])}'", f"'{sql_escape(scores['rationale_detail'])}'"
    ]) + ")")

    src=e["source"]
    source_values.append("(" + ", ".join([
        str(e["entry_number"]), f"'{sql_escape(src['url'])}'", f"'{sql_escape(src['title'])}'", f"'{sql_escape(src['publisher'])}'", f"'{src['date_published']}'", f"'{sql_escape(src['source_type'])}'"
    ]) + ")")

    for kw in e["keywords"]:
        keyword_values.append("(" + ", ".join([str(e["entry_number"]), f"'{sql_escape(kw)}'"]) + ")")

sql_entries = "INSERT INTO public.trump_entries (" + ", ".join(entry_columns) + ") VALUES\n" + ",\n".join(entry_values) + "\nON CONFLICT DO NOTHING;"
sql_scores = "INSERT INTO public.trump_individual_scores (" + ", ".join(score_columns) + ") VALUES\n" + ",\n".join(score_values) + "\nON CONFLICT DO NOTHING;"
sql_sources = "INSERT INTO public.trump_sources (" + ", ".join(source_columns) + ") VALUES\n" + ",\n".join(source_values) + ";"
sql_keywords = "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n" + ",\n".join(keyword_values) + "\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries, sql_scores, sql_sources, sql_keywords], indent=2))
