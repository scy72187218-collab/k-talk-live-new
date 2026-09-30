/* K-Talk 빨간 LIVE 수신 상태 잠금 2026-09-30 / 1111
   현재 들어오는 LIVE 신호 수신 상태만 보호.
   입장/퇴장/동영상/방송방/게스트/수익률/운세는 변경하지 않음. */
(function(){
  try{
    if(window.__ktRedLiveIncomingSignalLock1111)return;
    Object.defineProperty(window,'__ktRedLiveIncomingSignalLock1111',{
      value:true,writable:false,configurable:false
    });
  }catch(e){window.__ktRedLiveIncomingSignalLock1111=true;}

  /* 기존 수신기 설치 상태만 고정. 실제 수신 동작은 기존 파일이 그대로 담당한다. */
  try{
    if(window.__ktRedLiveSignalReceiverLock20260930===true){
      var d=Object.getOwnPropertyDescriptor(window,'__ktRedLiveSignalReceiverLock20260930');
      if(!d||d.configurable!==false){
        Object.defineProperty(window,'__ktRedLiveSignalReceiverLock20260930',{
          value:true,writable:false,configurable:false
        });
      }
    }
  }catch(e){}
})();