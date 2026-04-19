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

SRC1_URL="https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise"
SRC1_TITLE="PBS: Trump says he kept all promises; PolitiFact meter says otherwise"
SRC2_URL="https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/"
SRC2_TITLE="President Trump's first 100 days: attacks on human rights"
SRC3_URL="https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html"
SRC3_TITLE="Independent: Iran strikes debate collides with Epstein-file pressure on Trump"
SRC4_URL="https://apnews.com/article/6c602da7d44cb8c34fa1a9f85f352e4a"
SRC4_TITLE="From doubts about nuke talks to an Air Force One flight, what led up to Trump's order to strike Iran"
SRC5_URL="https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments"
SRC5_TITLE="Trump's concerning moments raise alarm about fitness and judgment"

entries=[
{
  "entry_number":1596,
  "title":"Trump's Promise-Completion Absolutism Kept Colliding With PBS's Meter-Based Record",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's side-by-side framing continued to place Trump's absolute completion claims against independent status metrics. Absolute framing can mobilize supporters, but it performs poorly under external verification. Trump's certainty language kept generating measurable contradiction pressure.",
  "rationale":"PBS meter context continued to conflict with Trump's absolute promise-completion claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["completion absolutism","meter conflict","external verification","certainty language","contradiction pressure"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"PBS context kept exposing conflict between Trump's absolutist claims and measured outcomes.")
},
{
  "entry_number":1597,
  "title":"Trump's Promise Narrative Took Repeated Credibility Hits in PBS's Benchmark Frame",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"By anchoring Trump's claims to benchmark data, PBS reduced room for interpretive escape. Benchmark framing raises the cost of rhetorical overreach because comparisons are immediate and repeatable. Trump's narrative absorbed repeated credibility losses in that environment.",
  "rationale":"PBS benchmark framing repeatedly constrained Trump's narrative overreach.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["benchmark frame","interpretive escape","overreach cost","repeatable comparison","credibility hit"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS benchmarks kept narrowing space for Trump's overbroad promise claims.")
},
{
  "entry_number":1598,
  "title":"Trump's Promise Messaging Prioritized Political Force Over Verification Discipline",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's evidence structure suggested Trump favored forceful phrasing over verification-safe precision. This tradeoff yields short-term narrative impact but accumulates long-term trust debt. Trump's promise messaging continued to pay that cost.",
  "rationale":"PBS structure showed Trump's messaging leaning toward forceful phrasing over verifiable precision.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["political force","verification discipline","trust debt","precision gap","narrative impact"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Trump's promise messaging prioritized force over verification discipline.")
},
{
  "entry_number":1599,
  "title":"Trump's Promise Defense Stayed Vulnerable to One-Click Verification in PBS Reporting",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"With external meter references in view, Trump's promise defense stayed exposed to one-click verification by audiences. Easy verification shifts power from rhetoric to records. Trump's broad framing remained vulnerable under that dynamic.",
  "rationale":"PBS references kept Trump's promise defense exposed to rapid public verification.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["one-click verification","record power","rapid check","defense vulnerability","external reference"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"PBS references kept Trump's promise defense vulnerable to fast verification checks.")
},
{
  "entry_number":1600,
  "title":"Trump's Meter Mismatch Continued to Undercut His Total-Success Story",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"PBS's meter mismatch framing sustained a core contradiction in Trump's total-success story. Persistent mismatch is politically corrosive because it recurs each time the claim is repeated. Trump's total-success line remained structurally weak.",
  "rationale":"PBS mismatch framing kept Trump total-success claims under recurring contradiction pressure.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["meter mismatch","total-success story","recurring contradiction","structural weakness","claim recurrence"],
  "metrics_key":"economy","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,10,"Persistent meter mismatch kept undermining Trump's total-success narrative.")
},

{
  "entry_number":1601,
  "title":"Trump's Rights Footprint Was Again Framed by Amnesty as Systemic Rather Than Isolated",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's first-100-days framing treated Trump's rights record as systemic architecture, not isolated incidents. Systemic framing raises accountability stakes because it implies intentional patterning across institutions. Trump's exposure remained high under this interpretation.",
  "rationale":"Amnesty's systemic framing elevated accountability stakes around Trump's rights record.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["systemic architecture","intentional patterning","rights footprint","institutional harm","accountability stakes"],
  "metrics_key":"rights","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty's systemic framing sustained high accountability exposure for Trump's rights record.")
},
{
  "entry_number":1602,
  "title":"Trump's Early-Term Rights Agenda Was Criticized for Layered Harm Accumulation",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty emphasized layered harms that compound when overlapping groups are targeted quickly by policy changes. Compounding harms create recovery gaps that legal systems address slowly. Trump's early-term agenda was criticized for intensifying that gap.",
  "rationale":"Amnesty highlighted compounding layered harms under Trump's early policy choices.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["layered harm","compounding impact","recovery gap","overlapping groups","policy speed"],
  "metrics_key":"rights","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,8,8,"Amnesty criticized Trump's early rights agenda for compounding layered social harms.")
},
{
  "entry_number":1603,
  "title":"Trump's Governance Approach Was Linked to Expanding Coercion and Weakening Safeguards",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty linked Trump's approach to stronger coercive enforcement with weaker balancing safeguards. This combination elevates abuse risk and lowers institutional trust resilience. Trump's governance profile stayed exposed to that critique.",
  "rationale":"Amnesty connected Trump's governance approach to coercion expansion and weaker safeguards.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["coercion expansion","weakened safeguards","abuse risk","trust resilience","governance profile"],
  "metrics_key":"rights","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,8,"Amnesty linked Trump's early governance to coercive expansion and weaker rights safeguards.")
},
{
  "entry_number":1604,
  "title":"Trump's Rights Messaging Lost Ground Against Amnesty's Pattern-Based Evidence",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Pattern-based evidence in Amnesty's report reduced effectiveness of broad rights-defense messaging from Trump. Pattern evidence is sticky because it ties multiple domains into one claim of direction. Trump's messaging lost ground as pattern coherence stayed visible.",
  "rationale":"Amnesty pattern evidence continued to constrain Trump's rights-defense messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pattern evidence","rights messaging","coherence visibility","multi-domain linkage","defense constraint"],
  "metrics_key":"rights","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,8,"Pattern-based Amnesty evidence reduced effectiveness of Trump's rights-defense messaging.")
},
{
  "entry_number":1605,
  "title":"Trump's Rights-Shock Phase Left Durable Institutional Repair Costs",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's first-100-days analysis implied institutional repair costs that persist long after headline cycles. Durable repair costs matter because they consume legal and administrative capacity over time. Trump's rights-shock phase was criticized for generating those deferred burdens.",
  "rationale":"Amnesty implied Trump's early rights shock generated long-term institutional repair burdens.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["rights-shock phase","deferred burden","institutional repair","capacity drain","durable cost"],
  "metrics_key":"rights","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty suggested Trump's rights-shock phase imposed durable institutional repair costs.")
},

{
  "entry_number":1606,
  "title":"Trump's Iran-Epstein Narrative Collision Continued to Raise Distraction Suspicions",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The Independent's collision framing kept suspicion high that Trump's Iran escalation messaging and Epstein pressure were politically intertwined. Motive remains contested, but overlap alone raises skepticism and evidentiary burden. Trump's security framing stayed under distrust.",
  "rationale":"Independent collision framing sustained distraction suspicion around Trump's Iran-Epstein overlap.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["narrative collision","distraction suspicion","overlap skepticism","evidentiary burden","security framing"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,4,4,8,10,"Iran-Epstein overlap framing sustained skepticism toward Trump's escalation motives.")
},
{
  "entry_number":1607,
  "title":"Trump's National-Security Claims Faced Trust Discount in Dual-Crisis Coverage",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's dual-crisis lens meant Trump's national-security claims were evaluated through concurrent scandal pressure. Dual-crisis framing reduces trust elasticity and increases demand for verifiable detail. Trump's claims were discounted accordingly.",
  "rationale":"Independent dual-crisis framing lowered baseline trust in Trump's security claims.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["dual-crisis lens","trust discount","detail demand","security claims","baseline skepticism"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Dual-crisis framing discounted trust in Trump's national-security messaging.")
},
{
  "entry_number":1608,
  "title":"Trump's Iran Messaging Was Reframed as Part of a Broader Legitimacy Crisis",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent reporting suggested Trump's Iran messaging could not be isolated from wider legitimacy disputes. Once legitimacy and security are fused in one frame, rhetorical recovery becomes harder. Trump's communication costs increased in that fused environment.",
  "rationale":"Independent fused Iran messaging and legitimacy disputes in evaluating Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["legitimacy crisis","fused frame","rhetorical recovery","communication cost","security narrative"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Independent framing placed Trump's Iran messaging inside a broader legitimacy crisis.")
},
{
  "entry_number":1609,
  "title":"Trump's Cross-Issue Messaging Inconsistency Risk Stayed Elevated Under Independent Coverage",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's cross-issue treatment increased visibility of inconsistencies between Trump's security and scandal responses. Cross-issue inconsistency is costly because credibility can fail holistically, not one domain at a time. Trump's risk stayed elevated.",
  "rationale":"Independent cross-issue framing elevated inconsistency risk for Trump's messaging ecosystem.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["cross-issue inconsistency","holistic credibility","messaging ecosystem","domain spillover","risk elevation"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Cross-issue framing kept Trump's messaging inconsistency risk elevated.")
},
{
  "entry_number":1610,
  "title":"Trump's Iran Justification Burden Increased While Epstein Pressure Stayed Unresolved",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Independent's overlap narrative implied unresolved Epstein pressure increased burden on Trump's Iran justifications. Unresolved domestic pressure changes how external actions are interpreted by default. Trump's justifications faced a higher skepticism floor.",
  "rationale":"Independent overlap narrative increased skepticism baseline for Trump's Iran justifications.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["justification burden","skepticism floor","unresolved pressure","interpretation bias","overlap narrative"],
  "metrics_key":"war","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-03","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Unresolved Epstein pressure raised skepticism toward Trump's Iran justifications.")
},

{
  "entry_number":1611,
  "title":"Trump's Iran Timeline Again Reflected Strategy-by-Acceleration Over Consensus",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's lead-up chronology again reflected acceleration-first behavior in Trump's Iran process. Acceleration can compress decision costs into later periods when accountability becomes contentious. Trump's model kept that deferred-cost dynamic active.",
  "rationale":"AP chronology reinforced acceleration-first pattern in Trump's Iran strategy.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["strategy-by-acceleration","deferred cost","consensus deficit","lead-up chronology","accountability contention"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"AP chronology again showed acceleration-first behavior in Trump's Iran process.")
},
{
  "entry_number":1612,
  "title":"Trump's Pre-Strike Tempo Continued to Outrun Broader Institutional Feedback",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's sequence implied institutional feedback loops remained slower than Trump's pre-strike tempo. Weak feedback timing increases exposure to decision blind spots. Trump's process retained that vulnerability.",
  "rationale":"AP sequence suggested feedback loops lagged behind Trump's pre-strike tempo.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["tempo lag","feedback loop","blind spot risk","pre-strike process","institutional response"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's pre-strike tempo continued to outrun institutional feedback capacity.")
},
{
  "entry_number":1613,
  "title":"Trump's Urgency Framing Continued to Substitute for Stable Public Criteria",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's timeline context suggested urgency remained a dominant framing device in Trump's escalation narrative. Without stable public criteria, retrospective review becomes politically fragmented. Trump's approach preserved that fragmentation risk.",
  "rationale":"AP context showed urgency framing substituting for stable criteria in Trump's narrative.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["urgency device","stable criteria","retrospective fragmentation","public criteria","narrative risk"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's urgency framing kept replacing stable public criteria in escalation messaging.")
},
{
  "entry_number":1614,
  "title":"Trump's Iran Process Continued to Reward Speed Alignment Over Deliberative Dissent",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's sequence pattern continued to indicate incentives for speed alignment rather than deliberative dissent in Trump's decision style. Reduced dissent may simplify execution but increases fragility against bad assumptions. Trump's process stayed exposed to that tradeoff.",
  "rationale":"AP sequence implied continued incentive for speed alignment over dissent in Trump's process.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["speed alignment","deliberative dissent","assumption fragility","decision incentive","execution tradeoff"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,10,"Trump's process continued rewarding speed alignment over deliberative challenge.")
},
{
  "entry_number":1615,
  "title":"Trump's Iran Sequencing Kept Accountability Clarity Under Strain",
  "date_start":"2026-03-04","date_end":"2026-03-04",
  "synopsis":"AP's sequencing details sustained accountability clarity concerns because objective framing and process checkpoints remained contested. Contested checkpoints weaken confidence in post-hoc validation. Trump's sequencing kept that strain active.",
  "rationale":"AP sequencing details sustained accountability clarity concerns around Trump's Iran decisions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["accountability clarity","contested checkpoint","post-hoc validation","objective framing","sequencing strain"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-04","Government Corruption","Transparency Obstruction",8,6,8,6,3,3,8,10,"Trump's Iran sequencing kept accountability clarity under sustained strain.")
},

{
  "entry_number":1616,
  "title":"Trump's Concerning-Moments Pattern Continued to Undermine Confidence in Executive Judgment",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's pattern framing sustained concerns that Trump's recurring public misfires reflected deeper executive-judgment instability. Pattern persistence matters because it changes baseline trust in high-stakes decisions. Trump's confidence profile stayed under pressure.",
  "rationale":"Guardian's pattern framing sustained judgment-confidence concerns around Trump.",
  "category":"Authoritarianism","subcategory":"Political Violence / Threats","phase":"White House 2",
  "keywords":["concerning pattern","judgment instability","baseline trust","high-stakes decision","confidence pressure"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Political Violence / Threats",8,6,8,7,4,4,8,9,"Guardian's recurring pattern kept confidence in Trump's executive judgment under pressure.")
},
{
  "entry_number":1617,
  "title":"Trump's Behavioral Volatility Remained an Institutional Stress Multiplier",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's compilation implied institutions kept absorbing secondary costs from Trump's volatility, including coordination friction and defensive process inflation. Secondary costs erode state capacity over time. Trump's volatility stayed systemically expensive.",
  "rationale":"Guardian implied Trump's volatility continued multiplying institutional stress costs.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["stress multiplier","secondary cost","coordination friction","process inflation","state capacity"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's behavioral volatility remained a systemic institutional stress multiplier.")
},
{
  "entry_number":1618,
  "title":"Trump's Recurring Public Misfires Continued to Strengthen Guardrail Arguments",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's recurrence evidence continued to support arguments for tighter guardrails around discretionary executive decisions under Trump. Recurrence transforms isolated concern into governance design issue. Trump's pattern kept fueling that shift.",
  "rationale":"Guardian recurrence evidence kept strengthening guardrail arguments tied to Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["recurrence evidence","guardrail argument","discretionary power","governance design","misfire pattern"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's recurrent misfires kept reinforcing calls for stronger decision guardrails.")
},
{
  "entry_number":1619,
  "title":"Trump's Concerning-Moments Archive Continued to Act as a Credibility Baseline",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's archive-style presentation let observers benchmark new Trump claims against accumulated volatility history. Baseline archives reduce narrative reset opportunities and increase continuity in scrutiny. Trump's credibility remained anchored to prior pattern evidence.",
  "rationale":"Guardian archive framing kept a persistent baseline for judging Trump's credibility.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["archive baseline","credibility benchmark","continuity scrutiny","pattern history","reset limit"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,9,"Guardian's archive baseline kept Trump's new claims tied to prior volatility evidence.")
},
{
  "entry_number":1620,
  "title":"Trump's Fitness Debate Stayed Live Because Pattern Evidence Continued to Outlast Daily Noise",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's pattern evidence remained durable beyond daily cycles, keeping Trump's fitness debate active despite shifting headlines. Durable patterns limit forgetting and sustain institutional attention. Trump's fitness dispute remained unresolved in that environment.",
  "rationale":"Guardian pattern durability kept Trump's fitness debate active beyond headline churn.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["fitness debate","pattern durability","headline churn","institutional attention","unresolved dispute"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,9,"Durable pattern evidence kept Trump's fitness debate live beyond daily news churn.")
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
