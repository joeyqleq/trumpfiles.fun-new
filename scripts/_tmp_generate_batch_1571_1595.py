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
SRC5_URL="https://apnews.com/projects/trump-campaign-promise-tracker/"
SRC5_TITLE="AP tracker: what Trump promised and what he has delivered"

entries=[
{
  "entry_number":1571,
  "title":"Trump's Iran Runway Again Showed Acceleration Outpacing Deliberative Oversight",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's timeline framing reinforced a pattern in Trump's Iran decision cycle: acceleration moved faster than normal institutional deliberation. Fast tempo can look decisive, but it compresses challenge windows and limits corrective feedback. Trump's runway prioritized motion over consensus durability.",
  "rationale":"AP timeline showed Trump's acceleration pacing beyond deliberative oversight capacity.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["acceleration runway","oversight compression","challenge window","corrective feedback","consensus durability"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump's Iran timeline again showed acceleration outpacing institutional oversight.")
},
{
  "entry_number":1572,
  "title":"Trump's Pre-Strike Sequence Reduced Public Visibility Into Decision Checkpoints",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's chronology raised visibility concerns about which checkpoints were cleared before force authorization. Low visibility in high-risk decisions weakens public trust and complicates accountability review. Trump's sequencing left critical process questions harder to audit in real time.",
  "rationale":"AP chronology suggested limited public visibility into Trump's pre-strike checkpoints.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["decision checkpoints","public visibility","real-time audit","process questions","trust erosion"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Trump's pre-strike sequencing left key accountability checkpoints less visible.")
},
{
  "entry_number":1573,
  "title":"Trump's Iran Escalation Messaging Used Urgency as a Substitute for Full Public Justification",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's reconstruction suggested urgency language carried outsized weight in Trump's escalation messaging. Urgency can explain timing, but it cannot replace detailed justification of assumptions and risk thresholds. Trump's framing leaned on speed while leaving durable justification disputes behind.",
  "rationale":"AP reconstruction indicated Trump leaned heavily on urgency framing over detailed justification.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["urgency framing","risk threshold","justification dispute","speed narrative","assumption gap"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump used urgency framing while leaving core escalation assumptions underexplained.")
},
{
  "entry_number":1574,
  "title":"Trump's Decision Tempo Favored Loyal Alignment Over Open Internal Friction",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's sequencing pattern implied that internal actors were rewarded for alignment with tempo rather than procedural friction. In crisis governance, reduced friction can speed execution but increase unforced-error risk. Trump's tempo-centric model kept this tradeoff active.",
  "rationale":"AP sequence implied Trump's decision tempo discouraged internal friction and challenge.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["tempo-centric model","internal friction","loyal alignment","unforced-error risk","challenge suppression"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's tempo-focused approach appeared to disincentivize internal procedural challenge.")
},
{
  "entry_number":1575,
  "title":"Trump's Iran Timeline Reinforced Perception of Strategy-by-Momentum",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's lead-up account again supported a strategy-by-momentum perception, where movement itself became argument. Momentum can create tactical advantage, but it can also obscure whether objectives were stable and reviewable. Trump's method amplified that ambiguity.",
  "rationale":"AP lead-up account reinforced momentum-first perception in Trump's Iran strategy.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["strategy-by-momentum","objective stability","reviewability","tactical advantage","ambiguity"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's Iran timeline reinforced a momentum-first strategic profile.")
},

{
  "entry_number":1576,
  "title":"Trump's Iran Statements Continued to Diverge Across Legal and Strategic Frames",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's in-their-words comparison showed Trump's camp sustaining divergent explanations for the same operation. Divergent framing raises legal ambiguity and weakens strategic signaling to allies and adversaries. Trump's message discipline remained unstable.",
  "rationale":"AP comparison showed ongoing divergence in Trump's legal-strategic Iran framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["divergent framing","legal ambiguity","strategic signaling","message discipline","operation narrative"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Trump's Iran framing remained internally divergent across legal and strategic lines.")
},
{
  "entry_number":1577,
  "title":"Trump's Post-Action Messaging Shifted Benchmarks Before Oversight Could Stabilize",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's progression suggested benchmark drift after action, where objectives and tone shifted quickly. Oversight depends on stable reference points; drift turns review into moving-target analysis. Trump's shifts increased accountability friction.",
  "rationale":"AP's statement progression indicated benchmark drift in Trump's post-action messaging.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["benchmark drift","moving-target oversight","post-action shift","accountability friction","reference instability"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Trump's shifting post-action benchmarks complicated oversight stabilization.")
},
{
  "entry_number":1578,
  "title":"Trump's Conflicting Iran Language Increased Allied Coordination Costs",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's side-by-side record implied partners had to choose which Trump signal to operationalize, increasing coordination costs. In crisis settings, signal inconsistency creates hedging behavior and planning drag. Trump's language volatility made alignment harder.",
  "rationale":"AP's side-by-side record pointed to coordination drag from Trump's conflicting language.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["coordination cost","signal inconsistency","ally hedging","planning drag","language volatility"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Trump's conflicting Iran language increased coordination drag for partners.")
},
{
  "entry_number":1579,
  "title":"Trump's Iran Narrative Plasticity Reduced Long-Term Accountability Clarity",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's mapped statements showed narrative plasticity strong enough to support competing retrospective interpretations. Plasticity can protect short-term politics, but it degrades long-term accountability clarity. Trump's public record became easier to spin and harder to settle.",
  "rationale":"AP mapping showed Trump narrative plasticity weakening long-term accountability clarity.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative plasticity","retrospective spin","accountability clarity","public record","interpretation conflict"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's narrative plasticity weakened clarity for later accountability review.")
},
{
  "entry_number":1580,
  "title":"Trump's Competing Iran Explanations Kept Credibility Risk Elevated",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"As AP documented competing explanations, each new statement risked conflicting with prior framing. Repeated tension between versions raises cumulative credibility costs. Trump's credibility risk stayed elevated because the explanatory line never fully converged.",
  "rationale":"AP documented competing explanations that sustained high credibility risk for Trump.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["competing explanations","credibility cost","version tension","cumulative risk","message convergence"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Competing Iran explanations kept Trump's credibility risk persistently high.")
},

{
  "entry_number":1581,
  "title":"Trump's Epstein-FBI Conflict Narrative Stayed Active Under Guardian's Coverage",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's reporting kept attention on unresolved tensions between Trump-aligned claims and FBI-related disclosure expectations. Ongoing institutional conflict prolongs scrutiny and resists narrative closure. Trump's exposure remained active because the conflict frame persisted.",
  "rationale":"Guardian coverage sustained active conflict framing around Trump's Epstein-FBI tensions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["epstein-fbi conflict","institutional tension","active scrutiny","closure resistance","exposure persistence"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian's conflict framing kept Trump's Epstein-FBI exposure active.")
},
{
  "entry_number":1582,
  "title":"Trump's Epstein Messaging Faced Structural Drag From Unresolved FBI Disclosure Questions",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's update suggested unresolved disclosure questions acted as structural drag on Trump's messaging strategy. Structural drag matters because it slows narrative reset and keeps audiences in verification mode. Trump's line remained under pressure from unresolved procedural signals.",
  "rationale":"Guardian indicated unresolved disclosure questions kept drag on Trump's Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["structural drag","unresolved questions","verification mode","narrative reset","procedural signal"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Unresolved FBI disclosure questions created structural drag on Trump's Epstein narrative.")
},
{
  "entry_number":1583,
  "title":"Trump's Epstein Transparency Claims Remained Vulnerable to Document-Access Friction",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's coverage highlighted how document-access friction can erode trust in transparency claims regardless of rhetorical certainty. Access mechanics often outweigh speeches in public accountability judgments. Trump's transparency claims remained vulnerable on that axis.",
  "rationale":"Guardian highlighted document-access friction undermining Trump's transparency claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["document-access friction","transparency claim","access mechanics","public accountability","trust vulnerability"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Document-access friction kept Trump's transparency claims vulnerable.")
},
{
  "entry_number":1584,
  "title":"Trump's Epstein Strategy Encountered Recurring Institutional Pushback",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's reporting implied institutional pushback remained recurrent rather than episodic, reducing Trump's ability to frame the issue as settled. Recurrence drives durability in political risk. Trump's strategy continued to absorb this recurring resistance.",
  "rationale":"Guardian implied recurring institutional pushback against Trump's Epstein narrative strategy.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["recurring pushback","institutional resistance","risk durability","issue settlement","strategic friction"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Election Interference","Democratic Institution Undermining",7,7,8,7,3,3,8,10,"Recurring institutional pushback limited Trump's ability to settle Epstein-related controversy.")
},
{
  "entry_number":1585,
  "title":"Trump's Epstein Exposure Stayed High Because Conflict Signals Never Fully Cleared",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's conflict signals indicated no full clearance point in the disclosure dispute, keeping Trump's exposure baseline elevated. Without a clear resolution marker, attention and skepticism persist. Trump's risk remained in a chronic rather than acute state.",
  "rationale":"Guardian conflict signals showed no clear resolution point, keeping Trump's exposure elevated.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["conflict signal","no resolution marker","chronic exposure","skepticism persistence","elevated baseline"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"No clear resolution point kept Trump's Epstein exposure in a chronic high-risk state.")
},

{
  "entry_number":1586,
  "title":"Trump-Era Epstein File Disappearances Stayed a Quantified Integrity Risk",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's reporting on missing DOJ webpage files kept a quantified integrity risk in view for Trump-era disclosure governance. Quantified losses are durable because they can be tracked over time and revisited in oversight debates. Trump's transparency posture remained damaged by measurable gaps.",
  "rationale":"AP's quantified missing-file report sustained integrity risk in Trump-era disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["quantified loss","integrity risk","doj webpage","measurable gap","oversight debate"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's quantified file-loss evidence kept integrity concerns active around Trump-era disclosures.")
},
{
  "entry_number":1587,
  "title":"Trump's Full-Disclosure Narrative Continued to Clash With AP's Missing-File Count",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's countable missing-file evidence created a persistent clash with claims of complete transparency. Countable evidence is difficult to absorb through broad denial because it invites direct repetition and verification. Trump's full-disclosure narrative remained under measurable strain.",
  "rationale":"AP's missing-file count kept direct pressure on Trump's full-disclosure claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["full disclosure clash","missing-file count","measurable strain","repeatable evidence","verification pressure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"AP's missing-file count continued to strain Trump's full-disclosure narrative.")
},
{
  "entry_number":1588,
  "title":"Trump's Epstein Archive Handling Faced Ongoing Chain-of-Custody Suspicion",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"Once AP documented disappearances, chain-of-custody concerns became central to how Trump's disclosure environment was judged. Chain-of-custody suspicion is hard to neutralize without transparent forensic accounting. Trump's archive handling remained vulnerable on integrity grounds.",
  "rationale":"AP disappearances elevated chain-of-custody suspicion in Trump-era archive handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain of custody","archive handling","forensic accounting","integrity grounds","disclosure vulnerability"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's disappearance report sustained chain-of-custody suspicion around Trump's disclosure environment.")
},
{
  "entry_number":1589,
  "title":"Trump's Epstein Messaging Incurred Long-Tail Credibility Loss From Document Gaps",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantified gap made credibility damage long-tail because measured anomalies persist beyond immediate news cycles. Long-tail damage is politically costly since each new disclosure revives prior gap evidence. Trump's messaging carried that cumulative burden forward.",
  "rationale":"AP's quantified gaps produced durable long-tail credibility loss for Trump's messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["long-tail damage","document gap","cumulative burden","anomaly persistence","credibility loss"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Quantified document gaps imposed durable credibility losses on Trump's Epstein messaging.")
},
{
  "entry_number":1590,
  "title":"Trump's Disclosure-Integrity Risk Stayed Auditable Because AP Made It Quantifiable",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantification transformed diffuse suspicion into auditable risk metrics around Trump-era document handling. Auditable metrics are hard to sideline because they support repeat checks by institutions and media. Trump's integrity risk stayed visible and testable.",
  "rationale":"AP quantification kept Trump's disclosure-integrity risk auditable and persistent.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["auditable risk","quantified metric","repeat check","visibility persistence","testable integrity"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's quantification kept disclosure-integrity risks around Trump visible and auditable.")
},

{
  "entry_number":1591,
  "title":"Trump's Promise Dashboard Exposure Persisted as AP Kept Outcome States Transparent",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's project view continued to make Trump's promise outcomes transparent across policy lanes, limiting narrative resets. Transparent state tracking turns rhetoric into comparable status evidence. Trump's promise messaging remained constrained by that transparency.",
  "rationale":"AP's transparent state tracking constrained Trump's promise narrative resets.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["dashboard exposure","outcome states","transparent tracking","status evidence","narrative reset"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's transparent promise states kept pressure on Trump's narrative resets.")
},
{
  "entry_number":1592,
  "title":"Trump's Promise Claims Continued to Face Category-Level Accountability in AP Tracker",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's category-level structure made Trump's claims accountable at scale, not just case by case. Category accountability reduces cherry-picking and highlights pattern discrepancies. Trump's claim set remained vulnerable to that broader comparison.",
  "rationale":"AP's category-level tracker sustained broad accountability pressure on Trump's claims.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["category accountability","pattern discrepancy","broad comparison","anti cherry-pick","claims pressure"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's category model kept broad accountability pressure on Trump's promise claims.")
},
{
  "entry_number":1593,
  "title":"Trump's Promise Follow-Through Narrative Remained Fragile Under AP's Cross-Topic View",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Cross-topic visibility in AP's tracker made it harder for Trump's campaign-style follow-through narrative to hold uniformly. Fragility increases when outcomes vary widely across domains. Trump's uniform-success framing stayed weak under cross-topic scrutiny.",
  "rationale":"AP's cross-topic view exposed fragility in Trump's uniform follow-through narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["cross-topic view","uniform narrative fragility","domain variance","follow-through claim","scrutiny"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP's cross-topic tracker kept Trump's uniform promise-success narrative fragile.")
},
{
  "entry_number":1594,
  "title":"Trump's Promise Record Stayed Contestable Because AP Preserved Comparable Status Signals",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Comparable AP status signals allowed repeated external checks on Trump's promise record without relying on one-off interpretations. Comparable signals increase contestability discipline by grounding debate in consistent labels. Trump's record remained open to structured challenge.",
  "rationale":"AP's consistent status signals preserved structured contestability of Trump's promise record.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["comparable signals","structured contestability","consistent labels","external check","record challenge"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Consistent AP labels kept Trump's promise record structurally contestable.")
},
{
  "entry_number":1595,
  "title":"Trump's Promise Messaging Continued to Lose Ground Against AP's Persistent Evidence Architecture",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's persistent evidence architecture maintained pressure on Trump's promise messaging by repeatedly pairing claim language with tracked outcomes. Persistent architecture changes incentives: claims are judged for durability, not performance. Trump's messaging continued to lose ground under repeated evidence checks.",
  "rationale":"AP's persistent evidence architecture kept eroding durability of Trump's promise messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["evidence architecture","claim durability","persistent check","outcome pairing","messaging erosion"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Persistent AP evidence checks kept eroding Trump's promise messaging durability.")
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
