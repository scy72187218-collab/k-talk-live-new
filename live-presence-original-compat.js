/* K-Talk 처음 실시간 접속 방식 호환용: 현재 방송 카메라 스트림만 원래 live-presence에 넘김. UI/방 모양은 변경하지 않음. */
(function(){
  if(window.__ktLivePresenceOriginalCompatInstalled)return;
  window.__ktLivePresenceOriginalCompatInstalled=true;

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  function syncStream(){
    try{
      if(!window.state)return false;
      if(hasLiveVideo(state.stream))return true;
      var selectors=[
        '#camera',
        '.ktsolo-main video',
        '.ktg13-host video',
        '.ktsubscriber-host video',
        '.ktsecret-slot.host video',
        '.ktsecret-host video',
        '#screen video'
      ];
      for(var i=0;i<selectors.length;i++){
        var list=document.querySelectorAll(selectors[i]);
        for(var j=0;j<list.length;j++){
          var v=list[j];
          try{
            if(hasLiveVideo(v.srcObject)){
              state.stream=v.srcObject;
              return true;
            }
          }catch(e){}
        }
      }
    }catch(e){}
    return false;
  }

  function scheduleSync(){
    syncStream();
    [40,90,150,220,300,450,700].forEach(function(ms){setTimeout(syncStream,ms);});
  }

  var old=window.startBroadcast;
  if(typeof old==='function'&&!old.__ktOriginalStreamCompatWrapped){
    var wrapped=function(){
      var args=arguments,self=this;
      scheduleSync();
      var out=old.apply(self,args);
      if(out&&typeof out.then==='function'){
        return out.then(function(v){scheduleSync();return v;},function(err){scheduleSync();throw err;});
      }
      scheduleSync();
      return out;
    };
    wrapped.__ktOriginalStreamCompatWrapped=true;
    window.startBroadcast=wrapped;
  }

  document.addEventListener('playing',function(e){
    if(e.target&&e.target.tagName==='VIDEO')syncStream();
  },true);
})();