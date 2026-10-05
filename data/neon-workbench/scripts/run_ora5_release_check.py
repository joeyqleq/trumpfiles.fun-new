#!/usr/bin/env python3
"""Reuse the independent VM checker against a checksum-bound release manifest."""
import json,subprocess,sys
from pathlib import Path
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[3]
PACK=ROOT/'data/neon-workbench/external/consolidated-offline-release-2026-10-05'
def main():
    manifest_path=Path(sys.argv[1]) if len(sys.argv)>1 else sorted(PACK.glob('manifest-*.json'))[-1]
    manifest_path=manifest_path.resolve()
    manifest=json.loads(manifest_path.read_text());stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    remote='/home/jq/trumpfiles-agents/release-check-'+stamp
    subprocess.run(['ssh','-o','BatchMode=yes','-o','ConnectTimeout=8','ora5','mkdir -p '+remote],check=True,timeout=20)
    subprocess.run(['scp','-C','-q',str(Path(__file__).with_name('ora5_final_check.py')),'ora5:'+remote+'/'],check=True,timeout=60)
    for name in ('descriptions','scores','insights'):
        subprocess.run(['scp','-C','-q',str(ROOT/manifest[name]['path']),'ora5:'+remote+'/'+name+'.jsonl'],check=True,timeout=180)
    response=subprocess.run(['ssh','-o','BatchMode=yes','ora5',f'python3 {remote}/ora5_final_check.py {remote}'],capture_output=True,text=True,timeout=90)
    report=json.loads(response.stdout)
    for name in ('descriptions','scores','insights'):
        if report['sha256'][name]!=manifest[name]['sha256']:report['findings'].append(name+': manifest hash mismatch')
    report['source_manifest']=str(manifest_path.relative_to(ROOT));report['remote_host_alias']='ora5';report['remote_folder']=remote
    path=PACK/f'ora5-validation-{stamp}.json';path.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'rows':report['rows'],'findings':report['findings'],'report':str(path.relative_to(ROOT))}))
    if response.returncode or report['findings']:raise SystemExit(1)
if __name__=='__main__':main()
