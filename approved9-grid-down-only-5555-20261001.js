/* K-Talk approved guest 9-room GRID POSITION ONLY — 2026-10-01 — PIN 5555
   User scope: center/second approved guest 9-grid only.
   Keep exact current size; move grid slightly downward only.
   Do not touch chat, bottom labels, send airplane, earnings, video, signaling, approval, buttons, or side screens.
*/
(function(){
  if(window.__ktApproved9GridDownOnly5555_20261001)return;
  window.__ktApproved9GridDownOnly5555_20261001=true;

  function ensure(){
    if(document.getElementById('ktApproved9GridDownOnly5555Style'))return;
    var s=document.createElement('style');
    s.id='ktApproved9GridDownOnly5555Style';
    s.textContent=''
      +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main{'
        +'position:relative!important;'
        +'top:8px!important;'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensure();
})();