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
      /* 2026-09-26: also close the viewer receive transport.
         Without this, re-entering the same host could reuse a stale viewer
         PC/socket and remain on "방송 영상 연결 중...". */
      try{
        if(typeof window.ktDirectRemoteLeaveNow20260924==='function'){
          window.ktDirectRemoteLeaveNow20260924(hid);
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

  function inRemoteRoom(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
        !!document.querySelector('.kt-remote-live,.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-hostlike-room');
    }catch(e){return false;}
  }

  function fastReturnNow(){
    if(!inRemoteRoom())return;
    try{document.documentElement.classList.remove('kt-remote-viewing');}catch(e){}
    try{
      var s=document.getElementById('screen');
      if(s)s.style.pointerEvents='none';
    }catch(e){}
    setTimeout(function(){
      try{
        var s=document.getElementById('screen');
        if(s)s.style.pointerEvents='';
      }catch(e){}
    },120);
    try{
      if(typeof window.ktShowSharedServerFeed==='function'){
        window.ktShowSharedServerFeed();
        return;
      }
      if(typeof window.ktForceHomeVideoRecovery==='function'){
        window.ktForceHomeVideoRecovery(true);
        return;
      }
      if(typeof window.home==='function')window.home();
    }catch(e){}
  }

  function wrap(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktRoomRejoinCleanupWrapped)return;
    var fn=function(){
      /* silent=true is an internal reconnect, not a real user exit.
         Keep the viewer inside the live room while transport is rebuilt. */
      var silent=arguments&&arguments.length&&arguments[0]===true;
      if(silent)return old.apply(this,arguments);

      var wasRemote=inRemoteRoom();
      if(wasRemote)fastReturnNow();
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

  document.addEventListener('click',function(e){
    try{
      if(!inRemoteRoom())return;
      var b=e.target&&e.target.closest?e.target.closest('button,.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'):null;
      if(!b)return;
      var t=String(b.textContent||'').replace(/\s+/g,'');
      var isExit=!!(b.matches&&b.matches('.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'))||
        t.indexOf('나가기')>-1||t.indexOf('퇴장')>-1||t.indexOf('뒤로')>-1;
      if(!isExit)return;
      fastReturnNow();
      setTimeout(cleanupNow,0);
    }catch(_e){}
  },true);

  window.addEventListener('pagehide',cleanupNow);
})();
