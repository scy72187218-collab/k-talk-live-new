/* K-Talk 공개 동영상 재생 보강: 동영상 페이지를 떠나면 영상/소리는 즉시 멈추고, 돌아오면 보던 위치에서 다시 재생. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktFeedSwipePlaybackFixInstalled)return;
  window.__ktFeedSwipePlaybackFixInstalled=true;

  function isFeedVideo(v){return !!(v&&v.classList&&v.classList.contains('kt-public-video'));}
  function isHomeVideo(v){return !!(v&&v.id==='homeVideo');}
  function isPlaybackVideo(v){return isFeedVideo(v)||isHomeVideo(v);}
  function feedSection(v){return v&&v.closest?v.closest('section'):null;}
  function feedScroller(){
    var v=document.querySelector('.kt-public-video');
    var s=feedSection(v);
    return s&&s.parentElement?s.parentElement:null;
  }

  function clearBadCache(){
    try{
      var last=Number(sessionStorage.getItem('kt_feed_fresh_at')||0);
      if(Date.now()-last>15000){
        localStorage.removeItem('ktalk_fast_feed');
        sessionStorage.setItem('kt_feed_fresh_at',String(Date.now()));
      }
    }catch(e){}
  }

  function saveSound(v){
    if(!isPlaybackVideo(v))return;
    try{
      sessionStorage.setItem('kt_video_muted',v.muted?'1':'0');
      sessionStorage.setItem('kt_video_volume',String(typeof v.volume==='number'?v.volume:1));
    }catch(e){}
  }

  function restoreSound(v){
    if(!isPlaybackVideo(v))return;
    try{
      var muted=sessionStorage.getItem('kt_video_muted');
      var volume=sessionStorage.getItem('kt_video_volume');
      if(muted!==null)v.muted=(muted==='1');
      if(volume!==null){
        var n=Number(volume);
        if(isFinite(n))v.volume=Math.max(0,Math.min(1,n));
      }
    }catch(e){}
  }

  function setupSoundMemory(v){
    if(!isPlaybackVideo(v)||v.dataset.ktSoundMemory==='1')return;
    v.dataset.ktSoundMemory='1';
    restoreSound(v);
    v.addEventListener('volumechange',function(){saveSound(v);});
    v.addEventListener('play',function(){if(!v.muted)saveSound(v);});
  }

  function pausePlayback(v){
    if(!isPlaybackVideo(v))return;
    try{saveSound(v);}catch(e){}
    try{v.pause();}catch(e){}
  }

  function pauseAllPlayback(){
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo').forEach(function(v){pausePlayback(v);});
    }catch(e){}
  }

  function pauseRemovedNode(n){
    if(!n||n.nodeType!==1)return;
    if(isPlaybackVideo(n))pausePlayback(n);
    if(n.querySelectorAll){
      try{n.querySelectorAll('.kt-public-video,#homeVideo').forEach(function(v){pausePlayback(v);});}catch(e){}
    }
  }

  function isVisiblePlayback(v){
    if(!v||!v.isConnected)return false;
    try{
      var cs=window.getComputedStyle(v);
      if(cs.display==='none'||cs.visibility==='hidden')return false;
      var r=v.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight||0;
      var vw=window.innerWidth||document.documentElement.clientWidth||0;
      return r.width>1&&r.height>1&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw;
    }catch(e){return false;}
  }

  function pausePlaybackNotVisible(){
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo').forEach(function(v){
        if(!isVisiblePlayback(v))pausePlayback(v);
      });
    }catch(e){}
  }

  function nextPlayableSection(section){
    if(!section)return null;
    var n=section.nextElementSibling;
    while(n){
      var v=n.querySelector&&n.querySelector('.kt-public-video');
      if(v&&!v.dataset.ktFeedBroken)return n;
      n=n.nextElementSibling;
    }
    var p=section.previousElementSibling;
    while(p){
      var pv=p.querySelector&&p.querySelector('.kt-public-video');
      if(pv&&!pv.dataset.ktFeedBroken)return p;
      p=p.previousElementSibling;
    }
    return null;
  }

  function removeBroken(v){
    if(!isFeedVideo(v)||v.dataset.ktFeedBroken==='1')return;
    v.dataset.ktFeedBroken='1';
    var section=feedSection(v);
    var target=nextPlayableSection(section);
    try{v.pause();}catch(e){}
    if(section){
      section.style.display='none';
      section.setAttribute('aria-hidden','true');
    }
    if(target){
      setTimeout(function(){
        try{target.scrollIntoView({block:'start',behavior:'auto'});}catch(e){}
        var nv=target.querySelector('.kt-public-video');
        if(nv)playVideo(nv,true);
      },20);
    }
  }

  function retryOrSkip(v){
    if(!isFeedVideo(v)||v.dataset.ktFeedBroken==='1')return;
    var count=Number(v.dataset.ktFeedRetry||0);
    if(count<1){
      v.dataset.ktFeedRetry=String(count+1);
      try{v.pause();}catch(e){}
      try{v.load();}catch(e){}
      setTimeout(function(){playVideo(v,true);},180);
      return;
    }
    removeBroken(v);
  }

  function playElement(v,force){
    if(!isPlaybackVideo(v))return;
    setupSoundMemory(v);
    restoreSound(v);
    try{
      v.preload='auto';
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      if(force&&v.readyState===0){try{v.load();}catch(e){}}
      var p=v.play();
      if(p&&p.catch)p.catch(function(){
        setTimeout(function(){
          if(document.hidden)return;
          try{v.play().catch(function(){});}catch(e){}
        },180);
      });
    }catch(e){}
  }

  function playVideo(v,force){
    if(!isFeedVideo(v)||v.dataset.ktFeedBroken==='1')return;
    setupSoundMemory(v);
    restoreSound(v);
    if(force&&v.readyState===0){try{v.load();}catch(e){}}
    var before=Number(v.currentTime||0);
    try{
      var p=v.play();
      if(p&&p.catch)p.catch(function(err){
        var name=String(err&&err.name||'');
        if(name==='NotSupportedError'||name==='EncodingError')retryOrSkip(v);
      });
    }catch(e){retryOrSkip(v);}
    clearTimeout(v.__ktFeedWatch);
    v.__ktFeedWatch=setTimeout(function(){
      if(v.dataset.ktFeedBroken==='1')return;
      var moved=Math.abs(Number(v.currentTime||0)-before)>.05;
      if(v.readyState<2&&!moved)retryOrSkip(v);
    },3500);
  }

  function setupVideo(v){
    if(!isFeedVideo(v)||v.dataset.ktFeedSetup==='1')return;
    v.dataset.ktFeedSetup='1';
    try{v.preload='auto';v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');}catch(e){}
    setupSoundMemory(v);
    v.addEventListener('loadeddata',function(){v.dataset.ktFeedRetry='0';clearTimeout(v.__ktFeedWatch);});
    v.addEventListener('canplay',function(){v.dataset.ktFeedRetry='0';clearTimeout(v.__ktFeedWatch);});
    v.addEventListener('error',function(){retryOrSkip(v);});
    v.addEventListener('stalled',function(){
      clearTimeout(v.__ktFeedStall);
      v.__ktFeedStall=setTimeout(function(){if(v.readyState<2)retryOrSkip(v);},3000);
    });
  }

  function setupHomeVideo(){
    var v=document.getElementById('homeVideo');
    if(!v)return;
    try{v.preload='auto';v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');}catch(e){}
    setupSoundMemory(v);
  }

  function activeByPosition(){
    if(document.hidden){pauseAllPlayback();return;}
    var sc=feedScroller();
    if(!sc){
      var hv=document.getElementById('homeVideo');
      if(hv&&isVisiblePlayback(hv))playElement(hv,false);
      else if(hv)pausePlayback(hv);
      return;
    }
    var videos=[].slice.call(sc.querySelectorAll('.kt-public-video')).filter(function(v){return v.dataset.ktFeedBroken!=='1'&&feedSection(v)&&feedSection(v).style.display!=='none';});
    if(!videos.length)return;
    var box=sc.getBoundingClientRect();
    var center=box.top+box.height/2;
    var best=null,dist=Infinity;
    videos.forEach(function(v){
      setupVideo(v);
      var r=feedSection(v).getBoundingClientRect();
      var d=Math.abs((r.top+r.bottom)/2-center);
      if(d<dist){dist=d;best=v;}
    });
    videos.forEach(function(v){
      if(v===best&&isVisiblePlayback(v))playVideo(v,false);
      else pausePlayback(v);
    });
  }

  function install(){
    var videos=[].slice.call(document.querySelectorAll('.kt-public-video'));
    videos.forEach(setupVideo);
    setupHomeVideo();
    var sc=feedScroller();
    if(sc&&sc.dataset.ktFeedScrollFix!=='1'){
      sc.dataset.ktFeedScrollFix='1';
      var timer=0;
      sc.addEventListener('scroll',function(){
        clearTimeout(timer);
        timer=setTimeout(activeByPosition,90);
      },{passive:true});
      sc.addEventListener('touchend',function(){setTimeout(activeByPosition,40);},{passive:true});
    }
    pausePlaybackNotVisible();
    activeByPosition();
  }

  clearBadCache();

  var oldHome=window.home;
  if(typeof oldHome==='function'&&!oldHome.__ktFeedSwipeFresh){
    var h=function(){clearBadCache();var r=oldHome.apply(this,arguments);setTimeout(install,20);setTimeout(install,120);setTimeout(install,500);return r;};
    h.__ktFeedSwipeFresh=true;
    window.home=h;
  }
  var oldMedia=window.media;
  if(typeof oldMedia==='function'&&!oldMedia.__ktFeedSwipeFresh){
    var m=function(){clearBadCache();var r=oldMedia.apply(this,arguments);setTimeout(install,20);setTimeout(install,120);setTimeout(install,500);return r;};
    m.__ktFeedSwipeFresh=true;
    window.media=m;
  }

  try{
    new MutationObserver(function(list){
      var found=false;
      list.forEach(function(rec){
        [].slice.call(rec.removedNodes||[]).forEach(function(n){pauseRemovedNode(n);});
        [].slice.call(rec.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          if(n.matches&&n.matches('.kt-public-video')){setupVideo(n);found=true;}
          if(n.id==='homeVideo'){setupHomeVideo();found=true;}
          if(n.querySelectorAll){[].slice.call(n.querySelectorAll('.kt-public-video')).forEach(function(v){setupVideo(v);found=true;});}
          if(n.querySelector&&n.querySelector('#homeVideo')){setupHomeVideo();found=true;}
        });
      });
      setTimeout(pausePlaybackNotVisible,0);
      if(found)setTimeout(install,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* 다른 앱/탭으로 나가면 즉시 정지, 돌아오면 보던 영상만 다시 재생 */
  function resumeAfterReturn(){
    if(document.hidden)return;
    setTimeout(install,0);
    setTimeout(install,80);
    setTimeout(activeByPosition,180);
    setTimeout(activeByPosition,500);
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)pauseAllPlayback();
    else resumeAfterReturn();
  });
  window.addEventListener('pagehide',pauseAllPlayback);
  window.addEventListener('pageshow',resumeAfterReturn);
  window.addEventListener('focus',function(){if(!document.hidden)resumeAfterReturn();});
  window.addEventListener('popstate',function(){setTimeout(pausePlaybackNotVisible,0);setTimeout(resumeAfterReturn,40);});

  /* 브라우저가 소리 있는 자동재생을 잠시 막은 경우, 동영상 화면에서 첫 터치 시에만 이어서 재생 */
  document.addEventListener('pointerdown',function(){
    if(document.hidden)return;
    var hv=document.getElementById('homeVideo');
    if(hv&&isVisiblePlayback(hv)&&hv.paused)playElement(hv,false);
    var sc=feedScroller();
    if(sc)setTimeout(activeByPosition,0);
  },{passive:true});

  setTimeout(install,40);
})();
