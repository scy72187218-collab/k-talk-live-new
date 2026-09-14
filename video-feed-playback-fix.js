/* K-Talk 공개 동영상 재생/소리 안정화 전용. 다른 화면과 기능은 변경하지 않음. */
(function(){
  if(window.__ktVideoFeedPlaybackFixInstalled)return;
  window.__ktVideoFeedPlaybackFixInstalled=true;

  var unlocked=false;
  try{unlocked=sessionStorage.getItem('kt_video_sound_unlocked')==='1';}catch(e){}
  var observer=null;

  function videos(){
    try{return Array.prototype.slice.call(document.querySelectorAll('.kt-public-video'));}catch(e){return [];}
  }

  function isVisible(v){
    try{
      var r=v.getBoundingClientRect();
      var h=window.innerHeight||document.documentElement.clientHeight||1;
      var shown=Math.max(0,Math.min(r.bottom,h)-Math.max(r.top,0));
      return shown>=Math.min(r.height||h,h)*0.55;
    }catch(e){return false;}
  }

  function current(){
    var list=videos(),best=null,bestShown=0;
    for(var i=0;i<list.length;i++){
      var v=list[i];
      try{
        var r=v.getBoundingClientRect(),h=window.innerHeight||document.documentElement.clientHeight||1;
        var shown=Math.max(0,Math.min(r.bottom,h)-Math.max(r.top,0));
        if(shown>bestShown){bestShown=shown;best=v;}
      }catch(e){}
    }
    return best;
  }

  function safePlay(v,wantSound){
    if(!v)return;
    try{
      v.playsInline=true;
      v.setAttribute('playsinline','');
      v.preload='auto';
      v.loop=true;
      v.volume=1;
      v.muted=!wantSound;
      v.defaultMuted=!wantSound;
      var p=v.play();
      if(p&&p.catch)p.catch(function(){
        try{
          /* 브라우저가 소리 자동재생을 막을 때 영상만 멈추지 않도록 무음으로 먼저 재생 */
          v.muted=true;v.defaultMuted=true;
          var q=v.play();if(q&&q.catch)q.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }

  function playCurrent(){
    var list=videos(),active=current();
    list.forEach(function(v){
      if(v===active&&isVisible(v))safePlay(v,unlocked);
      else{try{v.pause();}catch(e){}}
    });
  }

  function unlock(v){
    unlocked=true;
    try{sessionStorage.setItem('kt_video_sound_unlocked','1');}catch(e){}
    safePlay(v||current(),true);
  }

  function prepare(v){
    if(!v||v.dataset.ktPlaybackFixed==='1')return;
    v.dataset.ktPlaybackFixed='1';
    try{v.preload='auto';v.loop=true;v.setAttribute('playsinline','');}catch(e){}

    v.addEventListener('waiting',function(){
      if(isVisible(v))setTimeout(function(){safePlay(v,unlocked);},350);
    });
    v.addEventListener('stalled',function(){
      if(isVisible(v))setTimeout(function(){safePlay(v,unlocked);},500);
    });
    v.addEventListener('canplay',function(){
      if(isVisible(v)&&v.paused)safePlay(v,unlocked);
    });
  }

  function bindAll(){
    videos().forEach(prepare);
    if(observer){try{observer.disconnect();}catch(e){}}
    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var v=entry.target;
          if(entry.isIntersecting&&entry.intersectionRatio>=0.55)safePlay(v,unlocked);
          else{try{v.pause();}catch(e){}}
        });
      },{threshold:[0,.55,.75]});
      videos().forEach(function(v){try{observer.observe(v);}catch(e){}});
    }
    setTimeout(playCurrent,80);
  }

  /* 기존 클릭 동작은 첫 터치 때 소리를 켠 뒤 영상이 멈추는 문제가 있어 이 영상에 대해서만 교체 */
  document.addEventListener('click',function(e){
    var v=e.target&&e.target.closest?e.target.closest('.kt-public-video'):null;
    if(!v)return;
    try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(err){}

    if(!unlocked||v.muted){
      unlock(v);
      return;
    }
    if(v.paused)safePlay(v,true);
    else{try{v.pause();}catch(err){}}
  },true);

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(playCurrent,120);
  });
  window.addEventListener('focus',function(){setTimeout(playCurrent,120);});
  window.addEventListener('pageshow',function(){setTimeout(playCurrent,160);});

  try{
    new MutationObserver(function(){clearTimeout(window.__ktVideoFeedPlaybackBindTimer);window.__ktVideoFeedPlaybackBindTimer=setTimeout(bindAll,80);})
      .observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){
    if(document.body&&document.body.classList.contains('kt-video-mode'))playCurrent();
  },1800);
  setTimeout(bindAll,200);
})();
