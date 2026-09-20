/* K-Talk 현재 정상 상태 작업 보호 잠금 (2026-09-20)
   보호 대상:
   - 채팅
   - 모든 스위치
   - 1인방 / 9명방 / 13명방 / 구독자방 / 비밀방
   - 동영상 표시/재생
   - 현재 정상 동영상 통신/공용 동영상 목록 연결
   - 현재 정상 영상 송수신 경로
   빨간 LIVE 신호는 아직 작업 대상이므로 보호 잠금에서 제외한다.
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
    videos:false,
    videoFeed:false,
    videoCommunication:false,
    mediaTransport:false,
    liveSignal:false,
    publicVideoSideActions:true,
    publicVideoRoseButton:true,
    publicVideoRoseCount:true,
    publicVideoMessageLabel:true,
    publicVideoProfileButton:true,
    publicVideoShareButton:true,
    aiVoice:true,
    helpReader:true
  };

  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(locked));}catch(e){}
  }

  function markAll(){
    try{
      document.documentElement.setAttribute('data-kt-work-protected','selective');

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

      document.querySelectorAll('.vh-actions').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.removeAttribute('data-kt-public-video-actions-unlocked');
      });

      document.querySelectorAll('video,.kt-public-feed-scroller,.kt-public-video').forEach(function(el){
        el.removeAttribute('data-kt-work-protected');
        el.removeAttribute('data-kt-video-communication-protected');
      });

      document.querySelectorAll(
        '.kt-setting-row,.kt-switch,[role="switch"],[data-bottom="help"]'
      ).forEach(function(el){
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
    /* 전체 잠금 금지: 현재 명시적으로 승인된 항목만 잠근다. */
    locked.chat=true;
    locked.switches=true;
    locked.solo=true;
    locked.group9=true;
    locked.group13=true;
    locked.subscriber=true;
    locked.secret=true;
    locked.aiVoice=true;
    locked.helpReader=true;
    locked.videos=false;
    locked.videoFeed=false;
    locked.videoCommunication=false;
    locked.mediaTransport=false;
    locked.liveSignal=false;
    locked.publicVideoSideActions=true;
    locked.publicVideoRoseButton=true;
    locked.publicVideoRoseCount=true;
    locked.publicVideoMessageLabel=true;
    locked.publicVideoProfileButton=true;
    locked.publicVideoShareButton=true;
    save();markAll();return true;
  };
  window.ktIsLiveSignalWorkAllowed=function(){
    return locked.liveSignal===false;
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