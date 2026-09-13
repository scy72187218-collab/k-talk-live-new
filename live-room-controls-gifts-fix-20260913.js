/* K-Talk 라이브방 버튼/빠른선물 터치 전용 보강. 화면 배치/크기는 변경하지 않음. */
(function(){
  if(window.__ktLiveRoomControlsGiftsFix20260913)return;
  window.__ktLiveRoomControlsGiftsFix20260913=true;

  function inLiveRoom(el){
    return !!(el&&el.closest&&el.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
  }

  function roomKind(el){
    var r=el&&el.closest?el.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'):null;
    if(!r)return '';
    if(r.classList.contains('ktsolo-room'))return 'solo';
    if(r.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(r.classList.contains('ktsecret-room'))return 'secret';
    return 'group13';
  }

  function ensureStyle(){
    if(document.getElementById('ktLiveRoomControlsGiftsFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktLiveRoomControlsGiftsFixStyle';
    s.textContent=''
      +'.ktsolo-room button,.ktg13-room button,.ktsubscriber-room button,.ktsecret-room button{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'
      +'.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.ktsolo-right,.ktg13-right-quick,.ktsubscriber-right,.ktsecret-right{pointer-events:auto!important;z-index:80!important}'
      +'.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.ktsolo-right button,.ktg13-right-quick button,.ktsubscriber-right button,.ktsecret-right button,.ktsolo-gift,.ktg13-gift,.ktsubscriber-gift,.ktsecret-gift{pointer-events:auto!important;position:relative!important;z-index:81!important;cursor:pointer!important}'
      +'.ktsolo-gifts,.ktg13-gifts,.ktsubscriber-gifts,.ktsecret-gifts{pointer-events:auto!important;z-index:75!important}'
      +'.ktsolo-room .ktsolo-right{top:14px!important;bottom:auto!important;right:8px!important;transform:none!important}'
      +'.kt-live-tap-pressed{transform:scale(.94)!important;filter:brightness(1.18)!important}';
    document.head.appendChild(s);
  }

  function stopEvent(e){
    try{e.preventDefault();}catch(x){}
    try{e.stopPropagation();}catch(x){}
    try{if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
  }

  function press(btn){
    if(!btn)return;
    try{btn.classList.add('kt-live-tap-pressed');setTimeout(function(){btn.classList.remove('kt-live-tap-pressed');},130);}catch(e){}
  }

  /* 뒤집기 = 좌우 반전이 아니라 실제 앞카메라 ↔ 뒷카메라 전환 */
  async function flipCamera(){
    var current=(window.state&&state.cameraFacing)||'user';
    var next=current==='environment'?'user':'environment';
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;

      var oldStream=(window.state&&state.stream)?state.stream:null;
      var audioTracks=[];
      if(oldStream&&oldStream.getAudioTracks){
        audioTracks=oldStream.getAudioTracks().filter(function(t){return t.readyState==='live';});
      }

      /* 휴대폰에서 반대쪽 카메라를 열 수 있게 기존 영상 트랙만 먼저 해제 */
      if(oldStream&&oldStream.getVideoTracks){
        oldStream.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});
      }

      var videoStream=null;
      var base={width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}};
      try{
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }catch(firstErr){
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }

      var tracks=[];
      if(videoStream&&videoStream.getVideoTracks)tracks=tracks.concat(videoStream.getVideoTracks());
      tracks=tracks.concat(audioTracks);
      var merged=new MediaStream(tracks);

      if(window.state){
        state.stream=merged;
        state.cameraFacing=next;
      }

      document.querySelectorAll('#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          v.srcObject=merged;
          v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
      return true;
    }catch(e){
      try{if(window.state)state.cameraFacing=current;}catch(x){}
      return false;
    }
  }

  function attendance(){
    try{
      if(typeof window.ktAttendanceCheck==='function'){window.ktAttendanceCheck();return;}
      if(typeof window.openAttendanceBenefits==='function'){window.openAttendanceBenefits();return;}
    }catch(e){}
  }

  function like(){
    try{
      if(typeof window.ktUnifiedQuickLike==='function'){window.ktUnifiedQuickLike();return;}
      if(typeof window.addHostLike==='function'){window.addHostLike(1);return;}
    }catch(e){}
    ['hostLikeCount','ktg13LikeCount'].forEach(function(id){
      var n=document.getElementById(id);if(n)n.textContent=String((parseInt(n.textContent||'0',10)||0)+1);
    });
  }

  function effect(kind){
    try{
      if(typeof window.ktUnifiedQuickEffect==='function'){window.ktUnifiedQuickEffect(kind==='solo'?'solo':'group13');return;}
      if(kind==='solo'&&typeof window.ktSoloEffect==='function'){window.ktSoloEffect();return;}
      if(kind==='subscriber'&&typeof window.ktSubscriberEffect==='function'){window.ktSubscriberEffect();return;}
      if(kind==='secret'&&typeof window.ktSecretEffect==='function'){window.ktSecretEffect();return;}
      if(typeof window.ktGroup13Effect==='function'){window.ktGroup13Effect();return;}
      if(typeof window.openEditEffectPanel==='function'){window.openEditEffectPanel();return;}
    }catch(e){}
  }

  function treasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
      if(typeof window.openTreasure==='function'){window.openTreasure();return;}
      if(typeof window.openGifts==='function'){window.openGifts();return;}
    }catch(e){}
  }

  function match(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
      if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
      if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}
    }catch(e){}
  }

  function sendQuickGift(btn){
    var t=String(btn.textContent||'').replace(/\s+/g,'');
    try{
      if(t.indexOf('선물상자')>-1||t.indexOf('큰선물보기')>-1){
        if(typeof window.openGifts==='function')window.openGifts();
        return true;
      }
      var name='',count=0;
      if(t.indexOf('장미다발')>-1){name='장미다발';count=50;}
      else if(t.indexOf('특대장미')>-1){name='특대장미';count=100;}
      else if(t.indexOf('스포츠카')>-1){name='스포츠카';count=50;}
      else if(t.indexOf('왕관')>-1){name='왕관';count=100;}
      else if(t.indexOf('하트')>-1){name='하트';count=10;}
      else if(t.indexOf('장미')>-1){name='장미';count=1;}
      if(!name)return false;
      if(typeof window.giftSend==='function')window.giftSend(name,count);
      else if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{name:name,count:count});
      return true;
    }catch(e){return false;}
  }

  function isQuickGift(btn){
    return !!(btn&&btn.matches&&btn.matches('.ktsolo-gift,.ktg13-gift,.ktsubscriber-gift,.ktsecret-gift'));
  }

  function handle(e){
    var btn=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!btn||!inLiveRoom(btn))return;

    if(isQuickGift(btn)){
      stopEvent(e);press(btn);sendQuickGift(btn);return;
    }

    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var aria=String(btn.getAttribute('aria-label')||'').replace(/\s+/g,'');
    var key=text+' '+aria;
    var kind=roomKind(btn);

    if(btn.matches('.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att')||key.indexOf('출석체크')>-1){
      stopEvent(e);press(btn);attendance();return;
    }
    if(key.indexOf('뒤집기')>-1||key.indexOf('되돌리기')>-1){
      stopEvent(e);press(btn);flipCamera();return;
    }
    if(key.indexOf('좋아요')>-1){
      stopEvent(e);press(btn);like();return;
    }
    if(key.indexOf('효과')>-1){
      stopEvent(e);press(btn);effect(kind);return;
    }
    if(key.indexOf('보물상자')>-1){
      stopEvent(e);press(btn);treasure();return;
    }
    if(key.indexOf('매치')>-1){
      stopEvent(e);press(btn);match();return;
    }
  }

  ensureStyle();
  window.addEventListener('click',handle,true);
  setInterval(ensureStyle,1500);
})();
