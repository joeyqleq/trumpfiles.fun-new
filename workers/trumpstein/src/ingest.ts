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

interface TrumpEntry {
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
}

export async function handleIngest(
  request: Request,
  env: IngestEnv
): Promise<Response> {
  // Basic auth check
  const authHeader = request.headers.get("Authorization");
  if (
    env.INGEST_SECRET &&
    authHeader !== `Bearer ${env.INGEST_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    offset?: number;
    limit?: number;
  };

  const offset = body.offset ?? 0;
  const limit = body.limit ?? 100;

  const apiBase = (env as unknown as Record<string, string>).NEON_API_URL ?? "https://trumpfiles.fun/api";
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

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    // Build text to embed: title + synopsis for semantic richness
    const texts = batch.map(
      (e) => `${e.title}. ${e.synopsis ?? ""}`.slice(0, 512)
    );

    const embedResult = await env.AI.run("@cf/baai/bge-small-en-v1.5", {
      text: texts,
    });

    const vectors = (embedResult as { data: number[][] }).data;

    const vectorObjects = batch.map((entry, idx) => ({
      id: `entry-${entry.entry_number}`,
      values: vectors[idx],
      metadata: {
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
      },
    }));

    await env.VECTORIZE.upsert(vectorObjects);
    upserted += batch.length;
  }

  return new Response(
    JSON.stringify({
      message: "Ingest complete",
      upserted,
      offset,
      limit,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
