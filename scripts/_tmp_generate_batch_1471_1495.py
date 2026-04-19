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
SRC3_URL="https://apnews.com/article/0ace82ca68846109fbf6d30439e6f0f1"
SRC3_TITLE="Minnesota launches investigation that could bring charges against federal immigration officers"
SRC4_URL="https://apnews.com/article/cc2ace8576e59d10034e7e525737539d"
SRC4_TITLE="Federal court rejects Trump administration attempt to slow tariff refund process"
SRC5_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC5_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"

entries=[
{
  "entry_number":1471,
  "title":"Trump Turned Negotiation Ambiguity Into an Escalation Lever Before Iran Strikes",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's reconstructed timeline showed Trump repeatedly amplifying uncertainty around diplomacy before authorizing force. That sequence matters because ambiguity can be used as an escalation lever when leaders want action while preserving rhetorical deniability. In practice, Trump made uncertainty itself part of decision architecture, compressing debate and making off-ramps harder to defend publicly.",
  "rationale":"AP chronology showed Trump converting diplomatic ambiguity into pre-strike escalation momentum.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["negotiation ambiguity","escalation lever","decision architecture","compressed debate","off-ramp erosion"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump used diplomatic ambiguity as momentum for military escalation.")
},
{
  "entry_number":1472,
  "title":"Trump's Iran Run-Up Signaled Political Timing Was Driving Security Timing",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's sequence suggested that communication beats and operational beats were moving in lockstep, with political timing often setting the pace. When political clock speed dominates security deliberation, strategic review windows shrink and institutional friction is reframed as delay. Trump's pattern again made tempo look like strength while increasing the chance of unforced strategic error.",
  "rationale":"AP timeline implied political cadence in Trump's messaging was steering security cadence.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["political timing","security timing","clock speed","review window","tempo politics"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's political tempo appeared to overtake normal security deliberation pace.")
},
{
  "entry_number":1473,
  "title":"Trump's Pre-Strike Sequencing Reduced Visibility Into Who Checked What and When",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The AP chronology raised a governance question: which institutions performed which checks before force was used, and at what depth. In high-risk military decisions, reduced visibility over validation flow weakens public trust even if officials later assert confidence. Trump's acceleration-heavy style made procedural accountability harder for outsiders to audit in real time.",
  "rationale":"AP chronology highlighted reduced procedural visibility in Trump's pre-strike process.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["procedural visibility","validation flow","real-time audit","pre-strike checks","trust erosion"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Trump's fast pre-strike sequencing obscured accountability checkpoints.")
},
{
  "entry_number":1474,
  "title":"Trump Framed Urgency as Proof While Leaving Key Escalation Assumptions Underexplained",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's lead-up reporting showed urgency messaging carrying outsized argumentative weight relative to publicly detailed assumptions. Urgency can justify action, but it does not replace rigorous explanation of risk thresholds and expected outcomes. Trump repeatedly treated speed as validation, a framing that often weakens post-hoc legitimacy once facts are contested.",
  "rationale":"AP reporting showed Trump elevating urgency language above fully explained escalation assumptions.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["urgency framing","risk thresholds","assumption gap","speed as validation","legitimacy risk"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump used urgency framing while leaving major escalation assumptions underexplained.")
},
{
  "entry_number":1475,
  "title":"Trump's Iran Decision Rhythm Rewarded Loyalty to Pace Over Loyalty to Process",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's sequence reinforced a recurring Trump governance trait: personnel and institutions are rewarded for matching velocity, not for insisting on procedural drag. In crises, that incentive model narrows dissent bandwidth and makes sober challenge feel disloyal. The short-term optics may look decisive, but the long-term system cost is weaker internal correction.",
  "rationale":"AP sequence reflected Trump's incentive structure favoring pace compliance over process rigor.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["decision rhythm","pace loyalty","process rigor","dissent bandwidth","internal correction"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's decision tempo appeared to privilege velocity compliance over process scrutiny.")
},

{
  "entry_number":1476,
  "title":"Trump's Iran Messaging Matrix Produced Multiple Truth Claims for One Operation",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's side-by-side statements showed Trump and surrogates offering overlapping but inconsistent claims about intent, scope and legal basis. In operational politics, multiple truth lanes can protect short-term flexibility while eroding long-term trust. Trump's communication matrix made verification harder, because critics and allies were left choosing which version counted as official.",
  "rationale":"AP documented incompatible Trump-era narratives describing the same Iran operation.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["messaging matrix","multiple truth claims","official version","verification burden","narrative conflict"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Trump's Iran messaging created multiple incompatible truth claims for one action.")
},
{
  "entry_number":1477,
  "title":"Trump's Post-Action Statements Shifted Goalposts Faster Than Institutions Could Evaluate Outcomes",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's timeline of official statements suggested objective framing moved quickly after action began. Goalpost shifts can preserve political room, but they also undercut accountability because evaluators lose a stable benchmark. Under Trump, that pattern turns policy review into moving-target analysis where every conclusion can be dismissed as outdated framing.",
  "rationale":"AP mapping showed Trump shifting objective framing at a pace that outstripped evaluation.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["goalpost shift","moving benchmark","outcome evaluation","moving target","post-action framing"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's post-action messaging shifted benchmarks faster than oversight could track.")
},
{
  "entry_number":1478,
  "title":"Trump's Contradictory Iran Language Increased Miscalculation Risk Across Allies and Adversaries",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's comparisons showed how contradictory language can create asymmetric interpretation risk, where allies hedge and adversaries probe gaps. Strategic signaling depends on coherence; contradictions create space for misread intent and overreaction. Trump's messaging style converted domestic spin dynamics into an international coordination problem with real security consequences.",
  "rationale":"AP contrast in Trump's language showed strategic miscalculation risk rising from inconsistent signals.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["miscalculation risk","signal coherence","ally hedging","adversary probing","coordination gap"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Trump's contradictory language increased cross-border miscalculation risk.")
},
{
  "entry_number":1479,
  "title":"Trump's Iran Narrative Drift Made Congressional Oversight Functionally Harder",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"According to AP's evolving quote set, official claims changed enough to complicate oversight framing in Congress. Oversight depends on fixed predicates: what was known, what was promised, and what authority was invoked. Trump's narrative drift blurred those predicates and increased the procedural burden on institutions trying to assess legality and proportionality.",
  "rationale":"AP quote progression showed Trump's narrative drift complicating oversight predicates.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["oversight predicates","narrative drift","legal proportionality","congressional burden","authority framing"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Trump's shifting Iran claims raised oversight burden for Congress.")
},
{
  "entry_number":1480,
  "title":"Trump's Iran Briefings Prioritized Narrative Plasticity Over Stable Public Accounting",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's in-their-own-words compilation showed a pattern of narrative plasticity: statements flexible enough to support multiple retroactive interpretations. While politically useful, plasticity erodes stable public accounting and hinders fact-based reconciliation later. Trump's briefings thus traded accountability clarity for short-run rhetorical maneuverability.",
  "rationale":"AP evidence suggested Trump's briefings favored flexible narrative control over fixed accounting.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative plasticity","public accounting","retroactive interpretation","briefing strategy","rhetorical maneuverability"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's briefings favored narrative flexibility over stable public accountability.")
},

{
  "entry_number":1481,
  "title":"Trump's Immigration Crackdown Entered Direct Criminal-Liability Terrain in Minnesota Probe",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP reported Minnesota investigators were examining federal officer conduct in a way that could produce criminal charges. That shift is significant because it moves debate from political preference to evidentiary standards and prosecutorial thresholds. Trump's enforcement brand now faces a legal arena where slogans carry less weight than records, testimony and procedural compliance.",
  "rationale":"AP report placed Trump's immigration tactics under potential criminal-liability review.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["criminal liability","state investigation","federal conduct","prosecutorial threshold","evidentiary review"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,7,10,"Trump's immigration tactics moved into potential criminal-liability scrutiny.")
},
{
  "entry_number":1482,
  "title":"Trump's Federal Enforcement Narrative Collided With State-Level Accountability Mechanisms",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's coverage illustrated a structural check on Trump's enforcement model: state-level legal institutions can challenge federal conduct narratives directly. When that collision happens, governance becomes a legitimacy contest between command rhetoric and courtroom procedure. Trump's preferred framing of control and strength now faces slower but harder-to-spin accountability forums.",
  "rationale":"AP coverage showed state accountability channels constraining Trump's federal enforcement narrative.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["state accountability","federal conduct","legitimacy contest","courtroom procedure","command rhetoric"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's federal enforcement narrative hit state-level legal resistance.")
},
{
  "entry_number":1483,
  "title":"Trump's ICE-Era Optics Faced a Documentation Test as Minnesota Case Advanced",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The AP report underscored that once an investigation matures, rhetorical optics are replaced by documentation demands. Institutions ask for logs, directives, chain-of-command evidence and conduct details that can be independently tested. Trump-aligned messaging depends on spectacle, but the Minnesota pathway shifts power toward records and verifiable chronology.",
  "rationale":"AP update showed Trump's enforcement optics being tested by documentary evidence requirements.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["documentation test","chain of command","verifiable chronology","evidence logs","optics gap"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Public Welfare Harm",8,6,8,6,3,3,7,10,"Trump's enforcement optics were forced into a records-based accountability track.")
},
{
  "entry_number":1484,
  "title":"Trump's Immigration Hardline Lost Narrative Control Once Prosecutorial Standards Took Over",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP showed the key transition point: public claims about order and security meeting legal standards built around conduct, intent and statute. In that transition, narrative control weakens because prosecutors and courts define relevance. Trump's hardline posture therefore encountered a forum where political volume does not determine outcome credibility.",
  "rationale":"AP reporting showed Trump's hardline narrative weakening under prosecutorial framing.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["prosecutorial standards","narrative control","conduct evidence","statutory relevance","credibility forum"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Trump's immigration narrative weakened once prosecutorial standards set the frame.")
},
{
  "entry_number":1485,
  "title":"Trump's Immigration Strategy Generated a New Legal Exposure Layer Beyond Policy Dispute",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's report signaled that Trump's immigration strategy now carries layered exposure: policy disagreement on one axis and potential criminal findings on another. This dual-track risk is harder to neutralize politically because legal outcomes can outlast message cycles. The result is a more durable accountability threat than ordinary policy backlash.",
  "rationale":"AP case added criminal-exposure risk on top of existing policy backlash to Trump's strategy.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["dual-track risk","criminal findings","policy backlash","durable accountability","legal exposure layer"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,7,10,"Trump's immigration strategy took on a more durable legal exposure profile.")
},

{
  "entry_number":1486,
  "title":"Trump's Tariff Delay Strategy Was Blocked, Forcing Immediate Fiscal Consequence Management",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP reported that a court rejected the administration's attempt to slow the tariff refund process. That denial removed political breathing room and shifted pressure onto immediate implementation mechanics. Trump's trade narrative had to absorb a hard legal limit, with fewer options to push costs into a later and friendlier communications cycle.",
  "rationale":"AP ruling blocked Trump's delay tactic and accelerated fiscal consequence handling.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["delay strategy","refund process","implementation pressure","fiscal management","legal limit"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Economic Warfare",7,6,8,6,3,3,7,10,"Trump's tariff-delay play was blocked, forcing faster fiscal response.")
},
{
  "entry_number":1487,
  "title":"Trump's Tariff Enforcement Story Lost Flexibility After Court Rejected Refund Slowdown",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's court update narrowed the range of plausible administrative narratives around timing and execution. Once timelines are court-shaped, executive messaging cannot easily redefine when obligations become real. Trump's tariff story therefore shifted from broad assertion to constrained compliance, reducing his ability to frame delays as strategic choice.",
  "rationale":"AP decision reduced Trump's narrative flexibility by anchoring tariff obligations to court timelines.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["court-shaped timeline","constrained compliance","narrative flexibility","obligation timing","executive assertion"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,7,10,"Trump's tariff narrative lost flexibility under court-imposed timing constraints.")
},
{
  "entry_number":1488,
  "title":"Trump's Trade Governance Took Another Hit as Courts Prioritized Process Over Political Messaging",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The AP report reinforced an institutional pattern: courts evaluating procedural legitimacy can override politically optimized pacing. That dynamic weakens messaging-first governance models because practical outcomes are set by compliance rules, not campaign framing. Trump's trade program again encountered process institutions that are less responsive to rhetorical pressure.",
  "rationale":"AP case reinforced judicial preference for procedural compliance over Trump's messaging-centric governance.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["process over messaging","procedural legitimacy","compliance rules","trade governance","institutional override"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Economic Warfare",7,6,8,6,3,3,7,10,"Courts prioritized process, undercutting Trump's messaging-first trade governance style.")
},
{
  "entry_number":1489,
  "title":"Trump's Tariff Program Faced Accelerated Accountability as Refund Clock Kept Moving",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's account of the rejected slowdown made one thing clear: accountability accelerates when financial obligations remain on an active clock. Delayed politics cannot fully mask live administrative deadlines. Trump's tariff program therefore moved into a tighter feedback loop where legal outcomes and fiscal consequences converge quickly.",
  "rationale":"AP showed tariff refund timing pressures accelerating accountability for Trump's program.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["refund clock","accelerated accountability","fiscal deadline","feedback loop","timing pressure"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,8,6,4,4,8,10,"Trump's tariff claims faced faster accountability under ongoing refund deadlines.")
},
{
  "entry_number":1490,
  "title":"Trump's Court Defeat on Tariff Timing Reinforced Perception of Recurrent Economic Whiplash",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's reporting added another episode to a recurring cycle in Trump's economic governance: assertive policy shock, legal pushback, and rapid recalibration pressure. Businesses and households read these cycles as instability signals, not strategic coherence. The court's refusal to slow refunds deepened that whiplash perception and kept uncertainty elevated.",
  "rationale":"AP ruling extended the pattern of legal correction after Trump's high-volatility tariff moves.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["economic whiplash","policy shock","legal pushback","recalibration pressure","instability signal"],
  "metrics_key":"economy","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Economic Warfare",7,6,8,6,3,3,8,10,"Court rejection reinforced recurring whiplash in Trump's tariff governance.")
},

{
  "entry_number":1491,
  "title":"Trump-Era Epstein Portal Missing Files Extended the Credibility Damage Horizon",
  "date_start":"2025-12-21","date_end":"2025-12-21",
  "synopsis":"AP reported at least 16 files disappeared from a DOJ page tied to Epstein documents, creating a measurable integrity breach in a highly sensitive archive. Measured losses matter because they transform generalized suspicion into trackable governance failure. For Trump-era transparency claims, that quantification extends credibility damage far beyond one news cycle.",
  "rationale":"AP's quantified file-loss finding deepened long-tail credibility damage in Trump-era disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["missing files","credibility horizon","quantified loss","archive integrity","governance failure"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-21","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Quantified file losses deepened credibility damage to Trump's transparency narrative.")
},
{
  "entry_number":1492,
  "title":"Trump's Full-Disclosure Posture Was Undercut by a DOJ Archive Gap That Could Be Counted",
  "date_start":"2025-12-21","date_end":"2025-12-21",
  "synopsis":"AP's report did not just allege inconsistency; it identified a specific count of missing items. Countable gaps are politically dangerous because they are easy to repeat, compare, and audit over time. Trump's disclosure posture therefore faced a durable challenge: measurable archive incompleteness is harder to wave away as partisan noise.",
  "rationale":"AP made archive gaps countable, directly weakening Trump's full-disclosure posture.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["full disclosure posture","countable gap","audit trail","archive incompleteness","durable challenge"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-21","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Countable archive gaps undercut Trump's full-disclosure credibility.")
},
{
  "entry_number":1493,
  "title":"Trump-Era Epstein Records Handling Triggered Chain-of-Custody Anxiety After AP Findings",
  "date_start":"2025-12-21","date_end":"2025-12-21",
  "synopsis":"When AP documented missing files, the concern expanded from communication optics to records-governance fundamentals like chain-of-custody and version continuity. In scandal archives, those controls are central to legitimacy because they determine whether later claims can be independently verified. Trump's information ecosystem absorbed another high-impact trust shock.",
  "rationale":"AP findings elevated chain-of-custody concerns around Trump-era Epstein record handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain of custody","version continuity","records governance","trust shock","verification risk"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-21","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP's missing-file findings heightened chain-of-custody concerns in Trump-era records handling.")
},
{
  "entry_number":1494,
  "title":"Trump's Epstein Narrative Entered a Forensic-Accounting Phase After DOJ File Disappearances",
  "date_start":"2025-12-21","date_end":"2025-12-21",
  "synopsis":"AP's publication forced the discussion into forensic-accounting territory: what disappeared, when, from where, and under whose process authority. This is structurally different from ordinary political dispute because timeline reconstruction becomes central evidence. Trump's narrative environment became more brittle once factual gaps demanded procedural reconstruction.",
  "rationale":"AP report shifted Trump's Epstein narrative into forensic reconstruction territory.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["forensic accounting","timeline reconstruction","process authority","factual gap","evidence trail"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-21","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Missing DOJ files pushed Trump's Epstein narrative into forensic-accountability mode.")
},
{
  "entry_number":1495,
  "title":"Trump's Epstein-Era Transparency Claims Took a Structural Hit Once Missing Files Became Publicly Trackable",
  "date_start":"2025-12-21","date_end":"2025-12-21",
  "synopsis":"By publishing a concrete disappearance count, AP turned a murky controversy into a trackable accountability metric. Trackable metrics persist because institutions, journalists and the public can revisit them as new disclosures appear. Trump's transparency claims therefore suffered a structural hit, not just a temporary messaging setback.",
  "rationale":"AP's trackable count transformed Trump's Epstein transparency issue into a persistent metric problem.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["trackable metric","structural hit","public accountability","disclosure persistence","transparency claim"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-21","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Trackable missing-file metrics structurally damaged Trump's transparency claims.")
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
