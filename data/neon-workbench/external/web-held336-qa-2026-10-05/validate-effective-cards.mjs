export function validateQA(expectedIds, outcomes) {
  const failures = [], counts = {}, seen = new Set();
  const weights = {harm: 30, reach: 20, institutions: 15, procedural_abuse: 15, self_dealing: 10, persistence: 10};
  const words = s => typeof s === "string" && s.trim() ? s.trim().split(/\s+/).length : 0;
  const chars = s => typeof s === "string" ? Array.from(s).length : 0;
  function card(row, path) {
    if (!row || typeof row !== "object") return;
    if (["draft_as_supplied", "draft_unverified"].includes(row.status) || row.evidence_status === "unverified_as_supplied") {
      if (row.publication_eligible !== false) failures.push({path, check:"unverified_publication_gate"});
    }
    if (row.description_long && !["hold", "exclusion_candidate"].includes(row.status)) {
      for (const [field, min, max, measure] of [["title",1,180,chars],["description_short",1,180,chars],["description_medium",45,90,words],["description_long",140,300,words]]) {
        const n = measure(row[field]); if (n < min || n > max) failures.push({path,field,n,min,max});
      }
    }
    for (const key of ["impact_proposal","score_proposal"]) {
      const s = row[key]; if (!s) continue;
      if (s.status === "deferred" && s.dimensions !== null) failures.push({path,key,check:"deferred_dimensions"});
      if (s.status === "scored") {
        const d = s.dimensions || {}; let sum = 0;
        for (const [name,weight] of Object.entries(weights)) {
          const value = d[name]; if (typeof value !== "number" || value < 0 || value > 10 || Math.abs(value*10-Math.round(value*10)) > 1e-8) failures.push({path,key,name,check:"dimension_range_precision"});
          else sum += Math.round(value*10)*weight;
        }
        const total = Math.round(sum/10)/100;
        for (const field of ["weighted_total","composite","weighted_score","total"]) if (typeof s[field] === "number" && Math.abs(s[field]-total)>1e-8) failures.push({path,key,field,expected:total,actual:s[field]});
      }
    }
    for (const u of row.source_urls || []) if (typeof u !== "string" || !/^https?:\/\//.test(u)) failures.push({path,check:"source_url_format",url:u});
    for (const [index,e] of (Array.isArray(row.source_fact_map)?row.source_fact_map:[]).entries()) if (e.quote && (!e.source_excerpt || !e.source_excerpt.includes(e.quote))) failures.push({path,index,check:"literal_quote"});
    for (const [index, child] of (row.children || []).entries()) card(child, path+".children["+index+"]");
  }
  for (const r of outcomes) {
    if (!expectedIds.includes(r.record_id)) failures.push({record_id:r.record_id,check:"unexpected_id"});
    if (seen.has(r.record_id)) failures.push({record_id:r.record_id,check:"duplicate_authoritative_id"});
    seen.add(r.record_id); counts[r.status]=(counts[r.status]||0)+1;
    for (const f of ["record_id","status","findings","source_branch","source_commit","source_output_path","checks_performed"]) if (r[f]===undefined || r[f]===null) failures.push({record_id:r.record_id,field:f,check:"missing_required_field"});
    if (!["pass","revise","draft_unverified","hold"].includes(r.status)) failures.push({record_id:r.record_id,check:"qa_status"});
    if (!/^[0-9a-f]{40}$/.test(r.source_commit || "")) failures.push({record_id:r.record_id,check:"source_commit_sha"});
    if (r.status === "revise" && !r.corrected_proposal) failures.push({record_id:r.record_id,check:"missing_full_proposal"});
    card(r.corrected_proposal,r.record_id+".corrected_proposal");
  }
  const missingIds = expectedIds.filter(x=>!seen.has(x));
  return {expected_count:expectedIds.length,authoritative_count:outcomes.length,unique_count:seen.size,status_counts:counts,missing_ids:missingIds,failures,passed:failures.length===0 && missingIds.length===0};
}

export function validateEffectiveCards(qaOutcomes, sourceById) {
  const failures=[], cards=[], scores=[];
  const w={harm:30,reach:20,institutions:15,procedural_abuse:15,self_dealing:10,persistence:10};
  function walk(value,parent,path) {
    if (!value||typeof value!=="object") return;
    if(Array.isArray(value)){value.forEach((x,i)=>walk(x,parent,path+"["+i+"]"));return;}
    if (value.description_long && value.title) {
      cards.push({parent_record_id:parent,record_id:value.record_id||parent,path,title_chars:Array.from(value.title).length,short_chars:Array.from(value.description_short||"").length,medium_words:(value.description_medium||"").trim().split(/\s+/).filter(Boolean).length,long_words:value.description_long.trim().split(/\s+/).length});
      for(const key of ["date_start","category","subcategory","topic_tags","people_tags","organization_tags","source_urls","source_fact_map"])if(!(key in value))failures.push({parent,path,check:"complete_card_field",field:key});
      if(value.evidence_status==="unverified_as_supplied"||value.status==="draft_as_supplied")if(value.publication_eligible!==false)failures.push({parent,path,check:"unverified_publication_gate"});
      for(const [i,e] of (Array.isArray(value.source_fact_map)?value.source_fact_map:[]).entries())if(e.quote && (!e.source_excerpt||!e.source_excerpt.includes(e.quote)))failures.push({parent,path,index:i,check:"literal_quote"});
    }
    for(const key of ["impact_proposal","score_proposal"]){const p=value[key];if(p?.status==="scored"){let n=0;for(const [k,weight]of Object.entries(w)){const d=p.dimensions?.[k];if(typeof d!=="number"||d<0||d>10||Math.abs(d*10-Math.round(d*10))>1e-8)failures.push({parent,path,check:"dimension",field:k});else n+=Math.round(d*10)*weight;}const total=Math.round(n/10)/100;scores.push({parent_record_id:parent,record_id:p.record_id||value.record_id||parent,path:path+"."+key,dimensions:p.dimensions,weighted_total:total,event_state:p.event_state});for(const f of ["weighted_total","total","composite","weighted_score"])if(typeof p[f]==="number"&&Math.abs(p[f]-total)>1e-8)failures.push({parent,path,check:"weighted_total",field:f,expected:total,actual:p[f]});}}
    for(const [k,x]of Object.entries(value)) if(!["impact_proposal","score_proposal","comparison","compared_records","same_event_evidence","survivor_existing_description_snapshot","duplicate_frozen_record","survivor_frozen_record","survivor_current"].includes(k))walk(x,parent,path+"."+k);
  }
  for(const q of qaOutcomes) if(q.status!=="hold") walk(q.corrected_proposal||sourceById[q.record_id],q.record_id,q.record_id);
  for(const c of cards)for(const [key,min,max]of [["title_chars",1,180],["short_chars",1,180],["medium_words",45,90],["long_words",140,300]])if(c[key]<min||c[key]>max)failures.push({parent:c.parent_record_id,path:c.path,check:key,actual:c[key],min,max});
  return {card_count:cards.length,score_count:scores.length,cards,scores,failures,passed:failures.length===0};
}
