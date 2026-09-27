/* K-Talk 구형폰 동영상 호환 보정
   네트워크/통신 경로는 건드리지 않고 재생 요소만 보정한다. */
(function(){
  if(window.__ktOldPhoneVideoCompat)return;
  window.__ktOldPhoneVideoCompat=true;

  function tune(v){
    if(!v||v.dataset.ktOldCompat==='1')return;
    v.dataset.ktOldCompat='1';
    try{
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.setAttribute('x5-playsinline','');
      v.setAttribute('preload','auto');
      v.disablePictureInPicture=true;
    }catch(e){}

    var retried=false;
    function alreadyStarted(){
      try{
        return v.dataset.ktPlaybackStarted20260927==='1' || Number(v.currentTime||0)>.03;
      }catch(e){return false;}
    }
    function retryVideo(){
      if(retried)return;
      /* Never pause/load a public video after playback has started.
         Android reloads the decoder/network request and creates the visible cut. */
      if(alreadyStarted()){
        try{var keep=v.play();if(keep&&keep.catch)keep.catch(function(){});}catch(e){}
        return;
      }
      retried=true;
      try{
        var wasMuted=v.muted;
        v.load();
        setTimeout(function(){
          try{
            v.muted=wasMuted;
            var p=v.play();
            if(p&&p.catch)p.catch(function(){});
          }catch(e){}
        },180);
      }catch(e){}
    }

    function verify(){
      try{
        if(alreadyStarted())return;
        /* Initial black screen: allow ONE same-source load before playback
           actually begins. Once playing has started, retryVideo() is blocked. */
        if(v.readyState<2 || !v.videoWidth || !v.videoHeight){
          retryVideo();
        }
      }catch(e){}
    }

    v.addEventListener('loadedmetadata',function(){setTimeout(verify,160);});
    v.addEventListener('loadeddata',function(){setTimeout(verify,120);});
    v.addEventListener('canplay',function(){setTimeout(verify,120);});
    v.addEventListener('playing',function(){
      try{v.dataset.ktPlaybackStarted20260927='1';}catch(e){}
    });
    v.addEventListener('timeupdate',function(){
      try{if(Number(v.currentTime||0)>.03)v.dataset.ktPlaybackStarted20260927='1';}catch(e){}
    });
    v.addEventListener('error',function(){retryVideo();});

    setTimeout(verify,900);
    setTimeout(verify,1800);
  }

  function scan(){
    try{
      document.querySelectorAll('#screen .kt-public-video,#screen .kt-hard-public-video').forEach(tune);
    }catch(e){}
  }

  scan();
  [150,450,900,1800].forEach(function(ms){setTimeout(scan,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktOldPhoneVideoCompatTimer);
      window.__ktOldPhoneVideoCompatTimer=setTimeout(scan,80);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();