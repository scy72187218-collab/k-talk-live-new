/* K-Talk broadcast-end session reset (2026-09-23)
   Host broadcast end/back only: clear guest/session transport first, then run the existing exit. */
(function(){
  if(window.__ktBroadcastEndSessionReset20260923)return;
  window.__ktBroadcastEndSessionReset20260923=true;

  function reset(){
    try{
      if(typeof window.ktDirectHostRunEnded20260924==='function'){
        window.ktDirectHostRunEnded20260924();
        return;
      }
      if(typeof window.ktDirectEndAllGuestSessions20260923==='function'){
        window.ktDirectEndAllGuestSessions20260923();
      }
    }catch(e){}
  }

  function wrap(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktBroadcastEndResetWrapped)return;
    var fn=function(){
      reset();
      return old.apply(this,arguments);
    };
    fn.__ktBroadcastEndResetWrapped=true;
    window[name]=fn;
  }

  wrap('endBroadcastEarnings');
  wrap('leaveBroadcastToDashboard');
  setTimeout(function(){
    wrap('endBroadcastEarnings');
    wrap('leaveBroadcastToDashboard');
  },300);
})();