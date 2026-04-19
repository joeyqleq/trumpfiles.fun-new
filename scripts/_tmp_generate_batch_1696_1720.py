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

SRC1_URL="https://apnews.com/article/6c602da7d44cb8c34fa1a9f85f352e4a"
SRC1_TITLE="From doubts about nuke talks to an Air Force One flight, what led up to Trump's order to strike Iran"
SRC2_URL="https://apnews.com/article/5357243212b4b8bbd387ae91ca797325"
SRC2_TITLE="In Their Words: How Trump's and his administration's statements on Iran evolved and conflicted"
SRC3_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC3_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC4_URL="https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/"
SRC4_TITLE="President Trump's first 100 days: attacks on human rights"
SRC5_URL="https://apnews.com/projects/trump-campaign-promise-tracker/"
SRC5_TITLE="AP tracker: what Trump promised and what he has delivered"

entries=[
{
  "entry_number":1696,
  "title":"Trump's Iran Lead-Up Continued to Favor Tempo Over Deliberative Breadth",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's chronology kept indicating that Trump's Iran lead-up prioritized speed and control over wider deliberative breadth. Tempo-first governance can shrink challenge windows and leave assumptions less tested. Trump's process remained exposed to that risk.",
  "rationale":"AP chronology continued to show tempo-first dynamics in Trump's Iran lead-up.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["lead-up tempo","deliberative breadth","challenge window","assumption testing","process risk"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"AP chronology continued showing tempo-first decision behavior in Trump's Iran lead-up.")
},
{
  "entry_number":1697,
  "title":"Trump's Pre-Strike Sequence Continued to Compress Oversight Timing",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP sequence details suggested oversight timing stayed compressed in Trump's pre-strike flow. Compressed oversight can weaken confidence in process legitimacy and increase review disputes afterward. Trump's sequence remained contentious on that axis.",
  "rationale":"AP details suggested continued oversight-timing compression in Trump's pre-strike flow.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["oversight timing","pre-strike flow","process legitimacy","review dispute","timing compression"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Trump's pre-strike sequence kept compressing oversight timing and clarity.")
},
{
  "entry_number":1698,
  "title":"Trump's Urgency Framing Continued to Outrun Public Criteria Stability",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP context indicated urgency remained central in Trump's framing while stable public criteria stayed underdeveloped. This imbalance keeps accountability debates open and polarized. Trump's messaging continued to rely on urgency weight.",
  "rationale":"AP context showed urgency framing continuing to exceed criteria stability in Trump's messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["urgency framing","criteria stability","accountability polarization","messaging imbalance","public criteria"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's urgency framing continued outpacing stable public criteria in Iran messaging.")
},
{
  "entry_number":1699,
  "title":"Trump's Iran Tempo Continued to Reward Alignment Over Internal Friction",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's process view suggested Trump's tempo still rewarded alignment with pace rather than internal friction. Reduced friction speeds execution but increases vulnerability to bad assumptions. Trump's process stayed in that tradeoff zone.",
  "rationale":"AP process view suggested tempo incentives still favored alignment over internal friction.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["tempo incentives","internal friction","assumption vulnerability","execution speed","tradeoff zone"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's Iran tempo continued to privilege alignment over internal procedural friction.")
},
{
  "entry_number":1700,
  "title":"Trump's Iran Chronology Continued to Carry High Accountability Ambiguity",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP chronology continued to show contested sequencing and objective emphasis around Trump's Iran actions. Ambiguous chronology complicates auditability and public trust. Trump's accountability picture remained blurred.",
  "rationale":"AP chronology continued to show accountability ambiguity around Trump's Iran actions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chronology ambiguity","objective emphasis","auditability","trust complication","blurred accountability"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Contested chronology kept Trump's Iran accountability picture ambiguous.")
},

{
  "entry_number":1701,
  "title":"Trump's Iran Messaging Continued to Split Across Multiple Official Rationales",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's side-by-side statements continued to show Trump and surrogates presenting divergent rationales for the same action. Divergence raises coordination cost and oversight uncertainty. Trump's messaging coherence remained weak.",
  "rationale":"AP side-by-side statements continued showing divergent official rationales around Trump.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["divergent rationale","official split","coordination cost","oversight uncertainty","coherence gap"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Divergent official rationales kept weakening coherence in Trump's Iran messaging.")
},
{
  "entry_number":1702,
  "title":"Trump's Post-Action Messaging Continued to Shift Benchmarks Faster Than Review Cycles",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP progression suggested benchmark drift persisted in Trump's post-action language, outpacing normal oversight cycles. Benchmark drift undermines stable review and creates moving-target disputes. Trump's narrative remained fluid.",
  "rationale":"AP progression suggested persistent benchmark drift in Trump's post-action messaging.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["benchmark drift","review cycle","moving-target dispute","post-action language","oversight lag"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Persistent benchmark shifts kept Trump's post-action messaging ahead of review cycles.")
},
{
  "entry_number":1703,
  "title":"Trump's Conflicting Iran Signals Continued to Tax Allied Planning",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP comparisons continued indicating allied planners faced extra friction under Trump's conflicting signals. Planning tax rises when one operation carries multiple narratives. Trump's signaling remained costly for coordination.",
  "rationale":"AP comparisons continued showing allied planning friction from Trump's conflicting signals.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["conflicting signals","allied planning","coordination tax","narrative plurality","planning friction"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Conflicting Trump signals continued increasing allied planning and coordination costs.")
},
{
  "entry_number":1704,
  "title":"Trump's Narrative Plasticity Continued to Delay Accountability Convergence",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP mapping suggested Trump's narrative plasticity still delayed accountability convergence by enabling competing retroactive interpretations. Delayed convergence sustains political conflict and lowers trust. Trump's narrative remained highly malleable.",
  "rationale":"AP mapping suggested ongoing narrative plasticity delaying accountability convergence.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative plasticity","accountability convergence","retroactive interpretation","trust erosion","malleable narrative"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Narrative plasticity kept delaying convergence in accountability for Trump's Iran messaging.")
},
{
  "entry_number":1705,
  "title":"Trump's Competing Iran Storylines Kept Credibility Risk Chronically Elevated",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's record of competing storylines continued to keep Trump's credibility risk in chronic territory. Chronic risk compounds as each new claim is read through prior inconsistency. Trump's credibility remained under durable strain.",
  "rationale":"AP record of competing storylines continued chronic credibility pressure on Trump.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["competing storylines","chronic credibility risk","durable strain","inconsistency history","claim filtering"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Competing Iran storylines kept Trump's credibility risk in a chronically elevated state.")
},

{
  "entry_number":1706,
  "title":"Trump's Epstein Exposure Stayed Active Under NPR's Evidence-Linked Narrative",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's evidence-linked narrative continued to keep Trump's Epstein exposure active by tying claims to record context. Evidence linkage resists narrative reset and prolongs scrutiny. Trump's exposure remained persistent.",
  "rationale":"NPR evidence linkage continued sustaining active Trump Epstein exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["evidence linkage","active exposure","record context","reset resistance","persistent scrutiny"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's evidence-linked narrative continued to sustain active exposure around Trump and Epstein.")
},
{
  "entry_number":1707,
  "title":"Trump's Epstein Defense Continued to Face Timeline Pressure in NPR Reporting",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR chronology emphasis kept timeline pressure on Trump's defense claims. Timeline pressure compounds with each additional reference and cross-check. Trump's defense remained fragile under date-linked scrutiny.",
  "rationale":"NPR chronology emphasis continued compounding timeline pressure on Trump's defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["timeline pressure","chronology emphasis","date-linked scrutiny","cross-check compounding","defense fragility"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR chronology continued compounding timeline pressure on Trump's Epstein defense.")
},
{
  "entry_number":1708,
  "title":"Trump's Narrative Pivot Space Stayed Limited in NPR's Source-Forward Format",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's source-forward format kept limiting Trump's pivot room by preserving context continuity. Limited pivot space raises contradiction exposure in later statements. Trump's narrative flexibility remained constrained.",
  "rationale":"NPR source-forward format kept constraining Trump's narrative pivot options.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["source-forward format","pivot space","context continuity","contradiction exposure","narrative constraint"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's source-forward coverage kept constraining flexibility in Trump's Epstein narrative.")
},
{
  "entry_number":1709,
  "title":"Trump's Epstein Messaging Continued Cycling Through NPR's Persistent Audit Loop",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's persistent audit loop continued forcing new Trump statements through archived context checks. Audit loops reduce the value of short-term reframing. Trump's messaging cycle stayed exposed.",
  "rationale":"NPR's persistent audit loop continued exposing Trump messaging to archival checks.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent audit loop","archival check","reframing limit","message cycle","context memory"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Persistent audit loops in NPR coverage kept exposing Trump's Epstein messaging inconsistencies.")
},
{
  "entry_number":1710,
  "title":"Trump's Epstein Risk Baseline Stayed High Under NPR's Open-Process Framing",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's open-process framing continued to keep Trump's Epstein risk baseline high by signaling unresolved status. Open-process narratives sustain attention and future verification expectations. Trump's risk remained elevated.",
  "rationale":"NPR open-process framing continued sustaining elevated Trump Epstein risk baseline.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["open-process framing","risk baseline","unresolved status","future verification","attention durability"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's open-process framing kept Trump's Epstein risk baseline elevated.")
},

{
  "entry_number":1711,
  "title":"Trump's Rights Record Continued to Be Framed by Amnesty as Structural Harm",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's assessment continued framing Trump's rights record as structural harm rather than incidental error. Structural framing implies broader policy intent and deeper accountability stakes. Trump's record remained under that critique.",
  "rationale":"Amnesty continued framing Trump's rights record as structural harm.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["structural harm","policy intent","rights record","accountability stakes","deep critique"],
  "metrics_key":"rights","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty continued framing Trump's rights record as structural harm with higher accountability stakes.")
},
{
  "entry_number":1712,
  "title":"Trump's Rights Agenda Continued to Draw Criticism for Compounding Social Damage",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's language continued emphasizing compounding social damage under Trump's early policy direction. Compounding damage increases recovery cost and long-term institutional burden. Trump's agenda remained criticized on those grounds.",
  "rationale":"Amnesty continued emphasizing compounding damage under Trump's rights agenda.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["compounding damage","recovery cost","institutional burden","rights agenda","social harm"],
  "metrics_key":"rights","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,8,8,"Amnesty continued to criticize Trump's rights agenda for compounding social damage.")
},
{
  "entry_number":1713,
  "title":"Trump's Coercive Policy Direction Continued to Be Linked to Weakening Safeguards",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty continued linking Trump's coercive direction to weaker safeguards and elevated abuse risk. This combination erodes institutional resilience over time. Trump's direction remained under this criticism.",
  "rationale":"Amnesty continued linking Trump's coercive direction to weakened safeguards.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["coercive direction","weakened safeguards","abuse risk","institutional resilience","policy criticism"],
  "metrics_key":"rights","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,8,"Amnesty continued linking Trump's coercive policy direction to weaker safeguards and higher abuse risk.")
},
{
  "entry_number":1714,
  "title":"Trump's Rights Messaging Continued to Be Pressured by Amnesty's Pattern Evidence",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Pattern evidence in Amnesty's reporting continued to pressure Trump's rights messaging by tying rhetoric to repeated outcomes. Pattern evidence is durable and harder to deflect than isolated incidents. Trump's messaging remained vulnerable.",
  "rationale":"Amnesty pattern evidence continued pressuring Trump's rights messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pattern evidence","rights messaging","repeated outcomes","durable critique","deflection limit"],
  "metrics_key":"rights","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,8,"Amnesty's pattern evidence continued to pressure and constrain Trump's rights messaging.")
},
{
  "entry_number":1715,
  "title":"Trump's Early Rights Shock Continued to Imply Long-Term Repair Liabilities",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty framing continued implying long-term repair liabilities from Trump's early rights shock. Repair liabilities persist across legal and administrative cycles. Trump's trajectory remained costly on a long horizon.",
  "rationale":"Amnesty framing continued implying long-term repair liabilities from Trump's early rights shock.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["repair liability","long horizon","rights shock","legal cycle","administrative burden"],
  "metrics_key":"rights","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty continued linking Trump's early rights shock to long-term repair liabilities.")
},

{
  "entry_number":1716,
  "title":"Trump's Promise Tracker Exposure Continued Under AP's Public Status Architecture",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's status architecture continued exposing Trump's promise claims to public comparison across categories and time. Public architecture limits narrative resets by preserving clear outcome states. Trump's exposure remained persistent.",
  "rationale":"AP status architecture continued to expose Trump's promise claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["status architecture","public comparison","outcome states","narrative reset","promise exposure"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP status architecture continued exposing Trump's promise claims to public comparison.")
},
{
  "entry_number":1717,
  "title":"Trump's Promise Story Continued Facing Pattern Accountability in AP Tracking",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP tracking continued forcing Trump's promise story into pattern accountability rather than isolated claim defense. Pattern accountability highlights systematic gaps more clearly. Trump's story remained constrained.",
  "rationale":"AP tracking continued forcing pattern accountability on Trump's promise story.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["pattern accountability","systematic gap","tracking constraint","story pressure","isolated defense"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP tracking continued to enforce pattern accountability on Trump's promise narrative.")
},
{
  "entry_number":1718,
  "title":"Trump's Uniform Promise-Success Framing Continued to Weaken Against AP Category Data",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP category data continued weakening Trump's uniform promise-success framing by preserving mixed statuses. Mixed statuses resist blanket narrative claims. Trump's framing remained fragile.",
  "rationale":"AP category data continued weakening Trump's uniform promise-success framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["uniform success","category data","mixed status","blanket claim","framing fragility"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP category data continued weakening Trump's uniform promise-success framing.")
},
{
  "entry_number":1719,
  "title":"Trump's Promise Record Continued to Be Easy to Audit Through AP's Persistent Interface",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's persistent interface continued making Trump's promise record easy to audit over repeated cycles. Easy auditability preserves accountability pressure despite narrative churn. Trump's record remained testable.",
  "rationale":"AP's persistent interface continued making Trump's promise record easily auditable.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent interface","easy auditability","narrative churn","accountability pressure","record testing"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's persistent interface continued keeping Trump's promise record readily auditable.")
},
{
  "entry_number":1720,
  "title":"Trump's Delivery Narrative Continued Losing Stability Against AP's Structured Comparisons",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Structured comparisons in AP tracking continued undermining stability of Trump's delivery narrative. Stable narratives require repeated alignment with measured outcomes. Trump's delivery line remained unstable.",
  "rationale":"AP structured comparisons continued undermining stability of Trump's delivery narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["structured comparison","delivery stability","measured outcomes","narrative alignment","unstable line"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP structured comparisons continued destabilizing Trump's delivery narrative.")
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
