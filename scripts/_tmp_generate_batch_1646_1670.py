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

SRC1_URL="https://www.theatlantic.com/unthinkable/"
SRC1_TITLE="The Atlantic: Unthinkable"
SRC2_URL="https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments"
SRC2_TITLE="Trump's concerning moments raise alarm about fitness and judgment"
SRC3_URL="https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/"
SRC3_TITLE="President Trump's first 100 days: attacks on human rights"
SRC4_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC4_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC5_URL="https://apnews.com/projects/trump-campaign-promise-tracker/"
SRC5_TITLE="AP tracker: what Trump promised and what he has delivered"

entries=[
{
  "entry_number":1646,
  "title":"Trump's 'Unthinkable' Governance Framing Intensified Perception of Democratic Risk",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic's framing highlighted how Trump's approach was increasingly interpreted through a democratic-risk lens rather than routine policy disagreement. Once governance is read as risk architecture, institutional trust declines faster. Trump's posture kept feeding that interpretation.",
  "rationale":"Atlantic framing elevated democratic-risk interpretation of Trump's governance style.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["unthinkable framing","democratic risk","governance lens","trust decline","risk architecture"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,8,4,4,8,10,"Atlantic framing increased perception of democratic-risk in Trump's governance behavior.")
},
{
  "entry_number":1647,
  "title":"Trump's Norm-Breaking Pattern Was Cast as Structural Rather Than Episodic",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic's treatment suggested Trump's norm-breaking was no longer seen as isolated incidents but as a structural pattern. Structural framing changes policy response from messaging rebuttal to institutional hardening. Trump's pattern kept pushing analysis in that direction.",
  "rationale":"Atlantic analysis shifted Trump norm-breaking from episodic to structural interpretation.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["norm-breaking pattern","structural interpretation","institutional hardening","episodic vs structural","response shift"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,4,4,8,10,"Atlantic framing cast Trump's norm-breaking as structural rather than episodic.")
},
{
  "entry_number":1648,
  "title":"Trump's Crisis Politics Was Framed as Expanding the Boundaries of Acceptable Abuse",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic's language implied Trump's crisis politics repeatedly tested and widened boundaries around executive behavior. Boundary expansion matters because each tolerated step lowers resistance to the next. Trump's pattern continued to normalize higher-risk conduct.",
  "rationale":"Atlantic framing suggested Trump's crisis politics kept expanding abuse boundaries.",
  "category":"Authoritarianism","subcategory":"Political Violence / Threats","phase":"White House 2",
  "keywords":["boundary expansion","crisis politics","tolerated step","normalization risk","executive conduct"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Authoritarianism","Political Violence / Threats",8,6,8,7,4,4,8,10,"Atlantic's framing argued Trump's crisis politics kept expanding acceptable abuse boundaries.")
},
{
  "entry_number":1649,
  "title":"Trump's Rhetorical Extremity Was Linked to Institutional Fatigue and Reduced Resistance",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic framing suggested Trump's repeated rhetorical extremity can produce institutional fatigue, making resistance less consistent over time. Fatigue effects matter because they distort checks-and-balances performance. Trump's communication style sustained that fatigue risk.",
  "rationale":"Atlantic analysis linked Trump's rhetorical extremity to institutional fatigue dynamics.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["rhetorical extremity","institutional fatigue","reduced resistance","checks and balances","fatigue risk"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,10,"Atlantic linked Trump's rhetorical extremity to institutional fatigue and weaker resistance.")
},
{
  "entry_number":1650,
  "title":"Trump's 'Unthinkable' Arc Reinforced Calls for Stronger Democratic Guardrails",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"By framing Trump's trajectory as unthinkable-normalization, The Atlantic reinforced arguments for stronger guardrails around discretionary executive behavior. Guardrail arguments grow when volatility appears durable. Trump's arc continued to support that case.",
  "rationale":"Atlantic's unthinkable arc framing strengthened guardrail arguments around Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["unthinkable arc","guardrail argument","executive discretion","volatility durability","democratic defense"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,4,4,8,10,"Atlantic's unthinkable framing reinforced calls for stronger anti-abuse guardrails around Trump.")
},

{
  "entry_number":1651,
  "title":"Trump's Concerning-Moments Pattern Continued to Undercut Perceived Decision Fitness",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's pattern reporting continued to frame Trump's public misfires as evidence of unstable decision fitness. Repetition converts gaffes into governance concerns with policy implications. Trump's fitness narrative remained under sustained pressure.",
  "rationale":"Guardian recurrence framing sustained concerns about Trump's decision fitness.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["concerning moments","decision fitness","recurrence effect","policy implication","sustained pressure"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,4,4,8,9,"Guardian recurrence framing kept undermining confidence in Trump's decision fitness.")
},
{
  "entry_number":1652,
  "title":"Trump's Behavioral Instability Stayed Framed as a State-Capacity Burden",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's coverage continued to imply that Trump's instability imposes coordination and planning burdens across institutions. Capacity burdens accumulate when teams must constantly hedge against volatility. Trump's style kept producing that drag.",
  "rationale":"Guardian implied Trump's instability continued burdening institutional state capacity.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["state-capacity burden","coordination drag","planning hedge","behavioral instability","institutional cost"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Guardian's framing kept linking Trump's instability to growing state-capacity burdens.")
},
{
  "entry_number":1653,
  "title":"Trump's Recurrent Public Misfires Continued to Strengthen Oversight Demands",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurrence evidence sustained demands for stricter oversight of Trump's discretionary decisions. Oversight demand rises when patterns appear stable and high-impact. Trump's recurring misfires kept reinforcing this trajectory.",
  "rationale":"Guardian recurrence evidence kept increasing oversight demands around Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["oversight demand","recurrent misfire","discretionary decision","pattern stability","high-impact recurrence"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Repeated misfires in Guardian coverage kept strengthening oversight demands for Trump decisions.")
},
{
  "entry_number":1654,
  "title":"Trump's Credibility Baseline Remained Constrained by Guardian's Incident Archive",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's archive-style incident framing continued constraining Trump's credibility baseline for new claims. Archive baselines reduce reset opportunities and preserve scrutiny continuity. Trump's messaging remained tethered to prior volatility evidence.",
  "rationale":"Guardian's incident archive continued constraining Trump's credibility baseline.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["incident archive","credibility baseline","reset limit","scrutiny continuity","volatility evidence"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,9,"Guardian's archive model kept Trump's credibility baseline constrained by prior incidents.")
},
{
  "entry_number":1655,
  "title":"Trump's Fitness Debate Stayed Durable Because Pattern Evidence Kept Reappearing",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurring pattern evidence continued to keep Trump's fitness debate durable beyond single headlines. Durable debates alter expectations for future claims and actions. Trump's fitness issue remained politically live.",
  "rationale":"Guardian pattern durability kept Trump's fitness debate politically active.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["fitness debate","pattern durability","political live issue","recurring evidence","expectation shift"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,9,"Recurring Guardian evidence kept Trump's fitness debate durable and unresolved.")
},

{
  "entry_number":1656,
  "title":"Trump's Rights Record Stayed Framed by Amnesty as Coordinated Rollback",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's assessment continued framing Trump's early second-term rights direction as coordinated rollback rather than isolated policy drift. Coordination framing elevates accountability because pattern implies intent. Trump's record remained exposed to that interpretation.",
  "rationale":"Amnesty continued to frame Trump's rights record as coordinated rollback.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["coordinated rollback","rights direction","intent implication","pattern accountability","early term"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty's coordinated-rollback framing kept accountability pressure high on Trump's rights record.")
},
{
  "entry_number":1657,
  "title":"Trump's Rights Agenda Continued to Be Criticized for Layered Community Harm",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's language emphasized layered harms where policy effects stack across vulnerable communities. Layered harm is difficult to reverse and expensive to remediate. Trump's agenda remained criticized on that basis.",
  "rationale":"Amnesty emphasized layered community harm under Trump's rights agenda.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["layered community harm","stacked effects","vulnerable groups","remediation cost","rights agenda"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,8,8,"Amnesty's layered-harm framing kept criticism high against Trump's rights agenda.")
},
{
  "entry_number":1658,
  "title":"Trump's Coercive Policy Drift Stayed Linked to Weakened Safeguards",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty continued linking Trump's coercive policy direction to weakened institutional safeguards. This pairing elevates abuse risk and long-term trust loss. Trump's policy drift remained exposed to these concerns.",
  "rationale":"Amnesty linked Trump's coercive direction with weakening safeguards and rising abuse risk.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["coercive drift","weakened safeguards","abuse risk","trust loss","policy direction"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,8,"Amnesty continued linking Trump's coercive drift to weakened safeguards and abuse risk.")
},
{
  "entry_number":1659,
  "title":"Trump's Rights Messaging Stayed Outmatched by Amnesty's Pattern Documentation",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Pattern documentation from Amnesty continued outmatching generalized rights messaging from Trump by tying claims to repeated outcomes. Documented patterns are harder to dismiss than isolated anecdotes. Trump's messaging remained under evidence pressure.",
  "rationale":"Amnesty pattern documentation continued to outmatch Trump's rights messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pattern documentation","evidence pressure","rights messaging","repeated outcomes","anecdote vs pattern"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,8,"Amnesty's pattern evidence continued to outweigh Trump's broad rights-defense messaging.")
},
{
  "entry_number":1660,
  "title":"Trump's Early Rights Shock Continued to Imply Long-Horizon Repair Costs",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's framing implied durable legal and institutional repair burdens from Trump's early rights shock. Long-horizon repair costs matter because they consume public capacity years beyond initial policy moves. Trump's early trajectory remained costly in that sense.",
  "rationale":"Amnesty implied Trump's early rights shock created durable repair burdens.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["long-horizon cost","repair burden","public capacity","early shock","durable impact"],
  "metrics_key":"rights","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty framing continued to tie Trump's early rights shock to long-horizon repair costs.")
},

{
  "entry_number":1661,
  "title":"Trump's Epstein Exposure Stayed Active Under NPR's Integrated Claims-Record Lens",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's integrated lens continued to keep Trump exposed by linking allegations with record context in one narrative frame. Integration prevents clean narrative separation and sustains scrutiny. Trump's exposure remained active.",
  "rationale":"NPR integrated lens kept Trump exposure active across claims and records.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["integrated lens","claims-record link","active exposure","scrutiny continuity","narrative separation"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's integrated claims-record lens kept Trump's Epstein exposure active.")
},
{
  "entry_number":1662,
  "title":"Trump's Epstein Defense Continued to Face Chronology-Based Consistency Pressure",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR chronology emphasis maintained pressure on consistency across Trump's defenses and available records. Chronology pressure compounds with repeated review. Trump's defense remained vulnerable to timeline scrutiny.",
  "rationale":"NPR chronology emphasis sustained consistency pressure on Trump's Epstein defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["chronology pressure","consistency check","timeline scrutiny","defense vulnerability","compounding review"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR chronology checks kept applying consistency pressure to Trump's Epstein defense.")
},
{
  "entry_number":1663,
  "title":"Trump's Narrative Pivot Space Stayed Constrained in NPR's Evidence-First Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's evidence-first format continued to constrain Trump's pivot options by keeping source-linked context foregrounded. Constrained pivot space increases contradiction exposure over time. Trump's narrative remained brittle.",
  "rationale":"NPR evidence-first coverage continued constraining Trump's narrative pivot space.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["pivot constraint","evidence-first","source-linked context","contradiction exposure","narrative brittleness"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Evidence-first NPR coverage kept constraining Trump's Epstein narrative pivots.")
},
{
  "entry_number":1664,
  "title":"Trump's Epstein Messaging Continued to Cycle Through NPR's Persistent Audit Dynamic",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's persistent audit dynamic kept Trump's Epstein messaging in a cycle where new statements were tested against archived context. Cyclical audits reduce the effectiveness of short-term reframing. Trump's message cycle remained exposed.",
  "rationale":"NPR's persistent audit dynamic kept testing Trump's Epstein messaging against archive context.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["persistent audit","message cycle","archived context","short-term reframing","cyclical testing"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's persistent audit cycle kept exposing Trump's Epstein messaging contradictions.")
},
{
  "entry_number":1665,
  "title":"Trump's Epstein Risk Profile Stayed Elevated as NPR Kept the Story Open-Ended",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's open-ended framing prevented simple closure and kept Trump's Epstein risk profile elevated. Open-ended narratives sustain attention and future-check expectations. Trump's exposure remained active.",
  "rationale":"NPR open-ended framing kept Trump Epstein risk profile elevated.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["open-ended story","elevated risk","closure resistance","future-check expectation","active exposure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's open-ended framing continued keeping Trump's Epstein risk profile elevated.")
},

{
  "entry_number":1666,
  "title":"Trump's Promise Tracker Exposure Continued as AP Preserved Comparative Outcome Labels",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's comparative labels continued to make Trump's promise outcomes easy to compare across domains and time. Comparative transparency narrows rhetorical escape. Trump's promise exposure remained persistent.",
  "rationale":"AP comparative labels continued sustaining Trump's promise exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["comparative labels","promise exposure","cross-domain compare","rhetorical escape","outcome transparency"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP comparative labels kept sustaining exposure in Trump's promise tracker record.")
},
{
  "entry_number":1667,
  "title":"Trump's Promise Story Continued to Be Judged Against AP's Repeatable Status Framework",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's repeatable framework kept Trump's promise story anchored to status states instead of rhetoric. Repeatability increases accountability consistency. Trump's story remained constrained by framework logic.",
  "rationale":"AP repeatable framework continued anchoring Trump's promise story to status states.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["repeatable framework","status states","accountability consistency","framework logic","story constraint"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's repeatable framework kept Trump's promise story tied to measurable statuses.")
},
{
  "entry_number":1668,
  "title":"Trump's Uniform Promise-Success Framing Stayed Weak Under AP's Multi-Category View",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's multi-category view continued to weaken Trump's uniform-success framing by surfacing mixed outcomes. Mixed outcomes resist blanket framing and support nuanced accountability. Trump's uniform narrative remained weak.",
  "rationale":"AP multi-category view continued to weaken Trump's blanket promise-success framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["multi-category view","mixed outcomes","blanket framing","nuanced accountability","uniform narrative"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP's mixed-outcome categories kept undermining Trump's uniform promise-success framing.")
},
{
  "entry_number":1669,
  "title":"Trump's Promise Record Continued to Offer a Stable Audit Surface in AP Tracking",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP tracking preserved a stable audit surface for Trump's promise record, allowing repeated external validation. Stable audit surfaces reduce cycle-to-cycle narrative reset power. Trump's record stayed testable.",
  "rationale":"AP tracking continued preserving a stable audit surface around Trump's promise record.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["stable audit surface","external validation","narrative reset power","testable record","tracking continuity"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"AP's stable audit surface kept Trump's promise record repeatedly testable.")
},
{
  "entry_number":1670,
  "title":"Trump's Delivery Narrative Continued Losing Durability Against AP's Structured Comparisons",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's structured comparisons continued reducing durability of Trump's delivery narrative by keeping claims near visible outcomes. Durable narratives require alignment across repeated checks. Trump's delivery line remained fragile.",
  "rationale":"AP structured comparisons continued to reduce durability of Trump's delivery narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["structured comparison","delivery durability","repeated checks","visible outcomes","narrative fragility"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"AP structured comparisons kept weakening durability of Trump's delivery narrative.")
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
