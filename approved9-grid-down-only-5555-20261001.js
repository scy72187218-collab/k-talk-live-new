/* K-Talk HOST 9-room GRID POSITION ONLY — 2026-10-01 — PIN 5555
   User scope: center HOST 9-grid only.
   Keep exact current size; move grid slightly downward only.
   Do not touch guest screens, chat, bottom labels, send airplane, earnings, video, signaling, approval, buttons, or side screens.
*/
(function(){
  if(window.__ktHost9GridDownOnly5555_20261001)return;
  window.__ktHost9GridDownOnly5555_20261001=true;

  function ensure(){
    if(document.getElementById('ktHost9GridDownOnly5555Style'))return;
    var s=document.createElement('style');
    s.id='ktHost9GridDownOnly5555Style';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-main{'
        +'position:relative!important;'
        +'top:8px!important;'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensure();
})();