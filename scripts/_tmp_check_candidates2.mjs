import fs from 'fs';

const entries = JSON.parse(fs.readFileSync('logs/entries_snapshot.json','utf-8'));

const candidates = [
  { key: 'Election Integrity Commission', keywords: ['election integrity commission','voter fraud commission','presidential advisory commission on election integrity'] },
  { key: 'Kobach voter data request', keywords: ['kobach','voter data request'] },
  { key: 'Rescinds transgender student guidance', keywords: ['transgender student guidance','bathroom guidance','title ix guidance'] },
  { key: 'Clean Power Plan repeal', keywords: ['clean power plan'] },
  { key: 'WOTUS rule repeal', keywords: ['waters of the united states','wotus'] },
  { key: 'Bears Ears reduction', keywords: ['bears ears'] },
  { key: 'Grand Staircase reduction', keywords: ['grand staircase'] },
  { key: 'UNRWA funding cut', keywords: ['unrwa'] },
  { key: 'PLO office closure', keywords: ['plo office'] },
  { key: 'Settlements not illegal', keywords: ['settlements','not inconsistent with international law'] },
  { key: 'Embassy move to Jerusalem', keywords: ['embassy to jerusalem','embassy in jerusalem'] },
  { key: 'Refugee cap 18000', keywords: ['refugee cap','18000 refugees'] },
  { key: 'Asylum ban between ports', keywords: ['between ports','asylum ban'] },
  { key: 'Third-country transit asylum ban', keywords: ['transit asylum','third-country'] },
  { key: 'Asylum cooperative agreement Guatemala', keywords: ['asylum cooperative agreement','guatemala'] },
  { key: 'Immigrants animals remark', keywords: ['animals','immigrants are animals'] },
  { key: 'Go back tweets squad', keywords: ['go back','squad'] },
  { key: 'Ends CSR payments', keywords: ['cost-sharing reduction','csr payments'] },
  { key: 'SSA gun rule repeal', keywords: ['social security','gun','mental illness','ssa'] },
  { key: 'Ends net neutrality', keywords: ['net neutrality'] },
  { key: 'DACA rescission', keywords: ['daca'] },
  { key: 'Refugee ban', keywords: ['refugee'] },
  { key: 'UN Human Rights Council', keywords: ['human rights council'] }
];

function findMatches(keywords) {
  const matches = [];
  for (const entry of entries) {
    const hay = `${entry.title} ${entry.synopsis}`.toLowerCase();
    const hit = keywords.some(k => hay.includes(k.toLowerCase()));
    if (hit) matches.push({ entry_number: entry.entry_number, title: entry.title });
  }
  return matches;
}

for (const c of candidates) {
  const matches = findMatches(c.keywords);
  console.log(`\n${c.key}: ${matches.length} match(es)`);
  matches.slice(0,3).forEach(m => console.log(`  #${m.entry_number}: ${m.title}`));
}
