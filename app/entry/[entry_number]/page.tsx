"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileWarning,
  FolderSearch,
  Hash,
  Layers3,
  Link2,
  Loader2,
  RotateCcw,
  Scale,
  Share2,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { EntryDossier } from "@/types/database";
import { SourceBrand, sourceDomain } from "@/components/SourceBrand";

function numeric(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function safeReturnPath(raw: string | null): string {
  if (raw === "/catalog" || raw?.startsWith("/catalog?")) return raw;
  return "/catalog";
}

function ScoreMeter({
  label,
  value,
  reducedMotion,
}: {
  label: string;
  value: number | null;
  reducedMotion: boolean;
}) {
  const score = Math.max(0, Math.min(10, numeric(value)));

  return (
    <div
      className="rounded-xl border border-white/10 bg-black/35 p-3"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={score}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</span>
        <span className="font-mono text-sm font-bold text-orange-300">{score.toFixed(score % 1 ? 1 : 0)}</span>
      </div>
      <div className="grid grid-cols-10 gap-1" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <motion.span
            key={index}
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.25 }}
            animate={{ opacity: index < Math.round(score) ? 1 : 0.13, scaleY: 1 }}
            transition={{ delay: reducedMotion ? 0 : index * 0.035, duration: 0.22 }}
            className={`h-5 origin-bottom rounded-sm ${index >= 8 ? "bg-red-400" : index >= 6 ? "bg-orange-400" : "bg-amber-500"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EntryPage() {
  const params = useParams<{ entry_number: string }>();
  const searchParams = useSearchParams();
  const reduceMotion = Boolean(useReducedMotion());
  const rawEntryNumber = params.entry_number;
  const entryNumber = Number(rawEntryNumber);
  const returnPath = safeReturnPath(searchParams.get("returnTo"));

  const [entry, setEntry] = useState<EntryDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEntry() {
      setLoading(true);
      setError(null);
      setEntry(null);

      if (!/^\d+$/.test(rawEntryNumber) || !Number.isInteger(entryNumber) || entryNumber <= 0) {
        setError("That dossier number is not valid.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/entry/${entryNumber}`, { signal: controller.signal });
        if (response.status === 404) throw new Error("Dossier not found.");
        if (!response.ok) throw new Error("The dossier service did not respond.");
        const data = await response.json() as EntryDossier;
        setEntry(data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        console.error("Error fetching entry:", caught);
        setError(caught instanceof Error ? caught.message : "Failed to load this dossier.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchEntry();
    return () => controller.abort();
  }, [entryNumber, rawEntryNumber, requestKey]);

  const navigationHref = (target: number) => `/entry/${target}?returnTo=${encodeURIComponent(returnPath)}`;

  const scoreRows = useMemo(() => entry ? [
    ["Danger", entry.danger],
    ["Authoritarianism", entry.authoritarianism],
    ["Lawlessness", entry.lawlessness],
    ["Insanity", entry.insanity],
    ["Absurdity", entry.absurdity],
    ["Credibility risk", entry.credibility_risk],
    ["Recency intensity", entry.recency_intensity],
    ["Impact scope", entry.impact_scope],
  ] as const : [], [entry]);

  const shareDossier = async () => {
    if (!entry) return;
    const url = `${window.location.origin}/entry/${entry.entry_number}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Trump Files dossier #${entry.entry_number}`, text: entry.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareConfirmed(true);
        window.setTimeout(() => setShareConfirmed(false), 1800);
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      console.error("Unable to share dossier:", caught);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto min-h-[70vh] max-w-6xl px-4 py-12" aria-busy="true">
        <div className="flex min-h-96 flex-col items-center justify-center gap-4" role="status" aria-live="polite">
          <Loader2 className="h-10 w-10 animate-spin text-orange-400 motion-reduce:animate-none" />
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Opening evidence file {rawEntryNumber}</p>
        </div>
      </main>
    );
  }

  if (error || !entry) {
    return (
      <main className="container mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
        <section className="w-full rounded-3xl border border-red-500/25 bg-[linear-gradient(145deg,rgba(35,8,8,.72),rgba(4,5,8,.96))] p-8 text-center shadow-2xl">
          <FileWarning className="mx-auto h-12 w-12 text-red-300" />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/70">Archive exception</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-50">{error ?? "Dossier not found."}</h1>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={returnPath} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-black hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft className="h-4 w-4" />Back to catalogue</Link>
            <button type="button" onClick={() => setRequestKey((key) => key + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-bold text-zinc-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><RotateCcw className="h-4 w-4" />Retry</button>
          </div>
        </section>
      </main>
    );
  }

  const startDate = formatDate(entry.date_start);
  const endDate = formatDate(entry.date_end);
  const totalScore = numeric(entry.fucked_up_score);

  return (
    <main className="relative min-h-screen overflow-hidden pb-16 pt-7 md:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_70%_10%,rgba(255,65,22,.12),transparent_40%),radial-gradient(circle_at_20%_10%,rgba(255,101,0,.13),transparent_34%)]" />
      <div className="container relative z-10 mx-auto max-w-[86rem] px-4">
        <nav className="mb-5 flex flex-wrap items-center justify-between gap-3" aria-label="Dossier navigation">
          <Link href={returnPath} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.12em] text-zinc-200 transition hover:border-orange-400/40 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
            <ArrowLeft className="h-4 w-4" /> Back to catalogue
          </Link>
          <div className="flex items-center gap-2">
            {entry.navigation.previous ? (
              <Link href={navigationHref(entry.navigation.previous)} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/10 bg-black/35 px-3 text-xs font-bold text-zinc-300 hover:border-orange-400/40 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><ChevronLeft className="h-4 w-4" />Previous</Link>
            ) : <span className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/5 px-3 text-xs text-zinc-700"><ChevronLeft className="h-4 w-4" />Previous</span>}
            {entry.navigation.next ? (
              <Link href={navigationHref(entry.navigation.next)} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/10 bg-black/35 px-3 text-xs font-bold text-zinc-300 hover:border-orange-400/40 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">Next<ChevronRight className="h-4 w-4" /></Link>
            ) : <span className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/5 px-3 text-xs text-zinc-700">Next<ChevronRight className="h-4 w-4" /></span>}
          </div>
        </nav>

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-orange-500/25 bg-[linear-gradient(145deg,rgba(33,17,8,.96),rgba(5,5,8,.98)_50%,rgba(30,6,5,.93))] px-5 py-6 shadow-[0_30px_100px_rgba(0,0,0,.55),0_0_55px_rgba(255,101,0,.08)] sm:px-8 sm:py-8"
        >
          <div className="pointer-events-none absolute -right-8 top-0 font-arctic-3d text-[9rem] leading-none text-orange-500/[0.045] sm:text-[14rem]">{entry.entry_number}</div>
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-200">Dossier TF-{String(entry.entry_number).padStart(4, "0")}</span>
                <span className="rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-red-200">Rank #{entry.fucked_up_rank ?? "—"}</span>
              </div>
              <h1 className="mt-5 max-w-5xl text-3xl font-black leading-[1.04] text-zinc-50 sm:text-5xl lg:text-6xl">{entry.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-zinc-300">
                <span className="inline-flex items-center gap-1.5"><Hash className="h-4 w-4 text-orange-400" />{entry.category}</span>
                <span className="inline-flex items-center gap-1.5"><Layers3 className="h-4 w-4 text-orange-400" />{entry.phase}</span>
                {startDate && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-orange-400" />{startDate}</span>}
              </div>
            </div>
            <div className="flex items-end justify-between gap-5 rounded-2xl border border-orange-400/20 bg-black/35 p-5 lg:block lg:min-w-48">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200/65">Composite severity</p>
                <p className="mt-1 font-mono text-5xl font-black text-orange-300">{entry.fucked_up_score == null ? "—" : totalScore.toFixed(2)}</p>
                <p className="mt-1 font-mono text-xs text-zinc-500">out of 10.00</p>
              </div>
              <ShieldAlert className="h-10 w-10 text-red-400/70 lg:mt-5" />
            </div>
          </div>
        </motion.header>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,.85fr)]">
          <div className="space-y-7">
            <motion.section initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
                <FolderSearch className="h-5 w-5 text-orange-400" />
                <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300/70">Primary record</p><h2 className="text-xl font-bold text-zinc-50">Incident synopsis</h2></div>
              </div>
              <p className="text-base leading-8 text-zinc-200/90 sm:text-lg">{entry.synopsis}</p>
              {entry.rationale_short && (
                <div className="mt-6 border-l-2 border-orange-400 bg-orange-500/[0.07] px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300/70">Analyst rationale</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{entry.rationale_short}</p>
                </div>
              )}
            </motion.section>

            <section className="rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3"><Link2 className="h-5 w-5 text-orange-400" /><div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300/70">Provenance ledger</p><h2 className="text-xl font-bold text-zinc-50">Linked sources</h2></div></div>
                <span className="rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-xs text-zinc-400">{entry.sources.length} normalized</span>
              </div>
              {entry.sources.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {entry.sources.map((source, index) => (
                    <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-orange-400/45 hover:bg-orange-500/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                      <span className="min-w-0">
                        <SourceBrand url={source.url} publisher={source.publisher} size={30} />
                        <span className="mt-1.5 block truncate text-[10px] text-zinc-500">{source.title || sourceDomain(source.url)}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-orange-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/12 p-6 text-sm leading-6 text-zinc-500">No normalized source link is currently attached to this archive record. This is a statement about database coverage, not a credibility judgment.</div>
              )}
            </section>

            {entry.all_keywords?.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-black/45 p-5 sm:p-7">
                <h2 className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-200"><Tag className="h-4 w-4 text-orange-400" />Archive keywords</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.all_keywords.map((keyword) => <span key={keyword} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-zinc-300">{keyword}</span>)}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-7">
            <section className="rounded-3xl border border-orange-500/20 bg-[linear-gradient(155deg,rgba(28,14,8,.9),rgba(4,5,8,.97))] p-5 shadow-2xl">
              <div className="mb-4 flex items-center gap-3"><Scale className="h-5 w-5 text-orange-400" /><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300/70">Score profile</p><h2 className="text-lg font-bold text-zinc-50">Eight dimensions</h2></div></div>
              <div className="space-y-2.5">{scoreRows.map(([label, value]) => <ScoreMeter key={label} label={label} value={value} reducedMotion={reduceMotion} />)}</div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black/45 p-5">
              <div className="mb-4 flex items-center gap-3"><Clock3 className="h-5 w-5 text-orange-400" /><h2 className="text-lg font-bold text-zinc-50">Timeline / context</h2></div>
              <dl className="divide-y divide-white/10 text-sm">
                <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">Phase</dt><dd className="max-w-[70%] text-right text-zinc-200">{entry.phase}</dd></div>
                {startDate && <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">Start</dt><dd className="text-right text-zinc-200">{startDate}</dd></div>}
                {endDate && <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">End</dt><dd className="text-right text-zinc-200">{endDate}</dd></div>}
                {entry.duration_days != null && entry.duration_days > 0 && <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">Duration</dt><dd className="text-right text-zinc-200">{entry.duration_days.toLocaleString()} days</dd></div>}
                {entry.age != null && <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">Age</dt><dd className="text-right text-zinc-200">{entry.age}</dd></div>}
                {entry.subcategory && <div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-zinc-500">Subcategory</dt><dd className="max-w-[70%] text-right text-zinc-200">{entry.subcategory}</dd></div>}
              </dl>
            </section>

            <button type="button" onClick={shareDossier} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-orange-400/35 bg-orange-500/10 px-5 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
              {shareConfirmed ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{shareConfirmed ? "Link copied" : "Share dossier"}
            </button>
          </aside>
        </div>

        <nav className="mt-9 grid gap-3 sm:grid-cols-2" aria-label="Adjacent dossiers">
          {entry.navigation.previous ? <Link href={navigationHref(entry.navigation.previous)} className="group flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 text-sm text-zinc-300 hover:border-orange-400/35 hover:text-orange-200"><ArrowLeft className="h-5 w-5 text-orange-400" /><span><span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-500">Previous file</span>TF-{String(entry.navigation.previous).padStart(4, "0")}</span></Link> : <span />}
          {entry.navigation.next && <Link href={navigationHref(entry.navigation.next)} className="group flex min-h-16 items-center justify-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 text-right text-sm text-zinc-300 hover:border-orange-400/35 hover:text-orange-200"><span><span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-500">Next file</span>TF-{String(entry.navigation.next).padStart(4, "0")}</span><ArrowRight className="h-5 w-5 text-orange-400" /></Link>}
        </nav>
      </div>
    </main>
  );
}
