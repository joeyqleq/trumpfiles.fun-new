export function validateQA(expectedIds, outcomes) {
  const failures = [], counts = {}, seen = new Set();
  const weights = {harm: 30, reach: 20, institutions: 15, procedural_abuse: 15, self_dealing: 10, persistence: 10};
  const words = s => typeof s === "string" && s.trim() ? s.trim().split(/\\s+/).length : 0;
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
