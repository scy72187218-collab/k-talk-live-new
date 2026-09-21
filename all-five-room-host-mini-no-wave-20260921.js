/* K-Talk 2026-09-21: 5개 방송방 공통 미세조정
   대상: 1인방 / 9명방 / 13명방 / 구독방 / 비밀방
   변경: 장미 수량 배지 50% 축소, 호스트 닉네임·레벨 50% 축소 후 영상 안쪽 좌하단,
         방송 파장 제거. 그 외 기능/채팅/선물/스위치/영상통신은 변경하지 않음. */
(function(){
  if(window.__ktFiveRoomHostMiniNoWave20260921)return;
  window.__ktFiveRoomHostMiniNoWave20260921=true;

  function ensureStyle(){
    if(document.getElementById('ktFiveRoomHostMiniNoWaveStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktFiveRoomHostMiniNoWaveStyle20260921';
    s.textContent=''
      /* 파장만 제거 */
      +'#screen .ktsolo-wave,#screen .ktg13-wave,#screen .ktsubscriber-wave,#screen .ktsecret-wave,#screen .kt-room-live-wave{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}'
      +'#screen .ktg13-main::after{content:none!important;display:none!important;visibility:hidden!important;opacity:0!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]) .ktg13-main{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]) .ktg13-guests{display:contents!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]) .ktg13-host{grid-column:auto!important;grid-row:auto!important;border:1px solid #ff42c9!important;box-shadow:inset 0 0 0 1px rgba(255,66,201,.18)!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host{border:1px solid #ff42c9!important;box-shadow:inset 0 0 0 1px rgba(255,66,201,.18)!important}'
      +'#screen .ktsubscriber-people{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important}'
      +'#screen .ktsubscriber-host{grid-column:auto!important;grid-row:auto!important;border-color:#ff42c9!important}'
      +'#screen .ktsecret-slot.host{border-color:#ff42c9!important}'
      +'#screen .ktsolo-main{border:1px solid #ff42c9!important}'
      /* 장미 0/수량 배지 약 50% */
      +'#screen .kt-rose-count-badge{left:4px!important;top:4px!important;height:12px!important;min-width:22px!important;padding:0 3px!important;gap:1px!important;border-radius:999px!important;font-size:6.5px!important;line-height:1!important;border-width:1px!important}'
      +'#screen .kt-rose-count-badge:before{font-size:6px!important}'
      /* 호스트 닉네임/레벨: 영상 안쪽 맨 아래 왼쪽 */
      +'#screen .ktsolo-main>.kt-allhost-profile,'
      +'#screen .ktg13-host>.kt-allhost-profile,'
      +'#screen .ktsubscriber-host>.kt-allhost-profile,'
      +'#screen .ktsecret-slot.host>.kt-allhost-profile,'
      +'#screen .ktsecret-host>.kt-allhost-profile,'
      +'#screen .ktg9-host>.kt-allhost-profile{'
        +'display:flex!important;left:5px!important;right:auto!important;top:auto!important;bottom:5px!important;'
        +'transform:none!important;transform-origin:left bottom!important;gap:4px!important;'
        +'max-width:calc(100% - 10px)!important;min-height:22px!important;padding:2px 5px 2px 2px!important;border-radius:999px!important;'
        +'background:rgba(20,10,30,.78)!important;border:1px solid rgba(255,65,210,.45)!important;z-index:70!important'
      +'}'
      /* 프로필 사진은 작게 유지, 닉네임/레벨은 기존 대비 약 50% */
      +'#screen .kt-allhost-profile .kt-allhost-photo,#screen .kt-allhost-profile .kt-allhost-fallback{'
        +'order:1!important;width:18px!important;height:18px!important;min-width:18px!important;font-size:8px!important;border-width:1px!important;background:#7b2cff!important'
      +'}'
      +'#screen .kt-allhost-profile .kt-allhost-name{'
        +'order:2!important;display:block!important;max-width:72px!important;font-size:10px!important;line-height:1!important;color:#fff!important;font-weight:950!important'
      +'}'
      +'#screen .kt-allhost-profile .kt-allhost-level{'
        +'order:3!important;height:16px!important;padding:0 5px!important;font-size:9px!important;line-height:1!important;background:rgba(15,15,20,.88)!important;color:#fff!important;border:1px solid rgba(255,255,255,.18)!important'
      +'}'
      +'#screen .ktsolo-main [class*="wave"],#screen .ktg13-host [class*="wave"],#screen .ktsubscriber-host [class*="wave"],#screen .ktsecret-slot.host [class*="wave"],#screen .ktsecret-host [class*="wave"],#screen .ktg9-host [class*="wave"]{display:none!important;visibility:hidden!important;opacity:0!important}'
      +'#screen .ktg13-host::after,#screen .ktsubscriber-host::after,#screen .ktsecret-slot.host::after,#screen .ktg9-host::after{content:none!important;display:none!important}'
      /* 기존 호스트 글자는 숨기고 프로필/닉네임/레벨만 표시 */
      +'#screen .ktg13-host-label,#screen .ktsubscriber-host-label,'
      +'#screen .ktsecret-slot.host>.ktsecret-slot-label,#screen .ktsecret-host-label,#screen .ktg9-host-label{display:none!important}'
      /* 게스트 칸은 기존 위치/크기 그대로: 호스트만 내부 좌하단 표기 */
      +'#screen .ktg13-host,#screen .ktsubscriber-host,#screen .ktsecret-slot.host,#screen .ktsecret-host,#screen .ktg9-host,#screen .ktsolo-main{position:relative!important}'
      /* 게스트 화면에서도 호스트 영상 라벨은 영상 안쪽, 게스트는 기존 칸 바깥 배열 유지 */
      +'.kt-guest-hostlike-room .kgh-cell.host .kt-allhost-profile{'
        +'display:flex!important;left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;'
        +'transform:none!important;gap:2px!important;padding:1px 3px 1px 1px!important;z-index:70!important'
      +'}'
      +'.kt-guest-hostlike-room .kgh-cell.host>.kgh-label{display:none!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function hostTiles(){
    return document.querySelectorAll(
      '#screen .ktsolo-main,'+
      '#screen .ktg13-host,'+
      '#screen .ktsubscriber-host,'+
      '#screen .ktsecret-slot.host,'+
      '#screen .ktsecret-host,'+
      '#screen .ktg9-host,'+
      '.kt-guest-hostlike-room .kgh-cell.host'
    );
  }

  function enforce(){
    ensureStyle();

    /* 9명방의 기존 스크립트가 프로필을 숨겨도 다시 승인된 표시로 복구 */
    hostTiles().forEach(function(tile){
      try{tile.style.setProperty('position','relative','important');}catch(e){}
      var p=tile.querySelector(':scope > .kt-allhost-profile');
      if(p){
        p.style.setProperty('display','flex','important');
        p.style.setProperty('left','5px','important');
        p.style.setProperty('right','auto','important');
        p.style.setProperty('top','auto','important');
        p.style.setProperty('bottom','5px','important');
        p.style.setProperty('transform','none','important');
        p.style.setProperty('display','flex','important');
        p.style.setProperty('gap','4px','important');
        p.style.setProperty('padding','2px 5px 2px 2px','important');
        p.style.setProperty('min-height','22px','important');
        var ph=p.querySelector('.kt-allhost-photo,.kt-allhost-fallback');
        var nm=p.querySelector('.kt-allhost-name');
        var lv=p.querySelector('.kt-allhost-level');
        if(ph){ph.style.setProperty('order','1','important');ph.style.setProperty('width','18px','important');ph.style.setProperty('height','18px','important');ph.style.setProperty('min-width','18px','important');}
        if(nm){nm.style.setProperty('order','2','important');nm.style.setProperty('font-size','10px','important');nm.style.setProperty('max-width','72px','important');}
        if(lv){lv.style.setProperty('order','3','important');lv.style.setProperty('font-size','9px','important');lv.style.setProperty('height','16px','important');lv.style.setProperty('background','rgba(15,15,20,.88)','important');lv.style.setProperty('color','#fff','important');}
      }
    });

    document.querySelectorAll(
      '#screen .ktg13-host-label,#screen .ktsubscriber-host-label,'+
      '#screen .ktsecret-slot.host>.ktsecret-slot-label,#screen .ktsecret-host-label,'+
      '#screen .ktg9-host-label,.kt-guest-hostlike-room .kgh-cell.host>.kgh-label'
    ).forEach(function(el){
      try{el.style.setProperty('display','none','important');}catch(e){}
    });

    document.querySelectorAll(
      '#screen .ktsolo-wave,#screen .ktg13-wave,#screen .ktsubscriber-wave,'+
      '#screen .ktsecret-wave,#screen .kt-room-live-wave'
    ).forEach(function(el){
      try{el.style.setProperty('display','none','important');}catch(e){}
    });
  }

  ensureStyle();
  enforce();
  [30,100,250,600,1200,2200,4200].forEach(function(ms){setTimeout(enforce,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktFiveRoomHostMiniNoWaveTimer20260921);
      window.__ktFiveRoomHostMiniNoWaveTimer20260921=setTimeout(enforce,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* 기존 9명방 보정 타이머가 계속 도는 동안에도 표시를 유지 */
  window.__ktFiveRoomHostMiniNoWaveInterval20260921=setInterval(enforce,350);
})();