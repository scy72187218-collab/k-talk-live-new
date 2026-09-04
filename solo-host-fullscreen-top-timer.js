/* K-Talk: 1-person host screen only — full viewport camera + top elapsed timer beside LIVE. */
(function(){
  if(window.__ktSoloHostFullscreenTopTimerLoaded)return;
  window.__ktSoloHostFullscreenTopTimerLoaded=true;

  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width: 767px)').matches;
  }

  function isSolo(){
    try{
      return !!window.state && (state.liveRoomType==='solo' || Number(state.liveRoomMax)===1 || state.liveRoomName==='1인 방송');
    }catch(e){return false;}
  }

  function applySoloOnly(){
    if(!isMobile() || !isSolo())return;

    var host=document.getElementById('ktSoloHostLive');
    var video=document.getElementById('ktLiveVideo');
    if(!host || !video)return;

    /* 1인 방송 화면만 휴대폰 전면으로 고정 */
    host.style.setProperty('position','fixed','important');
    host.style.setProperty('inset','0','important');
    host.style.setProperty('left','0','important');
    host.style.setProperty('top','0','important');
    host.style.setProperty('right','0','important');
    host.style.setProperty('bottom','0','important');
    host.style.setProperty('width','100vw','important');
    host.style.setProperty('height','100dvh','important');
    host.style.setProperty('max-width','none','important');
    host.style.setProperty('max-height','none','important');
    host.style.setProperty('margin','0','important');
    host.style.setProperty('padding','0','important');
    host.style.setProperty('overflow','hidden','important');
    host.style.setProperty('background','#000','important');
    host.style.setProperty('z-index','9999','important');

    video.style.setProperty('position','absolute','important');
    video.style.setProperty('inset','0','important');
    video.style.setProperty('left','0','important');
    video.style.setProperty('top','0','important');
    video.style.setProperty('right','0','important');
    video.style.setProperty('bottom','0','important');
    video.style.setProperty('width','100vw','important');
    video.style.setProperty('height','100dvh','important');
    video.style.setProperty('max-width','none','important');
    video.style.setProperty('max-height','none','important');
    video.style.setProperty('margin','0','important');
    video.style.setProperty('object-fit','cover','important');
    video.style.setProperty('object-position','50% 50%','important');
    video.style.setProperty('border-radius','0','important');
    video.style.setProperty('background','#000','important');
    video.style.setProperty('transform','scaleX(-1)','important');
    video.style.setProperty('transform-origin','50% 50%','important');

    /* 기존 아래쪽 시간은 숨기고 LIVE 바로 옆에 같은 시간을 표시 */
    var badge=document.getElementById('ktSoloLiveBadge');
    var status=document.getElementById('ktSoloLiveStatus');
    if(!badge || !status || !badge.parentElement)return;

    var topbar=badge.parentElement;
    var clock=document.getElementById('ktSoloTopClock');
    if(!clock){
      clock=document.createElement('span');
      clock.id='ktSoloTopClock';
      clock.textContent='00:00';
      clock.style.setProperty('padding','7px 9px','important');
      clock.style.setProperty('border-radius','999px','important');
      clock.style.setProperty('background','rgba(8,8,11,.62)','important');
      clock.style.setProperty('border','1px solid rgba(255,255,255,.18)','important');
      clock.style.setProperty('color','#fff','important');
      clock.style.setProperty('font-size','12px','important');
      clock.style.setProperty('font-weight','950','important');
      clock.style.setProperty('font-variant-numeric','tabular-nums','important');
      clock.style.setProperty('white-space','nowrap','important');
      topbar.insertBefore(clock,badge.nextSibling);
    }

    status.style.setProperty('display','none','important');

    function syncClock(){
      var txt=(status.textContent||'').trim();
      var m=txt.match(/(\d{2}:\d{2})$/);
      if(m){clock.textContent=m[1];return;}
      var c=txt.match(/(\d+)초/);
      if(c){clock.textContent=c[1]+'초';}
    }
    syncClock();

    if(!status.__ktTopClockObserver){
      try{
        var ob=new MutationObserver(syncClock);
        ob.observe(status,{childList:true,characterData:true,subtree:true});
        status.__ktTopClockObserver=ob;
      }catch(e){}
    }
  }

  function inspectAdded(muts){
    for(var i=0;i<muts.length;i++){
      for(var j=0;j<muts[i].addedNodes.length;j++){
        var n=muts[i].addedNodes[j];
        if(!n || n.nodeType!==1)continue;
        if(n.id==='ktSoloHostLive' || (n.querySelector && n.querySelector('#ktSoloHostLive'))){
          setTimeout(applySoloOnly,30);
          return;
        }
      }
    }
  }

  try{
    var observer=new MutationObserver(inspectAdded);
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(applySoloOnly,50);
})();
