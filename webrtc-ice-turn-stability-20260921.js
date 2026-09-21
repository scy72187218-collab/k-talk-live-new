/* K-Talk WebRTC ICE/TURN signal stability helper (2026-09-21)
   Scope: network transport only. Does not touch room UI, controls, chat, gifts, earnings, or switches. */
(function(){
  if(window.__ktWebRtcIceStability20260921)return;
  window.__ktWebRtcIceStability20260921=true;

  var relayServers=[];
  var lastRefresh=0;
  var TTL_SECONDS=86400;
  var STATIC_HOST='staticauth.openrelay.metered.ca';
  var STATIC_SECRET='openrelayprojectsecret';

  function stunServers(){
    return [{
      urls:[
        'stun:stun.cloudflare.com:3478',
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }];
  }

  function cloneServers(list){
    try{return JSON.parse(JSON.stringify(list||[]));}catch(e){return list||[];}
  }

  window.ktGetRtcConfig=function(){
    var extra=[];
    try{
      if(Array.isArray(window.__ktCustomTurnIceServers))extra=window.__ktCustomTurnIceServers;
    }catch(e){}
    return {
      iceServers:cloneServers(stunServers().concat(relayServers,extra)),
      iceTransportPolicy:'all',
      iceCandidatePoolSize:2,
      bundlePolicy:'max-bundle',
      rtcpMuxPolicy:'require'
    };
  };

  window.ktTurnRelayStatus={ready:false,provider:'Open Relay',updatedAt:0};

  function bytesToBase64(buf){
    var a=new Uint8Array(buf),s='';
    for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);
    return btoa(s);
  }

  async function refreshRelay(){
    if(Date.now()-lastRefresh<300000&&relayServers.length)return;
    lastRefresh=Date.now();
    try{
      if(!window.crypto||!crypto.subtle||typeof TextEncoder==='undefined')throw new Error('webcrypto unavailable');
      var expiry=Math.floor(Date.now()/1000)+TTL_SECONDS;
      var username=String(expiry)+':ktalk';
      var key=await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(STATIC_SECRET),
        {name:'HMAC',hash:'SHA-1'},
        false,
        ['sign']
      );
      var sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(username));
      var credential=bytesToBase64(sig);

      relayServers=[{
        urls:[
          'turn:'+STATIC_HOST+':80?transport=udp',
          'turn:'+STATIC_HOST+':80?transport=tcp',
          'turn:'+STATIC_HOST+':443?transport=tcp'
        ],
        username:username,
        credential:credential
      }];

      window.ktTurnRelayStatus={ready:true,provider:'Open Relay',updatedAt:Date.now()};
      try{window.dispatchEvent(new CustomEvent('kt-turn-ready'));}catch(e){}
    }catch(e){
      relayServers=[];
      window.ktTurnRelayStatus={ready:false,provider:'Open Relay',updatedAt:Date.now()};
    }
  }

  window.ktRefreshTurnRelay=refreshRelay;
  refreshRelay();
  setInterval(refreshRelay,6*60*60*1000);
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&Date.now()-lastRefresh>6*60*60*1000)refreshRelay();
  });
})();