/* K-Talk: 게스트 화면에서 호스트 영상만 호스트 본인 화면과 같은 좌우 방향으로 표시.
   게스트 본인/다른 게스트 영상과 카메라 송출은 건드리지 않음. */
(function(){
  if(window.__ktGuestHostVideoMirror20260918)return;
  window.__ktGuestHostVideoMirror20260918=true;

  function ensureStyle(){
    var id='ktGuestHostVideoMirrorStyle';
    if(document.getElementById(id))return;
    var s=document.createElement('style');
    s.id=id;
    s.textContent=''
      +'.kt-guest-hostlike-room .kgh-cell.host video,'
      +'.kt-approved-guest-grid .kt-approved-guest-cell.host video,'
      +'.kt-guest-room-grid .kt-guest-room-cell.host video,'
      +'.kt-prejoin-room-grid .kt-prejoin-room-cell.host video'
      +'{transform:scaleX(-1)!important;}';
    document.head.appendChild(s);
  }

  ensureStyle();
  document.addEventListener('DOMContentLoaded',ensureStyle);
  try{
    new MutationObserver(function(){ensureStyle();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();