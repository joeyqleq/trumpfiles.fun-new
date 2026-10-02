"""Validate the 80 base outcomes and apply append-only review patches in memory."""
import collections
import hashlib
import json
from pathlib import Path

out = Path(__file__).resolve().parent
base = out.parent
manifest = json.loads((base / 'manifest.json').read_text())
input_bytes = (base / 'worker-input.jsonl').read_bytes()
assert hashlib.sha256(input_bytes).hexdigest() == manifest['input_sha256']
inputs = {r['record_id']: r for r in map(json.loads, input_bytes.splitlines())}
rows = []
files = []
for worker in range(1, 7):
    path = out / f'worker-{worker:02}.jsonl'
    batch = [json.loads(line) for line in path.read_text().splitlines()]
    assigned = json.loads((out / f'assignment-{worker:02}.json').read_text())['record_ids']
    assert len(batch) == len(assigned)
    assert {r['record_id'] for r in batch} == set(assigned)
    rows.extend(batch)
    files.append(path.name)
assert len(rows) == 80
counts = collections.Counter(r['record_id'] for r in rows)
assert set(counts) == set(manifest['record_ids']) == set(inputs)
assert all(n == 1 for n in counts.values())
effective = {r['record_id']: dict(r) for r in rows}
patch_paths = sorted(out.glob('*-supplement.jsonl')) + sorted(out.glob('*-patches.json'))
for path in patch_paths:
    if path.suffix == '.jsonl':
        patches = [json.loads(line) for line in path.read_text().splitlines()]
    else:
        patches = json.loads(path.read_text())
    for patch in patches:
        assert patch['record_id'] in effective
        assert 'entry_number' not in patch or patch['entry_number'] == effective[patch['record_id']]['entry_number']
        effective[patch['record_id']].update(patch)
for r in effective.values():
    assert r['entry_number'] == inputs[r['record_id']]['entry_number']
    assert r['status'] in ('complete', 'needs_context')
    assert r.get('source_urls') and r.get('evidence_notes')
    assert all(url.startswith(('https://', 'http://')) for url in r['source_urls'])
    if r['status'] == 'needs_context':
        assert r.get('missing_context')
    for key, low, high in [('description_medium', 45, 90), ('description_long', 140, 300)]:
        description = r.get(key)
        if description is None:
            assert r['status'] == 'needs_context'
        else:
            assert low <= len(description.split()) <= high, (r['record_id'], key, len(description.split()))
report = {
    'input_commit': 'e6889430b4ccbaeeb99be19cd1a433d34c4a4715',
    'input_sha256': hashlib.sha256(input_bytes).hexdigest(),
    'assigned_count': 80,
    'saved_outcome_count': len(rows),
    'effective_status_counts': dict(collections.Counter(r['status'] for r in effective.values())),
    'missing_ids': [], 'duplicate_outcome_ids': [], 'out_of_assignment_ids': [],
    'terminal_outcome_files': files,
    'append_only_review_patch_files': [p.name for p in patch_paths],
    'needs_context_ids': sorted(r['record_id'] for r in effective.values() if r['status'] == 'needs_context'),
    'word_count_rule': 'Whitespace-delimited words; every non-null medium is 45–90 and long is 140–300; complete requires both.',
    'checks_passed': ['input hash', 'six disjoint assignments', 'exactly 80 unique outcomes', 'entry numbers', 'statuses', 'source URL format', 'evidence notes', 'blocked explanations', 'description lengths'],
    'file_sha256': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in [out / name for name in files] + patch_paths},
}
print(json.dumps(report, indent=2))
