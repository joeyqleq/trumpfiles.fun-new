#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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
