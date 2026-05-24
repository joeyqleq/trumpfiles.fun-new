<<<<<<< ours
#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Minimal .env parser so this script works without extra deps.
 * Supports lines like:
 *   KEY=value
 *   KEY="value"
 *   KEY='value'
 */
function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Do not overwrite already-set env vars
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// Load env files in precedence order (existing env wins)
loadDotEnvFile(path.resolve(process.cwd(), ".env.local"));
loadDotEnvFile(path.resolve(process.cwd(), ".env"));

const mode = process.env.MODE || "recency_update";
const batchSize = Number(process.env.BATCH_SIZE || 50);
const fromDate = process.env.FROM_DATE || "";
const outDir = process.env.INGEST_OUT_DIR || "tmp/oneclick";

function fail(message) {
  console.error(`[oneclick] ${message}`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  fail("DATABASE_URL is required");
}

if (!["bootstrap_trumpfile_once", "recency_update"].includes(mode)) {
  fail(`Unsupported MODE='${mode}'. Use bootstrap_trumpfile_once or recency_update.`);
}

fs.mkdirSync(outDir, { recursive: true });

function run(cmd, args, extraEnv = {}) {
  console.log(`[oneclick] $ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    fail(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

if (mode === "bootstrap_trumpfile_once") {
  const scrapePath = path.join(outDir, "trumpfile_candidates.json");
  const sqlPath = path.join(outDir, "trumpfile_batch.sql.json");

  run("node", ["scripts/trumpfile_bootstrap_scrape.mjs", "--out", scrapePath]);
  run("node", ["scripts/trumpfile_safe_preview.mjs"], {
    PREVIEW_INPUT: scrapePath,
    PREVIEW_OUTPUT: path.join(outDir, "safe_preview.json"),
  });

  console.log("[oneclick] Bootstrap scrape + safe preview complete.");
  console.log(`[oneclick] Preview saved to ${path.join(outDir, "safe_preview.json")}`);
  console.log(`[oneclick] Next step: transform + score + SQL generation into ${sqlPath}`);
  process.exit(0);
}

const collectOut = path.join(outDir, "recency_candidates.json");
const generatorOut = path.join(outDir, "recency_batch.sql.json");

const collectArgs = [
  "scripts/_tmp_collect_trump_candidates.py",
  "--output",
  collectOut,
  "--batch-size",
  String(batchSize),
];
if (fromDate) {
  collectArgs.push("--from-date", fromDate);
}
run("python3", collectArgs);

run("python3", [
  "scripts/_tmp_generate_batch_from_candidates.py",
  "--input",
  collectOut,
  "--output",
  generatorOut,
]);

run("node", ["scripts/apply-sql-batch.mjs", "--file", generatorOut]);

console.log("[oneclick] Recency update completed successfully.");
=======
#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";


function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const mode = process.env.MODE || "recency_update";
const batchSize = Number(process.env.BATCH_SIZE || 50);
const fromDate = process.env.FROM_DATE || "";
const outDir = process.env.INGEST_OUT_DIR || "tmp/oneclick";

function fail(message) {
  console.error(`[oneclick] ${message}`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  fail("DATABASE_URL is required");
}

if (!["bootstrap_trumpfile_once", "recency_update"].includes(mode)) {
  fail(`Unsupported MODE='${mode}'. Use bootstrap_trumpfile_once or recency_update.`);
}

fs.mkdirSync(outDir, { recursive: true });

function run(cmd, args, extraEnv = {}) {
  console.log(`[oneclick] $ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    fail(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

if (mode === "bootstrap_trumpfile_once") {
  const scrapePath = path.join(outDir, "trumpfile_candidates.json");
  const sqlPath = path.join(outDir, "trumpfile_batch.sql.json");

  run("node", ["scripts/trumpfile_bootstrap_scrape.mjs", "--out", scrapePath]);
  run("node", ["scripts/trumpfile_safe_preview.mjs"], {
    PREVIEW_INPUT: scrapePath,
    PREVIEW_OUTPUT: path.join(outDir, "safe_preview.json"),
  });

  console.log("[oneclick] Bootstrap scrape + safe preview complete.");
  console.log(`[oneclick] Preview saved to ${path.join(outDir, "safe_preview.json")}`);
  console.log(`[oneclick] Next step: transform + score + SQL generation into ${sqlPath}`);
  process.exit(0);
}

const collectOut = path.join(outDir, "recency_candidates.json");
const generatorOut = path.join(outDir, "recency_batch.sql.json");

const collectArgs = [
  "scripts/_tmp_collect_trump_candidates.py",
  "--output",
  collectOut,
  "--batch-size",
  String(batchSize),
];
if (fromDate) {
  collectArgs.push("--from-date", fromDate);
}
run("python3", collectArgs);

run("python3", [
  "scripts/_tmp_generate_batch_from_candidates.py",
  "--input",
  collectOut,
  "--output",
  generatorOut,
]);

run("node", ["scripts/apply-sql-batch.mjs", "--file", generatorOut]);

console.log("[oneclick] Recency update completed successfully.");
>>>>>>> theirs
