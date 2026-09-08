/* K-Talk 동영상 피드 재생 안정화만 적용. 다른 화면/기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoFeedStabilityInstalled)return;
  window.__ktVideoFeedStabilityInstalled=true;

  var activeVideo=null;
  var bound=new WeakSet();
  var scrollQueued=false;

  function videos(){
    return Array.prototype.slice.call(document.querySelectorAll('video.kt-public-video'));
  }

  function visibleScore(v){
    try{
      var r=v.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight||0;
      var top=Math.max(0,r.top);
      var bottom=Math.min(vh,r.bottom);
      var visible=Math.max(0,bottom-top);
      if(visible<=0)return -1;
      var center=Math.abs((r.top+r.bottom)/2-vh/2);
      return visible*1000-center;
    }catch(e){return -1;}
  }

  function safePlay(v){
    if(!v||document.visibilityState==='hidden')return;
    try{
      v.loop=true;
      v.preload='auto';
      v.setAttribute('playsinline','');
      if(v.readyState===0&&v.src)v.load();
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function chooseActive(){
    var list=videos();
    if(!list.length){activeVideo=null;return;}
    var best=null,bestScore=-1;
    list.forEach(function(v){
      bindOne(v);
      var score=visibleScore(v);
      if(score>bestScore){best=v;bestScore=score;}
    });
    if(bestScore<0)return;
    activeVideo=best;
    list.forEach(function(v){
      if(v===best){safePlay(v);}
      else{try{if(!v.paused)v.pause();}catch(e){}}
    });
  }

  function retryVisible(v,delay){
    setTimeout(function(){
      if(v!==activeVideo&&visibleScore(v)<0)return;
      try{
        if(v.error&&v.src){
          var src=v.currentSrc||v.src;
          v.removeAttribute('src');
          v.load();
          v.src=src;
          v.load();
        }
      }catch(e){}
      safePlay(v);
    },delay||250);
  }

  function bindOne(v){
    if(!v||bound.has(v))return;
    bound.add(v);
    try{
      v.loop=true;
      v.preload='auto';
      v.setAttribute('playsinline','');
    }catch(e){}
    v.addEventListener('loadeddata',function(){if(v===activeVideo||visibleScore(v)>0)safePlay(v);});
    v.addEventListener('canplay',function(){if(v===activeVideo||visibleScore(v)>0)safePlay(v);});
    v.addEventListener('waiting',function(){if(v===activeVideo)retryVisible(v,350);});
    v.addEventListener('stalled',function(){if(v===activeVideo)retryVisible(v,600);});
    v.addEventListener('error',function(){if(v===activeVideo||visibleScore(v)>0)retryVisible(v,900);});
    v.addEventListener('ended',function(){if(v===activeVideo){try{v.currentTime=0;}catch(e){}safePlay(v);}});
  }

  function queueChoose(){
    if(scrollQueued)return;
    scrollQueued=true;
    requestAnimationFrame(function(){scrollQueued=false;chooseActive();});
  }

  document.addEventListener('scroll',queueChoose,true);
  window.addEventListener('resize',queueChoose);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(chooseActive,80);
  });
  window.addEventListener('pageshow',function(){setTimeout(chooseActive,80);});

  try{
    new MutationObserver(function(){setTimeout(chooseActive,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){
    if(document.visibilityState!=='hidden')chooseActive();
  },1200);

  setTimeout(chooseActive,0);
})();
