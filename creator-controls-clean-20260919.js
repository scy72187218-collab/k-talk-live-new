/* K-Talk 촬영화면 오른쪽 최소 버튼 (복구판)
   되돌리기만 유지. AI 보정/기존 편집효과 버튼은 숨김.
   실제 편집효과 1개는 creator-edit-shop-under-undo-20260928.js가 담당. */
(function(){
  if(window.__ktCreatorControlsCleanSingle20260919)return;
  window.__ktCreatorControlsCleanSingle20260919=true;

  function flip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
      if(typeof window.toggleCreatorCamera==='function'){window.toggleCreatorCamera();return;}
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
    var c=document.getElementById('creator');
    if(!c)return;

    var rotate=c.querySelector('.creator-top .creator-rotate');
    if(rotate){
      try{
        rotate.disabled=false;
        rotate.removeAttribute('inert');
        rotate.setAttribute('aria-label','되돌리기');
        rotate.innerHTML='<b aria-hidden="true">↻</b><small>되돌리기</small>';
        rotate.style.setProperty('display','flex','important');
        rotate.style.setProperty('pointer-events','auto','important');
        rotate.style.setProperty('touch-action','manipulation','important');
        rotate.onclick=function(e){
          try{if(e){e.preventDefault();e.stopPropagation();}}catch(_e){}
          flip();
          return false;
        };
      }catch(e){}
    }

    /* 중복 원인 제거: 예전 AI/편집효과 버튼은 완전히 숨김 */
    c.querySelectorAll('.creator-tools > button').forEach(function(el){
      try{
        el.style.setProperty('display','none','important');
        el.style.setProperty('pointer-events','none','important');
      }catch(e){}
    });

    if(!document.getElementById('ktCreatorControlsCleanSingleStyle')){
      var s=document.createElement('style');
      s.id='ktCreatorControlsCleanSingleStyle';
      s.textContent=
        '#creator:not(.live-prep-open) .creator-tools > button{display:none!important;pointer-events:none!important}'+
        '#creator:not(.live-prep-open) .creator-top{z-index:10000!important;pointer-events:auto!important}'+
        '#creator:not(.live-prep-open) .creator-top .creator-rotate{position:absolute!important;right:0!important;top:125px!important;width:62px!important;height:72px!important;min-width:62px!important;min-height:72px!important;padding:7px 3px!important;border-radius:31px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;background:rgba(0,0,0,.24)!important;color:#fff!important;z-index:10001!important;pointer-events:auto!important;touch-action:manipulation!important}'+
        '#creator:not(.live-prep-open) .creator-top .creator-rotate b{display:block!important;font-size:29px!important;line-height:1!important;font-weight:800!important}'+
        '#creator:not(.live-prep-open) .creator-top .creator-rotate small{display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.05!important;font-weight:950!important;white-space:nowrap!important;color:#fff!important}';
      document.head.appendChild(s);
    }
  }

  window.ktFixCreatorFourButtons=install;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
  [100,300,800,1500].forEach(function(ms){setTimeout(install,ms);});
  window.addEventListener('pageshow',install);
  window.addEventListener('focus',install);
})();