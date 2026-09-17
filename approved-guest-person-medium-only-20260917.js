/* K-Talk: 승인된 게스트 방에서 사람 영상만 너무 작지 않게 중간 크기로 표시. 방/버튼/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestPersonMediumOnly20260917)return;
  window.__ktApprovedGuestPersonMediumOnly20260917=true;

  function install(){
    if(document.getElementById('ktApprovedGuestPersonMediumOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestPersonMediumOnly20260917Style';
    s.textContent=''
      +'.kt-approved-guest-cell>video{object-fit:contain!important;object-position:center center!important;}'
      +'.kt-approved-guest-cell.host>video{transform:scale(1.35)!important;}'
      +'.kt-approved-guest-cell.self>video{transform:scaleX(-1) scale(1.35)!important;}';
    document.head.appendChild(s);
  }

  install();
  try{
    var mo=new MutationObserver(function(){install();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
