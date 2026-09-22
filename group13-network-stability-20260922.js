/* K-Talk 13명방 영상 수신 안정화 전용.
   화면/채팅/게스트 승인/버튼/LIVE 신호는 건드리지 않는다.
   13명방 WebRTC 영상 송신량만 현재 연결 수에 맞춰 줄여
   여러 기기 동시 접속 때 끊김/출렁임을 줄인다. */
(function(){
  if(window.__ktGroup13NetworkStability20260922)return;
  window.__ktGroup13NetworkStability20260922=true;

  var Native=window.RTCPeerConnection;
  if(!Native||!Native.prototype||typeof Native.prototype.addTrack!=='function')return;

  var oldAddTrack=Native.prototype.addTrack;
  var entries=[];

  function isGroup13(){
    try{
      var st=window.state||{};
      var t=String(st.liveRoomType||st.roomType||'');
      var n=String(st.liveRoomName||st.prepRoomName||'');
      var m=Number(st.liveRoomMax||st.prepRoomMax||0);
      if(t==='group13'||(t==='group'&&m===13)||n==='13명 방송')return true;
    }catch(e){}
    try{
      return !!document.querySelector('.ktg13-room,.kt-prejoin-room-grid,.kt-approved-guest-grid');
    }catch(e){return false;}
  }

  function aliveEntries(){
    entries=entries.filter(function(x){
      try{return x&&x.pc&&x.sender&&x.pc.connectionState!=='closed';}catch(e){return false;}
    });
    return entries;
  }

  function limits(count){
    if(count<=2)return {bitrate:900000,fps:24,scale:1.25};
    if(count<=4)return {bitrate:650000,fps:20,scale:1.50};
    if(count<=7)return {bitrate:480000,fps:18,scale:1.70};
    return {bitrate:360000,fps:15,scale:1.90};
  }

  async function tuneOne(x,lim){
    try{
      var sender=x.sender;
      if(!sender||!sender.track||sender.track.kind!=='video'||typeof sender.getParameters!=='function'||typeof sender.setParameters!=='function')return;
      var p=sender.getParameters()||{};
      if(!p.encodings||!p.encodings.length)p.encodings=[{}];
      p.encodings.forEach(function(enc){
        enc.maxBitrate=lim.bitrate;
        enc.maxFramerate=lim.fps;
        enc.scaleResolutionDownBy=lim.scale;
        try{enc.networkPriority='high';}catch(e){}
      });
      try{p.degradationPreference='balanced';}catch(e){}
      await sender.setParameters(p);
    }catch(e){}
  }

  function rebalance(){
    if(!isGroup13())return;
    var list=aliveEntries();
    var lim=limits(list.length||1);
    list.forEach(function(x){tuneOne(x,lim);});
    window.__ktGroup13RtcProfile={
      peers:list.length,
      maxBitrate:lim.bitrate,
      maxFramerate:lim.fps,
      scaleResolutionDownBy:lim.scale,
      at:Date.now()
    };
  }

  Native.prototype.addTrack=function(){
    var sender=oldAddTrack.apply(this,arguments);
    try{
      var track=arguments[0];
      if(track&&track.kind==='video'&&isGroup13()){
        entries.push({pc:this,sender:sender});
        var pc=this;
        if(!pc.__ktG13StabilityBound){
          pc.__ktG13StabilityBound=true;
          pc.addEventListener('connectionstatechange',function(){
            var s=String(pc.connectionState||'');
            if(s==='connected'||s==='connecting'||s==='disconnected'){
              setTimeout(rebalance,80);
              if(s==='disconnected')setTimeout(rebalance,1200);
            }
            if(s==='closed'||s==='failed')setTimeout(rebalance,80);
          });
          pc.addEventListener('iceconnectionstatechange',function(){
            var s=String(pc.iceConnectionState||'');
            if(s==='connected'||s==='completed'||s==='disconnected')setTimeout(rebalance,80);
          });
        }
        setTimeout(rebalance,0);
        setTimeout(rebalance,500);
        setTimeout(rebalance,1800);
      }
    }catch(e){}
    return sender;
  };

  window.ktRetuneGroup13Rtc=function(){rebalance();return window.__ktGroup13RtcProfile||null;};

  window.addEventListener('online',function(){
    setTimeout(rebalance,250);
    setTimeout(rebalance,1500);
  });
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(rebalance,250);
  });
})();