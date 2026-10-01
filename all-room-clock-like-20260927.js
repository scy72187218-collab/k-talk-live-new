/* K-Talk: 모든 방송방 방송시간 바로 옆 하트 좋아요 숫자.
   1인/9명/13명/구독/비밀방 공통. 누를 때마다 +1.
   다른 방 배치/통신/카메라는 변경하지 않음. */
(function(){
  if(window.__ktAllRoomClockLike20260927)return;
  window.__ktAllRoomClockLike20260927=true;

  var count=0;
  var originalAddHostLike=null;

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
    count+=step;
    paint();
    return r;
  }

  function ensure(){
    ensureStyle();
    installWrap();

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
      else{count+=1;paint();}
    });
    clock.insertAdjacentElement('afterend',b);
  }

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