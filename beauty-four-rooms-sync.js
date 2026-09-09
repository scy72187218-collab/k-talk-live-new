/* K-Talk 보정값을 4개 방송방(1인/13명/구독자/비밀방) 카메라에 동일하게 적용. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyFourRoomsSyncInstalled)return;
  window.__ktBeautyFourRoomsSyncInstalled=true;

  function targets(){
    return document.querySelectorAll('.ktsolo-main video,.ktsubscriber-main video,.ktsecret-main video,.ktg13-host video');
  }

  function copyBeautyToRooms(){
    try{
      var cam=document.getElementById('camera');
      if(!cam)return;
      var cs=window.getComputedStyle?getComputedStyle(cam):null;
      var filter=(cam.style&&cam.style.filter)||(cs&&cs.filter)||'';
      var transform=(cam.style&&cam.style.transform)||(cs&&cs.transform)||'';
      targets().forEach(function(v){
        if(filter&&filter!=='none')v.style.setProperty('filter',filter,'important');
        if(transform&&transform!=='none')v.style.setProperty('transform',transform,'important');
      });
    }catch(e){}
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'){
    window.applyBeautyPreview=function(){
      var r=oldApply.apply(this,arguments);
      setTimeout(copyBeautyToRooms,0);
      return r;
    };
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(copyBeautyToRooms,30);
      return r;
    };
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var r=await oldStart.apply(this,arguments);
      setTimeout(copyBeautyToRooms,80);
      setTimeout(copyBeautyToRooms,260);
      return r;
    };
  }

  try{
    var screen=document.getElementById('screen');
    if(screen&&window.MutationObserver){
      var mo=new MutationObserver(function(){setTimeout(copyBeautyToRooms,20);});
      mo.observe(screen,{childList:true,subtree:true});
    }
  }catch(e){}

  window.ktSyncBeautyToFourRooms=copyBeautyToRooms;
  setTimeout(copyBeautyToRooms,0);
})();
