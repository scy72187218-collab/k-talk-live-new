/* 9명방 수익률 복구 — 2026-09-25 18:31 배포 기준, 5555
   가장 가까운 18:30 시점의 실제 배포(dpl_9vtr..., commit 426e9e...)에 있던
   9/13명 공통 수익률 레이아웃 값 중 9명방 수익률 관련 값만 복원한다. */
(function(){
  if(window.__ktGroup9EarningsRestore20260925_1830_5555)return;
  window.__ktGroup9EarningsRestore20260925_1830_5555=true;

  function install(){
    var old=document.getElementById('ktGroup9EarningsRestore20260925_1830_5555');
    if(old)old.remove();

    var s=document.createElement('style');
    s.id='ktGroup9EarningsRestore20260925_1830_5555';
    s.textContent=
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-mid{'+
        'flex:0 0 58px!important;grid-template-columns:minmax(0,1fr) 104px!important;gap:5px!important}'+
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-chat{height:58px!important;max-height:58px!important}'+
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn{'+
        'position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'+
        'transform:none!important;grid-column:2!important;justify-self:end!important;justify-content:flex-end!important;align-items:flex-end!important;'+
        'width:104px!important;max-width:104px!important;min-width:104px!important;'+
        'height:54px!important;min-height:54px!important;max-height:54px!important;'+
        'margin:0!important;padding:0!important;display:flex!important;overflow:visible!important;z-index:auto!important}'+
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud{'+
        'position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;'+
        'width:104px!important;max-width:104px!important;min-width:104px!important;'+
        'height:54px!important;max-height:54px!important;min-height:54px!important;'+
        'margin-left:auto!important;margin-right:0!important;translate:0 0!important;'+
        'padding:1px 3px!important;box-sizing:border-box!important;overflow:hidden!important;'+
        'border:1px solid #d2a936!important;border-radius:10px!important;'+
        'background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important;'+
        'animation:none!important;transition:none!important;opacity:1!important;visibility:visible!important}'+
      '#screen .ktg13-room[data-kt-room="9"] #myEarnHud>div:first-child{'+
        'display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;white-space:nowrap!important;overflow:hidden!important}'+
      '#screen .ktg13-room[data-kt-room="9"] #myEarnHud span{font-size:5.5px!important;line-height:1!important}'+
      '#screen .ktg13-room[data-kt-room="9"] #myEarnHud b{font-size:8px!important;line-height:1!important}'+
      '#screen .ktg13-room[data-kt-room="9"] #myEarnDetail{display:grid!important;font-size:5.2px!important;line-height:1.08!important;gap:1px!important;margin-top:1px!important}'+
      '@media(max-width:390px){'+
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-mid{grid-template-columns:minmax(0,1fr) 100px!important}'+
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn{width:100px!important;max-width:100px!important;min-width:100px!important}'+
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud{width:100px!important;max-width:100px!important;min-width:100px!important}'+
      '}';
    document.head.appendChild(s);
  }

  install();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(install,ms);});
})();