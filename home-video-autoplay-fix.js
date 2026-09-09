/* K-Talk 첫 동영상 자동 재생 보강. 영상은 자동으로 움직이고, 첫 터치에서는 소리만 켠다. */
(function(){
  if(window.__ktHomeVideoAutoplayFixInstalled)return;
  window.__ktHomeVideoAutoplayFixInstalled=true;

  function tryPlay(v){
    if(!v||!v.play)return;
    try{
      v.setAttribute('playsinline','');
      v.autoplay=true;
      v.loop=true;
      if(v.paused){
        v.muted=true;
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function prepare(v){
    if(!v||v.__ktAutoPrepared)return;
    v.__ktAutoPrepared=true;
    v.muted=true;
    v.defaultMuted=true;
    v.autoplay=true;
    v.loop=true;
    v.setAttribute('autoplay','');
    v.setAttribute('muted','');
    v.setAttribute('playsinline','');
    v.addEventListener('loadeddata',function(){tryPlay(v);});
    v.addEventListener('canplay',function(){tryPlay(v);});
    setTimeout(function(){tryPlay(v);},30);
    setTimeout(function(){tryPlay(v);},250);
    setTimeout(function(){tryPlay(v);},900);
  }

  function scan(){
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo').forEach(prepare);
      var first=document.querySelector('.kt-public-video,#homeVideo');
      if(first)tryPlay(first);
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var v=e.target&&e.target.closest?e.target.closest('.kt-public-video,#homeVideo'):null;
    if(!v)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try{
      if(v.muted){
        v.muted=false;
        v.defaultMuted=false;
        v.volume=1;
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
        return;
      }
      if(v.paused){
        var p2=v.play();
        if(p2&&p2.catch)p2.catch(function(){});
      }else{
        v.pause();
      }
    }catch(err){}
  },true);

  if('MutationObserver' in window){
    var mo=new MutationObserver(function(){scan();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(scan,80);
  });
  window.addEventListener('pageshow',function(){setTimeout(scan,80);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);
  else scan();
})();
