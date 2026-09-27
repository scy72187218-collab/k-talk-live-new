/* K-Talk instant remote host entry (2026-09-27)
   Scope: viewer entering a live host room only.
   Opens with cached live metadata immediately and suppresses duplicate
   same-host selection bursts that restart the first video handshake.
   No room layout/button/chat/gift/switch changes. */
(function(){
  if(window.__ktInstantRemoteHostEntry20260927)return;
  window.__ktInstantRemoteHostEntry20260927=true;

  var lastSelectedHost='';
  var lastSelectedAt=0;

  /* Several entry wrappers can announce the same host within the same tap.
     Keep only the first announcement so direct RTC does not throw away an
     in-progress first-frame handshake and start over. */
  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      var h=String(e&&e.detail&&e.detail.host_id||'').trim();
      if(!h)return;
      var now=Date.now();
      if(h===lastSelectedHost&&now-lastSelectedAt<900){
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        return;
      }
      lastSelectedHost=h;
      lastSelectedAt=now;
    }catch(_e){}
  },true);

  function roomFor(hostId){
    hostId=String(hostId||'').trim();
    if(!hostId)return null;
    try{
      var old=window.__ktLastLiveRoom||null;
      if(old&&String(old.host_id||'')===hostId)return old;
    }catch(e){}
    try{
      var list=Array.isArray(window.__ktLiveRoomsSnapshot20260926)?window.__ktLiveRoomsSnapshot20260926:[];
      for(var i=0;i<list.length;i++){
        if(String(list[i]&&list[i].host_id||'')===hostId)return list[i];
      }
    }catch(e){}
    try{
      var entry=window.__ktRealtimeLiveHosts&&window.__ktRealtimeLiveHosts[hostId];
      var d=entry&&entry.data||null;
      if(d){
        return {
          host_id:hostId,
          host_name:String(d.host_name||'K-Talk'),
          title:String(d.title||d.room_name||'라이브'),
          room_type:String(d.room_type||'solo'),
          room_name:String(d.room_name||'방송'),
          active:true,
          updated_at:new Date().toISOString()
        };
      }
    }catch(e){}
    return {
      host_id:hostId,
      host_name:'K-Talk',
      title:'라이브',
      room_type:'solo',
      room_name:'방송',
      active:true,
      updated_at:new Date().toISOString()
    };
  }

  function refreshMetaLater(hostId){
    try{
      fetch('/api/live-beacon-memory?t='+Date.now(),{cache:'no-store'})
        .then(function(r){return r&&r.ok?r.json():null;})
        .then(function(j){
          if(String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'')!==hostId)return;
          var rows=Array.isArray(j&&j.rooms)?j.rooms:[];
          var room=null;
          for(var i=0;i<rows.length;i++){
            if(String(rows[i]&&rows[i].host_id||'')===hostId){room=rows[i];break;}
          }
          if(!room)return;
          window.__ktLastLiveRoom=room;
          try{
            var root=document.querySelector('.kt-remote-live');
            var b=root&&root.querySelector('.kt-remote-meta b');
            var sp=root&&root.querySelector('.kt-remote-meta span');
            if(b)b.innerHTML='<i class="kt-live-dot"></i>'+String(room.host_name||'K-Talk').replace(/[&<>"]/g,'');
            if(sp)sp.textContent=String(room.title||room.room_name||'라이브')+' · '+String(room.room_name||'방송');
          }catch(_e){}
        }).catch(function(){});
    }catch(e){}
  }

  function install(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function'||old.__ktInstantRemoteHostEntry20260927)return;
    var fn=function(hostId){
      hostId=String(hostId||'').trim();
      if(hostId){
        var room=roomFor(hostId);
        if(room)window.__ktLastLiveRoom=room;
        refreshMetaLater(hostId);
      }
      return old.apply(this,arguments);
    };
    fn.__ktInstantRemoteHostEntry20260927=true;
    /* Preserve wrapper markers so periodic installers do not add another
       needless layer around the same entry call. */
    if(old.__ktRemoteHostIdBridge)fn.__ktRemoteHostIdBridge=true;
    if(old.__ktInteractionWrapped)fn.__ktInteractionWrapped=true;
    window.ktEnterRemoteLive=fn;
  }

  install();
  setTimeout(install,80);
  setTimeout(install,350);
  setTimeout(install,900);
})();
