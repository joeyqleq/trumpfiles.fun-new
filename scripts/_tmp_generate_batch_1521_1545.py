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
SRC3_URL="https://www.rollingstone.com/politics/political-commentary/trump-war-iran-lies-fantasies-1235524016/"
SRC3_TITLE="Rolling Stone: Trump's Iran war claims and contradictions"
SRC4_URL="https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments"
SRC4_TITLE="Trump's concerning moments raise alarm about fitness and judgment"
SRC5_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC5_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"

entries=[
{
  "entry_number":1521,
  "title":"Trump's Promise Tracker Gap Showed Delivery Claims Outrunning Documented Outcomes",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's tracker format put Trump's promise rhetoric side by side with implementation status, exposing a measurable gap between declaration and delivery. That gap matters because campaign claims become governance liabilities once they are benchmarked publicly. Trump's narrative of total follow-through conflicted with structured tracking evidence.",
  "rationale":"AP tracker showed Trump's delivery narrative exceeding documented implementation status.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["promise tracker gap","delivery claim","implementation status","benchmark evidence","follow-through conflict"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP tracker data showed Trump's delivery claims outpacing documented outcomes.")
},
{
  "entry_number":1522,
  "title":"Trump's Promise Accounting Faced Public Audit Pressure as AP Status Labels Hardened",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's kept/in-progress/complicated framework made Trump's promise accounting harder to blur with broad rhetoric. Once status labels are visible and repeatable, narrative ambiguity loses power. Trump's political messaging had to confront a simpler question: what is actually complete versus what remains unresolved.",
  "rationale":"AP status categories increased audit pressure on Trump's promise accounting.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["status labels","promise accounting","public audit","resolved vs unresolved","narrative ambiguity"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,7,10,"AP's status model increased pressure on Trump's measurable promise accounting.")
},
{
  "entry_number":1523,
  "title":"Trump's High-Volume Promise Strategy Produced a Manageability Problem in Office",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's tracker highlighted how volume itself can become a governance stressor when many commitments compete for legal and administrative bandwidth. High promise volume may energize campaigns, but in office it exposes execution limits quickly. Trump's strategy amplified expectations faster than policy machinery could satisfy them.",
  "rationale":"AP tracker suggested Trump's promise volume exceeded practical execution bandwidth.",
  "category":"Government Corruption","subcategory":"Economic Self-Dealing","phase":"White House 2",
  "keywords":["promise volume","execution bandwidth","governance stressor","administrative limit","expectation inflation"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Economic Self-Dealing",7,6,8,6,3,3,7,10,"Trump's high-volume promise strategy exposed execution-capacity limits.")
},
{
  "entry_number":1524,
  "title":"Trump's Promise Narrative Relied on Category Blurring That AP's Tracker Reduced",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's structure reduced category blurring by separating complete actions from partial movement and unresolved complications. Category clarity constrains spin because audiences can compare like with like. Trump's messaging lost flexibility when promise status could be referenced with consistent tracker language.",
  "rationale":"AP's structured categories weakened Trump's ability to blur promise outcomes.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["category blurring","tracker language","status clarity","spin constraint","promise outcomes"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP category clarity reduced Trump's room to blur promise results.")
},
{
  "entry_number":1525,
  "title":"Trump's Delivery Story Took Reputational Damage From AP's Persistent Promise Dashboard",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"A persistent AP dashboard turns one-time contradictions into recurring accountability events because gaps remain visible over time. That persistence changes reputational dynamics: unresolved items keep re-entering debate without needing new allegations. Trump's delivery story absorbed continuing damage as tracked discrepancies stayed active.",
  "rationale":"AP's persistent tracker converted Trump's promise gaps into recurring reputational liabilities.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent dashboard","recurring liability","tracked discrepancy","reputational damage","active gap"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's persistent dashboard kept Trump's promise discrepancies in active circulation.")
},

{
  "entry_number":1526,
  "title":"Trump's 'I Kept All Promises' Claim Collided With PBS-Cited Meter Evidence",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"PBS highlighted a direct collision between Trump's absolute claim and meter-based assessments showing mixed completion. Absolute claims are risky when independent scorecards exist, because contradiction is easy for audiences to verify. Trump's messaging used maximal certainty in a context that rewarded measurable nuance.",
  "rationale":"PBS reporting showed Trump's blanket completion claim conflicting with tracked outcomes.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["absolute claim","meter evidence","completion conflict","verifiable contradiction","maximal certainty"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's all-promises-kept claim conflicted with PBS-cited tracking evidence.")
},
{
  "entry_number":1527,
  "title":"Trump's Promise Absolutism Increased Credibility Risk in Evidence-Rich Coverage Environments",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"PBS's use of independent tracker context showed why absolutist phrasing can backfire when evidence is granular and public. Credibility damage compounds when one disproven super-claim taints adjacent claims. Trump's choice of all-or-nothing language elevated avoidable reputation risk.",
  "rationale":"PBS context showed Trump's absolutist promise rhetoric amplifying credibility exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["promise absolutism","evidence-rich coverage","credibility compounding","super-claim risk","all-or-nothing"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's absolutist promise framing increased credibility risk under granular public evidence.")
},
{
  "entry_number":1528,
  "title":"Trump's Promise Defense Strategy Prioritized Certainty Over Verifiability",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"PBS's framing suggested Trump emphasized rhetorical certainty even where verification frameworks showed partial fulfillment and unresolved items. Certainty can energize base politics, but verifiability determines broader trust durability. Trump's approach gained short-term punch while weakening long-term evidentiary resilience.",
  "rationale":"PBS comparison indicated Trump favored rhetorical certainty over verifiable promise accounting.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["certainty vs verifiability","partial fulfillment","trust durability","evidentiary resilience","promise defense"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's promise defense emphasized certainty while verifiability remained mixed.")
},
{
  "entry_number":1529,
  "title":"Trump's Meter Mismatch Reinforced Perception of Reality-Gap Messaging",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"By presenting external meter findings against Trump's total-compliance claim, PBS reinforced a reality-gap narrative. Reality-gap messaging is politically potent until audiences can independently test it, then it becomes a liability. Trump's mismatch with published meter status sustained this liability.",
  "rationale":"PBS showed Trump's claim-to-meter mismatch feeding a reality-gap perception.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["meter mismatch","reality gap","independent test","claim liability","status contradiction"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's promise claims diverged from meter status, reinforcing reality-gap messaging concerns.")
},
{
  "entry_number":1530,
  "title":"Trump's Promise-Completion Claim Became Easier to Challenge Because PBS Anchored It to Third-Party Tracking",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Once PBS anchored Trump's claim to a known external tracker, challenges moved from opinion to reference checking. Reference-check politics is less forgiving because audiences can verify claims with one click. Trump's completion statement therefore entered a high-friction fact-check environment.",
  "rationale":"PBS anchoring to third-party tracking made Trump's completion claim directly testable.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["third-party tracking","reference check","high-friction fact-check","claim testability","one-click verification"],
  "metrics_key":"economy","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS tied Trump's completion claim to external tracking, increasing direct fact-check pressure.")
},

{
  "entry_number":1531,
  "title":"Trump's Iran War Rationale Faced Rolling Stone's Claim-by-Claim Contradiction Test",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Rolling Stone's commentary framed Trump's Iran rationale as a sequence of claims vulnerable to contradiction and revision. Claim-by-claim scrutiny matters because it breaks broad narratives into falsifiable units. Trump's war messaging took heavier damage once each assertion could be interrogated separately.",
  "rationale":"Rolling Stone's analysis challenged Trump's Iran rationale through contradiction-focused breakdown.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["claim-by-claim test","contradiction breakdown","war rationale","falsifiable units","assertion scrutiny"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,4,4,8,10,"Rolling Stone's contradiction test intensified scrutiny of Trump's Iran-war rationale.")
},
{
  "entry_number":1532,
  "title":"Trump's Iran Messaging Strategy Was Cast as Narrative Drift Under Operational Stress",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Rolling Stone argued Trump's messaging drifted as operational stress increased, with changing justifications and tone. Drift under stress is strategically costly because adversaries, allies and domestic institutions all discount unstable signals. Trump's communication pattern amplified uncertainty during a period requiring clarity.",
  "rationale":"Rolling Stone described Trump narrative drift in Iran messaging under pressure.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["narrative drift","operational stress","signal instability","clarity deficit","uncertainty amplification"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's Iran messaging drift increased uncertainty during high-stakes operations.")
},
{
  "entry_number":1533,
  "title":"Trump's Iran Justifications Were Framed as Fantasy-Heavy and Fact-Light in Critical Coverage",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Rolling Stone's framing emphasized a perceived imbalance between dramatic narrative imagery and verifiable factual grounding. In war politics, this imbalance can trigger public backlash and elite skepticism when costs rise. Trump's justification style therefore carried higher fragility than evidence-centered communication.",
  "rationale":"Rolling Stone argued Trump's Iran rhetoric leaned on dramatic framing over verifiable support.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["fantasy-heavy rhetoric","fact-light claims","backlash risk","evidence fragility","dramatic framing"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Critical coverage framed Trump's Iran rhetoric as dramatic but weakly evidenced.")
},
{
  "entry_number":1534,
  "title":"Trump's Iran Escalation Case Absorbed Higher Skepticism as Contradiction Narratives Spread",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Rolling Stone's contradiction narrative contributed to a skepticism cascade where each new claim was pre-filtered for inconsistency. In that environment, even accurate statements face trust discounting. Trump's escalation case entered a lower-trust ecosystem shaped by repeated inconsistency signals.",
  "rationale":"Rolling Stone's contradiction framing drove a skepticism cascade around Trump's escalation case.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["skepticism cascade","trust discount","inconsistency signal","escalation case","lower-trust ecosystem"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-02","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Contradiction narratives raised baseline skepticism toward Trump's Iran escalation claims.")
},
{
  "entry_number":1535,
  "title":"Trump's War Communication Model Showed High Volatility and Low Reconciliation Capacity",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Critical analysis portrayed Trump's war communication as volatile, with limited capacity to reconcile earlier and later statements into one coherent line. Reconciliation capacity is central for democratic accountability and allied coordination. Trump's low-consistency model increased both domestic dispute and external misread risk.",
  "rationale":"Rolling Stone coverage suggested Trump's war messaging lacked coherent reconciliation across statements.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["communication volatility","reconciliation capacity","coherent line","misread risk","accountability deficit"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-02","Authoritarianism","Government Power Abuse",8,6,8,7,4,4,8,10,"Trump's war communication showed volatility with weak statement reconciliation.")
},

{
  "entry_number":1536,
  "title":"Trump's Concerning-Moments Pattern Continued to Erode Perceived Fitness for High-Stakes Decisions",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's pattern reporting kept attention on recurring moments that were interpreted as fitness concerns in consequential contexts. Perceived fitness erosion is politically severe because it affects trust in discretionary power use. Trump's repeated episodes sustained this erosion rather than allowing it to fade.",
  "rationale":"Guardian's recurring-moment coverage sustained concerns about Trump's decision fitness.",
  "category":"Authoritarianism","subcategory":"Political Violence / Threats","phase":"White House 2",
  "keywords":["fitness concern","high-stakes decisions","recurring moments","trust erosion","discretionary power"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Political Violence / Threats",8,6,8,7,4,4,8,9,"Recurring concerning moments continued eroding confidence in Trump's high-stakes judgment.")
},
{
  "entry_number":1537,
  "title":"Trump's Behavioral Volatility Was Framed as an Institutional-Strain Multiplier",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's narrative implied Trump's behavioral volatility does not stay personal; it multiplies institutional strain as agencies compensate for unpredictability. Compensation costs include slower coordination and defensive process inflation. Trump's pattern therefore generated governance drag beyond immediate media controversy.",
  "rationale":"Guardian framed Trump's volatility as a force multiplier for institutional strain.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["institutional strain","behavioral volatility","coordination slowdown","process inflation","governance drag"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's volatility was treated as an ongoing strain multiplier on institutions.")
},
{
  "entry_number":1538,
  "title":"Trump's Recurrent Public Misfires Strengthened Arguments for Tighter Decision Gatekeeping",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurring-case framing supported calls for tighter gatekeeping around executive decision pathways. Gatekeeping arguments become stronger when incidents are repetitive and consequential. Trump's misfire pattern added weight to proposals that reduce unilateral volatility risk.",
  "rationale":"Guardian's recurrence framing increased support for tighter executive gatekeeping around Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["decision gatekeeping","recurring misfire","unilateral risk","executive pathway","institutional safeguard"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's repeated misfires strengthened calls for tighter executive gatekeeping.")
},
{
  "entry_number":1539,
  "title":"Trump's 'Concerning Moments' Archive Became a Reusable Credibility Benchmark Against New Claims",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's archive-style presentation created a benchmark that observers could reuse when evaluating fresh Trump claims. Reusable benchmarks are powerful because they compress prior volatility into current credibility judgments. Trump's new statements were increasingly judged through this accumulated lens.",
  "rationale":"Guardian's archived incidents became a standing benchmark for judging Trump's credibility.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["reusable benchmark","credibility lens","incident archive","claim evaluation","accumulated volatility"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,9,"Guardian's incident archive became a standing credibility benchmark for Trump claims.")
},
{
  "entry_number":1540,
  "title":"Trump's Fitness Debate Persisted Because Pattern Evidence Outlasted Daily News Churn",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Pattern evidence from repeated incidents tends to outlast day-to-day media churn, and Guardian's compilation reinforced that durability. Durable pattern evidence keeps debates active even when attention shifts temporarily. Trump's fitness debate persisted because recurrence prevented narrative reset.",
  "rationale":"Guardian's pattern evidence kept Trump's fitness debate active beyond normal news cycles.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["pattern durability","news churn","fitness debate","narrative reset failure","recurrence evidence"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,9,"Recurrence evidence kept Trump's fitness debate alive despite news-cycle churn.")
},

{
  "entry_number":1541,
  "title":"Trump's Epstein Exposure Stayed Active as NPR Kept Allegations and Records in the Same Frame",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's framing kept allegations adjacent to document context, which prevents easy separation between claim and evidentiary discussion. This adjacency sustains scrutiny because updates in one lane refresh the other. Trump's Epstein exposure remained active as a linked narrative rather than isolated accusation fragments.",
  "rationale":"NPR's integrated framing kept Trump Epstein scrutiny active and cross-reinforcing.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["integrated framing","linked scrutiny","allegation-document adjacency","cross-reinforcing narrative","active exposure"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR kept allegations and records linked, sustaining active Trump Epstein exposure.")
},
{
  "entry_number":1542,
  "title":"Trump's Epstein Defense Faced a Timeline Problem as NPR Emphasized Chronology",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"Chronology emphasis in NPR coverage increased pressure on Trump's defense because timeline consistency is testable and cumulative. Timeline problems rarely disappear through messaging volume once dates and documents are public. Trump's defense posture encountered that structural challenge directly.",
  "rationale":"NPR chronology emphasis increased consistency pressure on Trump's Epstein defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["timeline consistency","chronology pressure","testable sequence","documented dates","defense challenge"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR's chronology focus exposed timeline-consistency pressure on Trump defenses.")
},
{
  "entry_number":1543,
  "title":"Trump's Epstein Narrative Lost Reset Capacity Under NPR's Evidence-Linked Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"Evidence-linked coverage reduces reset capacity because each new statement can be checked against archived material. NPR's approach reinforced this by foregrounding context and continuity. Trump's narrative reset attempts faced diminishing returns in a cross-referenced information environment.",
  "rationale":"NPR's evidence-linked method reduced Trump's ability to reset the Epstein narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["reset capacity","cross-referenced environment","context continuity","archived material","diminishing returns"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Evidence-linked NPR coverage reduced Trump's Epstein narrative reset capacity.")
},
{
  "entry_number":1544,
  "title":"Trump's Epstein Messaging Entered a Higher-Cost Fact-Check Zone",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's reporting context raised the cost of loose messaging by shifting audience expectations toward source-backed specificity. In higher-cost fact-check zones, broad rhetorical denial performs poorly against cited details. Trump's messaging strategy therefore faced a less forgiving verification climate.",
  "rationale":"NPR context raised verification standards confronting Trump's Epstein-related messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["higher-cost fact-check","source-backed specificity","verification climate","broad denial limits","audience expectation"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR's context pushed Trump's Epstein messaging into a stricter fact-check environment.")
},
{
  "entry_number":1545,
  "title":"Trump's Epstein Risk Profile Stayed Elevated Because NPR Framed It as Ongoing, Not Closed",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's treatment signaled an ongoing file-and-claims process rather than a closed chapter, preserving political and reputational volatility. Ongoing framing keeps institutions and audiences attentive to incremental disclosures. Trump's risk profile remained elevated because closure cues were weak and contestation persisted.",
  "rationale":"NPR's ongoing-process framing kept Trump's Epstein risk profile elevated.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["ongoing process","closure cues","incremental disclosure","risk profile","persistent contestation"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's ongoing framing sustained elevated Epstein-related risk around Trump.")
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
