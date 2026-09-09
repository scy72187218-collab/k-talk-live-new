/* K-Talk: 동영상/쇼츠를 보다가 다른 페이지로 이동할 때 그 화면의 영상·음악만 정지. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoAudioStopOnLeaveInstalled)return;
  window.__ktVideoAudioStopOnLeaveInstalled=true;

  function stopOne(media){
    if(!media)return;
    try{media.pause();}catch(e){}
    try{media.muted=true;}catch(e){}
    try{media.volume=0;}catch(e){}
  }

  function stopScreenMedia(){
    try{
      var host=document.getElementById('screen');
      if(host){
        host.querySelectorAll('video,audio').forEach(stopOne);
      }
    }catch(e){}
    try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
  }

  /* 아래 메뉴로 다른 페이지를 누르는 순간 현재 동영상 소리를 먼저 멈춘다. */
  document.addEventListener('click',function(e){
    var nav=null;
    try{nav=e.target&&e.target.closest?e.target.closest('.bottom button,.kt-bottom button'):null;}catch(err){}
    if(nav)stopScreenMedia();
  },true);

  /* 화면 내용이 교체될 때 제거되는 영상도 확실하게 멈춘다. */
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

  /* 자주 쓰는 페이지 이동 함수도 같은 동작을 보장한다. */
  ['home','media','friends','openCreator','openDashboard','profile','openProfile'].forEach(function(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktStopsVideoAudio)return;
    var wrapped=function(){
      stopScreenMedia();
      return fn.apply(this,arguments);
    };
    wrapped.__ktStopsVideoAudio=true;
    window[name]=wrapped;
  });
})();
