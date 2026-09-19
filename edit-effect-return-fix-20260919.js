/* K-Talk 편집효과 종료 후 터치 잠김 방지 (2026-09-19)
   편집효과 관련 임시 레이어만 정리.
   방송/게스트/채팅/카메라 스트림/기존 효과 데이터는 변경하지 않음. */
(function(){
  if(window.__ktEditEffectReturnFix20260919)return;
  window.__ktEditEffectReturnFix20260919=true;

  var effectOpen=false;
  var openedFromLive=false;
  var oldOpen=window.openEditEffectPanel;
  var oldClose=window.closeEditEffectPanel;

  function creator(){return document.getElementById('creator');}
  function sheet(){return document.getElementById('sheet');}

  function liveRoomVisible(){
    try{
      return !!document.querySelector(
        '.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,'+
        '.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-guest-room-grid'
      );
    }catch(e){return false;}
  }

  function unlockCreator(){
    var c=creator();
    if(!c)return;
    try{
      c.style.removeProperty('pointer-events');
      var groups=c.querySelectorAll('.creator-top,.creator-tools,.creator-bottom');
      groups.forEach(function(el){
        el.style.setProperty('pointer-events','auto','important');
      });
      c.querySelectorAll(
        '.creator-top button,.creator-tools button,.creator-bottom button,'+
        '.creator-bottom .modes span,.creator-bottom .creator-foot span'
      ).forEach(function(el){
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}

    /* 화면 앞에 남는 미리보기/효과 레이어는 터치를 절대 받지 않게 함 */
    ['ktFaceEffectLayer','ktFaceAnchor','ktStageCanvas','ktCreatorFaceBeautyV4','ktCreatorFaceBeautyCanvas']
      .forEach(function(id){
        var el=document.getElementById(id);
        if(el)el.style.setProperty('pointer-events','none','important');
      });

    try{
      if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();
    }catch(e){}
  }

  function cleanup(){
    var c=creator(),s=sheet();

    try{
      if(s){
        s.classList.remove('camera-effect-sheet','stage-effect-sheet');
        s.style.removeProperty('pointer-events');
      }
    }catch(e){}

    try{
      if(c){
        c.classList.remove('beauty-preview-open');

        /* 방송 중 효과창을 위해 잠깐 앞에 띄운 촬영 화면만 다시 숨김.
           카메라 스트림은 끊지 않음. */
        if(openedFromLive)c.classList.remove('show');

        var lp=c.querySelector('.live-prep');
        if(lp)lp.style.removeProperty('display');
      }
    }catch(e){}

    unlockCreator();
    setTimeout(unlockCreator,60);
    setTimeout(unlockCreator,220);

    effectOpen=false;
    openedFromLive=false;
  }

  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(){
      var c=creator(),s=sheet();
      /* 라이브 화면에서 onclick이 creator.show를 먼저 붙이는 구조까지 감지 */
      openedFromLive=liveRoomVisible();
      effectOpen=true;
      try{if(s)s.style.removeProperty('pointer-events');}catch(e){}
      var r=oldOpen.apply(this,arguments);
      setTimeout(unlockCreator,30);
      return r;
    };
  }

  window.closeEditEffectPanel=function(){
    var result;
    try{
      if(typeof oldClose==='function')result=oldClose.apply(this,arguments);
      else if(typeof window.closeSheet==='function')result=window.closeSheet();
    }catch(e){
      try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(_e){}
    }
    setTimeout(cleanup,0);
    return result;
  };

  /* 편집효과 '적용'으로 닫히는 순간 한 번 더 정리 */
  document.addEventListener('click',function(e){
    var s=sheet();
    if(!effectOpen||!s||!s.classList.contains('show'))return;
    var btn=e.target&&e.target.closest?e.target.closest('.kt-stage-actions .primary'):null;
    if(btn)setTimeout(cleanup,40);
  },true);

  /* 뒤로가기/다른 코드로 시트가 닫혀도 잠금 흔적 제거 */
  try{
    var s=sheet();
    if(s){
      new MutationObserver(function(){
        if(effectOpen&&!s.classList.contains('show'))setTimeout(cleanup,0);
      }).observe(s,{attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  window.addEventListener('pageshow',function(){
    if(effectOpen&&sheet()&&!sheet().classList.contains('show'))cleanup();
  });
})();