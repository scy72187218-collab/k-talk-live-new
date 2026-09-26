/* K-Talk guest-room source lock (2026-09-26)
   Guest room only: keep HOST cell on remote host stream and SELF cell on this
   phone's own camera. Prevents late reconnect/render code from making both
   tiles show the same person. Does not change layout/buttons/chat/gifts. */
(function(){
  if(window.__ktGuestRoomSourceLock20260926)return;
  window.__ktGuestRoomSourceLock20260926=true;

  function live(s){
    try{return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}
    catch(e){return false;}
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
  function play(v){
    try{
      if(!v)return;
      v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
      v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('muted','');
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }
  function localGuest(){
    var a=null,b=null;
    try{a=window.__ktLocalGuestCameraStream20260926||null;}catch(e){}
    try{b=window.__ktApprovedGuestSelfStream||null;}catch(e){}
    if(live(a))return a;
    if(live(b))return b;
    return null;
  }
  function remoteHost(local){
    var a=null,b=null,c=null;
    try{a=window.__ktRemoteHostStream||null;}catch(e){}
    try{b=window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{c=window.__ktEntryHostStream20260925||null;}catch(e){}
    var list=[a,b,c];
    for(var i=0;i<list.length;i++){
      if(live(list[i])&&(!local||!same(list[i],local)))return list[i];
    }
    return null;
  }
  function fix(){
    try{
      var root=document.querySelector('.kt-guest-hostlike-room');
      if(!root)return;
      var selfV=root.querySelector('.kgh-cell.self video');
      var hostV=root.querySelector('.kgh-cell.host video');
      if(!selfV&&!hostV)return;

      var ls=localGuest();
      var hs=remoteHost(ls);

      /* Self must always remain this phone's local camera. */
      if(selfV&&ls){
        if(selfV.srcObject!==ls)selfV.srcObject=ls;
        selfV.dataset.ktLocalGuestView='1';
        play(selfV);
      }

      /* Host must never be allowed to become the local guest stream. */
      if(hostV&&hs&&!same(hs,ls)){
        if(hostV.srcObject!==hs)hostV.srcObject=hs;
        play(hostV);
      }

      /* If any late path copied host into self, correct immediately. */
      if(selfV&&hs&&selfV.srcObject&&same(selfV.srcObject,hs)&&ls&&!same(ls,hs)){
        selfV.srcObject=ls;play(selfV);
      }
      /* If any late path copied self into host, correct immediately. */
      if(hostV&&ls&&hostV.srcObject&&same(hostV.srcObject,ls)&&hs&&!same(hs,ls)){
        hostV.srcObject=hs;play(hostV);
      }
    }catch(e){}
  }

  window.ktFixGuestRoomVideoSources20260926=fix;
  [0,25,60,120,250,500,900].forEach(function(ms){setTimeout(fix,ms);});
  setInterval(fix,120);

  try{
    var screen=document.getElementById('screen')||document.documentElement;
    new MutationObserver(function(){setTimeout(fix,0);setTimeout(fix,40);})
      .observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class','src']});
  }catch(e){}

  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-three-person-sync-now','kt-any-guest-approved']
    .forEach(function(n){window.addEventListener(n,function(){fix();setTimeout(fix,30);setTimeout(fix,100);});});
})();
