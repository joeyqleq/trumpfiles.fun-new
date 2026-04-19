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
    if (d.month,d.day)<(birth_date.month,birth_date.day): a-=1
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
SRC3_URL="https://apnews.com/article/0ace82ca68846109fbf6d30439e6f0f1"
SRC3_TITLE="Minnesota launches investigation that could bring charges against federal immigration officers"
SRC4_URL="https://apnews.com/article/cc2ace8576e59d10034e7e525737539d"
SRC4_TITLE="Federal court rejects Trump administration attempt to slow tariff refund process"
SRC5_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC5_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"

entries=[
{
  "entry_number":1446,
  "title":"Trump's Iran Decision Cycle Compressed Diplomacy and Military Action Into the Same Political Window",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's chronology showed Trump collapsing negotiation doubt and strike execution into a tightly packed sequence. Compression can project decisiveness, but it also limits institutional feedback loops that would normally test assumptions before force is used. Under Trump's style, the speed itself became part of the strategic risk profile.",
  "rationale":"AP timeline showed Trump compressing diplomacy and strike execution into one rapid cycle.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["compressed cycle","diplomacy to force","institutional feedback","rapid sequence","risk profile"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump compressed negotiation and strike action into a single rapid political window.")
},
{
  "entry_number":1447,
  "title":"Trump's Pre-Strike Timeline Suggested Oversight Was Running Behind Executive Momentum",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's lead-up reporting implied executive momentum moved faster than normal oversight pathways could respond. In conflict governance, this timing gap can create a legitimacy deficit even when leaders claim urgency. Trump's acceleration again pushed process resilience to the edge.",
  "rationale":"AP chronology suggested oversight lagged Trump's strike momentum.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["oversight lag","executive momentum","legitimacy deficit","urgency claim","process resilience"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's fast strike timeline outpaced normal oversight response capacity.")
},
{
  "entry_number":1448,
  "title":"Trump's Iran Escalation Runway Was Built Through Repeated Public Doubt About Talks",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's timeline showed skepticism messaging was not incidental; it helped lay rhetorical groundwork for later force decisions. Repeated doubt framing can normalize escalation by making alternatives appear exhausted before they are demonstrably exhausted. Trump's communication sequence followed that arc.",
  "rationale":"AP timeline linked Trump's repeated skepticism messaging to escalation preparation.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["skepticism messaging","escalation runway","talk exhaustion","rhetorical groundwork","normalization"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's repeated public doubts helped prepare political ground for force escalation.")
},
{
  "entry_number":1449,
  "title":"Trump's Strike Lead-Up Reflected a Decision Style That Prioritized Surprise Over Broad Deliberation",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's chronology emphasized speed, controlled environments and fast transition points before military action. Surprise can be militarily advantageous, but democratic systems require enough deliberation to maintain accountability legitimacy. Trump's preference leaned toward operational tempo over deliberative breadth.",
  "rationale":"AP lead-up details showed Trump's preference for speed and surprise over broad deliberation.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["decision style","surprise","deliberative breadth","operational tempo","accountability"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's pre-strike method prioritized tempo and surprise over wider deliberation.")
},
{
  "entry_number":1450,
  "title":"Trump's Iran Chronology Reinforced Perceptions of Strategy-by-Acceleration Rather Than Strategy-by-Consensus",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's reconstruction gave a clear impression of acceleration as method. Consensus-building and institutional buy-in appeared secondary to executive sequencing. Under Trump, this pattern repeatedly trades short-term decisiveness for longer-term trust strain.",
  "rationale":"AP chronology reinforced a Trump pattern of acceleration over consensus in high-stakes decisions.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["strategy by acceleration","strategy by consensus","executive sequencing","trust strain","decisiveness"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's timeline suggested acceleration-first strategy with weaker consensus foundations.")
},

{
  "entry_number":1451,
  "title":"Trump's Iran Team Gave Conflicting Legal and Strategic Rationales for the Same Operation",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's 'In Their Words' record captured competing explanations that implied different legal thresholds and policy goals. Such divergence is high-risk in wartime because oversight, allies and markets rely on coherent intent signals. Trump's operation was therefore judged through contradictory official narratives.",
  "rationale":"AP comparison showed Trump's team offering incompatible legal-strategic explanations.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["conflicting legal basis","strategic rationale","intent signals","official divergence","wartime narrative"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Trump's team delivered incompatible explanations for a single Iran operation.")
},
{
  "entry_number":1452,
  "title":"Trump's Post-Strike Messaging Shifted Fast Enough to Blur Original Mission Boundaries",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP showed a rapid evolution in public language after strikes, where boundary claims moved as political needs changed. Mission fluidity can preserve tactical room, but it also weakens accountability because evaluators cannot hold a stable baseline. Trump's narrative pace outstripped verification pace.",
  "rationale":"AP documented Trump messaging shifts that blurred mission boundaries after strikes.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["post-strike shift","mission boundaries","baseline drift","verification pace","narrative pace"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's post-strike narrative shifts blurred operational boundary accountability.")
},
{
  "entry_number":1453,
  "title":"Trump's Contradictory Iran Messaging Increased Coordination Costs for Allies and Institutions",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"As AP comparisons showed, mismatched official messaging imposes coordination costs: partners must choose which version to plan against. In crisis environments, that uncertainty creates drag and raises error risk. Trump's communication style converted narrative flexibility into operational friction.",
  "rationale":"AP conflicts in Trump messaging imposed planning and coordination friction.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["coordination costs","ally planning","institutional friction","uncertainty drag","message conflict"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Conflicting Trump statements increased allied and institutional coordination risk.")
},
{
  "entry_number":1454,
  "title":"Trump's Competing Statements Raised the Risk of Post-Conflict Accountability Disputes",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's side-by-side narrative suggests future accountability battles will hinge on which stated objective is treated as authoritative. When objectives shift in public, retrospective evaluation becomes contested terrain. Trump's communication volatility therefore has downstream legal and political implications.",
  "rationale":"AP's statement contrasts foreshadowed future accountability conflicts over Trump's declared objectives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["post-conflict disputes","objective authority","retrospective evaluation","communication volatility","downstream implications"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Competing Trump objectives increased future accountability dispute risk.")
},
{
  "entry_number":1455,
  "title":"Trump's Iran Messaging Volatility Weakened Deterrence Credibility by Sending Multiple Intent Signals",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's 'In Their Words' mapping underscored a deterrence problem: stable deterrence needs stable intent communication. Multiple simultaneous frames can encourage adversaries to test boundaries and allies to hedge commitments. Trump's volatility made strategic signaling less reliable.",
  "rationale":"AP mapping indicated Trump's inconsistent messaging undermined stable deterrence signaling.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["deterrence credibility","intent signals","adversary testing","ally hedging","signal reliability"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's competing signals weakened coherence of deterrence communication.")
},

{
  "entry_number":1456,
  "title":"Trump's Immigration Operation Entered Criminal-Exposure Territory With Minnesota's Probe",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP reported Minnesota's investigation could lead to criminal charges against federal officers, moving Trump's immigration push into a high-liability legal zone. This shift matters because enforcement narratives can survive policy criticism, but they struggle under prosecutorial scrutiny. Trump's hardline model now faces direct evidentiary testing.",
  "rationale":"AP case moved Trump's immigration agenda into potential criminal-liability scrutiny.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["criminal exposure","Minnesota probe","federal officers","evidentiary testing","hardline model"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,7,10,"Trump's immigration operation now faces potential criminal accountability pressure.")
},
{
  "entry_number":1457,
  "title":"Trump's Enforcement Doctrine Triggered a New State-Federal Legal Flashpoint",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's reporting highlighted how local authorities can become direct counterweights when federal enforcement tactics cross legal concern thresholds. Under Trump, this creates a governance flashpoint where political command claims meet decentralized prosecutorial power. The result is institutional confrontation, not policy consensus.",
  "rationale":"AP showed Trump's enforcement doctrine producing state-federal legal confrontation.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["state-federal flashpoint","decentralized prosecutors","institutional confrontation","legal threshold","enforcement doctrine"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's enforcement escalation generated a sharp state-federal legal collision.")
},
{
  "entry_number":1458,
  "title":"Trump's Border Crackdown Now Carries Officer-Level Legal Jeopardy",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's Minnesota update put individual legal jeopardy into the center of Trump's border agenda narrative. When personnel face potential charges, the policy story shifts from abstract control claims to operational conduct standards. Trump's escalation increased the chance of this conversion.",
  "rationale":"AP investigation linked Trump's crackdown tactics to potential officer-level legal risk.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["officer liability","conduct standards","border crackdown","legal jeopardy","operational accountability"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Public Welfare Harm",8,6,8,6,3,3,7,10,"Trump's crackdown translated into potential legal jeopardy at the officer level.")
},
{
  "entry_number":1459,
  "title":"Trump's Immigration Narrative Hit a Legitimacy Wall as Investigators Examined Federal Conduct",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's coverage showed legitimacy risk rising when enforcement intensity is met by formal investigative review. Narrative control can withstand criticism, but not indefinitely when legal institutions demand evidence and procedure. Trump's immigration rhetoric met that wall in Minnesota.",
  "rationale":"AP showed investigative scrutiny constraining Trump's immigration legitimacy narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["legitimacy wall","investigative review","evidence demand","procedural scrutiny","narrative limits"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Legal scrutiny constrained Trump's ability to sustain a pure command narrative on immigration.")
},
{
  "entry_number":1460,
  "title":"Trump's Hardline Immigration Optics Faced a Measurable Accountability Test in Court-Oriented Settings",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's report pointed toward a transition from political optics to measurable legal process. In that transition, claim intensity matters less than admissible evidence and statutory interpretation. Trump's hardline communications now confront those constraints directly.",
  "rationale":"AP indicated Trump's hardline immigration messaging now faces direct legal-process testing.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["court-oriented test","admissible evidence","statutory interpretation","optics to process","hardline messaging"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's immigration optics entered a stricter evidence-and-statute accountability environment.")
},

{
  "entry_number":1461,
  "title":"Trump's Tariff Refund Delay Bid Failed, Accelerating Financial Consequences",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP reported the court rejection removed a key delay instrument the Trump administration sought to use on tariff refunds. Without that buffer, fiscal consequences arrive faster and become harder to narratively defer. Trump's trade strategy absorbed a concrete judicial constraint.",
  "rationale":"AP ruling removed Trump's key delay mechanism for tariff refund exposure.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["delay instrument","tariff refunds","judicial constraint","fiscal consequences","trade strategy"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",7,6,8,6,3,3,7,10,"Court rejection accelerated financial consequences for Trump's tariff policy.")
},
{
  "entry_number":1462,
  "title":"Trump's Court Loss on Tariff Refund Timing Increased Administrative and Political Pressure",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"As AP showed, failed delay motions create dual pressure: agencies must execute quickly while political messaging loses temporal flexibility. This dynamic weakens narratives that depend on pushing costs into later cycles. Trump's tariff defense had to operate under compressed compliance conditions.",
  "rationale":"AP decision created simultaneous administrative execution and messaging pressure on Trump's tariff policy.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["timing loss","administrative pressure","messaging pressure","compliance compression","cost deferral"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,7,10,"Trump's failed delay bid tightened both operational and political timelines.")
},
{
  "entry_number":1463,
  "title":"Trump's Tariff Authority Narrative Faced Judicial Reality as Refund Obligations Stayed on Track",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's ruling coverage highlighted a familiar split: expansive executive authority claims meeting narrower judicial process outcomes. Once courts preserve obligations, authority rhetoric has less room to mask cost pathways. Trump's tariff-case posture encountered that reality again.",
  "rationale":"AP ruling showed judicial process constraints overriding Trump's broad tariff-authority framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["authority narrative","judicial reality","refund obligations","cost pathways","process outcome"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,8,6,4,4,8,10,"Judicial outcomes constrained Trump's broad tariff-authority narrative.")
},
{
  "entry_number":1464,
  "title":"Trump's Trade Program Shifted Further From Political Slogan to Court-Managed Compliance",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's decision context underscored that late-stage trade policy success depends on enforceable compliance architecture, not just campaign-era slogans. Courts, administrators and deadlines now define the program's impact. Trump's narrative leverage narrowed as procedural control expanded.",
  "rationale":"AP context moved Trump's tariff politics deeper into court-supervised compliance territory.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["court-managed compliance","trade program","deadline control","procedural architecture","narrative leverage"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",7,6,8,6,3,3,7,10,"Trump's tariff agenda moved toward court-managed execution constraints.")
},
{
  "entry_number":1465,
  "title":"Trump's Tariff Litigation Setback Reinforced Perception of Economic Policy Whiplash",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's ruling became another node in a broader pattern of abrupt tariff assertions followed by legal correction cycles. Repeated correction loops increase uncertainty for businesses and weaken confidence in stable planning assumptions. Trump's economic posture kept producing that whiplash profile.",
  "rationale":"AP setback added to a pattern of Trump tariff whiplash and legal correction cycles.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["policy whiplash","legal correction","planning uncertainty","business confidence","tariff cycle"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",7,6,8,6,3,3,8,10,"Court loss reinforced recurring whiplash dynamics in Trump's tariff governance.")
},

{
  "entry_number":1466,
  "title":"Trump-Era DOJ Epstein Portal Lost at Least 16 Files, Exposing Structural Integrity Risks",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP reported at least 16 Epstein-related files had disappeared from a DOJ webpage. In sensitive disclosure regimes, disappearance counts are not minor metadata errors; they are integrity events that trigger chain-of-custody and version-control concerns. Under Trump's transparency claims, the losses carried outsized credibility damage.",
  "rationale":"AP disappearance count exposed structural integrity concerns in Trump-era Epstein records access.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["disappearance count","structural integrity","version control","chain of custody","credibility damage"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP-reported file disappearances raised core integrity alarms in Epstein document governance.")
},
{
  "entry_number":1467,
  "title":"Trump's Full-Disclosure Narrative Was Weakened by AP's DOJ Missing-File Findings",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's report undercut absolute transparency framing by introducing measurable file-loss evidence. In politically charged archives, measurable anomalies shift burden onto administrators to prove continuity and completeness. Trump's narrative certainty became harder to sustain against quantifiable gaps.",
  "rationale":"AP findings weakened Trump's certainty narrative around full Epstein disclosure.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["full disclosure narrative","measurable anomaly","continuity proof","completeness burden","quantifiable gaps"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Quantified file gaps undermined Trump's full-disclosure certainty claims.")
},
{
  "entry_number":1468,
  "title":"Trump's Epstein File Governance Entered a High-Suspicion Phase After Unexplained DOJ Removals",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file publication moved the issue from abstract mistrust to specific governance failure points. Even without proof of intent, unexplained removals in this context predictably elevate suspicion and demand forensic accounting. Trump's information environment magnified that suspicion curve.",
  "rationale":"AP report elevated Epstein file-governance suspicion due to specific documented removals.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["high suspicion phase","unexplained removals","forensic accounting","governance failure","suspicion curve"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Documented removals pushed Trump-era Epstein governance into a high-suspicion state.")
},
{
  "entry_number":1469,
  "title":"Trump-Era Epstein Disclosures Showed a Fragile Archive Architecture Vulnerable to Trust Collapse",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's file-loss count suggested archive architecture weaknesses with direct political consequences. In contested scandals, trust can collapse faster than systems can remediate if baseline integrity controls appear weak. Trump's broader narrative conflict made that fragility especially damaging.",
  "rationale":"AP findings indicated archive fragility that accelerated trust collapse risk in Epstein disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["archive architecture","trust collapse","integrity controls","remediation lag","disclosure fragility"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Archive fragility in Trump-era Epstein disclosures increased trust-collapse risk.")
},
{
  "entry_number":1470,
  "title":"Trump's Accountability Risk Rose as AP Made DOJ Epstein File Losses Publicly Quantifiable",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"Once AP attached a concrete number to missing records, the issue became easier for institutions and public audiences to track over time. Quantification transforms diffuse suspicion into auditable accountability pressure. Trump's exposure grew because measurable governance failures are harder to dismiss as political noise.",
  "rationale":"AP quantification of missing files increased measurable accountability pressure in Trump-era handling.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["public quantification","auditable pressure","measurable failure","accountability risk","political noise"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Quantified missing-file evidence increased accountability pressure on Trump's disclosure narrative.")
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
