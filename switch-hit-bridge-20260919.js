/* K-Talk 스위치 터치 브리지 (2026-09-19)
   화면/레이아웃/카메라/방송/채팅은 바꾸지 않고,
   가려진 터치에서도 스위치와 지정된 촬영 3버튼만 정확히 실행한다. */
(function(){
  if(window.__ktSwitchHitBridge20260919)return;
  window.__ktSwitchHitBridge20260919=true;

  var lastEl=null,lastAt=0;

  /* 자동 재잠금 없음: 스위치는 항상 잠금 해제 상태를 유지 */
  window.ktHoldSwitchesUnlocked5m=function(){ return true; };
  window.ktEndSwitchWork=function(){ return true; };

  function visible(el){
    if(!el||!el.isConnected)return false;
    try{
      var cs=getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      var r=el.getBoundingClientRect();
      return r.width>2&&r.height>2;
    }catch(e){return false;}
  }

  function sheetOpen(){
    var s=document.getElementById('sheet');
    return !!(s&&s.classList.contains('show'));
  }

  function candidatesAt(x,y){
    var els=[];
    try{els=document.elementsFromPoint(x,y)||[];}catch(e){}
    return els;
  }

  function wanted(el){
    if(!el||!el.matches)return false;

    if(!sheetOpen() && el.matches(
      '#creator .creator-top .creator-rotate,'+
      '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],'
    )) return true;

    return el.matches(
      '.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button,'+
      '.live-prep .room-switch,.live-prep .prep-bottom button,'+
      '.creator-bottom .modes span,.creator-bottom .modes button'
    );
  }

  function findTarget(x,y){
    var els=candidatesAt(x,y);
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(wanted(el)&&visible(el))return el;
      if(el&&el.closest){
        var c=el.closest(
          '.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button,'+
          '.live-prep .room-switch,.live-prep .prep-bottom button,'+
          '.creator-bottom .modes span,.creator-bottom .modes button,'+
          '#creator .creator-top .creator-rotate,'+
          '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],'
        );
        if(c&&wanted(c)&&visible(c))return c;
      }
    }
    return null;
  }

  function pulse(el){
    try{
      el.classList.add('test-active');
      setTimeout(function(){try{el.classList.remove('test-active');}catch(e){}},140);
    }catch(e){}
  }

  function creatorAction(el){
    if(sheetOpen())return false;
    var creator=document.getElementById('creator');
    if(!creator||!creator.classList.contains('show')||creator.classList.contains('live-prep-open'))return false;

    if(el.matches('.creator-top .creator-rotate')){
      try{
        if(typeof window.ktAllRoomsFlipCamera==='function'){
          window.ktAllRoomsFlipCamera(); return true;
        }
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

    if(el.matches('.creator-tool-text[aria-label="AI 보정"]')){
      try{
        if(typeof window.openBeautyPanel==='function'){
          window.openBeautyPanel(); return true;
        }
      }catch(e){}
      return false;
    }

    return false;
  }

  function switchAction(el){
    try{
      if(el.matches('.kt-total-admin-row')){
        if(typeof window.ktToggleTotalAdminPanel==='function'){
          window.ktToggleTotalAdminPanel(); return true;
        }
      }

      if(el.matches('.kt-owner-monitor button')){
        if(typeof window.ktToggleOwnerMonitorMode==='function'){
          window.ktToggleOwnerMonitorMode(); return true;
        }
      }

      if(el.matches('.live-prep .room-switch')){
        var t=String(el.textContent||'').replace(/\s+/g,'');
        var type='solo',name='1인 방송',max=1;
        if(t.indexOf('9명')>-1){type='group9';name='9명 방송';max=9;}
        else if(t.indexOf('13명')>-1){type='group13';name='13명 방송';max=13;}
        else if(t.indexOf('구독')>-1){type='subscriber';name='구독자 방송';max=10;}
        else if(t.indexOf('비밀')>-1){type='password';name='비밀방';max=7;}
        if(typeof window.selectPrepRoom==='function'){
          window.selectPrepRoom(el,type,name,max); return true;
        }
      }

      if(el.matches('.live-prep .prep-bottom button')){
        var bt=String(el.textContent||'').replace(/\s+/g,'');
        var label='1인',type2='solo',name2='1인 방송',max2=1;
        if(bt.indexOf('9명')>-1){label='9명';type2='group9';name2='9명 방송';max2=9;}
        else if(bt.indexOf('13명')>-1){label='13명';type2='group13';name2='13명 방송';max2=13;}
        else if(bt.indexOf('구독')>-1){label='구독자';type2='subscriber';name2='구독자 방송';max2=10;}
        else if(bt.indexOf('비밀')>-1){label='비밀';type2='password';name2='비밀방';max2=7;}
        if(typeof window.ktPickBottomRoom==='function'){
          window.ktPickBottomRoom(el,label,type2,name2,max2); return true;
        }
      }

      if(el.matches('.creator-bottom .modes span,.creator-bottom .modes button')){
        var mt=String(el.textContent||'').replace(/\s+/g,'');
        if(mt.indexOf('10분')>-1&&typeof window.selectCreatorDuration==='function'){
          window.selectCreatorDuration(el,600000); return true;
        }
        if(mt.indexOf('60초')>-1&&typeof window.selectCreatorDuration==='function'){
          window.selectCreatorDuration(el,60000); return true;
        }
        if(mt.indexOf('15초')>-1&&typeof window.selectCreatorDuration==='function'){
          window.selectCreatorDuration(el,15000); return true;
        }
        if(mt.indexOf('라이브')>-1&&typeof window.openTikLivePrep==='function'){
          window.openTikLivePrep(); return true;
        }
      }

      if(el.matches('.kt-switch')){
        var row=el.closest('.kt-setting-row');
        var labelTxt=row?String(row.textContent||'').replace(/\s+/g,''):'';
        if(labelTxt.indexOf('AI음성안내')>-1&&typeof window.toggleAIVoice==='function'){
          window.toggleAIVoice(el); return true;
        }
        if(typeof window.toggleLiveSetting==='function'){
          window.toggleLiveSetting(el); return true;
        }
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

  function run(el){
    if(!el)return false;
    var ok=creatorAction(el);
    if(!ok)ok=switchAction(el);
    if(ok)pulse(el);
    return ok;
  }

  function pointOf(e){
    if(e.changedTouches&&e.changedTouches[0]){
      return {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    }
    return {x:e.clientX,y:e.clientY};
  }

  function handle(e){
    var p=pointOf(e);
    if(!isFinite(p.x)||!isFinite(p.y))return;
    var el=findTarget(p.x,p.y);
    if(!el)return;

    var now=Date.now();
    if(lastEl===el&&now-lastAt<420)return;

    if(!run(el))return;
    lastEl=el;lastAt=now;

    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
  }

  /* 실제 손가락을 뗄 때 좌표로 버튼을 찾아 실행 */
  window.addEventListener('pointerup',handle,true);
  window.addEventListener('touchend',handle,true);

  /* pointerup 뒤 자동 click 이중 실행 차단 */
  window.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest(
      '.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button,'+
      '.live-prep .room-switch,.live-prep .prep-bottom button,'+
      '.creator-bottom .modes span,.creator-bottom .modes button,'+
      '#creator .creator-top .creator-rotate,'+
      '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],'
    ):null;
    if(el&&lastEl===el&&Date.now()-lastAt<700){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    }
  },true);

  var unlockSelector=
      '.kt-switch,[role="switch"],.kt-total-admin-row,.kt-owner-monitor button,'+
      '.live-prep .room-switch,.live-prep .prep-bottom button,'+
      '.creator-bottom .modes span,.creator-bottom .modes button,'+
      '#creator .creator-top .creator-rotate,'+
      '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],';

  function unlock(){
    document.querySelectorAll(unlockSelector).forEach(function(el){
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        if(el.hasAttribute('inert'))el.removeAttribute('inert');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
  }

  unlock();
  [100,300,700,1200,2200].forEach(function(ms){setTimeout(unlock,ms);});

  /* 자동 재잠금 방지: 계속 잠금 해제 상태 유지 */
  setInterval(unlock,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSwitchHitBridgeTimer);
      window.__ktSwitchHitBridgeTimer=setTimeout(unlock,20);
    }).observe(document.documentElement,{
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['disabled','aria-disabled','style','class','inert']
    });
  }catch(e){}
})();