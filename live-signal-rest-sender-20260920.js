/* K-Talk LIVE signal REST sender only */
(function(){
  if(window.__ktLiveRestSender20260920)return;
  window.__ktLiveRestSender20260920=true;

  var key='';
  var base='https://zupwbfmacwzexyvznlzq.supabase.co';
  var lastOpen=false;

  function id(){
    var v='';
    try{v=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!v){
      v='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',v);}catch(e){}
    }
    return v;
  }

  function roomOpen(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen')||document;
      if(s.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo'))return true;
      var st=window.state||{};
      return st.liveStarted===true||st.isLive===true||st.broadcasting===true||window.__ktHostBroadcastActive===true;
    }catch(e){return false;}
  }

  function info(){
    var st=window.state||{},type='solo',name='1인 방송',title='';
    try{
      type=String(st.liveRoomType||'solo');
      name=String(st.liveRoomName||'1인 방송');
      if(type==='group')type='group13';
      if(type==='password')type='secret';
      var t=document.getElementById('liveTitle');
      title=t?String(t.value||'').trim():'';
    }catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    var host='K-Talk 방송자';
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        host=String(p.name||host);
      }
    }catch(e){}
    return {type:type,name:name,title:title,host:host};
  }

  async function loadKey(){
    if(key)return key;
    try{
      var r=await fetch('live-presence.js?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return '';
      var t=await r.text();
      var m=t.match(/var KEY='([^']+)'/);
      key=m?m[1]:'';
    }catch(e){}
    return key;
  }

  async function send(event,payload){
    var k=await loadKey();
    if(!k)return false;
    try{
      var r=await fetch(base+'/realtime/v1/api/broadcast',{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json','apikey':k},
        body:JSON.stringify({messages:[{
          topic:'ktalk-live-signal-v2',
          event:event,
          payload:payload
        }]})
      });
      return r.ok;
    }catch(e){return false;}
  }

  async function tick(){
    var open=roomOpen(),hostId=id();
    if(open){
      var x=info();
      await send('live',{
        host_id:hostId,
        host_name:x.host,
        title:x.title,
        room_type:x.type,
        room_name:x.name,
        updated_at:new Date().toISOString()
      });
      lastOpen=true;
    }else if(lastOpen){
      await send('end',{host_id:hostId,updated_at:new Date().toISOString()});
      lastOpen=false;
    }
  }

  setInterval(tick,1800);
  setTimeout(tick,350);
  setTimeout(tick,1100);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(tick,100);});
  window.addEventListener('focus',function(){setTimeout(tick,100);});
  window.addEventListener('pagehide',function(){
    if(lastOpen)send('end',{host_id:id(),updated_at:new Date().toISOString()});
  });
})();