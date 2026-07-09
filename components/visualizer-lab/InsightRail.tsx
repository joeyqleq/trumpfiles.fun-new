import { FileSearch, Lightbulb, ScanSearch, TrendingUp } from 'lucide-react';
import type { LabChronologyMode, LabViewKey, VisualizerLabInsight } from '@/lib/visualizer-lab/types';

interface InsightRailProps {
  insight: VisualizerLabInsight;
  chronology: LabChronologyMode;
  activeView: LabViewKey;
}

const chronologyLabel: Record<LabChronologyMode, string> = {
  archive: 'Archive chronology',
  event: 'Event chronology',
};

const viewLabel: Record<LabViewKey, string> = {
  overview: 'Pulse',
  timeline: 'Timeline',
  categories: 'Categories',
  matrix: 'Pressure matrix',
  scatter: 'Outliers',
  themes: 'Themes',
  comparison: 'Comparison',
};

export default function InsightRail({ insight, chronology, activeView }: InsightRailProps) {
  return (
    <div className="glass-card rounded-2xl border border-orange-500/20 bg-black/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-orange-300/80">Interpretation layer</div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {viewLabel[activeView]} · {chronologyLabel[chronology]}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/35 p-2">
          <Lightbulb className="size-4 text-orange-300" />
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
            <TrendingUp className="size-3.5" />
            Headline
          </div>
          <p className="text-base font-semibold leading-6 text-orange-100">{insight.headline}</p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
            <ScanSearch className="size-3.5" />
            What stands out
          </div>
          <ul className="space-y-2 text-sm leading-6 text-foreground/72">
            {insight.whatStandsOut.map((item) => (
              <li key={item} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
            <FileSearch className="size-3.5" />
            Why it matters
          </div>
          <p className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-foreground/72">
            {insight.whyItMatters}
          </p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/45">
            <Lightbulb className="size-3.5" />
            What to inspect next
          </div>
          <ul className="space-y-2 text-sm leading-6 text-foreground/72">
            {insight.whatToInspectNext.map((item) => (
              <li key={item} className="rounded-xl border border-orange-500/14 bg-orange-500/[0.04] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
