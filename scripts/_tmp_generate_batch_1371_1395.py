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
        "impressions":201000000,
        "reach_estimate":705000000,
        "financial_cost_usd":1240000000,
        "public_reaction":{"negative":80,"neutral":14,"positive":6},
    },
    "governance":{
        "impressions":160000000,
        "reach_estimate":548000000,
        "financial_cost_usd":360000000,
        "public_reaction":{"negative":77,"neutral":16,"positive":7},
    },
    "epstein":{
        "impressions":173000000,
        "reach_estimate":596000000,
        "financial_cost_usd":290000000,
        "public_reaction":{"negative":79,"neutral":15,"positive":6},
    },
}

SRC1_URL="https://apnews.com/article/6c602da7d44cb8c34fa1a9f85f352e4a"
SRC1_TITLE="From doubts about nuke talks to an Air Force One flight, what led up to Trump's order to strike Iran"
SRC2_URL="https://apnews.com/article/5357243212b4b8bbd387ae91ca797325"
SRC2_TITLE="In Their Words: How Trump's and his administration's statements on Iran evolved and conflicted"
SRC3_URL="https://apnews.com/article/793e47b09863f5a55e54040c891291d8"
SRC3_TITLE="Justice Department says it's reviewing whether any Epstein-related records were mistakenly withheld"
SRC4_URL="https://apnews.com/article/e8f367497c26ceb6b055f9c354833b82"
SRC4_TITLE="How the AP decided to call fighting in the Middle East the 'Iran war'"
SRC5_URL="https://apnews.com/article/3d5cf44a6b2f5c0333e41a3e3f86c06c"
SRC5_TITLE="Lawmakers finally questioned the Clintons about Epstein. They also asked about pizzagate and UFOs"

entries=[
{
  "entry_number":1371,
  "title":"Trump Went From Criticizing Iran Talks to Ordering Strikes in a Compressed Decision Window",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's chronology showed Trump moving rapidly from public frustration with negotiations to a direct strike order. The compressed timeline mattered because speed can reduce institutional friction, narrowing space for congressional consultation and allied deliberation. In practice, Trump's shift made strategic escalation look less like a last-resort sequence and more like a fast political-executive pivot under pressure.",
  "rationale":"AP chronology showed Trump pivoting from talks criticism to strikes with unusual speed.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["compressed window","talks to strikes","executive pivot","timeline shift","war decision"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump moved from negotiation criticism to strike authorization in a compressed sequence.")
},
{
  "entry_number":1372,
  "title":"Trump Used an Air Force One Travel Window as a Critical Iran Strike Decision Node",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP reported an Air Force One segment became central to the lead-up before Trump ordered strikes. That detail underscores how high-impact military decisions can be made within tightly controlled executive environments rather than open institutional settings. Under Trump's style, mobility and message control converged, leaving outsiders to reconstruct decision logic after the fact.",
  "rationale":"AP identified Trump's Air Force One timeline as a key pre-strike decision context.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["Air Force One","decision node","closed process","executive control","pre-strike"],
  "metrics_key":"governance","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Authoritarianism","Government Power Abuse",7,6,8,7,3,3,7,10,"Trump's strike timeline emphasized closed executive decision mechanics over open process.")
},
{
  "entry_number":1373,
  "title":"Trump's Pre-Strike Process Raised Questions About How Much Institutional Debate Actually Occurred",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's lead-up reporting highlighted the sequencing but left unresolved how broadly strategic alternatives were stress-tested before Trump acted. That ambiguity is politically important: in fast war decisions, process legitimacy can be as consequential as operational outcome. Trump's pattern again privileged acceleration and message certainty over transparent procedural evidence.",
  "rationale":"AP timeline detail intensified scrutiny over the depth of pre-strike institutional review.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["institutional debate","process legitimacy","alternative review","decision transparency","war powers"],
  "metrics_key":"governance","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,7,10,"Trump's escalation timeline left open major questions about institutional decision depth.")
},
{
  "entry_number":1374,
  "title":"Trump Reframed Diplomatic Friction as a Trigger for Immediate Force Rather Than Extended Negotiation",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"In AP's chronology, dissatisfaction with talks preceded a rapid move to military action. Friction in diplomacy is common, but Trump's conversion of negotiating frustration into force accelerated escalation risk and narrowed off-ramps. The sequence reinforced concerns that his threshold for military transition was politically and rhetorically low.",
  "rationale":"AP sequence suggested Trump converted negotiation frustration into rapid force authorization.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["diplomatic friction","force threshold","off-ramps","rapid transition","escalation risk"],
  "metrics_key":"war","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump shifted from diplomatic dissatisfaction to force faster than expected.")
},
{
  "entry_number":1375,
  "title":"Trump's Iran Timeline Showed Strategy by Momentum, Not a Publicly Stable Doctrine",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's reconstruction made clear that narrative momentum and event acceleration drove the cycle as much as any clearly articulated doctrine. Under Trump, each new statement appeared to re-weight the strategic path in real time. That style may preserve tactical flexibility, but it weakens predictability and undermines trust in durable policy guardrails.",
  "rationale":"AP chronology reflected a momentum-driven Trump escalation arc with limited doctrine clarity.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["momentum strategy","doctrine clarity","real-time reweighting","predictability loss","policy guardrails"],
  "metrics_key":"governance","source_url":SRC1_URL,"source_title":SRC1_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,8,6,4,4,8,10,"Trump's escalation sequence appeared momentum-driven rather than doctrine-stable.")
},

{
  "entry_number":1376,
  "title":"Trump and His Team Offered Conflicting Public Rationales for the Same Iran Strike Campaign",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's \"In Their Words\" comparison documented how Trump and senior officials described different objectives and justifications for identical operations. In wartime, rationale consistency is not cosmetic; it anchors legality, alliance trust and domestic consent. The mismatch deepened the perception that Trump prioritized narrative agility over coherent strategic accountability.",
  "rationale":"AP documented internal Trump-team conflicts in public explanations for Iran strikes.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["conflicting rationales","message mismatch","official statements","accountability","Iran strikes"],
  "metrics_key":"governance","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Trump's own team presented conflicting reasons for the same military action.")
},
{
  "entry_number":1377,
  "title":"Trump Declared Total Mission Success While Administration Explanations Kept Shifting",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP reported Trump celebrating definitive success even as surrounding explanations evolved and sometimes contradicted each other. A stable victory claim without stable mission logic creates a credibility gap that compounds over time. Under Trump's communications model, confidence statements often arrived before evidentiary consensus.",
  "rationale":"AP showed Trump's success rhetoric outpacing consistency in mission explanation.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["mission success","shifting explanations","credibility gap","victory claim","evidence lag"],
  "metrics_key":"governance","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",8,6,8,6,4,4,9,10,"Trump declared final success while official rationale remained internally inconsistent.")
},
{
  "entry_number":1378,
  "title":"Trump's Iran Narrative Split Across Deterrence, Punishment and Prevention Frames in Days",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's side-by-side record showed the messaging moved across multiple strategic frames in a short period. Each frame implies different legal and operational thresholds, so rapid switching makes oversight and public evaluation harder. Trump kept flexibility, but at the cost of intelligible doctrine for allies and institutions.",
  "rationale":"AP captured rapid frame-switching in Trump's Iran-war narrative.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["deterrence frame","punishment frame","prevention frame","frame switching","doctrine ambiguity"],
  "metrics_key":"war","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,8,6,3,3,8,10,"Trump's narrative rapidly switched strategic frames, obscuring stable doctrine.")
},
{
  "entry_number":1379,
  "title":"Trump's Statement Volatility Made Independent Verification More Critical and More Difficult",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"As AP demonstrated with direct quote comparisons, contradictory messaging forced observers to rely more on external verification. But conflict conditions and restricted access simultaneously made that verification harder in real time. Trump's volatility therefore raised the need for scrutiny while reducing clarity available to conduct it.",
  "rationale":"AP quote comparison showed Trump's volatility increasing verification burden under uncertainty.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["statement volatility","verification burden","quote comparison","restricted access","transparency gap"],
  "metrics_key":"governance","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,8,6,3,3,9,10,"Trump's conflicting statements increased the scrutiny burden while clarity remained constrained.")
},
{
  "entry_number":1380,
  "title":"Trump's Competing Iran Explanations Weakened Congressional and Allied Confidence in End-State Clarity",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's \"In Their Words\" mapping implied institutions were evaluating a moving target. When end-state descriptions change frequently, legislative oversight and alliance planning both suffer because assumptions cannot stabilize. Trump's communication approach produced tactical maneuverability but strategic trust erosion.",
  "rationale":"AP analysis suggested Trump's shifting explanations undermined confidence in end-state planning.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["end-state clarity","allied confidence","congressional confidence","moving target","trust erosion"],
  "metrics_key":"governance","source_url":SRC2_URL,"source_title":SRC2_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",8,7,8,7,3,3,8,10,"Trump's competing explanations weakened institutional confidence in strategic end-state.")
},

{
  "entry_number":1381,
  "title":"Trump-Era Justice Department Admitted It Is Reviewing Whether Epstein Records Were Improperly Withheld",
  "date_start":"2026-02-25","date_end":"2026-02-25",
  "synopsis":"AP reported the Justice Department said it was reviewing whether Epstein-related documents had been mistakenly withheld. That admission mattered because the administration had publicly projected closure while record-integrity questions remained unresolved. Under Trump's political climate, every disclosure-process defect amplified suspicion of selective transparency.",
  "rationale":"AP reported DOJ review of potential improper withholding in Epstein records under Trump.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["DOJ review","improper withholding","Epstein records","disclosure integrity","transparency"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-25","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Trump-era DOJ acknowledged a review into possibly withheld Epstein documents.")
},
{
  "entry_number":1382,
  "title":"Trump's Exoneration Narrative Took a Hit as DOJ Reopened Document-Withholding Questions",
  "date_start":"2026-02-25","date_end":"2026-02-25",
  "synopsis":"AP's report undercut simplified claims that the file story was closed by showing federal review remained active. Even a limited records audit can reopen public doubt when officials previously projected certainty. Trump's messaging advantage narrowed as process uncertainty re-entered the center of the story.",
  "rationale":"AP showed DOJ review reopening uncertainty against Trump's closure messaging.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["exoneration claim","closure messaging","records audit","process uncertainty","public doubt"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-25","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"DOJ review weakened Trump's attempts to portray Epstein-file questions as resolved.")
},
{
  "entry_number":1383,
  "title":"Trump-Era Epstein File Handling Faced Fresh Pressure for Full Accounting After DOJ Review Notice",
  "date_start":"2026-02-25","date_end":"2026-02-25",
  "synopsis":"AP's DOJ update increased demands for a transparent accounting trail: what was withheld, why, and under which authority. In politically charged files, trust depends less on declarations and more on auditability. Trump's environment made those demands sharper because confidence in neutral process was already thin.",
  "rationale":"AP DOJ update intensified calls for auditable accounting in Trump-era Epstein handling.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["full accounting","audit trail","withholding authority","document control","process trust"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-25","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Trump-era file management drew stronger demands for auditable disclosure controls.")
},
{
  "entry_number":1384,
  "title":"Trump's DOJ Review Statement Confirmed That Epstein Disclosure Errors Were Not Theoretical",
  "date_start":"2026-02-25","date_end":"2026-02-25",
  "synopsis":"By acknowledging active review of possible withholding, AP showed the administration was no longer dealing in abstractions about record completeness. The admission moved debate from speculation into procedural accountability territory. Trump's team faced renewed burden to prove documentary integrity instead of asserting it.",
  "rationale":"AP reported DOJ language that shifted Epstein-file debate into concrete process-accountability space.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["disclosure errors","procedural accountability","document completeness","burden of proof","integrity"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-25","Government Corruption","Transparency Obstruction",7,7,8,6,3,3,9,10,"Trump DOJ's own review notice made Epstein-file process concerns materially concrete.")
},
{
  "entry_number":1385,
  "title":"Trump's Broader Credibility Problem Deepened as Epstein File Review Questions Persisted",
  "date_start":"2026-02-25","date_end":"2026-02-25",
  "synopsis":"AP's reporting reinforced a recurrent pattern: definitive political messaging followed by institutional caveats that re-open uncertainty. In this context, each new review step widened the gap between rhetorical certainty and administrative reality. Trump's credibility costs accumulated not from one disclosure but from repeated reversals of closure.",
  "rationale":"AP update fed ongoing credibility erosion tied to repeated Epstein-file closure reversals.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["credibility erosion","closure reversal","institutional caveat","rhetorical certainty","administrative reality"],
  "metrics_key":"epstein","source_url":SRC3_URL,"source_title":SRC3_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-02-25","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,6,8,6,4,4,9,10,"Epstein-review persistence widened the gap between Trump's certainty claims and institutional reality.")
},

{
  "entry_number":1386,
  "title":"Trump's Escalation Reached a Threshold AP Classified as the 'Iran War'",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP published a standards explanation saying the fighting had crossed the threshold for war terminology. That editorial decision reflected accumulated facts: sustained multi-actor conflict, not isolated episodic strikes. For Trump, the label shift was politically costly because it challenged his bounded-action framing with an independent newsroom standard.",
  "rationale":"AP standards decision contradicted Trump's attempts to frame escalation as limited action.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["Iran war label","AP standards","bounded action claim","editorial threshold","war terminology"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Independent standards classified the conflict as war despite Trump's limited-action framing.")
},
{
  "entry_number":1387,
  "title":"Trump's Narrative Lost Ground When Independent Style Standards Declared the Conflict a War",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's explanation showed how language itself became a battleground: Trump's communications sought controlled scope, while newsroom standards responded to observable escalation facts. Once major outlets lock in war terminology, public baseline expectations shift fast. Trump's narrative leverage decreased as the lexical frame hardened against him.",
  "rationale":"AP standards framing reduced Trump's narrative control over conflict scope.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["language battleground","scope control","newsroom standards","public baseline","lexical frame"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,8,6,4,4,8,10,"War terminology adopted by independent standards weakened Trump's scope-control messaging.")
},
{
  "entry_number":1388,
  "title":"Trump's 'Limited Mission' Language Collided With the Fact Pattern AP Said Met War Criteria",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP outlined why it used the label \"Iran war,\" emphasizing conflict characteristics that exceeded limited-operation descriptions. This was not merely semantic; legal and political accountability often track how conflict is categorized publicly. Trump's preferred wording could not prevent the facts-based classification from taking hold.",
  "rationale":"AP's criteria-based wording challenged Trump's limited-mission descriptor.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["limited mission","war criteria","facts pattern","classification","accountability"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"AP war criteria conflicted with Trump's limited-mission narrative.")
},
{
  "entry_number":1389,
  "title":"Trump's Messaging Team Faced a Hard Ceiling Once Conflict Reality Forced War Terminology",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's standards note highlighted a structural limit in narrative management: when event magnitude crosses clear thresholds, framing options collapse. Under Trump, communication teams often rely on repetition to define reality, but the war designation reflected externally verifiable escalation. The ceiling for spin arrived faster than usual.",
  "rationale":"AP war-label decision exposed limits of Trump's narrative repetition strategy.",
  "category":"Authoritarianism","subcategory":"Government Power Abuse","phase":"White House 2",
  "keywords":["messaging ceiling","repetition strategy","verifiable escalation","framing collapse","spin limits"],
  "metrics_key":"governance","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Authoritarianism","Government Power Abuse",7,6,8,7,3,3,8,10,"War-level facts constrained Trump's usual narrative-control playbook.")
},
{
  "entry_number":1390,
  "title":"Trump's Escalation Changed the Media Baseline From Episodic Strikes to Persistent War Coverage",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"By AP's own standards explanation, the information environment had shifted from event flashes to a continuous war frame. That baseline change affects public memory, oversight pace and diplomatic signaling. Trump's team could still contest interpretation, but it could no longer credibly contest the conflict category itself.",
  "rationale":"AP standards note marked a baseline shift to persistent war framing under Trump.",
  "category":"Foreign Policy","subcategory":"Military Escalation","phase":"White House 2",
  "keywords":["persistent war coverage","media baseline","public memory","oversight pace","conflict category"],
  "metrics_key":"war","source_url":SRC4_URL,"source_title":SRC4_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Foreign Policy","Military Escalation",8,6,9,6,3,3,8,10,"Trump's escalation moved coverage into a sustained war framework.")
},

{
  "entry_number":1391,
  "title":"Trump-Era Epstein Hearing Space Was Consumed by Fringe Detours Like Pizzagate and UFO Questions",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP reported a House committee session on Epstein-related matters included questions about pizzagate and UFOs. Even when such tangents are framed as exploratory, they dilute time for evidence-focused accountability. In Trump's political ecosystem, conspiracy-adjacent detours repeatedly compete with rigorous investigative sequencing.",
  "rationale":"AP showed fringe-topic detours taking space inside an Epstein-related hearing cycle.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["pizzagate","UFO questions","hearing detour","evidence focus","committee time"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,5,9,10,"Fringe detours in an Epstein-track hearing weakened evidence-centered accountability focus.")
},
{
  "entry_number":1392,
  "title":"Trump-Linked Information Chaos Benefited When Official Epstein Inquiry Time Shifted to Spectacle",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's hearing account showed substantial attention diverted from core document accountability into high-spectacle side topics. In polarized environments, spectacle can overwhelm procedural substance and blur causal responsibility. Trump's broader messaging ecosystem has repeatedly operated effectively under exactly that noise dynamic.",
  "rationale":"AP account illustrated how spectacle diverted focus from core Epstein document accountability.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["spectacle politics","document accountability","noise dynamic","inquiry dilution","information chaos"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Inquiry spectacle reduced focus on auditable Epstein-document accountability questions.")
},
{
  "entry_number":1393,
  "title":"Trump-Centered Conspiracy Culture Bled Into Formal Epstein Hearing Behavior","date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's report documented how conspiracy-coded questioning surfaced within a formal committee process. When informal internet narratives migrate into official hearings, institutional credibility drops and evidentiary discipline weakens. Under Trump's era of communication politics, that boundary erosion has become increasingly normalized.",
  "rationale":"AP showed conspiracy-coded questioning entering formal Epstein hearing space.",
  "category":"Conspiracy Theories / Disinformation","subcategory":"Systematic Presidential Lying","phase":"White House 2",
  "keywords":["conspiracy culture","formal hearings","boundary erosion","evidentiary discipline","institutional credibility"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Conspiracy Theories / Disinformation","Systematic Presidential Lying",7,5,7,6,4,5,8,10,"Conspiracy-style framing surfaced in formal hearing practice during Trump's information era.")
},
{
  "entry_number":1394,
  "title":"Trump-Era Oversight Theater Expanded as Epstein Proceedings Mixed Evidence and Fringe Themes",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's description pointed to an oversight format split between serious inquiry and fringe-topic injections. That blend can create a procedural mirage: activity appears high while clarity gains remain low. In a political environment shaped by Trump-style media incentives, theatrical conflict often displaces cumulative fact-building.",
  "rationale":"AP hearing details reflected oversight theater dynamics in the Epstein process.",
  "category":"Election Interference","subcategory":"Democratic Institution Undermining","phase":"White House 2",
  "keywords":["oversight theater","procedural mirage","fringe injection","fact-building","media incentives"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Election Interference","Democratic Institution Undermining",7,7,7,7,3,4,8,10,"Hearing theatrics and fringe themes diluted the quality of democratic oversight.")
},
{
  "entry_number":1395,
  "title":"Trump's Accountability Exposure Was Blunted When Epstein Hearing Narratives Fragmented Into Side Channels",
  "date_start":"2026-03-02","date_end":"2026-03-02",
  "synopsis":"AP's reporting suggested the hearing's narrative center fractured across unrelated sensational tracks. Fragmentation helps diffuse accountability pressure because audiences leave with controversy volume instead of evidentiary hierarchy. In Trump's media ecosystem, that fragmentation pattern has repeatedly protected political actors from focused scrutiny.",
  "rationale":"AP showed narrative fragmentation reducing focused accountability in an Epstein-track hearing.",
  "category":"Government Corruption","subcategory":"Transparency Obstruction","phase":"White House 2",
  "keywords":["narrative fragmentation","side channels","accountability diffusion","evidentiary hierarchy","focused scrutiny"],
  "metrics_key":"epstein","source_url":SRC5_URL,"source_title":SRC5_TITLE,"source_publisher":"AP News",
  "scores":make_scores("2026-03-02","Government Corruption","Transparency Obstruction",7,6,7,6,4,4,8,10,"Fragmented hearing narratives reduced concentrated accountability pressure in Trump's environment.")
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
