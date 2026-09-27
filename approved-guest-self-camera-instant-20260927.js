/* K-Talk approved guest self-camera instant attach (2026-09-27)
   Scope: approved viewer's own "나 · 게스트" tile only.
   No room layout/button/chat/gift/countdown changes. */
(function(){
  if(window.__ktApprovedGuestSelfCameraInstant20260927)return;
  window.__ktApprovedGuestSelfCameraInstant20260927=true;

  var opening=null;

  function live(s){
    try{
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){
        return t&&t.readyState==='live';
      }));
    }catch(e){return false;}
  }
  function same(a,b){
    if(!a||!b)return false;
    if(a===b)return true;
    try{
      var at=a.getVideoTracks&&a.getVideoTracks()[0];
      var bt=b.getVideoTracks&&b.getVideoTracks()[0];
      return !!(at&&bt&&at.id&&bt.id&&at.id===bt.id);
    }catch(e){return false;}
  }
  function remoteHost(){
    var a=null,b=null,c=null;
    try{a=window.__ktRemoteHostStream||null;}catch(e){}
    try{b=window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{c=window.__ktEntryHostStream20260925||null;}catch(e){}
    var list=[a,b,c];
    for(var i=0;i<list.length;i++)if(live(list[i]))return list[i];
    return null;
  }
  function viewerContext(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return true;
      var h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'');
      return !!h;
    }catch(e){return false;}
  }
  function knownLocal(){
    var list=[];
    try{list.push(window.__ktLocalGuestCameraStream20260926||null);}catch(e){}
    try{list.push(window.__ktApprovedGuestSelfStream||null);}catch(e){}
    try{
      var cam=document.getElementById('camera');
      list.push(cam&&cam.srcObject||null);
    }catch(e){}
    try{
      var camBg=document.getElementById('cameraBg');
      list.push(camBg&&camBg.srcObject||null);
    }catch(e){}
    var rh=remoteHost();
    for(var i=0;i<list.length;i++){
      if(live(list[i])&&(!rh||!same(list[i],rh)))return list[i];
    }
    return null;
  }
  function attach(stream){
    if(!live(stream))return false;
    var rh=remoteHost();
    if(rh&&same(stream,rh))return false;
    try{
      window.__ktLocalGuestCameraStream20260926=stream;
      window.__ktApprovedGuestSelfStream=stream;
      var t=stream.getVideoTracks&&stream.getVideoTracks()[0];
      if(t&&t.id)window.__ktLocalGuestCameraTrackId20260926=String(t.id);
    }catch(e){}

    try{
      var v=document.querySelector('.kt-guest-hostlike-room .kgh-cell.self video');
      if(!v)return false;
      v.autoplay=true;
      v.playsInline=true;
      v.muted=true;
      v.defaultMuted=true;
      v.setAttribute('autoplay','');
      v.setAttribute('playsinline','');
      v.setAttribute('muted','');
      if(v.srcObject!==stream)v.srcObject=stream;
      v.dataset.ktLocalGuestView='1';
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      return true;
    }catch(e){return false;}
  }
  function acquire(){
    if(!viewerContext())return Promise.resolve(null);
    var s=knownLocal();
    if(s){attach(s);return Promise.resolve(s);}
    if(opening)return opening;
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return Promise.resolve(null);

    opening=navigator.mediaDevices.getUserMedia({
      video:{facingMode:'user'},
      audio:false
    }).then(function(stream){
      attach(stream);
      try{
        window.dispatchEvent(new CustomEvent('kt-approved-guest-stream-ready',{
          detail:{
            host_id:String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||''),
            stream:stream,
            at:Date.now(),
            instant_self:true
          }
        }));
      }catch(e){}
      return stream;
    }).catch(function(){return null;}).finally(function(){opening=null;});
    return opening;
  }
  function kick(){
    if(!viewerContext())return;
    var s=knownLocal();
    if(s)attach(s);
    else acquire();
    [20,60,120,220,400,700,1100,1800].forEach(function(ms){
      setTimeout(function(){
        var x=knownLocal();
        if(x)attach(x);
        else acquire();
      },ms);
    });
  }

  ['kt-guest-approval-received','kt-any-guest-approved']
    .forEach(function(n){window.addEventListener(n,kick);});

  try{
    var root=document.getElementById('screen')||document.documentElement;
    new MutationObserver(function(){
      var v=document.querySelector('.kt-guest-hostlike-room .kgh-cell.self video');
      if(!v)return;
      var s=v.srcObject;
      if(!live(s))kick();
    }).observe(root,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){
    try{
      var v=document.querySelector('.kt-guest-hostlike-room .kgh-cell.self video');
      if(v&&!live(v.srcObject))kick();
    }catch(e){}
  },700);
})();