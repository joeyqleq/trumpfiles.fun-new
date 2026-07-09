import { Search, Radar, CalendarClock, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LAB_PHASE_GROUPS,
  type LabChronologyMode,
  type LabViewKey,
  type VisualizerLabFilters,
} from '@/lib/visualizer-lab/types';

interface CommandSurfaceProps {
  chronology: LabChronologyMode;
  activeView: LabViewKey;
  filters: VisualizerLabFilters;
  categories: string[];
  phaseGroups?: readonly string[];
  themeOptions: string[];
  onChronologyChange: (value: LabChronologyMode) => void;
  onViewChange: (value: LabViewKey) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onPhaseGroupChange: (value: string | null) => void;
  onKeywordChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
  onMinDangerChange: (value: number) => void;
  onReset: () => void;
}

const chronologyOptions: Array<{ value: LabChronologyMode; label: string }> = [
  { value: 'archive', label: 'Archive chronology' },
  { value: 'event', label: 'Event chronology' },
];

const viewOptions: Array<{ value: LabViewKey; label: string; blurb: string }> = [
  { value: 'overview', label: 'Pulse', blurb: 'Baseline field conditions' },
  { value: 'timeline', label: 'Timeline', blurb: 'Archive vs event movement' },
  { value: 'categories', label: 'Categories', blurb: 'Leaderboard and concentration' },
  { value: 'matrix', label: 'Matrix', blurb: 'Category × dimension pressure' },
  { value: 'scatter', label: 'Outliers', blurb: 'Escalation and anomaly surface' },
  { value: 'themes', label: 'Themes', blurb: 'Recurring narrative infrastructure' },
  { value: 'comparison', label: 'Comparison', blurb: 'Cohort splits and deltas' },
];

const toSelectValue = (value: string | null | undefined): string => value ?? '__all__';
const fromSelectValue = (value: string): string | null => (value === '__all__' ? null : value);

const activeChipCount = (filters: VisualizerLabFilters): number => {
  let count = 0;

  if (filters.search) count += 1;
  if (filters.category) count += 1;
  if (filters.phaseGroup) count += 1;
  if (filters.keyword) count += 1;
  if (filters.minScore?.fucked_up_score) count += 1;
  if (filters.minScore?.danger) count += 1;

  return count;
};

export default function CommandSurface({
  chronology,
  activeView,
  filters,
  categories,
  phaseGroups = LAB_PHASE_GROUPS,
  themeOptions,
  onChronologyChange,
  onViewChange,
  onSearchChange,
  onCategoryChange,
  onPhaseGroupChange,
  onKeywordChange,
  onMinScoreChange,
  onMinDangerChange,
  onReset,
}: CommandSurfaceProps) {
  const minScoreValue = filters.minScore?.fucked_up_score ?? 0;
  const minDangerValue = filters.minScore?.danger ?? 0;

  return (
    <div className="glass-card rounded-2xl border border-orange-500/25 bg-black/60 p-4 shadow-[0_0_35px_rgba(255,101,0,0.08)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-orange-500/35 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-orange-200">
              <Filter className="size-3.5" />
              Analyst controls
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-white/5 text-foreground/70">
              {activeChipCount(filters)} active filter{activeChipCount(filters) === 1 ? '' : 's'}
            </Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="justify-start text-foreground/65 hover:bg-white/5 hover:text-orange-200 xl:justify-center"
          >
            <RotateCcw className="size-4" />
            Reset controls
          </Button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-white/8 bg-black/35 p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-orange-300/75">
              <Search className="size-3.5" />
              Query surface
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Input
                value={filters.search ?? ''}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles, categories, keywords"
                className="border-white/10 bg-black/30 text-sm text-foreground placeholder:text-foreground/35 md:col-span-2 xl:col-span-2"
              />

              <Select value={toSelectValue(filters.category)} onValueChange={(value) => onCategoryChange(fromSelectValue(value))}>
                <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-foreground">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="__all__">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
              </Select>

              <Select value={toSelectValue(filters.phaseGroup)} onValueChange={(value) => onPhaseGroupChange(fromSelectValue(value))}>
                <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-foreground">
                  <SelectValue placeholder="Phase group" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                  <SelectLabel>Phase groups</SelectLabel>
                  <SelectItem value="__all__">All phase groups</SelectItem>
                  {phaseGroups.map((phaseGroup) => (
                    <SelectItem key={phaseGroup} value={phaseGroup}>
                      {phaseGroup}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
              </Select>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Input
                value={filters.keyword ?? ''}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder={themeOptions.length > 0 ? `Theme keyword, e.g. ${themeOptions[0]}` : 'Theme keyword'}
                className="border-white/10 bg-black/30 text-sm text-foreground placeholder:text-foreground/35 md:col-span-2"
              />

              <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-foreground/55">
                  <span>Minimum score</span>
                  <span className="font-mono text-orange-200">{minScoreValue}</span>
                </div>
                <div className="mt-3">
                  <Slider
                    value={[minScoreValue]}
                    onValueChange={([value]) => onMinScoreChange(value)}
                    min={0}
                    max={10}
                    step={0.25}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-foreground/55">
                  <span>Minimum danger</span>
                  <span className="font-mono text-orange-200">{minDangerValue}</span>
                </div>
                <div className="mt-3">
                  <Slider
                    value={[minDangerValue]}
                    onValueChange={([value]) => onMinDangerChange(value)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/35 p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-orange-300/75">
              <CalendarClock className="size-3.5" />
              Chronology + lens
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {chronologyOptions.map((option) => {
                  const isActive = chronology === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onChronologyChange(option.value)}
                      className={isActive
                        ? 'border-orange-500/40 bg-orange-500/12 text-orange-100 hover:bg-orange-500/16'
                        : 'border-white/10 bg-black/30 text-foreground/70 hover:bg-white/6'}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {viewOptions.map((option) => {
                  const isActive = activeView === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onViewChange(option.value)}
                      className={isActive
                        ? 'rounded-xl border border-orange-500/40 bg-orange-500/12 p-3 text-left shadow-[0_0_18px_rgba(255,101,0,0.08)]'
                        : 'rounded-xl border border-white/8 bg-black/20 p-3 text-left transition-colors hover:border-white/15 hover:bg-white/5'}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Radar className={`size-4 ${isActive ? 'text-orange-300' : 'text-foreground/45'}`} />
                        {option.label}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-foreground/55">{option.blurb}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
