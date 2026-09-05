/* K-Talk LIVE: fast presence heartbeat/cleanup so LIVE appears and disappears quickly. */
(function(){
  if(window.__ktFastPresenceLoaded)return;
  window.__ktFastPresenceLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var TTL=12000;
  var HEARTBEAT=4000;
  var POLL=1500;
  var wasHosting=false;
  var lastTouch=0;
  var pollBusy=false;
  var lastFreshSig='';
  var viewerHost='';
  var viewerMissing=0;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function who(){
    var id='guest',name='K-Talk';
    try{
      id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;
      name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||name;
    }catch(e){}
    try{
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
    }catch(e){}
    return {id:String(id).slice(0,80),name:String(name).slice(0,80)};
  }
  function hosting(){
    var root=document.getElementById('ktSept2Live');
    var video=document.getElementById('ktLiveVideo');
    if(!root||!video)return false;
    try{
      var tr=window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks()[0];
      if(tr&&tr.readyState==='ended')return false;
    }catch(e){}
    return true;
  }
  function fastTouch(){
    if(!hosting())return;
    var now=Date.now();if(now-lastTouch<2500)return;lastTouch=now;
    var me=who();
    fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{
      method:'PATCH',
      headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
      body:JSON.stringify({active:true,updated_at:new Date().toISOString()}),
      cache:'no-store'
    }).catch(function(){});
  }
  function fastEnd(){
    var me=who();
    try{
      fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{
        method:'PATCH',
        headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({active:false,updated_at:new Date().toISOString()}),
        keepalive:true,
        cache:'no-store'
      }).catch(function(){});
      fetch(SB+'/rest/v1/ktalk_webrtc_sessions?host_id=eq.'+encodeURIComponent(me.id)+'&active=eq.true',{
        method:'PATCH',
        headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({active:false,updated_at:new Date().toISOString()}),
        keepalive:true,
        cache:'no-store'
      }).catch(function(){});
    }catch(e){}
  }
  async function freshLives(){
    try{
      var since=new Date(Date.now()-TTL).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=host_id,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=30';
      var r=await fetch(u,{headers:headers(),cache:'no-store'});
      if(!r.ok)return[];
      var rows=await r.json();return Array.isArray(rows)?rows:[];
    }catch(e){return[];}
  }
  function wrapJoin(){
    var old=window.ktJoinLive;
    if(typeof old!=='function'||old.__ktFastPresenceWrapped)return;
    var wrapped=function(hostId){viewerHost=String(hostId||'guest');viewerMissing=0;return old.apply(this,arguments);};
    wrapped.__ktFastPresenceWrapped=true;wrapped.__ktOriginal=old;window.ktJoinLive=wrapped;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktFastPresenceLeaveWrapped)return;
    var wrapped=function(){viewerHost='';viewerMissing=0;return old.apply(this,arguments);};
    wrapped.__ktFastPresenceLeaveWrapped=true;wrapped.__ktOriginal=old;window.ktLeaveRemoteLive=wrapped;
  }
  function cleanOutside(rows){
    var active={};
    rows.forEach(function(x){active[String(x.host_id||'guest')]=1;});

    [].slice.call(document.querySelectorAll('.kt-live-feed-card')).forEach(function(card){
      var h=String(card.getAttribute('data-live-host')||'guest');
      if(!active[h]){try{card.remove();}catch(e){}}
    });
    if(!rows.length){
      var a=document.getElementById('ktOutsideLiveNow');if(a)a.remove();
      var b=document.getElementById('ktOutsideLiveFloat');if(b)b.remove();
    }

    var sig=rows.map(function(x){return String(x.host_id||'guest');}).sort().join('|');
    if(sig&&sig!==lastFreshSig&&!hosting()&&!document.getElementById('ktRemoteLive')){
      var hasFresh=[].slice.call(document.querySelectorAll('.kt-live-feed-card')).some(function(card){return !!active[String(card.getAttribute('data-live-host')||'guest')];});
      if(!hasFresh&&typeof window.ktRefreshUnifiedFeed==='function'){
        try{window.ktRefreshUnifiedFeed();}catch(e){}
      }
    }
    lastFreshSig=sig;

    if(document.getElementById('ktRemoteLive')&&viewerHost){
      if(active[viewerHost])viewerMissing=0;
      else viewerMissing++;
      if(viewerMissing>=2){
        var st=document.getElementById('ktRemoteLiveStatus');
        if(st){st.style.display='block';st.textContent='방송이 종료되었습니다.';st.style.color='#ff9aae';}
        viewerMissing=0;
        setTimeout(function(){try{if(window.ktLeaveRemoteLive)window.ktLeaveRemoteLive();}catch(e){}},700);
      }
    }
  }
  async function poll(){
    if(pollBusy)return;pollBusy=true;
    try{wrapJoin();wrapLeave();var rows=await freshLives();cleanOutside(rows);}catch(e){}
    pollBusy=false;
  }
  function syncHost(){
    var nowHosting=hosting();
    if(nowHosting){
      if(!wasHosting){
        wasHosting=true;
        try{if(typeof window.ktSetLivePresence==='function')window.ktSetLivePresence(true);}catch(e){}
      }
      fastTouch();
    }else if(wasHosting){
      wasHosting=false;fastEnd();
    }
  }

  setTimeout(function(){syncHost();poll();},180);
  setInterval(syncHost,1000);
  setInterval(fastTouch,HEARTBEAT);
  setInterval(poll,POLL);
  try{new MutationObserver(function(){setTimeout(syncHost,40);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('pagehide',function(){if(wasHosting||hosting())fastEnd();});
  window.addEventListener('beforeunload',function(){if(wasHosting||hosting())fastEnd();});
})();