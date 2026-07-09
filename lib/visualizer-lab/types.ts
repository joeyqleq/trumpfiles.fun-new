import { AICompleteTrumpData } from '@/types/database';

export const LAB_PHASE_GROUPS = [
  'Origins',
  'Business',
  'Campaign',
  'First Term',
  'Interregnum',
  'Second Term',
  'Unmapped',
] as const;

export type LabPhaseGroup = (typeof LAB_PHASE_GROUPS)[number];

export const LAB_CHRONOLOGY_MODES = ['archive', 'event'] as const;
export type LabChronologyMode = (typeof LAB_CHRONOLOGY_MODES)[number];

export const LAB_DIMENSIONS = [
  'danger',
  'authoritarianism',
  'lawlessness',
  'insanity',
  'absurdity',
  'credibility_risk',
  'recency_intensity',
  'impact_scope',
] as const;

export type LabDimension = (typeof LAB_DIMENSIONS)[number];
export type LabScoreKey = LabDimension | 'fucked_up_score';

export const LAB_VIEW_KEYS = [
  'overview',
  'timeline',
  'categories',
  'matrix',
  'scatter',
  'themes',
  'comparison',
] as const;

export type LabViewKey = (typeof LAB_VIEW_KEYS)[number];

export interface VisualizerLabRow extends AICompleteTrumpData {
  archive_created_at: string | null;
  archive_order: number;
  phase_group: LabPhaseGroup;
}

export type VisualizerLabScoreThresholds = Partial<Record<LabScoreKey, number>>;

export interface VisualizerLabFilters {
  search?: string;
  category?: string | null;
  phaseGroup?: LabPhaseGroup | null;
  keyword?: string | null;
  minScore?: VisualizerLabScoreThresholds;
}

export interface VisualizerLabOverviewMetrics {
  chronology: LabChronologyMode;
  totalEntries: number;
  uniqueCategories: number;
  uniquePhaseGroups: number;
  avgFuckedUpScore: number;
  avgDanger: number;
  avgAuthoritarianism: number;
  avgLawlessness: number;
  avgAbsurdity: number;
  topCategory: string | null;
  topCategoryCount: number;
  topPhaseGroup: LabPhaseGroup | null;
  topPhaseGroupCount: number;
  chronologyStart: string | null;
  chronologyEnd: string | null;
  highestScoreEntry: VisualizerLabEvidenceItem | null;
}

export interface VisualizerLabTimelinePoint {
  bucket: string;
  label: string;
  chronology: LabChronologyMode;
  count: number;
  avgFuckedUpScore: number;
  avgDanger: number;
  avgAuthoritarianism: number;
  avgLawlessness: number;
  avgAbsurdity: number;
  topCategory: string | null;
  topPhaseGroup: LabPhaseGroup | null;
}

export interface VisualizerLabCategoryLeaderboardItem {
  category: string;
  count: number;
  shareOfRows: number;
  avgFuckedUpScore: number;
  avgDanger: number;
  avgAuthoritarianism: number;
  avgLawlessness: number;
  avgImpactScope: number;
  topPhaseGroup: LabPhaseGroup | null;
}

export interface VisualizerLabPressureMatrixCell {
  category: string;
  dimension: LabDimension;
  average: number;
  count: number;
}

export interface VisualizerLabPressureMatrix {
  categories: string[];
  dimensions: LabDimension[];
  cells: VisualizerLabPressureMatrixCell[];
}

export interface VisualizerLabScatterPoint {
  entry_number: number;
  title: string;
  category: string;
  phase_group: LabPhaseGroup;
  x: number;
  y: number;
  bubble: number;
  chronology_value: string | null;
  fucked_up_score: number;
  outlier_score: number;
}

export interface VisualizerLabScatterDataset {
  xDimension: LabDimension;
  yDimension: LabDimension;
  bubbleMetric: LabScoreKey;
  points: VisualizerLabScatterPoint[];
}

export interface VisualizerLabThemeAggregate {
  theme: string;
  count: number;
  shareOfRows: number;
  avgFuckedUpScore: number;
  avgDanger: number;
  topCategory: string | null;
  topPhaseGroup: LabPhaseGroup | null;
  sampleEntryNumbers: number[];
}

export interface VisualizerLabThemeAggregation {
  themes: VisualizerLabThemeAggregate[];
  uniqueThemeCount: number;
}

export interface VisualizerLabComparisonCohort {
  label: string;
  rows: VisualizerLabRow[];
}

export interface VisualizerLabComparisonMetricDelta {
  metric: LabScoreKey;
  leftAverage: number;
  rightAverage: number;
  delta: number;
}

export interface VisualizerLabComparisonSummary {
  leftLabel: string;
  rightLabel: string;
  leftCount: number;
  rightCount: number;
  leftTopCategory: string | null;
  rightTopCategory: string | null;
  leftTopPhaseGroup: LabPhaseGroup | null;
  rightTopPhaseGroup: LabPhaseGroup | null;
  moreIntenseCohort: string | null;
  metricDeltas: VisualizerLabComparisonMetricDelta[];
  narrative: string;
}

export interface VisualizerLabEvidenceItem {
  entry_number: number;
  title: string;
  category: string;
  phase_group: LabPhaseGroup;
  archive_created_at: string | null;
  event_date: string | null;
  fucked_up_score: number;
  rationale_short: string;
}

export interface VisualizerLabEvidenceOptions {
  activeView?: LabViewKey;
  chronology?: LabChronologyMode;
  filters?: VisualizerLabFilters;
  limit?: number;
  highlightedCategory?: string | null;
  highlightedPhaseGroup?: LabPhaseGroup | null;
  highlightedTheme?: string | null;
  xDimension?: LabDimension;
  yDimension?: LabDimension;
}

export interface VisualizerLabInsight {
  headline: string;
  whatStandsOut: string[];
  whyItMatters: string;
  whatToInspectNext: string[];
}

const EXACT_PHASE_GROUP_MAP: Record<string, LabPhaseGroup> = {
  'early life': 'Origins',
  origins: 'Origins',
  'pre political era': 'Origins',
  'pre politics': 'Origins',
  'real estate': 'Business',
  'early business career': 'Business',
  'business empire': 'Business',
  'trump organization ceo': 'Business',
  'media mogul': 'Business',
  'pre presidential campaign': 'Campaign',
  'presidential campaign': 'Campaign',
  'campaign trail': 'Campaign',
  candidate: 'Campaign',
  'presidential transition': 'First Term',
  'white house 1': 'First Term',
  'first term': 'First Term',
  president: 'First Term',
  'post presidency': 'Interregnum',
  'between terms': 'Interregnum',
  'ex president': 'Interregnum',
  interregnum: 'Interregnum',
  'white house 2': 'Second Term',
  'second term': 'Second Term',
  'second term (2025+)': 'Second Term',
};

const normalizePhaseValue = (phase: string | null | undefined): string => {
  return (phase ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
};

const getEventYear = (eventDate: string | null | undefined): number | null => {
  if (!eventDate) {
    return null;
  }

  const parsed = Date.parse(eventDate);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return new Date(parsed).getUTCFullYear();
};

export function derivePhaseGroup(
  rawPhase: string | null | undefined,
  eventDate?: string | null,
): LabPhaseGroup {
  const normalized = normalizePhaseValue(rawPhase);
  const eventYear = getEventYear(eventDate);

  if (!normalized) {
    return 'Unmapped';
  }

  if (normalized === 'president' || normalized === 'presidential transition') {
    if (eventYear !== null && eventYear >= 2025) {
      return 'Second Term';
    }

    return 'First Term';
  }

  if (EXACT_PHASE_GROUP_MAP[normalized]) {
    return EXACT_PHASE_GROUP_MAP[normalized];
  }

  if (normalized.includes('second term') || normalized.includes('white house 2')) {
    return 'Second Term';
  }

  if (
    normalized.includes('post presidency') ||
    normalized.includes('between terms') ||
    normalized.includes('interregnum') ||
    normalized.includes('ex president')
  ) {
    return 'Interregnum';
  }

  if (
    normalized.includes('first term') ||
    normalized.includes('white house 1') ||
    normalized.includes('transition') ||
    normalized.includes('president')
  ) {
    return 'First Term';
  }

  if (
    normalized.includes('campaign') ||
    normalized.includes('candidate') ||
    normalized.includes('trail')
  ) {
    return 'Campaign';
  }

  if (
    normalized.includes('business') ||
    normalized.includes('organization') ||
    normalized.includes('real estate') ||
    normalized.includes('media')
  ) {
    return 'Business';
  }

  if (
    normalized.includes('early life') ||
    normalized.includes('origins') ||
    normalized.includes('childhood') ||
    normalized.includes('pre political')
  ) {
    return 'Origins';
  }

  return 'Unmapped';
}

export function normalizePhaseGroup(rawPhase: string | null | undefined): LabPhaseGroup {
  return derivePhaseGroup(rawPhase);
}
