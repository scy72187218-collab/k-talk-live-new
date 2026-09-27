/* 1인방 전용: 일일 랭킹/미션/시청자 바로 아래에
   되돌리기 / 보물상자 / 매치 3개만 가로 배치.
   다른 방/다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktSoloTopThreeOnly20260927)return;
  window.__ktSoloTopThreeOnly20260927=true;

  function actFlip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
      if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera();return;}
    }catch(e){}
  }
  function actTreasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
      if(typeof window.openTreasure==='function'){window.openTreasure();return;}
      if(typeof window.openGifts==='function')window.openGifts();
    }catch(e){}
  }
  function actMatch(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
      if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
      if(typeof window.openMatchArena==='function')window.openMatchArena('1대1');
    }catch(e){}
  }

  function make(icon,label,fn,kind){
    var b=document.createElement('button');
    b.type='button';
    if(kind==='treasure'){
      b.className='kt-solo-treasure-btn';
      b.innerHTML='<b>'+icon+'</b><span class="kt-solo-treasure-label">보물상자</span><em>100개</em><small data-kt-solo-treasure-time>03:00</small>';
    }else{
      b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    }
    b.setAttribute('aria-label',label);
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      fn();
    };
    return b;
  }

  function ensureStyle(){
    if(document.getElementById('ktSoloTopThreeOnlyStyle'))return;
    var s=document.createElement('style');
    s.id='ktSoloTopThreeOnlyStyle';
    s.textContent=''
      +'#screen .ktsolo-room .kt-solo-top-three{'
        +'width:100%!important;height:52px!important;min-height:52px!important;'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'gap:4px!important;margin:0!important;padding:0!important;'
        +'background:#000!important;position:relative!important;z-index:40!important;'
      +'}'
      +'#screen .ktsolo-room .kt-solo-top-three>button{'
        +'height:52px!important;min-width:0!important;border-radius:10px!important;'
        +'border:1px solid rgba(255,255,255,.18)!important;background:#17171a!important;'
        +'color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;'
        +'gap:6px!important;font-weight:950!important;padding:0 4px!important;'
      +'}'
      +'#screen .ktsolo-room .kt-solo-top-three>button b{font-size:18px!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>.kt-solo-treasure-btn{flex-direction:column!important;gap:1px!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>.kt-solo-treasure-btn>b{font-size:9px!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>.kt-solo-treasure-btn>.kt-solo-treasure-label{font-size:10px!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>.kt-solo-treasure-btn>em{font-style:normal!important;font-size:9px!important;color:#ffe071!important;font-weight:950!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>.kt-solo-treasure-btn>small{font-size:8px!important;color:#ddd!important;line-height:1!important}'
      +'#screen .ktsolo-room .kt-solo-top-three>button span{font-size:12px!important;line-height:1!important;white-space:nowrap!important}'
      +'@media(max-width:390px){'
        +'#screen .ktsolo-room .kt-solo-top-three{height:48px!important;min-height:48px!important;gap:3px!important}'
        +'#screen .ktsolo-room .kt-solo-top-three>button{height:48px!important;gap:4px!important}'
        +'#screen .ktsolo-room .kt-solo-top-three>button b{font-size:16px!important}'
        +'#screen .ktsolo-room .kt-solo-top-three>button span{font-size:10px!important}'
      +'}';
    document.head.appendChild(s);
  }

  function updateSoloTreasureCountdown(){
    try{
      var el=document.querySelector('#screen .ktsolo-room [data-kt-solo-treasure-time]');
      if(!el)return;
      var remaining=180;
      try{
        if(window.__ktTreasure&&window.__ktTreasure.unlock_at){
          remaining=Math.max(0,Math.ceil((Number(window.__ktTreasure.unlock_at)-Date.now())/1000));
        }else if(window.state&&state.treasure&&state.treasure.unlock_at){
          remaining=Math.max(0,Math.ceil((Number(state.treasure.unlock_at)-Date.now())/1000));
        }
      }catch(e){}
      var m=Math.floor(remaining/60),s=remaining%60;
      el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    }catch(e){}
  }

  function ensure(){
    ensureStyle();
    updateSoloTreasureCountdown();
    var room=document.querySelector('#screen .ktsolo-room');
    if(!room)return;

    /* 1인방 안의 기존 오른쪽 작은 중복 버튼만 제거 */
    room.querySelectorAll('.ktsolo-right,.kt-three-quick-box').forEach(function(el){
      try{el.remove();}catch(e){}
    });

    var stats=room.querySelector('.kt-room-stats-copy');
    if(!stats)return;

    var row=room.querySelector('.kt-solo-top-three');
    if(!row){
      row=document.createElement('div');
      row.className='kt-solo-top-three';
      row.appendChild(make('↻','되돌리기',actFlip,'flip'));
      row.appendChild(make('🎁','보물상자',actTreasure,'treasure'));
      row.appendChild(make('⚔','매치',actMatch,'match'));
      stats.insertAdjacentElement('afterend',row);
    }else if(row.previousElementSibling!==stats){
      stats.insertAdjacentElement('afterend',row);
    }
  }

  ensure();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloTopThreeOnlyTimer);
      window.__ktSoloTopThreeOnlyTimer=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();