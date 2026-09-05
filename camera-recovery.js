/* K-Talk: recovery/feature loaders only. Keep room layouts unchanged. */
(function(){
  if(window.__ktCameraRecoveryLoaded)return;
  window.__ktCameraRecoveryLoaded=true;

  var scripts=[
    ['kt-permission-once','permission-once-fix.js?v=20260905-permission01'],
    ['kt-live-bottom-tools','live-bottom-tiktok.js?v=20260905-bottom01'],
    ['kt-group13-layout','group13-reference-layout.js?v=20260905-group13-08'],
    ['kt-password-layout','password-room-reference-layout.js?v=20260905-password01'],
    ['kt-password-host-cover','password-host-cover-fix.js?v=20260905-password-host04'],
    ['kt-live-home-indicator','live-home-indicator.js?v=20260905-livehome03'],
    ['kt-live-host-thumbnail','live-host-thumbnail.js?v=20260905-hostthumb01'],
    ['kt-guest-participation','guest-participation.js?v=20260905-guest01'],
    ['kt-song-guest-mic-lock','song-guest-mic-lock.js?v=20260906-songmic02'],
    ['kt-live-viewer-join-chat','live-viewer-join-chat.js?v=20260905-joinchat02'],
    ['kt-live-room-chat','live-room-chat.js?v=20260905-roomchat03'],
    ['kt-live-chat-lower','live-chat-lower-position.js?v=20260906-chatlower01'],
    ['kt-seated-camera-framing','seated-camera-framing-fix.js?v=20260906-seated01'],
    ['kt-attendance-size-position','attendance-size-position-fix.js?v=20260905-attendance04'],
    ['kt-subscriber-title-fix','subscriber-title-position-fix.js?v=20260905-subtitle01'],
    ['kt-viewer-live-reconnect','viewer-live-reconnect-fix.js?v=20260906-viewer02'],
    ['kt-live-first-feed','live-first-feed-fix.js?v=20260905-livefirst01'],
    ['kt-live-presence-fast','live-presence-fast-fix.js?v=20260905-fastpresence01'],
    ['kt-feed-startup-stability','feed-startup-stability-fix.js?v=20260906-feedstable04'],
    ['kt-home-first-screen-stable','home-first-screen-stable.js?v=20260906-firststable01'],
    ['kt-playable-sounds','sound-playable-original.js?v=20260905-vocal02']
  ];

  scripts.forEach(function(item){
    var attr='data-'+item[0];
    if(document.querySelector('script['+attr+']'))return;
    var s=document.createElement('script');
    s.src=item[1];
    s.defer=true;
    s.setAttribute(attr,'1');
    document.head.appendChild(s);
  });

  function forcePublicFeed(){
    try{
      if(document.getElementById('ktUnifiedFeed'))return;
      if(!document.querySelector('.video-home'))return;
      if(typeof window.ktLowMemoryFeed!=='function')return;
      var r=window.ktLowMemoryFeed();
      if(r&&typeof r.then==='function'){
        r.then(function(){
          var feed=document.getElementById('ktUnifiedFeed');
          if(feed){
            feed.style.setProperty('overflow-y','scroll','important');
            feed.style.setProperty('-webkit-overflow-scrolling','touch','important');
            feed.style.setProperty('touch-action','pan-y','important');
          }
        }).catch(function(){});
      }
    }catch(e){}
  }
  setTimeout(forcePublicFeed,150);
  setTimeout(forcePublicFeed,500);
  setTimeout(forcePublicFeed,1000);
  setTimeout(forcePublicFeed,1800);
  setTimeout(forcePublicFeed,3200);
})();
