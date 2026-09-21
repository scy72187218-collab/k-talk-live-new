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
        +'display:flex!important;left:2px!important;right:auto!important;top:auto!important;bottom:1px!important;'
        +'transform:none!important;transform-origin:left bottom!important;gap:4px!important;'
        +'max-width:calc(100% - 4px)!important;min-height:13px!important;padding:1px 3px 1px 1px!important;border-radius:999px!important;'
        +'background:rgba(20,10,30,.78)!important;border:1px solid rgba(255,65,210,.45)!important;z-index:70!important'
      +'}'
      /* 승인 사진 기준: 얼굴을 가리지 않게 하단 표시는 아주 얇게 */
      +'#screen .kt-allhost-profile{height:12px!important;min-height:12px!important;max-height:12px!important;left:2px!important;bottom:0!important;padding:0 3px 0 1px!important;gap:2px!important;border-radius:7px!important;overflow:hidden!important;align-items:center!important}'
      /* 큰 K 원형/프로필 사진은 숨기고, 닉네임 + 레벨만 한 줄로 표시 */
      +'#screen .kt-allhost-profile .kt-allhost-photo,#screen .kt-allhost-profile .kt-allhost-fallback{display:none!important;width:0!important;height:0!important;min-width:0!important;margin:0!important;padding:0!important;border:0!important}'
      +'#screen .kt-allhost-profile .kt-allhost-name{order:1!important;display:block!important;max-width:48px!important;font-size:6px!important;line-height:10px!important;color:#fff!important;font-weight:950!important}'
      +'#screen .kt-allhost-profile .kt-allhost-level{order:2!important;height:10px!important;padding:0 3px!important;font-size:6px!important;line-height:10px!important;background:rgba(15,15,20,.88)!important;color:#fff!important;border:0!important}'

      /* FINAL APPROVED: K/profile circle hidden; nickname + level only; tiny bottom-left */
      +'#screen .kt-allhost-profile{display:flex!important;position:absolute!important;left:2px!important;right:auto!important;top:auto!important;bottom:0!important;height:11px!important;min-height:11px!important;max-height:11px!important;max-width:calc(100% - 4px)!important;padding:0 2px!important;gap:2px!important;border-radius:6px!important;background:rgba(0,0,0,.56)!important;border:0!important;box-shadow:none!important;overflow:hidden!important;align-items:center!important;z-index:70!important;pointer-events:none!important}'
      +'#screen .kt-allhost-profile .kt-allhost-photo,#screen .kt-allhost-profile .kt-allhost-fallback{display:none!important;width:0!important;height:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important;border:0!important;opacity:0!important}'
      +'#screen .kt-allhost-profile .kt-allhost-name{order:1!important;display:block!important;max-width:46px!important;margin:0!important;padding:0!important;font-size:6px!important;line-height:10px!important;color:#fff!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'#screen .kt-allhost-profile .kt-allhost-level{order:2!important;display:inline-flex!important;align-items:center!important;height:9px!important;margin:0!important;padding:0 2px!important;border:0!important;border-radius:4px!important;background:rgba(18,18,22,.82)!important;color:#fff!important;font-size:5.5px!important;line-height:9px!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .ktsolo-main [class*="wave"],#screen .ktg13-host [class*="wave"],#screen .ktsubscriber-host [class*="wave"],#screen .ktsecret-slot.host [class*="wave"],#screen .ktsecret-host [class*="wave"],#screen .ktg9-host [class*="wave"]{display:none!important;visibility:hidden!important;opacity:0!important}'
      +'#screen .ktg13-host::after,#screen .ktsubscriber-host::after,#screen .ktsecret-slot.host::after,#screen .ktg9-host::after{content:none!important;display:none!important}'
      /* 기존 호스트 글자는 숨기고 프로필/닉네임/레벨만 표시 */
      +'#screen .ktg13-host-label,#screen .ktsubscriber-host-label,'
      +'#screen .ktsecret-slot.host>.ktsecret-slot-label,#screen .ktsecret-host-label,#screen .ktg9-host-label{display:none!important}'
      /* 예전 위쪽 호스트 프로필/레벨 띠는 숨김: 장미 배지와 겹치지 않게 */
      +'#screen .ktsolo-main>.kt-hg-host-identity,'
      +'#screen .ktg13-host>.kt-hg-host-identity,'
      +'#screen .ktsubscriber-host>.kt-hg-host-identity,'
      +'#screen .ktsecret-slot.host>.kt-hg-host-identity,'
      +'#screen .ktsecret-host>.kt-hg-host-identity,'
      +'#screen .ktg9-host>.kt-hg-host-identity{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}'
      /* 게스트 칸은 기존 위치/크기 그대로: 호스트만 내부 좌하단 표기 */
      +'#screen .ktg13-host,#screen .ktsubscriber-host,#screen .ktsecret-slot.host,#screen .ktsecret-host,#screen .ktg9-host,#screen .ktsolo-main{position:relative!important}'
      /* 게스트 화면에서도 호스트 영상 라벨은 영상 안쪽, 게스트는 기존 칸 바깥 배열 유지 */
      +'.kt-guest-hostlike-room .kgh-cell.host .kt-allhost-profile{'
        +'display:flex!important;left:2px!important;right:auto!important;top:auto!important;bottom:1px!important;'
        +'transform:none!important;gap:1px!important;padding:1px 2px 1px 1px!important;z-index:70!important'
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
      /* 예전 상단 프로필 띠는 호스트에서만 숨김 */
      var legacy=tile.querySelector(':scope > .kt-hg-host-identity');
      if(legacy){
        try{legacy.style.setProperty('display','none','important');legacy.style.setProperty('visibility','hidden','important');}catch(e){}
      }
      var p=tile.querySelector(':scope > .kt-allhost-profile');
      /* 다른 스크립트 순서 때문에 아래 프로필이 빠져도 두 번째 사진 모양으로 즉시 복구 */
      if(!p){
        try{
          var name='';
          var level='';
          var photo='';
          var d=tile.dataset||{};
          name=String(d.nickname||d.displayName||d.userName||d.username||d.hostName||'').trim();
          level=String(d.level||d.userLevel||d.memberLevel||d.hostLevel||'').trim();
          photo=String(d.profilePhoto||d.profileImage||d.avatar||d.avatarUrl||d.photo||'').trim();
          if(!name&&window.state)name=String(state.nickname||state.nickName||state.displayName||state.userName||state.username||state.name||'').trim();
          if(!level&&window.state)level=String(state.level||state.userLevel||state.memberLevel||state.hostLevel||'').trim();
          if(!photo&&window.state)photo=String(state.profilePhoto||state.profileImage||state.avatar||state.avatarUrl||state.photo||'').trim();
          if(!name&&legacy){var ln=legacy.querySelector('.kt-hg-name');if(ln)name=String(ln.textContent||'').trim();}
          if(!level&&legacy){var ll=legacy.querySelector('.kt-hg-level');if(ll)level=String(ll.textContent||'').trim();}
          if(!photo&&legacy){var li=legacy.querySelector('img.kt-hg-photo');if(li&&li.src)photo=li.src;}
          if(!name){try{name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('kt_profile_name')||localStorage.getItem('nickname')||'';}catch(e){}}
          if(!level){try{level=localStorage.getItem('ktalk_level')||localStorage.getItem('ktalk_user_level')||localStorage.getItem('level')||'';}catch(e){}}
          if(!photo){try{photo=localStorage.getItem('ktalk_profile_photo')||localStorage.getItem('kt_profile_photo')||'';}catch(e){}}
          var n=parseInt(String(level||'1').replace(/[^0-9]/g,''),10);if(!isFinite(n)||n<1)n=1;
          try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
          p=document.createElement('div');p.className='kt-allhost-profile';
          if(photo){var im=document.createElement('img');im.className='kt-allhost-photo';im.alt='프로필';im.src=photo;p.appendChild(im);}else{var fb=document.createElement('span');fb.className='kt-allhost-fallback';fb.textContent=(name||'K').charAt(0);p.appendChild(fb);}
          var nm=document.createElement('span');nm.className='kt-allhost-name';nm.textContent=name||'K-Talk';p.appendChild(nm);
          var lv=document.createElement('span');lv.className='kt-allhost-level';lv.textContent='Lv.'+n;p.appendChild(lv);
          tile.appendChild(p);
        }catch(e){}
      }
      if(p){
        p.style.setProperty('display','flex','important');
        p.style.setProperty('left','2px','important');
        p.style.setProperty('right','auto','important');
        p.style.setProperty('top','auto','important');
        p.style.setProperty('bottom','0','important');
        p.style.setProperty('transform','none','important');
        p.style.setProperty('display','flex','important');
        p.style.setProperty('gap','1px','important');
        p.style.setProperty('padding','1px 3px 1px 1px','important');
        p.style.setProperty('min-height','12px','important');p.style.setProperty('height','12px','important');p.style.setProperty('max-height','12px','important');p.style.setProperty('overflow','hidden','important');
        p.setAttribute('data-kt-final-host-text-only','1');
        p.style.setProperty('left','2px','important');
        p.style.setProperty('bottom','0','important');
        p.style.setProperty('height','11px','important');
        p.style.setProperty('min-height','11px','important');
        p.style.setProperty('max-height','11px','important');
        p.style.setProperty('padding','0 2px','important');
        p.style.setProperty('gap','2px','important');
        p.style.setProperty('border','0','important');
        p.style.setProperty('box-shadow','none','important');
        p.style.setProperty('background','rgba(0,0,0,.56)','important');
        var ph=p.querySelector('.kt-allhost-photo,.kt-allhost-fallback');
        var nm=p.querySelector('.kt-allhost-name');
        var lv=p.querySelector('.kt-allhost-level');
        if(ph){ph.style.setProperty('display','none','important');ph.style.setProperty('width','0','important');ph.style.setProperty('height','0','important');ph.style.setProperty('min-width','0','important');ph.style.setProperty('max-width','0','important');ph.style.setProperty('opacity','0','important');}
        if(nm){nm.style.setProperty('order','1','important');nm.style.setProperty('font-size','6px','important');nm.style.setProperty('max-width','46px','important');nm.style.setProperty('line-height','10px','important');}
        if(lv){lv.style.setProperty('order','2','important');lv.style.setProperty('font-size','5.5px','important');lv.style.setProperty('height','9px','important');lv.style.setProperty('background','rgba(18,18,22,.82)','important');lv.style.setProperty('color','#fff','important');lv.style.setProperty('border','0','important');}
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
  window.__ktFinalHostTextOnly20260921=true;window.__ktFiveRoomHostMiniNoWaveInterval20260921=setInterval(enforce,350);
})();