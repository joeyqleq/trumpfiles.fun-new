import { Badge } from '@/components/ui/badge';
import TrueFocus from '@/components/TrueFocus';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Radar, DatabaseZap, CalendarClock } from 'lucide-react';
import type { LabChronologyMode, LabViewKey, VisualizerLabFilters } from '@/lib/visualizer-lab/types';

interface LabHeaderProps {
  totalCount: number;
  chronology: LabChronologyMode;
  activeView: LabViewKey;
  filters: VisualizerLabFilters;
  onReset: () => void;
}

const viewLabels: Record<LabViewKey, string> = {
  overview: 'Pulse',
  timeline: 'Timelines',
  categories: 'Categories',
  matrix: 'Pressure Matrix',
  scatter: 'Outliers',
  themes: 'Themes',
  comparison: 'Comparison',
};

const chronologyLabels: Record<LabChronologyMode, string> = {
  archive: 'Archive chronology',
  event: 'Event chronology',
};

const summarizeFilters = (filters: VisualizerLabFilters): string => {
  const segments = [
    filters.search ? `search “${filters.search}”` : null,
    filters.category ? `category ${filters.category}` : null,
    filters.phaseGroup ? `phase ${filters.phaseGroup}` : null,
    filters.keyword ? `keyword ${filters.keyword}` : null,
    filters.minScore?.fucked_up_score ? `score ≥ ${filters.minScore.fucked_up_score}` : null,
    filters.minScore?.danger ? `danger ≥ ${filters.minScore.danger}` : null,
  ].filter(Boolean);

  return segments.length > 0 ? segments.join(' • ') : 'No active filters';
};

export default function LabHeader({
  totalCount,
  chronology,
  activeView,
  filters,
  onReset,
}: LabHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="font-arctic-3d scale-[0.8] origin-left sm:scale-100">
              <TrueFocus
                sentence="FORENSIC LAB"
                manualMode={false}
                blurAmount={3}
                borderColor="#FF6500"
                glowColor="rgba(255, 101, 0, 0.55)"
                animationDuration={0.8}
                pauseBetweenAnimations={2}
              />
            </div>
          </div>
          <div className="max-w-4xl space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              The Trump Files visualizer, rebuilt as an analyst cockpit.
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              This staging copy treats the archive as an evidence system, not a dashboard.
              Use it to trace patterns, compare regimes, and drill from macro signal down to the records that make the case.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="border-orange-500/30 bg-black/40 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100"
        >
          <RefreshCcw className="size-4" />
          Reset investigation
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="glass-card rounded-2xl border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-orange-300/80">
            <DatabaseZap className="size-4" />
            Live archive scope
          </div>
          <div className="mt-3 flex items-end gap-4">
            <div>
              <div className="text-3xl font-black text-orange-300 sm:text-4xl">{totalCount.toLocaleString()}</div>
              <div className="text-xs text-foreground/55">entries in the current archive</div>
            </div>
            <Badge variant="outline" className="border-orange-500/30 bg-orange-500/10 text-orange-200">
              {viewLabels[activeView]}
            </Badge>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-orange-300/80">
            <CalendarClock className="size-4" />
            Active chronology
          </div>
          <div className="mt-3 text-lg font-semibold text-foreground">{chronologyLabels[chronology]}</div>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            {chronology === 'archive'
              ? 'Latest-first means when entries were added to the database.'
              : 'Timeline means when the underlying Trump-linked events happened.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-orange-300/80">
            <Radar className="size-4" />
            Investigation state
          </div>
          <div className="mt-3 text-sm font-medium text-foreground">{summarizeFilters(filters)}</div>
          <p className="mt-2 text-xs leading-5 text-foreground/55">
            Filters and chronology persist as you switch analytical lenses.
          </p>
        </div>
      </div>
    </div>
  );
}
