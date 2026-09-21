/* K-Talk 빨간 LIVE 신호 전용 - Realtime Broadcast 방식.
   DB/Storage를 쓰지 않는다.
   프로필/장미/메시지/공유 및 방송방 UI는 변경하지 않는다. */
(function(){
  if(window.__ktRealtimePresenceLive20260920)return;
  window.__ktRealtimePresenceLive20260920=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var CHANNEL='ktalk-live-signal-v3';
  var TOPIC='realtime:'+CHANNEL;
  var ws=null,joined=false,joinRef='',seq=1,reconnectTimer=null,heartbeatTimer=null;
  var hostTimer=null,lastHostState=false,hostHealthyAt=0,forcedOff=false;
  var liveHosts={};
  window.__ktRealtimeLiveHosts=liveHosts;
  window.__ktRealtimeSignalReady=false;
  var DEVICE=deviceId();

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
      var list=[].slice.call(document.querySelectorAll(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      ));
      return list.some(function(el){
        try{
          var r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return s.display!=='none'&&s.visibility!=='hidden'&&r.width>4&&r.height>4;
        }catch(e){return true;}
      });
    }catch(e){return false;}
  }

  function localCameraLive(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
    }catch(e){}
    try{
      var room=document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
      if(!room)return false;
      var v=room.querySelector('video');
      if(!v)return false;
      var s2=v.srcObject;
      if(s2&&s2.getVideoTracks&&s2.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
      if(v.readyState>=2&&!v.ended)return true;
    }catch(e){}
    return false;
  }

  function isHostLive(){
    if(!roomVisible())return false;
    if(localCameraLive())return true;
    /* 방송방 자체가 실제로 열린 뒤에는 즉시 신호를 올린다. */
    try{
      return !!document.querySelector('#screen .ktsolo-room video,#screen .ktg13-room video,#screen .ktsubscriber-room video,#screen .ktsecret-room video');
    }catch(e){return false;}
  }

  function roomInfo(){
    var st=window.state||{},type='solo',name='1인 방송';
    try{
      type=String(st.liveRoomType||st.prepRoomType||'solo');
      name=String(st.liveRoomName||st.prepRoomName||'1인 방송');
    }catch(e){}
    return {type:type,name:name};
  }

  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        return String(p.nickname||p.name||p.displayName||'K-Talk 방송자').slice(0,80);
      }
    }catch(e){}
    try{return String(localStorage.getItem('ktalk_profile_name')||'K-Talk 방송자').slice(0,80);}catch(e){}
    return 'K-Talk 방송자';
  }

  async function broadcast(eventName,payload){
    /* WebSocket first: one stable realtime channel is much less jumpy than
       serverless/REST polling. REST remains only as a fallback. */
    try{
      if(joined&&ws&&ws.readyState===1){
        ws.send(JSON.stringify({
          topic:TOPIC,
          event:'broadcast',
          payload:{type:'broadcast',event:eventName,payload:payload||{}},
          ref:String(seq++),
          join_ref:joinRef
        }));
        return true;
      }
    }catch(e){}
    try{
      var res=await fetch('https://'+REF+'.supabase.co/realtime/v1/api/broadcast',{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json','apikey':KEY},
        body:JSON.stringify({messages:[{topic:CHANNEL,event:eventName,payload:payload||{}}]})
      });
      return !!res.ok;
    }catch(e){return false;}
  }

  function publishOn(){
    if(forcedOff)return;
    if(!isHostLive()&&!(lastHostState&&hostHealthyAt&&Date.now()-hostHealthyAt<30000))return;
    var r=roomInfo();
    broadcast('live_on',{
      host_id:DEVICE,
      host_name:profileName(),
      room_type:r.type,
      room_name:r.name,
      at:Date.now()
    });
  }

  function publishOff(){
    broadcast('live_off',{host_id:DEVICE,at:Date.now()});
  }

  function startHostBeacon(){
    if(hostTimer||forcedOff)return;
    /* 방송 시작 순간 빠르게 여러 번 알리고 이후에도 짧은 간격으로 유지 */
    publishOn();
    setTimeout(publishOn,180);
    setTimeout(publishOn,450);
    setTimeout(publishOn,850);
    hostTimer=setInterval(publishOn,1000);
  }

  function stopHostBeacon(){
    if(hostTimer){clearInterval(hostTimer);hostTimer=null;}
    publishOff();
  }

  function visibleVideoHolder(){
    try{
      var vids=[].slice.call(document.querySelectorAll('#screen .kt-public-video,#screen #homeVideo,.video-home video,.media video'));
      var vh=innerHeight||document.documentElement.clientHeight||0,best=null,dist=Infinity;
      vids.forEach(function(v){
        try{
          var r=v.getBoundingClientRect();
          if(r.width<4||r.height<4||r.bottom<=0||r.top>=vh)return;
          var d=Math.abs(((r.top+r.bottom)/2)-(vh/2));
          if(d<dist){dist=d;best=v;}
        }catch(e){}
      });
      if(!best)return null;
      return best.closest('section,.video-home,.media')||best.parentElement;
    }catch(e){return null;}
  }

  function cleanupHosts(){
    var now=Date.now();
    Object.keys(liveHosts).forEach(function(id){
      /* 짧은 Wi-Fi/모바일 흔들림에는 LIVE가 내려가지 않게 15초 여유.
         실제 방송 종료는 live_off 이벤트로 즉시 제거된다. */
      if(now-Number(liveHosts[id].last||0)>15000)delete liveHosts[id];
    });
  }

  function paint(){
    cleanupHosts();
    var old=document.getElementById('ktRealtimeLiveRedBadge');
    var ids=Object.keys(liveHosts).filter(function(id){return id!==DEVICE;});
    var holder=visibleVideoHolder();

    if(!holder||!ids.length||document.documentElement.classList.contains('kt-remote-viewing')){
      if(old)old.remove();
      return;
    }

    try{
      if(getComputedStyle(holder).position==='static')holder.style.setProperty('position','relative','important');
    }catch(e){}

    var badge=old;
    if(!badge){
      badge=document.createElement('div');
      badge.id='ktRealtimeLiveRedBadge';
      badge.innerHTML='<span></span><b>LIVE</b>';
      badge.style.cssText='position:absolute!important;left:10px!important;top:10px!important;z-index:2147483000!important;height:27px!important;padding:0 9px!important;border-radius:999px!important;background:#ed1745!important;color:#fff!important;border:1px solid rgba(255,255,255,.9)!important;display:flex!important;align-items:center!important;gap:5px!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 2px 10px rgba(0,0,0,.5),0 0 9px rgba(237,23,69,.55)!important;pointer-events:none!important;white-space:nowrap!important';
      var dot=badge.querySelector('span');
      dot.style.cssText='width:8px!important;height:8px!important;border-radius:50%!important;background:#fff!important;display:block!important';
    }
    if(badge.parentElement!==holder)holder.appendChild(badge);
  }

  function handleBroadcast(payload){
    var ev=String(payload&&payload.event||'');
    var data=payload&&payload.payload||{};

    /* 새 시청기기가 들어오면 방송 중인 호스트가 즉시 신호를 다시 보낸다.
       다음 주기까지 기다리지 않고 예전처럼 바로 표시되게 하는 용도. */
    if(ev==='live_query'){
      if(isHostLive())publishOn();
      return;
    }

    var id=String(data.host_id||'');
    if(!id)return;
    if(ev==='live_on'){
      liveHosts[id]={last:Date.now(),data:data};
    }else if(ev==='live_off'){
      delete liveHosts[id];
      window.__ktRealtimeLastEndedHost={host_id:id,at:Date.now()};
    }
    window.__ktRealtimeLiveHosts=liveHosts;
    paint();
  }

  function handleMessage(ev){
    var m=null;
    try{m=JSON.parse(ev.data);}catch(e){return;}
    if(!m||m.topic!==TOPIC)return;

    if(m.event==='phx_reply'&&String(m.ref||'')===String(joinRef)){
      joined=!!(m.payload&&m.payload.status==='ok');
      window.__ktRealtimeSignalReady=joined;
      if(joined){
        broadcast('live_query',{requester:DEVICE,at:Date.now()});
        setTimeout(function(){broadcast('live_query',{requester:DEVICE,at:Date.now()});},250);
        setTimeout(function(){broadcast('live_query',{requester:DEVICE,at:Date.now()});},700);
      }
      return;
    }
    if(m.event==='broadcast'){
      handleBroadcast(m.payload||{});
    }
  }

  function closeSocket(){
    joined=false;
    window.__ktRealtimeSignalReady=false;
    if(heartbeatTimer){clearInterval(heartbeatTimer);heartbeatTimer=null;}
    try{if(ws)ws.close();}catch(e){}
    ws=null;
  }

  function scheduleReconnect(ms){
    if(reconnectTimer)return;
    reconnectTimer=setTimeout(function(){reconnectTimer=null;connect();},ms||500);
  }

  function connect(){
    closeSocket();
    try{
      ws=new WebSocket('wss://'+REF+'.supabase.co/realtime/v1/websocket?apikey='+encodeURIComponent(KEY)+'&vsn=1.0.0');
      ws.onopen=function(){
        joinRef=String(seq++);
        try{
          ws.send(JSON.stringify({
            topic:TOPIC,
            event:'phx_join',
            payload:{
              config:{
                broadcast:{ack:false,self:true},
                presence:{enabled:false},
                postgres_changes:[],
                private:false
              }
            },
            ref:joinRef,
            join_ref:joinRef
          }));
        }catch(e){}
        heartbeatTimer=setInterval(function(){
          if(ws&&ws.readyState===1){
            try{
              ws.send(JSON.stringify({
                topic:'phoenix',
                event:'heartbeat',
                payload:{},
                ref:String(seq++),
                join_ref:null
              }));
            }catch(e){}
          }
        },20000);
      };
      ws.onmessage=handleMessage;
      ws.onerror=function(){};
      ws.onclose=function(){joined=false;window.__ktRealtimeSignalReady=false;scheduleReconnect(500);};
    }catch(e){scheduleReconnect(900);}
  }

  function reconcile(){
    var on=isHostLive();
    if(on){
      hostHealthyAt=Date.now();
      if(forcedOff)forcedOff=false;
      if(!lastHostState){lastHostState=true;startHostBeacon();}
      else if(!hostTimer)startHostBeacon();
    }else if(lastHostState){
      /* 방송 화면/카메라가 잠깐 흔들려도 즉시 LIVE를 내리지 않는다.
         명시적 종료 버튼은 아래 래퍼에서 바로 live_off를 보낸다. */
      if(!hostHealthyAt||Date.now()-hostHealthyAt>30000){
        lastHostState=false;stopHostBeacon();
      }
    }
    if(!ws||ws.readyState>1)scheduleReconnect(200);
    paint();
  }

  function wrapBroadcastState(){
    var start=window.startBroadcast;
    if(typeof start==='function'&&!start.__ktRealtimeLiveStartWrap){
      var s=function(){
        forcedOff=false;hostHealthyAt=Date.now();
        var r=start.apply(this,arguments);
        setTimeout(reconcile,80);setTimeout(reconcile,300);
        return r;
      };
      s.__ktRealtimeLiveStartWrap=true;window.startBroadcast=s;
    }
    ['leaveBroadcastToDashboard','endBroadcastEarnings'].forEach(function(name){
      var old=window[name];
      if(typeof old!=='function'||old.__ktRealtimeLiveEndWrap)return;
      var fn=function(){
        forcedOff=true;lastHostState=false;hostHealthyAt=0;
        stopHostBeacon();
        var r=old.apply(this,arguments);
        return r;
      };
      fn.__ktRealtimeLiveEndWrap=true;window[name]=fn;
    });
  }

  connect();
  wrapBroadcastState();
  setInterval(wrapBroadcastState,450);
  setInterval(reconcile,350);
  setInterval(paint,500);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRealtimeLiveSignalMo);
      window.__ktRealtimeLiveSignalMo=setTimeout(reconcile,30);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-kt-room']});
  }catch(e){}

  window.addEventListener('focus',function(){
    reconcile();
    if(joined)broadcast('live_query',{requester:DEVICE,at:Date.now()});
  });
  window.addEventListener('online',function(){scheduleReconnect(100);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)reconcile();});
  window.addEventListener('pagehide',function(){if(lastHostState)publishOff();});

  window.ktPresenceLiveSignalStatus=function(){
    cleanupHosts();
    return {
      socket:ws?ws.readyState:-1,
      joined:joined,
      hostLive:isHostLive(),
      seenHosts:Object.keys(liveHosts).length
    };
  };
})();