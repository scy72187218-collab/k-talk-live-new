/* K-Talk tablet only: show the first video quickly while the real public feed is loading. */
(function(){
  if(window.__ktTabletFastFirstFrameInstalled)return;
  window.__ktTabletFastFirstFrameInstalled=true;

  var isTablet=false;
  try{
    isTablet=!!(window.matchMedia&&window.matchMedia('(min-width:600px) and (max-width:1400px)').matches&&(navigator.maxTouchPoints||0)>0);
  }catch(e){}
  if(!isTablet)return;

  var FIRST_VIDEO='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';

  function busy(){
    try{
      var c=document.getElementById('creator');
      if(c&&c.classList&&c.classList.contains('show'))return true;
      if(document.getElementById('ktLiveVideo')||document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive')||document.querySelector('.ktg13-room'))return true;
    }catch(e){}
    return false;
  }

  function showFast(){
    if(busy())return;
    var screen=document.getElementById('screen');
    if(!screen)return;
    if(screen.querySelector('video.kt-public-video'))return;
    try{
      document.body.classList.remove('kt-home');
      document.body.classList.add('kt-video-mode');
      screen.innerHTML='<section id="ktTabletFastFirstFrame" class="video-home" style="height:100%;min-height:100%;position:relative;overflow:hidden;background:#000">'
        +'<video class="kt-public-video" autoplay muted loop playsinline webkit-playsinline preload="auto" src="'+FIRST_VIDEO+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
        +'</section>';
      var v=screen.querySelector('video.kt-public-video');
      if(v){
        v.muted=true;v.defaultMuted=true;v.preload='auto';
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  setTimeout(showFast,80);
  setTimeout(showFast,180);
})();
