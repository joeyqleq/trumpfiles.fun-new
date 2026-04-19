#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from typing import Dict, List, Optional

import requests


TRUMP_RE = re.compile(r"\btrump\b|donald trump|trump's", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")


def strip_html(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", unescape(TAG_RE.sub(" ", text))).strip()


def normalize_url(url: str) -> str:
    if not url:
        return ""
    parsed = urllib.parse.urlparse(url.strip())
    query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    kept = {}
    for k, v in query.items():
        kl = k.lower()
        if kl.startswith("utm_") or kl in {
            "fbclid",
            "gclid",
            "cmp",
            "ocid",
            "ref",
            "outputtype",
            "rss",
            "rssfeed",
            "taid",
        }:
            continue
        kept[k] = v
    new_query = urllib.parse.urlencode(kept, doseq=True)
    path = parsed.path.rstrip("/") or "/"
    return urllib.parse.urlunparse(
        (parsed.scheme.lower(), parsed.netloc.lower(), path, "", new_query, "")
    )


def parse_date(value: str) -> Optional[str]:
    if not value:
        return None
    value = value.strip()
    value = value.replace("Z", "+00:00")
    for fmt in (
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
    ):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            pass
    try:
        return datetime.fromisoformat(value).date().isoformat()
    except ValueError:
        return None


def infer_publisher(url: str) -> str:
    host = urllib.parse.urlparse(url).netloc.lower()
    if "theguardian.com" in host:
        return "The Guardian"
    if "npr.org" in host:
        return "NPR"
    if "pbs.org" in host:
        return "PBS NewsHour"
    if "cbsnews.com" in host:
        return "CBS News"
    if "abcnews.go.com" in host or "abcnews.com" in host:
        return "ABC News"
    if "latimes.com" in host:
        return "Los Angeles Times"
    if "apnews.com" in host:
        return "AP News"
    if "nytimes.com" in host:
        return "New York Times"
    return host.replace("www.", "")


def read_database_url() -> Optional[str]:
    env_url = os.environ.get("DATABASE_URL")
    if env_url:
        return env_url.strip()
    env_file = ".env.local"
    if not os.path.exists(env_file):
        return None
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("DATABASE_URL="):
                return line.split("=", 1)[1].strip()
    return None


def load_existing_urls() -> set:
    db_url = read_database_url()
    if not db_url:
        return set()
    try:
        proc = subprocess.run(
            [
                "psql",
                db_url,
                "-At",
                "-F",
                "\t",
                "-c",
                "SELECT url FROM public.trump_sources WHERE url IS NOT NULL;",
            ],
            capture_output=True,
            text=True,
            check=True,
        )
    except Exception:
        return set()
    urls = set()
    for line in proc.stdout.splitlines():
        u = normalize_url(line.strip())
        if u:
            urls.add(u)
    return urls


def candidate_key(title: str, date: str) -> str:
    cleaned = re.sub(r"[^a-z0-9 ]+", " ", (title or "").lower())
    cleaned = re.sub(r"\b(live|updates?|analysis|opinion|video|podcast)\b", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return f"{date}|{cleaned}"


def fetch_guardian(
    from_date: str,
    to_date: str,
    max_pages: int,
    timeout: int,
) -> List[Dict]:
    base = "https://content.guardianapis.com/search"
    out: List[Dict] = []
    session = requests.Session()
    for page in range(1, max_pages + 1):
        params = {
            "q": "trump",
            "from-date": from_date,
            "to-date": to_date,
            "page-size": 200,
            "order-by": "newest",
            "api-key": "test",
            "show-fields": "headline,trailText,byline",
            "page": page,
        }
        r = session.get(base, params=params, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200:
            break
        js = r.json().get("response", {})
        results = js.get("results", [])
        if not results:
            break
        for it in results:
            title = (it.get("webTitle") or "").strip()
            desc = strip_html((it.get("fields") or {}).get("trailText") or "")
            url = normalize_url(it.get("webUrl") or "")
            date = parse_date(it.get("webPublicationDate") or "") or datetime.now(timezone.utc).date().isoformat()
            out.append(
                {
                    "url": url,
                    "title": title,
                    "description": desc,
                    "date_published": date,
                    "publisher": "The Guardian",
                    "source_type": "news",
                }
            )
        if page >= js.get("pages", page):
            break
        time.sleep(0.15)
    return out


def fetch_rss(feed_url: str, timeout: int) -> List[Dict]:
    out: List[Dict] = []
    r = requests.get(feed_url, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
    if r.status_code != 200:
        return out
    root = ET.fromstring(r.text)
    for item in root.findall(".//item"):
        title = strip_html(item.findtext("title") or "")
        desc = strip_html(item.findtext("description") or "")
        link = normalize_url(item.findtext("link") or "")
        pub = parse_date(item.findtext("pubDate") or "") or parse_date(item.findtext("{http://purl.org/dc/elements/1.1/}date") or "")
        if not pub:
            pub = datetime.now(timezone.utc).date().isoformat()
        out.append(
            {
                "url": link,
                "title": title,
                "description": desc,
                "date_published": pub,
                "publisher": infer_publisher(link),
                "source_type": "news",
            }
        )
    return out


def fetch_ap(timeout: int) -> List[Dict]:
    out: List[Dict] = []
    r = requests.get("https://apnews.com/hub/donald-trump", timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
    if r.status_code != 200:
        return out
    html = r.text
    # AP pages include article links and JSON blocks; grab URLs first.
    urls = sorted(set(re.findall(r"https://apnews.com/article/[a-zA-Z0-9\\-]+", html)))
    for u in urls:
        out.append(
            {
                "url": normalize_url(u),
                "title": "AP News report on Trump",
                "description": "",
                "date_published": datetime.now(timezone.utc).date().isoformat(),
                "publisher": "AP News",
                "source_type": "news",
            }
        )
    return out


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="/tmp/trump_candidate_pool.json")
    p.add_argument("--from-date", default="2025-11-01")
    p.add_argument("--to-date", default=datetime.now(timezone.utc).date().isoformat())
    p.add_argument("--guardian-pages", type=int, default=8)
    p.add_argument("--timeout", type=int, default=25)
    p.add_argument("--max-candidates", type=int, default=800)
    args = p.parse_args()

    existing_urls = load_existing_urls()
    seen_urls = set()
    seen_keys = set()
    candidates: List[Dict] = []

    def push(item: Dict) -> None:
        url = normalize_url(item.get("url", ""))
        title = (item.get("title") or "").strip()
        desc = (item.get("description") or "").strip()
        date = parse_date(item.get("date_published") or "") or datetime.now(timezone.utc).date().isoformat()
        if not url or not title:
            return
        if not TRUMP_RE.search(f"{title} {desc} {url}"):
            return
        if url in existing_urls or url in seen_urls:
            return
        key = candidate_key(title, date)
        if key in seen_keys:
            return
        seen_urls.add(url)
        seen_keys.add(key)
        candidates.append(
            {
                "url": url,
                "title": title,
                "description": desc,
                "date_published": date,
                "publisher": item.get("publisher") or infer_publisher(url),
                "source_type": item.get("source_type") or "news",
            }
        )

    for row in fetch_guardian(args.from_date, args.to_date, args.guardian_pages, args.timeout):
        push(row)

    feeds = [
        "https://feeds.npr.org/1014/rss.xml",
        "https://www.pbs.org/newshour/feeds/rss/politics",
        "https://www.theguardian.com/us-news/rss",
        "https://www.theguardian.com/world/rss",
        "https://www.theguardian.com/us-news/us-politics/rss",
        "https://www.cbsnews.com/latest/rss/politics",
        "https://abcnews.go.com/abcnews/politicsheadlines",
        "https://www.latimes.com/politics/rss2.0.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
    ]
    for feed in feeds:
        try:
            for row in fetch_rss(feed, args.timeout):
                push(row)
        except Exception:
            continue

    for row in fetch_ap(args.timeout):
        push(row)

    # newest first
    candidates.sort(key=lambda x: (x.get("date_published") or "", x.get("title") or ""), reverse=True)
    if len(candidates) > args.max_candidates:
        candidates = candidates[: args.max_candidates]

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(candidates, f, indent=2, ensure_ascii=False)

    print(json.dumps({
        "out": args.out,
        "candidate_count": len(candidates),
        "from_date": args.from_date,
        "to_date": args.to_date,
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
