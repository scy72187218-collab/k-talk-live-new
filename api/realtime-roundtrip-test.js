module.exports=async function handler(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  const out={};
  try{
    const asset=await fetch('https://k-talk-live-final.vercel.app/live-presence.js?t='+Date.now(),{cache:'no-store'});
    const js=await asset.text();
    const km=js.match(/var KEY='([^']+)'/);
    if(!km) throw new Error('key_not_found');
    const key=km[1];

    if(typeof WebSocket==='undefined'){
      res.statusCode=200;
      return res.end(JSON.stringify({ok:false,stage:'runtime',error:'WebSocket unavailable'}));
    }

    const topic='realtime:ktalk-live-signal-v2';
    const eventName='probe_'+Date.now();
    const ws=new WebSocket('wss://zupwbfmacwzexyvznlzq.supabase.co/realtime/v1/websocket?apikey='+encodeURIComponent(key)+'&vsn=1.0.0');

    let done=false;
    const finish=(obj)=>{
      if(done)return;
      done=true;
      try{ws.close();}catch(e){}
      res.statusCode=200;
      res.end(JSON.stringify(obj));
    };

    const timer=setTimeout(()=>finish({ok:false,stage:'timeout',out}),8000);

    ws.onopen=()=>{
      out.open=true;
      ws.send(JSON.stringify({
        topic,
        event:'phx_join',
        payload:{
          config:{
            broadcast:{ack:false,self:true},
            presence:{enabled:false},
            postgres_changes:[],
            private:false
          },
          access_token:key
        },
        ref:'1',
        join_ref:'1'
      }));
    };

    ws.onerror=(e)=>{
      out.ws_error=true;
    };

    ws.onmessage=async(ev)=>{
      let m;
      try{m=JSON.parse(String(ev.data));}catch(e){return;}
      out.last=m;
      if(m.event==='phx_reply'&&m.topic===topic&&m.payload&&m.payload.status==='ok'&&!out.joined){
        out.joined=true;
        const r=await fetch('https://zupwbfmacwzexyvznlzq.supabase.co/realtime/v1/api/broadcast',{
          method:'POST',
          headers:{'Content-Type':'application/json','apikey':key},
          body:JSON.stringify({messages:[{
            topic:'ktalk-live-signal-v2',
            event:eventName,
            payload:{hello:'world',at:new Date().toISOString()}
          }]})
        });
        out.broadcast_status=r.status;
        return;
      }
      if(m.event==='broadcast'&&m.topic===topic){
        out.received=m;
        if(m.payload&&m.payload.event===eventName){
          clearTimeout(timer);
          return finish({ok:true,stage:'received',out});
        }
      }
    };

    ws.onclose=()=>{
      out.closed=true;
      if(!done){
        clearTimeout(timer);
        finish({ok:false,stage:'closed',out});
      }
    };
  }catch(e){
    res.statusCode=200;
    res.end(JSON.stringify({ok:false,stage:'exception',error:String(e&&e.message||e)}));
  }
};