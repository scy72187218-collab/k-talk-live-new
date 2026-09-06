/* K-Talk: keep approved room layouts untouched; remove legacy road placeholder from home. */
(function(){
  window.__ktCameraRecoveryLoaded=true;
  window.__ktManualLiveEntryOnly=true;

  var HOME_VIDEO='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';

  function inLiveOrCreator(){
    if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return true;
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show'));
  }

  function killRoad(){
    try{
      if(inLiveOrCreator())return;
      var v=document.querySelector('.video-home video#homeVideo,.video-home video');
      if(!v)return;
      var poster=String(v.getAttribute('poster')||'');
      var src=String(v.getAttribute('src')||v.currentSrc||'');
      var legacy=poster.indexOf('images.unsplash.com')>-1||src.indexOf('interactive-examples.mdn.mozilla.net')>-1||!!v.querySelector('source[src*="interactive-examples.mdn.mozilla.net"]');
      if(!legacy)return;
      try{v.pause();}catch(e){}
      while(v.firstChild)v.removeChild(v.firstChild);
      v.removeAttribute('poster');
      v.src=HOME_VIDEO;
      v.preload='auto';
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      v.autoplay=true;
      v.loop=true;
      v.setAttribute('muted','');
      v.setAttribute('autoplay','');
      v.setAttribute('loop','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      try{v.load();}catch(e){}
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }catch(e){}
  }

  function openRealFeed(){
    try{
      if(inLiveOrCreator())return;
      killRoad();
      if(typeof window.ktRefreshUnifiedFeed==='function'){
        var r=window.ktRefreshUnifiedFeed();
        if(r&&typeof r.catch==='function')r.catch(function(){});
      }
    }catch(e){}
  }

  /* feed-home-fix.js is already loaded before this file. Run it, but never leave the road placeholder visible while waiting. */
  [0,30,90,180,350,700,1200,2200,4000].forEach(function(ms){
    setTimeout(function(){killRoad();openRealFeed();},ms);
  });

  try{
    var screen=document.getElementById('screen');
    if(screen){
      new MutationObserver(function(){
        if(inLiveOrCreator())return;
        setTimeout(killRoad,0);
      }).observe(screen,{childList:true,subtree:true});
    }
  }catch(e){}

  /* Preserve existing broadcast-related loaders only. */
  function add(key,src){
    var attr='data-'+key;
    if(document.querySelector('script['+attr+']'))return;
    var s=document.createElement('script');
    s.src=src;
    s.defer=true;
    s.setAttribute(attr,'1');
    document.head.appendChild(s);
  }
  add('kt-live-bottom-tools','live-bottom-tiktok.js?v=20260905-bottom01');
  add('kt-group13-layout','group13-reference-layout.js?v=20260905-group13-08');
  add('kt-password-layout','password-room-reference-layout.js?v=20260905-password01');
  add('kt-password-host-cover','password-host-cover-fix.js?v=20260905-password-host04');
  add('kt-live-home-indicator','live-home-indicator.js?v=20260905-livehome03');
  add('kt-live-host-thumbnail','live-host-thumbnail.js?v=20260905-hostthumb01');
  add('kt-playable-sounds','sound-playable-original.js?v=20260905-vocal02');
  add('kt-home-sound-only','home-sound-only-fix.js?v=20260906-soundonly01');
})();
