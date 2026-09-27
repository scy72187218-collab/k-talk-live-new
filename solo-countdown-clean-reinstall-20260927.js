/* K-Talk SOLO countdown clean reinstall 2026-09-27
   SOLO ONLY. The room opens first, then exactly one 5→4→3→2→1 countdown runs.
   Other rooms, UI, controls, guest transport and layout are untouched. */
(function(){
  if(window.__ktSoloCountdownCleanReinstall20260927)return;
  window.__ktSoloCountdownCleanReinstall20260927=true;

  var oldStart=window.startBroadcast;
  if(typeof oldStart!=='function')return;

  function isSolo(){
    try{
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      return t==='solo'||m===1||n.indexOf('1인')>-1||title.indexOf('1인 방송')>-1;
    }catch(e){return false;}
  }

  function clearOldCountdowns(){
    [
      'ktLiveStartCountdown',
      'ktLiveCountdown',
      'ktFourRoom13StyleCountdown',
      'ktSoloFreshCountdown'
    ].forEach(function(id){
      try{
        var el=document.getElementById(id);
        if(el)el.remove();
      }catch(e){}
    });
  }

  function sleep(ms){
    return new Promise(function(resolve){setTimeout(resolve,ms);});
  }

  async function showFreshCountdown(){
    clearOldCountdowns();

    var wrap=document.createElement('div');
    wrap.id='ktSoloFreshCountdown';
    wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML=
      '<style>'+
      '#ktSoloFreshCountdown{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:rgba(0,0,0,.16);pointer-events:none;overflow:hidden;animation:ktSoloFreshBg 5.08s linear forwards}'+
      '#ktSoloFreshCountdown .kt-solo-fresh-digit{position:absolute;width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.72);border:4px solid rgba(255,255,255,.92);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.7);text-shadow:0 0 12px rgba(255,255,255,.7);opacity:0;transform:scale(1);animation:ktSoloFreshDigit .98s linear both}'+
      '#ktSoloFreshCountdown .d5{animation-delay:0s}'+
      '#ktSoloFreshCountdown .d4{animation-delay:1s}'+
      '#ktSoloFreshCountdown .d3{animation-delay:2s}'+
      '#ktSoloFreshCountdown .d2{animation-delay:3s}'+
      '#ktSoloFreshCountdown .d1{animation-delay:4s}'+
      '@keyframes ktSoloFreshDigit{0%{opacity:1;transform:scale(1)}78%{opacity:1;transform:scale(.96)}99%{opacity:1;transform:scale(.92)}100%{opacity:0;transform:scale(.92)}}'+
      '@keyframes ktSoloFreshBg{0%,97%{background:rgba(0,0,0,.16)}100%{background:rgba(0,0,0,0)}}'+
      '</style>'+
      '<div class="kt-solo-fresh-digit d5">5</div>'+
      '<div class="kt-solo-fresh-digit d4">4</div>'+
      '<div class="kt-solo-fresh-digit d3">3</div>'+
      '<div class="kt-solo-fresh-digit d2">2</div>'+
      '<div class="kt-solo-fresh-digit d1">1</div>';

    document.body.appendChild(wrap);
    await sleep(5100);
    try{wrap.remove();}catch(e){}
  }

  window.startBroadcast=async function(){
    if(!isSolo())return oldStart.apply(this,arguments);
    if(window.__ktSoloFreshCountdownRunning)return;

    window.__ktSoloFreshCountdownRunning=true;
    var savedCountdown=window.ktLiveStartCountdown;
    var self=this,args=arguments;

    try{
      clearOldCountdowns();

      /* Remove the previous generic countdown for SOLO only.
         The existing broadcast startup itself is left untouched. */
      window.ktLiveStartCountdown=async function(){return true;};

      var result=await Promise.resolve(oldStart.apply(self,args));

      /* Put the original generic function back immediately after startup. */
      if(savedCountdown)window.ktLiveStartCountdown=savedCountdown;

      /* Let the SOLO room finish its first paint, then run the new countdown once. */
      await new Promise(function(resolve){
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){setTimeout(resolve,50);});
        });
      });

      await showFreshCountdown();
      return result;
    }catch(e){
      clearOldCountdowns();
      throw e;
    }finally{
      if(savedCountdown)window.ktLiveStartCountdown=savedCountdown;
      window.__ktSoloFreshCountdownRunning=false;
    }
  };
})();
