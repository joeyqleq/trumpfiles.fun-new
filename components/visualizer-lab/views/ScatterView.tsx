import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import type { VisualizerLabScatterDataset } from '@/lib/visualizer-lab/types';

interface ScatterViewProps {
  dataset: VisualizerLabScatterDataset;
}

export default function ScatterView({ dataset }: ScatterViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <ChartPanel
        title="Outlier surface"
        description="A scatter readout of entries that break the average profile across the current analytical lens."
        contentClassName="h-[380px]"
      >
        <div className="h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" />
            <XAxis
              type="number"
              dataKey="x"
              name={dataset.xDimension}
              domain={[0, 10]}
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={dataset.yDimension}
              domain={[0, 10]}
              stroke="rgba(255,255,255,0.45)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="bubble" range={[80, 500]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'rgba(10, 10, 10, 0.92)',
                border: '1px solid rgba(255, 101, 0, 0.2)',
                borderRadius: 14,
              }}
            />
            <Scatter data={dataset.points} fill="#FF6500" fillOpacity={0.7} />
          </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Lead outliers"
        description="The entries with the strongest multi-axis deviation from the field."
      >
        <div className="space-y-3">
          {dataset.points.slice(0, 6).map((point) => (
            <div key={point.entry_number} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">#{point.entry_number} · {point.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                    {point.category} · {point.phase_group}
                  </div>
                </div>
                <div className="text-right text-xs text-foreground/58">
                  <div>Outlier {point.outlier_score.toFixed(3)}</div>
                  <div className="mt-1 text-orange-200">Score {point.fucked_up_score.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-foreground/58">
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>{dataset.xDimension}</div>
                  <div className="mt-1 font-semibold text-orange-100">{point.x.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>{dataset.yDimension}</div>
                  <div className="mt-1 font-semibold text-orange-100">{point.y.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>{dataset.bubbleMetric}</div>
                  <div className="mt-1 font-semibold text-orange-100">{point.bubble.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  );
}
