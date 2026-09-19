/* K-Talk LIVE: 방송 화면 상단 호스트 바의 + / 종 아이콘만 숨김.
   다른 버튼/스위치/방송/카메라/채팅은 변경하지 않음. */
(function(){
  if(window.__ktHideLiveHostPlusBell20260919)return;
  window.__ktHideLiveHostPlusBell20260919=true;

  function compactText(el){
    return String((el&&((el.getAttribute&&el.getAttribute('aria-label'))||el.textContent))||'')
      .replace(/\s+/g,'').trim();
  }

  function looksLikeTarget(el){
    var t=compactText(el);
    return t==='+'||t==='＋'||t==='✚'||t==='➕'||t==='🔔'||
      t==='알림'||t==='알림설정'||t==='팔로우';
  }

  function hasLiveNearby(el){
    var p=el;
    for(var i=0;i<4&&p;i++,p=p.parentElement){
      var txt=String(p.textContent||'').replace(/\s+/g,'');
      if(txt.indexOf('LIVE')>-1||txt.indexOf('Live')>-1||txt.indexOf('라이브')>-1){
        try{
          var r=p.getBoundingClientRect();
          if(r.top<Math.max(260,innerHeight*.38) && r.width<innerWidth*.96)return true;
        }catch(e){return true;}
      }
    }
    return false;
  }

  function hide(){
    var q='button,a,[role="button"]';
    document.querySelectorAll(q).forEach(function(el){
      try{
        if(!looksLikeTarget(el))return;
        if(!hasLiveNearby(el))return;
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
        el.dataset.ktHostTopHidden='1';
      }catch(e){}
    });
  }

  hide();
  [80,220,500,900,1600,2600].forEach(function(ms){setTimeout(hide,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHideLiveHostPlusBellTimer);
      window.__ktHideLiveHostPlusBellTimer=setTimeout(hide,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();