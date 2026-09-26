/* K-Talk: AI 보정 / 편집효과 완전 제거 (2026-09-19)
   이 두 기능만 제거. 다른 촬영/방송/채팅/게스트/스위치 기능은 변경하지 않음. */
(function(){
  if(window.__ktRemoveAiEditControls20260919)return;
  window.__ktRemoveAiEditControls20260919=true;

  function removeNode(el){
    if(!el)return;
    try{
      if(el.parentNode)el.parentNode.removeChild(el);
    }catch(e){}
  }

  function clearOldEffectLayers(){
    try{if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');}catch(e){}
    removeNode(document.getElementById('ktFaceEffectLayer'));
    removeNode(document.getElementById('ktStageCanvas'));
    try{
      if(window.state){
        state.editSticker='';
        state.editFilter='';
        state.pendingEditEffect='off';
        state.appliedEditEffect='off';
        state.stageBackground='';
        state.stageBackgroundUrl='';
      }
      window.ktStageCanvas=null;
      window.ktStageBgImage=null;
      window.ktStageLoopRunning=false;
    }catch(e){}
    try{
      var c=document.getElementById('creator');
      if(c){
        c.classList.remove('stage-bg-active','beauty-preview-open');
        c.removeAttribute('data-beauty-char');
      }
    }catch(e){}
  }

  function closeRemovedPanel(){
    try{
      var sh=document.getElementById('sheet');
      var title=document.getElementById('sheetTitle');
      var txt=title?String(title.textContent||'').replace(/\s+/g,''):'';
      if(sh&&sh.classList.contains('show')&&(txt.indexOf('뷰티')>-1||txt.indexOf('편집효과')>-1)){
        if(typeof window.closeSheet==='function')window.closeSheet();
        else sh.classList.remove('show');
      }
    }catch(e){}
  }

  function removeControls(){
    /* 촬영 화면 오른쪽 두 버튼 완전 제거 */
    document.querySelectorAll(
      '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],'+
      '#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]'
    ).forEach(removeNode);

    /* 라이브 준비 화면의 보정/편집효과 버튼은 현재 다시 사용한다.
       이 예전 정리 파일은 촬영화면 오른쪽의 옛 버튼만 숨긴다. */
  }

  /* 현재 보정/편집 패널 함수는 stage-background-beauty에서 사용하므로 막지 않는다. */

  /* CSS도 마지막 안전망으로 유지 */
  if(!document.getElementById('ktRemoveAiEditControlsStyle20260919')){
    var s=document.createElement('style');
    s.id='ktRemoveAiEditControlsStyle20260919';
    s.textContent=
      '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],'+
      '#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  removeControls();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(removeControls,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoveAiEditTimer);
      window.__ktRemoveAiEditTimer=setTimeout(removeControls,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',removeControls);
  window.addEventListener('focus',removeControls);
})();