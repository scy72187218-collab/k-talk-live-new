/* K-Talk approved guest 9-room HOST VIDEO ONLY — 2026-10-01 — PIN 5555
   Scope: center approved-guest 9-room host video only.
   Match side-screen host video appearance.
   Do not change grid size, guest cells, chat, earnings, buttons, signaling, approval, camera/mic, or other rooms.
*/
(function(){
  if(window.__ktApproved9HostVideoOnly5555_20261001)return;
  window.__ktApproved9HostVideoOnly5555_20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktApproved9HostVideoOnly5555Style'))return;
    var s=document.createElement('style');
    s.id='ktApproved9HostVideoOnly5555Style';
    s.textContent=''
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-cell.host video{'
        +'position:absolute!important;'
        +'inset:0!important;'
        +'width:100%!important;'
        +'height:100%!important;'
        +'max-width:none!important;'
        +'max-height:none!important;'
        +'margin:0!important;'
        +'padding:0!important;'
        +'border:0!important;'
        +'object-fit:cover!important;'
        +'object-position:center center!important;'
        +'transform:none!important;'
        +'-webkit-transform:none!important;'
        +'background:#111!important;'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensureStyle();
})();