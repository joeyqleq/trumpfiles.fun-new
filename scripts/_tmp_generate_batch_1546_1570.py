import json
from datetime import datetime

months=["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."]
birth_date=datetime(1946,6,14)

def format_date(date_str:str)->str:
    d=datetime.strptime(date_str,"%Y-%m-%d")
    return f"{months[d.month-1]} {d.day}, {d.year}"

def calc_age(date_str:str)->int:
    d=datetime.strptime(date_str,"%Y-%m-%d")
    a=d.year-birth_date.year
    if (d.month,d.day)<(birth_date.month,birth_date.day):
        a-=1
    return a

def sql_escape(v:str)->str:
    return v.replace("'","''")

def json_sql(o)->str:
    return "'"+json.dumps(o,separators=(",",":"),ensure_ascii=True).replace("'","''")+"'::jsonb"

def arr_sql(items)->str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY["+",".join("'"+sql_escape(x)+"'" for x in items)+"]::text[]"

def make_scores(date_start,category,subcategory,danger,lawlessness,impact_scope,authoritarianism,insanity,absurdity,credibility_risk,recency_intensity,rationale_short):
    return {
        "danger":danger,
        "insanity":insanity,
        "absurdity":absurdity,
        "lawlessness":lawlessness,
        "impact_scope":impact_scope,
        "rationale_short":rationale_short,
        "authoritarianism":authoritarianism,
        "credibility_risk":credibility_risk,
        "rationale_detail":f"{category}: {subcategory}. On {format_date(date_start)}, {rationale_short}",
        "recency_intensity":recency_intensity,
    }

metrics={
    "war":{
        "impressions":205000000,
        "reach_estimate":718000000,
        "financial_cost_usd":1320000000,
        "public_reaction":{"negative":81,"neutral":13,"positive":6},
    },
    "rights":{
        "impressions":181000000,
        "reach_estimate":622000000,
        "financial_cost_usd":500000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
    "economy":{
        "impressions":171000000,
        "reach_estimate":588000000,
        "financial_cost_usd":690000000,
        "public_reaction":{"negative":76,"neutral":17,"positive":7},
    },
    "epstein":{
        "impressions":180000000,
        "reach_estimate":620000000,
        "financial_cost_usd":360000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
}

SRC1_URL="https://apnews.com/projects/trump-campaign-promise-tracker/"
SRC1_TITLE="AP tracker: what Trump promised and what he has delivered"
SRC2_URL="https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise"
SRC2_TITLE="PBS: Trump says he kept all promises; PolitiFact meter says otherwise"
SRC3_URL="https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html"
SRC3_TITLE="Independent: Iran strikes debate collides with Epstein-file pressure on Trump"
SRC4_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC4_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC5_URL="https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/"
SRC5_TITLE="President Trump's first 100 days: attacks on human rights"

entries=[
{
  "entry_number":1546,
  "title":"Trump's Promise Tracker Exposure Grew as AP Kept Delivery Status Publicly Updated",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's continuously updated tracker sustained pressure on Trump's delivery claims by keeping implementation status visible and comparable over time. Persistent visibility changes politics because unresolved items do not disappear between news cycles. Trump's message discipline faced ongoing friction from structured public accounting.",
  "rationale":"AP's persistent tracker kept long-run pressure on Trump's delivery narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent tracker","delivery status","public accounting","ongoing pressure","unresolved items"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's updated tracker sustained accountability pressure on Trump's delivery claims.")
},
{
  "entry_number":1547,
  "title":"Trump's Promise Volume Continued to Outpace Administrative Throughput",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's tracker presentation highlighted a throughput problem: promise volume remained high while implementation pathways moved at mixed speeds. Throughput gaps are politically costly because they convert ambition into measurable shortfall. Trump's campaign-scale commitments kept colliding with government-scale execution limits.",
  "rationale":"AP tracker underscored a throughput mismatch between Trump's promises and execution pace.",
  "category":"Government Corruption","subcategory":"Economic Self-Dealing","phase":"White House 2",
  "keywords":["throughput gap","promise volume","execution limits","implementation pace","measurable shortfall"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Economic Self-Dealing",7,6,8,6,3,3,7,10,"Trump's promise volume continued to exceed practical administrative throughput.")
},
{
  "entry_number":1548,
  "title":"Trump's Completion Narrative Weakened as AP's Category Labels Stayed Stable",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Stable AP labels for kept, in-progress, and complicated outcomes reduced Trump's ability to reframe progress with shifting language. Category stability is powerful because it gives audiences a fixed comparison model. Trump's completion narrative lost flexibility under that stable frame.",
  "rationale":"AP's stable categorization constrained Trump's reframing of promise outcomes.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["stable labels","completion narrative","reframing limit","comparison model","outcome categorization"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Stable AP categories weakened Trump's ability to reframe incomplete promise outcomes.")
},
{
  "entry_number":1549,
  "title":"Trump's Promise Accounting Became Easier for Critics to Audit at Scale",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"With AP's project view, critics and researchers could audit Trump's promise accounting across policy areas instead of debating one claim at a time. Scale auditing is harder to neutralize because it reveals pattern-level gaps. Trump's messaging had to fight aggregate evidence, not isolated anecdotes.",
  "rationale":"AP's project format enabled pattern-level auditing of Trump's promise accounting.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["scale audit","pattern-level gap","aggregate evidence","policy-area tracking","promise accounting"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's cross-policy tracker made large-scale audits of Trump's promise record easier.")
},
{
  "entry_number":1550,
  "title":"Trump's Delivery Image Took Ongoing Damage From AP's Side-by-Side Promise Evidence",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's side-by-side evidence model kept Trump's delivery image under continual empirical pressure by aligning rhetoric with status signals. Side-by-side presentation reduces rhetorical escape routes. Trump's image costs rose as unresolved commitments remained visible in the same frame as his claims.",
  "rationale":"AP's side-by-side evidence model sustained empirical pressure on Trump's delivery image.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["side-by-side evidence","delivery image","empirical pressure","rhetoric vs status","image cost"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's side-by-side evidence continued to damage Trump's delivery credibility.")
},

{
  "entry_number":1551,
  "title":"Trump's 'All Promises Kept' Claim Stayed at Odds With PBS-Cited Meter Findings",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's reference to independent meter outcomes kept Trump's all-promises-kept claim in direct conflict with documented classifications. Absolute claims are fragile where external measurement exists. Trump's insistence on total completion increased the visibility of contradiction rather than reducing it.",
  "rationale":"PBS-cited meter data contradicted Trump's total completion claim.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["all promises kept","meter contradiction","absolute claim","external measurement","visible conflict"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS's cited meter findings conflicted with Trump's absolute completion claim.")
},
{
  "entry_number":1552,
  "title":"Trump's Promise Messaging Chose Certainty Even as PBS Framed Mixed Outcomes",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's framing showed mixed outcomes, but Trump's language stayed maximal and certain. This mismatch matters because certainty without proportional evidence erodes trust faster than nuanced claims do. Trump's communication strategy prioritized forceful simplicity over defensible precision.",
  "rationale":"PBS showed mixed outcomes while Trump maintained maximal certainty rhetoric.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["maximal certainty","mixed outcomes","precision gap","trust erosion","forceful simplicity"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump kept certainty rhetoric despite PBS highlighting mixed promise outcomes.")
},
{
  "entry_number":1553,
  "title":"Trump's Promise Defense Entered a High-Friction Fact-Check Environment",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"By anchoring to third-party tracking, PBS moved Trump's promise defense into a high-friction environment where claims were rapidly testable. High-friction environments reward specificity and punish overreach. Trump's broad assertions faced repeated one-step verification challenges.",
  "rationale":"PBS anchoring increased direct fact-check friction around Trump's promise claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["high-friction fact-check","third-party anchor","rapid testability","specificity demand","verification challenge"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS's third-party anchors increased fact-check friction on Trump's promise defense.")
},
{
  "entry_number":1554,
  "title":"Trump's Promise Absolutism Converted a Messaging Win Into a Verifiability Problem",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Trump's absolute framing initially simplifies political messaging, but PBS's meter context turned that simplicity into a verifiability problem. When one super-claim is disproven, adjacent claims inherit credibility damage. Trump's absolutism increased downstream trust costs.",
  "rationale":"PBS context showed Trump's absolutist framing creating avoidable verifiability risk.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["absolutism","verifiability problem","super-claim risk","downstream trust cost","meter context"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's promise absolutism created higher verifiability and credibility risk.")
},
{
  "entry_number":1555,
  "title":"Trump's Promise Narrative Lost Resilience as PBS Kept Independent Benchmarks in View",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Independent benchmarks in PBS reporting reduced the resilience of Trump's narrative by tying claims to repeatable references. Narrative resilience falls when audiences can quickly cross-check details. Trump's promise line became less durable under this benchmarked scrutiny.",
  "rationale":"PBS's benchmarked framing reduced resilience of Trump's promise narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["independent benchmark","narrative resilience","cross-check detail","repeatable reference","durability loss"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Independent benchmarks in PBS coverage weakened durability of Trump's promise narrative.")
},

{
  "entry_number":1556,
  "title":"Trump's Iran Escalation Faced Fresh Claims That Timing Served Political Distraction Needs",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The Independent reported accusations that Trump-era Iran escalation timing overlapped too conveniently with rising Epstein pressure. Even where motive is contested, overlap drives skepticism and forces higher evidentiary standards for security justifications. Trump's escalation rationale entered a lower-trust environment.",
  "rationale":"Independent coverage linked Iran escalation timing to renewed distraction allegations around Trump.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["timing overlap","distraction allegation","skepticism surge","evidentiary standard","lower-trust frame"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,4,4,8,10,"Iran escalation timing deepened distraction allegations and trust deficits around Trump.")
},
{
  "entry_number":1557,
  "title":"Trump's Security Messaging Absorbed Trust Discount Under Iran-Epstein Collision Coverage",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's collision framing meant Trump's national-security claims were interpreted through concurrent scandal pressure. Trust discount emerges when audiences assume political incentives may shape strategic choices. Trump's burden of proof increased as those incentives remained publicly debated.",
  "rationale":"Independent framing increased trust discount on Trump's security messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["trust discount","collision framing","security messaging","burden of proof","incentive skepticism"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Iran-Epstein collision coverage increased skepticism toward Trump's security claims.")
},
{
  "entry_number":1558,
  "title":"Trump's Iran Narrative Was Pulled Into a Wider Legitimacy Contest",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's reporting indicated that debate over Trump's Iran choices could not be isolated from wider legitimacy disputes linked to disclosure and accountability. Once fused, controversies reinforce each other and harden public distrust. Trump's narrative control weakened under this combined frame.",
  "rationale":"Independent showed Trump's Iran messaging being judged inside a broader legitimacy conflict.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["legitimacy contest","combined frame","controversy fusion","narrative control","distrust hardening"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Trump's Iran debate became tied to a wider legitimacy crisis under collision coverage.")
},
{
  "entry_number":1559,
  "title":"Trump's Dual-Front Messaging Increased Contradiction Risk Across Security and Scandal Narratives",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The Independent's dual-front context highlighted how contradictory statements in one domain can contaminate credibility in another. Cross-domain contradiction risk is especially high in fast media cycles. Trump's communication strategy faced rising penalties for inconsistency.",
  "rationale":"Independent dual-front coverage raised contradiction risk for Trump's cross-domain messaging.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["dual-front messaging","cross-domain contradiction","credibility contamination","media cycle speed","inconsistency penalty"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's dual-front messaging raised contradiction penalties across security and scandal narratives.")
},
{
  "entry_number":1560,
  "title":"Trump's Iran Justification Faced Higher Scrutiny Because Parallel Epstein Pressure Never Cleared",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's framing emphasized that Epstein pressure remained active while Iran escalation claims were being sold. Persistent parallel pressure means justifications are evaluated under suspicion by default. Trump's escalation argument encountered a stricter scrutiny baseline.",
  "rationale":"Independent indicated unresolved Epstein pressure intensified scrutiny of Trump's Iran rationale.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["parallel pressure","scrutiny baseline","justification burden","unresolved scandal","escalation rationale"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Unresolved Epstein pressure raised scrutiny standards for Trump's Iran justifications.")
},

{
  "entry_number":1561,
  "title":"Trump's Epstein Risk Stayed Elevated as NPR Kept Document Threads and Claims Connected",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's integrated coverage linked claims to documentary context, which sustained a high-attention risk profile around Trump. Linked narratives are harder to close because updates in one thread revive the other. Trump's exposure remained active despite repeated attempts at narrative closure.",
  "rationale":"NPR's linked-thread framing kept Trump's Epstein exposure active and durable.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["linked threads","document context","active exposure","narrative closure failure","durable risk"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's linked-thread reporting kept Trump's Epstein risk profile elevated.")
},
{
  "entry_number":1562,
  "title":"Trump's Epstein Defense Faced Compounding Timeline Checks in NPR Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"By emphasizing chronology, NPR increased pressure on Trump's defense consistency across dates, actors and document references. Chronology checks compound over time, making contradiction harder to contain. Trump's defensive narrative encountered growing structural fragility.",
  "rationale":"NPR chronology emphasis increased compounding consistency checks on Trump's defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["chronology checks","compounding pressure","defense consistency","structural fragility","timeline conflict"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR's timeline framing exposed compounding consistency risks in Trump's Epstein defense.")
},
{
  "entry_number":1563,
  "title":"Trump's Epstein Narrative Lost Flexibility in NPR's Evidence-Centered Frame",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"Evidence-centered reporting reduces rhetorical flexibility by requiring alignment between claims and referenced material. NPR's approach constrained Trump's ability to pivot without inviting contradiction checks. The narrative became less elastic as source-backed scrutiny persisted.",
  "rationale":"NPR's evidence-first framing constrained Trump's narrative pivot options.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["evidence-centered frame","narrative elasticity","pivot constraint","source-backed scrutiny","contradiction checks"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Evidence-first NPR coverage reduced flexibility in Trump's Epstein narrative.")
},
{
  "entry_number":1564,
  "title":"Trump's Epstein Messaging Entered a Persistent Audit Loop in NPR Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's treatment created a persistent audit loop where each new claim could be compared against prior reporting and known records. Audit loops increase reputational drag because inconsistencies are cumulative and searchable. Trump's messaging costs rose as this loop hardened.",
  "rationale":"NPR's iterative coverage established a persistent audit loop around Trump's Epstein messaging.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent audit loop","iterative comparison","reputational drag","searchable inconsistency","cumulative cost"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's persistent audit loop increased cumulative costs of Trump Epstein messaging contradictions.")
},
{
  "entry_number":1565,
  "title":"Trump's Epstein Exposure Stayed Politically Live Under NPR's Ongoing-Process Framing",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR framed the story as ongoing process rather than closed event, keeping Trump exposed to incremental disclosure shocks. Ongoing-process framing prevents simple reset narratives and sustains institutional attention. Trump's risk remained live rather than decaying with time.",
  "rationale":"NPR's ongoing-process framing kept Trump politically exposed on Epstein-linked issues.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["ongoing process","incremental shock","reset failure","institutional attention","live risk"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Ongoing NPR framing kept Trump's Epstein-related risk politically live.")
},

{
  "entry_number":1566,
  "title":"Trump's First-100-Days Rights Profile Was Framed by Amnesty as Systemic Harm",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's assessment portrayed Trump's early governing period as systemic rights harm across multiple policy domains. Systemic framing indicates interconnected design rather than isolated abuse. Trump's rights profile therefore carried structural accountability implications beyond single incidents.",
  "rationale":"Amnesty framed Trump's early record as systemic rights harm, not isolated episodes.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["systemic harm","rights profile","interconnected design","structural accountability","multi-domain impact"],
  "metrics_key":"rights","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty described Trump's first-100-days record as systemic rights harm.")
},
{
  "entry_number":1567,
  "title":"Trump's Rights Agenda Was Criticized for Producing Fast, Layered Social Damage",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty highlighted layered impacts that can accumulate rapidly when restrictive policies hit overlapping vulnerable populations. Layered harm is difficult to reverse because policy effects compound before remedies arrive. Trump's agenda was criticized for accelerating that compounding dynamic.",
  "rationale":"Amnesty reported layered, compounding rights harms under Trump's early policy direction.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["layered harm","compounding dynamic","vulnerable groups","rapid impact","slow remedy"],
  "metrics_key":"rights","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,8,8,"Amnesty flagged compounding social damage from Trump's accelerated rights-restrictive policies.")
},
{
  "entry_number":1568,
  "title":"Trump's Governance Style Was Linked to Coercive Enforcement Expansion by Amnesty",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's findings linked Trump's governance style to expansion of coercive enforcement mechanisms and weakening protections. Coercive expansion without parallel safeguards increases abuse risk and trust collapse. Trump's trajectory was criticized as moving in that direction early.",
  "rationale":"Amnesty associated Trump's early governance with coercive enforcement expansion and weaker protections.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["coercive expansion","weakened protections","abuse risk","trust collapse","governance style"],
  "metrics_key":"rights","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,8,"Amnesty linked Trump's early governance to coercive expansion and weaker rights safeguards.")
},
{
  "entry_number":1569,
  "title":"Trump's Human-Rights Messaging Was Undercut by Amnesty's Pattern-Level Documentation",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Pattern-level evidence in Amnesty's report challenged Trump's rights messaging by showing consistency of harm signals across domains. Pattern evidence is difficult to rebut with isolated counterexamples. Trump's narrative space narrowed as documentation shifted debate toward structure and outcomes.",
  "rationale":"Amnesty's pattern-level evidence undercut Trump's rights-defense messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pattern-level evidence","rights messaging","cross-domain consistency","structural outcome","rebuttal difficulty"],
  "metrics_key":"rights","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,8,"Amnesty pattern documentation constrained Trump's rights-defense narrative.")
},
{
  "entry_number":1570,
  "title":"Trump's Early-Term Rights Shock Created Long-Run Institutional Repair Burdens",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's first-100-days framing implied that early policy shocks can impose long-run repair burdens on institutions and communities. Repair burdens persist because legal and social systems often trail policy damage. Trump's early trajectory was criticized for generating those deferred costs.",
  "rationale":"Amnesty findings suggested Trump's early rights shocks created durable repair burdens.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["institutional repair","deferred cost","early-term shock","legal lag","community burden"],
  "metrics_key":"rights","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Trump's early rights shock was criticized for creating long-run institutional repair burdens.")
},
]

entry_cols=["entry_number","title","date_start","date_end","synopsis","rationale","category","subcategory","keywords","age","phase","impressions","reach_estimate","financial_cost_usd","public_reaction","fact_check","fact_check_sources","scores"]
score_cols=["entry_number","insanity","absurdity","danger","authoritarianism","lawlessness","credibility_risk","recency_intensity","impact_scope","rationale_short","rationale_detail"]
source_cols=["entry_number","url","title","publisher","date_published","source_type"]

entry_vals=[]
score_vals=[]
source_vals=[]
keyword_vals=[]
for e in entries:
    m=metrics[e["metrics_key"]]
    e["impressions"]=m["impressions"]
    e["reach_estimate"]=m["reach_estimate"]
    e["financial_cost_usd"]=m["financial_cost_usd"]
    e["public_reaction"]=m["public_reaction"]
    e["age"]=calc_age(e["date_start"])
    s=e["scores"]

    entry_vals.append("("+", ".join([
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
        json_sql(s)
    ])+")")

    score_vals.append("("+", ".join([
        str(e["entry_number"]),
        str(s["insanity"]),str(s["absurdity"]),str(s["danger"]),str(s["authoritarianism"]),str(s["lawlessness"]),
        str(s["credibility_risk"]),str(s["recency_intensity"]),str(s["impact_scope"]),
        f"'{sql_escape(s['rationale_short'])}'",
        f"'{sql_escape(s['rationale_detail'])}'"
    ])+")")

    source_vals.append("("+", ".join([
        str(e["entry_number"]),
        f"'{sql_escape(e['source_url'])}'",
        f"'{sql_escape(e['source_title'])}'",
        f"'{sql_escape(e['source_publisher'])}'",
        f"'{e['date_start']}'",
        "'news'"
    ])+")")

    for kw in e["keywords"]:
        keyword_vals.append("("+", ".join([str(e["entry_number"]),f"'{sql_escape(kw)}'"])+")")

sql_entries="INSERT INTO public.trump_entries ("+", ".join(entry_cols)+") VALUES\n"+",\n".join(entry_vals)+"\nON CONFLICT DO NOTHING;"
sql_scores="INSERT INTO public.trump_individual_scores ("+", ".join(score_cols)+") VALUES\n"+",\n".join(score_vals)+"\nON CONFLICT DO NOTHING;"
sql_sources="INSERT INTO public.trump_sources ("+", ".join(source_cols)+") VALUES\n"+",\n".join(source_vals)+";"
sql_keywords="INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"+",\n".join(keyword_vals)+"\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries,sql_scores,sql_sources,sql_keywords],indent=2))
