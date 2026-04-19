import json
from datetime import datetime

months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
birth_date = datetime(1946, 6, 14)


def format_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{months[d.month - 1]} {d.day}, {d.year}"


def calc_age(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    age = d.year - birth_date.year
    if (d.month, d.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def json_sql(obj) -> str:
    return "'" + json.dumps(obj, separators=(",", ":"), ensure_ascii=True).replace("'", "''") + "'::jsonb"


def arr_sql(items) -> str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY[" + ",".join("'" + sql_escape(x) + "'" for x in items) + "]::text[]"


def make_scores(
    date_start,
    category,
    subcategory,
    danger,
    lawlessness,
    impact_scope,
    authoritarianism,
    insanity,
    absurdity,
    credibility_risk,
    recency_intensity,
    rationale_short,
):
    return {
        "danger": danger,
        "insanity": insanity,
        "absurdity": absurdity,
        "lawlessness": lawlessness,
        "impact_scope": impact_scope,
        "rationale_short": rationale_short,
        "authoritarianism": authoritarianism,
        "credibility_risk": credibility_risk,
        "rationale_detail": f"{category}: {subcategory}. On {format_date(date_start)}, {rationale_short}",
        "recency_intensity": recency_intensity,
    }


metrics = {
    "epstein": {
        "impressions": 178000000,
        "reach_estimate": 605000000,
        "financial_cost_usd": 145000000,
        "public_reaction": {"negative": 82, "neutral": 13, "positive": 5},
    },
    "concerning": {
        "impressions": 96000000,
        "reach_estimate": 316000000,
        "financial_cost_usd": 52000000,
        "public_reaction": {"negative": 71, "neutral": 21, "positive": 8},
    },
    "promises": {
        "impressions": 132000000,
        "reach_estimate": 447000000,
        "financial_cost_usd": 98000000,
        "public_reaction": {"negative": 74, "neutral": 18, "positive": 8},
    },
}

entries = [
    {
        "entry_number": 1221,
        "title": "Trump's DOJ Withheld 50+ Pages of Epstein Files Mentioning Abuse Allegations",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "NPR reported that the Justice Department withheld what appeared to be more than 50 pages of FBI interview material and related notes connected to allegations that mention Trump. The report said those pages remained unpublished despite legal mandates tied to the Epstein disclosure law. The key issue is institutional trust: when the government promotes transparency while core records remain absent, the process itself becomes part of the scandal.",
        "rationale": "NPR reported that DOJ withheld substantial Epstein-file interview material tied to allegations mentioning Trump.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["DOJ", "Epstein files", "withheld pages", "FBI interviews", "transparency"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "NPR found DOJ withheld substantial Epstein-file records involving allegations mentioning Trump."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1222,
        "title": "Trump-Era DOJ Removed Epstein Documents From Public Database After Release",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "According to NPR's document review, some Epstein-related materials that had been visible were later removed from the public release system, including records that referenced allegations connected to Trump. The removals and partial restorations created a moving-target archive where outside verification became harder. That pattern fed accusations that disclosure was being managed for political optics rather than clean institutional accountability.",
        "rationale": "Records tied to the Epstein release were removed and reconfigured after publication, deepening cover-up concerns.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["database removal", "public files", "document integrity", "DOJ", "Epstein"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "DOJ removed or shifted public Epstein files after release, raising integrity concerns."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1223,
        "title": "Trump Epstein-File Fallout Triggers New House Oversight Investigation",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "After NPR's findings, House Oversight Democrats announced a parallel investigation into why specific FBI interview material was not released. The shift from media report to congressional inquiry materially raised the stakes, turning a publication dispute into a formal accountability question. For Trump, the controversy deepened the perception that institutions around him were curating disclosure boundaries under political pressure.",
        "rationale": "NPR findings prompted congressional investigation into missing Epstein-file interview records.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["House Oversight", "congressional investigation", "missing records", "Epstein transparency", "Robert Garcia"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Congress opened a probe into missing Epstein records after reporting on withheld files."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1224,
        "title": "Trump DOJ Accused of Illegally Withholding Survivor Interview Material",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "Rep. Robert Garcia said after reviewing unredacted evidence logs that DOJ appeared to have illegally withheld FBI interviews tied to a survivor allegation involving Trump. Whether or not subsequent legal review confirms that claim, the statement from a senior oversight Democrat amplified institutional alarm around document handling. The political impact was immediate: transparency became a headline battle rather than a background legal process.",
        "rationale": "Oversight Democrats publicly accused DOJ of illegally withholding interview records tied to allegations involving Trump.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["Garcia", "illegal withholding", "survivor interviews", "DOJ logs", "oversight"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Oversight lawmakers alleged DOJ illegally withheld survivor interview records."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1225,
        "title": "Trump DOJ Defends Missing Epstein Documents as 'Duplicative or Privileged'",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "DOJ officials told NPR that records not posted were withheld for privilege or duplication reasons, not political sensitivity. That explanation did not settle the dispute because outside reviewers pointed to serial-number and log inconsistencies indicating gaps in the public release. The core conflict became one of competing narratives: formal compliance language versus independently tracked missing records.",
        "rationale": "DOJ defended omissions as procedural while transparency critics cited evidence of substantive gaps.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["duplicative", "privileged", "DOJ defense", "missing pages", "file integrity"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "DOJ framed missing Epstein records as procedural omissions amid continuing disputes."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1226,
        "title": "Trump Allegation Lead Prompted Four FBI Interviews, But Key Notes Stayed Unreleased",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "NPR reported that the accuser who mentioned Trump was interviewed four times by the FBI, yet related interview notes were among materials not fully visible in the public database. That mismatch between investigative effort and disclosed records intensified scrutiny over how release decisions were made. The issue was less about proving allegations and more about preserving transparent records of how federal investigators handled them.",
        "rationale": "FBI conducted multiple interviews on a lead involving Trump, but related records were incompletely disclosed.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["FBI interviews", "serial logs", "withheld notes", "Trump lead", "record transparency"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "Multiple FBI interviews were documented while related records remained incompletely released."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1227,
        "title": "Trump Epstein-File Audit Found 53 Pages Missing by Serial-Number Comparison",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "NPR said its serial-number audit across case logs and released files indicated approximately 53 pages of interview documents and notes missing from the public database. That kind of chain-of-custody gap matters because disclosure credibility depends on reproducible records, not selective excerpts. Critics argued the mismatch undermined confidence in the government's claim that the rollout was complete and neutral.",
        "rationale": "Serial-number comparisons suggested dozens of Epstein-related pages were missing from the public release set.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["53 pages", "serial numbers", "document gap", "release audit", "Epstein files"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 8, 8, 8, 7, 3, 3, 8, 9, "A serial-number audit identified significant missing pages in the public Epstein file release."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1228,
        "title": "Trump-Era Epstein Archive Saw Files Pulled Offline, Then Partially Restored",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "NPR reported that some witness-related files were taken down and later restored, while others stayed unavailable. That uneven restoration pattern contributed to suspicion that disclosure was being triaged rather than uniformly corrected. Even when changes are justified by privacy review, opaque sequencing can make the public archive appear politically managed.",
        "rationale": "Partial takedown-and-restore cycles in the Epstein archive deepened concerns about selective transparency.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["offline files", "restored documents", "archive changes", "witness material", "public trust"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "Epstein files were removed and only partially restored, complicating transparency claims."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1229,
        "title": "Trump White House Claimed 'Total Exoneration' Amid Ongoing Missing-File Dispute",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "As records disputes widened, the White House told NPR Trump was ""totally exonerated"" in relation to Epstein matters. Critics said that messaging moved faster than documentary resolution and blurred the difference between legal adjudication, prosecutorial decisions, and disclosure completeness. The result was a familiar communication gap: certainty-heavy rhetoric before archival clarity.",
        "rationale": "The White House asserted total exoneration while transparency disputes over missing records remained unresolved.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["total exoneration", "White House statement", "Epstein dispute", "public messaging", "credibility"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 3, 8, 9, "The White House declared total exoneration while file-disclosure disputes continued."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1230,
        "title": "Trump DOJ Continued Mass Re-Uploads After Earlier Epstein Redaction Failures",
        "date_start": "2026-02-24",
        "date_end": "2026-02-24",
        "synopsis": "NPR noted that DOJ had removed and reuploaded thousands of pages in recent weeks to address redaction problems involving victim information. Although corrective action is expected after disclosure mistakes, large rolling revisions weakened confidence in release quality controls. The controversy reinforced a central critique: rushed transparency drives can generate fresh harm and then require opaque cleanup.",
        "rationale": "Large-scale file reuploads after redaction errors intensified concerns over DOJ release controls.",
        "category": "Government Corruption",
        "subcategory": "Transparency Obstruction",
        "phase": "White House 2",
        "keywords": ["reuploads", "redaction errors", "victim data", "quality controls", "DOJ cleanup"],
        "metrics_key": "epstein",
        "scores": make_scores("2026-02-24", "Government Corruption", "Transparency Obstruction", 7, 7, 7, 6, 3, 3, 7, 9, "DOJ reuploaded large volumes of files after redaction failures in the Epstein release."),
        "source": {"url": "https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell", "title": "DOJ removed, withheld Epstein files related to accusations about Trump", "publisher": "NPR", "date_published": "2026-02-24", "source_type": "news"},
    },
    {
        "entry_number": 1231,
        "title": "Trump Recycled False Story Claiming His Uncle Taught the Unabomber at MIT",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "The Guardian highlighted Trump retelling a story that his uncle, John Trump, taught Ted Kaczynski at MIT, a claim contradicted by timeline and education records. The anecdote mattered beyond trivia because it was delivered in a policy setting, blurring spectacle and governance communication. Repeated factual collapse in presidential storytelling degrades the signal quality people need during crises.",
        "rationale": "Trump repeated a debunked Kaczynski anecdote, reinforcing concerns about factual discipline in official settings.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["Unabomber", "MIT", "John Trump", "false anecdote", "factual accuracy"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 5, 3, 6, 4, 5, 5, 7, 8, "Trump repeated a story about his uncle and Kaczynski that conflicts with known facts."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1232,
        "title": "Trump Claimed Windmills Drive Whales 'Loco' During Policy Meeting",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "In remarks described by the Guardian, Trump pivoted from immigration and Europe policy to unsupported claims that windmills drive whales ""loco"" and broadly ""kill the birds."" The outburst was notable for timing and context: it displaced substantive agenda discussion with recycled misinformation. In presidential communication, repeated factual detours can undermine trust that policy priorities are being handled with seriousness.",
        "rationale": "Trump injected unsupported windmill claims into a diplomatic setting, displacing substantive policy discussion.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["windmills", "whales", "misinformation", "policy meeting", "von der Leyen"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 5, 3, 6, 4, 5, 6, 7, 8, "Trump repeated unsupported windmill claims in a high-level policy context."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1233,
        "title": "Trump Appeared to Nod Off During Multiple Public Government Meetings",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "The Guardian cataloged multiple events where Trump appeared to close his eyes and drift during official meetings or briefings, followed by White House denials. The political significance came from contrast: he had centered campaign messaging on another candidate's vigor, then faced similar scrutiny himself. The episode added to broader concerns about consistency and credibility in official narratives.",
        "rationale": "Repeated public incidents and official denials fueled credibility questions around presidential messaging.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["meeting incidents", "White House denial", "public optics", "vigor debate", "credibility"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Personal Awareness", "Public Gaffe", 4, 2, 5, 3, 6, 6, 6, 8, "Reports of repeated meeting incidents and denials created credibility strain around official messaging."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1234,
        "title": "Trump Reposted AI 'Med Bed' Conspiracy Video on Truth Social",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "The Guardian reported that Trump reposted an AI-generated video promoting ""med bed"" conspiracies, a fringe claim about hidden technology that can supposedly cure nearly any illness. The repost signaled continued amplification of low-credibility narratives through presidential channels. Even when framed as reposting rather than endorsement, repeated signal-boosting normalizes fringe content inside mainstream political discourse.",
        "rationale": "Trump amplified an AI-generated conspiracy video through Truth Social, increasing mainstream exposure of fringe claims.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["med bed", "AI video", "Truth Social", "conspiracy", "amplification"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 3, 6, 4, 6, 6, 8, 8, "Trump amplified an AI-based med-bed conspiracy narrative through his platform."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1235,
        "title": "Trump Mixed Up Greenland and Iceland in Davos-Era Economic Remarks",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "According to the Guardian, Trump conflated Greenland and Iceland while discussing market impacts and NATO burden-sharing narratives. The mix-up became a broader communications problem when official spokespeople denied what had been publicly heard. The episode reinforced a recurring pattern: factual errors followed by aggressive narrative correction attempts that can deepen, rather than reduce, public skepticism.",
        "rationale": "A high-profile geography mix-up and subsequent denial cycle intensified credibility concerns.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["Greenland", "Iceland", "Davos", "NATO remarks", "denial cycle"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Personal Awareness", "Public Gaffe", 4, 2, 5, 3, 6, 6, 6, 8, "Trump mixed up Greenland and Iceland, then the White House disputed the obvious slip."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1236,
        "title": "Trump Used Truth Social as De Facto Presidential Bulletin Channel",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "The Guardian described Truth Social as an unofficial presidential mouthpiece during Trump's second term, highlighting how policy signals increasingly flowed through a platform with limited audience share and weak guardrails. This communication model shifts state messaging from institutional channels toward owner-controlled media space, increasing risk of impulsive framing and reducing traditional review friction.",
        "rationale": "Trump's heavy reliance on Truth Social concentrated official messaging in a personally controlled channel.",
        "category": "Authoritarianism",
        "subcategory": "Government Power Abuse",
        "phase": "White House 2",
        "keywords": ["Truth Social", "official messaging", "institutional channels", "guardrails", "communications control"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Authoritarianism", "Government Power Abuse", 6, 5, 6, 7, 4, 4, 6, 8, "Trump's presidency increasingly used a personally controlled platform as a governing mouthpiece."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1237,
        "title": "Trump's Crisis Meetings Repeatedly Drifted Into Off-Topic Monologues",
        "date_start": "2026-01-23",
        "date_end": "2026-01-23",
        "synopsis": "The Guardian's review described repeated meetings where urgent agenda items were derailed by long off-topic tangents. In governance terms, this matters less for spectacle and more for bandwidth: when leadership attention is consumed by improvisational digressions, institutional follow-through on complex crises can become uneven. The pattern supported broader criticism of unstable message discipline under pressure.",
        "rationale": "Repeated off-topic monologues in crisis settings raised concerns about executive focus and institutional follow-through.",
        "category": "Personal Awareness",
        "subcategory": "Public Gaffe",
        "phase": "White House 2",
        "keywords": ["meeting drift", "off-topic monologue", "executive focus", "crisis management", "message discipline"],
        "metrics_key": "concerning",
        "scores": make_scores("2026-01-23", "Personal Awareness", "Public Gaffe", 5, 3, 6, 4, 6, 6, 6, 8, "Trump repeatedly derailed high-stakes meetings with off-topic monologues."),
        "source": {"url": "https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments", "title": "Trump’s second term has been rife with bizarre moments – here are seven", "publisher": "The Guardian", "date_published": "2026-01-23", "source_type": "news"},
    },
    {
        "entry_number": 1238,
        "title": "Trump Claim of Keeping 'All Promises' Collided With 75-Promise Tracker Data",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS, citing PolitiFact's MAGA-Meter, said 75 second-term promises were being tracked and that the data did not support Trump's claim of total delivery. The clash between sweeping rhetoric and granular status tracking highlighted a core accountability gap: narrative volume can obscure execution reality unless independent metrics are maintained and updated.",
        "rationale": "Independent tracking of 75 promises contradicted Trump's blanket claim of total fulfillment.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["75 promises", "MAGA-Meter", "PBS", "fact-check", "delivery gap"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 9, "Promise-tracker data directly contradicted Trump's all-promises-kept claim."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1239,
        "title": "Trump Promise Dashboard Showed Only About 19% Marked as Kept",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS reported that roughly 19% of tracked promises were rated as kept, a figure far below Trump's broad claim of near-total completion. Percentage framing matters because it strips away anecdotal victories and shows aggregate delivery performance. The number became a measurable counterweight to speech-driven success narratives.",
        "rationale": "Tracker data indicating about 19% kept undermined Trump's near-total fulfillment narrative.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["19% kept", "promise metrics", "delivery rate", "PBS", "fact-check"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 9, "Only about 19% of tracked promises were marked kept, contradicting Trump's claim."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1240,
        "title": "Trump Promise Tracker Marked About 31% of Pledges as Stalled",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "According to PBS's summary of PolitiFact tracking, approximately 31% of promises were stalled due to congressional inaction, court barriers, or lack of White House follow-through. The stalled share challenged the framing that political resistance alone explains implementation gaps. It suggested structural overpromising relative to executable policy pathways.",
        "rationale": "Roughly one-third of promises were stalled, contradicting narratives of broad completion.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["31% stalled", "implementation gap", "courts", "Congress", "White House initiative"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 6, 4, 7, 5, 3, 4, 8, 9, "About 31% of tracked promises were stalled despite Trump's broad completion claims."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1241,
        "title": "Trump's 'End Ukraine War in 24 Hours' Pledge Was Rated Broken",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS reported that Trump's repeatedly stated promise to end the Russia-Ukraine war within 24 hours was classified as broken after continued hostilities and unresolved talks. This was one of the clearest examples where a maximal campaign slogan collided with geopolitical complexity. The broken status weakened claims that second-term foreign-policy rhetoric translated into rapid, guaranteed outcomes.",
        "rationale": "A high-profile 24-hour war-ending promise was rated broken under independent tracking.",
        "category": "Conspiracy Theories / Disinformation",
        "subcategory": "Systematic Presidential Lying",
        "phase": "White House 2",
        "keywords": ["Ukraine", "24 hours", "broken promise", "peace talks", "foreign policy"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Conspiracy Theories / Disinformation", "Systematic Presidential Lying", 7, 4, 8, 5, 3, 4, 8, 9, "Trump's 24-hour Ukraine-war promise was rated broken by tracking data."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1242,
        "title": "Trump's Social Security Tax Promise Downgraded to Partial Compromise",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS said the promise to end taxes on Social Security was not fully delivered; instead, a temporary and narrower tax break for some seniors was enacted through 2028. The distinction between headline framing and statutory detail became central to the scorecard. Trump could claim movement, but not fulfillment as originally pitched.",
        "rationale": "A major tax promise was only partially implemented, not delivered as promised.",
        "category": "Grift / Financial Exploitation",
        "subcategory": "Government Resource Abuse",
        "phase": "White House 2",
        "keywords": ["Social Security tax", "compromise", "2028 sunset", "partial delivery", "tax policy"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Grift / Financial Exploitation", "Government Resource Abuse", 6, 4, 7, 5, 3, 3, 7, 9, "Trump's Social Security tax pledge was only partially met through a temporary compromise."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1243,
        "title": "Trump Cost-of-Living Promise Undercut by Persistently Higher Core Household Prices",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS noted that while some categories had eased, many key costs including groceries, housing, electricity and medical care remained above levels at the start of Trump's term. The mixed inflation picture complicated blanket claims that everyday affordability had been broadly fixed. For voters, the gap between macro talking points and monthly bills remained politically decisive.",
        "rationale": "Data cited by PBS showed major household costs remained elevated despite Trump's broad affordability claims.",
        "category": "Grift / Financial Exploitation",
        "subcategory": "Government Resource Abuse",
        "phase": "White House 2",
        "keywords": ["cost of living", "groceries", "housing", "medical care", "price claims"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Grift / Financial Exploitation", "Government Resource Abuse", 6, 4, 7, 5, 3, 3, 7, 9, "Core household prices stayed elevated despite Trump's broad affordability claims."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1244,
        "title": "Trump Proof-of-Citizenship Voting Promise Listed as Stalled Despite House Passage",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS reported that Trump's proof-of-citizenship voting pledge remained stalled even after House passage of the SAVE America Act, because Senate hurdles and implementation barriers persisted. The status highlighted how campaign certainty can overstate real legislative probability. It also reinforced that institutional checks still constrained parts of the agenda despite maximal executive messaging.",
        "rationale": "The SAVE-style voting pledge remained stalled despite House movement, undercutting completion claims.",
        "category": "Election Interference",
        "subcategory": "Election Interference",
        "phase": "White House 2",
        "keywords": ["proof of citizenship", "SAVE America Act", "Senate hurdles", "stalled promise", "voting law"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Election Interference", "Election Interference", 7, 6, 7, 7, 3, 3, 7, 9, "The proof-of-citizenship voting pledge was still stalled despite House progress."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
    {
        "entry_number": 1245,
        "title": "Trump Tariff Agenda Hit Court Barriers While White House Still Claimed Full Delivery",
        "date_start": "2026-02-27",
        "date_end": "2026-02-27",
        "synopsis": "PBS said stalled-promise totals reflected court roadblocks, including Supreme Court limits on Trump's tariff powers. That legal friction undercut administration claims that core economic promises were fully delivered. The contradiction illustrated a recurring pattern in Trump's governance narrative: declarative certainty persists even when courts and implementation realities materially narrow outcomes.",
        "rationale": "Court constraints on tariff powers contradicted the administration's all-promises-kept narrative.",
        "category": "Foreign Policy",
        "subcategory": "Economic Warfare",
        "phase": "White House 2",
        "keywords": ["tariffs", "Supreme Court", "court roadblocks", "promise status", "economic policy"],
        "metrics_key": "promises",
        "scores": make_scores("2026-02-27", "Foreign Policy", "Economic Warfare", 7, 5, 7, 6, 3, 3, 7, 9, "Court barriers to Trump's tariff agenda conflicted with claims of full policy delivery."),
        "source": {"url": "https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise", "title": "Trump says he's kept all campaign promises. PolitiFact's MAGA-Meter shows otherwise", "publisher": "PBS News", "date_published": "2026-02-27", "source_type": "news"},
    },
]

entry_columns = [
    "entry_number", "title", "date_start", "date_end", "synopsis", "rationale", "category", "subcategory", "keywords", "age", "phase", "impressions", "reach_estimate", "financial_cost_usd", "public_reaction", "fact_check", "fact_check_sources", "scores"
]
score_columns = [
    "entry_number", "insanity", "absurdity", "danger", "authoritarianism", "lawlessness", "credibility_risk", "recency_intensity", "impact_scope", "rationale_short", "rationale_detail"
]
source_columns = ["entry_number", "url", "title", "publisher", "date_published", "source_type"]

entry_values = []
score_values = []
source_values = []
keyword_values = []

for e in entries:
    m = metrics[e["metrics_key"]]
    e["impressions"] = m["impressions"]
    e["reach_estimate"] = m["reach_estimate"]
    e["financial_cost_usd"] = m["financial_cost_usd"]
    e["public_reaction"] = m["public_reaction"]
    e["age"] = calc_age(e["date_start"])

    scores = e["scores"]
    entry_values.append(
        "(" + ", ".join([
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
            json_sql(scores),
        ]) + ")"
    )

    score_values.append(
        "(" + ", ".join([
            str(e["entry_number"]),
            str(scores["insanity"]),
            str(scores["absurdity"]),
            str(scores["danger"]),
            str(scores["authoritarianism"]),
            str(scores["lawlessness"]),
            str(scores["credibility_risk"]),
            str(scores["recency_intensity"]),
            str(scores["impact_scope"]),
            f"'{sql_escape(scores['rationale_short'])}'",
            f"'{sql_escape(scores['rationale_detail'])}'",
        ]) + ")"
    )

    src = e["source"]
    source_values.append(
        "(" + ", ".join([
            str(e["entry_number"]),
            f"'{sql_escape(src['url'])}'",
            f"'{sql_escape(src['title'])}'",
            f"'{sql_escape(src['publisher'])}'",
            f"'{src['date_published']}'",
            f"'{sql_escape(src['source_type'])}'",
        ]) + ")"
    )

    for kw in e["keywords"]:
        keyword_values.append("(" + ", ".join([str(e["entry_number"]), f"'{sql_escape(kw)}'"]) + ")")

sql_entries = "INSERT INTO public.trump_entries (" + ", ".join(entry_columns) + ") VALUES\n" + ",\n".join(entry_values) + "\nON CONFLICT DO NOTHING;"
sql_scores = "INSERT INTO public.trump_individual_scores (" + ", ".join(score_columns) + ") VALUES\n" + ",\n".join(score_values) + "\nON CONFLICT DO NOTHING;"
sql_sources = "INSERT INTO public.trump_sources (" + ", ".join(source_columns) + ") VALUES\n" + ",\n".join(source_values) + ";"
sql_keywords = "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n" + ",\n".join(keyword_values) + "\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries, sql_scores, sql_sources, sql_keywords], indent=2))
