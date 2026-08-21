"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Brain, Database, Zap, MessageSquare, Shield, ChevronRight, Terminal } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { HyperText } from "@/components/ui/hyper-text";
import ElectricBorder from "@/components/ElectricBorder";
import ShinyText from "@/components/ShinyText";

const STATS = [
  { value: "7K+", label: "Archive Records", sub: "catalogued incidents" },
  { value: "Layered", label: "Retrieval Stack", sub: "archive plus live context" },
  { value: "Public", label: "No Login Gate", sub: "chat and catalogue" },
  { value: "Labeled", label: "Evidence Boundaries", sub: "fact, inference, fiction" },
];

const TIMELINE = [
  { phase: "Phase 1", label: "Corpus Build", detail: "The archive structures thousands of Trump-era incidents across decades, with catalogue records kept separate from satire and fictional session canon." },
  { phase: "Phase 2", label: "AI Scoring", detail: "Entries carry score dimensions such as danger, authoritarianism, lawlessness, insanity, absurdity, credibility risk, recency intensity, and impact scope where the data supports them." },
  { phase: "Phase 3", label: "Retrieval Layer", detail: "Vector retrieval and source-aware context help Trumpstein pull relevant archive material without turning every conversation into a keyword dump." },
  { phase: "Phase 4", label: "Public Chat", detail: "The Worker keeps fast persona chat available while routing factual, current, and source-seeking turns through the appropriate archive or live-context path." },
];


export default function TrumpsteinPage() {
  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "var(--font-outfit)" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
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
            A satirical RAG chatbot wired into{" "}
            <span className="text-orange-400 font-semibold">The Trump Files archive</span>
            {" "}— scored, source-aware, and glitching somewhere between his ear and his ego.
          </p>

          {/* Animated callout pointing to the actual bottom-right widget */}
          <div
            className="fixed bottom-20 right-20 z-40 hidden flex-col items-end gap-1 md:flex pointer-events-none"
            style={{ animation: "float-point 2.5s ease-in-out infinite" }}
          >
            <span className="max-w-[12rem] text-right text-sm font-bold text-orange-400 whitespace-normal" style={{ fontFamily: "var(--font-syne)" }}>
              &ldquo;Click the chip. It&apos;s down there — bottom right — tremendous.&rdquo;
            </span>
            <svg width="36" height="36" viewBox="0 0 32 32" className="text-orange-400 rotate-[45deg] drop-shadow-[0_0_8px_rgba(255,165,0,0.35)]">
              <path d="M8 16h12M16 10l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
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
      <section className="relative overflow-hidden py-16 px-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,145,0,0.16),transparent_58%),linear-gradient(180deg,rgba(7,4,3,0.1)_0%,rgba(7,4,3,0.76)_34%,rgba(7,4,3,0.9)_100%)]" />
          <div className="absolute inset-0 opacity-60">
            <Image
              src="/images/art/pdf_jeff-bikini.png"
              alt=""
              fill
              sizes="100vw"
              className="object-contain object-center scale-[1.03] saturate-[0.88] contrast-[0.92]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,4,3,0.6)_0%,rgba(7,4,3,0.36)_22%,rgba(7,4,3,0.24)_70%,rgba(7,4,3,0.76)_100%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
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
              className="flex gap-5 items-start p-5 rounded-xl border border-white/8 bg-black/48 backdrop-blur-[2px] hover:border-orange-500/25 transition-colors"
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
              Trumpstein is designed to ground factual claims in retrieved archive material from{" "}
              <span className="text-orange-400">The Trump Files</span> — the same corpus you can browse in the catalog — while keeping satire and Rathbone-style fictional canon out of the evidence layer.
            </p>
            <p>
              It speaks in Trump's voice — the superlatives, the self-congratulation, the "many people are saying" — because the humor cuts deeper that way. But underneath the character is a system that cannot deny what it knows.
            </p>
            <p>
              Ask it about the classified documents, indictments, pardons, emoluments, Jan 6, the mugshot, the Carroll verdict, and the civil fraud judgment. It has the archive context to work from.
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
