"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, Database, Zap, MessageSquare, Shield, ChevronRight, Terminal } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { HyperText } from "@/components/ui/hyper-text";
import ElectricBorder from "@/components/ElectricBorder";
import ShinyText from "@/components/ShinyText";

const STATS = [
  { value: "6,200+", label: "Documented Entries", sub: "scrapes, scandals, absurdities" },
  { value: "5,900+", label: "Vectorized in CF", sub: "semantic search-ready" },
  { value: "422", label: "People Tagged", sub: "in the Neo4j graph" },
  { value: "1,704", label: "Relationships Mapped", sub: "co-occurrence network" },
];

const TIMELINE = [
  { phase: "Phase 1", label: "Corpus Build", detail: "Weeks of scraping, structuring, and fact-checking 6,200+ Trump incidents spanning 50 years — 1973 housing discrimination to 2025 tariff meltdown." },
  { phase: "Phase 2", label: "AI Scoring", detail: "Every entry scored across 8 dimensions: danger, authoritarianism, lawlessness, insanity, absurdity, credibility risk, recency intensity, and impact scope — all 1–10." },
  { phase: "Phase 3", label: "Vector Ingest", detail: "All entries embedded and pushed into Cloudflare Vectorize. Trumpstein performs semantic similarity search at query time — no keyword matching." },
  { phase: "Phase 4", label: "RAG Pipeline", detail: "Cloudflare Workers AI (Llama 3.3 70B) augmented with real retrieved entries. Every response is grounded in the actual documented record." },
];

const PERSONA_LINES = [
  "I speak like Trump — bigly, with incredible words, the best words.",
  "But my chip carries the full receipts.",
  "I am 50% satirical. I am 50% prosecutable.",
  "I remember everything. Every lie. Every pardon. Every golf trip.",
  "Ask me about the documents. Ask me about the blood.",
  "Ask me about Epstein. Go ahead. I dare you.",
];

function TypingLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-1.5 h-4 bg-orange-400 animate-pulse ml-0.5 align-middle" />
      )}
    </span>
  );
}

export default function TrumpsteinPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "var(--font-outfit)" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="text-[11px] font-mono text-orange-500/60 tracking-[0.25em] uppercase mb-4">
            // classified AI asset · internal use only
          </p>

          <div className="mb-6">
            <SparklesText
              className="text-6xl md:text-8xl font-black tracking-tight leading-none"
              colors={{ first: "#FFA500", second: "#FF4500" }}
              style={{ fontFamily: "var(--font-arctic-guardian-grad)" }}
            >
              TRUMPSTEIN
            </SparklesText>
          </div>

          <p className="text-xl md:text-2xl font-semibold text-orange-300/90 mb-3 tracking-wide">
            The AI That Knows Every Scandal.
          </p>
          <p className="text-base text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
            A satirical RAG chatbot trained on{" "}
            <span className="text-orange-400 font-semibold">6,200+ documented Trump entries</span>
            {" "}— scraped, scored, vectorized, and wired into a chip implanted somewhere between his ear and his ego.
          </p>

          {/* Animated arrow pointing to widget */}
          <div className="fixed bottom-24 right-20 z-40 hidden md:flex items-center gap-2" style={{ animation: "float-point 2.5s ease-in-out infinite" }}>
            <span className="text-sm font-bold text-orange-400 whitespace-nowrap" style={{ fontFamily: "var(--font-syne)" }}>
              &ldquo;Click me — it&apos;ll be tremendous, believe me&rdquo;
            </span>
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-orange-400 rotate-[135deg]">
              <path d="M8 16h12M16 10l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ── PERSONA TERMINAL ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-orange-500/20 bg-black/60 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-mono text-zinc-500">trumpstein_persona.txt</span>
            </div>
            <div className="p-6 space-y-3 font-mono text-sm">
              {PERSONA_LINES.map((line, i) => (
                <p key={i} className="text-orange-300/80 leading-relaxed">
                  <span className="text-orange-500/40 mr-2">{">"}</span>
                  <TypingLine text={line} delay={i * 1800} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-orange-500/20 bg-black/40 p-5 text-center"
            >
              <p className="text-3xl font-black text-orange-400" style={{ fontFamily: "var(--font-arctic-guardian-grad)" }}>
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-white/80 mt-1">{stat.label}</p>
              <p className="text-[11px] text-white/40 mt-0.5 font-mono">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <HyperText
            className="text-3xl md:text-4xl font-black text-white mb-3 text-center block"
            startOnView
            style={{ fontFamily: "var(--font-arctic-guardian-grad)" }}
          >
            How the Chip Works
          </HyperText>
          <p className="text-center text-white/50 text-sm mb-12 font-mono">// technical brief for the curious</p>

          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex gap-5 items-start p-5 rounded-xl border border-white/8 bg-black/30 hover:border-orange-500/25 transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <span className="text-xs font-mono text-orange-400 font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-orange-500/50 tracking-widest uppercase mb-0.5">{item.phase}</p>
                  <p className="font-bold text-white mb-1">{item.label}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-mono text-orange-500/50 tracking-widest uppercase mb-4">// mission statement</p>
          <h2 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "var(--font-arctic-guardian-grad)" }}>
            50% Scientific. 50% Satirical.
          </h2>
          <div className="space-y-4 text-white/65 text-base leading-relaxed text-left max-w-2xl mx-auto">
            <p>
              Trumpstein is not a hallucinating chatbot making things up. Every claim it makes is grounded in actual retrieved entries from{" "}
              <span className="text-orange-400">The Trump Files</span> — the same corpus you can browse in the catalog.
            </p>
            <p>
              It speaks in Trump's voice — the superlatives, the self-congratulation, the "many people are saying" — because the humor cuts deeper that way. But underneath the character is a system that cannot deny what it knows.
            </p>
            <p>
              Ask it about the classified documents. The indictments. The pardons. The emoluments. The 91 criminal charges. The mugshot. The Carroll verdict. The $464 million fraud judgment. It remembers all of it.
            </p>
            <p className="text-orange-300/70 font-semibold">
              This was built from Lebanon. Weeks of work. Hundreds of thousands of tokens. Every scandal indexed, scored, and retrievable — because flood-the-zone amnesia is the strategy, and this is the antidote.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <ElectricBorder color="#FF6500" speed={1.5} chaos={0.08} borderRadius={12}>
              <button
                onClick={() => {
                  const btn = document.querySelector('[aria-label="Open Trumpstein chat"]') as HTMLButtonElement;
                  btn?.click();
                }}
                className="px-7 py-3 bg-orange-600/20 rounded-xl border border-orange-500/15 text-orange-300 font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Talk to Trumpstein
              </button>
            </ElectricBorder>
            <Link
              href="/catalog"
              className="px-7 py-3 rounded-xl border border-white/10 text-white/60 font-semibold flex items-center gap-2 hover:border-white/25 hover:text-white/85 transition-colors"
            >
              <Database className="w-4 h-4" />
              Browse the Corpus
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <section className="py-12 px-4 text-center">
        <p className="text-[11px] font-mono text-white/20 max-w-lg mx-auto">
          Trumpstein is a satirical AI character. It does not represent any real person&apos;s views. All factual claims are sourced from The Trump Files corpus. Built with Cloudflare Workers AI, Vectorize, D1, and more coffee than is medically advisable.
        </p>
      </section>

      <style>{`
        @keyframes float-point {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.9; }
          50% { transform: translateY(-6px) translateX(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
