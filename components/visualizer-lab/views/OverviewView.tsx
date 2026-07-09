import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, BadgeAlert, Flame, ShieldAlert } from 'lucide-react';
import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import type {
  VisualizerLabCategoryLeaderboardItem,
  VisualizerLabOverviewMetrics,
} from '@/lib/visualizer-lab/types';

interface OverviewViewProps {
  metrics: VisualizerLabOverviewMetrics;
  leaderboard: VisualizerLabCategoryLeaderboardItem[];
}

const COLORS = ['#FF6500', '#FF8A00', '#FFAA33', '#FFD166', '#FF4D4D', '#C2410C'];

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

export default function OverviewView({ metrics, leaderboard }: OverviewViewProps) {
  const chartRows = leaderboard.slice(0, 6);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
      <ChartPanel
        title="Category pressure board"
        description="The categories that dominate the current slice of the archive by volume and average score."
        contentClassName="h-[360px]"
      >
        <div className="h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartRows} margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              width={150}
              tick={{ fill: 'rgba(255,255,255,0.72)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{
                background: 'rgba(10, 10, 10, 0.92)',
                border: '1px solid rgba(255, 101, 0, 0.2)',
                borderRadius: 14,
              }}
            />
            <Bar dataKey="count" radius={[0, 12, 12, 0]}>
              {chartRows.map((row, index) => (
                <Cell key={row.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="System readout"
        description="A tighter textual summary of what the current archive slice is screaming about."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-300/75">
              <ShieldAlert className="size-4" />
              Dominant bucket
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">{metrics.topCategory ?? '—'}</div>
            <p className="mt-1 text-sm leading-6 text-foreground/62">
              {metrics.topCategoryCount.toLocaleString()} entries are concentrated here, making it the archive's main repeating pressure channel.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-300/75">
              <BadgeAlert className="size-4" />
              Leading phase group
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">{metrics.topPhaseGroup ?? '—'}</div>
            <p className="mt-1 text-sm leading-6 text-foreground/62">
              {metrics.topPhaseGroupCount.toLocaleString()} records cluster here in the current lens.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-300/75">
              <Flame className="size-4" />
              Chronology span
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              {formatDate(metrics.chronologyStart)} → {formatDate(metrics.chronologyEnd)}
            </div>
            <p className="mt-1 text-sm leading-6 text-foreground/62">
              The active chronology window defines what counts as early, recent, and structurally persistent.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/18 bg-orange-500/[0.05] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-300/75">
              <AlertTriangle className="size-4" />
              Hottest record
            </div>
            <div className="mt-2 text-sm font-semibold leading-6 text-foreground">
              {metrics.highestScoreEntry ? `#${metrics.highestScoreEntry.entry_number} · ${metrics.highestScoreEntry.title}` : '—'}
            </div>
            {metrics.highestScoreEntry ? (
              <p className="mt-2 text-sm leading-6 text-foreground/68">
                Score {metrics.highestScoreEntry.fucked_up_score.toFixed(2)} · {metrics.highestScoreEntry.category} · {metrics.highestScoreEntry.phase_group}
              </p>
            ) : null}
          </div>
        </div>
      </ChartPanel>
    </div>
  );
}
