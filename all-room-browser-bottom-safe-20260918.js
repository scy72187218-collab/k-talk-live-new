/* K-Talk 모바일 브라우저 하단바 겹침 방지.
   1인/9명/13명/구독자/비밀방의 하단 아이콘과 글씨를 브라우저 흰색 바 위로 올림.
   방송/카메라/채팅 기능은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomBrowserBottomSafe20260918)return;
  window.__ktAllRoomBrowserBottomSafe20260918=true;

  function standalone(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone===true;
    }catch(e){return false;}
  }

  function guardPx(){
    if(standalone())return 4;
    var ua=String(navigator.userAgent||'').toLowerCase();
    if(/naver/.test(ua))return 18;
    if(/android|iphone|ipad|ipod/.test(ua))return 14;
    return 6;
  }

  function ensureStyle(){
    if(document.getElementById('ktAllRoomBrowserBottomSafeStyle'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomBrowserBottomSafeStyle';
    s.textContent=''
      +':root{--kt-room-browser-bottom-safe:62px;--kt-room13-browser-bottom-safe:24px;--kt-subscriber-browser-bottom-safe:14px}'
      +'.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room{'
        +'padding-bottom:calc(8px + env(safe-area-inset-bottom) + var(--kt-room-browser-bottom-safe))!important;'
      +'}'
      +'.ktsubscriber-room{'
        +'padding-bottom:calc(8px + env(safe-area-inset-bottom) + var(--kt-subscriber-browser-bottom-safe))!important;'
      +'}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"]){'
        +'padding-bottom:calc(8px + env(safe-area-inset-bottom) + var(--kt-room13-browser-bottom-safe))!important;'
      +'}'
      +'.ktsolo-tools,.ktg13-tools,.ktsubscriber-tools,.ktsecret-tools{'
        +'position:relative!important;z-index:30!important;flex-shrink:0!important;padding-bottom:2px!important;'
      +'}'
      +'.ktsolo-tool span,.ktg13-tool span,.ktsubscriber-tool span,.ktsecret-tool span{'
        +'position:relative!important;z-index:31!important;line-height:1.2!important;'
      +'}'
      +'@media(min-width:700px){:root{--kt-room-browser-bottom-safe:8px}}';
    document.head.appendChild(s);
  }

  function guardSubscriberPx(){
    if(standalone())return 4;
    var ua=String(navigator.userAgent||'').toLowerCase();
    if(/naver/.test(ua))return 10;
    if(/android|iphone|ipad|ipod/.test(ua))return 10;
    return 6;
  }

  function guard13Px(){
    if(standalone())return 4;
    var ua=String(navigator.userAgent||'').toLowerCase();
    if(/naver/.test(ua))return 10;
    if(/android|iphone|ipad|ipod/.test(ua))return 10;
    return 6;
  }

  function remoteGuardPx(){
    if(standalone())return 6;
    var ua=String(navigator.userAgent||'').toLowerCase();
    if(/naver/.test(ua))return 20;
    if(/android|iphone|ipad|ipod/.test(ua))return 16;
    return 8;
  }

  function applyRemoteBottomSafe(){
    var px=remoteGuardPx();
    var bottom=px+8;
    var chat=px+62;
    try{
      document.querySelectorAll('.kt-remote-bottom').forEach(function(el){
        /* 13명 승인 게스트방은 전용 하단 배치가 흰 브라우저선 바로 위를 담당한다. */
        if(el.closest&&el.closest('.kt-remote-live.kt-guest13-bottom-compact'))return;
        el.style.setProperty('bottom','calc('+bottom+'px + env(safe-area-inset-bottom))','important');
        el.style.setProperty('z-index','90','important');
      });
      document.querySelectorAll('.kt-remote-chat').forEach(function(el){
        el.style.setProperty('bottom','calc('+chat+'px + env(safe-area-inset-bottom))','important');
      });
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    var px=guardPx();
    try{
      document.documentElement.style.setProperty('--kt-room-browser-bottom-safe',px+'px');
      document.documentElement.style.setProperty('--kt-room13-browser-bottom-safe',guard13Px()+'px');
      document.documentElement.style.setProperty('--kt-subscriber-browser-bottom-safe',guardSubscriberPx()+'px');
    }catch(e){}
    applyRemoteBottomSafe();
  }

  apply();
  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
  window.addEventListener('pageshow',apply);
  if(window.visualViewport){
    try{window.visualViewport.addEventListener('resize',apply);}catch(e){}
  }
  new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
})();

/* 1인/13명/구독자/비밀방 하단 8개 버튼 터치 복구.
   9명방은 별도 복구 코드가 이미 있으므로 중복 실행하지 않음.
   화면/배치/카메라/채팅은 변경하지 않음. */
(function(){
  if(window.__ktOtherRoomsBottomTapFix20260919)return;
  window.__ktOtherRoomsBottomTapFix20260919=true;

  var lastBtn=null,lastAt=0;

  function roomAndBox(){
    var r=document.querySelector('#screen .ktsolo-room');
    if(r)return {room:'solo',box:r.querySelector('.ktsolo-tools')};

    r=document.querySelector('#screen .ktg13-room');
    if(r){
      if(r.getAttribute('data-kt-room')==='9')return null;
      return {room:'group13',box:r.querySelector('.ktg13-tools')};
    }

    r=document.querySelector('#screen .ktsubscriber-room');
    if(r)return {room:'subscriber',box:r.querySelector('.ktsubscriber-tools')};

    r=document.querySelector('#screen .ktsecret-room');
    if(r)return {room:'secret',box:r.querySelector('.ktsecret-tools')};

    return null;
  }

  function label(btn){
    var s=btn&&btn.querySelector?btn.querySelector('span'):null;
    return String((s&&s.textContent)||btn.textContent||'').replace(/\s+/g,'');
  }

  function point(e){
    var p=(e.changedTouches&&e.changedTouches[0])||(e.touches&&e.touches[0])||e;
    return {x:p&&p.clientX,y:p&&p.clientY};
  }

  function findBtn(e,info){
    if(!info||!info.box)return null;
    try{
      var d=e.target&&e.target.closest?e.target.closest('.ktsolo-tool,.ktg13-tool,.ktsubscriber-tool,.ktsecret-tool'):null;
      if(d&&info.box.contains(d))return d;
    }catch(x){}

    var p=point(e);
    if(typeof p.x!=='number'||typeof p.y!=='number')return null;
    var list=info.box.querySelectorAll('button');
    for(var i=0;i<list.length;i++){
      var r=list[i].getBoundingClientRect();
      if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom)return list[i];
    }
    return null;
  }

  function show(title,html){
    try{
      if(typeof window.showSheet==='function'){
        window.showSheet(title,html);
        return true;
      }
    }catch(e){}
    return false;
  }

  function message(room){
    try{
      if(room==='solo'&&typeof window.ktSoloOpenMessage==='function'){window.ktSoloOpenMessage();return true;}
      if(room==='group13'&&typeof window.ktGroup13OpenMessage==='function'){window.ktGroup13OpenMessage();return true;}
      if(room==='subscriber'&&typeof window.ktSubscriberOpenMessage==='function'){window.ktSubscriberOpenMessage();return true;}
      if(room==='secret'&&typeof window.ktSecretOpenMessage==='function'){window.ktSecretOpenMessage();return true;}
    }catch(e){}
    return false;
  }

  function more(room){
    try{
      if(room==='solo'&&typeof window.ktSoloMore==='function'){window.ktSoloMore();return true;}
      if(room==='group13'&&typeof window.ktGroup13More==='function'){window.ktGroup13More();return true;}
      if(room==='subscriber'&&typeof window.ktSubscriberMore==='function'){window.ktSubscriberMore();return true;}
      if(room==='secret'&&typeof window.ktSecretMore==='function'){window.ktSecretMore();return true;}
    }catch(e){}
    return false;
  }

  function run(info,btn){
    var k=label(btn);
    try{
      if(k.indexOf('매치')>-1){
        if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return true;}
        if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return true;}
      }else if(k.indexOf('친구')>-1){
        if(info.room==='group13'&&typeof window.ktGroup13Friends==='function'){window.ktGroup13Friends();return true;}
        if(typeof window.shareApp==='function'){window.shareApp();return true;}
      }else if(k.indexOf('메시지')>-1){
        return message(info.room);
      }else if(k.indexOf('장미')>-1){
        if(typeof window.giftSend==='function'){window.giftSend('장미',1);return true;}
        if(typeof window.ktAnnounceEvent==='function'){window.ktAnnounceEvent('gift',{name:'장미',count:1});return true;}
      }else if(k.indexOf('선물')>-1){
        if(typeof window.openGifts==='function'){window.openGifts();return true;}
      }else if(k.indexOf('공유')>-1){
        if(typeof window.shareApp==='function'){window.shareApp();return true;}
      }else if(k.indexOf('효과')>-1){
        return show('효과','<div class="rowbox"><b>방송 효과</b><br>효과 버튼이 정상 작동합니다.</div>');
      }else if(k.indexOf('더보기')>-1){
        return more(info.room);
      }
    }catch(e){}
    return false;
  }

  function stop(e){
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
  }

  function tap(e){
    var info=roomAndBox();
    if(!info||!info.box)return;
    var btn=findBtn(e,info);
    if(!btn)return;

    var now=Date.now();
    if(lastBtn===btn&&now-lastAt<500){stop(e);return;}
    if(!run(info,btn))return;

    lastBtn=btn;
    lastAt=now;
    stop(e);
  }

  window.addEventListener('pointerdown',tap,true);
  window.addEventListener('touchstart',tap,{capture:true,passive:false});

  function unlock(){
    var info=roomAndBox();
    if(!info||!info.box)return;
    try{
      info.box.style.setProperty('pointer-events','auto','important');
      info.box.style.setProperty('z-index','200','important');
      info.box.querySelectorAll('button').forEach(function(btn){
        btn.disabled=false;
        btn.setAttribute('aria-disabled','false');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('position','relative','important');
        btn.style.setProperty('z-index','201','important');
      });
    }catch(e){}
  }

  [0,80,220,500,1000,1800].forEach(function(ms){setTimeout(unlock,ms);});
  try{
    new MutationObserver(function(){setTimeout(unlock,20);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
