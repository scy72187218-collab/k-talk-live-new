/* K-Talk loader: keep the existing music fix unchanged, then load the approved 13-person room preview. */
(function(){
  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  load('music-recording-base.js?v=20260907-group13');
  load('group13-approved-room.js?v=20260907-group13');
  load('live-presence.js?v=20260908-live1');
  load('media-profile-stability-fix.js?v=20260908-media1');
  load('group13-realtime-fix.js?v=20260908-chatreq1');
})();
