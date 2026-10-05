#!/usr/bin/env python3
"""Account for all frozen entries AND additions without reviving held claims."""
import json,hashlib
from pathlib import Path
from collections import Counter
from datetime import datetime,timezone
from prepare_continuous_finish import ROOT
from prepare_offline_gap653 import PACK
def rows(p):
    with p.open() as source:
        for line in source:
            if line.strip():yield json.loads(line)
def main():
    import sys
    path=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else sorted(PACK.glob('manifest-*.json'))[-1];manifest=json.loads(path.read_text())
    desc={r['record_id']:r for r in rows(ROOT/manifest['descriptions']['path'])}
    insights={r['record_id']:r for r in rows(ROOT/manifest['insights']['path'])}
    scores={r['record_id']:r for r in rows(ROOT/manifest['scores']['path'])}
    frozen={f"entry-{r['entry_number']}":r['entry_number'] for r in rows(ROOT/'data/neon-export/tables/trump_entries.jsonl')}
    held={r['record_id']:r for r in rows(ROOT/'data/neon-workbench/external/description-completion/2026-09-30/held.jsonl')}
    assert len(frozen)==7143 and len(held)==283 and not(set(held)&set(desc))
    assert set(frozen)-set(desc)==set(held)
    all_ids=set(desc)|set(held);assert len(all_ids)==7227
    output=[]
    for rid in sorted(all_ids):
        d=desc.get(rid);s=scores.get(rid);i=insights.get(rid)
        output.append({'record_id':rid,'entry_number':d.get('entry_number') if d else frozen[rid],
          'origin':'frozen_catalog' if rid in frozen else 'new_candidate',
          'description_status':d['status'] if d else 'held_before_rewrite',
          'insight_status':i['status'] if i else 'not_applicable_held',
          'score_status':s['status'] if s else 'deferred',
          'impact_score':s.get('impact_score') if s and s.get('description_release_eligible') else None,
          'release_ranking_position':s.get('release_ranking_position') if s else None,
          'hold_reason':held[rid]['reason'] if rid in held else 'insufficient_event_evidence' if d['status']!='complete' else None,
          'offline_description_complete':bool(d and d['status']=='complete'),'production_approved':False})
    stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ');op=PACK/f'full-catalog-dispositions-{stamp}.jsonl'
    op.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in output))
    report={'source_manifest':str(path.relative_to(ROOT)),'index':str(op.relative_to(ROOT)),'sha256':hashlib.sha256(op.read_bytes()).hexdigest(),
      'rows':len(output),'origins':dict(Counter(r['origin'] for r in output)),
      'descriptions':dict(Counter(r['description_status'] for r in output)),
      'insights':dict(Counter(r['insight_status'] for r in output)),
      'scores':dict(Counter(r['score_status'] for r in output)),
      'held_reasons':dict(Counter(r['hold_reason'] for r in output if r['hold_reason'])),
      'coverage':'Every7143 frozen ID and84 candidate IDs accounted for; prior283 held dispositions preserved, not silently excluded.',
      'production_approved':False,'live_database_changed':False}
    (PACK/f'full-catalog-report-{stamp}.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
if __name__=='__main__':main()
