/* K-Talk: remove the old bottom floating controls.
   Keep the existing first row: 일일 랭킹 / 미션 / 시청자.
   Add ONLY a second row directly underneath: 되돌리기 / 보물상자 / 매치.
   Applies to 1-person, 9-person, 13-person, subscriber and secret rooms. */
(function(){
  if(window.__ktAllRoomSecondStatsRow20260927)return;
  window.__ktAllRoomSecondStatsRow20260927=true;

  function room(){
    return document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    );
  }

  function firstRow(r){
    if(!r)return null;
    return r.querySelector('.kt-room-stats-copy,.ktg13-stats');
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
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      fn();
    });
    return b;
  }

  function style(){
    var old=document.getElementById('ktAllRoomBottomSixStyle20260927');
    if(old)old.remove();
    if(document.getElementById('ktAllRoomSecondStatsRowStyle20260927'))return;

    var s=document.createElement('style');
    s.id='ktAllRoomSecondStatsRowStyle20260927';
    s.textContent=''
      +'#ktAllRoomBottomSix20260927{display:none!important}'
      +'#screen .kt-room-second-stats-row-20260927{box-sizing:border-box!important;flex:0 0 40px!important;min-height:40px!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;background:#000!important;position:relative!important;z-index:26!important;visibility:visible!important;opacity:1!important;overflow:visible!important;pointer-events:auto!important}'
      +'#screen .kt-room-second-stats-row-20260927 button{box-sizing:border-box!important;min-width:0!important;height:40px!important;border:0!important;border-radius:10px!important;background:#111114!important;color:#fff!important;font:950 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;white-space:nowrap!important;overflow:hidden!important;padding:0 2px!important;touch-action:manipulation!important}'
      +'#screen .kt-room-second-stats-row-20260927 button b{font-size:15px!important;line-height:1!important}'
      +'#screen .kt-room-second-stats-row-20260927 button span{font-size:11px!important;line-height:1!important}'
      +'@media(max-width:390px){#screen .kt-room-second-stats-row-20260927{flex-basis:36px!important;min-height:36px!important;gap:2px!important}#screen .kt-room-second-stats-row-20260927 button{height:36px!important;font-size:10px!important;padding:0 1px!important}#screen .kt-room-second-stats-row-20260927 button b{font-size:13px!important}#screen .kt-room-second-stats-row-20260927 button span{font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function removeOldBottom(){
    try{
      var old=document.getElementById('ktAllRoomBottomSix20260927');
      if(old)old.remove();
    }catch(e){}
  }

  function ensure(){
    style();
    removeOldBottom();

    var r=room();
    var existing=document.querySelector('#screen .kt-room-second-stats-row-20260927');

    if(!r){
      if(existing)existing.remove();
      return;
    }

    var top=firstRow(r);
    if(!top)return;

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
      top.insertAdjacentElement('afterend',existing);
    }else if(existing.previousElementSibling!==top){
      top.insertAdjacentElement('afterend',existing);
    }
  }

  ensure();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,800);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomSecondStatsRowTimer20260927);
      window.__ktAllRoomSecondStatsRowTimer20260927=setTimeout(ensure,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
