/* K-Talk 9-room grid unification — 2026-10-01
   Match host and approved-guest 9-person room grid size only.
   Preserve earnings, top buttons, bottom controls, video signaling, gifts, and chat behavior. */
(function(){
  if(window.__ktNineGridUnified20261001)return;
  window.__ktNineGridUnified20261001=true;

  function style(){
    if(document.getElementById('ktNineGridUnifiedStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktNineGridUnifiedStyle20261001';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{'
      +'position:relative!important;display:grid!important;'
      +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
      +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
      +'gap:2px!important;'
      +'flex:0 0 auto!important;'
      +'width:100%!important;'
      +'height:calc(100vw - 14px)!important;'
      +'max-height:calc(100dvh - 410px)!important;'
      +'min-height:0!important;'
      +'overflow:hidden!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host,'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest,'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-cell{'
      +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;'
      +'border-radius:7px!important;overflow:hidden!important;'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }
  style();
})();