import json
from datetime import datetime

birth_date=datetime(1946,6,14)
months=["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."]

def calc_age(date_str:str)->int:
    d=datetime.strptime(date_str,"%Y-%m-%d")
    a=d.year-birth_date.year
    if (d.month,d.day)<(birth_date.month,birth_date.day):
        a-=1
    return a

def format_date(date_str:str)->str:
    d=datetime.strptime(date_str,"%Y-%m-%d")
    return f"{months[d.month-1]} {d.day}, {d.year}"

def sql_escape(v:str)->str:
    return (v or "").replace("'","''")

def arr_sql(items):
    return "ARRAY["+",".join("'"+sql_escape(x)+"'" for x in items)+"]::text[]" if items else "ARRAY[]::text[]"

def json_sql(obj):
    return "'"+json.dumps(obj,separators=(",",":"),ensure_ascii=True).replace("'","''")+"'::jsonb"

metrics={
    "campaign": {"impressions":123000000,"reach_estimate":420000000,"financial_cost_usd":160000000,"public_reaction":{"negative":81,"neutral":13,"positive":6}},
    "wh1": {"impressions":138000000,"reach_estimate":470000000,"financial_cost_usd":210000000,"public_reaction":{"negative":82,"neutral":12,"positive":6}},
    "post": {"impressions":146000000,"reach_estimate":500000000,"financial_cost_usd":190000000,"public_reaction":{"negative":83,"neutral":11,"positive":6}},
    "wh2": {"impressions":172000000,"reach_estimate":590000000,"financial_cost_usd":260000000,"public_reaction":{"negative":84,"neutral":10,"positive":6}},
}

entries=[
    {
        "entry_number":1822,
        "title":"Trump's 'Nasty Woman' Debate Remark Used Gendered Insult on National Stage",
        "date":"2016-10-19",
        "phase":"Presidential Campaign",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://time.com/4537960/donald-trump-hillary-clinton-nasty-woman-debate/",
        "source_title":"Watch Trump Call Clinton a 'Nasty Woman'",
        "publisher":"Time",
        "metrics_key":"campaign",
        "keywords":["nasty woman","2016 debate","gendered insult","hillary clinton","campaign misogyny"],
        "synopsis":"During the October 19, 2016 presidential debate, Trump interrupted Hillary Clinton with the phrase 'nasty woman.' The remark instantly became one of the defining misogynistic flashpoints of the campaign because it framed a female opponent's assertiveness as a character defect. The clip circulated globally and became a shorthand example of Trump's gendered attack style in high-visibility political settings.",
        "rationale_short":"Used nationally televised debate time to deploy a gendered insult against a female opponent.",
        "scores":(5,7,6,6,5,7,7,8),
    },
    {
        "entry_number":1823,
        "title":"Trump Said Women Should Face 'Some Form of Punishment' for Abortions",
        "date":"2016-03-30",
        "phase":"Presidential Campaign",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.pbs.org/newshour/politics/trump-says-abortion-ban-should-yield-punishment-for-woman",
        "source_title":"Updated: Trump backs off statement on abortion punishment",
        "publisher":"PBS NewsHour",
        "metrics_key":"campaign",
        "keywords":["abortion punishment","reproductive rights","women punishment","campaign statement","policy misogyny"],
        "synopsis":"In March 2016, Trump said that if abortion were outlawed there should be 'some form of punishment' for women who sought abortions, then later tried to walk the comment back. The episode was widely treated as a revealing statement of punitive gender politics: criminal consequence framed first around women rather than around state policy design. It remains one of the clearest examples of Trump publicly endorsing punishment language aimed at women over reproductive decisions.",
        "rationale_short":"Advocated punitive consequences for women in abortion scenarios before retreating under backlash.",
        "scores":(6,6,8,7,7,8,7,9),
    },
    {
        "entry_number":1824,
        "title":"Trump Called Stormy Daniels 'Horseface' After Court Ruling",
        "date":"2018-10-16",
        "phase":"White House 1",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.cnbc.com/2018/10/16/trump-calls-stormy-daniels-horseface-as-he-gloats-about-lawsuit-dismissal.html",
        "source_title":"Trump calls Stormy Daniels 'Horseface' as he gloats about her lawsuit being dismissed",
        "publisher":"CNBC",
        "metrics_key":"wh1",
        "keywords":["stormy daniels","horseface","public insult","presidential conduct","sexist slur"],
        "synopsis":"After a court dismissed a defamation case in 2018, Trump publicly called Stormy Daniels 'Horseface.' The insult was a personal, appearance-based attack delivered by a sitting president against a woman in active legal conflict with him. The incident reinforced a recurrent pattern: when challenged, Trump escalated to demeaning gendered ridicule rather than confining his response to legal argument.",
        "rationale_short":"Used a demeaning appearance-based insult toward a woman involved in legal proceedings against him.",
        "scores":(5,7,6,6,6,7,8,7),
    },
    {
        "entry_number":1825,
        "title":"CNN Debate Coverage Recounted Trump's 'Fat Pig' and 'Face of a Dog' Attacks on Women",
        "date":"2015-08-08",
        "phase":"Presidential Campaign",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://transcripts.cnn.com/show/cnr/date/2015-08-08/segment/01",
        "source_title":"CNN transcript (Aug. 8, 2015) citing Trump's insults toward women",
        "publisher":"CNN",
        "metrics_key":"campaign",
        "keywords":["fat pig","face of a dog","rosie odonnell","sexist insults","gop debate"],
        "synopsis":"Post-debate CNN coverage quoted Trump's prior language about women, including calling Rosie O'Donnell a 'fat pig' and describing columnist Gail Collins as having the 'face of a dog.' The recap highlighted that these were not isolated slips but part of an established public vocabulary of contempt aimed at women. The controversy became central to early assessments of Trump's treatment of women in politics and media.",
        "rationale_short":"Publicly documented repeated demeaning descriptors aimed at women during campaign-era media scrutiny.",
        "scores":(5,7,6,6,6,7,7,7),
    },
    {
        "entry_number":1826,
        "title":"CNN Transcript Captured Trump's 'Flat-Chested ... Hard to Be a 10' Remark",
        "date":"2016-09-30",
        "phase":"Presidential Campaign",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://transcripts.cnn.com/show/cnnt/date/2016-09-30/segment/02",
        "source_title":"CNN transcript (Sept. 30, 2016) replaying Howard Stern-era comments",
        "publisher":"CNN",
        "metrics_key":"campaign",
        "keywords":["flat-chested quote","appearance scoring","howard stern","women objectification","campaign controversy"],
        "synopsis":"A CNN transcript in 2016 replayed Trump's earlier on-air comment that 'a person who's flat-chested is very hard to be a 10.' The quote reflected explicit rating and objectification language about women's bodies, repackaged into campaign-era accountability debates. Its resurfacing illustrated how earlier entertainment-era remarks remained politically relevant when evaluating presidential character and gender attitudes.",
        "rationale_short":"Reduced women to appearance scoring language while campaign accountability debates were active.",
        "scores":(5,7,6,5,5,7,7,7),
    },
    {
        "entry_number":1827,
        "title":"Trump's CNN Town Hall Featured Personal Smears at Moderator Kaitlan Collins",
        "date":"2023-05-10",
        "phase":"Post-Presidency",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.cnbc.com/2023/05/10/trump-cnn-town-hall.html",
        "source_title":"Trump pushes false election claims, mocks E. Jean Carroll to applause during CNN town hall",
        "publisher":"CNBC",
        "metrics_key":"post",
        "keywords":["kaitlan collins","cnn town hall","moderator attacks","media intimidation","gendered hostility"],
        "synopsis":"During CNN's May 2023 town hall, Trump repeatedly shifted from policy responses to personal attacks toward moderator Kaitlan Collins while the audience reacted in real time. Coverage of the event documented a familiar tactic: discrediting a female journalist through derision and confrontation rather than engagement with the question. The segment became a high-profile example of Trump's televised hostility toward women in journalistic roles.",
        "rationale_short":"Used nationally televised Q&A to target a female moderator with personal derision.",
        "scores":(5,6,6,7,6,7,8,7),
    },
    {
        "entry_number":1828,
        "title":"Guardian Reported Trump Called a Female Reporter 'Piggy' During Epstein Questioning",
        "date":"2025-11-24",
        "phase":"White House 2",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.theguardian.com/us-news/2025/nov/24/trump-insults-female-journalists",
        "source_title":"As Epstein questions linger, Trump falls back into familiar habit: lashing out at female reporters",
        "publisher":"The Guardian",
        "metrics_key":"wh2",
        "keywords":["piggy insult","female journalists","epstein questions","press hostility","white house 2"],
        "synopsis":"The Guardian documented Trump calling a female reporter 'piggy' while fielding questions tied to Epstein-file scrutiny, alongside additional hostile exchanges with women in the press corps. The incident fit a longer pattern in which Trump personalizes conflict with female reporters using belittling language. In political communication terms, the tactic converts accountability moments into intimidation theater aimed at discrediting questioners.",
        "rationale_short":"Used demeaning, gender-coded insult language toward female reporters under accountability pressure.",
        "scores":(6,7,7,8,7,8,9,8),
    },
    {
        "entry_number":1829,
        "title":"Trump Called New York Times Reporter Katie Rogers 'Ugly' in Truth Social Attack",
        "date":"2025-11-26",
        "phase":"White House 2",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.theguardian.com/us-news/2025/nov/26/trump-insults-new-york-times-reporter-katie-rogers",
        "source_title":"Trump calls New York Times reporter 'ugly' in latest insult to female journalist",
        "publisher":"The Guardian",
        "metrics_key":"wh2",
        "keywords":["katie rogers","truth social attack","ugly insult","female reporter","press intimidation"],
        "synopsis":"In a Truth Social post, Trump attacked New York Times reporter Katie Rogers by calling her 'ugly' after coverage questioning his pace and stamina. The message was notable for switching from argument to appearance-focused personal attack on a woman journalist. As with prior incidents, the rhetorical move redirected scrutiny away from the underlying reporting and toward humiliation of the reporter herself.",
        "rationale_short":"Responded to reporting with appearance-based insult aimed at a female journalist.",
        "scores":(6,7,7,8,7,8,9,8),
    },
    {
        "entry_number":1830,
        "title":"Trump Called Kaitlan Collins 'Always Stupid and Nasty' in Typo-Filled Attack",
        "date":"2025-12-06",
        "phase":"White House 2",
        "category":"Misogyny / Sexual Misconduct",
        "subcategory":"Sexist Attacks",
        "source_url":"https://www.thewrap.com/trump-attack-against-kaitlan-collins-cnn-misspell-name/",
        "source_title":"Trump Viciously Attacks CNN's Kaitlan Collins — 'Always Stupid and Nasty'",
        "publisher":"TheWrap",
        "metrics_key":"wh2",
        "keywords":["kaitlan collins","stupid and nasty","female reporter attacks","social media insult","media hostility"],
        "synopsis":"Trump published an early-morning post calling CNN anchor Kaitlan Collins 'always stupid and nasty' while misspelling her name and attacking her for asking questions about his White House plans. The attack continued his recurring habit of personal, gender-coded contempt toward women journalists. Rather than rebutting the reporting substance, the post reframed scrutiny as a personal grievance against the reporter.",
        "rationale_short":"Used social-media blast to demean a female journalist with repeated personal insults.",
        "scores":(6,7,7,8,7,8,9,8),
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
    insanity,absurdity,danger,authoritarianism,lawlessness,credibility_risk,recency_intensity,impact_scope=e["scores"]
    m=metrics[e["metrics_key"]]
    scores={
        "danger":danger,
        "insanity":insanity,
        "absurdity":absurdity,
        "lawlessness":lawlessness,
        "impact_scope":impact_scope,
        "rationale_short":e["rationale_short"],
        "authoritarianism":authoritarianism,
        "credibility_risk":credibility_risk,
        "rationale_detail":f"{e['category']}: {e['subcategory']}. On {format_date(e['date'])}, {e['rationale_short']}",
        "recency_intensity":recency_intensity,
    }

    rationale=(
        f"{e['publisher']} documentation connected this incident to Trump's recurring pattern of gendered personal attacks. "
        "The entry is recorded as a stand-alone misogyny event because the language targeted a woman's body, competence, or legitimacy rather than addressing substantive argument."
    )

    entry_vals.append("("+", ".join([
        str(e["entry_number"]),
        f"'{sql_escape(e['title'])}'",
        f"'{e['date']}'",
        f"'{e['date']}'",
        f"'{sql_escape(e['synopsis'])}'",
        f"'{sql_escape(rationale)}'",
        f"'{sql_escape(e['category'])}'",
        f"'{sql_escape(e['subcategory'])}'",
        arr_sql(e["keywords"]),
        str(calc_age(e["date"])),
        f"'{sql_escape(e['phase'])}'",
        str(m["impressions"]),
        str(m["reach_estimate"]),
        str(m["financial_cost_usd"]),
        json_sql(m["public_reaction"]),
        "NULL",
        "ARRAY[]::text[]",
        json_sql(scores)
    ])+")")

    score_vals.append("("+", ".join([
        str(e["entry_number"]),
        str(insanity),str(absurdity),str(danger),str(authoritarianism),str(lawlessness),str(credibility_risk),str(recency_intensity),str(impact_scope),
        f"'{sql_escape(e['rationale_short'])}'",
        f"'{sql_escape(scores['rationale_detail'])}'"
    ])+")")

    source_vals.append("("+", ".join([
        str(e["entry_number"]),
        f"'{sql_escape(e['source_url'])}'",
        f"'{sql_escape(e['source_title'])}'",
        f"'{sql_escape(e['publisher'])}'",
        f"'{e['date']}'",
        "'news'"
    ])+")")

    for kw in e["keywords"]:
        keyword_vals.append("("+", ".join([str(e["entry_number"]),f"'{sql_escape(kw)}'"])+")")

sql_entries="INSERT INTO public.trump_entries ("+", ".join(entry_cols)+") VALUES\n"+",\n".join(entry_vals)+"\nON CONFLICT DO NOTHING;"
sql_scores="INSERT INTO public.trump_individual_scores ("+", ".join(score_cols)+") VALUES\n"+",\n".join(score_vals)+"\nON CONFLICT DO NOTHING;"
sql_sources="INSERT INTO public.trump_sources ("+", ".join(source_cols)+") VALUES\n"+",\n".join(source_vals)+";"
sql_keywords="INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"+",\n".join(keyword_vals)+"\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries,sql_scores,sql_sources,sql_keywords],indent=2))
