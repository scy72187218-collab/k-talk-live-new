/* K-Talk 스위치/촬영 3버튼 터치 복구 전용 (2026-09-19)
   다른 화면/레이아웃/카메라 보정/방송/게스트/채팅은 변경하지 않음. */
(function(){
  if(window.__ktSwitchTouchHotfix20260919)return;
  window.__ktSwitchTouchHotfix20260919=true;

  var lastEl=null,lastAt=0;

  function creatorVisible(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show')&&!c.classList.contains('creator-review'));
  }

  function isCreatorTarget(el){
    if(!creatorVisible()||!el||!el.matches)return false;
    return el.matches('.creator-top .creator-rotate,'
      +'.creator-tools .creator-tool-text[aria-label="AI 보정"],'
      +'.creator-tools .creator-tool-text[aria-label="편집 효과"]');
  }

  function doCreator(el){
    if(el.matches('.creator-top .creator-rotate')){
      try{
        if(typeof window.toggleCreatorCamera==='function'){window.toggleCreatorCamera();return true;}
        if(typeof window.ensureLiveCamera==='function'){
          var cur=(window.state&&state.cameraFacing)||'user';
          var next=cur==='environment'?'user':'environment';
          Promise.resolve(window.ensureLiveCamera(next)).then(function(ok){
            if(ok!==false&&window.state)state.cameraFacing=next;
          }).catch(function(){});
          return true;
        }
      }catch(e){}
      return false;
    }
    if(el.matches('.creator-tools .creator-tool-text[aria-label="AI 보정"]')){
      try{if(typeof window.openBeautyPanel==='function'){window.openBeautyPanel();return true;}}catch(e){}
      return false;
    }
    if(el.matches('.creator-tools .creator-tool-text[aria-label="편집 효과"]')){
      try{if(typeof window.openEditEffectPanel==='function'){window.openEditEffectPanel();return true;}}catch(e){}
      return false;
    }
    return false;
  }

  function isSwitchTarget(el){
    if(!el||!el.matches)return false;
    return el.matches('.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button');
  }

  function doSwitch(el){
    try{
      if(el.matches('.kt-total-admin-row')){
        if(typeof window.ktToggleTotalAdminPanel==='function'){window.ktToggleTotalAdminPanel();return true;}
      }
      if(el.matches('.kt-owner-monitor button')){
        if(typeof window.ktToggleOwnerMonitorMode==='function'){window.ktToggleOwnerMonitorMode();return true;}
      }

      var row=el.closest('.kt-setting-row');
      var label=row?String(row.textContent||'').replace(/\s+/g,''):'';
      if(label.indexOf('AI음성안내')>-1&&typeof window.toggleAIVoice==='function'){
        window.toggleAIVoice(el);return true;
      }
      if(el.classList.contains('kt-switch')&&typeof window.toggleLiveSetting==='function'){
        window.toggleLiveSetting(el);return true;
      }

      if(el.getAttribute('role')==='switch'){
        var attr=el.hasAttribute('aria-checked')?'aria-checked':'aria-pressed';
        var on=el.getAttribute(attr)==='true'||el.classList.contains('on');
        el.classList.toggle('on',!on);
        el.setAttribute(attr,!on?'true':'false');
        return true;
      }
    }catch(e){}
    return false;
  }

  function targetFromEvent(e){
    var t=e.target&&e.target.closest?e.target.closest(
      '.creator-top .creator-rotate,'
      +'.creator-tools .creator-tool-text[aria-label="AI 보정"],'
      +'.creator-tools .creator-tool-text[aria-label="편집 효과"],'
      +'.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button'
    ):null;
    return t;
  }

  function handle(e){
    var el=targetFromEvent(e);
    if(!el)return;
    var now=Date.now();
    if(lastEl===el&&now-lastAt<420)return;

    var ok=isCreatorTarget(el)?doCreator(el):(isSwitchTarget(el)?doSwitch(el):false);
    if(!ok)return;

    lastEl=el;lastAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
  }

  /* 기존 pointerdown 차단 뒤에도 실행되도록 pointerup/touchend에서 직접 처리 */
  window.addEventListener('pointerup',handle,true);
  window.addEventListener('touchend',handle,true);

  /* 방금 직접 처리한 뒤 이어지는 click의 이중 실행만 막는다. */
  window.addEventListener('click',function(e){
    var el=targetFromEvent(e);
    if(!el)return;
    if(lastEl===el&&Date.now()-lastAt<650){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    }
  },true);

  function unlock(){
    var q='.creator-top .creator-rotate,'
      +'.creator-tools .creator-tool-text[aria-label="AI 보정"],'
      +'.creator-tools .creator-tool-text[aria-label="편집 효과"],'
      +'.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button';
    document.querySelectorAll(q).forEach(function(el){
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
  }

  unlock();
  [100,300,700,1200,2200].forEach(function(ms){setTimeout(unlock,ms);});
  try{
    new MutationObserver(function(){setTimeout(unlock,20);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();