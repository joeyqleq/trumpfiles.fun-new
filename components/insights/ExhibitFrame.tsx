"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, AlertTriangle } from "lucide-react";

export interface ExhibitCommentary {
  reads: string;
  means: string;
  proves: string;
}

interface ExhibitFrameProps {
  exhibit: string;
  title: string;
  subtitle?: string;
  accent?: string;
  classification?: string;
  commentary?: ExhibitCommentary;
  children: React.ReactNode;
  className?: string;
}

export function ExhibitFrame({
  exhibit,
  title,
  subtitle,
  accent = "#FF6500",
  classification,
  commentary,
  children,
  className = "",
}: ExhibitFrameProps) {
  const [showCommentary, setShowCommentary] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden ${className}`}
      style={{ boxShadow: `0 0 40px ${accent}08` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <span
              className="font-mono text-[10px] tracking-[0.3em] px-2 py-0.5 rounded border border-current opacity-60 flex-shrink-0 mt-0.5"
              style={{ color: accent }}
            >
              {exhibit}
            </span>
            <div>
              <h3 className="font-mono text-sm md:text-base font-bold tracking-wide text-foreground uppercase leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-1 text-xs text-foreground/50 max-w-2xl">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {classification && (
              <span className="hidden md:inline font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 rounded bg-white/5 text-foreground/40 border border-white/10">
                {classification}
              </span>
            )}
          </div>
        </div>

        <div className="min-h-[200px]">{children}</div>

        {commentary && (
          <div className="mt-4 border-t border-white/5 pt-3">
            <button
              onClick={() => setShowCommentary(!showCommentary)}
              className="flex items-center gap-2 text-xs font-mono tracking-wider text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>ANALYST NOTES</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showCommentary ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showCommentary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider text-foreground/30 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> READS
                      </span>
                      <p className="text-xs text-foreground/60 leading-relaxed">{commentary.reads}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider text-foreground/30 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> MEANS
                      </span>
                      <p className="text-xs text-foreground/60 leading-relaxed">{commentary.means}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-wider" style={{ color: `${accent}80` }}>
                        PROVES
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: `${accent}cc` }}>
                        {commentary.proves}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
