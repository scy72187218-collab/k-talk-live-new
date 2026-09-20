/* K-Talk red LIVE badge fallback only.
   Uses a same-site short-lived beacon endpoint when Supabase DB is unavailable.
   Does not modify rooms, chat, switches, layouts, video playback, or WebRTC transport. */
(function(){
  if(window.__ktRedLiveMemoryFallback20260921)return;
  window.__ktRedLiveMemoryFallback20260921=true;

  var API='/api/live-beacon-memory';
  var hostStarted=false,wasHost=false,lastPost=0,busyPost=false,busyGet=false;
  var liveRows=[];

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function actualHostRoomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen')||document;
      return !!s.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
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
    var stateLive=false;
    try{
      stateLive=!!(window.__ktHostBroadcastActive===true||
        (window.state&&(state.liveStarted===true||state.isLive===true||state.broadcasting===true)));
    }catch(e){}
    /* 실제 방송방 DOM 자체가 열려 있으면 방송중으로 본다.
       준비화면의 카메라(#ktLiveVideo)만으로는 방송중 처리하지 않는다. */
    return actualHostRoomVisible()&&(hostStarted||stateLive||actualHostRoomVisible());
  }

  function badgeHost(){
    try{
      var host=document.querySelector('.video-home')||document.querySelector('#screen .media');
      if(host)return host;
      var v=document.querySelector('#screen .kt-public-video,#screen .kt-hard-public-video,#screen #homeVideo');
      return v&&(v.closest('section,.kt-hard-video-card,.media,.video-home')||v.parentElement);
    }catch(e){return null;}
  }

  function render(){
    var old=document.getElementById('ktRedLiveMemoryBadge');
    /* 정상 DB LIVE 배지가 이미 뜨면 중복 표시하지 않는다. */
    if(document.getElementById('ktVideoLivePeek')){
      if(old)old.remove();
      return;
    }
    if(!inVideoView()||!liveRows.length){
      if(old)old.remove();
      return;
    }
    var host=badgeHost();
    if(!host)return;
    try{if(getComputedStyle(host).position==='static')host.style.setProperty('position','relative','important');}catch(e){}
    if(!old){
      old=document.createElement('div');
      old.id='ktRedLiveMemoryBadge';
      old.setAttribute('aria-label','현재 방송 중');
      old.style.cssText='position:absolute!important;left:10px!important;top:56px!important;z-index:2147483000!important;display:flex!important;align-items:center!important;gap:6px!important;height:34px!important;padding:0 11px!important;border-radius:999px!important;background:#e9153d!important;color:#fff!important;border:1px solid rgba(255,255,255,.75)!important;box-shadow:0 2px 12px rgba(0,0,0,.45)!important;font:950 12px/1 system-ui,-apple-system,sans-serif!important;pointer-events:none!important;white-space:nowrap!important';
    }
    old.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.22)"></span><b>LIVE</b>';
    if(old.parentElement!==host)host.appendChild(old);
  }

  async function post(action){
    if(busyPost)return;
    busyPost=true;
    try{
      var x=info();
      await fetch(API+'?t='+Date.now(),{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          action:action,
          host_id:deviceId(),
          host_name:x.host,
          title:x.title,
          room_type:x.type,
          room_name:x.name
        })
      });
    }catch(e){}finally{busyPost=false;}
  }

  async function hostTick(force){
    var open=hostOpen(),now=Date.now();
    if(open){
      if(force||now-lastPost>900){
        lastPost=now;
        post(wasHost?'heartbeat':'publish');
      }
      wasHost=true;
    }else if(wasHost){
      wasHost=false;lastPost=0;
      post('end');
    }
  }

  async function viewerTick(){
    if(busyGet)return;
    busyGet=true;
    try{
      var r=await fetch(API+'?t='+Date.now(),{cache:'no-store'});
      if(r.ok){
        var j=await r.json();
        liveRows=Array.isArray(j&&j.rooms)?j.rooms:[];
        /* 이 기기 자체 신호는 동영상 화면의 방송중 배지 대상에서 제외 */
        var own=deviceId();
        liveRows=liveRows.filter(function(x){return String(x.host_id||'')!==String(own);});
      }
    }catch(e){}finally{
      busyGet=false;
      render();
    }
  }

  function markStart(){
    hostStarted=true;
    [120,450,900,1600].forEach(function(ms){setTimeout(function(){hostTick(true);},ms);});
  }

  function markStop(){
    hostStarted=false;
    if(wasHost)post('end');
    wasHost=false;lastPost=0;
  }

  function wrapStart(){
    try{
      var old=window.startBroadcast;
      if(typeof old!=='function'||old.__ktRedMemoryWrapped)return;
      var fn=function(){
        var self=this,args=arguments,r=old.apply(self,args);
        if(r&&typeof r.then==='function'){
          return r.then(function(v){markStart();return v;});
        }
        markStart();
        return r;
      };
      fn.__ktRedMemoryWrapped=true;
      window.startBroadcast=fn;
    }catch(e){}
  }

  function startTarget(e){
    var el=e&&e.target&&e.target.closest?e.target.closest('button,.prep-start'):null;
    if(!el)return false;
    if(el.classList&&el.classList.contains('prep-start'))return true;
    return /방송\s*시작/.test(String(el.textContent||''));
  }

  document.addEventListener('pointerdown',function(e){if(startTarget(e))markStart();},true);
  document.addEventListener('click',function(e){
    if(startTarget(e))markStart();
    var stop=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back'):null;
    if(stop)markStop();
  },true);

  var mo=new MutationObserver(function(){
    clearTimeout(window.__ktRedMemoryMo);
    window.__ktRedMemoryMo=setTimeout(function(){hostTick(false);viewerTick();},100);
  });
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}

  setInterval(function(){wrapStart();hostTick(false);},850);
  setInterval(viewerTick,900);
  setInterval(render,500);
  window.addEventListener('focus',function(){hostTick(true);viewerTick();});
  document.addEventListener('visibilitychange',function(){if(!document.hidden){hostTick(true);viewerTick();}});
  window.addEventListener('pagehide',markStop);

  window.ktRedLiveMemoryStatus=function(){
    return {hostOpen:hostOpen(),wasHost:wasHost,liveCount:liveRows.length};
  };

  wrapStart();
  setTimeout(function(){hostTick(true);viewerTick();},250);
})();