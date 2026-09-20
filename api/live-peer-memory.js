/* K-Talk LIVE peer-signaling fallback during database outages.
   Short-lived session data only; no room/layout/chat/switch state is stored here. */
const g=globalThis;
if(!g.__ktLivePeerMemory)g.__ktLivePeerMemory=new Map();

function clean(){
  const now=Date.now();
  for(const [id,s] of g.__ktLivePeerMemory.entries()){
    if(!s.active || now-Number(s.updated||0)>45000)g.__ktLivePeerMemory.delete(id);
  }
}
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
}
function id(){
  return 'mem_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
}
module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  clean();
  try{
    if(req.method==='POST'){
      const b=req.body||{},action=String(b.action||'');
      if(action==='create'){
        const sid=id();
        g.__ktLivePeerMemory.set(sid,{
          id:sid,
          host_id:String(b.host_id||'').slice(0,120),
          viewer_id:String(b.viewer_id||'').slice(0,120),
          offer_sdp:'pending',answer_sdp:null,active:true,updated:Date.now()
        });
        return res.end(JSON.stringify({ok:true,id:sid}));
      }
      const sid=String(b.session_id||'');
      const s=g.__ktLivePeerMemory.get(sid);
      if(!s)return res.end(JSON.stringify({ok:false,error:'not_found'}));
      if(action==='offer'){s.offer_sdp=String(b.offer_sdp||'');s.updated=Date.now();}
      if(action==='answer'){s.answer_sdp=String(b.answer_sdp||'');s.updated=Date.now();}
      if(action==='touch'){s.updated=Date.now();}
      if(action==='end'){s.active=false;s.updated=Date.now();}
      g.__ktLivePeerMemory.set(sid,s);
      clean();
      return res.end(JSON.stringify({ok:true}));
    }

    const q=req.query||{};
    const host=String(q.host_id||'');
    const sid=String(q.session_id||'');
    if(host){
      const rows=[];
      for(const s of g.__ktLivePeerMemory.values()){
        if(s.active&&s.host_id===host){
          rows.push({id:s.id,host_id:s.host_id,viewer_id:s.viewer_id,offer_sdp:s.offer_sdp,answer_sdp:s.answer_sdp,active:s.active,updated_at:new Date(s.updated).toISOString()});
        }
      }
      return res.end(JSON.stringify({ok:true,sessions:rows}));
    }
    if(sid){
      const s=g.__ktLivePeerMemory.get(sid);
      if(!s||!s.active)return res.end(JSON.stringify({ok:true,session:null}));
      s.updated=Date.now();g.__ktLivePeerMemory.set(sid,s);
      return res.end(JSON.stringify({ok:true,session:{id:s.id,host_id:s.host_id,viewer_id:s.viewer_id,offer_sdp:s.offer_sdp,answer_sdp:s.answer_sdp,active:s.active,updated_at:new Date(s.updated).toISOString()}}));
    }
    return res.end(JSON.stringify({ok:true,sessions:[]}));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};