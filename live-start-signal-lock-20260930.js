/* K-Talk LIVE start signal path lock 1111 - 2026-09-30 */
(function(){
  if(window.__ktLiveStartSignalLock1111)return;
  window.__ktLiveStartSignalLock1111=true;

  function lockStartPath(){
    try{
      var fn=window.ktStartLiveRoomNow;
      if(typeof fn!=='function')return false;
      if(!fn.__ktSignalWrapped20260929)return false;

      var d=Object.getOwnPropertyDescriptor(window,'ktStartLiveRoomNow');
      if(d&&d.configurable===false)return true;

      Object.defineProperty(window,'ktStartLiveRoomNow',{
        value:fn,
        writable:false,
        configurable:false,
        enumerable:true
      });
      return true;
    }catch(e){return false;}
  }

  if(lockStartPath())return;
  [80,180,350,700,1200,2000].forEach(function(ms){
    setTimeout(lockStartPath,ms);
  });
})();