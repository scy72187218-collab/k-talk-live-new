/* Share camera acquisition between the two existing nine-room transports. */
(function(){
  if(window.ktAcquireGuestCamera20261019)return;
  var flight=null;
  window.ktResetGuestCapture20261019=function(){flight=null;};
  function nineRoom(){
    var r=window.__ktLastLiveRoom||{};
    var text=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomType,window.__ktRemoteRoomName].join(' ');
    return /group9\b|9\s*명/.test(text)||!!document.querySelector('#screen .kt-remote-live .ktg13-room[data-kt-room="9"]');
  }
  function ownVideo(stream){
    if(!stream||!stream.getVideoTracks)return false;
    var remote=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream;
    var rt=remote&&remote.getVideoTracks&&remote.getVideoTracks()[0];
    return stream.getVideoTracks().some(function(t){return t.readyState==='live'&&(!rt||t.id!==rt.id);});
  }
  window.ktAcquireGuestCamera20261019=function(constraints){
    if(!nineRoom())return navigator.mediaDevices.getUserMedia(constraints);
    var host=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'');
    if(flight&&flight.host===host)return flight.promise;
    var candidates=[window.__ktLocalGuestCameraStream20260926,window.__ktApprovedGuestSelfStream];
    for(var i=0;i<candidates.length;i++)if(ownVideo(candidates[i]))return Promise.resolve(candidates[i]);
    var entry={host:host,promise:null};
    entry.promise=Promise.resolve().then(function(){return navigator.mediaDevices.getUserMedia(constraints);}).finally(function(){
      if(flight===entry)flight=null;
    });
    flight=entry;return entry.promise;
  };
})();
