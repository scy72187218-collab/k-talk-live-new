/* 9-room HOST only: reduce height of 되돌리기 / 보물상자 / 매치 row.
   Visual spacing only. Do not change grid, bottom tools, chat, earnings, signaling or actions. */
(function(){
  if(window.__ktG9HostQuickRowShort20261002)return;
  window.__ktG9HostQuickRowShort20261002=true;
  var s=document.createElement('style');
  s.id='ktG9HostQuickRowShortStyle20261002';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927{'
      +'flex:0 0 32px!important;min-height:32px!important;height:32px!important;gap:4px!important;margin-top:-4px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button{'
      +'height:32px!important;font-size:10px!important;border-radius:10px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button b{font-size:14px!important;}'
    +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button span{font-size:10px!important;}'
    +'@media(max-width:390px){'
      +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927{'
        +'flex-basis:30px!important;min-height:30px!important;height:30px!important;}'
      +'#screen .ktg13-room[data-kt-room="9"] .kt-room-second-stats-row-20260927 button{height:30px!important;}'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();