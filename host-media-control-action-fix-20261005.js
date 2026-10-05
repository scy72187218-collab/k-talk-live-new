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
      if(document.querySelector('#screen .kt-remote-live'))return null;
    }catch(e){}
    return room;
  }

  function stream(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getTracks)return s;
    }catch(e){}
    return null;
  }

  function setState(btn,kind,on){
    try{
      btn.classList.toggle('kt-media-off',!on);
      btn.classList.toggle('off',!on);
      var sp=btn.querySelector('span');
      if(sp){
        if(kind==='camera')sp.textContent=on?'카메라':'카메라 꺼짐';
        if(kind==='mic')sp.textContent=on?'마이크':'마이크 잠금';
      }
    }catch(e){}
  }

  async function camera(btn){
    var s=stream(),tracks=s&&s.getVideoTracks?s.getVideoTracks():[];
    var live=tracks.filter(function(t){return t&&t.readyState==='live';});
    if(!live.length){
      try{
        if(typeof window.ensureLiveCamera==='function'){
          await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
          s=stream();live=s&&s.getVideoTracks?s.getVideoTracks().filter(function(t){return t.readyState==='live';}):[];
          live.forEach(function(t){t.enabled=true;});
          setState(btn,'camera',live.length>0);
          try{if(typeof window.ktCameraOffAvatarState20260928==='function')window.ktCameraOffAvatarState20260928(false);}catch(e){}
        }
      }catch(e){}
      return;
    }
    var on=live.some(function(t){return t.enabled!==false;});
    live.forEach(function(t){t.enabled=!on;});
    setState(btn,'camera',!on);
    try{if(typeof window.ktCameraOffAvatarState20260928==='function')window.ktCameraOffAvatarState20260928(on);}catch(e){}
  }

  async function mic(btn){
    var s=stream(),tracks=s&&s.getAudioTracks?s.getAudioTracks():[];
    var live=tracks.filter(function(t){return t&&t.readyState==='live';});
    if(!live.length){
      try{
        var a=await navigator.mediaDevices.getUserMedia({
          audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false},
          video:false
        });
        var at=a.getAudioTracks&&a.getAudioTracks()[0];
        s=stream();
        if(at&&s&&s.addTrack){
          s.addTrack(at);
          at.enabled=true;
          live=[at];
        }else if(at){
          try{at.stop();}catch(e){}
        }
      }catch(e){}
      setState(btn,'mic',live.length>0);
      try{if(window.state)state.mic=live.length>0;}catch(e){}
      return;
    }
    var on=live.some(function(t){return t.enabled!==false;});
    live.forEach(function(t){t.enabled=!on;});
    try{if(window.state)state.mic=!on;}catch(e){}
    setState(btn,'mic',!on);
  }

  function movie(){
    try{
      if(typeof window.ktOpenHostTvMovie==='function'){
        window.ktOpenHostTvMovie();
        return;
      }
      if(typeof window.showSheet==='function'){
        window.showSheet('🎬 영화 · TV · 화면공유',
          '<div class="rowbox">영화 기능을 불러오는 중입니다. 잠시 후 다시 눌러 주세요.</div>');
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

  document.addEventListener('pointerdown',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!btn||!localHostRoom(btn))return;
    var k=kind(btn);
    if(!k)return;

    /* Only take over the three existing host media buttons. */
    if(!(btn.classList.contains('kt-bottom-media-replaced')||
         btn.closest('.kt-host-admin-media-20260928')))return;

    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    if(k==='camera')camera(btn);
    else if(k==='mic')mic(btn);
    else movie();
  },true);
})();