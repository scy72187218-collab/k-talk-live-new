/* 9-room HOST only: make the visible person/video appear smaller inside each cell.
   Visual only. Keep grid, buttons, chat, earnings and actions unchanged. */
(function(){
  if(window.__ktG9HostVideoPersonSmaller20261002)return;
  window.__ktG9HostVideoPersonSmaller20261002=true;

  var s=document.createElement('style');
  s.id='ktG9HostVideoPersonSmallerStyle20261002';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video,'
    +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest>video{'
      +'object-fit:contain!important;'
      +'object-position:center center!important;'
      +'background:#111!important;'
      +'transform:scale(.60)!important;'
      +'transform-origin:center center!important;'
    +'}'
    +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video{'
      +'transform:scaleX(-1) scale(.60)!important;'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();