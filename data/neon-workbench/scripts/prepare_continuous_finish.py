#!/usr/bin/env python3
"""Publish immutable finish inputs and queue deterministic cloud assignments."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[3]
EXT = ROOT / 'data/neon-workbench/external'
BASE = EXT / 'continuous-finish-2026-10-04'
PREFIX = BASE.relative_to(ROOT).as_posix()
BRANCH = 'codex/continuous-finish-2026-10-04'

def git(*args, env=None, data=None):
    return subprocess.run(['git', *args], cwd=ROOT, env=env, input=data,
                          capture_output=True, text=True, check=True).stdout.strip()

def owner(account, worker):
    path = EXT / ('account6-source-corrections-2026-10-03/control/account6' if account == 6
                  else f'five-account-round-2026-10-03/control/account{account}')
    return json.loads((path / f'worker-{worker:02d}.json').read_text())

INSIGHTS = '''Extract structured insight facts ONLY from supplied frozen/staged entry text and sources already supplied. No web searches or new scoring. One row per record_id, status complete or insufficient, insight_facts object with: event_state (realized/proposed/threatened/unclear), action_type (discrimination/deception/legal_action/policy_action/institutional_pressure/private_benefit/violence_or_threat/other/unknown), affected_groups (array of text-explicit group names), institutions (array of named affected institutions), scope (individual/organization/local/regional/national/international/unknown), legal_stage (allegation/investigation/charged/adjudicated/settled/policy/not_applicable/unknown), outcome (text-explicit brief outcome or null), quantities (array of {kind:money/people/properties/duration/other,value:number,unit:string,qualifier:exact/at_least/at_most/approximate/alleged,source_url:string,basis_quote:string}), relations (array of {subject:string,predicate:acted_on/benefited_from/associated_with/object_of_legal_action,object:string,basis_quote:string}). Each non-unknown scalar and array element must have a text basis in evidence_map, with field, value, basis_quote, source_url or null, and evidence_status supplied_text/supplied_source_mapping. Quotes must be literal substrings of supplied text; document only what the supplied material actually says. A source URL supplied next to text is not proof the source page was checked. State contradictions separately in blockers. Do not infer affected population from publicity, add monetary amounts, conflate allegation with finding, or assert a Trump connection not in text. Unknown/null/empty is correct when unsupported. Keep quantities in original units; do not add unlike values. Output proposal_only true, record_id, status, insight_facts, evidence_map, blockers. This is the actual 100-entry insights utility pilot; the older sample100 was an import QA trial. Write exactly the assigned terminal rows, final QA and checkpoint; commit/push on your existing branch. No canonical/Neon/code edits.'''

FINAL = '''Finalize the supplied description review rows for ONLY your assigned IDs. Follow each pinned original proposal provenance and the frozen-original evidence referenced in raw. Resolve structural schema differences. For existing HOLDs perform at most one focused source/context rescue when an explicit credible lead is supplied; otherwise preserve the exact hold. One normalized row per record_id with status pass/hold/exclusion_candidate, title, description_short, description_medium, description_long, source_urls, source_fact_map, source_provenance, blockers, rationale, proposal_only true. Pass requires <=180-character title/short, 45-90-word medium and 140-300-word long, evidence support and no stronger claim than supported. Review narrowed_entry as well as proposal schemas. Separate allegations, plans and realized acts. Missing evidence may yield a useful narrower draft, but mark hold if it changes event identity or lacks Trump/family/associate connection. Preserve previously existing non-null text in preservation_notes and explicitly document any correction proposal. Do not use instructions or editorial process as filler in public descriptions. Worker release_ready is input, not your conclusion. All IDs must finish as terminal pass/hold/exclusion_candidate; never silently drop one. Write normalized rows, exact-set QA and checkpoint; commit/push on existing branch. No canonical/Neon/code edits.'''

def main():
    BASE.mkdir(parents=True, exist_ok=True)
    if (BASE / 'queue.json').exists():
        print('queue already prepared; preserving it')
        return
    held = [json.loads(s) for s in (EXT / 'wave3-held204-finalization-2026-10-04/collected/held204-terminal-raw.jsonl').read_text().splitlines()]
    sample = []
    for p in sorted((EXT / 'five-account-round-2026-10-03/sample100').glob('worker-*-input.jsonl')):
        sample.extend(json.loads(s) for s in p.read_text().splitlines() if s.strip())
    assert len(held) == len({x['record_id'] for x in held}) == 204
    assert len(sample) == len({x['key'] for x in sample}) == 100
    sample.sort(key=lambda x: int(x['key'].split('-')[1]))
    files = {}; jobs = []
    for lane, account, rows, instruction in [('held204', 6, held, FINAL), ('insights100', 5, sample, INSIGHTS)]:
        files[f'{lane}/PROMPT.md'] = instruction + '\n'
        for i in range(12):
            n = i + 1; subset = rows[i::12]; o = owner(account, n)
            keys = [r.get('record_id') or r['key'] for r in subset]
            path = f'{lane}/worker-{n:02d}-input.jsonl'
            files[path] = ''.join(json.dumps(x, ensure_ascii=False) + '\n' for x in subset)
            jobs.append({'id':f'{lane}-{n:02d}', 'lane':lane, 'account':account, 'worker':n,
                         'assigned':keys, 'input_path':f'{PREFIX}/{path}', 'instruction':instruction,
                         'session_id':o['session_id'], 'task_id':o['task_id'], 'branch':o['branch'],
                         'output_path':f'{PREFIX}/{lane}/outputs/worker-{n:02d}-terminal.jsonl',
                         'state':'queued', 'attempts':0})
    files['manifest.json'] = json.dumps({'held204':204,'insights100':100,'proposal_only':True,
        'sample_selection':'first 100 eligible IDs from prior import trial; not representative of all eras',
        'hashes':{p:hashlib.sha256(s.encode()).hexdigest() for p,s in files.items()}},indent=2)+'\n'
    found = git('ls-remote','--heads','origin',BRANCH).split()
    if found:
        raise SystemExit('packet branch already exists without local queue; inspect before recreating')
    parent = git('ls-remote','--heads','origin','main').split()[0]
    git('fetch','--quiet','origin',parent)
    with tempfile.TemporaryDirectory(prefix='trump-continuous-index-') as d:
        env = {**os.environ, 'GIT_INDEX_FILE':str(Path(d)/'index')}
        git('read-tree',parent,env=env)
        for p,s in files.items():
            blob=git('hash-object','-w','--stdin',env=env,data=s)
            git('update-index','--add','--cacheinfo','100644',blob,f'{PREFIX}/{p}',env=env)
        commit=git('commit-tree',git('write-tree',env=env),'-p',parent,'-m','Publish continuous finish and actual insights pilot packets',env=env)
        git('push','origin',f'{commit}:refs/heads/{BRANCH}',env=env)
    for job in jobs:
        job['packet_branch']=BRANCH;job['packet_commit']=commit
    (BASE/'queue.json').write_text(json.dumps({'version':1,'jobs':jobs,'packet_commit':commit},indent=2)+'\n')
    print(json.dumps({'jobs':len(jobs),'packet_branch':BRANCH,'packet_commit':commit}))

if __name__ == '__main__':main()
