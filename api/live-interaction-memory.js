/* K-Talk shared live interaction fallback.
   Viewer presence + guest request/approval messages are kept in Vercel Runtime Cache
   so host and guest can land on different Function instances and still see the same state. */
const g=globalThis;
if(!g.__ktLiveInteractionMemory)g.__ktLiveInteractionMemory={viewers:new Map(),messages:[]};
const LOCAL=g.__ktLiveInteractionMemory;

let cachePromise=null;
async function runtimeCache(){
  if(cachePromise)return cachePromise;
  cachePromise=import('@vercel/functions')
    .then(m=>typeof m.getCache==='function'?m.getCache():null)
    .catch(()=>null);
  return cachePromise;
}

const PREFIX='ktlive-interaction-v2:';
const VIEWER_TTL=90;
const MESSAGE_TTL=1800;
function now(){return Date.now();}
function safe(v,n){return String(v||'').slice(0,n);}
function enc(v){return encodeURIComponent(String(v||''));}
function kViewer(host,viewer){return PREFIX+'viewer:'+enc(host)+':'+enc(viewer);}
function kViewerHost(viewer){return PREFIX+'viewer-host:'+enc(viewer);}
function kHostViewers(host){return PREFIX+'host-viewers:'+enc(host);}
function kMessages(host){return PREFIX+'messages:'+enc(host);}
function localKey(host,viewer){return String(host||'')+'|'+String(viewer||'');}

async function cget(key){
  const c=await runtimeCache();
  if(c){try{return await c.get(key);}catch(e){}}
  return null;
}
async function cset(key,val,ttl){
  const c=await runtimeCache();
  if(c){try{await c.set(key,val,{ttl:ttl});return true;}catch(e){}}
  return false;
}
async function cdel(key){
  const c=await runtimeCache();
  if(c){try{await c.delete(key);return true;}catch(e){}}
  return false;
}
function arr(v){return Array.isArray(v)?v:[];}

function cleanLocal(){
  const t=now();
  for(const [k,v] of LOCAL.viewers.entries()){
    if(!v.active||t-Number(v.seen||0)>70000)LOCAL.viewers.delete(k);
  }
  LOCAL.messages=LOCAL.messages.filter(m=>t-Number(m.ts||0)<30*60*1000).slice(-1200);
}
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
}
function outViewer(v){
  return {host_id:v.host_id,viewer_id:v.viewer_id,viewer_name:v.viewer_name,active:!!v.active,updated_at:new Date(v.seen).toISOString()};
}
function outMsg(m){
  return {id:m.id,host_id:m.host_id,sender_id:m.sender_id,sender_name:m.sender_name,message:m.message,message_type:m.message_type,created_at:new Date(m.ts).toISOString()};
}

async function rememberViewer(v){
  LOCAL.viewers.set(localKey(v.host_id,v.viewer_id),v);
  await cset(kViewer(v.host_id,v.viewer_id),v,VIEWER_TTL);
  await cset(kViewerHost(v.viewer_id),{host_id:v.host_id,seen:v.seen},VIEWER_TTL);
  let ids=arr(await cget(kHostViewers(v.host_id)));
  if(ids.indexOf(v.viewer_id)<0)ids.push(v.viewer_id);
  ids=[...new Set(ids.map(String).filter(Boolean))].slice(-300);
  await cset(kHostViewers(v.host_id),ids,VIEWER_TTL);
}
async function forgetViewer(host,viewer){
  LOCAL.viewers.delete(localKey(host,viewer));
  await cdel(kViewer(host,viewer));
  await cdel(kViewerHost(viewer));
  let ids=arr(await cget(kHostViewers(host))).filter(x=>String(x)!==String(viewer));
  await cset(kHostViewers(host),ids,VIEWER_TTL);
}
async function viewersForHost(host){
  const out=[];
  let ids=arr(await cget(kHostViewers(host)));
  for(const viewer of ids){
    const v=await cget(kViewer(host,viewer));
    if(v&&v.active&&now()-Number(v.seen||0)<VIEWER_TTL*1000)out.push(v);
  }
  if(out.length)return out;
  cleanLocal();
  for(const v of LOCAL.viewers.values())if(v.active&&v.host_id===host)out.push(v);
  return out;
}
async function hostForViewer(viewer){
  const vh=await cget(kViewerHost(viewer));
  if(vh&&vh.host_id&&now()-Number(vh.seen||0)<VIEWER_TTL*1000)return String(vh.host_id);
  cleanLocal();
  const rows=[];
  for(const v of LOCAL.viewers.values())if(v.active&&v.viewer_id===viewer)rows.push(v);
  rows.sort((a,b)=>b.seen-a.seen);
  return rows[0]?String(rows[0].host_id||''):'';
}
async function appendMessage(m){
  LOCAL.messages.push(m);cleanLocal();
  let list=arr(await cget(kMessages(m.host_id)));
  list.push(m);
  const cutoff=now()-MESSAGE_TTL*1000;
  list=list.filter(x=>x&&Number(x.ts||0)>=cutoff).slice(-400);
  await cset(kMessages(m.host_id),list,MESSAGE_TTL);
}
async function messagesForHost(host){
  let list=arr(await cget(kMessages(host)));
  const cutoff=now()-MESSAGE_TTL*1000;
  list=list.filter(x=>x&&Number(x.ts||0)>=cutoff).slice(-300);
  if(list.length)return list;
  cleanLocal();
  return LOCAL.messages.filter(m=>m.host_id===host).slice(-300);
}

module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  cleanLocal();
  try{
    if(req.method==='POST'){
      const b=req.body||{},action=String(b.action||'');
      const host=safe(b.host_id,120);
      const viewer=safe(b.viewer_id,140);

      if(action==='join'||action==='heartbeat'){
        if(host&&viewer){
          const v={host_id:host,viewer_id:viewer,viewer_name:safe(b.viewer_name||'게스트',100),active:true,seen:now()};
          await rememberViewer(v);
        }
        return res.end(JSON.stringify({ok:true,shared:true}));
      }

      if(action==='leave'){
        if(host&&viewer)await forgetViewer(host,viewer);
        return res.end(JSON.stringify({ok:true,shared:true}));
      }

      if(action==='message'){
        if(!host)return res.end(JSON.stringify({ok:false,error:'host_required'}));
        const m={
          id:'memmsg_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),
          host_id:host,
          sender_id:safe(b.sender_id||viewer||'guest',140),
          sender_name:safe(b.sender_name||'게스트',100),
          message:safe(b.message,300),
          message_type:safe(b.message_type||'chat',180),
          ts:now()
        };
        await appendMessage(m);
        return res.end(JSON.stringify({ok:true,message:outMsg(m),shared:true}));
      }
      return res.end(JSON.stringify({ok:false,error:'bad_action'}));
    }

    const q=req.query||{},action=String(q.action||'');
    if(action==='viewer_host'){
      const viewer=String(q.viewer_id||'');
      return res.end(JSON.stringify({ok:true,host_id:await hostForViewer(viewer),shared:true}));
    }
    if(action==='viewers'){
      const host=String(q.host_id||'');
      const rows=(await viewersForHost(host)).map(outViewer);
      return res.end(JSON.stringify({ok:true,viewers:rows,shared:true}));
    }
    if(action==='messages'){
      const host=String(q.host_id||'');
      const rows=(await messagesForHost(host)).map(outMsg);
      return res.end(JSON.stringify({ok:true,messages:rows,shared:true}));
    }
    if(action==='state'){
      const host=String(q.host_id||'');
      const viewers=(await viewersForHost(host)).map(outViewer);
      const messages=(await messagesForHost(host)).map(outMsg);
      return res.end(JSON.stringify({ok:true,viewers,messages,shared:true}));
    }
    return res.end(JSON.stringify({ok:true,viewers:[],messages:[],shared:true}));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};
