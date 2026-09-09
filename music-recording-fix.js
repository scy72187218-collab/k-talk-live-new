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
  load('earnings-rooms-copy.js?v=20260909-earnings-restore1');
  load('mobile-open-compat.js?v=20260909-mobile1');
  load('video-more-menu.js?v=20260909-video-more1');
})();
