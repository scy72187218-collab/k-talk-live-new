/* K-Talk: direct-address home video recovery. Removes the old road poster and starts a real K-Talk upload. */
(function(){
  if(window.__ktHomeDirectStartFixLoaded)return;
  window.__ktHomeDirectStartFixLoaded=true;

  var SOURCES=[
    'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4',
    'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516656323-4elqcf.mp4'
  ];

  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var cr=document.getElementById('creator');
    if(cr&&cr.classList.contains('show'))return false;
    return true;
  }

  function start(v){
    if(!v)return;
    try{
      v.removeAttribute('poster');
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      v.autoplay=true;
      v.loop=true;
      v.preload='auto';
      v.setAttribute('muted','');
      v.setAttribute('autoplay','');
      v.setAttribute('loop','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function forceLegacy(v){
    if(!v)return;
    try{
      var src=String(v.getAttribute('src')||v.currentSrc||'');
      if(src.indexOf('zupwbfmacwzexyvznlzq.supabase.co')===-1){
        while(v.firstChild)v.removeChild(v.firstChild);
        v.removeAttribute('poster');
        v.src=SOURCES[0];
        v.dataset.ktDirectSource='0';
        v.load();
      }
      if(!v.dataset.ktDirectErrorBound){
        v.dataset.ktDirectErrorBound='1';
        v.addEventListener('error',function(){
          try{
            var i=Number(v.dataset.ktDirectSource||0)+1;
            if(i<SOURCES.length){
              v.dataset.ktDirectSource=String(i);
              v.src=SOURCES[i];
              v.load();
              start(v);
            }
          }catch(e){}
        });
        v.addEventListener('loadeddata',function(){start(v);});
        v.addEventListener('canplay',function(){start(v);});
      }
      start(v);
    }catch(e){}
  }

  function repair(){
    if(!safe())return;

    var feed=document.getElementById('ktUnifiedFeed');
    if(feed){
      var first=feed.querySelector('video.kt-public-video, video');
      if(first){
        try{first.preload='auto';}catch(e){}
        start(first);
      }
      return;
    }

    var legacy=document.querySelector('.video-home video#homeVideo, .video-home video');
    if(legacy)forceLegacy(legacy);
  }

  function boot(){
    [0,40,120,300,700,1200,2000,3500,5500,8000].forEach(function(ms){setTimeout(repair,ms);});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.addEventListener('pageshow',function(){setTimeout(repair,20);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(repair,20);});
  document.addEventListener('pointerdown',function(){
    if(!safe())return;
    var v=document.querySelector('#ktUnifiedFeed video.kt-public-video, .video-home video');
    if(v&&v.paused)start(v);
  },true);
  try{new MutationObserver(function(){setTimeout(repair,20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
