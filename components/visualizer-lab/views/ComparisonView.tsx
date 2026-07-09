import ChartPanel from '@/components/visualizer-lab/ChartPanel';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VisualizerLabComparisonSummary } from '@/lib/visualizer-lab/types';

interface ComparisonViewProps {
  comparisonType: 'category' | 'phaseGroup';
  options: string[];
  leftValue: string | null;
  rightValue: string | null;
  onComparisonTypeChange: (value: 'category' | 'phaseGroup') => void;
  onLeftValueChange: (value: string) => void;
  onRightValueChange: (value: string) => void;
  summary: VisualizerLabComparisonSummary | null;
}

const toSelectValue = (value: string | null | undefined): string => (value ? value : '__unset__');
const fromSelectValue = (value: string): string => (value === '__unset__' ? '' : value);

export default function ComparisonView({
  comparisonType,
  options,
  leftValue,
  rightValue,
  onComparisonTypeChange,
  onLeftValueChange,
  onRightValueChange,
  summary,
}: ComparisonViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <ChartPanel
        title="Cohort comparison"
        description="Pit two slices of the archive against each other and surface where the pressure gap opens up."
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Select value={comparisonType} onValueChange={(value) => onComparisonTypeChange(value as 'category' | 'phaseGroup')}>
              <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-foreground">
                <SelectValue placeholder="Comparison basis" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Compare by</SelectLabel>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="phaseGroup">Phase group</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={toSelectValue(leftValue)} onValueChange={(value) => onLeftValueChange(fromSelectValue(value))}>
              <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-foreground">
                <SelectValue placeholder="Left cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Left cohort</SelectLabel>
                  <SelectItem value="__unset__">Select left cohort</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={toSelectValue(rightValue)} onValueChange={(value) => onRightValueChange(fromSelectValue(value))}>
              <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-foreground">
                <SelectValue placeholder="Right cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Right cohort</SelectLabel>
                  <SelectItem value="__unset__">Select right cohort</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {summary ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{summary.leftLabel}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                        {summary.leftTopCategory ?? 'No category'} · {summary.leftTopPhaseGroup ?? 'No phase group'}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-white/10 bg-black/25 text-foreground/72">
                      {summary.leftCount} rows
                    </Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-500/18 bg-orange-500/[0.05] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{summary.rightLabel}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                        {summary.rightTopCategory ?? 'No category'} · {summary.rightTopPhaseGroup ?? 'No phase group'}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-orange-500/20 bg-black/25 text-orange-200">
                      {summary.rightCount} rows
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-foreground/45">Comparison narrative</div>
                <p className="mt-2 text-sm leading-6 text-foreground/72">{summary.narrative}</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-5 text-sm text-foreground/58">
              Choose two valid cohorts to generate the comparison layer.
            </div>
          )}
        </div>
      </ChartPanel>

      <ChartPanel
        title="Metric deltas"
        description="Which scoring dimensions open the biggest gap between the selected cohorts."
      >
        {summary ? (
          <div className="space-y-3">
            {summary.metricDeltas.slice(0, 6).map((metric) => (
              <div key={metric.metric} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold capitalize text-foreground">
                      {metric.metric.replace(/_/g, ' ')}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/45">
                      {summary.leftLabel}: {metric.leftAverage.toFixed(2)} · {summary.rightLabel}: {metric.rightAverage.toFixed(2)}
                    </div>
                  </div>
                  <div className={`text-sm font-black ${metric.delta >= 0 ? 'text-orange-200' : 'text-sky-200'}`}>
                    {metric.delta >= 0 ? '+' : ''}{metric.delta.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-5 text-sm text-foreground/58">
            Metric deltas appear once both sides of the comparison are populated.
          </div>
        )}
      </ChartPanel>
    </div>
  );
}
