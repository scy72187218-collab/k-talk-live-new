/* K-Talk 공개 동영상 검은 화면 복구 보강. 공개 피드 재생만 다루고 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktPublicFeedRecoveryInstalled)return;
  window.__ktPublicFeedRecoveryInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktPublicFeedRecoveryStyle'))return;
    var s=document.createElement('style');
    s.id='ktPublicFeedRecoveryStyle';
    s.textContent=''
      +'.kt-public-retry{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;z-index:25!important;min-width:132px!important;padding:11px 16px!important;border:1px solid rgba(255,255,255,.34)!important;border-radius:999px!important;background:rgba(0,0,0,.72)!important;color:#fff!important;font-size:14px!important;font-weight:900!important;box-shadow:0 5px 22px rgba(0,0,0,.4)!important;touch-action:manipulation!important}'
      +'.kt-public-video.kt-video-ready + .kt-public-retry{display:none!important}';
    document.head.appendChild(s);
  }

  function retryButton(v,label){
    var sec=v&&v.closest?v.closest('section'):null;
    if(!sec)return;
    var b=sec.querySelector('.kt-public-retry');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-public-retry';
      sec.appendChild(b);
      b.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        try{v.muted=true;v.setAttribute('playsinline','');v.load();}catch(err){}
        setTimeout(function(){
          try{
            var p=v.play();
            if(p&&p.then)p.then(function(){v.classList.add('kt-video-ready');b.style.display='none';}).catch(function(){});
          }catch(err){}
        },80);
      });
    }
    b.textContent=label||'▶ 동영상 보기';
    b.style.display='block';
  }

  function refreshFeedOnce(){
    try{
      if(sessionStorage.getItem('kt_public_feed_refreshed_once')==='1')return;
      sessionStorage.setItem('kt_public_feed_refreshed_once','1');
      localStorage.removeItem('ktalk_fast_feed');
      setTimeout(function(){try{if(window.home)window.home();}catch(e){}},120);
    }catch(e){}
  }

  function prepare(v){
    if(!v||v.getAttribute('data-kt-feed-recovery')==='1')return;
    v.setAttribute('data-kt-feed-recovery','1');
    try{v.muted=true;v.setAttribute('playsinline','');v.preload='auto';}catch(e){}

    function ready(){
      v.classList.add('kt-video-ready');
      var sec=v.closest?v.closest('section'):null;
      var b=sec&&sec.querySelector?sec.querySelector('.kt-public-retry'):null;
      if(b)b.style.display='none';
    }
    function tryPlay(){
      try{
        var p=v.play();
        if(p&&p.then)p.then(ready).catch(function(){retryButton(v,'▶ 동영상 보기');});
      }catch(e){retryButton(v,'▶ 동영상 보기');}
    }

    v.addEventListener('loadeddata',ready,{passive:true});
    v.addEventListener('canplay',function(){tryPlay();},{passive:true});
    v.addEventListener('playing',ready,{passive:true});
    v.addEventListener('error',function(){
      refreshFeedOnce();
      retryButton(v,'▶ 다시 불러오기');
    },{passive:true});

    try{v.load();}catch(e){}
    setTimeout(tryPlay,120);
    setTimeout(function(){
      try{
        if(v.readyState>=2){tryPlay();return;}
      }catch(e){}
      retryButton(v,'▶ 동영상 보기');
    },3200);
  }

  function scan(){
    ensureStyle();
    document.querySelectorAll('.kt-public-video').forEach(prepare);
  }

  var screen=document.getElementById('screen');
  if(screen){
    try{new MutationObserver(scan).observe(screen,{childList:true,subtree:true});}catch(e){}
  }
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(scan,80);});
  window.addEventListener('pageshow',function(){setTimeout(scan,80);});
  setTimeout(scan,0);
  setTimeout(scan,700);
})();