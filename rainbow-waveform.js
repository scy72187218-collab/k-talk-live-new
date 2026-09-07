/* K-Talk 4개 방송방 파장만 교체: 1인/13명/구독자/비밀방. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktRainbowWaveformInstalled)return;
  window.__ktRainbowWaveformInstalled=true;
  var style=document.createElement('style');
  style.id='ktRainbowWaveformStyle';
  style.textContent='\
    .ktsolo-wave,.ktsubscriber-wave,.ktsecret-wave,.kt-secret-wave,.secret-wave,.kt-room-live-wave{\
      background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wave1")!important;\
      background-repeat:no-repeat!important;\
      background-position:center!important;\
      background-size:100% 100%!important;\
      opacity:1!important;\
      filter:none!important;\
    }\
    .ktsolo-wave>i,.ktsubscriber-wave>i,.ktsecret-wave>i,.kt-secret-wave>i,.secret-wave>i,.kt-room-live-wave>span,.kt-room-live-wave>i{display:none!important}\
  ';
  document.head.appendChild(style);
})();
