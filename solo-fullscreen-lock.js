/* K-Talk: keep the camera full-screen in 1-person, 13-person, and subscriber live rooms. */
(function(){
  if(window.__ktSoloFullscreenLockLoaded)return;
  window.__ktSoloFullscreenLockLoaded=true;

  function isTargetRoom(){
    try{
      if(!window.state)return false;
      var t=state.liveRoomType;
      return t==='solo'||t==='group'||t==='group13'||t==='subscriber';
    }catch(e){return false;}
  }

  function currentHost(){
    return document.getElementById('ktSept2Live') || document.getElementById('ktSoloHostLive');
  }

  function isSept2Host(host){
    return !!host && host.id==='ktSept2Live';
  }

  function moveEarnHudDown(){
    if(!isTargetRoom())return;
    var hud=document.querySelector('#ktSept2Live #myEarnHud');
    if(!hud)return;
    if(hud.style.getPropertyValue('bottom')!=='126px' || hud.style.getPropertyPriority('bottom')!=='important'){
      hud.style.setProperty('bottom','126px','important');
    }
    if(!hud.__ktEarnHudDownObs){
      try{
        var earnObs=new MutationObserver(function(){
          if(hud.style.getPropertyValue('bottom')!=='126px' || hud.style.getPropertyPriority('bottom')!=='important'){
            hud.style.setProperty('bottom','126px','important');
          }
        });
        earnObs.observe(hud,{attributes:true,attributeFilter:['style']});
        hud.__ktEarnHudDownObs=earnObs;
      }catch(e){}
    }
  }

  function forceLiveFull(){
    if(!isTargetRoom())return;
    var host=currentHost();
    var video=document.getElementById('ktLiveVideo');
    if(!host||!video)return;

    /* 현재 승인된 방송 UI는 그대로 두고 카메라 영상만 전면 고정 */
    if(isSept2Host(host)){
      video.style.setProperty('position','absolute','important');
      video.style.setProperty('inset','0','important');
      video.style.setProperty('left','0','important');
      video.style.setProperty('top','0','important');
      video.style.setProperty('right','0','important');
      video.style.setProperty('bottom','0','important');
      video.style.setProperty('width','100%','important');
      video.style.setProperty('height','100%','important');
      video.style.setProperty('min-width','100%','important');
      video.style.setProperty('min-height','100%','important');
      video.style.setProperty('max-width','none','important');
      video.style.setProperty('max-height','none','important');
      video.style.setProperty('margin','0','important');
      video.style.setProperty('padding','0','important');
      video.style.setProperty('object-fit','cover','important');
      video.style.setProperty('object-position','50% 50%','important');
      video.style.setProperty('border','0','important');
      video.style.setProperty('border-radius','0','important');
      video.style.setProperty('background','#000','important');
      video.style.setProperty('transform','scaleX(-1)','important');
      video.style.setProperty('transform-origin','50% 50%','important');
      video.style.setProperty('transition','none','important');
      video.style.setProperty('animation','none','important');
      return;
    }

    /* 예전 1인 방송 화면이 쓰일 때만 기존 전체화면 고정 유지 */
    host.style.setProperty('position','fixed','important');
    host.style.setProperty('inset','0','important');
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
    video.style.setProperty('width','100vw','important');
    video.style.setProperty('height','100dvh','important');
    video.style.setProperty('max-width','none','important');
    video.style.setProperty('max-height','none','important');
    video.style.setProperty('margin','0','important');
    video.style.setProperty('padding','0','important');
    video.style.setProperty('object-fit','cover','important');
    video.style.setProperty('object-position','50% 50%','important');
    video.style.setProperty('border-radius','0','important');
    video.style.setProperty('background','#000','important');
    video.style.setProperty('transform','scaleX(-1)','important');
    video.style.setProperty('transform-origin','50% 50%','important');
    video.style.setProperty('transition','none','important');
    video.style.setProperty('animation','none','important');
  }

  function videoNeedsFix(video,host){
    if(!video||!host)return false;
    var targetWidth=isSept2Host(host)?'100%':'100vw';
    var targetHeight=isSept2Host(host)?'100%':'100dvh';
    return video.style.getPropertyValue('width')!==targetWidth ||
      video.style.getPropertyValue('height')!==targetHeight ||
      video.style.getPropertyValue('object-fit')!=='cover' ||
      video.style.getPropertyValue('position')!=='absolute' ||
      video.style.getPropertyValue('left')!=='0px' ||
      video.style.getPropertyValue('top')!=='0px';
  }

  function watchVideo(){
    if(!isTargetRoom())return;
    var host=currentHost();
    var video=document.getElementById('ktLiveVideo');
    if(!host||!video)return;

    forceLiveFull();
    moveEarnHudDown();

    if(!video.__ktSoloFullscreenObs){
      try{
        var obs=new MutationObserver(function(){
          var h=currentHost();
          if(h&&videoNeedsFix(video,h))forceLiveFull();
          moveEarnHudDown();
        });
        obs.observe(video,{attributes:true,attributeFilter:['style','class']});
        video.__ktSoloFullscreenObs=obs;
      }catch(e){}
    }
  }

  try{
    var rootObs=new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        for(var j=0;j<muts[i].addedNodes.length;j++){
          var n=muts[i].addedNodes[j];
          if(!n||n.nodeType!==1)continue;
          if(n.id==='ktSept2Live'||n.id==='ktSoloHostLive'||n.id==='ktLiveVideo'||n.id==='myEarnHud'||
             (n.querySelector&&(n.querySelector('#ktSept2Live')||n.querySelector('#ktSoloHostLive')||n.querySelector('#ktLiveVideo')||n.querySelector('#myEarnHud')))){
            setTimeout(watchVideo,0);
            return;
          }
        }
      }
    });
    rootObs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(watchVideo,0);
  setTimeout(watchVideo,80);
})();
