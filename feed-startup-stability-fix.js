/* K-Talk: make the real public feed appear on first open and keep old PCs from loading every video at once. */
(function(){
  if(window.__ktFeedStartupStabilityLoaded)return;
  window.__ktFeedStartupStabilityLoaded=true;

  var started=false;
  var refreshTried=false;
  var lazyObserver=null;
  var cleanupTimers=new WeakMap();

  function safeToRefresh(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    try{
      var cr=document.getElementById('creator');
      if(cr&&cr.classList.contains('show'))return false;
    }catch(e){}
    return true;
  }

  function restoreVideo(v){
    if(!v)return;
    var src=v.getAttribute('data-kt-lazy-src')||'';
    if(src&&!v.getAttribute('src')){
      v.setAttribute('src',src);
      v.setAttribute('preload','metadata');
      try{v.load();}catch(e){}
    }
  }

  function releaseVideo(v){
    if(!v||!v.getAttribute('src'))return;
    try{v.pause();}catch(e){}
    var src=v.getAttribute('src')||'';
    if(src&&!v.getAttribute('data-kt-lazy-src'))v.setAttribute('data-kt-lazy-src',src);
    v.setAttribute('preload','none');
    v.removeAttribute('src');
    try{v.load();}catch(e){}
  }

  function optimizeFeed(){
    var feed=document.getElementById('ktUnifiedFeed');
    if(!feed)return;
    var videos=[].slice.call(feed.querySelectorAll('video.kt-public-video'));
    if(!videos.length)return;

    if(lazyObserver){try{lazyObserver.disconnect();}catch(e){}}
    if('IntersectionObserver' in window){
      lazyObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var v=entry.target;
          var old=cleanupTimers.get(v);if(old)clearTimeout(old);
          if(entry.isIntersecting){
            restoreVideo(v);
            try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
          }else{
            var t=setTimeout(function(){releaseVideo(v);},1200);
            cleanupTimers.set(v,t);
          }
        });
      },{root:feed,rootMargin:'120% 0px 120% 0px',threshold:0});
    }

    videos.forEach(function(v,i){
      var src=v.getAttribute('src')||v.getAttribute('data-kt-lazy-src')||'';
      if(src&&!v.getAttribute('data-kt-lazy-src'))v.setAttribute('data-kt-lazy-src',src);
      if(i===0){
        restoreVideo(v);
        v.setAttribute('preload','auto');
      }else{
        v.setAttribute('preload','none');
      }
      if(lazyObserver)lazyObserver.observe(v);
    });

    if(videos.length>3){
      videos.slice(3).forEach(function(v){releaseVideo(v);});
    }
  }

  function showRealFeedOnce(){
    if(refreshTried||!safeToRefresh())return;
    if(document.getElementById('ktUnifiedFeed')){optimizeFeed();return;}
    var fallback=document.querySelector('.video-home');
    if(!fallback)return;
    if(typeof window.ktRefreshUnifiedFeed!=='function')return;
    refreshTried=true;
    try{
      var p=window.ktRefreshUnifiedFeed();
      if(p&&p.then)p.then(function(){setTimeout(optimizeFeed,40);}).catch(function(){});
      else setTimeout(optimizeFeed,120);
    }catch(e){}
  }

  function boot(){
    if(started)return;started=true;
    setTimeout(showRealFeedOnce,120);
    setTimeout(showRealFeedOnce,500);
    setTimeout(showRealFeedOnce,1200);
    setTimeout(optimizeFeed,1600);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  try{
    new MutationObserver(function(){
      if(document.getElementById('ktUnifiedFeed'))setTimeout(optimizeFeed,30);
      else if(!refreshTried)setTimeout(showRealFeedOnce,60);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
