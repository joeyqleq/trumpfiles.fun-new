export const RETRY_DAYS = 30;

function hasValidHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return /^https?:$/.test(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function dateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Mirrors the SQL eligibility predicates in backfill-sources-auto.mjs.
 * JSONB is returned as JavaScript values by Neon; undefined represents SQL NULL.
 */
export function sourceBackfillState(sources, today = new Date().toISOString().slice(0, 10)) {
  if (sources == null) return 'missing';
  if (!Array.isArray(sources)) return 'unknown';
  if (sources.some((source) => hasValidHttpUrl(source?.url))) return 'sourced';
  if (sources.some((source) => typeof source?.url === 'string' && source.url.trim())) return 'invalid-source';
  if (sources.length === 0) return 'legacy-empty';

  const searched = sources.length === 1 && typeof sources[0]?.searched === 'string'
    ? dateOnly(sources[0].searched)
    : null;
  if (!searched) return 'unknown';

  const cutoff = dateOnly(today);
  if (!cutoff) throw new Error('today must be YYYY-MM-DD');
  cutoff.setUTCDate(cutoff.getUTCDate() - RETRY_DAYS);
  return searched < cutoff ? 'expired-skip' : 'fresh-skip';
}

export function shouldAttemptSourceBackfill(sources, today) {
  return ['missing', 'legacy-empty', 'expired-skip', 'invalid-source'].includes(sourceBackfillState(sources, today));
}

export function shouldMarkSourceSkipped(sources, today) {
  return shouldAttemptSourceBackfill(sources, today);
}
