/* 9-room HOST only: move bottom tool row slightly lower to match approved visual.
   Visual only. Keep grid, chat, earnings, top controls and button actions unchanged. */
(function(){
  if(window.__ktG9HostBottomToolsLowerFinal20261002)return;
  window.__ktG9HostBottomToolsLowerFinal20261002=true;

  var s=document.createElement('style');
  s.id='ktG9HostBottomToolsLowerFinalStyle20261002';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools{'
      +'transform:translateY(8px)!important;'
      +'margin-bottom:0!important;'
      +'padding-bottom:0!important;'
    +'}'
    +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools .ktg13-tool span{'
      +'display:block!important;visibility:visible!important;opacity:1!important;'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();