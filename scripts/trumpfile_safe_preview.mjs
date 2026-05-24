<<<<<<< ours
#!/usr/bin/env node
import fs from 'node:fs';
import { neon } from '@neondatabase/serverless';

const input = process.env.PREVIEW_INPUT || 'tmp/oneclick/trumpfile_candidates.json';
const output = process.env.PREVIEW_OUTPUT || 'tmp/oneclick/safe_preview.json';

function norm(s=''){return s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();}
function sim(a,b){
  const A=new Set(norm(a).split(' ').filter(Boolean));
  const B=new Set(norm(b).split(' ').filter(Boolean));
  let inter=0; for(const t of A) if(B.has(t)) inter++;
  const union=A.size+B.size-inter||1;
  const jac=inter/union;
  const pref=norm(a).slice(0,36)===norm(b).slice(0,36)?0.1:0;
  return Math.min(1,jac+pref);
}

if(!process.env.DATABASE_URL){
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const candidates = JSON.parse(fs.readFileSync(input,'utf8')).candidates || [];

const existingUrlRows = await sql`select url from trump_sources where url is not null`;
const existingUrls = new Set(existingUrlRows.map(r=>r.url).filter(Boolean));
const existingTitles = await sql`select entry_number,title,date_start from trump_entries order by entry_number desc limit 2500`;

let urlDup=0,titleDup=0;
const unmatched=[];
for(const c of candidates){
  const u=(c.entry_url||'').trim();
  if(!u || existingUrls.has(u)){urlDup++; continue;}
  let best={score:0,entry:null,title:null};
  let isDup=false;
  for(let i=0;i<Math.min(existingTitles.length,1500);i++){
    const e=existingTitles[i];
    const sc=sim(c.title||'', e.title||'');
    if(sc>best.score) best={score:sc,entry:e.entry_number,title:e.title};
    if(sc>=0.9){ isDup=true; break; }
  }
  if(isDup){ titleDup++; continue; }
  unmatched.push({...c, best_similarity:Number(best.score.toFixed(3)), best_match_entry:best.entry, best_match_title:best.title});
}

unmatched.sort((a,b)=>String(a.published_at||'').localeCompare(String(b.published_at||'')));
const preview = unmatched.slice(-50);
const out={
  generated_at:new Date().toISOString(),
  total_candidates:candidates.length,
  url_dupes:urlDup,
  title_dupes:titleDup,
  projected_new_entries:unmatched.length,
  preview_sample_size:preview.length,
  preview,
};
fs.writeFileSync(output, JSON.stringify(out,null,2));
console.log(JSON.stringify({
  total_candidates: out.total_candidates,
  url_dupes: out.url_dupes,
  title_dupes: out.title_dupes,
  projected_new_entries: out.projected_new_entries,
  preview_sample_size: out.preview_sample_size,
}, null, 2));
=======
#!/usr/bin/env node
import fs from 'node:fs';
import { neon } from '@neondatabase/serverless';

const input = process.env.PREVIEW_INPUT || 'tmp/oneclick/trumpfile_candidates.json';
const output = process.env.PREVIEW_OUTPUT || 'tmp/oneclick/safe_preview.json';

function norm(s=''){return s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();}
function sim(a,b){
  const A=new Set(norm(a).split(' ').filter(Boolean));
  const B=new Set(norm(b).split(' ').filter(Boolean));
  let inter=0; for(const t of A) if(B.has(t)) inter++;
  const union=A.size+B.size-inter||1;
  const jac=inter/union;
  const pref=norm(a).slice(0,36)===norm(b).slice(0,36)?0.1:0;
  return Math.min(1,jac+pref);
}

if(!process.env.DATABASE_URL){
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const candidates = JSON.parse(fs.readFileSync(input,'utf8')).candidates || [];

const existingUrlRows = await sql`select url from trump_sources where url is not null`;
const existingUrls = new Set(existingUrlRows.map(r=>r.url).filter(Boolean));
const existingTitles = await sql`select entry_number,title,date_start from trump_entries order by entry_number desc limit 2500`;

let urlDup=0,titleDup=0;
const unmatched=[];
for(const c of candidates){
  const u=(c.entry_url||'').trim();
  if(!u || existingUrls.has(u)){urlDup++; continue;}
  let best={score:0,entry:null,title:null};
  let isDup=false;
  for(let i=0;i<Math.min(existingTitles.length,1500);i++){
    const e=existingTitles[i];
    const sc=sim(c.title||'', e.title||'');
    if(sc>best.score) best={score:sc,entry:e.entry_number,title:e.title};
    if(sc>=0.9){ isDup=true; break; }
  }
  if(isDup){ titleDup++; continue; }
  unmatched.push({...c, best_similarity:Number(best.score.toFixed(3)), best_match_entry:best.entry, best_match_title:best.title});
}

unmatched.sort((a,b)=>String(a.published_at||'').localeCompare(String(b.published_at||'')));
const preview = unmatched.slice(-50);
const out={
  generated_at:new Date().toISOString(),
  total_candidates:candidates.length,
  url_dupes:urlDup,
  title_dupes:titleDup,
  projected_new_entries:unmatched.length,
  preview_sample_size:preview.length,
  preview,
};
fs.writeFileSync(output, JSON.stringify(out,null,2));
console.log(JSON.stringify({
  total_candidates: out.total_candidates,
  url_dupes: out.url_dupes,
  title_dupes: out.title_dupes,
  projected_new_entries: out.projected_new_entries,
  preview_sample_size: out.preview_sample_size,
}, null, 2));
>>>>>>> theirs
