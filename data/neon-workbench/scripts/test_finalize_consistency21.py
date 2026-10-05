import unittest,tempfile,json,hashlib
from pathlib import Path
from unittest.mock import patch
import finalize_consistency21 as target

class MergeTests(unittest.TestCase):
    def test_exact_universe_hold_quarantine_and_ranks(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);base=root/'base';pack=root/'pack';base.mkdir();pack.mkdir()
            def write(p,rs):
                p.parent.mkdir(parents=True,exist_ok=True);p.write_text(''.join(json.dumps(r)+'\n' for r in rs))
            descriptions=[{'record_id':f'entry-{n}','entry_number':n,'status':'complete','title':'old'} for n in range(1,22)]
            insights=[{'record_id':r['record_id'],'status':'complete','insight_facts':{}} for r in descriptions]
            dimensions={k:0.0 for k in target.WEIGHTS}
            scores=[{'record_id':r['record_id'],'status':'scored','dimensions':dimensions,'impact_score':0.0} for r in descriptions]
            manifest={'preservation':{}}
            for k,rs in [('descriptions',descriptions),('insights',insights),('scores',scores)]:
                p=root/(k+'.jsonl');write(p,rs);manifest[k]={'path':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
            (pack/'baseline-manifest.json').write_text(json.dumps(manifest));jobs=[]
            for n in range(1,13):
                assigned=descriptions[n-1::12];ip=root/f'input{n}.jsonl';write(ip,[{'record_id':r['record_id'],'description':{'description_medium':'word '*50}} for r in assigned])
                jobs.append({'lane':'card-consistency21','state':'complete','worker':n,'id':str(n),'account':6,'output_commit':'x','output_paths':[],
                  'packet_commit':'y','input_path':ip.name})
                result=[]
                for r in assigned:
                    if r['record_id']=='entry-1':result.append({'record_id':r['record_id'],'status':'hold','blockers':['missing evidence']});continue
                    result.append({'record_id':r['record_id'],'status':'pass','title':'Narrow title','description_short':'Narrow title',
                      'description_medium':'word '*50,'description_long':'word '*150,'source_urls':['https://example.org'],
                      'source_fact_map':{'quote':'word'},'insight_facts':{},'insight_evidence_map':[],
                      'impact_proposal':{'status':'deferred','dimensions':None,'weighted_total':None}})
                write(base/f'collected/card-consistency21/worker-{n:02d}.jsonl',result)
            (base/'queue.json').write_text(json.dumps({'jobs':jobs}))
            with patch.object(target,'ROOT',root),patch.object(target,'BASE',base),patch.object(target,'PACK',pack),patch.object(target,'validate',return_value={'status':'valid'}):target.main()
            m=json.loads(next(pack.glob('manifest-*.json')).read_text())
            self.assertEqual(m['descriptions']['counts'],{'needs_context':1,'complete':20})
            self.assertEqual(m['insights']['rows'],20)
            self.assertEqual(m['scores']['counts'],{'scored':1,'deferred':20})
            self.assertEqual(m['withheld_scored_records'],1)
            self.assertEqual(m['eligible_scored_descriptions'],0)
            self.assertEqual(hashlib.sha256((root/'scores.jsonl').read_bytes()).hexdigest(),manifest['scores']['sha256'])
if __name__=='__main__':unittest.main()
