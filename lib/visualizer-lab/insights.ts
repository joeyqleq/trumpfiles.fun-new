import {
  type LabChronologyMode,
  type LabDimension,
  type LabScoreKey,
  type VisualizerLabComparisonSummary,
  type VisualizerLabInsight,
  type VisualizerLabPressureMatrix,
  type VisualizerLabRow,
  type VisualizerLabScatterDataset,
  type VisualizerLabThemeAggregation,
  type VisualizerLabTimelinePoint,
} from '@/lib/visualizer-lab/types';
import {
  buildCategoryLeaderboard,
  buildComparisonSummary,
  buildOverviewMetrics,
  buildPressureMatrix,
  buildScatterDataset,
  buildThemeAggregation,
  buildTimelineSeries,
  getScoreValue,
} from '@/lib/visualizer-lab/selectors';

export interface VisualizerLabInsightsBundle {
  overview: VisualizerLabInsight;
  timeline: VisualizerLabInsight;
  categories: VisualizerLabInsight;
  matrix: VisualizerLabInsight;
  scatter: VisualizerLabInsight;
  themes: VisualizerLabInsight;
  comparison: VisualizerLabInsight;
}

const IMPORTANT_DIMENSIONS: LabDimension[] = [
  'danger',
  'authoritarianism',
  'lawlessness',
  'insanity',
  'absurdity',
  'credibility_risk',
  'impact_scope',
  'recency_intensity',
];

const roundTo = (value: number, digits: number = 2): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(digits));
};

const metricLabel = (metric: LabScoreKey | LabDimension): string => {
  if (metric === 'fucked_up_score') {
    return 'overall score';
  }

  return metric.replace(/_/g, ' ');
};

const titleCase = (value: string): string => {
  return value
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const mean = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const dominantDimensionFromRows = (rows: VisualizerLabRow[]): LabDimension => {
  return IMPORTANT_DIMENSIONS
    .map((dimension) => ({
      dimension,
      average: mean(rows.map((row) => getScoreValue(row, dimension))),
    }))
    .sort((a, b) => {
      if (b.average !== a.average) {
        return b.average - a.average;
      }

      return a.dimension.localeCompare(b.dimension);
    })[0]?.dimension ?? 'danger';
};

const buildEmptyInsight = (headline: string): VisualizerLabInsight => ({
  headline,
  whatStandsOut: ['No matching rows are available yet.'],
  whyItMatters: 'Without rows in scope, the lab cannot distinguish signal from absence.',
  whatToInspectNext: ['Relax the filters or verify that staging data loaded correctly.'],
});

const getChronologyLabel = (chronology: LabChronologyMode): string => {
  return chronology === 'archive' ? 'archive chronology' : 'event chronology';
};

const describeSpread = (values: number[]): { min: number; max: number } => {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: roundTo(Math.min(...values)),
    max: roundTo(Math.max(...values)),
  };
};

const topMetricDelta = (summary: VisualizerLabComparisonSummary) => {
  return summary.metricDeltas[0] ?? null;
};

export function buildOverviewInsight(
  rows: VisualizerLabRow[],
  chronology: LabChronologyMode = 'archive',
): VisualizerLabInsight {
  if (rows.length === 0) {
    return buildEmptyInsight('No lab rows matched the overview scope.');
  }

  const metrics = buildOverviewMetrics(rows, chronology);
  const dominantDimension = dominantDimensionFromRows(rows);

  return {
    headline: `${metrics.totalEntries} entries sit in scope; ${metrics.topCategory ?? 'no category'} carries the heaviest load in ${getChronologyLabel(chronology)}.`,
    whatStandsOut: [
      `${metrics.topPhaseGroup ?? 'No phase group'} is the leading phase bucket with ${metrics.topPhaseGroupCount} rows.`,
      `Average overall score lands at ${metrics.avgFuckedUpScore}, with ${metricLabel(dominantDimension)} as the sharpest average pressure point.`,
      metrics.highestScoreEntry
        ? `Entry #${metrics.highestScoreEntry.entry_number} is the hottest single record at ${metrics.highestScoreEntry.fucked_up_score}.`
        : 'No single entry currently rises above the field.',
    ],
    whyItMatters: `The overview fixes the baseline before any chart slicing: volume tells you where the current chronology lens keeps returning, while ${metricLabel(dominantDimension)} shows where the average threat profile is hardest.`,
    whatToInspectNext: [
      metrics.highestScoreEntry
        ? `Pull the evidence subset around entry #${metrics.highestScoreEntry.entry_number} to see whether the outlier is isolated or part of a wider cluster.`
        : 'Inspect the top evidence subset to identify the current anchor records.',
      `Flip to ${chronology === 'archive' ? 'event chronology' : 'archive chronology'} to see whether filing order and event order tell the same story.`,
      metrics.topCategory ? `Break out ${metrics.topCategory} against the rest of the leaderboard for a category-level pressure check.` : 'Review the category leaderboard for the first clear concentration point.',
    ],
  };
}

export function buildTimelineInsight(
  series: VisualizerLabTimelinePoint[],
  chronology: LabChronologyMode = 'archive',
): VisualizerLabInsight {
  if (series.length === 0) {
    return buildEmptyInsight('No timeline buckets were produced for the current scope.');
  }

  const peakByCount = [...series].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return b.avgFuckedUpScore - a.avgFuckedUpScore;
  })[0];

  const hottestBucket = [...series].sort((a, b) => {
    if (b.avgFuckedUpScore !== a.avgFuckedUpScore) {
      return b.avgFuckedUpScore - a.avgFuckedUpScore;
    }

    return b.count - a.count;
  })[0];

  return {
    headline: `${peakByCount.label} is the densest ${getChronologyLabel(chronology)} bucket with ${peakByCount.count} entries.`,
    whatStandsOut: [
      `${hottestBucket.label} runs hottest on overall score at ${hottestBucket.avgFuckedUpScore}.`,
      `${peakByCount.label} is dominated by ${peakByCount.topCategory ?? 'no category'} and anchored by ${peakByCount.topPhaseGroup ?? 'no phase group'}.`,
      `The series spans ${series[0].label} through ${series.at(-1)?.label ?? series[0].label}.`,
    ],
    whyItMatters: `Timeline concentration shows when the archive thickens and whether the fiercest material arrives in bursts or through long accumulation. Comparing archive order to event order also exposes filing lag versus historical timing.`,
    whatToInspectNext: [
      `Inspect evidence from ${peakByCount.label} to see what drives the volume spike.`,
      `Contrast ${peakByCount.label} with ${hottestBucket.label} if the busiest bucket is not the fiercest one.`,
      'Check whether undated rows are hiding a secondary cluster that needs cleanup.',
    ],
  };
}

export function buildCategoryInsight(rows: VisualizerLabRow[]): VisualizerLabInsight {
  if (rows.length === 0) {
    return buildEmptyInsight('No category data is available for the current scope.');
  }

  const leaderboard = buildCategoryLeaderboard(rows, { limit: 5 });
  const leader = leaderboard[0];
  const hottest = [...leaderboard].sort((a, b) => {
    if (b.avgFuckedUpScore !== a.avgFuckedUpScore) {
      return b.avgFuckedUpScore - a.avgFuckedUpScore;
    }

    return b.count - a.count;
  })[0];
  const runnerUp = leaderboard[1];

  return {
    headline: `${leader.category} leads the board with ${leader.count} entries and an average score of ${leader.avgFuckedUpScore}.`,
    whatStandsOut: [
      runnerUp ? `${leader.category} clears ${runnerUp.category} by ${leader.count - runnerUp.count} rows.` : `${leader.category} stands alone as the only category in scope.`,
      `${hottest.category} is the most intense category by average score at ${hottest.avgFuckedUpScore}.`,
      `${leader.category} is most concentrated in ${leader.topPhaseGroup ?? 'no clear phase group'}.`,
    ],
    whyItMatters: `The leaderboard separates repeat behavior from one-off spectacle. A category that dominates by count is the archive's recurring pattern; a category that leads by intensity signals sharper but possibly narrower spikes.`,
    whatToInspectNext: [
      `Compare ${leader.category} and ${hottest.category} to see whether breadth and severity are converging or splitting apart.`,
      'Use the pressure matrix to identify which scoring dimension is driving the category lead.',
      'Pull evidence from the top two categories before broadening back out.',
    ],
  };
}

export function buildPressureMatrixInsight(matrix: VisualizerLabPressureMatrix): VisualizerLabInsight {
  if (matrix.cells.length === 0) {
    return buildEmptyInsight('No pressure-matrix cells were produced for the current scope.');
  }

  const hottestCell = [...matrix.cells].sort((a, b) => {
    if (b.average !== a.average) {
      return b.average - a.average;
    }

    return a.category.localeCompare(b.category);
  })[0];

  const dominantDimension = matrix.dimensions
    .map((dimension) => ({
      dimension,
      average: mean(matrix.cells.filter((cell) => cell.dimension === dimension).map((cell) => cell.average)),
    }))
    .sort((a, b) => {
      if (b.average !== a.average) {
        return b.average - a.average;
      }

      return a.dimension.localeCompare(b.dimension);
    })[0];

  return {
    headline: `${hottestCell.category} peaks hardest on ${metricLabel(hottestCell.dimension)} at ${hottestCell.average}.`,
    whatStandsOut: [
      `${metricLabel(dominantDimension.dimension)} is the strongest cross-category dimension at an average of ${roundTo(dominantDimension.average)}.`,
      `${matrix.categories.length} categories are represented across ${matrix.dimensions.length} tracked dimensions.`,
      `The hottest cell still sits inside a field, which helps separate broad pressure from a single category spike.`,
    ],
    whyItMatters: `The matrix shows whether a category is bad across the board or whether it concentrates in one signature failure mode. That matters when you want to distinguish systemic pattern from specialty offense.`,
    whatToInspectNext: [
      `Trace ${hottestCell.category} into the category leaderboard and evidence subset.`,
      `Compare ${metricLabel(hottestCell.dimension)} against the next-highest category cell to see if the lead is narrow or runaway.`,
      'Check whether the dominant dimension stays dominant when you filter by phase group.',
    ],
  };
}

export function buildScatterInsight(dataset: VisualizerLabScatterDataset): VisualizerLabInsight {
  if (dataset.points.length === 0) {
    return buildEmptyInsight('No scatter points were produced for the current scope.');
  }

  const leadOutlier = dataset.points[0];
  const xSpread = describeSpread(dataset.points.map((point) => point.x));
  const ySpread = describeSpread(dataset.points.map((point) => point.y));
  const highHighCount = dataset.points.filter((point) => point.x >= 7 && point.y >= 7).length;

  return {
    headline: `Entry #${leadOutlier.entry_number} is the cleanest outlier on ${metricLabel(dataset.xDimension)} × ${metricLabel(dataset.yDimension)}.`,
    whatStandsOut: [
      `${highHighCount} points sit in the high-high quadrant at 7+ on both axes.`,
      `${metricLabel(dataset.xDimension)} ranges from ${xSpread.min} to ${xSpread.max}; ${metricLabel(dataset.yDimension)} ranges from ${ySpread.min} to ${ySpread.max}.`,
      `${leadOutlier.category} / ${leadOutlier.phase_group} produces the lead outlier with an overall score of ${leadOutlier.fucked_up_score}.`,
    ],
    whyItMatters: `Scatter outliers are where unusual combinations show up. They matter because the archive is not just about high scores; it is about which dimensions spike together and break the pattern.`,
    whatToInspectNext: [
      `Open the evidence around entry #${leadOutlier.entry_number} and nearby outliers to test whether the cluster is real or driven by one record.`,
      `Swap ${metricLabel(dataset.yDimension)} for another dimension to see whether the same points keep surfacing.`,
      'Check whether high-high quadrant entries collapse into one category or spread across several.',
    ],
  };
}

export function buildThemeInsight(aggregation: VisualizerLabThemeAggregation): VisualizerLabInsight {
  if (aggregation.themes.length === 0) {
    return buildEmptyInsight('No theme aggregation was produced for the current scope.');
  }

  const topTheme = aggregation.themes[0];
  const hottestTheme = [...aggregation.themes].sort((a, b) => {
    if (b.avgFuckedUpScore !== a.avgFuckedUpScore) {
      return b.avgFuckedUpScore - a.avgFuckedUpScore;
    }

    return b.count - a.count;
  })[0];

  return {
    headline: `${titleCase(topTheme.theme)} is the dominant theme with ${topTheme.count} matching entries.`,
    whatStandsOut: [
      `${titleCase(hottestTheme.theme)} runs hottest by average score at ${hottestTheme.avgFuckedUpScore}.`,
      `${titleCase(topTheme.theme)} is most common inside ${topTheme.topCategory ?? 'no category'} and ${topTheme.topPhaseGroup ?? 'no phase group'}.`,
      `${aggregation.uniqueThemeCount} recurring themes remain after deterministic keyword bucketing.`,
    ],
    whyItMatters: `Theme aggregation shows which ideas keep repeating across categories and phases. Repetition is useful because it highlights narrative infrastructure, not just isolated incidents.`,
    whatToInspectNext: [
      `Review sample entries for ${titleCase(topTheme.theme)} to see whether the shared keyword points to a real pattern or a tagging artifact.`,
      `Compare ${titleCase(topTheme.theme)} with ${titleCase(hottestTheme.theme)} if frequency and severity diverge.`,
      'Filter the same themes by phase group to see whether the narrative migrates over time.',
    ],
  };
}

export function buildComparisonInsight(summary: VisualizerLabComparisonSummary): VisualizerLabInsight {
  if (summary.leftCount === 0 && summary.rightCount === 0) {
    return buildEmptyInsight('No cohorts are populated for comparison.');
  }

  const leadDelta = topMetricDelta(summary);
  const intensityLead = summary.moreIntenseCohort ?? 'Neither cohort';

  return {
    headline: `${intensityLead} carries the harsher overall profile in the current cohort split.`,
    whatStandsOut: [
      `${summary.leftLabel} has ${summary.leftCount} rows; ${summary.rightLabel} has ${summary.rightCount}.`,
      leadDelta
        ? `${metricLabel(leadDelta.metric)} is the biggest separation point at ${roundTo(leadDelta.delta)} points.`
        : 'No clear metric gap rises above the rest.',
      `${summary.leftLabel} is led by ${summary.leftTopCategory ?? 'no category'} / ${summary.leftTopPhaseGroup ?? 'no phase group'}, while ${summary.rightLabel} is led by ${summary.rightTopCategory ?? 'no category'} / ${summary.rightTopPhaseGroup ?? 'no phase group'}.`,
    ],
    whyItMatters: `Cohort comparison turns filters into an argument: not just which side is larger, but which side is structurally harsher and on what dimension the split actually opens up.`,
    whatToInspectNext: [
      summary.narrative,
      leadDelta
        ? `Inspect the cohort entries around ${metricLabel(leadDelta.metric)} to find the records creating the gap.`
        : 'Inspect the evidence subsets side by side to see whether the similarity is real or just averaging noise away.',
      'Re-run the comparison with archive chronology and event chronology in turn to check whether timing changes the split.',
    ],
  };
}

export function buildLabInsights(
  rows: VisualizerLabRow[],
  options: {
    chronology?: LabChronologyMode;
    comparison?: VisualizerLabComparisonSummary;
  } = {},
): VisualizerLabInsightsBundle {
  const chronology = options.chronology ?? 'archive';
  const comparison = options.comparison ?? buildComparisonSummary(
    { label: 'All rows', rows },
    { label: 'Top quartile', rows: [...rows].sort((a, b) => getScoreValue(b, 'fucked_up_score') - getScoreValue(a, 'fucked_up_score')).slice(0, Math.max(1, Math.ceil(rows.length / 4))) },
  );

  return {
    overview: buildOverviewInsight(rows, chronology),
    timeline: buildTimelineInsight(buildTimelineSeries(rows, { chronology }), chronology),
    categories: buildCategoryInsight(rows),
    matrix: buildPressureMatrixInsight(buildPressureMatrix(rows, { topCategoriesLimit: 6 })),
    scatter: buildScatterInsight(buildScatterDataset(rows, { chronology })),
    themes: buildThemeInsight(buildThemeAggregation(rows, { limit: 10, minCount: 2 })),
    comparison: buildComparisonInsight(comparison),
  };
}
