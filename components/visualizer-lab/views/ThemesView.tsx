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
import type { VisualizerLabThemeAggregation } from '@/lib/visualizer-lab/types';

interface ThemesViewProps {
  aggregation: VisualizerLabThemeAggregation;
}

const COLORS = ['#FF6500', '#FB923C', '#F59E0B', '#FACC15', '#E879F9', '#F87171'];

const prettifyTheme = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

export default function ThemesView({ aggregation }: ThemesViewProps) {
  const themeRows = aggregation.themes.slice(0, 10).map((theme) => ({
    ...theme,
    label: prettifyTheme(theme.theme),
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
      <ChartPanel
        title="Recurring theme infrastructure"
        description="Keyword-derived clusters that keep surfacing across categories and phases."
        contentClassName="h-[380px]"
      >
        <div className="h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={themeRows} layout="vertical" margin={{ top: 8, right: 12, left: 16, bottom: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" horizontal={false} />
            <XAxis type="number" stroke="rgba(255,255,255,0.45)" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
            <YAxis type="category" dataKey="label" width={190} tick={{ fill: 'rgba(255,255,255,0.72)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(10, 10, 10, 0.92)',
                border: '1px solid rgba(255, 101, 0, 0.2)',
                borderRadius: 14,
              }}
            />
            <Bar dataKey="count" radius={[0, 12, 12, 0]}>
              {themeRows.map((theme, index) => (
                <Cell key={theme.theme} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Theme notes"
        description="How repetition, severity, and category concentration interact."
      >
        <div className="space-y-3">
          {themeRows.slice(0, 5).map((theme) => (
            <div key={theme.theme} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{theme.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                    {theme.topCategory ?? 'No category'} · {theme.topPhaseGroup ?? 'No phase group'}
                  </div>
                </div>
                <div className="text-right text-xs text-foreground/58">
                  <div>{theme.count} rows</div>
                  <div className="mt-1 text-orange-200">Score {theme.avgFuckedUpScore.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-3 text-sm leading-6 text-foreground/72">
                Covers {(theme.shareOfRows * 100).toFixed(1)}% of the active scope. Sample entries: {theme.sampleEntryNumbers.join(', ')}.
              </div>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  );
}
