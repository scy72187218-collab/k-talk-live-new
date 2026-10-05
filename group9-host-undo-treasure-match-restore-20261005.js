/* 9-room host old quick-row retired - 2026-10-05 - 1150617
   Permanently stop recreating 되돌리기 / 패키지상자 / 매치 rows.
   Keep every unrelated room control untouched. */
(function(){
  if(window.__ktG9OldQuickRowRetired20261005)return;
  window.__ktG9OldQuickRowRetired20261005=true;

  function norm(x){return String(x||'').replace(/\s+/g,'');}

  function clean(){
    try{
      document.querySelectorAll(
        '#screen .kt-g9-host-utm-20261005,'+
        '#screen .kt-room-second-stats-row-20260927'
      ).forEach(function(x){x.remove();});

      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      room.querySelectorAll('button').forEach(function(b){
        var t=norm(b.textContent||b.getAttribute('aria-label')||'');
        if(t.indexOf('패키지상자')>-1){
          var row=b.parentElement;
          try{b.remove();}catch(e){}
          if(row&&row.children&&row.children.length===0){try{row.remove();}catch(e){}}
        }
      });
    }catch(e){}
  }

  clean();
  [60,180,500,1200].forEach(function(ms){setTimeout(clean,ms);});
})();