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
    "rights":{
        "impressions":178000000,
        "reach_estimate":611000000,
        "financial_cost_usd":470000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
    "economy":{
        "impressions":169000000,
        "reach_estimate":583000000,
        "financial_cost_usd":650000000,
        "public_reaction":{"negative":76,"neutral":17,"positive":7},
    },
    "epstein":{
        "impressions":176000000,
        "reach_estimate":603000000,
        "financial_cost_usd":320000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
}

SRC_A_URL="https://apnews.com/article/0ace82ca68846109fbf6d30439e6f0f1"
SRC_A_TITLE="Minnesota launches investigation that could bring charges against federal immigration officers"
SRC_B_URL="https://apnews.com/article/cc2ace8576e59d10034e7e525737539d"
SRC_B_TITLE="Federal court rejects Trump administration attempt to slow tariff refund process"
SRC_C_URL="https://apnews.com/article/299d82e8549f4d994dcb081c3876585c"
SRC_C_TITLE="Hillary Clinton testifies she has no information on Epstein's crimes and doesn't recall meeting him"
SRC_D_URL="https://apnews.com/article/9ea23ac5a5ffd1c7b9511e46308e8b21"
SRC_D_TITLE="Bill Clinton says he 'did nothing wrong' with Epstein as he faced grilling over their relationship"
SRC_E_URL="https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994"
SRC_E_TITLE="At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein"

entries=[
{
  "entry_number":1396,
  "title":"Trump's Immigration Crackdown Triggered a Minnesota Probe That Could Lead to Charges Against Federal Officers",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP reported Minnesota authorities opened an investigation that could produce charges against federal immigration officers. The case matters politically because Trump has sold hardline enforcement as disciplined and lawful, yet state-level criminal scrutiny suggests potential operational excess. Under Trump's posture, enforcement intensity increasingly collided with local accountability mechanisms rather than bypassing them.",
  "rationale":"AP reported state-level criminal scrutiny emerging from Trump-era immigration enforcement actions.",
  "category":"Human Rights Violations","subcategory":"Immigration Crackdown","phase":"White House 2",
  "keywords":["Minnesota probe","federal officers","immigration crackdown","state charges","enforcement excess"],
  "metrics_key":"rights","source_url":SRC_A_URL,"source_title":SRC_A_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Immigration Crackdown",8,7,8,7,3,3,7,10,"Trump's enforcement strategy now faces potential criminal exposure at the state level.")
},
{
  "entry_number":1397,
  "title":"Trump's 'Law and Order' Immigration Branding Collided With a State Criminal Inquiry",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"According to AP, the Minnesota investigation introduced direct legal risk for officers operating within Trump's immigration framework. This undercut the administration's claim that aggressive tactics were fully controlled and procedurally clean. Once criminal statutes enter the conversation, narrative framing loses power to procedural evidence.",
  "rationale":"AP's Minnesota case challenged Trump's law-and-order narrative on immigration operations.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["law and order","criminal inquiry","procedural evidence","immigration operations","narrative gap"],
  "metrics_key":"rights","source_url":SRC_A_URL,"source_title":SRC_A_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,7,8,7,3,3,7,10,"A state inquiry into federal officers weakened Trump's law-and-order enforcement narrative.")
},
{
  "entry_number":1398,
  "title":"Trump's Federal Immigration Escalation Produced a High-Visibility State-Federal Legitimacy Clash",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's reporting showed Minnesota asserting investigative authority over federal officer conduct, creating a direct state-federal legitimacy confrontation. These conflicts are politically expensive because they move disputes from policy arguments into prosecutorial arenas. Trump's escalation model increased the chance of exactly this type of constitutional and operational collision.",
  "rationale":"AP showed Trump-era enforcement driving a direct state-federal accountability conflict.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["state-federal clash","investigative authority","constitutional tension","prosecutorial arena","enforcement model"],
  "metrics_key":"rights","source_url":SRC_A_URL,"source_title":SRC_A_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's immigration escalation triggered a state-federal legitimacy confrontation.")
},
{
  "entry_number":1399,
  "title":"Trump's Enforcement-First Strategy Increased Exposure to Rights-Based Litigation and Criminal Review",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's Minnesota story fits a broader pattern: as tactical intensity rises, the legal surface area for rights claims and criminal scrutiny expands. Under Trump, rapid enforcement often arrives before durable legal insulation is tested in local jurisdictions. The result is a cycle where spectacle gains are followed by institutional counterforce.",
  "rationale":"AP case reflected increased legal exposure following Trump-style enforcement acceleration.",
  "category":"Human Rights Violations","subcategory":"Public Welfare Harm","phase":"White House 2",
  "keywords":["rights litigation","criminal review","legal exposure","enforcement acceleration","institutional counterforce"],
  "metrics_key":"rights","source_url":SRC_A_URL,"source_title":SRC_A_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Human Rights Violations","Public Welfare Harm",8,6,8,6,3,3,7,10,"Trump's enforcement-first posture expanded exposure to rights and criminal accountability challenges.")
},
{
  "entry_number":1400,
  "title":"Trump's Immigration Command Narrative Weakened as Local Prosecutorial Risk Entered the Frame",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's report moved the story from policy messaging to prosecutorial possibility, where local facts and evidence standards dominate. This transition matters because Trump's command narrative depends on centralized control optics. State-level inquiry replaces those optics with case-level scrutiny that is harder to spin.",
  "rationale":"AP's Minnesota investigation shifted Trump's immigration narrative into evidence-driven legal terrain.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["local prosecutors","case-level scrutiny","command narrative","evidence standards","control optics"],
  "metrics_key":"rights","source_url":SRC_A_URL,"source_title":SRC_A_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"State prosecutorial risk weakened Trump's centralized immigration-control narrative.")
},

{
  "entry_number":1401,
  "title":"Trump Administration Lost in Court After Trying to Slow Tariff Refunds",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP reported a federal court rejected the Trump administration's attempt to delay tariff refund processing. The ruling converted tariff turbulence from a policy dispute into a concrete fiscal obligation timetable. Trump's legal strategy failed to buy time, increasing pressure on Treasury mechanics and credibility around trade governance claims.",
  "rationale":"AP reported a clear court rejection of Trump's tariff-refund delay strategy.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["tariff refunds","court rejection","delay attempt","trade governance","fiscal obligation"],
  "metrics_key":"economy","source_url":SRC_B_URL,"source_title":SRC_B_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",7,6,8,6,3,3,7,10,"Trump's tariff litigation strategy failed as court rejected refund-delay request.")
},
{
  "entry_number":1402,
  "title":"Trump's Tariff Agenda Entered a Costly Accountability Phase as Refund Timelines Stood",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"With AP confirming the court rebuff, tariff policy costs became more immediate and administratively constrained. Delay tools that might have stretched political runway were curtailed by judicial process. Trump's ability to frame tariffs as consequence-free leverage took another hit.",
  "rationale":"AP ruling forced Trump tariff policy into a more immediate refund-accountability phase.",
  "category":"Grift / Financial Exploitation","subcategory":"Government Resource Abuse","phase":"White House 2",
  "keywords":["refund timeline","judicial curb","policy costs","administrative constraint","tariff agenda"],
  "metrics_key":"economy","source_url":SRC_B_URL,"source_title":SRC_B_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Grift / Financial Exploitation","Government Resource Abuse",7,6,8,6,3,3,7,10,"Court-imposed refund timing increased immediate accountability costs for Trump's tariff program.")
},
{
  "entry_number":1403,
  "title":"Trump's Trade-Law Messaging Collided With a Judge's Refusal to Pause Financial Consequences",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's account showed that while the White House defended tariff authority publicly, the judiciary refused to halt downstream refund obligations. This divergence exposed a recurring Trump pattern: maximal legal confidence rhetoric followed by procedural setbacks. The credibility gap widened as court outcomes constrained executive storytelling.",
  "rationale":"AP highlighted mismatch between Trump trade-law confidence and court procedural outcome.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["trade-law rhetoric","judicial refusal","procedural setback","credibility gap","executive storytelling"],
  "metrics_key":"economy","source_url":SRC_B_URL,"source_title":SRC_B_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,8,6,4,4,8,10,"Trump's legal-confidence messaging clashed with a concrete judicial loss on tariff refunds.")
},
{
  "entry_number":1404,
  "title":"Trump's Tariff Turbulence Became a Court-Managed Administrative Burden",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's ruling coverage illustrated how courts can transform political trade theater into practical compliance burdens. Refund process management, deadlines and disbursement mechanics now carry institutional weight that slogans cannot dissolve. Trump's tariff politics moved deeper into administrative accountability terrain.",
  "rationale":"AP ruling shifted tariff politics from rhetoric toward court-managed administrative compliance.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["court managed","administrative burden","refund mechanics","compliance deadlines","tariff turbulence"],
  "metrics_key":"economy","source_url":SRC_B_URL,"source_title":SRC_B_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,7,10,"Trump tariff rhetoric gave way to court-enforced administrative obligations.")
},
{
  "entry_number":1405,
  "title":"Trump's Attempt to Delay Tariff Refunds Reinforced Perception of Policy Whiplash",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's report fed into a broader narrative that Trump's tariff regime is built on rapid assertions followed by legal and administrative corrections. Each correction cycle increases market uncertainty and weakens trust in policy durability. The denied delay request became another data point in that whiplash pattern.",
  "rationale":"AP court outcome added another episode to Trump tariff-policy whiplash dynamics.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["policy whiplash","market uncertainty","durability trust","correction cycle","tariff regime"],
  "metrics_key":"economy","source_url":SRC_B_URL,"source_title":SRC_B_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",7,6,8,6,3,3,8,10,"Denied delay motion reinforced volatility and trust problems in Trump's tariff program.")
},

{
  "entry_number":1406,
  "title":"Trump-Era Epstein Inquiry Produced No New Clinton Evidence in Hillary Deposition",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"AP reported Hillary Clinton testified she had no information on Epstein's crimes and did not recall meeting him. For Trump-centered politics, the significance was strategic: a hearing line often used to redirect attention yielded limited evidentiary gain. The deposition outcome undercut attempts to convert speculation into decisive documentary breakthrough.",
  "rationale":"AP deposition coverage showed no new Clinton evidence to validate diversionary Epstein narratives.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["Hillary deposition","no new evidence","Epstein inquiry","diversion narrative","hearing outcome"],
  "metrics_key":"epstein","source_url":SRC_C_URL,"source_title":SRC_C_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"Deposition results failed to substantiate high-noise narratives used in Trump-era Epstein politics.")
},
{
  "entry_number":1407,
  "title":"Trump's Political Deflection Lane Narrowed After Hillary Clinton's Limited-Evidence Epstein Testimony",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"AP's account indicated the testimony did not provide explosive material to re-center accountability away from Trump-adjacent pressure points. In information strategy terms, failed diversion attempts are costly because they consume attention without producing legitimizing facts. The net effect was more noise with little evidentiary displacement.",
  "rationale":"AP testimony outcome limited efficacy of Trump-oriented deflection narratives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["deflection lane","evidentiary displacement","attention cost","limited testimony","noise without proof"],
  "metrics_key":"epstein","source_url":SRC_C_URL,"source_title":SRC_C_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Hillary deposition produced little new evidence, reducing value of Trump-era diversion tactics.")
},
{
  "entry_number":1408,
  "title":"Trump-Era Epstein Oversight Continued to Generate More Spectacle Than New Facts in Clinton Testimony",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"AP's report reinforced a recurrent pattern: high-profile testimony generates broad coverage but limited fact expansion when questioning themes outrun documentary grounding. Under Trump's media climate, spectacle tends to dominate before evidentiary sorting catches up. This hearing cycle followed that script.",
  "rationale":"AP showed high-visibility hearing energy with low incremental factual yield.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["spectacle vs facts","high-profile testimony","documentary grounding","media climate","incremental yield"],
  "metrics_key":"epstein","source_url":SRC_C_URL,"source_title":SRC_C_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-26","Election Interference","Democratic Institution Undermining",7,7,7,7,3,4,8,10,"A high-profile hearing cycle produced coverage volume without strong incremental evidence.")
},
{
  "entry_number":1409,
  "title":"Trump's Narrative Ecosystem Faced Another Evidence Gap as Clinton Epstein Claims Stayed Unproved",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"AP's testimony summary emphasized absence of recalled meetings and direct knowledge claims. In Trump's narrative ecosystem, sustained allegation loops can survive without proof, but each unproductive hearing event still widens the gap between claim intensity and verified fact. That gap erodes institutional confidence over time.",
  "rationale":"AP deposition details reinforced persistent claim-versus-proof imbalance.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["evidence gap","claim intensity","verified fact","institutional confidence","allegation loop"],
  "metrics_key":"epstein","source_url":SRC_C_URL,"source_title":SRC_C_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-26","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"Claim intensity remained high while Clinton testimony added little verified support.")
},
{
  "entry_number":1410,
  "title":"Trump-Centric Epstein Politics Kept Consuming Oversight Capacity Without Equivalent Evidentiary Return",
  "date_start":"2026-02-26","date_end":"2026-02-26",
  "synopsis":"AP's deposition coverage showed how institutional bandwidth can be spent heavily even when factual output stays narrow. In a system already overloaded by conflict and scandal, this imbalance has governance costs: oversight attention fragments while high-confidence conclusions remain out of reach. Trump's information environment thrives in that fragmentation.",
  "rationale":"AP highlighted oversight-capacity drain relative to factual yield in Epstein hearing cycles.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["oversight capacity","factual yield","attention fragmentation","governance cost","information environment"],
  "metrics_key":"epstein","source_url":SRC_C_URL,"source_title":SRC_C_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-26","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Oversight attention expanded faster than evidence accumulation in Trump-era Epstein politics.")
},

{
  "entry_number":1411,
  "title":"Trump's Claim That Epstein Stole Mar-a-Lago Staff Was Disputed in Bill Clinton Deposition Context",
  "date_start":"2026-02-27","date_end":"2026-02-27",
  "synopsis":"AP reported Bill Clinton rebutted an allegation Trump had circulated about Epstein poaching Mar-a-Lago employees. Whether or not the claim changes core legal questions, the episode highlighted Trump's tendency to introduce attention-grabbing side narratives during high-pressure scrutiny cycles. The rebuttal added friction to his credibility profile.",
  "rationale":"AP deposition context included a direct rebuttal to a Trump-circulated claim.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["Mar-a-Lago claim","staff poaching","rebuttal","credibility profile","side narrative"],
  "metrics_key":"epstein","source_url":SRC_D_URL,"source_title":SRC_D_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-27","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"A deposition-context rebuttal undercut a Trump-circulated Epstein-related claim.")
},
{
  "entry_number":1412,
  "title":"Trump's Epstein Deflection Playbook Faced Resistance as Testimony Focused on Verifiable Details",
  "date_start":"2026-02-27","date_end":"2026-02-27",
  "synopsis":"AP's Bill Clinton deposition report showed questioning that returned to verifiable relationship facts rather than fully accepting politically useful side stories. In Trump's media strategy, deflection works best when unverifiable assertions dominate. Here, testimony structure partially constrained that dynamic.",
  "rationale":"AP deposition framing reduced space for unverified Trump-friendly deflection narratives.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["deflection playbook","verifiable details","testimony structure","side stories","media strategy"],
  "metrics_key":"epstein","source_url":SRC_D_URL,"source_title":SRC_D_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-27","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Deposition focus on verifiable details constrained deflection dynamics in Trump-era Epstein politics.")
},
{
  "entry_number":1413,
  "title":"Trump's Effort to Reframe Epstein Fallout Around Rival Figures Produced Limited Documentary Gain",
  "date_start":"2026-02-27","date_end":"2026-02-27",
  "synopsis":"AP's reporting indicated the hearing generated headlines but limited novel evidence supporting broad rival-focused theories. In practical terms, reframing attempts without equivalent documents can temporarily redirect attention but rarely settle accountability disputes. Trump's reframing tactic again met evidentiary limits.",
  "rationale":"AP hearing output showed headline volume without decisive rival-focused evidentiary breakthroughs.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["reframing tactic","rival figures","documentary gain","headline volume","evidentiary limits"],
  "metrics_key":"epstein","source_url":SRC_D_URL,"source_title":SRC_D_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-27","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"Trump-focused reframing around rivals yielded limited documentary progress.")
},
{
  "entry_number":1414,
  "title":"Trump-Era Hearing Optics Again Outran Hard Proof in the Bill Clinton Epstein Session",
  "date_start":"2026-02-27","date_end":"2026-02-27",
  "synopsis":"AP's session summary showed another mismatch between optical intensity and evidentiary accumulation. This pattern contributes to public fatigue and cynicism because each cycle appears dramatic yet inconclusive. In Trump's communication environment, unresolved intensity often becomes a political asset by itself.",
  "rationale":"AP session details reflected high drama but limited proof progression under Trump-era optics.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["optics vs proof","public fatigue","inconclusive cycle","dramatic session","political asset"],
  "metrics_key":"epstein","source_url":SRC_D_URL,"source_title":SRC_D_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-27","Election Interference","Democratic Institution Undermining",7,7,7,7,3,4,8,10,"High-intensity hearing optics again exceeded concrete evidentiary progress.")
},
{
  "entry_number":1415,
  "title":"Trump's Broader Epstein Credibility Problem Persisted Despite Rival-Centered Hearing Theater",
  "date_start":"2026-02-27","date_end":"2026-02-27",
  "synopsis":"Even with broad coverage, AP's Bill Clinton deposition story did not remove underlying questions about record completeness and disclosure handling in Trump's political context. The theater-to-resolution ratio remained low. Trump's credibility burden therefore persisted across yet another high-attention hearing cycle.",
  "rationale":"AP hearing aftermath did not resolve core credibility questions in Trump-era Epstein handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["credibility burden","record completeness","disclosure handling","theater ratio","hearing aftermath"],
  "metrics_key":"epstein","source_url":SRC_D_URL,"source_title":SRC_D_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-27","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Another high-profile hearing failed to clear core credibility questions around Epstein files.")
},

{
  "entry_number":1416,
  "title":"At Least 16 Epstein-Related Files Vanished From a DOJ Webpage During Trump's Second-Term Climate",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP reported that at least 16 files disappeared from a DOJ webpage hosting Epstein-related records. In any politically sensitive archive, removal events trigger immediate chain-of-custody concerns. Under Trump's transparency rhetoric, the disappearance intensified suspicion that document governance was being managed inconsistently.",
  "rationale":"AP documented missing Epstein-related DOJ webpage files during Trump's term context.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["missing files","DOJ webpage","chain of custody","archive integrity","transparency rhetoric"],
  "metrics_key":"epstein","source_url":SRC_E_URL,"source_title":SRC_E_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"AP found multiple Epstein-related files missing from a DOJ public document page.")
},
{
  "entry_number":1417,
  "title":"Trump-Era Claims of Full Epstein Transparency Clashed With DOJ Webpage File Disappearances",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's missing-file report created a direct contradiction between closure messaging and repository integrity. When records vanish from public portals, the burden shifts to officials to prove version history and explain access controls. Trump's certainty framing weakened as technical-document integrity questions multiplied.",
  "rationale":"AP missing-file report contradicted Trump's certainty framing on Epstein disclosure completeness.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["full transparency claim","repository integrity","version history","access controls","certainty framing"],
  "metrics_key":"epstein","source_url":SRC_E_URL,"source_title":SRC_E_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Missing DOJ files undermined certainty claims about complete Epstein transparency.")
},
{
  "entry_number":1418,
  "title":"Trump's Epstein File Management Faced New Obstruction Suspicions After DOJ Portal Gaps Appeared",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's finding of missing documents did not by itself prove motive, but it did raise obstruction suspicion because disappearance events in sensitive cases demand immediate and auditable explanations. Under Trump-era pressure politics, unexplained gaps are interpreted as intent even before formal findings emerge. That trust erosion is itself consequential.",
  "rationale":"AP's missing-file finding escalated obstruction suspicion and trust erosion in Epstein handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["obstruction suspicion","portal gaps","auditable explanation","trust erosion","sensitive cases"],
  "metrics_key":"epstein","source_url":SRC_E_URL,"source_title":SRC_E_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Unexplained DOJ portal gaps intensified obstruction concerns in Trump-era Epstein file governance.")
},
{
  "entry_number":1419,
  "title":"Trump-Era Epstein Disclosures Entered a Chain-of-Custody Credibility Crisis",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"AP's report moved public debate into a technical but critical area: chain-of-custody reliability for released records. Without stable inventories and transparent remediation logs, every future disclosure carries reduced trust weight. Trump's political ecosystem, already saturated with competing claims, amplified that credibility crisis.",
  "rationale":"AP reporting pushed Epstein transparency debate into chain-of-custody reliability concerns.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain of custody","inventory reliability","remediation logs","disclosure trust","credibility crisis"],
  "metrics_key":"epstein","source_url":SRC_E_URL,"source_title":SRC_E_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,9,"Missing files triggered a chain-of-custody crisis in Epstein disclosure credibility.")
},
{
  "entry_number":1420,
  "title":"Trump's Epstein Accountability Exposure Grew as DOJ Webpage Removals Became Public",
  "date_start":"2025-12-20","date_end":"2025-12-20",
  "synopsis":"Once AP publicized the missing-file count, the issue moved from niche monitoring to national narrative. In that shift, Trump's exposure increased because document-governance failures can reinforce broader accusations of selective release and narrative manipulation. The removals became a structural credibility liability, not a minor technical glitch.",
  "rationale":"AP's publication of missing-file counts increased political accountability pressure on Trump-era disclosure handling.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["accountability exposure","selective release","narrative manipulation","file count","credibility liability"],
  "metrics_key":"epstein","source_url":SRC_E_URL,"source_title":SRC_E_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2025-12-20","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,9,"Publicized DOJ file removals expanded accountability risk around Trump-era Epstein disclosures.")
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
