#!/usr/bin/env python3
"""Repair only explicit preserved-copy conflicts found during final validation."""
import json,re,os,tempfile
from pathlib import Path
from prepare_continuous_finish import ROOT,BASE,git
PACK=ROOT/'data/neon-workbench/external/card-consistency21-2026-10-05'
GAP=ROOT/'data/neon-workbench/external/offline-gap653-2026-10-05'
BRANCH='codex/card-consistency21-2026-10-05'
INSTRUCTION='''OFFLINE card consistency repair ONLY assigned IDs. No web/research/extra subagents. These existing complete records may preserve an unsupported long/title while their narrower medium or explicit notes flag the problem. Read all fields and pinned prior correction when supplied. Do not treat the disputed original long as evidence for itself. Determine whether existing title/short/medium/long actually agree with already-supported same-event facts. If supported narrow copy already exists, preserve it and repair only conflicting layers, even if old long already met length limits. No event substitution, invented context, causal/constitutional conclusions, new citations or word-count filler. Keep actual vs alleged/proposed actions separate and don't change event/date identity merely to find a convenient source. If supplied facts cannot support a discrete Trump/administration/family/associate event with coherent copy, hold exactreason; do not write140words of research-process boilerplate. Pass schema:record_id,status pass/hold,title and description_short<=180chars,description_medium45-90words,description_long140-300words,source_urls (existing supportingURLs only),source_fact_map exactfact/quote mapping,source_provenance,blockers,rationale,proposal_onlytrue,preservation_notes. Source quotations must be literally in clean supplied medium, factual notes or pinned prior correction; URL existence is not page verification. Exclude unsupported old-long assertions from evidence. All passes also include insight_facts,insight_evidence_map and impact_proposal following supplied audit_context_rescue_enrichments.py validate(row):knownfields backed by literal source_fact_map quote; quantities/relations empty; uncertaintiesunknown perfield. Impact: six dimensions0..10 in0.1steps, weighted_total half-up2places .30harm/.20reach/.15institutions/.15procedural_abuse/.10self_dealing/.10persistence; or deferred dimensions=null weighted_total=null exactreason. It is an editorial estimate, not measured impact; ordinary pardon/court finding is not itself abuse. Validate syntax/wordlimits/quote/value coverage and exactassignedIDs. Save/push append-only every1record, noPR. Corrections MUST be full immutable positive-revision amendment wrappers, NEVER delete/rewrite historical lines. No canonical/export/Neon/code edits.'''
def rows(p):return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]
def main():
    marker=PACK/'publication.json'
    if marker.exists():print(marker.read_text());return
    q=json.loads((BASE/'queue.json').read_text());assert all(j['state']=='complete' for j in q['jobs'])
    source=sorted(GAP.glob('manifest-*.json'))[-1];m=json.loads(source.read_text())
    ds={r['record_id']:r for r in rows(ROOT/m['descriptions']['path'])}
    pattern=re.compile(r'(?:linked|supplied|provided) sources? (?:do|does) not (?:identify|document|support|establish)|claim.{0,80}needs.{0,80}before|existing long description.{0,100}(?:unsupported|unsubstantiated)|needs.{0,60}before it can be completed',re.I)
    ids=sorted(rid for rid,r in ds.items() if r['status']=='complete' and pattern.search(r.get('description_medium','')+' '+str(r.get('notes',''))))
    assert len(ids)==21
    scores={r['record_id']:r for r in rows(ROOT/m['scores']['path'])};insights={r['record_id']:r for r in rows(ROOT/m['insights']['path'])}
    owners=sorted([j for j in q['jobs'] if j['lane']=='full-insights' and j['account']==6],key=lambda j:j['worker']);assert len(owners)==12
    PACK.mkdir(parents=True,exist_ok=True);prefix=PACK.relative_to(ROOT).as_posix();validator='data/neon-workbench/scripts/audit_context_rescue_enrichments.py'
    files={prefix+'/INSTRUCTIONS.md':INSTRUCTION+'\n',prefix+'/baseline-manifest.json':json.dumps(m,indent=2)+'\n',validator:(ROOT/validator).read_text(),
      prefix+'/RUBRIC.md':(GAP/'RUBRIC.md').read_text()};jobs=[]
    for n,owner in enumerate(owners,1):
        subset=ids[n-1::12];packet=[]
        for rid in subset:
            r=ds[rid];prior=None;p=r.get('cloud_rescue_provenance')
            if isinstance(p,dict) and p.get('commit') and p.get('file'):
                try:
                    raw=git('show',p['commit']+':'+p['file']);rr=[json.loads(l) for l in raw.splitlines() if l.strip()]
                    prior=[x for x in rr if x.get('record_id')==rid or x.get('entry_number')==r.get('entry_number')]
                except Exception:prior=None
            packet.append({'record_id':rid,'description':r,'old_score':scores[rid],'old_insight':insights[rid],
              'pinned_prior_correction':prior,'warning':'Disputed preserved long is not evidence for itself; no new web work.'})
        path=prefix+f'/worker-{n:02d}-input.jsonl';files[path]=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in packet)
        jobs.append({**{k:owner[k] for k in ('account','session_id','task_id','branch')},'id':f'consistency21-{n:02d}',
          'lane':'card-consistency21','worker':n,'assigned':subset,'input_path':path,'instruction':INSTRUCTION+f' Rubric:{prefix}/RUBRIC.md.',
          'output_path':prefix+f'/outputs/worker-{n:02d}-terminal.jsonl','state':'queued','attempts':0})
    files[prefix+'/assignments.json']=json.dumps({'assigned_ids':ids,'count':21,'workers':12,'account':6,'source_manifest':str(source.relative_to(ROOT)),
      'scope':'Explicit copy-consistency flags, not general source factual re-verification.'},indent=2)+'\n'
    if git('ls-remote','--heads','origin',BRANCH).split():raise SystemExit('Remote exists without marker; reconcile')
    parent=git('ls-remote','--heads','origin','main').split()[0];git('fetch','--quiet','origin',parent)
    with tempfile.TemporaryDirectory(prefix='trump-consistency-index-') as d:
        env={**os.environ,'GIT_INDEX_FILE':str(Path(d)/'index')};git('read-tree',parent,env=env)
        for p,text in files.items():
            blob=git('hash-object','-w','--stdin',env=env,data=text);git('update-index','--add','--cacheinfo','100644',blob,p,env=env)
        commit=git('commit-tree',git('write-tree',env=env),'-p',parent,'-m','Repair21 explicit preserved-copy consistency conflicts offline',env=env);git('push','origin',f'{commit}:refs/heads/{BRANCH}',env=env)
    for p,text in files.items():
        if p.startswith(prefix):(ROOT/p).write_text(text)
    for j in jobs:j.update(packet_branch=BRANCH,packet_commit=commit)
    incoming=BASE/'incoming/card-consistency21.json';tmp=incoming.with_suffix('.tmp');tmp.write_text(json.dumps({'jobs':jobs},indent=2)+'\n');os.replace(tmp,incoming)
    report={'branch':BRANCH,'commit':commit,'records':21,'workers':12,'account':6};marker.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
if __name__=='__main__':main()
