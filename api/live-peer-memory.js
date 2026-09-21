/* K-Talk LIVE peer-signaling fallback.
   Durable Supabase signaling first; per-instance memory only as an emergency fallback.
   Uses viewer_id prefix "fallback:" and offer_sdp "fallback_pending" so the primary
   WebRTC poller does not race this fallback path. */
const g=globalThis;
if(!g.__ktLivePeerMemory)g.__ktLivePeerMemory=new Map();

const REST="https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/";
const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo";
const TABLE=REST+'ktalk_webrtc_sessions';

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
}
function nowIso(){return new Date().toISOString();}
function memId(){return 'mem_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
function cleanMem(){
  const now=Date.now();
  for(const [id,s] of g.__ktLivePeerMemory.entries()){
    if(!s.active||now-Number(s.updated||0)>45000)g.__ktLivePeerMemory.delete(id);
  }
}
function baseHeaders(extra){
  return Object.assign({
    apikey:KEY,
    Authorization:'Bearer '+KEY,
    'Content-Type':'application/json'
  },extra||{});
}
async function db(path,opt,timeout){
  const ctrl=typeof AbortController!=='undefined'?new AbortController():null;
  const timer=ctrl?setTimeout(()=>ctrl.abort(),timeout||2400):null;
  try{
    const r=await fetch(TABLE+path,Object.assign({cache:'no-store',headers:baseHeaders()},opt||{},ctrl?{signal:ctrl.signal}:{}));
    if(timer)clearTimeout(timer);
    if(!r.ok)throw new Error('db '+r.status);
    const t=await r.text();
    return t?JSON.parse(t):null;
  }catch(e){
    if(timer)clearTimeout(timer);
    throw e;
  }
}
function memCreate(host,viewer){
  const sid=memId();
  g.__ktLivePeerMemory.set(sid,{
    id:sid,host_id:host,viewer_id:'fallback:'+viewer,
    offer_sdp:'fallback_pending',answer_sdp:null,active:true,updated:Date.now()
  });
  return sid;
}
function memRows(host){
  const rows=[];
  for(const s of g.__ktLivePeerMemory.values()){
    if(s.active&&s.host_id===host){
      rows.push({id:s.id,host_id:s.host_id,viewer_id:s.viewer_id,offer_sdp:s.offer_sdp,answer_sdp:s.answer_sdp,active:s.active,updated_at:new Date(s.updated).toISOString()});
    }
  }
  return rows;
}

module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  cleanMem();

  try{
    if(req.method==='POST'){
      const b=req.body||{},action=String(b.action||'');
      const host=String(b.host_id||'').slice(0,120);
      const viewer=String(b.viewer_id||'').slice(0,120);

      if(action==='create'){
        try{
          const rows=await db('',{
            method:'POST',
            headers:baseHeaders({Prefer:'return=representation'}),
            body:JSON.stringify({
              host_id:host,
              viewer_id:'fallback:'+viewer,
              offer_sdp:'fallback_pending',
              answer_sdp:null,
              active:true,
              updated_at:nowIso()
            })
          },2600);
          const row=Array.isArray(rows)&&rows[0];
          if(row&&row.id)return res.end(JSON.stringify({ok:true,id:String(row.id),durable:true}));
        }catch(e){}
        const sid=memCreate(host,viewer);
        return res.end(JSON.stringify({ok:true,id:sid,durable:false}));
      }

      if(action==='end_match'){
        try{
          const q='?host_id=eq.'+encodeURIComponent(host)+'&viewer_id=eq.'+encodeURIComponent('fallback:'+viewer)+'&active=eq.true';
          await db(q,{method:'PATCH',headers:baseHeaders({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()})},2200);
        }catch(e){}
        for(const [sid,s] of g.__ktLivePeerMemory.entries()){
          if(s.active&&(!host||s.host_id===host)&&(!viewer||s.viewer_id==='fallback:'+viewer)){
            s.active=false;s.updated=Date.now();g.__ktLivePeerMemory.set(sid,s);
          }
        }
        cleanMem();
        return res.end(JSON.stringify({ok:true}));
      }

      const sid=String(b.session_id||'');
      if(!sid)return res.end(JSON.stringify({ok:false,error:'missing_session'}));

      if(!sid.startsWith('mem_')){
        const patch={updated_at:nowIso()};
        if(action==='offer')patch.offer_sdp=String(b.offer_sdp||'');
        if(action==='answer')patch.answer_sdp=String(b.answer_sdp||'');
        if(action==='end')patch.active=false;
        try{
          await db('?id=eq.'+encodeURIComponent(sid),{
            method:'PATCH',
            headers:baseHeaders({Prefer:'return=minimal'}),
            body:JSON.stringify(patch)
          },2200);
          return res.end(JSON.stringify({ok:true,durable:true}));
        }catch(e){}
      }

      const s=g.__ktLivePeerMemory.get(sid);
      if(!s)return res.end(JSON.stringify({ok:false,error:'not_found'}));
      if(action==='offer'){s.offer_sdp=String(b.offer_sdp||'');s.updated=Date.now();}
      if(action==='answer'){s.answer_sdp=String(b.answer_sdp||'');s.updated=Date.now();}
      if(action==='touch'){s.updated=Date.now();}
      if(action==='end'){s.active=false;s.updated=Date.now();}
      g.__ktLivePeerMemory.set(sid,s);cleanMem();
      return res.end(JSON.stringify({ok:true,durable:false}));
    }

    const q=req.query||{};
    const host=String(q.host_id||'');
    const sid=String(q.session_id||'');

    if(host){
      try{
        const rows=await db(
          '?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at'+
          '&host_id=eq.'+encodeURIComponent(host)+
          '&viewer_id=like.'+encodeURIComponent('fallback:*')+
          '&active=eq.true&order=updated_at.asc&limit=50',
          null,2200
        );
        return res.end(JSON.stringify({ok:true,sessions:Array.isArray(rows)?rows:[],durable:true}));
      }catch(e){
        return res.end(JSON.stringify({ok:true,sessions:memRows(host),durable:false}));
      }
    }

    if(sid){
      if(!sid.startsWith('mem_')){
        try{
          const rows=await db(
            '?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at&id=eq.'+encodeURIComponent(sid)+'&active=eq.true&limit=1',
            null,2200
          );
          return res.end(JSON.stringify({ok:true,session:Array.isArray(rows)&&rows[0]?rows[0]:null,durable:true}));
        }catch(e){}
      }
      const s=g.__ktLivePeerMemory.get(sid);
      if(!s||!s.active)return res.end(JSON.stringify({ok:true,session:null,durable:false}));
      s.updated=Date.now();g.__ktLivePeerMemory.set(sid,s);
      return res.end(JSON.stringify({ok:true,session:{id:s.id,host_id:s.host_id,viewer_id:s.viewer_id,offer_sdp:s.offer_sdp,answer_sdp:s.answer_sdp,active:s.active,updated_at:new Date(s.updated).toISOString()},durable:false}));
    }

    return res.end(JSON.stringify({ok:true,sessions:[]}));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};