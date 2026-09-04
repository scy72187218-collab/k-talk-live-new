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

    /* Host on a computer. 13-person/subscriber rooms keep their TikTok-style host + invite grid. */
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
