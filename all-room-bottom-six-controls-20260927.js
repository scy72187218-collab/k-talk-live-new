/* K-Talk: all five live rooms - compact six controls near bottom.
   Adds only: 일일 랭킹 / 미션 / 시청자 / 되돌리기 / 보물상자 / 매치.
   Existing room buttons, camera, gifts, chat and transport are untouched. */
(function(){
  if(window.__ktAllRoomBottomSix20260927)return;
  window.__ktAllRoomBottomSix20260927=true;

  function currentRoom(){
    return document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    );
  }

  function ranking(){
    try{
      if(typeof window.ktGroup13Ranking==='function'){window.ktGroup13Ranking();return;}
      if(typeof window.openDailyRanking==='function'){window.openDailyRanking();return;}
      if(typeof window.showSheet==='function'){
        window.showSheet('🔥 일일 랭킹','<div class="rowbox"><b>일일 랭킹</b><br>오늘의 방송 랭킹을 확인합니다.</div>');
      }
    }catch(e){}
  }

  function mission(){
    try{
      if(typeof window.ktGroup9Mission==='function'){window.ktGroup9Mission();return;}
      if(typeof window.openMission==='function'){window.openMission();return;}
      if(typeof window.showSheet==='function'){
        window.showSheet('🎯 미션',''
          +'<div class="rowbox"><b>1단계 🌹 장미 미션</b><br>장미 1개짜리 30개 깨기</div>'
          +'<div class="rowbox"><b>2단계 🏎️ 스포츠카 미션</b><br>스포츠카 50개짜리 10개 깨기</div>'
          +'<div class="rowbox"><b>3단계 🎁 보물상자</b><br>보물상자 10개 깨기</div>');
      }
    }catch(e){}
  }

  function viewers(){
    try{
      if(typeof window.openViewerList==='function'){window.openViewerList();return;}
      var room=currentRoom(),txt='';
      if(room){
        var el=room.querySelector('.ktg13-viewers,.kt-room-viewers-copy,[class*="viewers"]');
        if(el)txt=String(el.textContent||'').trim();
      }
      if(typeof window.showSheet==='function'){
        window.showSheet('👥 시청자','<div class="rowbox"><b>현재 시청자</b><br>'+(txt||'현재 시청자 목록을 확인합니다.')+'</div>');
      }
    }catch(e){}
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

  function makeButton(icon,label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      fn();
    });
    return b;
  }

  function ensureStyle(){
    if(document.getElementById('ktAllRoomBottomSixStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomBottomSixStyle20260927';
    s.textContent=''
      +'#ktAllRoomBottomSix20260927{position:fixed!important;left:4px!important;right:4px!important;bottom:calc(128px + env(safe-area-inset-bottom))!important;z-index:180!important;height:30px!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:2px!important;padding:2px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:9px!important;background:rgba(5,5,8,.74)!important;backdrop-filter:blur(4px)!important;box-sizing:border-box!important;pointer-events:auto!important}'
      +'#ktAllRoomBottomSix20260927 button{min-width:0!important;height:24px!important;margin:0!important;padding:0 1px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:7px!important;background:#111116e8!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;font:900 8px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;overflow:hidden!important;touch-action:manipulation!important}'
      +'#ktAllRoomBottomSix20260927 button b{font-size:9px!important;line-height:1!important}'
      +'#ktAllRoomBottomSix20260927 button span{font-size:8px!important;line-height:1!important;overflow:hidden!important;text-overflow:clip!important}'
      +'@media(max-width:390px){#ktAllRoomBottomSix20260927{left:3px!important;right:3px!important;bottom:calc(126px + env(safe-area-inset-bottom))!important;gap:1px!important}#ktAllRoomBottomSix20260927 button{font-size:7px!important}#ktAllRoomBottomSix20260927 button span{font-size:7px!important}}';
    document.head.appendChild(s);
  }

  function ensure(){
    ensureStyle();
    var room=currentRoom();
    var row=document.getElementById('ktAllRoomBottomSix20260927');
    if(!room){
      if(row)row.remove();
      return;
    }
    if(row)return;

    row=document.createElement('div');
    row.id='ktAllRoomBottomSix20260927';
    row.appendChild(makeButton('🔥','일일 랭킹',ranking));
    row.appendChild(makeButton('🎯','미션',mission));
    row.appendChild(makeButton('👥','시청자',viewers));
    row.appendChild(makeButton('↻','되돌리기',flip));
    row.appendChild(makeButton('🎁','보물상자',treasure));
    row.appendChild(makeButton('⚔','매치',match));
    document.body.appendChild(row);
  }

  [0,80,220,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,800);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomBottomSixTimer20260927);
      window.__ktAllRoomBottomSixTimer20260927=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
