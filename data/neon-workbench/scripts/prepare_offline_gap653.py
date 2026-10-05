#!/usr/bin/env python3
"""Publish disjoint offline label/score repairs; never touch canonical data."""
import json, os, tempfile, hashlib
from pathlib import Path
from prepare_continuous_finish import ROOT, BASE, git

PACK=ROOT/'data/neon-workbench/external/offline-gap653-2026-10-05'
BRANCH='codex/offline-gap653-2026-10-05'
INSTRUCTION='''OFFLINE targeted gap repair. No web searches, no extra subagents, no reader-text rewrites. Own ONLY supplied IDs. Preserve all historical files. Read RUBRIC.md and validate_offline_gap653.py. For each input produce one terminal wrapper: record_id,status="complete",proposal_only=true,insight_proposal and score_proposal (null when that repair flag is false),blockers. Complete means reviewed, not forced success. Save/push after every 3 records and checkpoint. For repair_insights=true, return insight_proposal {status:complete/insufficient,insight_facts,evidence_map,blockers}. Use event_state realized/proposed/threatened/unclear/unknown; action_type discrimination/deception/legal_action/policy_action/institutional_pressure/private_benefit/violence_or_threat/other/unknown; scope individual/organization/local/regional/national/international/unknown; legal_stage allegation/investigation/charged/adjudicated/settled/policy/not_applicable/unknown; affected_groups and institutions string arrays; outcome string/null; quantities and relations EMPTY arrays. A missing outcome or uncertain causal claim should NOT erase supported event labels. Classify the narrower supplied event, preserving allegation vs finding and statement vs outcome. Map EVERY known scalar and every array element to evidence_map {field (unprefixed core name),value,basis_quote,source_url:null,evidence_status:"supplied_text"}; quotes must be exact nonempty substrings of supplied description_medium/long. These are classifications grounded in supplied text, NOT independent page verification. No invented measured reach/money/harm. Unknown per field is correct; mark insufficient only if no useful classification can be supported. For repair_score=true, independently reconsider old deferred score against ONLY completed narrower description. Return score_proposal {record_id,entry_number,version:"impact-v2",status:scored/deferred,dimensions,event_state,confidence:medium/low,confidence_reason,rationale,basis,notes}. Six dimensions harm,reach,institutions,procedural_abuse,self_dealing,persistence numeric0..10 in0.1steps. Follow supplied rubric; no composite/ranking needed (root computes). Ordinary lawful clemency is not procedural abuse; publicity is not affected population; allegations/plans are not realized damage. Defensible bounded editorial assessment may be possible even without quantities, but never assign severity zero to an unsupported core event: defer dimensions=null with exact reason. Do not change already-scored records or already-complete labels. Validate each wrapper against its original input with gate(input,row); correct issues BEFORE push. Append-only: corrections require new worker-NN-amendment-N.jsonl with positive revision and complete terminal_record, same record_id, amendment_of original path; never delete/rewrite old terminal rows. No canonical/live Neon/code edits.'''
def rows(p): return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]
def main():
    marker=PACK/'publication.json'
    if marker.exists(): print(marker.read_text()); return
    queue=json.loads((BASE/'queue.json').read_text()); assert all(j['state']=='complete' for j in queue['jobs'])
    source=sorted((ROOT/'data/neon-workbench/external/consolidated-offline-release-2026-10-05').glob('manifest-*.json'))[-1]
    manifest=json.loads(source.read_text())
    data={k:{r['record_id']:r for r in rows(ROOT/manifest[k]['path'])} for k in ('descriptions','insights','scores')}
    fi={k for k,r in data['insights'].items() if r['status']=='insufficient'}
    fs={k for k,r in data['scores'].items() if r['status']=='deferred' and data['descriptions'][k]['status']=='complete'}
    ids=sorted(fi|fs); assert (len(fi),len(fs),len(ids))==(365,370,653)
    owners=sorted([j for j in queue['jobs'] if j['lane']=='context99'],key=lambda j:((j['worker']-1)%12,j['account']))
    assert len(owners)==60 and len({j['task_id'] for j in owners})==60
    PACK.mkdir(parents=True,exist_ok=True); prefix=PACK.relative_to(ROOT).as_posix()
    files={prefix+'/INSTRUCTIONS.md':INSTRUCTION+'\n',prefix+'/baseline-manifest.json':json.dumps(manifest,indent=2)+'\n',
      prefix+'/RUBRIC.md':(ROOT/'data/neon-workbench/external/description-completion/2026-09-30/rescue-2026-10-02/score-followup/RUBRIC.md').read_text(),
      'data/neon-workbench/scripts/validate_offline_gap653.py':(ROOT/'data/neon-workbench/scripts/validate_offline_gap653.py').read_text()}
    jobs=[]
    for n,owner in enumerate(owners,1):
        subset=ids[n-1::60]; path=prefix+f'/worker-{n:02d}-input.jsonl'
        packet=[{'record_id':rid,'repair_insights':rid in fi,'repair_score':rid in fs,'description':data['descriptions'][rid],
          'old_insight':data['insights'][rid],'old_score':data['scores'][rid]} for rid in subset]
        files[path]=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in packet)
        jobs.append({**{k:owner[k] for k in ('account','session_id','task_id','branch')},'id':f'gap653-{n:02d}',
          'lane':'offline-gap653','worker':n,'assigned':subset,'input_path':path,'instruction':INSTRUCTION+f' Rubric: {prefix}/RUBRIC.md.',
          'output_path':prefix+f'/outputs/worker-{n:02d}-terminal.jsonl','state':'queued','attempts':0})
    files[prefix+'/assignments.json']=json.dumps({'count':653,'insights':365,'scores':370,'workers':60,
      'assignments':[{k:j[k] for k in ('id','account','assigned')} for j in jobs]},indent=2)+'\n'
    if git('ls-remote','--heads','origin',BRANCH).split(): raise SystemExit('Remote exists without publication marker; reconcile first')
    parent=git('ls-remote','--heads','origin','main').split()[0]; git('fetch','--quiet','origin',parent)
    with tempfile.TemporaryDirectory(prefix='trump-gap-index-') as d:
        env={**os.environ,'GIT_INDEX_FILE':str(Path(d)/'index')}; git('read-tree',parent,env=env)
        for path,text in files.items():
            blob=git('hash-object','-w','--stdin',env=env,data=text);git('update-index','--add','--cacheinfo','100644',blob,path,env=env)
        commit=git('commit-tree',git('write-tree',env=env),'-p',parent,'-m','Publish653 disjoint offline label and deferred-score reviews',env=env)
        git('push','origin',f'{commit}:refs/heads/{BRANCH}',env=env)
    for path,text in files.items():
        if path.startswith(prefix):(ROOT/path).write_text(text)
    for j in jobs:j.update(packet_branch=BRANCH,packet_commit=commit)
    incoming=BASE/'incoming/offline-gap653.json';tmp=incoming.with_suffix('.tmp');tmp.write_text(json.dumps({'jobs':jobs},indent=2)+'\n');os.replace(tmp,incoming)
    report={'branch':BRANCH,'commit':commit,'records':653,'workers':60,'accounts':{str(a):sum(j['account']==a for j in jobs) for a in range(1,7)}}
    marker.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
if __name__=='__main__':main()
