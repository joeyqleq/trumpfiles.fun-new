"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Search, FileText, Plane, Users, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { ExhibitFrame } from "@/components/insights/ExhibitFrame";
import { NarrativeLede } from "@/components/insights/NarrativeLede";
import { AnimatedFileIcon } from "@/components/AnimatedFileIcon";
import PageDecorations from "@/components/PageDecorations";

const PINK = "#ff0066";
const ORANGE = "#FF6500";
const MUTED = "rgba(255,255,255,0.5)";
const DARK_PINK = "#cc0052";

const ITEMS_PER_PAGE = 50;

interface FlightRecord {
  date: string;
  route: string;
  aircraft: string;
  passengers: string;
}

interface Person {
  name: string;
  role: string;
  flights: number;
  docs: number;
  emails: number;
  connection: string;
}

interface Document {
  id: string;
  title: string;
  date: string;
  type: string;
  danger: number;
  pages: number;
  status: string;
}

interface Category {
  name: string;
  count: number;
  pct: number;
}

interface EpsteinData {
  total: number;
  totalEmails: number;
  totalFlights: number;
  totalPersons: number;
  totalAccusers: number;
  categories: Category[];
  timeline: Array<{ year: number; count: number }>;
  flights: FlightRecord[];
  persons: Person[];
  topDocuments: Document[];
  sentimentBreakdown: Array<{ label: string; value: number; color: string }>;
  networkConnections: Array<{ from: string; to: string; strength: number; type: string }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/95 border border-pink-500/30 px-3 py-2 rounded-lg text-xs">
      <p className="font-mono text-pink-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground/80">
          {p.name}: <span className="font-bold" style={{ color: p.color || PINK }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
}

function StatCard({ value, label, icon: Icon, accent = PINK }: { value: string | number; label: string; icon: any; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-pink-500/20 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color: accent }} className="opacity-70" />
        <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/40 uppercase">{label}</span>
      </div>
      <div className="font-mono text-2xl md:text-3xl font-black" style={{ color: accent }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </motion.div>
  );
}

function NetworkGraph({ connections, persons }: { connections: EpsteinData["networkConnections"]; persons: Person[] }) {
  const nodes = useMemo(() => {
    const uniqueNames = new Set<string>();
    connections.forEach((c) => { uniqueNames.add(c.from); uniqueNames.add(c.to); });
    const names = Array.from(uniqueNames);
    const cx = 200, cy = 160, r = 120;
    return names.map((name, i) => {
      const angle = (i / names.length) * 2 * Math.PI - Math.PI / 2;
      return { name, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
  }, [connections]);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 400 320" className="w-full max-w-lg mx-auto" style={{ minWidth: 300 }}>
        {connections.map((conn, i) => {
          const from = nodes.find((n) => n.name === conn.from);
          const to = nodes.find((n) => n.name === conn.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={PINK}
              strokeOpacity={conn.strength / 150}
              strokeWidth={Math.max(1, conn.strength / 30)}
            />
          );
        })}
        {nodes.map((node) => (
          <g key={node.name}>
            <circle cx={node.x} cy={node.y} r={node.name === "Trump" ? 18 : 14} fill="rgba(255,0,102,0.15)" stroke={PINK} strokeWidth={node.name === "Trump" ? 2 : 1} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">
              {node.name}
            </text>
            <text x={node.x} y={node.y + 30} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace">
              {persons.find((p) => p.name.includes(node.name))?.role || ""}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function EpsteinTrumpClient({ data }: { data: EpsteinData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"documents" | "flights" | "network" | "analytics">("documents");

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return data.topDocuments;
    const q = searchQuery.toLowerCase();
    return data.topDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        doc.status.toLowerCase().includes(q)
    );
  }, [searchQuery, data.topDocuments]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / ITEMS_PER_PAGE));
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const radarData = [
    { dimension: "Sexual Abuse", value: 9.8 },
    { dimension: "Cover-Up", value: 9.5 },
    { dimension: "DOJ Complicity", value: 9.2 },
    { dimension: "Flight Evidence", value: 8.5 },
    { dimension: "Witness Testimony", value: 9.0 },
    { dimension: "Financial Ties", value: 7.8 },
    { dimension: "Political Protection", value: 9.4 },
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <PageDecorations />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <AnimatedFileIcon size={28} variant="classified" />
            <span className="font-mono text-[10px] tracking-[0.3em] px-3 py-1 rounded border border-pink-500/30 text-pink-400/80">
              CLASSIFIED DOCUMENT BROWSER
            </span>
          </div>
          <h1 className="font-mono text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase leading-none">
            The Epstein-Trump Files
          </h1>
          <p className="mt-3 font-mono text-sm text-foreground/50 max-w-3xl leading-relaxed">
            3,616 documents from the Epstein Files Transparency Act releases reference Donald Trump.
            FBI 302 interviews, court depositions, DOJ correspondence, flight logs, and survivor testimony
            — all searchable, all damning.
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10"
        >
          <StatCard value={data.total} label="Documents" icon={FileText} />
          <StatCard value={data.totalFlights} label="Flights" icon={Plane} />
          <StatCard value={data.totalPersons} label="Connected Persons" icon={Users} accent={ORANGE} />
          <StatCard value={data.totalAccusers} label="Accusers" icon={AlertTriangle} accent="#ff3333" />
          <StatCard value={data.totalEmails} label="Emails" icon={FileText} accent={ORANGE} />
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-white/5 pb-px overflow-x-auto">
          {(["documents", "flights", "network", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-all rounded-t-lg ${
                activeTab === tab
                  ? "bg-pink-500/10 text-pink-400 border-b-2 border-pink-500"
                  : "text-foreground/40 hover:text-foreground/70 hover:bg-white/[0.02]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* DOCUMENTS TAB */}
          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search documents by title, type, ID, or status..."
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-pink-500/40 focus:bg-white/[0.05] transition-all"
                />
                {searchQuery && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-pink-400/60">
                    {filteredDocs.length} results
                  </span>
                )}
              </div>

              {/* Document List */}
              <ExhibitFrame
                exhibit="EF-DOC"
                title="DOCUMENT DATABASE"
                subtitle={`Showing ${paginatedDocs.length} of ${filteredDocs.length} documents referencing Trump in the Epstein files.`}
                accent={PINK}
                classification="EFTA RELEASE / MULTI-SOURCE"
                commentary={{
                  reads: "A searchable database of every document in the Epstein Files Transparency Act releases that names Donald Trump.",
                  means: "The volume alone is damning. 3,616 documents is not a passing acquaintance. It is a deep, decades-long entanglement with a convicted sex trafficker.",
                  proves: "An innocent person does not appear in three thousand six hundred documents alongside a pedophile. The paper trail is the evidence.",
                }}
              >
                <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20">
                  {paginatedDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group cursor-pointer"
                    >
                      <AnimatedFileIcon size={16} variant="classified" className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/80 group-hover:text-foreground leading-tight">{doc.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="font-mono text-[10px] text-foreground/30">{doc.id}</span>
                          <span className="font-mono text-[10px] text-foreground/30">{doc.date}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400/60 font-mono">{doc.type}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/40 font-mono">{doc.pages}pp</span>
                        </div>
                        <p className="text-[10px] text-foreground/30 mt-1 font-mono">{doc.status}</p>
                      </div>
                      <span className="font-mono text-xs font-bold flex-shrink-0" style={{ color: doc.danger >= 9.5 ? "#ff0033" : PINK }}>
                        {doc.danger}/10
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded bg-white/5 text-foreground/50 hover:text-foreground disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="font-mono text-xs text-foreground/40">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded bg-white/5 text-foreground/50 hover:text-foreground disabled:opacity-20 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </ExhibitFrame>
            </motion.div>
          )}

          {/* FLIGHTS TAB */}
          {activeTab === "flights" && (
            <motion.div
              key="flights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <NarrativeLede
                step="01"
                title="The Lolita Express — 11 documented flights"
                text="Flight logs from Jeffrey Epstein's private aircraft show Donald Trump as a passenger 11 times between 1993 and 1998. Co-passengers include Ghislaine Maxwell, Jeffrey Epstein himself, and unidentified young women. These are primary-source pilot logs, not allegations."
              />
              <ExhibitFrame
                exhibit="EF-FLT"
                title="EPSTEIN FLIGHT LOGS — TRUMP AS PASSENGER"
                subtitle="Source: Epstein Files Transparency Act releases. Aircraft: Boeing 727 (N908JE), Gulfstream II (N212JE), Hawker HS-125 (N108JE), Cessna 421 (N988JE)."
                accent={PINK}
                classification="PRIMARY SOURCE / FLIGHT LOG"
                commentary={{
                  reads: "11 flights spanning 1993-1998 on four different Epstein aircraft. Routes: Palm Beach to Teterboro (NY), with stops in DC. Co-passengers include Maxwell on 8 of 11 flights.",
                  means: "This is not 'they met at a party once.' This is a 5-year pattern of regular private air travel together — the kind of relationship that requires explanation, not dismissal.",
                  proves: "The flight logs are contemporaneous pilot records, not retrospective testimony. They cannot be denied, explained away, or classified. Trump flew with Epstein, Maxwell, and unnamed women repeatedly.",
                }}
              >
                <div className="space-y-2">
                  {data.flights.map((flight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-pink-500/20 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center">
                        <Plane size={12} className="text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-pink-400/80 font-bold">{flight.date}</span>
                          <span className="font-mono text-[10px] text-foreground/40">{flight.aircraft}</span>
                        </div>
                        <p className="text-sm text-foreground/70 font-mono mt-0.5">{flight.route}</p>
                        <p className="text-[11px] text-foreground/50 mt-1">{flight.passengers}</p>
                      </div>
                      <span className="font-mono text-[9px] text-pink-400/40 flex-shrink-0">#{i + 1}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-pink-500/5 border border-pink-500/10">
                  <p className="font-mono text-[10px] tracking-wider text-pink-400/60 mb-2">FLIGHT PATTERN ANALYSIS</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-foreground/60">
                    <div>
                      <span className="block font-mono text-lg font-bold text-pink-400">5</span>
                      <span className="text-[10px]">Years of flights</span>
                    </div>
                    <div>
                      <span className="block font-mono text-lg font-bold text-pink-400">4</span>
                      <span className="text-[10px]">Different aircraft</span>
                    </div>
                    <div>
                      <span className="block font-mono text-lg font-bold text-pink-400">8/11</span>
                      <span className="text-[10px]">With Maxwell</span>
                    </div>
                    <div>
                      <span className="block font-mono text-lg font-bold text-pink-400">3</span>
                      <span className="text-[10px]">Unidentified females</span>
                    </div>
                  </div>
                </div>
              </ExhibitFrame>
            </motion.div>
          )}

          {/* NETWORK TAB */}
          {activeTab === "network" && (
            <motion.div
              key="network"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <NarrativeLede
                step="02"
                title="The network — who protected whom"
                text="Trump did not just know Epstein. He is connected to every major figure in the cover-up: the trafficker (Maxwell), the fixer (Acosta), the lawyer (Dershowitz), and the financier (Wexner). The network is the conspiracy."
              />
              <ExhibitFrame
                exhibit="EF-NET"
                title="TRUMP-EPSTEIN NETWORK MAP"
                subtitle="Connection strength based on document frequency, flight co-occurrence, and legal/political relationships."
                accent={PINK}
                classification="NETWORK ANALYSIS"
                commentary={{
                  reads: "A network graph showing the strength and nature of connections between Trump, Epstein, Maxwell, Dershowitz, Acosta, and Wexner.",
                  means: "Every person convicted, charged, or implicated in the Epstein trafficking operation has a direct, documented connection to Donald Trump. This is not coincidence — it is a network.",
                  proves: "Guilt by association is a fallacy. But when you are associated with EVERY member of a criminal conspiracy, and your DOJ actively covers for them, that is not association — it is participation.",
                }}
              >
                <NetworkGraph connections={data.networkConnections} persons={data.persons} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {data.persons.map((person) => (
                    <div
                      key={person.name}
                      className="p-3 rounded-lg bg-white/[0.02] border border-pink-500/10 hover:border-pink-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-mono text-xs font-bold text-pink-400/80">{person.name}</p>
                        <span className="font-mono text-[9px] text-foreground/30">{person.role}</span>
                      </div>
                      <p className="text-[11px] text-foreground/50 leading-relaxed">{person.connection}</p>
                      <div className="flex gap-3 mt-2">
                        {person.flights > 0 && <span className="font-mono text-[9px] text-foreground/40">{person.flights} flights</span>}
                        {person.docs > 0 && <span className="font-mono text-[9px] text-foreground/40">{person.docs} docs</span>}
                        {person.emails > 0 && <span className="font-mono text-[9px] text-foreground/40">{person.emails} emails</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </ExhibitFrame>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Timeline */}
              <ExhibitFrame
                exhibit="EF-TL"
                title="DOCUMENT RELEASE TIMELINE"
                subtitle="Volume of Trump-referencing documents by year of creation or release."
                accent={PINK}
                classification="TEMPORAL ANALYSIS"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PINK} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={PINK} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeOpacity={0.05} />
                    <XAxis dataKey="year" tick={{ fill: MUTED, fontSize: 10 }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" name="Documents" stroke={PINK} fill="url(#pinkGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
                  <p className="text-xs text-foreground/50">
                    <strong className="text-pink-400/80">Spike in 2005-2008:</strong> Palm Beach PD investigation, FBI involvement, Acosta plea deal.
                    <strong className="text-pink-400/80 ml-2">2019 surge:</strong> Epstein arrest, SDNY prosecution, Acosta resignation.
                    <strong className="text-pink-400/80 ml-2">2025-2026:</strong> EFTA releases under court order, DOJ forced disclosures.
                  </p>
                </div>
              </ExhibitFrame>

              {/* Category Breakdown */}
              <ExhibitFrame
                exhibit="EF-CAT"
                title="DOCUMENT CATEGORY BREAKDOWN"
                subtitle="Classification of 3,616 documents by source type."
                accent={ORANGE}
                classification="CATEGORICAL ANALYSIS"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.categories} layout="vertical" margin={{ top: 0, right: 10, left: 100, bottom: 0 }}>
                      <CartesianGrid strokeOpacity={0.05} horizontal={false} />
                      <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: MUTED, fontSize: 9 }} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Documents" fill={PINK} fillOpacity={0.7} radius={[0, 4, 4, 0]}>
                        {data.categories.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? "#ff0033" : i < 3 ? PINK : ORANGE} fillOpacity={0.7} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ExhibitFrame>

              {/* Sentiment Analysis */}
              <ExhibitFrame
                exhibit="EF-SENT"
                title="DOCUMENT SENTIMENT ANALYSIS"
                subtitle="AI classification of document tone regarding Trump's involvement."
                accent={PINK}
                classification="NLP / SENTIMENT"
                commentary={{
                  reads: "67.3% of documents are classified as damning/incriminating toward Trump. Only 8.6% contain exculpatory or defensive content.",
                  means: "Even accounting for selection bias in EFTA releases, the ratio is overwhelming. Two-thirds of all documents that mention Trump do so in a way that implicates him in criminal activity.",
                  proves: "The files themselves tell the story. When the government is forced to release documents, those documents overwhelmingly point toward guilt — not innocence.",
                }}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.sentimentBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="label"
                        strokeWidth={0}
                      >
                        {data.sentimentBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {data.sentimentBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-foreground/60 flex-1">{item.label}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ExhibitFrame>

              {/* Threat Radar */}
              <ExhibitFrame
                exhibit="EF-RAD"
                title="THREAT DIMENSION RADAR"
                subtitle="Severity of Trump-Epstein connection across evidence categories."
                accent={PINK}
                classification="MULTI-DIMENSIONAL"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: MUTED, fontSize: 9 }} />
                    <PolarRadiusAxis domain={[0, 10]} tick={{ fill: MUTED, fontSize: 8 }} />
                    <Radar name="Severity" dataKey="value" stroke={PINK} fill={PINK} fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </ExhibitFrame>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Key Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-6 rounded-xl bg-pink-500/5 border border-pink-500/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <AnimatedFileIcon size={18} variant="classified" />
            <p className="font-mono text-[10px] tracking-[0.2em] text-pink-400/60 uppercase">Key findings from Epstein files database</p>
          </div>
          <ul className="text-sm text-foreground/60 space-y-2.5 list-none">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span><strong className="text-pink-400/80">3,616 documents</strong> and <strong className="text-pink-400/80">494 emails</strong> reference Trump in the EFTA release</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>FBI 302: Woman accuses Trump of sexual abuse when she was <strong className="text-pink-400/80">13-15 years old</strong> (circa 1983) — DOJ withheld these 53 pages until March 2026</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>FBI NTOC internal email: 13-14-year-old forced to perform oral sex on Trump in NJ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Civil lawsuit: survivor recruited into trafficking ring at Mar-a-Lago <strong className="text-pink-400/80">at age 15</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Acosta told Trump transition team Epstein <strong className="text-pink-400/80">&quot;belonged to intelligence&quot;</strong> — then Trump made him Labor Secretary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Maxwell (convicted trafficker, 1,157 flights) present on 8 of 11 Trump flights — now seeking Trump clemency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Dershowitz: Trump ally, Epstein lawyer — <strong className="text-pink-400/80">45 logged flights</strong> including to Little St. James Island</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Trump called Epstein &quot;a terrific guy&quot; who likes women &quot;on the younger side&quot; (NY Magazine, 2002)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span>Trump listed in Epstein&apos;s personal &quot;black book&quot; of inner-circle contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5 flex-shrink-0">-</span>
              <span><strong className="text-pink-400/80">7 Trump family members</strong> appear in Epstein files (Donald, Ivana, Ivanka, Eric, Robert, Blaine, Melania)</span>
            </li>
          </ul>
        </motion.div>

        {/* Source Attribution */}
        <div className="mt-8 text-center">
          <p className="font-mono text-[10px] text-foreground/20 tracking-wider">
            DATA SOURCE: EPSTEIN FILES TRANSPARENCY ACT (EFTA) RELEASES 2024-2026 | FBI | DOJ | SDNY | SDFL
          </p>
        </div>
      </div>
    </main>
  );
}
