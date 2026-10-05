/* K-Talk obsolete lower quick-row permanent lock - 1150617
   Hide only old lower rows: 되돌리기 / 패키지상자 / 매치.
   Keep normal top controls and 보물상자. No MutationObserver / no interval. */
(function(){
  if(window.__ktOldLowerQuickLockV320261005)return;
  window.__ktOldLowerQuickLockV320261005=true;

  var s=document.createElement('style');
  s.id='ktOldLowerQuickLockStyleV320261005';
  s.textContent=''
    +'#screen .kt-room-second-stats-row-20260927{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important}'
    +'#screen .kt-g9-host-utm-20261005{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important}'
    +'#screen [data-kt-locked-duplicate-package-row="1150617"]{display:none!important}';
  (document.head||document.documentElement).appendChild(s);

  function norm(x){return String(x||'').replace(/\s+/g,'').trim();}
  function clean(){
    try{
      document.querySelectorAll(
        '#screen .kt-room-second-stats-row-20260927,'+
        '#screen .kt-g9-host-utm-20261005,'+
        '#screen [data-kt-locked-duplicate-package-row="1150617"]'
      ).forEach(function(x){try{x.remove();}catch(e){}});

      /* Fallback for one old package row whose class varied by build.
         Remove only a row that contains all 3 labels and does NOT contain 보물상자. */
      var buttons=[].slice.call(document.querySelectorAll('#screen button'));
      buttons.forEach(function(btn){
        var t=norm(btn.textContent||btn.getAttribute('aria-label')||'');
        if(t.indexOf('패키지상자')<0)return;
        var el=btn;
        for(var i=0;i<6&&el&&el.id!=='screen';i++,el=el.parentElement){
          var labs=[].slice.call(el.querySelectorAll('button')).map(function(b){
            return norm(b.textContent||b.getAttribute('aria-label')||'');
          });
          var hasUndo=labs.some(function(x){return x.indexOf('되돌리기')>-1;});
          var hasPackage=labs.some(function(x){return x.indexOf('패키지상자')>-1;});
          var hasMatch=labs.some(function(x){return x.indexOf('매치')>-1;});
          var hasTreasure=labs.some(function(x){return x.indexOf('보물상자')>-1;});
          if(hasUndo&&hasPackage&&hasMatch&&!hasTreasure){
            try{el.remove();}catch(e){}
            break;
          }
        }
      });
    }catch(e){}
  }

  clean();
  [80,250,700,1500,3000].forEach(function(ms){setTimeout(clean,ms);});
})();