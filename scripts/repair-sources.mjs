#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || (args["dry-run"] ? "dry-run" : "apply");
const reportPath = args.report || `logs/repair_${timestamp()}.json`;
const unresolvedOut = args.unresolved_out || null;
const timeoutMs = Number(args.timeout_ms || 6000);
const dbTimeoutMs = Number(args.db_timeout_ms || 120000);
const concurrency = Math.max(1, Number(args.concurrency || 10));
const minRelevance = Number(args.min_relevance || 0.14);
const searchMinRelevance = Number(args.search_min_relevance || 0.1);
const entryList = parseEntryList(args.entries || "");
const maxUrlsPerEntry = Math.max(1, Number(args.max_urls_per_entry || 3));
const searchPerEntry = Math.max(0, Number(args.search_per_entry || 2));
const coverageMode = Boolean(args.coverage_mode);
const runId = `repair_${timestamp()}`;

loadEnv();
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { cache: "no-store" } });

const REPUTABLE_HOSTS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "theguardian.com",
  "nytimes.com",
  "washingtonpost.com",
  "npr.org",
  "justice.gov",
  "congress.gov",
  "supremecourt.gov",
  "whitehouse.gov",
  "wsj.com",
  "politico.com",
  "cnn.com",
  "abcnews.go.com",
  "cbsnews.com",
  "nbcnews.com",
  "time.com",
];

const SOFT_CODES = new Set([401, 403, 405, 429]);
const DEAD_CODES = new Set([404, 410]);

const state = {
  total_checked: 0,
  live_relevant: 0,
  dead_or_bad: 0,
  soft_blocked: 0,
  live_but_low_relevance: 0,
  entries_unresolved: 0,
  unresolved_entry_numbers: [],
  entries_applied: 0,
  changed_entry_numbers: [],
  by_entry: [],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const rows = await loadEntries();
  console.log(
    `run_id=${runId}\nmode=${mode} entries_loaded=${rows.length} concurrency=${concurrency} min_relevance=${minRelevance}`
  );
  state.total_checked = rows.length;

  let idx = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < rows.length) {
      const current = rows[idx++];
      await processEntry(current);
      await sleep(20);
    }
  });
  await Promise.all(workers);

  state.entries_unresolved = state.unresolved_entry_numbers.length;
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(state, null, 2));
  if (unresolvedOut) {
    fs.writeFileSync(unresolvedOut, state.unresolved_entry_numbers.join("\n"));
  }
  console.log(`report_file=${reportPath}`);
  console.log(`entries_unresolved=${state.entries_unresolved}`);
  console.log(`entries_applied=${state.entries_applied}`);
}

async function loadEntries() {
  if (entryList.length > 0) {
    return sql`
      select te.entry_number, te.title, te.synopsis, te.fact_check_sources, te.suggested_source_query,
             coalesce(json_agg(json_build_object('source_id', ts.source_id, 'url', ts.url, 'publisher', ts.publisher, 'title', ts.title))
                filter (where ts.source_id is not null), '[]'::json) as source_rows
      from trump_entries te
      left join trump_sources ts on ts.entry_number = te.entry_number
      where te.entry_number = any(${entryList})
      group by te.entry_number, te.title, te.synopsis, te.fact_check_sources, te.suggested_source_query
      order by te.entry_number`;
  }
  return sql`
    select te.entry_number, te.title, te.synopsis, te.fact_check_sources, te.suggested_source_query,
           coalesce(json_agg(json_build_object('source_id', ts.source_id, 'url', ts.url, 'publisher', ts.publisher, 'title', ts.title))
              filter (where ts.source_id is not null), '[]'::json) as source_rows
    from trump_entries te
    left join trump_sources ts on ts.entry_number = te.entry_number
    group by te.entry_number, te.title, te.synopsis, te.fact_check_sources, te.suggested_source_query
    order by te.entry_number`;
}

async function processEntry(entry) {
  const sourceRows = normalizeSourceRows(entry.source_rows);
  const tokens = textTokens(`${entry.title || ""} ${entry.synopsis || ""}`);
  const existingEval = await evalUrls(
    sourceRows.slice(0, maxUrlsPerEntry).map((r) => ({ url: r.url, source: "existing", sourceId: r.source_id })),
    tokens
  );
  const existingGood = existingEval.find((x) => x.classification === "live_relevant");
  const factEval = await evalUrls(
    (entry.fact_check_sources || []).map((url) => ({ url, source: "fact_check" })),
    tokens
  );
  const factGood = factEval.find((x) => x.classification === "live_relevant");
  const bestCandidate = existingGood || factGood || bestFallback(existingEval, factEval);
  let chosen = bestCandidate;

  if (mode === "apply" && !existingGood && searchPerEntry > 0) {
    const searched = await searchForCandidate(entry, tokens, new Set([...existingEval, ...factEval].map((x) => normalizeUrl(x.url))));
    if (searched) {
      chosen = searched;
    }
  }

  let classification = chosen?.classification || "dead_or_bad";
  if (!chosen) classification = "dead_or_bad";
  tally(classification);

  const unresolvedNow = coverageMode ? classification === "dead_or_bad" : classification !== "live_relevant";
  if (unresolvedNow) {
    state.unresolved_entry_numbers.push(entry.entry_number);
  }

  if (mode === "apply" && !existingGood && chosen && chosen.url) {
    const exists = sourceRows.some((r) => normalizeUrl(r.url) === normalizeUrl(chosen.url));
    if (!exists && (chosen.classification === "live_relevant" || chosen.classification === "live_but_low_relevance")) {
      await sql`insert into trump_sources (entry_number, url, title, publisher, source_type)
                values (${entry.entry_number}, ${chosen.url}, ${chosen.title || null}, ${hostToPublisher(chosen.host)}, 'news')`;
      await sql`insert into trump_sources_repair_audit (run_id, entry_number, action, old_urls, new_urls, confidence, notes)
                values (${runId}, ${entry.entry_number}, 'insert_one', ${JSON.stringify(sourceRows.map((r) => r.url))}::jsonb,
                        ${JSON.stringify([chosen.url])}::jsonb, ${chosen.relevance || 0},
                        ${`Inserted candidate from ${chosen.source}`})`;
      state.entries_applied += 1;
      state.changed_entry_numbers.push(entry.entry_number);
    }
  }

  state.by_entry.push({
    entry_number: entry.entry_number,
    title: entry.title,
    classification,
    best: chosen
      ? {
          url: chosen.url,
          status: chosen.status,
          relevance: round(chosen.relevance || 0),
          source: chosen.source,
        }
      : null,
  });
}

async function searchForCandidate(entry, tokens, existingUrls) {
  const queries = [];
  if (entry.title) queries.push(`${entry.title} trump`);
  if (entry.suggested_source_query) queries.push(entry.suggested_source_query);
  const distinctQueries = Array.from(new Set(queries.filter(Boolean))).slice(0, searchPerEntry);
  for (const q of distinctQueries) {
    const urls = await duckSearch(q);
    for (const url of urls) {
      const n = normalizeUrl(url);
      if (!n || existingUrls.has(n)) continue;
      const host = hostOf(n);
      if (!isReputable(host)) continue;
      const probe = await probeUrl(n, timeoutMs);
      if (!probe.ok && !SOFT_CODES.has(probe.status)) continue;
      return {
        url: n,
        source: "search",
        host,
        status: probe.status,
        relevance: Math.max(relevanceScore(n, tokens), 0.2),
        classification: probe.ok ? "live_relevant" : "live_but_low_relevance",
        title: entry.title || null,
      };
    }
  }
  return null;
}

async function duckSearch(query) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const html = await res.text();
    const out = [];
    const re = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) && out.length < 8) {
      const raw = decodeHtml(m[1]);
      out.push(extractDdgTarget(raw));
    }
    return out.filter(Boolean);
  } catch {
    return [];
  }
}

function extractDdgTarget(href) {
  if (!href) return null;
  try {
    if (href.includes("duckduckgo.com/l/?")) {
      const u = new URL(href, "https://duckduckgo.com");
      const t = u.searchParams.get("uddg");
      return t ? decodeURIComponent(t) : null;
    }
    return href.startsWith("http") ? href : null;
  } catch {
    return null;
  }
}

function decodeHtml(s) {
  return s.replaceAll("&amp;", "&");
}

function bestFallback(existingEval, factEval) {
  const all = [...existingEval, ...factEval].sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
  return all[0] || null;
}

function scoreCandidate(c) {
  if (!c) return -1;
  let score = 0;
  if (c.classification === "live_relevant") score += 100;
  else if (c.classification === "live_but_low_relevance") score += 50;
  else if (c.classification === "soft_blocked") score += 10;
  score += (c.relevance || 0) * 10;
  if (isReputable(c.host)) score += 5;
  return score;
}

async function evalUrls(list, tokens) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const clean = normalizeUrl(item.url);
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    const probe = await probeUrl(clean, timeoutMs);
    const host = hostOf(clean);
    const relevance = relevanceScore(clean, tokens);
    let classification = "dead_or_bad";
    if (probe.ok && isReputable(host)) classification = "live_relevant";
    else if (SOFT_CODES.has(probe.status) && isReputable(host)) classification = "live_but_low_relevance";
    else if (probe.ok && relevance >= minRelevance) classification = "live_relevant";
    else if (probe.ok && relevance >= searchMinRelevance) classification = "live_but_low_relevance";
    else if (coverageMode && isReputable(host)) classification = "live_but_low_relevance";
    else if (SOFT_CODES.has(probe.status)) classification = "soft_blocked";
    else if (DEAD_CODES.has(probe.status)) classification = "dead_or_bad";
    else if (probe.ok) classification = "live_but_low_relevance";
    out.push({
      ...item,
      url: clean,
      host,
      status: probe.status,
      ok: probe.ok,
      relevance,
      classification,
      title: item.title || null,
    });
  }
  return out.sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
}

async function probeUrl(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    let res;
    try {
      res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    } catch {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

function relevanceScore(url, tokens) {
  const host = hostOf(url);
  const pathPart = url.toLowerCase();
  let overlap = 0;
  for (const t of tokens) {
    if (t.length >= 4 && pathPart.includes(t)) overlap += 1;
  }
  const ratio = tokens.length ? overlap / Math.min(tokens.length, 20) : 0;
  const hostBoost = isReputable(host) ? 0.08 : 0;
  return Math.min(1, ratio + hostBoost);
}

function isReputable(host) {
  return REPUTABLE_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
}

function hostToPublisher(host) {
  const short = host.replace(/^www\./, "");
  return short.split(".").slice(-2).join(".").toUpperCase();
}

function tally(classification) {
  if (classification === "live_relevant") state.live_relevant += 1;
  else if (classification === "live_but_low_relevance") state.live_but_low_relevance += 1;
  else if (classification === "soft_blocked") state.soft_blocked += 1;
  else state.dead_or_bad += 1;
}

function normalizeSourceRows(rows) {
  if (!rows) return [];
  if (Array.isArray(rows)) return rows.filter((r) => r && r.url);
  return [];
}

function parseEntryList(s) {
  return s
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

function textTokens(text) {
  return Array.from(
    new Set(
      (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, " ")
        .split(/\s+/)
        .filter((x) => x.length >= 3)
    )
  );
}

function normalizeUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "").replace(/-/g, "").replace("T", "T").slice(0, 15) + "Z";
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 1) continue;
    const k = trimmed.slice(0, i).trim();
    const v = trimmed.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(k in process.env)) process.env[k] = v;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
