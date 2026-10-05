"""Small standalone exact-supplied-text/schema gate; no independent fact claims."""
from decimal import Decimal
ENUMS={'event_state':{'realized','proposed','threatened','unclear','unknown'},'action_type':{'discrimination','deception','legal_action','policy_action','institutional_pressure','private_benefit','violence_or_threat','other','unknown'},'scope':{'individual','organization','local','regional','national','international','unknown'},'legal_stage':{'allegation','investigation','charged','adjudicated','settled','policy','not_applicable','unknown'}}
KEYS=('harm','reach','institutions','procedural_abuse','self_dealing','persistence')
def known(v):return v is not None and v!='unknown' and v!='unclear' and v!=[] and v!=''
def gate(packet,row):
    errors=[]
    if row.get('record_id')!=packet['record_id'] or row.get('status')!='complete':errors.append('wrapper_identity_or_status')
    for flag,name in [('repair_insights','insight_proposal'),('repair_score','score_proposal')]:
        p=row.get(name)
        if not packet[flag]:
            if p is not None:errors.append('unassigned_'+name)
            continue
        if not isinstance(p,dict):errors.append('missing_'+name);continue
        if name=='insight_proposal':
            f=p.get('insight_facts');ev=p.get('evidence_map')
            if not isinstance(f,dict) or not isinstance(ev,list):errors.append('insight_objects');continue
            if p.get('status') not in {'complete','insufficient'}:errors.append('insight_status')
            for k,values in ENUMS.items():
                if f.get(k) not in values:errors.append('enum:'+k)
            for k in ('affected_groups','institutions'):
                if not isinstance(f.get(k),list) or any(not isinstance(v,str) for v in f[k]):errors.append('array:'+k)
            if 'outcome' not in f or (f['outcome'] is not None and not isinstance(f['outcome'],str)):errors.append('outcome')
            if f.get('quantities')!=[] or f.get('relations')!=[]:errors.append('unsupported_extensions')
            texts=[packet['description'].get(k,'') or '' for k in ('description_medium','description_long')]
            for e in ev:
                if not isinstance(e,dict):errors.append('evidence_object');continue
                field=e.get('field','').removeprefix('insight_facts.');v=e.get('value');q=e.get('basis_quote',e.get('quote'))
                if field not in f or not (v==f[field] or isinstance(f[field],list) and v in f[field]):errors.append('evidence_value')
                if not isinstance(q,str) or not q.strip() or not any(q in t for t in texts):errors.append('quote_not_literal')
            for k in (*ENUMS,'affected_groups','institutions','outcome'):
                value=f.get(k);targets=value if isinstance(value,list) else [value]
                for v in targets:
                    if known(v) and not any(isinstance(e,dict) and e.get('field','').removeprefix('insight_facts.')==k and e.get('value')==v for e in ev):errors.append('unmapped:'+k)
            if p.get('status')=='complete' and not any(known(f.get(k)) for k in (*ENUMS,'affected_groups','institutions','outcome')):errors.append('empty_complete')
        else:
            if p.get('status') not in {'scored','deferred'}:errors.append('score_status')
            if p.get('record_id')!=packet['record_id']:errors.append('score_identity')
            if p.get('status')=='scored':
                d=p.get('dimensions')
                if not isinstance(d,dict) or set(d)!=set(KEYS):errors.append('dimensions')
                else:
                    for k,v in d.items():
                        if isinstance(v,bool) or not isinstance(v,(float,int)) or not Decimal(str(v)).is_finite() or not 0<=v<=10 or Decimal(str(v))*10!=(Decimal(str(v))*10).to_integral_value():errors.append('dimension:'+k)
                if p.get('confidence') not in {'medium','low'} or not p.get('rationale') or not p.get('basis'):errors.append('score_basis_or_confidence')
                if p.get('event_state') not in {'realized','proposed','threatened','unclear'}:errors.append('score_event_state')
            elif p.get('dimensions') is not None:errors.append('deferred_dimensions')
            if not p.get('confidence_reason'):errors.append('score_reason')
    return sorted(set(errors))
