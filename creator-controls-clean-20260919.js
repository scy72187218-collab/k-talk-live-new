/* K-Talk 촬영화면 오른쪽 3버튼 전용 (2026-09-19)
   되돌리기 / AI 보정 / 편집효과만 관리.
   다른 방송방·게스트·채팅·하단 촬영 기능은 변경하지 않음. */
(function(){
  if(window.__ktCreatorControlsCleanSingle20260919)return;
  window.__ktCreatorControlsCleanSingle20260919=true;

  function creator(){return document.getElementById('creator');}

  function flip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){
        window.ktAllRoomsFlipCamera();
        return;
      }
      if(typeof window.ktSoloFlipCamera==='function'){
        window.ktSoloFlipCamera();
        return;
      }
      if(typeof window.ensureLiveCamera==='function'){
        var cur=(window.state&&state.cameraFacing)||'user';
        var next=cur==='environment'?'user':'environment';
        Promise.resolve(window.ensureLiveCamera(next)).then(function(ok){
          if(ok!==false&&window.state)state.cameraFacing=next;
        }).catch(function(){});
      }
    }catch(e){}
  }

  function install(){
    var c=creator();
    if(!c)return;

    var rotate=c.querySelector('.creator-top .creator-rotate');
    var beauty=c.querySelector('.creator-tools .creator-tool-text[aria-label="AI 보정"]');
    var effects=c.querySelector('.creator-tools .creator-tool-text[aria-label="편집 효과"]');

    [rotate,beauty,effects].forEach(function(el){
      if(!el)return;
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        if(el.hasAttribute('inert'))el.removeAttribute('inert');
        el.style.setProperty('display','flex','important');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      }catch(e){}
    });

    if(rotate){
      rotate.setAttribute('aria-label','되돌리기');
      rotate.innerHTML='<b aria-hidden="true">↻</b><small>되돌리기</small>';
      rotate.onclick=function(e){
        try{if(e){e.preventDefault();e.stopPropagation();}}catch(x){}
        flip();
      };
    }

    if(beauty){
      beauty.onclick=function(e){
        try{if(e){e.preventDefault();e.stopPropagation();}}catch(x){}
        try{if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();}catch(err){}
      };
    }

    if(effects){
      effects.onclick=function(e){
        try{if(e){e.preventDefault();e.stopPropagation();}}catch(x){}
        try{if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();}catch(err){}
      };
    }

    if(!document.getElementById('ktCreatorControlsCleanSingleStyle')){
      var s=document.createElement('style');
      s.id='ktCreatorControlsCleanSingleStyle';
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
`;
      document.head.appendChild(s);
    }
  }

  window.ktFixCreatorFourButtons=install;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();

  [100,300,800,1500].forEach(function(ms){setTimeout(install,ms);});
  window.addEventListener('pageshow',install);
  window.addEventListener('focus',install);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCreatorControlsSingleTimer);
      window.__ktCreatorControlsSingleTimer=setTimeout(install,35);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();