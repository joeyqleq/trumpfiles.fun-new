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
import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import type { VisualizerLabCategoryLeaderboardItem } from '@/lib/visualizer-lab/types';

interface CategoriesViewProps {
  leaderboard: VisualizerLabCategoryLeaderboardItem[];
}

const COLORS = ['#FF6500', '#F97316', '#FB923C', '#FCD34D', '#F43F5E', '#EF4444', '#FDBA74'];

export default function CategoriesView({ leaderboard }: CategoriesViewProps) {
  const chartRows = leaderboard.slice(0, 8);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
      <ChartPanel
        title="Category leaderboard"
        description="The archive’s most repeated categories, ranked by row count with average score context."
        contentClassName="h-[380px]"
      >
        <div className="h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartRows} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" horizontal={false} />
            <XAxis type="number" stroke="rgba(255,255,255,0.45)" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="category"
              width={170}
              tick={{ fill: 'rgba(255,255,255,0.72)', fontSize: 12 }}
            />
            <Tooltip
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
        title="Category notes"
        description="Where repetition and severity separate from each other."
      >
        <div className="space-y-3">
          {chartRows.slice(0, 5).map((item) => (
            <div key={item.category} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.category}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                    {item.topPhaseGroup ?? 'Unmapped'} · {(item.shareOfRows * 100).toFixed(1)}% of scope
                  </div>
                </div>
                <div className="text-right text-sm text-foreground/72">
                  <div>{item.count} rows</div>
                  <div className="text-orange-200">Score {item.avgFuckedUpScore.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-foreground/58">
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>Danger</div>
                  <div className="mt-1 font-semibold text-red-200">{item.avgDanger.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>Auth</div>
                  <div className="mt-1 font-semibold text-amber-200">{item.avgAuthoritarianism.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                  <div>Law</div>
                  <div className="mt-1 font-semibold text-orange-200">{item.avgLawlessness.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  );
}
