/* K-Talk 2026-10-06: all five live rooms host first-frame handoff.
   Scope: 1인/9명/13명/구독자/비밀방 remote entry host video only.
   Reuses an already-playing LIVE-card host stream on entry so the host face
   can appear immediately while normal WebRTC signaling continues.
   Does not change room layout, chat, gifts, earnings, guest approval, or controls. */
(function(){
  if(window.__ktAllFiveRoomHostFirstFrame20261006)return;
  window.__ktAllFiveRoomHostFirstFrame20261006=true;

  function hostIdFromCard(card){
    try{return String(card&&card.getAttribute&&card.getAttribute('data-host')||'').trim();}catch(e){return '';}
  }

  function liveStreamIn(card){
    if(!card)return null;
    try{
      var vids=[].slice.call(card.querySelectorAll('video'));
      for(var i=0;i<vids.length;i++){
        var st=vids[i]&&vids[i].srcObject||null;
        var vt=st&&st.getVideoTracks&&st.getVideoTracks()[0]||null;
        if(vt&&vt.readyState==='live')return st;
      }
    }catch(e){}
    return null;
  }

  function handoff(hostId,stream){
    try{
      hostId=String(hostId||'').trim();if(!hostId)return false;
      if(stream){
        window.__ktEntryHostStream20260925=stream;
        window.__ktRemoteHostStream=stream;
        window.__ktLastApprovedGuestHostStream=stream;
      }
      if(typeof window.ktStartRemoteHostVideoNow20261003==='function'){
        return window.ktStartRemoteHostVideoNow20261003(hostId,stream||null)!==false;
      }
      try{
        window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{
          detail:{host_id:hostId,entry_stream:stream||null,all_five_rooms:true,at:Date.now()}
        }));
      }catch(e){}
      return true;
    }catch(e){return false;}
  }

  function fromTarget(target){
    try{
      var card=target&&target.closest?target.closest('[data-host]'):null;
      if(!card)return false;
      var hid=hostIdFromCard(card);if(!hid)return false;
      var st=liveStreamIn(card);
      handoff(hid,st);
      [20,60,120,220].forEach(function(ms){
        setTimeout(function(){handoff(hid,st||liveStreamIn(card));},ms);
      });
      return true;
    }catch(e){return false;}
  }

  document.addEventListener('pointerdown',function(e){fromTarget(e&&e.target);},true);
  document.addEventListener('touchstart',function(e){fromTarget(e&&e.target);},{capture:true,passive:true});

  function install(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function')return false;
    if(old.__ktAllFiveHostFirstFrame20261006)return true;
    var wrapped=function(hostId){
      hostId=String(hostId||'').trim();
      var card=null,st=null;
      try{
        var nodes=document.querySelectorAll('[data-host]');
        for(var i=0;i<nodes.length;i++){
          if(String(nodes[i].getAttribute('data-host')||'')===hostId){card=nodes[i];break;}
        }
        st=liveStreamIn(card);
      }catch(e){}
      handoff(hostId,st);
      var out=old.apply(this,arguments);
      [0,25,70,140,260].forEach(function(ms){
        setTimeout(function(){handoff(hostId,st||liveStreamIn(card));},ms);
      });
      return out;
    };
    wrapped.__ktAllFiveHostFirstFrame20261006=true;
    wrapped.__ktAllFiveHostFirstFrameOriginal20261006=old;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  var n=0,t=setInterval(function(){
    n++;
    if(install()&&n>5)clearInterval(t);
    if(n>120)clearInterval(t);
  },50);
  window.addEventListener('pageshow',function(){setTimeout(install,0);});
})();