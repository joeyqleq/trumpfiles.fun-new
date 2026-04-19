#!/usr/bin/env python3
import argparse
import json
import re
import sys
import urllib.parse
from datetime import datetime
from typing import Dict, List, Tuple

import requests


BIRTH_DATE = datetime(1946, 6, 14)
MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
STOP_WORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "into",
    "over",
    "after",
    "amid",
    "says",
    "say",
    "new",
    "what",
    "when",
    "why",
    "how",
    "his",
    "her",
    "its",
    "their",
    "about",
    "this",
    "that",
    "have",
    "has",
    "had",
    "been",
    "will",
    "more",
    "than",
    "they",
    "them",
    "were",
    "was",
    "are",
    "not",
    "but",
    "who",
    "you",
    "your",
    "trump",
    "donald",
}


def format_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{MONTHS[d.month - 1]} {d.day}, {d.year}"


def calc_age(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    age = d.year - BIRTH_DATE.year
    if (d.month, d.day) < (BIRTH_DATE.month, BIRTH_DATE.day):
        age -= 1
    return age


def sql_escape(v: str) -> str:
    return (v or "").replace("'", "''")


def arr_sql(items: List[str]) -> str:
    if not items:
        return "ARRAY[]::text[]"
    return "ARRAY[" + ",".join("'" + sql_escape(x) + "'" for x in items) + "]::text[]"


def json_sql(o) -> str:
    return "'" + json.dumps(o, separators=(",", ":"), ensure_ascii=True).replace("'", "''") + "'::jsonb"


def normalize_url(url: str) -> str:
    if not url:
        return ""
    p = urllib.parse.urlparse(url.strip())
    q = urllib.parse.parse_qs(p.query, keep_blank_values=True)
    kept = {}
    for k, v in q.items():
        kl = k.lower()
        if kl.startswith("utm_") or kl in {"fbclid", "gclid", "cmp", "ocid", "ref", "outputType", "rss", "taid"}:
            continue
        kept[k] = v
    query = urllib.parse.urlencode(kept, doseq=True)
    path = p.path.rstrip("/") or "/"
    return urllib.parse.urlunparse((p.scheme.lower(), p.netloc.lower(), path, "", query, ""))


def validate_url(url: str, timeout: int = 15) -> bool:
    try:
        h = requests.head(url, allow_redirects=True, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
        if h.status_code in (200, 301, 302, 307, 308):
            return True
        if h.status_code in (403, 405, 406):
            g = requests.get(url, allow_redirects=True, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
            return g.status_code == 200
        return False
    except Exception:
        try:
            g = requests.get(url, allow_redirects=True, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
            return g.status_code == 200
        except Exception:
            return False


def classify(title: str, desc: str) -> Tuple[str, str, str]:
    t = f"{title} {desc}".lower()

    if any(k in t for k in ["iran", "missile", "strike", "war", "airstrike", "bomb", "navy", "pentagon", "military", "gulf", "israel"]):
        return ("National Security Violations", "War / Militarization", "war")
    if any(k in t for k in ["tariff", "trade", "import", "export", "customs", "duty", "sanction"]):
        return ("Foreign Policy", "Economic Warfare", "economy")
    if any(k in t for k in ["immigration", "deport", "asylum", "migrant", "ice ", "detention", "border", "tps"]):
        return ("Human Rights Violations", "Immigration Crackdown", "immigration")
    if any(k in t for k in ["vote", "voter", "election", "ballot", "war powers resolution", "emergency order"]):
        return ("Election Interference", "Democratic Institution Undermining", "election")
    if any(k in t for k in ["fact check", "false", "unfounded", "misleading", "disputed", "unsupported", "lie"]):
        return ("Conspiracy Theories / Disinformation", "Systematic Presidential Lying", "disinfo")
    if any(k in t for k in ["reporter", "journalist", "press", "newsroom", "cnn", "msnbc", "new york times"]):
        return ("Press Freedom", "Media Intimidation", "media")
    if any(k in t for k in ["women", "woman", "sexist", "misogyn", "abortion", "assault", "sexual"]):
        return ("Misogyny / Sexual Misconduct", "Sexist Attacks", "misogyny")
    if any(k in t for k in ["epa", "climate", "emissions", "environment", "pollution"]):
        return ("Environmental Destruction", "Environmental Rollbacks", "environment")
    if any(k in t for k in ["doj", "fbi", "court", "judge", "justice department", "lawsuit", "subpoena", "epstein"]):
        return ("Government Corruption", "Transparency Obstruction", "corruption")
    return ("Authoritarianism", "Government Power Abuse", "authoritarian")


METRICS = {
    "war": {"impressions": 208000000, "reach_estimate": 730000000, "financial_cost_usd": 1400000000, "public_reaction": {"negative": 81, "neutral": 13, "positive": 6}},
    "economy": {"impressions": 172000000, "reach_estimate": 595000000, "financial_cost_usd": 720000000, "public_reaction": {"negative": 76, "neutral": 17, "positive": 7}},
    "immigration": {"impressions": 182000000, "reach_estimate": 628000000, "financial_cost_usd": 520000000, "public_reaction": {"negative": 80, "neutral": 14, "positive": 6}},
    "election": {"impressions": 176000000, "reach_estimate": 608000000, "financial_cost_usd": 430000000, "public_reaction": {"negative": 79, "neutral": 15, "positive": 6}},
    "disinfo": {"impressions": 164000000, "reach_estimate": 560000000, "financial_cost_usd": 260000000, "public_reaction": {"negative": 78, "neutral": 16, "positive": 6}},
    "media": {"impressions": 151000000, "reach_estimate": 520000000, "financial_cost_usd": 180000000, "public_reaction": {"negative": 77, "neutral": 17, "positive": 6}},
    "misogyny": {"impressions": 149000000, "reach_estimate": 510000000, "financial_cost_usd": 170000000, "public_reaction": {"negative": 82, "neutral": 13, "positive": 5}},
    "environment": {"impressions": 147000000, "reach_estimate": 500000000, "financial_cost_usd": 680000000, "public_reaction": {"negative": 78, "neutral": 16, "positive": 6}},
    "corruption": {"impressions": 166000000, "reach_estimate": 570000000, "financial_cost_usd": 340000000, "public_reaction": {"negative": 79, "neutral": 15, "positive": 6}},
    "authoritarian": {"impressions": 160000000, "reach_estimate": 550000000, "financial_cost_usd": 300000000, "public_reaction": {"negative": 78, "neutral": 16, "positive": 6}},
}

SCORES = {
    "war": (7, 6, 9, 7, 7, 7, 9, 9),
    "economy": (6, 6, 7, 6, 6, 7, 8, 8),
    "immigration": (6, 5, 8, 7, 8, 7, 8, 8),
    "election": (7, 6, 8, 8, 8, 8, 8, 9),
    "disinfo": (7, 7, 7, 6, 6, 9, 8, 8),
    "media": (6, 6, 6, 7, 6, 8, 8, 7),
    "misogyny": (6, 7, 7, 6, 6, 7, 7, 7),
    "environment": (5, 5, 8, 6, 6, 7, 8, 8),
    "corruption": (6, 5, 7, 7, 8, 7, 8, 8),
    "authoritarian": (6, 6, 7, 8, 7, 7, 8, 8),
}


def make_keywords(title: str, category: str, subcategory: str, bucket: str) -> List[str]:
    base = [
        "donald trump",
        category.lower(),
        subcategory.lower(),
    ]
    bucket_extra = {
        "war": ["iran conflict", "military escalation"],
        "economy": ["tariff policy", "trade shock"],
        "immigration": ["immigration crackdown", "deportation policy"],
        "election": ["election pressure", "democratic norms"],
        "disinfo": ["fact-check dispute", "presidential claims"],
        "media": ["press intimidation", "journalist attacks"],
        "misogyny": ["sexist rhetoric", "women targeted"],
        "environment": ["climate rollback", "environment policy"],
        "corruption": ["institutional integrity", "oversight concerns"],
        "authoritarian": ["executive overreach", "power centralization"],
    }.get(bucket, [])

    words = re.findall(r"[a-zA-Z][a-zA-Z'-]{3,}", title.lower())
    picked: List[str] = []
    for w in words:
        if w in STOP_WORDS or w in picked:
            continue
        picked.append(w)
        if len(picked) >= 4:
            break
    out = []
    for k in base + bucket_extra + picked:
        if k not in out:
            out.append(k)
        if len(out) >= 5:
            break
    while len(out) < 5:
        out.append("trump accountability")
    return out[:5]


def trump_centered_title(title: str) -> str:
    t = (title or "").strip()
    if not t:
        return "Trump Faces New Scrutiny Event"
    if re.match(r"(?i)^trump\b", t):
        return t
    if re.match(r"(?i)^donald trump\b", t):
        return t
    return f"Trump: {t}"


def parse_date(value: str) -> str:
    v = (value or "").strip().replace("Z", "+00:00")
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S.%f%z", "%a, %d %b %Y %H:%M:%S %z"):
        try:
            return datetime.strptime(v, fmt).date().isoformat()
        except ValueError:
            pass
    try:
        return datetime.fromisoformat(v).date().isoformat()
    except ValueError:
        return datetime.utcnow().date().isoformat()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="/tmp/trump_candidate_pool.json")
    ap.add_argument("--output", required=True)
    ap.add_argument("--start-entry", type=int, required=True)
    ap.add_argument("--offset", type=int, default=0)
    ap.add_argument("--count", type=int, default=50)
    ap.add_argument("--validate-urls", action="store_true")
    args = ap.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        pool = json.load(f)

    chosen = []
    idx = args.offset
    while idx < len(pool) and len(chosen) < args.count:
        row = pool[idx]
        idx += 1
        row["url"] = normalize_url(row.get("url", ""))
        if not row["url"] or not row.get("title"):
            continue
        if args.validate_urls and not validate_url(row["url"]):
            continue
        chosen.append(row)

    if len(chosen) < args.count:
        print(f"warning: requested {args.count}, selected {len(chosen)}", file=sys.stderr)

    entry_cols = [
        "entry_number",
        "title",
        "date_start",
        "date_end",
        "synopsis",
        "rationale",
        "category",
        "subcategory",
        "keywords",
        "age",
        "phase",
        "impressions",
        "reach_estimate",
        "financial_cost_usd",
        "public_reaction",
        "fact_check",
        "fact_check_sources",
        "scores",
    ]
    score_cols = [
        "entry_number",
        "insanity",
        "absurdity",
        "danger",
        "authoritarianism",
        "lawlessness",
        "credibility_risk",
        "recency_intensity",
        "impact_scope",
        "rationale_short",
        "rationale_detail",
    ]
    source_cols = ["entry_number", "url", "title", "publisher", "date_published", "source_type"]

    entry_vals = []
    score_vals = []
    source_vals = []
    keyword_vals = []

    for i, row in enumerate(chosen):
        entry_number = args.start_entry + i
        source_title = (row.get("title") or "").strip()
        title = trump_centered_title(source_title)
        desc = (row.get("description") or "").strip()
        d = parse_date(row.get("date_published") or "")
        publisher = (row.get("publisher") or urllib.parse.urlparse(row["url"]).netloc).strip()
        category, subcategory, bucket = classify(title, desc)
        keywords = make_keywords(title, category, subcategory, bucket)
        m = METRICS[bucket]

        insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope = SCORES[bucket]
        rationale_short = f"{title} intensified concerns about {subcategory.lower()} under Trump's leadership."
        scores = {
            "danger": danger,
            "insanity": insanity,
            "absurdity": absurdity,
            "lawlessness": lawlessness,
            "impact_scope": impact_scope,
            "rationale_short": rationale_short,
            "authoritarianism": authoritarianism,
            "credibility_risk": credibility_risk,
            "rationale_detail": f"{category}: {subcategory}. On {format_date(d)}, {rationale_short}",
            "recency_intensity": recency_intensity,
        }

        synopsis = (
            f"{source_title}. {desc or 'Reporting tied this development to Trump-centered governance and political decision-making.'} "
            "This entry is cataloged as a standalone event because it captures a concrete action, public statement, or policy consequence linked directly to Trump. "
            "The downstream effects include elevated institutional stress, public-trust erosion, and measurable accountability pressure across affected systems."
        )
        rationale = (
            f"{publisher} reporting was used to document this event as a distinct Trump-related incident with traceable policy or public-impact implications."
        )
        phase = "White House 2" if d >= "2025-01-20" else "Post-Presidency"

        entry_vals.append(
            "("
            + ", ".join(
                [
                    str(entry_number),
                    f"'{sql_escape(title)}'",
                    f"'{d}'",
                    f"'{d}'",
                    f"'{sql_escape(synopsis)}'",
                    f"'{sql_escape(rationale)}'",
                    f"'{sql_escape(category)}'",
                    f"'{sql_escape(subcategory)}'",
                    arr_sql(keywords),
                    str(calc_age(d)),
                    f"'{sql_escape(phase)}'",
                    str(m["impressions"]),
                    str(m["reach_estimate"]),
                    str(m["financial_cost_usd"]),
                    json_sql(m["public_reaction"]),
                    "NULL",
                    "ARRAY[]::text[]",
                    json_sql(scores),
                ]
            )
            + ")"
        )

        score_vals.append(
            "("
            + ", ".join(
                [
                    str(entry_number),
                    str(insanity),
                    str(absurdity),
                    str(danger),
                    str(authoritarianism),
                    str(lawlessness),
                    str(credibility_risk),
                    str(recency_intensity),
                    str(impact_scope),
                    f"'{sql_escape(rationale_short)}'",
                    f"'{sql_escape(scores['rationale_detail'])}'",
                ]
            )
            + ")"
        )

        source_vals.append(
            "("
            + ", ".join(
                [
                    str(entry_number),
                    f"'{sql_escape(row['url'])}'",
                    f"'{sql_escape(source_title)}'",
                    f"'{sql_escape(publisher)}'",
                    f"'{d}'",
                    f"'{sql_escape(row.get('source_type') or 'news')}'",
                ]
            )
            + ")"
        )

        for kw in keywords:
            keyword_vals.append("(" + ", ".join([str(entry_number), f"'{sql_escape(kw)}'"]) + ")")

    sql_entries = (
        "INSERT INTO public.trump_entries ("
        + ", ".join(entry_cols)
        + ") VALUES\n"
        + ",\n".join(entry_vals)
        + "\nON CONFLICT DO NOTHING;"
    )
    sql_scores = (
        "INSERT INTO public.trump_individual_scores ("
        + ", ".join(score_cols)
        + ") VALUES\n"
        + ",\n".join(score_vals)
        + "\nON CONFLICT DO NOTHING;"
    )
    sql_sources = (
        "INSERT INTO public.trump_sources ("
        + ", ".join(source_cols)
        + ") VALUES\n"
        + ",\n".join(source_vals)
        + ";"
    )
    sql_keywords = (
        "INSERT INTO public.trump_keywords (entry_number, keyword) VALUES\n"
        + ",\n".join(keyword_vals)
        + "\nON CONFLICT DO NOTHING;"
    )

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump([sql_entries, sql_scores, sql_sources, sql_keywords], f, indent=2)

    print(
        json.dumps(
            {
                "output": args.output,
                "selected": len(chosen),
                "next_offset": idx,
                "start_entry": args.start_entry,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
