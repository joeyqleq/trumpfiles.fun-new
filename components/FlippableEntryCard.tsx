"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Facebook,
  FileSearch,
  Mail,
  RotateCw,
  Share2,
  ShieldAlert,
  Twitter,
} from "lucide-react";
import { AICompleteTrumpData, CatalogSource } from "@/types/database";
import { SourceBrand } from "@/components/SourceBrand";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FlippableEntryCardProps {
  entry: AICompleteTrumpData;
  index: number;
  catalogQuery?: string;
  onEmailClick?: () => void;
}

const primaryScores = [
  ["Danger", "danger"],
  ["Authoritarian", "authoritarianism"],
  ["Lawlessness", "lawlessness"],
  ["Insanity", "insanity"],
  ["Absurdity", "absurdity"],
] as const;

const secondaryScores = [
  ["Credibility risk", "credibility_risk"],
  ["Recency intensity", "recency_intensity"],
  ["Impact scope", "impact_scope"],
] as const;

const scoreExplanations: Record<string, string> = {
  Danger: "Overall severity of the documented harm or threat, on a 0–10 scale.",
  Authoritarian: "Extent to which the record concentrates power or weakens democratic constraints.",
  Lawlessness: "Extent to which the conduct disregards laws, due process, or official rules.",
  Insanity: "Degree of reckless, irrational, or destabilizing conduct reflected in the record.",
  Absurdity: "Degree of extraordinary or plainly implausible conduct documented in the record.",
  "Credibility risk": "Risk that claims or actions undermine public trust and reliable information.",
  "Recency intensity": "How immediate and sustained the documented issue is in its time period.",
  "Impact scope": "Breadth of people, institutions, or systems affected by the documented conduct.",
};

function scoreNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(10, parsed)) : 0;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function ScoreStrip({ label, value }: { label: string; value: number | string | null | undefined }) {
  const score = scoreNumber(value);
  const activeSegments = Math.round(score);

  return (
    <div className="grid grid-cols-[6.45rem_1fr_2rem] items-center gap-2" aria-label={`${label}: ${score} out of 10`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="min-h-11 truncate text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400 underline decoration-orange-400/35 underline-offset-4 transition hover:text-orange-100 focus-visible:outline-none focus-visible:text-orange-100 focus-visible:ring-2 focus-visible:ring-orange-400" aria-label={`${label}: ${score} out of 10. ${scoreExplanations[label]}`}>
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={7} className="max-w-60 border border-orange-400/35 bg-zinc-950 px-3 py-2 leading-5 text-zinc-100 shadow-xl">
          <p className="font-bold text-orange-200">{label}</p>
          <p>{scoreExplanations[label]}</p>
        </TooltipContent>
      </Tooltip>
      <span className="grid grid-cols-10 gap-0.5" aria-hidden="true">
        {Array.from({ length: 10 }, (_, segment) => (
          <span
            key={segment}
            className={`h-2 rounded-[2px] ${
              segment < activeSegments
                ? segment >= 8
                  ? "bg-red-400 shadow-[0_0_7px_rgba(248,113,113,.65)]"
                  : segment >= 6
                    ? "bg-orange-400"
                    : "bg-amber-500/80"
                : "bg-white/[0.08]"
            }`}
          />
        ))}
      </span>
      <span className="text-right font-mono text-xs font-bold text-orange-300">{score.toFixed(score % 1 ? 1 : 0)}</span>
    </div>
  );
}

function SourceRow({ source }: { source: CatalogSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-orange-50/85 transition hover:border-orange-400/50 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      title={source.title ?? undefined}
    >
      <SourceBrand url={source.url} publisher={source.publisher} />
      <ArrowUpRight className="h-4 w-4 shrink-0 text-orange-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export function FlippableEntryCard({ entry, index, catalogQuery = "", onEmailClick }: FlippableEntryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const frontRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const hasFlipped = useRef(false);
  const score = Number(entry.fucked_up_score ?? 0);
  const rank = String(entry.fucked_up_rank ?? "—");
  const formattedDate = formatDate(entry.date_start);
  const sources = Array.isArray(entry.sources) ? entry.sources.filter((source) => Boolean(source?.url)) : [];
  const returnTo = catalogQuery ? `/catalog?${catalogQuery}` : "/catalog";
  const entryHref = `/entry/${entry.entry_number}?returnTo=${encodeURIComponent(returnTo)}`;

  const shareUrl = () => `${window.location.origin}/entry/${entry.entry_number}`;

  const handleTwitterShare = () => {
    const text = `Trump Files dossier #${entry.entry_number}: ${entry.title}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl())}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  };

  const handleEmailShare = () => {
    if (onEmailClick) return onEmailClick();
    const subject = `Trump Files dossier #${entry.entry_number}: ${entry.title}`;
    const body = `A dossier from the Trumpstein.me archive:\n\n${entry.title}\nScore: ${Number.isFinite(score) ? score.toFixed(2) : "—"}\n\n${entry.synopsis}\n\nOpen dossier: ${shareUrl()}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    if (!hasFlipped.current) return;
    const focusTimer = window.setTimeout(() => {
      (isFlipped ? backRef.current : frontRef.current)?.focus();
    }, reduceMotion ? 0 : 260);
    return () => window.clearTimeout(focusTimer);
  }, [isFlipped, reduceMotion]);

  const flipCard = (next: boolean) => {
    hasFlipped.current = true;
    setIsFlipped(next);
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.28), duration: 0.4 }}
      className="evidence-card-shell relative h-[590px] [perspective:1400px] sm:h-[610px]"
      aria-label={`Dossier ${entry.entry_number}: ${entry.title}`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
      >
        <section
          ref={frontRef}
          tabIndex={-1}
          inert={isFlipped}
          className="evidence-card-face absolute inset-0 flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-orange-500/25 bg-[linear-gradient(155deg,rgba(30,18,12,.98),rgba(5,5,7,.99)_36%,rgba(17,5,4,.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,.48)] [backface-visibility:hidden] sm:p-6"
          aria-hidden={isFlipped}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_20%_0%,rgba(255,101,0,.23),transparent_68%)]" />
          <header className="relative flex items-start justify-between gap-3 border-b border-orange-300/15 pb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-300/70">Evidence record</p>
              <p className="mt-1 font-arctic-3d text-xl text-orange-300">TF-{String(entry.entry_number).padStart(4, "0")}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Fucked-up rank</p>
              <p className="font-mono text-xl font-bold text-red-300">#{rank}</p>
            </div>
          </header>

          <div tabIndex={0} role="region" aria-label={`Scrollable front of dossier ${entry.entry_number}`} className="evidence-card-scroll relative mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80">
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
              <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-2.5 py-1 text-orange-200">{entry.category}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-zinc-300">{entry.phase}</span>
            </div>
            <h2 className="text-lg font-bold leading-tight text-zinc-50 sm:text-xl">{entry.title}</h2>
            <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
              {formattedDate && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-orange-400" />{formattedDate}</span>}
              {entry.subcategory && <span>{entry.subcategory}</span>}
            </div>
            <p className="text-sm leading-5 text-zinc-300/85">{entry.synopsis}</p>
            <div className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.07] px-3 py-2.5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-200/65">Composite severity</p>
                <p className="mt-1 font-mono text-3xl font-black leading-none text-orange-300">{Number.isFinite(score) ? score.toFixed(2) : "—"}</p>
              </div>
              <ShieldAlert className="h-7 w-7 text-red-400/75" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              {primaryScores.map(([label, key]) => <ScoreStrip key={key} label={label} value={entry[key]} />)}
            </div>
            {entry.all_keywords?.length > 0 && (
              <div className="flex min-h-6 flex-wrap gap-1.5" aria-label="Keywords">
                {entry.all_keywords.slice(0, 3).map((keyword) => <span key={keyword} className="max-w-[9rem] truncate rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-400">{keyword}</span>)}
              </div>
            )}
          </div>

          <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
            <Link
              href={entryHref}
              className="evidence-liquid-button"
            >
              <FileSearch className="h-4 w-4" /> Open dossier
            </Link>
            <button
              type="button"
              onClick={() => flipCard(true)}
              className="evidence-flip-button"
              aria-label={`Flip dossier ${entry.entry_number} to the back`}
            >
              <RotateCw className="h-4 w-4" /><span>Flip</span>
            </button>
          </div>
        </section>

        <section
          ref={backRef}
          tabIndex={-1}
          inert={!isFlipped}
          className="evidence-card-face absolute inset-0 flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-red-500/25 bg-[linear-gradient(150deg,rgba(20,8,7,.99),rgba(5,5,7,.99)_52%,rgba(26,13,6,.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,.48)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-6"
          aria-hidden={!isFlipped}
        >
          <header className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-300/70">Context / provenance</p>
              <h2 className="mt-1 font-arctic-twotone text-xl text-orange-300">Dossier reverse</h2>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-400">#{entry.entry_number}</span>
          </header>

          <div tabIndex={0} role="region" aria-label={`Scrollable back of dossier ${entry.entry_number}`} className="evidence-card-scroll mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80">
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/70">Synopsis</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{entry.synopsis}</p>
            </section>

            {entry.rationale_short && (
              <section className="rounded-xl border border-orange-400/30 bg-orange-500/[0.07] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/70">Analyst rationale</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300/90">{entry.rationale_short}</p>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/70">Source file</p>
                <span className="font-mono text-[10px] text-zinc-500">{sources.length} linked</span>
              </div>
              <div className="mt-2 space-y-2">
                {sources.length ? sources.slice(0, 4).map((source, sourceIndex) => (
                  <SourceRow key={`${source.url}-${sourceIndex}`} source={source} />
                )) : (
                  <p className="rounded-xl border border-dashed border-white/10 px-3 py-3 text-xs text-zinc-500">
                    No normalized source link is attached to this record.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-2.5 border-t border-white/10 pt-4">
              {secondaryScores.map(([label, key]) => (
                <ScoreStrip key={key} label={label} value={entry[key]} />
              ))}
            </section>

            <section>
              <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/70">
                <Share2 className="h-3.5 w-3.5" /> Share evidence
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={handleTwitterShare} className="evidence-icon-button" aria-label="Share on X or Twitter"><Twitter className="h-4 w-4" /></button>
                <button type="button" onClick={handleFacebookShare} className="evidence-icon-button" aria-label="Share on Facebook"><Facebook className="h-4 w-4" /></button>
                <button type="button" onClick={handleEmailShare} className="evidence-icon-button" aria-label="Share by email"><Mail className="h-4 w-4" /></button>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-white/10 pt-3">
            <Link
              href={entryHref}
              className="evidence-liquid-button"
            >
              <FileSearch className="h-4 w-4" /> Open dossier
            </Link>
            <button
              type="button"
              onClick={() => flipCard(false)}
              className="evidence-flip-button"
              aria-label={`Flip dossier ${entry.entry_number} to the front`}
            >
              <RotateCw className="h-4 w-4 -scale-x-100" /><span>Front</span>
            </button>
          </div>
        </section>
      </motion.div>
    </motion.article>
  );
}
