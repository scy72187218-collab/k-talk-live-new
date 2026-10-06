/* K-Talk 2026-10-06: instant first-frame handoff for all five remote rooms.
   Scope only: when entering 1/9/13/subscriber/secret room, reuse an already
   playing host MediaStream as the first visible frame. Existing direct WebRTC
   continues normally in the background and can replace this stream later. */
(function(){
  if(window.__ktInstantFirstFrameFiveRooms20261006)return;
  window.__ktInstantFirstFrameFiveRooms20261006=true;

  function liveStream(s){
    try{
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){
        return t&&t.readyState==='live';
      }));
    }catch(e){return false;}
  }

  function visibleVideoStream(){
    try{
      var vids=[].slice.call(document.querySelectorAll('video'));
      var best=null,bestArea=0;
      for(var i=0;i<vids.length;i++){
        var v=vids[i];
        if(!v||v.id==='camera'||v.id==='ktLiveVideo')continue;
        if(v.closest&&v.closest('#screen .kt-remote-live'))continue;
        var s=v.srcObject||null;
        if(!liveStream(s))continue;
        var r=v.getBoundingClientRect();
        if(r.width<8||r.height<8)continue;
        var cs=getComputedStyle(v);
        if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)continue;
        var area=r.width*r.height;
        if(area>bestArea){bestArea=area;best=s;}
      }
      return best;
    }catch(e){return null;}
  }

  function paint(stream){
    if(!liveStream(stream))return false;
    var targets=[];
    function add(v){if(v&&targets.indexOf(v)<0)targets.push(v);}
    add(document.getElementById('ktRemoteLiveVideo'));
    add(document.getElementById('ktRemoteHostPreview'));
    try{
      document.querySelectorAll(
        '#screen .ktsolo-room video,'+
        '#screen .ktg9-room .host video,'+
        '#screen .ktg13-room .ktg13-host video,'+
        '#screen .ktsubscriber-room .ktsubscriber-host video,'+
        '#screen .ktsecret-room .ktsecret-host video,'+
        '#screen .kt-guest-hostlike-room .kgh-cell.host video,'+
        '#screen .kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '#screen .kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '#screen .kt-guest-room-grid .kt-guest-room-cell.host video'
      ).forEach(add);
    }catch(e){}

    targets.forEach(function(v){
      try{
        if(v.srcObject!==stream)v.srcObject=stream;
        v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
        v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('muted','');
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }catch(e){}
    });

    try{
      window.__ktEntryHostStream20260925=stream;
      window.__ktRemoteHostStream=stream;
      window.__ktLastApprovedGuestHostStream=stream;
    }catch(e){}
    return targets.length>0;
  }

  function install(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function')return false;
    if(old.__ktInstantFirstFrameFiveRooms20261006)return true;

    var wrapped=function(hostId){
      var stream=visibleVideoStream()||window.__ktEntryHostStream20260925||null;
      if(liveStream(stream)){
        try{
          window.__ktEntryHostStream20260925=stream;
          window.__ktRemoteHostStream=stream;
          window.__ktLastApprovedGuestHostStream=stream;
        }catch(e){}
        try{
          if(typeof window.ktStartRemoteHostVideoNow20261003==='function'){
            window.ktStartRemoteHostVideoNow20261003(hostId,stream);
          }
        }catch(e){}
      }

      var out=old.apply(this,arguments);

      if(liveStream(stream)){
        [0,8,20,45,80,140,240].forEach(function(ms){
          setTimeout(function(){paint(stream);},ms);
        });
      }
      return out;
    };
    wrapped.__ktInstantFirstFrameFiveRooms20261006=true;
    wrapped.__ktInstantFirstFrameFiveRoomsOriginal20261006=old;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  var n=0,t=setInterval(function(){
    n++;
    if(install()&&n>8)clearInterval(t);
    if(n>200)clearInterval(t);
  },25);

  try{
    new MutationObserver(function(){
      var s=window.__ktEntryHostStream20260925||null;
      if(liveStream(s))paint(s);
      install();
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();