/* K-Talk: 동영상/쇼츠에서 다른 페이지·메뉴로 이동하면 현재 영상/음악을 즉시 정지. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoAudioStopOnLeaveInstalled)return;
  window.__ktVideoAudioStopOnLeaveInstalled=true;

  function stopOne(media){
    if(!media)return;
    try{media.pause();}catch(e){}
    try{media.muted=true;}catch(e){}
    try{media.volume=0;}catch(e){}
  }

  function isCreatorCamera(media){
    if(!media)return false;
    var id=media.id||'';
    if(id!=='camera'&&id!=='cameraBg'&&id!=='ktCreatorPreview')return false;
    try{
      var creator=document.getElementById('creator');
      return !!(creator&&creator.classList.contains('show'));
    }catch(e){return false;}
  }

  function stopPageMedia(){
    /* 화면 안 영상뿐 아니라 페이지에 남아 있는 영상/오디오도 모두 정지.
       촬영 화면이 실제로 열려 있을 때의 카메라 3개만 제외한다. */
    try{
      document.querySelectorAll('video,audio').forEach(function(media){
        if(isCreatorCamera(media))return;
        stopOne(media);
      });
    }catch(e){}
    try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
    try{if(window.ktStopSheetMedia)window.ktStopSheetMedia();}catch(e){}
  }

  window.ktStopPageVideoAudio=stopPageMedia;

  /* 아래 메뉴는 홈/친구/사용방법/프로필/마이페이지 등 무엇을 눌러도
     이동하는 순간 현재 동영상 소리를 먼저 끈다. */
  document.addEventListener('click',function(e){
    var nav=null;
    try{nav=e.target&&e.target.closest?e.target.closest('.bottom button,.kt-bottom button,[data-tab]'):null;}catch(err){}
    if(nav)stopPageMedia();
  },true);

  /* 화면 내용이 교체될 때 제거되는 영상도 확실하게 정지한다. */
  try{
    var host=document.getElementById('screen');
    if(host){
      var observer=new MutationObserver(function(list){
        list.forEach(function(m){
          (m.removedNodes||[]).forEach(function(node){
            if(!node||node.nodeType!==1)return;
            try{
              if(node.matches&&node.matches('video,audio'))stopOne(node);
              if(node.querySelectorAll)node.querySelectorAll('video,audio').forEach(stopOne);
            }catch(e){}
          });
        });
      });
      observer.observe(host,{childList:true,subtree:true});
    }
  }catch(e){}

  /* 화면/메뉴를 실제로 바꾸는 함수들도 직접 호출될 수 있으므로 같이 막는다. */
  [
    'home','media','friends','render','openCreator','openDashboard',
    'openProfile','openMenu','openBroadcastList','openMessages'
  ].forEach(function(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktStopsVideoAudio)return;
    var wrapped=function(){
      stopPageMedia();
      return fn.apply(this,arguments);
    };
    wrapped.__ktStopsVideoAudio=true;
    window[name]=wrapped;
  });
})();
