/* Temporary LIVE signal fallback for database outages.
   Stores only short-lived LIVE beacon data in warm function memory. */
const g=globalThis;
if(!g.__ktLiveBeaconMemory)g.__ktLiveBeaconMemory=new Map();
if(!g.__ktLiveEndedMemory)g.__ktLiveEndedMemory=new Map();

function clean(){
  const now=Date.now();
  for(const [id,row] of g.__ktLiveBeaconMemory.entries()){
    if(now-Number(row.seen||0)>8000)g.__ktLiveBeaconMemory.delete(id);
  }
  for(const [id,row] of g.__ktLiveEndedMemory.entries()){
    if(now-Number(row.ended||0)>45000)g.__ktLiveEndedMemory.delete(id);
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
      const action=String(b.action||'');
      const id=String(b.host_id||'').slice(0,120);
      if(action==='end'&&id){g.__ktLiveBeaconMemory.delete(id);g.__ktLiveEndedMemory.set(id,{host_id:id,ended:Date.now()});}
      if((action==='publish'||action==='heartbeat')&&id){
        g.__ktLiveEndedMemory.delete(id);
        g.__ktLiveBeaconMemory.set(id,{
          host_id:id,
          host_name:String(b.host_name||'K-Talk 방송자').slice(0,100),
          title:String(b.title||'방송 중').slice(0,160),
          room_type:String(b.room_type||'solo').slice(0,40),
          room_name:String(b.room_name||'방송').slice(0,80),
          seen:Date.now()
        });
      }
      clean();
      return res.end(JSON.stringify({ok:true,count:g.__ktLiveBeaconMemory.size}));
    }

    /* GET write is only for an internal deployment self-test; normal clients only read. */
    const q=req.query||{};
    if(String(q.test_action||'')==='publish'&&q.host_id){
      const id=String(q.host_id).slice(0,120);
      g.__ktLiveBeaconMemory.set(id,{host_id:id,host_name:'selftest',title:'test',room_type:'test',room_name:'test',seen:Date.now()});
    }else if(String(q.test_action||'')==='end'&&q.host_id){
      const id=String(q.host_id).slice(0,120);g.__ktLiveBeaconMemory.delete(id);g.__ktLiveEndedMemory.set(id,{host_id:id,ended:Date.now()});
    }
    clean();
    res.end(JSON.stringify({
      ok:true,
      rooms:Array.from(g.__ktLiveBeaconMemory.values()).map(x=>({
        host_id:x.host_id,host_name:x.host_name,title:x.title,room_type:x.room_type,room_name:x.room_name,
        updated_at:new Date(x.seen).toISOString()
      })),
      ended:Array.from(g.__ktLiveEndedMemory.values()).map(x=>({
        host_id:x.host_id,ended_at:new Date(x.ended).toISOString()
      }))
    }));
  }catch(e){
    res.statusCode=500;
    res.end(JSON.stringify({ok:false,error:String(e&&e.message||e)}));
  }
};