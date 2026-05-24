<<<<<<< ours
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
let outPath = "tmp/oneclick/trumpfile_candidates.json";
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--out") outPath = argv[i + 1];
}

const ROOT_CANDIDATES = ["https://trumpfile.org", "https://www.trumpfile.org"];
let ROOT = ROOT_CANDIDATES[0];

function curlText(url) {
  return execFileSync("curl", ["-L", "--max-time", "30", "-sS", url], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

async function fetchText(url) {
  let lastError = null;
  for (let i = 0; i < 4; i += 1) {
    try {
      const out = curlText(url);
      if (!out || !out.trim()) throw new Error(`Empty response for ${url}`);
      return out;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  throw lastError;
}

async function detectRoot() {
  for (const candidate of ROOT_CANDIDATES) {
    try {
      await fetchText(candidate);
      ROOT = candidate;
      return;
    } catch {}
  }
  throw new Error(`Unable to resolve any root: ${ROOT_CANDIDATES.join(", ")}`);
}

function decodeHtml(s = "") {
  return s
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWpPosts() {
  const posts = [];
  let page = 1;

  while (true) {
    const endpoint = `${ROOT}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1`;
    let body;
    try {
      body = await fetchText(endpoint);
    } catch (error) {
      if (String(error.message || error).includes("returned error: 400")) break;
      throw error;
    }

    let rows = [];
    try {
      rows = JSON.parse(body);
    } catch {
      break;
    }

    if (!Array.isArray(rows) || rows.length === 0) break;

    for (const row of rows) {
      posts.push({
        source_site: "trumpfile.org",
        entry_url: row?.link || "",
        title: decodeHtml(row?.title?.rendered || "Untitled"),
        published_at: row?.date_gmt || row?.date || null,
        excerpt: decodeHtml(row?.excerpt?.rendered || ""),
        slug: row?.slug || "",
        tags: Array.isArray(row?.tags) ? row.tags : [],
        categories: Array.isArray(row?.categories) ? row.categories : [],
        wp_id: row?.id || null,
      });
    }

    page += 1;
    if (rows.length < 100) break;
  }

  return posts.filter((p) => p.entry_url && p.title);
}

async function main() {
  await detectRoot();
  console.log(`[scrape] using root ${ROOT}`);

  const wpPosts = await fetchWpPosts();
  const uniq = new Map();
  for (const p of wpPosts) {
    if (!uniq.has(p.entry_url)) uniq.set(p.entry_url, p);
  }

  const candidates = [...uniq.values()];
  candidates.sort((a, b) => String(a.published_at || "").localeCompare(String(b.published_at || "")));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({ generated_at: new Date().toISOString(), root: ROOT, count: candidates.length, candidates }, null, 2),
  );
  console.log(`[scrape] wrote ${candidates.length} candidates to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
=======
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
let outPath = "tmp/oneclick/trumpfile_candidates.json";
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--out") outPath = argv[i + 1];
}

const ROOT_CANDIDATES = ["https://trumpfile.org", "https://www.trumpfile.org"];
let ROOT = ROOT_CANDIDATES[0];

function curlText(url) {
  return execFileSync("curl", ["-L", "--max-time", "30", "-sS", url], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

async function fetchText(url) {
  let lastError = null;
  for (let i = 0; i < 4; i += 1) {
    try {
      const out = curlText(url);
      if (!out || !out.trim()) throw new Error(`Empty response for ${url}`);
      return out;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  throw lastError;
}

async function detectRoot() {
  for (const candidate of ROOT_CANDIDATES) {
    try {
      await fetchText(candidate);
      ROOT = candidate;
      return;
    } catch {}
  }
  throw new Error(`Unable to resolve any root: ${ROOT_CANDIDATES.join(", ")}`);
}

function decodeHtml(s = "") {
  return s
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWpPosts() {
  const posts = [];
  let page = 1;

  while (true) {
    const endpoint = `${ROOT}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1`;
    let body;
    try {
      body = await fetchText(endpoint);
    } catch (error) {
      if (String(error.message || error).includes("returned error: 400")) break;
      throw error;
    }

    let rows = [];
    try {
      rows = JSON.parse(body);
    } catch {
      break;
    }

    if (!Array.isArray(rows) || rows.length === 0) break;

    for (const row of rows) {
      posts.push({
        source_site: "trumpfile.org",
        entry_url: row?.link || "",
        title: decodeHtml(row?.title?.rendered || "Untitled"),
        published_at: row?.date_gmt || row?.date || null,
        excerpt: decodeHtml(row?.excerpt?.rendered || ""),
        slug: row?.slug || "",
        tags: Array.isArray(row?.tags) ? row.tags : [],
        categories: Array.isArray(row?.categories) ? row.categories : [],
        wp_id: row?.id || null,
      });
    }

    page += 1;
    if (rows.length < 100) break;
  }

  return posts.filter((p) => p.entry_url && p.title);
}

async function main() {
  await detectRoot();
  console.log(`[scrape] using root ${ROOT}`);

  const wpPosts = await fetchWpPosts();
  const uniq = new Map();
  for (const p of wpPosts) {
    if (!uniq.has(p.entry_url)) uniq.set(p.entry_url, p);
  }

  const candidates = [...uniq.values()];
  candidates.sort((a, b) => String(a.published_at || "").localeCompare(String(b.published_at || "")));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({ generated_at: new Date().toISOString(), root: ROOT, count: candidates.length, candidates }, null, 2),
  );
  console.log(`[scrape] wrote ${candidates.length} candidates to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
>>>>>>> theirs
