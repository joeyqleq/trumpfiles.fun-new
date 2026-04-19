#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Client } from "pg";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const [key, ...valueParts] = line.split("=");
    if (!key || valueParts.length === 0) continue;
    const value = valueParts.join("=").replace(/^["']|["']$/g, "").trim();
    process.env[key.trim()] = value;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const batchPath = args.file;

if (!batchPath) {
  console.error("Usage: node scripts/apply-sql-batch.mjs --file /absolute/or/relative/batch.json");
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), batchPath);
const statements = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));

if (!Array.isArray(statements) || statements.length === 0) {
  console.error("Batch file must contain a non-empty JSON array of SQL statements.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query("BEGIN");

  for (let i = 0; i < statements.length; i += 1) {
    const statement = statements[i];
    if (typeof statement !== "string" || statement.trim().length === 0) {
      throw new Error(`Statement ${i + 1} is empty or not a string.`);
    }
    await client.query(statement);
    console.log(`applied_statement=${i + 1}`);
  }

  await client.query("COMMIT");
  console.log(`batch_file=${resolvedPath}`);
  console.log(`statements_applied=${statements.length}`);
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // Ignore rollback failure and surface original error below.
  }
  console.error("batch_apply_failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
