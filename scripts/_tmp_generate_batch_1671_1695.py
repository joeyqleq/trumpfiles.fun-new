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
SRC3_URL="https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi"
SRC3_TITLE="Trump, Epstein files, and FBI disclosure conflict"
SRC4_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC4_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"
SRC5_URL="https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise"
SRC5_TITLE="PBS: Trump says he kept all promises; PolitiFact meter says otherwise"

entries=[
{
  "entry_number":1671,
  "title":"Trump's Iran Decision Chain Continued to Prioritize Acceleration Over Deliberation",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's timeline reinforced that Trump's Iran decision chain still favored acceleration. Acceleration can deliver tactical surprise but weakens deliberative depth and post-hoc legitimacy. Trump's process retained this tradeoff.",
  "rationale":"AP timeline reinforced acceleration-first dynamics in Trump's Iran decision chain.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["decision chain","acceleration-first","deliberative depth","tactical surprise","legitimacy tradeoff"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"AP timeline continued to show acceleration over deliberation in Trump's Iran process.")
},
{
  "entry_number":1672,
  "title":"Trump's Pre-Strike Tempo Kept Limiting Visibility Into Internal Review",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's sequence suggested internal review visibility remained limited under Trump's pre-strike tempo. Limited visibility weakens confidence in process quality and accountability. Trump's tempo model kept this risk active.",
  "rationale":"AP sequence suggested limited internal-review visibility under Trump's pre-strike tempo.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["pre-strike tempo","internal review","process visibility","accountability quality","tempo risk"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Pre-strike tempo kept visibility into Trump's internal review process limited.")
},
{
  "entry_number":1673,
  "title":"Trump's Urgency Narrative Continued to Outweigh Stable Public Criteria",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP context suggested urgency remained central in Trump's explanation style, while stable criteria remained weakly articulated. Without stable criteria, oversight disputes persist longer. Trump's narrative kept that condition in place.",
  "rationale":"AP context showed urgency narrative continuing to outweigh stable criteria in Trump messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["urgency narrative","stable criteria","oversight dispute","explanation style","criteria gap"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's urgency-driven messaging continued to outpace stable public criteria.")
},
{
  "entry_number":1674,
  "title":"Trump's Iran Tempo Continued to Reward Alignment Over Procedural Challenge",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's process framing implied Trump's Iran tempo continued rewarding alignment with pace rather than procedural challenge. This weakens corrective friction and raises error sensitivity. Trump's tempo governance remained vulnerable to that pattern.",
  "rationale":"AP framing implied Trump's tempo still discouraged procedural challenge.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["tempo alignment","procedural challenge","corrective friction","error sensitivity","governance pattern"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's Iran tempo continued to reward alignment over procedural challenge.")
},
{
  "entry_number":1675,
  "title":"Trump's Iran Sequencing Continued to Produce Accountability-Clarity Strain",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP details continued to show contested sequencing and objective framing around Trump's Iran decisions. Contested sequencing keeps accountability clarity under strain and extends review disputes. Trump's process remained exposed.",
  "rationale":"AP details continued to show sequencing-driven accountability strain in Trump's Iran decisions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["sequencing strain","objective framing","review dispute","accountability clarity","process exposure"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Trump's Iran sequencing kept accountability clarity under persistent strain.")
},

{
  "entry_number":1676,
  "title":"Trump's Iran Explanations Continued to Diverge Across Official Voices",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's in-their-words comparisons continued to show divergence among Trump's official explanations. Divergence raises uncertainty for allies and oversight bodies. Trump's message coherence remained weak.",
  "rationale":"AP comparisons showed ongoing divergence in Trump's official Iran explanations.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["official divergence","message coherence","ally uncertainty","oversight ambiguity","comparison evidence"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"AP comparisons kept showing divergent official explanations around Trump's Iran policy.")
},
{
  "entry_number":1677,
  "title":"Trump's Post-Action Benchmarks Continued to Shift Before Oversight Converged",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP progression suggested post-action benchmarks in Trump's messaging were still shifting quickly. Fast benchmark shifts obstruct stable oversight conclusions. Trump's post-action narrative remained fluid at oversight's expense.",
  "rationale":"AP progression suggested ongoing benchmark shifts in Trump's post-action messaging.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["benchmark shift","post-action fluidity","oversight convergence","stable conclusion","narrative movement"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Trump's shifting post-action benchmarks continued to hinder oversight convergence.")
},
{
  "entry_number":1678,
  "title":"Trump's Conflicting Iran Language Continued to Raise Coordination Costs",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP side-by-side records continued to indicate coordination costs from Trump's conflicting signals. Coordination costs grow when partners cannot rely on one stable frame. Trump's language variability kept planning friction elevated.",
  "rationale":"AP side-by-side records indicated sustained coordination costs from Trump's conflicting Iran language.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["conflicting signals","coordination cost","planning friction","stable frame deficit","language variability"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Conflicting Trump language continued to elevate coordination costs for partners.")
},
{
  "entry_number":1679,
  "title":"Trump's Narrative Plasticity Continued to Weaken Long-Horizon Accountability",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP mapping suggested Trump's narrative plasticity continued making long-horizon accountability harder to settle. Plasticity supports short-term flexibility but weakens durable clarity. Trump's accountability exposure remained unresolved.",
  "rationale":"AP mapping suggested ongoing narrative plasticity weakening long-horizon accountability clarity.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative plasticity","long-horizon accountability","durable clarity","short-term flexibility","resolution difficulty"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's narrative plasticity kept weakening long-horizon accountability clarity.")
},
{
  "entry_number":1680,
  "title":"Trump's Competing Iran Frames Kept Credibility Risk in a Chronic State",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"As AP's comparisons continued, Trump's competing Iran frames preserved chronic credibility risk. Chronic risk differs from a one-off contradiction because it compounds over repeated cycles. Trump's credibility remained chronically exposed.",
  "rationale":"AP comparisons suggested chronic credibility risk from Trump's competing Iran frames.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["competing frames","chronic risk","credibility exposure","repeated cycle","compounding contradiction"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Competing Iran frames kept Trump's credibility risk in a chronic, compounding state.")
},

{
  "entry_number":1681,
  "title":"Trump's Epstein-FBI Disclosure Conflict Continued Without Clear Resolution",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's reporting continued to frame Trump-related Epstein disclosure tensions as unresolved. Unresolved conflict sustains scrutiny and limits narrative closure. Trump's exposure remained structurally active.",
  "rationale":"Guardian continued framing Trump-Epstein disclosure conflict as unresolved.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["unresolved conflict","disclosure tension","structural exposure","narrative closure","ongoing scrutiny"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian's unresolved framing kept Trump's Epstein-FBI disclosure conflict structurally active.")
},
{
  "entry_number":1682,
  "title":"Trump's Epstein Messaging Continued to Face Drag From Disclosure Ambiguity",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's coverage suggested ambiguity around disclosure pathways continued to drag on Trump's messaging. Ambiguity drag slows stabilization and keeps audiences in skeptical mode. Trump's narrative remained burdened.",
  "rationale":"Guardian suggested ongoing disclosure ambiguity dragging Trump's Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["disclosure ambiguity","messaging drag","stabilization delay","skeptical mode","narrative burden"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Ongoing ambiguity continued to drag on Trump's Epstein messaging stability.")
},
{
  "entry_number":1683,
  "title":"Trump's Transparency Claims Stayed Procedurally Vulnerable Under Guardian's Focus",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's procedural focus kept Trump's transparency claims vulnerable to access and process critiques. Procedural critique can outweigh rhetorical certainty in accountability discourse. Trump's claims remained exposed.",
  "rationale":"Guardian procedural focus maintained vulnerability in Trump's transparency claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["procedural focus","access critique","process vulnerability","transparency claim","accountability discourse"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian's procedural framing kept Trump's transparency claims vulnerable to process critiques.")
},
{
  "entry_number":1684,
  "title":"Trump's Epstein Strategy Continued to Meet Repeating Institutional Resistance",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's recurring pattern implied institutional resistance to Trump's Epstein strategy remained repeat and durable. Repeating resistance signals structural tension rather than episodic noise. Trump's strategy stayed constrained.",
  "rationale":"Guardian recurring pattern showed durable institutional resistance to Trump's Epstein strategy.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["repeating resistance","structural tension","durable pattern","strategy constraint","institutional pushback"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Election Interference","Democratic Institution Undermining",7,7,8,7,3,3,8,10,"Repeating institutional resistance continued constraining Trump's Epstein strategy.")
},
{
  "entry_number":1685,
  "title":"Trump's Epstein Exposure Stayed Chronically Elevated in Guardian's Conflict Frame",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's conflict framing continued to present Trump's Epstein exposure as chronic due to absent resolution markers. Chronic exposure compounds reputational and political strain. Trump's risk stayed elevated.",
  "rationale":"Guardian conflict frame continued portraying Trump's Epstein exposure as chronic.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chronic exposure","conflict frame","resolution marker","compounded strain","elevated risk"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian conflict framing kept Trump's Epstein exposure chronically elevated.")
},

{
  "entry_number":1686,
  "title":"Trump-Era Missing Files Continued to Anchor Integrity Doubts in Epstein Disclosures",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file count continued anchoring integrity doubts around Trump-era Epstein disclosures. Anchored metrics persist through cycles and support repeated scrutiny. Trump's integrity posture stayed under quantified pressure.",
  "rationale":"AP missing-file count continued anchoring integrity doubts in Trump-era disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["missing-file anchor","integrity doubt","quantified pressure","repeat scrutiny","disclosure posture"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's missing-file metric kept anchoring integrity doubts around Trump-era disclosures.")
},
{
  "entry_number":1687,
  "title":"Trump's Full-Disclosure Story Stayed Exposed to AP's Countable Gap",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's countable gap continued exposing tension between Trump's full-disclosure story and measurable archive reality. Countable gaps remain difficult to neutralize rhetorically. Trump's story stayed exposed.",
  "rationale":"AP countable gap kept exposing tension in Trump's full-disclosure narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["countable gap","full-disclosure story","archive reality","rhetorical limit","measurable tension"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Countable AP gaps kept exposing contradictions in Trump's full-disclosure story.")
},
{
  "entry_number":1688,
  "title":"Trump's Archive-Handling Credibility Stayed Strained by Chain-of-Custody Questions",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's disappearance evidence continued sustaining chain-of-custody questions around Trump-era archive handling. Without transparent reconstruction, those questions persist. Trump's archive credibility remained strained.",
  "rationale":"AP disappearance evidence kept chain-of-custody questions active around Trump-era archives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain-of-custody","archive handling","transparent reconstruction","credibility strain","disappearance evidence"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Chain-of-custody questions kept straining credibility of Trump's archive-handling narrative.")
},
{
  "entry_number":1689,
  "title":"Trump's Epstein Messaging Continued Accumulating Long-Tail Damage From Gap Metrics",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP gap metrics continued to accumulate long-tail damage against Trump's Epstein messaging by reappearing in later cycles. Long-tail damage compounds even when news intensity falls. Trump's burden remained cumulative.",
  "rationale":"AP gap metrics kept compounding long-tail damage in Trump's Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["long-tail damage","gap metrics","cumulative burden","cycle recurrence","messaging attrition"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Gap metrics continued compounding long-tail damage against Trump's Epstein messaging.")
},
{
  "entry_number":1690,
  "title":"Trump's Disclosure-Integrity Risk Stayed Audit-Ready Under AP's Quantified Findings",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantified findings continued keeping Trump's disclosure-integrity risk audit-ready and easy to track. Audit-ready risk remains politically sticky because it can be checked repeatedly. Trump's integrity exposure stayed visible.",
  "rationale":"AP quantified findings kept Trump's disclosure-integrity risk persistently audit-ready.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["audit-ready risk","quantified findings","trackable exposure","political stickiness","integrity visibility"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP findings kept Trump's disclosure-integrity risk visible and repeatedly auditable.")
},

{
  "entry_number":1691,
  "title":"Trump's Promise Absolutism Continued to Clash With PBS's Meter Reality",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's meter reality continued clashing with Trump's absolutist promise claims. Absolutism can simplify messaging but creates high contradiction risk in measured environments. Trump's framing stayed brittle.",
  "rationale":"PBS meter reality continued contradicting Trump's absolutist promise framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["promise absolutism","meter reality","contradiction risk","measured environment","framing brittleness"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS meter reality kept contradicting Trump's absolutist promise framing.")
},
{
  "entry_number":1692,
  "title":"Trump's Promise Defense Continued to Lose Ground in PBS's Benchmark Context",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS benchmark context continued to reduce the effectiveness of Trump's promise defense by foregrounding independent status checks. Benchmark contexts punish overstatement and reward specificity. Trump's defense kept losing ground.",
  "rationale":"PBS benchmark context continued weakening Trump's promise defense.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["benchmark context","independent checks","overstatement penalty","specificity reward","defense erosion"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Independent benchmarks in PBS coverage continued eroding Trump's promise defense.")
},
{
  "entry_number":1693,
  "title":"Trump's Promise Messaging Continued to Favor Certainty Over Verifiability",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS framing continued to show Trump favoring certainty-heavy messaging over verifiability-safe claims. Certainty without proportional evidence accumulates trust debt. Trump's messaging continued to absorb that debt.",
  "rationale":"PBS framing continued to show certainty-heavy messaging over verifiability in Trump claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["certainty over verifiability","trust debt","evidence proportionality","messaging style","claim durability"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's promise messaging continued favoring certainty over verifiability-safe claims.")
},
{
  "entry_number":1694,
  "title":"Trump's Promise Claims Stayed Exposed to Rapid Public Cross-Checks in PBS Coverage",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"With meter references in view, PBS coverage kept Trump's promise claims exposed to rapid public cross-checks. Rapid cross-checkability limits narrative escape options. Trump's claims remained exposed.",
  "rationale":"PBS coverage kept Trump's promise claims rapidly cross-checkable by the public.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["rapid cross-check","public verification","narrative escape limit","meter reference","claim exposure"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS meter references kept Trump's promise claims exposed to rapid public verification.")
},
{
  "entry_number":1695,
  "title":"Trump's Total-Compliance Story Continued to Weaken Under PBS's Evidence Frame",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's evidence frame continued weakening Trump's total-compliance story by maintaining visibility of mixed statuses. Evidence frames reward consistency across repeated checks, not one-off assertion. Trump's total-compliance story stayed weak.",
  "rationale":"PBS evidence framing continued weakening Trump's total-compliance storyline.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["total-compliance story","evidence frame","mixed status visibility","repeated checks","consistency standard"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS evidence framing kept weakening Trump's total-compliance story.")
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
