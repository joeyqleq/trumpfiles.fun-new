import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const dir=path.dirname(new URL(import.meta.url).pathname);
const read=n=>fs.readFileSync(path.join(dir,n),'utf8');
const rows=n=>read(n).trim().split('\n').map(JSON.parse);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const records=rows('terminal-results.jsonl'),history=rows('candidate-history.jsonl'),decisions=rows('review-decisions.jsonl');
const manifest=JSON.parse(read('source-manifest.json')), assignments=JSON.parse(read('audit-assignment.json'));
const expected=assignments.flatMap(a=>a.record_ids);
assert(expected.length===99&&new Set(expected).size===99,'assignment overlap');
assert(records.length===99&&new Set(records.map(r=>r.record_id)).size===99,'99 unique records');
assert(expected.every(id=>records.some(r=>r.record_id===id)),'exact IDs');
assert(decisions.length===99&&new Set(decisions.map(r=>r.record_id)).size===99,'99 decisions');
const required='record_id status title description_short description_medium description_long source_urls source_fact_map source_provenance blockers rationale proposal_only'.split(' ');
for(const r of records){
assert(required.every(k=>Object.hasOwn(r,k)),r.record_id+':schema');
assert(r.proposal_only===true&&['pass','hold','exclusion_candidate'].includes(r.status),r.record_id+':status');
assert(Array.isArray(r.source_urls)&&r.source_fact_map&&r.source_provenance&&r.blockers!=null,r.record_id+':types');
for(const u of r.source_urls){const url=new URL(u);assert(['http:','https:'].includes(url.protocol)&&JSON.stringify(r.source_fact_map).includes(u),r.record_id+':URL');}
const d=decisions.find(d=>d.record_id===r.record_id), h=history.find(h=>h.candidate_id===d.selected_candidate_id);
assert(h?.terminal?.record_id===r.record_id,r.record_id+':lineage');
assert(r.source_provenance.consolidation_review.source_line_sha256===h.raw_line_sha256,r.record_id+':line hash');
if(r.status==='pass'){
for(const k of ['title','description_short'])assert(typeof r[k]==='string'&&r[k].length>0&&r[k].length<=180,r.record_id+':'+k);
for(const [k,min,max] of [['description_medium',45,90],['description_long',140,300]]){const n=r[k].trim().split(/\s+/).length;assert(n>=min&&n<=max,r.record_id+':'+k+' '+n);}
for(const f of 'event_state action_type affected_groups institutions scope legal_stage outcome quantities relations'.split(' ')){
assert(Object.hasOwn(r.insight_facts,f),r.record_id+':fact '+f);
const v=r.insight_facts[f];if(v===null||v==='unknown'||Array.isArray(v)&&v.length===0)continue;
const m=r.insight_evidence_map;let e=Array.isArray(m)?m.filter(e=>e.field===f||e.fields?.includes(f)):m[f];e=Array.isArray(e)?e:e?[e]:[];
assert(e.some(e=>/"quote[s]?"|"basis_quote"|"quoted_supported_facts"/.test(JSON.stringify(e))&&r.source_urls.some(u=>JSON.stringify(e).includes(u))),r.record_id+':quoted '+f);
}
assert(r.impact_proposal.status==='deferred'&&r.impact_proposal.dimensions===null&&r.impact_proposal.weighted_total===null,r.record_id+':deferred score');
}}
for(const h of history)assert(sha(h.raw_line)===h.raw_line_sha256,'raw hash '+h.candidate_id);
for(const m of manifest){const h=history.filter(h=>h.commit===m.commit&&h.path===m.path);assert(sha(h.map(h=>h.raw_line).join('\n')+'\n')===m.sha256,'source hash '+m.path);assert(sha(m.commit+':'+m.path).slice(0,16)===m.file_id,'source identity');}
assert(history.length===245&&manifest.length===119,'history coverage');
for(const [file,status,count] of [['pass-proposals.jsonl','pass',32],['held-records.jsonl','hold',51],['exclusion-proposals.jsonl','exclusion_candidate',16]]){
const out=rows(file);assert(out.length===count&&out.every(r=>r.status===status),'export '+file);
assert(out.every(r=>JSON.stringify(r)===JSON.stringify(records.find(t=>t.record_id===r.record_id))),'export contents '+file);}
for(const file of ['insight-proposals.jsonl','impact-proposals.jsonl']){const out=rows(file);assert(out.length===32&&new Set(out.map(r=>r.record_id)).size===32,'sidecar '+file);assert(out.every(r=>records.find(t=>t.record_id===r.record_id)?.status==='pass'),'sidecar IDs');}
console.log(JSON.stringify({status:'passed',records:99,pass:32,hold:51,exclusion_candidate:16,history:245,sources:119,deferred_scores:32}));
