#!/usr/bin/env python3
"""Build final offline snapshot from exact21 card corrections, never live writes."""
import json,copy,hashlib,re
from collections import Counter
from datetime import datetime,timezone
from decimal import Decimal,ROUND_HALF_UP
from prepare_continuous_finish import ROOT,BASE
from prepare_consistency21 import PACK
from audit_context_rescue_enrichments import validate,WEIGHTS
def rows(p):
    with p.open() as source:
        for l in source:
            if l.strip():yield json.loads(l)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def quote_findings(mapping,packet):
    """Reject literal evidence absent from allowed input; disputed old long is excluded."""
    description=packet.get('description',{})
    allowed=json.dumps({'medium':description.get('description_medium',''),
      'notes':description.get('notes',''),'prior':packet.get('pinned_prior_correction')},ensure_ascii=False)
    # Decode serialized strings so punctuation and quotation escapes do not change matching.
    def strings(value):
        if isinstance(value,str):yield value
        elif isinstance(value,dict):
            for v in value.values():yield from strings(v)
        elif isinstance(value,list):
            for v in value:yield from strings(v)
    corpus=list(strings(json.loads(allowed)))
    quotes=[]
    def walk(value):
        if isinstance(value,dict):
            for k,v in value.items():
                if k in ('quote','quotes','basis_quote'):quotes.extend(strings(v))
                elif isinstance(v,dict):walk(v)
                elif isinstance(v,list) and k not in ('supported_facts','limitations'):walk(v)
        elif isinstance(value,list):
            for v in value:
                if isinstance(v,str):quotes.append(v)
                else:walk(v)
    # List-of-fact objects include paraphrased fact fields, not literal quotes.
    if isinstance(mapping,list):
        for item in mapping:
            if isinstance(item,dict):
                for key in ('quote','quotes','basis_quote'):quotes.extend(strings(item.get(key,[])))
    else:walk(mapping)
    def normalized(s):return re.sub(r'\\u([0-9a-fA-F]{4})',lambda m:chr(int(m.group(1),16)),s)
    return ['source_quote_not_in_allowed_input'] if not quotes or any(not any(normalized(q) in normalized(s) for s in corpus) for q in quotes) else []
def main():
    q=json.loads((BASE/'queue.json').read_text());jobs=[j for j in q['jobs'] if j['lane']=='card-consistency21']
    if len(jobs)!=12 or any(j['state']!='complete' for j in jobs):print(json.dumps({'status':'pending','workers_complete':sum(j['state']=='complete' for j in jobs)}));return
    manifest=json.loads((PACK/'baseline-manifest.json').read_text())
    data={k:{r['record_id']:r for r in rows(ROOT/manifest[k]['path'])} for k in ('descriptions','insights','scores')}
    for k in data:assert digest(ROOT/manifest[k]['path'])==manifest[k]['sha256']
    seen=set();provenance=[];counts=Counter()
    amendment_path=PACK/'coordinator-score-amendments.json'
    score_amendments=json.loads(amendment_path.read_text())['entries'] if amendment_path.exists() else {}
    for j in jobs:
        packets={r['record_id']:r for r in rows(ROOT/j['input_path'])}
        result=list(rows(BASE/'collected/card-consistency21'/f"worker-{j['worker']:02d}.jsonl"))
        assert len(result)==len(packets) and {r['record_id'] for r in result}==set(packets)
        for terminal in result:
            rid=terminal['record_id'];assert rid not in seen;seen.add(rid)
            old=copy.deepcopy(data['descriptions'][rid]);r=copy.deepcopy(terminal)
            coordinator_amendments=[]
            if rid=='entry-6163':
                for mapping in r.get('source_fact_map',[]):
                    if mapping.get('quote')=='The executive action concerned taxpayer funding.':
                        mapping['quote']='The executive action concerned taxpayer funding and the organizations that distribute or receive it.'
                        coordinator_amendments.append('Replace shortened quote with exact pinned prior correction sentence; facts and scores unchanged.')
            valid=r['status']=='pass';issues=[]
            if valid:
                for f,lo,hi,words in [('title',1,180,False),('description_short',1,180,False),('description_medium',45,90,True),('description_long',140,300,True)]:
                    text=r.get(f) or '';n=len(text.split()) if words else len(text)
                    if not lo<=n<=hi:issues.append(f+':length')
                if not r.get('source_urls') or not r.get('source_fact_map'):issues.append('missing_source_mapping')
                issues.extend(quote_findings(r.get('source_fact_map'),packets[rid]))
                enriched=validate(r)
                if enriched['status']!='valid':issues.append('enrichment:'+json.dumps(enriched['diagnostics']))
                valid=not issues
            source={k:j[k] for k in ('id','account','output_commit','output_paths','packet_commit','input_path')}
            provenance.append({'record_id':rid,'original_description':old,'worker_terminal':terminal,'effective_status':'pass' if valid else 'hold','gate_findings':issues,'coordinator_amendments':coordinator_amendments,'provenance':source})
            if valid:
                for f in ('title','description_short','description_medium','description_long','source_urls','source_fact_map','source_provenance','blockers','rationale'):
                    if f in r:data['descriptions'][rid][f]=r[f]
                data['descriptions'][rid].update(status='complete',consistency_repair_provenance=source)
                data['insights'][rid]={'record_id':rid,'status':'complete','proposal_only':True,'insight_facts':r['insight_facts'],
                    'evidence_map':[{**e,'field':'insight_facts.'+e['field'].removeprefix('insight_facts.'),'basis_quote':e.get('quote',e.get('basis_quote')),'evidence_status':'supplied_text'} for e in r['insight_evidence_map']],
                    'source_fact_map':r['source_fact_map'],'consistency_repair_provenance':source}
                score=copy.deepcopy(r['impact_proposal']);score.update(record_id=rid,entry_number=old['entry_number'],version='impact-v2',publication_status='provisional_offline',consistency_repair_provenance=source)
                if score['status']=='scored' and rid in score_amendments:
                    amendment=score_amendments[rid];score['dimensions'].update(amendment['dimensions'])
                    score['rationale']=amendment['reason']+' Other dimensions retain the worker estimate for the stated event, not measured impact.'
                    score['coordinator_score_amendment']=amendment
                if score['status']=='scored':
                    score.setdefault('confidence','low');score.setdefault('confidence_reason','Offline supplied-text assessment only; source pages and downstream effects not independently verified.')
                    score.setdefault('event_state',r['insight_facts'].get('event_state','unclear'))
                    score.setdefault('basis',r['description_medium']);score.setdefault('notes','Editorial comparative index, not measured real-world harm.')
                score['impact_score']=float(sum(Decimal(str(score['dimensions'][k]))*w for k,w in WEIGHTS.items()).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)) if score['status']=='scored' else None
                score['weighted_total']=score['impact_score']
                data['scores'][rid]=score;counts['pass']+=1
            else:
                data['descriptions'][rid].update(status='needs_context',consistency_repair_provenance=source,
                    consistency_hold_reason=r.get('blockers') or issues or r.get('rationale'))
                data['insights'].pop(rid,None);counts['hold']+=1
    assert len(seen)==21
    scored=[r for r in data['scores'].values() if r['status']=='scored']
    scored.sort(key=lambda r:(-r['impact_score'],-r['dimensions']['harm'],-r['dimensions']['reach'],-r['dimensions']['institutions'],-r['dimensions']['persistence'],r['record_id']))
    for rank,r in enumerate(scored,1):r['ranking_position']=rank
    released=[]
    for rid,r in data['scores'].items():
        r['description_release_eligible']=data['descriptions'][rid]['status']=='complete';r['release_ranking_position']=None
        if r['status']=='deferred':r.update(dimensions=None,impact_score=None,ranking_position=None)
        if not r['description_release_eligible']:r['publication_hold']='Description held: do not expose historical score as release-ready.'
        else:r.pop('publication_hold',None)
    for r in scored:
        if r['description_release_eligible']:released.append(r);r['release_ranking_position']=len(released)
    assert set(data['insights'])=={rid for rid,r in data['descriptions'].items() if r['status']=='complete'}
    stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ');out=copy.deepcopy(manifest)
    for k in data:
        path=PACK/f'{k}-final-{stamp}.jsonl'
        with path.open('w') as output:
            for rid in sorted(data[k]):output.write(json.dumps(data[k][rid],ensure_ascii=False)+'\n')
        out[k]={'path':str(path.relative_to(ROOT)),'sha256':digest(path),'rows':len(data[k]),'counts':dict(Counter(r['status'] for r in data[k].values()))}
    p=PACK/f'provenance-{stamp}.jsonl';p.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in provenance))
    out.update(created_at=datetime.now(timezone.utc).isoformat(),card_consistency=dict(counts),
      card_consistency_provenance=str(p.relative_to(ROOT)),eligible_scored_descriptions=len(released),
      withheld_scored_records=len(scored)-len(released),publication_status='offline_proposals_only')
    out['preservation']['explicit21_consistency_repairs_supersede_only_their_prior_proposals']=True
    out['preservation']['existing_scored_dimensions_totals_rationales_unchanged']=False
    out['preservation']['existing_complete_insights_unchanged']=False
    out['preservation']['scope']='Only the explicit21 consistency assignments can supersede prior offline proposals; original rows and worker history retained.'
    if amendment_path.exists():out['coordinator_score_amendments']={'path':str(amendment_path.relative_to(ROOT)),'sha256':digest(amendment_path),'count':len(score_amendments)}
    path=PACK/f'manifest-{stamp}.json';path.write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'manifest':str(path.relative_to(ROOT)),'corrections':dict(counts),'descriptions':out['descriptions']['counts'],'insights':out['insights']['counts'],'scores':out['scores']['counts']}))
if __name__=='__main__':main()
