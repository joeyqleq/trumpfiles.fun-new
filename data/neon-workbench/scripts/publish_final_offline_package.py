#!/usr/bin/env python3
"""Publish a checksum-bound offline package with a private alternate git index."""
import json,os,sys,tempfile,hashlib
from pathlib import Path
from datetime import datetime,timezone
from prepare_continuous_finish import ROOT,BASE,git
PACK=ROOT/'data/neon-workbench/external/offline-completion-2026-10-05'
BRANCH='codex/offline-completion-2026-10-05'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    manifest_path,ora_path,catalog_path,history_path=map(lambda s:Path(s).resolve(),sys.argv[1:5])
    marker=PACK/'publication.json'
    if marker.exists():print(marker.read_text());return
    m=json.loads(manifest_path.read_text());ora=json.loads(ora_path.read_text());catalog=json.loads(catalog_path.read_text());history=json.loads(history_path.read_text())
    assert not ora['findings'] and not history['findings'] and history['checked_jobs']==132
    assert ora['source_manifest']==str(manifest_path.relative_to(ROOT))
    assert catalog['source_manifest']==str(manifest_path.relative_to(ROOT)) and catalog['rows']==7227
    queue=json.loads((BASE/'queue.json').read_text());assert queue['finished'] and all(j['state']=='complete' for j in queue['jobs'])
    paths=[manifest_path,ora_path,catalog_path,history_path,ROOT/catalog['index'],ROOT/m['card_consistency_provenance'],
      ROOT/m['coordinator_score_amendments']['path'],ROOT/m['provenance'],
      ROOT/'data/neon-workbench/external/continuous-finish-2026-10-04/insights-core-decision.json',
      ROOT/'data/neon-workbench/external/card-consistency21-2026-10-05/assignments.json',
      ROOT/'data/neon-workbench/external/card-consistency21-2026-10-05/RUBRIC.md',
      ROOT/'docs/neon-manual-safe-import.md',ROOT/'scripts/neon-safe-import.mjs',ROOT/'scripts/neon-safe-import.test.mjs',
      ROOT/'data/neon-workbench/PROGRESS.md']
    for key in ('descriptions','scores','insights'):
        p=ROOT/m[key]['path'];assert digest(p)==m[key]['sha256']==ora['sha256'][key];paths.append(p)
    completed=[r for line in (ROOT/m['descriptions']['path']).read_text().splitlines() if (r:=json.loads(line))['status']=='complete']
    assert len(completed)==6891
    assert all(0<len(r['description_short'])<=180 and 45<=len(r['description_medium'].split())<=90 and 140<=len(r['description_long'].split())<=300 for r in completed)
    for key in ('coordinator_field_amendments','coordinator_schema_amendments'):
        if key in m:paths.append(ROOT/m[key]['path'])
    if m.get('coordinator_review_overrides'):paths.append(ROOT/m['coordinator_review_overrides'])
    for job in queue['jobs']:
        if job['lane']=='card-consistency21':paths.extend([ROOT/job['input_path'],BASE/f"collected/card-consistency21/worker-{job['worker']:02d}.jsonl"])
    scripts=['finalize_consistency21.py','test_finalize_consistency21.py','repair_consistency_wrappers.py',
      'run_ora5_release_check.py','ora5_final_check.py','build_full_catalog_disposition_index.py',
      'audit_gap_terminal_history.py','publish_final_offline_package.py','prepare_continuous_finish.py',
      'prepare_offline_gap653.py','prepare_consistency21.py','audit_context_rescue_enrichments.py',
      'supervise_continuous_finish.py','recalibrate_context_quota.py','lightsprint_mcp.py']
    paths.extend(Path(__file__).with_name(name) for name in scripts)
    PACK.mkdir(parents=True,exist_ok=True)
    release={'created_at':datetime.now(timezone.utc).isoformat(),'status':'offline_editorial_work_complete_not_production_approved',
      'dataset_manifest':str(manifest_path.relative_to(ROOT)),'full_catalog':catalog,
      'eligible_scored_descriptions':m['eligible_scored_descriptions'],'withheld_historical_scores':m['withheld_scored_records'],
      'completed_cloud_jobs':len(queue['jobs']),'preserved_history_jobs':history['checked_jobs'],
      'word_limit_check':{'checked_complete_records':len(completed),'failures':0,'short_max_characters':180,'medium_words':[45,90],'long_words':[140,300]},
      'history_file_revisions':history['checked_file_revisions'],
      'verification_scope':'Word limits, exact ID accounting, schema/decimal arithmetic, rank sequences, literal supplied evidence and preservation; not independent verification of every source.',
      'production_blockers':['Distinct content release approval','Exact current Neon branch and schema/NULL-target preflight','Current Neon compute/storage headroom and reset evidence'],
      'live_database_changed':False,'frozen_export_written':False,
      'files':[{'path':str(p.relative_to(ROOT)),'sha256':digest(p),'bytes':p.stat().st_size} for p in sorted(set(paths))]}
    rp=PACK/'release-manifest.json';rp.write_text(json.dumps(release,indent=2)+'\n');paths.append(rp)
    readme=PACK/'README.md'
    readme.write_text('# Offline editorial completion — 2026-10-05\n\n'
      'All 7,143 original IDs plus 84 candidates are accounted for. 6,891 descriptions and core insight rows are complete; 336 records remain explicitly held, never deleted. '
      '6,739 completed descriptions have eligible provisional impact scores. 469 full-catalog scores are deferred; 19 additional historical numeric scores are held from public rankings because their descriptions are held.\n\n'
      'The 653 gap assignments and independent QA, followed by 21 card repairs, are finished. Short copy is at most 180 characters, medium 45–90 words, long 140–300 words for every completed description. '
      'Scores are an editorial index, not measured harm; ties are legitimate and ranks use a deterministic tie-break. Core event/state/scope/action/institution/group/legal-stage/outcome labels support charts; unsupported money/population/relation fields were not invented.\n\n'
      'Read release-manifest.json for checksum-bound files and verification evidence. Original append-only outputs remain on their original worker branches; the package contains reconciled readers and provenance, not rewritten history. '
      'No canonical or live database changes. Production requires the explicit gates in docs/neon-manual-safe-import.md; no retrying GitHub Actions importer was added.\n')
    paths.append(readme)
    parent=git('ls-remote','--heads','origin','main').split()[0];git('fetch','--quiet','origin',parent)
    if git('ls-remote','--heads','origin',BRANCH).split():raise SystemExit('Branch exists without local publication marker; reconcile before pushing')
    with tempfile.TemporaryDirectory(prefix='trump-final-index-') as d:
        env={**os.environ,'GIT_INDEX_FILE':str(Path(d)/'index')};git('read-tree',parent,env=env)
        for p in sorted(set(paths)):
            blob=git('hash-object','-w',str(p),env=env)
            git('update-index','--add','--cacheinfo','100644',blob,str(p.relative_to(ROOT)),env=env)
        commit=git('commit-tree',git('write-tree',env=env),'-p',parent,'-m','Complete reconciled offline catalog descriptions insights and editorial scores',env=env)
        git('push','origin',f'{commit}:refs/heads/{BRANCH}',env=env)
    result={'branch':BRANCH,'commit':commit,'files':len(set(paths)),'release_manifest':str(rp.relative_to(ROOT))}
    marker.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':main()
