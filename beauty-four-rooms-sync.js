/* K-Talk 보정/얼굴효과를 구독자방/비밀방 2곳에만 동일 적용. 다른 방송방과 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyFourRoomsSyncInstalled)return;
  window.__ktBeautyFourRoomsSyncInstalled=true;

  /* 사용자 요청: 구독자방 + 비밀방만 적용 */
  var rooms=[
    {box:'.ktsubscriber-main',video:'.ktsubscriber-main video',key:'subscriber'},
    {box:'.ktsecret-main',video:'.ktsecret-main video',key:'secret'}
  ];

  function eachRoom(fn){
    rooms.forEach(function(r){
      var box=document.querySelector(r.box);
      var video=document.querySelector(r.video);
      if(box&&video)fn(r,box,video);
    });
  }

  function copyBeautyToRooms(){
    try{
      var cam=document.getElementById('camera');
      if(!cam)return;
      var cs=window.getComputedStyle?getComputedStyle(cam):null;
      var filter=(cam.style&&cam.style.getPropertyValue('filter'))||(cs&&cs.filter)||'';
      var transform=(cam.style&&cam.style.getPropertyValue('transform'))||(cs&&cs.transform)||'';
      eachRoom(function(r,box,v){
        if(filter&&filter!=='none')v.style.setProperty('filter',filter,'important');
        if(transform&&transform!=='none')v.style.setProperty('transform',transform,'important');
      });
    }catch(e){}
  }

  function currentEffect(){
    try{return String((window.state&&(state.appliedEditEffect||state.pendingEditEffect||state.editSticker))||'off');}catch(e){return 'off';}
  }

  function ensureLayer(r,box){
    var layer=box.querySelector('.kt-fourroom-face-layer[data-room="'+r.key+'"]');
    if(!layer){
      layer=document.createElement('div');
      layer.className='kt-fourroom-face-layer';
      layer.setAttribute('data-room',r.key);
      layer.innerHTML='<div class="kt-fourroom-face-anchor"></div>';
      box.appendChild(layer);
    }
    return layer;
  }

  function syncFaceEffectToRooms(){
    try{
      var name=currentEffect();
      if(window.ktEnsureFaceEffectStyle)window.ktEnsureFaceEffectStyle();
      eachRoom(function(r,box,video){
        var layer=ensureLayer(r,box);
        var anchor=layer.querySelector('.kt-fourroom-face-anchor');
        if(!anchor)return;
        if(!name||name==='off'||name==='none'){
          anchor.innerHTML='';
          layer.style.display='none';
          return;
        }
        layer.style.display='block';
        anchor.innerHTML=window.ktFaceEffectMarkup?window.ktFaceEffectMarkup(name):'';
        if(window.ktStartFaceTrackingFor){
          try{window.ktStartFaceTrackingFor(video,layer,anchor,'fourroom-'+r.key);}catch(e){}
        }
      });
    }catch(e){}
  }

  function syncAll(){
    copyBeautyToRooms();
    syncFaceEffectToRooms();
  }

  if(!document.getElementById('ktFourRoomFaceLayerStyle')){
    var st=document.createElement('style');
    st.id='ktFourRoomFaceLayerStyle';
    st.textContent=''
      +'.ktsubscriber-main,.ktsecret-main{position:relative!important}'
      +'.kt-fourroom-face-layer{position:absolute!important;inset:0!important;z-index:6!important;pointer-events:none!important;overflow:hidden!important}'
      +'.kt-fourroom-face-anchor{position:absolute!important;left:50%!important;top:50%!important;width:42%!important;height:42%!important;transform:translate(-50%,-50%)!important;pointer-events:none!important}';
    document.head.appendChild(st);
  }

  var oldApplyBeauty=window.applyBeautyPreview;
  if(typeof oldApplyBeauty==='function'){
    window.applyBeautyPreview=function(){
      var r=oldApplyBeauty.apply(this,arguments);
      setTimeout(syncAll,0);
      return r;
    };
  }

  var oldFace=window.ktApplyFaceEffect;
  if(typeof oldFace==='function'){
    window.ktApplyFaceEffect=function(){
      var r=oldFace.apply(this,arguments);
      setTimeout(syncFaceEffectToRooms,0);
      return r;
    };
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(syncAll,30);
      return r;
    };
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var r=await oldStart.apply(this,arguments);
      setTimeout(syncAll,80);
      setTimeout(syncAll,280);
      return r;
    };
  }

  try{
    var screen=document.getElementById('screen');
    if(screen&&window.MutationObserver){
      var timer=0;
      var mo=new MutationObserver(function(){
        clearTimeout(timer);
        timer=setTimeout(syncAll,25);
      });
      mo.observe(screen,{childList:true,subtree:true});
    }
  }catch(e){}

  /* 기존 호출명은 다른 파일과 호환을 위해 유지하지만 실제 적용 대상은 2개 방뿐 */
  window.ktSyncBeautyToFourRooms=syncAll;
  setTimeout(syncAll,0);
})();
