/* Restore only three live-room controls in all five rooms:
   되돌리기 / 보물상자 / 매치. Do not alter other layouts or protected controls. */
(function(){
  if(window.__ktAllRoomThreeQuickRestore20260927)return;
  window.__ktAllRoomThreeQuickRestore20260927=true;

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

  function makeButton(kind,label,icon,fn){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-three-quick-'+kind;
    b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><small>'+label+'</small>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      fn();
    };
    return b;
  }

  function findOrCreateBox(room){
    if(!room)return null;
    var box=null;
    if(room.classList.contains('ktsolo-room')){
      box=room.querySelector('.ktsolo-right');
      if(!box){
        var main=room.querySelector('.ktsolo-main')||room;
        box=document.createElement('div');box.className='ktsolo-right kt-three-quick-box';main.appendChild(box);
      }
    }else if(room.classList.contains('ktsubscriber-room')){
      box=room.querySelector('.ktsubscriber-right');
      if(!box){
        var main2=room.querySelector('.ktsubscriber-main')||room;
        box=document.createElement('div');box.className='ktsubscriber-right kt-three-quick-box';main2.appendChild(box);
      }
    }else if(room.classList.contains('ktsecret-room')){
      box=room.querySelector('.ktsecret-right');
      if(!box){
        var main3=room.querySelector('.ktsecret-main')||room;
        box=document.createElement('div');box.className='ktsecret-right kt-three-quick-box';main3.appendChild(box);
      }
    }else if(room.classList.contains('ktg13-room')){
      box=room.querySelector('.ktg13-right-quick');
      if(!box){
        var main4=room.querySelector('.ktg13-main')||room;
        box=document.createElement('div');box.className='ktg13-right-quick kt-three-quick-box';main4.appendChild(box);
      }
    }
    return box;
  }

  function hasLabel(box,label){
    return [].slice.call(box.querySelectorAll('button')).some(function(b){
      var t=String(b.textContent||'').replace(/\s+/g,'');
      var a=String(b.getAttribute('aria-label')||'').replace(/\s+/g,'');
      return t.indexOf(label)>-1||a.indexOf(label)>-1||
        (label==='되돌리기'&&(t.indexOf('뒤집기')>-1||a.indexOf('뒤집기')>-1));
    });
  }

  function ensureRoom(room){
    var box=findOrCreateBox(room);
    if(!box)return;
    try{
      box.style.setProperty('display','flex','important');
      box.style.setProperty('visibility','visible','important');
      box.style.setProperty('opacity','1','important');
      box.style.setProperty('pointer-events','auto','important');
      box.style.setProperty('z-index','95','important');
    }catch(e){}

    if(!hasLabel(box,'되돌리기')){
      var f=makeButton('flip','되돌리기','↻',actFlip);
      try{box.insertBefore(f,box.firstElementChild||null);}catch(e){box.appendChild(f);}
    }
    if(!hasLabel(box,'보물상자')){
      box.appendChild(makeButton('treasure','보물상자','🎁',actTreasure));
    }
    if(!hasLabel(box,'매치')){
      box.appendChild(makeButton('match','매치','⚔',actMatch));
    }

    box.querySelectorAll('.kt-three-quick-flip,.kt-three-quick-treasure,.kt-three-quick-match').forEach(function(b){
      try{
        b.disabled=false;
        b.setAttribute('aria-disabled','false');
        b.style.setProperty('display','flex','important');
        b.style.setProperty('visibility','visible','important');
        b.style.setProperty('opacity','1','important');
        b.style.setProperty('pointer-events','auto','important');
        b.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
  }

  function ensure(){
    document.querySelectorAll(
      '#screen .ktsolo-room'
    ).forEach(ensureRoom);
  }

  if(!document.getElementById('ktThreeQuickRestoreStyle20260927')){
    var s=document.createElement('style');
    s.id='ktThreeQuickRestoreStyle20260927';
    s.textContent=''
      +'.kt-three-quick-box{pointer-events:auto!important}'
      +'.kt-three-quick-flip,.kt-three-quick-treasure,.kt-three-quick-match{'
        +'min-width:44px!important;min-height:44px!important;'
        +'align-items:center!important;justify-content:center!important;flex-direction:column!important;'
        +'border:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;'
        +'font-weight:950!important;position:relative!important;z-index:96!important}'
      +'.kt-three-quick-flip b,.kt-three-quick-treasure b,.kt-three-quick-match b{font-size:18px!important;line-height:1!important}'
      +'.kt-three-quick-flip small,.kt-three-quick-treasure small,.kt-three-quick-match small{font-size:8px!important;line-height:1.05!important;margin-top:2px!important;white-space:nowrap!important}';
    document.head.appendChild(s);
  }

  ensure();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktThreeQuickRestoreTimer);
      window.__ktThreeQuickRestoreTimer=setTimeout(ensure,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(ensure,1000);
})();