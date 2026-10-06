export function resolveOutcomes(files, excludedPaths = []) {
const map = new Map(), history = {};
const included = files.filter(f => !excludedPaths.includes(f.path));
const ordered = [...included.filter(f => /-batch-/.test(f.path)).sort((a,b)=>a.path.localeCompare(b.path)), ...included.filter(f => /-amend/.test(f.path)).sort((a,b)=>a.path.localeCompare(b.path))];
for (const f of ordered) for (const [index, raw] of f.rows.entries()) {const row=raw.terminal_record||raw; (history[row.record_id] ||= []).push({path:f.path,line:index+1,revision:raw.revision||0}); map.set(row.record_id,{outcome:row,path:f.path,line:index+1,revision:raw.revision||0});}
return {outcomes:[...map.values()],history};
}
