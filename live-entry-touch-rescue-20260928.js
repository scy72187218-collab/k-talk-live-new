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
      '.kt-follow-person.live,'+
      '[onclick*="ktFriendEnterLive"],'+
      '[onclick*="ktEnterRemoteLive"]'
    ):null;
    if(t)return t;

    /* 위에 다른 요소가 잠깐 겹쳐 있어도 실제 빨간 LIVE 자리의 버튼을 찾아낸다. */
    try{
      var p=(e.touches&&e.touches[0])||(e.changedTouches&&e.changedTouches[0])||e;
      var x=Number(p.clientX),y=Number(p.clientY);
      if(isFinite(x)&&isFinite(y)){
        var list=[].slice.call(document.querySelectorAll(
          '.ktvl-live,.kt-follow-person.live,.kt-friend-bubble.live,.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]'
        ));
        for(var i=list.length-1;i>=0;i--){
          var el=list[i],cs=getComputedStyle(el),r=el.getBoundingClientRect();
          if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)continue;
          if(r.width<3||r.height<3)continue;
          if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return el;
        }
      }
    }catch(_e){}
    return null;
  }

  function go(e){
    var el=target(e);
    if(!el)return;
    var id=hostFrom(el);
    if(!id||typeof window.ktEnterRemoteLive!=='function')return;
    var now=Date.now();
    try{
      var gh=String(window.__ktLiveEnterOnceHost20260930||'');
      var ga=Number(window.__ktLiveEnterOnceAt20260930||0);
      if(gh===id&&now-ga<1800){
        try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
        return;
      }
      window.__ktLiveEnterOnceHost20260930=id;
      window.__ktLiveEnterOnceAt20260930=now;
    }catch(_e){}
    if(id===lastHost&&now-lastAt<650){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      return;
    }
    lastHost=id;lastAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    try{window.ktEnterRemoteLive(id);}catch(_e){}
  }

  /* 기기/브라우저마다 pointer 이벤트가 다르게 빠지는 경우가 있어
     pointerdown + touchstart + touchend + click을 모두 캡처한다.
     go() 내부 650ms 중복방지로 한 번만 입장한다. */
  document.addEventListener('pointerdown',go,true);
  document.addEventListener('touchstart',go,true);
  document.addEventListener('touchend',go,true);
  document.addEventListener('click',go,true);

  var st=document.createElement('style');
  st.id='ktLiveEntryTouchRescueStyle20260928';
  st.textContent='.ktvl-live,.kt-follow-person.live,.kt-friend-bubble.live,.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2147483000!important}';
  (document.head||document.documentElement).appendChild(st);
})();