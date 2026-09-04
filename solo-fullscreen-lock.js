/* K-Talk: lock ONLY the mobile 1-person host camera to full viewport. */
(function(){
  if(window.__ktSoloFullscreenLockLoaded)return;
  window.__ktSoloFullscreenLockLoaded=true;

  function isSolo(){
    try{
      return !!document.getElementById('ktSoloHostLive') && !!window.state && (state.liveRoomType==='solo');
    }catch(e){return false;}
  }

  function forceSoloFull(){
    if(!isSolo())return;
    var host=document.getElementById('ktSoloHostLive');
    var video=document.getElementById('ktLiveVideo');
    if(!host||!video)return;

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
  }

  function watchVideo(){
    if(!isSolo())return;
    var video=document.getElementById('ktLiveVideo');
    var host=document.getElementById('ktSoloHostLive');
    if(!video||!host)return;
    forceSoloFull();
    if(!video.__ktSoloFullscreenObs){
      try{
        var obs=new MutationObserver(function(){
          if(video.style.objectFit!=='cover' || video.style.width!=='100vw' || video.style.height!=='100dvh')forceSoloFull();
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
          if(n&&n.nodeType===1&&(n.id==='ktSoloHostLive'||(n.querySelector&&n.querySelector('#ktSoloHostLive')))){
            setTimeout(watchVideo,20);
            return;
          }
        }
      }
    });
    rootObs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(watchVideo,40);
})();
