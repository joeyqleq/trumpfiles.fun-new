#!/usr/bin/env python3
"""Validate a writing lane without a database or local service."""
import argparse
import json
from collections import Counter
from pathlib import Path

def read(p):
    return [json.loads(s) for s in p.read_text().splitlines() if s.strip()]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('lane', type=Path)
    args = parser.parse_args()
    assigned = {r['record_id']: r for r in read(args.lane / 'input.jsonl')}
    seen = Counter()
    errors, counts = [], Counter()
    required = {'record_id', 'entry_number', 'status', 'title', 'description_short', 'description_medium',
                'description_long', 'category', 'topic_tags', 'people_tags', 'source_urls', 'notes'}
    for p in sorted((args.lane / 'outputs').glob('*.jsonl')):
        for r in read(p):
            rid = r.get('record_id')
            seen[rid] += 1
            if rid not in assigned:
                errors.append({'id': rid, 'error': 'outside current assignment', 'file': p.name})
                continue
            e = assigned[rid]
            if not required <= r.keys():
                errors.append({'id': rid, 'error': 'missing output fields'})
            if e['entry_number'] != r.get('entry_number'):
                errors.append({'id': rid, 'error': 'entry identity changed'})
            for k, v in e['existing'].items():
                if v and r.get(k) != v:
                    errors.append({'id': rid, 'error': 'preserved text changed', 'field': k})
            status = r.get('status')
            if status not in {'complete', 'needs_context'}:
                errors.append({'id': rid, 'error': 'invalid status'})
            counts[status] += 1
            if status == 'complete':
                if not r.get('description_short') or len(r['description_short']) > 180:
                    errors.append({'id': rid, 'error': 'short description length'})
                for k, lo, hi in [('description_medium', 45, 90), ('description_long', 140, 300)]:
                    wc = len((r.get(k) or '').split())
                    if not lo <= wc <= hi:
                        errors.append({'id': rid, 'error': k + ' word count', 'words': wc})
            if e.get('category') and 'category' not in e['needs'] and r.get('category') != e['category']:
                errors.append({'id': rid, 'error': 'existing category changed'})
    duplicates = [rid for rid, n in seen.items() if n > 1 and rid in assigned]
    report = {'assigned': len(assigned), 'accounted_for': len(set(seen) & set(assigned)),
              'remaining': len(set(assigned) - set(seen)), 'statuses': dict(counts),
              'duplicate_ids': duplicates, 'errors': errors}
    print(json.dumps(report, indent=2))
    return bool(errors or duplicates)

if __name__ == '__main__':
    raise SystemExit(main())
