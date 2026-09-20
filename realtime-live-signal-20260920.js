/* K-Talk LIVE red signal only — native realtime socket.
   영상/채팅/방/프로필은 변경하지 않는다. */
(function(){
  if(window.__ktNativeLiveSignal20260920)return;
  window.__ktNativeLiveSignal20260920=true;

  var REF='zupwbfmacwzexyvznlzq';
  var TOPIC='realtime:ktalk-live-signal-v2';
  var ws=null,key='',joined=false,joinRef=1,msgRef=10,currentJoinRef='';
  var liveMap={};
  var lastOpen=false;
  var reconnectTimer=null;
  var heartbeatTimer=null;
  var tickTimer=null;
  var lastMessageAt=0;
  var lastJoinAt=0;
  var reconnecting=false;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function roomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen')||document;
      if(s.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo'))return true;
      var st=window.state||{};
      if(st.liveStarted===true||st.isLive===true||st.broadcasting===true)return true;
      return false;
    }catch(e){return false;}
  }

  function roomInfo(){
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
    return {type:type,name:name,title:title};
  }

  function profile(){
    var name='K-Talk 방송자';
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        name=String(p.name||name);
      }
    }catch(e){}
    return {name:name};
  }

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.body&&document.body.classList.contains('kt-video-mode'))return true;
      var s=document.getElementById('screen')||document;
      return !!s.querySelector('.kt-public-video,.kt-hard-public-video,#homeVideo,.video-home,.media video,video.kt-public-video,video.kt-hard-public-video');
    }catch(e){return false;}
  }

  function cleanup(){
    var now=Date.now();
    Object.keys(liveMap).forEach(function(id){
      if(now-(liveMap[id]._seen||0)>7500)delete liveMap[id];
    });
  }

  function showSignal(){
    cleanup();
    var old=document.getElementById('ktRealtimeLiveBadge');
    var rows=Object.keys(liveMap).map(function(k){return liveMap[k];}).sort(function(a,b){
      return (b._seen||0)-(a._seen||0);
    });
    if(!inVideoView()||!rows.length){
      if(old)old.remove();
      return;
    }
    var r=rows[0],b=old;
    if(!b){
      b=document.createElement('div');
      b.id='ktRealtimeLiveBadge';
      b.style.cssText='position:fixed;top:72px;right:12px;z-index:2147483000;display:flex;align-items:center;gap:6px;padding:8px 11px;border-radius:999px;background:#e6002d;color:white;font:900 13px/1 system-ui,-apple-system,sans-serif;box-shadow:0 2px 14px rgba(230,0,45,.48);pointer-events:none';
      document.body.appendChild(b);
    }
    b.innerHTML='<span style="width:9px;height:9px;border-radius:50%;background:white;box-shadow:0 0 0 3px rgba(255,255,255,.23)"></span><b>LIVE</b><span style="max-width:86px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.host_name||'방송 중')+'</span>';
  }

  async function readKey(){
    try{
      var r=await fetch('live-presence.js?v=20260920-speed1',{cache:'no-store'});
      if(!r.ok)return '';
      var t=await r.text();
      var m=t.match(/var KEY='([^']+)'/);
      return m?m[1]:'';
    }catch(e){return '';}
  }

  function sendRaw(obj){
    if(!ws||ws.readyState!==1)return false;
    try{ws.send(JSON.stringify(obj));return true;}catch(e){return false;}
  }

  function join(){
    if(!key||!ws||ws.readyState!==1)return;
    joined=false;
    currentJoinRef=String(joinRef++);
    sendRaw({
      topic:TOPIC,
      event:'phx_join',
      payload:{
        config:{
          broadcast:{ack:false,self:false},
          presence:{enabled:false},
          postgres_changes:[],
          private:false
        },
        access_token:key
      },
      ref:currentJoinRef,
      join_ref:currentJoinRef
    });
  }

  function broadcast(event,payload){
    if(!joined)return false;
    return sendRaw({
      topic:TOPIC,
      event:'broadcast',
      payload:{type:'broadcast',event:event,payload:payload},
      ref:String(msgRef++),
      join_ref:currentJoinRef
    });
  }

  function publishNow(){
    var open=roomVisible(),id=deviceId();
    if(open){
      var ri=roomInfo(),p=profile();
      broadcast('live',{
        host_id:id,
        host_name:p.name,
        title:ri.title,
        room_type:ri.type,
        room_name:ri.name,
        updated_at:new Date().toISOString()
      });
      lastOpen=true;
    }else if(lastOpen){
      broadcast('end',{host_id:id,updated_at:new Date().toISOString()});
      lastOpen=false;
    }
    showSignal();
  }

  function handleMessage(ev){
    lastMessageAt=Date.now();
    var m=null;
    try{m=JSON.parse(ev.data);}catch(e){return;}
    if(!m)return;

    if(m.event==='phx_reply'&&m.topic===TOPIC){
      var st=m.payload&&m.payload.status;
      if(st==='ok'){
        joined=true;
        lastJoinAt=Date.now();
        reconnecting=false;
        publishNow();
        setTimeout(publishNow,250);
        setTimeout(publishNow,750);
      }
      return;
    }

    if(m.event==='broadcast'&&m.topic===TOPIC){
      var body=m.payload||{};
      var event=String(body.event||'');
      var p=body.payload||{};
      var id=String(p.host_id||'');
      if(!id)return;
      if(event==='end'){
        delete liveMap[id];
      }else if(event==='live'){
        p._seen=Date.now();
        liveMap[id]=p;
      }
      showSignal();
    }
  }

  function closeSocket(){
    joined=false;
    currentJoinRef='';
    if(heartbeatTimer){clearInterval(heartbeatTimer);heartbeatTimer=null;}
    try{if(ws)ws.close();}catch(e){}
    ws=null;
  }

  function scheduleReconnect(delay){
    if(reconnectTimer||reconnecting)return;
    reconnecting=true;
    reconnectTimer=setTimeout(function(){
      reconnectTimer=null;
      reconnecting=false;
      connect();
    },Math.max(250,delay||900));
  }

  async function connect(){
    if(!key)key=await readKey();
    if(!key){scheduleReconnect();return;}
    closeSocket();
    try{
      ws=new WebSocket('wss://'+REF+'.supabase.co/realtime/v1/websocket?apikey='+encodeURIComponent(key)+'&vsn=1.0.0');
      ws.onopen=function(){
        lastMessageAt=Date.now();
        join();
        heartbeatTimer=setInterval(function(){
          sendRaw({topic:'phoenix',event:'heartbeat',payload:{},ref:String(msgRef++)});
        },20000);
      };
      ws.onmessage=handleMessage;
      ws.onerror=function(){};
      ws.onclose=function(){joined=false;scheduleReconnect(500);};
    }catch(e){scheduleReconnect();}
  }

  function kick(){
    publishNow();
    if(!ws||ws.readyState>1)scheduleReconnect();
  }

  tickTimer=setInterval(kick,1800);
  setInterval(showSignal,700);

  var mo=new MutationObserver(function(){
    clearTimeout(window.__ktNativeLiveSignalMo);
    window.__ktNativeLiveSignalMo=setTimeout(kick,80);
  });
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-kt-room']});}catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){kick();if(!joined)scheduleReconnect(250);setTimeout(kick,220);setTimeout(kick,900);}
  });
  window.addEventListener('focus',function(){kick();if(!joined)scheduleReconnect(250);});
  window.addEventListener('online',function(){kick();scheduleReconnect(250);});
  /* LIVE reconnect watchdog */
  setInterval(function(){
    var now=Date.now();
    var badSocket=!ws||ws.readyState!==1;
    var staleSocket=ws&&ws.readyState===1&&lastMessageAt&&now-lastMessageAt>45000;
    var stuckJoin=ws&&ws.readyState===1&&!joined&&lastJoinAt&&now-lastJoinAt>8000;
    if(badSocket||staleSocket||stuckJoin){
      try{if(ws)ws.close();}catch(e){}
      joined=false;
      scheduleReconnect(350);
      return;
    }
    if(roomVisible()&&joined){
      publishNow();
    }
  },3000);

  window.addEventListener('pagehide',function(){
    if(lastOpen)broadcast('end',{host_id:deviceId(),updated_at:new Date().toISOString()});
  });

  window.ktForceLiveSignalNow=function(){kick();if(!joined)scheduleReconnect(200);return {joined:joined,open:roomVisible(),live:Object.keys(liveMap).length,socket:ws?ws.readyState:-1,lastMessageAt:lastMessageAt};};

  connect();
})();