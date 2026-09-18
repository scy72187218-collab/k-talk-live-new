/* K-Talk 촬영화면 오른쪽 도구 정리 + 4개 버튼 작동 보강 (2026-09-19)
   대상만 수정: 되돌리기 / AI 보정 / 편집효과 / 사운드 추가.
   다른 방송방·게스트·채팅·스위치·하단 촬영 기능은 건드리지 않음. */
(function(){
  if(window.__ktCreatorControlsClean20260919V2)return;
  window.__ktCreatorControlsClean20260919V2=true;

  var lastActionAt=0;
  var lastActionName='';

  function runOnce(name,fn){
    var now=Date.now();
    if(lastActionName===name && now-lastActionAt<450)return;
    lastActionName=name;
    lastActionAt=now;
    try{fn();}catch(e){}
  }

  function flipCreatorCamera(){
    runOnce('undo',function(){
      if(typeof window.ktAllRoomsFlipCamera==='function'){
        window.ktAllRoomsFlipCamera();
        return;
      }
      if(typeof window.ktSoloFlipCamera==='function'){
        window.ktSoloFlipCamera();
        return;
      }
      if(typeof window.ensureLiveCamera==='function'){
        var current=(window.state&&state.cameraFacing)||'user';
        var next=current==='environment'?'user':'environment';
        Promise.resolve(window.ensureLiveCamera(next)).then(function(ok){
          if(ok!==false && window.state)state.cameraFacing=next;
          var v=document.getElementById('camera');
          if(v&&window.state&&state.stream){
            v.srcObject=state.stream;
            v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
            var p=v.play();if(p&&p.catch)p.catch(function(){});
          }
        }).catch(function(){});
      }
    });
  }

  function openSound(){
    runOnce('sound',function(){
      if(typeof window.openSoundPanel==='function')window.openSoundPanel();
    });
  }

  function openBeauty(){
    runOnce('beauty',function(){
      if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();
    });
  }

  function openEffects(){
    runOnce('effects',function(){
      if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();
    });
  }

  function bindTap(el,name,fn){
    if(!el)return;
    el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('touch-action','manipulation','important');
    el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
    el.style.setProperty('position','relative','important');
    el.style.setProperty('z-index','10001','important');

    if(el.dataset.ktFourButtonsBound==='1')return;
    el.dataset.ktFourButtonsBound='1';

    el.addEventListener('pointerup',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      fn();
    },true);

    el.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      fn();
    },true);
  }

  function install(){
    var creator=document.getElementById('creator');
    if(!creator)return;

    var rotate=creator.querySelector('.creator-top .creator-rotate');
    var sound=creator.querySelector('.creator-top .sound');
    var beauty=creator.querySelector('.creator-tools .creator-tool-text[aria-label="AI 보정"]');
    var effects=creator.querySelector('.creator-tools .creator-tool-text[aria-label="편집 효과"]');

    if(rotate){
      rotate.setAttribute('aria-label','되돌리기');
      rotate.innerHTML='<b aria-hidden="true">↻</b><small>되돌리기</small>';
      rotate.onclick=function(e){try{if(e)e.preventDefault();}catch(x){} flipCreatorCamera(); return false;};
    }
    if(sound){
      sound.onclick=function(e){try{if(e)e.preventDefault();}catch(x){} openSound(); return false;};
    }
    if(beauty){
      beauty.onclick=function(e){try{if(e)e.preventDefault();}catch(x){} openBeauty(); return false;};
    }
    if(effects){
      effects.onclick=function(e){try{if(e)e.preventDefault();}catch(x){} openEffects(); return false;};
    }

    bindTap(rotate,'undo',flipCreatorCamera);
    bindTap(sound,'sound',openSound);
    bindTap(beauty,'beauty',openBeauty);
    bindTap(effects,'effects',openEffects);

    if(!document.getElementById('ktCreatorControlsClean20260919Style')){
      var s=document.createElement('style');
      s.id='ktCreatorControlsClean20260919Style';
      s.textContent=`
/* 촬영화면 오른쪽: 되돌리기 + AI 보정 + 편집효과만 */
#creator:not(.live-prep-open) .creator-tools > button:not(.creator-tool-text){
  display:none!important;
}
#creator:not(.live-prep-open) .creator-tools{
  right:15px!important;
  top:230px!important;
  gap:18px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  z-index:10000!important;
  pointer-events:auto!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text{
  width:62px!important;
  height:72px!important;
  min-width:62px!important;
  min-height:72px!important;
  padding:7px 3px!important;
  border-radius:31px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:2px!important;
  background:rgba(0,0,0,.24)!important;
  color:#fff!important;
  text-shadow:0 1px 5px #000!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text b{
  display:block!important;
  font-size:27px!important;
  line-height:1!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text small{
  display:block!important;
  margin-top:2px!important;
  font-size:10px!important;
  line-height:1.05!important;
  font-weight:950!important;
  white-space:nowrap!important;
  color:#fff!important;
}

/* 맨 위 되돌리기 버튼은 기존보다 아래 */
#creator:not(.live-prep-open) .creator-top{
  z-index:10000!important;
  pointer-events:auto!important;
}
#creator:not(.live-prep-open) .creator-top .creator-rotate{
  position:absolute!important;
  right:0!important;
  top:125px!important;
  width:62px!important;
  height:72px!important;
  min-width:62px!important;
  min-height:72px!important;
  padding:7px 3px!important;
  border-radius:31px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:2px!important;
  background:rgba(0,0,0,.24)!important;
  color:#fff!important;
  text-shadow:0 1px 5px #000!important;
  z-index:10001!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
#creator:not(.live-prep-open) .creator-top .creator-rotate b{
  display:block!important;
  font-size:29px!important;
  line-height:1!important;
  font-weight:800!important;
}
#creator:not(.live-prep-open) .creator-top .creator-rotate small{
  display:block!important;
  margin-top:2px!important;
  font-size:10px!important;
  line-height:1.05!important;
  font-weight:950!important;
  white-space:nowrap!important;
  color:#fff!important;
}
/* 사운드 추가 버튼 터치층만 보강. 모양/위치는 그대로 */
#creator:not(.live-prep-open) .creator-top .sound{
  pointer-events:auto!important;
  touch-action:manipulation!important;
  z-index:10001!important;
}
`;
      document.head.appendChild(s);
    }
  }

  window.ktFixCreatorFourButtons=install;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',install,{once:true});
  }else{
    install();
  }

  [80,200,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktCreatorFourButtonTimer);
      window.__ktCreatorFourButtonTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();