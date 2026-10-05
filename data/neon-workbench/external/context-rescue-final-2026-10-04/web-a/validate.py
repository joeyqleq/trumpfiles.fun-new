"""Validate exclusive Web A proposals; never writes canonical data."""
import collections
import json
import pathlib
import re
from urllib.parse import urlparse

HERE = pathlib.Path(__file__).resolve().parent
packets = [json.loads(line) for line in (HERE.parent / 'web-a-input.jsonl').read_text().splitlines()]
expected = [packet['record']['record_id'] for packet in packets]
rows = [json.loads(line) for line in (HERE / 'terminal-results.jsonl').read_text().splitlines()]
logs = [json.loads(line) for line in (HERE / 'research-log.jsonl').read_text().splitlines()]
required = {'record_id','status','title','description_short','description_medium','description_long','source_urls','source_fact_map','source_provenance','blockers','rationale','proposal_only'}
errors = []
metrics = []
def check(condition, message):
    if not condition:
        errors.append(message)
counts = collections.Counter(row['record_id'] for row in rows)
check(set(counts) == set(expected), 'Exact-ID coverage mismatch')
check(all(value == 1 for value in counts.values()), 'Duplicate terminal IDs')
check(set(log['record_id'] for log in logs) == set(expected), 'Research log coverage mismatch')
effective = {row['record_id']:row for row in rows}
amendment_path = HERE / 'amendments.jsonl'
if amendment_path.exists():
    for line in amendment_path.read_text().splitlines():
        amendment = json.loads(line)
        check(amendment['record_id'] in effective, 'Amendment outside assignment')
        effective[amendment['record_id']] = amendment
rows = list(effective.values())
for row in rows:
    rid = row['record_id']
    check(required <= set(row), f'{rid}: missing keys {required-set(row)}')
    check(row.get('proposal_only') is True, f'{rid}: not proposal-only')
    check(row.get('status') in {'pass','hold','exclusion_candidate'}, f'{rid}: invalid status')
    urls = row.get('source_urls', [])
    check(isinstance(urls,list) and len(urls)==len(set(urls)), f'{rid}: URL array/duplicates')
    for url in urls:
        parsed = urlparse(url)
        check(parsed.scheme in {'https','http'} and bool(parsed.netloc) and not re.search(r'\s',url),f'{rid}: invalid URL {url}')
    if row['status'] != 'pass':
        check(bool(row.get('blockers')) and bool(row.get('rationale')), f'{rid}: missing precise hold/exclusion explanation')
        continue
    lengths = {key:len(row.get(key) or '') for key in ('title','description_short')}
    lengths.update({key:len((row.get(key) or '').split()) for key in ('description_medium','description_long')})
    metrics.append({'record_id':rid,**lengths})
    check(0 < lengths['title'] <= 180 and 0 < lengths['description_short'] <= 180,f'{rid}: title/short bounds')
    check(45 <= lengths['description_medium'] <= 90,f'{rid}: medium word bounds')
    check(140 <= lengths['description_long'] <= 300,f'{rid}: long word bounds')
    mapping = row.get('source_fact_map',[])
    mapped = set(mapping) if isinstance(mapping,dict) else {item.get('url') for item in mapping}
    check(set(urls) <= mapped and bool(urls), f'{rid}: missing fact-to-URL mapping')
    facts = row.get('insight_facts',{})
    check({'event_state','action_type','affected_groups','institutions','scope','legal_stage','outcome','quantities','relations'} <= set(facts), f'{rid}: missing insight fields')
    check(bool(row.get('insight_evidence_map')),f'{rid}: missing insight evidence')
    impact = row.get('impact_proposal',{})
    check(impact.get('status') in {'scored','deferred'},f'{rid}: invalid impact status')
    if impact.get('status') == 'deferred':
        check(impact.get('dimensions') is None,f'{rid}: deferred dimensions must be null')
    else:
        weights={'harm':.30,'reach':.20,'institutions':.15,'procedural_abuse':.15,'self_dealing':.10,'persistence':.10}
        dims=impact.get('dimensions',{})
        check(set(dims)==set(weights),f'{rid}: impact dimensions')
        if set(dims)==set(weights):
            check(all(isinstance(v,(int,float)) and 0 <= v <= 10 and round(v,1)==v for v in dims.values()),f'{rid}: impact range/precision')
            total=round(sum(dims[k]*weights[k] for k in weights),2)
            check(impact.get('weighted_total',impact.get('total'))==total,f'{rid}: impact weighted total')
    check(all(key in impact for key in ('event_state','confidence','rationale')),f'{rid}: incomplete impact metadata')
report={'assigned':len(expected),'terminal':len(rows),'outcomes':dict(collections.Counter(row['status'] for row in rows)),'research_records':len(logs),'unique_source_urls':len({url for row in rows for url in row['source_urls']}),'pass_lengths':metrics,'errors':errors,'passed':not errors}
print(json.dumps(report,indent=2))
raise SystemExit(bool(errors))
