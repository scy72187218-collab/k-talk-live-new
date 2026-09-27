/* K-Talk: 모든 방송방에서
   일일 랭킹 / 미션 / 시청자 수 바로 아래에
   되돌리기 / 보물상자 / 매치 가로줄을 유지한다.
   오른쪽 옆 세로 중복 버튼은 다른 파일에서 제거한다. */
(function(){
  if(window.__ktAllRoomSecondStatsRow20260928)return;
  window.__ktAllRoomSecondStatsRow20260928=true;

  function activeRoom(){
    return document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room,'+
      '#screen .ktg9-room'
    );
  }

  function cleanText(el){
    return String((el&&el.textContent)||'').replace(/\s+/g,'');
  }

  function findStatsRow(r){
    if(!r)return null;

    var known=r.querySelector(
      '.kt-room-stats-copy,'+
      '.ktg13-stats,'+
      '.ktsolo-stats,'+
      '.ktsubscriber-stats,'+
      '.ktsecret-stats,'+
      '.ktg9-stats'
    );
    if(known)return known;

    var els=[].slice.call(r.querySelectorAll('div,section'));
    var best=null;
    for(var i=0;i<els.length;i++){
      var el=els[i];
      var t=cleanText(el);
      if(t.indexOf('일일랭킹')>-1 && t.indexOf('미션')>-1 && t.indexOf('시청자')>-1){
        var childCount=(el.children&&el.children.length)||0;
        if(childCount>=2&&childCount<=5){
          best=el;
          break;
        }
      }
    }
    return best;
  }

  function flip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
      if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera();return;}
      if(typeof window.toggleCreatorCamera==='function'){window.toggleCreatorCamera();return;}
    }catch(e){}
  }

  function treasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
      if(typeof window.openTreasure==='function'){window.openTreasure();return;}
      if(typeof window.openTreasureBox==='function'){window.openTreasureBox();return;}
      if(typeof window.openGifts==='function'){window.openGifts();return;}
    }catch(e){}
  }

  function match(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
      if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
      if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}
    }catch(e){}
  }

  function mk(icon,label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.setAttribute('aria-label',label);
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      fn();
    });
    return b;
  }

  function ensureStyle(){
    var old=document.getElementById('ktAllRoomSecondStatsRowStyle20260927');
    if(old)old.remove();
    if(document.getElementById('ktAllRoomSecondStatsRowStyle20260928'))return;

    var s=document.createElement('style');
    s.id='ktAllRoomSecondStatsRowStyle20260928';
    s.textContent=''
      +'#screen .kt-room-second-stats-row-20260927{'
        +'box-sizing:border-box!important;flex:0 0 46px!important;min-height:46px!important;'
        +'width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'gap:4px!important;background:#000!important;position:relative!important;z-index:26!important;'
        +'visibility:visible!important;opacity:1!important;overflow:visible!important;pointer-events:auto!important}'
      +'#screen .kt-room-second-stats-row-20260927 button{'
        +'box-sizing:border-box!important;min-width:0!important;height:46px!important;'
        +'border:0!important;border-radius:12px!important;background:#111114!important;color:#fff!important;'
        +'font:950 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
        +'display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;'
        +'white-space:nowrap!important;overflow:hidden!important;padding:0 3px!important;touch-action:manipulation!important}'
      +'#screen .kt-room-second-stats-row-20260927 button b{font-size:16px!important;line-height:1!important}'
      +'#screen .kt-room-second-stats-row-20260927 button span{font-size:11px!important;line-height:1!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-room-second-stats-row-20260927{flex-basis:42px!important;min-height:42px!important;gap:3px!important}'
        +'#screen .kt-room-second-stats-row-20260927 button{height:42px!important}'
        +'#screen .kt-room-second-stats-row-20260927 button b{font-size:14px!important}'
        +'#screen .kt-room-second-stats-row-20260927 button span{font-size:10px!important}'
      +'}';
    document.head.appendChild(s);
  }

  function ensure(){
    ensureStyle();

    var r=activeRoom();
    var existing=document.querySelector('#screen .kt-room-second-stats-row-20260927');

    if(!r){
      if(existing)existing.remove();
      return;
    }

    var stats=findStatsRow(r);
    if(!stats)return;

    if(existing&&existing.parentElement!==r){
      existing.remove();
      existing=null;
    }

    if(!existing){
      existing=document.createElement('div');
      existing.className='kt-room-second-stats-row-20260927';
      existing.appendChild(mk('↻','되돌리기',flip));
      existing.appendChild(mk('🎁','보물상자',treasure));
      existing.appendChild(mk('⚔','매치',match));
    }

    if(existing.previousElementSibling!==stats){
      stats.insertAdjacentElement('afterend',existing);
    }
  }

  ensure();
  [40,100,220,450,800,1400,2200,3500].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomSecondStatsRowTimer20260928);
      window.__ktAllRoomSecondStatsRowTimer20260928=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();