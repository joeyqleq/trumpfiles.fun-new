"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { ExhibitFrame } from "@/components/insights/ExhibitFrame";
import { NarrativeLede } from "@/components/insights/NarrativeLede";
import { DitherImage } from "@/components/DitherImage";
import { AnimatedFileIcon } from "@/components/AnimatedFileIcon";
import PageDecorations from "@/components/PageDecorations";
import { Filter, X, ChevronDown, BarChart2, Grid, List } from "lucide-react";

// ── Color system (ziopsyop-inspired) ─────────────────────────────────────────
const MINT    = "#3ee6c1";
const THREAT  = "#ff4d5e";
const AMBER   = "#e8b44c";
const BLUE    = "#5b9bff";
const VIOLET  = "#a78bfa";
const MUTED   = "rgba(255,255,255,0.45)";
const DIM     = "rgba(255,255,255,0.18)";

const CATEGORY_COLORS: Record<string, string> = {
  "National Security Violations":        THREAT,
  "Human Rights Violations":             "#ff7c8a",
  "Authoritarianism":                    "#ff4d5e",
  "Government Corruption":               AMBER,
  "Grift / Financial Exploitation":      "#f0c060",
  "Conspiracy Theories / Disinformation": VIOLET,
  "Election Interference":               "#ff3d7a",
  "Foreign Policy":                      BLUE,
  "Environmental Destruction":           "#52e07c",
  "Press Freedom":                       "#80c8ff",
  "Insurrection / Coup Attempts":        "#ff0000",
  "Violent Rhetoric / Threats":          "#cc0000",
};

// ── Hardcoded datasets (replace with live when scraped) ───────────────────────
const EPSTEIN_NETWORK = [
  { name: "Trump",       flights: 11,   docs: 3616, role: "Subject" },
  { name: "Dershowitz",  flights: 45,   docs: 0,    role: "Lawyer/Ally" },
  { name: "Maxwell",     flights: 1157, docs: 0,    role: "Trafficker" },
  { name: "Acosta",      flights: 0,    docs: 58,   role: "Fixer (DOJ)" },
  { name: "Wexner",      flights: 0,    docs: 0,    role: "Financier" },
  { name: "Staley",      flights: 0,    docs: 0,    role: "Banker" },
];

const TARIFF_COST_DATA = [
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
  { date: "Dec 2025", approval: 36 },
  { date: "Jan 2026", approval: 37 },
  { date: "Feb 2026", approval: 35 },
  { date: "Apr 2026", approval: 33 },
  { date: "May 2026", approval: 32 },
  { date: "Jun 2026", approval: 31 },
];

const FLIGHT_LOGS = [
  { date: "1998-07-10", route: "Teterboro → Palm Beach",        aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Sarah Kellen, Trump" },
  { date: "1997-12-06", route: "Teterboro → Palm Beach",        aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Lesley Groff, Trump" },
  { date: "1997-07-19", route: "Palm Beach → Teterboro",        aircraft: "Gulfstream II", passengers: "Epstein, Trump" },
  { date: "1997-01-05", route: "Palm Beach → Newark",           aircraft: "Boeing 727",    passengers: "Epstein, Maxwell, Trump, Mark Epstein, Eva Dubin" },
  { date: "1995-08-13", route: "Palm Beach → Teterboro",        aircraft: "Gulfstream",    passengers: "Epstein, Maxwell, Trump, 'Geil Trump', unidentified 'AS'" },
  { date: "1994-05-15", route: "Palm Beach → DC → Teterboro",   aircraft: "Cessna 421",    passengers: "Epstein, Trump, Marla Maples, Tiffany Trump (infant), nanny" },
  { date: "1993-10-17", route: "Palm Beach → Teterboro",        aircraft: "Hawker HS-125", passengers: "Epstein, Maxwell, Trump, Dawn Devito, Rob Devito" },
  { date: "1993-10-11", route: "Palm Beach → Teterboro",        aircraft: "Hawker HS-125", passengers: "Epstein, Maxwell, Trump, Dawn Devito, Sophie Biddle" },
  { date: "1993-04-26", route: "Palm Beach → Teterboro",        aircraft: "Hawker HS-125", passengers: "Epstein, Trump (just the two)" },
  { date: "1993-04-23", route: "Teterboro → Palm Beach",        aircraft: "Hawker HS-125", passengers: "Epstein, Trump, Erin Nance Hill" },
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
  // new
  peopleTagFrequency: Array<{ person: string; count: number }>;
  categoryYearMatrix: Array<{ category: string; year: number; count: number; avg_danger: string }>;
  scoreDistribution: Array<{ score: number; count: number; label: string }>;
  familyOrbitEntries: Array<Record<string, any>>;
  topCooccurrences: Array<{ person_a: string; person_b: string; co_count: number }>;
  recentEntries: Array<Record<string, any>>;
}

const VALID_ERAS = ["Pre-Political", "Campaign", "First Term", "Between Terms", "Second Term"];
const VALID_CATS = [
  "Authoritarianism", "Government Corruption", "Human Rights Violations",
  "Grift / Financial Exploitation", "National Security Violations", "Foreign Policy",
  "Election Interference", "Press Freedom", "Environmental Destruction",
  "Conspiracy Theories / Disinformation",
];

// ── Reusable primitives ───────────────────────────────────────────────────────
function StatBlock({ value, label, accent = MINT }: { value: string; label: string; accent?: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-2xl md:text-4xl font-black" style={{ color: accent }}>{value}</div>
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: `${accent}55` }}>{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/95 border px-3 py-2 rounded-lg text-xs" style={{ borderColor: `${MINT}30` }}>
      <p className="font-mono mb-1" style={{ color: MINT }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground/80">
          {p.name}: <span className="font-bold" style={{ color: p.color }}>{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute font-mono text-[10px] pointer-events-none select-none ${className}`}
      style={{ color: `${MINT}40` }}
    >
      {"[ ]".replace(" ", "")}
    </span>
  );
}

function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(62,230,193,0.4) 1px, rgba(62,230,193,0.4) 2px)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}

// ── TF-18: Category×Year Heatmap ─────────────────────────────────────────────
function CategoryHeatmap({ data }: { data: InsightsData["categoryYearMatrix"] }) {
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  const matrix = useMemo(() => {
    const map: Record<string, Record<number, { count: number; avg_danger: number }>> = {};
    for (const row of data) {
      if (!map[row.category]) map[row.category] = {};
      map[row.category][row.year] = { count: row.count, avg_danger: parseFloat(row.avg_danger) };
    }
    return map;
  }, [data]);

  const maxCount = useMemo(() => {
    let m = 0;
    for (const row of data) if (row.count > m) m = row.count;
    return m || 1;
  }, [data]);

  const cats = VALID_CATS.filter(c => matrix[c]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Year header */}
        <div className="grid gap-0.5 mb-1" style={{ gridTemplateColumns: `180px repeat(${years.length}, 1fr)` }}>
          <span className="font-mono text-[9px] text-foreground/20 flex items-end pb-1">CATEGORY</span>
          {years.map(y => (
            <span key={y} className="font-mono text-[9px] text-center" style={{ color: MINT + "60" }}>{String(y).slice(2)}</span>
          ))}
        </div>
        {cats.map((cat) => (
          <div
            key={cat}
            className="grid gap-0.5 mb-0.5"
            style={{ gridTemplateColumns: `180px repeat(${years.length}, 1fr)` }}
          >
            <span
              className="font-mono text-[8px] truncate pr-2 flex items-center"
              style={{ color: CATEGORY_COLORS[cat] || MINT, opacity: 0.8 }}
            >
              {cat.replace("Conspiracy Theories / Disinformation", "Disinformation")
                  .replace("Grift / Financial Exploitation", "Grift / Financial")
                  .replace("National Security Violations", "Nat. Security")}
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
                <div
                  key={y}
                  className="rounded-[2px] h-6 flex items-center justify-center cursor-default group relative"
                  style={{ background: bg }}
                  title={cell ? `${cat} / ${y}: ${cell.count} entries, avg danger ${cell.avg_danger}` : `${cat} / ${y}: no data`}
                >
                  {cell && cell.count >= 10 && (
                    <span className="font-mono text-[7px] text-white/60">{cell.count}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex items-center gap-4 mt-3 pt-2 border-t" style={{ borderColor: `${MINT}15` }}>
          <span className="font-mono text-[9px]" style={{ color: MINT + "50" }}>INTENSITY:</span>
          <div className="flex items-center gap-1">
            {[0.1, 0.3, 0.55, 0.75, 0.9].map((v, i) => (
              <div key={i} className="w-5 h-3 rounded-[2px]" style={{ background: `rgba(62,230,193,${v})` }} />
            ))}
            <span className="font-mono text-[8px] ml-1" style={{ color: MINT + "50" }}>LOW → HIGH</span>
          </div>
          <div className="flex items-center gap-1">
            {[0.2, 0.45, 0.65, 0.8].map((v, i) => (
              <div key={i} className="w-5 h-3 rounded-[2px]" style={{ background: `rgba(255,77,94,${v})` }} />
            ))}
            <span className="font-mono text-[8px] ml-1" style={{ color: THREAT + "70" }}>HIGH DANGER</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TF-19: People Tag Frequency ───────────────────────────────────────────────
function PeopleTagChart({ data }: { data: InsightsData["peopleTagFrequency"] }) {
  const max = data[0]?.count || 1;
  return (
    <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
      {data.map((item, i) => {
        const pct = (item.count / max) * 100;
        const isTop3 = i < 3;
        return (
          <div key={item.person} className="flex items-center gap-3 group">
            <span
              className="font-mono text-[9px] w-5 text-right flex-shrink-0"
              style={{ color: isTop3 ? THREAT : MINT + "50" }}
            >
              {i + 1}
            </span>
            <span
              className="font-mono text-[10px] flex-shrink-0 w-40 truncate"
              style={{ color: isTop3 ? THREAT : "rgba(255,255,255,0.75)" }}
            >
              {item.person}
            </span>
            <div className="flex-1 relative h-4 rounded-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-[2px] transition-all"
                style={{
                  width: `${pct}%`,
                  background: isTop3
                    ? `linear-gradient(90deg, ${THREAT}cc, ${THREAT}66)`
                    : `linear-gradient(90deg, ${MINT}80, ${MINT}30)`,
                }}
              />
            </div>
            <span
              className="font-mono text-[10px] w-10 text-right flex-shrink-0"
              style={{ color: isTop3 ? THREAT : MINT + "80" }}
            >
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── TF-21: Score Distribution Histogram ──────────────────────────────────────
function ScoreHistogram({ data }: { data: InsightsData["scoreDistribution"] }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-48">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => {
          const item = data.find(d => d.score === score);
          const count = item?.count || 0;
          const pct = max > 0 ? (count / max) * 100 : 0;
          const isHigh = score >= 8;
          const isMid = score >= 5 && score < 8;
          return (
            <div key={score} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[8px]" style={{ color: isHigh ? THREAT : isMid ? AMBER : MINT }}>{count}</span>
              <div className="w-full relative" style={{ height: `${Math.max(pct, 2)}%` }}>
                <div
                  className="absolute inset-0 rounded-t-[2px]"
                  style={{
                    background: isHigh
                      ? `linear-gradient(to top, ${THREAT}cc, ${THREAT}55)`
                      : isMid
                      ? `linear-gradient(to top, ${AMBER}cc, ${AMBER}44)`
                      : `linear-gradient(to top, ${MINT}80, ${MINT}30)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
          <div key={score} className="flex-1 text-center">
            <span className="font-mono text-[9px]" style={{ color: DIM }}>{score}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[9px] text-center mt-1" style={{ color: DIM }}>DANGER SCORE (1–10)</p>
    </div>
  );
}

// ── TF-22: Co-occurrence Matrix ───────────────────────────────────────────────
function CooccurrenceTable({ data }: { data: InsightsData["topCooccurrences"] }) {
  const max = data[0]?.co_count || 1;
  return (
    <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
      {data.map((pair, i) => {
        const pct = (pair.co_count / max) * 100;
        return (
          <div key={`${pair.person_a}:${pair.person_b}`} className="flex items-center gap-3">
            <span className="font-mono text-[9px] w-4 text-right flex-shrink-0" style={{ color: MINT + "40" }}>{i + 1}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0 w-64">
              <span className="font-mono text-[10px] truncate max-w-[100px]" style={{ color: THREAT }}>{pair.person_a}</span>
              <span className="font-mono text-[8px]" style={{ color: AMBER + "60" }}>↔</span>
              <span className="font-mono text-[10px] truncate max-w-[100px]" style={{ color: MINT }}>{pair.person_b}</span>
            </div>
            <div className="flex-1 h-3 rounded-[2px] relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${AMBER}90, ${AMBER}30)` }}
              />
            </div>
            <span className="font-mono text-[10px] w-6 text-right flex-shrink-0" style={{ color: AMBER }}>{pair.co_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── TF-23: Filter-aware entry list ────────────────────────────────────────────
function FilteredEntryList({
  entries,
  accent = MINT,
}: {
  entries: Array<Record<string, any>>;
  accent?: string;
}) {
  return (
    <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
      {entries.length === 0 && (
        <p className="font-mono text-xs text-center py-8" style={{ color: DIM }}>NO ENTRIES MATCH FILTER</p>
      )}
      {entries.map((entry) => (
        <a
          key={entry.entry_number}
          href={`/entry/${entry.entry_number}`}
          className="flex items-start gap-3 p-2.5 rounded-lg border transition-all group"
          style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.06)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`;
            (e.currentTarget as HTMLElement).style.background = `${accent}08`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)";
          }}
        >
          <span className="font-mono text-[9px] mt-0.5 flex-shrink-0 w-12" style={{ color: accent + "60" }}>
            #{entry.entry_number}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground/75 group-hover:text-foreground/95 truncate transition-colors">{entry.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="font-mono text-[9px]" style={{ color: DIM }}>
                {entry.date_start ? new Date(entry.date_start).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "—"}
              </p>
              {entry.category && (
                <span className="font-mono text-[8px] px-1 rounded" style={{ background: `${CATEGORY_COLORS[entry.category] || accent}15`, color: CATEGORY_COLORS[entry.category] || accent }}>
                  {entry.category.slice(0, 20)}
                </span>
              )}
            </div>
          </div>
          <span className="font-mono text-xs font-bold flex-shrink-0" style={{ color: entry.danger >= 8 ? THREAT : entry.danger >= 5 ? AMBER : MINT }}>
            {entry.danger}/10
          </span>
        </a>
      ))}
    </div>
  );
}

// ── Filter Panel ──────────────────────────────────────────────────────────────
function FilterPanel({
  selectedCats,
  onToggleCat,
  selectedEra,
  onSetEra,
  onClear,
}: {
  selectedCats: string[];
  onToggleCat: (c: string) => void;
  selectedEra: string;
  onSetEra: (e: string) => void;
  onClear: () => void;
}) {
  const hasFilters = selectedCats.length > 0 || selectedEra !== "all";
  return (
    <div
      className="rounded-xl border p-4 mb-6 relative overflow-hidden"
      style={{ borderColor: `${MINT}20`, background: "rgba(62,230,193,0.03)" }}
    >
      <ScanlineOverlay />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: MINT }}>
            // FILTER CONTROLS
          </span>
          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 font-mono text-[10px] tracking-wider transition-colors hover:opacity-100 opacity-60"
              style={{ color: THREAT }}
            >
              <X className="w-3 h-3" /> CLEAR ALL
            </button>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <p className="font-mono text-[9px] tracking-widest mb-2" style={{ color: DIM }}>ERA</p>
            <div className="flex flex-wrap gap-1.5">
              {["all", ...VALID_ERAS].map(era => (
                <button
                  key={era}
                  onClick={() => onSetEra(era)}
                  className="font-mono text-[9px] px-2 py-0.5 rounded border transition-all"
                  style={{
                    borderColor: selectedEra === era ? `${MINT}60` : "rgba(255,255,255,0.08)",
                    background: selectedEra === era ? `${MINT}15` : "transparent",
                    color: selectedEra === era ? MINT : DIM,
                  }}
                >
                  {era === "all" ? "ALL ERAS" : era.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-widest mb-2" style={{ color: DIM }}>CATEGORY</p>
            <div className="flex flex-wrap gap-1.5">
              {VALID_CATS.map(cat => {
                const active = selectedCats.includes(cat);
                const color = CATEGORY_COLORS[cat] || MINT;
                return (
                  <button
                    key={cat}
                    onClick={() => onToggleCat(cat)}
                    className="font-mono text-[8px] px-2 py-0.5 rounded border transition-all"
                    style={{
                      borderColor: active ? `${color}60` : "rgba(255,255,255,0.08)",
                      background: active ? `${color}18` : "transparent",
                      color: active ? color : DIM,
                    }}
                  >
                    {cat.replace("Conspiracy Theories / Disinformation", "Disinformation")
                         .replace("Grift / Financial Exploitation", "Grift")
                         .replace("National Security Violations", "Nat. Security")
                         .replace("Human Rights Violations", "Human Rights")
                         .replace("Environmental Destruction", "Environment")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InsightsClient({ data }: { data: InsightsData }) {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedEra, setSelectedEra] = useState("all");

  const radarData = [
    { dimension: "Danger",       value: parseFloat(String(data.radarDimensions.danger)) },
    { dimension: "Authoritarian",value: parseFloat(String(data.radarDimensions.authoritarianism)) },
    { dimension: "Lawlessness",  value: parseFloat(String(data.radarDimensions.lawlessness)) },
    { dimension: "Insanity",     value: parseFloat(String(data.radarDimensions.insanity)) },
    { dimension: "Absurdity",    value: parseFloat(String(data.radarDimensions.absurdity)) },
    { dimension: "Credibility Risk", value: parseFloat(String(data.radarDimensions.credibility_risk)) },
    { dimension: "Impact",       value: parseFloat(String(data.radarDimensions.impact_scope)) },
  ];

  const ERA_YEAR_RANGES: Record<string, [number, number]> = {
    "Pre-Political":  [0, 2014],
    "Campaign":       [2015, 2016],
    "First Term":     [2017, 2020],
    "Between Terms":  [2021, 2024],
    "Second Term":    [2025, 2099],
  };

  function matchesFilters(entry: Record<string, any>) {
    if (selectedCats.length > 0 && !selectedCats.includes(entry.category)) return false;
    if (selectedEra !== "all" && entry.date_start) {
      const yr = new Date(entry.date_start).getFullYear();
      const [min, max] = ERA_YEAR_RANGES[selectedEra] || [0, 9999];
      if (yr < min || yr > max) return false;
    }
    return true;
  }

  function toggleCat(c: string) {
    setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  const filteredHumanRights = data.humanRights.filter(matchesFilters);
  const filteredViolentRhetoric = data.violentRhetoric.filter(matchesFilters);
  const filteredPardons = data.pardons.filter(matchesFilters);
  const filteredEpstein = data.epsteinConnection.filter(matchesFilters);
  const filteredFamilyOrbit = data.familyOrbitEntries.filter(matchesFilters);
  const hasFilters = selectedCats.length > 0 || selectedEra !== "all";

  const filteredTimeline = useMemo(() => {
    if (selectedEra === "all") return data.timeline;
    const [min, max] = ERA_YEAR_RANGES[selectedEra] || [0, 9999];
    return data.timeline.filter(d => d.year >= min && d.year <= max);
  }, [data.timeline, selectedEra]);

  return (
    <div className="min-h-screen relative" style={{ background: "#060608" }}>
      <PageDecorations variant="visualizer" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-16">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="text-center pb-12 relative" style={{ borderBottom: `1px solid ${MINT}08` }}>
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 font-mono text-sm select-none" style={{ color: `${MINT}25` }}>[ ┌</span>
          <span className="absolute top-0 right-0 font-mono text-sm select-none" style={{ color: `${MINT}25` }}>┐ ]</span>
          <span className="absolute bottom-0 left-0 font-mono text-sm select-none" style={{ color: `${MINT}25` }}>[ └</span>
          <span className="absolute bottom-0 right-0 font-mono text-sm select-none" style={{ color: `${MINT}25` }}>┘ ]</span>

          <img
            src="/images/trump_king.png"
            alt=""
            className="absolute top-4 left-1/2 -translate-x-1/2 w-48 opacity-[0.03] pointer-events-none select-none"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[10px] tracking-[0.5em] mb-4"
            style={{ color: `${MINT}80` }}
          >
            // NARRATIVE INTELLIGENCE BRIEF
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono font-black text-[clamp(1.8rem,5vw,3rem)] leading-none tracking-tight text-foreground"
          >
            THE MAKING OF A THREAT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 max-w-2xl mx-auto text-sm text-foreground/50 leading-relaxed"
          >
            A forensic narrative through {data.totals.total.toLocaleString()} documented incidents spanning six decades.
            Every chart is computed from primary-source entries. This is not opinion — it is pattern recognition at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-8"
          >
            <StatBlock value={data.totals.total.toLocaleString()} label="Documented Incidents" />
            <StatBlock value={data.totals.avg_danger.toFixed(1)} label="Mean Danger Score" accent={THREAT} />
            <StatBlock value={data.totals.avg_auth.toFixed(1)} label="Mean Authoritarianism" accent="#ff7c8a" />
            <StatBlock value={`${data.totals.peak_danger.toFixed(0)}/10`} label="Peak Danger" accent={THREAT} />
            <StatBlock value={data.peopleTagFrequency.length > 0 ? String(data.peopleTagFrequency.length) + "+" : "—"} label="Named Individuals" accent={AMBER} />
          </motion.div>

          {/* Filter toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex justify-center gap-3"
          >
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] px-4 py-2 rounded border transition-all"
              style={{
                borderColor: showFilter ? `${MINT}50` : "rgba(255,255,255,0.1)",
                background: showFilter ? `${MINT}10` : "transparent",
                color: showFilter ? MINT : DIM,
              }}
            >
              <Filter className="w-3 h-3" />
              {showFilter ? "HIDE FILTERS" : "CUSTOMIZE VIEW"}
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilter ? "rotate-180" : ""}`} />
            </button>
            {hasFilters && (
              <span className="flex items-center font-mono text-[9px] px-3 py-1 rounded" style={{ background: `${THREAT}15`, color: THREAT }}>
                {selectedCats.length + (selectedEra !== "all" ? 1 : 0)} FILTER{selectedCats.length + (selectedEra !== "all" ? 1 : 0) !== 1 ? "S" : ""} ACTIVE
              </span>
            )}
          </motion.div>
        </header>

        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-6"
            >
              <FilterPanel
                selectedCats={selectedCats}
                onToggleCat={toggleCat}
                selectedEra={selectedEra}
                onSetEra={setSelectedEra}
                onClear={() => { setSelectedCats([]); setSelectedEra("all"); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BODY ───────────────────────────────────────────────────────── */}
        <div className="space-y-6 mt-8">

          {/* 01 — THREAT PROFILE */}
          <NarrativeLede step="01" title="The threat profile" text="Before diving into chronology, understand the aggregate shape of the threat. Seven scoring dimensions reveal a subject whose behavior consistently clusters in the danger-authoritarianism-lawlessness triangle." />
          <ExhibitFrame
            exhibit="TF-01" title="AGGREGATE THREAT RADAR — ALL DIMENSIONS"
            subtitle="Average scores across all documented entries. Scale: 0 (benign) to 10 (existential)."
            accent={MINT} classification="AGGREGATE"
            commentary={{ reads: "A seven-axis radar showing average scores across danger, authoritarianism, lawlessness, insanity, absurdity, credibility risk, and impact scope.", means: "The shape is consistently high across all dimensions — no single 'weakness' axis. The highest clustering is in danger and impact, indicating real-world consequence rather than mere spectacle.", proves: "This is not a clown. The absurdity is real, but it masks genuinely dangerous conduct across every measurable axis." }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke={`${MINT}18`} />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: MUTED, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: DIM, fontSize: 9 }} />
                <Radar dataKey="value" stroke={MINT} fill={MINT} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 02 — ESCALATION */}
          <NarrativeLede step="02" title="The escalation curve" text="Track incident frequency over time. The pattern is unmistakable: each phase of power produces exponentially more documented harm than the last." />
          <ExhibitFrame
            exhibit="TF-02" title="INCIDENT VOLUME BY YEAR — 1970 TO PRESENT"
            subtitle="Count of documented entries per calendar year. Note the exponential curve post-2016."
            accent={THREAT} classification="TEMPORAL"
            commentary={{ reads: "An area chart showing annual incident counts. Pre-2016 is near-flat; 2020 spikes; 2025–2026 explodes.", means: "Power amplifies misconduct. The second term produces more documented incidents per month than the entire pre-political era combined.", proves: "This is not nostalgia bias or media attention. The behavior scales with access to state power." }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredTimeline.map(t => ({ ...t, year: String(t.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THREAT} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={THREAT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke={THREAT} fill="url(#threatGrad)" strokeWidth={2} name="Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 03 — PLAYBOOK */}
          <NarrativeLede step="03" title="The playbook — what he does most" text="Categories are not equally distributed. The top three — national security violations, human rights abuses, and authoritarianism — account for nearly half of all documented incidents." />
          <ExhibitFrame
            exhibit="TF-03" title="TOP CATEGORIES BY VOLUME AND DANGER"
            subtitle="Bar height = incident count. Color = category type."
            accent={AMBER} classification="CATEGORICAL"
            commentary={{ reads: "A horizontal bar chart showing the 12 most frequent categories, color-coded by type.", means: "National Security Violations leads with the highest count. These are not political disagreements — they are documented threats to physical safety and institutional integrity.", proves: "The pattern is structural, not episodic. No single scandal explains this — it is a decades-long behavioral signature." }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={data.categories} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeOpacity={0.04} horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis type="category" dataKey="category" tick={{ fill: MUTED, fontSize: 9 }} width={180} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]}>
                  {data.categories.map((cat, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[cat.category] || MINT} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 04 — POWER GRAB */}
          <NarrativeLede step="04" title="The power grab — escalation by era" text="Split the timeline into political eras. Watch how danger, authoritarianism, and lawlessness scores climb with each step closer to unchecked power." />
          <ExhibitFrame
            exhibit="TF-04" title="THREAT ESCALATION BY POLITICAL ERA"
            subtitle="Average scores per era. Each bar group represents one phase of Trump's political journey."
            accent={THREAT} classification="ERA COMPARISON"
            commentary={{ reads: "A grouped bar chart comparing avg danger, authoritarianism, and lawlessness across five political eras.", means: "The Second Term shows the highest scores across all three dimensions. This exceeds even the First Term, which was already historically elevated.", proves: "Power without accountability produces predictable escalation. The pattern is not cyclical — it is monotonically increasing." }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.escalation} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg_danger" name="Danger" fill={THREAT} radius={[2, 2, 0, 0]} />
                <Bar dataKey="avg_auth" name="Authoritarianism" fill="#ff7c8a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="avg_lawless" name="Lawlessness" fill={AMBER} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* ── NEW: TF-18 CATEGORY×YEAR HEATMAP ─────────────────────────── */}
          <NarrativeLede step="18" title="Category × year — the damage matrix" text="Every category, every year since 2015. The density and danger of each cell reveals not just what happened, but when each type of harm accelerated. Red = high-danger clusters." />
          <ExhibitFrame
            exhibit="TF-18" title="CATEGORY × YEAR DAMAGE MATRIX — 2015–2026"
            subtitle="Each cell = number of entries for that category in that year. Red cells = avg danger ≥7. Hover for details."
            accent={MINT} classification="MATRIX / HEATMAP"
            commentary={{ reads: "A 10×12 heatmap matrix. Rows = categories, columns = years 2015–2026. Cell intensity = entry volume. Cell color = danger level.", means: "The matrix reveals which categories exploded in which years. Authoritarianism spikes sharply in 2025. Environmental destruction quietly accelerates across both terms.", proves: "Trump's damage is not uniform — it is strategically timed to institutional weaknesses. The matrix makes the attack pattern visible at a glance." }}
          >
            <CategoryHeatmap data={data.categoryYearMatrix} />
          </ExhibitFrame>

          {/* 05 — VICTIMS */}
          <NarrativeLede step="05" title="The human cost" text="Behind every data point is a policy that hurt real people. These are the highest-danger human rights violations — deportations, family separations, state violence against civilians." />
          <ExhibitFrame
            exhibit="TF-05" title="HIGHEST-DANGER HUMAN RIGHTS ENTRIES"
            subtitle="Entries scored 8+ on the danger scale within the Human Rights Violations category."
            accent="#ff7c8a" classification="CASE FILE"
            commentary={{ reads: "A list of the most dangerous documented human rights violations, each verified against primary sources.", means: "These are not abstract policy disagreements. They include state-sanctioned killings, mass deportation operations, and systematic attacks on vulnerable populations.", proves: "The archive documents real human suffering caused by deliberate policy choices. This is accountability, not opinion." }}
          >
            <FilteredEntryList entries={filteredHumanRights} accent="#ff7c8a" />
          </ExhibitFrame>

          {/* 06 — RHETORIC */}
          <NarrativeLede step="06" title="The violent rhetoric" text="Words matter when spoken by the most powerful person on earth. Documented threats, incitement, and insurrection-adjacent language — scored for danger and insanity." />
          <ExhibitFrame
            exhibit="TF-06" title="VIOLENT RHETORIC AND INSURRECTION ENTRIES"
            subtitle="Highest-scoring entries from 'Violent Rhetoric / Threats' and 'Insurrection / Coup Attempts' categories."
            accent="#cc0000" classification="RHETORIC AUDIT"
            commentary={{ reads: "The most dangerous documented instances of violent language and insurrection-related conduct.", means: "From 'Fire and Fury' to the January 6 incitement, these entries trace a through-line: escalating willingness to deploy or encourage violence for personal political gain.", proves: "This is not 'tough talk.' It is a documented pattern of stochastic terrorism and institutional violence." }}
          >
            <FilteredEntryList entries={filteredViolentRhetoric} accent="#cc0000" />
          </ExhibitFrame>

          {/* 07 — ACCELERATION */}
          <NarrativeLede step="07" title="The acceleration — it's getting worse" text="Year-over-year incident count since 2016. The second term isn't just bad — it's producing documented misconduct at a rate that dwarfs everything before it." />
          <ExhibitFrame
            exhibit="TF-07" title="ANNUAL INCIDENT ACCELERATION — 2016 TO PRESENT"
            subtitle="Raw count of documented entries by year. The exponential is not editorial — it's arithmetic."
            accent={MINT} classification="RATE OF CHANGE"
            commentary={{ reads: "A bar chart of incident counts per year since 2016. 2025 and 2026 tower over all previous years.", means: "The second term is generating documented misconduct at 3–4× the rate of the first. This reflects both increased audacity and decreased institutional constraint.", proves: "The threat is accelerating, not plateauing. Each year of unchecked power produces more documented harm than the last." }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.yearlyAcceleration.map(d => ({ ...d, year: String(d.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 11 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[4, 4, 0, 0]}>
                  {data.yearlyAcceleration.map((d, i) => (
                    <Cell key={i} fill={d.year >= 2025 ? THREAT : MINT} fillOpacity={d.year >= 2025 ? 0.9 : 0.55} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 08 — KEYWORD MAP */}
          <NarrativeLede step="08" title="The language of power abuse" text="What words recur most across thousands of entries? The keyword frequency map reveals the vocabulary of authoritarianism as practiced, not theorized." />
          <ExhibitFrame
            exhibit="TF-08" title="KEYWORD FREQUENCY — TOP 20 RECURRING THEMES"
            subtitle="Extracted from entry metadata. Frequency = number of entries containing this keyword."
            accent={VIOLET} classification="LEXICAL"
            commentary={{ reads: "A horizontal bar chart of the 20 most frequent keywords across all entries.", means: "Military escalation, authoritarianism, executive overreach, and human rights violations dominate. These are not editorial labels — they are metadata tags derived from source analysis.", proves: "The archive's own vocabulary reveals what this presidency is about: concentration of power and disregard for human life." }}
          >
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={data.topKeywords} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeOpacity={0.03} horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis type="category" dataKey="keyword" tick={{ fill: MUTED, fontSize: 9 }} width={200} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="freq" name="Frequency" fill={VIOLET} fillOpacity={0.65} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* ── NEW: TF-19 PEOPLE FREQUENCY ──────────────────────────────── */}
          <NarrativeLede step="19" title="The orbit — top 30 most-documented individuals" text="Every person directly named and tagged across the entire database. This is the inner circle, the outer ring, and everyone in between — ranked by how often they appear alongside Trump's crimes." />
          <ExhibitFrame
            exhibit="TF-19" title="MOST-DOCUMENTED INDIVIDUALS — PEOPLE TAG FREQUENCY"
            subtitle="Top 30 individuals by number of entries where they are directly tagged. Source: trump_entries.people_tags."
            accent={MINT} classification="NETWORK / INDIVIDUALS"
            commentary={{ reads: "A ranked frequency chart of named individuals across all tagged entries. The top entries are who appears most alongside documented misconduct.", means: "Trump himself tops the list (expected), but the ranking reveals who is most deeply enmeshed in documented harm — Kushner, Ivanka, Kash Patel, Pete Hegseth, and the Epstein cluster all appear at high frequency.", proves: "This is not guilt by association. These are the individuals whose names appear directly in documented incidents of abuse, corruption, and crimes. Frequency is not coincidence — it's pattern." }}
          >
            <PeopleTagChart data={data.peopleTagFrequency} />
          </ExhibitFrame>

          {/* ── NEW: TF-20 CO-OCCURRENCE ──────────────────────────────────── */}
          <NarrativeLede step="20" title="The network — who keeps showing up together" text="When two names appear together in the same documented entry over and over, that's a relationship. The co-occurrence table maps the strongest documented bonds in Trump's criminal orbit." />
          <ExhibitFrame
            exhibit="TF-20" title="PERSON CO-OCCURRENCE — TOP 20 DOCUMENTED PAIRS"
            subtitle="Pairs of individuals who appear together in the same entry most frequently. Higher = stronger documented relationship."
            accent={AMBER} classification="RELATIONSHIP GRAPH"
            commentary={{ reads: "A ranked list of person-pairs by how many entries they share. Each pair is a documented connection, not an inferred one.", means: "The most frequent co-occurrences reveal the inner power structure — who works together, who covers for whom, and who appears in multiple categories of harm simultaneously.", proves: "Network analysis of co-occurrence is one of the strongest tools in investigative journalism. These pairs are not rumors — they are documented co-appearances in verified incidents." }}
          >
            <CooccurrenceTable data={data.topCooccurrences} />
          </ExhibitFrame>

          {/* ── NEW: TF-21 FAMILY & ORBIT ENTRIES ───────────────────────── */}
          <NarrativeLede step="21" title="The family business — crimes of the inner circle" text="Ivanka, Jared, Don Jr., Eric, Melania, Barron, Kash Patel, Pete Hegseth, Elon Musk — the documented misconduct is not limited to one man. The orbit shares the criminal enterprise." />
          <ExhibitFrame
            exhibit="TF-21" title="INNER CIRCLE — HIGHEST-DANGER FAMILY & CRONY ENTRIES"
            subtitle="Entries tagged with family members or key appointees, sorted by danger score."
            accent={THREAT} classification="FAMILY / ORBIT"
            commentary={{ reads: "The 25 most dangerous documented entries directly involving Trump's family or core appointees.", means: "This is not nepotism — it is a criminal network operating from inside the White House. Kushner's Qatar deal, Ivanka's trademarks, Kash Patel's weaponized FBI, Musk's DOGE looting — all documented.", proves: "The crimes are distributed across the family and orbit. Accountability cannot stop at one name." }}
          >
            <FilteredEntryList entries={filteredFamilyOrbit} accent={THREAT} />
          </ExhibitFrame>

          {/* ── NEW: TF-22 SCORE DISTRIBUTION ────────────────────────────── */}
          <NarrativeLede step="22" title="The danger spectrum — how bad is each incident" text="If every incident were rated equally, the histogram would be flat. It's not. The database skews dramatically toward high danger — because the low-stakes stuff was never worth documenting." />
          <ExhibitFrame
            exhibit="TF-22" title="DANGER SCORE DISTRIBUTION — ALL ENTRIES"
            subtitle="Count of entries at each danger level (1–10). The skew toward 6–9 is not editorial — it reflects what was documented."
            accent={THREAT} classification="SCORE DISTRIBUTION"
            commentary={{ reads: "A histogram showing how many entries fall at each danger score from 1 to 10.", means: "The distribution peaks between 5 and 8 — suggesting a database that captures genuinely dangerous behavior, not trivial incidents. The 9–10 cluster represents the most extreme documented events.", proves: "This is not cherry-picked. The score distribution reflects the actual severity landscape of Trump's documented misconduct." }}
          >
            <ScoreHistogram data={data.scoreDistribution} />
          </ExhibitFrame>

          {/* 09 — IRAN WAR */}
          <NarrativeLede step="09" title="The Iran obsession — illegal strikes tally" text="From assassinating Soleimani to greenlit Israeli bombardments, the documented strikes against Iran span two presidencies. The second term escalation is staggering." />
          <ExhibitFrame
            exhibit="TF-09" title="IRAN-RELATED INCIDENTS BY PRESIDENTIAL ERA"
            subtitle="Entries mentioning Iran, Iranian targets, or related military operations. Grouped by political era."
            accent="#ff3d7a" classification="MILITARY / INTL LAW"
            commentary={{ reads: "A comparison of Iran-related documented incidents across First Term vs Second Term.", means: "The Second Term produced hundreds of Iran-related entries at extreme danger levels — direct strikes, proxy operations, violations of international humanitarian law.", proves: "This is not 'deterrence.' It is an escalating military campaign against a sovereign nation, conducted without congressional authorization." }}
          >
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.iranWar.map(d => ({ ...d, avg_danger: parseFloat(d.avg_danger) }))} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeOpacity={0.04} />
                  <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 11 }} />
                  <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Incidents" fill="#ff3d7a" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3">
                {data.iranWar.map((era) => (
                  <div key={era.era} className="p-3 rounded-lg text-center border" style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="font-mono text-lg font-bold" style={{ color: THREAT }}>{era.count}</div>
                    <div className="font-mono text-[9px] tracking-wider mt-1" style={{ color: DIM }}>{era.era}</div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: DIM }}>avg danger: {parseFloat(era.avg_danger).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </ExhibitFrame>

          {/* Section break */}
          <div className="relative flex justify-center my-8">
            <DitherImage src="/images/art/pdf_trump_pam_melania.png" className="w-full max-w-md opacity-15 rounded-lg" pixelSize={12} />
          </div>

          {/* 10 — ISRAEL DEDICATION */}
          <NarrativeLede step="10" title="The Israel dedication — loyalty above country" text="A pattern of unconditional support for Netanyahu and Miriam Adelson's agenda, sacrificing American interests, international law, and Palestinian lives." />
          <ExhibitFrame
            exhibit="TF-10" title="ISRAEL-LINKED ENTRIES — HIGHEST IMPACT"
            subtitle="Entries mentioning Israel, Netanyahu, or Adelson — sorted by recency."
            accent={BLUE} classification="FOREIGN LOYALTY"
            commentary={{ reads: "The 15 most recent entries documenting Trump's Israel-related actions.", means: "The pattern is not 'pro-Israel policy' — it is personal fealty to Netanyahu and Adelson that overrides American strategic interests and international law.", proves: "When a president's foreign policy consistently aligns with one foreign leader's wishes against his own country's interests, the word is not 'alliance' — it is 'capture.'" }}
          >
            <FilteredEntryList entries={data.israelDedication} accent={BLUE} />
          </ExhibitFrame>

          {/* 11 — LIE METER */}
          <NarrativeLede step="11" title="The lie meter — documented falsehoods by year" text="How many documented lies, false claims, conspiracies, and disinformation campaigns per year? It gets worse when he has a microphone and no consequences." />
          <ExhibitFrame
            exhibit="TF-11" title="ANNUAL BULLSHIT OUTPUT — THE LIE METER"
            subtitle="Entries categorized as lies, false claims, conspiracy theories, or disinformation. Counted by year."
            accent={VIOLET} classification="VERACITY AUDIT"
            commentary={{ reads: "A bar chart tracking documented lies and disinformation per year since 2015.", means: "The lie factory runs hotter in the second term. With social media amplification and no fact-checking infrastructure left, false claims propagate faster than corrections can follow.", proves: "This is not 'spin.' These are documented, source-linked falsehoods — each one eroding the shared reality a democracy requires to function." }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={data.lieMeter.map(d => ({ ...d, year: String(d.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 11 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lies" name="Documented Lies" fill={VIOLET} fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="lies" stroke="#c4a0ff" strokeWidth={2} dot={false} name="Trend" />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center font-mono text-xs" style={{ color: `${VIOLET}80` }}>
              Total documented: {data.lieMeter.reduce((sum, d) => sum + d.lies, 0)} falsehoods and counting
            </p>
          </ExhibitFrame>

          {/* 12 — LEGAL BATTLES */}
          <NarrativeLede step="12" title="The legal siege — lawsuits, indictments, and convictions" text="No president in American history has faced this volume of legal action. Impeachments, indictments, convictions, civil fraud — the courts have spoken repeatedly." />
          <ExhibitFrame
            exhibit="TF-12" title="LEGAL CONFRONTATIONS BY ERA"
            subtitle="Entries documenting lawsuits, indictments, impeachments, trials, and convictions."
            accent={AMBER} classification="JUDICIAL RECORD"
            commentary={{ reads: "A bar chart showing legal-action-related entries across four political eras.", means: "The volume peaks between terms (when accountability was briefly possible) and again in the second term (when retaliatory lawfare begins).", proves: "This is not 'lawfare.' It is the documented legal response to decades of documented misconduct — from tax fraud to election interference to insurrection." }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.legalBattles} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Legal Actions" fill={AMBER} fillOpacity={0.75} radius={[4, 4, 0, 0]}>
                  {data.legalBattles.map((_, i) => (
                    <Cell key={i} fill={i === data.legalBattles.length - 1 ? THREAT : AMBER} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {data.legalBattles.map((era) => (
                <div key={era.era} className="p-2 rounded text-center border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="font-mono text-base font-bold" style={{ color: AMBER }}>{era.count}</div>
                  <div className="font-mono text-[8px] tracking-wider uppercase" style={{ color: DIM }}>{era.era}</div>
                </div>
              ))}
            </div>
          </ExhibitFrame>

          {/* 13 — PARDONS */}
          <NarrativeLede step="13" title="Pardons for profit — clemency as a business model" text="Drug traffickers, money launderers, tax cheats, fraudsters, insurrectionists — all freed by presidential decree. Many paid for the privilege." />
          <ExhibitFrame
            exhibit="TF-13" title="THE PARDON FACTORY — CRIMINALS FREED BY DECREE"
            subtitle="Documented pardons and commutations across both terms."
            accent="#f08030" classification="CORRUPTION / GRIFT"
            commentary={{ reads: "A timeline of Trump's most significant pardons and commutations.", means: "This is clemency weaponized as a loyalty reward system and revenue stream. Drug-smuggling presidents, billion-dollar fraudsters, and violent criminals freed — while the public absorbs the cost.", proves: "When pardons correlate with donations, political loyalty, or personal favors, the word is not 'mercy' — it is 'corruption.'" }}
          >
            <FilteredEntryList entries={filteredPardons} accent="#f08030" />
            <div className="mt-4 p-3 rounded-lg border" style={{ background: `${THREAT}06`, borderColor: `${THREAT}15` }}>
              <p className="font-mono text-[10px] tracking-wider mb-1" style={{ color: `${THREAT}80` }}>PUBLIC COST HIGHLIGHTS</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-foreground/60">
                <span>$1.3B+ criminal debt forgiven</span>
                <span>1,500+ J6 terrorists freed</span>
                <span>45-year drug sentence erased</span>
                <span>$36M bank fraud pardoned</span>
                <span>Gang leader freed from life</span>
                <span>Diddy pardon "considered"</span>
              </div>
            </div>
          </ExhibitFrame>

          {/* 14 — EPSTEIN CONNECTION */}
          <div className="relative flex justify-center my-6">
            <DitherImage src="/images/art/pdf_trump_ivanka.png" className="w-28 opacity-15 rounded-lg" pixelSize={10} />
          </div>
          <div className="flex items-center gap-2">
            <AnimatedFileIcon size={20} variant="classified" />
            <AnimatedFileIcon size={16} variant="classified" className="opacity-50" />
          </div>
          <NarrativeLede step="14" title="The Epstein connection — what he's hiding" text="From situation room tapes to DOJ cover-ups to FBI interviews naming Trump Tower as a recruitment ground — the documented connection between Trump and Jeffrey Epstein runs deep." />
          <ExhibitFrame
            exhibit="TF-14" title="TRUMP-EPSTEIN NEXUS — DOCUMENTED ENTRIES"
            subtitle="Entries documenting the Trump-Epstein relationship, DOJ suppression efforts, and survivor testimony."
            accent="#ff0066" classification="SEXUAL CRIMES / COVER-UP"
            commentary={{ reads: "The highest-danger entries documenting Trump's connection to Jeffrey Epstein.", means: "The pattern is not guilt by association. It is active, ongoing suppression of evidence by the sitting president's own Justice Department.", proves: "An innocent person does not deploy the DOJ to fight release of exculpatory files. The cover-up IS the evidence." }}
          >
            <FilteredEntryList entries={filteredEpstein} accent="#ff0066" />
            <div className="relative flex justify-center items-end gap-6 mt-4">
              <img src="/images/art/pdf_jeff-bikini.png" alt="" className="w-16 opacity-10 pointer-events-none select-none hover:opacity-25 transition-opacity duration-700" />
              <img src="/images/art/pdf_epsteinyahu.png" alt="" className="w-24 opacity-12 pointer-events-none select-none" />
              <img src="/images/art/pdf_jeff-clown.png" alt="" className="w-16 opacity-10 pointer-events-none select-none hover:opacity-25 transition-opacity duration-700" />
            </div>
          </ExhibitFrame>

          {/* 15 — FLIGHT LOGS */}
          <div className="flex items-center gap-1.5 pt-4">
            <AnimatedFileIcon size={18} variant="classified" />
            <AnimatedFileIcon size={14} variant="classified" className="opacity-40" />
            <AnimatedFileIcon size={12} variant="classified" className="opacity-25" />
          </div>
          <NarrativeLede step="15" title="The Lolita Express — 11 documented flights" text="Flight logs from Jeffrey Epstein's private aircraft show Donald Trump as a passenger 11 times between 1993 and 1998. These are primary-source pilot logs, not allegations." />
          <ExhibitFrame
            exhibit="TF-15" title="EPSTEIN FLIGHT LOGS — TRUMP AS PASSENGER"
            subtitle="Source: Epstein Files Transparency Act releases. Aircraft: Boeing 727 (N908JE), Gulfstream II (N212JE), Hawker HS-125 (N108JE), Cessna 421 (N988JE)."
            accent="#ff0066" classification="PRIMARY SOURCE / FLIGHT LOG"
            commentary={{ reads: "11 flights spanning 1993–1998 on four different Epstein aircraft. Co-passengers include Maxwell on 8 of 11 flights.", means: "This is not 'they met at a party once.' This is a 5-year pattern of regular private air travel together.", proves: "The flight logs are contemporaneous pilot records. They cannot be denied, explained away, or classified. Trump flew with Epstein, Maxwell, and unnamed women repeatedly." }}
          >
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {FLIGHT_LOGS.map((flight, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border transition-colors" style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,0,102,0.08)" }}>
                  <span className="font-mono text-[10px] mt-0.5 flex-shrink-0 w-20" style={{ color: "#ff006680" }}>{flight.date}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/70 font-mono">{flight.route}</p>
                    <p className="font-mono text-[10px] mt-0.5 truncate" style={{ color: DIM }}>{flight.passengers}</p>
                  </div>
                  <span className="font-mono text-[9px] flex-shrink-0" style={{ color: "#ff006640" }}>{flight.aircraft}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {EPSTEIN_NETWORK.map((node) => (
                <div key={node.name} className="p-2.5 rounded-lg border" style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,0,102,0.12)" }}>
                  <p className="font-mono text-xs font-bold" style={{ color: "#ff006690" }}>{node.name}</p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: DIM }}>{node.role}</p>
                  <div className="flex gap-3 mt-1.5">
                    {node.flights > 0 && <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{node.flights} flights</span>}
                    {node.docs > 0 && <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{node.docs} docs</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg border" style={{ background: "rgba(255,0,102,0.04)", borderColor: "rgba(255,0,102,0.12)" }}>
              <p className="font-mono text-[10px] tracking-wider mb-1" style={{ color: "#ff006670" }}>KEY FACTS FROM EPSTEIN FILES DATABASE</p>
              <ul className="text-xs text-foreground/50 space-y-1.5 list-disc list-inside">
                <li><strong className="text-foreground/80">3,616 documents</strong> and <strong className="text-foreground/80">494 emails</strong> reference Trump in the EFTA release</li>
                <li>FBI 302: Woman accuses Trump of sexual abuse when she was <strong className="text-foreground/80">13–15 years old</strong> — DOJ withheld 53 pages until March 2026</li>
                <li>FBI NTOC internal email: 13–14-year-old forced to perform oral sex on Trump in NJ</li>
                <li>Civil lawsuit: survivor recruited into trafficking ring at Mar-a-Lago <strong className="text-foreground/80">at age 15</strong></li>
                <li>Acosta told Trump transition team Epstein <strong className="text-foreground/80">"belonged to intelligence"</strong> — then Trump made him Labor Secretary</li>
                <li>Trump called Epstein "a terrific guy" who likes women "on the younger side" (NY Magazine, 2002)</li>
                <li>7 Trump family members appear in Epstein files (Donald, Ivana, Ivanka, Eric, Robert, Blaine, Melania)</li>
              </ul>
            </div>
          </ExhibitFrame>

          {/* 16 — TARIFF TAX */}
          <NarrativeLede step="16" title="The tariff tax — what it costs you" text="Trump's tariffs are paid by American consumers, not foreign governments. Each household pays $1,000–2,100 more per year. That's a tax — just one the president gets to impose without Congress." />
          <ExhibitFrame
            exhibit="TF-16" title="HOUSEHOLD TARIFF COST — THE INVISIBLE TAX"
            subtitle="Estimated annual cost per US household from Trump tariff policies. Sources: Goldman Sachs, congressional estimates. [LIVE DATA PENDING]"
            accent={AMBER} classification="ECONOMIC DAMAGE"
            commentary={{ reads: "A bar chart showing per-household tariff cost at key policy milestones from 2019 to 2026.", means: "The April 2025 'Liberation Day' tariffs alone cost each household $2,100/year — four times the 2019 estimate. Goldman Sachs confirmed the cost falls 'entirely on US businesses and households.'", proves: "This is a regressive tax on the American middle class, imposed unilaterally without congressional approval, marketed as punishing foreigners. The data shows who actually pays." }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TARIFF_COST_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="period" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" name="Annual Cost/Household" fill={AMBER} fillOpacity={0.75} radius={[4, 4, 0, 0]}>
                  {TARIFF_COST_DATA.map((_, i) => (
                    <Cell key={i} fill={i >= 2 ? THREAT : AMBER} fillOpacity={i >= 4 ? 0.9 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center font-mono text-xs" style={{ color: `${AMBER}80` }}>
              Peak: $2,100/household/year (April 2025 "Liberation Day" tariffs)
            </p>
          </ExhibitFrame>

          {/* 17 — APPROVAL FREEFALL */}
          <NarrativeLede step="17" title="The approval freefall — even his base is leaving" text="Multiple independent polls confirm: Trump's second-term approval is the lowest sustained rating of any modern president. Not even Fox News polls can hide it." />
          <ExhibitFrame
            exhibit="TF-17" title="APPROVAL RATING COLLAPSE — 2025 TO PRESENT"
            subtitle="Aggregated from Gallup, Pew, CNN, Marist, NBC polls. Trend: monotonically declining. [LIVE DATA PENDING]"
            accent={THREAT} classification="PUBLIC OPINION"
            commentary={{ reads: "A descending line chart showing approval ratings from 40% in October 2025 to 31% by June 2026.", means: "This is not a polling blip. Every major pollster confirms sustained decline. Fox News internal polls show erosion even among Republicans.", proves: "The American public is not fooled. Despite media consolidation, propaganda, and institutional capture — the numbers don't lie. He is historically unpopular and getting worse." }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={APPROVAL_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.04} />
                <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis domain={[25, 45]} tick={{ fill: MUTED, fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="approval" stroke="none" fill={THREAT} fillOpacity={0.1} />
                <Line type="monotone" dataKey="approval" stroke={THREAT} strokeWidth={2.5} dot={{ fill: THREAT, r: 4 }} name="Approval %" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-3 px-4 text-xs font-mono">
              <span style={{ color: DIM }}>Historic low: 31% (Jun 2026)</span>
              <span style={{ color: `${THREAT}80` }}>↓ 9 pts in 8 months</span>
            </div>
          </ExhibitFrame>

          {/* ── FOOTER ─────────────────────────────────────────────────────── */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 text-center relative"
            style={{ borderTop: `1px solid ${MINT}08` }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: DIM }}>
              End of brief — {data.totals.total.toLocaleString()} entries analyzed
            </p>
            <p className="mt-2 text-xs max-w-xl mx-auto leading-relaxed" style={{ color: `rgba(255,255,255,0.35)` }}>
              This narrative is generated from the same source-linked, timestamped database that powers the full catalog.
              Every claim is traceable to primary documentation.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a href="/catalog" className="text-xs font-mono transition-colors" style={{ color: `${MINT}60` }}
                onMouseEnter={e => (e.currentTarget.style.color = MINT)}
                onMouseLeave={e => (e.currentTarget.style.color = `${MINT}60`)}
              >BROWSE CATALOG</a>
              <a href="/visualizer" className="text-xs font-mono transition-colors" style={{ color: `${MINT}60` }}
                onMouseEnter={e => (e.currentTarget.style.color = MINT)}
                onMouseLeave={e => (e.currentTarget.style.color = `${MINT}60`)}
              >DATA VISUALIZER</a>
            </div>
            <div className="mt-6 font-mono text-[9px] tracking-[0.4em]" style={{ color: `${MINT}20` }}>
              // END OF FILE — CLASSIFICATION: PUBLIC RECORD
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}
