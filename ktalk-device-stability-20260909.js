/* K-Talk only: phone + tablet + PC opening/reconnect stability. Other screens/features are untouched. */
(function(){
  if(window.__ktDeviceStability20260909)return;
  window.__ktDeviceStability20260909=true;

  var FIRST_VIDEO='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
  var repairTimer=null;
  var reconnectTimer=null;

  function setRealVh(){
    try{
      var h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||700;
      document.documentElement.style.setProperty('--kt-real-vh',Math.round(h)+'px');
    }catch(e){}
  }

  function installCss(){
    if(document.getElementById('ktDeviceStabilityCss'))return;
    var s=document.createElement('style');
    s.id='ktDeviceStabilityCss';
    s.textContent='\
html,body{max-width:100%!important;overflow-x:hidden!important;}\
.kt-video-mode #screen{height:calc(var(--kt-real-vh,100dvh) - 78px)!important;min-height:0!important;padding:0!important;margin:0!important;overflow:hidden!important;background:#000!important;}\
#ktUnifiedFeed{height:100%!important;min-height:0!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;scroll-snap-type:y mandatory!important;background:#000!important;}\
#ktUnifiedFeed>section{height:100%!important;min-height:100%!important;max-height:100%!important;position:relative!important;scroll-snap-align:start!important;overflow:hidden!important;background:#000!important;}\
#ktUnifiedFeed>section.video-home{height:100%!important;}\
#ktUnifiedFeed .vh-shade{position:absolute!important;inset:0!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(0,0,0,.18),transparent 28%,transparent 58%,rgba(0,0,0,.78))!important;}\
#ktUnifiedFeed .vh-tabs{position:absolute!important;top:14px!important;left:10px!important;right:10px!important;z-index:5!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;color:#fff!important;font-size:13px!important;font-weight:900!important;text-shadow:0 2px 6px #000!important;}\
#ktUnifiedFeed .vh-tabs span{opacity:.8!important;white-space:nowrap!important;}\
#ktUnifiedFeed .vh-tabs .on{opacity:1!important;border-bottom:2px solid #fff!important;padding-bottom:6px!important;}\
#ktUnifiedFeed .vh-tabs button{margin-left:auto!important;width:34px!important;height:34px!important;border:0!important;background:transparent!important;color:#fff!important;font-size:25px!important;}\
#ktUnifiedFeed .vh-title{position:absolute!important;left:14px!important;bottom:24px!important;right:82px!important;z-index:3!important;color:#fff!important;text-shadow:0 2px 5px #000!important;}\
#ktUnifiedFeed .vh-title b{display:block!important;color:#ffe07a!important;font-size:17px!important;}\
#ktUnifiedFeed .vh-title span{display:block!important;margin-top:5px!important;font-size:12px!important;line-height:1.45!important;}\
#ktUnifiedFeed .vh-actions{position:absolute!important;right:10px!important;bottom:26px!important;z-index:4!important;display:grid!important;gap:10px!important;}\
#ktUnifiedFeed .vh-actions button{width:54px!important;height:54px!important;border-radius:50%!important;border:0!important;background:rgba(8,8,11,.68)!important;color:#fff!important;font-size:22px!important;text-shadow:0 1px 4px #000!important;}\
#ktUnifiedFeed .vh-actions small{display:block!important;font-size:8px!important;margin-top:2px!important;}\
#ktUnifiedFeed video.kt-public-video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#000!important;}\
.ktg13-room{height:var(--kt-real-vh,100dvh)!important;min-height:0!important;max-height:var(--kt-real-vh,100dvh)!important;}\
.ktg13-main{min-height:0!important;}\
@media(min-width:700px){.kt-video-mode #screen{height:calc(var(--kt-real-vh,100dvh) - 78px)!important}.ktg13-room{height:var(--kt-real-vh,100dvh)!important;min-height:0!important}.ktg13-head{flex-shrink:0!important}.ktg13-main{min-height:0!important}}';
    document.head.appendChild(s);
  }

  function creatorOpen(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList&&c.classList.contains('show'));
  }
  function liveOpen(){
    return !!(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive')||document.querySelector('.ktg13-room'));
  }
  function currentFeed(){return document.getElementById('ktUnifiedFeed');}

  function fixFeed(){
    if(creatorOpen()||liveOpen())return;
    var f=currentFeed();
    if(!f)return;
    var sections=f.children?Array.prototype.slice.call(f.children):[];
    sections.forEach(function(sec){
      if(sec&&sec.tagName==='SECTION')sec.classList.add('video-home');
    });
    var vs=Array.prototype.slice.call(f.querySelectorAll('video.kt-public-video'));
    vs.forEach(function(v,i){
      try{
        v.removeAttribute('poster');
        v.setAttribute('playsinline','');
        v.setAttribute('webkit-playsinline','');
        v.loop=true;
        if(i===0){v.preload='auto';v.muted=true;v.defaultMuted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}
      }catch(e){}
    });
  }

  function fallbackVideo(){
    if(creatorOpen()||liveOpen())return;
    var screen=document.getElementById('screen');
    if(!screen)return;
    if(screen.querySelector('video.kt-public-video'))return;
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    screen.innerHTML='<div id="ktUnifiedFeed" data-kt-emergency-home="1"><section class="video-home" style="height:100%;min-height:100%;position:relative;overflow:hidden;background:#000"><video class="kt-public-video" autoplay muted loop playsinline webkit-playsinline preload="auto" src="'+FIRST_VIDEO+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video><div class="vh-shade"></div><div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button aria-label="검색">⌕</button></div><div class="vh-title"><b>♛ K-Talk</b><span>추천 동영상</span></div></section></div>';
    fixFeed();
  }

  function repairHome(){
    setRealVh();installCss();
    if(creatorOpen()||liveOpen())return;
    var v=document.querySelector('#ktUnifiedFeed video.kt-public-video');
    if(v){fixFeed();return;}
    try{if(typeof window.home==='function')window.home();}catch(e){}
    clearTimeout(repairTimer);
    repairTimer=setTimeout(function(){
      if(creatorOpen()||liveOpen())return;
      var vv=document.querySelector('#ktUnifiedFeed video.kt-public-video');
      if(vv)fixFeed();else fallbackVideo();
    },500);
  }

  function reconnect(){
    clearTimeout(reconnectTimer);
    reconnectTimer=setTimeout(function(){
      setRealVh();
      if(creatorOpen()||liveOpen())return;
      repairHome();
    },120);
  }

  function lateReapplyGroup13(){
    if(window.__ktGroup13LateReapplyDone)return;
    window.__ktGroup13LateReapplyDone=true;
    setTimeout(function(){
      try{
        window.__ktGroup13ApprovedRoomInstalled=false;
        var s=document.createElement('script');
        s.src='group13-approved-room.js?v=20260909-latefix1';
        s.async=false;
        s.setAttribute('data-kt-group13-latefix','1');
        document.head.appendChild(s);
      }catch(e){}
    },1200);
  }

  setRealVh();installCss();lateReapplyGroup13();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(repairHome,60);},{once:true});
  else setTimeout(repairHome,60);

  window.addEventListener('resize',function(){setRealVh();setTimeout(fixFeed,40);});
  window.addEventListener('orientationchange',function(){setTimeout(function(){setRealVh();fixFeed();},180);});
  window.addEventListener('pageshow',function(){setTimeout(repairHome,80);});
  window.addEventListener('popstate',function(){setTimeout(repairHome,120);});
  window.addEventListener('online',reconnect);
  window.addEventListener('focus',function(){if(navigator.onLine!==false)reconnect();});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(repairHome,100);});

  try{
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize',function(){setRealVh();setTimeout(fixFeed,40);});
      window.visualViewport.addEventListener('scroll',setRealVh);
    }
  }catch(e){}
  try{
    var conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(conn&&conn.addEventListener)conn.addEventListener('change',function(){if(navigator.onLine!==false)reconnect();});
  }catch(e){}
  try{new MutationObserver(function(){setTimeout(fixFeed,20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}

  setTimeout(repairHome,350);
  setTimeout(repairHome,1000);
})();
