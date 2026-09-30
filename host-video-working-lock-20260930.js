/* K-Talk host-video working lock 1111
   Known-good host video state:
   live-peer-fallback-20260921.js sha efd0e814ef502db56ca0cf591908a1a32ed3080c
   direct-realtime-webrtc-20260922.js sha f2648bf38bfc53b5b4a9a024a3791f1635fce5aa
   Do not modify these host-video paths unless explicitly unlocked by the user.
*/
(function(){
  var v={
    locked:true,
    at:'2026-09-30',
    fallback_sha:'efd0e814ef502db56ca0cf591908a1a32ed3080c',
    direct_sha:'f2648bf38bfc53b5b4a9a024a3791f1635fce5aa'
  };
  try{Object.freeze(v);}catch(e){}
  try{
    Object.defineProperty(window,'__ktHostVideoWorkingLock1111',{
      value:v,writable:false,configurable:false
    });
  }catch(e){window.__ktHostVideoWorkingLock1111=v;}
})();