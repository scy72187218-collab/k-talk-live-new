/* K-Talk: AI 보정 / 편집효과 버튼만 제거 (2026-09-19)
   다른 촬영/방송/채팅/게스트/스위치 기능은 변경하지 않음. */
(function(){
  if(window.__ktRemoveAiEditControls20260919)return;
  window.__ktRemoveAiEditControls20260919=true;

  function hideOne(el){
    if(!el)return;
    try{
      el.style.setProperty('display','none','important');
      el.style.setProperty('pointer-events','none','important');
      el.setAttribute('aria-hidden','true');
      if(el.tagName==='BUTTON')el.disabled=true;
    }catch(e){}
  }

  function apply(){
    /* 촬영 화면 오른쪽 AI 보정 / 편집효과 */
    hideOne(document.querySelector('#creator .creator-tools .creator-tool-text[aria-label="AI 보정"]'));
    hideOne(document.querySelector('#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]'));

    /* 라이브 준비 화면의 같은 두 기능도 숨김 */
    document.querySelectorAll('#creator .live-prep .prep-item').forEach(function(btn){
      var t=String(btn.textContent||'').replace(/\s+/g,'');
      if(t.indexOf('AI보정')>-1||t.indexOf('편집효과')>-1)hideOne(btn);
    });

    /* 이미 해당 패널이 열려 있다면 그 패널만 닫고 촬영 화면으로 복귀 */
    try{
      var sheet=document.getElementById('sheet');
      var title=document.getElementById('sheetTitle');
      var txt=title?String(title.textContent||'').replace(/\s+/g,''):'';
      if(sheet&&sheet.classList.contains('show')&&(txt.indexOf('뷰티')>-1||txt.indexOf('편집효과')>-1)){
        if(typeof window.closeSheet==='function')window.closeSheet();
      }
    }catch(e){}
  }

  apply();
  [80,220,500,1000,1800,3000].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoveAiEditTimer);
      window.__ktRemoveAiEditTimer=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();