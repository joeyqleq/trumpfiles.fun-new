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
        "impressions":204000000,
        "reach_estimate":714000000,
        "financial_cost_usd":1290000000,
        "public_reaction":{"negative":81,"neutral":13,"positive":6},
    },
    "epstein":{
        "impressions":179000000,
        "reach_estimate":617000000,
        "financial_cost_usd":350000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
    "governance":{
        "impressions":163000000,
        "reach_estimate":559000000,
        "financial_cost_usd":390000000,
        "public_reaction":{"negative":77,"neutral":16,"positive":7},
    },
    "promise":{
        "impressions":152000000,
        "reach_estimate":533000000,
        "financial_cost_usd":210000000,
        "public_reaction":{"negative":75,"neutral":18,"positive":7},
    },
}

SRC1_URL="https://www.rollingstone.com/politics/political-commentary/trump-war-iran-lies-fantasies-1235524016/"
SRC1_TITLE="Trump's Iran War Is Built on Lies and Fantasies"
SRC2_URL="https://www.theguardian.com/us-news/2026/mar/02/trump-war-iran"
SRC2_TITLE="Trump says Iran war to last four to five weeks but could go far longer"
SRC3_URL="https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell"
SRC3_TITLE="Justice Department withheld and removed some Epstein files related to Trump"
SRC4_URL="https://www.pbs.org/newshour/politics/checks-and-balances-arent-working-under-trump-growing-majority-says"
SRC4_TITLE="Checks and balances aren't working under Trump, growing majority says"
SRC5_URL="https://apnews.com/projects/trump-campaign-promise-tracker/"
SRC5_TITLE="Tracking Trump's presidential promises"

entries=[
{
  "entry_number":1421,
  "title":"Trump's Iran War Pitch Was Framed as Built on Contradictions and Fantasies",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"A Rolling Stone analysis argued Trump's war case leaned on unstable assumptions and inconsistent narratives, questioning whether policy claims matched operational reality. While interpretive, the piece tracked a broader pattern already visible in reporting: strong certainty language with weak end-state definition. Under Trump's model, confidence messaging repeatedly outpaced strategic coherence.",
  "rationale":"Rolling Stone analysis argued Trump's war narrative relied on contradictions and weak strategic grounding.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["war pitch","contradictions","strategic grounding","narrative certainty","end-state"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Commentary framed Trump's Iran-war narrative as inconsistent and weakly grounded.")
},
{
  "entry_number":1422,
  "title":"Trump's Iran Messaging Was Criticized for Lacking a Clear and Credible Endgame",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone's critique centered on endgame opacity: escalating force without a publicly stable pathway to resolution. In high-risk conflicts, missing end-state logic amplifies casualty, market and alliance uncertainty. Trump again appeared to prioritize immediate posture dominance over a transparent completion strategy.",
  "rationale":"Rolling Stone emphasized Trump endgame ambiguity as a central war-risk amplifier.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["endgame ambiguity","resolution pathway","risk amplifier","posture dominance","completion strategy"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump's war posture drew criticism for lacking a credible public end-state plan.")
},
{
  "entry_number":1423,
  "title":"Trump's Iran Escalation Narrative Was Criticized as Theater-First and Strategy-Second",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The Rolling Stone piece argued Trump's communications prioritized performance impact over analytical clarity, reflecting a broader governance tendency toward headline control. In war conditions, theater-heavy messaging can create policy volatility because objectives become redefined by the next media cycle. That dynamic raises the risk of escalation without cumulative strategic discipline.",
  "rationale":"Rolling Stone criticized Trump's communication style as theatrical relative to strategic rigor.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["theater first","strategy second","headline control","policy volatility","media cycle"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,8,10,"Critique portrayed Trump's war messaging as theatrical and strategically unstable.")
},
{
  "entry_number":1424,
  "title":"Trump's Iran War Justification Faced Fresh Credibility Stress From Independent Commentary",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Even as opinion journalism remains interpretive, the Rolling Stone analysis echoed concerns from hard-news timelines about inconsistent rationale and uncertain mission limits. When critiques from different formats converge, political credibility pressure compounds. Trump's narrative-control approach encountered that convergence in real time.",
  "rationale":"Cross-format commentary added credibility pressure to Trump's evolving Iran rationale.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["credibility stress","independent commentary","rationale consistency","mission limits","convergence"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,8,10,"Independent commentary convergence increased scrutiny on Trump's war justification claims.")
},
{
  "entry_number":1425,
  "title":"Trump's Iran Narrative Was Portrayed as a High-Risk Mix of Overconfidence and Under-Specified Objectives",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"Rolling Stone argued Trump's war case fused certainty-heavy language with underdeveloped endpoint logic. That combination is dangerous in a conflict environment where adversaries respond to perceived intent, not only stated limits. Trump's rhetorical asymmetry looked strong on certainty and weak on operational closure.",
  "rationale":"Analysis portrayed Trump's war narrative as overconfident but under-specified on objectives.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["overconfidence","under-specified objectives","intent signaling","operational closure","rhetorical asymmetry"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"Rolling Stone",
  "scores":make_scores("2026-03-03","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump's war framing combined high certainty with weakly specified objective closure.")
},

{
  "entry_number":1426,
  "title":"Trump Said Iran War Could Last Four to Five Weeks and Might Run Far Longer",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"The Guardian reported Trump publicly acknowledged a multi-week timeline and added that the conflict could extend beyond that estimate. The statement shifted expectations from limited strike logic to open-duration conflict management. Under Trump's leadership, the timeline admission increased pressure for clearer congressional and allied accountability.",
  "rationale":"Guardian reported Trump extending public expectations toward a potentially open-ended war horizon.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["four to five weeks","far longer","open duration","timeline admission","conflict horizon"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,7,10,"Trump publicly shifted the war horizon toward potentially prolonged conflict.")
},
{
  "entry_number":1427,
  "title":"Trump's Extended War-Horizon Statement Undercut Earlier Impressions of Tight Mission Bounds",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"As the Guardian noted, Trump's own language moved beyond short-cycle operation framing. Timeline elasticity is politically costly when prior messaging implied narrower exposure. The admission reinforced criticism that strategic limits were being discovered on the fly rather than defined up front.",
  "rationale":"Guardian timeline quote challenged perceptions of tightly bounded Trump war planning.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["mission bounds","timeline elasticity","strategic limits","discovered on the fly","planning clarity"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,8,10,"Trump's timeline expansion conflicted with prior impressions of bounded conflict design.")
},
{
  "entry_number":1428,
  "title":"Trump's 'Far Longer' Caveat Intensified Public Anxiety Around Escalation Trajectory",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Guardian coverage showed how one phrase can reset risk perception: \"far longer\" signals uncertainty where reassurance had been expected. In wartime politics, duration uncertainty feeds market nervousness, alliance caution and domestic frustration simultaneously. Trump's wording widened all three channels at once.",
  "rationale":"Guardian reporting indicated Trump's own wording amplified conflict-duration anxiety.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["far longer caveat","duration anxiety","risk perception","alliance caution","market nervousness"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-03-02","Foreign Policy","Economic Warfare",8,6,9,6,3,3,7,10,"Trump's duration caveat elevated risk perception across political and economic channels.")
},
{
  "entry_number":1429,
  "title":"Trump's Multi-Week War Forecast Renewed Questions About Congressional Authorization Scope",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"The Guardian's timeline reporting made a core constitutional issue sharper: prolonged operations generally demand stronger and clearer democratic authorization. Trump's extension language moved the debate from tactical necessity to mandate durability. That shift increased pressure on institutional checks he has frequently tested.",
  "rationale":"Guardian timeline context intensified mandate and authorization scrutiny of Trump's war posture.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["authorization scope","congressional mandate","multi-week forecast","constitutional issue","institutional checks"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's extended timeline renewed scrutiny over democratic authorization boundaries.")
},
{
  "entry_number":1430,
  "title":"Trump's War-Duration Language Suggested Strategy Was Still Being Defined Mid-Escalation",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"Guardian reporting implied the administration's duration expectations were conditional and evolving. In crisis management, evolving horizons can signal adaptability, but they can also signal under-specified planning. Under Trump, that ambiguity compounded skepticism about whether escalation was governing strategy or reactive momentum.",
  "rationale":"Guardian timeline wording suggested Trump strategy remained fluid during active escalation.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["mid-escalation definition","conditional horizon","adaptive vs underplanned","reactive momentum","strategy fluidity"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"The Guardian",
  "scores":make_scores("2026-03-02","Authoritarianism","Government Power Abuse",8,6,8,7,3,3,8,10,"Trump's timeline language suggested strategic definition was still fluid mid-conflict.")
},

{
  "entry_number":1431,
  "title":"Trump-Related Epstein Files Were Reportedly Removed or Withheld by DOJ, NPR Reported",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR reported DOJ had withheld and removed certain Epstein-related files tied to accusations involving Trump. The issue escalated from rumor to process scrutiny because record availability itself became contested. In politically toxic cases, contested availability often matters as much as contested interpretation.",
  "rationale":"NPR reported document availability problems in Trump-related Epstein file handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["withheld files","removed files","DOJ handling","availability dispute","process scrutiny"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR reported withheld and removed records in Trump-related Epstein file handling.")
},
{
  "entry_number":1432,
  "title":"Trump's Public Exoneration Messaging Was Undermined by NPR's Reporting on Missing Epstein Documents",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's account introduced evidence that the records environment was incomplete, cutting against certainty-heavy exoneration claims. In disclosure politics, certainty without document stability rarely holds under scrutiny. Trump's credibility burden rose as file-governance questions multiplied.",
  "rationale":"NPR record-handling report weakened certainty claims around Trump-Epstein file closure.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["exoneration messaging","document instability","credibility burden","file governance","closure claim"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"NPR's missing-file reporting undercut Trump's certainty framing around Epstein records.")
},
{
  "entry_number":1433,
  "title":"Trump-Era Epstein Archive Handling Became a Chain-of-Custody Debate, Not Just a Political One",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's report shifted attention to technical accountability: what was removed, what stayed, and who controlled transitions. That shift matters because chain-of-custody failures can invalidate confidence regardless of partisan narrative wins. Trump's political environment made technical integrity a frontline issue.",
  "rationale":"NPR reframed Trump-Epstein controversy into chain-of-custody and archival-control questions.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["chain of custody","archival control","technical accountability","record transitions","integrity"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"NPR reporting pushed the dispute toward technical record-integrity accountability.")
},
{
  "entry_number":1434,
  "title":"Trump-Focused Epstein Coverage Entered a New Phase Where File Governance Became Central Evidence",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR highlighted that governance of records, not only their contents, had become central to evaluating truth claims. In this phase, procedural errors function as substantive political facts. Trump's narrative advantage weakened because procedure itself now generated adverse headlines.",
  "rationale":"NPR showed file-governance procedure becoming central evidence in Trump-Epstein reporting.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["file governance","procedural facts","content vs process","adverse headlines","evaluation phase"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Procedural file-governance issues became core evidence in Trump-related Epstein coverage.")
},
{
  "entry_number":1435,
  "title":"Trump's Information Strategy Faced a Structural Problem: You Can't Message Around Missing Files Forever",
  "date_start":"2026-02-24","date_end":"2026-02-24",
  "synopsis":"NPR's reporting reinforced a structural constraint: messaging can dominate a cycle, but missing-record questions persist until auditable answers are provided. In prolonged controversies, unresolved process holes accumulate and eventually overpower rhetorical control. Trump's approach met that structural limit again in Epstein coverage.",
  "rationale":"NPR reporting underscored limits of narrative control when record gaps remain unresolved.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["structural limit","missing files","auditable answers","rhetorical control","process holes"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"NPR",
  "scores":make_scores("2026-02-24","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Missing-file questions exposed limits of Trump's message-control strategy.")
},

{
  "entry_number":1436,
  "title":"A Growing Majority Said Checks and Balances Were Not Working Under Trump, PBS Reported",
  "date_start":"2026-02-23","date_end":"2026-02-23",
  "synopsis":"PBS reported polling showing more Americans believed constitutional guardrails were failing under Trump. This perception is politically significant because legitimacy depends on confidence in institutions even when outcomes are contested. Trump's concentration of executive posture amplified public concern about balance erosion.",
  "rationale":"PBS polling showed rising concern that checks and balances were failing under Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["checks and balances","polling majority","institutional confidence","balance erosion","executive posture"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-02-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"PBS polling indicated growing public belief that democratic guardrails were failing under Trump.")
},
{
  "entry_number":1437,
  "title":"Trump's Governance Style Was Increasingly Seen as Overrunning Institutional Counterweights",
  "date_start":"2026-02-23","date_end":"2026-02-23",
  "synopsis":"PBS's findings suggested voters were not merely polarized on policy outcomes, but increasingly worried about structural power concentration. When counterweight confidence declines, every executive action faces a legitimacy discount. Trump's governing approach appeared to accelerate that discount.",
  "rationale":"PBS findings linked Trump leadership style with perceived counterweight weakening.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["institutional counterweights","power concentration","legitimacy discount","governance style","public concern"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-02-23","Authoritarianism","Government Power Abuse",8,7,8,8,3,3,8,10,"Public perception increasingly tied Trump's leadership to weakened institutional counterweights.")
},
{
  "entry_number":1438,
  "title":"Trump's Approval Debate Was Overtaken by a Deeper Fear: That Systemic Guardrails Were Slipping",
  "date_start":"2026-02-23","date_end":"2026-02-23",
  "synopsis":"PBS polling reframed the conversation from day-to-day approval into constitutional durability concerns. This shift matters because it outlasts single news cycles and influences long-term trust in democratic procedures. Under Trump, that deeper layer of anxiety became more visible.",
  "rationale":"PBS polling shifted focus from short-term approval to constitutional durability concerns.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["constitutional durability","approval vs guardrails","long-term trust","democratic procedures","systemic fear"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-02-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"PBS data highlighted systemic guardrail fears beyond routine Trump approval swings.")
},
{
  "entry_number":1439,
  "title":"Trump's Crisis-Heavy Agenda Reinforced Public Belief That Oversight Institutions Were Losing Ground",
  "date_start":"2026-02-23","date_end":"2026-02-23",
  "synopsis":"PBS reported growing public pessimism about institutional balance amid a period dominated by overlapping controversies and executive assertiveness. In such conditions, perception can become self-reinforcing: lower trust weakens compliance and raises governance friction. Trump's agenda operated inside that escalating loop.",
  "rationale":"PBS reported rising public pessimism about oversight strength during Trump's tenure.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["oversight institutions","public pessimism","executive assertiveness","governance friction","trust loop"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-02-23","Government Corruption","Transparency Obstruction",7,6,8,7,3,3,8,10,"Public trust in oversight institutions weakened during Trump's crisis-heavy governance cycle.")
},
{
  "entry_number":1440,
  "title":"Trump Faced a Structural Legitimacy Headwind as More Voters Questioned Democratic Balance",
  "date_start":"2026-02-23","date_end":"2026-02-23",
  "synopsis":"The PBS poll pointed to a structural issue: once voters believe checks and balances are failing, policy persuasion alone cannot restore legitimacy. Institutional reassurance requires behavior change and visible constraints. Trump's confrontational approach made that repair pathway harder.",
  "rationale":"PBS poll signaled structural legitimacy challenges beyond immediate policy disputes under Trump.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["structural legitimacy","voter concern","democratic balance","repair pathway","visible constraints"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"PBS NewsHour",
  "scores":make_scores("2026-02-23","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Growing voter concern over balance created a structural legitimacy headwind for Trump.")
},

{
  "entry_number":1441,
  "title":"AP Promise Tracker Continued to Show Trump With More Unresolved Items Than Clear Completions",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"The AP tracker remained a direct empirical check on Trump's sweeping delivery claims, with unresolved categories still dominating. This matters because the dashboard records execution status rather than campaign intensity. Trump's rhetorical certainty continued to exceed his documented completion profile.",
  "rationale":"AP tracker data continued to undercut broad Trump claims of comprehensive promise delivery.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["promise tracker","unresolved items","delivery profile","empirical check","rhetorical certainty"],
  "metrics_key":"promise","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"AP tracker still showed Trump's unresolved promises outweighing completed ones.")
},
{
  "entry_number":1442,
  "title":"Trump's 'I Kept All My Promises' Line Stayed Incompatible With AP's Category Breakdown",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's categorized status view continued to show in-progress and complicated buckets that do not align with all-kept framing. In political communication, absolutist claims are fragile against transparent dashboards. Trump's absolutism repeatedly collided with measurable status granularity.",
  "rationale":"AP category status remained incompatible with Trump's all-kept absolutist framing.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["all kept claim","category breakdown","in progress bucket","complicated bucket","status granularity"],
  "metrics_key":"promise","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"Trump's all-kept claim remained incompatible with AP tracker category outcomes.")
},
{
  "entry_number":1443,
  "title":"Trump's Signature Immigration and Trade Pledges Remained Clustered in Non-Final Statuses",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP tracking showed that high-salience agenda items continued to sit in in-progress or complicated states. This pattern matters because political brand strength depends most on flagship promises, not peripheral wins. Trump's core-brand execution remained uneven on the scoreboard that voters can inspect directly.",
  "rationale":"AP tracker continued to show flagship Trump promises clustered in unresolved statuses.",
  "category":"Foreign Policy","subcategory":"Economic Warfare","phase":"White House 2",
  "keywords":["flagship promises","immigration status","trade status","core brand","scoreboard"],
  "metrics_key":"promise","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Foreign Policy","Economic Warfare",7,5,7,6,3,3,7,10,"Flagship Trump promises remained concentrated in non-final AP tracker categories.")
},
{
  "entry_number":1444,
  "title":"Trump's Delivery Narrative Continued to Depend on Selective Wins Rather Than Overall Tracker Balance",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's dashboard structure makes selective emphasis obvious: isolated kept items can be highlighted while aggregate unresolved load remains high. Trump's messaging strategy has repeatedly leaned on those highlight clips. But the full tracker balance still points to execution drag.",
  "rationale":"AP full-board view contrasted with Trump's selective-win delivery narrative.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["selective wins","full-board view","execution drag","delivery narrative","aggregate load"],
  "metrics_key":"promise","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Government Corruption","Transparency Obstruction",6,5,7,6,3,3,7,10,"Selective promise wins did not erase unresolved aggregate execution status on AP tracker.")
},
{
  "entry_number":1445,
  "title":"Trump's Promise Scoreboard Still Showed a Gap Between Campaign Certainty and Governing Throughput",
  "date_start":"2026-03-03","date_end":"2026-03-03",
  "synopsis":"AP's tracker continued to function as a quantitative reality check on Trump-era claim volume. Certainty in campaign language has remained high, while governing throughput across major categories has been mixed. The persistent gap is now a structural feature, not a one-week anomaly.",
  "rationale":"AP tracker continued to document a durable certainty-versus-throughput gap under Trump.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["campaign certainty","governing throughput","quantitative check","durable gap","promise scoreboard"],
  "metrics_key":"promise","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-03","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,4,8,10,"Trump's campaign certainty continued to outpace documented governing throughput.")
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
