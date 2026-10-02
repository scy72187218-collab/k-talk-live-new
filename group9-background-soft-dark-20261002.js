/* 9-room visual only: soften pure black background without changing layout or controls. */
(function(){
  if(window.__ktG9SoftDarkBg20261002)return;
  window.__ktG9SoftDarkBg20261002=true;
  var s=document.createElement('style');
  s.id='ktG9SoftDarkBgStyle20261002';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"],'
    +'#screen .ktg9-room,'
    +'#screen .kt-remote-live:has(.kt-guest-hostlike-room[data-kt-room="9"]),'
    +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555,'
    +'#screen .kt-remote-live.kt-g9-chat-bottom-5555{'
      +'background:linear-gradient(180deg,#17151d 0%,#121018 48%,#0e0d13 100%)!important;'
      +'color:#fff!important;'
    +'}'
    +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'
    +'#screen .ktg9-room .ktg9-main,'
    +'#screen .kt-remote-live .kt-prejoin-room-grid,'
    +'#screen .kt-remote-live .kt-approved-guest-grid,'
    +'#screen .kt-remote-live .kt-guest-room-grid,'
    +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{'
      +'background:transparent!important;'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();