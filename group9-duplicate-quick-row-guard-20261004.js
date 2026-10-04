/* 9명 호스트방 중복 상단 버튼줄 제거 — 2026-10-04
   유지: 되돌리기 / 보물상자 / 매치
   제거: 뒤늦게 다시 생기는 되돌리기 / 패키지 상자 / 매치
   다른 방/배치/버튼은 변경하지 않는다. */
(function(){
  if(window.__ktG9DuplicateQuickRowGuard20261004)return;
  window.__ktG9DuplicateQuickRowGuard20261004=true;

  function norm(el){return String(el&&el.textContent||'').replace(/\s+/g,'');}
  function isHost9(room){
    if(!room)return false;
    if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
    return String(room.getAttribute('data-kt-room')||'')==='9';
  }

  function exactDuplicateRowFromPackageButton(btn,room){
    var el=btn;
    for(var i=0;i<7&&el&&el!==room;i++,el=el.parentElement){
      var t=norm(el);
      if(t.indexOf('보물상자')>-1)return null;
      if(t.indexOf('되돌리기')>-1&&t.indexOf('패키지상자')>-1&&t.indexOf('매치')>-1){
        var buttons=[].slice.call(el.querySelectorAll('button'));
        var labels=buttons.map(norm);
        var hasUndo=labels.some(function(x){return x.indexOf('되돌리기')>-1;});
        var hasPackage=labels.some(function(x){return x.indexOf('패키지상자')>-1;});
        var hasMatch=labels.some(function(x){return x.indexOf('매치')>-1;});
        if(hasUndo&&hasPackage&&hasMatch&&buttons.length<=8)return el;
      }
    }
    return null;
  }

  function clean(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!isHost9(room))return;

    var packageButtons=[].slice.call(room.querySelectorAll('button')).filter(function(b){
      return norm(b).indexOf('패키지상자')>-1;
    });

    packageButtons.forEach(function(btn){
      var row=exactDuplicateRowFromPackageButton(btn,room);
      if(row){
        try{row.remove();}catch(e){}
      }
    });
  }

  clean();
  [0,16,40,80,160,320,700,1200,2200,4000].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,500);

  try{
    new MutationObserver(function(){
      clean();
      clearTimeout(window.__ktG9DuplicateQuickRowGuardTimer);
      window.__ktG9DuplicateQuickRowGuardTimer=setTimeout(clean,8);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();
