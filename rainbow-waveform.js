/* K-Talk 4개 방송방 파장만 수정: 1인/13명/구독자/비밀방. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktRainbowWaveformInstalled)return;
  window.__ktRainbowWaveformInstalled=true;

  /* 13명 방송 전용 화면 스크립트가 빠져 있어도 이 파일에서 한 번만 불러온다. */
  if(!window.__ktGroup13ApprovedRoomInstalled && !document.querySelector('script[data-kt-group13-loader]')){
    var g=document.createElement('script');
    g.src='group13-approved-room.js?v=20260907-wavebottom1';
    g.setAttribute('data-kt-group13-loader','1');
    document.head.appendChild(g);
  }

  var style=document.createElement('style');
  style.id='ktRainbowWaveformStyle';
  style.textContent='\
    @keyframes ktRainbowWaveBeat{\
      0%{transform:scaleY(.58)}\
      28%{transform:scaleY(1.10)}\
      52%{transform:scaleY(.76)}\
      76%{transform:scaleY(1.18)}\
      100%{transform:scaleY(.68)}\
    }\
    .ktsolo-wave,.ktsubscriber-wave,.ktsecret-wave,.kt-secret-wave,.secret-wave{\
      position:absolute!important;\
      left:0!important;\
      right:0!important;\
      width:auto!important;\
      bottom:72px!important;\
      height:34px!important;\
      z-index:6!important;\
      display:block!important;\
      pointer-events:none!important;\
      background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wavebottom1")!important;\
      background-repeat:no-repeat!important;\
      background-position:center!important;\
      background-size:100% 100%!important;\
      opacity:.96!important;\
      transform-origin:center bottom!important;\
      animation:ktRainbowWaveBeat .62s ease-in-out infinite alternate!important;\
      filter:drop-shadow(0 0 4px rgba(255,65,210,.35))!important;\
    }\
    .ktsolo-wave>i,.ktsubscriber-wave>i,.ktsecret-wave>i,.kt-secret-wave>i,.secret-wave>i{display:none!important}\
    .ktg13-main::after{\
      content:"";\
      position:absolute;\
      left:0;\
      right:0;\
      bottom:2px;\
      height:32px;\
      z-index:8;\
      pointer-events:none;\
      background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wavebottom1");\
      background-repeat:no-repeat;\
      background-position:center;\
      background-size:100% 100%;\
      opacity:.96;\
      transform-origin:center bottom;\
      animation:ktRainbowWaveBeat .62s ease-in-out infinite alternate;\
      filter:drop-shadow(0 0 4px rgba(255,65,210,.35));\
    }\
  ';
  document.head.appendChild(style);
})();
