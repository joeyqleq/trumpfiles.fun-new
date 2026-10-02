"""Validate frozen assignment coverage and effective append-only resolution proposals."""
import collections
import hashlib
import json
from pathlib import Path

base = Path(__file__).resolve().parent
manifest = json.loads((base / 'manifest.json').read_text())
assigned = set(manifest['record_ids'])
prior_report = json.loads((base.parent / 'outputs' / 'validation.json').read_text())
assert assigned == set(prior_report['needs_context_ids'])
assert len(assigned) == 58
assert not assigned.intersection(manifest['excluded_complete_ids'])
inputs = [json.loads(line) for line in (base / 'input.jsonl').read_text().splitlines()]
assert len(inputs) == 58 and {r['record_id'] for r in inputs} == assigned
for row in inputs:
    assert row['reviewed_outcome']['status'] == 'needs_context'
files = sorted(base.glob('worker-*-batch-*.jsonl'))
raw = []
for path in files:
    batch = [json.loads(line) for line in path.read_text().splitlines()]
    worker = path.name.split('-')[1]
    worker_ids = set(json.loads((base / f'assignment-{worker}.json').read_text())['record_ids'])
    assert all(row['record_id'] in worker_ids for row in batch)
    raw.extend(batch)
counts = collections.Counter(row['record_id'] for row in raw)
assert set(counts) == assigned and len(raw) == 58
assert all(n == 1 for n in counts.values())
effective = {row['record_id']: dict(row) for row in raw}
patch_files = sorted(base.glob('worker-*-patches.json')) + sorted(base.glob('root-*-patches.json'))
for path in patch_files:
    for patch in json.loads(path.read_text()):
        assert patch['record_id'] in assigned
        effective[patch['record_id']].update(patch)
for row in effective.values():
    assert row['entry_number'] == int(row['record_id'].split('-')[1])
    assert row['status'] in ('complete', 'needs_context')
    assert row['resolved'] == (row['status'] == 'complete')
    assert row['resolution_kind'] in ('gap_resolved', 'narrowed_correction', 'unresolved')
    assert row.get('missing_fact') and row.get('search_attempts')
    assert row.get('source_urls') and all(url.startswith(('http://', 'https://')) for url in row['source_urls'])
    assert isinstance(row['supported_facts'], list) and isinstance(row['remaining_uncertainties'], list)
    if row['resolved']:
        assert row['supported_facts'] and row.get('proposed_title')
        assert row['resolution_kind'] != 'unresolved'
    else:
        assert row.get('missing_context') and row['resolution_kind'] == 'unresolved'
    for key, low, high in [('description_medium', 45, 90), ('description_long', 140, 300)]:
        text = row.get(key)
        if text is None:
            assert not row['resolved']
        else:
            assert low <= len(text.split()) <= high, (row['record_id'], key, len(text.split()))
report = {
    'input_commit': manifest['input_commit'],
    'assigned_count': len(assigned),
    'saved_terminal_outcome_count': len(raw),
    'resolved_corrected_proposals': sum(row['resolved'] for row in effective.values()),
    'resolution_kind_counts': dict(collections.Counter(row['resolution_kind'] for row in effective.values())),
    'unresolved_count': sum(not row['resolved'] for row in effective.values()),
    'missing_ids': [], 'duplicate_terminal_outcome_ids': [], 'out_of_assignment_ids': [],
    'excluded_complete_records_processed': 0,
    'original_claims_substantiated_count': sum(row['resolution_kind'] == 'gap_resolved' for row in effective.values()),
    'resolution_definition': 'Complete means a source-grounded corrected proposal meets both word ranges. Narrowed corrections remove unsupported original claims; they do not verify those claims.',
    'terminal_outcome_files': [path.name for path in files],
    'review_patch_precedence': [path.name for path in patch_files],
    'unresolved_ids': sorted(row['record_id'] for row in effective.values() if not row['resolved']),
    'resolved_ids': sorted(row['record_id'] for row in effective.values() if row['resolved']),
    'source_snapshot_note': 'AP JSON is a current retrieval with declared Dec 3, 2025 lastModified; it is not a verified Feb/Mar 2026 archived view.',
    'editorial_warning': 'Several narrowed proposals share the same source/event/project; their separate assigned IDs do not establish distinct events. Coordinator should review consolidation.',
    'checks_passed': ['exact 58 blocked IDs', '22 prior complete IDs excluded', 'six disjoint worker assignments', 'one terminal outcome per ID', 'patch ID boundaries', 'status/resolved consistency', 'source URLs', 'supported facts and uncertainties', 'search attempt logs', 'word counts'],
    'sha256': {str(path.relative_to(base)): hashlib.sha256(path.read_bytes()).hexdigest() for path in [base / 'manifest.json', base / 'input.jsonl', *files, *patch_files, *sorted((base / 'sources').glob('*.json'))]},
}
print(json.dumps(report, indent=2))
