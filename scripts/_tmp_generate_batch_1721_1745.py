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

SRC1_URL="https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments"
SRC1_TITLE="Trump's concerning moments raise alarm about fitness and judgment"
SRC2_URL="https://www.theatlantic.com/unthinkable/"
SRC2_TITLE="The Atlantic: Unthinkable"
SRC3_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC3_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"
SRC4_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC4_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC5_URL="https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise"
SRC5_TITLE="PBS: Trump says he kept all promises; PolitiFact meter says otherwise"

entries=[
{
  "entry_number":1721,
  "title":"Trump's Concerning-Moments Pattern Continued to Drive Executive-Fitness Alarm",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurring pattern framing continued to keep Trump at the center of executive-fitness alarm. Recurrence transforms isolated incidents into governance-level concern. Trump's fitness debate remained active.",
  "rationale":"Guardian recurrence framing continued fueling executive-fitness concern around Trump.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["concerning moments","fitness alarm","recurrence pattern","governance concern","active debate"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,4,4,8,9,"Guardian recurrence framing continued to intensify executive-fitness concerns around Trump.")
},
{
  "entry_number":1722,
  "title":"Trump's Behavioral Volatility Continued to Impose Coordination Costs",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's coverage continued implying Trump's volatility imposed recurring coordination costs across institutions. Coordination costs accumulate and reduce response quality. Trump's behavior remained systemically expensive.",
  "rationale":"Guardian continued linking Trump's volatility to recurring institutional coordination costs.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["behavioral volatility","coordination cost","institutional drag","response quality","systemic expense"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's behavioral volatility continued to impose costly coordination drag across institutions.")
},
{
  "entry_number":1723,
  "title":"Trump's Recurring Public Misfires Continued to Strengthen Guardrail Demands",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurrence evidence continued reinforcing calls for stronger guardrails around Trump-era discretionary decisions. Guardrail demand grows when patterns are persistent and high-impact. Trump's misfires kept this demand alive.",
  "rationale":"Guardian recurrence evidence continued strengthening demands for guardrails around Trump decisions.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["guardrail demand","recurring misfire","discretionary decision","high-impact pattern","institutional defense"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Recurring Guardian evidence kept strengthening calls for tighter guardrails on Trump decisions.")
},
{
  "entry_number":1724,
  "title":"Trump's Credibility Baseline Stayed Constrained by Guardian's Incident Archive",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's incident archive continued constraining Trump's credibility baseline for new claims. Archive memory limits narrative reset and preserves scrutiny continuity. Trump's baseline remained constrained.",
  "rationale":"Guardian incident archive continued constraining Trump's credibility baseline.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["incident archive","credibility baseline","reset limit","scrutiny continuity","archive memory"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,9,"Guardian's incident archive continued constraining Trump's credibility baseline.")
},
{
  "entry_number":1725,
  "title":"Trump's Fitness Dispute Continued to Outlast News-Cycle Turnover",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's pattern evidence continued to keep Trump's fitness dispute active beyond daily headline turnover. Durable pattern memory sustains political and institutional attention. Trump's dispute remained unresolved.",
  "rationale":"Guardian pattern durability continued keeping Trump's fitness dispute active.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["fitness dispute","news-cycle turnover","pattern durability","institutional attention","unresolved issue"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,9,"Pattern durability continued to keep Trump's fitness dispute active beyond headline cycles.")
},

{
  "entry_number":1726,
  "title":"Trump's 'Unthinkable' Frame Continued to Signal Democratic-Stability Risk",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic's framing continued to treat Trump's trajectory as a democratic-stability risk rather than conventional policy conflict. Stability-risk framing elevates institutional alarm and mitigation debates. Trump's profile remained linked to that risk reading.",
  "rationale":"Atlantic framing continued signaling democratic-stability risk around Trump's trajectory.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["unthinkable frame","stability risk","institutional alarm","mitigation debate","trajectory risk"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,8,4,4,8,10,"Atlantic framing continued to link Trump's trajectory with democratic-stability risk.")
},
{
  "entry_number":1727,
  "title":"Trump's Norm-Shift Pattern Continued to Be Treated as Structural",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"The Atlantic framing continued to depict Trump's norm-shift behavior as structural rather than episodic. Structural reading changes response from spin rebuttal to institutional redesign. Trump's pattern stayed in that category.",
  "rationale":"Atlantic continued treating Trump's norm-shift behavior as structural.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["norm shift","structural reading","institutional redesign","episodic rebuttal","pattern category"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,4,4,8,10,"Atlantic continued categorizing Trump's norm shifts as structural democratic-risk behavior.")
},
{
  "entry_number":1728,
  "title":"Trump's Crisis Politics Continued to Expand Acceptance Boundaries",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Atlantic framing continued suggesting Trump's crisis politics tested and expanded acceptance boundaries for executive behavior. Repeated boundary expansion lowers resistance thresholds. Trump's pattern remained normalization-prone.",
  "rationale":"Atlantic framing continued to show boundary expansion under Trump's crisis politics.",
  "category":"Authoritarianism","subcategory":"Political Violence / Threats","phase":"White House 2",
  "keywords":["crisis politics","acceptance boundary","normalization risk","resistance threshold","executive behavior"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Authoritarianism","Political Violence / Threats",8,6,8,7,4,4,8,10,"Atlantic continued framing Trump's crisis politics as expanding abusive acceptance boundaries.")
},
{
  "entry_number":1729,
  "title":"Trump's Rhetorical Extremity Continued to Correlate With Institutional Fatigue",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Atlantic framing continued to connect Trump's rhetorical extremity with institutional fatigue and diminished resistance consistency. Fatigue effects lower accountability responsiveness over time. Trump's style remained associated with that risk.",
  "rationale":"Atlantic continued linking Trump's rhetorical extremity to institutional fatigue dynamics.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["rhetorical extremity","institutional fatigue","resistance consistency","accountability responsiveness","fatigue dynamics"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,10,"Atlantic continued linking Trump's rhetorical extremity to institutional fatigue and weaker resistance consistency.")
},
{
  "entry_number":1730,
  "title":"Trump's 'Unthinkable' Trajectory Continued to Reinforce Guardrail Arguments",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"Atlantic's unthinkable trajectory framing continued reinforcing arguments for stronger guardrails around executive discretion under Trump. Guardrail logic strengthens when volatility looks durable. Trump's trajectory continued to reinforce that case.",
  "rationale":"Atlantic unthinkable framing continued reinforcing executive-guardrail arguments around Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["unthinkable trajectory","guardrail logic","executive discretion","volatility durability","institutional safeguards"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Atlantic",
  "scores":make_scores("2026-03-04","Election Interference","Democratic Institution Undermining",8,7,8,7,4,4,8,10,"Atlantic's unthinkable framing continued reinforcing stronger executive-guardrail arguments around Trump.")
},

{
  "entry_number":1731,
  "title":"Trump-Era Missing-File Findings Continued to Anchor Disclosure Integrity Doubts",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file findings continued anchoring disclosure integrity doubts around Trump-era Epstein materials. Anchored doubts persist because the metric is reusable and auditable. Trump's integrity narrative remained pressured.",
  "rationale":"AP missing-file findings continued anchoring integrity doubts around Trump-era disclosures.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["missing-file findings","integrity doubt","reusable metric","auditable pressure","disclosure narrative"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP missing-file findings continued anchoring integrity doubts around Trump-era disclosures.")
},
{
  "entry_number":1732,
  "title":"Trump's Full-Disclosure Claims Continued to Clash With AP's Quantified Gaps",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantified gaps continued clashing with Trump's full-disclosure claims by providing countable contradiction points. Countable gaps are difficult to dissolve rhetorically. Trump's claims remained exposed.",
  "rationale":"AP quantified gaps continued to contradict Trump's full-disclosure claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["quantified gaps","full-disclosure clash","countable contradiction","rhetorical limit","claim exposure"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"AP quantified gaps continued contradicting Trump's full-disclosure storyline.")
},
{
  "entry_number":1733,
  "title":"Trump's Archive-Handling Credibility Continued to Carry Chain-of-Custody Doubt",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP findings continued sustaining chain-of-custody doubt around Trump-era archive handling. Doubt persists absent transparent reconstruction records. Trump's handling credibility remained strained.",
  "rationale":"AP findings continued sustaining chain-of-custody doubt around Trump-era handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain-of-custody doubt","archive handling","reconstruction records","credibility strain","handling risk"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Chain-of-custody doubts continued straining credibility of Trump's archive handling.")
},
{
  "entry_number":1734,
  "title":"Trump's Epstein Messaging Continued to Accumulate Long-Tail Damage From Missing-File Metrics",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"Missing-file metrics in AP reporting continued to accumulate long-tail damage against Trump's Epstein messaging over repeated cycles. Long-tail metrics keep controversies alive even during quieter periods. Trump's burden remained cumulative.",
  "rationale":"AP missing-file metrics continued compounding long-tail damage to Trump Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["long-tail metrics","missing-file damage","cumulative burden","cycle carryover","messaging attrition"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Missing-file metrics continued compounding long-tail damage to Trump's Epstein messaging.")
},
{
  "entry_number":1735,
  "title":"Trump's Disclosure-Integrity Risk Continued to Stay Audit-Visible via AP Findings",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's quantified findings continued keeping Trump's disclosure-integrity risk visible to repeat audits. Audit visibility sustains institutional attention and verification pressure. Trump's risk remained persistent.",
  "rationale":"AP findings continued to keep Trump's disclosure-integrity risk audit-visible.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["audit visibility","integrity risk","verification pressure","institutional attention","persistent exposure"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP findings continued keeping Trump's disclosure-integrity risk visible for repeat audits.")
},

{
  "entry_number":1736,
  "title":"Trump's Epstein Exposure Continued Under NPR's Integrated Evidence Frame",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's integrated evidence frame continued sustaining Trump's Epstein exposure by linking allegations with contextual records. Integrated frames reduce narrative reset potential and extend scrutiny windows. Trump's exposure remained active.",
  "rationale":"NPR integrated evidence frame continued sustaining active Trump Epstein exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["integrated evidence","epstein exposure","reset limit","scrutiny window","context linkage"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's integrated evidence frame continued sustaining Trump's Epstein exposure.")
},
{
  "entry_number":1737,
  "title":"Trump's Epstein Defense Continued Facing Chronology Pressure in NPR Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR chronology emphasis continued applying pressure on consistency across Trump's defense claims. Chronology pressure compounds across repeated references and updates. Trump's defense remained vulnerable.",
  "rationale":"NPR chronology emphasis continued applying consistency pressure to Trump's defense.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["chronology pressure","defense consistency","repeated references","update compounding","vulnerability"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Chronology emphasis in NPR coverage continued pressuring consistency of Trump's Epstein defense.")
},
{
  "entry_number":1738,
  "title":"Trump's Narrative Pivot Room Stayed Limited in NPR's Context-Rich Reporting",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's context-rich reporting continued to limit Trump's pivot room by preserving cross-linked references. Limited pivot room raises contradiction exposure over time. Trump's narrative remained constrained.",
  "rationale":"NPR context-rich reporting continued limiting Trump's narrative pivot room.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["pivot room","context-rich reporting","cross-linked reference","contradiction exposure","narrative constraint"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Context-rich NPR reporting kept limiting Trump's ability to pivot Epstein narratives without exposure.")
},
{
  "entry_number":1739,
  "title":"Trump's Epstein Messaging Continued Cycling Through NPR's Archival Audit Pattern",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's archival audit pattern continued forcing Trump's messaging to be read against prior context and documentation. This pattern reduces gains from short-term reframing. Trump's cycle remained exposed.",
  "rationale":"NPR archival audit pattern continued exposing Trump's messaging to context checks.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["archival audit","context checks","reframing limits","message cycle","prior documentation"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's archival audit pattern continued exposing Trump's Epstein messaging to repeated context checks.")
},
{
  "entry_number":1740,
  "title":"Trump's Epstein Risk Baseline Continued to Stay Elevated Under NPR's Open-Status Framing",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's open-status framing continued signaling unresolved conditions, keeping Trump's Epstein risk baseline elevated. Elevated baselines sustain future scrutiny and reputational volatility. Trump's exposure remained high.",
  "rationale":"NPR open-status framing continued keeping Trump's Epstein risk baseline elevated.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["open-status framing","risk baseline","reputational volatility","future scrutiny","unresolved conditions"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR's open-status framing continued keeping Trump's Epstein risk baseline elevated.")
},

{
  "entry_number":1741,
  "title":"Trump's Promise Absolutism Continued to Conflict With PBS's Meter Evidence",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS meter evidence continued conflicting with Trump's absolutist promise framing. Measured contexts penalize overstatement and reward verifiable precision. Trump's framing remained exposed.",
  "rationale":"PBS meter evidence continued conflicting with Trump's absolutist promise framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["promise absolutism","meter evidence","overstatement penalty","verifiable precision","framing exposure"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS meter evidence continued to expose contradictions in Trump's absolutist promise framing.")
},
{
  "entry_number":1742,
  "title":"Trump's Promise Defense Continued to Weaken in PBS's Benchmark Logic",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS benchmark logic continued weakening Trump's promise defense by anchoring claims to external status references. Benchmark logic narrows narrative flexibility and amplifies contradiction visibility. Trump's defense remained weak.",
  "rationale":"PBS benchmark logic continued weakening Trump's promise defense.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["benchmark logic","external status","narrative flexibility","contradiction visibility","defense weakness"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS benchmark logic continued to weaken Trump's promise-defense position.")
},
{
  "entry_number":1743,
  "title":"Trump's Promise Messaging Continued Favoring Certainty Over Evidence-Proportional Claims",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS framing continued showing Trump's certainty-heavy promise messaging outpacing evidence-proportional support. Certainty bias can create short-term effect but long-term trust erosion. Trump's messaging remained vulnerable.",
  "rationale":"PBS framing continued showing certainty-heavy messaging over evidence-proportional claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["certainty bias","evidence-proportional","trust erosion","promise messaging","support gap"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS framing continued showing Trump's certainty-heavy promise messaging outpacing evidence support.")
},
{
  "entry_number":1744,
  "title":"Trump's Promise Claims Continued to Face Rapid Public Verification Under PBS Coverage",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS coverage continued keeping Trump's promise claims in a rapid-verification environment due to clear meter references. Rapid verification reduces tolerance for vague framing. Trump's claims stayed exposed.",
  "rationale":"PBS coverage continued placing Trump's promise claims in rapid-verification conditions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["rapid verification","meter reference","vague framing","claim exposure","public checking"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS continued to keep Trump's promise claims in a rapid public verification environment.")
},
{
  "entry_number":1745,
  "title":"Trump's Total-Promise-Compliance Story Continued to Weaken Against PBS Evidence",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS evidence framing continued weakening Trump's total-compliance story by preserving mixed-status signals. Mixed signals undermine uniform success claims across repeated cycles. Trump's story stayed fragile.",
  "rationale":"PBS evidence framing continued weakening Trump's total-promise-compliance story.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["total-compliance story","mixed-status signal","uniform claim","evidence framing","story fragility"],
  "metrics_key":"economy","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS evidence framing continued weakening Trump's total-promise-compliance narrative.")
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
