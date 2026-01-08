#!/usr/bin/env python3
"""
Fetch representative photos for top entries using source URLs.
- Picks top N entries by composite_score with sources URLs
- Extracts og:image/twitter:image/JSON-LD image
- Downloads to catalog_images
- Writes MAPPING.json with entry->image mapping

Cost: single script run, HTTP GETs only, no paid APIs.
"""
import os
import re
import json
import time
import math
import html
import sys
from urllib.parse import urljoin, urlparse

import psycopg2
import requests
from bs4 import BeautifulSoup

DB_URL = "postgresql://neondb_owner:npg_UtmAiIbTx51q@ep-fancy-queen-aaooa4ag-pooler.westus3.azure.neon.tech/neondb?sslmode=require"
OUT_DIR = "/Users/joeyq/Desktop/trumpfiles.fun-warp/public/catalog_images"
MAX_ENTRIES = int(os.getenv("MAX_ENTRIES", "20"))

os.makedirs(OUT_DIR, exist_ok=True)

S = requests.Session()
S.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
})

META_CANDIDATE_KEYS = [
    ("meta", {"property": "og:image"}),
    ("meta", {"name": "og:image"}),
    ("meta", {"name": "twitter:image"}),
    ("link", {"rel": ["image_src"]}),
]


def first(items):
    return items[0] if items else None


def pick_best_image_url(page_url: str, html_text: str) -> str | None:
    soup = BeautifulSoup(html_text, "html.parser")

    # 1) Standard meta tags
    for tag, attrs in META_CANDIDATE_KEYS:
        elements = soup.find_all(tag)
        for el in elements:
            # rel handling
            if tag == "link" and "rel" in attrs:
                if not set(attrs["rel"]).issubset(set(el.get("rel", []))):
                    continue
                href = el.get("href")
                if href:
                    return urljoin(page_url, href)
            # property/name handling
            if tag == "meta":
                prop = el.get("property") or el.get("name")
                content = el.get("content")
                if prop and content and any(k in prop for k in ["og:image", "twitter:image"]):
                    return urljoin(page_url, content)

    # 2) JSON-LD NewsArticle image
    for script in soup.find_all("script", {"type": "application/ld+json"}):
        try:
            data = json.loads(script.string or "{}")
            imgs = []
            if isinstance(data, dict):
                if "image" in data:
                    imgs = data["image"] if isinstance(data["image"], list) else [data["image"]]
            if isinstance(data, list):
                for obj in data:
                    if isinstance(obj, dict) and "image" in obj:
                        imgv = obj["image"]
                        imgs.extend(imgv if isinstance(imgv, list) else [imgv])
            for i in imgs:
                if isinstance(i, dict) and "url" in i:
                    return urljoin(page_url, i["url"])
                if isinstance(i, str):
                    return urljoin(page_url, i)
        except Exception:
            continue

    # 3) Fallback: largest <img> by width/height attributes
    best_src = None
    best_area = 0
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src:
            continue
        w = int(img.get("width") or 0)
        h = int(img.get("height") or 0)
        area = w * h
        if area > best_area:
            best_area = area
            best_src = src
    if best_src:
        return urljoin(page_url, best_src)

    return None


def download(url: str, out_path: str) -> bool:
    try:
        r = S.get(url, timeout=20, allow_redirects=True)
        if r.status_code >= 200 and r.status_code < 300 and r.content:
            with open(out_path, "wb") as f:
                f.write(r.content)
            return True
        return False
    except Exception:
        return False


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    # Pick entries with sources as JSON array that contain url
    cur.execute(
        """
        SELECT e.entry_number, e.title, (s->>'url') AS url, (s->>'publisher') AS publisher
        FROM trump_entries e, jsonb_array_elements(e.sources) AS s
        WHERE jsonb_typeof(e.sources) = 'array' AND (s ? 'url')
        ORDER BY e.entry_number
        LIMIT %s
        """,
        (MAX_ENTRIES * 3,),  # fetch extras to handle failures
    )
    rows = cur.fetchall()

    used_entries = set()
    picked = []
    for entry_number, title, url, publisher in rows:
        if entry_number in used_entries:
            continue
        if not url:
            continue
        picked.append((entry_number, title, url, publisher))
        used_entries.add(entry_number)
        if len(picked) >= MAX_ENTRIES:
            break

    # If not enough, fall back to entry_links values (strings that look like domains/paths)
    if len(picked) < MAX_ENTRIES:
        cur.execute("SELECT entry_number, title, entry_links::text FROM trump_entries WHERE entry_links IS NOT NULL ORDER BY entry_number LIMIT 500")
        link_rows = cur.fetchall()
        def extract_urls(text: str):
            urls = []
            try:
                data = json.loads(text)
            except Exception:
                return urls
            def walk(val):
                if isinstance(val, str):
                    if "." in val and len(val) >= 6:  # very rough filter
                        # prepend scheme if missing
                        u = val if val.startswith("http") else f"https://{val}"
                        urls.append(u)
                elif isinstance(val, list):
                    for it in val:
                        walk(it)
                elif isinstance(val, dict):
                    for it in val.values():
                        walk(it)
            walk(data)
            return urls
        for entry_number, title, links_text in link_rows:
            if len(picked) >= MAX_ENTRIES:
                break
            if entry_number in used_entries:
                continue
            for u in extract_urls(links_text):
                picked.append((entry_number, title, u, None))
                used_entries.add(entry_number)
                break

    conn.close()

    mapping = []
    success = 0
    for i, (entry_number, title, url, publisher) in enumerate(picked, 1):
        try:
            print(f"[{i}/{len(picked)}] E{entry_number} - fetching page: {url}")
            resp = S.get(url, timeout=20)
            if resp.status_code >= 400:
                print(f"  - Skipped (HTTP {resp.status_code})")
                continue
            img_url = pick_best_image_url(url, resp.text)
            if not img_url:
                print("  - No image found")
                continue
            # derive filename
            ext = os.path.splitext(urlparse(img_url).path)[1].lower()
            if ext not in (".jpg", ".jpeg", ".png", ".webp"):
                ext = ".jpg"
            domain = urlparse(url).netloc.replace('www.', '')
            fname = f"entry-{entry_number}-{domain}{ext}"
            out_path = os.path.join(OUT_DIR, fname)
            if download(img_url, out_path):
                success += 1
                mapping.append({
                    "entry_number": entry_number,
                    "title": title,
                    "page_url": url,
                    "image_url": img_url,
                    "file": fname,
                    "publisher": publisher,
                })
                print(f"  - Saved {fname}")
            else:
                print("  - Download failed")
            time.sleep(0.8)
        except Exception as e:
            print(f"  - Error: {e}")

    map_path = os.path.join(OUT_DIR, "MAPPING.json")
    with open(map_path, "w") as f:
        json.dump({"total_saved": success, "items": mapping}, f, indent=2)
    print(f"Saved {success} images. Mapping -> {map_path}")

if __name__ == "__main__":
    main()
