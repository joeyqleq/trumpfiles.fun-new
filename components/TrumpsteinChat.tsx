"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const WORKER_URL =
  process.env.NEXT_PUBLIC_TRUMPSTEIN_WORKER_URL ??
  "https://trumpstein.trumpfiles.workers.dev";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  entryNumbers?: number[];
  streaming?: boolean;
}

interface TrumpsteinChatProps {
  className?: string;
  initialOpen?: boolean;
}

export default function TrumpsteinChat({
  className,
  initialOpen = false,
}: TrumpsteinChatProps) {
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Auto-send greeting trigger on first open
      sendMessage("Introduce yourself, Trumpstein!");
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          streaming: true,
        },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${WORKER_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId: sessionId ?? undefined,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Worker returned ${res.status}`);
        }

        // Capture session ID from header
        const newSid = res.headers.get("X-Session-Id");
        if (newSid) setSessionId(newSid);

        const entryNumbersHeader = res.headers.get("X-Entry-Numbers");
        const entryNumbers = entryNumbersHeader
          ? entryNumbersHeader
              .split(",")
              .map(Number)
              .filter((n) => !isNaN(n) && n > 0)
          : [];

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              try {
                const json = JSON.parse(line.slice(6));
                if (json.response) {
                  accumulated += json.response;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? {
                            ...m,
                            content: accumulated,
                            entryNumbers,
                            streaming: true,
                          }
                        : m
                    )
                  );
                }
              } catch {
                // skip malformed SSE chunks
              }
            }
          }
        }

        // Mark streaming done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "TREMENDOUS ERROR! The deep state blocked my chip — very unfair. Try again, believe me.",
                  streaming: false,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, sessionId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClose = () => {
    abortRef.current?.abort();
    setOpen(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3", className)}>
      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "flex flex-col w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-120px)]",
            "rounded-2xl border border-orange-500/40 shadow-2xl shadow-orange-900/40",
            "bg-zinc-950 overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">
                TRUMPSTEIN
              </span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                CHIP ACTIVE
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-orange-800/40">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-600 text-sm text-center">
                  Loading Trumpstein...
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-orange-600 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700/50"
                  )}
                >
                  {/* Render chip overrides with special styling */}
                  <MessageContent content={msg.content} />

                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-4 bg-orange-400 animate-pulse ml-0.5 align-middle" />
                  )}

                  {msg.entryNumbers && msg.entryNumbers.length > 0 && !msg.streaming && (
                    <div className="mt-2 pt-2 border-t border-zinc-700/50 flex flex-wrap gap-1">
                      {msg.entryNumbers.map((n) => (
                        <a
                          key={n}
                          href={`/entry/${n}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-400 hover:text-orange-300 underline"
                        >
                          #{n}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-zinc-800 p-3 bg-zinc-900/80">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Trumpstein anything..."
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-zinc-800 text-zinc-100 placeholder-zinc-500",
                  "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500",
                  "border border-zinc-700 max-h-32 overflow-y-auto"
                )}
                style={{ lineHeight: "1.5" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className={cn(
                  "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                  "bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed",
                  "transition-colors text-white font-bold text-lg"
                )}
                aria-label="Send message"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>
            <p className="text-zinc-600 text-xs mt-1.5 text-center">
              Satirical AI · Not affiliated with any real chip implants
            </p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative w-14 h-14 rounded-full shadow-lg shadow-orange-900/50",
          "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500",
          "flex items-center justify-center transition-all duration-200",
          "border-2 border-orange-400/50",
          open && "rotate-180"
        )}
        aria-label={open ? "Close Trumpstein chat" : "Open Trumpstein chat"}
      >
        {open ? (
          <span className="text-white text-2xl font-black rotate-180">×</span>
        ) : (
          <TrumpsteinIcon />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950 animate-pulse" />
        )}
      </button>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  if (!content) return null;

  // Split on [CHIP OVERRIDE: ...] patterns for special styling
  const parts = content.split(/(\[CHIP OVERRIDE:[\s\S]*?\])/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[CHIP OVERRIDE:")) {
          return (
            <span
              key={i}
              className="inline-block bg-green-900/40 border border-green-500/30 text-green-300 text-xs px-1.5 py-0.5 rounded font-mono mx-0.5 my-0.5"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

function TrumpsteinIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Simple brain/chip icon */}
      <path d="M12 2a5 5 0 0 1 5 5v1a3 3 0 0 1 0 6v1a5 5 0 0 1-10 0v-1a3 3 0 0 1 0-6V7a5 5 0 0 1 5-5z" />
      <path d="M9 9h.01M15 9h.01M9 13h6" />
    </svg>
  );
}
