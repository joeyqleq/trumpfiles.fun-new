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
SRC2_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC2_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC3_URL="https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi"
SRC3_TITLE="Trump, Epstein files, and FBI disclosure conflict"
SRC4_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC4_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"
SRC5_URL="https://www.rollingstone.com/politics/political-commentary/trump-war-iran-lies-fantasies-1235524016/"
SRC5_TITLE="Rolling Stone: Trump's Iran war claims and contradictions"

entries=[
{
  "entry_number":1621,
  "title":"Trump's Promise Ledger Stayed Under Pressure as AP Maintained Public Status Transparency",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's promise tracker continued to apply pressure by preserving transparent status categories across domains. Transparent ledgers reduce room for rhetorical drift and keep unresolved claims visible. Trump's promise narrative stayed exposed to persistent comparison.",
  "rationale":"AP's transparent ledger kept ongoing pressure on Trump's promise narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["promise ledger","status transparency","persistent comparison","rhetorical drift","unresolved visibility"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's transparent tracker kept sustained pressure on Trump's promise ledger.")
},
{
  "entry_number":1622,
  "title":"Trump's Promise Messaging Continued to Face Category-Level Accountability",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's categorized outcomes kept Trump's promise messaging accountable at scale rather than one anecdote at a time. Category-level accountability is harder to evade because patterns become explicit. Trump's claims remained vulnerable under this structure.",
  "rationale":"AP categories maintained broad pattern accountability on Trump's promise messaging.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["category accountability","pattern explicitness","scale review","claim vulnerability","structured outcomes"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP categories kept Trump promise claims exposed to pattern-level accountability.")
},
{
  "entry_number":1623,
  "title":"Trump's Uniform-Success Claim Stayed Fragile Under AP's Cross-Topic View",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Cross-topic tracking in AP's project continued to challenge Trump's uniform-success framing by surfacing domain variation. When variation is explicit, blanket success claims weaken quickly. Trump's line stayed fragile under cross-topic scrutiny.",
  "rationale":"AP cross-topic variation kept weakening Trump's uniform-success framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["uniform-success claim","cross-topic variation","blanket framing","domain scrutiny","claim fragility"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Cross-topic AP tracking kept Trump's uniform-success claim fragile.")
},
{
  "entry_number":1624,
  "title":"Trump's Promise Record Remained Easy to Audit Through AP's Persistent Dashboard",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The AP dashboard format preserved a reusable audit path for Trump's promise record across repeated news cycles. Reusable audits reduce narrative reset opportunities and anchor debate in stable references. Trump's record stayed easy to test.",
  "rationale":"AP dashboard kept Trump's promise record continuously auditable.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent dashboard","reusable audit","stable reference","narrative reset","continuous testing"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP dashboard design kept Trump's promise record easy to audit repeatedly.")
},
{
  "entry_number":1625,
  "title":"Trump's Delivery Story Continued to Lose Ground Against AP's Structured Evidence",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's structured evidence continued to pull Trump's delivery story toward measurable outcomes rather than rhetorical emphasis. Structured evidence rewards consistency and penalizes overstatement. Trump's delivery narrative kept losing ground in that frame.",
  "rationale":"AP structured evidence kept eroding Trump's delivery narrative advantage.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["structured evidence","delivery story","measurable outcome","overstatement penalty","consistency reward"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP's structured evidence kept reducing credibility of Trump's delivery storyline.")
},

{
  "entry_number":1626,
  "title":"Trump's Epstein Exposure Stayed Active Under NPR's Claims-and-Documents Frame",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's integrated framing kept Trump's Epstein exposure politically active by pairing claims with document context. Integrated framing prevents easy compartmentalization and sustains scrutiny. Trump's exposure remained persistent rather than episodic.",
  "rationale":"NPR's integrated frame kept Trump Epstein scrutiny active and persistent.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["claims-documents frame","active exposure","compartmentalization failure","persistent scrutiny","epstein context"],
  "metrics_key":"epstein","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's integrated frame kept Trump's Epstein exposure persistently active.")
},
{
  "entry_number":1627,
  "title":"Trump's Epstein Defense Continued to Face Timeline-Based Stress in NPR Reporting",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"Chronology emphasis in NPR's reporting kept stress on Trump's defense consistency across dates and records. Timeline stress compounds with each additional reference point. Trump's defense remained vulnerable to that compounding effect.",
  "rationale":"NPR chronology emphasis sustained compounding stress on Trump's Epstein defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["timeline stress","chronology emphasis","defense consistency","compounding references","record alignment"],
  "metrics_key":"epstein","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR chronology kept compounding consistency stress on Trump's Epstein defense.")
},
{
  "entry_number":1628,
  "title":"Trump's Epstein Narrative Flexibility Continued to Shrink in NPR's Evidence-Centered Context",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"Evidence-centered context in NPR reporting reduced Trump's ability to pivot messaging without contradiction risk. Reduced flexibility increases narrative fragility over time. Trump's Epstein line stayed constrained.",
  "rationale":"NPR evidence-centered context kept constraining Trump's narrative flexibility.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative flexibility","evidence-centered","pivot risk","fragility over time","context constraint"],
  "metrics_key":"epstein","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Evidence-centered NPR context kept constraining flexibility in Trump's Epstein narrative.")
},
{
  "entry_number":1629,
  "title":"Trump's Epstein Messaging Stayed Trapped in a Persistent NPR Audit Loop",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's iterative coverage continued creating an audit loop where Trump's new claims were checked against prior references. Audit loops preserve institutional memory and reduce reset tactics. Trump's messaging remained trapped in that loop.",
  "rationale":"NPR iterative coverage sustained an audit loop around Trump's Epstein messaging.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["audit loop","iterative coverage","institutional memory","reset tactic","claim cross-check"],
  "metrics_key":"epstein","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's iterative format kept Trump's Epstein messaging in a persistent audit loop.")
},
{
  "entry_number":1630,
  "title":"Trump's Epstein Risk Baseline Stayed Elevated Under NPR's Ongoing-Process Framing",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's ongoing-process framing maintained a high risk baseline around Trump's Epstein exposure by signaling unresolved status. Ongoing frames keep attention and skepticism durable. Trump's risk baseline stayed elevated.",
  "rationale":"NPR ongoing-process framing sustained elevated baseline risk for Trump's Epstein exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["ongoing process","elevated baseline","durable skepticism","unresolved status","attention persistence"],
  "metrics_key":"epstein","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's ongoing framing kept Trump's Epstein risk baseline persistently elevated.")
},

{
  "entry_number":1631,
  "title":"Trump's Epstein-FBI Tension Continued as Guardian Framed Disclosure Conflict as Unresolved",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's reporting kept the Trump-Epstein disclosure conflict in unresolved territory, sustaining institutional tension. Unresolved conflict prevents narrative stabilization and keeps accountability pressure alive. Trump's exposure remained structurally active.",
  "rationale":"Guardian unresolved framing sustained structural pressure in Trump-Epstein disclosure conflict.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["unresolved conflict","institutional tension","narrative stabilization","structural pressure","disclosure dispute"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian's unresolved conflict framing kept structural pressure on Trump Epstein disclosures.")
},
{
  "entry_number":1632,
  "title":"Trump's Epstein Messaging Continued to Absorb Drag From FBI Disclosure Ambiguity",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's account suggested disclosure ambiguity continued adding drag to Trump's messaging. Ambiguity drag weakens closure attempts and extends public scrutiny windows. Trump's narrative remained slow to stabilize.",
  "rationale":"Guardian suggested disclosure ambiguity remained a drag on Trump's Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["ambiguity drag","closure failure","scrutiny window","narrative stabilization","disclosure ambiguity"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Disclosure ambiguity continued adding drag to Trump's Epstein messaging stability.")
},
{
  "entry_number":1633,
  "title":"Trump's Transparency Claims Stayed Vulnerable Under Guardian's Access-Friction Focus",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's focus on access friction kept Trump's transparency claims vulnerable to procedural criticism. Access mechanics frequently decide credibility more than rhetoric. Trump's transparency framing remained exposed.",
  "rationale":"Guardian access-friction focus sustained procedural vulnerability in Trump's transparency claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["access friction","procedural vulnerability","transparency claim","credibility mechanics","exposure"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Access-friction focus in Guardian coverage kept Trump's transparency claims vulnerable.")
},
{
  "entry_number":1634,
  "title":"Trump's Epstein Strategy Continued to Face Recurring Institutional Resistance",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's recurrence pattern implied institutional resistance remained ongoing rather than one-time. Recurrence shifts the issue from scandal spike to governance condition. Trump's strategy continued to face resistance costs.",
  "rationale":"Guardian recurrence pattern showed ongoing institutional resistance to Trump's Epstein strategy.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["recurring resistance","governance condition","strategy cost","institutional recurrence","scandal durability"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Election Interference","Democratic Institution Undermining",7,7,8,7,3,3,8,10,"Recurring institutional resistance kept increasing costs for Trump's Epstein strategy.")
},
{
  "entry_number":1635,
  "title":"Trump's Epstein Exposure Remained Chronically Elevated Without a Clear Resolution Marker",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's unresolved signal suggested no clear resolution marker in the disclosure conflict, keeping Trump's exposure chronically elevated. Chronic exposure creates cumulative reputational strain. Trump's risk remained persistent.",
  "rationale":"Guardian signals indicated chronic high exposure around Trump absent resolution markers.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chronic exposure","resolution marker","cumulative strain","persistent risk","unresolved signal"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Without clear resolution markers, Trump's Epstein exposure stayed chronically elevated.")
},

{
  "entry_number":1636,
  "title":"Trump-Era Missing-File Count Continued to Anchor Epstein Integrity Concerns",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file count remained a reference anchor for integrity concerns in Trump-era Epstein disclosures. Anchored metrics preserve scrutiny across cycles because they are easy to revisit. Trump's integrity posture stayed under quantified pressure.",
  "rationale":"AP missing-file count remained a persistent integrity anchor in Trump-era disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["missing-file anchor","integrity concern","quantified pressure","reference metric","cycle persistence"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's missing-file metric continued anchoring integrity concerns around Trump-era disclosures.")
},
{
  "entry_number":1637,
  "title":"Trump's Full-Transparency Narrative Stayed Exposed to AP's Countable Gap Evidence",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"Countable gap evidence in AP coverage continued to expose Trump's full-transparency narrative to straightforward contradiction. Countability makes disputes harder to blur. Trump's narrative remained exposed.",
  "rationale":"AP countable gaps continued to contradict Trump's full-transparency narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["countable gap","full transparency","straight contradiction","dispute clarity","narrative exposure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"AP's countable gap evidence kept contradicting Trump's full-transparency claims.")
},
{
  "entry_number":1638,
  "title":"Trump's Epstein Archive Handling Continued to Carry Chain-of-Custody Doubt",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file report sustained chain-of-custody doubt around Trump-era archive handling. Chain-of-custody doubt persists without transparent reconstruction. Trump's archive credibility remained fragile.",
  "rationale":"AP report sustained chain-of-custody doubt around Trump-era archive handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain-of-custody doubt","archive credibility","transparent reconstruction","handling fragility","missing-file report"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Chain-of-custody doubts remained unresolved in Trump-era Epstein archive handling.")
},
{
  "entry_number":1639,
  "title":"Trump's Epstein Messaging Continued to Accrue Long-Tail Damage From Quantified Gaps",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantified gaps continued to generate long-tail messaging damage because they recur in each new debate wave. Long-tail damage accumulates even without new allegations. Trump's messaging burden stayed cumulative.",
  "rationale":"AP quantified gaps kept generating cumulative long-tail messaging damage for Trump.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["long-tail damage","quantified gap","cumulative burden","debate wave","messaging accrual"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Quantified gaps kept adding long-tail credibility damage to Trump's Epstein messaging.")
},
{
  "entry_number":1640,
  "title":"Trump's Disclosure-Integrity Exposure Remained Auditable Through AP's Missing-File Metric",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's metric continued to make disclosure-integrity exposure auditable in a repeatable way. Auditable exposure is difficult to bury because institutions can reuse the same measurement frame. Trump's disclosure-integrity risk remained visible.",
  "rationale":"AP metric kept Trump's disclosure-integrity exposure visibly auditable.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["auditable exposure","measurement frame","repeatable metric","integrity visibility","institutional reuse"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's repeatable metric kept disclosure-integrity risk around Trump visibly auditable.")
},

{
  "entry_number":1641,
  "title":"Trump's Iran War Narrative Continued to Face Contradiction-Driven Scrutiny",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone's contradiction-oriented framing kept Trump's Iran war narrative under high skepticism. Contradiction-driven scrutiny is sticky because each new statement is judged against prior claims. Trump's narrative remained high-risk in that frame.",
  "rationale":"Rolling Stone contradiction framing sustained high skepticism around Trump's Iran narrative.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["contradiction scrutiny","iran narrative","skepticism frame","claim history","high-risk messaging"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,4,4,8,10,"Contradiction-oriented scrutiny kept Trump's Iran narrative in high-risk territory.")
},
{
  "entry_number":1642,
  "title":"Trump's Iran Messaging Drift Continued to Undermine Strategic Coherence",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone's analysis continued to frame Trump's Iran messaging as drifting under pressure. Messaging drift weakens strategic coherence for allies and domestic institutions alike. Trump's coherence deficit stayed visible.",
  "rationale":"Rolling Stone framed ongoing drift in Trump's Iran messaging as coherence risk.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["messaging drift","strategic coherence","pressure response","coherence deficit","allied signal"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Ongoing drift in Trump's Iran messaging continued to undermine strategic coherence.")
},
{
  "entry_number":1643,
  "title":"Trump's Iran Claims Continued to Be Framed as High-Rhetoric, Low-Reconciliation",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Critical coverage kept framing Trump's Iran claims as rhetorically forceful but difficult to reconcile across statements. Low reconciliation capacity increases future contradiction risk. Trump's communication profile remained vulnerable.",
  "rationale":"Rolling Stone framing stressed weak reconciliation across Trump's Iran claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["high rhetoric","low reconciliation","contradiction risk","statement mismatch","communication profile"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Critical framing emphasized weak reconciliation in Trump's Iran claims.")
},
{
  "entry_number":1644,
  "title":"Trump's Iran Escalation Case Continued to Absorb Skepticism Cascades",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone's contradiction focus contributed to skepticism cascades where later claims were discounted preemptively. Cascades reduce policy persuasiveness even when later claims are accurate. Trump's escalation case remained caught in that dynamic.",
  "rationale":"Rolling Stone contradiction focus sustained skepticism cascades around Trump's escalation case.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["skepticism cascade","preemptive discount","policy persuasiveness","escalation case","contradiction focus"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Skepticism cascades kept reducing persuasiveness of Trump's Iran escalation claims.")
},
{
  "entry_number":1645,
  "title":"Trump's War Communication Continued to Show Volatility With Limited Accountability Convergence",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone's perspective kept highlighting volatility in Trump's war communication and weak convergence toward one accountable narrative. Weak convergence prolongs oversight disputes and public distrust. Trump's war messaging stayed in that unstable zone.",
  "rationale":"Rolling Stone highlighted volatility and weak convergence in Trump's war communication.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["communication volatility","accountability convergence","oversight dispute","public distrust","unstable zone"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,6,8,7,4,4,8,10,"Trump's war communication remained volatile with weak accountability convergence.")
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
