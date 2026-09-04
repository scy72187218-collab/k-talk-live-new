/* K-Talk desktop-only live layout fix. Mobile is intentionally untouched. */
(function(){
  if(window.__ktDesktopLiveFullscreenLoaded)return;
  window.__ktDesktopLiveFullscreenLoaded=true;

  function isDesktop(){return window.matchMedia&&window.matchMedia('(min-width: 768px)').matches;}
  function roomType(){try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}}

  function apply(){
    if(!isDesktop())return;

    var app=document.querySelector('.app');
    if(app){
      app.style.setProperty('max-width','none','important');
      app.style.setProperty('width','100vw','important');
      app.style.setProperty('margin','0','important');
    }
    var screenEl=document.getElementById('screen');
    if(screenEl){
      screenEl.style.setProperty('width','100%','important');
      screenEl.style.setProperty('padding','0','important');
    }

    /* Viewer on a computer: fill the browser instead of leaving a small phone-sized black area. */
    var remote=document.getElementById('ktRemoteLive');
    if(remote){
      remote.style.setProperty('position','absolute','important');
      remote.style.setProperty('inset','0','important');
      remote.style.setProperty('width','100%','important');
      remote.style.setProperty('height','100%','important');
      remote.style.setProperty('object-fit','cover','important');
      remote.style.setProperty('object-position','50% 50%','important');
      remote.style.setProperty('background','#000','important');
    }

    /* Host on a computer. 13-person/subscriber rooms keep their existing host + guest grid. */
    var live=document.getElementById('ktLiveVideo');
    if(live){
      var t=roomType();
      if(t==='group13'||t==='subscriber'){
        if(window.ktApplyTikTokMultiRoomLayout)window.ktApplyTikTokMultiRoomLayout();
      }else{
        live.style.setProperty('position','absolute','important');
        live.style.setProperty('inset','0','important');
        live.style.setProperty('width','100%','important');
        live.style.setProperty('height','100%','important');
        live.style.setProperty('object-fit','cover','important');
        live.style.setProperty('object-position','50% 50%','important');
        live.style.setProperty('transform','scaleX(-1)','important');
        live.style.setProperty('transform-origin','50% 50%','important');
        live.style.setProperty('background','#000','important');
        var layer=document.getElementById('ktLiveEffectLayer');
        if(layer){
          layer.style.setProperty('transform','none','important');
          layer.style.setProperty('transform-origin','50% 50%','important');
        }
      }
    }
  }

  try{
    var obs=new MutationObserver(function(){setTimeout(apply,20);});
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',apply);
  setInterval(apply,700);
  setTimeout(apply,100);
})();

/* Desktop viewer connection stability only. Phone behavior/layout is untouched. */
(function(){
  if(window.__ktDesktopLiveReconnectLoaded)return;
  window.__ktDesktopLiveReconnectLoaded=true;

  function isDesktop(){return window.matchMedia&&window.matchMedia('(min-width: 768px)').matches;}
  var lastJoin=null;
  var retryTimer=null;
  var lastTime=-1;
  var stalled=0;

  function installJoinWrapper(){
    var fn=window.ktJoinLive;
    if(typeof fn!=='function'||fn.__ktDesktopStableWrapped)return;
    function wrapped(hostId,title,roomName){
      if(isDesktop()){
        lastJoin={hostId:hostId,title:title,roomName:roomName};
        lastTime=-1;
        stalled=0;
      }
      return fn.apply(this,arguments);
    }
    wrapped.__ktDesktopStableWrapped=true;
    wrapped.__ktDesktopOriginal=fn;
    window.ktJoinLive=wrapped;
  }

  function scheduleRetry(delay){
    if(!isDesktop()||!lastJoin||retryTimer)return;
    if(!document.getElementById('ktRemoteLive'))return;
    retryTimer=setTimeout(function(){
      retryTimer=null;
      if(!isDesktop()||!lastJoin||!document.getElementById('ktRemoteLive'))return;
      try{window.ktJoinLive(lastJoin.hostId,lastJoin.title,lastJoin.roomName);}catch(e){}
    },delay||1500);
  }

  setInterval(function(){
    installJoinWrapper();
    if(!isDesktop())return;

    var remote=document.getElementById('ktRemoteLive');
    if(!remote){lastTime=-1;stalled=0;return;}

    var status=document.getElementById('ktRemoteLiveStatus');
    var text=status?(status.textContent||''):'';
    if(text.indexOf('끊겼')>=0||text.indexOf('실패')>=0||text.indexOf('늦습니다')>=0){
      scheduleRetry(1200);
      return;
    }

    var t=Number(remote.currentTime||0);
    if(remote.readyState>=2&&t>0){
      if(lastTime>=0&&Math.abs(t-lastTime)<0.08)stalled++;
      else stalled=0;
      lastTime=t;
      if(stalled>=4){
        stalled=0;
        scheduleRetry(1000);
      }
    }else if(remote.readyState<2){
      stalled++;
      if(stalled>=4){stalled=0;scheduleRetry(1000);}
    }
  },2500);

  window.addEventListener('online',function(){
    if(isDesktop()&&document.getElementById('ktRemoteLive'))scheduleRetry(500);
  });
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&isDesktop()&&document.getElementById('ktRemoteLive')){
      setTimeout(function(){
        var v=document.getElementById('ktRemoteLive');
        if(v&&v.readyState<2)scheduleRetry(500);
      },600);
    }
  });

  installJoinWrapper();
})();

/* Mobile 1-person LIVE only: remove the 72% shrink that caused black sidebars. */
(function(){
  if(window.__ktMobileSoloLiveFillLoaded)return;
  window.__ktMobileSoloLiveFillLoaded=true;

  function isMobile(){return window.matchMedia&&window.matchMedia('(max-width: 767px)').matches;}
  function isSolo(){
    try{
      if(!window.state)return false;
      return state.liveRoomType==='solo'||Number(state.liveRoomMax)===1||state.liveRoomName==='1인 방송';
    }catch(e){return false;}
  }
  function fillSolo(){
    if(!isMobile()||!isSolo())return;
    var v=document.getElementById('ktLiveVideo');
    if(!v)return;
    v.style.setProperty('width','100%','important');
    v.style.setProperty('height','100%','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('transform','scaleX(-1)','important');
    v.style.setProperty('transform-origin','50% 50%','important');
    v.style.setProperty('background','#000','important');
    var layer=document.getElementById('ktLiveEffectLayer');
    if(layer){
      layer.style.setProperty('transform','none','important');
      layer.style.setProperty('transform-origin','50% 50%','important');
    }
  }

  try{
    var obs=new MutationObserver(function(){setTimeout(fillSolo,0);});
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',fillSolo);
  setInterval(fillSolo,180);
  setTimeout(fillSolo,40);
})();

/* 1-person LIVE start fix: broadcaster stays on the real camera screen so outside devices can connect to the actual stream. */
(function(){
  if(window.__ktSoloHostLiveStartFixLoaded)return;
  window.__ktSoloHostLiveStartFixLoaded=true;

  function isSolo(){
    try{
      return !!window.state&&(state.liveRoomType==='solo'||Number(state.liveRoomMax)===1||state.liveRoomName==='1인 방송');
    }catch(e){return false;}
  }

  function install(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktSoloHostLiveFixed)return;

    async function fixedStartBroadcast(){
      if(!isSolo())return original.apply(this,arguments);

      var ok=false;
      try{
        if(window.ensureLiveCamera)ok=await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
        else ok=!!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().length);
      }catch(e){ok=false;}
      if(!ok)return;

      var stream=null;
      try{stream=state.stream;}catch(e){}
      if(!stream||!stream.getVideoTracks||!stream.getVideoTracks().length)return;

      var title='1인 방송';
      try{
        var input=document.getElementById('liveTitle');
        title=(input&&input.value&&input.value!=='오늘 라이브 제목을 입력하세요')?input.value:(state.liveRoomName||'1인 방송');
        state.currentLiveRoomTitle=title;
        state.liveRoomType='solo';
        state.liveRoomName='1인 방송';
        state.liveRoomMax=1;
      }catch(e){}

      try{
        var creatorEl=document.getElementById('creator')||window.creator;
        if(creatorEl&&creatorEl.classList)creatorEl.classList.remove('show','live-prep-open');
        document.body.classList.remove('kt-home');
        document.body.classList.add('kt-solo-host-live');
        var bottom=document.querySelector('.bottom');
        var header=document.querySelector('.header');
        if(bottom)bottom.style.setProperty('display','none','important');
        if(header)header.style.setProperty('display','none','important');
      }catch(e){}

      var s=document.getElementById('screen');
      if(!s)return;
      s.style.setProperty('height','100dvh','important');
      s.style.setProperty('min-height','100dvh','important');
      s.style.setProperty('padding','0','important');
      s.style.setProperty('margin','0','important');
      s.style.setProperty('overflow','hidden','important');
      s.style.setProperty('background','#000','important');
      s.innerHTML='<section id="ktSoloHostLive" style="position:relative;width:100%;height:100dvh;overflow:hidden;background:#000;color:#fff">'
        +'<video id="ktLiveVideo" autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;background:#000;transform:scaleX(-1)"></video>'
        +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
        +'<div style="position:absolute;z-index:8;left:12px;right:12px;top:12px;display:flex;align-items:center;gap:9px">'
          +'<span style="padding:9px 13px;border-radius:999px;background:#ff2d55;font-size:13px;font-weight:950;box-shadow:0 0 18px #ff2d5577">● LIVE</span>'
          +'<div style="min-width:0;flex:1;padding:8px 11px;border-radius:14px;background:#08080b99"><b style="display:block;font-size:14px">K-Talk · 1인 방송</b><small style="display:block;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+String(title).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];})+'</small></div>'
          +'<button onclick="ktEndSoloHostLive()" style="width:44px;height:44px;border:0;border-radius:50%;background:#08080bbb;color:#fff;font-size:28px;line-height:1">×</button>'
        +'</div>'
        +'<div style="position:absolute;z-index:8;left:50%;bottom:22px;transform:translateX(-50%);padding:9px 14px;border-radius:999px;background:#08080baa;border:1px solid #ffffff22;font-size:12px;font-weight:850">1인 방송 · 방송 중</div>'
      +'</section>';

      var video=document.getElementById('ktLiveVideo');
      if(video){
        video.srcObject=stream;
        try{var p=video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
      }

      try{if(window.applyBeautyPreview)setTimeout(window.applyBeautyPreview,60);}catch(e){}
      try{if(window.ktSetLivePresence)window.ktSetLivePresence(true);}catch(e){}
    }

    fixedStartBroadcast.__ktSoloHostLiveFixed=true;
    fixedStartBroadcast.__ktSoloHostLiveOriginal=original;
    window.startBroadcast=fixedStartBroadcast;
  }

  window.ktEndSoloHostLive=function(){
    try{if(window.ktSetLivePresence)window.ktSetLivePresence(false);}catch(e){}
    try{
      if(window.state&&state.stream){
        state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
        state.stream=null;
      }
    }catch(e){}
    try{
      document.body.classList.remove('kt-solo-host-live');
      var bottom=document.querySelector('.bottom');
      var header=document.querySelector('.header');
      if(bottom)bottom.style.removeProperty('display');
      if(header)header.style.removeProperty('display');
      var s=document.getElementById('screen');
      if(s){s.style.removeProperty('height');s.style.removeProperty('min-height');s.style.removeProperty('padding');s.style.removeProperty('margin');s.style.removeProperty('overflow');s.style.removeProperty('background');}
    }catch(e){}
    try{if(window.home)window.home();}catch(e){}
  };

  install();
  setTimeout(install,80);
  setTimeout(install,500);
})();
