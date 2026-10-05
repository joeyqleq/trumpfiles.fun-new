#!/usr/bin/env python3
"""Persistently schedule finite disjoint work, verify artifacts, and retry failures."""
import argparse
import collections
import hashlib
import concurrent.futures
import fcntl
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import uuid
import re
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone
from recalibrate_context_quota import recalibrate

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT/'data/neon-workbench/external/continuous-finish-2026-10-04'
PREFIX = BASE.relative_to(ROOT).as_posix()
CLIENT = Path(__file__).with_name('lightsprint_mcp.py')
ACTIVE = {'running','active','busy','working','in_progress','streaming','starting','queued'}

def now(): return datetime.now(timezone.utc).isoformat()
def save(path, obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    temp=path.with_suffix(path.suffix+'.tmp')
    temp.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
    os.replace(temp,path)
def git(*args):
    return subprocess.run(['git',*args],cwd=ROOT,check=True,capture_output=True,text=True,timeout=120).stdout
def api(account, method, path, body=None):
    request={'method':method,'path':path}
    if body is not None:request['body']=body
    result=subprocess.run([sys.executable,str(CLIENT),'api-json',json.dumps(request)],cwd=ROOT,
        env={**os.environ,'LIGHTSPRINT_MCP_SERVER':f'lightsprint{account}'},
        capture_output=True,text=True,timeout=90)
    if result.returncode:raise RuntimeError('MCP transport failed: '+result.stderr[-200:])
    envelope=json.loads(result.stdout)
    if envelope.get('error') or envelope.get('result',{}).get('isError'):
        detail=json.dumps(envelope.get('error') or envelope.get('result'))
        if any(s in detail.lower() for s in ('402','payment','billing','credit')):
            raise RuntimeError('ACCOUNT_CREDITS_BLOCKED')
        raise RuntimeError('MCP rejected request: '+detail[:300])
    result=envelope.get('result',{})
    for item in result.get('content',[]):
        if item.get('type')=='text':
            try:return json.loads(item['text'])
            except ValueError: return {'text':item['text']}
    return result

def linked_filename_revision(row, path, job):
    """Accept explicit same-worker, same-record immutable vN amendment chains."""
    key=row.get('record_id')
    if key not in job['assigned']:return None
    match=re.fullmatch(rf"worker-{job['worker']:02d}-amendment-{re.escape(key)}-v(\d+)\.jsonl",Path(path).name)
    if not match:return None
    version=int(match.group(1));link=str(row.get('amendment_of') or '')
    terminal=Path(job['output_path']).name+':'+key
    prior=rf"worker-{job['worker']:02d}-amendment-{re.escape(key)}-v(\d+)\.jsonl:{re.escape(key)}"
    parent=re.match(prior,link)
    if not (link.startswith(terminal) or (parent and int(parent.group(1))<version)):return None
    if row.get('amendment_revision') not in (None,version):return None
    return version if version>0 else None

def collect(job):
    ref='origin/'+job['branch']
    try:
        commit=git('rev-parse',ref).strip()
        raw=git('show',commit+':'+job['output_path'])
    except subprocess.CalledProcessError:return [], ['output_missing']
    rows=[];malformed_keys=set()
    for number,line in enumerate(raw.splitlines(),1):
        if not line.strip():continue
        try:row=json.loads(line)
        except json.JSONDecodeError:
            # Preserve malformed history. A narrow diff-prefix recovery is NOT
            # accepted until a full immutable valid amendment pins that ID.
            try:row=json.loads(line[1:]) if line.startswith('+{') else None
            except json.JSONDecodeError:row=None
            match=re.match(r'^\+?\{\s*"record_id"\s*:\s*"([^"\\]+)"',line)
            key=row.get('record_id') if isinstance(row,dict) else match.group(1) if match else None
            if key not in job['assigned']:raise
            malformed_keys.add(key)
            job.setdefault('malformed_history',[])
            note={'commit':commit,'line':number,'record_id':key,'issue':'malformed JSON; original bytes preserved; full valid amendment required'}
            if note not in job['malformed_history']:job['malformed_history'].append(note)
        if row is not None:rows.append(row)
    keys=[r.get('record_id') for r in rows]
    issues=[]
    duplicate_keys={key for key,count in collections.Counter(keys).items() if count>1}
    resolved_duplicates={key for key in duplicate_keys if
        all(r==next(x for x in rows if x.get('record_id')==key) for r in rows if r.get('record_id')==key)}
    if duplicate_keys:issues.append('duplicate_ids')
    if malformed_keys:issues.append('malformed_terminal_lines_require_full_amendment')
    parent=str(Path(job['output_path']).parent)
    amendment_prefix=f"worker-{job['worker']:02d}-amendment-"
    amendments=[p for p in git('ls-tree','-r','--name-only',commit,parent).splitlines()
                if Path(p).name.startswith(amendment_prefix) and p.endswith('.jsonl')]
    # Explicitly documented archives are history, not competing revisions.
    # Exclude only with a matching checksum and unchanged terminal payloads.
    archive_ledger=parent+f"/worker-{job['worker']:02d}-amendments.jsonl"
    try:archive_metadata=git('show',commit+':'+archive_ledger)
    except subprocess.CalledProcessError:archive_metadata=''
    for line in archive_metadata.splitlines():
        metadata=json.loads(line)
        if metadata.get('authoritative_terminal')!=Path(job['output_path']).name:continue
        archive=parent+'/'+str(metadata.get('amendment_id',''))+'-prior-attempt.jsonl'
        if archive not in amendments or not metadata.get('archive_sha256'):continue
        archived=git('show',commit+':'+archive)
        originals={r.get('record_id'):r for r in rows}
        same=all(originals.get(r.get('record_id'))==r for r in map(json.loads,archived.splitlines()) if r)
        if hashlib.sha256(archived.encode()).hexdigest()==metadata['archive_sha256'] and same:
            amendments.remove(archive)
            job.setdefault('excluded_identical_archives',[])
            if archive not in job['excluded_identical_archives']:job['excluded_identical_archives'].append(archive)
        else:issues.append('archive_not_verified:'+archive)
    effective={}
    for row in rows:effective.setdefault(row.get('record_id'),row)
    orders={key:(0,0) for key in effective}
    amendment_text={path:git('show',commit+':'+path) for path in amendments}
    def chronological(path):
        versions=[]
        for line in amendment_text[path].splitlines():
            if not line.strip():continue
            item=json.loads(line)
            version=item.get('revision')
            if not isinstance(version,int):
                match=re.search(r'amendment-(\d+)',str(item.get('amendment_id') or Path(path).name))
                version=int(match.group(1)) if match else linked_filename_revision(item,path,job)
            if isinstance(version,int):versions.append(version)
        return (min(versions,default=10**12),path)
    # Filename lexical order is not revision order (revision-3 sorts before v1).
    for path in sorted(amendments,key=chronological):
        for line in amendment_text[path].splitlines():
            if not line.strip():continue
            row=json.loads(line);key=row.get('record_id')
            if key not in job['assigned']:issues.append('outside_assignment_amendment')
            if row.get('current_pointer') and row.get('revision_history'):
                continue  # provenance resolution metadata; not a replacement terminal
            if not isinstance(row.get('revision'),int):
                match=re.search(r'amendment-(\d+)',str(row.get('amendment_id') or Path(path).name))
                if match:row['revision']=int(match.group(1))
                else:
                    version=linked_filename_revision(row,path,job)
                    if version is not None:row['revision']=version
            if not isinstance(row.get('revision'),int) or row['revision']<1:
                issues.append('amendment_revision_missing:'+str(key));continue
            previous=effective.get(key,{})
            order=(row['revision'],int(row.get('amendment_revision') or 0))
            if order<=orders.get(key,(0,0)):
                if order==orders.get(key) and row.get('terminal_record')==previous:continue
                issues.append('ambiguous_amendment_revision:'+str(key));continue
            orders[key]=order
            replacement=row.get('terminal_record') or row.get('replacement_row') or row.get('corrected_terminal_row')
            if isinstance(replacement,dict):
                replacement=dict(replacement);replacement['revision']=row['revision'];replacement['amendment_provenance']=path;replacement['amendment_order']=list(order)
                # Some explicit wrappers carry identity/status only outside the
                # payload. Inherit missing keys, never override a conflicting ID.
                if replacement.get('record_id') is None and key in job['assigned']:
                    replacement['record_id']=key
                    replacement['identity_inherited_from_amendment_wrapper']=True
                if replacement.get('status') is None and row.get('status') is not None:
                    replacement['status']=row['status']
                if replacement.get('record_id')!=key:issues.append('amendment_identity_mismatch');continue
                effective[key]=replacement
                resolved_duplicates.add(key)
            elif isinstance(row.get('replacements'),list) and previous:
                replacement=json.loads(json.dumps(previous));evidence=replacement.get('evidence_map',[])
                for item in row['replacements']:
                    field=item.get('field');value=item.get('value')
                    def target(v):
                        return {k:a for k,a in v.items() if k not in {'basis_quote','source_url','evidence_status'}} if isinstance(v,dict) else v
                    matching=[i for i,e in enumerate(evidence) if e.get('field')==field and target(e.get('value'))==target(value)]
                    if not matching:issues.append('amendment_evidence_target_missing:'+str(key));continue
                    for i in matching:evidence[i]=item
                replacement['revision']=row['revision'];replacement['amendment_provenance']=path;effective[key]=replacement
            else:
                row['amendment_provenance']=path;row['amendment_order']=list(order)
                effective[key]=row
                if row.get('status') is not None:resolved_duplicates.add(key)
    if duplicate_keys and duplicate_keys<=resolved_duplicates:
        issues.remove('duplicate_ids')
        job['historical_duplicate_ids_resolved_by_exact_match_or_full_amendment']=sorted(duplicate_keys)
    if malformed_keys and malformed_keys<=resolved_duplicates:
        issues.remove('malformed_terminal_lines_require_full_amendment')
        job['malformed_history_resolved_by_full_amendment']=sorted(malformed_keys)
    rows=list(effective.values());keys=[r.get('record_id') for r in rows]
    if set(keys)-set(job['assigned']):issues.append('outside_assignment')
    missing=set(job['assigned'])-set(keys)
    if missing:issues.append('missing_ids:'+','.join(sorted(missing)))
    for r in rows:
        if job['lane'] in {'held204','context99','web39-takeover','web39-recovery','final-primary45','card-consistency21'}:
            if r.get('status') not in {'pass','hold','exclusion_candidate'}:issues.append('bad_status:'+str(r.get('record_id')))
            if r.get('status')=='pass':
                row_findings=[]
                for field,low,high,words in [('title',1,180,False),('description_short',1,180,False),('description_medium',45,90,True),('description_long',140,300,True)]:
                    value=r.get(field) or '';n=len(value.split()) if words else len(value)
                    if not low<=n<=high:row_findings.append(f'{field}: {n}, expected {low}-{high}')
                if not r.get('source_urls') or not r.get('source_fact_map'):row_findings.append('missing source URLs or fact mapping')
                if row_findings:
                    r['worker_status']='pass';r['status']='hold';r['coordinator_gate_findings']=row_findings
                    r['coordinator_note']='Candidate retained; failed publication requirements. Original worker file is preserved.'
        elif job['lane'] in {'insights100','validation100','insights100-repair','validation100-repair','full-insights'}:
            if r.get('status') not in {'complete','insufficient'} or not isinstance(r.get('insight_facts'),dict):issues.append('bad_insights_schema:'+str(r.get('record_id')))
            if not isinstance(r.get('evidence_map'),list):issues.append('missing_evidence_map:'+str(r.get('record_id')))
        elif job['lane']=='offline-gap653':
            from validate_offline_gap653 import gate
            packets={p['record_id']:p for p in map(json.loads,(ROOT/job['input_path']).read_text().splitlines()) if p}
            if r.get('record_id') in packets:
                issues.extend('offline_gap:'+str(r.get('record_id'))+':'+e for e in gate(packets[r['record_id']],r))
        elif job['lane']=='context-enrichment-qa':
            if r.get('status') not in {'pass','hold'}:
                issues.append('bad_context_enrichment_status:'+str(r.get('record_id')))
            elif r.get('status')=='pass':
                from finalize_context_enrichment_repairs import gate
                original=json.loads((ROOT/job['input_path']).read_text())['record']
                result=gate(original,r)
                if result['status']!='pass':
                    issues.append('context_enrichment_gate:'+json.dumps({
                        'record_id':r.get('record_id'),
                        'changed_protected_fields':result.get('changed_protected_fields'),
                        'validator':result.get('validator')},ensure_ascii=False))
        elif job['lane']=='offline-gap653-qa':
            if r.get('status') not in {'pass','revise','hold'}:issues.append('bad_qa_status:'+str(r.get('record_id')))
            if r.get('status')=='revise':
                from validate_offline_gap653 import gate
                packets={p['record_id']:p for p in map(json.loads,(ROOT/job['input_path']).read_text().splitlines()) if p}
                correction=r.get('corrected_terminal_record')
                if not isinstance(correction,dict):issues.append('qa_missing_full_correction:'+str(r.get('record_id')))
                elif r.get('record_id') in packets:issues.extend('gap_qa:'+str(r['record_id'])+':'+e for e in gate(packets[r['record_id']],correction))
        elif job['lane'].endswith('-qa'):
            if r.get('status') not in {'pass','revise','hold'}:issues.append('bad_qa_status:'+str(r.get('record_id')))
        elif job['lane']=='changed105':
            names=('harm','reach','institutions','procedural_abuse','self_dealing','persistence')
            if r.get('status') not in {'scored','deferred'}:issues.append('bad_score_status:'+str(r.get('record_id')))
            elif r['status']=='scored':
                dims=r.get('dimensions')
                valid=isinstance(dims,dict) and set(dims)==set(names) and all(isinstance(dims[k],(int,float)) and not isinstance(dims[k],bool) and 0<=dims[k]<=10 and Decimal(str(dims[k]))*10==(Decimal(str(dims[k]))*10).to_integral_value() for k in names)
                if not valid:issues.append('bad_dimensions:'+str(r.get('record_id')))
                else:r['impact_score']=float(sum(Decimal(str(dims[k]))*w for k,w in zip(names,map(Decimal,('0.30','0.20','0.15','0.15','0.10','0.10')))).quantize(Decimal('0.01'),rounding=ROUND_HALF_UP))
            elif r.get('dimensions') is not None:issues.append('deferred_dimensions_not_null:'+str(r.get('record_id')))
    path=BASE/'collected'/job['lane']/f"worker-{job['worker']:02d}.jsonl"
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows))
    job['output_paths']=[job['output_path']]+amendments
    job['output_commit']=commit
    return rows,issues

def prompt(job, issues=None):
    text=(f"Continue the authorized Trump Files finish project. Deterministic job {job['id']}; ONLY these IDs: {json.dumps(job['assigned'])}. "
          f"Fetch branch {job['packet_branch']} at {job['packet_commit']}; read {job['input_path']}. {job['instruction']} "
          f"Write append-only terminal rows with top-level record_id and status to {job['output_path']}; append missing rows only and preserve history. "
          "If a prior terminal needs correction, write a separate immutable amendment and document it in final QA rather than silently overwriting. "
          "Save progress every 2-3 records, complete all assigned IDs, validate exact set and commit/push. No PR. Use GPT-6 Luna low; do not launch extra subagents.")
    if issues:
        text+=' Coordinator found these exact artifact issues: '+json.dumps(issues)+'. Resolve these only.'
        if any('malformed_terminal' in issue for issue in issues):
            text+=' Preserve the malformed original file BYTE-FOR-BYTE. Supply valid complete terminal_record wrappers with matching record_id and positive revision in a NEW immutable worker-NN-amendment-N.jsonl. Do NOT clean, truncate or rewrite the malformed history. Recover every missing assigned ID and validate JSON syntax and the exact set.'
    return text

def send(job, issues=None):
    job['attempts']=job.get('attempts',0)+1
    key=str(uuid.uuid5(uuid.NAMESPACE_URL,f"trump-continuous-{job['id']}-{job['attempts']}"))
    text=prompt(job,issues)
    result=api(job['account'],'POST',f"/api/agent-sessions/{job['session_id']}/chat",
               {'clientMessageId':key,'content':text,'message':text})
    save(BASE/'dispatch'/f"{job['id']}-attempt-{job['attempts']}.json",{'at':now(),'response':result,'job':job['id']})
    if result.get('ok') is False:raise RuntimeError('followup not accepted')
    job.update(state='sent',last_sent=time.time(),last_sent_at=now())

def add_crossqa(queue, lane='insights100', account=3):
    source=[j for j in queue['jobs'] if j['lane']==lane]
    source=[j for j in source if j['state']=='complete' and
            not any(q['id']==f"{lane}-qa-{j['worker']:02d}" for q in queue['jobs'])]
    if not source:return
    control=(ROOT/'data/neon-workbench/external/five-account-round-2026-10-03/control'/f'account{account}' if account != 1 else
             ROOT/'data/neon-workbench/external/description-completion/2026-09-30/rescue-2026-10-02/dual-account-wave3/control/account1')
    for job in source:
        n=job['worker'];o=json.loads((control/f'worker-{n:02d}.json').read_text())
        previous=next((q for q in reversed(queue['jobs']) if q['account']==account and q['worker']==n),None)
        if previous:o={**o,'session_id':previous['session_id']}
        instruction=(f"Independently validate the supplied-text insights extraction on branch {job['branch']} pinned at {job['output_commit']}, file {job['output_path']}. "
            f"Read immutable amendments too, if any: {json.dumps(job.get('output_paths',[]))}. Select highest explicit revision per ID. Compare to original sample input, not merely the worker rationale. One terminal QA row per record_id with status pass/revise/hold, findings, field_checks, and corrected_insight_facts only if literal evidence supports the change. "
            "Check each quoted basis is in supplied text, enum definitions, allegation vs finding, proposed vs realized, quantity value/unit/qualifier, relation direction, unknown/null handling. Direction convention: acted_on is actor->target; benefited_from is beneficiary->event/entity; object_of_legal_action is defendant/target->authority taking legal action. Do not reverse plaintiff and defendant. Numeric amendment IDs/file suffixes define amendment order when a wrapper lacks an explicit revision; terminal_record/replacement_row wrappers supersede original row, replacements is an evidence-map-only correction. "
            "Do not invent evidence or interpret source URLs as fetched pages. Calculate count of supported useful fields per row. Unknown values are not extraction failures. "
            "Record sample-selection bias: these are early eligible records, not a random whole-catalog sample. No web, new scores, canonical edits or database writes.")
        queue['jobs'].append({'id':f'{lane}-qa-{n:02d}','lane':lane+'-qa','account':account,'worker':n,
            'assigned':job['assigned'],'input_path':job['input_path'],'instruction':instruction,
            'session_id':o['session_id'],'task_id':o['task_id'],'branch':o['branch'],
            'output_path':f'{PREFIX}/{lane}-qa/outputs/worker-{n:02d}-terminal.jsonl',
            'packet_branch':job['packet_branch'],'packet_commit':job['packet_commit'],'state':'queued','attempts':0})

def add_gapqa(queue):
    """Release independent checks only after both distinct owner/target finish."""
    source=sorted([j for j in queue['jobs'] if j['lane']=='offline-gap653'],key=lambda j:j['worker'])
    if len(source)!=60:return
    for i,owner in enumerate(source):
        target=source[(i+1)%60];jid=f"gap653-qa-{owner['worker']:02d}"
        if owner['state']!='complete' or target['state']!='complete' or any(j['id']==jid for j in queue['jobs']):continue
        if any(j['state']!='complete' and j['task_id']==owner['task_id'] for j in queue['jobs']):continue
        instruction=(f"Independent offline QA, not new research. Review ONLY assigned IDs from original input; compare effective terminal wrappers on branch {target['branch']} at {target['output_commit']}, files {json.dumps(target['output_paths'])}. "
          "Read validate_offline_gap653.py and the packet RUBRIC.md. Check meaning, not just exact quotes: a quote can be literal yet not support an affected group, scope or outcome. Distinguish attributed allegations, proposals, actual conduct, court action and the subject's misconduct. No invented impact, attention-as-reach, ordinary clemency-as-abuse or unsupported causal outcomes. Missing outcomes must not erase supported labels. Existing labels/scores may not be changed unless their supplied repair flag is true. Verify dimensions fit rubric and narrower event, confidence medium/low, editorial not objective measurement. "
          "One terminal row per ID: record_id,status pass/revise/hold,findings array. If revise, include corrected_terminal_record with COMPLETE original wrapper schema and valid gate(input,wrapper); preserve unaltered adequate parts, fix only supported errors. If no defensible correction exists hold with exact reason. No web searches, extra subagents, reader-text/canonical edits or database writes. Never rewrite target outputs or historical lines; save/push append-only QA outcomes every3records.")
        queue['jobs'].append({**{k:owner[k] for k in ('account','session_id','task_id','branch','worker')},
          'id':jid,'lane':'offline-gap653-qa','assigned':target['assigned'],'input_path':target['input_path'],
          'packet_branch':target['packet_branch'],'packet_commit':target['packet_commit'],'instruction':instruction,
          'review_target':target['id'],'output_path':str(Path(target['output_path']).parent.parent)+f"/qa/worker-{owner['worker']:02d}-terminal.jsonl",
          'state':'queued','attempts':0})

def add_repairs(queue,lane):
    qa_jobs=[j for j in queue['jobs'] if j['lane']==lane+'-qa' and j['state']=='complete']
    utility_path=BASE/'utility-report.json'
    utility=json.loads(utility_path.read_text()) if utility_path.exists() else {}
    for review in qa_jobs:
        n=review['worker'];repair_id=f'{lane}-repair-{n:02d}'
        if any(j['id']==repair_id for j in queue['jobs']):continue
        source=next(j for j in queue['jobs'] if j['lane']==lane and j['worker']==n)
        path=BASE/'collected'/review['lane']/f'worker-{n:02d}.jsonl'
        qa=[json.loads(s) for s in path.read_text().splitlines() if s.strip()]
        evidence_issues=[x for x in utility.get(lane,{}).get('evidence_issues',[]) if x['record_id'] in source['assigned']]
        failures=[x for x in qa if x['status']!='pass']
        if not failures and not evidence_issues:continue
        instruction=(source['instruction']+f" Sequential repair after independent review. Read review branch {review['branch']} at {review['output_commit']}, file {review['output_path']}; "
            f"read your original output {source['output_path']} and all immutable amendments at {source['output_commit']}. "
            f"Additional literal evidence findings: {json.dumps(evidence_issues)}. "
            "Correct only facts, evidence quotes and relation direction actually flagged. Keep every previously passing value unchanged unless its basis was explicitly flagged. "
            "If a claim or relation cannot be supported, remove only that field/array element or use unknown/null and document why; do not fabricate supporting context. "
            "One full effective extraction row per original assigned key, including unchanged passing rows. Each evidence-map field must name its insight_facts field and quote literal original supplied text. "
            "Direction: acted_on actor->target; benefited_from beneficiary->event; object_of_legal_action defendant/target->authority. "
            "Amounts are not harm totals; preserve what the number describes. This is the single planned correction pass; finish with a clear supported partial when evidence is missing.")
        queue['jobs'].append({**{k:source[k] for k in ('account','worker','assigned','input_path','session_id','task_id','branch','packet_branch','packet_commit')},
            'id':repair_id,'lane':lane+'-repair','instruction':instruction,
            'output_path':f'{PREFIX}/{lane}-repair/outputs/worker-{n:02d}-terminal.jsonl','state':'queued','attempts':0})

def recovered_session(job):
    """A timed-out launch can create a run; do not blindly duplicate it."""
    runs=api(job['account'],'GET',f"/api/tasks/{job['task_id']}/lightsprint-agents")
    active=runs.get('activeAgent') or {}
    if (active.get('id') != job['session_id'] and active.get('taskId') == job['task_id']
            and active.get('branchName') == job['branch']
            and str(active.get('status','')).lower() in {'running','starting'}):
        return active
    return None

def process_job(job):
    # Each network worker owns a copy. Only the coordinator writes queue.json.
    try:
        rows,issues=collect(job)
        job['saved']=len(rows);job['issues']=issues
        if not issues:
            job.update(state='complete',completed_at=now());job.pop('blocker',None);job.pop('error',None)
            return job
        result=api(job['account'],'GET',f"/api/agent-sessions/{job['session_id']}/status")
        status=result.get('status') or result
        job['live_status']=status.get('sessionStatus');job['relay_alive']=(status.get('relayHealth') or {}).get('alive')
        state=str(job['live_status'] or '').lower()
        if state in ACTIVE:
            job['state']='running' if job.get('attempts') else 'awaiting_slot'
            return job
        # A worker can push while this multi-minute polling cycle is underway.
        # Refresh its exact branch before treating an idle session as unfinished.
        git('fetch','--no-write-fetch-head','--quiet','origin',
            f"+refs/heads/{job['branch']}:refs/remotes/origin/{job['branch']}")
        rows,issues=collect(job)
        job['saved']=len(rows);job['issues']=issues
        if not issues:
            job.update(state='complete',completed_at=now());job.pop('blocker',None);job.pop('error',None)
            return job
        if time.time()-job.get('last_sent',0)<180:return job
        if job.get('attempts',0)>=3:
            job.update(state='blocked',blocker='three followups exhausted; needs coordinator repair')
            return job
        if state in {'failed','error','stopped','terminated'} or job['relay_alive'] is False:
            recovered=recovered_session(job)
            if recovered:
                job.update(session_id=recovered['id'],state='sent',last_sent=time.time(),
                           attempts=max(1,job.get('attempts',0)),recovered_launch_at=now())
                job.pop('error',None)
                return job
            message=prompt(job,issues)
            api(job['account'],'PATCH',f"/api/tasks/{job['task_id']}",{'description':message,'complexity':'low'})
            try:
                r=api(job['account'],'POST',f"/api/tasks/{job['task_id']}/lightsprint-agents/codex",
                      {'model':'gpt-6-luna','reasoningEffort':'low','autoMerge':False,'branchName':job['branch']})
                s=r.get('session',r);sid=s.get('id') or s.get('sessionId')
                if not sid:raise RuntimeError('replacement session not returned')
            except Exception:
                recovered=recovered_session(job)
                if not recovered:raise
                sid=recovered['id'];r={'recovered_after_ambiguous_launch':True,'sessionId':sid}
            job['session_id']=sid;job['attempts']=job.get('attempts',0)+1;job['last_sent']=time.time();job['state']='sent'
            save(BASE/'dispatch'/f"{job['id']}-replacement-{job['attempts']}.json",{'at':now(),'response':r,'job':job['id']})
        else:send(job,issues if job.get('attempts') else None)
        job.pop('error',None)
    except Exception as e:
        job['error']=str(e)[:400]
        if str(e)=='ACCOUNT_CREDITS_BLOCKED':
            job.update(state='blocked',blocker='account credits',preceding_live_status=job.get('live_status'))
    return job

def cycle(queue):
    try:git('fetch','origin','+refs/heads/ls/*:refs/remotes/origin/ls/*','--quiet')
    except Exception as e:queue['fetch_error']=str(e)[:300];return
    # Six lightweight I/O calls, not six additional model agents. Slow account
    # startup must not block unrelated accounts. Duplicate ownership remains forbidden.
    byaccount=collections.defaultdict(list)
    for i,j in enumerate(queue['jobs']):
        if j['state']!='complete':byaccount[j['account']].append((i,json.loads(json.dumps(j))))
    pending=[group[n] for n in range(max(map(len,byaccount.values()),default=0))
             for account,group in sorted(byaccount.items()) if n<len(group)]
    # Fill unstarted slots and reconcile ambiguous launches before routine
    # polling of healthy runs; retain account interleaving within each group.
    pending.sort(key=lambda pair:0 if pair[1]['state']=='queued' or pair[1].get('error') else 1)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures={pool.submit(process_job,j):i for i,j in pending}
        for future in concurrent.futures.as_completed(futures):
            queue['jobs'][futures[future]]=future.result()
            save(BASE/'queue.json',queue)
    owners_before={j['id']:j['account'] for j in queue['jobs']}
    adjusted=recalibrate(queue)
    queue.clear();queue.update(adjusted)
    queue['quota_reassigned_this_cycle']=[j['id'] for j in queue['jobs'] if j['account']!=owners_before[j['id']]]
    add_crossqa(queue)
    add_crossqa(queue,'validation100',1)
    add_repairs(queue,'insights100')
    add_repairs(queue,'validation100')
    add_crossqa(queue,'insights100-repair',3)
    add_crossqa(queue,'validation100-repair',1)
    add_gapqa(queue)
    queue['updated_at']=now()
    queue['counts']=dict(collections.Counter(j['state'] for j in queue['jobs']))
    queue['finished']=all(j['state']=='complete' for j in queue['jobs'])
    save(BASE/'queue.json',queue)
    save(BASE/'status-latest.json',{'at':now(),'counts':queue['counts'],'finished':queue['finished'],
        'workers':[{k:j.get(k) for k in ('id','account','worker','assigned','state','saved','live_status','relay_alive','issues','error','blocker','output_commit')} for j in queue['jobs']]})
    evaluation=subprocess.run([sys.executable,str(Path(__file__).with_name('evaluate_insights_utility.py'))],cwd=ROOT,capture_output=True,text=True,timeout=90)
    save(BASE/'evaluation-last-run.json',{'at':now(),'returncode':evaluation.returncode,'output':evaluation.stdout[-2000:],'error':evaluation.stderr[-2000:]})
    if evaluation.returncode==0:
        subprocess.run([sys.executable,str(Path(__file__).with_name('render_insights_preview.py'))],cwd=ROOT,capture_output=True,text=True,timeout=30)
        rollout=subprocess.run([sys.executable,str(Path(__file__).with_name('prepare_insights_full_rollout.py'))],cwd=ROOT,capture_output=True,text=True,timeout=180)
        save(BASE/'rollout-last-check.json',{'at':now(),'returncode':rollout.returncode,'output':rollout.stdout[-2000:],'error':rollout.stderr[-2000:]})
    print(json.dumps({'at':now(),'counts':queue['counts'],'finished':queue['finished']}),flush=True)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--once',action='store_true');parser.add_argument('--interval',type=int,default=300);args=parser.parse_args()
    BASE.mkdir(parents=True,exist_ok=True)
    with (BASE/'supervisor.lock').open('w') as lock:
        try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:raise SystemExit('supervisor already running')
        while True:
            cycle_started=time.monotonic()
            queue=json.loads((BASE/'queue.json').read_text())
            prior_count=len(queue['jobs'])
            for incoming in sorted((BASE/'incoming').glob('*.json')):
                batch=json.loads(incoming.read_text())
                for job in batch['jobs']:
                    if not any(j['id']==job['id'] for j in queue['jobs']):queue['jobs'].append(job)
            if len(queue['jobs'])!=prior_count:
                queue['finished']=False
                save(BASE/'queue.json',queue)
            before=len(queue['jobs']);cycle(queue)
            new_incoming=any(not any(j['id']==new['id'] for j in queue['jobs'])
                for p in (BASE/'incoming').glob('*.json') for new in json.loads(p.read_text())['jobs'])
            if queue.get('finished') and not new_incoming and any(j['lane']=='offline-gap653' for j in queue['jobs']):
                final=subprocess.run([sys.executable,str(Path(__file__).with_name('finalize_offline_gap653.py'))],cwd=ROOT,capture_output=True,text=True,timeout=90)
                save(BASE/'offline-gap653-finalization.json',{'at':now(),'returncode':final.returncode,'output':final.stdout[-3000:],'error':final.stderr[-3000:]})
                if final.returncode:raise RuntimeError('offline gap finalization failed; inspect saved diagnostics')
            if queue.get('finished') and not new_incoming and any(j['lane']=='card-consistency21' for j in queue['jobs']):
                final=subprocess.run([sys.executable,str(Path(__file__).with_name('finalize_consistency21.py'))],cwd=ROOT,capture_output=True,text=True,timeout=90)
                save(BASE/'card-consistency21-finalization.json',{'at':now(),'returncode':final.returncode,'output':final.stdout[-3000:],'error':final.stderr[-3000:]})
                if final.returncode:raise RuntimeError('card consistency finalization failed; inspect saved diagnostics')
            if args.once or (queue.get('finished') and not new_incoming):return
            if new_incoming:continue
            if len(queue['jobs'])>before:continue
            if queue.get('quota_reassigned_this_cycle'):continue
            # Polling work counts toward the interval, rather than adding a
            # fresh five-minute delay after a long status/recovery cycle.
            time.sleep(max(1,args.interval-(time.monotonic()-cycle_started)))

if __name__=='__main__':main()
