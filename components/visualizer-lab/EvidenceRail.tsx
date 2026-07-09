import { Badge } from '@/components/ui/badge';
import type { LabChronologyMode, VisualizerLabEvidenceItem } from '@/lib/visualizer-lab/types';

interface EvidenceRailProps {
  items: VisualizerLabEvidenceItem[];
  chronology: LabChronologyMode;
}

const formatDate = (value: string | null): string => {
  if (!value) {
    return '—';
  }

  const parsed = Date.parse(value);

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return new Date(parsed).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function EvidenceRail({ items, chronology }: EvidenceRailProps) {
  return (
    <div className="glass-card rounded-2xl border border-orange-500/20 bg-black/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-orange-300/80">Evidence subset</div>
          <div className="mt-1 text-sm text-foreground/65">
            Sorted for {chronology === 'archive' ? 'archive recency' : 'event chronology'} while preserving public entry numbers.
          </div>
        </div>
        <Badge variant="outline" className="border-orange-500/30 bg-orange-500/10 text-orange-200">
          {items.length} records
        </Badge>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <article
            key={item.entry_number}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-orange-500/18 hover:bg-orange-500/[0.035]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-orange-500/30 bg-black/35 font-mono text-orange-200">
                    #{item.entry_number}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-black/25 text-foreground/70">
                    {item.category}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-black/25 text-foreground/70">
                    {item.phase_group}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                  {item.title}
                </h3>
              </div>

              <div className="min-w-[124px] rounded-xl border border-orange-500/14 bg-orange-500/[0.05] px-3 py-2 text-right">
                <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/45">Score</div>
                <div className="mt-1 text-xl font-black text-orange-200">{item.fucked_up_score.toFixed(2)}</div>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-xs text-foreground/55 sm:grid-cols-2">
              <div>
                <dt className="uppercase tracking-[0.16em]">Archive created</dt>
                <dd className="mt-1 text-sm text-foreground/75">{formatDate(item.archive_created_at)}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.16em]">Event date</dt>
                <dd className="mt-1 text-sm text-foreground/75">{formatDate(item.event_date)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-6 text-foreground/72">{item.rationale_short}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
