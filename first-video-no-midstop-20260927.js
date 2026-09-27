/* K-Talk: keep the first public video playing to the end.
   Only prevents accidental/script pauses while the first video is actually visible.
   A user's own tap-to-pause is respected. */
(function(){
  if(window.__ktFirstVideoNoMidStop20260927)return;
  window.__ktFirstVideoNoMidStop20260927=true;

  var manualPauseUntil=0;
  var reentry=false;

  function firstVideo(){
    return document.querySelector('#screen .kt-public-video, #screen #homeVideo, #ktPublicFirstPaintVideo');
  }

  function isVisible(v){
    if(!v || document.hidden)return false;
    try{
      var r=v.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight||0;
      var visible=Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0));
      return r.height>0 && visible>=Math.min(r.height*.55,vh*.55);
    }catch(e){return true;}
  }

  function markManual(e){
    var v=e.target&&e.target.closest?e.target.closest('video'):null;
    if(!v || v!==firstVideo())return;
    if(!v.paused && !v.ended)manualPauseUntil=Date.now()+1200;
  }

  function keepGoing(v){
    if(!v || v!==firstVideo() || !isVisible(v))return;
    if(Date.now()<manualPauseUntil)return;
    if(reentry)return;
    reentry=true;
    setTimeout(function(){
      try{
        if(v===firstVideo() && isVisible(v) && Date.now()>=manualPauseUntil && (v.paused||v.ended)){
          if(v.ended){
            try{v.currentTime=0;}catch(e){}
          }
          var p=v.play();
          if(p&&p.catch)p.catch(function(){});
        }
      }catch(e){}
      reentry=false;
    },70);
  }

  function bind(v){
    if(!v || v.dataset.ktNoMidStop20260927==='1')return;
    v.dataset.ktNoMidStop20260927='1';
    v.addEventListener('pause',function(){keepGoing(v);});
    v.addEventListener('ended',function(){keepGoing(v);});
    v.addEventListener('stalled',function(){keepGoing(v);});
    v.addEventListener('waiting',function(){
      setTimeout(function(){keepGoing(v);},220);
    });
    v.addEventListener('canplay',function(){keepGoing(v);});
    v.addEventListener('playing',function(){
      try{v.dataset.ktPlaybackStarted20260927='1';}catch(e){}
    });
  }

  document.addEventListener('pointerdown',markManual,true);
  document.addEventListener('touchstart',markManual,true);

  function scan(){
    bind(firstVideo());
  }

  scan();
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(scan,60);
  });

  try{
    new MutationObserver(function(){scan();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){
    var v=firstVideo();
    bind(v);
    if(v && v.paused && !v.ended)keepGoing(v);
  },1200);
})();