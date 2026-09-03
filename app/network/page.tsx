"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ZoomIn, ZoomOut, RefreshCw, AlertTriangle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  type: "person" | "event";
  name?: string;
  label?: string;
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
  source?: "neo4j" | "neon-fallback";
  degraded?: boolean;
  message?: string;
  path_supported?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ORANGE  = "#FF6500";
const THREAT  = "#ff4d5e";
const MINT    = "#3ee6c1";
const AMBER   = "#e8b44c";
const VIOLET  = "#a78bfa";
const BG      = "#060608";

const ANALYSES: Record<string, string> = {
  community: "Co-occurrence shows people tagged together in documented archive entries. Dense links indicate repeated shared documentation, not proof of coordination or causation. Edge color reflects average danger of the shared entries.",
  top: "Force graph of the archive's most connected people. Node size reflects tagged event volume; color reflects average danger. Edges show co-appearance in the same documented entries, not proof of a relationship.",
  person: "Ego network shows one person's tagged entries and other people tagged in those same dossiers. It is a documentation map, not a finding of coordination or guilt.",
  path: "Path exploration looks for a relationship route between named people. Archive fallback mode reports when that relationship service is unavailable instead of inventing a path.",
};

// ── Force-directed layout (simple physics sim, no D3 dep) ────────────────────

function runForceLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  if (nodes.length === 0) return [];
  const nodeMap = new Map(nodes.map((n, index) => [n.id, {
    ...n,
    x: 40 + stableUnit(`${n.id}:${index}:x`) * (width - 80),
    y: 40 + stableUnit(`${n.id}:${index}:y`) * (height - 80),
    vx: 0,
    vy: 0,
  }]));
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

function stableUnit(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

// ── Danger color ──────────────────────────────────────────────────────────────

function dangerColor(d?: number) {
  if (!d) return MINT;
  if (d >= 9) return THREAT;
  if (d >= 7) return AMBER;
  if (d >= 5) return ORANGE;
  return MINT;
}

function edgeDangerColor(d?: number) {
  if ((d ?? 0) >= 8) return THREAT;
  if ((d ?? 0) >= 5) return AMBER;
  return MINT;
}

function nodeName(node?: GraphNode) {
  return node?.label ?? node?.name ?? node?.id ?? "Unknown";
}

function primaryCategoryForNode(node: GraphNode, edges: GraphEdge[], nodes: Map<string, GraphNode>) {
  const categories = [node.category, ...(node.categories ?? [])].filter((value): value is string => Boolean(value));
  for (const edge of edges) {
    if (edge.source !== node.id && edge.target !== node.id) continue;
    const neighbor = nodes.get(edge.source === node.id ? edge.target : edge.source);
    if (neighbor?.type === "event" && neighbor.category) categories.push(neighbor.category);
  }
  if (categories.length === 0) return null;
  const counts = new Map<string, number>();
  for (const value of categories) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NetworkPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const initialParam = (name: string) => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get(name) ?? "";
  const [mode, setMode] = useState<"top" | "community" | "person" | "path">("community");
  const [searchPerson, setSearchPerson] = useState("");
  const [phase, setPhase] = useState(() => initialParam("phase"));
  const [category, setCategory] = useState(() => initialParam("category"));
  const [minDanger, setMinDanger] = useState(() => initialParam("minDanger"));
  const [appliedFilters, setAppliedFilters] = useState(() => ({ phase: initialParam("phase"), category: initialParam("category"), minDanger: initialParam("minDanger") }));
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const initialFetch = useRef(false);
  const [layoutNodes, setLayoutNodes] = useState<GraphNode[]>([]);

  const W = 900, H = 600;

  const fetchGraph = useCallback(async (m: string, person?: string, filterOverride?: { phase: string; category: string; minDanger: string }) => {
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const params = new URLSearchParams({ mode: m });
      if (person) params.set("person", person);
      const filters = filterOverride ?? appliedFilters;
      if (filters.phase.trim()) params.set("phase", filters.phase.trim());
      if (filters.category.trim()) params.set("category", filters.category.trim());
      if (filters.minDanger && Number(filters.minDanger) > 0) params.set("minDanger", String(Math.min(10, Math.max(0, Number(filters.minDanger)))));
      const url = `/api/network?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("The graph service could not return data.");
      const payload = await res.json() as Partial<GraphData>;
      const data: GraphData = {
        nodes: Array.isArray(payload.nodes) ? payload.nodes : [],
        edges: Array.isArray(payload.edges) ? payload.edges : [],
        topPeople: Array.isArray(payload.topPeople) ? payload.topPeople : [],
        source: payload.source,
        degraded: payload.degraded === true,
        message: typeof payload.message === "string" ? payload.message : undefined,
        path_supported: payload.path_supported,
      };
      setGraphData(data);
      // Run force layout
      const laid = runForceLayout(data.nodes, data.edges, W, H);
      setLayoutNodes(laid);
    } catch {
      setError("The graph could not be loaded. Retry to check the archive-backed fallback.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    if (initialFetch.current) return;
    initialFetch.current = true;
    fetchGraph("community");
  }, [fetchGraph]);

  const applyUrl = (filters: { phase: string; category: string; minDanger: string }) => {
    const params = new URLSearchParams();
    if (filters.phase.trim()) params.set("phase", filters.phase.trim());
    if (filters.category.trim()) params.set("category", filters.category.trim());
    if (filters.minDanger && Number(filters.minDanger) > 0) params.set("minDanger", String(Math.min(10, Math.max(0, Number(filters.minDanger)))));
    window.history.replaceState(null, "", params.toString() ? `/network?${params}` : "/network");
  };

  const handleModeChange = (m: "top" | "community" | "person" | "path") => {
    setMode(m);
    if (m !== "person") fetchGraph(m, m === "path" ? searchPerson : undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPerson.trim()) {
      const searchMode = mode === "path" ? "path" : "person";
      setMode(searchMode);
      fetchGraph(searchMode, searchPerson.trim());
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

  const nodeMap = useMemo(() => new Map(layoutNodes.map(n => [n.id, n])), [layoutNodes]);

  const selectedEdges = useMemo(() => selected && graphData
    ? graphData.edges.filter(edge => edge.source === selected.id || edge.target === selected.id)
    : [], [graphData, selected]);

  const selectedConnections = useMemo(() => selectedEdges
    .map(edge => ({ edge, node: nodeMap.get(edge.source === selected?.id ? edge.target : edge.source) }))
    .filter((connection): connection is { edge: GraphEdge; node: GraphNode } => connection.node?.type === "person")
    .sort((a, b) => (b.edge.weight ?? 1) - (a.edge.weight ?? 1))
    .slice(0, 3), [nodeMap, selected?.id, selectedEdges]);

  const mostDangerousSharedEvent = useMemo(() => selectedEdges
    .map(edge => nodeMap.get(edge.source === selected?.id ? edge.target : edge.source))
    .filter((node): node is GraphNode => node?.type === "event")
    .sort((a, b) => (b.danger ?? 0) - (a.danger ?? 0))[0], [nodeMap, selected?.id, selectedEdges]);

  const mostDangerousConnection = useMemo(() => [...selectedEdges]
    .sort((a, b) => (b.avg_danger ?? 0) - (a.avg_danger ?? 0))[0], [selectedEdges]);

  const selectedPrimaryCategory = useMemo(() => selected && graphData
    ? primaryCategoryForNode(selected, graphData.edges, nodeMap)
    : null, [graphData, nodeMap, selected]);

  const keyInsight = useMemo(() => {
    if (!graphData?.edges.length) return null;
    const edge = graphData.edges.reduce((best, current) =>
      (current.weight ?? 1) > (best.weight ?? 1) ? current : best
    );
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) return null;

    const sourceEvents = new Set(graphData.edges
      .filter(item => item.source === source.id || item.target === source.id)
      .map(item => nodeMap.get(item.source === source.id ? item.target : item.source))
      .filter((node): node is GraphNode => node?.type === "event")
      .map(node => node.id));
    const sharedEvents = graphData.edges
      .filter(item => item.source === target.id || item.target === target.id)
      .map(item => nodeMap.get(item.source === target.id ? item.target : item.source))
      .filter((node): node is GraphNode => node?.type === "event" && sourceEvents.has(node.id));
    if (source.type === "event") sharedEvents.push(source);
    if (target.type === "event") sharedEvents.push(target);

    const categoryCounts = new Map<string, number>();
    for (const event of sharedEvents) {
      if (event.category) categoryCounts.set(event.category, (categoryCounts.get(event.category) ?? 0) + 1);
    }
    const categories = Array.from(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);
    const categoryText = categories.length > 0
      ? `, concentrated in ${categories.map(([name, count]) => `${name} (${Math.round(count / sharedEvents.length * 100)}%)`).join(" and ")}`
      : "";
    return {
      text: `${nodeName(source)} appears in ${edge.weight ?? 1} shared documented event${(edge.weight ?? 1) === 1 ? "" : "s"} with ${nodeName(target)}${categoryText}. Their co-appearance danger score averages ${(edge.avg_danger ?? 0).toFixed(1)}/10.`,
      hasCategoryBreakdown: categories.length > 0,
    };
  }, [graphData, nodeMap]);

  const notableClusters = useMemo(() => {
    if (!graphData) return [];
    const clusters: Array<{ id: string; name: string; members: string[]; sharedEvents: number }> = [];
    const signatures = new Set<string>();

    for (const center of layoutNodes) {
      const connections = graphData.edges
        .filter(edge => edge.source === center.id || edge.target === center.id)
        .map(edge => ({ edge, node: nodeMap.get(edge.source === center.id ? edge.target : edge.source) }))
        .filter((connection): connection is { edge: GraphEdge; node: GraphNode } => connection.node?.type === "person")
        .sort((a, b) => (b.edge.weight ?? 1) - (a.edge.weight ?? 1));
      if (center.type !== "person" || connections.length < 2) continue;
      const members = [center, ...connections.slice(0, 3).map(connection => connection.node)];
      const signature = members.map(node => node.id).sort().join("|");
      if (signatures.has(signature)) continue;
      signatures.add(signature);
      const category = members.map(node => primaryCategoryForNode(node, graphData.edges, nodeMap)).find(Boolean);
      clusters.push({
        id: signature,
        name: `${category ?? "Shared-event"} cluster`,
        members: members.map(nodeName),
        sharedEvents: Math.round(connections.slice(0, 3).reduce((sum, item) => sum + (item.edge.weight ?? 1), 0)),
      });
    }

    return clusters.sort((a, b) => b.sharedEvents - a.sharedEvents).slice(0, 5);
  }, [graphData, layoutNodes, nodeMap]);

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
              {graphData?.nodes.length ?? 0} nodes · {graphData?.edges.length ?? 0} edges · {graphData?.source === "neon-fallback" ? "archive-tag fallback" : "relationship graph"}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex flex-wrap gap-2">
            {(["community", "top", "person", "path"] as const).map(m => (
              <button key={m} onClick={() => handleModeChange(m)}
                disabled={m === "path" && graphData?.path_supported === false}
                title={m === "path" && graphData?.path_supported === false ? "Path exploration is unavailable in archive fallback mode" : undefined}
                className="min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  background: mode === m ? `${ORANGE}25` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${mode === m ? ORANGE : "rgba(255,255,255,0.1)"}`,
                  color: mode === m ? ORANGE : "rgba(255,255,255,0.5)",
                }}>
                {m === "community" ? "Co-appearance" : m === "top" ? "Power Network" : m === "person" ? "Person Ego" : "Path"}
              </button>
            ))}
          </div>

          {/* Person search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={searchPerson}
              onChange={e => setSearchPerson(e.target.value)}
              placeholder={mode === "path" ? "Target or From__To" : "Search person…"}
              className="rounded-lg px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-orange-500 w-36"
            />
            <button type="submit" aria-label={mode === "path" ? "Find relationship path" : "Search person"} className="min-h-11 min-w-11 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <Search size={12} />
            </button>
          </form>

          {/* Controls */}
          <div className="flex gap-1.5">
            <button type="button" aria-label="Zoom network in" onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><ZoomIn size={16} /></button>
            <button type="button" aria-label="Zoom network out" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><ZoomOut size={16} /></button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); fetchGraph(mode, mode === "person" || mode === "path" ? searchPerson : undefined); }}
              type="button" aria-label="Reset and refresh network" className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><RefreshCw size={16} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Graph */}
        <div className="lg:col-span-3">
          {graphData?.degraded && (
            <div className="mb-3 flex flex-col gap-3 rounded-xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between" role="status" style={{ borderColor: `${AMBER}55`, background: `${AMBER}12`, color: "rgba(255,255,255,.78)" }}>
              <div className="flex items-start gap-2"><AlertTriangle size={17} className="mt-0.5 shrink-0" style={{ color: AMBER }} /><p><strong className="text-white">Archive-backed fallback is active.</strong> {graphData.message ?? "This view is derived from tagged dossier records and is bounded for reliability."}</p></div>
              <button type="button" onClick={() => fetchGraph(mode, mode === "person" || mode === "path" ? searchPerson : undefined)} className="min-h-11 shrink-0 rounded-lg border px-3 text-xs font-semibold text-amber-100 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" style={{ borderColor: `${AMBER}66` }}>Retry relationship graph</button>
            </div>
          )}
          {/* Analysis banner */}
          <div className="mb-3 px-4 py-3 rounded-xl text-xs leading-relaxed" style={{ background: `${ORANGE}08`, border: `1px solid ${ORANGE}20`, color: "rgba(255,255,255,0.6)" }}>
            <span className="font-mono text-[10px] mr-2" style={{ color: `${ORANGE}70` }}>ANALYSIS //</span>
            {ANALYSES[mode]}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); const next = { phase, category, minDanger }; setAppliedFilters(next); applyUrl(next); fetchGraph(mode, mode === "person" || mode === "path" ? searchPerson : undefined, next); }} className="mb-3 grid gap-2 rounded-xl border p-3 sm:grid-cols-4" style={{ borderColor: `${ORANGE}20`, background: "rgba(0,0,0,.28)" }} aria-label="Network filters">
            <input value={phase} onChange={(event) => setPhase(event.target.value)} maxLength={96} placeholder="Exact archive phase" className="min-h-11 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white placeholder:text-white/35 focus:border-orange-400 focus:outline-none" />
            <input value={category} onChange={(event) => setCategory(event.target.value)} maxLength={96} placeholder="Exact archive category" className="min-h-11 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white placeholder:text-white/35 focus:border-orange-400 focus:outline-none" />
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white/65">Min danger <input type="number" value={minDanger} onChange={(event) => setMinDanger(event.target.value)} min="0" max="10" step="1" className="min-w-0 flex-1 bg-transparent text-right text-white outline-none" /></label>
            <div className="flex gap-2"><button type="submit" className="min-h-11 flex-1 rounded-lg bg-orange-600 px-3 text-xs font-semibold text-white hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Apply</button><button type="button" onClick={() => { const next = { phase: "", category: "", minDanger: "" }; setPhase(""); setCategory(""); setMinDanger(""); setAppliedFilters(next); applyUrl(next); fetchGraph(mode, mode === "person" || mode === "path" ? searchPerson : undefined, next); }} className="min-h-11 rounded-lg border border-white/15 px-3 text-xs text-white/65 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Clear</button></div>
          </form>
          {(appliedFilters.phase || appliedFilters.category || appliedFilters.minDanger) && <p className="mb-3 text-xs text-white/50" aria-live="polite">Active filters: {[appliedFilters.phase && `phase: ${appliedFilters.phase}`, appliedFilters.category && `category: ${appliedFilters.category}`, appliedFilters.minDanger && `danger ≥ ${appliedFilters.minDanger}`].filter(Boolean).join(" · ")}</p>}

          <p className="mb-2 text-[11px] text-white/45 sm:hidden">Scroll the graph horizontally, use the zoom controls, then tap a node for its dossier context.</p>
          <div className="relative overflow-x-auto overscroll-contain rounded-xl border" style={{ borderColor: `${ORANGE}20`, background: "rgba(0,0,0,0.4)" }}>
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
                  <button type="button" onClick={() => fetchGraph(mode, mode === "person" || mode === "path" ? searchPerson : undefined)} className="mt-3 min-h-11 rounded-lg border px-3 text-xs text-orange-100 hover:bg-orange-500/10" style={{ borderColor: `${ORANGE}55` }}>Retry graph</button>
                </div>
              </div>
            )}

            <svg
              ref={svgRef}
              className="h-auto min-h-[430px] w-[760px] max-w-none sm:min-h-0 sm:w-full"
              viewBox={`0 0 ${W} ${H}`}
              aria-label="Interactive archive co-occurrence network"
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
                  if (!s?.x || !s?.y || !t?.x || !t?.y) return null;
                  const w = edge.weight ?? 1;
                  const color = edgeDangerColor(edge.avg_danger);
                  const isHovered = hoveredEdge === edge;
                  return (
                    <line key={i}
                      x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                      stroke={color}
                      strokeWidth={isHovered ? Math.min(7, 1.5 + Math.sqrt(w)) : Math.min(6, 0.75 + Math.sqrt(w) * 0.65)}
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
                  const displayName = node.label ?? node.name ?? node.id;
                  const label = displayName.length > 18 ? displayName.slice(0, 16) + "…" : displayName;

                  return (
                    <g
                      key={node.id}
                      className="node group"
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`${displayName}, ${node.type} node${node.events ? `, ${node.events} documented entries` : ""}`}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onFocus={() => setHoveredNode(node)}
                      onBlur={() => setHoveredNode(null)}
                      onClick={() => setSelected(isSelected ? null : node)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelected(isSelected ? null : node);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx={node.x} cy={node.y} r={Math.max(22, r + 8)} fill="transparent" />
                      <circle className="opacity-0 group-focus:opacity-100" cx={node.x} cy={node.y} r={Math.max(24, r + 10)} fill="none" stroke="white" strokeWidth={2} />
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

                {hoveredNode?.x != null && hoveredNode.y != null && (() => {
                  const tooltipX = hoveredNode.x > W - 260 ? hoveredNode.x - 238 : hoveredNode.x + 22;
                  const tooltipY = Math.max(10, Math.min(H - 92, hoveredNode.y - 38));
                  const category = graphData ? primaryCategoryForNode(hoveredNode, graphData.edges, nodeMap) : null;
                  const averageDanger = hoveredNode.avg_danger ?? hoveredNode.danger;
                  return (
                    <g transform={`translate(${tooltipX},${tooltipY})`} pointerEvents="none">
                      <rect width={216} height={82} rx={8} fill="rgba(0,0,0,0.94)" stroke={`${MINT}55`} />
                      <text x={12} y={18} fill="white" fontSize={11} fontWeight={700} fontFamily="var(--font-jetbrains)">{nodeName(hoveredNode).slice(0, 29)}</text>
                      <text x={12} y={36} fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily="var(--font-jetbrains)">Events: {hoveredNode.type === "event" ? 1 : hoveredNode.events ?? "—"}</text>
                      <text x={12} y={51} fill={edgeDangerColor(averageDanger)} fontSize={9} fontFamily="var(--font-jetbrains)">Avg danger: {averageDanger != null ? `${averageDanger.toFixed(1)}/10` : "—"}</text>
                      <text x={12} y={66} fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily="var(--font-jetbrains)">Top category: {(category ?? "Unavailable").slice(0, 29)}</text>
                    </g>
                  );
                })()}
              </g>

              {/* Legend */}
              <g transform="translate(12, 12)">
                {[
                  { color: THREAT, label: "High danger ≥8" },
                  { color: AMBER, label: "Mid danger 5-7" },
                  { color: MINT, label: "Low danger <5" },
                ].map((l, i) => (
                  <g key={i} transform={`translate(0, ${i * 18})`}>
                    <circle cx={6} cy={6} r={5} fill={l.color} fillOpacity={0.8} />
                    <text x={15} y={10} fontSize={9} fill="rgba(255,255,255,0.5)" fontFamily="var(--font-jetbrains)">{l.label}</text>
                  </g>
                ))}
                <text x={0} y={64} fontSize={8} fill="rgba(255,255,255,0.25)" fontFamily="var(--font-jetbrains)">Node size = scandal volume</text>
                <text x={0} y={75} fontSize={8} fill="rgba(255,255,255,0.25)" fontFamily="var(--font-jetbrains)">Edge thickness = shared events</text>
              </g>
            </svg>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border p-4" style={{ borderColor: `${AMBER}35`, background: `${AMBER}08` }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: AMBER }}>Key Insight</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                {keyInsight?.text ?? "No connected pair is available for this graph view."}
              </p>
              {keyInsight && !keyInsight.hasCategoryBreakdown && (
                <p className="mt-2 text-[10px] leading-4 text-white/40">The aggregate API does not expose per-edge category counts, so no category percentage is inferred.</p>
              )}
            </section>

            <section className="rounded-xl border p-4" style={{ borderColor: `${MINT}25`, background: `${MINT}05` }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MINT }}>Notable Clusters</p>
              {notableClusters.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {notableClusters.map(cluster => (
                    <div key={cluster.id} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-white/80">{cluster.name}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-white/45">{cluster.members.join(", ")} — {cluster.sharedEvents} shared-event links</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs leading-5 text-white/45">No node in this view has multiple person-to-person edges.</p>
              )}
            </section>
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
                  <p className="font-bold text-sm" style={{ color: ORANGE }}>{selected.label ?? selected.name ?? selected.id}</p>
                  <button type="button" aria-label="Close node details" onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-lg leading-none">×</button>
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
                    <div className="mb-3 space-y-2 border-t border-white/10 pt-3">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/30">Primary scandal category</p>
                        <p className="mt-0.5 text-xs text-white/70">{selectedPrimaryCategory ?? "Not exposed for this aggregate"}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/30">Top co-conspirators</p>
                        {selectedConnections.length > 0 ? (
                          <ol className="mt-1 space-y-1">
                            {selectedConnections.map(({ edge, node }, index) => (
                              <li key={node.id} className="flex items-center justify-between gap-2 text-xs text-white/65">
                                <span className="truncate">{index + 1}. {nodeName(node)}</span>
                                <span className="shrink-0 font-mono text-[10px]" style={{ color: MINT }}>{edge.weight ?? 1} shared</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-0.5 text-xs text-white/45">No direct person-to-person edges in this view.</p>
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/30">Most dangerous shared event</p>
                        {mostDangerousSharedEvent ? (
                          <p className="mt-0.5 text-xs leading-5 text-white/70">{nodeName(mostDangerousSharedEvent)} <span style={{ color: edgeDangerColor(mostDangerousSharedEvent.danger) }}>({(mostDangerousSharedEvent.danger ?? 0).toFixed(1)}/10)</span></p>
                        ) : mostDangerousConnection ? (
                          <p className="mt-0.5 text-xs leading-5 text-white/45">Individual event not exposed; highest-risk shared connection averages {(mostDangerousConnection.avg_danger ?? 0).toFixed(1)}/10.</p>
                        ) : (
                          <p className="mt-0.5 text-xs text-white/45">No shared event available.</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { const name = selected.name ?? selected.label ?? selected.id; setMode("person"); fetchGraph("person", name); setSearchPerson(name); }}
                      className="w-full rounded-lg py-1.5 text-xs font-semibold transition-colors"
                      style={{ background: `${ORANGE}20`, border: `1px solid ${ORANGE}30`, color: ORANGE }}
                    >
                      Explore ego network →
                    </button>
                    <a href={`/catalog?search=${encodeURIComponent(selected.name ?? selected.label ?? selected.id)}`} target="_blank"
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
                  This heuristic highlights tags whose linked entries have high danger scores relative to volume. It is a review signal from archive scoring, not a finding of guilt, causation, or coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
