/**
 * Versioned, database-agnostic enrichment contract.
 *
 * This deliberately does not persist anything: new ingestion can map the
 * contract into today's legacy columns, while staged cleanup can retain the
 * complete object once storage for it is available.
 */

export const ENRICHMENT_SCHEMA_VERSION = '2026-08-21.1';

export const VALID_CATEGORIES = [
  'Authoritarianism', 'Government Corruption', 'Human Rights Violations',
  'Grift / Financial Exploitation', 'National Security Violations',
  'Foreign Policy', 'Election Interference', 'Press Freedom',
  'Environmental Destruction', 'Conspiracy Theories / Disinformation',
];

// Canonical eras are intentionally fewer than the raw corpus labels.  The
// original label is retained as `era.raw_phase` so staged cleanup is lossless.
export const VALID_PHASES = ['Pre-Political', 'Campaign 2016', 'White House 1', 'Post-Presidency', 'White House 2:2'];
export const SCORE_FIELDS = ['danger', 'authoritarianism', 'lawlessness', 'insanity', 'absurdity', 'credibility_risk', 'recency_intensity', 'impact_scope'];
const REQUIRED_SCORE_FIELDS = SCORE_FIELDS.slice(0, 5);
const ALLOWED_INPUT_FIELDS = new Set([
  'entry_number', 'event_id', 'title', 'synopsis', 'short_summary', 'medium_summary', 'long_summary',
  'category', 'subcategory', 'phase', 'raw_phase', 'date_start', 'date_end', 'people_tags', 'organization_tags',
  'location_tags', 'topic_tags', 'sources', 'source_urls', 'source_url', 'related_entry_ids', 'evidence_claims',
  'score_explanations', ...SCORE_FIELDS,
]);

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim() ? value.trim() : null;
const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const uniqueText = value => Array.isArray(value) ? [...new Set(value.map(text).filter(Boolean))] : [];

const phaseKey = value => text(value)?.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ') ?? null;
const PHASE_ALIASES = new Map([
  ['pre-political', 'Pre-Political'], ['pre-political era', 'Pre-Political'], ['early life', 'Pre-Political'],
  ['real estate', 'Pre-Political'], ['early business career', 'Pre-Political'], ['business empire', 'Pre-Political'],
  ['trump organization ceo', 'Pre-Political'], ['media mogul', 'Pre-Political'],
  ['campaign 2016', 'Campaign 2016'], ['2016 campaign', 'Campaign 2016'], ['campaign trail', 'Campaign 2016'],
  ['white house 1', 'White House 1'], ['first term', 'White House 1'], ['first term (2017-2021)', 'White House 1'],
  ['president', 'White House 1'], ['presidential transition', 'White House 1'], ['campaign 2020', 'White House 1'], ['2020 campaign', 'White House 1'],
  ['post-presidency', 'Post-Presidency'], ['post presidency', 'Post-Presidency'], ['post-presidency (2021-2024)', 'Post-Presidency'], ['between terms', 'Post-Presidency'],
  ['white house 2', 'White House 2:2'], ['white house 2:2', 'White House 2:2'], ['term 2: year 2', 'White House 2:2'],
  ['presidency 2 (2025-2029)', 'White House 2:2'], ['wh2:2', 'White House 2:2'],
]);

/** Maps audited historic labels without guessing unknown phases. */
export function normalizePhase(value) {
  const raw_phase = text(value);
  const phase = raw_phase ? PHASE_ALIASES.get(phaseKey(raw_phase)) ?? null : null;
  return { phase, raw_phase, status: phase ? 'mapped' : raw_phase ? 'unmapped' : 'missing' };
}

function stableHash(value) {
  let hash = 2166136261;
  for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(36);
}

function eventId(input, sources) {
  const supplied = text(input.event_id);
  if (supplied && /^[a-z0-9][a-z0-9._:-]{2,127}$/i.test(supplied)) return supplied;
  const stem = (text(input.title) || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'untitled';
  const fingerprint = `${input.date_start || 'undated'}|${stem}|${sources.map(source => source.url).sort().join('|')}`;
  return `evt-${input.date_start || 'undated'}-${stem}-${stableHash(fingerprint)}`;
}

function normalizeSources(value) {
  if (!Array.isArray(value)) return [];
  return value.map(source => isObject(source) ? {
    url: text(source.url), title: text(source.title), publisher: text(source.publisher),
    date_published: isDate(source.date_published) ? source.date_published : null,
    source_type: text(source.source_type) || null,
    confidence: typeof source.confidence === 'number' ? source.confidence : null,
    status: text(source.status),
  } : { url: null, title: null, publisher: null, date_published: null, source_type: null, confidence: null, status: null });
}

export function normalizeEnrichment(input, { source = 'unknown', model = null, now = new Date().toISOString() } = {}) {
  const candidate = isObject(input) ? input : {};
  const era = normalizePhase(candidate.raw_phase ?? candidate.phase);
  const sources = normalizeSources(candidate.sources);
  const metrics = Object.fromEntries(SCORE_FIELDS.map(field => [field, typeof candidate[field] === 'number' ? candidate[field] : null]));
  const score_explanations = Object.fromEntries(SCORE_FIELDS.map(field => [field, isObject(candidate.score_explanations) ? text(candidate.score_explanations[field]) : null]));
  const evidence_claims = Array.isArray(candidate.evidence_claims) ? candidate.evidence_claims.map(claim => isObject(claim) ? {
    claim: text(claim.claim), source_url: text(claim.source_url),
  } : { claim: null, source_url: null }) : [];
  return {
    schema_version: ENRICHMENT_SCHEMA_VERSION,
    identity: { entry_number: Number.isInteger(candidate.entry_number) ? candidate.entry_number : null, event_id: eventId(candidate, sources) },
    title: text(candidate.title),
    summaries: { short: text(candidate.short_summary) || text(candidate.synopsis), medium: text(candidate.medium_summary), long: text(candidate.long_summary) },
    dates: { start: isDate(candidate.date_start) ? candidate.date_start : null, end: isDate(candidate.date_end) ? candidate.date_end : null },
    era,
    taxonomy: { category: text(candidate.category), subcategory: text(candidate.subcategory) },
    tags: { people: uniqueText(candidate.people_tags), organizations: uniqueText(candidate.organization_tags), locations: uniqueText(candidate.location_tags), topics: uniqueText(candidate.topic_tags) },
    sources,
    metrics: { values: metrics, explanations: score_explanations },
    related_entry_ids: uniqueText(candidate.related_entry_ids),
    evidence_claims,
    provenance: { source: text(source) || 'unknown', model: text(model), enrichment_version: ENRICHMENT_SCHEMA_VERSION, enriched_at: now },
    quality_status: 'rejected',
  };
}

export function validateEnrichment(enrichment, input = null) {
  const errors = [];
  if (!isObject(enrichment)) return { ok: false, errors: ['enrichment must be an object'], value: enrichment };
  if (isObject(input)) for (const key of Object.keys(input)) if (!ALLOWED_INPUT_FIELDS.has(key)) errors.push(`unsupported field: ${key}`);
  if (enrichment.schema_version !== ENRICHMENT_SCHEMA_VERSION) errors.push('unsupported schema version');
  if (!enrichment.identity?.event_id) errors.push('missing event identity');
  if (!enrichment.title || enrichment.title.length < 10) errors.push('title too short');
  if (!enrichment.summaries?.short || enrichment.summaries.short.length < 50) errors.push('short summary too short');
  if (!enrichment.summaries?.medium || enrichment.summaries.medium.length < 120) errors.push('medium summary too short');
  if (!enrichment.summaries?.long || enrichment.summaries.long.length < 220) errors.push('long summary too short');
  if (!VALID_CATEGORIES.includes(enrichment.taxonomy?.category)) errors.push(`invalid category: ${enrichment.taxonomy?.category}`);
  if (!VALID_PHASES.includes(enrichment.era?.phase)) errors.push(enrichment.era?.raw_phase ? `unmapped phase: ${enrichment.era.raw_phase}` : 'missing phase');
  if (!isDate(enrichment.dates?.start)) errors.push('invalid start date');
  if (enrichment.dates?.end && !isDate(enrichment.dates.end)) errors.push('invalid end date');
  if (enrichment.dates?.end && enrichment.dates.end < enrichment.dates.start) errors.push('end date precedes start date');
  const urls = new Set();
  if (!Array.isArray(enrichment.sources) || enrichment.sources.length === 0) errors.push('no verified sources');
  for (const item of enrichment.sources || []) {
    try { if (!item.url || !/^https?:$/.test(new URL(item.url).protocol)) throw new Error(); } catch { errors.push('invalid source URL'); }
    if (item.status !== 'verified') errors.push('source is not verified');
    if (typeof item.confidence !== 'number' || item.confidence < 0 || item.confidence > 1) errors.push('invalid source confidence');
    if (item.url) urls.add(item.url);
  }
  for (const field of REQUIRED_SCORE_FIELDS) if (typeof enrichment.metrics?.values?.[field] !== 'number' || enrichment.metrics.values[field] < 1 || enrichment.metrics.values[field] > 10) errors.push(`invalid metric: ${field}`);
  for (const [field, explanation] of Object.entries(enrichment.metrics?.explanations || {})) if (explanation !== null && (!SCORE_FIELDS.includes(field) || typeof explanation !== 'string')) errors.push(`invalid metric explanation: ${field}`);
  for (const claim of enrichment.evidence_claims || []) if (!claim.claim || !urls.has(claim.source_url)) errors.push('unsupported evidence claim');
  const value = { ...enrichment, quality_status: errors.length ? 'rejected' : 'ready' };
  return { ok: errors.length === 0, errors: [...new Set(errors)], value };
}

export function toLegacyEntry(enrichment) {
  return {
    title: enrichment.title, synopsis: enrichment.summaries.short, category: enrichment.taxonomy.category,
    phase: enrichment.era.phase, date_start: enrichment.dates.start, people_tags: enrichment.tags.people,
    sources: enrichment.sources, ...enrichment.metrics.values,
  };
}

export function isCurrentGoodEnrichment(record) {
  const value = record?.enrichment ?? record;
  return value?.schema_version === ENRICHMENT_SCHEMA_VERSION
    && value?.quality_status === 'ready'
    && validateEnrichment(value).ok
    && enrichmentGapReasons(record).length === 0;
}

export function enrichmentGapReasons(record) {
  const value = record?.enrichment ?? record ?? {};
  const summaries = value.summaries ?? {
    short: value.short_summary ?? value.synopsis,
    medium: value.medium_summary,
    long: value.long_summary,
  };
  const people = value.tags?.people ?? value.people_tags;
  const sources = Array.isArray(value.sources) ? value.sources : [];
  const reasons = [];
  if (!text(summaries?.short) || text(summaries.short).length < 50) reasons.push('short_summary');
  if (!text(summaries?.medium) || text(summaries.medium).length < 120) reasons.push('medium_summary');
  if (!text(summaries?.long) || text(summaries.long).length < 220) reasons.push('long_summary');
  if (!sources.some(source => {
    try {
      return source?.url
        && /^https?:$/.test(new URL(source.url).protocol)
        && source.status === 'verified'
        && typeof source.confidence === 'number'
        && source.confidence >= 0
        && source.confidence <= 1;
    } catch { return false; }
  })) reasons.push('verified_source');
  if (!Array.isArray(people) || people.filter(text).length === 0) reasons.push('people_tags');
  return reasons;
}
