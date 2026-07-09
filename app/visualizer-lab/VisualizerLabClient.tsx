"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';
import PageDecorations from '@/components/PageDecorations';
import LabHeader from '@/components/visualizer-lab/LabHeader';
import CommandSurface from '@/components/visualizer-lab/CommandSurface';
import KpiStrip from '@/components/visualizer-lab/KpiStrip';
import InsightRail from '@/components/visualizer-lab/InsightRail';
import EvidenceRail from '@/components/visualizer-lab/EvidenceRail';
import OverviewView from '@/components/visualizer-lab/views/OverviewView';
import TimelineView from '@/components/visualizer-lab/views/TimelineView';
import CategoriesView from '@/components/visualizer-lab/views/CategoriesView';
import PressureMatrixView from '@/components/visualizer-lab/views/PressureMatrixView';
import ScatterView from '@/components/visualizer-lab/views/ScatterView';
import ThemesView from '@/components/visualizer-lab/views/ThemesView';
import ComparisonView from '@/components/visualizer-lab/views/ComparisonView';
import {
  buildCategoryLeaderboard,
  buildComparisonCohort,
  buildComparisonSummary,
  buildEvidenceSubset,
  buildOverviewMetrics,
  buildPressureMatrix,
  buildScatterDataset,
  buildThemeAggregation,
  buildTimelineSeries,
  filterRows,
  sortRowsByChronology,
} from '@/lib/visualizer-lab/selectors';
import {
  buildCategoryInsight,
  buildComparisonInsight,
  buildOverviewInsight,
  buildPressureMatrixInsight,
  buildScatterInsight,
  buildThemeInsight,
  buildTimelineInsight,
} from '@/lib/visualizer-lab/insights';
import {
  LAB_PHASE_GROUPS,
  type LabChronologyMode,
  type LabPhaseGroup,
  type LabViewKey,
  type VisualizerLabFilters,
  type VisualizerLabInsight,
  type VisualizerLabRow,
} from '@/lib/visualizer-lab/types';

const emptyFilters = (): VisualizerLabFilters => ({
  search: '',
  category: null,
  phaseGroup: null,
  keyword: '',
  minScore: {},
});

const getUniqueValues = (rows: VisualizerLabRow[], key: 'category' | 'phase_group'): string[] => {
  const values = new Set<string>();

  rows.forEach((row) => {
    const value = key === 'category' ? row.category : row.phase_group;

    if (value) {
      values.add(value);
    }
  });

  return [...values].sort((a, b) => a.localeCompare(b));
};

const pruneFilterValue = (value: string): string => value.trim();

export default function VisualizerLabClient({ totalCount }: { totalCount: number }) {
  const [rows, setRows] = useState<VisualizerLabRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chronology, setChronology] = useState<LabChronologyMode>('archive');
  const [activeView, setActiveView] = useState<LabViewKey>('overview');
  const [filters, setFilters] = useState<VisualizerLabFilters>(emptyFilters);
  const [comparisonType, setComparisonType] = useState<'category' | 'phaseGroup'>('category');
  const [leftComparisonValue, setLeftComparisonValue] = useState<string | null>(null);
  const [rightComparisonValue, setRightComparisonValue] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRows = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/visualizer-lab-data');

        if (!response.ok) {
          throw new Error('Failed to load visualizer lab data.');
        }

        const data = (await response.json()) as VisualizerLabRow[];

        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unknown data loading error.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRows();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => getUniqueValues(rows, 'category'), [rows]);
  const phaseGroups = useMemo(() => LAB_PHASE_GROUPS.filter((phaseGroup) => rows.some((row) => row.phase_group === phaseGroup)), [rows]);
  const themeOptions = useMemo(
    () => buildThemeAggregation(rows, { limit: 12, minCount: 12 }).themes.map((theme) => theme.theme),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const scopedFilters: VisualizerLabFilters = {
      ...filters,
      search: pruneFilterValue(filters.search ?? ''),
      keyword: pruneFilterValue(filters.keyword ?? ''),
    };

    return sortRowsByChronology(filterRows(rows, scopedFilters), chronology, 'desc');
  }, [chronology, filters, rows]);

  const displayTotalCount = loading ? totalCount : rows.length;
  const scopedTotalCount = loading ? totalCount : filteredRows.length;

  const overviewMetrics = useMemo(() => buildOverviewMetrics(filteredRows, chronology), [chronology, filteredRows]);
  const timelineSeries = useMemo(() => buildTimelineSeries(filteredRows, { chronology }), [chronology, filteredRows]);
  const categoryLeaderboard = useMemo(() => buildCategoryLeaderboard(filteredRows, { limit: 10 }), [filteredRows]);
  const pressureMatrix = useMemo(() => buildPressureMatrix(filteredRows, { topCategoriesLimit: 6 }), [filteredRows]);
  const scatterDataset = useMemo(
    () => buildScatterDataset(filteredRows, { chronology, xDimension: 'danger', yDimension: 'authoritarianism', bubbleMetric: 'fucked_up_score', limit: 80 }),
    [chronology, filteredRows],
  );
  const themeAggregation = useMemo(() => buildThemeAggregation(filteredRows, { limit: 12, minCount: 5 }), [filteredRows]);

  const comparisonOptions = comparisonType === 'category' ? categories : phaseGroups;

  useEffect(() => {
    if (comparisonOptions.length === 0) {
      setLeftComparisonValue(null);
      setRightComparisonValue(null);
      return;
    }

    if (!leftComparisonValue || !comparisonOptions.includes(leftComparisonValue)) {
      setLeftComparisonValue(comparisonOptions[0]);
    }

    if (!rightComparisonValue || !comparisonOptions.includes(rightComparisonValue) || rightComparisonValue === leftComparisonValue) {
      const fallback = comparisonOptions.find((option) => option !== (leftComparisonValue ?? comparisonOptions[0])) ?? comparisonOptions[0];
      setRightComparisonValue(fallback);
    }
  }, [comparisonOptions, leftComparisonValue, rightComparisonValue]);

  const comparisonSummary = useMemo(() => {
    if (!leftComparisonValue || !rightComparisonValue || leftComparisonValue === rightComparisonValue) {
      return null;
    }

    if (comparisonType === 'category') {
      return buildComparisonSummary(
        buildComparisonCohort(leftComparisonValue, filteredRows, { category: leftComparisonValue }),
        buildComparisonCohort(rightComparisonValue, filteredRows, { category: rightComparisonValue }),
      );
    }

    return buildComparisonSummary(
      buildComparisonCohort(leftComparisonValue, filteredRows, { phaseGroup: leftComparisonValue as LabPhaseGroup }),
      buildComparisonCohort(rightComparisonValue, filteredRows, { phaseGroup: rightComparisonValue as LabPhaseGroup }),
    );
  }, [comparisonType, filteredRows, leftComparisonValue, rightComparisonValue]);

  const activeInsight = useMemo<VisualizerLabInsight>(() => {
    switch (activeView) {
      case 'timeline':
        return buildTimelineInsight(timelineSeries, chronology);
      case 'categories':
        return buildCategoryInsight(filteredRows);
      case 'matrix':
        return buildPressureMatrixInsight(pressureMatrix);
      case 'scatter':
        return buildScatterInsight(scatterDataset);
      case 'themes':
        return buildThemeInsight(themeAggregation);
      case 'comparison':
        return comparisonSummary ? buildComparisonInsight(comparisonSummary) : buildOverviewInsight(filteredRows, chronology);
      case 'overview':
      default:
        return buildOverviewInsight(filteredRows, chronology);
    }
  }, [activeView, chronology, comparisonSummary, filteredRows, pressureMatrix, scatterDataset, themeAggregation, timelineSeries]);

  const evidenceItems = useMemo(() => {
    if (activeView === 'comparison' && comparisonSummary && comparisonSummary.moreIntenseCohort) {
      if (comparisonType === 'category') {
        return buildEvidenceSubset(filteredRows, {
          activeView: 'comparison',
          chronology,
          filters: { ...filters, category: comparisonSummary.moreIntenseCohort },
        });
      }

      return buildEvidenceSubset(filteredRows, {
        activeView: 'comparison',
        chronology,
        filters: { ...filters, phaseGroup: comparisonSummary.moreIntenseCohort as LabPhaseGroup },
      });
    }

    return buildEvidenceSubset(filteredRows, {
      activeView,
      chronology,
      filters,
      highlightedCategory: activeView === 'categories' ? categoryLeaderboard[0]?.category ?? null : null,
      highlightedPhaseGroup: activeView === 'overview' ? overviewMetrics.topPhaseGroup : null,
      highlightedTheme: activeView === 'themes' ? themeAggregation.themes[0]?.theme ?? null : null,
      xDimension: 'danger',
      yDimension: 'authoritarianism',
    });
  }, [activeView, categoryLeaderboard, chronology, comparisonSummary, comparisonType, filteredRows, filters, overviewMetrics.topPhaseGroup, themeAggregation]);

  const updateFilters = (updater: (current: VisualizerLabFilters) => VisualizerLabFilters) => {
    setFilters((current) => updater(current));
  };

  const resetInvestigation = () => {
    setChronology('archive');
    setActiveView('overview');
    setFilters(emptyFilters());
    setComparisonType('category');
    setLeftComparisonValue(null);
    setRightComparisonValue(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'timeline':
        return <TimelineView rows={timelineSeries} chronology={chronology} />;
      case 'categories':
        return <CategoriesView leaderboard={categoryLeaderboard} />;
      case 'matrix':
        return <PressureMatrixView matrix={pressureMatrix} />;
      case 'scatter':
        return <ScatterView dataset={scatterDataset} />;
      case 'themes':
        return <ThemesView aggregation={themeAggregation} />;
      case 'comparison':
        return (
          <ComparisonView
            comparisonType={comparisonType}
            options={comparisonOptions}
            leftValue={leftComparisonValue}
            rightValue={rightComparisonValue}
            onComparisonTypeChange={setComparisonType}
            onLeftValueChange={setLeftComparisonValue}
            onRightValueChange={setRightComparisonValue}
            summary={comparisonSummary}
          />
        );
      case 'overview':
      default:
        return <OverviewView metrics={overviewMetrics} leaderboard={categoryLeaderboard} />;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <PageDecorations variant="visualizer" />
      <div className="container relative z-10 mx-auto max-w-[1560px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-6"
        >
          <LabHeader
            totalCount={displayTotalCount}
            chronology={chronology}
            activeView={activeView}
            filters={filters}
            onReset={resetInvestigation}
          />

          <CommandSurface
            chronology={chronology}
            activeView={activeView}
            filters={filters}
            categories={categories}
            phaseGroups={phaseGroups}
            themeOptions={themeOptions}
            onChronologyChange={setChronology}
            onViewChange={setActiveView}
            onSearchChange={(value) => updateFilters((current) => ({ ...current, search: value }))}
            onCategoryChange={(value) => updateFilters((current) => ({ ...current, category: value }))}
            onPhaseGroupChange={(value) => updateFilters((current) => ({ ...current, phaseGroup: value as LabPhaseGroup | null }))}
            onKeywordChange={(value) => updateFilters((current) => ({ ...current, keyword: value }))}
            onMinScoreChange={(value) => updateFilters((current) => ({ ...current, minScore: { ...current.minScore, fucked_up_score: value <= 0 ? undefined : value } }))}
            onMinDangerChange={(value) => updateFilters((current) => ({ ...current, minScore: { ...current.minScore, danger: value <= 0 ? undefined : value } }))}
            onReset={resetInvestigation}
          />

          {loading ? (
            <div className="glass-card flex min-h-[420px] items-center justify-center rounded-3xl border border-orange-500/20 bg-black/55">
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="size-10 animate-spin text-orange-300" />
                <div>
                  <div className="text-lg font-semibold text-foreground">Loading visualizer lab data…</div>
                  <div className="mt-1 text-sm text-foreground/60">Preparing the archive-first staging layer.</div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="glass-card rounded-3xl border border-red-500/20 bg-black/55 p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                  <AlertTriangle className="size-5 text-red-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-100">The staging visualizer could not load.</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/72">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <KpiStrip metrics={overviewMetrics} />

              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-sm text-foreground/65">
                    <div>
                      <span className="font-semibold text-foreground">{scopedTotalCount.toLocaleString()}</span> rows in scope after filters.
                    </div>
                    <div className="font-mono text-xs text-orange-200">view:{activeView} · chronology:{chronology}</div>
                  </div>
                  {renderActiveView()}
                </div>

                <div className="space-y-4">
                  <InsightRail insight={activeInsight} chronology={chronology} activeView={activeView} />
                  <EvidenceRail items={evidenceItems} chronology={chronology} />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
