/* K-Talk: hard recovery for a recommendation screen stuck on its poster. UI/layout unchanged. */
(function(){
  if(window.__ktHomeMotionRecoveryLoaded)return;
  window.__ktHomeMotionRecoveryLoaded=true;

  var FALLBACK='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
  var lastVideo=null;
  var checking=false;

  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var cr=document.getElementById('creator');
    if(cr&&cr.classList.contains('show'))return false;
    return true;
  }

  function getVideo(){
    if(!safe()||document.getElementById('ktUnifiedFeed'))return null;
    return document.querySelector('.video-home video#homeVideo, .video-home video');
  }

  function play(v){
    if(!v)return;
    lastVideo=v;
    try{
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

  function forceRealSource(v){
    if(!v||v.dataset.ktRealSourceForced==='1')return;
    v.dataset.ktRealSourceForced='1';
    try{
      v.pause();
      while(v.firstChild)v.removeChild(v.firstChild);
      v.removeAttribute('poster');
      v.src=FALLBACK;
      v.load();
      play(v);
      v.addEventListener('loadeddata',function(){play(v);},{once:true});
      v.addEventListener('canplay',function(){play(v);},{once:true});
    }catch(e){}
  }

  function check(){
    if(checking)return;
    var v=getVideo();
    if(!v)return;
    checking=true;
    play(v);
    var t=Number(v.currentTime||0);
    setTimeout(function(){
      try{
        var cur=getVideo();
        if(!cur)return;
        var moved=!cur.paused&&Number(cur.currentTime||0)>t+0.12;
        if(!moved)forceRealSource(cur);
      }finally{checking=false;}
    },650);
  }

  function boot(){
    [80,250,600,1100,1800,3000].forEach(function(ms){setTimeout(check,ms);});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.addEventListener('pageshow',function(){setTimeout(check,80);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(check,80);});
  try{new MutationObserver(function(){setTimeout(check,60);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
