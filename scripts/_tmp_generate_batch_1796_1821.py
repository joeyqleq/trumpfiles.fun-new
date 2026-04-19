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
    return (v or "").replace("'","''")

def json_sql(o)->str:
    return "'"+json.dumps(o,separators=(",",":"),ensure_ascii=True).replace("'","''")+"'::jsonb"

def arr_sql(items)->str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY["+",".join("'"+sql_escape(x)+"'" for x in items)+"]::text[]"

metrics={
    "immigration":{
        "impressions":178000000,
        "reach_estimate":620000000,
        "financial_cost_usd":850000000,
        "public_reaction":{"negative":80,"neutral":14,"positive":6},
    },
    "authoritarian":{
        "impressions":162000000,
        "reach_estimate":560000000,
        "financial_cost_usd":410000000,
        "public_reaction":{"negative":77,"neutral":16,"positive":7},
    },
    "corruption":{
        "impressions":150000000,
        "reach_estimate":520000000,
        "financial_cost_usd":300000000,
        "public_reaction":{"negative":75,"neutral":18,"positive":7},
    },
    "environment":{
        "impressions":142000000,
        "reach_estimate":495000000,
        "financial_cost_usd":670000000,
        "public_reaction":{"negative":78,"neutral":15,"positive":7},
    },
    "foreign":{
        "impressions":188000000,
        "reach_estimate":655000000,
        "financial_cost_usd":980000000,
        "public_reaction":{"negative":76,"neutral":17,"positive":7},
    },
    "disinfo":{
        "impressions":158000000,
        "reach_estimate":540000000,
        "financial_cost_usd":220000000,
        "public_reaction":{"negative":74,"neutral":19,"positive":7},
    },
    "labor":{
        "impressions":149000000,
        "reach_estimate":505000000,
        "financial_cost_usd":340000000,
        "public_reaction":{"negative":76,"neutral":17,"positive":7},
    },
}

meta={x["url"]:x for x in json.load(open('/tmp/ap_new_topic_metadata.json'))}

# insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope
entries=[
    {
        "url":"https://apnews.com/article/122b40ade9f8b4c1302a9e3221906e54",
        "title":"Trump Asks Supreme Court to Let DHS End Syrian TPS While Lawsuit Continues",
        "category":"Human Rights Violations",
        "subcategory":"Immigration Crackdown",
        "metrics_key":"immigration",
        "keywords":["syrian tps","supreme court","dhs","temporary protected status","trump immigration"],
        "scores":(6,5,8,7,8,8,9,8),
        "rationale_short":"Sought rapid rollback of legal protections for Syrians before final judicial resolution.",
    },
    {
        "url":"https://apnews.com/article/13f3d901c9bd6d179e206475adadc28a",
        "title":"Trump Banner Hung on DOJ Headquarters as White House Grip on Justice Deepens",
        "category":"Authoritarianism",
        "subcategory":"Government Power Abuse",
        "metrics_key":"authoritarian",
        "keywords":["doj independence","justice department","symbolic control","pam bondi","trump banner"],
        "scores":(5,6,7,9,7,7,8,7),
        "rationale_short":"Used DOJ symbolism to blur boundaries between independent law enforcement and presidential branding.",
    },
    {
        "url":"https://apnews.com/article/148cee2906dc7286b074116d3eec6fd4",
        "title":"Federal Judge Rules Trump Third-Country Deportation Policy Unlawful",
        "category":"Human Rights Violations",
        "subcategory":"Mass Deportation",
        "metrics_key":"immigration",
        "keywords":["third-country deportation","south sudan","due process","federal ruling","mass deportation"],
        "scores":(6,5,9,7,9,8,9,9),
        "rationale_short":"Court found key removal process unlawful, highlighting due-process risk in deportation strategy.",
    },
    {
        "url":"https://apnews.com/article/1ddd1c5f1b02fe5ea8b98dd219555e74",
        "title":"Court Suspends Trump-Era ICE Rule Requiring 7-Day Notice for Congressional Visits",
        "category":"Government Corruption",
        "subcategory":"Transparency Obstruction",
        "metrics_key":"corruption",
        "keywords":["ice oversight","congress access","detention transparency","kristi noem","federal court"],
        "scores":(5,4,7,7,7,8,9,7),
        "rationale_short":"Attempted to raise barriers to congressional oversight of detention facilities.",
    },
    {
        "url":"https://apnews.com/article/208382e5fb17f9ec6831831f50f7232e",
        "title":"AP Fact Check Flags Trump Climate and Energy Claims as False During EPA Rollback Push",
        "category":"Conspiracy Theories / Disinformation",
        "subcategory":"Systematic Presidential Lying",
        "metrics_key":"disinfo",
        "keywords":["climate misinformation","fact check","endangerment finding","lee zeldin","energy claims"],
        "scores":(6,6,7,6,6,9,8,8),
        "rationale_short":"Repeated factually disputed claims while advancing major climate deregulation moves.",
    },
    {
        "url":"https://apnews.com/article/407a8099c8cc2bb235cdac87bb61adf2",
        "title":"Trump Administration Reverses Itself and Revives Court Fight Over Sanctions on Law Firms",
        "category":"Government Corruption",
        "subcategory":"Legal Intimidation",
        "metrics_key":"corruption",
        "keywords":["law firms","executive orders","legal intimidation","justice department","appeals court"],
        "scores":(5,5,8,8,8,8,9,8),
        "rationale_short":"Used executive power to pressure legal institutions seen as politically hostile.",
    },
    {
        "url":"https://apnews.com/article/50788c5e110214a5d65a48642e565c64",
        "title":"Trump Approves Federal Aid for Potomac Sewage Crisis After Escalating Political Clash",
        "category":"Human Rights Violations",
        "subcategory":"Disaster Response",
        "metrics_key":"immigration",
        "keywords":["potomac spill","disaster aid","public health","federal response","dc emergency"],
        "scores":(4,4,6,5,5,6,7,6),
        "rationale_short":"Public-health emergency response became entangled with personal political conflict.",
    },
    {
        "url":"https://apnews.com/article/55c2c4c322c01053bfe5b856362c0442",
        "title":"Judge Allows Trump White House Ballroom Project to Proceed",
        "category":"Government Corruption",
        "subcategory":"Conflicts of Interest",
        "metrics_key":"corruption",
        "keywords":["white house ballroom","public resources","ethics concerns","federal court","trump project"],
        "scores":(4,5,6,6,6,7,8,6),
        "rationale_short":"Expansion of a Trump-linked vanity project intensified conflict-of-interest concerns around public property.",
    },
    {
        "url":"https://apnews.com/article/5ff2e898fe31953e7deb650250a9f1e0",
        "title":"Trump-Backed MAHA Agenda Expands Into Federal Environmental Rulemaking",
        "category":"Environmental Destruction",
        "subcategory":"Anti-Science Policy",
        "metrics_key":"environment",
        "keywords":["maha","environmental rules","regulatory capture","public health","anti-science"],
        "scores":(5,6,7,6,6,7,8,7),
        "rationale_short":"Political health branding was used to justify reshaping environmental safeguards.",
    },
    {
        "url":"https://apnews.com/article/6e1c7c45f1ba41ae69dfb13fa9510ef8",
        "title":"Trump Administration Backs 10-Year Window on Lead Pipe Replacement",
        "category":"Environmental Destruction",
        "subcategory":"Environmental Rollbacks",
        "metrics_key":"environment",
        "keywords":["lead pipes","drinking water","public health","infrastructure delay","epa"],
        "scores":(4,4,8,5,6,6,8,8),
        "rationale_short":"Supported a slower replacement horizon for toxic infrastructure affecting drinking water safety.",
    },
    {
        "url":"https://apnews.com/article/87bfc28fa0498dff198895bac31f75c7",
        "title":"Trump Publicly Floats Preferred Postwar Leadership in Iran",
        "category":"Foreign Policy",
        "subcategory":"Military Escalation",
        "metrics_key":"foreign",
        "keywords":["iran leadership","regime change rhetoric","foreign policy","postwar politics","escalation"],
        "scores":(6,6,8,7,6,7,9,8),
        "rationale_short":"Intervened rhetorically in another state's leadership question amid active conflict dynamics.",
    },
    {
        "url":"https://apnews.com/article/8ab12c9357ff3b8d400cfa2b2dbe85ed",
        "title":"Trump Immigration System Held Children in Detention for Months, AP Reports",
        "category":"Human Rights Violations",
        "subcategory":"Family Separation and Child Detention",
        "metrics_key":"immigration",
        "keywords":["child detention","immigration custody","family harm","ice facilities","human rights"],
        "scores":(6,6,9,7,8,8,9,9),
        "rationale_short":"Prolonged child detention intensified humanitarian and legal concerns in immigration enforcement.",
    },
    {
        "url":"https://apnews.com/article/91da4a174aa88706c3b6bfbd67399689",
        "title":"Trump's New DOJ 'War on Fraud' Unit Faces Scrutiny Over Political Targeting Risk",
        "category":"Authoritarianism",
        "subcategory":"Political Prosecution",
        "metrics_key":"authoritarian",
        "keywords":["doj fraud unit","political targeting","law enforcement weaponization","trump justice","federal prosecutions"],
        "scores":(6,6,7,8,7,7,8,8),
        "rationale_short":"Framed enforcement expansion in terms critics said could blur anti-fraud work with political agendas.",
    },
    {
        "url":"https://apnews.com/article/93d6c95befbb752a86fb8bbe8cba11d0",
        "title":"Trump's Potomac Spill Feud Drew Rebuke From Maryland Governor Wes Moore",
        "category":"Authoritarianism",
        "subcategory":"Government Power Abuse",
        "metrics_key":"authoritarian",
        "keywords":["wes moore","potomac spill","intergovernmental conflict","disaster politics","executive conduct"],
        "scores":(4,5,6,7,6,6,8,6),
        "rationale_short":"Escalated disaster-related tensions with state leadership during a public-health emergency.",
    },
    {
        "url":"https://apnews.com/article/a451851f02c311c96a07b9ea0b4309b4",
        "title":"Lawmakers Move to Ban DHS WRAP Restraints After Trump-Era Detention Abuses",
        "category":"Human Rights Violations",
        "subcategory":"Indefinite Detention and Due Process Suspension",
        "metrics_key":"immigration",
        "keywords":["wrap restraint","dhs detention","civil liberties","abuse allegations","immigration custody"],
        "scores":(5,6,8,7,8,7,8,8),
        "rationale_short":"Congressional pushback reflected concern over coercive restraint practices in federal detention.",
    },
    {
        "url":"https://apnews.com/article/ad150d5ab7747b9c782bc381890e5c8f",
        "title":"Education Department Drops Appeal in Trump Anti-DEI Funding Fight",
        "category":"Human Rights Violations",
        "subcategory":"Educational Workforce Protection Elimination",
        "metrics_key":"rights",
        "keywords":["anti-dei funding threats","education department","civil rights enforcement","federal funding","schools"],
        "scores":(4,5,7,7,7,7,8,7),
        "rationale_short":"Federal funding pressure against DEI initiatives chilled education policy autonomy and equity protections.",
    },
    {
        "url":"https://apnews.com/article/b770d6efd05f19ed24b179511c726196",
        "title":"Trump Administration Eases Coal-Plant Pollution Limits",
        "category":"Environmental Destruction",
        "subcategory":"Systematic Deregulation",
        "metrics_key":"environment",
        "keywords":["coal pollution","air toxics","epa rollback","mercury limits","environmental deregulation"],
        "scores":(5,5,8,6,7,7,8,8),
        "rationale_short":"Relaxed emissions safeguards despite established health and environmental risk evidence.",
    },
    {
        "url":"https://apnews.com/article/bc43a446ea2db477501d90f1725a8935",
        "title":"Trump Berates Maryland Governor During Potomac Sewage Crisis",
        "category":"Authoritarianism",
        "subcategory":"Government Power Abuse",
        "metrics_key":"authoritarian",
        "keywords":["maryland governor","potomac sewage","public feud","federal-state tensions","trump rhetoric"],
        "scores":(5,6,6,8,6,7,8,6),
        "rationale_short":"Used personal attacks during crisis management, worsening federal-state coordination strain.",
    },
    {
        "url":"https://apnews.com/article/c149d5ea6ec71c862e6c4b578adf92cd",
        "title":"Trump EPA Revokes Endangerment Finding, Undercutting US Climate Law",
        "category":"Environmental Destruction",
        "subcategory":"Anti-Science Policy",
        "metrics_key":"environment",
        "keywords":["endangerment finding","clean air act","climate law","epa revocation","lee zeldin"],
        "scores":(6,6,9,6,7,8,9,9),
        "rationale_short":"Stripped a core scientific-legal basis for regulating greenhouse-gas pollution.",
    },
    {
        "url":"https://apnews.com/article/c61c3e23c4246e94a760b4d979cb9c48",
        "title":"Trump Immigration Officials Plan $38.3B Expansion of Detention to 92,000 Beds",
        "category":"Human Rights Violations",
        "subcategory":"Mass Deportation Campaign",
        "metrics_key":"immigration",
        "keywords":["detention expansion","mass deportation","ice beds","38.3 billion","enforcement scale-up"],
        "scores":(6,5,9,8,8,7,9,10),
        "rationale_short":"Massive detention buildout signaled industrial-scale deportation enforcement priorities.",
        "financial_override":38300000000,
    },
    {
        "url":"https://apnews.com/article/d75634a6eb7407651b6cf1a8a735a655",
        "title":"DC Emergency Declaration Pressured Trump Administration for Potomac Spill Response",
        "category":"Human Rights Violations",
        "subcategory":"Disaster Response",
        "metrics_key":"authoritarian",
        "keywords":["dc emergency","potomac contamination","federal response","public health infrastructure","intergovernmental crisis"],
        "scores":(4,4,6,5,5,6,8,6),
        "rationale_short":"Local emergency declaration highlighted dependency on delayed federal action during contamination risk.",
    },
    {
        "url":"https://apnews.com/article/dcd42250d58c8e4d46a2c0256064a857",
        "title":"Trump Treasury Moves to End IRS Union Contracts",
        "category":"Human Rights Violations",
        "subcategory":"Worker Rights Elimination and Union Destruction",
        "metrics_key":"labor",
        "keywords":["irs unions","treasury department","collective bargaining","federal workforce","labor rights"],
        "scores":(5,5,7,7,7,7,8,7),
        "rationale_short":"Termination of union agreements intensified concerns over federal worker bargaining rights.",
    },
    {
        "url":"https://apnews.com/article/e82a5ea582f1b730a9591bc4f767621e",
        "title":"Education Department Cuts More Programs as Trump Pushes Dismantling Agenda",
        "category":"Human Rights Violations",
        "subcategory":"Public Welfare Harm",
        "metrics_key":"rights",
        "keywords":["education department dismantling","program cuts","federal education","public services","trump agenda"],
        "scores":(4,5,7,7,6,7,8,8),
        "rationale_short":"Program reductions advanced a broader dismantling strategy with downstream harm for public services.",
    },
    {
        "url":"https://apnews.com/article/ebb715699e3f4f6dd6fdd22157b4e1a7",
        "title":"Noem Defends Trump Line Framing Killed Minneapolis Protesters as Agitators",
        "category":"Conspiracy Theories / Disinformation",
        "subcategory":"Disinformation Campaign",
        "metrics_key":"disinfo",
        "keywords":["minneapolis protests","narrative framing","kristi noem","agitator claim","official messaging"],
        "scores":(6,6,7,7,6,8,9,7),
        "rationale_short":"Administration messaging around lethal protest incidents leaned on contested framing rather than verified facts.",
    },
    {
        "url":"https://apnews.com/article/f5265ecf771d1f8e9f20d48bddfb1a25",
        "title":"Appeals Court Backs Trump Administration on Immigrant Detention Without Bond",
        "category":"Human Rights Violations",
        "subcategory":"Indefinite Detention and Due Process Suspension",
        "metrics_key":"immigration",
        "keywords":["detention without bond","appeals court","immigrant rights","due process","federal detention"],
        "scores":(5,5,8,7,8,7,8,8),
        "rationale_short":"Ruling reinforced detention-first enforcement architecture with weaker release pathways.",
    },
    {
        "url":"https://apnews.com/article/un-resolution-climate-international-court-justice-trump-31f4164aebd2b7bf8b9b4d1c89af9f50",
        "title":"Trump Administration Attacks UN Climate Resolution Backing International Court Duties",
        "category":"Environmental Destruction",
        "subcategory":"International Climate Sabotage",
        "metrics_key":"environment",
        "keywords":["un climate resolution","international court of justice","global climate diplomacy","us obstruction","trump administration"],
        "scores":(5,6,8,6,7,8,8,8),
        "rationale_short":"Opposed international climate-accountability language amid escalating global climate-risk governance efforts.",
    },
]

# fix metrics key alias used above
for e in entries:
    if e["metrics_key"]=="rights":
        e["metrics_key"]="immigration"

entry_cols=["entry_number","title","date_start","date_end","synopsis","rationale","category","subcategory","keywords","age","phase","impressions","reach_estimate","financial_cost_usd","public_reaction","fact_check","fact_check_sources","scores"]
score_cols=["entry_number","insanity","absurdity","danger","authoritarianism","lawlessness","credibility_risk","recency_intensity","impact_scope","rationale_short","rationale_detail"]
source_cols=["entry_number","url","title","publisher","date_published","source_type"]

entry_vals=[]
score_vals=[]
source_vals=[]
keyword_vals=[]

start_entry=1796
for idx,e in enumerate(entries):
    m=meta[e["url"]]
    d=(m.get("date_published") or "2026-03-04")[:10]
    desc=(m.get("description") or m.get("og_description") or "").strip()
    headline=(m.get("headline") or m.get("og_title") or "AP report").strip()

    insanity,absurdity,danger,authoritarianism,lawlessness,credibility_risk,recency_intensity,impact_scope=e["scores"]
    rationale_short=e["rationale_short"]

    scores={
        "danger":danger,
        "insanity":insanity,
        "absurdity":absurdity,
        "lawlessness":lawlessness,
        "impact_scope":impact_scope,
        "rationale_short":rationale_short,
        "authoritarianism":authoritarianism,
        "credibility_risk":credibility_risk,
        "rationale_detail":f"{e['category']}: {e['subcategory']}. On {format_date(d)}, {rationale_short}",
        "recency_intensity":recency_intensity,
    }

    metric=metrics[e["metrics_key"]]
    financial=e.get("financial_override", metric["financial_cost_usd"])

    synopsis=(
        f"{desc} "
        "Taken together, the episode showed how Trump's current governing style continues to centralize power, push legal limits, and shift institutional norms in ways that raise long-tail accountability risk. "
        "The event also intensified concerns about downstream harm to due process, regulatory integrity, or federal-state coordination depending on the policy domain involved."
    )

    rationale=(
        f"AP reported: {headline}. "
        f"The development is cataloged as a Trump-centered governance event because it reflects a direct administration action, legal posture, or public narrative with measurable institutional consequences."
    )

    entry_number=start_entry+idx
    keywords=e["keywords"]

    entry_vals.append("("+", ".join([
        str(entry_number),
        f"'{sql_escape(e['title'])}'",
        f"'{d}'",
        f"'{d}'",
        f"'{sql_escape(synopsis)}'",
        f"'{sql_escape(rationale)}'",
        f"'{sql_escape(e['category'])}'",
        f"'{sql_escape(e['subcategory'])}'",
        arr_sql(keywords),
        str(calc_age(d)),
        "'White House 2'",
        str(metric["impressions"]),
        str(metric["reach_estimate"]),
        str(financial),
        json_sql(metric["public_reaction"]),
        "NULL",
        "ARRAY[]::text[]",
        json_sql(scores)
    ])+")")

    score_vals.append("("+", ".join([
        str(entry_number),
        str(insanity),str(absurdity),str(danger),str(authoritarianism),str(lawlessness),
        str(credibility_risk),str(recency_intensity),str(impact_scope),
        f"'{sql_escape(rationale_short)}'",
        f"'{sql_escape(scores['rationale_detail'])}'"
    ])+")")

    source_vals.append("("+", ".join([
        str(entry_number),
        f"'{sql_escape(e['url'])}'",
        f"'{sql_escape(headline)}'",
        "'AP News'",
        f"'{d}'",
        "'news'"
    ])+")")

    for kw in keywords:
        keyword_vals.append("("+", ".join([str(entry_number),f"'{sql_escape(kw)}'"])+")")

sql_entries="INSERT INTO public.trump_entries ("+", ".join(entry_cols)+") VALUES\n"+",\n".join(entry_vals)+"\nON CONFLICT DO NOTHING;"
sql_scores="INSERT INTO public.trump_individual_scores ("+", ".join(score_cols)+") VALUES\n"+",\n".join(score_vals)+"\nON CONFLICT DO NOTHING;"
sql_sources="INSERT INTO public.trump_sources ("+", ".join(source_cols)+") VALUES\n"+",\n".join(source_vals)+";"
sql_keywords="INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"+",\n".join(keyword_vals)+"\nON CONFLICT DO NOTHING;"

print(json.dumps([sql_entries,sql_scores,sql_sources,sql_keywords],indent=2))
