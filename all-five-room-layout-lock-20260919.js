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
    group13:false,
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
        else if(type==='group13')room.removeAttribute('data-kt-layout-locked');
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
    locked={solo:true,group9:true,group13:false,subscriber:true,secret:true};
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