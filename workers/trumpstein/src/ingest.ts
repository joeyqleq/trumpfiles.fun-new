/**
 * Ingest script: pulls entries from Neon DB and upserts them into Vectorize.
 * Run via: wrangler run src/ingest.ts (or as a scheduled Cron trigger)
 *
 * Usage:
 *   wrangler secret put NEON_DATABASE_URL
 *   npx wrangler d1 create trumpstein-chat
 *   npx wrangler vectorize create trumpstein-rag --dimensions=384 --metric=cosine
 *   npx wrangler deploy
 *   Then POST /ingest with Authorization: Bearer <INGEST_SECRET>
 */

import type { Ai, Vectorize, D1Database } from "@cloudflare/workers-types";

export interface IngestEnv {
  AI: Ai;
  VECTORIZE: Vectorize;
  DB: D1Database;
  NEON_DATABASE_URL?: string;
  INGEST_SECRET?: string;
}

export interface TrumpEntry {
  entry_number: number;
  title: string;
  synopsis: string;
  category: string;
  phase?: string;
  danger?: number;
  authoritarianism?: number;
  lawlessness?: number;
  insanity?: number;
  absurdity?: number;
  date_start?: string;
  sources?: Array<{ url?: string; title?: string; publisher?: string; source_type?: string }>;
  source_urls?: string[];
  medium_summary?: string;
  long_summary?: string;
  summaries?: { short?: string; medium?: string; long?: string };
  evidence_claims?: Array<{ claim?: string; source_url?: string }>;
  evidence_scope?: string;
  fictional_canon?: boolean;
  quality_status?: string;
}

export function buildVectorMetadata(entry: TrumpEntry) {
  const sourceUrls = sourceUrlsFromEntry(entry);
  const summaries = summaryLayersFromEntry(entry);
  const supportedClaims = supportedEvidenceClaims(entry, sourceUrls);
  return {
    entry_number: entry.entry_number,
    title: entry.title,
    synopsis: (entry.synopsis ?? "").slice(0, 500),
    category: entry.category,
    phase: entry.phase ?? "",
    danger: entry.danger ?? 0,
    authoritarianism: entry.authoritarianism ?? 0,
    lawlessness: entry.lawlessness ?? 0,
    insanity: entry.insanity ?? 0,
    absurdity: entry.absurdity ?? 0,
    date_start: entry.date_start ?? "",
    source_url: sourceUrls[0] ?? "",
    source_urls: sourceUrls,
    source_count: sourceUrls.length,
    source_verification_state: sourceUrls.length ? "source_urls_present" : "no_source_url_in_payload",
    summary_level: summaries.long ? "long" : summaries.medium ? "medium" : "short",
    evidence_claim_count: supportedClaims.length,
    quality_status: entry.quality_status ?? "legacy_unversioned",
    evidence_scope: "factual_archive",
    content_kind: "documented_or_alleged_record",
    fictional_canon: false,
    claim_boundary: "archive_context_not_legal_finding",
    provenance_contract_version: "2026-08-21.1",
  };
}

export function prepareVectorDocument(entry: TrumpEntry): {
  id: string;
  text: string;
  metadata: ReturnType<typeof buildVectorMetadata>;
} | null {
  if (!Number.isInteger(entry.entry_number) || entry.entry_number <= 0 || !cleanText(entry.title)) return null;
  if (entry.fictional_canon === true || (entry.evidence_scope && entry.evidence_scope !== "factual_archive")) return null;
  if (entry.quality_status === "rejected") return null;

  const sourceUrls = sourceUrlsFromEntry(entry);
  const summaries = summaryLayersFromEntry(entry);
  const supportedClaims = supportedEvidenceClaims(entry, sourceUrls);
  const richestSummary = summaries.long ?? summaries.medium ?? summaries.short;
  const text = [
    entry.title,
    richestSummary,
    ...supportedClaims.map(claim => `Source-backed claim: ${claim.claim}`),
    "Evidence boundary: archive context may include allegations or editorial classification; it is not itself a legal finding.",
  ].filter(Boolean).join("\n").slice(0, 1800);

  return {
    id: `entry-${entry.entry_number}`,
    text,
    metadata: buildVectorMetadata(entry),
  };
}

function sourceUrlsFromEntry(entry: TrumpEntry): string[] {
  const raw = [
    ...(Array.isArray(entry.source_urls) ? entry.source_urls : []),
    ...(Array.isArray(entry.sources) ? entry.sources.map(source => source?.url) : []),
  ];
  return [...new Set(raw.filter((url): url is string => isValidHttpUrl(url)))].slice(0, 6);
}

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function summaryLayersFromEntry(entry: TrumpEntry): { short: string; medium: string; long: string } {
  return {
    short: cleanText(entry.summaries?.short) || cleanText(entry.synopsis),
    medium: cleanText(entry.summaries?.medium) || cleanText(entry.medium_summary),
    long: cleanText(entry.summaries?.long) || cleanText(entry.long_summary),
  };
}

function supportedEvidenceClaims(entry: TrumpEntry, sourceUrls: string[]): Array<{ claim: string; source_url: string }> {
  const allowedUrls = new Set(sourceUrls);
  if (!Array.isArray(entry.evidence_claims)) return [];
  return entry.evidence_claims.flatMap((candidate) => {
    const claim = cleanText(candidate?.claim);
    const sourceUrl = cleanText(candidate?.source_url);
    return claim && sourceUrl && allowedUrls.has(sourceUrl) ? [{ claim, source_url: sourceUrl }] : [];
  }).slice(0, 4);
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export async function handleIngest(
  request: Request,
  env: IngestEnv
): Promise<Response> {
  // Basic auth check
  const authHeader = request.headers.get("Authorization");
  if (!env.INGEST_SECRET || authHeader !== `Bearer ${env.INGEST_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    offset?: number;
    limit?: number;
  };

  const offset = body.offset ?? 0;
  const limit = body.limit ?? 100;

  const apiBase = (env as unknown as Record<string, string>).NEON_API_URL ?? "https://trumpstein.me/api";
  const fetchUrl = `${apiBase}/entries?offset=${offset}&limit=${limit}`;

  let entries: TrumpEntry[];
  try {
    const res = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${env.INGEST_SECRET ?? ""}` },
    });
    if (!res.ok) throw new Error(`Neon API returned ${res.status}`);
    const data = (await res.json()) as { entries: TrumpEntry[] };
    entries = data.entries;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Neon", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!entries || entries.length === 0) {
    return new Response(
      JSON.stringify({ message: "No entries to ingest", offset, limit }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Embed and upsert in batches of 25 (Vectorize upsert limit)
  const BATCH_SIZE = 25;
  let upserted = 0;
  let skipped = 0;
  let deleteRequested = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const { documents, deleteIds } = planVectorBatch(batch);
    skipped += batch.length - documents.length;
    if (deleteIds.length) {
      await env.VECTORIZE.deleteByIds(deleteIds);
      deleteRequested += deleteIds.length;
    }
    if (documents.length === 0) continue;

    const texts = documents.map(document => document.text);

    const embedResult = await env.AI.run("@cf/baai/bge-small-en-v1.5", {
      text: texts,
    });

    const vectors = (embedResult as { data: number[][] }).data;

    const vectorObjects = documents.map((document, idx) => ({
      id: document.id,
      values: vectors[idx],
      metadata: document.metadata,
    }));

    await env.VECTORIZE.upsert(vectorObjects);
    upserted += documents.length;
  }

  return new Response(
    JSON.stringify({
      message: "Ingest complete",
      upserted,
      skipped,
      delete_requested: deleteRequested,
      offset,
      limit,
      provenance_contract_version: "2026-08-21.1",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export function planVectorBatch(entries: TrumpEntry[]): {
  documents: NonNullable<ReturnType<typeof prepareVectorDocument>>[];
  deleteIds: string[];
} {
  const documents: NonNullable<ReturnType<typeof prepareVectorDocument>>[] = [];
  const deleteIds: string[] = [];
  for (const entry of entries) {
    const document = prepareVectorDocument(entry);
    if (document) documents.push(document);
    else if (Number.isInteger(entry.entry_number) && entry.entry_number > 0) deleteIds.push(`entry-${entry.entry_number}`);
  }
  return { documents, deleteIds };
}
