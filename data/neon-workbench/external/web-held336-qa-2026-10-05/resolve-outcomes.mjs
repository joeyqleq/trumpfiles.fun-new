export function resolveOutcomes(files, excludedPaths = [], authoritativeIndex = null) {
  const included = files.filter(f => !excludedPaths.includes(f.path));
  const map = new Map(), history = {};
  const rank = path => /\/resume2-.*-amendments-/.test(path) ? 3 : /\/resume-.*-amendments-/.test(path) ? 2 : /-amend/.test(path) ? 1 : 0;
  const ordered = included.filter(f => /-batch-|-amend/.test(f.path)).sort((a,b) => rank(a.path)-rank(b.path) || a.path.localeCompare(b.path));
  for (const f of ordered) for (const [i, raw] of f.rows.entries()) {
    const row = raw.terminal_record || raw;
    const pointer = {path:f.path,line:i+1,revision:raw.revision || 0};
    (history[row.record_id] ||= []).push(pointer);
    map.set(row.record_id,{outcome:row,...pointer});
  }
  if (authoritativeIndex) for (const r of authoritativeIndex.records) {
    const p = r.authoritative_qa;
    const f = included.find(x => x.path === p.path);
    const raw = f?.rows[p.line-1], row = raw?.terminal_record || raw;
    if (!row || row.record_id !== r.record_id || row.status !== r.status) throw new Error("Invalid authoritative pointer: "+r.record_id);
    map.set(r.record_id,{outcome:row,...p});
  }
  return {outcomes:[...map.values()],history};
}
