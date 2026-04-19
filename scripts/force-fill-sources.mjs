#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

function parseArgs(argv){const o={};for(let i=0;i<argv.length;i++){const t=argv[i];if(!t.startsWith('--')) continue;const k=t.slice(2);const n=argv[i+1];if(!n||n.startsWith('--')) o[k]=true; else {o[k]=n;i++;}}return o;}
function loadEnv(){const p=path.join(process.cwd(),'.env.local');if(!fs.existsSync(p)) return;for(const line of fs.readFileSync(p,'utf8').split('\n')){const s=line.trim();if(!s||s.startsWith('#')) continue;const i=s.indexOf('=');if(i<1) continue;const k=s.slice(0,i).trim();const v=s.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'');if(!(k in process.env)) process.env[k]=v;}}
function normalizeUrl(raw){try{const u=new URL(raw.trim());u.hash='';return u.toString();}catch{return null;}}
function hostOf(u){try{return new URL(u).hostname.toLowerCase().replace(/^www\./,'');}catch{return '';}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function ts(){return new Date().toISOString().replace(/[:.]/g,'').replace(/-/g,'').slice(0,15)+'Z';}
function decodeHtml(s){return s.replaceAll('&amp;','&');}
function extractDdgTarget(href){try{if(!href) return null; if(href.startsWith('//')) href='https:'+href; if(href.includes('duckduckgo.com/l/?')){const u=new URL(href);const t=u.searchParams.get('uddg');return t?decodeURIComponent(t):null;} return href.startsWith('http')?href:null;}catch{return null;}}

const SOFT=new Set([401,403,405,429]);
const HOSTS=[
  'reuters.com','apnews.com','bbc.com','theguardian.com','nytimes.com','washingtonpost.com','npr.org','justice.gov','congress.gov','supremecourt.gov','whitehouse.gov','wsj.com','politico.com','cnn.com','abcnews.go.com','cbsnews.com','nbcnews.com','time.com'
];
const args=parseArgs(process.argv.slice(2));
const entryFile=args['entry-file'];
const concurrency=Math.max(1,Number(args.concurrency||12));
const timeoutMs=Math.max(1000,Number(args.timeout_ms||4500));
if(!entryFile){console.error('--entry-file required');process.exit(1);} 
loadEnv();
if(!process.env.DATABASE_URL){console.error('DATABASE_URL missing');process.exit(1);} 
const sql=neon(process.env.DATABASE_URL,{fetchOptions:{cache:'no-store'}});
const ids=fs.readFileSync(entryFile,'utf8').split('\n').map(x=>Number(x.trim())).filter(n=>Number.isInteger(n)&&n>0);
const runId='forcefill_'+ts();

async function probe(url){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);try{let r;try{r=await fetch(url,{method:'HEAD',redirect:'follow',signal:controller.signal});}catch{r=await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal});}
return {ok:r.status>=200&&r.status<400,status:r.status};}catch{return {ok:false,status:0};}finally{clearTimeout(timer);} }

async function ddg(query){const url='https://duckduckgo.com/html/?q='+encodeURIComponent(query);const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);try{const r=await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'user-agent':'Mozilla/5.0'}});if(!r.ok) return [];const html=await r.text();const re=/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"/g;const out=[];let m;while((m=re.exec(html))&&out.length<14){const target=extractDdgTarget(decodeHtml(m[1]));if(target) out.push(target);}return out;}catch{return [];}finally{clearTimeout(timer);} }

function pub(host){const parts=host.split('.');return parts.length>=2?parts.slice(-2).join('.').toUpperCase():host.toUpperCase();}

const rows=await sql`select te.entry_number,te.title,te.synopsis,te.suggested_source_query,te.fact_check_sources,
coalesce(json_agg(json_build_object('url',ts.url)) filter (where ts.source_id is not null),'[]'::json) as source_rows
from trump_entries te
left join trump_sources ts on ts.entry_number=te.entry_number
where te.entry_number=any(${ids})
group by te.entry_number,te.title,te.synopsis,te.suggested_source_query,te.fact_check_sources
order by te.entry_number`;

let idx=0, inserted=0, skipped=0, failed=0;
const changed=[];
async function worker(){
  while(idx<rows.length){
    const r=rows[idx++];
    const existing=new Set((r.source_rows||[]).map(x=>normalizeUrl(x.url)).filter(Boolean));
    let queries=[];
    if(r.title) queries.push(r.title+' trump');
    if(r.suggested_source_query) queries.push(r.suggested_source_query);
    if(r.synopsis) queries.push((r.title||'trump')+' '+r.synopsis.split(' ').slice(0,12).join(' '));
    queries=[...new Set(queries)].slice(0,3);

    let picked=null;
    for(const q of queries){
      const urls=await ddg(q);
      for(const u0 of urls){
        const u=normalizeUrl(u0); if(!u||existing.has(u)) continue;
        const h=hostOf(u); if(!HOSTS.some(d=>h===d||h.endsWith('.'+d))) continue;
        const p=await probe(u);
        if(p.ok || SOFT.has(p.status)){ picked={url:u,host:h,status:p.status}; break; }
      }
      if(picked) break;
      await sleep(80);
    }

    if(!picked){ failed++; continue; }
    try{
      await sql`insert into trump_sources (entry_number,url,title,publisher,source_type) values (${r.entry_number},${picked.url},${r.title||null},${pub(picked.host)},'news')`;
      await sql`insert into trump_sources_repair_audit (run_id,entry_number,action,old_urls,new_urls,confidence,notes)
                values (${runId},${r.entry_number},'insert_forcefill',${JSON.stringify(Array.from(existing))}::jsonb,${JSON.stringify([picked.url])}::jsonb,${0.6},${`force fill status=${picked.status}`})`;
      inserted++; changed.push(r.entry_number);
    }catch(e){ skipped++; }
    await sleep(40);
  }
}

await Promise.all(Array.from({length:concurrency},()=>worker()));
const out={runId,total:rows.length,inserted,skipped,failed,changed};
fs.writeFileSync(`logs/forcefill_${runId}.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
