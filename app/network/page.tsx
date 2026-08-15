"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ZoomIn, ZoomOut, RefreshCw, Users, Network, AlertTriangle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  type: "person" | "event";
  events?: number;
  avg_danger?: number;
  size?: number;
  categories?: string[];
  title?: string;
  danger?: number;
  category?: string;
  entry_number?: number;
  connections?: number;
  // computed positions
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface TopPersonSummary {
  name: string;
  events: number;
  avg_danger?: number;
  categories?: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  avg_danger?: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  topPeople?: TopPersonSummary[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ORANGE  = "#FF6500";
const THREAT  = "#ff4d5e";
const MINT    = "#3ee6c1";
const AMBER   = "#e8b44c";
const VIOLET  = "#a78bfa";
const BG      = "#060608";

const ANALYSES: Record<string, string> = {
  community: `Co-occurrence network reveals **structural clusters** — tight groups who appear together repeatedly in documented scandals. Dense connections between nodes indicate systematic coordination, not coincidence. Red-weighted edges signal high-danger co-appearances.`,
  top: `Force graph of Trump's inner orbit. Node **size** = volume of documented scandals. **Color intensity** = average danger score. Hover any node to see their full scandal profile. Edges show direct documented co-involvement in the same events.`,
  person: `Ego network showing all events connected to this individual and their co-conspirators within those events. Sorted by danger score. This maps one person's full documented footprint in the Trump scandal universe.`,
};

// ── Force-directed layout (simple physics sim, no D3 dep) ────────────────────

function runForceLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const nodeMap = new Map(nodes.map(n => [n.id, { ...n, x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0 }]));
  const iterations = 200;
  const k = Math.sqrt((width * height) / nodes.length) * 0.8;

  for (let iter = 0; iter < iterations; iter++) {
    const damping = 0.9 - iter / iterations * 0.4;

    // Repulsion between all nodes
    const nodeArr = Array.from(nodeMap.values());
    for (let i = 0; i < nodeArr.length; i++) {
      for (let j = i + 1; j < nodeArr.length; j++) {
        const a = nodeArr[i], b = nodeArr[j];
        const dx = a.x! - b.x!;
        const dy = a.y! - b.y!;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (k * k) / dist;
        const fx = (dx / dist) * force * 0.1;
        const fy = (dy / dist) * force * 0.1;
        a.vx! += fx; a.vy! += fy;
        b.vx! -= fx; b.vy! -= fy;
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const a = nodeMap.get(edge.source);
      const b = nodeMap.get(edge.target);
      if (!a || !b) continue;
      const dx = b.x! - a.x!;
      const dy = b.y! - a.y!;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const w = Math.sqrt(edge.weight ?? 1);
      const force = (dist * dist) / k * 0.05 * w;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx! += fx; a.vy! += fy;
      b.vx! -= fx; b.vy! -= fy;
    }

    // Apply + center gravity + bounds
    for (const n of nodeMap.values()) {
      n.vx! *= damping;
      n.vy! *= damping;
      // Gravity towards center
      n.vx! += (width / 2 - n.x!) * 0.003;
      n.vy! += (height / 2 - n.y!) * 0.003;
      n.x! = Math.max(40, Math.min(width - 40, n.x! + n.vx!));
      n.y! = Math.max(40, Math.min(height - 40, n.y! + n.vy!));
    }
  }

  return nodes.map(n => ({ ...nodeMap.get(n.id)! }));
}

// ── Danger color ──────────────────────────────────────────────────────────────

function dangerColor(d?: number) {
  if (!d) return MINT;
  if (d >= 9) return THREAT;
  if (d >= 7) return AMBER;
  if (d >= 5) return ORANGE;
  return MINT;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NetworkPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<"top" | "community" | "person">("community");
  const [searchPerson, setSearchPerson] = useState("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [layoutNodes, setLayoutNodes] = useState<GraphNode[]>([]);

  const W = 900, H = 600;

  const fetchGraph = useCallback(async (m: string, person?: string) => {
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const url = `/api/network?mode=${m}${person ? `&person=${encodeURIComponent(person)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data: GraphData = await res.json();
      setGraphData(data);
      // Run force layout
      const laid = runForceLayout(data.nodes, data.edges, W, H);
      setLayoutNodes(laid);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGraph("community"); }, [fetchGraph]);

  const handleModeChange = (m: "top" | "community" | "person") => {
    setMode(m);
    if (m !== "person") fetchGraph(m);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPerson.trim()) {
      setMode("person");
      fetchGraph("person", searchPerson.trim());
    }
  };

  // SVG pan/zoom
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(".node")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: dragStart.current.panX + e.clientX - dragStart.current.x, y: dragStart.current.panY + e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => setIsDragging(false);
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001))); };

  const nodeMap = new Map(layoutNodes.map(n => [n.id, n]));

  return (
    <div className="min-h-screen text-white" style={{ background: BG, fontFamily: "var(--font-outfit)" }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ borderColor: `${ORANGE}20`, background: "rgba(0,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "var(--font-arctic-guardian-grad)", color: ORANGE }}>
              CONSPIRACY NETWORK
            </h1>
            <p className="text-xs text-white/40 mt-0.5">
              {graphData?.nodes.length ?? 0} nodes · {graphData?.edges.length ?? 0} edges · from Neo4j relationship graph
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2">
            {(["community", "top", "person"] as const).map(m => (
              <button key={m} onClick={() => handleModeChange(m)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: mode === m ? `${ORANGE}25` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${mode === m ? ORANGE : "rgba(255,255,255,0.1)"}`,
                  color: mode === m ? ORANGE : "rgba(255,255,255,0.5)",
                }}>
                {m === "community" ? "Co-Conspirators" : m === "top" ? "Power Network" : "Person Ego"}
              </button>
            ))}
          </div>

          {/* Person search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={searchPerson}
              onChange={e => setSearchPerson(e.target.value)}
              placeholder="Search person…"
              className="rounded-lg px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-orange-500 w-36"
            />
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs transition-colors">
              <Search size={12} />
            </button>
          </form>

          {/* Controls */}
          <div className="flex gap-1.5">
            <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 transition-colors"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 transition-colors"><ZoomOut size={14} /></button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); fetchGraph(mode, mode === "person" ? searchPerson : undefined); }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 transition-colors"><RefreshCw size={14} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Graph */}
        <div className="lg:col-span-3">
          {/* Analysis banner */}
          <div className="mb-3 px-4 py-3 rounded-xl text-xs leading-relaxed" style={{ background: `${ORANGE}08`, border: `1px solid ${ORANGE}20`, color: "rgba(255,255,255,0.6)" }}>
            <span className="font-mono text-[10px] mr-2" style={{ color: `${ORANGE}70` }}>ANALYSIS //</span>
            {ANALYSES[mode]}
          </div>

          <div className="rounded-xl overflow-hidden border relative" style={{ borderColor: `${ORANGE}20`, background: "rgba(0,0,0,0.4)" }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
                <div className="flex items-center gap-3 text-sm" style={{ color: ORANGE }}>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${ORANGE}40`, borderTopColor: ORANGE }} />
                  Running force layout…
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center p-6">
                  <AlertTriangle size={24} className="mx-auto mb-2" style={{ color: THREAT }} />
                  <p className="text-xs text-white/50">{error}</p>
                </div>
              </div>
            )}

            <svg
              ref={svgRef}
              width="100%"
              viewBox={`0 0 ${W} ${H}`}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onWheel={onWheel}
            >
              <defs>
                <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0a0a0f" />
                  <stop offset="100%" stopColor="#060608" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="node-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect width={W} height={H} fill="url(#bg-grad)" />

              {/* Grid lines */}
              <g opacity="0.05">
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={`h${i}`} x1={0} y1={H / 10 * i} x2={W} y2={H / 10 * i} stroke={ORANGE} strokeWidth={0.5} />
                ))}
                {Array.from({ length: 15 }, (_, i) => (
                  <line key={`v${i}`} x1={W / 15 * i} y1={0} x2={W / 15 * i} y2={H} stroke={ORANGE} strokeWidth={0.5} />
                ))}
              </g>

              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Edges */}
                {graphData?.edges.map((edge, i) => {
                  const s = nodeMap.get(edge.source);
                  const t = nodeMap.get(edge.target);
                  if (!s?.x || !t?.x) return null;
                  const w = edge.weight ?? 1;
                  const color = dangerColor(edge.avg_danger);
                  const isHovered = hoveredEdge === edge;
                  return (
                    <line key={i}
                      x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                      stroke={color}
                      strokeWidth={isHovered ? 2.5 : Math.min(3, 0.5 + w * 0.15)}
                      strokeOpacity={isHovered ? 0.9 : 0.2 + Math.min(0.4, w * 0.05)}
                      onMouseEnter={() => setHoveredEdge(edge)}
                      onMouseLeave={() => setHoveredEdge(null)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}

                {/* Nodes */}
                {layoutNodes.map(node => {
                  if (!node.x || !node.y) return null;
                  const r = node.size ?? 8;
                  const color = node.type === "event" ? dangerColor(node.danger) : dangerColor(node.avg_danger);
                  const isSelected = selected?.id === node.id;
                  const label = node.id.length > 18 ? node.id.slice(0, 16) + "…" : node.id;

                  return (
                    <g key={node.id} className="node" onClick={() => setSelected(isSelected ? null : node)} style={{ cursor: "pointer" }}>
                      {/* Outer glow ring on hover/select */}
                      {isSelected && (
                        <circle cx={node.x} cy={node.y} r={r + 6} fill="none" stroke={ORANGE} strokeWidth={1.5} strokeOpacity={0.5} filter="url(#glow)" />
                      )}
                      {/* Main node */}
                      <circle
                        cx={node.x} cy={node.y} r={r}
                        fill={color}
                        fillOpacity={isSelected ? 0.95 : 0.75}
                        stroke={isSelected ? ORANGE : color}
                        strokeWidth={isSelected ? 2 : 0.5}
                        strokeOpacity={0.8}
                        filter={isSelected ? "url(#node-glow)" : undefined}
                      />
                      {/* Inner highlight */}
                      <circle cx={node.x - r * 0.3} cy={node.y - r * 0.3} r={r * 0.35} fill="white" fillOpacity={0.15} />
                      {/* Label */}
                      {r >= 10 && (
                        <text
                          x={node.x} y={node.y + r + 10}
                          textAnchor="middle"
                          fontSize={Math.max(8, Math.min(11, r * 0.7))}
                          fill="white"
                          fillOpacity={0.7}
                          fontFamily="var(--font-jetbrains)"
                        >
                          {label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Legend */}
              <g transform="translate(12, 12)">
                {[
                  { color: THREAT, label: "Danger ≥9" },
                  { color: AMBER, label: "Danger 7-8" },
                  { color: ORANGE, label: "Danger 5-6" },
                  { color: MINT, label: "Danger <5" },
                ].map((l, i) => (
                  <g key={i} transform={`translate(0, ${i * 18})`}>
                    <circle cx={6} cy={6} r={5} fill={l.color} fillOpacity={0.8} />
                    <text x={15} y={10} fontSize={9} fill="rgba(255,255,255,0.5)" fontFamily="var(--font-jetbrains)">{l.label}</text>
                  </g>
                ))}
                <text x={0} y={82} fontSize={8} fill="rgba(255,255,255,0.25)" fontFamily="var(--font-jetbrains)">Node size = scandal volume</text>
                <text x={0} y={93} fontSize={8} fill="rgba(255,255,255,0.25)" fontFamily="var(--font-jetbrains)">Edge weight = shared events</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {/* Selected node detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl p-4 border"
                style={{ background: "rgba(0,0,0,0.5)", borderColor: `${ORANGE}30` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-sm" style={{ color: ORANGE }}>{selected.id}</p>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-lg leading-none">×</button>
                </div>

                {selected.type === "person" && (
                  <>
                    <p className="text-xs text-white/50 mb-3">Person Node</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg p-2 text-center" style={{ background: `${THREAT}15`, border: `1px solid ${THREAT}20` }}>
                        <p className="text-lg font-black" style={{ color: THREAT }}>{selected.events ?? "—"}</p>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">Events</p>
                      </div>
                      <div className="rounded-lg p-2 text-center" style={{ background: `${AMBER}15`, border: `1px solid ${AMBER}20` }}>
                        <p className="text-lg font-black" style={{ color: AMBER }}>{typeof selected.avg_danger === "number" ? selected.avg_danger.toFixed(1) : "—"}</p>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider">Avg Danger</p>
                      </div>
                    </div>
                    {selected.categories && selected.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {selected.categories.map(c => (
                          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: `${VIOLET}20`, color: VIOLET }}>
                            {c.split("/")[0].trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => { setMode("person"); fetchGraph("person", selected.id); setSearchPerson(selected.id); }}
                      className="w-full rounded-lg py-1.5 text-xs font-semibold transition-colors"
                      style={{ background: `${ORANGE}20`, border: `1px solid ${ORANGE}30`, color: ORANGE }}
                    >
                      Explore ego network →
                    </button>
                    <a href={`/catalog?search=${encodeURIComponent(selected.id)}`} target="_blank"
                      className="block w-full mt-1.5 text-center rounded-lg py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                      View all entries →
                    </a>
                  </>
                )}

                {selected.type === "event" && (
                  <>
                    <p className="text-xs text-white/50 mb-2">Scandal Event</p>
                    <p className="text-xs text-white/70 leading-relaxed mb-2">{selected.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-black" style={{ color: dangerColor(selected.danger) }}>
                        {selected.danger}/10
                      </span>
                      <span className="text-[10px] text-white/30">{selected.category}</span>
                    </div>
                    {selected.entry_number && (
                      <a href={`/entry/${selected.entry_number}`} target="_blank"
                        className="block text-center rounded-lg py-1.5 text-xs font-semibold transition-colors"
                        style={{ background: `${THREAT}20`, border: `1px solid ${THREAT}30`, color: THREAT }}>
                        View entry #{selected.entry_number} →
                      </a>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edge hover detail */}
          {hoveredEdge && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-3 border text-xs"
              style={{ background: "rgba(0,0,0,0.5)", borderColor: `${MINT}20` }}>
              <p className="font-mono text-[10px] mb-1" style={{ color: `${MINT}60` }}>CONNECTION</p>
              <p className="font-semibold text-white/80">{hoveredEdge.source}</p>
              <p className="text-white/30 text-[10px] my-0.5">co-appears with</p>
              <p className="font-semibold text-white/80">{hoveredEdge.target}</p>
              <div className="flex gap-3 mt-2">
                <div>
                  <p className="text-[10px] text-white/30">Shared events</p>
                  <p className="font-mono font-bold" style={{ color: MINT }}>{hoveredEdge.weight}</p>
                </div>
                {hoveredEdge.avg_danger != null && (
                  <div>
                    <p className="text-[10px] text-white/30">Avg danger</p>
                    <p className="font-mono font-bold" style={{ color: dangerColor(hoveredEdge.avg_danger) }}>
                      {typeof hoveredEdge.avg_danger === "number" ? hoveredEdge.avg_danger.toFixed(1) : hoveredEdge.avg_danger}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Top people list */}
          {graphData?.topPeople && graphData.topPeople.length > 0 && (
            <div className="rounded-xl p-3 border" style={{ background: "rgba(0,0,0,0.4)", borderColor: `${ORANGE}15` }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: `${ORANGE}60` }}>
                Most Connected
              </p>
              <div className="space-y-1">
                {graphData.topPeople.slice(0, 10).map((p, i) => (
                  <button key={p.name} onClick={() => { fetchGraph("person", p.name); setSearchPerson(p.name); setMode("person"); }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <span className="font-mono text-[9px] w-4 text-white/25">{i + 1}</span>
                    <span className="flex-1 text-[11px] text-white/70 truncate">{p.name}</span>
                    <span className="font-mono text-[10px]" style={{ color: dangerColor(p.avg_danger) }}>
                      {p.events}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anomaly callout */}
          <div className="rounded-xl p-3 border" style={{ background: `${THREAT}06`, borderColor: `${THREAT}20` }}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={13} style={{ color: THREAT, marginTop: 1, flexShrink: 0 }} />
              <div>
                <p className="text-[11px] font-semibold mb-1" style={{ color: THREAT }}>Graph Anomaly</p>
                <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Nodes with disproportionately high danger scores relative to event count indicate concentrated, high-severity misconduct — not just prolific involvement. These are the most dangerous nodes in the network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
