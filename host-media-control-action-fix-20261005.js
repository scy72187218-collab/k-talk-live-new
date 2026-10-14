/* K-Talk host media controls action repair - 1111
   Scope ONLY: existing host Camera / Mic / Movie buttons.
   Does not change room layout, match, gifts, chat, earnings or guest controls. */
(function(){
  if(window.__ktHostMediaControlRepair20261005)return;
  window.__ktHostMediaControlRepair20261005=true;

  function localHostRoom(el){
    var room=el&&el.closest?el.closest(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .ktg9-room'
    ):null;
    if(!room)return null;
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return null;
      if(room.closest&&room.closest('.kt-remote-live'))return null;
    }catch(e){}
    return room;
  }

  function stream(){
    try{
      var s=window.state&&window.state.stream;
      if(s&&s.getTracks)return s;
      var v=document.getElementById('camera');
      if(v&&v.srcObject&&v.srcObject.getTracks)return v.srcObject;
      v=document.querySelector('#screen .ktsolo-main video,#screen .ktg13-host video,#screen .ktg9-host video,#screen .ktsubscriber-host video,#screen .ktsecret-slot.host video');
      if(v&&v.srcObject&&v.srcObject.getTracks)return v.srcObject;
    }catch(e){}
    return null;
  }

  function setState(btn,kind,on){
    try{
      btn.classList.toggle('kt-media-off',!on);
      btn.classList.toggle('off',!on);
      btn.setAttribute('aria-pressed',on?'true':'false');
      var sp=btn.querySelector('span');
      var icon=btn.querySelector('i,b');
      if(sp){
        if(kind==='camera')sp.textContent=on?'카메라':'카메라 꺼짐';
        if(kind==='mic')sp.textContent=on?'마이크':'마이크 잠금';
      }
      if(icon){
        if(kind==='camera')icon.textContent=on?'📷':'🚫';
        if(kind==='mic')icon.textContent=on?'🎤':'🔇';
      }
    }catch(e){}
  }

  function hostVideo(room){
    if(!room)return null;
    try{
      return room.querySelector(
        '.ktsolo-main video,'+
        '.ktg9-host video,'+
        '.ktg13-host video,'+
        '.ktsubscriber-host video,'+
        '.ktsecret-slot.host video,'+
        'video#ktLiveVideo'
      );
    }catch(e){return null;}
  }

  function paintCamera(room,on){
    try{
      var v=hostVideo(room);
      if(!v)return;
      if(on){
        v.style.removeProperty('opacity');
        v.style.removeProperty('visibility');
        v.style.removeProperty('background');
        var s=stream();
        if(s&&v.srcObject!==s)v.srcObject=s;
        var p=v.play&&v.play();if(p&&p.catch)p.catch(function(){});
      }else{
        v.style.setProperty('opacity','0','important');
        v.style.setProperty('background','#08090c','important');
      }
      var host=v.closest('.ktsolo-main,.ktg9-host,.ktg13-host,.ktsubscriber-host,.ktsecret-slot.host');
      if(host){
        var mark=host.querySelector(':scope > .kt-host-camera-off-mark');
        if(!on&&!mark){
          mark=document.createElement('div');
          mark.className='kt-host-camera-off-mark';
          mark.textContent='📷 카메라 꺼짐';
          mark.style.cssText='position:absolute;inset:0;display:grid;place-items:center;z-index:6;background:#08090c;color:#fff;font-weight:900;font-size:13px;pointer-events:none';
          host.appendChild(mark);
        }else if(on&&mark){mark.remove();}
      }
    }catch(e){}
  }

  function mediaFailure(btn,k,error){
    var name=error&&error.name||'';
    var text=name==='NotAllowedError'?'카메라·마이크 권한을 허용해 주세요.':name==='NotFoundError'?'연결된 카메라·마이크를 찾을 수 없습니다.':name==='NotReadableError'?'다른 앱에서 카메라·마이크를 사용 중인지 확인해 주세요.':'카메라·마이크를 연결하지 못했습니다. 다시 눌러 주세요.';
    btn.setAttribute('title',text);btn.setAttribute('aria-label',text);
    if(typeof window.showToast==='function')window.showToast(text);else window.alert(text);
  }
  async function acquire(kind){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('media_unavailable');
    var captured=await navigator.mediaDevices.getUserMedia(kind==='camera'?{
      video:{facingMode:(window.state&&window.state.cameraFacing)||'user',width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}},audio:false
    }:{audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false},video:false});
    var base=stream();
    if(!base)base=captured;
    else {base.getTracks().forEach(function(t){if(t.readyState==='ended'&&base.removeTrack)base.removeTrack(t);});captured.getTracks().forEach(function(t){base.addTrack(t);});}
    if(window.state)window.state.stream=base;
    return base;
  }
  async function camera(btn){
    if(btn.__ktMediaBusy)return;btn.__ktMediaBusy=true;
    try{
      var s=stream(),live=s&&s.getVideoTracks?s.getVideoTracks().filter(function(t){return t.readyState==='live';}):[];
      var on;
      if(!live.length){
        s=await acquire('camera');live=s.getVideoTracks().filter(function(t){return t.readyState==='live';});on=true;
        if(!live.length)throw new Error('camera_missing');
      }else on=!live.some(function(t){return t.enabled!==false;});
      live.forEach(function(t){t.enabled=on;});
      setState(btn,'camera',on);paintCamera(localHostRoom(btn),on);
      if(typeof window.ktCameraOffAvatarState20260928==='function')window.ktCameraOffAvatarState20260928(!on);
    }catch(e){mediaFailure(btn,'camera',e);}finally{btn.__ktMediaBusy=false;}
  }
  async function mic(btn){
    if(btn.__ktMediaBusy)return;btn.__ktMediaBusy=true;
    try{
      var s=stream(),live=s&&s.getAudioTracks?s.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];
      var on;
      if(!live.length){
        s=await acquire('mic');live=s.getAudioTracks().filter(function(t){return t.readyState==='live';});on=true;
        if(!live.length)throw new Error('microphone_missing');
      }else on=!live.some(function(t){return t.enabled!==false;});
      live.forEach(function(t){t.enabled=on;});
      if(window.state)window.state.mic=on;
      setState(btn,'mic',on);
    }catch(e){mediaFailure(btn,'mic',e);}finally{btn.__ktMediaBusy=false;}
  }

  function movie(){
    try{
      if(typeof window.ktOpenHostTvMovie==='function'){
        window.ktOpenHostTvMovie();
        return;
      }
      if(typeof window.openHostMovieRoom==='function'){
        window.openHostMovieRoom();
        return;
      }
      if(typeof window.showSheet==='function'){
        window.showSheet('🎬 영화 · TV · 화면공유',
          '<div class="rowbox"><b>영화 기능 연결 확인 중</b><br>동영상 선택·화면공유 기능을 다시 불러와 주세요.</div>');
      }
    }catch(e){}
  }

  function kind(btn){
    var t=String(btn&&btn.textContent||'').replace(/\s+/g,'');
    if(t.indexOf('카메라')>-1)return 'camera';
    if(t.indexOf('마이크')>-1)return 'mic';
    if(t.indexOf('영화')>-1||t.indexOf('TV')>-1||t.indexOf('유튜브')>-1)return 'movie';
    return '';
  }

  window.ktBottomCameraToggle=function(btn){if(localHostRoom(btn))camera(btn);return false;};
  window.ktBottomMicToggle=function(btn){if(localHostRoom(btn))mic(btn);return false;};
  window.ktBottomMovieOpen=function(){movie();return false;};

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!btn||!localHostRoom(btn))return;
    var k=kind(btn);
    if(!k)return;

    /* Only take over the three existing host media buttons. */
    if(!(btn.classList.contains('kt-bottom-media-replaced')||
         btn.closest('.kt-host-admin-media-20260928,.ktsolo-tools,.ktg13-tools,.ktg9-tools,.ktsubscriber-tools,.ktsecret-tools')))return;

    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    if(k==='camera')camera(btn);
    else if(k==='mic')mic(btn);
    else movie();
  },true);
})();