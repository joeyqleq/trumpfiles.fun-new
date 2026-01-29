import fs from 'fs';

const snapshotPath = 'logs/entries_snapshot.json';
const entries = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));

const candidates = [
  { key: 'Lavrov intelligence', keywords: ['lavrov', 'kislyak'] },
  { key: 'TPP withdrawal', keywords: ['trans-pacific', 'tpp'] },
  { key: 'UNESCO withdrawal', keywords: ['unesco'] },
  { key: 'Jerusalem capital', keywords: ['jerusalem'] },
  { key: 'Bears Ears shrink', keywords: ['bears ears', 'grand staircase'] },
  { key: 'NFL sons of bitches', keywords: ['sons of bitches', 'nfl players'] },
  { key: 'Golan Heights recognition', keywords: ['golan'] },
  { key: 'Remain in Mexico', keywords: ['remain in mexico', 'mpp'] },
  { key: 'Tear gas at border', keywords: ['tear gas', 'border'] },
  { key: 'Public charge rule', keywords: ['public charge'] },
  { key: 'Birthright citizenship order', keywords: ['birthright citizenship'] },
  { key: 'INF Treaty withdrawal', keywords: ['inf treaty'] },
  { key: 'Open Skies withdrawal', keywords: ['open skies'] },
  { key: 'Exclude undocumented from census', keywords: ['apportionment', 'undocumented', 'census'] },
  { key: 'Slow the testing', keywords: ['slow the testing', 'testing'] },
  { key: 'Peaceful transfer refusal', keywords: ['peaceful transfer'] },
  { key: 'Liberate tweets', keywords: ['liberate'] },
  { key: 'Syria withdrawal / Kurds', keywords: ['kurds', 'syria withdrawal'] },
  { key: 'Puerto Rico death toll denial', keywords: ['puerto rico', 'death toll'] },
  { key: 'NATO do whatever they want', keywords: ['nato', 'do whatever they want'] },
  { key: 'Global Compact on Migration', keywords: ['global compact', 'migration'] },
  { key: 'Keystone XL', keywords: ['keystone xl'] },
  { key: 'Dakota Access', keywords: ['dakota access'] },
  { key: 'Trump Organization tax fraud', keywords: ['tax fraud', 'trump organization'] },
  { key: 'Trump Foundation dissolved', keywords: ['trump foundation'] },
  { key: 'Trump Tower Moscow', keywords: ['trump tower moscow'] },
  { key: 'Michael Cohen testimony', keywords: ['michael cohen testimony'] },
  { key: 'Roger Stone commutation', keywords: ['roger stone', 'commutation'] },
  { key: 'First impeachment', keywords: ['impeachment'] }
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
  matches.slice(0, 5).forEach(m => console.log(`  #${m.entry_number}: ${m.title}`));
}
