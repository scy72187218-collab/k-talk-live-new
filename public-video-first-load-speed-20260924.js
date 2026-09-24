/* K-Talk first public video fast-load transport only (2026-09-24)
   - Starts network warm-up for the cached first public video immediately after app.js.
   - Reuses posted-feed's existing warm-video IDs so no second decoder/video is created.
   - Does not change room UI, buttons, layout, badges, directions, chat or guest approval. */
(function(){
  if(window.__ktPublicVideoFirstLoadSpeed20260924)return;
  window.__ktPublicVideoFirstLoadSpeed20260924=true;

  var FALLBACK='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1789858184221-0lyob9.mp4';

  function firstUrl(){
    try{
      var a=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(Array.isArray(a)&&a[0]&&a[0].video_url)return String(a[0].video_url);
    }catch(e){}
    return FALLBACK;
  }

  function addHint(id,rel,href,as){
    try{
      if(document.getElementById(id))return;
      var l=document.createElement('link');
      l.id=id;l.rel=rel;l.href=href;
      if(as)l.as=as;
      if(rel==='preconnect')l.crossOrigin='anonymous';
      if(rel==='preload'){
        try{l.fetchPriority='high';}catch(e){}
        l.setAttribute('fetchpriority','high');
      }
      document.head.appendChild(l);
    }catch(e){}
  }

  function tuneFirst(v){
    if(!v)return;
    try{
      v.preload='auto';
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      v.playsInline=true;
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.setAttribute('fetchpriority','high');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function prime(){
    try{
      var url=firstUrl();
      if(!url)return;
      addHint('ktVideoStoragePreconnect','preconnect','https://zupwbfmacwzexyvznlzq.supabase.co');
      addHint('ktVideoStorageDnsPrefetch','dns-prefetch','https://zupwbfmacwzexyvznlzq.supabase.co');
      addHint('ktVideoFirstPreload','preload',url,'video');

      var first=document.querySelector('#screen .kt-public-video,#screen #homeVideo');
      if(first){tuneFirst(first);return;}

      if(document.getElementById('ktVideoFirstWarm'))return;
      var v=document.createElement('video');
      v.id='ktVideoFirstWarm';
      v.muted=true;v.defaultMuted=true;v.volume=0;
      v.playsInline=true;v.preload='auto';v.src=url;
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.setAttribute('muted','');
      v.setAttribute('fetchpriority','high');
      v.style.cssText='position:fixed;width:2px;height:2px;left:-20px;top:-20px;opacity:.001;pointer-events:none;z-index:-1';
      (document.body||document.documentElement).appendChild(v);
      try{v.load();}catch(e){}
    }catch(e){}
  }

  function firstAppeared(){
    try{
      var v=document.querySelector('#screen .kt-public-video,#screen #homeVideo');
      if(v)tuneFirst(v);
      else prime();
    }catch(e){}
  }

  prime();

  try{
    var screen=document.getElementById('screen');
    if(screen&&window.MutationObserver){
      new MutationObserver(function(){
        clearTimeout(window.__ktFirstVideoFastLoadTimer20260924);
        window.__ktFirstVideoFastLoadTimer20260924=setTimeout(firstAppeared,0);
      }).observe(screen,{childList:true,subtree:true});
    }
  }catch(e){}

  window.addEventListener('pageshow',function(){setTimeout(firstAppeared,0);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(firstAppeared,0);
  });
})();