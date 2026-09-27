/* K-Talk: 모든 방송방 모든 사람의 얼굴 사진/영상 터치 확대.
   1인방 / 9명방 / 13명방 / 구독방 / 비밀방. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveFaceZoom20260921V3)return;
  window.__ktLiveFaceZoom20260921V3=true;

  function ensureStyle(){
    if(document.getElementById('ktLiveProfilePhotoZoomStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktLiveProfilePhotoZoomStyle20260921';
    s.textContent=''
      +'.kt-photo-zoom-overlay{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,0,0,.88)!important;padding:18px!important;box-sizing:border-box!important}'
      +'.kt-photo-zoom-box{position:relative!important;width:min(94vw,560px)!important;height:min(94vw,560px)!important;max-height:82vh!important;border-radius:22px!important;overflow:hidden!important;background:#08080b!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 18px 60px rgba(0,0,0,.72)!important}'
      +'.kt-photo-zoom-box img,.kt-photo-zoom-box video{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:#050507!important}'
      +'.kt-photo-zoom-close{position:absolute!important;right:10px!important;top:10px!important;z-index:5!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(0,0,0,.72)!important;color:#fff!important;font:400 30px/1 system-ui,sans-serif!important;display:grid!important;place-items:center!important}'
      +'.kt-photo-guest-controls{position:absolute!important;left:12px!important;right:12px!important;bottom:12px!important;z-index:5!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;padding:10px!important;border-radius:18px!important;background:rgba(18,18,22,.9)!important;backdrop-filter:blur(8px)!important}'
      +'.kt-photo-guest-controls button{height:66px!important;min-width:0!important;border:0!important;border-radius:16px!important;background:#26262b!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;font:900 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;touch-action:manipulation!important}'
      +'.kt-photo-guest-controls button b{font-size:26px!important;line-height:1!important}.kt-photo-guest-controls button span{font-size:11px!important;white-space:nowrap!important}'
      +'.kt-photo-guest-controls button.off{opacity:.58!important;background:#17171b!important}'
      +'.kt-photo-guest-controls .kt-photo-gift-pick{grid-column:1/-1!important;height:46px!important;flex-direction:row!important;gap:8px!important;background:linear-gradient(135deg,#7a3b00,#b96900)!important;border:1px solid #ffd56a55!important}'
      +'.kt-photo-guest-controls .kt-photo-gift-pick b{font-size:22px!important}.kt-photo-guest-controls .kt-photo-gift-pick span{font-size:12px!important}'
      +'.kt-photo-zoom-box.kt-has-guest-controls img,.kt-photo-zoom-box.kt-has-guest-controls video{padding-bottom:146px!important;box-sizing:border-box!important}'
      +'@media(max-width:390px){.kt-photo-guest-controls{left:8px!important;right:8px!important;bottom:8px!important;gap:5px!important;padding:7px!important}.kt-photo-guest-controls button{height:58px!important;border-radius:13px!important}.kt-photo-guest-controls button b{font-size:22px!important}.kt-photo-guest-controls button span{font-size:9px!important}.kt-photo-guest-controls .kt-photo-gift-pick{height:40px!important}.kt-photo-zoom-box.kt-has-guest-controls img,.kt-photo-zoom-box.kt-has-guest-controls video{padding-bottom:126px!important}}'
      +'.kt-photo-zoomable{cursor:zoom-in!important;pointer-events:auto!important;touch-action:manipulation!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function roomRoot(el){
    return el&&el.closest?el.closest(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
      '#screen .ktg9-room,'+
      '.kt-guest-hostlike-room'
    ):null;
  }

  function personTile(el){
    return el&&el.closest?el.closest(
      '.ktsolo-main,'+
      '.ktg13-host,.ktg13-guest,'+
      '.ktsubscriber-host,.ktsubscriber-guest,'+
      '.ktsecret-slot,.ktsecret-host,.ktsecret-guest-slot,'+
      '.ktg9-host,.ktg9-guest,'+
      '.kgh-cell'
    ):null;
  }

  function isUiIcon(el){
    if(!el)return true;
    return !!el.closest(
      '.gift-grid,.gift-big,.quick-gifts,.creator-tools,.creator-bottom,'+
      '.kt-live-tools,.kt-room-tools,.kt-gift-row,.kt-live-clock-heart,'+
      '.kt-photo-zoom-overlay'
    );
  }

  function imageSrc(el){
    if(!el)return '';
    if(el.tagName==='IMG')return el.currentSrc||el.src||'';
    try{
      var bg=getComputedStyle(el).backgroundImage||'';
      var m=bg.match(/^url\(["']?(.*?)["']?\)$/);
      if(m&&m[1]&&m[1]!=='none')return m[1];
    }catch(e){}
    var d=el.dataset||{};
    return d.profilePhoto||d.profileImage||d.avatar||d.avatarUrl||d.photo||d.photoUrl||d.image||'';
  }

  function profileImageInTile(tile){
    if(!tile)return null;
    return tile.querySelector(
      'img.kt-allhost-photo,'+
      'img.kt-hg-photo,'+
      'img.kt-guest-profile-photo,'+
      'img.kt-profile-photo,'+
      'img[class*="avatar"],'+
      'img[class*="profile"]'
    );
  }

  function isGuestTile(tile){
    if(!tile)return false;
    try{
      if(tile.matches('.ktg13-guest,.ktg9-guest,.ktsubscriber-guest,.ktsecret-guest-slot,.kgh-cell'))return true;
      if(tile.matches('.ktsecret-slot')&&!tile.classList.contains('host'))return true;
      if(tile.classList.contains('host')||tile.matches('.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsolo-main,.ktsecret-host'))return false;
      if(tile.closest('.kt-guest-hostlike-room')&&!tile.classList.contains('host'))return true;
    }catch(e){}
    return false;
  }

  function sourceStream(source){
    try{
      if(source&&source.srcObject&&source.srcObject.getTracks)return source.srcObject;
    }catch(e){}
    return null;
  }

  function addGuestControls(box,source,tile){
    if(!box||!isGuestTile(tile))return;
    box.classList.add('kt-has-guest-controls');

    var bar=document.createElement('div');
    bar.className='kt-photo-guest-controls';

    function btn(icon,label,fn){
      var b=document.createElement('button');
      b.type='button';
      b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
      b.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        fn(b);
      });
      bar.appendChild(b);
      return b;
    }

    btn('📷','카메라',function(b){
      try{
        var st=sourceStream(source);
        var tracks=st&&st.getVideoTracks?st.getVideoTracks():[];
        if(tracks&&tracks.length){
          var on=tracks.some(function(t){return t.enabled!==false;});
          tracks.forEach(function(t){t.enabled=!on;});
          b.classList.toggle('off',on);
          return;
        }
        if(typeof window.toggleCreatorCamera==='function')window.toggleCreatorCamera();
      }catch(e){}
    });

    btn('🎤','마이크',function(b){
      try{
        var st=sourceStream(source);
        var tracks=st&&st.getAudioTracks?st.getAudioTracks():[];
        if(tracks&&tracks.length){
          var on=tracks.some(function(t){return t.enabled!==false;});
          tracks.forEach(function(t){t.enabled=!on;});
          b.classList.toggle('off',on);
          return;
        }
        if(window.state&&state.stream&&state.stream.getAudioTracks){
          var a=state.stream.getAudioTracks();
          var on2=a.some(function(t){return t.enabled!==false;});
          a.forEach(function(t){t.enabled=!on2;});
          b.classList.toggle('off',on2);
        }
      }catch(e){}
    });

    btn('↻','되돌리기',function(){
      try{
        if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
        if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera();return;}
        if(typeof window.toggleCreatorCamera==='function'){window.toggleCreatorCamera();return;}
      }catch(e){}
    });

    btn('👥','초대',function(){
      try{
        if(typeof window.ktGroup13Invite==='function'){window.ktGroup13Invite();return;}
        if(typeof window.shareApp==='function'){window.shareApp();return;}
        if(navigator.share)navigator.share({title:'K-Talk LIVE',text:'K-Talk LIVE에 초대합니다.'}).catch(function(){});
      }catch(e){}
    });

    var giftBtn=btn('🎁','선물 고르기 · 작은 선물 → 큰 선물',function(){
      try{
        closeZoom();
        setTimeout(function(){
          if(typeof window.openGifts==='function')window.openGifts();
        },40);
      }catch(e){}
    });
    giftBtn.classList.add('kt-photo-gift-pick');

    box.appendChild(bar);
  }

  function closeZoom(){
    var old=document.getElementById('ktPhotoZoomOverlay20260921');
    if(!old)return;
    try{
      old.querySelectorAll('video').forEach(function(v){
        try{v.pause();v.srcObject=null;v.removeAttribute('src');v.load();}catch(e){}
      });
    }catch(e){}
    old.remove();
  }

  function shell(){
    ensureStyle(); closeZoom();
    var ov=document.createElement('div');
    ov.id='ktPhotoZoomOverlay20260921';
    ov.className='kt-photo-zoom-overlay';
    var box=document.createElement('div');
    box.className='kt-photo-zoom-box';
    var close=document.createElement('button');
    close.type='button';close.className='kt-photo-zoom-close';close.setAttribute('aria-label','닫기');close.textContent='×';
    close.onclick=function(e){e.preventDefault();e.stopPropagation();closeZoom();};
    box.appendChild(close);ov.appendChild(box);
    ov.addEventListener('click',function(e){if(e.target===ov)closeZoom();});
    document.body.appendChild(ov);
    return box;
  }

  function openImage(src,alt,tile,sourceEl){
    if(!src)return;
    var box=shell();
    var img=document.createElement('img');
    img.src=src;img.alt=alt||'프로필 사진 확대';
    box.insertBefore(img,box.firstChild);
    addGuestControls(box,sourceEl||img,tile);
  }

  function openVideo(source,tile){
    if(!source)return;
    var box=shell();
    var v=document.createElement('video');
    v.autoplay=true;v.playsInline=true;v.muted=true;
    try{
      if(source.srcObject)v.srcObject=source.srcObject;
      else if(source.currentSrc||source.src)v.src=source.currentSrc||source.src;
      if(source.poster)v.poster=source.poster;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
    box.insertBefore(v,box.firstChild);
    addGuestControls(box,source,tile);
  }

  function clickTarget(target){
    if(!target||!roomRoot(target))return null;

    /* 호스트 화면/사진은 좋아요를 눌러야 하므로 확대하지 않는다.
       확대는 게스트 타일만 허용한다. */
    var touchedTile=personTile(target);
    if(touchedTile&&!isGuestTile(touchedTile))return null;

    var video=target.closest&&target.closest('video');
    if(video&&personTile(video)&&!isUiIcon(video))return {kind:'video',el:video,tile:personTile(video)};

    var img=target.closest&&target.closest('img');
    if(img&&personTile(img)&&!isUiIcon(img)){
      var src=imageSrc(img);
      if(src)return {kind:'image',el:img,src:src,tile:personTile(img)};
    }

    var explicit=target.closest&&target.closest(
      '.kt-allhost-photo,.kt-hg-photo,.kt-guest-profile-photo,'+
      '.kt-profile-photo,[class*="avatar"],[class*="profile-photo"]'
    );
    if(explicit){
      var src2=imageSrc(explicit);
      if(src2)return {kind:'image',el:explicit,src:src2,tile:personTile(explicit)};
    }

    var tile=personTile(target);
    if(tile){
      var p=profileImageInTile(tile);
      if(p&&!isUiIcon(p)){
        var src3=imageSrc(p);
        if(src3)return {kind:'image',el:p,src:src3,tile:tile};
      }
    }
    return null;
  }

  function mark(){
    ensureStyle();
    document.querySelectorAll(
      '#screen .ktsolo-room video,#screen .ktsolo-room img,'+
      '#screen .ktg13-room video,#screen .ktg13-room img,'+
      '#screen .ktsubscriber-room video,#screen .ktsubscriber-room img,'+
      '#screen .ktsecret-room video,#screen .ktsecret-room img,'+
      '#screen .ktg9-room video,#screen .ktg9-room img,'+
      '.kt-guest-hostlike-room video,.kt-guest-hostlike-room img'
    ).forEach(function(el){
      if(personTile(el)&&!isUiIcon(el))el.classList.add('kt-photo-zoomable');
    });
  }

  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('.kt-photo-zoom-overlay'))return;
    var hit=clickTarget(e.target);
    if(!hit)return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(err){}
    if(hit.kind==='video')openVideo(hit.el,hit.tile);
    else openImage(hit.src,(hit.el&&hit.el.alt)||'프로필 사진 확대',hit.tile,hit.el);
  },true);

  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeZoom();});

  mark();
  [40,120,260,520,1000,2000].forEach(function(ms){setTimeout(mark,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLiveProfilePhotoZoomTimer20260921);
      window.__ktLiveProfilePhotoZoomTimer20260921=setTimeout(mark,20);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','style','data-profile-photo','data-avatar','data-photo']});
  }catch(e){}
})();