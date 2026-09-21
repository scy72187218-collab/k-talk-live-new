/* K-Talk: 모든 방송방의 모든 사람 얼굴/프로필 사진 터치 확대.
   대상: 1인방 / 9명방 / 13명방 / 구독방 / 비밀방 + 게스트 화면.
   다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveProfilePhotoZoom20260921V2)return;
  window.__ktLiveProfilePhotoZoom20260921V2=true;

  function ensureStyle(){
    if(document.getElementById('ktLiveProfilePhotoZoomStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktLiveProfilePhotoZoomStyle20260921';
    s.textContent=''
      +'.kt-photo-zoom-overlay{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,0,0,.88)!important;padding:18px!important;box-sizing:border-box!important}'
      +'.kt-photo-zoom-box{position:relative!important;width:min(92vw,520px)!important;height:min(92vw,520px)!important;max-height:80vh!important;border-radius:22px!important;overflow:hidden!important;background:#08080b!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 18px 60px rgba(0,0,0,.72)!important}'
      +'.kt-photo-zoom-box img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:#050507!important}'
      +'.kt-photo-zoom-close{position:absolute!important;right:10px!important;top:10px!important;z-index:2!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(0,0,0,.7)!important;color:#fff!important;font:400 30px/1 system-ui,sans-serif!important;display:grid!important;place-items:center!important}'
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

  function isUiIcon(img){
    if(!img)return true;
    return !!img.closest(
      '.gift-grid,.gift-big,.quick-gifts,.creator-tools,.creator-bottom,'+
      '.kt-live-tools,.kt-room-tools,.kt-gift-row,.kt-live-clock-heart,'+
      '.kt-photo-zoom-overlay'
    );
  }

  function imageSrcFromElement(el){
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
      'img[class*="profile"],'+
      'img'
    );
  }

  function clickedFace(target){
    if(!target)return null;
    var room=roomRoot(target);
    if(!room)return null;

    var img=target.closest&&target.closest('img');
    if(img && roomRoot(img) && !isUiIcon(img)){
      var tile=personTile(img);
      if(tile)return {el:img,src:imageSrcFromElement(img)};
    }

    var explicit=target.closest&&target.closest(
      '.kt-allhost-photo,.kt-hg-photo,.kt-guest-profile-photo,'+
      '.kt-profile-photo,[class*="avatar"],[class*="profile-photo"]'
    );
    if(explicit){
      var src=imageSrcFromElement(explicit);
      if(src)return {el:explicit,src:src};
    }

    var tile=personTile(target);
    if(tile){
      var p=profileImageInTile(tile);
      if(p&&!isUiIcon(p))return {el:p,src:imageSrcFromElement(p)};
      var src2=imageSrcFromElement(tile);
      if(src2)return {el:tile,src:src2};
    }
    return null;
  }

  function closeZoom(){
    var old=document.getElementById('ktPhotoZoomOverlay20260921');
    if(old)old.remove();
  }

  function openZoom(src,alt){
    if(!src)return;
    ensureStyle(); closeZoom();
    var ov=document.createElement('div');
    ov.id='ktPhotoZoomOverlay20260921';
    ov.className='kt-photo-zoom-overlay';
    ov.innerHTML='<div class="kt-photo-zoom-box"><img alt=""><button type="button" class="kt-photo-zoom-close" aria-label="닫기">×</button></div>';
    var img=ov.querySelector('img');
    img.src=src; img.alt=alt||'프로필 사진 확대';
    ov.querySelector('.kt-photo-zoom-close').onclick=function(e){e.preventDefault();e.stopPropagation();closeZoom();};
    ov.addEventListener('click',function(e){if(e.target===ov)closeZoom();});
    document.body.appendChild(ov);
  }

  function mark(){
    ensureStyle();
    document.querySelectorAll(
      '#screen .ktsolo-room img,'+
      '#screen .ktg13-room img,'+
      '#screen .ktsubscriber-room img,'+
      '#screen .ktsecret-room img,'+
      '#screen .ktg9-room img,'+
      '.kt-guest-hostlike-room img'
    ).forEach(function(img){
      if(personTile(img)&&!isUiIcon(img))img.classList.add('kt-photo-zoomable');
    });
  }

  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('.kt-photo-zoom-overlay'))return;
    var hit=clickedFace(e.target);
    if(!hit||!hit.src)return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(err){}
    openZoom(hit.src,(hit.el&&hit.el.alt)||'프로필 사진 확대');
  },true);

  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeZoom();});
  mark();
  [60,160,350,700,1400,2800].forEach(function(ms){setTimeout(mark,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLiveProfilePhotoZoomTimer20260921);
      window.__ktLiveProfilePhotoZoomTimer20260921=setTimeout(mark,25);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','style','data-profile-photo','data-avatar','data-photo']});
  }catch(e){}
})();