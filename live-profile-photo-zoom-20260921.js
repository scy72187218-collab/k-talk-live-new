/* K-Talk: 방송방 얼굴 사진 터치 확대. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveProfilePhotoZoom20260921)return;
  window.__ktLiveProfilePhotoZoom20260921=true;

  function ensureStyle(){
    if(document.getElementById('ktLiveProfilePhotoZoomStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktLiveProfilePhotoZoomStyle20260921';
    s.textContent=''
      +'.kt-photo-zoom-overlay{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,0,0,.86)!important;padding:24px!important;box-sizing:border-box!important}'
      +'.kt-photo-zoom-box{position:relative!important;width:min(88vw,460px)!important;height:min(88vw,460px)!important;max-height:76vh!important;border-radius:24px!important;overflow:hidden!important;background:#09090d!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 18px 60px rgba(0,0,0,.72)!important}'
      +'.kt-photo-zoom-box img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:#050507!important}'
      +'.kt-photo-zoom-close{position:absolute!important;right:10px!important;top:10px!important;z-index:2!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(0,0,0,.68)!important;color:#fff!important;font:400 30px/1 system-ui,sans-serif!important;display:grid!important;place-items:center!important}'
      +'.kt-photo-zoomable{cursor:zoom-in!important;pointer-events:auto!important;touch-action:manipulation!important}';
    (document.head||document.documentElement).appendChild(s);
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

  function isLiveFace(img){
    if(!img||img.tagName!=='IMG')return false;
    var live=img.closest('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,.kt-guest-hostlike-room');
    if(!live)return false;
    return img.classList.contains('kt-allhost-photo')||
           img.classList.contains('kt-hg-photo')||
           img.classList.contains('kt-guest-profile-photo')||
           !!img.closest('.kt-allhost-profile,.kt-hg-host-identity,.kt-guest-identity,.kgh-cell');
  }

  function mark(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-allhost-photo,#screen .kt-hg-photo,#screen .kt-guest-profile-photo,.kt-guest-hostlike-room img').forEach(function(img){
      if(isLiveFace(img))img.classList.add('kt-photo-zoomable');
    });
  }

  document.addEventListener('click',function(e){
    var img=e.target&&e.target.closest?e.target.closest('img'):null;
    if(!isLiveFace(img))return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(err){}
    openZoom(img.currentSrc||img.src||'',img.alt||'프로필 사진 확대');
  },true);

  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeZoom();});
  mark();
  [80,250,600,1200,2500].forEach(function(ms){setTimeout(mark,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLiveProfilePhotoZoomTimer20260921);
      window.__ktLiveProfilePhotoZoomTimer20260921=setTimeout(mark,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();