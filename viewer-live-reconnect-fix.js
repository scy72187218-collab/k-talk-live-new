/* K-Talk LIVE: stable viewer playback with no visible sound button.
   Start video safely, try sound once, and if the browser blocks it unlock on one normal tap only. */
(function(){
  if(window.__ktViewerLiveReconnectFixLoaded)return;
  window.__ktViewerLiveReconnectFixLoaded=true;

  var lastArgs=null;
  var retryCount=0;
  var installed=false;
  var internalRetry=false;
  var unlockArmed=false;
  var unlockVideo=null;
  var SOUND_KEY='kt_remote_sound_enabled';

  function hideSoundButton(){
    var b=document.getElementById('ktRemoteSoundBtn');
    if(b)b.style.setProperty('display','none','important');
  }

  function rememberSound(){
    try{localStorage.setItem(SOUND_KEY,'1');}catch(e){}
  }
  function soundRemembered(){
    try{return localStorage.getItem(SOUND_KEY)==='1';}catch(e){return false;}
  }

  function status(t,bad){
    var s=document.getElementById('ktRemoteLiveStatus');
    if(!s)return;
    s.style.display='block';
    s.textContent=t;
    s.style.color=bad?'#ff9aae':'#fff';
  }

  function disarmUnlock(){
    if(!unlockArmed)return;
    unlockArmed=false;
    document.removeEventListener('click',unlockSound,true);
    document.removeEventListener('touchend',unlockSound,true);
  }

  function unlockSound(){
    var v=unlockVideo||document.getElementById('ktRemoteLive');
    disarmUnlock();
    if(!v)return;
    try{
      v.muted=false;
      v.defaultMuted=false;
      v.removeAttribute('muted');
      v.volume=1;
      v.dataset.ktSoundOn='1';
      rememberSound();
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function armUnlock(v){
    unlockVideo=v||unlockVideo;
    if(unlockArmed)return;
    unlockArmed=true;
    document.addEventListener('click',unlockSound,true);
    document.addEventListener('touchend',unlockSound,true);
  }

  function safeMutedPlay(v){
    if(!v)return;
    try{
      if(v.dataset.ktSoundOn!=='1'){
        v.muted=true;
        v.defaultMuted=true;
        v.setAttribute('muted','');
      }
      if(v.paused){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function tryAutoSoundOnce(v){
    if(!v||v.dataset.ktAutoSoundTried==='1')return;
    v.dataset.ktAutoSoundTried='1';
    try{
      v.muted=false;
      v.defaultMuted=false;
      v.removeAttribute('muted');
      v.volume=1;
      var p=v.play();
      if(p&&p.then){
        p.then(function(){v.dataset.ktSoundOn='1';rememberSound();disarmUnlock();}).catch(function(){
          try{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');}catch(e){}
          safeMutedPlay(v);
          armUnlock(v);
        });
      }else{
        v.dataset.ktSoundOn='1';rememberSound();
      }
    }catch(e){
      safeMutedPlay(v);
      armUnlock(v);
    }
  }

  function prepareVideo(){
    hideSoundButton();
    var v=document.getElementById('ktRemoteLive');
    if(!v)return null;
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    if(!v.dataset.ktViewerAutoplayFix){
      v.dataset.ktViewerAutoplayFix='1';
      v.muted=true;
      v.defaultMuted=true;
      v.setAttribute('muted','');
      safeMutedPlay(v);
      setTimeout(function(){tryAutoSoundOnce(v);},80);
    }else if(soundRemembered()&&v.dataset.ktSoundOn!=='1'&&v.dataset.ktAutoSoundTried!=='1'){
      tryAutoSoundOnce(v);
    }
    return v;
  }

  function hasLiveVideoTrack(v){
    try{
      var st=v&&v.srcObject;
      return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function forceSafePlay(){
    var v=prepareVideo();
    if(!v||!hasLiveVideoTrack(v))return false;
    if(v.dataset.ktSoundOn==='1'){
      if(v.paused){try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
    }else{
      safeMutedPlay(v);
    }
    if(v.readyState>=2){
      var s=document.getElementById('ktRemoteLiveStatus');
      if(s)s.style.display='none';
      return true;
    }
    return false;
  }

  function scheduleChecks(){
    var start=Date.now();
    var timer=setInterval(function(){
      var v=document.getElementById('ktRemoteLive');
      if(!v){clearInterval(timer);return;}
      if(forceSafePlay()){clearInterval(timer);return;}
      if(Date.now()-start>7000){
        clearInterval(timer);
        if(lastArgs&&retryCount<1&&typeof window.ktJoinLive==='function'){
          retryCount++;
          status('방송 다시 연결 중...');
          setTimeout(function(){
            internalRetry=true;
            try{
              var r=window.ktJoinLive.apply(window,lastArgs);
              if(r&&r.finally)r.finally(function(){internalRetry=false;});
              else internalRetry=false;
            }catch(e){internalRetry=false;}
          },300);
        }else{
          status('방송 연결을 다시 시도해 주세요.',true);
        }
      }
    },250);
  }

  function installJoinWrapper(){
    if(installed)return true;
    var fn=window.ktJoinLive;
    if(typeof fn!=='function')return false;
    if(fn.__ktViewerReconnectWrapped){installed=true;return true;}
    var base=fn;
    var wrapped=async function(hostId,title,roomName){
      lastArgs=[hostId,title,roomName];
      if(!internalRetry)retryCount=0;
      disarmUnlock();
      unlockVideo=null;
      hideSoundButton();
      var out=await base.apply(this,arguments);
      setTimeout(function(){prepareVideo();scheduleChecks();},80);
      return out;
    };
    wrapped.__ktViewerReconnectWrapped=true;
    wrapped.__ktViewerReconnectBase=base;
    window.ktJoinLive=wrapped;
    installed=true;
    return true;
  }

  var installTimer=setInterval(function(){if(installJoinWrapper())clearInterval(installTimer);},150);
  setTimeout(function(){clearInterval(installTimer);installJoinWrapper();},6000);

  /* Light periodic safety check only. No repeated unmuted autoplay attempts. */
  setInterval(function(){
    hideSoundButton();
    var v=document.getElementById('ktRemoteLive');
    if(v)forceSafePlay();
    else{disarmUnlock();unlockVideo=null;}
  },1200);

  window.addEventListener('pagehide',function(){disarmUnlock();unlockVideo=null;});
})();
