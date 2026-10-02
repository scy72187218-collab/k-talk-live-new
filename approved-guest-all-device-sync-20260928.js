/* K-Talk approved guest all-device roster sync (2026-09-28)
   Scope: approved guest visibility only. No layout/button/chat/gift changes. */
(function(){
  if(window.__ktApprovedGuestAllDeviceSync20260928)return;
  window.__ktApprovedGuestAllDeviceSync20260928=true;

  var lastSig='';
  var lastKick=0;

  function currentHost(){
    try{
      return String(
        window.__ktRemoteHostId||
        window.__ktCurrentRemoteHostId||
        sessionStorage.getItem('kt_remote_host_id')||
        ''
      ).trim();
    }catch(e){return '';}
  }

  function approvedIds(){
    var out=[];
    try{
      var map=window.__ktApprovedGuestIds20260924||{};
      Object.keys(map).forEach(function(id){if(map[id]===true)out.push(String(id));});
    }catch(e){}
    out.sort();
    return out;
  }

  function syncNow(force){
    try{
      var host=currentHost();
      if(!host)return;

      var ids=approvedIds();
      if(!ids.length)return;

      var sig=host+'|'+ids.join(',');
      var now=Date.now();
      if(!force&&sig===lastSig&&now-lastKick<700)return;
      lastSig=sig;lastKick=now;

      try{
        if(typeof window.ktForceApprovedGuestGridNow20260924==='function'){
          window.ktForceApprovedGuestGridNow20260924();
        }
      }catch(e){}

      try{
        window.dispatchEvent(new CustomEvent('kt-three-person-sync-now',{
          detail:{host_id:host,viewer_ids:ids.slice(),sync_all_devices:true,at:now}
        }));
      }catch(e){}
    }catch(e){}
  }

  window.addEventListener('kt-any-guest-approved',function(e){
    try{if(e&&e.detail&&e.detail.sync_all_devices)return;}catch(_e){}
    setTimeout(function(){syncNow(true);},0);
  });
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(function(){syncNow(true);},0);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(function(){syncNow(true);},0);});
  window.addEventListener('kt-livekit-state',function(){setTimeout(function(){syncNow(false);},0);});
  window.addEventListener('online',function(){setTimeout(function(){syncNow(true);},60);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(function(){syncNow(true);},60);});

  setInterval(function(){syncNow(false);},500);
  [40,100,220,450,900,1500,2500].forEach(function(ms){setTimeout(function(){syncNow(true);},ms);});
})();