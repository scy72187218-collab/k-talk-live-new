/* K-Talk: 모든 로컬 방송방 맨 아래 도구줄
   매치/장미/선물 3칸을 카메라/마이크/영화로 교체.
   다른 하단 버튼은 그대로 유지. */
(function(){
  if(window.__ktBottomToolsCamMicMovie20260928)return;
  window.__ktBottomToolsCamMicMovie20260928=true;

  function rooms(){
    return [].slice.call(document.querySelectorAll(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
      '#screen .ktg9-room'
    ));
  }

  function hostStream(room){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getTracks)return s;
    }catch(e){}
    try{
      var v=room&&room.querySelector('video');
      if(v&&v.srcObject&&v.srcObject.getTracks)return v.srcObject;
    }catch(e){}
    return null;
  }

  function toggleCamera(btn,room){
    try{
      var s=hostStream(room);
      var tracks=s&&s.getVideoTracks?s.getVideoTracks():[];
      if(!tracks.length&&typeof window.toggleCreatorCamera==='function'){
        window.toggleCreatorCamera();
        return;
      }
      var on=tracks.some(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){t.enabled=!on;});
      try{if(typeof window.ktCameraOffAvatarState20260928==='function')window.ktCameraOffAvatarState20260928(on);}catch(e){}
      btn.classList.toggle('kt-media-off',on);
      var span=btn.querySelector('span');
      if(span)span.textContent=on?'카메라 꺼짐':'카메라';
    }catch(e){}
  }

  function toggleMic(btn,room){
    try{
      var s=hostStream(room);
      var tracks=s&&s.getAudioTracks?s.getAudioTracks():[];
      if(!tracks.length)return;
      var on=tracks.some(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){t.enabled=!on;});
      try{if(window.state)state.mic=!on;}catch(e){}
      btn.classList.toggle('kt-media-off',on);
      var span=btn.querySelector('span');
      if(span)span.textContent=on?'마이크 잠금':'마이크';
    }catch(e){}
  }

  window.ktBottomCameraToggle=function(btn){
    var room=btn&&btn.closest?btn.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room'):null;
    toggleCamera(btn,room);
    return false;
  };

  window.ktBottomMicToggle=function(btn){
    var room=btn&&btn.closest?btn.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room'):null;
    toggleMic(btn,room);
    return false;
  };

  function openMovie(){
    try{
      if(typeof window.ktOpenHostTvMovie==='function'){window.ktOpenHostTvMovie();return;}
      if(typeof window.showSheet==='function'){
        window.showSheet('🎬 영화 · TV · 유튜브',
          '<div class="rowbox"><b>🎬 영화 · TV · 유튜브</b><br>저작권 없는 영상 또는 본인이 방송 권한을 가진 영상만 이용해 주세요.</div>');
      }
    }catch(e){}
  }

  function label(btn){
    return String(btn&&btn.textContent||'').replace(/\s+/g,'').trim();
  }

  function toolbar(room){
    if(!room)return null;
    return room.querySelector(
      '.ktsolo-tools,.ktg13-tools,.ktsubscriber-tools,.ktsecret-tools,.ktg9-tools'
    );
  }

  function setButton(btn,kind,room){
    if(!btn)return;
    btn.classList.add('kt-bottom-media-replaced');
    btn.classList.remove('kt-media-off');

    if(kind==='camera'){
      btn.innerHTML='<i>📷</i><span>카메라</span>';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        toggleCamera(btn,room);
        return false;
      };
    }else if(kind==='mic'){
      btn.innerHTML='<i>🎤</i><span>마이크</span>';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        toggleMic(btn,room);
        return false;
      };
    }else if(kind==='movie'){
      btn.innerHTML='<i>🎬</i><span>영화</span>';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        openMovie();
        return false;
      };
      btn.title='영화 · TV · 유튜브 · 저작권 없는 영상만';
    }
  }

  function applyRoom(room){
    var bar=toolbar(room);
    if(!bar)return;

    var buttons=[].slice.call(bar.querySelectorAll('button'));
    var match=null,rose=null,gift=null;

    buttons.forEach(function(b){
      var t=label(b);
      if(!match&&t.indexOf('매치')>-1)match=b;
      else if(!rose&&(t==='장미'||t.indexOf('장미')>-1))rose=b;
      else if(!gift&&(t==='선물'||t.indexOf('선물')>-1))gift=b;
    });

    if(match)setButton(match,'camera',room);
    if(rose)setButton(rose,'mic',room);
    if(gift)setButton(gift,'movie',room);
  }

  function style(){
    if(document.getElementById('ktBottomToolsCamMicMovieStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktBottomToolsCamMicMovieStyle20260928';
    s.textContent=''
      +'#screen .kt-bottom-media-replaced.kt-media-off{opacity:.55!important;background:#0b0b0f!important}'
      +'#screen .kt-bottom-media-replaced i{font-size:18px!important}'
      +'#screen .kt-bottom-media-replaced span{white-space:nowrap!important}'
      +'#screen .kt-host-admin-media-20260928{display:none!important}';
    document.head.appendChild(s);
  }

  function removeDuplicateBar(){
    try{
      document.querySelectorAll('#screen .kt-host-admin-media-20260928').forEach(function(x){x.remove();});
    }catch(e){}
  }

  function run(){
    style();
    removeDuplicateBar();
    rooms().forEach(applyRoom);
  }

  run();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktBottomToolsCamMicMovieTimer20260928);
      window.__ktBottomToolsCamMicMovieTimer20260928=setTimeout(run,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();