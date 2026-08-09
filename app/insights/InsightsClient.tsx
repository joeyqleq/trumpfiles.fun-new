"use client";

import { motion } from "framer-motion";
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

const ORANGE = "#FF6500";
const RED = "#FF4500";
const AMBER = "#FFA500";
const MUTED = "rgba(255,255,255,0.5)";

const EPSTEIN_NETWORK = [
  { name: "Trump", flights: 11, docs: 3616, role: "Subject" },
  { name: "Dershowitz", flights: 45, docs: 0, role: "Lawyer/Ally" },
  { name: "Maxwell", flights: 1157, docs: 0, role: "Trafficker" },
  { name: "Acosta", flights: 0, docs: 58, role: "Fixer (DOJ)" },
  { name: "Wexner", flights: 0, docs: 0, role: "Financier" },
  { name: "Staley", flights: 0, docs: 0, role: "Banker" },
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

const CATEGORY_COLORS: Record<string, string> = {
  "National Security Violations": "#ff4444",
  "Human Rights Violations": "#ff6b6b",
  "Authoritarianism": "#cc3300",
  "Government Corruption": "#ff8800",
  "Grift / Financial Exploitation": "#ffaa00",
  "Conspiracy Theories / Disinformation": "#9933ff",
  "Election Interference": "#ff3366",
  "Foreign Policy": "#0088ff",
  "Environmental Destruction": "#33cc33",
  "Press Freedom": "#66aaff",
  "Insurrection / Coup Attempts": "#ff0000",
  "Violent Rhetoric / Threats": "#cc0000",
};

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
}

function StatBlock({ value, label, accent = ORANGE }: { value: string; label: string; accent?: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-2xl md:text-4xl font-black" style={{ color: accent }}>{value}</div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase mt-1">{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/95 border border-orange-500/30 px-3 py-2 rounded-lg text-xs">
      <p className="font-mono text-orange-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground/80">
          {p.name}: <span className="font-bold" style={{ color: p.color }}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function InsightsClient({ data }: { data: InsightsData }) {
  const radarData = [
    { dimension: "Danger", value: parseFloat(String(data.radarDimensions.danger)) },
    { dimension: "Authoritarian", value: parseFloat(String(data.radarDimensions.authoritarianism)) },
    { dimension: "Lawlessness", value: parseFloat(String(data.radarDimensions.lawlessness)) },
    { dimension: "Insanity", value: parseFloat(String(data.radarDimensions.insanity)) },
    { dimension: "Absurdity", value: parseFloat(String(data.radarDimensions.absurdity)) },
    { dimension: "Credibility Risk", value: parseFloat(String(data.radarDimensions.credibility_risk)) },
    { dimension: "Impact", value: parseFloat(String(data.radarDimensions.impact_scope)) },
  ];

  return (
    <div className="min-h-screen relative">
      <PageDecorations variant="visualizer" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* HEADER */}
        <header className="text-center pb-12 border-b border-white/5 relative">
          <img
            src="/images/trump_king.png"
            alt=""
            className="absolute top-4 left-1/2 -translate-x-1/2 w-48 opacity-[0.04] pointer-events-none select-none"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[10px] tracking-[0.5em] text-orange-500/60 mb-4"
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
            Every chart below is computed from primary-source entries. This is not opinion — it is pattern recognition at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-8"
          >
            <StatBlock value={data.totals.total.toLocaleString()} label="Documented Incidents" />
            <StatBlock value={data.totals.avg_danger.toFixed(1)} label="Mean Danger Score" accent={RED} />
            <StatBlock value={data.totals.avg_auth.toFixed(1)} label="Mean Authoritarianism" accent="#cc3300" />
            <StatBlock value={`${data.totals.peak_danger.toFixed(0)}/10`} label="Peak Danger" accent="#ff0000" />
          </motion.div>
        </header>

        {/* NARRATIVE BODY */}
        <div className="space-y-6 mt-8">

          {/* 01 — THE THREAT PROFILE */}
          <NarrativeLede
            step="01"
            title="The threat profile"
            text="Before diving into chronology, understand the aggregate shape of the threat. Seven scoring dimensions reveal a subject whose behavior consistently clusters in the danger-authoritarianism-lawlessness triangle."
          />
          <ExhibitFrame
            exhibit="TF-01"
            title="AGGREGATE THREAT RADAR — ALL DIMENSIONS"
            subtitle="Average scores across all documented entries. Scale: 0 (benign) to 10 (existential)."
            accent={ORANGE}
            classification="AGGREGATE"
            commentary={{
              reads: "A seven-axis radar showing average scores across danger, authoritarianism, lawlessness, insanity, absurdity, credibility risk, and impact scope.",
              means: "The shape is consistently high across all dimensions — no single 'weakness' axis. The highest clustering is in danger and impact, indicating real-world consequence rather than mere spectacle.",
              proves: "This is not a clown. The absurdity is real, but it masks genuinely dangerous conduct across every measurable axis.",
            }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: MUTED, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
                <Radar dataKey="value" stroke={ORANGE} fill={ORANGE} fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 02 — THE ESCALATION */}
          <NarrativeLede
            step="02"
            title="The escalation curve"
            text="Track incident frequency over time. The pattern is unmistakable: each phase of power produces exponentially more documented harm than the last."
          />
          <ExhibitFrame
            exhibit="TF-02"
            title="INCIDENT VOLUME BY YEAR — 1970 TO PRESENT"
            subtitle="Count of documented entries per calendar year. Note the exponential curve post-2016."
            accent={RED}
            classification="TEMPORAL"
            commentary={{
              reads: "An area chart showing annual incident counts. Pre-2016 is near-flat; 2020 spikes; 2025-2026 explodes.",
              means: "Power amplifies misconduct. The second term produces more documented incidents per month than the entire pre-political era combined.",
              proves: "This is not nostalgia bias or media attention. The behavior scales with access to state power.",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.timeline.map(t => ({ ...t, year: String(t.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RED} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke={RED} fill="url(#dangerGrad)" strokeWidth={2} name="Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 03 — THE PLAYBOOK */}
          <NarrativeLede
            step="03"
            title="The playbook — what he does most"
            text="Categories are not equally distributed. The top three — national security violations, human rights abuses, and authoritarianism — account for nearly half of all documented incidents."
          />
          <ExhibitFrame
            exhibit="TF-03"
            title="TOP CATEGORIES BY VOLUME AND DANGER"
            subtitle="Bar height = incident count. Bar color intensity = average danger score."
            accent={AMBER}
            classification="CATEGORICAL"
            commentary={{
              reads: "A horizontal bar chart showing the 12 most frequent categories, color-coded by average danger level.",
              means: "National Security Violations leads with 657 entries and avg danger 6.9. These are not political disagreements — they are documented threats to physical safety and institutional integrity.",
              proves: "The pattern is structural, not episodic. No single scandal explains this — it is a decades-long behavioral signature.",
            }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={data.categories} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeOpacity={0.05} horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis type="category" dataKey="category" tick={{ fill: MUTED, fontSize: 9 }} width={180} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]}>
                  {data.categories.map((cat, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[cat.category] || ORANGE} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 04 — THE POWER GRAB */}
          <NarrativeLede
            step="04"
            title="The power grab — escalation by era"
            text="Split the timeline into political eras. Watch how danger, authoritarianism, and lawlessness scores climb with each step closer to unchecked power."
          />
          <ExhibitFrame
            exhibit="TF-04"
            title="THREAT ESCALATION BY POLITICAL ERA"
            subtitle="Average scores per era. Each bar group represents one phase of Trump's political journey."
            accent="#cc3300"
            classification="ERA COMPARISON"
            commentary={{
              reads: "A grouped bar chart comparing avg danger, authoritarianism, and lawlessness across five political eras.",
              means: "The Second Term shows the highest scores across all three dimensions — 6.9 danger, 6.4 authoritarianism. This exceeds even the First Term, which was already historically elevated.",
              proves: "Power without accountability produces predictable escalation. The pattern is not cyclical — it is monotonically increasing.",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.escalation} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg_danger" name="Danger" fill={RED} radius={[2, 2, 0, 0]} />
                <Bar dataKey="avg_auth" name="Authoritarianism" fill="#cc3300" radius={[2, 2, 0, 0]} />
                <Bar dataKey="avg_lawless" name="Lawlessness" fill={AMBER} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 05 — THE VICTIMS */}
          <NarrativeLede
            step="05"
            title="The human cost"
            text="Behind every data point is a policy that hurt real people. These are the highest-danger human rights violations — deportations, family separations, state violence against civilians."
          />
          <ExhibitFrame
            exhibit="TF-05"
            title="HIGHEST-DANGER HUMAN RIGHTS ENTRIES"
            subtitle="Entries scored 8+ on the danger scale within the Human Rights Violations category."
            accent="#ff6b6b"
            classification="CASE FILE"
            commentary={{
              reads: "A list of the most dangerous documented human rights violations, each verified against primary sources.",
              means: "These are not abstract policy disagreements. They include state-sanctioned killings, mass deportation operations, and systematic attacks on vulnerable populations.",
              proves: "The archive documents real human suffering caused by deliberate policy choices. This is accountability, not opinion.",
            }}
          >
            <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20">
              {data.humanRights.map((entry) => (
                <a
                  key={entry.entry_number}
                  href={`/entry/${entry.entry_number}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                >
                  <span className="font-mono text-[10px] text-red-400/60 mt-0.5 flex-shrink-0">
                    #{entry.entry_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 group-hover:text-foreground truncate">{entry.title}</p>
                    <p className="text-[10px] text-foreground/30 mt-0.5 font-mono">
                      {entry.date_start ? new Date(entry.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unknown'}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-400 flex-shrink-0">
                    {entry.danger}/10
                  </span>
                </a>
              ))}
            </div>
          </ExhibitFrame>

          {/* 06 — THE RHETORIC */}
          <NarrativeLede
            step="06"
            title="The violent rhetoric"
            text="Words matter when spoken by the most powerful person on earth. Documented threats, incitement, and insurrection-adjacent language — scored for danger and insanity."
          />
          <ExhibitFrame
            exhibit="TF-06"
            title="VIOLENT RHETORIC AND INSURRECTION ENTRIES"
            subtitle="Highest-scoring entries from 'Violent Rhetoric / Threats' and 'Insurrection / Coup Attempts' categories."
            accent="#cc0000"
            classification="RHETORIC AUDIT"
            commentary={{
              reads: "The most dangerous documented instances of violent language and insurrection-related conduct.",
              means: "From 'Fire and Fury' to the January 6 incitement, these entries trace a through-line: escalating willingness to deploy or encourage violence for personal political gain.",
              proves: "This is not 'tough talk.' It is a documented pattern of stochastic terrorism and institutional violence.",
            }}
          >
            <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20">
              {data.violentRhetoric.map((entry) => (
                <a
                  key={entry.entry_number}
                  href={`/entry/${entry.entry_number}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group"
                >
                  <span className="font-mono text-[10px] text-orange-400/60 mt-0.5 flex-shrink-0">
                    #{entry.entry_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 group-hover:text-foreground truncate">{entry.title}</p>
                    <p className="text-[10px] text-foreground/30 mt-0.5 font-mono">
                      {entry.date_start ? new Date(entry.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unknown'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="font-mono text-[10px] text-red-400">D:{entry.danger}</span>
                    <span className="font-mono text-[10px] text-purple-400">I:{entry.insanity}</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex justify-end mt-2 pr-2">
              <img
                src="/images/art/pdf_1-missile_up.png"
                alt=""
                className="w-10 opacity-15 pointer-events-none select-none rotate-45"
              />
            </div>
          </ExhibitFrame>

          {/* 07 — THE ACCELERATION */}
          <NarrativeLede
            step="07"
            title="The acceleration — it's getting worse"
            text="Year-over-year incident count since 2016. The second term isn't just bad — it's producing documented misconduct at a rate that dwarfs everything before it."
          />
          <ExhibitFrame
            exhibit="TF-07"
            title="ANNUAL INCIDENT ACCELERATION — 2016 TO PRESENT"
            subtitle="Raw count of documented entries by year. The exponential is not editorial — it's arithmetic."
            accent={ORANGE}
            classification="RATE OF CHANGE"
            commentary={{
              reads: "A bar chart of incident counts per year since 2016. 2025 and 2026 tower over all previous years.",
              means: "The second term is generating documented misconduct at 3-4x the rate of the first. This reflects both increased audacity and decreased institutional constraint.",
              proves: "The threat is accelerating, not plateauing. Each year of unchecked power produces more documented harm than the last.",
            }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.yearlyAcceleration.map(d => ({ ...d, year: String(d.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 11 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[4, 4, 0, 0]}>
                  {data.yearlyAcceleration.map((d, i) => (
                    <Cell key={i} fill={d.year >= 2025 ? RED : ORANGE} fillOpacity={d.year >= 2025 ? 0.9 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 08 — THE KEYWORD MAP */}
          <NarrativeLede
            step="08"
            title="The language of power abuse"
            text="What words recur most across 4,000+ entries? The keyword frequency map reveals the vocabulary of authoritarianism as practiced, not theorized."
          />
          <ExhibitFrame
            exhibit="TF-08"
            title="KEYWORD FREQUENCY — TOP 20 RECURRING THEMES"
            subtitle="Extracted from entry metadata. Frequency = number of entries containing this keyword."
            accent="#9933ff"
            classification="LEXICAL"
            commentary={{
              reads: "A horizontal bar chart of the 20 most frequent keywords across all entries.",
              means: "Military escalation, authoritarianism, executive overreach, and human rights violations dominate. These are not editorial labels — they are metadata tags derived from source analysis.",
              proves: "The archive's own vocabulary reveals what this presidency is about: concentration of power and disregard for human life.",
            }}
          >
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={data.topKeywords} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeOpacity={0.03} horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis type="category" dataKey="keyword" tick={{ fill: MUTED, fontSize: 9 }} width={200} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="freq" name="Frequency" fill="#9933ff" fillOpacity={0.6} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ExhibitFrame>

          {/* 09 — THE IRAN WAR */}
          <NarrativeLede
            step="09"
            title="The Iran obsession — illegal strikes tally"
            text="From assassinating Soleimani to greenlit Israeli bombardments, the documented strikes against Iran span two presidencies. The second term escalation is staggering — a 10x increase in documented incidents, most violating international law."
          />
          <ExhibitFrame
            exhibit="TF-09"
            title="IRAN-RELATED INCIDENTS BY PRESIDENTIAL ERA"
            subtitle="Entries mentioning Iran, Iranian targets, or related military operations. Grouped by political era."
            accent="#ff3366"
            classification="MILITARY / INTL LAW"
            commentary={{
              reads: "A comparison of Iran-related documented incidents across First Term vs Second Term, with average danger scores per era.",
              means: "The Second Term produced hundreds of Iran-related entries at extreme danger levels. These include direct strikes, proxy operations, and violations of international humanitarian law — documented in real time.",
              proves: "This is not 'deterrence.' It is an escalating military campaign against a sovereign nation, conducted without congressional authorization and in violation of the UN Charter.",
            }}
          >
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.iranWar.map(d => ({ ...d, avg_danger: parseFloat(d.avg_danger) }))} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeOpacity={0.05} />
                  <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 11 }} />
                  <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Incidents" fill="#ff3366" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3">
                {data.iranWar.map((era) => (
                  <div key={era.era} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                    <div className="font-mono text-lg font-bold text-red-400">{era.count}</div>
                    <div className="font-mono text-[9px] tracking-wider text-foreground/40 mt-1">{era.era}</div>
                    <div className="font-mono text-[10px] text-foreground/30 mt-0.5">avg danger: {parseFloat(era.avg_danger).toFixed(1)}</div>
                  </div>
                ))}
              </div>
              <div className="relative flex justify-between items-end mt-4 px-4">
                <img
                  src="/images/art/pdf_iran1.png"
                  alt=""
                  className="w-20 opacity-15 pointer-events-none select-none hover:opacity-40 transition-opacity duration-500"
                />
                <img
                  src="/images/art/pdf_1-missile_left.png"
                  alt=""
                  className="w-14 opacity-20 pointer-events-none select-none -rotate-12"
                />
                <img
                  src="/images/art/pdf_iran2.png"
                  alt=""
                  className="w-16 opacity-12 pointer-events-none select-none hover:opacity-35 transition-opacity duration-500"
                />
                <img
                  src="/images/art/pdf_1-missile_right.png"
                  alt=""
                  className="w-14 opacity-20 pointer-events-none select-none rotate-12"
                />
                <img
                  src="/images/art/pdf_iran3.png"
                  alt=""
                  className="w-18 opacity-15 pointer-events-none select-none hover:opacity-40 transition-opacity duration-500"
                />
              </div>
            </div>
          </ExhibitFrame>

          {/* Section break — wide image */}
          <div className="relative flex justify-center my-8">
            <DitherImage
              src="/images/art/pdf_trump_pam_melania.png"
              className="w-full max-w-md opacity-20 rounded-lg"
              pixelSize={12}
            />
          </div>

          {/* 10 — ISRAEL DEDICATION */}
          <NarrativeLede
            step="10"
            title="The Israel dedication — loyalty above country"
            text="A pattern of unconditional support for Netanyahu and Miriam Adelson's agenda, sacrificing American interests, international law, and Palestinian lives. Every major Israel decision traces back to donor relationships and personal loyalty."
          />
          <ExhibitFrame
            exhibit="TF-10"
            title="ISRAEL-LINKED ENTRIES — HIGHEST IMPACT"
            subtitle="Entries mentioning Israel, Netanyahu, or Adelson — sorted by recency. Each links to full documentation."
            accent="#0066ff"
            classification="FOREIGN LOYALTY"
            commentary={{
              reads: "The 15 most recent entries documenting Trump's Israel-related actions — from embassy moves to greenlit bombardments.",
              means: "The pattern is not 'pro-Israel policy' — it is personal fealty to Netanyahu and Adelson that overrides American strategic interests, international law, and basic human decency.",
              proves: "When a president's foreign policy consistently aligns with one foreign leader's wishes against his own country's interests, the word is not 'alliance' — it is 'capture.'",
            }}
          >
            <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20">
              {data.israelDedication.map((entry) => (
                <a
                  key={entry.entry_number}
                  href={`/entry/${entry.entry_number}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                >
                  <span className="font-mono text-[10px] text-blue-400/60 mt-0.5 flex-shrink-0">
                    #{entry.entry_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 group-hover:text-foreground truncate">{entry.title}</p>
                    <p className="text-[10px] text-foreground/30 mt-0.5 font-mono">
                      {entry.date_start ? new Date(entry.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unknown'}
                      {entry.category && <span className="ml-2 text-blue-400/40">• {entry.category}</span>}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-400 flex-shrink-0">
                    {entry.danger}/10
                  </span>
                </a>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 px-2">
              <img
                src="/images/art/pdf_flag.png"
                alt=""
                className="w-14 opacity-15 pointer-events-none select-none"
              />
              <img
                src="/images/art/pdf_3-missile_love.png"
                alt=""
                className="w-16 opacity-12 pointer-events-none select-none"
              />
            </div>
          </ExhibitFrame>

          {/* 11 — THE LIE METER */}
          <NarrativeLede
            step="11"
            title="The lie meter — documented falsehoods by year"
            text="How many documented lies, false claims, conspiracies, and disinformation campaigns per year? Spoiler: it gets worse when he has a microphone and no consequences."
          />
          <ExhibitFrame
            exhibit="TF-11"
            title="ANNUAL BULLSHIT OUTPUT — THE LIE METER"
            subtitle="Entries categorized as lies, false claims, conspiracy theories, or disinformation. Counted by year."
            accent="#9933ff"
            classification="VERACITY AUDIT"
            commentary={{
              reads: "A bar chart tracking documented lies and disinformation per year since 2015. The trend is sharply upward.",
              means: "The lie factory runs hotter in the second term. With social media amplification and no fact-checking infrastructure left, false claims propagate faster than corrections can follow.",
              proves: "This is not 'spin' or 'exaggeration.' These are documented, source-linked falsehoods — each one eroding the shared reality a democracy requires to function.",
            }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={data.lieMeter.map(d => ({ ...d, year: String(d.year) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 11 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lies" name="Documented Lies" fill="#9933ff" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="lies" stroke="#cc66ff" strokeWidth={2} dot={false} name="Trend" />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center font-mono text-xs text-purple-400/60">
              Total documented: {data.lieMeter.reduce((sum, d) => sum + d.lies, 0)} falsehoods and counting
            </p>
          </ExhibitFrame>

          {/* 12 — LEGAL BATTLES */}
          <NarrativeLede
            step="12"
            title="The legal siege — lawsuits, indictments, and convictions"
            text="No president in American history has faced this volume of legal action. Impeachments, indictments, convictions, civil fraud — the courts have spoken repeatedly, and he keeps going."
          />
          <ExhibitFrame
            exhibit="TF-12"
            title="LEGAL CONFRONTATIONS BY ERA"
            subtitle="Entries documenting lawsuits, indictments, impeachments, trials, and convictions. Grouped by political era."
            accent="#ffaa00"
            classification="JUDICIAL RECORD"
            commentary={{
              reads: "A bar chart showing legal-action-related entries across four political eras.",
              means: "The volume peaks between terms (when accountability was briefly possible) and again in the second term (when retaliatory lawfare begins). The pattern shows a subject who generates legal conflict as a byproduct of normal operations.",
              proves: "This is not 'lawfare' or 'political persecution.' It is the documented legal response to decades of documented misconduct — from tax fraud to election interference to insurrection.",
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.legalBattles} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="era" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Legal Actions" fill="#ffaa00" fillOpacity={0.75} radius={[4, 4, 0, 0]}>
                  {data.legalBattles.map((_, i) => (
                    <Cell key={i} fill={i === data.legalBattles.length - 1 ? RED : "#ffaa00"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {data.legalBattles.map((era) => (
                <div key={era.era} className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                  <div className="font-mono text-base font-bold text-amber-400">{era.count}</div>
                  <div className="font-mono text-[8px] tracking-wider text-foreground/30 uppercase">{era.era}</div>
                </div>
              ))}
            </div>
          </ExhibitFrame>

          {/* 13 — PARDONS FOR PROFIT */}
          <NarrativeLede
            step="13"
            title="Pardons for profit — clemency as a business model"
            text="Drug traffickers, money launderers, tax cheats, fraudsters, insurrectionists — all freed by presidential decree. Many paid for the privilege. The cost to the public: billions in unpaid debt, dangerous criminals returned to society, and the complete corruption of the justice system."
          />
          <ExhibitFrame
            exhibit="TF-13"
            title="THE PARDON FACTORY — CRIMINALS FREED BY DECREE"
            subtitle="Documented pardons and commutations across both terms. Each entry links to full source documentation."
            accent="#ff8800"
            classification="CORRUPTION / GRIFT"
            commentary={{
              reads: "A timeline of Trump's most significant pardons and commutations — from Jan 6 insurrectionists to international drug lords.",
              means: "This is clemency weaponized as a loyalty reward system and revenue stream. Drug-smuggling presidents, billion-dollar fraudsters, and violent criminals freed — while the public absorbs the cost of their crimes.",
              proves: "When pardons correlate with donations, political loyalty, or personal favors, the word is not 'mercy' — it is 'corruption.' The justice system becomes a subscription service for the wealthy and connected.",
            }}
          >
            <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20">
              {data.pardons.map((entry) => (
                <a
                  key={entry.entry_number}
                  href={`/entry/${entry.entry_number}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
                >
                  <span className="font-mono text-[10px] text-amber-400/60 mt-0.5 flex-shrink-0">
                    #{entry.entry_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 group-hover:text-foreground truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-foreground/30 font-mono">
                        {entry.date_start ? new Date(entry.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unknown'}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/60 font-mono">
                        {entry.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 flex-shrink-0">
                    {entry.danger}/10
                  </span>
                </a>
              ))}
            </div>
            <div className="flex justify-end pr-4 -mb-2">
              <img
                src="/images/art/pdf_criminal.png"
                alt=""
                className="w-20 opacity-15 pointer-events-none select-none hover:opacity-35 transition-opacity duration-500"
              />
            </div>
            <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <p className="font-mono text-[10px] tracking-wider text-red-400/60 mb-1">PUBLIC COST HIGHLIGHTS</p>
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

          {/* 14 — THE EPSTEIN CONNECTION */}
          <div className="relative flex justify-center my-6">
            <DitherImage
              src="/images/art/pdf_trump_ivanka.png"
              className="w-28 opacity-20 rounded-lg"
              pixelSize={10}
            />
          </div>
          <div className="flex items-center gap-2">
            <AnimatedFileIcon size={20} variant="classified" />
            <AnimatedFileIcon size={16} variant="classified" className="opacity-50" />
          </div>
          <NarrativeLede
            step="14"
            title="The Epstein connection — what he's hiding"
            text="From situation room tapes to DOJ cover-ups to FBI interviews naming Trump Tower as a recruitment ground — the documented connection between Trump and Jeffrey Epstein runs deep. His administration has actively fought to suppress these files."
          />
          <ExhibitFrame
            exhibit="TF-14"
            title="TRUMP-EPSTEIN NEXUS — DOCUMENTED ENTRIES"
            subtitle="Entries documenting the Trump-Epstein relationship, DOJ suppression efforts, and survivor testimony."
            accent="#ff0066"
            classification="SEXUAL CRIMES / COVER-UP"
            commentary={{
              reads: "The highest-danger entries documenting Trump's connection to Jeffrey Epstein — from active DOJ suppression of files to Iran strikes timed as distraction from Epstein hearings.",
              means: "The pattern is not guilt by association. It is active, ongoing suppression of evidence by the sitting president's own Justice Department — while survivors testify and judges rule the administration violated transparency law.",
              proves: "An innocent person does not deploy the DOJ to fight release of exculpatory files. The cover-up IS the evidence.",
            }}
          >
            <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20">
              {data.epsteinConnection.map((entry) => (
                <a
                  key={entry.entry_number}
                  href={`/entry/${entry.entry_number}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group"
                >
                  <span className="font-mono text-[10px] text-pink-400/60 mt-0.5 flex-shrink-0">
                    #{entry.entry_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 group-hover:text-foreground truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-foreground/30 font-mono">
                        {entry.date_start ? new Date(entry.date_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unknown'}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400/60 font-mono">
                        {entry.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-pink-400 flex-shrink-0">
                    {entry.danger}/10
                  </span>
                </a>
              ))}
            </div>
            <div className="relative flex justify-center items-end gap-6 mt-4">
              <img
                src="/images/art/pdf_jeff-bikini.png"
                alt=""
                className="w-16 opacity-12 pointer-events-none select-none hover:opacity-30 transition-opacity duration-700"
              />
              <img
                src="/images/art/pdf_epsteinyahu.png"
                alt=""
                className="w-24 opacity-15 pointer-events-none select-none"
              />
              <img
                src="/images/art/pdf_jeff-clown.png"
                alt=""
                className="w-16 opacity-12 pointer-events-none select-none hover:opacity-30 transition-opacity duration-700"
              />
            </div>
          </ExhibitFrame>

          {/* 15 — EPSTEIN FLIGHT LOGS */}
          <div className="flex items-center gap-1.5 pt-4">
            <AnimatedFileIcon size={18} variant="classified" />
            <AnimatedFileIcon size={14} variant="classified" className="opacity-40" />
            <AnimatedFileIcon size={12} variant="classified" className="opacity-25" />
          </div>
          <NarrativeLede
            step="15"
            title="The Lolita Express — 11 documented flights"
            text="Flight logs from Jeffrey Epstein's private aircraft show Donald Trump as a passenger 11 times between 1993 and 1998. Co-passengers include Ghislaine Maxwell, Jeffrey Epstein himself, and unidentified young women. These are primary-source pilot logs, not allegations."
          />
          <ExhibitFrame
            exhibit="TF-15"
            title="EPSTEIN FLIGHT LOGS — TRUMP AS PASSENGER"
            subtitle="Source: Epstein Files Transparency Act releases. Aircraft: Boeing 727 (N908JE), Gulfstream II (N212JE), Hawker HS-125 (N108JE), Cessna 421 (N988JE)."
            accent="#ff0066"
            classification="PRIMARY SOURCE / FLIGHT LOG"
            commentary={{
              reads: "11 flights spanning 1993-1998 on four different Epstein aircraft. Routes: Palm Beach ↔ Teterboro (NY), with stops in DC. Co-passengers include Maxwell on 8 of 11 flights.",
              means: "This is not 'they met at a party once.' This is a 5-year pattern of regular private air travel together — the kind of relationship that requires explanation, not dismissal.",
              proves: "The flight logs are contemporaneous pilot records, not retrospective testimony. They cannot be denied, explained away, or classified. Trump flew with Epstein, Maxwell, and unnamed women repeatedly.",
            }}
          >
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20">
              {[
                { date: "1998-07-10", route: "Teterboro → Palm Beach", aircraft: "Boeing 727", passengers: "Epstein, Maxwell, Sarah Kellen, Trump" },
                { date: "1997-12-06", route: "Teterboro → Palm Beach", aircraft: "Boeing 727", passengers: "Epstein, Maxwell, Lesley Groff, Trump" },
                { date: "1997-07-19", route: "Palm Beach → Teterboro", aircraft: "Gulfstream II", passengers: "Epstein, Trump" },
                { date: "1997-01-05", route: "Palm Beach → Newark", aircraft: "Boeing 727", passengers: "Epstein, Maxwell, Trump, Mark Epstein, Eva Dubin, Celina Dubin" },
                { date: "1995-08-13", route: "Palm Beach → Teterboro", aircraft: "Gulfstream", passengers: "Epstein, Maxwell, Trump, 'Geil Trump', unidentified 'AS'" },
                { date: "1994-05-15", route: "Palm Beach → DC → Teterboro", aircraft: "Cessna 421", passengers: "Epstein, Trump, Marla Maples, Tiffany Trump (infant), nanny" },
                { date: "1993-10-17", route: "Palm Beach → Teterboro", aircraft: "Hawker HS-125", passengers: "Epstein, Maxwell, Trump, Dawn Devito, Rob Devito" },
                { date: "1993-10-11", route: "Palm Beach → Teterboro", aircraft: "Hawker HS-125", passengers: "Epstein, Maxwell, Trump, Dawn Devito, Sophie Biddle" },
                { date: "1993-04-26", route: "Palm Beach → Teterboro", aircraft: "Hawker HS-125", passengers: "Epstein, Trump (just the two)" },
                { date: "1993-04-23", route: "Teterboro → Palm Beach", aircraft: "Hawker HS-125", passengers: "Epstein, Trump, Erin Nance Hill" },
              ].map((flight, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-pink-500/20 transition-colors">
                  <span className="font-mono text-[10px] text-pink-400/70 mt-0.5 flex-shrink-0 w-20">
                    {flight.date}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/70 font-mono">{flight.route}</p>
                    <p className="text-[10px] text-foreground/40 mt-0.5 truncate">{flight.passengers}</p>
                  </div>
                  <span className="font-mono text-[9px] text-pink-400/40 flex-shrink-0">{flight.aircraft}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {EPSTEIN_NETWORK.map((node) => (
                <div key={node.name} className="p-2.5 rounded-lg bg-white/[0.02] border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                  <p className="font-mono text-xs font-bold text-pink-400/80">{node.name}</p>
                  <p className="font-mono text-[9px] text-foreground/30 mt-0.5">{node.role}</p>
                  <div className="flex gap-3 mt-1.5">
                    {node.flights > 0 && <span className="font-mono text-[9px] text-foreground/50">{node.flights} flights</span>}
                    {node.docs > 0 && <span className="font-mono text-[9px] text-foreground/50">{node.docs} docs</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
              <p className="font-mono text-[10px] tracking-wider text-pink-400/60 mb-1">KEY FACTS FROM EPSTEIN FILES DATABASE</p>
              <ul className="text-xs text-foreground/50 space-y-1.5 list-disc list-inside">
                <li><strong className="text-pink-400/80">3,616 documents</strong> and <strong className="text-pink-400/80">494 emails</strong> reference Trump in the EFTA release</li>
                <li>FBI 302: Woman accuses Trump of sexual abuse when she was <strong className="text-pink-400/80">13-15 years old</strong> (circa 1983) — DOJ withheld these 53 pages until March 2026</li>
                <li>FBI NTOC internal email: 13-14-year-old forced to perform oral sex on Trump in NJ</li>
                <li>Civil lawsuit: survivor recruited into trafficking ring at Mar-a-Lago <strong className="text-pink-400/80">at age 15</strong></li>
                <li>Acosta told Trump transition team Epstein <strong className="text-pink-400/80">"belonged to intelligence"</strong> — then Trump made him Labor Secretary</li>
                <li>Maxwell (convicted trafficker, 1,157 flights) present on 5 of 11 Trump flights — now seeking Trump clemency</li>
                <li>Dershowitz: Trump ally, Epstein lawyer — <strong className="text-pink-400/80">45 logged flights</strong> including to Little St. James Island</li>
                <li>Trump called Epstein "a terrific guy" who likes women "on the younger side" (NY Magazine, 2002)</li>
                <li>Trump listed in Epstein's personal "black book" of inner-circle contacts</li>
                <li>7 Trump family members appear in Epstein files (Donald, Ivana, Ivanka, Eric, Robert, Blaine, Melania)</li>
              </ul>
            </div>
          </ExhibitFrame>

          {/* 16 — THE TARIFF TAX */}
          <NarrativeLede
            step="16"
            title="The tariff tax — what it costs you"
            text="Trump's tariffs are paid by American consumers, not foreign governments. Independent research confirms: each household pays $1,000-2,100 more per year. That's a tax — just one the president gets to impose without Congress."
          />
          <ExhibitFrame
            exhibit="TF-16"
            title="HOUSEHOLD TARIFF COST — THE INVISIBLE TAX"
            subtitle="Estimated annual cost per US household from Trump tariff policies. Sources: Research groups, Goldman Sachs, congressional estimates."
            accent="#ffaa00"
            classification="ECONOMIC DAMAGE"
            commentary={{
              reads: "A bar chart showing per-household tariff cost at key policy milestones from 2019 to 2026.",
              means: "The April 2025 'Liberation Day' tariffs alone cost each household $2,100/year — four times the 2019 estimate. Goldman Sachs confirmed the cost falls 'entirely on US businesses and households.'",
              proves: "This is a regressive tax on the American middle class, imposed unilaterally without congressional approval, marketed as punishing foreigners. The data shows who actually pays.",
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TARIFF_COST_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="period" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" name="Annual Cost/Household" fill={AMBER} fillOpacity={0.75} radius={[4, 4, 0, 0]}>
                  {TARIFF_COST_DATA.map((_, i) => (
                    <Cell key={i} fill={i >= 2 ? RED : AMBER} fillOpacity={i >= 4 ? 0.9 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center font-mono text-xs text-amber-400/60">
              Peak: $2,100/household/year (April 2025 "Liberation Day" tariffs)
            </p>
          </ExhibitFrame>

          {/* 17 — APPROVAL FREEFALL */}
          <NarrativeLede
            step="17"
            title="The approval freefall — even his base is leaving"
            text="Multiple independent polls confirm: Trump's second-term approval is the lowest sustained rating of any modern president. Not even Fox News polls can hide it anymore."
          />
          <ExhibitFrame
            exhibit="TF-17"
            title="APPROVAL RATING COLLAPSE — 2025 TO PRESENT"
            subtitle="Aggregated from Gallup, Pew, CNN, Marist, NBC polls. Trend: monotonically declining."
            accent="#cc3300"
            classification="PUBLIC OPINION"
            commentary={{
              reads: "A descending line chart showing approval ratings from 40% in October 2025 to 31% by June 2026.",
              means: "This is not a polling blip. Every major pollster confirms sustained decline. Fox News internal polls show erosion even among Republicans. Melania's approval hit minus-12 — lowest for any modern First Lady.",
              proves: "The American public is not fooled. Despite media consolidation, propaganda, and institutional capture — the numbers don't lie. He is historically unpopular and getting worse.",
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={APPROVAL_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeOpacity={0.05} />
                <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis domain={[25, 45]} tick={{ fill: MUTED, fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="approval" stroke="none" fill="#cc3300" fillOpacity={0.15} />
                <Line type="monotone" dataKey="approval" stroke="#cc3300" strokeWidth={2.5} dot={{ fill: "#cc3300", r: 4 }} name="Approval %" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-3 px-4 text-xs font-mono">
              <span className="text-foreground/30">Historic low: 31% (Jun 2026)</span>
              <span className="text-red-400/60">↓ 9 pts in 8 months</span>
            </div>
          </ExhibitFrame>

          {/* FOOTER */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-white/5 text-center"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/30 uppercase">
              End of brief — {data.totals.total.toLocaleString()} entries analyzed
            </p>
            <p className="mt-2 text-xs text-foreground/40 max-w-xl mx-auto">
              This narrative is generated from the same source-linked, timestamped database that powers the full catalog.
              Every claim is traceable to primary documentation.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a href="/catalog" className="text-xs text-orange-500/60 hover:text-orange-400 font-mono transition-colors">
                BROWSE CATALOG
              </a>
              <a href="/visualizer" className="text-xs text-orange-500/60 hover:text-orange-400 font-mono transition-colors">
                DATA VISUALIZER
              </a>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}
