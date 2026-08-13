"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import {
  LayoutDashboard, TrendingUp, Tag, Network, Activity,
  Scale, FileText, Plane, Flame, Leaf, ChevronRight,
  ChevronDown, ZoomIn, ZoomOut, MessageSquare, X, Menu,
  BarChart2, PieChart as PieIcon,
} from "lucide-react";

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

// ── Hardcoded data ────────────────────────────────────────────────────────────
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
  { period: "Aug 2019", cost: 500 },
  { period: "Sep 2019", cost: 2000 },
  { period: "Feb 2025", cost: 830 },
  { period: "Apr 2025", cost: 2100 },
  { period: "Dec 2025", cost: 1200 },
  { period: "Feb 2026", cost: 1000 },
];

const APPROVAL_DATA = [
  { date: "Oct 2025", approval: 40 },
  { date: "Nov 2025", approval: 37 },
  { date: "Jan 2026", approval: 36 },
  { date: "Mar 2026", approval: 34 },
  { date: "May 2026", approval: 32 },
  { date: "Jun 2026", approval: 31 },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface InsightsData {
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
  categoryYearMatrix: Array<{ category: string; year: number; count: number; avg_danger: string }>;
  scoreDistribution: Array<{ score: number; count: number; label: string }>;
  familyOrbitEntries: Array<Record<string, any>>;
  topCooccurrences: Array<{ person_a: string; person_b: string; co_count: number }>;
  recentEntries: Array<Record<string, any>>;
  wordCloudByEra?: Array<Record<string, any>>;
  pressureMatrix?: Array<Record<string, any>>;
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
];

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

// Chart container with zoom + commentary beacon
function ChartFrame({
  title,
  exhibit,
  commentary,
  children,
  className = "",
}: {
  title: string;
  exhibit?: string;
  commentary?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false);

  return (
    <div className={`relative rounded-xl border bg-black/40 overflow-hidden ${className}`}
         style={{ borderColor: `${MINT}18` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: `${MINT}12` }}>
        <div className="flex items-center gap-2">
          {exhibit && (
            <span className="font-mono text-[9px] tracking-widest" style={{ color: `${MINT}50` }}>{exhibit}</span>
          )}
          <span className="font-mono text-xs font-bold text-white/70">{title}</span>
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
          For context: all other U.S. presidents in 248 years of American history have accumulated <span style={{ color: MINT }}>zero</span> criminal indictments combined. Trump alone has faced <span style={{ color: THREAT }}>91 criminal charges</span> across 4 separate cases. This is not a political opposition archive — it is a documentary record of a presidency without historical parallel.
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
      <ChartFrame title="Threat Dimensions — Corpus Average" exhibit="TF-01"
        commentary="The radar reveals a consistent pattern: authoritarianism and lawlessness are the defining traits, not insanity or absurdity. This is not an incompetent presidency — it is a calculated one. The high 'danger' axis reflects entries that directly threatened constitutional order, human life, or national security (490 entries scored maximum 10/10).">
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
    <ChartFrame title="Escalation by Era" exhibit="TF-02"
      commentary="Each era shows escalation in both volume and severity. The Second Term shows the steepest danger curve — reflecting the structural shift from opportunistic to institutionalized authoritarianism.">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data.escalation} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Bar dataKey="count" fill={MINT} fillOpacity={0.7} radius={[3,3,0,0]} name="Entries" />
          <Bar dataKey="avg_danger" fill={THREAT} fillOpacity={0.7} radius={[3,3,0,0]} name="Avg Danger" />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function OverviewRecent({ data }: { data: InsightsData }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: `${MINT}50` }}>
        // latest entries in corpus
      </p>
      {data.recentEntries.map((e: any) => (
        <a
          key={e.entry_number}
          href={`/entry/${e.entry_number}`}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
          style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}
        >
          <span className="font-mono text-[10px] shrink-0 mt-0.5" style={{ color: THREAT }}>
            {e.danger?.toFixed(1) ?? "?"}/10
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
    <ChartFrame title="Annual Volume & Danger Score" exhibit="TF-03"
      commentary="Volume spikes correlate with political inflection points: 2016 campaign launch, 2017 first term, 2020 COVID/election, 2025 second term. The danger line diverges sharply upward post-2024.">
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={data.timeline} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: DIM, fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Area yAxisId="left" dataKey="count" fill={MINT} fillOpacity={0.15} stroke={MINT} strokeWidth={2} name="Entries" />
          <Line yAxisId="right" dataKey="avg_danger" stroke={THREAT} strokeWidth={2.5} dot={false} name="Avg Danger" />
          <Line yAxisId="right" dataKey="avg_absurdity" stroke={AMBER} strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Avg Absurdity" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function TimelineLieMeter({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Disinformation Volume by Year" exhibit="TF-04"
      commentary="Entries classified as conspiracy/disinformation or containing keywords like 'lie', 'false', 'claim' spike dramatically in election years. 2020 and 2024 represent historic highs — the Big Lie machine peaks.">
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
    <ChartFrame title="Approval Rating Trend (2025–2026)" exhibit="TF-05"
      commentary="Presidential approval in freefall throughout second term. Historical note: no modern president has maintained declining approval across both first and second terms simultaneously with this trajectory.">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={APPROVAL_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke={`${MINT}12`} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 10 }} />
          <YAxis domain={[25, 50]} tick={{ fill: DIM, fontSize: 10 }} />
          <Tooltip content={<Tooltip_ />} />
          <Area dataKey="approval" name="Approval %" stroke={THREAT} fill={THREAT} fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function CategoriesBreakdown({ data }: { data: InsightsData }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <ChartFrame title="Entry Count by Category" exhibit="TF-06"
        commentary="Authoritarianism and Government Corruption dominate. Election Interference has exploded since 2020 with 4 separate indictments and the Jan 6 insurrection complex.">
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
  );
}

function CategoriesHeatmap({ data }: { data: InsightsData }) {
  const years = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
  const matrix = useMemo(() => {
    const m: Record<string, Record<number, { count: number; avg_danger: number }>> = {};
    for (const row of data.categoryYearMatrix) {
      if (!m[row.category]) m[row.category] = {};
      m[row.category][row.year] = { count: row.count, avg_danger: parseFloat(row.avg_danger) };
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
      commentary="The distribution skews right — over 40% of all entries score 7 or higher on the danger scale. This is not a normal distribution of political events; it is a record of systematic, high-intensity misconduct.">
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
      commentary="Legal scrutiny intensified in each era. Between Terms saw 91 criminal charges across 4 indictments — unprecedented in American history. The Second Term has added systematic weaponization of the DOJ against political enemies.">
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
        // trump-epstein flight log — sourced from federal court filings
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
    <ChartFrame title="Epstein Network — Key Connections" exhibit="TF-14"
      commentary="Trump flew on Epstein's planes 11 documented times (1991-1998). He appeared in Epstein's black book, was photographed with Epstein at Mar-a-Lago, and Jeffrey Epstein was a member of Mar-a-Lago. Trump later claimed he 'wasn't a fan.'">
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
      commentary="First Term set the stage: JCPOA withdrawal and Soleimani assassination. Second Term executed the full escalation — US airstrikes on nuclear facilities June 2025 represent the culmination of a decade of maximum pressure that eliminated diplomatic off-ramps.">
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
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: `${MINT}50` }}>
        // israel · netanyahu · adelson — {data.israelDedication.length} entries
      </p>
      {data.israelDedication.map((e: any) => (
        <a key={e.entry_number} href={`/entry/${e.entry_number}`}
           className="flex items-start gap-3 p-3 rounded-lg border hover:border-orange-500/30 transition-colors group"
           style={{ borderColor: `${MINT}12`, background: "rgba(0,0,0,0.3)" }}>
          <span className="font-mono text-[10px] shrink-0 mt-0.5 w-8" style={{ color: BLUE }}>
            {e.danger?.toFixed?.(1) ?? "?"}/10
          </span>
          <div>
            <p className="text-xs text-white/75 group-hover:text-white line-clamp-1">
              #{e.entry_number}: {e.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: DIM }}>{e.date_start}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function IranTariffs({ data }: { data: InsightsData }) {
  return (
    <ChartFrame title="Tariff Cost per American Household ($/yr)" exhibit="TF-16"
      commentary="The Liberation Day tariff shock of April 2025 cost the average US household an estimated $2,100/year — the largest regressive tax increase since the 1930s Smoot-Hawley Act. Markets fell 10% in two days.">
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
    </ChartFrame>
  );
}

function EnvironmentOverview({ data }: { data: InsightsData }) {
  const envEntries = data.categories.find((c: any) => c.category === "Environmental Destruction");
  return (
    <div className="space-y-4">
      {envEntries && (
        <div className="grid grid-cols-3 gap-4">
          <StatBlock value={envEntries.count?.toString()} label="Documented Rollbacks" accent="#52e07c" />
          <StatBlock value={envEntries.avg_danger?.toFixed?.(1)} label="Avg Danger" accent={THREAT} />
          <StatBlock value="85+" label="Rules Rolled Back WH1" accent={AMBER} />
        </div>
      )}
      <ChartFrame title="Environmental Category Danger" exhibit="TF-17"
        commentary="Trump's EPA rollbacks represent the most comprehensive dismantling of environmental protections in US history. The second term accelerated every metric: Paris Agreement exited again on Day 1, all offshore wind cancelled, clean energy subsidies revoked.">
        <div className="space-y-3 p-2">
          {[
            { label: "Paris Agreement: Withdrew TWICE", note: "2017 + Jan 20 2025" },
            { label: "EPA rules rolled back", note: "85+ in first term, accelerating in second" },
            { label: "Offshore wind: ALL leases cancelled", note: "$50B+ investment evaporated Jan 2025" },
            { label: "Clean Power Plan reversed", note: "Obama-era backbone of US climate policy" },
            { label: "Clean water rules gutted", note: "60% of US waterways lost protection" },
            { label: "Endangered Species Act weakened", note: "Economic costs now override species survival" },
            { label: "ANWR drilling opened", note: "Arctic National Wildlife Refuge — 1.6M acres" },
            { label: "NOAA climate division dismantled", note: "National weather + hurricane prediction at risk" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg"
                 style={{ background: "rgba(82,224,124,0.04)", borderLeft: `2px solid rgba(82,224,124,0.3)` }}>
              <div>
                <p className="text-xs font-semibold text-white/80">{item.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: DIM }}>{item.note}</p>
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
    if (view === "pressure")   return <CategoriesBreakdown data={data} />;
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

  const section = searchParams.get("section") ?? "overview";
  const view    = searchParams.get("view")    ?? "totals";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV.map(n => [n.id, n.id === section]))
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useCallback((s: string, v: string) => {
    router.push(`/insights?section=${s}&view=${v}`, { scroll: false });
    setMobileSidebarOpen(false);
  }, [router]);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const activeNav = NAV.find(n => n.id === section);
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
              <button
                onClick={() => {
                  toggleSection(item.id);
                  navigate(item.id, item.views[0].id);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs font-semibold ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/75"
                }`}
                style={isActive ? { background: `${MINT}12`, color: MINT } : {}}
              >
                <Icon size={13} style={{ color: isActive ? MINT : undefined }} />
                <span className="flex-1">{item.label}</span>
                {isExpanded
                  ? <ChevronDown size={10} className="text-white/30" />
                  : <ChevronRight size={10} className="text-white/30" />
                }
              </button>

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
                      <button
                        key={v2.id}
                        onClick={() => navigate(item.id, v2.id)}
                        className={`w-full text-left text-[11px] px-2 py-1.5 rounded transition-colors ${
                          section === item.id && view === v2.id
                            ? "font-semibold"
                            : "text-white/35 hover:text-white/60"
                        }`}
                        style={section === item.id && view === v2.id ? { color: MINT } : {}}
                      >
                        {v2.label}
                      </button>
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
          {data.totals.total.toLocaleString()} entries · {new Date().getFullYear()}
        </p>
      </div>
    </nav>
  );

  return (
    <div className="flex h-[calc(100dvh-64px)] overflow-hidden" style={{ background: BG }}>

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed left-0 top-16 bottom-0 z-50 w-60 border-r md:hidden"
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
            className="p-1.5 rounded hover:bg-white/5 transition-colors md:hidden"
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
              {data.totals.total.toLocaleString()} entries
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${view}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <PanelContent section={section} view={view} data={data} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t md:hidden flex z-30"
           style={{ borderColor: `${MINT}12`, background: "#060608" }}>
        {NAV.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id, item.views[0].id)}
              className="flex-1 flex flex-col items-center py-2 gap-0.5 text-[9px] font-mono transition-colors"
              style={{ color: isActive ? MINT : "rgba(255,255,255,0.3)" }}
            >
              <Icon size={16} />
              <span className="truncate w-full text-center px-0.5">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
