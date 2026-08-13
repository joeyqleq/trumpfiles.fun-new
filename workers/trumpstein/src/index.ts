import type { Ai, Vectorize, D1Database } from "@cloudflare/workers-types";
import { TRUMPSTEIN_SYSTEM_PROMPT } from "./persona";
import { ragQuery, buildAugmentedPrompt } from "./rag";
import { handleIngest, type IngestEnv } from "./ingest";

export interface Env extends IngestEnv {
  AI: Ai;
  VECTORIZE: Vectorize;
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
  INGEST_SECRET?: string;
  EXA_API_KEY?: string;  // optional web search
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
  history?: ChatMessage[];
}

// ── DB init ───────────────────────────────────────────────────────────────────

async function initDb(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      last_active INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message_id INTEGER,
      rating INTEGER NOT NULL CHECK(rating IN (1, -1)),
      assistant_content TEXT,
      user_content TEXT,
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session_id, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating, created_at)`),
  ]);
}

// ── CORS ──────────────────────────────────────────────────────────────────────

function corsHeaders(request: Request, allowedOrigins: string): HeadersInit {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = allowedOrigins.split(",").map((o) => o.trim());
  const isAllowed =
    allowed.includes("*") ||
    allowed.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".trumpfiles.fun") ||
    origin.endsWith(".trumpstein.me") ||
    origin === "https://trumpfiles.fun" ||
    origin === "https://www.trumpfiles.fun" ||
    origin === "https://trumpstein.me" ||
    origin === "https://www.trumpstein.me";

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0] ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// ── Session helpers ───────────────────────────────────────────────────────────

async function ensureSession(db: D1Database, sessionId: string): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      `INSERT INTO sessions (id, created_at, last_active)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET last_active = excluded.last_active`
    )
    .bind(sessionId, now, now)
    .run();
}

async function getRecentHistory(
  db: D1Database,
  sessionId: string,
  limit = 20
): Promise<ChatMessage[]> {
  const rows = await db
    .prepare(
      `SELECT role, content FROM messages
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .bind(sessionId, limit)
    .all<{ role: string; content: string }>();

  return (rows.results ?? [])
    .reverse()
    .map((r) => ({ role: r.role as "user" | "assistant", content: r.content }));
}

async function saveMessage(
  db: D1Database,
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  await db
    .prepare(`INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)`)
    .bind(sessionId, role, content, Date.now())
    .run();
}

// ── Long-term memory ─────────────────────────────────────────────────────────

async function getMemories(db: D1Database, sessionId: string): Promise<string> {
  const rows = await db
    .prepare(`SELECT summary FROM memories WHERE session_id = ? ORDER BY created_at DESC LIMIT 5`)
    .bind(sessionId)
    .all<{ summary: string }>();
  return (rows.results ?? []).map(r => r.summary).join("\n");
}

async function saveMemory(db: D1Database, sessionId: string, summary: string): Promise<void> {
  await db
    .prepare(`INSERT INTO memories (session_id, summary, created_at) VALUES (?, ?, ?)`)
    .bind(sessionId, summary, Date.now())
    .run();
}

// Summarize conversation into memory every 10 messages
async function maybeCreateMemory(
  db: D1Database,
  sessionId: string,
  ai: Ai
): Promise<void> {
  const countRow = await db
    .prepare(`SELECT COUNT(*) as c FROM messages WHERE session_id = ?`)
    .bind(sessionId)
    .first<{ c: number }>();

  const count = countRow?.c ?? 0;
  if (count < 10 || count % 10 !== 0) return;

  const recent = await db
    .prepare(`SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 20`)
    .bind(sessionId)
    .all<{ role: string; content: string }>();

  const conversation = (recent.results ?? [])
    .reverse()
    .map(r => `${r.role}: ${r.content.slice(0, 200)}`)
    .join("\n");

  const summaryResult = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast" as Parameters<typeof ai.run>[0], {
    messages: [
      { role: "system", content: "Extract 2-3 key facts about the user's interests and questions from this conversation. Be brief and factual. Format: bullet points only." },
      { role: "user", content: conversation },
    ],
    max_tokens: 150,
    stream: false,
  }) as { response?: string };

  if (summaryResult?.response) {
    await saveMemory(db, sessionId, summaryResult.response);
  }
}

// ── Web search via Exa ────────────────────────────────────────────────────────

function needsWebSearch(query: string): boolean {
  const webTriggers = [
    /\b(today|tonight|this week|this month|this year|yesterday|2025|2026)\b/i,
    /\b(latest|recent|current|now|breaking|news|just|happened|announced|said)\b/i,
    /\b(stock|market|price|poll|approval|shooting|attack|killed|arrested|elected|indicted)\b/i,
    /\b(who won|what happened|what did|when did|where did|is it true that)\b/i,
  ];
  return webTriggers.some(r => r.test(query));
}

async function webSearch(query: string, apiKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query: `Trump ${query}`,
        numResults: 3,
        contents: { text: { maxCharacters: 400 } },
        useAutoprompt: true,
      }),
    });
    if (!res.ok) return "";
    const data = await res.json() as { results?: Array<{ title?: string; text?: string; url?: string }> };
    return (data.results ?? [])
      .map(r => `[WEB] ${r.title ?? ""}: ${r.text ?? ""}`.trim())
      .join("\n\n");
  } catch {
    return "";
  }
}

// ── Main chat handler ─────────────────────────────────────────────────────────

async function handleChat(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as ChatRequest;
  const { message, sessionId, history: clientHistory } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "message is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sid = sessionId ?? crypto.randomUUID();
  const trimmedMessage = message.trim().slice(0, 2000);

  await initDb(env.DB);
  await ensureSession(env.DB, sid);

  // Load history (up to 20 exchanges for context)
  let history: ChatMessage[] = await getRecentHistory(env.DB, sid, 20);
  if (history.length === 0 && clientHistory) {
    history = clientHistory.slice(-20);
  }

  // Load long-term memories
  const memories = await getMemories(env.DB, sid);

  // Run RAG and optional web search in parallel
  const [ragResult, webResult] = await Promise.all([
    ragQuery(trimmedMessage, env.AI, env.VECTORIZE, 10),
    env.EXA_API_KEY && needsWebSearch(trimmedMessage)
      ? webSearch(trimmedMessage, env.EXA_API_KEY)
      : Promise.resolve(""),
  ]);

  const { context, entryNumbers } = ragResult;

  // Build system prompt with corpus context + web context + memories
  let systemPrompt = buildAugmentedPrompt(TRUMPSTEIN_SYSTEM_PROMPT, context);

  if (webResult) {
    systemPrompt += `\n\nLIVE WEB CONTEXT (current events — use this for up-to-date info):\n${webResult}`;
  }

  if (memories) {
    systemPrompt += `\n\nWHAT I REMEMBER ABOUT THIS USER:\n${memories}`;
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: trimmedMessage },
  ];

  await saveMessage(env.DB, sid, "user", trimmedMessage);

  // QwQ-32B reasoning model — outperforms 70B on complex multi-turn reasoning
  const aiResponse = await env.AI.run(
    "@cf/qwen/qwq-32b" as Parameters<typeof env.AI.run>[0],
    {
      messages,
      stream: true,
      max_tokens: 1200,
      temperature: 0.8,
    }
  );

  const stream = aiResponse as unknown as ReadableStream;
  const [streamForClient, streamForSave] = stream.tee();

  // Save reply + maybe create memory (fire-and-forget)
  (async () => {
    const reader = streamForSave.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          try {
            const json = JSON.parse(line.slice(6));
            fullText += json.response ?? json.choices?.[0]?.delta?.content ?? "";
          } catch { /* ignore */ }
        }
      }
    }
    if (fullText) {
      await saveMessage(env.DB, sid, "assistant", fullText);
      await maybeCreateMemory(env.DB, sid, env.AI).catch(() => {});
    }
  })();

  return new Response(streamForClient, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Session-Id": sid,
      "X-Entry-Numbers": entryNumbers.join(","),
      "X-Web-Search": webResult ? "1" : "0",
    },
  });
}

async function handleFeedback(request: Request, env: Env): Promise<Response> {
  const { sessionId, rating, assistantContent, userContent } = await request.json() as {
    sessionId: string;
    rating: 1 | -1;
    assistantContent?: string;
    userContent?: string;
  };

  if (!sessionId || (rating !== 1 && rating !== -1)) {
    return new Response(JSON.stringify({ error: "sessionId and rating (1 or -1) required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  await initDb(env.DB);
  await env.DB.prepare(`INSERT INTO feedback (session_id, rating, assistant_content, user_content, created_at) VALUES (?, ?, ?, ?, ?)`)
    .bind(sessionId, rating, assistantContent ?? null, userContent ?? null, Date.now())
    .run();

  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

async function handleHistory(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  await initDb(env.DB);
  const history = await getRecentHistory(env.DB, sessionId, 50);
  return new Response(JSON.stringify({ sessionId, history }), { headers: { "Content-Type": "application/json" } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const allowedOrigins = env.ALLOWED_ORIGINS ?? "*";
    const cors = corsHeaders(request, allowedOrigins);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    let response: Response;
    try {
      if (url.pathname === "/chat" && request.method === "POST") {
        response = await handleChat(request, env);
      } else if (url.pathname === "/feedback" && request.method === "POST") {
        response = await handleFeedback(request, env);
      } else if (url.pathname === "/history" && request.method === "GET") {
        response = await handleHistory(request, env);
      } else if (url.pathname === "/ingest" && request.method === "POST") {
        response = await handleIngest(request, env);
      } else if (url.pathname === "/health") {
        response = new Response(JSON.stringify({ status: "ok", name: "trumpstein", model: "llama-3.1-70b-instruct" }), { headers: { "Content-Type": "application/json" } });
      } else {
        response = new Response("Not Found", { status: 404 });
      }
    } catch (err) {
      console.error("Trumpstein worker error:", err);
      response = new Response(
        JSON.stringify({ error: "Internal server error", detail: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const newHeaders = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) newHeaders.set(k, v);
    return new Response(response.body, { status: response.status, headers: newHeaders });
  },
};
