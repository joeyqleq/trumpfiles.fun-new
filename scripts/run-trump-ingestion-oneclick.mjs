#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

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

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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
const toDate = process.env.TO_DATE || "";
const outDir = process.env.INGEST_OUT_DIR || "tmp/oneclick";
const pythonCmd = process.env.PYTHON_CMD || (process.platform === "win32" ? "py" : "python3");

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

if (!Number.isFinite(batchSize) || batchSize <= 0) {
  fail(`Invalid BATCH_SIZE='${process.env.BATCH_SIZE}'. Use a positive number.`);
}

fs.mkdirSync(outDir, { recursive: true });

function run(cmd, args, extraEnv = {}) {
  console.log(`[oneclick] $ ${cmd} ${args.join(" ")}`);

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
    shell: false,
  });

  if (result.error) {
    fail(`Command failed to start: ${cmd} ${args.join(" ")}\n${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

async function getNextEntryNumber() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query(
    "select coalesce(max(entry_number), 0)::int as max_entry from trump_entries"
  );

  const maxEntry = Number(rows?.[0]?.max_entry || 0);
  const nextEntry = maxEntry + 1;

  console.log(`[oneclick] Current max entry_number: ${maxEntry}`);
  console.log(`[oneclick] Next start entry_number: ${nextEntry}`);

  return nextEntry;
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
  console.log("[oneclick] This mode intentionally does not insert rows automatically.");
  process.exit(0);
}

const collectOut = path.join(outDir, "recency_candidates.json");
const generatorOut = path.join(outDir, "recency_batch.sql.json");

const startEntry = await getNextEntryNumber();

const collectArgs = [
  "scripts/_tmp_collect_trump_candidates.py",
  "--out",
  collectOut,
  "--max-candidates",
  String(batchSize),
];

if (fromDate) {
  collectArgs.push("--from-date", fromDate);
}

if (toDate) {
  collectArgs.push("--to-date", toDate);
}

run(pythonCmd, collectArgs);

run(pythonCmd, [
  "scripts/_tmp_generate_batch_from_candidates.py",
  "--input",
  collectOut,
  "--output",
  generatorOut,
  "--start-entry",
  String(startEntry),
  "--count",
  String(batchSize),
]);

run("node", ["scripts/apply-sql-batch.mjs", "--file", generatorOut]);

console.log("[oneclick] Recency update completed successfully.");