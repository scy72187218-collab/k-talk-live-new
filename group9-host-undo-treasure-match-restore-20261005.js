/* 9-room HOST only: restore exactly 되돌리기 / 보물상자 / 매치.
   No package box. No guest/viewer rooms. No layout/chat/gift/signaling changes. 1150617 */
(function(){
  if(window.__ktG9HostUTMRestore20261005)return;
  window.__ktG9HostUTMRestore20261005=true;

  function hostRoom(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return null;
    return document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
  }

  function norm(x){return String(x||'').replace(/\s+/g,'');}

  function clickByLabel(label){
    if(label==='되돌리기'){
      try{
        if(typeof window.ktUnifiedQuickFlip==='function'){window.ktUnifiedQuickFlip();return;}
      }catch(e){}
    }
    if(label==='보물상자'){
      try{
        if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
        if(typeof window.openTreasure==='function'){window.openTreasure();return;}
        if(typeof window.openTreasureBox==='function'){window.openTreasureBox();return;}
      }catch(e){}
    }
    if(label==='매치'){
      try{
        if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
        if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
        if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}
      }catch(e){}
    }
  }

  function button(icon,label){
    var b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      clickByLabel(label);
    });
    return b;
  }

  function style(){
    if(document.getElementById('ktG9HostUTMRestoreStyle20261005'))return;
    var s=document.createElement('style');
    s.id='ktG9HostUTMRestoreStyle20261005';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-utm-20261005{'
        +'box-sizing:border-box!important;flex:0 0 30px!important;min-height:30px!important;height:30px!important;'
        +'width:100%!important;margin:0!important;padding:0!important;display:grid!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;'
        +'background:#000!important;position:relative!important;z-index:28!important;pointer-events:auto!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-utm-20261005 button{'
        +'height:30px!important;min-width:0!important;border:0!important;border-radius:9px!important;'
        +'background:#111114!important;color:#fff!important;padding:0 3px!important;'
        +'display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;'
        +'font:950 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;touch-action:manipulation!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-utm-20261005 button b{font-size:13px!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-utm-20261005 button span{font-size:10px!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function cleanPackage(room){
    try{
      room.querySelectorAll('button').forEach(function(b){
        if(norm(b.textContent||b.getAttribute('aria-label')||'').indexOf('패키지상자')>-1){
          var row=b.closest('.kt-live-top-quickbar,.kt-room-second-stats-row-20260927');
          if(row)row.remove(); else b.remove();
        }
      });
    }catch(e){}
  }

  function ensure(){
    style();
    var room=hostRoom();
    if(!room)return;
    cleanPackage(room);

    var row=room.querySelector(':scope > .kt-g9-host-utm-20261005');
    if(!row){
      row=document.createElement('div');
      row.className='kt-g9-host-utm-20261005';
      row.appendChild(button('↻','되돌리기'));
      row.appendChild(button('🎁','보물상자'));
      row.appendChild(button('⚔','매치'));
    }

    var stats=room.querySelector(':scope > .ktg13-stats')||room.querySelector('.ktg13-stats');
    if(stats&&stats.parentNode===room){
      if(row.parentNode!==room||row.previousElementSibling!==stats){
        stats.insertAdjacentElement('afterend',row);
      }
    }else if(row.parentNode!==room){
      var main=room.querySelector(':scope > .ktg13-main');
      if(main)room.insertBefore(row,main); else room.appendChild(row);
    }
  }

  ensure();
  [40,120,300,700,1400].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostUTMTimer20261005);
      window.__ktG9HostUTMTimer20261005=setTimeout(ensure,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();