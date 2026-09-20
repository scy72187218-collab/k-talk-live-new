/* K-Talk temporary live interaction fallback while the primary database is unavailable.
   Stores only short-lived viewer presence and live messages in warm function memory. */
const g=globalThis;
if(!g.__ktLiveInteractionMemory){
  g.__ktLiveInteractionMemory={viewers:new Map(),messages:[]};
}
const S=g.__ktLiveInteractionMemory;

function now(){return Date.now();}
function key(host,viewer){return String(host||'')+'|'+String(viewer||'');}
function clean(){
  const t=now();
  for(const [k,v] of S.viewers.entries()){
    if(!v.active||t-Number(v.seen||0)>70000)S.viewers.delete(k);
  }
  S.messages=S.messages.filter(m=>t-Number(m.ts||0)<30*60*1000).slice(-1200);
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
module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  clean();
  try{
    if(req.method==='POST'){
      const b=req.body||{},action=String(b.action||'');
      const host=String(b.host_id||'').slice(0,120);
      const viewer=String(b.viewer_id||'').slice(0,140);

      if(action==='join'||action==='heartbeat'){
        if(host&&viewer){
          S.viewers.set(key(host,viewer),{
            host_id:host,viewer_id:viewer,
            viewer_name:String(b.viewer_name||'게스트').slice(0,100),
            active:true,seen:now()
          });
        }
        clean();
        return res.end(JSON.stringify({ok:true}));
      }

      if(action==='leave'){
        if(host&&viewer)S.viewers.delete(key(host,viewer));
        clean();
        return res.end(JSON.stringify({ok:true}));
      }

      if(action==='message'){
        if(!host)return res.end(JSON.stringify({ok:false,error:'host_required'}));
        const m={
          id:'memmsg_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),
          host_id:host,
          sender_id:String(b.sender_id||viewer||'guest').slice(0,140),
          sender_name:String(b.sender_name||'게스트').slice(0,100),
          message:String(b.message||'').slice(0,300),
          message_type:String(b.message_type||'chat').slice(0,180),
          ts:now()
        };
        S.messages.push(m);clean();
        return res.end(JSON.stringify({ok:true,message:outMsg(m)}));
      }
      return res.end(JSON.stringify({ok:false,error:'bad_action'}));
    }

    const q=req.query||{},action=String(q.action||'');
    if(action==='viewer_host'){
      const viewer=String(q.viewer_id||'');
      const rows=[];
      for(const v of S.viewers.values())if(v.active&&v.viewer_id===viewer)rows.push(v);
      rows.sort((a,b)=>b.seen-a.seen);
      return res.end(JSON.stringify({ok:true,host_id:rows[0]?rows[0].host_id:''}));
    }
    if(action==='viewers'){
      const host=String(q.host_id||'');
      const rows=[];
      for(const v of S.viewers.values())if(v.active&&v.host_id===host)rows.push(outViewer(v));
      return res.end(JSON.stringify({ok:true,viewers:rows}));
    }
    if(action==='messages'){
      const host=String(q.host_id||'');
      const rows=S.messages.filter(m=>m.host_id===host).map(outMsg);
      return res.end(JSON.stringify({ok:true,messages:rows.slice(-300)}));
    }
    if(action==='state'){
      const host=String(q.host_id||'');
      const viewers=[];
      for(const v of S.viewers.values())if(v.active&&v.host_id===host)viewers.push(outViewer(v));
      const messages=S.messages.filter(m=>m.host_id===host).map(outMsg).slice(-300);
      return res.end(JSON.stringify({ok:true,viewers,messages}));
    }
    return res.end(JSON.stringify({ok:true,viewers:[],messages:[]}));
  }catch(e){
    res.statusCode=500;
    return res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};