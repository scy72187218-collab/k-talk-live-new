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
    function retryVideo(){
      if(retried)return;
      retried=true;
      try{
        var wasMuted=v.muted;
        v.pause();
        v.load();
        setTimeout(function(){
          try{
            if(v.readyState>=1 && isFinite(v.duration) && v.duration>0){
              try{v.currentTime=Math.min(.08,Math.max(0,v.duration-.1));}catch(e){}
            }
            v.muted=wasMuted;
            var p=v.play();
            if(p&&p.catch)p.catch(function(){});
          }catch(e){}
        },180);
      }catch(e){}
    }

    function verify(){
      try{
        if(v.readyState>=2 && (!v.videoWidth || !v.videoHeight)){
          retryVideo();
          setTimeout(function(){
            try{
              if(v.readyState>=2 && (!v.videoWidth || !v.videoHeight)){
                var card=v.closest('section');
                var next=card&&card.nextElementSibling;
                if(next){
                  var nv=next.querySelector('video');
                  if(nv){
                    try{v.pause();}catch(e){}
                    try{next.scrollIntoView({block:'start'});}catch(e){}
                    setTimeout(function(){
                      try{
                        nv.muted=true;
                        var p=nv.play();
                        if(p&&p.catch)p.catch(function(){});
                      }catch(e){}
                    },160);
                  }
                }
              }
            }catch(e){}
          },900);
        }
      }catch(e){}
    }

    v.addEventListener('loadedmetadata',function(){setTimeout(verify,160);});
    v.addEventListener('loadeddata',function(){setTimeout(verify,120);});
    v.addEventListener('canplay',function(){setTimeout(verify,120);});
    v.addEventListener('playing',function(){setTimeout(verify,350);});
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