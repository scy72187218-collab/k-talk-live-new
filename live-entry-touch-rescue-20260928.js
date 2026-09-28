/* K-Talk 2026-09-28: 모든 빨간 방송 입장 버튼 터치 통일.
   방 레이아웃/게스트/채팅/선물/UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveEntryTouchRescue20260928)return;
  window.__ktLiveEntryTouchRescue20260928=true;

  var lastHost='',lastAt=0;

  function hostFrom(el){
    if(!el)return '';
    var id='';
    try{id=String(el.getAttribute('data-host')||el.dataset.host||'').trim();}catch(e){}
    if(id)return id;
    try{
      var oc=String(el.getAttribute('onclick')||'');
      var m=oc.match(/kt(?:FriendEnterLive|EnterRemoteLive)\(\s*['"]([^'"]+)['"]/);
      if(m&&m[1])return String(m[1]).trim();
    }catch(e){}
    try{
      var p=el.closest&&el.closest('[data-host]');
      if(p)return String(p.getAttribute('data-host')||'').trim();
    }catch(e){}
    try{
      var x=window.__ktLastLiveRoom;
      if(x&&x.host_id)return String(x.host_id).trim();
    }catch(e){}
    return '';
  }

  function target(e){
    var t=e.target&&e.target.closest?e.target.closest(
      '.ktvl-live,'+
      '.kt-friend-bubble.live,'+
      '.kt-friend-contact-actions .livebtn,'+
      '.kt-live-card,'+
      '.kt-live-list-enter,'+
      '[onclick*="ktFriendEnterLive"],'+
      '[onclick*="ktEnterRemoteLive"]'
    ):null;
    return t;
  }

  function go(e){
    var el=target(e);
    if(!el)return;
    var id=hostFrom(el);
    if(!id||typeof window.ktEnterRemoteLive!=='function')return;
    var now=Date.now();
    if(id===lastHost&&now-lastAt<650){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      return;
    }
    lastHost=id;lastAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    try{window.ktEnterRemoteLive(id);}catch(_e){}
  }

  document.addEventListener('pointerdown',go,true);
  if(!window.PointerEvent)document.addEventListener('touchstart',go,true);

  var st=document.createElement('style');
  st.id='ktLiveEntryTouchRescueStyle20260928';
  st.textContent='.ktvl-live,.kt-friend-bubble.live,.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]{pointer-events:auto!important;touch-action:manipulation!important}';
  (document.head||document.documentElement).appendChild(st);
})();