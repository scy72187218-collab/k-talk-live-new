/* K-Talk 9-room host bottom tools lower — 2026-10-01 — 5555
   ONLY move the 8 host tool buttons lower in the 9-person host room.
   Do not change grid, earnings, gifts, chat, video, signaling, approval, or other rooms. */
(function(){
  if(window.__ktGroup9HostToolsBottom5555_20261001)return;
  window.__ktGroup9HostToolsBottom5555_20261001=true;

  function ensure(){
    if(document.getElementById('ktGroup9HostToolsBottom5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGroup9HostToolsBottom5555Style';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools{'
        +'margin-top:auto!important;'
        +'margin-bottom:0!important;'
        +'transform:none!important;'
        +'align-self:stretch!important;'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensure();
})();