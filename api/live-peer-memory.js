/* K-Talk LIVE shared peer-signaling store.
   Uses Vercel Runtime Cache so host/viewer do not depend on the same Function instance.
   Falls back to local memory only if Runtime Cache is temporarily unavailable. */
const g=globalThis;
if(!g.__ktLivePeerMemory)g.__ktLivePeerMemory=new Map();
const local=g.__ktLivePeerMemory;

let cachePromise=null;
async function runtimeCache(){
  if(cachePromise)return cachePromise;
  cachePromise=import('@vercel/functions')
    .then(m=>typeof m.getCache==='function'?m.getCache():null)
    .catch(()=>null);
  return cachePromise;
}
const TTL=90;
const prefix='ktlive-peer-v2:';
function sidKey(id){return prefix+'session:'+String(id||'').slice(0,180);}
function hostKey(id){return prefix+'host:'+String(id||'').slice(0,140);}
function id(){return 'mem_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
function now(){return Date.now();}
function parse(v){
  if(v==null)return null;
  if(typeof v==='string'){try{return JSON.parse(v);}catch(e){return null;}}
  return v;
}
async function getValue(key){
  const c=await runtimeCache();
  if(c){
    try{return parse(await c.get(key));}catch(e){}
  }
  return local.get(key)||null;
}
async function setValue(key,value,ttl=TTL){
  const c=await runtimeCache();
  if(c){
    try{await c.set(key,JSON.stringify(value),{ttl});return true;}catch(e){}
  }
  local.set(key,value);
  return false;
}
async function getHostIds(host){
  const x=await getValue(hostKey(host));
  return Array.isArray(x)?x:[];
}
async function setHostIds(host,ids){
  const clean=[...new Set((ids||[]).map(String).filter(Boolean))].slice(-80);
  await setValue(hostKey(host),clean,TTL);
}
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
}
function out(s){
  if(!s)return null;
  return {
    id:s.id,host_id:s.host_id,viewer_id:s.viewer_id,
    offer_sdp:s.offer_sdp,answer_sdp:s.answer_sdp,
    active:!!s.active,updated_at:new Date(Number(s.updated||now())).toISOString()
  };
}
module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  try{
    if(req.method==='POST'){
      const b=req.body||{},action=String(b.action||'');
      if(action==='create'){
        const host=String(b.host_id||'').slice(0,120);
        const viewer=String(b.viewer_id||'').slice(0,140);
        if(!host||!viewer)return res.end(JSON.stringify({ok:false,error:'host_viewer_required'}));
        const sid=id();
        const s={id:sid,host_id:host,viewer_id:viewer,offer_sdp:'fallback_pending',answer_sdp:null,active:true,updated:now()};
        await setValue(sidKey(sid),s,TTL);
        const ids=await getHostIds(host);
        ids.push(sid);
        await setHostIds(host,ids);
        return res.end(JSON.stringify({ok:true,id:sid,shared:true}));
      }

      if(action==='end_match'){
        const host=String(b.host_id||'').slice(0,120);
        const viewer=String(b.viewer_id||'').slice(0,140);
        if(host){
          const ids=await getHostIds(host),keep=[];
          for(const sid of ids){
            const s=await getValue(sidKey(sid));
            if(!s)continue;
            if(s.active&&(!viewer||s.viewer_id===viewer)){
              s.active=false;s.updated=now();
              await setValue(sidKey(sid),s,10);
            }else if(s.active)keep.push(sid);
          }
          await setHostIds(host,keep);
        }
        return res.end(JSON.stringify({ok:true}));
      }

      const sessionId=String(b.session_id||'');
      const s=await getValue(sidKey(sessionId));
      if(!s)return res.end(JSON.stringify({ok:false,error:'not_found'}));

      if(action==='offer'){s.offer_sdp=String(b.offer_sdp||'');s.updated=now();}
      else if(action==='answer'){s.answer_sdp=String(b.answer_sdp||'');s.updated=now();}
      else if(action==='touch'){s.updated=now();}
      else if(action==='end'){s.active=false;s.updated=now();}
      else return res.end(JSON.stringify({ok:false,error:'bad_action'}));

      await setValue(sidKey(sessionId),s,s.active?TTL:10);
      return res.end(JSON.stringify({ok:true,shared:true}));
    }

    const q=req.query||{};
    const host=String(q.host_id||'');
    const sessionId=String(q.session_id||'');

    if(host){
      const ids=await getHostIds(host),rows=[],keep=[];
      for(const sid of ids){
        const s=await getValue(sidKey(sid));
        if(!s||!s.active)continue;
        if(now()-Number(s.updated||0)>TTL*1000)continue;
        rows.push(out(s));keep.push(sid);
      }
      if(keep.length!==ids.length)await setHostIds(host,keep);
      return res.end(JSON.stringify({ok:true,sessions:rows,shared:true}));
    }

    if(sessionId){
      const s=await getValue(sidKey(sessionId));
      if(!s||!s.active)return res.end(JSON.stringify({ok:true,session:null,shared:true}));
      return res.end(JSON.stringify({ok:true,session:out(s),shared:true}));
    }

    return res.end(JSON.stringify({ok:true,sessions:[],shared:true}));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};
