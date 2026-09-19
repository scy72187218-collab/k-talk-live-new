/* K-Talk 호스트 영상 크기 70% 조정
   - 호스트 칸 크기/방 배치/게스트 칸은 그대로
   - 호스트 사람 영상만 약 70%로 축소 */
(function(){
  if(window.__ktHostVideoSeventy20260920)return;
  window.__ktHostVideoSeventy20260920=true;

  function ensure(){
    if(document.getElementById('ktHostVideoSeventyStyle20260920'))return;
    var s=document.createElement('style');
    s.id='ktHostVideoSeventyStyle20260920';
    s.textContent=''
      +'.ktg13-host video#ktLiveVideo{'
      +'position:absolute!important;'
      +'left:15%!important;top:15%!important;'
      +'width:70%!important;height:70%!important;'
      +'max-width:70%!important;max-height:70%!important;'
      +'object-fit:contain!important;object-position:center center!important;'
      +'transform:scaleX(-1)!important;'
      +'background:#111!important;}'
      +'.kt-guest-hostlike-room .kgh-cell.host video,'
      +'.kt-approved-guest-grid .kt-approved-guest-cell.host video,'
      +'.kt-guest-room-grid .kt-guest-room-cell.host video{'
      +'position:absolute!important;'
      +'left:15%!important;top:15%!important;'
      +'width:70%!important;height:70%!important;'
      +'max-width:70%!important;max-height:70%!important;'
      +'object-fit:contain!important;object-position:center center!important;'
      +'background:#111!important;}';
    document.head.appendChild(s);
  }

  ensure();
  document.addEventListener('DOMContentLoaded',ensure);
})();
