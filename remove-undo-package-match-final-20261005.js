/* Final obsolete lower quick-row cleanup - 1150617
   Remove only old 되돌리기 / 패키지상자 / 매치 rows.
   Keep 보물상자 and all other controls. Lightweight: no interval, no global observer. */
(function(){
  function norm(x){return String(x||'').replace(/\s+/g,'').trim();}
  function clean(){
    try{
      document.querySelectorAll(
        '#screen .kt-room-second-stats-row-20260927,'+
        '#screen .kt-g9-host-utm-20261005,'+
        '#screen [data-kt-locked-duplicate-package-row="1150617"]'
      ).forEach(function(x){try{x.remove();}catch(e){}});

      document.querySelectorAll('#screen button').forEach(function(btn){
        var t=norm(btn.textContent||btn.getAttribute('aria-label')||'');
        if(t.indexOf('패키지상자')<0)return;
        var el=btn;
        for(var i=0;i<6&&el&&el.id!=='screen';i++,el=el.parentElement){
          var labs=[].slice.call(el.querySelectorAll('button')).map(function(b){
            return norm(b.textContent||b.getAttribute('aria-label')||'');
          });
          var undo=labs.some(function(x){return x.indexOf('되돌리기')>-1;});
          var pack=labs.some(function(x){return x.indexOf('패키지상자')>-1;});
          var match=labs.some(function(x){return x.indexOf('매치')>-1;});
          var treasure=labs.some(function(x){return x.indexOf('보물상자')>-1;});
          if(undo&&pack&&match&&!treasure){
            try{el.remove();}catch(e){}
            break;
          }
        }
      });
    }catch(e){}
  }
  clean();
  [100,400,1200,2500].forEach(function(ms){setTimeout(clean,ms);});
})();