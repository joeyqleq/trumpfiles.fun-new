"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

interface MilestoneNode {
  id: string;
  label: string;
  date: string;
  count: number;
  detail: string;
  type: "genesis" | "batch" | "milestone" | "current";
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  growth?: string;
}

const MILESTONES: MilestoneNode[] = [
  { id: "n0", label: "Genesis", date: "Jan 2026", count: 0, detail: "Project conceived. First schema designed.", type: "genesis", x: 60, y: 60 },
  { id: "n1", label: "Seed Batch", date: "Feb 1, 2026", count: 514, detail: "Initial 514 entries hand-curated and AI-scored.", type: "batch", x: 240, y: 130 },
  { id: "n2", label: "First Sprint", date: "Feb 15, 2026", count: 800, detail: "Automated scraping pipeline activated.", type: "batch", x: 440, y: 60 },
  { id: "n3", label: "1K Milestone", date: "Feb 22, 2026", count: 1100, detail: "Crossed 1,000 documented entries.", type: "milestone", x: 640, y: 150 },
  { id: "n4", label: "200-Entry Sprint", date: "Mar 4, 2026", count: 1830, detail: "Bulk ingestion: 4 validated 50-entry bundles.", type: "batch", x: 220, y: 280 },
  { id: "n5", label: "Dedupe Cleanup", date: "Mar 4, 2026", count: 1830, detail: "204 duplicate rows identified and purged.", type: "milestone", x: 440, y: 320 },
  { id: "n6", label: "Iran War Batch", date: "Mar 22, 2026", count: 2108, detail: "14-entry Iran-war focused batch.", type: "batch", x: 640, y: 280 },
  { id: "n7", label: "Broad Batch", date: "Mar 23, 2026", count: 2133, detail: "25 entries: war, economy, immigration, press.", type: "batch", x: 160, y: 420 },
  { id: "n8", label: "Current Edge", date: "Mar 23, 2026", count: 2163, detail: "30-entry batch. Max entry_number = 2163.", type: "current", x: 440, y: 440 },
];

const CONNECTIONS: Connection[] = [
  { from: "n0", to: "n1", growth: "+514" },
  { from: "n1", to: "n2", growth: "+286" },
  { from: "n2", to: "n3", growth: "+300" },
  { from: "n3", to: "n4", growth: "+730" },
  { from: "n4", to: "n5" },
  { from: "n5", to: "n6", growth: "+278" },
  { from: "n6", to: "n7", growth: "+25" },
  { from: "n7", to: "n8", growth: "+30" },
];

const TECH_STACK = [
  { name: "Neon", color: "#00E599" },
  { name: "Next.js", color: "#ffffff" },
  { name: "React", color: "#61DAFB" },
  { name: "Claude Opus", color: "#D4A574" },
  { name: "Codex", color: "#10A37F" },
  { name: "Perplexity", color: "#20808D" },
  { name: "Cursor IDE", color: "#7C3AED" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Framer Motion", color: "#FF0050" },
  { name: "D3.js", color: "#F9A03C" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Vercel", color: "#ffffff" },
  { name: "GSAP", color: "#88CE02" },
];

const NODE_STYLES: Record<MilestoneNode["type"], { bg: string; border: string; glow: string; icon: string }> = {
  genesis: { bg: "from-green-950/80 to-green-900/60", border: "border-green-500/50", glow: "shadow-green-500/20", icon: "⚡" },
  batch: { bg: "from-orange-950/80 to-orange-900/60", border: "border-orange-500/50", glow: "shadow-orange-500/20", icon: "📦" },
  milestone: { bg: "from-yellow-950/80 to-yellow-900/60", border: "border-yellow-500/50", glow: "shadow-yellow-500/20", icon: "🏆" },
  current: { bg: "from-red-950/80 to-red-900/60", border: "border-red-500/50", glow: "shadow-red-500/30", icon: "🔴" },
};

function TechChip({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm mx-2 whitespace-nowrap">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }} />
      <span className="text-xs font-mono text-white/80 tracking-wide">{name}</span>
    </div>
  );
}

export default function ChangelogDiagram() {
  const [nodes, setNodes] = useState(MILESTONES);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    if (!node || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
    setDragging(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [nodes]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(rect.width - 160, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(rect.height - 80, e.clientY - rect.top - dragOffset.y));
    setNodes((prev) => prev.map((n) => (n.id === dragging ? { ...n, x: newX, y: newY } : n)));
  }, [dragging, dragOffset]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const getNodeCenter = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + 80, y: node.y + 40 };
  };

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="relative mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
          Build Log
        </h2>
        <p className="text-sm text-foreground/50 mt-2 font-mono tracking-wider uppercase">
          Drag nodes around &middot; Click to expand &middot; An AI-powered paper trail
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[520px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm cursor-default select-none"
        style={{ touchAction: "none" }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="changelog-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#changelog-grid)" />
        </svg>

        {/* Connection paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {CONNECTIONS.map((conn) => {
            const from = getNodeCenter(conn.from);
            const to = getNodeCenter(conn.to);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const cx1 = from.x + dx * 0.4;
            const cy1 = from.y;
            const cx2 = to.x - dx * 0.4;
            const cy2 = to.y;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                <path
                  d={`M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="url(#conn-grad)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="animate-[dash_2s_linear_infinite]"
                />
                <circle r="3" fill="#f97316" className="animate-[pulse_2s_ease-in-out_infinite]">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`}
                  />
                </circle>
                {conn.growth && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className="fill-orange-400/70 text-[10px] font-mono"
                  >
                    {conn.growth}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const style = NODE_STYLES[node.type];
          const isExpanded = expanded === node.id;
          return (
            <motion.div
              key={node.id}
              className={`absolute z-20 w-[160px] rounded-xl border bg-gradient-to-br ${style.bg} ${style.border} shadow-lg ${style.glow} backdrop-blur-sm ${dragging === node.id ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ left: node.x, top: node.y }}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              onClick={() => setExpanded(isExpanded ? null : node.id)}
              whileHover={{ scale: dragging ? 1 : 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{style.icon}</span>
                  <span className="text-xs font-bold text-white/90 truncate">{node.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50 font-mono">{node.date}</span>
                  <span className="text-xs font-bold text-orange-400 font-mono">{node.count.toLocaleString()}</span>
                </div>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 pt-2 border-t border-white/10"
                  >
                    <p className="text-[10px] text-white/60 leading-relaxed">{node.detail}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tech Stack Marquee */}
      <div className="mt-6 relative">
        <div className="text-center mb-3">
          <span className="text-[10px] text-foreground/40 font-mono tracking-[0.3em] uppercase">
            Powered By
          </span>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <Marquee pauseOnHover className="[--duration:30s]">
            {TECH_STACK.map((tech) => (
              <TechChip key={tech.name} name={tech.name} color={tech.color} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
