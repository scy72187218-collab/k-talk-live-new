/* 1인방 전용: 일일 랭킹/미션/시청자 바로 아래
   되돌리기 / 보물상자 / 매치 3개만 표시. 다른 방/기능은 건드리지 않음. */
(function(){
  if(window.__ktSoloThreeUnderStats20260927)return;
  window.__ktSoloThreeUnderStats20260927=true;

  function doFlip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
      if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera();return;}
    }catch(e){}
  }
  function doTreasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
      if(typeof window.openTreasure==='function'){window.openTreasure();return;}
      if(typeof window.openGifts==='function')window.openGifts();
    }catch(e){}
  }
  function doMatch(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
      if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
      if(typeof window.openMatchArena==='function')window.openMatchArena('1대1');
    }catch(e){}
  }

  function make(label,icon,fn){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-solo-three-btn';
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      fn();
    };
    return b;
  }

  function style(){
    if(document.getElementById('ktSoloThreeUnderStatsStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktSoloThreeUnderStatsStyle20260927';
    s.textContent=''
      +'#screen .ktsolo-room .kt-solo-three-row{'
      +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
      +'gap:4px!important;width:100%!important;height:52px!important;min-height:52px!important;'
      +'margin:0!important;padding:0!important;background:#000!important;z-index:40!important;}'
      +'#screen .ktsolo-room .kt-solo-three-btn{'
      +'min-width:0!important;height:52px!important;border-radius:10px!important;'
      +'border:1px solid rgba(255,255,255,.16)!important;background:#17171a!important;color:#fff!important;'
      +'display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;'
      +'font-weight:950!important;padding:0 4px!important;touch-action:manipulation!important;}'
      +'#screen .ktsolo-room .kt-solo-three-btn b{font-size:18px!important;line-height:1!important;}'
      +'#screen .ktsolo-room .kt-solo-three-btn span{font-size:12px!important;white-space:nowrap!important;}'
      +'@media(max-width:390px){'
      +'#screen .ktsolo-room .kt-solo-three-row,#screen .ktsolo-room .kt-solo-three-btn{height:48px!important;min-height:48px!important;}'
      +'#screen .ktsolo-room .kt-solo-three-btn b{font-size:16px!important;}'
      +'#screen .ktsolo-room .kt-solo-three-btn span{font-size:10px!important;}}';
    document.head.appendChild(s);
  }

  function ensure(){
    style();
    var room=document.querySelector('#screen .ktsolo-room');
    if(!room)return;

    var stats=room.querySelector('.kt-room-stats-copy');
    if(!stats)return;

    var row=room.querySelector('.kt-solo-three-row');
    if(!row){
      row=document.createElement('div');
      row.className='kt-solo-three-row';
      row.appendChild(make('되돌리기','↻',doFlip));
      row.appendChild(make('보물상자','🎁',doTreasure));
      row.appendChild(make('매치','⚔',doMatch));
    }
    if(row.previousElementSibling!==stats)stats.insertAdjacentElement('afterend',row);

    /* 기존 1인방 오른쪽 작은 매치/퀵버튼만 제거해 중복 방지 */
    room.querySelectorAll('.ktsolo-right').forEach(function(box){
      try{box.remove();}catch(e){}
    });
  }

  ensure();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloThreeUnderStatsTimer);
      window.__ktSoloThreeUnderStatsTimer=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();