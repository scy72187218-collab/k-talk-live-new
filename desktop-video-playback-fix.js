/* K-Talk: 컴퓨터(700px 이상) 공개 동영상 검은 화면 재생 보강. 휴대폰/방송방/보정은 건드리지 않음. */
(function(){
  if(window.__ktDesktopVideoPlaybackFixInstalled)return;
  window.__ktDesktopVideoPlaybackFixInstalled=true;
  if(window.innerWidth<700)return;

  function freshUrl(src){
    if(!src)return src;
    try{
      var u=new URL(src,location.href);
      u.searchParams.set('ktpc',String(Date.now()));
      return u.toString();
    }catch(e){
      return src+(src.indexOf('?')>-1?'&':'?')+'ktpc='+Date.now();
    }
  }

  function tryPlay(v){
    if(!v)return;
    try{
      v.muted=true;
      v.autoplay=true;
      v.preload='auto';
      v.setAttribute('playsinline','');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function fixOne(v){
    if(!v||v.dataset.ktPcFix==='1')return;
    v.dataset.ktPcFix='1';
    tryPlay(v);
    v.addEventListener('loadedmetadata',function(){tryPlay(v);});
    v.addEventListener('loadeddata',function(){tryPlay(v);});
    v.addEventListener('canplay',function(){tryPlay(v);});

    setTimeout(function(){
      try{
        if(v.readyState>=2)return;
        var src=v.currentSrc||v.getAttribute('src')||'';
        if(!src||v.dataset.ktPcRetried==='1')return;
        v.dataset.ktPcRetried='1';
        v.pause();
        v.src=freshUrl(src);
        v.load();
        tryPlay(v);
      }catch(e){}
    },1800);
  }

  function scan(){
    try{document.querySelectorAll('.kt-public-video').forEach(fixOne);}catch(e){}
  }

  /* 컴퓨터에서는 오래된 공개 목록 캐시를 한 번 비워 최신 목록을 다시 받게 한다. */
  try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}

  var oldHome=window.home;
  if(typeof oldHome==='function'&&!oldHome.__ktPcVideoFresh){
    var wrapped=function(){
      try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
      var r=oldHome.apply(this,arguments);
      setTimeout(scan,120);
      setTimeout(scan,700);
      return r;
    };
    wrapped.__ktPcVideoFresh=true;
    window.home=wrapped;
  }

  var ob=new MutationObserver(function(){scan();});
  try{ob.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('focus',function(){setTimeout(scan,80);});
  window.addEventListener('pageshow',function(){setTimeout(scan,80);});
  setTimeout(scan,100);
  setTimeout(scan,700);
})();
