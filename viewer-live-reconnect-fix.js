/* K-Talk LIVE: make viewer video appear reliably on mobile browsers. Starts remote video muted first, then lets the viewer enable sound, and retries once if no frames arrive. */
(function(){
  if(window.__ktViewerLiveReconnectFixLoaded)return;
  window.__ktViewerLiveReconnectFixLoaded=true;

  var lastArgs=null;
  var retryCount=0;
  var installed=false;

  function status(t,bad){
    var s=document.getElementById('ktRemoteLiveStatus');
    if(!s)return;
    s.style.display='block';
    s.textContent=t;
    s.style.color=bad?'#ff9aae':'#fff';
  }

  function prepareVideo(){
    var v=document.getElementById('ktRemoteLive');
    if(!v)return;
    if(!v.dataset.ktViewerAutoplayFix){
      v.dataset.ktViewerAutoplayFix='1';
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.muted=true;
      v.defaultMuted=true;
      v.setAttribute('muted','');

      var b=document.getElementById('ktRemoteSoundBtn');
      if(b&&!b.dataset.ktViewerSoundFix){
        b.dataset.ktViewerSoundFix='1';
        b.style.display='block';
        b.textContent='🔊 소리 켜기';
        b.addEventListener('click',function(){
          try{
            v.dataset.ktSoundOn='1';
            v.muted=false;
            v.defaultMuted=false;
            v.removeAttribute('muted');
            v.volume=1;
            var p=v.play();if(p&&p.catch)p.catch(function(){});
            b.style.display='none';
          }catch(e){}
        },true);
      }
    }
  }

  function forceMutedPlay(){
    var v=document.getElementById('ktRemoteLive');
    if(!v)return false;
    prepareVideo();
    var hasTrack=false;
    try{
      var st=v.srcObject;
      hasTrack=!!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){}
    if(!hasTrack)return false;
    if(v.dataset.ktSoundOn!=='1'){
      try{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');}catch(e){}
    }
    try{
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
    if(v.readyState>=2){
      var s=document.getElementById('ktRemoteLiveStatus');if(s)s.style.display='none';
      var b=document.getElementById('ktRemoteSoundBtn');if(b&&v.dataset.ktSoundOn!=='1')b.style.display='block';
      return true;
    }
    return false;
  }

  function scheduleChecks(){
    var start=Date.now();
    var timer=setInterval(function(){
      var v=document.getElementById('ktRemoteLive');
      if(!v){clearInterval(timer);return;}
      if(forceMutedPlay()){clearInterval(timer);return;}
      var age=Date.now()-start;
      if(age>6500){
        clearInterval(timer);
        if(lastArgs&&retryCount<1&&typeof window.ktJoinLive==='function'){
          retryCount++;
          status('방송 다시 연결 중...');
          setTimeout(function(){
            try{window.ktJoinLive.apply(window,lastArgs);}catch(e){}
          },250);
        }else{
          status('방송 연결을 다시 시도해 주세요.',true);
        }
      }
    },180);
  }

  function installJoinWrapper(){
    if(installed)return true;
    var fn=window.ktJoinLive;
    if(typeof fn!=='function')return false;
    if(fn.__ktViewerReconnectWrapped){installed=true;return true;}
    var base=fn;
    var wrapped=async function(hostId,title,roomName){
      lastArgs=[hostId,title,roomName];
      retryCount=0;
      var out;
      try{out=await base.apply(this,arguments);}catch(e){throw e;}
      setTimeout(function(){prepareVideo();scheduleChecks();},40);
      return out;
    };
    wrapped.__ktViewerReconnectWrapped=true;
    wrapped.__ktViewerReconnectBase=base;
    window.ktJoinLive=wrapped;
    installed=true;
    return true;
  }

  var installTimer=setInterval(function(){if(installJoinWrapper())clearInterval(installTimer);},120);
  setTimeout(function(){clearInterval(installTimer);installJoinWrapper();},6000);

  setInterval(function(){
    if(document.getElementById('ktRemoteLive'))forceMutedPlay();
  },400);

  try{new MutationObserver(function(){setTimeout(function(){installJoinWrapper();prepareVideo();},20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
