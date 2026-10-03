/* K-Talk 5개 방송방 현재 화면/배치 작업 잠금
   대상: 1인방, 9명방, 13명방, 구독자방, 비밀방
   방송 입장/퇴장/채팅/선물/스위치 기능은 막지 않음.
   이후 화면/배치 수정 작업에서 잠금 상태를 확인하기 위한 안전 플래그. */
(function(){
  if(window.__ktAllFiveRoomLayoutLock20260919)return;
  window.__ktAllFiveRoomLayoutLock20260919=true;

  var KEY='ktalk_room_layout_lock_20260919';
  var locked={
    solo:true,
    group9:true,
    group13:true,
    subscriber:true,
    secret:true
  };

  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(locked));}catch(e){}
  }
  function mark(){
    try{
      document.querySelectorAll('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room').forEach(function(room){
        var type='unknown';
        if(room.classList.contains('ktsolo-room'))type='solo';
        else if(room.classList.contains('ktsubscriber-room'))type='subscriber';
        else if(room.classList.contains('ktsecret-room'))type='secret';
        else if(room.classList.contains('ktg13-room')){
          type=room.getAttribute('data-kt-room')==='9'?'group9':'group13';
        }
        if(locked[type])room.setAttribute('data-kt-layout-locked','1');

      });
    }catch(e){}
  }

  window.ktRoomLayoutLockState=function(){
    return Object.assign({},locked);
  };
  window.ktIsRoomLayoutLocked=function(type){
    return !!locked[type];
  };
  window.ktLockAllFiveRoomLayouts=function(){
    locked={solo:true,group9:true,group13:true,subscriber:true,secret:true};
    save();mark();return true;
  };
  window.ktUnlockRoomLayout=function(type){
    if(Object.prototype.hasOwnProperty.call(locked,type)){
      locked[type]=false;save();mark();return true;
    }
    return false;
  };

  save();
  mark();
  [60,180,420,900,1600].forEach(function(ms){setTimeout(mark,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllFiveRoomLayoutLockTimer);
      window.__ktAllFiveRoomLayoutLockTimer=setTimeout(mark,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 2026-10-03: 9명방 현재 화면 상태 추가 잠금.
   화면/버튼 기능은 변경하지 않고 현재 배치만 보호 표시한다. */
(function(){
  if(window.__ktGroup9CurrentStateLock1111)return;
  window.__ktGroup9CurrentStateLock1111=true;

  function markGroup9Current(){
    try{
      document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"]').forEach(function(room){
        room.setAttribute('data-kt-layout-locked','1');
        room.setAttribute('data-kt-work-protected','1');
        room.setAttribute('data-kt-protected-area','group9_current_state_locked');
      });
    }catch(e){}
  }

  var oldState=window.ktRoomLayoutLockState;
  window.ktRoomLayoutLockState=function(){
    var s={solo:true,group9:true,group13:true,subscriber:true,secret:true};
    try{if(typeof oldState==='function')s=oldState()||s;}catch(e){}
    s.group9=true;
    s.group9_current_state_locked=true;
    return s;
  };

  window.ktGroup9CurrentStateLocked=function(){return true;};

  markGroup9Current();
  [40,120,300,700,1400].forEach(function(ms){setTimeout(markGroup9Current,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9CurrentStateLockTimer);
      window.__ktGroup9CurrentStateLockTimer=setTimeout(markGroup9Current,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
