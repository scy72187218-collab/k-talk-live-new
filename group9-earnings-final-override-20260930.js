/* 9명방 수익률 최종 모양 고정 — 5555
   사용자 사진 기준: 오른쪽 아래 작은 노란 수익률 박스.
   다른 방/버튼/영상/채팅/배치는 변경하지 않음. */
(function(){
  if(window.__ktGroup9EarningsPhotoMatch5555)return;
  window.__ktGroup9EarningsPhotoMatch5555=true;

  function install(){
    var old=document.getElementById('ktGroup9EarningsPhotoMatch5555Style');
    if(old)old.remove();

    var s=document.createElement('style');
    s.id='ktGroup9EarningsPhotoMatch5555Style';
    s.textContent=
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn{'+
        'position:fixed!important;left:auto!important;right:8px!important;top:auto!important;bottom:58px!important;'+
        'width:150px!important;min-width:150px!important;max-width:150px!important;'+
        'height:40px!important;min-height:40px!important;max-height:40px!important;'+
        'margin:0!important;padding:0!important;display:block!important;overflow:visible!important;'+
        'transform:none!important;animation:none!important;transition:none!important;z-index:2147483000!important}'+
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud{'+
        'position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'+
        'width:150px!important;min-width:150px!important;max-width:150px!important;'+
        'height:40px!important;min-height:40px!important;max-height:40px!important;'+
        'margin:0!important;padding:2px 4px!important;box-sizing:border-box!important;'+
        'border:1px solid rgba(210,169,54,.78)!important;border-radius:9px!important;'+
        'background:linear-gradient(135deg,#17140b,#0d0d12)!important;color:#fff!important;text-align:center!important;'+
        'overflow:hidden!important;transform:none!important;animation:none!important;transition:none!important;opacity:1!important;visibility:visible!important}'+
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud *{animation:none!important;transition:none!important}';
    document.head.appendChild(s);
  }

  install();
  [60,180,400,800,1400].forEach(function(ms){setTimeout(install,ms);});
})();