/* K-Talk LIVE 빨간 신호 전용.
   Supabase DB/Storage를 쓰지 않고 Realtime Presence만 사용.
   방/영상/채팅/버튼 동작은 변경하지 않음. */
(function(){
  if(window.__ktRealtimePresenceLive20260920)return;
  window.__ktRealtimePresenceLive20260920=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var TOPIC='realtime:ktalk-live-presence-v1';
  var ws=null,joined=false,tracked=false,joinRef='',seq=1;
  var hosts={},reconnectTimer=null,heartbeatTimer=null,lastRoomOpen=false;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function hostRoomOpen(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var list=[].slice.call(document.querySelectorAll('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
      if(!list.length)return false;
      return list.some(function(el){
        try{
          var r=el.getBoundingClientRect(),cs=getComputedStyle(el);
          return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>2&&r.height>2;
        }catch(e){return true;}
      });
    }catch(e){return false;}
  }

  function roomInfo(){
    var st=window.state||{},type='solo',name='1인 방송';
    try{
      type=String(st.liveRoomType||st.prepRoomType||'solo');
      name=String(st.liveRoomName||st.prepRoomName||'1인 방송');
      if(type==='group')type='group13';
      if(type==='password')type='secret';
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

  function send(event,payload){
    if(!ws||ws.readyState!==1)return false;
    try{
      ws.send(JSON.stringify({
        topic:TOPIC,
        event:event,
        payload:payload||{},
        ref:String(seq++),
        join_ref:event==='heartbeat'?null:joinRef
      }));
      return true;
    }catch(e){return false;}
  }

  function track(){
    if(!joined||tracked||!hostRoomOpen())return;
    var r=roomInfo();
    var ok=send('presence',{
      type:'presence',
      event:'track',
      payload:{
        role:'host',
        live:true,
        host_id:deviceId(),
        host_name:profileName(),
        room_type:r.type,
        room_name:r.name,
        online_at:new Date().toISOString()
      }
    });
    if(ok)tracked=true;
  }

  function untrack(){
    if(!joined||!tracked)return;
    send('presence',{type:'presence',event:'untrack',payload:{}});
    tracked=false;
  }

  function metaList(v){
    if(!v)return [];
    if(Array.isArray(v))return v;
    if(Array.isArray(v.metas))return v.metas;
    return [v];
  }

  function rebuildFromState(state){
    hosts={};
    Object.keys(state||{}).forEach(function(k){
      metaList(state[k]).forEach(function(m){
        if(m&&m.role==='host'&&m.live!==false){
          var id=String(m.host_id||k||'');
          if(id)hosts[id]=m;
        }
      });
    });
    paint();
  }

  function applyDiff(diff){
    var joins=(diff&&diff.joins)||{};
    var leaves=(diff&&diff.leaves)||{};
    Object.keys(joins).forEach(function(k){
      metaList(joins[k]).forEach(function(m){
        if(m&&m.role==='host'&&m.live!==false){
          var id=String(m.host_id||k||'');
          if(id)hosts[id]=m;
        }
      });
    });
    Object.keys(leaves).forEach(function(k){
      metaList(leaves[k]).forEach(function(m){
        var id=String((m&&m.host_id)||k||'');
        if(id)delete hosts[id];
      });
    });
    paint();
  }

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.body&&document.body.classList.contains('kt-video-mode'))return true;
      return !!document.querySelector('#screen .kt-public-video,#screen .kt-hard-public-video,#homeVideo,.video-home,.media video');
    }catch(e){return false;}
  }

  function holder(){
    try{
      var vids=[].slice.call(document.querySelectorAll('#screen .kt-public-video,#screen .kt-hard-public-video,#homeVideo,.video-home video,.media video'));
      var vh=window.innerHeight||document.documentElement.clientHeight||0,best=null,score=1e9;
      vids.forEach(function(v){
        try{
          var b=v.getBoundingClientRect();
          if(b.width<4||b.height<4||b.bottom<=0||b.top>=vh)return;
          var s=Math.abs(((b.top+b.bottom)/2)-(vh/2));
          if(s<score){score=s;best=v;}
        }catch(e){}
      });
      var v=best||vids[0];
      if(v)return v.closest('section,.video-home,.media,.kt-hard-video-card,div')||v.parentElement;
      return document.querySelector('.video-home,#screen .media,#screen');
    }catch(e){return null;}
  }

  function paint(){
    var old=document.getElementById('ktPresenceLiveBadge');
    var ids=Object.keys(hosts);
    if(!inVideoView()||!ids.length){
      if(old)old.remove();
      return;
    }
    var h=holder();
    if(!h)return;
    try{if(getComputedStyle(h).position==='static')h.style.setProperty('position','relative','important');}catch(e){}
    var b=old;
    if(!b){
      b=document.createElement('div');
      b.id='ktPresenceLiveBadge';
      b.style.cssText='position:absolute!important;left:10px!important;top:10px!important;z-index:2147483000!important;display:flex!important;align-items:center!important;gap:5px!important;height:27px!important;padding:0 9px!important;border-radius:999px!important;background:#f01849!important;color:#fff!important;border:1px solid rgba(255,255,255,.75)!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 2px 10px rgba(0,0,0,.48)!important;pointer-events:none!important;white-space:nowrap!important';
      b.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#fff"></span><b>LIVE</b>';
    }
    if(b.parentElement!==h)h.appendChild(b);
  }

  function handle(ev){
    var m=null;
    try{m=JSON.parse(ev.data);}catch(e){return;}
    if(!m||m.topic!==TOPIC)return;

    if(m.event==='phx_reply'&&m.topic===TOPIC&&String(m.ref||'')===String(joinRef)){
      if(m.payload&&m.payload.status==='ok'){
        joined=true;
        if(hostRoomOpen())track();
      }else{
        joined=false;
        tracked=false;
      }
      return;
    }
    if(m.event==='presence_state'){rebuildFromState(m.payload||{});return;}
    if(m.event==='presence_diff'){applyDiff(m.payload||{});return;}
    if(m.event==='phx_error'||m.event==='phx_close'){
      joined=false;tracked=false;scheduleReconnect(350);
    }
  }

  function closeSocket(){
    joined=false;tracked=false;
    if(heartbeatTimer){clearInterval(heartbeatTimer);heartbeatTimer=null;}
    try{if(ws)ws.close();}catch(e){}
    ws=null;
  }

  function scheduleReconnect(ms){
    if(reconnectTimer)return;
    reconnectTimer=setTimeout(function(){reconnectTimer=null;connect();},ms||600);
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
                broadcast:{ack:false,self:false},
                presence:{enabled:true,key:deviceId()},
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
            try{ws.send(JSON.stringify({topic:'phoenix',event:'heartbeat',payload:{},ref:String(seq++),join_ref:null}));}catch(e){}
          }
        },20000);
      };
      ws.onmessage=handle;
      ws.onerror=function(){};
      ws.onclose=function(){joined=false;tracked=false;scheduleReconnect(500);};
    }catch(e){scheduleReconnect(900);}
  }

  function reconcile(){
    var open=hostRoomOpen();
    if(open&&!lastRoomOpen){lastRoomOpen=true;track();}
    else if(!open&&lastRoomOpen){lastRoomOpen=false;untrack();}
    if(!ws||ws.readyState>1)scheduleReconnect(250);
    paint();
  }

  connect();
  setInterval(reconcile,900);
  setInterval(paint,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktPresenceLiveMo);
      window.__ktPresenceLiveMo=setTimeout(reconcile,50);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-kt-room']});
  }catch(e){}
  document.addEventListener('visibilitychange',function(){if(!document.hidden){reconcile();paint();}});
  window.addEventListener('focus',function(){reconcile();paint();});
  window.addEventListener('online',function(){scheduleReconnect(100);});
  window.addEventListener('pagehide',function(){try{untrack();}catch(e){}});

  window.ktPresenceLiveSignalStatus=function(){
    return {socket:ws?ws.readyState:-1,joined:joined,tracked:tracked,hosts:Object.keys(hosts).length,roomOpen:hostRoomOpen()};
  };
})();