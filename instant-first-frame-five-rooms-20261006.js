/* Selected-host first-frame handoff only; never reuse another member's stream. */
(function(){
  if(window.__ktInstantFirstFrameFiveRooms20261006)return;
  window.__ktInstantFirstFrameFiveRooms20261006=true;
  var handoff=null,generation=0;
  function liveStream(s){try{return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}catch(e){return false;}}
  function rootFor(id){
    var root=document.querySelector('#screen .kt-remote-live');
    return root&&root.getAttribute('data-kt-host-id')===String(id)?root:null;
  }
  function current(id){return String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'')===String(id);}
  function visibleVideoStream(id){
    var root=rootFor(id);if(!root||!current(id))return null;
    var list=root.querySelectorAll('#ktRemoteLiveVideo,#ktRemoteHostPreview,.ktg13-host video,.ktg9-host video,.ktsubscriber-host video,.ktsecret-slot.host video,.kgh-cell.host video,.kt-approved-guest-cell.host video');
    for(var i=0;i<list.length;i++){
      var v=list[i],r=v.getBoundingClientRect();
      if(r.width>0&&r.height>0&&v.readyState>=2&&liveStream(v.srcObject))return v.srcObject;
    }
    return null;
  }
  function paint(h){
    if(!h||handoff!==h||h.generation!==generation||Date.now()>h.until||!current(h.id)||h.nav!==Number(window.__ktPageNavigationEpoch20261013||0))return false;
    var root=rootFor(h.id);if(!root||!liveStream(h.stream))return false;
    var targets=root.querySelectorAll('#ktRemoteLiveVideo,#ktRemoteHostPreview,.ktg13-host video,.ktg9-host video,.ktsubscriber-host video,.ktsecret-slot.host video,.kgh-cell.host video,.kt-approved-guest-cell.host video');
    targets.forEach(function(v){
      if(v.srcObject&&v.srcObject!==h.stream&&liveStream(v.srcObject))return;
      try{
        if(v.srcObject!==h.stream)v.srcObject=h.stream;
        v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }catch(e){}
    });
    return targets.length>0;
  }
  function hideBlackSoloEntry(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing')||document.querySelector('#screen .kt-remote-live'))return;
      var st=window.state||{};
      var txt=[st.liveRoomType,st.liveRoomName,st.prepRoomType,st.prepRoomName].join(' ');
      if(!/solo|1\s*인/.test(String(txt)))return;
      var screen=document.getElementById('screen');
      if(screen){
        screen.style.setProperty('background','transparent','important');
        screen.querySelectorAll('[id*="Countdown"],[class*="countdown"],.kt-live-countdown,.kt-countdown-overlay').forEach(function(el){
          el.style.setProperty('display','none','important');
        });
      }
      var v=document.getElementById('ktLiveVideo')||document.querySelector('#screen .ktsolo-room video');
      var s=(window.state&&state.stream)||null;
      if(v&&liveStream(s)){
        if(v.srcObject!==s)v.srcObject=s;
        v.autoplay=true;v.playsInline=true;v.muted=true;
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function install(){
    var old=window.ktEnterRemoteLive;if(typeof old!=='function')return false;
    if(old.__ktInstantFirstFrameFiveRooms20261006)return true;
    var wrapped=function(hostId){
      hostId=String(hostId||'');
      var stream=visibleVideoStream(hostId),token=++generation;
      handoff=null;
      var out=old.apply(this,arguments);
      if(liveStream(stream)){
        var h={id:hostId,stream:stream,generation:token,nav:Number(window.__ktPageNavigationEpoch20261013||0),until:Date.now()+1500};
        handoff=h;
        Promise.resolve(out).then(function(ok){
          if(ok===false||handoff!==h)return;
          [0,20,80,180].forEach(function(ms){setTimeout(function(){paint(h);},ms);});
        }).catch(function(){});
      }
      return out;
    };
    Object.keys(old).forEach(function(k){try{wrapped[k]=old[k];}catch(e){}});
    wrapped.__ktInstantFirstFrameFiveRooms20261006=true;
    wrapped.__ktInstantFirstFrameFiveRoomsOriginal20261006=old;
    window.ktEnterRemoteLive=wrapped;return true;
  }
  var n=0,t=setInterval(function(){n++;if((install()&&n>8)||n>200)clearInterval(t);},25);
  var screen=document.getElementById('screen');
  if(screen)new MutationObserver(function(){paint(handoff);hideBlackSoloEntry();install();}).observe(screen,{childList:true,subtree:true});
  window.addEventListener('pagehide',function(){generation++;handoff=null;});
})();