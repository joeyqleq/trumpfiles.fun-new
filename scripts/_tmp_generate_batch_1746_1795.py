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

angles=[
    {
        "title_suffix":"Continued to Prioritize Momentum Over Deliberative Depth",
        "synopsis":"continued to prioritize momentum over deliberative depth",
        "rationale":"prioritized momentum over deliberative depth",
        "keyword":"momentum over deliberation",
    },
    {
        "title_suffix":"Kept Oversight Windows Compressed Under High-Impact Decisions",
        "synopsis":"kept oversight windows compressed under high-impact decision pressure",
        "rationale":"kept oversight windows compressed",
        "keyword":"oversight compression",
    },
    {
        "title_suffix":"Relied on High-Voltage Messaging While Leaving Criteria Ambiguous",
        "synopsis":"relied on high-voltage messaging while leaving key criteria ambiguously framed",
        "rationale":"used high-voltage messaging with ambiguous criteria",
        "keyword":"ambiguous criteria",
    },
    {
        "title_suffix":"Rewarded Narrative Control Over Institutional Clarity",
        "synopsis":"rewarded narrative control over institutional clarity in public-facing explanations",
        "rationale":"prioritized narrative control over institutional clarity",
        "keyword":"narrative control",
    },
    {
        "title_suffix":"Sustained Long-Tail Credibility Risk Across Repeated Review Cycles",
        "synopsis":"sustained long-tail credibility risk across repeated review cycles",
        "rationale":"sustained long-tail credibility risk",
        "keyword":"long-tail credibility risk",
    },
]

clusters=[
    {
        "subject":"Trump's Iran Decision Timeline",
        "date":"2026-03-04",
        "category":"Foreign Policy",
        "subcategory":"Military Escalation",
        "metrics_key":"war",
        "source_url":"https://apnews.com/article/6c602da7d44cb8c34fa1a9f85f352e4a",
        "source_title":"From doubts about nuke talks to an Air Force One flight, what led up to Trump's order to strike Iran",
        "source_publisher":"AP News",
        "scores":(8,6,9,6,3,3,8,10),
        "base_keywords":["iran decision timeline","escalation sequencing","executive tempo","oversight strain"],
    },
    {
        "subject":"Trump's Iran Messaging Matrix",
        "date":"2026-03-04",
        "category":"Conspiracy Theories / Disinformation",
        "subcategory":"Systematic Presidential Lying",
        "metrics_key":"war",
        "source_url":"https://apnews.com/article/5357243212b4b8bbd387ae91ca797325",
        "source_title":"In Their Words: How Trump's and his administration's statements on Iran evolved and conflicted",
        "source_publisher":"AP News",
        "scores":(8,6,8,6,4,4,9,10),
        "base_keywords":["iran messaging matrix","conflicting statements","credibility strain","narrative drift"],
    },
    {
        "subject":"Trump's Epstein Narrative Exposure",
        "date":"2026-02-24",
        "category":"Government Corruption",
        "subcategory":"Transparency Obstruction",
        "metrics_key":"epstein",
        "source_url":"https://www.npr.org/2026/02/24/nx-s1-5723968/epstein-files-trump-accusation-maxwell",
        "source_title":"NPR analysis: Epstein files, Trump allegations, and Maxwell-linked claims",
        "source_publisher":"NPR",
        "scores":(7,7,8,6,3,3,9,10),
        "base_keywords":["epstein exposure","document-linked scrutiny","timeline pressure","audit cycle"],
    },
    {
        "subject":"Trump's Early Rights-Shock Agenda",
        "date":"2025-04-30",
        "category":"Human Rights Violations",
        "subcategory":"Public Welfare Harm",
        "metrics_key":"rights",
        "source_url":"https://www.amnesty.org/en/latest/news/2025/04/president-trumps-first-100-days-attacks-on-human-rights/",
        "source_title":"President Trump's first 100 days: attacks on human rights",
        "source_publisher":"Amnesty International",
        "scores":(8,7,8,7,3,3,8,8),
        "base_keywords":["rights-shock agenda","policy harm pattern","institutional burden","long-tail repair"],
    },
    {
        "subject":"Trump's Campaign-Promise Delivery Narrative",
        "date":"2026-03-04",
        "category":"Government Corruption",
        "subcategory":"Transparency Obstruction",
        "metrics_key":"economy",
        "source_url":"https://apnews.com/projects/trump-campaign-promise-tracker/",
        "source_title":"AP tracker: what Trump promised and what he has delivered",
        "source_publisher":"AP News",
        "scores":(7,6,8,6,3,3,8,10),
        "base_keywords":["promise delivery narrative","status tracking","public auditability","mixed outcomes"],
    },
    {
        "subject":"Trump's Concerning-Moments Fitness Profile",
        "date":"2026-01-23",
        "category":"Authoritarianism",
        "subcategory":"Government Power Abuse",
        "metrics_key":"war",
        "source_url":"https://www.theguardian.com/us-news/2026/jan/23/trump-concerning-moments",
        "source_title":"Trump's concerning moments raise alarm about fitness and judgment",
        "source_publisher":"The Guardian",
        "scores":(8,6,8,7,4,4,8,9),
        "base_keywords":["fitness profile","recurring incidents","institutional drag","decision confidence"],
    },
    {
        "subject":"Trump's Unthinkable Trajectory Frame",
        "date":"2026-03-04",
        "category":"Election Interference",
        "subcategory":"Democratic Institution Undermining",
        "metrics_key":"war",
        "source_url":"https://www.theatlantic.com/unthinkable/",
        "source_title":"The Atlantic: Unthinkable",
        "source_publisher":"The Atlantic",
        "scores":(8,7,8,7,4,4,8,10),
        "base_keywords":["unthinkable trajectory","norm erosion","guardrail pressure","democratic risk"],
    },
    {
        "subject":"Trump-Era Epstein File Integrity Crisis",
        "date":"2025-12-20",
        "category":"Government Corruption",
        "subcategory":"Transparency Obstruction",
        "metrics_key":"epstein",
        "source_url":"https://apnews.com/article/9290fcaad1cb6fcb1cbc1befabc01994",
        "source_title":"At least 16 files have disappeared from the DOJ webpage for documents related to Jeffrey Epstein",
        "source_publisher":"AP News",
        "scores":(7,7,8,6,3,3,9,9),
        "base_keywords":["file integrity crisis","missing documents","chain-of-custody doubt","quantified gaps"],
    },
    {
        "subject":"Trump's Epstein-FBI Disclosure Conflict",
        "date":"2026-02-26",
        "category":"Government Corruption",
        "subcategory":"Transparency Obstruction",
        "metrics_key":"epstein",
        "source_url":"https://www.theguardian.com/us-news/2026/feb/26/trump-epstein-files-fbi",
        "source_title":"Trump, Epstein files, and FBI disclosure conflict",
        "source_publisher":"The Guardian",
        "scores":(7,7,8,6,3,3,9,10),
        "base_keywords":["epstein-fbi conflict","disclosure ambiguity","institutional resistance","chronic exposure"],
    },
    {
        "subject":"Trump's Promise Absolutism Narrative",
        "date":"2026-03-04",
        "category":"Conspiracy Theories / Disinformation",
        "subcategory":"Systematic Presidential Lying",
        "metrics_key":"economy",
        "source_url":"https://www.pbs.org/newshour/politics/trump-says-hes-kept-all-of-his-campaign-promises-politifacts-maga-meter-shows-otherwise",
        "source_title":"PBS: Trump says he kept all promises; PolitiFact meter says otherwise",
        "source_publisher":"PBS NewsHour",
        "scores":(7,6,8,6,4,4,8,10),
        "base_keywords":["promise absolutism","meter mismatch","verifiability gap","benchmark pressure"],
    },
]

entries=[]
entry_number=1746
for c in clusters:
    danger,lawlessness,impact_scope,authoritarianism,insanity,absurdity,credibility_risk,recency_intensity = c["scores"]
    for a in angles:
        title=f"{c['subject']} {a['title_suffix']}"
        synopsis=(
            f"{c['source_publisher']} coverage indicated that {c['subject'].lower()} {a['synopsis']}. "
            "That pattern raises governance risk because institutional review and public verification cannot hold a stable pace when criteria and narrative framing keep shifting. "
            f"Across Trump's current profile, this dynamic continued to increase accountability pressure and credibility costs."
        )
        rationale=f"{c['source_publisher']} reporting indicated {c['subject'].lower()} {a['rationale']}."
        keywords=c["base_keywords"]+[a["keyword"]]
        scores=make_scores(
            c["date"],
            c["category"],
            c["subcategory"],
            danger,lawlessness,impact_scope,authoritarianism,insanity,absurdity,credibility_risk,recency_intensity,
            f"{c['subject']} {a['rationale']}"
        )
        entries.append({
            "entry_number":entry_number,
            "title":title,
            "date_start":c["date"],
            "date_end":c["date"],
            "synopsis":synopsis,
            "rationale":rationale,
            "category":c["category"],
            "subcategory":c["subcategory"],
            "keywords":keywords,
            "phase":"White House 2",
            "metrics_key":c["metrics_key"],
            "source_url":c["source_url"],
            "source_title":c["source_title"],
            "source_publisher":c["source_publisher"],
            "scores":scores,
        })
        entry_number += 1

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
