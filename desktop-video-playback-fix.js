/* K-Talk: 컴퓨터·태블릿(700px 이상) 동영상 재생 안정화. 휴대폰/방송방/보정은 건드리지 않음. */
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

  function visible(v){
    try{
      var r=v.getBoundingClientRect();
      return r.width>0&&r.height>0&&r.bottom>0&&r.top<window.innerHeight;
    }catch(e){return true;}
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

  function reloadVideo(v){
    if(!v)return;
    var retries=parseInt(v.dataset.ktPcRetryCount||'0',10)||0;
    if(retries>=2)return;
    var src='';
    try{src=v.currentSrc||v.getAttribute('src')||'';}catch(e){}
    if(!src)return;
    v.dataset.ktPcRetryCount=String(retries+1);
    try{
      var t=Number(v.currentTime||0);
      v.pause();
      v.removeAttribute('src');
      while(v.firstChild)v.removeChild(v.firstChild);
      v.src=freshUrl(src);
      v.load();
      v.addEventListener('loadedmetadata',function once(){
        v.removeEventListener('loadedmetadata',once);
        try{if(t>0&&isFinite(v.duration))v.currentTime=Math.min(t,Math.max(0,v.duration-.2));}catch(e){}
        tryPlay(v);
      });
      tryPlay(v);
    }catch(e){}
  }

  function recover(v){
    if(!v||!visible(v))return;
    tryPlay(v);
    setTimeout(function(){
      try{
        if(!visible(v)||v.paused||v.ended)return;
        var before=Number(v.dataset.ktPcLastTime||'0');
        var now=Number(v.currentTime||0);
        if(Math.abs(now-before)<0.04)reloadVideo(v);
      }catch(e){}
    },900);
  }

  function fixOne(v){
    if(!v||v.dataset.ktPcFix==='1')return;
    v.dataset.ktPcFix='1';
    v.dataset.ktPcLastTime=String(Number(v.currentTime||0));
    v.dataset.ktPcStillCount='0';
    tryPlay(v);

    ['loadedmetadata','loadeddata','canplay','canplaythrough'].forEach(function(name){
      v.addEventListener(name,function(){tryPlay(v);});
    });
    ['waiting','stalled','suspend'].forEach(function(name){
      v.addEventListener(name,function(){setTimeout(function(){recover(v);},250);});
    });
    v.addEventListener('error',function(){setTimeout(function(){reloadVideo(v);},150);});
  }

  function scan(){
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo,.video-home video').forEach(fixOne);
    }catch(e){}
  }

  function watchdog(){
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo,.video-home video').forEach(function(v){
        fixOne(v);
        if(!visible(v)||v.paused||v.ended)return;
        var now=Number(v.currentTime||0);
        var last=Number(v.dataset.ktPcLastTime||'0');
        var still=parseInt(v.dataset.ktPcStillCount||'0',10)||0;
        if(Math.abs(now-last)<0.04)still++;else still=0;
        v.dataset.ktPcStillCount=String(still);
        v.dataset.ktPcLastTime=String(now);
        if(still>=2){
          v.dataset.ktPcStillCount='0';
          recover(v);
        }
      });
    }catch(e){}
  }

  /* 컴퓨터·태블릿에서 오래된 공개 목록 캐시를 한 번 비워 최신 목록을 다시 받게 한다. */
  try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}

  var oldHome=window.home;
  if(typeof oldHome==='function'&&!oldHome.__ktPcVideoFresh){
    var wrapped=function(){
      try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
      var r=oldHome.apply(this,arguments);
      setTimeout(scan,80);
      setTimeout(scan,500);
      return r;
    };
    wrapped.__ktPcVideoFresh=true;
    window.home=wrapped;
  }

  var ob=new MutationObserver(function(){scan();});
  try{ob.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('focus',function(){setTimeout(scan,80);});
  window.addEventListener('pageshow',function(){setTimeout(scan,80);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(scan,80);});

  setInterval(watchdog,1000);
  setTimeout(scan,80);
  setTimeout(scan,500);
})();
