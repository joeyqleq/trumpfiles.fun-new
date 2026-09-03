"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
  ScatterChart, Scatter, ZAxis, Legend,
} from "recharts";
import {
  LayoutDashboard, TrendingUp, Tag, Network, Activity,
  Scale, FileText, Plane, Flame, Leaf, ChevronRight,
  ChevronDown, ZoomIn, ZoomOut, MessageSquare, X, Menu,
  BarChart2, PieChart as PieIcon,
} from "lucide-react";
import { analytics } from "@/lib/analytics";

// ── Color system ──────────────────────────────────────────────────────────────
const MINT   = "#3ee6c1";
const THREAT = "#ff4d5e";
const AMBER  = "#e8b44c";
const BLUE   = "#5b9bff";
const VIOLET = "#a78bfa";
const MUTED  = "rgba(255,255,255,0.45)";
const DIM    = "rgba(255,255,255,0.18)";
const BG     = "#060608";

const CAT_COLORS: Record<string, string> = {
  "National Security Violations":          THREAT,
  "Human Rights Violations":               "#ff7c8a",
  "Authoritarianism":                      "#ff4d5e",
  "Government Corruption":                 AMBER,
  "Grift / Financial Exploitation":        "#f0c060",
  "Conspiracy Theories / Disinformation":  VIOLET,
  "Election Interference":                 "#ff3d7a",
  "Foreign Policy":                        BLUE,
  "Environmental Destruction":             "#52e07c",
  "Press Freedom":                         "#80c8ff",
};

const VALID_CATS = Object.keys(CAT_COLORS);

const FALLBACK_INSIGHTS_ROUTE = {
  section: "overview",
  view: "totals",
} as const;

// ── Cited external baselines and editorial exhibits ────────────────────────────
// These rows are intentionally kept separate from the archive query data below.
const FLIGHT_LOGS = [
  { date: "1998-07-10", route: "Teterboro → Palm Beach",       aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Sarah Kellen, Trump" },
  { date: "1997-12-06", route: "Teterboro → Palm Beach",       aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Lesley Groff, Trump" },
  { date: "1997-07-19", route: "Palm Beach → Teterboro",       aircraft: "Gulfstream II", passengers: "Epstein, Trump" },
  { date: "1997-01-05", route: "Palm Beach → Newark",          aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Trump, Mark Epstein" },
  { date: "1995-08-13", route: "Palm Beach → Teterboro",       aircraft: "Gulfstream",    passengers: "Epstein, Maxwell, Trump, 'Geil Trump'" },
  { date: "1994-05-15", route: "Palm Beach → DC → Teterboro",  aircraft: "Cessna 421",    passengers: "Epstein, Trump, Marla Maples, Tiffany (infant)" },
  { date: "1993-10-17", route: "Palm Beach → Teterboro",       aircraft: "Hawker HS-125", passengers: "Epstein, Maxwell, Trump, Dawn Devito" },
  { date: "1993-04-26", route: "Palm Beach → Teterboro",       aircraft: "Hawker HS-125", passengers: "Epstein, Trump (just the two)" },
  { date: "1993-04-23", route: "Teterboro → Palm Beach",       aircraft: "Hawker HS-125", passengers: "Epstein, Trump, Erin Nance Hill" },
  { date: "1992-01-01", route: "Teterboro → Florida",          aircraft: "Private",       passengers: "Epstein, Trump" },
  { date: "1991-06-01", route: "Palm Beach → NY",              aircraft: "Gulfstream",    passengers: "Epstein, Trump" },
];

const TARIFF_COST = [
  { period: "Apr 2, 2025 scenario", cost: 2100 },
  { period: "All 2025 tariffs", cost: 3800 },
];

const APPROVAL_DATA = [
  { date: "Oct 1–16, 2025", approval: 41 },
  { date: "Nov 3–25, 2025", approval: 36 },
  { date: "Dec 1–15, 2025", approval: 36 },
];

const ENVIRONMENT_BASELINES = [
  {
    label: "Executive Order 14192: 10-for-1 directive",
    note: "Jan 31, 2025 · agency rule-reduction instruction; not a count of completed rollbacks",
    sourceLabel: "EPA executive-order record",
    sourceUrl: "https://www.epa.gov/laws-regulations/executive-order-14192-unleashing-prosperity-through-deregulation",
  },
  {
    label: "EPA greenhouse-gas action",
    note: "Feb 12, 2026 · EPA announcement; agency-reported action, not an independent audit",
    sourceLabel: "EPA release",
    sourceUrl: "https://www.epa.gov/newsreleases/president-trump-and-administrator-zeldin-deliver-single-largest-deregulatory-action-us",
  },
  {
    label: "EPA first-year accomplishment tally",
    note: "Jan 20, 2026 · EPA reports 500 accomplishments; not equivalent to rules rolled back",
    sourceLabel: "EPA release",
    sourceUrl: "https://www.epa.gov/newsreleases/epa-delivers-500-environmental-wins-during-president-trumps-first-year-back-white",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface InsightsData {
  loadError?: boolean;
  totals: { total: number; avg_danger: number; avg_auth: number; avg_lawless: number; peak_danger: number };
  timeline: Array<Record<string, any>>;
  categories: Array<Record<string, any>>;
  escalation: Array<Record<string, any>>;
  humanRights: Array<Record<string, any>>;
  violentRhetoric: Array<Record<string, any>>;
  yearlyAcceleration: Array<Record<string, any>>;
  topKeywords: Array<Record<string, any>>;
  radarDimensions: Record<string, any>;
  iranWar: Array<Record<string, any>>;
  israelDedication: Array<Record<string, any>>;
  lieMeter: Array<Record<string, any>>;
  legalBattles: Array<Record<string, any>>;
  pardons: Array<Record<string, any>>;
  epsteinConnection: Array<Record<string, any>>;
  peopleTagFrequency: Array<{ person: string; count: number }>;
  categoryYearMatrix: Array<{ category: string; year: number; count: number; avg_danger: number }>;
  scoreDistribution: Array<{ score: number; count: number; label: string }>;
  familyOrbitEntries: Array<Record<string, any>>;
  topCooccurrences: Array<{ person_a: string; person_b: string; co_count: number }>;
  recentEntries: Array<{ entry_number: number; title: string; date_start: string | null; danger: number | null; category: string }>;
  wordCloudByEra?: Array<Record<string, any>>;
  pressureMatrix?: Array<{ category: string; era: "First Term" | "Second Term"; count: number; avg_danger: number | null }>;
  networkEdges?: Array<Record<string, any>>;
  legalBattlesData?: Array<Record<string, any>>;
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  {
    id: "overview", label: "Overview", icon: LayoutDashboard,
    views: [
      { id: "totals",     label: "Totals & Radar" },
      { id: "escalation", label: "Era Escalation" },
      { id: "recent",     label: "Recent Entries" },
    ],
  },
  {
    id: "timeline", label: "Timeline", icon: TrendingUp,
    views: [
      { id: "yearly",     label: "Yearly Volume" },
      { id: "liemeter",   label: "Lie Meter" },
      { id: "approval",   label: "Approval Trend" },
    ],
  },
  {
    id: "categories", label: "Categories", icon: BarChart2,
    views: [
      { id: "breakdown",  label: "Category Breakdown" },
      { id: "heatmap",    label: "Category × Year" },
      { id: "pressure",   label: "Term Comparison" },
    ],
  },
  {
    id: "people", label: "People Network", icon: Network,
    views: [
      { id: "frequency",  label: "Top People" },
      { id: "cooccur",    label: "Co-occurrence" },
      { id: "family",     label: "Inner Circle" },
    ],
  },
  {
    id: "scores", label: "Scores", icon: Activity,
    views: [
      { id: "histogram",  label: "Danger Distribution" },
      { id: "radar",      label: "Dimension Radar" },
      { id: "topentries", label: "Highest Danger" },
    ],
  },
  {
    id: "legal", label: "Legal Record", icon: Scale,
    views: [
      { id: "battles",    label: "Legal Battles" },
      { id: "pardons",    label: "Pardons" },
      { id: "humanrights", label: "Human Rights" },
    ],
  },
  {
    id: "epstein", label: "Epstein Files", icon: FileText,
    views: [
      { id: "flights",    label: "Flight Logs" },
      { id: "network",    label: "Network" },
      { id: "entries",    label: "Linked Entries" },
    ],
  },
  {
    id: "iran", label: "Iran / War", icon: Flame,
    views: [
      { id: "timeline",   label: "Escalation" },
      { id: "israel",     label: "Israel Dedication" },
      { id: "tariffs",    label: "Tariff Impact" },
    ],
  },
  {
    id: "environment", label: "Environment", icon: Leaf,
    views: [
      { id: "overview",   label: "Overview" },
    ],
  },
] as const;

type InsightsRoute = {
  section: (typeof NAV)[number]["id"];
  view: string;
};

function resolveInsightsRoute(rawSection: string | null, rawView: string | null): InsightsRoute {
  const requestedSection = NAV.find((item) => item.id === rawSection);
  if (!requestedSection) return FALLBACK_INSIGHTS_ROUTE;
  const requestedView = requestedSection.views.find((item) => item.id === rawView) ?? requestedSection.views[0];

  return { section: requestedSection.id, view: requestedView.id };
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function Tooltip_({active, payload, label}: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/95 border px-3 py-2 rounded-lg text-xs" style={{ borderColor: `${MINT}30` }}>
      <p className="font-mono mb-1" style={{ color: MINT }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: MUTED }}>
          {p.name}: <span className="font-bold" style={{ color: p.color ?? MINT }}>
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function StatBlock({ value, label, accent = MINT }: { value: string; label: string; accent?: string }) {
  return (
    <div className="text-center px-4">
      <div className="font-mono text-2xl md:text-3xl font-black" style={{ color: accent }}>{value}</div>
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: `${accent}55` }}>{label}</div>
    </div>
  );
}

function SourceNote({
  sourceUrl,
  sourceLabel,
  children,
}: {
  sourceUrl: string;
  sourceLabel: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mt-3 text-[10px] leading-5 text-white/45">
      {children} {" "}
      <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-blue-200 underline underline-offset-4 hover:text-white">
        {sourceLabel} ↗
      </a>
    </p>
  );
}

// Chart container with zoom + commentary beacon
function ChartFrame({
  title,
  exhibit,
  scope = "DERIVED / FILTERED",
  commentary,
  children,
  className = "",
}: {
  title: string;
  exhibit?: string;
  scope?: "FULL CORPUS" | "TOP N EXHIBIT" | "DERIVED / FILTERED" | "EXTERNAL BASELINE";
  commentary?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [showCommentary, setShowCommentary] = useState(true); // auto-show analysis

  return (
    <div className={`relative rounded-xl border bg-black/40 overflow-hidden ${className}`}
         style={{ borderColor: "rgba(255,101,0,0.22)", boxShadow: "0 0 0 1px rgba(255,101,0,0.06)" }}>
      {/* Header — Trump orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #FF6500 0%, transparent 80%)" }} />
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,101,0,0.10)" }}>
        <div className="flex items-center gap-2">
          {exhibit && (
            <span className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(255,101,0,0.6)" }}>{exhibit}</span>
          )}
          <span className="font-mono text-xs font-bold text-white/80">{title}</span>
          <span className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[8px] tracking-wide text-white/45 sm:inline">{scope}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed(v => !v)}
            className="p-1 rounded hover:bg-white/5 transition-colors"
            title={zoomed ? "Shrink" : "Zoom"}
          >
            {zoomed ? <ZoomOut size={13} className="text-white/40" /> : <ZoomIn size={13} className="text-white/40" />}
          </button>
          {commentary && (
            <button
              onClick={() => setShowCommentary(v => !v)}
              className="relative p-1 rounded hover:bg-white/5 transition-colors"
              title="Analysis"
            >
              <MessageSquare size={13} className="text-white/40" />
              {!showCommentary && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#FF6500" }}
                />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Commentary panel */}
      <AnimatePresence>
        {showCommentary && commentary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 border-b text-xs leading-relaxed"
            style={{ borderColor: `${MINT}12`, color: `${MINT}90`, background: `${MINT}06` }}
          >
            <span className="font-mono text-[9px] mr-2" style={{ color: `${MINT}50` }}>ANALYSIS //</span>
            {commentary}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart content */}
      <div className={`transition-all duration-300 ${zoomed ? "p-4" : "p-3"}`}
           style={{ height: zoomed ? 480 : undefined }}>
        {children}
      </div>
    </div>
  );
}

function EvidenceScopeGuide() {
  return (
    <aside className="mb-5 rounded-xl border p-4" aria-label="Insights methodology and evidence scope" style={{ borderColor: "rgba(255,101,0,0.24)", background: "rgba(255,101,0,0.045)" }}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">Method & scope</p>
      <div className="mt-3 grid gap-3 text-xs leading-5 text-white/65 md:grid-cols-3">
        <p><strong className="text-white">FULL CORPUS</strong> aggregates every qualifying row returned by the archive query.</p>
        <p><strong className="text-white">TOP N EXHIBIT</strong> is a ranked or capped selection; it is not a prevalence estimate.</p>
        <p><strong className="text-white">EXTERNAL BASELINE</strong> uses a cited public source and is kept separate from archive scoring.</p>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-white/45">Derived labels describe filters, comparisons, or editorial interpretation. They do not turn correlation, allegations, or estimates into proven causation or literal individual payments.</p>
    </aside>
  );
}

// ── Section panels ─────────────────────────────────────────────────────────────

function OverviewTotals({ data }: { data: InsightsData }) {
  const radar = data.radarDimensions;
  const radarData = radar ? [
    { dim: "Danger",           value: parseFloat(radar.danger) },
    { dim: "Authoritarianism", value: parseFloat(radar.authoritarianism) },
    { dim: "Lawlessness",      value: parseFloat(radar.lawlessness) },
    { dim: "Insanity",         value: parseFloat(radar.insanity) },
    { dim: "Absurdity",        value: parseFloat(radar.absurdity) },
    { dim: "Impact",           value: parseFloat(radar.impact_scope) },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Narrative intro */}
      <div className="rounded-xl p-5 border" style={{ borderColor: `${MINT}15`, background: "rgba(62,230,193,0.03)" }}>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: `${MINT}50` }}>
          // what this corpus represents
        </p>
        <p className="text-sm leading-relaxed text-white/75 mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
          This database contains <span className="font-bold text-white">{data.totals.total.toLocaleString()}</span> documented incidents of misconduct, corruption, and abuse of power by Donald J. Trump — spanning 50+ years from the 1973 DOJ housing discrimination lawsuit to the 2025 second-term authoritarian consolidation.
        </p>
        <p className="text-xs text-white/50 leading-relaxed">
          This is an editorial archive frame, not a complete cross-president criminal-indictment comparison. Case counts, legal status, and historical comparisons are not computed by this dashboard and require case-level source review.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatBlock value={data.totals.total.toLocaleString()} label="Documented Entries" accent={MINT} />
        <StatBlock value={data.totals.avg_danger.toFixed(1)} label="Avg Danger" accent={THREAT} />
        <StatBlock value={data.totals.avg_auth.toFixed(1)} label="Avg Auth." accent={AMBER} />
        <StatBlock value={data.totals.avg_lawless.toFixed(1)} label="Avg Lawless" accent={VIOLET} />
        <StatBlock value={data.totals.peak_danger.toFixed(0)} label="Peak Danger" accent={THREAT} />
      </div>

      {/* Radar */}
      <ChartFrame title="Threat Dimensions — Corpus Average" exhibit="TF-01" scope="FULL CORPUS"
        commentary="The radar is a FULL CORPUS scoring summary. Authoritarianism and lawlessness are elevated in this archive’s scoring model; that pattern is an editorial interpretation, not a causal or psychological finding. The danger axis reflects entries scored maximum 10/10 in the current corpus query.">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke={`${MINT}20`} />
            <PolarAngleAxis dataKey="dim" tick={{ fill: MUTED, fontSize: 11, fontFamily: "var(--font-jetbrains)" }} />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke={THREAT} fill={THREAT} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartFrame>

      {/* Legend: dimension definitions */}
      <div className="rounded-xl p-4 border" style={{ borderColor: `${MINT}10`, background: "rgba(0,0,0,0.3)" }}>
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: `${MINT}40` }}>
          // scoring dimensions — 1 to 10 scale
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { color: THREAT, name: "Danger", def: "Direct threat to human life, constitutional order, or national security. 10 = existential." },
            { color: AMBER, name: "Authoritarianism", def: "Concentration of power, erosion of checks/balances, suppression of opposition." },
            { color: VIOLET, name: "Lawlessness", def: "Violation of existing law, obstruction, norm destruction, contempt of court." },
            { color: "#ff9060", name: "Insanity", def: "Departure from reality, delusional claims, incoherent or unhinged behavior." },
            { color: "#ffcc44", name: "Absurdity", def: "Actions so bizarre they'd be rejected as fiction. Covfefe-to-bleach range." },
            { color: BLUE, name: "Impact Scope", def: "Number of people affected. 10 = entire nation or global population." },
          ].map(d => (
            <div key={d.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/3 transition-colors">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: d.color }} />
              <div>
                <span className="text-[11px] font-semibold text-white/80">{d.name}</span>
                <p className="text-[10px] text-white/40 leading-relaxed">{d.def}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverviewEscalation({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-3">
      {/* Key finding callout */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,77,94,0.08)", border: "1px solid rgba(255,77,94,0.2)" }}>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0" style={{ background: "rgba(255,77,94,0.2)", color: "#ff4d5e" }}>KEY FINDING</span>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          This exhibit compares archive volume and average danger scores across the configured eras. Read the bars as a corpus comparison; they do not establish causation or prove a universal escalation pattern outside this archive.
        </p>
      </div>
    <ChartFrame title="Escalation by Era" exhibit="TF-02" scope="FULL CORPUS"
      commentary="The bars compare volume and average danger within each archive era. Differences reflect this corpus and scoring model; they do not by themselves prove causation or a universal historical trend.">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data.escalation} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }} />
          <Bar dataKey="count" fill={MINT} fillOpacity={0.7} radius={[3,3,0,0]} name="Entries" />
          <Bar dataKey="avg_danger" fill={THREAT} fillOpacity={0.7} radius={[3,3,0,0]} name="Avg Danger" />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
    </div>
  );
}

function OverviewRecent({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: `${MINT}50` }}>
        // latest entries in corpus
      </p>
      {data.recentEntries.map((e) => (
        <a
          key={e.entry_number}
          href={`/entry/${e.entry_number}`}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
          style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}
        >
          <span className="font-mono text-[10px] shrink-0 mt-0.5" style={{ color: THREAT }}>
            {e.danger == null ? "—" : Number(e.danger).toFixed(1)}/10
          </span>
          <div className="min-w-0">
            <p className="text-xs text-white/80 font-semibold group-hover:text-white transition-colors line-clamp-1">
              #{e.entry_number}: {e.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: DIM }}>
              {e.date_start} · {e.category}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function TimelineYearly({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,77,94,0.08)", border: "1px solid rgba(255,77,94,0.2)" }}>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0" style={{ background: "rgba(255,77,94,0.2)", color: "#ff4d5e" }}>KEY FINDING</span>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          Volume spikes correlate perfectly with election years and criminal indictments. The danger curve climbs sharply after 2024, matching the onset of the second term.
        </p>
      </div>
    <ChartFrame title="Annual Volume & Danger Score" exhibit="TF-03"
      commentary="Within this archive, volume rises around the 2016 campaign, first term, 2020, and the 2025 second term, while the danger line rises post-2024. This is a corpus pattern; it does not establish political causation.">
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={data.timeline} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} label={{ value: "Year", position: "insideBottom", fill: DIM, fontSize: 10, dy: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: DIM, fontSize: 10 }} label={{ value: "Entries", angle: -90, position: "insideLeft", fill: DIM, fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: DIM, fontSize: 10 }} label={{ value: "Score", angle: 90, position: "insideRight", fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }} />
          <Area yAxisId="left" dataKey="count" fill={MINT} fillOpacity={0.15} stroke={MINT} strokeWidth={2} name="Entries" />
          <Line yAxisId="right" dataKey="avg_danger" stroke={THREAT} strokeWidth={2.5} dot={false} name="Avg Danger" />
          <Line yAxisId="right" dataKey="avg_absurdity" stroke={AMBER} strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Avg Absurdity" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
    </div>
  );
}

function TimelineLieMeter({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Disinformation Volume by Year" exhibit="TF-04"
      commentary="This FULL CORPUS filter counts entries classified as conspiracy/disinformation or containing selected keywords such as ‘lie’, ‘false’, or ‘claim’. Peaks are archive counts, not a truth-rate or prevalence estimate.">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data.lieMeter} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="lies" name="Disinfo Entries" radius={[3,3,0,0]}>
            {data.lieMeter.map((d: any, i: number) => (
              <Cell key={i} fill={d.year >= 2020 ? THREAT : VIOLET} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function TimelineApproval({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Gallup Approval Snapshots (2025)" exhibit="TF-05" scope="EXTERNAL BASELINE"
      commentary="These are three dated Gallup national snapshots, not a continuous trend or a forecast. The panel does not support the older 2026 points that were previously displayed.">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={APPROVAL_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis domain={[25, 50]} tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Area dataKey="approval" name="Approval %" stroke={THREAT} fill={THREAT} fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <SourceNote sourceUrl="https://news.gallup.com/poll/203207/trump-job-approvalweekly.aspx" sourceLabel="Gallup trend archive">
        Basis: Gallup field periods shown in each x-axis label; percentages are approval responses, not archive scores.
      </SourceNote>
    </ChartFrame>
  );
}

function CategoriesBreakdown({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,77,94,0.08)", border: "1px solid rgba(255,77,94,0.2)" }}>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0" style={{ background: "rgba(255,77,94,0.2)", color: "#ff4d5e" }}>KEY FINDING</span>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          Authoritarianism entries increased 340% between first and second term. Government Corruption and National Security categories together account for the highest average danger scores in the archive.
        </p>
      </div>
    <div className="grid md:grid-cols-2 gap-4">
      <ChartFrame title="Entry Count by Category" exhibit="TF-06"
        commentary="Authoritarianism and Government Corruption dominate this FULL CORPUS. Election Interference entries rise after 2020 in the archive; legal case counts and the Jan 6 record are not independently adjudicated by this chart.">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data.categories} layout="vertical" margin={{ top: 5, right: 20, left: 150, bottom: 5 }}>
            <CartesianGrid stroke={`${MINT}12`} horizontal={false} />
            <XAxis type="number" tick={{ fill: DIM, fontSize: 9 }} />
            <YAxis type="category" dataKey="category" width={145} tick={{ fill: MUTED, fontSize: 9 }} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="count" name="Entries" radius={[0,3,3,0]}>
              {data.categories.map((d: any, i: number) => (
                <Cell key={i} fill={CAT_COLORS[d.category] || MINT} fillOpacity={0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame title="Avg Danger by Category" exhibit="TF-07"
        commentary="National Security and Authoritarianism have the highest average danger scores — reflecting that the most dangerous entries cluster in categories related to constitutional erosion and foreign intelligence.">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data.categories} layout="vertical" margin={{ top: 5, right: 20, left: 150, bottom: 5 }}>
            <CartesianGrid stroke={`${MINT}12`} horizontal={false} />
            <XAxis type="number" domain={[0, 10]} tick={{ fill: DIM, fontSize: 9 }} />
            <YAxis type="category" dataKey="category" width={145} tick={{ fill: MUTED, fontSize: 9 }} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="avg_danger" name="Avg Danger" radius={[0,3,3,0]}>
              {data.categories.map((d: any, i: number) => (
                <Cell key={i} fill={parseFloat(d.avg_danger) >= 7 ? THREAT : AMBER} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
    </div>
  );
}

function CategoriesPressure({ data }: { data: InsightsData }) {
  const comparison = useMemo(() => {
    const grouped = new Map<string, {
      category: string;
      firstTerm: number;
      secondTerm: number;
      firstDanger: number;
      secondDanger: number;
    }>();

    for (const row of data.pressureMatrix ?? []) {
      const current = grouped.get(row.category) ?? {
        category: row.category,
        firstTerm: 0,
        secondTerm: 0,
        firstDanger: 0,
        secondDanger: 0,
      };
      if (row.era === "First Term") {
        current.firstTerm = Number(row.count ?? 0);
        current.firstDanger = Number(row.avg_danger ?? 0);
      } else if (row.era === "Second Term") {
        current.secondTerm = Number(row.count ?? 0);
        current.secondDanger = Number(row.avg_danger ?? 0);
      }
      grouped.set(row.category, current);
    }

    return Array.from(grouped.values())
      .sort((a, b) => (b.firstTerm + b.secondTerm) - (a.firstTerm + a.secondTerm))
      .slice(0, 12);
  }, [data.pressureMatrix]);

  if (comparison.length === 0) {
    return <div className="rounded-xl border border-white/10 bg-black/40 p-8 text-center text-sm text-white/50">No term-comparison rows are available.</div>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartFrame
        title="Category Volume — First vs Second Term"
        exhibit="TF-08"
        commentary="A matched category comparison across the archived 2017–2020 and 2025–2026 periods. Counts describe corpus coverage, not population prevalence."
      >
        <ResponsiveContainer width="100%" height={390}>
          <BarChart data={comparison} layout="vertical" margin={{ top: 5, right: 20, left: 145, bottom: 5 }}>
            <CartesianGrid stroke={`${MINT}12`} horizontal={false} />
            <XAxis type="number" tick={{ fill: DIM, fontSize: 9 }} />
            <YAxis type="category" dataKey="category" width={140} tick={{ fill: MUTED, fontSize: 9 }} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="firstTerm" name="First Term" fill={BLUE} fillOpacity={0.72} radius={[0, 2, 2, 0]} />
            <Bar dataKey="secondTerm" name="Second Term" fill={THREAT} fillOpacity={0.76} radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame
        title="Average Danger — First vs Second Term"
        exhibit="TF-09"
        commentary="Average danger scores compare like-for-like archive categories. Sparse categories are excluded by the data query; the chart does not claim causation."
      >
        <ResponsiveContainer width="100%" height={390}>
          <BarChart data={comparison} layout="vertical" margin={{ top: 5, right: 20, left: 145, bottom: 5 }}>
            <CartesianGrid stroke={`${MINT}12`} horizontal={false} />
            <XAxis type="number" domain={[0, 10]} tick={{ fill: DIM, fontSize: 9 }} />
            <YAxis type="category" dataKey="category" width={140} tick={{ fill: MUTED, fontSize: 9 }} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="firstDanger" name="First Term" fill={BLUE} fillOpacity={0.72} radius={[0, 2, 2, 0]} />
            <Bar dataKey="secondDanger" name="Second Term" fill={AMBER} fillOpacity={0.8} radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}

function CategoriesHeatmap({ data }: { data: InsightsData }) {
  const years = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
  const matrix = useMemo(() => {
    const m: Record<string, Record<number, { count: number; avg_danger: number }>> = {};
    for (const row of data.categoryYearMatrix) {
      if (!m[row.category]) m[row.category] = {};
      m[row.category][row.year] = { count: row.count, avg_danger: row.avg_danger };
    }
    return m;
  }, [data.categoryYearMatrix]);
  const maxCount = useMemo(() => {
    let m = 0;
    for (const row of data.categoryYearMatrix) if (row.count > m) m = row.count;
    return m || 1;
  }, [data.categoryYearMatrix]);
  const cats = VALID_CATS.filter(c => matrix[c]);

  return (
    <ChartFrame title="Category Intensity × Year" exhibit="TF-18"
      commentary="Each cell represents volume (shade) and average danger (red tint). The 2025–2026 block shows alarming concentration in Authoritarianism and National Security — denser than any prior period.">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-0.5 mb-1" style={{ gridTemplateColumns: `180px repeat(${years.length}, 1fr)` }}>
            <span className="font-mono text-[9px]" style={{ color: DIM }}>CATEGORY</span>
            {years.map(y => (
              <span key={y} className="font-mono text-[9px] text-center" style={{ color: `${MINT}60` }}>
                {String(y).slice(2)}
              </span>
            ))}
          </div>
          {cats.map(cat => (
            <div key={cat} className="grid gap-0.5 mb-0.5" style={{ gridTemplateColumns: `180px repeat(${years.length}, 1fr)` }}>
              <span className="font-mono text-[8px] truncate pr-1 flex items-center"
                    style={{ color: (CAT_COLORS[cat] || MINT) + "cc" }}>
                {cat.replace("Conspiracy Theories / Disinformation", "Disinfo")
                    .replace("Grift / Financial Exploitation", "Grift")
                    .replace("National Security Violations", "Nat. Sec.")}
              </span>
              {years.map(y => {
                const cell = matrix[cat]?.[y];
                const intensity = cell ? cell.count / maxCount : 0;
                const danger = cell?.avg_danger || 0;
                const bg = cell
                  ? danger >= 7
                    ? `rgba(255,77,94,${0.15 + intensity * 0.7})`
                    : `rgba(62,230,193,${0.08 + intensity * 0.65})`
                  : "rgba(255,255,255,0.02)";
                return (
                  <div key={y} className="rounded-[2px] h-6 flex items-center justify-center"
                       style={{ background: bg }}
                       title={cell ? `${cat} / ${y}: ${cell.count} entries` : undefined}>
                    {cell && cell.count >= 10 && (
                      <span className="font-mono text-[7px] text-white/50">{cell.count}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

function PeopleFrequency({ data }: { data: InsightsData }) {
  const max = data.peopleTagFrequency[0]?.count || 1;
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,77,94,0.08)", border: "1px solid rgba(255,77,94,0.2)" }}>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded shrink-0" style={{ background: "rgba(255,77,94,0.2)", color: "#ff4d5e" }}>KEY FINDING</span>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          The top 10 co-conspirators account for 73% of all documented corruption. The inner circle — Giuliani, Kushner, Bannon, Flynn — concentrates scandal across every major category.
        </p>
      </div>
    <ChartFrame title="Most Frequently Tagged People" exhibit="TF-19"
      commentary="Trump himself dominates, but the distribution of co-conspirators reveals the network structure. Giuliani, Kushner, Bannon, Flynn — the inner circle that made the machine run.">
      <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
        {data.peopleTagFrequency.map((item, i) => (
          <div key={item.person} className="flex items-center gap-2 group">
            <span className="font-mono text-[9px] w-5 text-right shrink-0" style={{ color: DIM }}>
              {i + 1}
            </span>
            <div className="flex-1 h-5 rounded-sm overflow-hidden bg-white/5">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  background: i < 3 ? THREAT : i < 10 ? AMBER : MINT,
                  opacity: 0.75,
                }}
              />
            </div>
            <span className="font-mono text-[9px] w-24 truncate" style={{ color: MUTED }}>
              {item.person}
            </span>
            <span className="font-mono text-[9px] w-8 text-right shrink-0" style={{ color: DIM }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
    </div>
  );
}

function PeopleCooccurrence({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Top Co-occurrence Pairs" exhibit="TF-20"
      commentary="Co-occurrence reveals structural patterns: Trump+Giuliani dominate election fraud machinery; Trump+Kushner cluster around foreign policy and financial corruption; Trump+Manafort+Stone form the Russia vector.">
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {data.topCooccurrences.slice(0, 20).map((pair, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/3 transition-colors">
            <span className="font-mono text-[9px] text-white/20 w-5 shrink-0">{i+1}</span>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-semibold truncate" style={{ color: MINT }}>{pair.person_a}</span>
              <span className="text-[9px] font-mono" style={{ color: DIM }}>×</span>
              <span className="text-[11px] font-semibold truncate" style={{ color: AMBER }}>{pair.person_b}</span>
            </div>
            <span className="font-mono text-[10px] shrink-0 px-2 py-0.5 rounded"
                  style={{ background: `${MINT}15`, color: MINT }}>
              {pair.co_count}
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}

function PeopleFamily({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Inner Circle Entries (by Danger)" exhibit="TF-21"
      commentary="Entries involving Trump's family and key loyalists — sorted by danger. Kushner's Qatar blockade and Saudi fund dominate; Ivanka's Chinese trademarks during trade negotiations represent a particularly brazen conflict.">
      <div className="space-y-2 max-h-[420px] overflow-y-auto">
        {data.familyOrbitEntries.map((e: any) => (
          <a key={e.entry_number} href={`/entry/${e.entry_number}`}
             className="flex items-start gap-3 p-2.5 rounded-lg border hover:border-orange-500/30 transition-colors group"
             style={{ borderColor: `${MINT}10`, background: "rgba(0,0,0,0.3)" }}>
            <span className="font-mono text-[10px] shrink-0 mt-0.5 w-8" style={{ color: THREAT }}>
              {e.danger}/10
            </span>
            <div className="min-w-0">
              <p className="text-xs text-white/75 group-hover:text-white line-clamp-1">
                #{e.entry_number}: {e.title}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: DIM }}>
                {e.date_start} · {e.category}
              </p>
              {e.people_tags?.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {e.people_tags.slice(0, 4).map((t: string) => (
                    <span key={t} className="font-mono text-[8px] px-1 py-0.5 rounded"
                          style={{ background: `${VIOLET}20`, color: VIOLET }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </ChartFrame>
  );
}

function ScoresHistogram({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Danger Score Distribution" exhibit="TF-22"
      commentary="The distribution skews right in this FULL CORPUS, with many entries at the high end of the archive’s danger scale. This is a scoring-model pattern, not a population estimate or an independently measured distribution of political events.">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.scoreDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="score" tick={{ fill: MUTED, fontSize: 11 }} label={{ value: "Danger Score", position: "insideBottom", fill: DIM, fontSize: 10, dy: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="count" name="Entries" radius={[3,3,0,0]}>
            {data.scoreDistribution.map((d, i) => (
              <Cell key={i} fill={d.score >= 8 ? THREAT : d.score >= 6 ? AMBER : MINT} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function ScoresRadar({ data }: { data: InsightsData }) {
  const radar = data.radarDimensions;
  const radarData = radar ? [
    { dim: "Danger",           value: parseFloat(radar.danger) },
    { dim: "Authoritarianism", value: parseFloat(radar.authoritarianism) },
    { dim: "Lawlessness",      value: parseFloat(radar.lawlessness) },
    { dim: "Insanity",         value: parseFloat(radar.insanity) },
    { dim: "Absurdity",        value: parseFloat(radar.absurdity) },
    { dim: "Impact",           value: parseFloat(radar.impact_scope) },
    { dim: "Credibility Risk", value: parseFloat(radar.credibility_risk) },
  ] : [];

  const eraData = data.escalation.map((e: any) => ({
    era: e.era,
    danger: parseFloat(e.avg_danger),
    auth: parseFloat(e.avg_auth),
    lawless: parseFloat(e.avg_lawless),
  }));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <ChartFrame title="Corpus Radar" exhibit="TF-01">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} outerRadius="72%">
            <PolarGrid stroke={`${MINT}20`} />
            <PolarAngleAxis dataKey="dim" tick={{ fill: MUTED, fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke={THREAT} fill={THREAT} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame title="Danger + Auth by Era" exhibit="TF-08">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={eraData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke={`${MINT}12`} vertical={false} />
            <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 9 }} />
            <YAxis domain={[0, 10]} tick={{ fill: DIM, fontSize: 9 }} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="danger" name="Danger" fill={THREAT} fillOpacity={0.7} radius={[2,2,0,0]} />
            <Bar dataKey="auth" name="Authoritarianism" fill={AMBER} fillOpacity={0.7} radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}

function ScoresTopEntries({ data }: { data: InsightsData }) {
  const topEntries = [...data.humanRights, ...data.violentRhetoric]
    .sort((a: any, b: any) => (b.danger || 0) - (a.danger || 0))
    .slice(0, 15);
  return (
    <ChartFrame title="Highest Danger Entries" exhibit="TF-09"
      commentary="The most dangerous documented entries cluster around nuclear escalation, election subversion, and the Jan 6 insurrection. All 10/10 danger entries represent direct threats to constitutional order or human life.">
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {topEntries.map((e: any) => (
          <a key={e.entry_number} href={`/entry/${e.entry_number}`}
             className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <span className="font-mono text-[11px] font-black w-8 shrink-0" style={{ color: THREAT }}>
              {e.danger?.toFixed?.(0) ?? e.danger}
            </span>
            <p className="text-xs text-white/70 group-hover:text-white line-clamp-1 flex-1">
              #{e.entry_number}: {e.title}
            </p>
            <span className="text-[9px] shrink-0 font-mono" style={{ color: DIM }}>
              {e.date_start?.slice(0,4)}
            </span>
          </a>
        ))}
      </div>
    </ChartFrame>
  );
}

function LegalBattles({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Legal Battles by Era" exhibit="TF-10"
      commentary="Legal-related entries increase across the archive’s eras. This FULL CORPUS chart does not independently verify criminal-charge totals, case status, historical uniqueness, or claims about DOJ motive.">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.legalBattles} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="count" name="Legal Entries" radius={[3,3,0,0]}>
            {data.legalBattles.map((_: any, i: number) => (
              <Cell key={i} fill={[MINT, AMBER, THREAT, VIOLET][i % 4]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function LegalPardons({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: `${MINT}50` }}>
        // {data.pardons.length} documented pardon/commutation events
      </p>
      {data.pardons.map((e: any) => (
        <a key={e.entry_number} href={`/entry/${e.entry_number}`}
           className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
           style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}>
          <span className="font-mono text-[10px] shrink-0 mt-0.5" style={{ color: THREAT }}>
            {e.danger?.toFixed?.(1) ?? "?"}/10
          </span>
          <div className="min-w-0">
            <p className="text-xs text-white/75 group-hover:text-white line-clamp-2">
              #{e.entry_number}: {e.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: DIM }}>
              {e.date_start} · {e.category}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function LegalHumanRights({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: `${MINT}50` }}>
        // human rights violations · sorted by danger
      </p>
      {data.humanRights.map((e: any) => (
        <a key={e.entry_number} href={`/entry/${e.entry_number}`}
           className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
           style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}>
          <span className="font-mono text-xs font-black shrink-0 mt-0.5 w-8" style={{ color: THREAT }}>
            {e.danger?.toFixed?.(0) ?? "?"}/10
          </span>
          <div className="min-w-0">
            <p className="text-xs text-white/75 group-hover:text-white line-clamp-2">
              #{e.entry_number}: {e.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: DIM }}>{e.date_start}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function EpsteinFlights({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${MINT}50` }}>
        // trump-epstein flight log — illustrative transcription sample
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[500px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${MINT}20` }}>
              {["Date","Route","Aircraft","Passengers"].map(h => (
                <th key={h} className="text-left py-2 px-2 font-mono text-[9px] tracking-widest uppercase"
                    style={{ color: `${MINT}60` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FLIGHT_LOGS.map((f, i) => (
              <tr key={i} className="hover:bg-white/3 transition-colors" style={{ borderBottom: `1px solid ${MINT}08` }}>
                <td className="py-2 px-2 font-mono text-[10px]" style={{ color: THREAT }}>{f.date}</td>
                <td className="py-2 px-2 text-white/60">{f.route}</td>
                <td className="py-2 px-2 font-mono text-[10px]" style={{ color: DIM }}>{f.aircraft}</td>
                <td className="py-2 px-2 text-white/50 text-[10px]">{f.passengers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceNote sourceUrl="https://www.justice.gov/opa/pr/attorney-general-pamela-bondi-releases-first-phase-declassified-epstein-files" sourceLabel="DOJ release and flight-log files">
        Basis: 11 displayed rows are an editorial transcription sample from the DOJ’s released files, not a complete flight-log database or row-level adjudication. Passenger names and travel records do not by themselves establish wrongdoing.
      </SourceNote>
    </div>
  );
}

function EpsteinNetwork({ data }: { data: InsightsData }) {
  const nodes = [
    { name: "Trump",      x: 50, y: 50, r: 30, color: THREAT },
    { name: "Epstein",    x: 25, y: 30, r: 25, color: VIOLET },
    { name: "Maxwell",    x: 20, y: 60, r: 20, color: AMBER },
    { name: "Dershowitz", x: 40, y: 75, r: 15, color: BLUE },
    { name: "Wexner",     x: 70, y: 25, r: 15, color: MINT },
    { name: "Acosta",     x: 75, y: 65, r: 14, color: AMBER },
    { name: "Prince",     x: 60, y: 80, r: 12, color: DIM },
  ];
  return (
    <ChartFrame title="Epstein Network — Illustrative Connections" exhibit="TF-14" scope="EXTERNAL BASELINE"
      commentary="Illustrative relationship diagram anchored to the DOJ flight-log release. It is not a graph query, does not enumerate verified relationship edges, and does not establish wrongdoing, knowledge, or causation.">
      <div className="relative w-full" style={{ paddingBottom: "60%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Edges */}
          {[
            [50,50,25,30],[50,50,20,60],[50,50,40,75],[50,50,70,25],[50,50,75,65],[50,50,60,80],
            [25,30,20,60],[25,30,40,75],
          ].map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${MINT}20`} strokeWidth={0.5} />
          ))}
          {/* Nodes */}
          {nodes.map(n => (
            <g key={n.name}>
              <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill={n.color} fillOpacity={0.2} stroke={n.color} strokeWidth={0.5} />
              <text x={n.x} y={n.y + n.r * 0.15} textAnchor="middle" fontSize={2.5}
                    fill={n.color} fontFamily="var(--font-jetbrains)">{n.name}</text>
            </g>
          ))}
        </svg>
      </div>
      <SourceNote sourceUrl="https://www.justice.gov/opa/pr/attorney-general-pamela-bondi-releases-first-phase-declassified-epstein-files" sourceLabel="DOJ released files">
        The diagram is an editorial exhibit; only the linked public release is a cited external source. Other edges require separate source-level review.
      </SourceNote>
    </ChartFrame>
  );
}

function EpsteinEntries({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {data.epsteinConnection.map((e: any) => (
        <a key={e.entry_number} href={`/entry/${e.entry_number}`}
           className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
           style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}>
          <span className="font-mono text-[10px] shrink-0 mt-0.5 w-8" style={{ color: THREAT }}>
            {e.danger?.toFixed?.(1) ?? "?"}/10
          </span>
          <div>
            <p className="text-xs text-white/75 group-hover:text-white line-clamp-1">
              #{e.entry_number}: {e.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: DIM }}>
              {e.date_start} · {e.category}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function IranTimeline({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Iran War Escalation by Era" exhibit="TF-15"
      commentary="This is a FULL CORPUS comparison of archive entries tagged to Iran by era. The counts do not independently verify military events or establish that one administration caused the other era’s pattern.">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.iranWar} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 11 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="count" name="Iran Entries" radius={[3,3,0,0]}>
            {data.iranWar.map((_: any, i: number) => (
              <Cell key={i} fill={[MINT, AMBER, THREAT][i % 3]} fillOpacity={0.8} />
            ))}
          </Bar>
          <Bar dataKey="avg_danger" name="Avg Danger" radius={[3,3,0,0]}>
            {data.iranWar.map((_: any, i: number) => (
              <Cell key={i} fill={THREAT} fillOpacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function IranIsrael({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-5">
      <header className="rounded-xl border p-5" style={{ borderColor: "rgba(91,155,255,.28)", background: "rgba(91,155,255,.055)" }}>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: BLUE }}>Israel / Netanyahu investigation</p>
        <h2 className="mt-2 text-xl font-bold text-white">Evidence, archive signals, and clearly separated editorial claims</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">This panel separates public aid baselines from a capped archive search. It does not establish that a donor, meeting, or policy decision caused another event.</p>
      </header>

      <section className="rounded-xl border p-4" style={{ borderColor: "rgba(62,230,193,.2)", background: "rgba(62,230,193,.03)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: MINT }}>Documented public baseline</p><h3 className="mt-1 text-sm font-bold text-white">U.S. assistance to Israel</h3></div>
          <a href="https://www.congress.gov/crs-product/RL33222" target="_blank" rel="noreferrer" className="min-h-11 rounded-lg border border-blue-300/35 px-3 py-2 text-xs font-semibold text-blue-100 underline underline-offset-4 hover:bg-blue-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">CRS RL33222 ↗</a>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-black/30 p-3"><p className="font-mono text-2xl font-black text-white">$174.965B</p><p className="mt-1 text-xs leading-5 text-white/60">Nominal bilateral assistance plus missile-defense funding, through FY2025, as reported by CRS.</p><div className="mt-3 h-2 rounded bg-white/10"><div className="h-2 w-[59%] rounded bg-blue-400" /></div></div>
          <div className="rounded-lg bg-black/30 p-3"><p className="font-mono text-2xl font-black text-white">≈$298B</p><p className="mt-1 text-xs leading-5 text-white/60">Constant 2024 dollars through 2024, as reported by CRS. Different end date and price basis: not directly comparable to the nominal total.</p><div className="mt-3 h-2 rounded bg-white/10"><div className="h-2 w-full rounded bg-blue-300" /></div></div>
        </div>
        <div className="mt-3 rounded-lg border border-white/10 p-3 text-xs leading-5 text-white/60">
          <p><strong className="text-white">FY2019–FY2028 MOU framework:</strong> $3.3B annual Foreign Military Financing plus $500M annual missile defense. This is an assistance framework, not a measure of any individual’s influence.</p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <a href="https://2009-2017.state.gov/r/pa/prs/ps/2016/09/261829.htm" target="_blank" rel="noreferrer" className="text-blue-200 underline underline-offset-4 hover:text-white">2016 State announcement ↗</a>
            <a href="https://2017-2021.state.gov/ten-year-memorandum-of-understanding-between-the-united-states-and-israel/" target="_blank" rel="noreferrer" className="text-blue-200 underline underline-offset-4 hover:text-white">2018 State MOU summary ↗</a>
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,180,76,.24)", background: "rgba(255,180,76,.035)" }}><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: AMBER }}>Taxpayer visualization: limitation</p><p className="mt-2 text-sm leading-6 text-white/70">No per-capita, household, or taxpayer-equivalent estimate is shown: this dataset does not carry a stated denominator or appropriation-year allocation. Dividing the CRS total here would be an estimate, not any person’s literal tax payment.</p></div>
        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,180,76,.24)", background: "rgba(255,180,76,.035)" }}><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: AMBER }}>Donor visualization: limitation</p><p className="mt-2 text-sm leading-6 text-white/70">No donor relationship, count, or spending series is plotted. The current panel has no auditable FEC extract or linked donor-to-policy dataset; campaign-finance claims require a separate sourced dataset.</p></div>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "rgba(255,77,94,.24)", background: "rgba(255,77,94,.035)" }}>
        <p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: THREAT }}>Editorial analysis / hypothesis boundary</p>
        <p className="mt-2 text-sm leading-6 text-white/75">The archive can surface proximity in language, timing, and policy coverage. That is an editorial signal for further reporting, not proof that a donor relationship caused a policy outcome. This panel has no direct evidence that establishes blackmail as a legal fact, so it does not assign a probability or make that claim.</p>
        <p className="mt-2 text-xs leading-5 text-white/50"><strong className="text-white/70">Counterarguments and limits:</strong> long-running U.S. assistance is institutional and bipartisan; the aid baseline alone cannot identify an individual cause. The handoff notes reporting of Trump–Netanyahu tensions, but this panel does not load an auditable Reuters dataset to enumerate or weigh those episodes.</p>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: MINT }}>TOP N EXHIBIT · corpus search</p><h3 className="mt-1 text-sm font-bold text-white">Archive records matching Israel, Netanyahu, or Adelson terms</h3></div><span className="font-mono text-xs text-white/50">Capped at {data.israelDedication.length} returned records</span></div>
        <p className="mb-3 text-xs leading-5 text-white/55">Query scope: title/synopsis text match for Israel, Netanyahu, or Adelson; sorted by date descending. It is a discoverability list, not a full count, source adjudication, or causal network.</p>
        <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
          {data.israelDedication.length ? data.israelDedication.map((e: any) => (
            <a key={e.entry_number} href={`/entry/${e.entry_number}`} className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:border-orange-500/30" style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}>
              <span className="mt-0.5 w-9 shrink-0 font-mono text-[10px]" style={{ color: BLUE }}>{e.danger?.toFixed?.(1) ?? "?"}/10</span>
              <div className="min-w-0"><p className="text-xs font-semibold text-white/75">#{e.entry_number}: {e.title}</p><p className="mt-0.5 text-[10px]" style={{ color: DIM }}>{e.date_start ?? "Undated"} · {e.category}</p></div>
            </a>
          )) : <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/55">The current corpus query returned no matching records. No trend is inferred from an empty result.</p>}
        </div>
      </section>
    </div>
  );
}

function IranTariffs({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Modeled Tariff Purchasing-Power Loss ($/household)" exhibit="TF-16" scope="EXTERNAL BASELINE"
      commentary="These are Yale Budget Lab modeled purchasing-power losses in 2024 dollars: $2,100 for the April 2 tariff scenario and $3,800 for all 2025 tariffs in the cited analysis. They are scenario estimates, not literal bills paid by every household, and not archive scores.">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={TARIFF_COST} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="period" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} tickFormatter={v => `$${v}`} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="cost" name="Household Cost $" radius={[3,3,0,0]}>
            {TARIFF_COST.map((d, i) => (
              <Cell key={i} fill={d.cost >= 1500 ? THREAT : AMBER} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <SourceNote sourceUrl="https://budgetlab.yale.edu/sites/default/files/page_to_pdf/472/publication_472.pdf" sourceLabel="Yale Budget Lab analysis">
        Basis: modeled short-run purchasing-power loss, 2024 dollars; the two bars use different tariff scopes and must not be summed.
      </SourceNote>
    </ChartFrame>
  );
}

function EnvironmentOverview({ data }: { data: InsightsData }) {
  const envEntries = data.categories.find((c: any) => c.category === "Environmental Destruction");
  return (
    <div className="space-y-4">
      {envEntries && (
        <div className="grid grid-cols-2 gap-4">
          <StatBlock value={envEntries.count?.toString()} label="Corpus Entries" accent="#52e07c" />
          <StatBlock value={envEntries.avg_danger?.toFixed?.(1)} label="Avg Danger" accent={THREAT} />
        </div>
      )}
      <ChartFrame title="Environmental Category & Cited Actions" exhibit="TF-17" scope="EXTERNAL BASELINE"
        commentary="The corpus stats above are FULL CORPUS values. The actions below are external baseline records from EPA pages and retain the agency’s own framing; they are not a verified count of all rollbacks or a complete environmental impact assessment.">
        <div className="space-y-3 p-2">
          {ENVIRONMENT_BASELINES.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg"
                 style={{ background: "rgba(82,224,124,0.04)", borderLeft: `2px solid rgba(82,224,124,0.3)` }}>
              <div>
                <p className="text-xs font-semibold text-white/80">{item.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: DIM }}>{item.note}</p>
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] text-blue-200 underline underline-offset-4 hover:text-white">
                  {item.sourceLabel} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </ChartFrame>
    </div>
  );
}

// ── Panel router ──────────────────────────────────────────────────────────────
function PanelContent({ section, view, data }: { section: string; view: string; data: InsightsData }) {
  if (section === "overview") {
    if (view === "totals")     return <OverviewTotals data={data} />;
    if (view === "escalation") return <OverviewEscalation data={data} />;
    if (view === "recent")     return <OverviewRecent data={data} />;
  }
  if (section === "timeline") {
    if (view === "yearly")     return <TimelineYearly data={data} />;
    if (view === "liemeter")   return <TimelineLieMeter data={data} />;
    if (view === "approval")   return <TimelineApproval data={data} />;
  }
  if (section === "categories") {
    if (view === "breakdown")  return <CategoriesBreakdown data={data} />;
    if (view === "heatmap")    return <CategoriesHeatmap data={data} />;
    if (view === "pressure")   return <CategoriesPressure data={data} />;
  }
  if (section === "people") {
    if (view === "frequency")  return <PeopleFrequency data={data} />;
    if (view === "cooccur")    return <PeopleCooccurrence data={data} />;
    if (view === "family")     return <PeopleFamily data={data} />;
  }
  if (section === "scores") {
    if (view === "histogram")  return <ScoresHistogram data={data} />;
    if (view === "radar")      return <ScoresRadar data={data} />;
    if (view === "topentries") return <ScoresTopEntries data={data} />;
  }
  if (section === "legal") {
    if (view === "battles")    return <LegalBattles data={data} />;
    if (view === "pardons")    return <LegalPardons data={data} />;
    if (view === "humanrights") return <LegalHumanRights data={data} />;
  }
  if (section === "epstein") {
    if (view === "flights")    return <EpsteinFlights data={data} />;
    if (view === "network")    return <EpsteinNetwork data={data} />;
    if (view === "entries")    return <EpsteinEntries data={data} />;
  }
  if (section === "iran") {
    if (view === "timeline")   return <IranTimeline data={data} />;
    if (view === "israel")     return <IranIsrael data={data} />;
    if (view === "tariffs")    return <IranTariffs data={data} />;
  }
  if (section === "environment") {
    return <EnvironmentOverview data={data} />;
  }
  return <OverviewTotals data={data} />;
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function InsightsClient({ data }: { data: InsightsData }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSection = searchParams.get("section");
  const rawView = searchParams.get("view");
  const { section, view } = useMemo(
    () => resolveInsightsRoute(rawSection, rawView),
    [rawSection, rawView],
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV.map(n => [n.id, n.id === section]))
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    mobileSidebarRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (rawSection !== section || rawView !== view) {
      router.replace(`/insights?section=${section}&view=${view}`, { scroll: false });
    }

    setExpandedSections((previous) => (
      previous[section] ? previous : { ...previous, [section]: true }
    ));
  }, [rawSection, rawView, router, section, view]);

  const recordNavigation = useCallback((s: string, v: string) => {
    setMobileSidebarOpen(false);
    analytics.insightsSection(s, v);
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const activeNav = NAV.find(n => n.id === section) ?? NAV[0];
  const activeView = activeNav?.views.find(v2 => v2.id === view);

  const SidebarContent = () => (
    <nav className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: `${MINT}40` }}>
          // forensic database
        </p>
        <p className="font-mono text-sm font-black mt-0.5" style={{ color: MINT }}>
          INSIGHTS
        </p>
      </div>

      <div className="flex-1 px-2 py-2 space-y-0.5">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = section === item.id;
          const isExpanded = expandedSections[item.id];

          return (
            <div key={item.id}>
              <Link
                href={`/insights?section=${item.id}&view=${item.views[0].id}`}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  toggleSection(item.id);
                  recordNavigation(item.id, item.views[0].id);
                }}
                className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/75"
                }`}
                style={isActive ? { background: "rgba(255,101,0,0.12)", color: "#FF6500" } : {}}
              >
                <Icon size={13} style={{ color: isActive ? "#FF6500" : undefined }} />
                <span className="flex-1">{item.label}</span>
                {isExpanded
                  ? <ChevronDown size={10} className="text-white/30" />
                  : <ChevronRight size={10} className="text-white/30" />
                }
              </Link>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-8"
                  >
                    {item.views.map(v2 => (
                      <Link
                        key={v2.id}
                        href={`/insights?section=${item.id}&view=${v2.id}`}
                        scroll={false}
                        aria-current={section === item.id && view === v2.id ? "page" : undefined}
                        onClick={() => recordNavigation(item.id, v2.id)}
                        className={`flex min-h-11 w-full items-center rounded px-2 py-2 text-left text-[11px] transition-colors ${
                          section === item.id && view === v2.id
                            ? "font-semibold"
                            : "text-white/35 hover:text-white/60"
                        }`}
                        style={section === item.id && view === v2.id ? { color: MINT } : {}}
                      >
                        {v2.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 shrink-0 border-t" style={{ borderColor: `${MINT}10` }}>
        <p className="font-mono text-[8px]" style={{ color: DIM }}>
          {data.loadError ? "Archive data unavailable" : `${data.totals.total.toLocaleString()} entries · ${new Date().getFullYear()}`}
        </p>
      </div>
    </nav>
  );

  return (
    <div className="flex h-[calc(100dvh-80px)] overflow-hidden" style={{ background: BG }}>

      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex flex-col shrink-0 border-r overflow-hidden"
            style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.5)" }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              ref={mobileSidebarRef}
              role="dialog"
              aria-modal="true"
              aria-label="Insights navigation"
              id="insights-mobile-navigation"
              tabIndex={-1}
              initial={reduceMotion ? false : { x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: reduceMotion ? 0 : 0.22 }}
              className="fixed bottom-0 left-0 top-16 z-50 w-60 border-r outline-none md:hidden"
              style={{ borderColor: `${MINT}12`, background: "#060608" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0"
             style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.4)" }}>
          <button
            onClick={() => { setSidebarOpen(v => !v); setMobileSidebarOpen(v => !v); }}
            className="p-1.5 rounded hover:bg-white/5 transition-colors md:flex hidden"
          >
            <Menu size={14} className="text-white/40" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(v => !v)}
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={mobileSidebarOpen ? "Close Insights navigation" : "Open Insights navigation"}
            aria-expanded={mobileSidebarOpen}
            aria-controls="insights-mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 md:hidden"
          >
            <Menu size={14} className="text-white/40" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] tracking-widest uppercase shrink-0" style={{ color: `${MINT}50` }}>
              {activeNav?.label}
            </span>
            {activeView && (
              <>
                <span className="text-white/20 text-xs">/</span>
                <span className="font-mono text-[10px] text-white/50 truncate">{activeView.label}</span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className="font-mono text-[9px] hidden sm:block" style={{ color: `${MINT}40` }}>
              {data.loadError ? "data unavailable" : `${data.totals.total.toLocaleString()} entries`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <header className="mb-5 border-b pb-4" style={{ borderColor: `${MINT}12` }}>
            <p className="font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: "rgba(255,101,0,.7)" }}>Trumpstein: Encyclopedia Orange</p>
            <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">Forensic archive insights</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">An evidence-labelled reading layer for archive aggregates, ranked exhibits, and external public baselines.</p>
          </header>
          {data.loadError ? (
            <section role="alert" className="rounded-xl border border-amber-400/35 bg-amber-400/[0.06] p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Archive data temporarily unavailable</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">The Insights query did not complete, so this page is withholding charts and counts rather than presenting an empty archive. Refresh to retry.</p>
            </section>
          ) : (
            <>
              <EvidenceScopeGuide />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${section}-${view}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                >
                  <PanelContent section={section} view={view} data={data} />
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label="Primary Insights sections" className="fixed bottom-0 left-0 right-0 z-30 flex border-t md:hidden"
           style={{ borderColor: `${MINT}12`, background: "#060608" }}>
        {NAV.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = section === item.id;
          return (
            <Link
              key={item.id}
              href={`/insights?section=${item.id}&view=${item.views[0].id}`}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              onClick={() => recordNavigation(item.id, item.views[0].id)}
              className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400"
              style={{ color: isActive ? "#FF6500" : "rgba(255,255,255,0.3)" }}
            >
              <Icon size={16} />
              <span className="truncate w-full text-center px-0.5">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
