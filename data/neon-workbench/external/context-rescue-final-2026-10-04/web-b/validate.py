"""Validate append-only Web B proposals against the frozen assignment."""
import collections
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
REQUIRED = {'record_id','status','title','description_short','description_medium','description_long','source_urls','source_fact_map','source_provenance','blockers','rationale','proposal_only'}
FACTS = {'event_state','action_type','affected_groups','institutions','scope','legal_stage','outcome','quantities','relations'}
DIMS = {'harm': .30, 'reach': .20, 'institutions': .15, 'procedural_abuse': .15, 'self_dealing': .10, 'persistence': .10}

def read(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]

def validate():
    assignment = json.loads((ROOT/'assignment.json').read_text())
    source = ROOT.parent/'web-b-input.jsonl'
    assert hashlib.sha256(source.read_bytes()).hexdigest() == assignment['input_sha256']
    expected = [x['record']['record_id'] for x in read(source)]
    assigned = [rid for w in assignment['workers'] for rid in w['record_ids']]
    assert collections.Counter(assigned) == collections.Counter(expected)
    rows = read(ROOT/'terminal-results.jsonl')
    effective = {}
    for row in rows:
        assert REQUIRED <= row.keys(), (row.get('record_id'), 'schema')
        rid = row['record_id']
        assert rid in expected, (rid, 'foreign ID')
        if rid in effective:
            provenance = row['source_provenance']
            assert row.get('amendment_of') or provenance.get('amendment_of') or provenance.get('amendment'), (rid, 'duplicate without immutable amendment')
        assert row['status'] in {'pass','hold','exclusion_candidate'}
        assert row['proposal_only'] is True
        assert len(row['title'] or '') <= 180
        assert len(row['description_short'] or '') <= 180
        assert isinstance(row['source_urls'], list)
        assert len(row['source_urls']) == len(set(row['source_urls']))
        for url in row['source_urls']:
            parsed = urlparse(url)
            assert parsed.scheme in {'http','https'} and parsed.netloc, (rid, url)
            assert url in json.dumps(row['source_fact_map'], ensure_ascii=False), (rid, 'unmapped URL',url)
        if row['status'] == 'pass':
            assert 45 <= len(row['description_medium'].split()) <= 90, (rid,'medium count')
            assert 140 <= len(row['description_long'].split()) <= 300, (rid,'long count')
            assert row['title'] and row['description_short'] and row['source_urls']
            assert FACTS <= row['insight_facts'].keys(), (rid,'insight schema')
            assert row['insight_evidence_map'], (rid,'insight evidence')
            covered = set()
            for evidence in row['insight_evidence_map']:
                assert evidence['url'] in row['source_urls'], (rid,'insight source not proposed')
                assert evidence.get('quote') or evidence.get('quoted_supported_facts'), (rid,'missing quoted evidence')
                covered.update(evidence['fields'])
            nonunknown = {k for k,v in row['insight_facts'].items() if v not in (None,'unknown',[],{})}
            assert nonunknown <= covered, (rid,'unmapped insight facts',nonunknown-covered)
            impact = row['impact_proposal']
            assert impact['status'] in {'scored','deferred'}
            assert {'dimensions','event_state','confidence','rationale'} <= impact.keys()
            if impact['status'] == 'deferred':
                assert impact['dimensions'] is None
            else:
                assert set(impact['dimensions']) == set(DIMS)
                for value in impact['dimensions'].values():
                    assert isinstance(value,(int,float)) and 0 <= value <= 10 and round(value,1) == value
                calculated = round(sum(impact['dimensions'][k]*weight for k,weight in DIMS.items()),2)
                total = impact.get('weighted_total',impact.get('total'))
                assert total == calculated, (rid,'weighted score',calculated,total)
        elif row['status'] == 'hold':
            assert row['blockers'], (rid,'missing precise gap')
        else:
            assert row['rationale'], (rid,'missing exclusion reason')
        effective[rid] = row
    assert set(effective) == set(expected), ('coverage',set(expected)-set(effective))
    logs = read(ROOT/'research-log.jsonl')
    assert all(log['record_id'] in expected for log in logs)
    assert set(log['record_id'] for log in logs) == set(expected), 'research coverage'
    for name in ('terminal-results.jsonl','research-log.jsonl'):
        collected_lines = (ROOT/name).read_bytes().splitlines()
        for worker in ROOT.glob('worker-*'):
            owned = {x['record']['record_id'] for x in read(worker/'assignment.jsonl')}
            for line in (worker/name).read_bytes().splitlines():
                assert json.loads(line)['record_id'] in owned
                assert line in collected_lines, (worker.name,'historical row missing')
    report = {'input_records':len(expected),'historical_terminal_rows':len(rows),'effective_terminal_records':len(effective),'counts':dict(collections.Counter(x['status'] for x in effective.values())), 'checks': {'exact_ids':'passed','nonoverlapping_assignments':'passed','schema':'passed','word_counts':'passed','url_syntax_and_fact_mapping':'passed','insight_quote_mapping':'passed','impact_proposal':'passed','research_coverage':'passed','immutable_worker_row_preservation':'passed','input_sha256':'passed'}}
    return report

if __name__ == '__main__':
    print(json.dumps(validate(),indent=2))
