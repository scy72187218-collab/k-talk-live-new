/* K-Talk 보물상자 호스트 머리 표시 보강: 로컬 보물상자는 서버 등록 전에도 즉시 호스트 화면에 표시. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktTreasureHostHeadFallbackInstalled)return;
  window.__ktTreasureHostHeadFallbackInstalled=true;

  function getTreasure(){
    try{return typeof window.ktGetTreasure==='function'?window.ktGetTreasure():null;}catch(e){return null;}
  }

  function hostBox(){
    return document.querySelector('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host');
  }

  function fmt(ms){
    var sec=Math.max(0,Math.ceil(ms/1000));
    var min=Math.floor(sec/60);sec%=60;
    return String(min).padStart(2,'0')+':'+String(sec).padStart(2,'0');
  }

  function ensureStyle(){
    if(document.getElementById('ktTreasureHostHeadFallbackStyle'))return;
    var s=document.createElement('style');
    s.id='ktTreasureHostHeadFallbackStyle';
    s.textContent=''
      +'.kt-treasure-host-head-fallback{position:fixed!important;z-index:99988!important;width:58px!important;min-height:60px!important;border:2px solid #ffd45b!important;border-radius:17px!important;background:rgba(26,16,5,.95)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;padding:4px 3px!important;box-shadow:0 0 12px #ffb000aa,0 0 24px #ffdf4470!important;font:950 9px/1.05 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;touch-action:manipulation!important}'
      +'.kt-treasure-host-head-fallback .ico{font-size:27px!important;line-height:1!important}.kt-treasure-host-head-fallback strong{font-size:9px!important;color:#ffe052!important}.kt-treasure-host-head-fallback small{font-size:8px!important;color:#fff!important}.kt-treasure-host-head-fallback.ready{animation:ktTreasureHostFallbackPulse .8s ease-in-out infinite alternate!important}'
      +'@keyframes ktTreasureHostFallbackPulse{from{box-shadow:0 0 8px #ffb00099}to{box-shadow:0 0 22px #ffe500}}';
    document.head.appendChild(s);
  }

  function remove(){
    var b=document.getElementById('ktTreasureHostHeadFallback');
    if(b)b.remove();
  }

  function render(){
    ensureStyle();

    /* 서버용 정상 배지가 이미 뜨면 중복 표시하지 않는다. */
    if(document.getElementById('ktGlobalTreasureHostBadge')){remove();return;}

    var t=getTreasure();
    var host=hostBox();
    if(!t||!host||!host.isConnected){remove();return;}

    var b=document.getElementById('ktTreasureHostHeadFallback');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.id='ktTreasureHostHeadFallback';
      b.className='kt-treasure-host-head-fallback';
      document.body.appendChild(b);
      b.onclick=function(e){
        if(e){e.preventDefault();e.stopPropagation();}
        var x=getTreasure();if(!x)return;
        var left=Number(x.unlockAt||0)-Date.now();
        try{alert('🎁 보물상자 '+(parseInt(x.amount||50,10)||50)+'개 · '+(left<=0?'지금 열렸습니다.':'열림까지 '+fmt(left)));}catch(err){}
      };
    }

    var r=host.getBoundingClientRect();
    var w=58;
    var left=Math.max(4,Math.min((window.innerWidth||document.documentElement.clientWidth||360)-w-4,r.right-w-6));
    var top=Math.max(4,r.top+22);
    b.style.left=left+'px';
    b.style.top=top+'px';

    var amount=parseInt(t.amount||50,10)||50;
    var remain=Number(t.unlockAt||0)-Date.now();
    var ready=remain<=0;
    b.classList.toggle('ready',ready);
    b.innerHTML='<span class="ico">🎁</span><strong>'+amount+'개</strong><small>'+(ready?'지금 열림':fmt(remain))+'</small>';
  }

  render();
  setTimeout(render,80);
  setTimeout(render,300);
  setInterval(render,300);
})();
