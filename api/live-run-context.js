/* K-Talk current host run context cache (2026-09-25).
   Communication metadata only. Gives every viewer the exact LiveKit room run
   before approval, so multi-phone entry does not wait for a later heartbeat. */
const g=globalThis;
if(!g.__ktLiveRunContext20260925)g.__ktLiveRunContext20260925=new Map();
const LOCAL=g.__ktLiveRunContext20260925;
let cachePromise=null;
async function runtimeCache(){
  if(cachePromise)return cachePromise;
  cachePromise=import('@vercel/functions')
    .then(m=>typeof m.getCache==='function'?m.getCache():null)
    .catch(()=>null);
  return cachePromise;
}
const PREFIX='ktalk-live-run-v1:';
const TTL=120;
function key(host){return PREFIX+encodeURIComponent(String(host||''));}
async function cget(k){
  const c=await runtimeCache();
  if(c){try{return await c.get(k);}catch(e){}}
  return null;
}
async function cset(k,v){
  const c=await runtimeCache();
  if(c){try{await c.set(k,v,{ttl:TTL});return true;}catch(e){}}
  return false;
}
function clean(){
  const now=Date.now();
  for(const [k,v] of LOCAL.entries()){
    if(now-Number(v.seen||0)>TTL*1000)LOCAL.delete(k);
  }
}
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
}
module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  clean();
  try{
    if(req.method==='POST'){
      const b=req.body||{};
      const host=String(b.host_id||'').slice(0,120);
      const run=String(b.run_id||'').slice(0,120);
      const started=Number(b.run_started_at||0);
      if(!host||!run)return res.end(JSON.stringify({ok:false,error:'host_run_required'}));
      const row={host_id:host,run_id:run,run_started_at:started,seen:Date.now()};
      LOCAL.set(host,row);
      await cset(key(host),row);
      return res.end(JSON.stringify({ok:true}));
    }
    const host=String((req.query||{}).host_id||'').slice(0,120);
    if(!host)return res.end(JSON.stringify({ok:false,error:'host_required'}));
    let row=await cget(key(host));
    if(!row)row=LOCAL.get(host)||null;
    if(!row||Date.now()-Number(row.seen||0)>TTL*1000){
      return res.end(JSON.stringify({ok:true,run_id:'',run_started_at:0}));
    }
    return res.end(JSON.stringify({
      ok:true,
      host_id:host,
      run_id:String(row.run_id||''),
      run_started_at:Number(row.run_started_at||0)
    }));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};