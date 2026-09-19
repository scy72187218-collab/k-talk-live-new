/* K-Talk 원격 시청 상단 +/종 숨김 전용 (2026-09-19)
   13명방/채팅방/채팅 UI는 절대 건드리지 않음. */
(function(){
  if(window.__ktRemoteTopPlusBellHide20260919)return;
  window.__ktRemoteTopPlusBellHide20260919=true;

  function isProtected(el){
    if(!el)return true;
    if(el.closest&&el.closest(
      '.ktg13-room,.ktg13-chat,.kt-remote-chat,.kt-remote-bottom,'+
      '.kgh-chat,.ktsolo-chat,.ktsubscriber-chat,.ktsecret-chat'
    ))return true;
    return false;
  }

  function shouldHide(el){
    if(!el||isProtected(el))return false;
    var t=String(el.textContent||'').replace(/\s+/g,'').trim();
    var aria=String(el.getAttribute&&el.getAttribute('aria-label')||'').replace(/\s+/g,'').trim();
    return t==='+'||t==='＋'||t==='✚'||t==='✕+'||t==='🔔'||aria==='알림'||aria==='종';
  }

  function apply(){
    /* 원격 시청 화면에서만. 13명방이 열려 있으면 아무것도 하지 않음. */
    if(!document.documentElement.classList.contains('kt-remote-viewing'))return;
    if(document.querySelector('.ktg13-room'))return;

    document.querySelectorAll('button,[role="button"]').forEach(function(el){
      if(!shouldHide(el))return;
      try{
        var r=el.getBoundingClientRect();
        if(r.top<240){
          el.style.setProperty('display','none','important');
          el.setAttribute('data-kt-hidden-plus-bell','1');
        }
      }catch(e){}
    });
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoteTopPlusBellTimer);
      window.__ktRemoteTopPlusBellTimer=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();