"""Append unseen immutable worker rows, preserving each row's bytes and lineage."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def collect():
    for name in ('terminal-results.jsonl','research-log.jsonl'):
        target = ROOT/name
        seen = {hashlib.sha256(line).hexdigest() for line in target.read_bytes().splitlines()} if target.exists() else set()
        with target.open('ab') as output:
            for worker in sorted(ROOT.glob('worker-*')):
                path = worker/name
                if not path.exists():
                    continue
                owned = {json.loads(line)['record']['record_id'] for line in (worker/'assignment.jsonl').read_text().splitlines()}
                for line in path.read_bytes().splitlines():
                    row = json.loads(line)
                    assert row['record_id'] in owned, (worker.name,'foreign ID')
                    digest = hashlib.sha256(line).hexdigest()
                    if digest not in seen:
                        output.write(line+b'\n')
                        seen.add(digest)

if __name__ == '__main__':
    collect()
