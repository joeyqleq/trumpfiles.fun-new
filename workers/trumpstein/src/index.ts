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
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at)`),
  ]);
}

function corsHeaders(request: Request, allowedOrigins: string): HeadersInit {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = allowedOrigins.split(",").map((o) => o.trim());
  const isAllowed = allowed.includes(origin) || allowed.includes("*");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0] ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

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
  limit = 10
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
    .prepare(
      `INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)`
    )
    .bind(sessionId, role, content, Date.now())
    .run();
}

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

  // Load history from D1 (prefer server-side, fall back to client-sent)
  let history: ChatMessage[] = await getRecentHistory(env.DB, sid, 10);
  if (history.length === 0 && clientHistory) {
    history = clientHistory.slice(-10);
  }

  // RAG: embed query and find relevant scandal entries
  const { context, entryNumbers } = await ragQuery(
    trimmedMessage,
    env.AI,
    env.VECTORIZE,
    5
  );

  const augmentedSystem = buildAugmentedPrompt(TRUMPSTEIN_SYSTEM_PROMPT, context);

  // Build message array for LLM
  const messages: ChatMessage[] = [
    { role: "system", content: augmentedSystem },
    ...history,
    { role: "user", content: trimmedMessage },
  ];

  // Save user message
  await saveMessage(env.DB, sid, "user", trimmedMessage);

  // Call Workers AI — stream response
  const aiResponse = await env.AI.run(
    "@cf/meta/llama-3.3-70b-instruct-fp8-fast" as Parameters<typeof env.AI.run>[0],
    {
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.85,
    }
  );

  // Workers AI streaming returns a ReadableStream when stream: true
  const stream = aiResponse as unknown as ReadableStream;

  // Collect full response to save to D1 (tee the stream)
  const [streamForClient, streamForSave] = stream.tee();

  // Fire-and-forget: save assistant reply after streaming
  (async () => {
    const reader = streamForSave.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // SSE format: "data: {...}\n\n" — extract content
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          try {
            const json = JSON.parse(line.slice(6));
            // Support both Workers AI formats: {response: "..."} and OpenAI-style {choices: [{delta: {content: "..."}}]}
            fullText += json.response ?? json.choices?.[0]?.delta?.content ?? "";
          } catch {
            // ignore parse errors on malformed chunks
          }
        }
      }
    }

    if (fullText) {
      await saveMessage(env.DB, sid, "assistant", fullText);
    }
  })();

  return new Response(streamForClient, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Session-Id": sid,
      "X-Entry-Numbers": entryNumbers.join(","),
    },
  });
}

async function handleHistory(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "sessionId required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await initDb(env.DB);
  const history = await getRecentHistory(env.DB, sessionId, 50);

  return new Response(JSON.stringify({ sessionId, history }), {
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const allowedOrigins = env.ALLOWED_ORIGINS ?? "*";
    const cors = corsHeaders(request, allowedOrigins);

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    let response: Response;

    try {
      if (url.pathname === "/chat" && request.method === "POST") {
        response = await handleChat(request, env);
      } else if (url.pathname === "/history" && request.method === "GET") {
        response = await handleHistory(request, env);
      } else if (url.pathname === "/ingest" && request.method === "POST") {
        response = await handleIngest(request, env);
      } else if (url.pathname === "/health") {
        response = new Response(
          JSON.stringify({ status: "ok", name: "trumpstein" }),
          { headers: { "Content-Type": "application/json" } }
        );
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

    // Attach CORS headers to every response
    const newHeaders = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) {
      newHeaders.set(k, v);
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
