/* K-Talk 노래방 음질 보강: 외부 오디오 인터페이스의 에코/음악을 브라우저가 지우지 않도록 원음 입력을 우선 사용한다. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktKaraokeAudioQualityInstalled)return;
  window.__ktKaraokeAudioQualityInstalled=true;

  function live(track){return !!(track&&track.readyState==='live');}
  function externalLike(label){
    return /(usb|audio interface|interface|uac|codec|line in|stereo mix|external|인터페이스|외장|라인|스테레오 믹스)/i.test(String(label||''));
  }
  function settings(track){try{return track&&track.getSettings?track.getSettings():{};}catch(e){return {};}}
  function rawAlready(track){
    var s=settings(track);
    return s.echoCancellation===false && s.noiseSuppression===false && s.autoGainControl===false;
  }
  async function devices(){try{return await navigator.mediaDevices.enumerateDevices();}catch(e){return [];}}

  async function openRaw(deviceId){
    var base={
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      sampleRate:{ideal:48000},
      channelCount:{ideal:2}
    };
    var tries=[];
    if(deviceId){
      tries.push({audio:Object.assign({},base,{deviceId:{exact:deviceId}}),video:false});
      tries.push({audio:{deviceId:{exact:deviceId},echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
    }
    tries.push({audio:base,video:false});
    for(var i=0;i<tries.length;i++){
      try{
        var stream=await navigator.mediaDevices.getUserMedia(tries[i]);
        var t=stream.getAudioTracks&&stream.getAudioTracks()[0];
        if(live(t)){
          try{await t.applyConstraints({echoCancellation:false,noiseSuppression:false,autoGainControl:false});}catch(e){}
          return {stream:stream,track:t};
        }
        try{stream.getTracks().forEach(function(x){x.stop();});}catch(e){}
      }catch(e){}
    }
    return null;
  }

  async function prepareRawKaraokeInput(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;
    var baseStream=null,current=null;
    try{baseStream=window.state&&state.stream;current=baseStream&&baseStream.getAudioTracks&&baseStream.getAudioTracks()[0];}catch(e){}

    /* 이미 원음 모드로 잡힌 같은 입력이면 그대로 사용한다. */
    if(live(current)&&rawAlready(current)){
      try{state.__ktKaraokeRawAudio=true;}catch(e){}
      return true;
    }

    var list=await devices();
    var currentSettings=settings(current);
    var targetId=currentSettings.deviceId||'';
    var preferred=list.find(function(d){return d&&d.kind==='audioinput'&&externalLike(d.label);});

    /* 외부 인터페이스가 보이면 그것을 가장 먼저 사용한다. */
    if(preferred&&preferred.deviceId)targetId=preferred.deviceId;
    if(!targetId&&current&&current.label){
      var same=list.find(function(d){return d&&d.kind==='audioinput'&&d.label===current.label;});
      if(same)targetId=same.deviceId||'';
    }

    var opened=await openRaw(targetId);
    if(!opened||!live(opened.track))return live(current);

    try{
      if(window.state&&state.stream){
        var oldTracks=state.stream.getAudioTracks?state.stream.getAudioTracks().slice():[];
        oldTracks.forEach(function(t){try{state.stream.removeTrack(t);}catch(e){}});
        state.stream.addTrack(opened.track);
        oldTracks.forEach(function(t){try{if(t!==opened.track)t.stop();}catch(e){}});
        try{
          state.__ktKaraokeRawAudio=true;
          state.__ktInterfaceAudioReady=externalLike(opened.track.label);
          state.__ktInterfaceAudioLabel=opened.track.label||'';
        }catch(e){}
        return true;
      }
    }catch(e){}

    try{opened.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}
    return false;
  }

  /* 실제 촬영 시작 직전에 원음 입력으로 바꾼다. 기존 카운트다운/촬영/화면은 그대로 둔다. */
  var oldStart=window.startCreatorRecording;
  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      try{await prepareRawKaraokeInput();}catch(e){}
      return oldStart.apply(this,arguments);
    };
  }

  window.ktPrepareRawKaraokeInput=prepareRawKaraokeInput;
})();

/* 게스트 노래 중 마이크 규칙만 추가: 호스트·운영진은 그대로, 가수 외 게스트만 자동 잠금/종료 후 원상복구. */
(function(){
  if(window.__ktGuestSongMicLockInstalled)return;
  window.__ktGuestSongMicLockInstalled=true;

  var guestSelector='.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot:not(.host)';
  var activeSinger=null;
  var activeAudio=null;
  var locked=[];

  function privileged(tile){
    if(!tile)return false;
    var vals=[];
    try{
      if(tile.dataset){vals.push(tile.dataset.role,tile.dataset.userRole,tile.dataset.memberRole,tile.dataset.grade);}
      vals.push(tile.getAttribute&&tile.getAttribute('aria-label'));
      vals.push(tile.textContent||'');
    }catch(e){}
    return /호스트|운영진|운영자|관리자|admin|operator|staff/i.test(vals.filter(Boolean).join(' '));
  }

  function tileVideo(tile){try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}}
  function micButton(tile){try{return tile&&tile.querySelector?tile.querySelector('.kt-inside-mic'):null;}catch(e){return null;}}

  function resolveSinger(target){
    if(target&&target.nodeType===1){
      if(target.matches&&target.matches(guestSelector))return target;
      if(target.closest){var c=target.closest(guestSelector);if(c)return c;}
    }
    if(typeof target==='number'){
      var gs=[].slice.call(document.querySelectorAll(guestSelector));
      return gs[Math.max(0,target-1)]||null;
    }
    if(typeof target==='string'){
      try{
        var q=document.querySelector(target);if(q&&q.matches(guestSelector))return q;
      }catch(e){}
      var all=[].slice.call(document.querySelectorAll(guestSelector));
      return all.find(function(t){return t.dataset&&(t.dataset.userId===target||t.dataset.participantId===target||t.dataset.memberId===target);})||null;
    }
    try{
      var marked=document.querySelector(guestSelector+'[data-singing="1"],'+guestSelector+'[data-singer="1"]');
      if(marked)return marked;
    }catch(e){}
    return window.__ktGuestSongCandidate||null;
  }

  function lockTile(tile){
    if(!tile||tile===activeSinger||privileged(tile))return;
    var v=tileVideo(tile);
    var tracks=[];
    try{if(v&&v.srcObject&&v.srcObject.getAudioTracks)tracks=v.srcObject.getAudioTracks().slice();}catch(e){}
    var b=micButton(tile);
    var rec={tile:tile,video:v,muted:v?!!v.muted:null,tracks:tracks.map(function(t){return {track:t,enabled:t.enabled!==false};}),btn:b,btnDisabled:b?!!b.disabled:false,btnText:b?b.textContent:'',btnTitle:b?b.title:'',btnOff:b&&b.dataset?b.dataset.off:undefined,btnWasOff:b?b.classList.contains('off'):false};
    locked.push(rec);
    try{tracks.forEach(function(t){t.enabled=false;});}catch(e){}
    try{if(v)v.muted=true;}catch(e){}
    try{
      tile.dataset.ktSongMicLocked='1';
      if(b){b.disabled=true;b.textContent='🔇';b.title='노래 중 자동 잠금';b.dataset.off='1';b.classList.add('off');}
    }catch(e){}
  }

  function restore(){
    locked.forEach(function(r){
      try{r.tracks.forEach(function(x){if(x.track)x.track.enabled=x.enabled;});}catch(e){}
      try{if(r.video&&r.muted!==null)r.video.muted=r.muted;}catch(e){}
      try{
        if(r.tile&&r.tile.dataset)delete r.tile.dataset.ktSongMicLocked;
        if(r.btn){
          r.btn.disabled=r.btnDisabled;
          r.btn.textContent=r.btnText;
          r.btn.title=r.btnTitle;
          if(r.btn.dataset){if(r.btnOff===undefined)delete r.btn.dataset.off;else r.btn.dataset.off=r.btnOff;}
          r.btn.classList.toggle('off',r.btnWasOff);
        }
      }catch(e){}
    });
    locked=[];
    activeSinger=null;
    activeAudio=null;
  }

  function start(target){
    var singer=resolveSinger(target);
    if(!singer)return false;
    restore();
    activeSinger=singer;
    try{singer.dataset.ktSongSinger='1';}catch(e){}
    [].slice.call(document.querySelectorAll(guestSelector)).forEach(lockTile);
    return true;
  }

  function end(){
    try{if(activeSinger&&activeSinger.dataset)delete activeSinger.dataset.ktSongSinger;}catch(e){}
    restore();
  }

  function watchAudio(a){
    if(!a||a.__ktGuestSongMicWatched)return;
    a.__ktGuestSongMicWatched=true;
    activeAudio=a;
    if(!a.paused)start();
    a.addEventListener('play',function(){activeAudio=a;start();});
    a.addEventListener('pause',function(){if(activeAudio===a)end();});
    a.addEventListener('ended',function(){if(activeAudio===a)end();});
    a.addEventListener('error',function(){if(activeAudio===a)end();});
  }

  document.addEventListener('pointerdown',function(e){
    var t=e.target&&e.target.closest?e.target.closest(guestSelector):null;
    if(!t)return;
    if(e.target&&e.target.closest&&e.target.closest('.kt-inside-av-controls'))return;
    window.__ktGuestSongCandidate=t;
  },true);

  document.addEventListener('play',function(e){
    var m=e.target;
    if(!m||String(m.tagName||'').toUpperCase()!=='AUDIO')return;
    if(!document.querySelector('.ktg13-room,.ktsubscriber-room,.ktsecret-room'))return;
    watchAudio(m);
  },true);

  var oldPreview=window.ktPlaySoundPreview;
  if(typeof oldPreview==='function'){
    window.ktPlaySoundPreview=function(){
      var r=oldPreview.apply(this,arguments);
      setTimeout(function(){try{watchAudio(window.ktSoundAudio);}catch(e){}},0);
      return r;
    };
  }

  var oldRemote=window.ktPlayRemoteSound;
  if(typeof oldRemote==='function'){
    window.ktPlayRemoteSound=function(){
      var r=oldRemote.apply(this,arguments);
      setTimeout(function(){try{watchAudio(window.ktSoundAudio);}catch(e){}},0);
      return r;
    };
  }

  var oldStopPreview=window.ktStopSoundPreview;
  if(typeof oldStopPreview==='function'){
    window.ktStopSoundPreview=function(){
      var r=oldStopPreview.apply(this,arguments);
      end();
      return r;
    };
  }

  document.addEventListener('kt-guest-song-start',function(e){start(e&&e.detail?e.detail.singer:null);});
  document.addEventListener('kt-guest-song-end',function(){end();});
  window.ktGuestSongStart=start;
  window.ktGuestSongEnd=end;
})();
