import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import type { LabChronologyMode, VisualizerLabTimelinePoint } from '@/lib/visualizer-lab/types';

interface TimelineViewProps {
  rows: VisualizerLabTimelinePoint[];
  chronology: LabChronologyMode;
}

export default function TimelineView({ rows, chronology }: TimelineViewProps) {
  const latestRows = rows.slice(-18);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
      <ChartPanel
        title="Chronology pulse"
        description={chronology === 'archive'
          ? 'How the archive itself has been filling out over time.'
          : 'How the underlying event record shifts across Trump’s historical timeline.'}
        contentClassName="h-[360px]"
      >
        <div className="h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={latestRows} margin={{ top: 10, right: 10, left: -18, bottom: 6 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              minTickGap={24}
            />
            <YAxis
              yAxisId="count"
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <YAxis
              yAxisId="score"
              orientation="right"
              domain={[0, 10]}
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(10, 10, 10, 0.92)',
                border: '1px solid rgba(255, 101, 0, 0.2)',
                borderRadius: 14,
              }}
            />
            <Area yAxisId="count" type="monotone" dataKey="count" stroke="#FF6500" fill="rgba(255,101,0,0.25)" fillOpacity={1} />
            <Line yAxisId="score" type="monotone" dataKey="avgFuckedUpScore" stroke="#FFD166" strokeWidth={2.5} dot={false} />
            <Line yAxisId="score" type="monotone" dataKey="avgDanger" stroke="#FF4D4D" strokeWidth={2} dot={false} />
          </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Timeline notes"
        description="The most recent buckets in the active chronology lens."
      >
        <div className="space-y-3">
          {latestRows.slice(-6).reverse().map((row) => (
            <div key={row.bucket} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{row.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/45">
                    {row.topCategory ?? 'No category'} · {row.topPhaseGroup ?? 'No phase group'}
                  </div>
                </div>
                <div className="text-right text-sm text-foreground/72">
                  <div>{row.count} entries</div>
                  <div className="text-orange-200">Score {row.avgFuckedUpScore.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  );
}
