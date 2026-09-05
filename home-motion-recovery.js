/* K-Talk: make the visible recommendation video use a real K-Talk upload instead of a stuck poster. UI/layout unchanged. */
(function(){
  if(window.__ktHomeMotionRecoveryLoaded)return;
  window.__ktHomeMotionRecoveryLoaded=true;

  var FALLBACK='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
  var forcing=false;

  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var cr=document.getElementById('creator');
    if(cr&&cr.classList.contains('show'))return false;
    return true;
  }

  function getVideo(){
    if(!safe())return null;
    return document.querySelector('.video-home video#homeVideo, .video-home video');
  }

  function start(v){
    if(!v)return;
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

  function forceReal(v){
    if(!v)return;
    try{
      var src=String(v.currentSrc||v.src||'');
      if(src.indexOf('zupwbfmacwzexyvznlzq.supabase.co')===-1){
        v.pause();
        while(v.firstChild)v.removeChild(v.firstChild);
        v.removeAttribute('poster');
        v.src=FALLBACK;
        v.load();
      }else{
        v.removeAttribute('poster');
      }
      start(v);
    }catch(e){}
  }

  function check(){
    if(forcing)return;
    var v=getVideo();
    if(!v)return;
    forcing=true;
    forceReal(v);
    var t=Number(v.currentTime||0);
    setTimeout(function(){
      try{
        var cur=getVideo();
        if(!cur)return;
        if(cur.paused||Number(cur.currentTime||0)<=t+0.05){
          try{cur.currentTime=Math.max(0.05,Number(cur.currentTime||0));}catch(e){}
          forceReal(cur);
        }
      }finally{forcing=false;}
    },700);
  }

  function boot(){
    [30,100,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(check,ms);});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('pageshow',function(){setTimeout(check,30);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(check,30);});
  try{new MutationObserver(function(){setTimeout(check,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
