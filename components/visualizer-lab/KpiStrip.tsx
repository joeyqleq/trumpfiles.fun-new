import { ShieldAlert, Siren, Scale, Flame, Orbit } from 'lucide-react';
import type { VisualizerLabOverviewMetrics } from '@/lib/visualizer-lab/types';

interface KpiStripProps {
  metrics: VisualizerLabOverviewMetrics;
}

const items = (metrics: VisualizerLabOverviewMetrics) => [
  {
    label: 'Rows in scope',
    value: metrics.totalEntries.toLocaleString(),
    icon: Orbit,
    tone: 'text-orange-300',
  },
  {
    label: 'Average score',
    value: metrics.avgFuckedUpScore.toFixed(2),
    icon: Flame,
    tone: 'text-orange-200',
  },
  {
    label: 'Average danger',
    value: metrics.avgDanger.toFixed(2),
    icon: Siren,
    tone: 'text-red-300',
  },
  {
    label: 'Average authoritarianism',
    value: metrics.avgAuthoritarianism.toFixed(2),
    icon: ShieldAlert,
    tone: 'text-amber-300',
  },
  {
    label: 'Average lawlessness',
    value: metrics.avgLawlessness.toFixed(2),
    icon: Scale,
    tone: 'text-orange-300',
  },
];

export default function KpiStrip({ metrics }: KpiStripProps) {
  return (
    <div className="grid gap-3 xl:grid-cols-5">
      {items(metrics).map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="glass-card rounded-2xl border border-orange-500/18 bg-black/45 p-4 shadow-[0_0_25px_rgba(255,101,0,0.05)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-foreground/50">{item.label}</div>
                <div className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/35 p-2">
                <Icon className={`size-5 ${item.tone}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
