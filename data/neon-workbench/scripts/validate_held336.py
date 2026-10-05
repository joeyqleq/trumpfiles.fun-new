"""Structural/evidence gates for research repairs; never factual approval by itself."""
from urllib.parse import urlparse
def gate(row):
    errors=[]
    status=row.get('status')
    if status not in ('pass','split_ready','duplicate_resolved','hold','exclusion_candidate'):return ['invalid_status']
    def card(card):
        findings=[]
        for key,lo,hi,words in [('title',1,180,False),('description_short',1,180,False),('description_medium',45,90,True),('description_long',140,300,True)]:
            value=card.get(key);n=len(value.split()) if words and isinstance(value,str) else len(value) if isinstance(value,str) else 0
            if not lo<=n<=hi:findings.append('length:'+key)
        urls=card.get('source_urls') or []
        if not urls or any(urlparse(u).scheme not in ('http','https') or not urlparse(u).netloc for u in urls):findings.append('source_urls')
        evidence=card.get('source_fact_map')
        if not isinstance(evidence,list) or not evidence:findings.append('source_fact_map')
        else:
            for fact in evidence:
                if not isinstance(fact,dict) or not fact.get('fact') or not fact.get('quote') or fact.get('source_url') not in urls or not fact.get('source_excerpt') or fact['quote'] not in fact['source_excerpt']:findings.append('unsupported_literal_evidence')
        if not card.get('category') or not isinstance(card.get('topic_tags'),list):findings.append('category_or_tags')
        return findings
    if status=='pass':errors.extend(card(row))
    elif status=='split_ready':
        children=row.get('children')
        if not isinstance(children,list) or len(children)<2:errors.append('missing_split_children')
        else:
            ids=[]
            for child in children:
                errors.extend(card(child));ids.append(child.get('record_id'))
                if child.get('parent_record_id')!=row.get('record_id') or not child.get('date_start'):errors.append('split_identity_or_date')
            if None in ids or len(ids)!=len(set(ids)):errors.append('duplicate_child_ids')
    elif status=='duplicate_resolved':
        if row.get('survivor_record_id')==row.get('record_id') or not row.get('survivor_record_id') or not row.get('same_event_evidence') or not isinstance(row.get('merge_proposal'),dict):errors.append('duplicate_mapping')
    else:
        if not row.get('blockers') or not row.get('research_attempts'):errors.append('hold_without_attempts_and_blocker')
    if row.get('proposal_only') is not True:errors.append('not_proposal_only')
    return sorted(set(errors))
