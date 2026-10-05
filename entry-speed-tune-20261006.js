(function(){
  if(window.__ktEntrySpeedTune20261006)return;
  window.__ktEntrySpeedTune20261006=true;

  function run(hostId,stream){
    hostId=String(hostId||'').trim();
    if(!hostId||typeof window.ktStartRemoteHostVideoNow20261003!=='function')return;
    [0,20,50,100].forEach(function(ms){
      setTimeout(function(){
        try{window.ktStartRemoteHostVideoNow20261003(hostId,stream||null);}catch(e){}
      },ms);
    });
  }

  document.addEventListener('pointerdown',function(e){
    try{
      var card=e.target&&e.target.closest?e.target.closest('[data-host]'):null;
      if(!card)return;
      var hostId=String(card.getAttribute('data-host')||'').trim();
      if(!hostId)return;
      var stream=null;
      var v=card.querySelector('video');
      try{
        var s=v&&v.srcObject||null;
        var t=s&&s.getVideoTracks&&s.getVideoTracks()[0]||null;
        if(t&&t.readyState==='live')stream=s;
      }catch(_e){}
      run(hostId,stream);
    }catch(e){}
  },true);

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      var d=e&&e.detail||{};
      run(d.host_id,d.entry_stream||null);
    }catch(e){}
  });
})();