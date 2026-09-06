/* K-Talk HOME: sound only. Do not change layout, swipe, LIVE, camera or chat. */
(function(){
  if(window.__ktHomeSoundOnlyFixLoaded)return;
  window.__ktHomeSoundOnlyFixLoaded=true;

  var KEY='kt_home_sound_enabled';
  function currentVideo(){
    var f=document.getElementById('ktUnifiedFeed');
    if(!f)return null;
    var cards=[].slice.call(f.querySelectorAll('.kt-feed-card'));
    if(!cards.length)return f.querySelector('video.kt-public-video');
    var top=f.getBoundingClientRect().top,best=null,dist=Infinity;
    cards.forEach(function(c){
      var v=c.querySelector('video.kt-public-video');
      if(!v)return;
      var d=Math.abs(c.getBoundingClientRect().top-top);
      if(d<dist){dist=d;best=v;}
    });
    return best;
  }
  function enable(v){
    if(!v)return;
    try{
      localStorage.setItem(KEY,'1');
      v.muted=false;
      v.defaultMuted=false;
      v.volume=1;
      v.removeAttribute('muted');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }
  function unlock(){enable(currentVideo());}

  /* A real user gesture is required by mobile browsers for audio. Use the same swipe/tap the user already makes; no sound button. */
  document.addEventListener('pointerdown',unlock,true);
  document.addEventListener('touchstart',unlock,{capture:true,passive:true});
  document.addEventListener('click',unlock,true);

  /* After a swipe, keep sound on for the newly visible video. */
  document.addEventListener('scroll',function(e){
    var t=e.target;
    if(!t||t.id!=='ktUnifiedFeed')return;
    clearTimeout(window.__ktHomeSoundScrollTimer);
    window.__ktHomeSoundScrollTimer=setTimeout(function(){enable(currentVideo());},90);
  },true);

  /* If the final feed re-renders, reapply sound to the visible video without changing anything else. */
  try{
    new MutationObserver(function(){
      if(localStorage.getItem(KEY)==='1')setTimeout(function(){enable(currentVideo());},60);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
