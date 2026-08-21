import assert from 'node:assert/strict';
import test from 'node:test';
import { sourceBackfillState, shouldAttemptSourceBackfill, shouldMarkSourceSkipped } from './backfill-sources-state.mjs';

const TODAY = '2026-08-20';

const fixtures = [
  ['SQL NULL', undefined, 'missing', true],
  ['JSON null', null, 'missing', true],
  ['legacy []', [], 'legacy-empty', true],
  ['fresh skip', [{ searched: '2026-08-01' }], 'fresh-skip', false],
  ['expired skip', [{ searched: '2026-07-20' }], 'expired-skip', true],
  ['accepted source', [{ url: 'https://www.reuters.com/example', title: 'Verified' }], 'sourced', false],
  ['invalid source url', [{ url: 'www.reuters.com/example', title: 'Malformed' }], 'invalid-source', true],
  ['incomplete protocol-only url', [{ url: 'https://', title: 'Malformed' }], 'invalid-source', true],
  ['rejected source marker', [{ searched: TODAY }], 'fresh-skip', false],
  ['malformed searched date', [{ searched: 'not-a-date' }], 'unknown', false],
  ['non-array JSON object', { searched: TODAY }, 'unknown', false],
];

for (const [name, sources, state, eligible] of fixtures) {
  test(`${name} has deterministic retry/skip behavior`, () => {
    assert.equal(sourceBackfillState(sources, TODAY), state);
    assert.equal(shouldAttemptSourceBackfill(sources, TODAY), eligible);
    assert.equal(shouldMarkSourceSkipped(sources, TODAY), eligible);
  });
}
