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

SRC1_URL="https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/"
SRC1_TITLE="President Trump's first 100 days: attacks on human rights"
SRC2_URL="https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments"
SRC2_TITLE="Trump's concerning moments raise alarm about fitness and judgment"
SRC3_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC3_TITLE="NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims"
SRC4_URL="https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi"
SRC4_TITLE="Trump, Epstein files, and FBI disclosure conflict"
SRC5_URL="https://www.independent.co.uk/news/world/americas/us-politics/trump-iran-epstein-files-massie-b2930178.html"
SRC5_TITLE="Independent: Iran strikes debate collides with Epstein-file pressure on Trump"

entries=[
{
  "entry_number":1496,
  "title":"Trump's First-100-Days Record Was Framed by Amnesty as a Coordinated Rights Rollback",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's first-100-days assessment described Trump's policy direction as a coordinated rollback of protections rather than isolated incidents. That framing matters because pattern-level harm implies institutional design, not random error. Trump's rights posture was therefore read as strategic governance choice with broad human impact.",
  "rationale":"Amnesty characterized Trump's opening governance period as structured attacks on rights protections.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["first 100 days","rights rollback","institutional design","pattern harm","governance choice"],
  "metrics_key":"rights","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Public Welfare Harm",8,7,8,7,3,3,8,8,"Amnesty described Trump's first-100-days agenda as a coordinated rights rollback.")
},
{
  "entry_number":1497,
  "title":"Trump's Rights Agenda Was Criticized for Targeting Vulnerable Communities at Administrative Speed",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty highlighted the speed and concentration of measures affecting vulnerable groups under Trump's first-100-days agenda. Administrative speed can create cumulative damage before courts or oversight bodies fully react. Trump's execution tempo amplified the practical impact of already severe policy direction.",
  "rationale":"Amnesty stressed that Trump's rapid policy pace intensified harm to vulnerable groups.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["vulnerable communities","administrative speed","cumulative damage","oversight lag","policy concentration"],
  "metrics_key":"rights","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,8,8,"Trump's accelerated policy pace increased rights harms for vulnerable populations.")
},
{
  "entry_number":1498,
  "title":"Trump's First-100-Days Governance Model Prioritized Coercive Control Over Rights Safeguards",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's report argued that Trump's early second-term model prioritized coercive state tools while weakening rights guardrails. This is a high-risk governance design because coercion scales quickly and remedies often lag. Trump's trajectory therefore raised concerns about structural rather than temporary democratic backsliding.",
  "rationale":"Amnesty linked Trump's early governance choices to coercive power expansion and weaker safeguards.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["coercive control","rights safeguards","governance model","democratic backsliding","power expansion"],
  "metrics_key":"rights","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,8,"Trump's first-100-days model emphasized coercive control over rights safeguards.")
},
{
  "entry_number":1499,
  "title":"Trump's Human-Rights Narrative Collided With Amnesty's Pattern-Based Documentation",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's analysis challenged Trump's self-justifying rhetoric by documenting policy effects as a repeating pattern. Pattern-based documentation is difficult to dismiss because it aggregates across agencies and populations. Trump's narrative flexibility narrowed when confronted with rights evidence mapped over time and scope.",
  "rationale":"Amnesty's pattern documentation constrained Trump's ability to frame harms as isolated episodes.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pattern documentation","rights evidence","narrative collision","aggregated harm","time and scope"],
  "metrics_key":"rights","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,8,8,"Amnesty pattern evidence undercut Trump's narrative that rights harms were isolated.")
},
{
  "entry_number":1500,
  "title":"Trump's Opening-Term Rights Shock Created Long-Tail Accountability Risk",
  "date_start":"2025-04-30","date_end":"2025-04-30",
  "synopsis":"Amnesty's first-100-days account suggested harms that extend beyond immediate headlines into legal and institutional aftereffects. Long-tail risk grows when early actions reset enforcement norms and policy baselines. Trump's opening shock therefore increased the probability of prolonged rights litigation and social damage.",
  "rationale":"Amnesty's findings implied Trump's early rights actions would create persistent accountability exposure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["long-tail risk","rights litigation","enforcement norms","policy baseline","accountability exposure"],
  "metrics_key":"rights","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Amnesty International",
  "scores":make_scores("2025-04-30","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,8,"Trump's early rights shock created longer-term accountability and litigation risks.")
},

{
  "entry_number":1501,
  "title":"Trump's 'Concerning Moments' Record Intensified Questions About Judgment Under Pressure",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"The Guardian's reporting cataloged incidents framed as warning signs about Trump's judgment in high-stakes settings. Repeated incidents matter more than any single gaffe because they indicate decision-quality variance under pressure. Trump's pattern increased concern that volatility is a governance trait, not a communication quirk.",
  "rationale":"Guardian's compilation amplified concerns about Trump's consistency and judgment in office.",
  "category":"Authoritarianism","subcategory":"Political Violence / Threats","phase":"White House 2",
  "keywords":["concerning moments","judgment variance","decision quality","volatility pattern","high-stakes behavior"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Political Violence / Threats",8,6,8,7,4,4,8,9,"Guardian's incident pattern raised deeper judgment concerns around Trump.")
},
{
  "entry_number":1502,
  "title":"Trump's Public Conduct Pattern Fed a Broader Competence Crisis in the Presidency",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's timeline argued that Trump's public conduct issues were accumulating into a competence narrative with policy consequences. Competence crises are politically destabilizing because allies, agencies and markets start discounting official signals. Trump's behavior therefore imposed costs that extend beyond image and into state capacity.",
  "rationale":"Guardian linked Trump's conduct pattern to a broader competence and credibility crisis.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["competence crisis","signal discounting","state capacity","conduct pattern","credibility erosion"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Government Corruption","Transparency Obstruction",7,6,8,6,4,4,8,9,"Trump's recurring conduct issues fed a measurable presidential competence crisis.")
},
{
  "entry_number":1503,
  "title":"Trump's Erratic-Moment Narrative Reduced Confidence in Crisis Communications",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's framing of repeated concerning moments suggested that Trump's crisis communications could not be treated as reliably stable inputs. In emergencies, reliability matters as much as policy content because institutions coordinate on leader signals. Trump's erratic pattern increased coordination risk and interpretive noise.",
  "rationale":"Guardian argued Trump's recurring erratic moments undermined confidence in crisis messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["crisis communication","signal reliability","coordination risk","interpretive noise","erratic pattern"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,9,"Trump's erratic communication pattern reduced trust in crisis-time signal reliability.")
},
{
  "entry_number":1504,
  "title":"Trump's Concerning-Moments Timeline Strengthened the Case for Stronger Institutional Guardrails",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"By collecting repeated incidents, Guardian's coverage strengthened arguments for robust guardrails around unilateral executive discretion. Guardrails become essential when leadership volatility is persistent rather than episodic. Trump's trajectory reinforced the need for institutions that can absorb instability without normalizing it.",
  "rationale":"Guardian's pattern view reinforced guardrail arguments against volatility-heavy executive behavior.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["institutional guardrails","executive discretion","volatility persistence","pattern evidence","stability defense"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,9,"Trump's repeated concerning moments strengthened the case for tighter guardrails.")
},
{
  "entry_number":1505,
  "title":"Trump's Behavior Trend Was Cast as a Governance Risk, Not Just a Personal Quirk",
  "date_start":"2026-01-23","date_end":"2026-01-23",
  "synopsis":"Guardian's narrative moved the discussion from personality commentary to governance risk assessment. That shift is critical: when behavior affects predictability, institutions must budget for disruption. Trump's trend line was framed as operational risk to policy continuity and democratic confidence.",
  "rationale":"Guardian's framing treated Trump's behavior as a systemic governance risk.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["governance risk","behavior trend","policy continuity","predictability","systemic disruption"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-01-23","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,7,9,"Trump's behavior was framed as systemic governance risk rather than isolated quirk.")
},

{
  "entry_number":1506,
  "title":"Trump's Name Reentered Epstein-Era Scrutiny Through NPR's Files-and-Accusations Reporting",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's coverage tied new public attention to document releases, allegations and Maxwell-linked context around the Epstein network. Even without final legal resolution, renewed scrutiny can reshape political risk by reopening unresolved credibility questions. Trump's exposure increased as attention shifted from denial loops to document-centered review.",
  "rationale":"NPR reporting renewed document-focused scrutiny around Trump in Epstein-linked narratives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["epstein scrutiny","document release","maxwell context","credibility questions","renewed exposure"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR coverage renewed document-based scrutiny of Trump in Epstein-related context.")
},
{
  "entry_number":1507,
  "title":"Trump's Epstein Response Burden Grew as NPR Framed Claims Alongside Available Records",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's format increased pressure by placing high-impact claims near the documentary record and known procedural gaps. This framing raises the response burden because blanket denial must compete with itemized references and timeline questions. Trump's communications position became harder to sustain without granular rebuttal.",
  "rationale":"NPR's records-linked framing increased evidentiary pressure on Trump's Epstein response.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["response burden","itemized references","timeline questions","granular rebuttal","records framing"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR's records-first framing made Trump's broad denials less durable.")
},
{
  "entry_number":1508,
  "title":"Trump's Epstein Narrative Space Narrowed as Maxwell-Adjacent Context Stayed in Public View",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's reporting kept Maxwell-adjacent context visible while discussing accusations and documentation pathways. Sustained context visibility matters because it limits narrative reset strategies that depend on public memory decay. Trump's room to reframe the issue narrowed as archival threads remained active in coverage.",
  "rationale":"NPR coverage reduced Trump's narrative reset options by sustaining context visibility.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["context visibility","narrative reset","memory decay","archival thread","public view"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Sustained context in NPR reporting narrowed Trump's ability to reset the Epstein narrative.")
},
{
  "entry_number":1509,
  "title":"Trump's Epstein-Related Credibility Risk Increased Under Document-Linked Media Scrutiny",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR emphasized claims in relation to documentary context, which raises reputational stakes even when legal outcomes remain unresolved. In reputation politics, document-linked scrutiny is sticky because it can be revisited as new material surfaces. Trump's credibility risk increased under that persistent audit-like cycle.",
  "rationale":"NPR's document-linked scrutiny intensified Trump's long-run credibility exposure.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["document-linked scrutiny","credibility exposure","reputation politics","persistent cycle","audit-like review"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Document-linked scrutiny in NPR raised Trump's persistent credibility risk.")
},
{
  "entry_number":1510,
  "title":"Trump's Epstein Defense Posture Faced a Stronger Evidence-Demand Environment After NPR Coverage",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's reporting context created an evidence-demand environment where claim rebuttal required detail, chronology and source-level clarity. This is harder than message-cycle defense because audiences can cross-check specifics. Trump's defensive posture therefore encountered a tougher standard than ordinary partisan dispute.",
  "rationale":"NPR coverage raised the evidentiary standard confronting Trump's Epstein defenses.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["evidence demand","chronology clarity","source-level detail","cross-check pressure","defense posture"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Trump's Epstein defenses faced higher evidence-demand standards after NPR reporting.")
},

{
  "entry_number":1511,
  "title":"Trump's Epstein-FBI Conflict Deepened as Guardian Reported Escalating Disclosure Friction",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"The Guardian described rising friction between Trump-world narratives and FBI-related disclosure expectations around Epstein files. Friction at this level shifts the story from scandal commentary to institutional conflict over records handling. Trump's political exposure increased because institutional conflict is harder to mute than partisan argument.",
  "rationale":"Guardian reported escalating Trump-era disclosure friction tied to FBI and Epstein-file handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["disclosure friction","fbi conflict","records handling","institutional conflict","escalating pressure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Guardian's reporting showed Trump-era Epstein disclosure friction intensifying at institutional level.")
},
{
  "entry_number":1512,
  "title":"Trump's Epstein Messaging Faced New Stress as FBI-Related Questions Stayed Unresolved",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's account indicated key questions remained unresolved while political messaging sought closure. Unresolved investigative questions keep issues alive because each new document release can reopen interpretation. Trump's messaging strategy suffered from that reopenability and from unresolved institutional signals.",
  "rationale":"Guardian showed unresolved FBI-linked questions continuing to strain Trump's Epstein messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["unresolved questions","messaging stress","issue reopenability","institutional signal","closure failure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Unresolved FBI-linked questions kept pressure on Trump's Epstein messaging.")
},
{
  "entry_number":1513,
  "title":"Trump's Epstein Transparency Claims Were Undermined by Persistent FBI-Document Tensions",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's reporting highlighted tensions between transparency claims and the practical state of document access and disclosure. This mismatch erodes trust because public promises are measured against release mechanics, not speeches. Trump's transparency line weakened as document tensions persisted in view.",
  "rationale":"Guardian highlighted a gap between Trump's transparency claims and ongoing document tensions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["transparency claim gap","document access","release mechanics","trust erosion","persistent tension"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Persistent FBI-document tensions undercut Trump's transparency claims.")
},
{
  "entry_number":1514,
  "title":"Trump's Epstein Political Strategy Met Institutional Drag as File Disputes Continued",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"As Guardian noted, continuing disputes around Epstein files generated institutional drag that political messaging could not fully absorb. Institutional drag matters because it slows narrative closure and sustains scrutiny across news cycles. Trump's strategy faced a structural problem, not just a temporary headline spike.",
  "rationale":"Guardian's reporting showed continuing file disputes imposing structural drag on Trump's strategy.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["institutional drag","file disputes","narrative closure","sustained scrutiny","structural problem"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Election Interference","Democratic Institution Undermining",7,7,8,7,3,3,8,10,"Continuing Epstein file disputes created institutional drag against Trump's narrative strategy.")
},
{
  "entry_number":1515,
  "title":"Trump's Epstein-Era Accountability Risk Rose as FBI Disclosure Conflict Stayed Active",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"Guardian's coverage suggested the accountability risk had entered an active, recurring phase tied to ongoing disclosure conflict. Active-phase risk is harder to contain because each update can refresh public attention and legal interest. Trump's exposure therefore remained elevated rather than decaying with time.",
  "rationale":"Guardian indicated active disclosure conflict kept Trump's Epstein accountability risk elevated.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["active-phase risk","recurring conflict","public attention refresh","legal interest","elevated exposure"],
  "metrics_key":"epstein","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Active FBI disclosure conflict kept Trump's Epstein accountability exposure elevated.")
},

{
  "entry_number":1516,
  "title":"Trump's Iran Escalation Faced Fresh 'Distraction' Accusations as Epstein Pressure Intensified",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"The Independent reported that Iran-war messaging and Epstein-file pressure were colliding in the same political window, with critics accusing Trump of distraction politics. Whether or not motive is provable, overlap alone increases skepticism and lowers trust in official rationale. Trump's decision space became politically toxic across multiple fronts.",
  "rationale":"Independent coverage linked Trump-era Iran escalation debate to active Epstein-file pressure narratives.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["distraction accusation","overlap skepticism","political window","rationale trust","multi-front pressure"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,4,4,8,10,"Trump's Iran escalation faced distraction accusations amid Epstein-file pressure.")
},
{
  "entry_number":1517,
  "title":"Trump's Iran-Epstein Collision Narrative Magnified Credibility Strain on National-Security Claims",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Independent's framing showed how parallel controversies can magnify credibility strain: security claims are judged in light of domestic scandal pressure. In this environment, even valid security arguments face a trust discount. Trump's credibility deficit therefore increased the burden of proof on every escalation claim.",
  "rationale":"Independent reporting showed scandal overlap increasing skepticism toward Trump's security justifications.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["collision narrative","credibility strain","trust discount","proof burden","security justification"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Scandal-security overlap increased skepticism toward Trump's escalation claims.")
},
{
  "entry_number":1518,
  "title":"Trump's War Messaging Was Refracted Through Epstein-File Politics, Weakening Strategic Clarity",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Independent's analysis suggested that war messaging could not be interpreted in a pure strategic frame once Epstein-file politics remained active. When narratives are refracted through scandal context, policy clarity degrades and polarization intensifies. Trump's communication environment made strategic coherence harder to sustain.",
  "rationale":"Independent described Trump's war messaging being filtered through ongoing Epstein-file controversy.",
  "category":"Foreign Policy","subcategory":"Diplomatic Breakdown","phase":"White House 2",
  "keywords":["strategic clarity","narrative refraction","scandal context","polarization","coherence erosion"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-02","Foreign Policy","Diplomatic Breakdown",8,6,8,6,3,3,8,10,"Trump's war messaging lost clarity as Epstein-file politics shaped interpretation.")
},
{
  "entry_number":1519,
  "title":"Trump's Dual-Crisis Media Cycle Raised the Cost of Narrative Contradictions",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"The Independent highlighted a dual-crisis media cycle where Iran escalation and Epstein disclosures competed for narrative dominance. In that cycle, contradictions are punished faster because cross-issue audiences compare claims in real time. Trump's contradiction risk increased as both fronts remained simultaneously active.",
  "rationale":"Independent's dual-front framing increased penalty for contradictory Trump narratives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["dual-crisis cycle","contradiction cost","cross-issue audience","real-time comparison","narrative penalty"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Dual-crisis scrutiny increased the cost of contradictions in Trump's messaging.")
},
{
  "entry_number":1520,
  "title":"Trump's Iran Escalation Debate Was Pulled Into a Wider Legitimacy Fight by Epstein-File Fallout",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Independent's reporting indicated that legitimacy debates around Trump had fused security policy and disclosure controversy into one evaluative frame. Once fused, policy arguments are judged against character and transparency disputes simultaneously. Trump's legitimacy challenge deepened because neither axis could be isolated from the other.",
  "rationale":"Independent showed Epstein fallout and Iran debate converging into a broader legitimacy contest around Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["legitimacy fight","fused evaluation","security and scandal","character scrutiny","transparency dispute"],
  "metrics_key":"war","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"The Independent",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Iran escalation and Epstein fallout converged into a wider legitimacy crisis for Trump.")
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
