/* K-Talk: 승인된 게스트 방에서 영상이 너무 커 보이거나 비율이 어색하지 않게만 조정. 방/버튼/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestPersonMediumOnly20260917)return;
  window.__ktApprovedGuestPersonMediumOnly20260917=true;

  function install(){
    if(document.getElementById('ktApprovedGuestPersonMediumOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestPersonMediumOnly20260917Style';
    s.textContent=''
      +'.kt-approved-guest-cell>video{object-fit:cover!important;object-position:center center!important;}'
      +'.kt-approved-guest-cell.host>video{transform:scale(.86)!important;}'
      +'.kt-approved-guest-cell.self>video{transform:scaleX(-1) scale(.86)!important;}';
    document.head.appendChild(s);
  }

  install();
  try{
    var mo=new MutationObserver(function(){install();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
