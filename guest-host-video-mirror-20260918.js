/* K-Talk: 게스트 화면의 호스트 영상을 실제 좌우 방향 그대로 표시.
   왼손은 왼손, 오른손은 오른손으로 보이게 하며 게스트 본인/다른 게스트는 건드리지 않음. */
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
      +'{transform:none!important;}';
    document.head.appendChild(s);
  }

  ensureStyle();
  document.addEventListener('DOMContentLoaded',ensureStyle);
  try{
    new MutationObserver(function(){ensureStyle();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();