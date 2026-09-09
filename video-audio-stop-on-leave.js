/* K-Talk: 다른 페이지로 이동할 때 현재 동영상 소리는 멈추고, 동영상 화면으로 돌아오거나 다음 영상으로 넘기면 사용하던 소리를 다시 살린다. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoAudioStopOnLeaveInstalled)return;
  window.__ktVideoAudioStopOnLeaveInstalled=true;

  var SOUND_KEY='kt_feed_sound_was_on';

  function wantSound(){
    try{return sessionStorage.getItem(SOUND_KEY)==='1';}catch(e){return false;}
  }

  function rememberSound(){
    try{
      var host=document.getElementById('screen');
      if(!host)return;
      var medias=host.querySelectorAll('video,audio');
      for(var i=0;i<medias.length;i++){
        var m=medias[i];
        if(m && !m.paused && !m.muted && Number(m.volume)>0){
          sessionStorage.setItem(SOUND_KEY,'1');
          return;
        }
      }
    }catch(e){}
  }

  function stopOne(media){
    if(!media)return;
    try{media.pause();}catch(e){}
    try{media.muted=true;}catch(e){}
    try{media.volume=0;}catch(e){}
  }

  function stopScreenMedia(){
    rememberSound();
    try{
      var host=document.getElementById('screen');
      if(host)host.querySelectorAll('video,audio').forEach(stopOne);
    }catch(e){}
    try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
  }

  function visibleAmount(el){
    try{
      var r=el.getBoundingClientRect();
      var w=Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0));
      var h=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
      return w*h;
    }catch(e){return 0;}
  }

  function restoreFeedSound(){
    if(!wantSound())return false;
    try{
      if(!document.body.classList.contains('kt-video-mode'))return false;
      var host=document.getElementById('screen');
      if(!host)return false;
      var list=[].slice.call(host.querySelectorAll('.kt-public-video,#homeVideo,.video-home video'));
      if(!list.length)return false;
      list.sort(function(a,b){return visibleAmount(b)-visibleAmount(a);});
      var v=list[0];
      if(!v||visibleAmount(v)<=0)return false;
      v.defaultMuted=false;
      v.muted=false;
      v.volume=1;
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
      return true;
    }catch(e){return false;}
  }

  function watchVideo(v){
    if(!v||v.__ktSoundResumeWatched)return;
    v.__ktSoundResumeWatched=true;
    try{
      v.addEventListener('play',function(){
        try{if(!v.muted&&Number(v.volume)>0)sessionStorage.setItem(SOUND_KEY,'1');}catch(e){}
      });
    }catch(e){}
    if('IntersectionObserver' in window){
      try{
        var ob=new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting&&entry.intersectionRatio>.6&&wantSound()){
              try{v.defaultMuted=false;v.muted=false;v.volume=1;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
            }
          });
        },{threshold:[.6]});
        ob.observe(v);
      }catch(e){}
    }
  }

  function scanFeed(){
    try{document.querySelectorAll('.kt-public-video,#homeVideo,.video-home video').forEach(watchVideo);}catch(e){}
    setTimeout(restoreFeedSound,0);
  }

  /* 아래 메뉴로 다른 페이지를 누르는 순간 현재 화면의 영상·음악만 정지한다. */
  document.addEventListener('click',function(e){
    var nav=null;
    try{nav=e.target&&e.target.closest?e.target.closest('.bottom button,.kt-bottom button'):null;}catch(err){}
    if(nav)stopScreenMedia();
  },true);

  /* 사용자가 영상 소리를 켠 적이 있으면 다음 영상과 복귀 영상에도 같은 소리 상태를 유지한다. */
  document.addEventListener('click',function(e){
    var v=null;
    try{v=e.target&&e.target.closest?e.target.closest('.kt-public-video,#homeVideo,.video-home video'):null;}catch(err){}
    if(!v)return;
    setTimeout(function(){
      try{
        if(!v.muted&&Number(v.volume)>0)sessionStorage.setItem(SOUND_KEY,'1');
        restoreFeedSound();
      }catch(e){}
    },0);
  },false);

  /* 화면 내용이 교체될 때 제거되는 영상은 정지하고 새 동영상은 소리 복귀 대상으로 등록한다. */
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
        scanFeed();
      });
      observer.observe(host,{childList:true,subtree:true});
    }
  }catch(e){}

  /* 자주 쓰는 페이지 이동 함수: 나갈 때는 정지, 홈/동영상으로 돌아오면 소리 복귀. */
  ['home','media','friends','openCreator','openDashboard','profile','openProfile'].forEach(function(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktStopsVideoAudio)return;
    var wrapped=function(){
      stopScreenMedia();
      var result=fn.apply(this,arguments);
      if(name==='home'||name==='media'){
        scanFeed();
        setTimeout(scanFeed,120);
        setTimeout(scanFeed,500);
      }
      return result;
    };
    wrapped.__ktStopsVideoAudio=true;
    window[name]=wrapped;
  });

  scanFeed();
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(scanFeed,80);});
  window.addEventListener('pageshow',function(){setTimeout(scanFeed,80);});
})();
