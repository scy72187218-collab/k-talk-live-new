/* K-Talk host room exposure release (2026-09-22)
   When creator preview is left and a live room opens, return exposure/white balance
   to continuous auto so the host does not stay dark after moving from bright outdoor
   light to an indoor room. Creator preview stability remains unchanged. */
(function(){
  if(window.__ktHostRoomExposureRelease20260922)return;
  window.__ktHostRoomExposureRelease20260922=true;

  var lastTrack=null;
  var lastRoomOpen=false;

  function creatorVisible(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show')&&!c.classList.contains('creator-review'));
  }
  function liveRoomVisible(){
    try{
      return !!document.querySelector(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      );
    }catch(e){return false;}
  }
  function currentTrack(){
    try{
      var s=window.state&&state.stream;
      return s&&s.getVideoTracks&&s.getVideoTracks()[0]||null;
    }catch(e){return null;}
  }
  async function applyAdvanced(track,obj){
    try{await track.applyConstraints({advanced:[obj]});return true;}catch(e){return false;}
  }
  async function releaseForRoom(){
    if(creatorVisible()||!liveRoomVisible())return;
    var track=currentTrack();
    if(!track||track.readyState!=='live'||!track.getCapabilities||!track.applyConstraints)return;
    if(track===lastTrack&&lastRoomOpen)return;

    var caps={};
    try{caps=track.getCapabilities()||{};}catch(e){return;}
    var adv={};

    if(Array.isArray(caps.exposureMode)&&caps.exposureMode.indexOf('continuous')>-1){
      adv.exposureMode='continuous';
    }
    if(Array.isArray(caps.whiteBalanceMode)&&caps.whiteBalanceMode.indexOf('continuous')>-1){
      adv.whiteBalanceMode='continuous';
    }
    if(Array.isArray(caps.focusMode)&&caps.focusMode.indexOf('continuous')>-1){
      adv.focusMode='continuous';
    }

    if(Object.keys(adv).length)await applyAdvanced(track,adv);
    lastTrack=track;lastRoomOpen=true;
  }

  function check(){
    var open=liveRoomVisible();
    if(!open){lastRoomOpen=false;return;}
    if(!creatorVisible())releaseForRoom();
  }

  [80,250,600,1200,2200].forEach(function(ms){setTimeout(check,ms);});
  setInterval(check,1200);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHostExposureReleaseTimer);
      window.__ktHostExposureReleaseTimer=setTimeout(check,80);
    }).observe(document.getElementById('screen')||document.documentElement,{
      childList:true,subtree:true,attributes:true,attributeFilter:['class','data-kt-room']
    });
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(check,120);
  });
})();