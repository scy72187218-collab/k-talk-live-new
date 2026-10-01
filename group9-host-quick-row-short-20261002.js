/* 9-room HOST only: reduce height of 되돌리기 / 보물상자 / 매치 row.
   Visual spacing only. Do not change grid, bottom tools, chat, earnings, signaling or actions. */
(function(){
  if(window.__ktG9HostQuickRowShort20261002)return;
  window.__ktG9HostQuickRowShort20261002=true;
  var s=document.createElement('style');
  s.id='ktG9HostQuickRowShortStyle20261002';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927{'
      +'flex:0 0 38px!important;min-height:38px!important;height:38px!important;gap:4px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button{'
      +'height:38px!important;font-size:10px!important;border-radius:10px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button b{font-size:14px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button span{font-size:10px!important;}'
    +'@media(max-width:390px){'
      +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927{'
        +'flex-basis:35px!important;min-height:35px!important;height:35px!important;}'
      +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button{height:35px!important;}'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();