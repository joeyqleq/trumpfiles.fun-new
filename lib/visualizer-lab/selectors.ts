import {
  LAB_DIMENSIONS,
  type LabChronologyMode,
  type LabDimension,
  type LabPhaseGroup,
  type LabScoreKey,
  type VisualizerLabCategoryLeaderboardItem,
  type VisualizerLabComparisonCohort,
  type VisualizerLabComparisonMetricDelta,
  type VisualizerLabComparisonSummary,
  type VisualizerLabEvidenceItem,
  type VisualizerLabEvidenceOptions,
  type VisualizerLabFilters,
  type VisualizerLabOverviewMetrics,
  type VisualizerLabPressureMatrix,
  type VisualizerLabPressureMatrixCell,
  type VisualizerLabRow,
  type VisualizerLabScatterDataset,
  type VisualizerLabScatterPoint,
  type VisualizerLabThemeAggregate,
  type VisualizerLabThemeAggregation,
  type VisualizerLabTimelinePoint,
} from '@/lib/visualizer-lab/types';

export interface VisualizerLabTimelineOptions {
  chronology?: LabChronologyMode;
  granularity?: 'year' | 'month';
  includeUndated?: boolean;
}

export interface VisualizerLabLeaderboardOptions {
  limit?: number;
  minCount?: number;
}

export interface VisualizerLabPressureMatrixOptions {
  categories?: string[];
  topCategoriesLimit?: number;
  dimensions?: LabDimension[];
}

export interface VisualizerLabScatterOptions {
  xDimension?: LabDimension;
  yDimension?: LabDimension;
  bubbleMetric?: LabScoreKey;
  chronology?: LabChronologyMode;
  limit?: number;
}

export interface VisualizerLabThemeOptions {
  limit?: number;
  minCount?: number;
}

const DEFAULT_CHRONOLOGY: LabChronologyMode = 'archive';
const DEFAULT_EVIDENCE_LIMIT = 8;
const DEFAULT_THEME_SAMPLE_SIZE = 5;
const FALLBACK_CATEGORY = 'Uncategorized';
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const COMPARISON_METRICS: LabScoreKey[] = ['fucked_up_score', ...LAB_DIMENSIONS];

const roundTo = (value: number, digits: number = 2): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(digits));
};

const toNumber = (value: number | string | null | undefined): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizeText = (value: string | null | undefined): string => {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
};

const parseDateValue = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const safeDateLabel = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  return Number.isFinite(Date.parse(value)) ? value : null;
};

const getBucketSortValue = (bucket: string): number => {
  if (bucket === 'Undated') {
    return Number.POSITIVE_INFINITY;
  }

  if (/^\d{4}$/.test(bucket)) {
    return Date.UTC(Number.parseInt(bucket, 10), 0, 1);
  }

  if (/^\d{4}-\d{2}$/.test(bucket)) {
    const [year, month] = bucket.split('-').map((segment) => Number.parseInt(segment, 10));
    return Date.UTC(year, month - 1, 1);
  }

  return Number.POSITIVE_INFINITY;
};

const getModeLabel = (chronology: LabChronologyMode): string => {
  return chronology === 'archive' ? 'archive chronology' : 'event chronology';
};

const getCategoryValue = (row: VisualizerLabRow): string => {
  const category = row.category?.trim();
  return category ? category : FALLBACK_CATEGORY;
};

const getPhaseGroupValue = (row: VisualizerLabRow): LabPhaseGroup => {
  return row.phase_group;
};

const getKeywords = (row: VisualizerLabRow): string[] => {
  if (!Array.isArray(row.all_keywords)) {
    return [];
  }

  return row.all_keywords
    .map((keyword) => keyword?.trim())
    .filter((keyword): keyword is string => Boolean(keyword));
};

const getTopCountEntry = <T extends string>(values: T[]): [T | null, number] => {
  if (values.length === 0) {
    return [null, 0];
  }

  const counts = new Map<T, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }

    return String(a[0]).localeCompare(String(b[0]));
  });

  return [sorted[0][0], sorted[0][1]];
};

const average = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }

  return roundTo(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const compareNullableTimestamps = (aTime: number | null, bTime: number | null, direction: 'asc' | 'desc'): number => {
  if (aTime === null && bTime === null) {
    return 0;
  }

  if (aTime === null) {
    return 1;
  }

  if (bTime === null) {
    return -1;
  }

  return direction === 'desc' ? bTime - aTime : aTime - bTime;
};

const compareRowsByScoreThenChronology = (
  a: VisualizerLabRow,
  b: VisualizerLabRow,
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
): number => {
  const scoreDelta = getScoreValue(b, 'fucked_up_score') - getScoreValue(a, 'fucked_up_score');

  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  return compareRowsByChronology(a, b, chronology, 'desc');
};

const buildThemeBuckets = (rows: VisualizerLabRow[]): Map<string, VisualizerLabRow[]> => {
  const buckets = new Map<string, VisualizerLabRow[]>();

  for (const row of rows) {
    const uniqueThemes = new Set(getKeywords(row).map((keyword) => normalizeText(keyword)).filter(Boolean));

    for (const theme of uniqueThemes) {
      const existing = buckets.get(theme);
      if (existing) {
        existing.push(row);
      } else {
        buckets.set(theme, [row]);
      }
    }
  }

  return buckets;
};

const zScore = (value: number, mean: number, standardDeviation: number): number => {
  if (!Number.isFinite(standardDeviation) || standardDeviation === 0) {
    return 0;
  }

  return (value - mean) / standardDeviation;
};

export function getScoreValue(row: VisualizerLabRow, metric: LabScoreKey): number {
  if (metric === 'fucked_up_score') {
    return toNumber(row.fucked_up_score);
  }

  return toNumber(row[metric]);
}

export function getChronologyValue(
  row: VisualizerLabRow,
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
): string | null {
  return chronology === 'archive' ? row.archive_created_at : row.date_start;
}

export function getChronologyTimestamp(
  row: VisualizerLabRow,
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
): number | null {
  return parseDateValue(getChronologyValue(row, chronology));
}

export function compareRowsByChronology(
  a: VisualizerLabRow,
  b: VisualizerLabRow,
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
  direction: 'asc' | 'desc' = 'desc',
): number {
  const chronologyDelta = compareNullableTimestamps(
    getChronologyTimestamp(a, chronology),
    getChronologyTimestamp(b, chronology),
    direction,
  );

  if (chronologyDelta !== 0) {
    return chronologyDelta;
  }

  return direction === 'desc' ? b.entry_number - a.entry_number : a.entry_number - b.entry_number;
}

export function sortRowsByChronology(
  rows: VisualizerLabRow[],
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
  direction: 'asc' | 'desc' = 'desc',
): VisualizerLabRow[] {
  return [...rows].sort((a, b) => compareRowsByChronology(a, b, chronology, direction));
}

export function matchesSearch(row: VisualizerLabRow, search?: string): boolean {
  const normalizedSearch = normalizeText(search);

  if (!normalizedSearch) {
    return true;
  }

  const haystack = [
    row.entry_number.toString(),
    row.title,
    row.synopsis,
    row.category,
    row.subcategory,
    row.phase,
    row.phase_group,
    row.rationale_short,
    ...getKeywords(row),
  ]
    .map((value) => normalizeText(value))
    .join(' ');

  return haystack.includes(normalizedSearch);
}

export function matchesCategory(row: VisualizerLabRow, category?: string | null): boolean {
  const normalizedCategory = normalizeText(category);

  if (!normalizedCategory) {
    return true;
  }

  return normalizeText(getCategoryValue(row)) === normalizedCategory;
}

export function matchesPhaseGroup(row: VisualizerLabRow, phaseGroup?: LabPhaseGroup | null): boolean {
  if (!phaseGroup) {
    return true;
  }

  return getPhaseGroupValue(row) === phaseGroup;
}

export function matchesKeyword(row: VisualizerLabRow, keyword?: string | null): boolean {
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  return getKeywords(row).some((candidate) => normalizeText(candidate).includes(normalizedKeyword));
}

export function matchesMinScoreThresholds(
  row: VisualizerLabRow,
  thresholds?: VisualizerLabFilters['minScore'],
): boolean {
  if (!thresholds) {
    return true;
  }

  return Object.entries(thresholds).every(([metric, threshold]) => {
    if (threshold === undefined || threshold === null) {
      return true;
    }

    return getScoreValue(row, metric as LabScoreKey) >= threshold;
  });
}

export function filterRows(rows: VisualizerLabRow[], filters?: VisualizerLabFilters): VisualizerLabRow[] {
  if (!filters) {
    return [...rows];
  }

  return rows.filter((row) => {
    return (
      matchesSearch(row, filters.search) &&
      matchesCategory(row, filters.category) &&
      matchesPhaseGroup(row, filters.phaseGroup) &&
      matchesKeyword(row, filters.keyword) &&
      matchesMinScoreThresholds(row, filters.minScore)
    );
  });
}

export function buildOverviewMetrics(
  rows: VisualizerLabRow[],
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
): VisualizerLabOverviewMetrics {
  const chronologyRows = sortRowsByChronology(rows, chronology, 'asc').filter((row) => getChronologyTimestamp(row, chronology) !== null);
  const [topCategory, topCategoryCount] = getTopCountEntry(rows.map((row) => getCategoryValue(row)));
  const [topPhaseGroup, topPhaseGroupCount] = getTopCountEntry(rows.map((row) => getPhaseGroupValue(row)));
  const highestScoreRow = [...rows].sort((a, b) => compareRowsByScoreThenChronology(a, b, chronology))[0];
  const chronologyEndRow = chronologyRows.at(-1);

  return {
    chronology,
    totalEntries: rows.length,
    uniqueCategories: new Set(rows.map((row) => getCategoryValue(row))).size,
    uniquePhaseGroups: new Set(rows.map((row) => getPhaseGroupValue(row))).size,
    avgFuckedUpScore: average(rows.map((row) => getScoreValue(row, 'fucked_up_score'))),
    avgDanger: average(rows.map((row) => row.danger)),
    avgAuthoritarianism: average(rows.map((row) => row.authoritarianism)),
    avgLawlessness: average(rows.map((row) => row.lawlessness)),
    avgAbsurdity: average(rows.map((row) => row.absurdity)),
    topCategory,
    topCategoryCount,
    topPhaseGroup,
    topPhaseGroupCount,
    chronologyStart: chronologyRows[0] ? safeDateLabel(getChronologyValue(chronologyRows[0], chronology)) : null,
    chronologyEnd: chronologyEndRow ? safeDateLabel(getChronologyValue(chronologyEndRow, chronology)) : null,
    highestScoreEntry: highestScoreRow ? toEvidenceItem(highestScoreRow) : null,
  };
}

export function buildTimelineSeries(
  rows: VisualizerLabRow[],
  options: VisualizerLabTimelineOptions = {},
): VisualizerLabTimelinePoint[] {
  const chronology = options.chronology ?? DEFAULT_CHRONOLOGY;
  const granularity = options.granularity ?? 'year';
  const includeUndated = options.includeUndated ?? true;
  const buckets = new Map<string, VisualizerLabRow[]>();

  for (const row of rows) {
    const chronologyValue = getChronologyValue(row, chronology);
    const timestamp = parseDateValue(chronologyValue);

    if (timestamp === null) {
      if (!includeUndated) {
        continue;
      }

      const undatedRows = buckets.get('Undated');
      if (undatedRows) {
        undatedRows.push(row);
      } else {
        buckets.set('Undated', [row]);
      }
      continue;
    }

    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const bucket = granularity === 'month' ? `${year}-${String(month).padStart(2, '0')}` : `${year}`;
    const bucketRows = buckets.get(bucket);

    if (bucketRows) {
      bucketRows.push(row);
    } else {
      buckets.set(bucket, [row]);
    }
  }

  return [...buckets.entries()]
    .sort((a, b) => getBucketSortValue(a[0]) - getBucketSortValue(b[0]))
    .map(([bucket, bucketRows]) => {
      const [topCategory] = getTopCountEntry(bucketRows.map((row) => getCategoryValue(row)));
      const [topPhaseGroup] = getTopCountEntry(bucketRows.map((row) => getPhaseGroupValue(row)));
      const label = bucket === 'Undated'
        ? 'Undated'
        : granularity === 'month'
          ? `${MONTH_LABELS[Number.parseInt(bucket.slice(5, 7), 10) - 1]} ${bucket.slice(0, 4)}`
          : bucket;

      return {
        bucket,
        label,
        chronology,
        count: bucketRows.length,
        avgFuckedUpScore: average(bucketRows.map((row) => getScoreValue(row, 'fucked_up_score'))),
        avgDanger: average(bucketRows.map((row) => row.danger)),
        avgAuthoritarianism: average(bucketRows.map((row) => row.authoritarianism)),
        avgLawlessness: average(bucketRows.map((row) => row.lawlessness)),
        avgAbsurdity: average(bucketRows.map((row) => row.absurdity)),
        topCategory,
        topPhaseGroup,
      };
    });
}

export function buildCategoryLeaderboard(
  rows: VisualizerLabRow[],
  options: VisualizerLabLeaderboardOptions = {},
): VisualizerLabCategoryLeaderboardItem[] {
  const minCount = options.minCount ?? 1;
  const groups = new Map<string, VisualizerLabRow[]>();

  for (const row of rows) {
    const category = getCategoryValue(row);
    const existing = groups.get(category);
    if (existing) {
      existing.push(row);
    } else {
      groups.set(category, [row]);
    }
  }

  const items = [...groups.entries()]
    .map(([category, categoryRows]) => {
      const [topPhaseGroup] = getTopCountEntry(categoryRows.map((row) => getPhaseGroupValue(row)));

      return {
        category,
        count: categoryRows.length,
        shareOfRows: rows.length === 0 ? 0 : roundTo(categoryRows.length / rows.length, 4),
        avgFuckedUpScore: average(categoryRows.map((row) => getScoreValue(row, 'fucked_up_score'))),
        avgDanger: average(categoryRows.map((row) => row.danger)),
        avgAuthoritarianism: average(categoryRows.map((row) => row.authoritarianism)),
        avgLawlessness: average(categoryRows.map((row) => row.lawlessness)),
        avgImpactScope: average(categoryRows.map((row) => row.impact_scope)),
        topPhaseGroup,
      } satisfies VisualizerLabCategoryLeaderboardItem;
    })
    .filter((item) => item.count >= minCount)
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      if (b.avgFuckedUpScore !== a.avgFuckedUpScore) {
        return b.avgFuckedUpScore - a.avgFuckedUpScore;
      }

      return a.category.localeCompare(b.category);
    });

  return options.limit ? items.slice(0, options.limit) : items;
}

export function buildPressureMatrix(
  rows: VisualizerLabRow[],
  options: VisualizerLabPressureMatrixOptions = {},
): VisualizerLabPressureMatrix {
  const dimensions = options.dimensions ?? [...LAB_DIMENSIONS];
  const categories = options.categories ?? buildCategoryLeaderboard(rows, { limit: options.topCategoriesLimit }).map((item) => item.category);
  const cells: VisualizerLabPressureMatrixCell[] = [];

  for (const category of categories) {
    const categoryRows = rows.filter((row) => getCategoryValue(row) === category);

    for (const dimension of dimensions) {
      cells.push({
        category,
        dimension,
        average: average(categoryRows.map((row) => getScoreValue(row, dimension))),
        count: categoryRows.length,
      });
    }
  }

  return {
    categories,
    dimensions,
    cells,
  };
}

export function buildScatterDataset(
  rows: VisualizerLabRow[],
  options: VisualizerLabScatterOptions = {},
): VisualizerLabScatterDataset {
  const chronology = options.chronology ?? DEFAULT_CHRONOLOGY;
  const xDimension = options.xDimension ?? 'danger';
  const yDimension = options.yDimension ?? 'authoritarianism';
  const bubbleMetric = options.bubbleMetric ?? 'fucked_up_score';

  const unsortedPoints = rows.map((row) => ({
    entry_number: row.entry_number,
    title: row.title,
    category: getCategoryValue(row),
    phase_group: getPhaseGroupValue(row),
    x: getScoreValue(row, xDimension),
    y: getScoreValue(row, yDimension),
    bubble: getScoreValue(row, bubbleMetric),
    chronology_value: getChronologyValue(row, chronology),
    fucked_up_score: getScoreValue(row, 'fucked_up_score'),
    outlier_score: 0,
  } satisfies VisualizerLabScatterPoint));

  const xMean = average(unsortedPoints.map((point) => point.x));
  const yMean = average(unsortedPoints.map((point) => point.y));
  const bubbleMean = average(unsortedPoints.map((point) => point.bubble));
  const xStd = Math.sqrt(average(unsortedPoints.map((point) => (point.x - xMean) ** 2)));
  const yStd = Math.sqrt(average(unsortedPoints.map((point) => (point.y - yMean) ** 2)));
  const bubbleStd = Math.sqrt(average(unsortedPoints.map((point) => (point.bubble - bubbleMean) ** 2)));

  const points = unsortedPoints
    .map((point) => ({
      ...point,
      outlier_score: roundTo(
        (
          Math.abs(zScore(point.x, xMean, xStd)) +
          Math.abs(zScore(point.y, yMean, yStd)) +
          Math.abs(zScore(point.bubble, bubbleMean, bubbleStd))
        ) / 3,
        3,
      ),
    }))
    .sort((a, b) => {
      if (b.outlier_score !== a.outlier_score) {
        return b.outlier_score - a.outlier_score;
      }

      if (b.fucked_up_score !== a.fucked_up_score) {
        return b.fucked_up_score - a.fucked_up_score;
      }

      return b.entry_number - a.entry_number;
    });

  return {
    xDimension,
    yDimension,
    bubbleMetric,
    points: options.limit ? points.slice(0, options.limit) : points,
  };
}

export function buildThemeAggregation(
  rows: VisualizerLabRow[],
  options: VisualizerLabThemeOptions = {},
): VisualizerLabThemeAggregation {
  const minCount = options.minCount ?? 1;
  const buckets = buildThemeBuckets(rows);

  const themes = [...buckets.entries()]
    .map(([theme, themeRows]) => {
      const sortedThemeRows = [...themeRows].sort((a, b) => compareRowsByScoreThenChronology(a, b));
      const [topCategory] = getTopCountEntry(themeRows.map((row) => getCategoryValue(row)));
      const [topPhaseGroup] = getTopCountEntry(themeRows.map((row) => getPhaseGroupValue(row)));

      return {
        theme,
        count: themeRows.length,
        shareOfRows: rows.length === 0 ? 0 : roundTo(themeRows.length / rows.length, 4),
        avgFuckedUpScore: average(themeRows.map((row) => getScoreValue(row, 'fucked_up_score'))),
        avgDanger: average(themeRows.map((row) => row.danger)),
        topCategory,
        topPhaseGroup,
        sampleEntryNumbers: sortedThemeRows.slice(0, DEFAULT_THEME_SAMPLE_SIZE).map((row) => row.entry_number),
      } satisfies VisualizerLabThemeAggregate;
    })
    .filter((theme) => theme.count >= minCount)
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      if (b.avgFuckedUpScore !== a.avgFuckedUpScore) {
        return b.avgFuckedUpScore - a.avgFuckedUpScore;
      }

      return a.theme.localeCompare(b.theme);
    });

  return {
    themes: options.limit ? themes.slice(0, options.limit) : themes,
    uniqueThemeCount: themes.length,
  };
}

export function buildComparisonCohort(
  label: string,
  rows: VisualizerLabRow[],
  filters?: VisualizerLabFilters,
): VisualizerLabComparisonCohort {
  return {
    label,
    rows: filterRows(rows, filters),
  };
}

export function buildComparisonSummary(
  left: VisualizerLabComparisonCohort,
  right: VisualizerLabComparisonCohort,
): VisualizerLabComparisonSummary {
  const leftOverview = buildOverviewMetrics(left.rows);
  const rightOverview = buildOverviewMetrics(right.rows);

  const metricDeltas = COMPARISON_METRICS.map((metric) => {
    const leftAverage = average(left.rows.map((row) => getScoreValue(row, metric)));
    const rightAverage = average(right.rows.map((row) => getScoreValue(row, metric)));

    return {
      metric,
      leftAverage,
      rightAverage,
      delta: roundTo(leftAverage - rightAverage),
    } satisfies VisualizerLabComparisonMetricDelta;
  }).sort((a, b) => {
    const deltaDifference = Math.abs(b.delta) - Math.abs(a.delta);
    if (deltaDifference !== 0) {
      return deltaDifference;
    }

    return a.metric.localeCompare(b.metric);
  });

  const overallDelta = metricDeltas.find((metric) => metric.metric === 'fucked_up_score')?.delta ?? 0;
  const moreIntenseCohort = overallDelta > 0 ? left.label : overallDelta < 0 ? right.label : null;
  const largestSplit = metricDeltas[0];
  const narrative = largestSplit
    ? `${moreIntenseCohort ?? 'Neither cohort'} owns the harsher overall profile; ${largestSplit.metric.replace(/_/g, ' ')} shows the biggest split at ${roundTo(Math.abs(largestSplit.delta))} points.`
    : 'The cohorts remain tightly matched across the tracked scoring dimensions.';

  return {
    leftLabel: left.label,
    rightLabel: right.label,
    leftCount: left.rows.length,
    rightCount: right.rows.length,
    leftTopCategory: leftOverview.topCategory,
    rightTopCategory: rightOverview.topCategory,
    leftTopPhaseGroup: leftOverview.topPhaseGroup,
    rightTopPhaseGroup: rightOverview.topPhaseGroup,
    moreIntenseCohort,
    metricDeltas,
    narrative,
  };
}

export function toEvidenceItem(row: VisualizerLabRow): VisualizerLabEvidenceItem {
  return {
    entry_number: row.entry_number,
    title: row.title,
    category: getCategoryValue(row),
    phase_group: getPhaseGroupValue(row),
    archive_created_at: row.archive_created_at,
    event_date: row.date_start,
    fucked_up_score: getScoreValue(row, 'fucked_up_score'),
    rationale_short: row.rationale_short,
  };
}

export function buildEvidenceSubset(
  rows: VisualizerLabRow[],
  options: VisualizerLabEvidenceOptions = {},
): VisualizerLabEvidenceItem[] {
  const chronology = options.chronology ?? DEFAULT_CHRONOLOGY;
  let scopedRows = filterRows(rows, options.filters);

  if (options.highlightedCategory) {
    scopedRows = scopedRows.filter((row) => matchesCategory(row, options.highlightedCategory));
  }

  if (options.highlightedPhaseGroup) {
    scopedRows = scopedRows.filter((row) => matchesPhaseGroup(row, options.highlightedPhaseGroup));
  }

  if (options.highlightedTheme) {
    scopedRows = scopedRows.filter((row) => matchesKeyword(row, options.highlightedTheme));
  }

  const limit = options.limit ?? DEFAULT_EVIDENCE_LIMIT;

  if (options.activeView === 'timeline') {
    return [...scopedRows]
      .sort((a, b) => {
        const chronologyDelta = compareRowsByChronology(a, b, chronology, 'desc');
        if (chronologyDelta !== 0) {
          return chronologyDelta;
        }

        return compareRowsByScoreThenChronology(a, b, chronology);
      })
      .slice(0, limit)
      .map((row) => toEvidenceItem(row));
  }

  if (options.activeView === 'scatter') {
    const scatter = buildScatterDataset(scopedRows, {
      chronology,
      xDimension: options.xDimension,
      yDimension: options.yDimension,
    });
    const outlierScores = new Map(scatter.points.map((point) => [point.entry_number, point.outlier_score]));

    return [...scopedRows]
      .sort((a, b) => {
        const outlierDelta = (outlierScores.get(b.entry_number) ?? 0) - (outlierScores.get(a.entry_number) ?? 0);
        if (outlierDelta !== 0) {
          return outlierDelta;
        }

        return compareRowsByScoreThenChronology(a, b, chronology);
      })
      .slice(0, limit)
      .map((row) => toEvidenceItem(row));
  }

  return [...scopedRows]
    .sort((a, b) => compareRowsByScoreThenChronology(a, b, chronology))
    .slice(0, limit)
    .map((row) => toEvidenceItem(row));
}

export function summarizeRowsForChronology(
  rows: VisualizerLabRow[],
  chronology: LabChronologyMode = DEFAULT_CHRONOLOGY,
): string {
  const metrics = buildOverviewMetrics(rows, chronology);
  return `${rows.length} rows in ${getModeLabel(chronology)}; avg score ${metrics.avgFuckedUpScore}; dominant category ${metrics.topCategory ?? 'none'}.`;
}
