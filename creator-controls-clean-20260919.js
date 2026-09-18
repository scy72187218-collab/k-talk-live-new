/* K-Talk 촬영화면 4개 버튼 잠금/묶음 해제 (2026-09-19)
   대상만 수정: 되돌리기 / AI 보정 / 편집효과 / 사운드 추가.
   다른 방송방·게스트·채팅·스위치·하단 촬영 기능은 건드리지 않음. */
(function(){
  if(window.__ktCreatorControlsFree20260919)return;
  window.__ktCreatorControlsFree20260919=true;

  function install(){
    var creator=document.getElementById('creator');
    if(!creator)return;

    var rotate=creator.querySelector('.creator-top .creator-rotate');
    var sound=creator.querySelector('.creator-top .sound');
    var beauty=creator.querySelector('.creator-tools .creator-tool-text[aria-label="AI 보정"]');
    var effects=creator.querySelector('.creator-tools .creator-tool-text[aria-label="편집 효과"]');

    /* 이전에 묶어둔 캡처/중복 터치 바인딩 흔적 해제 */
    [rotate,sound,beauty,effects].forEach(function(el){
      if(!el)return;
      try{
        delete el.dataset.ktFourButtonsBound;
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      }catch(e){}
    });

    /* 각각 독립적으로 바로 실행 */
    if(rotate){
      rotate.setAttribute('aria-label','되돌리기');
      rotate.innerHTML='<b aria-hidden="true">↻</b><small>되돌리기</small>';
      rotate.onclick=function(){
        try{
          if(typeof window.ktAllRoomsFlipCamera==='function'){
            window.ktAllRoomsFlipCamera();
          }else if(typeof window.ktSoloFlipCamera==='function'){
            window.ktSoloFlipCamera();
          }else if(typeof window.ensureLiveCamera==='function'){
            var current=(window.state&&state.cameraFacing)||'user';
            var next=current==='environment'?'user':'environment';
            Promise.resolve(window.ensureLiveCamera(next)).then(function(ok){
              if(ok!==false&&window.state)state.cameraFacing=next;
              var v=document.getElementById('camera');
              if(v&&window.state&&state.stream){
                v.srcObject=state.stream;
                v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
                var p=v.play();if(p&&p.catch)p.catch(function(){});
              }
            }).catch(function(){});
          }
        }catch(e){}
      };
    }

    if(sound){
      sound.onclick=function(){
        try{if(typeof window.openSoundPanel==='function')window.openSoundPanel();}catch(e){}
      };
    }

    if(beauty){
      beauty.onclick=function(){
        try{if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();}catch(e){}
      };
    }

    if(effects){
      effects.onclick=function(){
        try{if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();}catch(e){}
      };
    }

    if(!document.getElementById('ktCreatorControlsFree20260919Style')){
      var s=document.createElement('style');
      s.id='ktCreatorControlsFree20260919Style';
      s.textContent=`
#creator:not(.live-prep-open) .creator-tools > button:not(.creator-tool-text){display:none!important}
#creator:not(.live-prep-open) .creator-tools{
  right:15px!important;top:230px!important;gap:18px!important;
  display:flex!important;flex-direction:column!important;align-items:center!important;
  z-index:10000!important;pointer-events:auto!important
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text{
  width:62px!important;height:72px!important;min-width:62px!important;min-height:72px!important;
  padding:7px 3px!important;border-radius:31px!important;
  display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
  gap:2px!important;background:rgba(0,0,0,.24)!important;color:#fff!important;
  pointer-events:auto!important;touch-action:manipulation!important
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text b{display:block!important;font-size:27px!important;line-height:1!important}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text small{
  display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.05!important;
  font-weight:950!important;white-space:nowrap!important;color:#fff!important
}
#creator:not(.live-prep-open) .creator-top{z-index:10000!important;pointer-events:auto!important}
#creator:not(.live-prep-open) .creator-top .creator-rotate{
  position:absolute!important;right:0!important;top:125px!important;
  width:62px!important;height:72px!important;min-width:62px!important;min-height:72px!important;
  padding:7px 3px!important;border-radius:31px!important;
  display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
  gap:2px!important;background:rgba(0,0,0,.24)!important;color:#fff!important;
  z-index:10001!important;pointer-events:auto!important;touch-action:manipulation!important
}
#creator:not(.live-prep-open) .creator-top .creator-rotate b{display:block!important;font-size:29px!important;line-height:1!important;font-weight:800!important}
#creator:not(.live-prep-open) .creator-top .creator-rotate small{
  display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.05!important;
  font-weight:950!important;white-space:nowrap!important;color:#fff!important
}
#creator:not(.live-prep-open) .creator-top .sound{
  pointer-events:auto!important;touch-action:manipulation!important;z-index:10001!important
}
`;
      document.head.appendChild(s);
    }
  }

  window.ktFixCreatorFourButtons=install;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();

  [100,300,800,1500].forEach(function(ms){setTimeout(install,ms);});

  /* 안정화: 화면이 다시 그려져 버튼이 교체돼도 3개 버튼만 재연결한다.
     다른 화면/방송/채팅/게스트 로직은 건드리지 않음. */
  function stableRefresh(){
    try{install();}catch(e){}
  }

  window.addEventListener('pageshow',stableRefresh);
  window.addEventListener('focus',stableRefresh);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(stableRefresh,40);
  });

  try{
    var mo=new MutationObserver(function(records){
      var need=false;
      for(var i=0;i<records.length&&!need;i++){
        var list=records[i].addedNodes||[];
        for(var j=0;j<list.length;j++){
          var n=list[j];
          if(!n||n.nodeType!==1)continue;
          if((n.id==='creator')||
             (n.matches&&n.matches('.creator-top,.creator-tools,.creator-rotate,.creator-tool-text'))||
             (n.querySelector&&n.querySelector('.creator-top,.creator-tools,.creator-rotate,.creator-tool-text'))){
            need=true;break;
          }
        }
      }
      if(need){
        clearTimeout(window.__ktCreatorControlsStableTimer);
        window.__ktCreatorControlsStableTimer=setTimeout(stableRefresh,35);
      }
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* 혹시 다른 코드가 pointer-events를 다시 막아도 이 3개만 복구 */
  setInterval(function(){
    var creator=document.getElementById('creator');
    if(!creator||!creator.classList.contains('show'))return;
    var list=[
      creator.querySelector('.creator-top .creator-rotate'),
      creator.querySelector('.creator-tools .creator-tool-text[aria-label="AI 보정"]'),
      creator.querySelector('.creator-tools .creator-tool-text[aria-label="편집 효과"]')
    ];
    list.forEach(function(el){
      if(!el)return;
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
  },1200);
})();