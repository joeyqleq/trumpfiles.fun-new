"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Kippah from "@/components/Kippah";
import { analytics } from "@/lib/analytics";

// Scramble animation for the header text
function ScrambleText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓░";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let step = 0;
    const totalSteps = 18;
    intervalRef.current = setInterval(() => {
      step++;
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (step / totalSteps > i / text.length) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (step >= totalSteps) {
        setDisplay(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text]);

  // Re-scramble periodically
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const t = setInterval(() => {
      let step = 0;
      const totalSteps = 14;
      const inner = setInterval(() => {
        step++;
        setDisplay(
          text.split("").map((char, i) => {
            if (char === " ") return " ";
            if (step / totalSteps > i / text.length) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        if (step >= totalSteps) {
          setDisplay(text);
          clearInterval(inner);
        }
      }, 35);
    }, 8000);
    return () => clearInterval(t);
  }, [text]);

  return <span className={className} style={style}>{display}</span>;
}

const WORKER_URL =
  process.env.NEXT_PUBLIC_TRUMPSTEIN_WORKER_URL ??
  "https://trumpstein.trumpstein.workers.dev";

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !greetedRef.current && messages.length === 0) {
      greetedRef.current = true;
      analytics.chatOpen();
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: "Tremendous — the best chat widget, people are saying. I'm Trumpstein. The deep state put a chip in my brain — very unfair — but now I know everything. Every scandal. Every lie. Every pardon. Ask me anything, believe me.",
      }]);
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
      analytics.chatMessage(trimmed.length);

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
                // Support both Workers AI formats: {response: "..."} and OpenAI-style {choices: [{delta: {content: "..."}}]}
                const token = json.response ?? json.choices?.[0]?.delta?.content ?? "";
                if (token) {
                  accumulated += token;
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

  const handleRate = useCallback(async (rating: 1 | -1, assistantContent: string) => {
    if (!sessionId) return;
    try {
      await fetch(`${WORKER_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, assistantContent }),
      });
    } catch { /* silent */ }
  }, [sessionId]);

  const sendEmailTranscript = useCallback(async () => {
    if (!emailAddr.trim()) return;
    setEmailSending(true);
    const transcript = messages
      .map(m => `${m.role === "user" ? "You" : "Trumpstein"}: ${m.content}`)
      .join("\n\n");
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailAddr,
          subject: "Your Trumpstein Chat Transcript",
          message: `Here's your chat with Trumpstein:\n\n${transcript}\n\n— The Trump Files`,
        }),
      });
      setEmailSent(true);
      setTimeout(() => { setShowEmailModal(false); setEmailSent(false); }, 2000);
    } catch { /* silent */ } finally {
      setEmailSending(false);
    }
  }, [emailAddr, messages]);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3", className)}>
      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "flex h-[min(600px,calc(100dvh-7rem))] w-[420px] max-w-[calc(100vw-2rem)] flex-col",
            "overflow-hidden rounded-2xl border border-orange-500/45 shadow-2xl shadow-orange-950/50",
            "bg-zinc-950"
          )}
        >
          {/* Header — three-part Trumpstein lockup + existing controls */}
          <div className="relative flex min-h-16 shrink-0 items-center justify-between gap-2 overflow-hidden px-2.5 sm:px-3"
               style={{ background: "linear-gradient(135deg, #a93600 0%, #f45b00 48%, #be3100 100%)" }}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-30%,rgba(255,220,175,0.42),transparent_55%)]" />
            {/* Decorative kippah watermark; kept behind the functional lockup. */}
            <div className="pointer-events-none absolute -top-5 right-20 z-0 hidden opacity-30 sm:block">
              <Kippah size="lg" variant="open" />
            </div>
            <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2" aria-label="Trumpstein AI">
              <Image
                src="/trumpstein_ai_logo.png"
                alt="Trumpstein AI logo"
                width={656}
                height={523}
                className="h-6 w-auto shrink-0 object-contain sm:h-8"
                sizes="32px"
              />
              <ScrambleText
                text="TRUMPSTEIN"
                className="flex h-6 min-w-0 items-center whitespace-nowrap text-[10px] font-black tracking-[0.07em] text-white min-[370px]:text-[12px] sm:h-8 sm:text-[14px] sm:tracking-[0.12em]"
                style={{ fontFamily: "var(--font-jetbrains)" } as React.CSSProperties}
              />
              <span className="relative shrink-0" title="Trumpstein chip active">
                <Image
                  src="/trumpstein_ai_chip.png"
                  alt="Trumpstein AI chip"
                  width={688}
                  height={701}
                  className="h-6 w-auto object-contain sm:h-8"
                  sizes="32px"
                />
                <span className="motion-reduce:animate-none absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border border-orange-900 bg-emerald-300" />
              </span>
            </div>
            <div className="z-10 flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-black/15 text-white/75 transition-colors hover:bg-black/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                title="Email transcript"
                aria-label="Email chat transcript"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-black/15 text-xl leading-none text-white/85 transition-colors hover:bg-black/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages — readable transcript above the blended missile artwork */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#100a07]" aria-label="Trumpstein conversation transcript">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 sm:inset-4"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse at center, black 48%, rgba(0,0,0,0.82) 68%, transparent 100%)",
                maskImage: "radial-gradient(ellipse at center, black 48%, rgba(0,0,0,0.82) 68%, transparent 100%)",
              }}
            >
              <Image
                src="/images/art/pdf_3-missile_love.png"
                alt=""
                fill
                priority={false}
                sizes="(max-width: 480px) calc(100vw - 56px), 388px"
                className="object-contain object-center opacity-55 saturate-[0.78] contrast-[0.88]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(12,7,5,0.78) 0%, rgba(35,13,4,0.30) 22%, rgba(35,13,4,0.24) 70%, rgba(10,7,6,0.88) 100%), radial-gradient(circle at 50% 45%, rgba(255,101,0,0.05) 0%, rgba(10,6,4,0.38) 72%, rgba(5,4,4,0.82) 100%)",
              }}
            />
            <div className="scrollbar-thin scrollbar-thumb-orange-800/40 relative z-10 h-full space-y-4 overflow-y-auto p-3.5 sm:p-4">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="rounded-lg bg-black/85 px-3 py-2 text-center text-sm text-zinc-300">
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
                    "max-w-[88%] rounded-xl px-3 py-2.5 shadow-[0_3px_8px_rgba(0,0,0,0.38)]",
                    msg.role === "user"
                      ? "rounded-br-sm bg-[#c94b08] text-white"
                      : "rounded-bl-sm border border-orange-400/20 bg-zinc-950/95 text-zinc-100"
                  )}
                >
                  <MessageContent
                    content={msg.content}
                    sessionId={sessionId}
                    msgId={msg.id}
                    onRate={msg.role === "assistant" && !msg.streaming ? handleRate : undefined}
                  />

                  {msg.streaming && (
                    <span className="motion-reduce:animate-none ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-orange-400 align-middle" />
                  )}

                  {msg.entryNumbers && msg.entryNumbers.length > 0 && !msg.streaming && (
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-700/50 flex flex-wrap gap-1">
                      {msg.entryNumbers.map((n) => (
                        <a
                          key={n}
                          href={`/entry/${n}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-orange-400 hover:text-orange-300 underline font-mono"
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
                aria-label="Ask Trumpstein"
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-zinc-800 text-zinc-100 placeholder-zinc-500",
                  "min-h-11 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500",
                  "border border-zinc-700 max-h-32 overflow-y-auto"
                )}
                style={{ lineHeight: "1.5" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  "bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed",
                  "transition-colors text-white font-bold text-lg"
                )}
                aria-label="Send message"
              >
                {loading ? (
                  <span className="motion-reduce:animate-none h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-center text-xs text-zinc-400">
              Satirical AI · Not affiliated with any real chip implants
            </p>
          </div>
        </div>
      )}

      {/* Toggle button with small kippah on top */}
      <div className="relative">
        {/* Kippah on toggle button */}
        {!open && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <Kippah size="sm" variant="closed" />
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "relative w-14 h-14 rounded-full shadow-lg shadow-orange-900/50",
            "flex items-center justify-center transition-all duration-200",
            "border-2 border-orange-400/50 hover:border-orange-300/70",
            "hover:shadow-orange-500/40 hover:shadow-xl",
            open ? "bg-zinc-800 border-zinc-600" : "bg-gradient-to-br from-orange-500 to-orange-700"
          )}
          style={!open ? {
            boxShadow: "0 0 20px rgba(255,101,0,0.35), 0 4px 12px rgba(0,0,0,0.4)",
          } : {}}
          aria-label={open ? "Close Trumpstein chat" : "Open Trumpstein chat"}
        >
          {open ? (
            <span className="text-white text-2xl font-black">×</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logos/trumpfiles_orange_logo.png"
              alt="Trumpstein"
              width={38}
              height={38}
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 4px rgba(255,150,0,0.6))" }}
            />
          )}
          {!open && (
            <span className="motion-reduce:animate-none absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-zinc-950 bg-green-400" />
          )}
        </button>
      </div>

      {/* Email transcript modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={() => setShowEmailModal(false)}>
          <div className="rounded-2xl border border-orange-500/30 bg-zinc-950 p-5 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
            <p className="font-bold text-white text-sm mb-3">Email this chat transcript</p>
            {emailSent ? (
              <p className="text-green-400 text-sm">Sent! Believe me, tremendous email.</p>
            ) : (
              <>
                <input
                  type="email"
                  value={emailAddr}
                  onChange={e => setEmailAddr(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 mb-3"
                />
                <div className="flex gap-2">
                  <button onClick={sendEmailTranscript} disabled={emailSending || !emailAddr.trim()}
                    className="flex-1 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-sm py-2 transition-colors">
                    {emailSending ? "Sending…" : "Send"}
                  </button>
                  <button onClick={() => setShowEmailModal(false)} className="px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white/70 text-sm py-2">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Animated chip component with hover tooltip fetching entry data
function ChipOverride({ text }: { text: string }) {
  const [tooltip, setTooltip] = useState<{ title: string; synopsis: string; danger: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Extract entry number from text like "Entry #4930 — Title..."
  const entryMatch = text.match(/Entry #(\d+)/);
  const entryNum = entryMatch ? entryMatch[1] : null;

  const handleMouseEnter = async (e: React.MouseEvent) => {
    setShowTooltip(true);
    setMousePos({ x: e.clientX, y: e.clientY });
    if (entryNum && !tooltip && !loading) {
      setLoading(true);
      try {
        const res = await fetch(`/api/entry/${entryNum}`);
        if (res.ok) {
          const data = await res.json();
          setTooltip({ title: data.title, synopsis: data.synopsis?.slice(0, 200), danger: data.danger });
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <span className="relative inline-block">
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] cursor-pointer select-none mx-0.5 my-0.5"
        style={{
          background: "linear-gradient(135deg, rgba(0,180,80,0.2) 0%, rgba(0,220,100,0.12) 100%)",
          border: "1px solid rgba(0,220,100,0.4)",
          color: "#00e664",
          boxShadow: "0 0 6px rgba(0,220,100,0.2), inset 0 0 6px rgba(0,220,100,0.05)",
          animation: "chip-pulse 2s ease-in-out infinite",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span style={{ fontSize: "8px", opacity: 0.7 }}>⚡</span>
        {text.replace(/^\[CHIP OVERRIDE:\s*/, "").replace(/\]$/, "").slice(0, 60)}
        {text.length > 75 ? "…" : ""}
      </span>

      {showTooltip && (tooltip || loading) && typeof window !== "undefined" && (
        <span
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: Math.min(mousePos.x + 12, window.innerWidth - 280),
            top: mousePos.y - 10,
            width: 260,
          }}
        >
          <span className="block rounded-xl p-3 text-[11px] leading-relaxed"
               style={{ background: "#0a1a0a", border: "1px solid rgba(0,220,100,0.35)", boxShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>
            {loading ? (
              <span style={{ color: "rgba(0,220,100,0.6)" }}>Loading chip data…</span>
            ) : tooltip ? (
              <>
                <span className="block font-bold mb-1" style={{ color: "#00e664", fontSize: "11px" }}>{tooltip.title}</span>
                <span className="block" style={{ color: "rgba(255,255,255,0.65)" }}>{tooltip.synopsis}…</span>
                <span className="block mt-1.5 font-mono" style={{ color: "#ff4d5e", fontSize: "10px" }}>Danger: {tooltip.danger}/10</span>
              </>
            ) : null}
          </span>
        </span>
      )}

      <style>{`
        @keyframes chip-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(0,220,100,0.2), inset 0 0 4px rgba(0,220,100,0.05); }
          50% { box-shadow: 0 0 10px rgba(0,220,100,0.4), inset 0 0 8px rgba(0,220,100,0.1); }
        }
      `}</style>
    </span>
  );
}

function MessageContent({ content, sessionId, msgId, onRate }: {
  content: string;
  sessionId?: string | null;
  msgId?: string;
  onRate?: (rating: 1 | -1, content: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const parts = content.split(/(\[CHIP OVERRIDE:[\s\S]*?\])/g);

  const copyText = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative group/msg">
      <div className="text-[12px] leading-[1.55]">
        {parts.map((part, i) => {
          if (part.startsWith("[CHIP OVERRIDE:")) {
            return <ChipOverride key={i} text={part} />;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
      {/* Action buttons — appear on hover */}
      <div className="absolute -top-2 right-0 opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={copyText}
          className="p-1 rounded bg-zinc-700/80 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors"
          title="Copy"
        >
          {copied ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          )}
        </button>
        {onRate && (
          <>
            <button onClick={() => onRate(1, content)} className="p-1 rounded bg-zinc-700/80 hover:bg-green-700 text-white/70 hover:text-white transition-colors" title="Good response">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
            </button>
            <button onClick={() => onRate(-1, content)} className="p-1 rounded bg-zinc-700/80 hover:bg-red-800 text-white/70 hover:text-white transition-colors" title="Bad response">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
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
