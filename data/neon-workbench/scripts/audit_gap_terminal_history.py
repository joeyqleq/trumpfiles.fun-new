#!/usr/bin/env python3
"""Read-only check that earlier terminal payloads remain in append-only files."""
import json,subprocess
from datetime import datetime,timezone
from prepare_continuous_finish import ROOT,BASE
from prepare_offline_gap653 import PACK
def git(*args):return subprocess.run(['git',*args],cwd=ROOT,capture_output=True,text=True,check=True).stdout
def objects(text):
    result=[]
    for line in text.splitlines():
        if not line.strip():continue
        try:result.append(json.loads(line))
        except json.JSONDecodeError:result.append({'preserved_malformed_raw_line':line})
    return result
def key(r):return json.dumps(r,sort_keys=True,ensure_ascii=False)
def main():
    queue=json.loads((BASE/'queue.json').read_text());jobs=[j for j in queue['jobs'] if j['lane'] in {'offline-gap653','offline-gap653-qa','card-consistency21'} and j['state']=='complete'];findings=[];commits=0
    for j in jobs:
        tip=j['output_commit'];path=j['output_path'];current=objects(git('show',tip+':'+path));present={key(r) for r in current};missing={}
        for commit in git('log','--format=%H','-n','30',tip,'--',path).splitlines():
            commits+=1
            for r in objects(git('show',commit+':'+path)):
                k=key(r)
                if k not in present:missing[k]={'record':r,'earlier_commit':commit}
        if missing:findings.append({'job':j['id'],'branch':j['branch'],'output_path':path,'current_commit':tip,'missing_historical_rows':list(missing.values())})
    report={'checked_jobs':len(jobs),'checked_file_revisions':commits,'findings':findings,'live_data_changed':False}
    stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ');(PACK/f'history-audit-{stamp}.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'checked_jobs':len(jobs),'checked_file_revisions':commits,'jobs_with_missing_history':len(findings)}))
if __name__=='__main__':main()
