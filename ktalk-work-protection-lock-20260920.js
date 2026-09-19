/* K-Talk 현재 정상 상태 작업 보호 잠금 (2026-09-20)
   보호 대상:
   - 채팅
   - 모든 스위치
   - 1인방 / 9명방 / 13명방 / 구독자방 / 비밀방
   - 동영상 표시/재생
   실제 터치/입장/채팅/스위치/동영상 재생 기능은 막지 않는다.
   이후 수정 작업에서 이 플래그를 확인해 보호 대상을 건드리지 않기 위한 잠금이다. */
(function(){
  if(window.__ktCurrentStateProtectionLock20260920)return;
  window.__ktCurrentStateProtectionLock20260920=true;

  var KEY='ktalk_current_state_protection_20260920';
  var locked={
    chat:true,
    switches:true,
    solo:true,
    group9:true,
    group13:true,
    subscriber:true,
    secret:true,
    videos:true
  };

  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(locked));}catch(e){}
  }

  function markAll(){
    try{
      document.documentElement.setAttribute('data-kt-work-protected','1');

      document.querySelectorAll(
        '.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
      });

      document.querySelectorAll(
        '.ktsolo-chat,.ktg13-chat,.ktsubscriber-chat,.ktsecret-chat,.kgh-chatbox,.kt-remote-chat'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
      });

      document.querySelectorAll(
        '.kt-switch,[role="switch"],.live-prep .room-switch,.live-prep .prep-bottom button'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
      });

      document.querySelectorAll('video').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
      });
    }catch(e){}
  }

  window.ktCurrentProtectionState=function(){
    return Object.assign({},locked);
  };
  window.ktIsWorkProtected=function(name){
    return !!locked[name];
  };
  window.ktLockCurrentApprovedState=function(){
    Object.keys(locked).forEach(function(k){locked[k]=true;});
    save();markAll();return true;
  };

  /* 보호 잠금은 UI 기능을 비활성화하지 않는다. */
  save();
  markAll();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(markAll,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCurrentProtectionMarkTimer);
      window.__ktCurrentProtectionMarkTimer=setTimeout(markAll,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();