/* K-Talk 촬영 화면 터치 전용 복구 (2026-09-19)
   이 파일은 촬영 화면 안의 보이는 조작부만 작동시킨다.
   다른 방송방/게스트/채팅/관리자/스위치 로직은 변경하지 않는다. */
(function(){
  if(window.__ktCreatorScreenControls20260919)return;
  window.__ktCreatorScreenControls20260919=true;

  var lastKey='';
  var lastAt=0;

  function creator(){
    return document.getElementById('creator');
  }

  function creatorOpen(){
    var c=creator();
    return !!(c && c.classList.contains('show') && !c.classList.contains('live-prep-open') && !c.classList.contains('creator-review'));
  }

  function once(key,fn){
    var now=Date.now();
    if(lastKey===key && now-lastAt<350)return;
    lastKey=key; lastAt=now;
    try{fn();}catch(e){}
  }

  function flipCamera(){
    once('flip',function(){
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
          if(v && window.state && state.stream){
            v.srcObject=state.stream;
            v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
            var p=v.play(); if(p&&p.catch)p.catch(function(){});
          }
        }).catch(function(){});
      }
    });
  }

  function runTarget(el){
    if(!el)return false;

    if(el.matches('.creator-top .sound')){
      once('sound',function(){ if(typeof window.openSoundPanel==='function')window.openSoundPanel(); });
      return true;
    }
    if(el.matches('.creator-top .creator-rotate')){
      flipCamera();
      return true;
    }
    if(el.matches('.creator-top .circle:not(.creator-rotate)')){
      once('close',function(){ if(typeof window.closeCreator==='function')window.closeCreator(); });
      return true;
    }
    if(el.matches('.creator-tools .creator-tool-text[aria-label="AI 보정"]')){
      once('beauty',function(){ if(typeof window.openBeautyPanel==='function')window.openBeautyPanel(); });
      return true;
    }
    if(el.matches('.creator-tools .creator-tool-text[aria-label="편집 효과"]')){
      once('effect',function(){ if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel(); });
      return true;
    }
    if(el.matches('.creator-bottom .modes span,.creator-bottom .modes button')){
      var txt=String(el.textContent||'').replace(/\s+/g,'');
      if(txt.indexOf('10분')>-1){
        once('10m',function(){ if(typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(el,600000); });
        return true;
      }
      if(txt.indexOf('60초')>-1){
        once('60s',function(){ if(typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(el,60000); });
        return true;
      }
      if(txt.indexOf('15초')>-1){
        once('15s',function(){ if(typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(el,15000); });
        return true;
      }
      if(txt.indexOf('라이브')>-1){
        once('liveprep-mode',function(){ if(typeof window.openTikLivePrep==='function')window.openTikLivePrep(); });
        return true;
      }
      return false;
    }
    if(el.matches('.creator-bottom .fx.myvideo')){
      once('myvideo',function(){ if(typeof window.openMyVideoPicker==='function')window.openMyVideoPicker(); });
      return true;
    }
    if(el.matches('.creator-bottom .record')){
      once('record',function(){ if(typeof window.startCreatorRecording==='function')window.startCreatorRecording(); });
      return true;
    }
    if(el.matches('.creator-bottom .creator-foot span,.creator-bottom .creator-foot button')){
      var foot=String(el.textContent||'').replace(/\s+/g,'');
      if(foot.indexOf('라이브')>-1){
        once('liveprep-foot',function(){ if(typeof window.openTikLivePrep==='function')window.openTikLivePrep(); });
        return true;
      }
      if(foot.indexOf('게시')>-1){
        once('postmode',function(){ if(typeof window.setCreatorMode==='function')window.setCreatorMode(el,'게시'); });
        return true;
      }
      if(foot.indexOf('창작하기')>-1){
        once('createmode',function(){ if(typeof window.setCreatorMode==='function')window.setCreatorMode(el,'창작하기'); });
        return true;
      }
    }
    return false;
  }

  function closestControl(t){
    if(!t||!t.closest)return null;
    return t.closest(
      '.creator-top .sound,'+
      '.creator-top .creator-rotate,'+
      '.creator-top .circle:not(.creator-rotate),'+
      '.creator-tools .creator-tool-text[aria-label="AI 보정"],'+
      '.creator-tools .creator-tool-text[aria-label="편집 효과"],'+
      '.creator-bottom .modes span,'+
      '.creator-bottom .modes button,'+
      '.creator-bottom .fx.myvideo,'+
      '.creator-bottom .record,'+
      '.creator-bottom .creator-foot span,'+
      '.creator-bottom .creator-foot button'
    );
  }

  /* 클릭보다 먼저 잡아서 다른 코드가 클릭을 막아도 촬영 화면 버튼은 반응하게 한다. */
  window.addEventListener('pointerdown',function(e){
    if(!creatorOpen())return;
    var el=closestControl(e.target);
    if(!el)return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    runTarget(el);
  },true);

  function unlock(){
    var c=creator();
    if(!c)return;

    var controls=c.querySelectorAll(
      '.creator-top button,'+
      '.creator-tools .creator-tool-text,'+
      '.creator-bottom .modes span,'+
      '.creator-bottom .modes button,'+
      '.creator-bottom .recordrow button,'+
      '.creator-bottom .creator-foot span,'+
      '.creator-bottom .creator-foot button'
    );
    controls.forEach(function(el){
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      }catch(e){}
    });

    var top=c.querySelector('.creator-top');
    var tools=c.querySelector('.creator-tools');
    var bottom=c.querySelector('.creator-bottom');
    [top,tools,bottom].forEach(function(el){
      if(!el)return;
      try{
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('z-index','2147483000','important');
      }catch(e){}
    });
  }

  function style(){
    if(document.getElementById('ktCreatorScreenControls20260919Style'))return;
    var s=document.createElement('style');
    s.id='ktCreatorScreenControls20260919Style';
    s.textContent=`
/* 촬영 화면에서 카메라/장식 레이어가 버튼 터치를 가리지 않게 한다 */
#creator.show:not(.live-prep-open):not(.creator-review) > #camera,
#creator.show:not(.live-prep-open):not(.creator-review) > #cameraBg,
#creator.show:not(.live-prep-open):not(.creator-review) > .shade,
#creator.show:not(.live-prep-open):not(.creator-review) > #ktCreatorFaceBeautyV4,
#creator.show:not(.live-prep-open):not(.creator-review) > canvas{
  pointer-events:none!important;
}
#creator.show:not(.live-prep-open):not(.creator-review) .creator-top,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-tools,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-bottom{
  pointer-events:auto!important;
  z-index:2147483000!important;
}
#creator.show:not(.live-prep-open):not(.creator-review) .creator-top button,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-tools button,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-bottom button,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-bottom .modes span,
#creator.show:not(.live-prep-open):not(.creator-review) .creator-bottom .creator-foot span{
  pointer-events:auto!important;
  touch-action:manipulation!important;
  position:relative!important;
  z-index:2147483001!important;
}
`;
    document.head.appendChild(s);
  }

  function install(){style();unlock();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();

  [100,300,700,1200,2200,3500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktCreatorScreenControlsTimer);
      window.__ktCreatorScreenControlsTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();
