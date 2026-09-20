/* K-Talk red LIVE badge fallback only.
   Uses Supabase Realtime Broadcast so the red LIVE indicator can work even when Postgres REST is temporarily unavailable.
   Does not modify rooms, chat, switches, layouts, video playback, or WebRTC transport. */
(function(){
  if(window.__ktRedLiveFallback20260921)return;
  window.__ktRedLiveFallback20260921=true;

  var URL='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var CHANNEL='ktalk-red-live-fallback-20260921';
  var client=null,channel=null,subscribed=false,hostStarted=false,wasOpen=false;
  var liveMap={},lastSend=0,loadStarted=false;

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
      return !!s.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo');
    }catch(e){return false;}
  }

  function hasHostVideo(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
    }catch(e){}
    try{
      var v=document.getElementById('ktLiveVideo'),ss=v&&v.srcObject;
      return !!(ss&&ss.getVideoTracks&&ss.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.body&&document.body.classList.contains('kt-video-mode'))return true;
      var s=document.getElementById('screen')||document;
      return !!s.querySelector('.kt-public-video,.kt-hard-public-video,#homeVideo,.video-home,.media');
    }catch(e){return false;}
  }

  function info(){
    var st=window.state||{},type='solo',name='1인 방송',title='',host='K-Talk 방송자';
    try{
      type=String(st.liveRoomType||'solo');
      name=String(st.liveRoomName||'1인 방송');
      if(type==='group')type='group13';
      var t=document.getElementById('liveTitle');
      title=t?String(t.value||'').trim():'';
    }catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        host=String(p.name||host);
      }
    }catch(e){}
    return {host:host,type:type,name:name,title:title};
  }

  function hostOpen(){
    var explicit=false;
    try{
      explicit=hostStarted===true||
        window.__ktHostBroadcastActive===true||
        !!(window.state&&(state.liveStarted===true||state.isLive===true||state.broadcasting===true));
    }catch(e){explicit=hostStarted===true||window.__ktHostBroadcastActive===true;}
    return !!(explicit&&roomVisible()&&hasHostVideo());
  }

  function cleanup(){
    var now=Date.now();
    Object.keys(liveMap).forEach(function(id){
      if(now-Number(liveMap[id]._seen||0)>6500)delete liveMap[id];
    });
  }

  function fallbackBadge(){
    cleanup();
    var old=document.getElementById('ktRedLiveFallbackBadge');
    /* If normal DB-backed LIVE badge exists, let it take priority. */
    if(document.getElementById('ktVideoLivePeek')){
      if(old)old.remove();
      return;
    }
    var rows=Object.keys(liveMap).map(function(k){return liveMap[k];}).sort(function(a,b){return (b._seen||0)-(a._seen||0);});
    if(!inVideoView()||!rows.length){
      if(old)old.remove();
      return;
    }
    var r=rows[0];
    var host=document.querySelector('.video-home')||document.querySelector('#screen .media');
    if(!host){
      var v=document.querySelector('#screen .kt-public-video,#screen .kt-hard-public-video,#screen #homeVideo');
      host=v&&(v.closest('section,.kt-hard-video-card,.media,.video-home')||v.parentElement);
    }
    if(!host)return;
    try{if(getComputedStyle(host).position==='static')host.style.setProperty('position','relative','important');}catch(e){}
    if(!old){
      old=document.createElement('div');
      old.id='ktRedLiveFallbackBadge';
      old.setAttribute('aria-label','현재 방송 중');
      old.style.cssText='position:absolute!important;left:10px!important;top:56px!important;z-index:2147483000!important;display:flex!important;align-items:center!important;gap:6px!important;height:34px!important;padding:0 11px!important;border-radius:999px!important;background:#e9153d!important;color:#fff!important;border:1px solid rgba(255,255,255,.72)!important;box-shadow:0 2px 12px rgba(0,0,0,.45)!important;font:950 12px/1 system-ui,-apple-system,sans-serif!important;pointer-events:none!important;white-space:nowrap!important';
    }
    old.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.2)"></span><b>LIVE</b>';
    if(old.parentElement!==host)host.appendChild(old);
  }

  function onLive(payload){
    payload=payload||{};
    var id=String(payload.host_id||'');
    if(!id)return;
    payload._seen=Date.now();
    liveMap[id]=payload;
    fallbackBadge();
  }

  function onEnd(payload){
    var id=String((payload||{}).host_id||'');
    if(id)delete liveMap[id];
    fallbackBadge();
  }

  function send(event,payload){
    if(!subscribed||!channel)return Promise.resolve(false);
    try{
      return Promise.resolve(channel.send({type:'broadcast',event:event,payload:payload}))
        .then(function(){return true;})
        .catch(function(){return false;});
    }catch(e){return Promise.resolve(false);}
  }

  function publishTick(force){
    var open=hostOpen(),id=deviceId(),now=Date.now();
    if(open){
      if(force||now-lastSend>1500){
        var x=info();
        send('live',{host_id:id,host_name:x.host,title:x.title,room_type:x.type,room_name:x.name,updated_at:new Date().toISOString()});
        lastSend=now;
      }
      wasOpen=true;
    }else if(wasOpen){
      send('end',{host_id:id,updated_at:new Date().toISOString()});
      wasOpen=false;lastSend=0;
    }
    fallbackBadge();
  }

  function markStart(){
    hostStarted=true;
    setTimeout(function(){publishTick(true);},180);
    setTimeout(function(){publishTick(true);},700);
    setTimeout(function(){publishTick(true);},1600);
  }

  function wrapStart(){
    try{
      var old=window.startBroadcast;
      if(typeof old!=='function'||old.__ktRedFallbackWrapped)return;
      var fn=function(){
        var self=this,args=arguments,r=old.apply(self,args);
        if(r&&typeof r.then==='function'){
          return r.then(function(v){markStart();return v;});
        }
        markStart();
        return r;
      };
      fn.__ktRedFallbackWrapped=true;
      window.startBroadcast=fn;
    }catch(e){}
  }

  function markStop(){
    hostStarted=false;
    if(wasOpen)send('end',{host_id:deviceId(),updated_at:new Date().toISOString()});
    wasOpen=false;lastSend=0;
  }

  function startTarget(e){
    var el=e&&e.target&&e.target.closest?e.target.closest('button,.prep-start'):null;
    if(!el)return false;
    if(el.classList&&el.classList.contains('prep-start'))return true;
    return /방송\s*시작/.test(String(el.textContent||''));
  }

  function connect(){
    if(client||!window.supabase||typeof window.supabase.createClient!=='function')return;
    try{
      client=window.supabase.createClient(URL,KEY,{
        auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
        realtime:{params:{eventsPerSecond:10}}
      });
      channel=client.channel(CHANNEL,{config:{broadcast:{self:true,ack:false}}});
      channel
        .on('broadcast',{event:'live'},function(msg){onLive(msg&&msg.payload);})
        .on('broadcast',{event:'end'},function(msg){onEnd(msg&&msg.payload);})
        .subscribe(function(status){
          subscribed=status==='SUBSCRIBED';
          if(subscribed){
            publishTick(true);
            setTimeout(function(){publishTick(true);},350);
          }
        });
    }catch(e){client=null;channel=null;subscribed=false;}
  }

  function loadClient(){
    if(window.supabase&&typeof window.supabase.createClient==='function'){connect();return;}
    if(loadStarted)return;
    loadStarted=true;
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.async=true;
    s.onload=connect;
    s.onerror=function(){loadStarted=false;};
    document.head.appendChild(s);
  }

  document.addEventListener('pointerdown',function(e){if(startTarget(e))markStart();},true);
  document.addEventListener('click',function(e){
    if(startTarget(e))markStart();
    var stop=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back'):null;
    if(stop)markStop();
  },true);

  var mo=new MutationObserver(function(){
    clearTimeout(window.__ktRedFallbackMo);
    window.__ktRedFallbackMo=setTimeout(function(){publishTick(false);fallbackBadge();},100);
  });
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}

  setInterval(function(){wrapStart();publishTick(false);},1200);
  setInterval(fallbackBadge,700);
  window.addEventListener('focus',function(){publishTick(true);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)publishTick(true);});
  window.addEventListener('pagehide',markStop);

  window.ktRedLiveFallbackStatus=function(){
    return {subscribed:subscribed,hostOpen:hostOpen(),liveCount:Object.keys(liveMap).length};
  };

  wrapStart();
  loadClient();
})();