/* K-Talk room enter/exit/rejoin cleanup (2026-09-24)
   Scope: remote-room lifecycle only.
   - Leaving a room immediately clears stale guest transport markers.
   - Re-entry then starts from a fresh viewer/guest session.
   - Does not change layout, buttons, chat, gifts, badges, direction or countdowns. */
(function(){
  if(window.__ktRoomRejoinCleanup20260924)return;
  window.__ktRoomRejoinCleanup20260924=true;

  function currentHost(){
    var h='';
    try{h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!h)try{h=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return h;
  }

  function cleanupNow(){
    var hid=currentHost();
    if(hid){
      try{
        if(typeof window.ktDirectGuestLeaveNow20260923==='function'){
          window.ktDirectGuestLeaveNow20260923(hid);
        }
      }catch(e){}
      try{
        window.dispatchEvent(new CustomEvent('kt-remote-host-left',{
          detail:{host_id:hid,at:Date.now()}
        }));
      }catch(e){}
    }
    try{window.__ktRemoteHostStream=null;}catch(e){}
    try{window.__ktRemoteHostId='';}catch(e){}
    try{window.__ktCurrentRemoteHostId='';}catch(e){}
    try{sessionStorage.removeItem('kt_remote_host_id');}catch(e){}
  }

  function wrap(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktRoomRejoinCleanupWrapped)return;
    var fn=function(){
      cleanupNow();
      return old.apply(this,arguments);
    };
    fn.__ktRoomRejoinCleanupWrapped=true;
    window[name]=fn;
  }

  function install(){
    wrap('ktLeaveRemoteLive');
    wrap('ktCloseRemotePresenceInApp20260923');
  }

  install();
  var tries=0,t=setInterval(function(){
    install();
    tries++;
    if(tries>20)clearInterval(t);
  },250);

  window.addEventListener('pagehide',cleanupNow);
})();
