#!/usr/bin/env python3
"""Independent, offline VM check; contains no credentials or model writes."""
import collections
import hashlib
import json
import sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

def load(path): return [json.loads(s) for s in path.read_text().splitlines() if s.strip()]
def main():
    folder=Path(sys.argv[1])
    paths={name:folder/(name+'.jsonl') for name in ('descriptions','scores','insights')}
    rows={name:load(path) for name,path in paths.items()}
    ids={name:{r['record_id'] for r in records} for name,records in rows.items()}
    findings=[]
    for name,records in rows.items():
        if len(records)!=len(ids[name]):findings.append(name+': duplicate IDs')
    if ids['descriptions']!=ids['scores']:findings.append('description/score universe mismatch')
    complete={r['record_id'] for r in rows['descriptions'] if r['status']=='complete'}
    if ids['insights']!=complete:findings.append('insight universe not exact complete-description set')
    names=('harm','reach','institutions','procedural_abuse','self_dealing','persistence')
    weights=tuple(map(Decimal,('.30','.20','.15','.15','.10','.10')))
    for row in rows['scores']:
        if row['status']=='deferred':
            if row.get('dimensions') is not None or row.get('impact_score') is not None:findings.append(row['record_id']+': deferred score not NULL')
            continue
        dims=row['dimensions']
        value=sum(Decimal(str(dims[n]))*w for n,w in zip(names,weights)).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
        if value!=Decimal(str(row['impact_score'])):findings.append(row['record_id']+': weighted total mismatch')
    ranks=[r['ranking_position'] for r in rows['scores'] if r['status']=='scored']
    if set(ranks)!=set(range(1,len(ranks)+1)):findings.append('rank sequence not unique contiguous')
    if any('description_release_eligible' in r for r in rows['scores']):
        released=[]
        for r in rows['scores']:
            if r.get('description_release_eligible')!=(r['record_id'] in complete):findings.append(r['record_id']+': release eligibility mismatch')
            rank=r.get('release_ranking_position')
            if r['status']=='scored' and r.get('description_release_eligible'):released.append(rank)
            elif rank is not None:findings.append(r['record_id']+': held/deferred release rank not NULL')
        if set(released)!=set(range(1,len(released)+1)):findings.append('eligible release rank sequence not unique contiguous')
    report={'host_role':'Ora5 independent offline dataset check','counts':{name:dict(collections.Counter(r['status'] for r in records)) for name,records in rows.items()},
        'rows':{name:len(records) for name,records in rows.items()},'sha256':{name:hashlib.sha256(path.read_bytes()).hexdigest() for name,path in paths.items()},
        'findings':findings,'live_database_access':False,'scope':'ID universes, duplicates, decimal arithmetic, deferred NULLs, ordinal rank sequence; not factual/source verification'}
    print(json.dumps(report,indent=2))
    if findings:raise SystemExit(1)

if __name__=='__main__':main()
