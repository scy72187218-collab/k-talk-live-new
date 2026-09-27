/* K-Talk: 호스트/운영진 전용 하단 미디어 3버튼
   모든 로컬 방송방에만 표시: 카메라 / 마이크 / 영화
   일반 게스트/시청자에게는 표시하지 않음. */
(function(){
  if(window.__ktHostAdminBottomMedia20260928)return;
  window.__ktHostAdminBottomMedia20260928=true;

  function isAdmin(){
    try{return typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin();}catch(e){return false;}
  }

  function localRoom(){
    return document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
      '#screen .ktg9-room'
    );
  }

  function canShow(){
    var r=localRoom();
    if(!r)return false;
    try{
      var remote=document.documentElement.classList.contains('kt-remote-viewing')||
                 !!document.querySelector('#screen .kt-remote-live');
      if(remote&&!isAdmin())return false;
    }catch(e){}
    return true;
  }

  function hostStream(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getTracks)return s;
    }catch(e){}
    try{
      var r=localRoom(),v=r&&r.querySelector('video');
      if(v&&v.srcObject&&v.srcObject.getTracks)return v.srcObject;
    }catch(e){}
    return null;
  }

  function ensureStyle(){
    if(document.getElementById('ktHostAdminBottomMediaStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktHostAdminBottomMediaStyle20260928';
    s.textContent=''
      +'#screen .kt-host-admin-media-20260928{position:absolute!important;left:8px!important;right:8px!important;bottom:58px!important;z-index:125!important;height:42px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;padding:3px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:12px!important;background:rgba(5,5,9,.84)!important;backdrop-filter:blur(6px)!important;box-sizing:border-box!important;pointer-events:auto!important}'
      +'#screen .kt-host-admin-media-20260928 button{min-width:0!important;height:34px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;background:#141419!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;touch-action:manipulation!important}'
      +'#screen .kt-host-admin-media-20260928 button b{font-size:17px!important;line-height:1!important}'
      +'#screen .kt-host-admin-media-20260928 button.off{opacity:.55!important;background:#0b0b0f!important}'
      +'#screen .kt-host-admin-media-20260928 .kt-host-admin-movie-btn{flex-direction:column!important;gap:1px!important;line-height:1!important}'
      +'#screen .kt-host-admin-media-20260928 .kt-host-admin-movie-btn span{font-size:9px!important;line-height:1!important}'
      +'#screen .kt-host-admin-media-20260928 .kt-host-admin-movie-btn small{font-size:7px!important;line-height:1!important;color:#ffd86b!important;font-weight:900!important}'
      +'#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .ktg9-room{position:relative!important}'
      +'@media(max-width:390px){#screen .kt-host-admin-media-20260928{left:5px!important;right:5px!important;bottom:53px!important;height:38px!important;gap:3px!important;padding:2px!important}#screen .kt-host-admin-media-20260928 button{height:32px!important;font-size:9px!important;gap:3px!important}#screen .kt-host-admin-media-20260928 button b{font-size:15px!important}}';
    document.head.appendChild(s);
  }

  function camera(btn){
    try{
      var s=hostStream();
      var tracks=s&&s.getVideoTracks?s.getVideoTracks():[];
      if(!tracks.length&&typeof window.toggleCreatorCamera==='function'){
        window.toggleCreatorCamera();return;
      }
      var on=tracks.some(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){t.enabled=!on;});
      btn.classList.toggle('off',on);
      var label=btn.querySelector('span');if(label)label.textContent=on?'카메라 꺼짐':'카메라';
    }catch(e){}
  }

  function mic(btn){
    try{
      var s=hostStream();
      var tracks=s&&s.getAudioTracks?s.getAudioTracks():[];
      if(!tracks.length)return;
      var on=tracks.some(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){t.enabled=!on;});
      try{if(window.state)state.mic=!on;}catch(e){}
      btn.classList.toggle('off',on);
      var label=btn.querySelector('span');if(label)label.textContent=on?'마이크 잠금':'마이크';
    }catch(e){}
  }

  function movie(){
    try{
      if(typeof window.ktOpenHostTvMovie==='function'){window.ktOpenHostTvMovie();return;}
      if(typeof window.openHostMovieRoom==='function'){window.openHostMovieRoom();return;}
      if(typeof window.showSheet==='function'){
        window.showSheet('🎬 영화','<div class="rowbox">영화·동영상 공유 기능을 준비 중입니다.</div>');
      }
    }catch(e){}
  }

  function mk(icon,label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      fn(b);
    };
    return b;
  }

  function ensure(){
    ensureStyle();
    var r=localRoom();
    var old=document.querySelector('#screen .kt-host-admin-media-20260928');
    if(!r||!canShow()){
      if(old)old.remove();
      return;
    }
    if(old&&old.parentElement===r)return;
    if(old)old.remove();

    var bar=document.createElement('div');
    bar.className='kt-host-admin-media-20260928';
    bar.appendChild(mk('📷','카메라',camera));
    bar.appendChild(mk('🎤','마이크',mic));
    var movieBtn=mk('🎬','영화 · TV · 유튜브',movie);
    movieBtn.classList.add('kt-host-admin-movie-btn');
    movieBtn.innerHTML='<b>🎬</b><span>영화 · TV · 유튜브</span><small>저작권 없는 영상만</small>';
    bar.appendChild(movieBtn);
    r.appendChild(bar);
  }

  ensure();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,800);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHostAdminBottomMediaTimer20260928);
      window.__ktHostAdminBottomMediaTimer20260928=setTimeout(ensure,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();