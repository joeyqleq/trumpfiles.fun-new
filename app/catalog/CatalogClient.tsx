"use client";

import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BrainCircuit,
  ChevronDown,
  CircleGauge,
  Database,
  FileCheck2,
  Flame,
  Gavel,
  Loader2,
  RotateCcw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AICompleteTrumpData } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FlippableEntryCard } from "@/components/FlippableEntryCard";
import TrueFocus from "@/components/TrueFocus";
import PageDecorations from "@/components/PageDecorations";

type SortOption =
  | "entry_asc"
  | "entry_desc"
  | "rank_asc"
  | "score_desc"
  | "score_asc"
  | "date_desc"
  | "date_asc"
  | "danger_desc"
  | "authoritarianism_desc"
  | "lawlessness_desc"
  | "insanity_desc"
  | "absurdity_desc"
  | "title_asc";

type ScoreKey = "danger" | "authoritarianism" | "lawlessness" | "insanity" | "absurdity" | "total";
type Preset = "danger" | "authority" | "lawless" | "absurd" | "recent" | "score" | "sourced" | "epstein" | "second";

interface Thresholds {
  danger: number;
  authoritarianism: number;
  lawlessness: number;
  insanity: number;
  absurdity: number;
  total: number;
}

const DEFAULT_THRESHOLDS: Thresholds = {
  danger: 0,
  authoritarianism: 0,
  lawlessness: 0,
  insanity: 0,
  absurdity: 0,
  total: 0,
};

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "entry_desc", label: "Entry number — descending" },
  { value: "entry_asc", label: "Entry number — ascending" },
  { value: "rank_asc", label: "Highest ranked" },
  { value: "score_desc", label: "Composite score — highest" },
  { value: "score_asc", label: "Composite score — lowest" },
  { value: "danger_desc", label: "Danger — highest" },
  { value: "authoritarianism_desc", label: "Authoritarianism — highest" },
  { value: "lawlessness_desc", label: "Lawlessness — highest" },
  { value: "insanity_desc", label: "Insanity — highest" },
  { value: "absurdity_desc", label: "Absurdity — highest" },
  { value: "date_desc", label: "Event date — newest" },
  { value: "date_asc", label: "Event date — oldest" },
  { value: "title_asc", label: "Title — A to Z" },
];

const VALID_SORTS = new Set<SortOption>(SORT_OPTIONS.map((option) => option.value));
const ITEMS_PER_PAGE = 24;
const SECOND_TERM_PHASE = "__second_term__";

function isSecondTermPhase(phase: string): boolean {
  return /^(white house 2(?::2)?|term 2: year 2|presidency 2|wh2:2)/i.test(phase);
}

const QUICK_PRESETS: Array<{ label: string; preset: Preset; icon: LucideIcon }> = [
  { label: "Most dangerous", preset: "danger", icon: ShieldAlert },
  { label: "Authoritarian", preset: "authority", icon: CircleGauge },
  { label: "Legal chaos", preset: "lawless", icon: Gavel },
  { label: "Most absurd", preset: "absurd", icon: Sparkles },
  { label: "Recent", preset: "recent", icon: Flame },
  { label: "Highest score", preset: "score", icon: ArrowUpDown },
  { label: "Sourced", preset: "sourced", icon: FileCheck2 },
  { label: "Epstein", preset: "epstein", icon: Search },
];

interface CatalogResponse {
  entries: AICompleteTrumpData[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  phases: string[];
}

function numberParam(params: URLSearchParams | Readonly<URLSearchParams>, key: string, max: number): number {
  const parsed = Number(params.get(key) ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(max, parsed)) : 0;
}

function ThresholdControl({
  label,
  value,
  max,
  icon,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-300">
          {icon}{label}
        </span>
        <output className="min-w-12 rounded-md bg-orange-500/10 px-2 py-1 text-center font-mono text-xs text-orange-300">
          {value}/{max}
        </output>
      </div>
      <Slider
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        min={0}
        max={max}
        step={label === "Total score" ? 0.25 : 1}
        aria-label={`Minimum ${label}`}
      />
    </div>
  );
}

export default function CatalogClient({ totalCount }: { totalCount: number }) {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const initialSort = searchParams.get("sort") as SortOption | null;

  const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);
  const [resultTotal, setResultTotal] = useState(totalCount);
  const [categories, setCategories] = useState<string[]>([]);
  const [phases, setPhases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "all");
  const [phaseFilter, setPhaseFilter] = useState(searchParams.get("phase") ?? "all");
  const [sortBy, setSortBy] = useState<SortOption>(initialSort && VALID_SORTS.has(initialSort) ? initialSort : "entry_desc");
  const [thresholds, setThresholds] = useState<Thresholds>({
    danger: numberParam(searchParams, "danger", 10),
    authoritarianism: numberParam(searchParams, "authority", 10),
    lawlessness: numberParam(searchParams, "lawless", 10),
    insanity: numberParam(searchParams, "insanity", 10),
    absurdity: numberParam(searchParams, "absurd", 10),
    total: numberParam(searchParams, "score", 10),
  });
  const [sourcedOnly, setSourcedOnly] = useState(searchParams.get("sourced") === "1");
  const [currentPage, setCurrentPage] = useState(Math.max(1, numberParam(searchParams, "page", 10000) || 1));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(
    sourcedOnly || Object.values(thresholds).some((value) => value > 0),
  );
  const topRef = useRef<HTMLDivElement>(null);
  const skipFirstReset = useRef(true);
  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());

  useEffect(() => {
    const controller = new AbortController();
    const requestParams = new URLSearchParams({
      page: String(currentPage),
      pageSize: String(ITEMS_PER_PAGE),
      sort: sortBy,
    });
    if (deferredSearch) requestParams.set("q", deferredSearch);
    if (selectedCategory !== "all") requestParams.set("category", selectedCategory);
    if (phaseFilter !== "all") requestParams.set("phase", phaseFilter);
    if (thresholds.danger) requestParams.set("danger", String(thresholds.danger));
    if (thresholds.authoritarianism) requestParams.set("authority", String(thresholds.authoritarianism));
    if (thresholds.lawlessness) requestParams.set("lawless", String(thresholds.lawlessness));
    if (thresholds.insanity) requestParams.set("insanity", String(thresholds.insanity));
    if (thresholds.absurdity) requestParams.set("absurd", String(thresholds.absurdity));
    if (thresholds.total) requestParams.set("score", String(thresholds.total));
    if (sourcedOnly) requestParams.set("sourced", "1");
    setLoading(true);
    setLoadError(null);

    fetch(`/api/catalog-data?${requestParams.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        return response.json() as Promise<CatalogResponse>;
      })
      .then((data) => {
        if (!Array.isArray(data.entries)) throw new Error("Catalog returned an invalid payload");
        setEntries(data.entries);
        setResultTotal(Number(data.total ?? 0));
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        setPhases(Array.isArray(data.phases) ? data.phases : []);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to fetch catalog data:", error);
        setLoadError("The archive index could not be loaded. Please retry.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [currentPage, deferredSearch, phaseFilter, selectedCategory, sortBy, sourcedOnly, thresholds]);

  const totalPages = Math.max(1, Math.ceil(resultTotal / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEntries = entries;

  useEffect(() => {
    if (skipFirstReset.current) {
      skipFirstReset.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, phaseFilter, sortBy, sourcedOnly, thresholds]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (phaseFilter !== "all") params.set("phase", phaseFilter);
    if (sortBy !== "entry_desc") params.set("sort", sortBy);
    if (thresholds.danger) params.set("danger", String(thresholds.danger));
    if (thresholds.authoritarianism) params.set("authority", String(thresholds.authoritarianism));
    if (thresholds.lawlessness) params.set("lawless", String(thresholds.lawlessness));
    if (thresholds.insanity) params.set("insanity", String(thresholds.insanity));
    if (thresholds.absurdity) params.set("absurd", String(thresholds.absurdity));
    if (thresholds.total) params.set("score", String(thresholds.total));
    if (sourcedOnly) params.set("sourced", "1");
    if (safePage > 1) params.set("page", String(safePage));
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/catalog?${query}` : "/catalog");
  }, [phaseFilter, safePage, searchTerm, selectedCategory, sortBy, sourcedOnly, thresholds]);

  const catalogQuery = typeof window === "undefined"
    ? searchParams.toString()
    : window.location.search.slice(1);

  const clearAll = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPhaseFilter("all");
    setSortBy("entry_desc");
    setThresholds(DEFAULT_THRESHOLDS);
    setSourcedOnly(false);
    setCurrentPage(1);
  };

  const applyPreset = (preset: Preset) => {
    clearAll();
    if (preset === "danger") { setThresholds({ ...DEFAULT_THRESHOLDS, danger: 8 }); setSortBy("danger_desc"); }
    if (preset === "authority") { setThresholds({ ...DEFAULT_THRESHOLDS, authoritarianism: 8 }); setSortBy("authoritarianism_desc"); }
    if (preset === "lawless") { setThresholds({ ...DEFAULT_THRESHOLDS, lawlessness: 8 }); setSortBy("lawlessness_desc"); }
    if (preset === "absurd") { setThresholds({ ...DEFAULT_THRESHOLDS, absurdity: 8 }); setSortBy("absurdity_desc"); }
    if (preset === "recent") setSortBy("date_desc");
    if (preset === "score") setSortBy("score_desc");
    if (preset === "sourced") setSourcedOnly(true);
    if (preset === "epstein") setSearchTerm("Epstein");
    if (preset === "second") {
      if (phases.some(isSecondTermPhase)) setPhaseFilter(SECOND_TERM_PHASE);
    }
  };

  const updateThreshold = (key: ScoreKey, value: number) => {
    setThresholds((current) => ({ ...current, [key]: value }));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    topRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const activeFilters = [
    searchTerm.trim() && { key: "search", label: `Search: ${searchTerm.trim()}`, clear: () => setSearchTerm("") },
    selectedCategory !== "all" && { key: "category", label: selectedCategory, clear: () => setSelectedCategory("all") },
    phaseFilter !== "all" && { key: "phase", label: phaseFilter === SECOND_TERM_PHASE ? "Second term" : phaseFilter, clear: () => setPhaseFilter("all") },
    sourcedOnly && { key: "sourced", label: "Sourced records", clear: () => setSourcedOnly(false) },
    ...Object.entries(thresholds).filter(([, value]) => value > 0).map(([key, value]) => ({
      key,
      label: `${key === "total" ? "Score" : key} ≥ ${value}`,
      clear: () => updateThreshold(key as ScoreKey, 0),
    })),
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  const displayTotalCount = totalCount;
  const secondTermAvailable = phases.some(isSecondTermPhase);

  return (
    <div className="relative min-h-screen py-8 md:py-14" ref={topRef}>
      <PageDecorations variant="catalog" />
      <main className="container relative z-10 mx-auto max-w-[90rem] px-4">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center font-arctic-twotone-italic">
            <TrueFocus sentence="THE TRUMP FILES" manualMode={false} blurAmount={5} borderColor="#FF6500" glowColor="rgba(255, 101, 0, 0.6)" animationDuration={0.8} pauseBetweenAnimations={2} />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-orange-300/70">Public accountability archive / search terminal</p>
          <h1 className="mt-3 font-arctic-3d text-5xl leading-none text-orange-400 md:text-7xl">CATALOGUE</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base" data-testid="catalog-subtitle">
            Search, rank and cross-filter {displayTotalCount.toLocaleString()} documented records without an account.
          </p>
        </motion.header>

        <section className="relative mb-10 overflow-hidden rounded-[1.5rem] border border-orange-500/25 bg-[linear-gradient(145deg,rgba(28,16,9,.96),rgba(4,5,8,.98)_38%,rgba(19,5,5,.96))] shadow-[0_24px_90px_rgba(0,0,0,.55),0_0_50px_rgba(255,101,0,.08)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <div className="border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <Database className="h-4 w-4 text-orange-400" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">Investigation console</h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> index online</span>
                <span>{loading ? "scanning" : `${resultTotal.toLocaleString()} matches`}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <label className="group relative block">
              <span className="sr-only">Search all catalogue fields</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search titles, synopses, keywords, people, publishers…"
                className="h-14 rounded-xl border-orange-500/25 bg-black/55 pl-12 pr-12 text-base text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-400 focus-visible:ring-orange-400/35"
                data-testid="catalog-search-input"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Rapid dossiers</p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                {QUICK_PRESETS.map(({ label, preset, icon: Icon }) => (
                  <button key={preset} type="button" onClick={() => applyPreset(preset)} className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-center text-[10px] font-black uppercase tracking-[0.09em] text-orange-50/90 transition hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:px-4 sm:text-[11px] sm:tracking-[0.12em]">
                    <Icon className="h-3.5 w-3.5 text-orange-400" />{label}
                  </button>
                ))}
                {secondTermAvailable && (
                  <button type="button" onClick={() => applyPreset("second")} className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-center text-[10px] font-black uppercase tracking-[0.09em] text-orange-50/90 transition hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:px-4 sm:text-[11px] sm:tracking-[0.12em]">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />Second term
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="min-h-11 w-full border-white/10 bg-black/45" data-testid="catalog-category-filter"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="min-h-11 w-full border-white/10 bg-black/45" data-testid="catalog-phase-filter"><SelectValue placeholder="Era / phase" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All eras / phases</SelectItem>
                  {secondTermAvailable && <SelectItem value={SECOND_TERM_PHASE}>Second term (all phase labels)</SelectItem>}
                  {phases.map((phase) => <SelectItem key={phase} value={phase}>{phase}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="min-h-11 w-full border-white/10 bg-black/45" data-testid="catalog-sort-select"><SelectValue placeholder="Sort records" /></SelectTrigger>
                <SelectContent>{SORT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters((current) => !current)}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 text-left transition hover:border-orange-400/35 hover:bg-orange-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-expanded={showAdvancedFilters}
              aria-controls="catalog-advanced-filters"
              data-testid="catalog-advanced-filters-btn"
            >
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-zinc-300"><SlidersHorizontal className="h-4 w-4 text-orange-400" />Score lab & provenance</span>
              <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {showAdvancedFilters && (
                <motion.div
                  id="catalog-advanced-filters"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ThresholdControl label="Danger" value={thresholds.danger} max={10} icon={<ShieldAlert className="h-4 w-4 text-red-400" />} onChange={(value) => updateThreshold("danger", value)} />
                    <ThresholdControl label="Authority" value={thresholds.authoritarianism} max={10} icon={<CircleGauge className="h-4 w-4 text-orange-400" />} onChange={(value) => updateThreshold("authoritarianism", value)} />
                    <ThresholdControl label="Lawlessness" value={thresholds.lawlessness} max={10} icon={<Gavel className="h-4 w-4 text-amber-400" />} onChange={(value) => updateThreshold("lawlessness", value)} />
                    <ThresholdControl label="Insanity" value={thresholds.insanity} max={10} icon={<BrainCircuit className="h-4 w-4 text-fuchsia-400" />} onChange={(value) => updateThreshold("insanity", value)} />
                    <ThresholdControl label="Absurdity" value={thresholds.absurdity} max={10} icon={<Sparkles className="h-4 w-4 text-sky-400" />} onChange={(value) => updateThreshold("absurdity", value)} />
                    <ThresholdControl label="Total score" value={thresholds.total} max={10} icon={<Flame className="h-4 w-4 text-orange-400" />} onChange={(value) => updateThreshold("total", value)} />
                  </div>
                  <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-zinc-300">
                    <span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-orange-400" />Only records with normalized source links</span>
                    <input type="checkbox" checked={sourcedOnly} onChange={(event) => setSourcedOnly(event.target.checked)} className="h-5 w-5 accent-orange-500" />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2" aria-live="polite">
                <span className="rounded-lg border border-orange-400/25 bg-orange-500/10 px-3 py-2 font-mono text-xs text-orange-200" data-testid="catalog-entries-found-badge">
                  {loading ? "Scanning archive…" : `${resultTotal.toLocaleString()} records found`}
                </span>
                {activeFilters.map((filter) => (
                  <button key={filter.key} type="button" onClick={filter.clear} className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[11px] text-zinc-300 hover:border-orange-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400" aria-label={`Remove filter ${filter.label}`}>
                    <span className="truncate">{filter.label}</span><X className="h-3 w-3 shrink-0" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={clearAll} disabled={activeFilters.length === 0 && sortBy === "entry_desc"} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold text-zinc-400 transition hover:bg-white/[0.06] hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400" data-testid="catalog-reset-filters-btn">
                <RotateCcw className="h-4 w-4" />Clear all
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4" role="status">
            <Loader2 className="h-9 w-9 animate-spin text-orange-400 motion-reduce:animate-none" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Loading evidence index</p>
          </div>
        ) : loadError ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-950/30 p-8 text-center">
            <ShieldAlert className="mx-auto h-9 w-9 text-red-300" />
            <p className="mt-4 text-zinc-200">{loadError}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-5 min-h-11 rounded-xl bg-orange-500 px-5 text-sm font-bold text-black hover:bg-orange-300">Retry index</button>
          </div>
        ) : paginatedEntries.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-orange-500/25 bg-black/35 p-10 text-center">
            <Search className="mx-auto h-9 w-9 text-orange-400/65" />
            <h2 className="mt-4 text-xl font-bold text-zinc-100">No dossier matches this combination</h2>
            <p className="mt-2 text-sm text-zinc-500">Remove a score threshold or broaden the universal search.</p>
            <button type="button" onClick={clearAll} className="mt-5 min-h-11 rounded-xl border border-orange-400/35 px-5 text-xs font-black uppercase tracking-[0.14em] text-orange-200 hover:bg-orange-500/10">Clear filters</button>
          </div>
        ) : (
          <>
            <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" layout={!reduceMotion}>
              <AnimatePresence mode="popLayout" initial={false}>
                {paginatedEntries.map((entry, index) => (
                  <motion.div key={entry.entry_number} layout={!reduceMotion} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}>
                    <FlippableEntryCard entry={entry} index={index} catalogQuery={catalogQuery} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <nav className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Catalogue pages" data-testid="catalog-pagination">
                <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 text-xs font-bold text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-200 disabled:opacity-35" data-testid="catalog-prev-page-btn"><ArrowLeft className="h-4 w-4" />Previous</button>
                <span className="rounded-xl border border-orange-500/20 bg-orange-500/[0.07] px-4 py-3 font-mono text-xs text-orange-50/80">Page <strong className="text-orange-300">{safePage}</strong> / {totalPages}</span>
                <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 text-xs font-bold text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-200 disabled:opacity-35" data-testid="catalog-next-page-btn">Next<ArrowRight className="h-4 w-4" /></button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
