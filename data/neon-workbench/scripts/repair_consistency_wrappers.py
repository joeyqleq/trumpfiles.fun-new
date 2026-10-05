#!/usr/bin/env python3
"""Publish explicit full amendments for cloud wrappers without editing history."""
import json,os,tempfile
from pathlib import Path
from prepare_continuous_finish import ROOT,BASE,git
from audit_context_rescue_enrichments import validate
def main():
    queue=json.loads((BASE/'queue.json').read_text())
    for job in queue['jobs']:
        if job['lane']!='card-consistency21' or job['worker'] not in (6,9,12) or job['state']=='complete':continue
        git('fetch','--quiet','origin',job['branch'])
        parent=git('rev-parse','origin/'+job['branch']).strip()
        raw=git('show',parent+':'+job['output_path']);history=[json.loads(l) for l in raw.splitlines() if l.strip()]
        replacements=[]
        for rid in job['assigned']:
            wrappers=[r for r in history if r.get('record_id')==rid and isinstance(r.get('record'),dict)]
            if not wrappers:continue
            selected=max(wrappers,key=lambda r:r.get('revision',0));terminal=dict(selected['record'])
            terminal.setdefault('record_id',rid);terminal.setdefault('status',selected.get('status'))
            assert terminal.get('record_id')==rid and terminal.get('status') in ('pass','hold')
            if terminal['status']=='pass':assert validate(terminal)['status']=='valid'
            replacements.append({'record_id':rid,'revision':100,'terminal_record':terminal,
              'coordinator_reason':'Normalize explicit inline record wrapper to the supported full terminal_record amendment format; preserve all original rows.',
              'source_commit':parent,'source_path':job['output_path'],'source_inline_revision':selected.get('revision')})
        if not replacements:continue
        path=str(Path(job['output_path']).parent/f"worker-{job['worker']:02d}-amendment-100.jsonl")
        if path in git('ls-tree','-r','--name-only',parent,path).splitlines():continue
        content=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in replacements)
        with tempfile.TemporaryDirectory(prefix='trump-wrapper-index-') as directory:
            env={**os.environ,'GIT_INDEX_FILE':str(Path(directory)/'index')}
            git('read-tree',parent,env=env)
            blob=git('hash-object','-w','--stdin',env=env,data=content)
            git('update-index','--add','--cacheinfo','100644',blob,path,env=env)
            commit=git('commit-tree',git('write-tree',env=env),'-p',parent,'-m','Preserve inline correction history with explicit full coordinator amendments',env=env)
            git('push','origin',f'{commit}:refs/heads/{job["branch"]}',env=env)
        print(json.dumps({'job':job['id'],'commit':commit,'amendment_ids':[r['record_id'] for r in replacements]}))
if __name__=='__main__':main()
