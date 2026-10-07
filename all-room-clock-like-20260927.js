/* K-Talk: 모든 방송방 방송시간 바로 옆 하트 좋아요 숫자.
   1인/9명/13명/구독/비밀방 공통. 누를 때마다 +1.
   다른 방 배치/통신/카메라는 변경하지 않음. */
(function(){
  if(window.__ktAllRoomClockLike20260927)return;
  window.__ktAllRoomClockLike20260927=true;

  var count=0;
  var originalAddHostLike=null;

  function likeStoreKey(){
    var r=room();
    if(!r)return 'ktalk_live_like:unknown';
    if(r.classList.contains('ktsolo-room'))return 'ktalk_live_like:solo';
    if(r.classList.contains('ktsubscriber-room'))return 'ktalk_live_like:subscriber';
    if(r.classList.contains('ktsecret-room'))return 'ktalk_live_like:secret';
    if(r.classList.contains('ktg13-room'))return r.getAttribute('data-kt-room')==='9'?'ktalk_live_like:group9':'ktalk_live_like:group13';
    if(r.classList.contains('ktg9-room'))return 'ktalk_live_like:group9';
    return 'ktalk_live_like:room';
  }

  function loadCount(){
    try{
      var v=parseInt(localStorage.getItem(likeStoreKey())||'0',10);
      if(isFinite(v)&&v>=0)count=v;
    }catch(e){}
  }

  function saveCount(){
    try{localStorage.setItem(likeStoreKey(),String(Math.max(0,count||0)));}catch(e){}
  }

  function room(){
    return document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
      '#screen .ktg9-room'
    );
  }

  function ensureStyle(){
    if(document.getElementById('ktAllRoomClockLikeStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomClockLikeStyle20260927';
    s.textContent=''
      +'.kt-clock-like-20260927{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;margin-left:7px!important;min-width:42px!important;height:24px!important;padding:0 7px!important;border:1px solid rgba(255,90,145,.62)!important;border-radius:999px!important;background:rgba(44,12,27,.88)!important;color:#fff!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;vertical-align:middle!important;touch-action:manipulation!important;pointer-events:auto!important}'
      +'.kt-clock-like-20260927 b{color:#ff4f91!important;font-size:15px!important;line-height:1!important}.kt-clock-like-20260927 span{font-size:10px!important;min-width:10px!important;text-align:center!important}'
      +'@media(max-width:390px){.kt-clock-like-20260927{margin-left:5px!important;min-width:36px!important;height:21px!important;padding:0 5px!important}.kt-clock-like-20260927 b{font-size:13px!important}.kt-clock-like-20260927 span{font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function paint(){
    loadCount();
    document.querySelectorAll('.kt-clock-like-20260927 span').forEach(function(el){
      el.textContent=String(count);
    });
  }

  function installWrap(){
    if(window.addHostLike&&window.addHostLike!==wrappedAddHostLike){
      originalAddHostLike=window.addHostLike;
      window.addHostLike=wrappedAddHostLike;
    }
  }

  function wrappedAddHostLike(n){
    var step=parseInt(n,10)||1;
    if(step<1)step=1;
    var r;
    try{if(originalAddHostLike)r=originalAddHostLike.apply(this,arguments);}catch(e){}
    loadCount();
    count+=step;
    saveCount();
    paint();
    return r;
  }

  function ensure(){
    /* 게스트 화면에서는 시계 옆 하트/숫자를 만들지 않는다. 호스트만 유지. */
    var guestView=!!(document.documentElement.classList.contains('kt-remote-viewing')||document.querySelector('.kt-remote-live,.kt-guest-hostlike-room,.kt-prejoin-room-grid'));
    if(guestView){
      try{document.querySelectorAll('.kt-clock-like-20260927,.kt-live-clock-heart').forEach(function(x){x.remove();});}catch(e){}
      return;
    }
    ensureStyle();
    installWrap();
    loadCount();

    var r=room();
    if(!r)return;

    /* 2026-10-01: keep exactly one heart beside the clock.
       Remove only the older duplicate heart badge if another helper created it. */
    try{
      r.querySelectorAll('.kt-live-clock-heart').forEach(function(x){
        try{if(x&&x.parentNode)x.parentNode.removeChild(x);}catch(e){}
      });
    }catch(e){}

    var clock=r.querySelector('#ktLiveClock');
    if(!clock)return;

    var old=r.querySelector('.kt-clock-like-20260927');
    if(old){
      if(old.previousElementSibling!==clock)clock.insertAdjacentElement('afterend',old);
      paint();
      return;
    }

    var b=document.createElement('button');
    b.type='button';
    b.className='kt-clock-like-20260927';
    b.setAttribute('aria-label','좋아요');
    b.innerHTML='<b>♥</b><span>'+count+'</span>';
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      if(typeof window.addHostLike==='function')window.addHostLike(1);
      else{loadCount();count+=1;saveCount();paint();}
    });
    clock.insertAdjacentElement('afterend',b);
  }

  /* 호스트 사진을 누를 때마다 시계 옆 하트 숫자 +1. 게스트 화면은 제외. */
  document.addEventListener('click',function(e){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing')||document.querySelector('.kt-remote-live,.kt-guest-hostlike-room,.kt-prejoin-room-grid'))return;
      var t=e.target&&e.target.closest?e.target.closest('.kt-allhost-photo,.kt-allhost-fallback,.ktg13-host,.ktg13-host video,.ktg13-host img,.ktg13-host .kt-profile-photo,.ktsubscriber-host,.ktsubscriber-host video,.ktsubscriber-host img,.ktsecret-host,.ktsecret-host video,.ktsecret-host img,.ktg9-host,.ktg9-host video,.ktg9-host img,#ktLiveVideo,[data-kt-host-photo]'):null;
      /* 실제 호스트 화면은 방마다 호스트 칸 클래스가 달라도 첫 카메라 영상이 호스트다. */
      if(!t&&e.target&&e.target.closest){
        var v=e.target.closest('video');
        var rr=room();
        if(v&&rr&&v===rr.querySelector('video'))t=v;
      }
      if(!t)return;
      var now=Date.now();if(now-Number(window.__ktHostPhotoLikeTapAt||0)<350)return;window.__ktHostPhotoLikeTapAt=now;
      if(typeof window.addHostLike==='function')window.addHostLike(1);
      else{loadCount();count+=1;saveCount();paint();}
      setTimeout(ensure,0);
    }catch(_e){}
  },true);

  ensure();
  [60,160,350,700,1200,2200].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomClockLikeTimer20260927);
      window.__ktAllRoomClockLikeTimer20260927=setTimeout(ensure,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();