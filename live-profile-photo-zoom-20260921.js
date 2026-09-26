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
      +'.kt-photo-zoom-close{position:absolute!important;right:10px!important;top:10px!important;z-index:3!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(0,0,0,.72)!important;color:#fff!important;font:400 30px/1 system-ui,sans-serif!important;display:grid!important;place-items:center!important}'
      +'.kt-photo-zoomable{cursor:zoom-in!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.kt-photo-zoom-tools{position:absolute!important;left:50%!important;bottom:12px!important;transform:translateX(-50%)!important;z-index:5!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;padding:7px 10px!important;border-radius:18px!important;background:rgba(0,0,0,.66)!important;border:1px solid rgba(255,255,255,.22)!important;backdrop-filter:blur(4px)!important}'
      +'.kt-photo-zoom-tools button{width:44px!important;height:44px!important;border:1px solid rgba(255,255,255,.30)!important;border-radius:50%!important;background:rgba(20,20,24,.92)!important;color:#fff!important;display:grid!important;place-items:center!important;font:900 19px/1 system-ui,sans-serif!important;padding:0!important}'
      +'.kt-photo-zoom-tools button small{display:block!important;font:800 8px/1.1 system-ui,sans-serif!important;margin-top:1px!important}'
      +'#screen .ktg13-room .ktg13-host button[aria-label*="마이크"],#screen .ktg13-room .ktg13-guest button[aria-label*="마이크"],'
      +'#screen .ktg9-room .ktg9-host button[aria-label*="마이크"],#screen .ktg9-room .ktg9-guest button[aria-label*="마이크"],'
      +'#screen .ktsubscriber-room .ktsubscriber-host button[aria-label*="마이크"],#screen .ktsubscriber-room .ktsubscriber-guest button[aria-label*="마이크"],'
      +'#screen .ktsecret-room .ktsecret-slot button[aria-label*="마이크"],#screen .ktsecret-room .ktsecret-guest-slot button[aria-label*="마이크"],'
      +'#screen .ktg13-room .ktg13-host button[title*="마이크"],#screen .ktg13-room .ktg13-guest button[title*="마이크"],'
      +'#screen .ktg9-room .ktg9-host button[title*="마이크"],#screen .ktg9-room .ktg9-guest button[title*="마이크"],'
      +'#screen .ktsubscriber-room .ktsubscriber-host button[title*="마이크"],#screen .ktsubscriber-room .ktsubscriber-guest button[title*="마이크"],'
      +'#screen .ktsecret-room .ktsecret-slot button[title*="마이크"],#screen .ktsecret-room .ktsecret-guest-slot button[title*="마이크"],'
      +'#screen .ktg13-room .ktg13-host button[aria-label*="사진"],#screen .ktg13-room .ktg13-guest button[aria-label*="사진"],'
      +'#screen .ktg9-room .ktg9-host button[aria-label*="사진"],#screen .ktg9-room .ktg9-guest button[aria-label*="사진"],'
      +'#screen .ktsubscriber-room .ktsubscriber-host button[aria-label*="사진"],#screen .ktsubscriber-room .ktsubscriber-guest button[aria-label*="사진"],'
      +'#screen .ktsecret-room .ktsecret-slot button[aria-label*="사진"],#screen .ktsecret-room .ktsecret-guest-slot button[aria-label*="사진"],'
      +'#screen .ktg13-room .ktg13-host button[title*="사진"],#screen .ktg13-room .ktg13-guest button[title*="사진"],'
      +'#screen .ktg9-room .ktg9-host button[title*="사진"],#screen .ktg9-room .ktg9-guest button[title*="사진"],'
      +'#screen .ktsubscriber-room .ktsubscriber-host button[title*="사진"],#screen .ktsubscriber-room .ktsubscriber-guest button[title*="사진"],'
      +'#screen .ktsecret-room .ktsecret-slot button[title*="사진"],#screen .ktsecret-room .ktsecret-guest-slot button[title*="사진"],'
      +'#screen .ktg13-room .ktg13-host .kt-person-mic,#screen .ktg13-room .ktg13-guest .kt-person-mic,'
      +'#screen .ktg9-room .ktg9-host .kt-person-mic,#screen .ktg9-room .ktg9-guest .kt-person-mic,'
      +'#screen .ktsubscriber-room .ktsubscriber-host .kt-person-mic,#screen .ktsubscriber-room .ktsubscriber-guest .kt-person-mic,'
      +'#screen .ktsecret-room .ktsecret-slot .kt-person-mic,#screen .ktsecret-room .ktsecret-guest-slot .kt-person-mic,'
      +'#screen .ktg13-room .ktg13-host .kt-person-photo,#screen .ktg13-room .ktg13-guest .kt-person-photo,'
      +'#screen .ktg9-room .ktg9-host .kt-person-photo,#screen .ktg9-room .ktg9-guest .kt-person-photo,'
      +'#screen .ktsubscriber-room .ktsubscriber-host .kt-person-photo,#screen .ktsubscriber-room .ktsubscriber-guest .kt-person-photo,'
      +'#screen .ktsecret-room .ktsecret-slot .kt-person-photo,#screen .ktsecret-room .ktsecret-guest-slot .kt-person-photo{display:none!important}';
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
  function requestedRoomRoot(el){
    return el&&el.closest?el.closest(
      '#screen .ktg13-room,'+
      '#screen .ktg9-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
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

  function addZoomTools(box,sourceEl){
    try{
      if(!box||!requestedRoomRoot(sourceEl))return;
      var bar=document.createElement('div');
      bar.className='kt-photo-zoom-tools';
      bar.innerHTML=''
        +'<button type="button" aria-label="마이크"><span>🎤</span></button>'
        +'<button type="button" aria-label="사진"><span>📷</span></button>'
        +'<button type="button" aria-label="장미"><span>🌹</span><small>1</small></button>'
        +'<button type="button" aria-label="보물상자"><span>🎁</span></button>';
      var buttons=bar.querySelectorAll('button');
      if(buttons[0])buttons[0].onclick=function(e){e.preventDefault();e.stopPropagation();};
      if(buttons[1])buttons[1].onclick=function(e){e.preventDefault();e.stopPropagation();};
      if(buttons[2])buttons[2].onclick=function(e){
        e.preventDefault();e.stopPropagation();
        try{
          if(typeof window.giftSend==='function'){window.giftSend('장미',1);return;}
          if(typeof window.openGifts==='function')window.openGifts();
        }catch(_e){}
      };
      if(buttons[3])buttons[3].onclick=function(e){
        e.preventDefault();e.stopPropagation();
        try{
          if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
          if(typeof window.openTreasure==='function'){window.openTreasure();return;}
          if(typeof window.openGifts==='function')window.openGifts();
        }catch(_e){}
      };
      box.appendChild(bar);
    }catch(e){}
  }

  function shell(sourceEl){
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
    addZoomTools(box,sourceEl);
    return box;
  }

  function openImage(src,alt,sourceEl){
    if(!src)return;
    var box=shell(sourceEl);
    var img=document.createElement('img');
    img.src=src;img.alt=alt||'프로필 사진 확대';
    box.insertBefore(img,box.firstChild);
  }

  function openVideo(source){
    if(!source)return;
    var box=shell(source);
    var v=document.createElement('video');
    v.autoplay=true;v.playsInline=true;v.muted=true;
    try{
      if(source.srcObject)v.srcObject=source.srcObject;
      else if(source.currentSrc||source.src)v.src=source.currentSrc||source.src;
      if(source.poster)v.poster=source.poster;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
    box.insertBefore(v,box.firstChild);
  }

  function clickTarget(target){
    if(!target||!roomRoot(target))return null;

    var video=target.closest&&target.closest('video');
    if(video&&personTile(video)&&!isUiIcon(video))return {kind:'video',el:video};

    var img=target.closest&&target.closest('img');
    if(img&&personTile(img)&&!isUiIcon(img)){
      var src=imageSrc(img);
      if(src)return {kind:'image',el:img,src:src};
    }

    var explicit=target.closest&&target.closest(
      '.kt-allhost-photo,.kt-hg-photo,.kt-guest-profile-photo,'+
      '.kt-profile-photo,[class*="avatar"],[class*="profile-photo"]'
    );
    if(explicit){
      var src2=imageSrc(explicit);
      if(src2)return {kind:'image',el:explicit,src:src2};
    }

    var tile=personTile(target);
    if(tile){
      var p=profileImageInTile(tile);
      if(p&&!isUiIcon(p)){
        var src3=imageSrc(p);
        if(src3)return {kind:'image',el:p,src:src3};
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
    if(hit.kind==='video')openVideo(hit.el);
    else openImage(hit.src,(hit.el&&hit.el.alt)||'프로필 사진 확대',hit.el);
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