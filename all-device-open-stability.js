/* K-Talk common opening stability for phone, tablet and PC. Connection/first-screen only. */
(function(){
  if(window.__ktAllDeviceOpenStabilityInstalled)return;
  window.__ktAllDeviceOpenStabilityInstalled=true;

  var FIRST_VIDEO='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
  var repairTimer=null;
  var startedAt=Date.now();

  function busy(){
    try{
      var c=document.getElementById('creator');
      if(c&&c.classList&&c.classList.contains('show'))return true;
      if(document.getElementById('ktLiveVideo')||document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive')||document.querySelector('.ktg13-room'))return true;
    }catch(e){}
    return false;
  }

  function setViewport(){
    try{
      var h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||700;
      document.documentElement.style.setProperty('--kt-real-vh',Math.round(h)+'px');
    }catch(e){}
  }

  function preconnect(){
    try{
      if(!document.getElementById('ktSupabasePreconnect')){
        var p=document.createElement('link');
        p.id='ktSupabasePreconnect';p.rel='preconnect';p.href='https://zupwbfmacwzexyvznlzq.supabase.co';p.crossOrigin='anonymous';
        document.head.appendChild(p);
      }
      if(!document.getElementById('ktSupabaseDns')){
        var d=document.createElement('link');
        d.id='ktSupabaseDns';d.rel='dns-prefetch';d.href='//zupwbfmacwzexyvznlzq.supabase.co';
        document.head.appendChild(d);
      }
    }catch(e){}
  }

  function makeScreenUsable(){
    var s=document.getElementById('screen');
    if(!s)return null;
    try{
      s.style.setProperty('display','block','important');
      s.style.setProperty('visibility','visible','important');
      s.style.setProperty('width','100%','important');
      if(document.body.classList.contains('kt-video-mode')){
        s.style.setProperty('height','calc(var(--kt-real-vh, 100dvh) - 78px)','important');
        s.style.setProperty('min-height','0','important');
      }
    }catch(e){}
    return s;
  }

  function prepareVideo(v,first){
    if(!v)return;
    try{
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.preload='auto';
      v.loop=true;
      if(first){
        v.defaultMuted=true;
        v.muted=true;
        if(v.readyState===0){try{v.load();}catch(e){}}
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function fixFeed(){
    if(busy())return false;
    var s=makeScreenUsable();
    if(!s)return false;
    var videos=[].slice.call(s.querySelectorAll('video.kt-public-video'));
    if(!videos.length)return false;
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}

    /* Old feed guards can leave a loaded feed hidden. Reveal it on every device. */
    try{
      var first=videos[0];
      var holder=first.parentElement&&first.parentElement.parentElement?first.parentElement.parentElement:first.parentElement;
      if(holder)holder.style.visibility='visible';
      var feed=document.getElementById('ktUnifiedFeed');
      if(feed)feed.style.visibility='visible';
    }catch(e){}

    videos.forEach(function(v,i){prepareVideo(v,i===0);});
    return true;
  }

  function screenEmpty(){
    var s=document.getElementById('screen');
    if(!s)return true;
    try{
      if(!String(s.innerHTML||'').replace(/\s+/g,''))return true;
      var r=s.getBoundingClientRect();
      if(r.width<20||r.height<80)return true;
    }catch(e){}
    return false;
  }

  function fallbackFirstVideo(){
    if(busy()||Date.now()-startedAt>6000)return;
    var s=makeScreenUsable();
    if(!s||s.querySelector('video.kt-public-video'))return;
    try{
      document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');
      s.innerHTML='<div id="ktUnifiedFeed" data-kt-common-fallback="1" style="height:100%;overflow:hidden;background:#000">'
        +'<section class="video-home" style="height:100%;min-height:100%;position:relative;overflow:hidden;background:#000">'
        +'<video class="kt-public-video" autoplay muted loop playsinline webkit-playsinline preload="auto" src="'+FIRST_VIDEO+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
        +'</section></div>';
      prepareVideo(s.querySelector('video.kt-public-video'),true);
    }catch(e){}
  }

  function repair(){
    setViewport();
    if(busy())return;
    if(fixFeed())return;
    if(screenEmpty()){
      try{if(typeof window.home==='function')window.home();}catch(e){}
    }
    clearTimeout(repairTimer);
    repairTimer=setTimeout(function(){
      if(busy())return;
      if(!fixFeed())fallbackFirstVideo();
    },320);
  }

  preconnect();setViewport();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(repair,30);},{once:true});
  else setTimeout(repair,30);
  setTimeout(repair,180);
  setTimeout(repair,650);
  setTimeout(repair,1400);

  window.addEventListener('pageshow',function(){setTimeout(repair,50);});
  window.addEventListener('online',function(){setTimeout(repair,70);});
  window.addEventListener('focus',function(){if(navigator.onLine!==false)setTimeout(repair,80);});
  window.addEventListener('orientationchange',function(){setTimeout(repair,160);});
  window.addEventListener('resize',function(){setViewport();setTimeout(fixFeed,30);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(repair,80);});

  try{
    if(window.visualViewport)window.visualViewport.addEventListener('resize',function(){setViewport();setTimeout(fixFeed,30);});
  }catch(e){}
  try{
    new MutationObserver(function(){setTimeout(fixFeed,15);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
