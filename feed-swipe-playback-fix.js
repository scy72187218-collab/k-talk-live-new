/* K-Talk 공개 동영상 넘김 재생 보강: 재생 실패/멈춤 영상은 재시도 후 자동 건너뜀. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktFeedSwipePlaybackFixInstalled)return;
  window.__ktFeedSwipePlaybackFixInstalled=true;

  function isFeedVideo(v){return !!(v&&v.classList&&v.classList.contains('kt-public-video'));}
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

  function playVideo(v,force){
    if(!isFeedVideo(v)||v.dataset.ktFeedBroken==='1')return;
    try{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');}catch(e){}
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
    try{v.preload='auto';v.muted=true;v.defaultMuted=true;v.setAttribute('playsinline','');}catch(e){}
    v.addEventListener('loadeddata',function(){v.dataset.ktFeedRetry='0';clearTimeout(v.__ktFeedWatch);});
    v.addEventListener('canplay',function(){v.dataset.ktFeedRetry='0';clearTimeout(v.__ktFeedWatch);});
    v.addEventListener('error',function(){retryOrSkip(v);});
    v.addEventListener('stalled',function(){
      clearTimeout(v.__ktFeedStall);
      v.__ktFeedStall=setTimeout(function(){if(v.readyState<2)retryOrSkip(v);},3000);
    });
  }

  function activeByPosition(){
    var sc=feedScroller();
    if(!sc)return;
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
      if(v===best)playVideo(v,false);
      else{try{v.pause();}catch(e){}}
    });
  }

  function install(){
    var videos=[].slice.call(document.querySelectorAll('.kt-public-video'));
    videos.forEach(setupVideo);
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
    activeByPosition();
  }

  clearBadCache();

  var oldHome=window.home;
  if(typeof oldHome==='function'&&!oldHome.__ktFeedSwipeFresh){
    var h=function(){clearBadCache();var r=oldHome.apply(this,arguments);setTimeout(install,60);setTimeout(install,500);return r;};
    h.__ktFeedSwipeFresh=true;
    window.home=h;
  }
  var oldMedia=window.media;
  if(typeof oldMedia==='function'&&!oldMedia.__ktFeedSwipeFresh){
    var m=function(){clearBadCache();var r=oldMedia.apply(this,arguments);setTimeout(install,60);setTimeout(install,500);return r;};
    m.__ktFeedSwipeFresh=true;
    window.media=m;
  }

  try{
    new MutationObserver(function(list){
      var found=false;
      list.forEach(function(rec){
        [].slice.call(rec.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          if(n.matches&&n.matches('.kt-public-video')){setupVideo(n);found=true;}
          if(n.querySelectorAll){[].slice.call(n.querySelectorAll('.kt-public-video')).forEach(function(v){setupVideo(v);found=true;});}
        });
      });
      if(found)setTimeout(install,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(install,80);
})();
