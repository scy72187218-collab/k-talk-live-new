/* K-Talk 상단 LIVE 프로필 바: + 버튼과 종 아이콘만 숨김.
   다른 버튼/방송/채팅/카메라/프로필 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveHeaderPlusBellHide20260919)return;
  window.__ktLiveHeaderPlusBellHide20260919=true;

  function isTargetText(t){
    t=String(t||'').replace(/\s+/g,'').trim();
    return t==='+'||t==='＋'||t==='✚'||t==='➕'||t==='🔔'||t==='🔔️';
  }

  function inTopLiveBar(el){
    if(!el||!el.closest)return false;
    var p=el;
    for(var i=0;i<6&&p;i++,p=p.parentElement){
      try{
        var txt=String(p.textContent||'').replace(/\s+/g,' ');
        var r=p.getBoundingClientRect();
        if(r.top<260 && r.bottom>30 && txt.indexOf('LIVE')>-1 && txt.length<180)return true;
      }catch(e){}
    }
    return false;
  }

  function clean(){
    document.querySelectorAll('button,span,b,i,em').forEach(function(el){
      try{
        if(!isTargetText(el.textContent))return;
        if(!inTopLiveBar(el))return;
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
        el.dataset.ktHiddenPlusBell='1';
      }catch(e){}
    });
  }

  clean();
  [100,300,700,1200,2200].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLiveHeaderPlusBellTimer);
      window.__ktLiveHeaderPlusBellTimer=setTimeout(clean,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();