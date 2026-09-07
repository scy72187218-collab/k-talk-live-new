/* K-Talk 권한창 중복 방지: 한 화면에서 카메라/마이크 권한 요청이 겹쳐 여러 번 뜨지 않게 함. 브라우저 자체 최초 권한창은 보안상 자동 허용할 수 없음. */
(function(){
  if(window.__ktPermissionOnceGuardInstalled)return;
  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure!=='function')return;
  window.__ktPermissionOnceGuardInstalled=true;

  var pending=null;
  var failedOnce=false;

  function hasLiveVideo(){
    try{return !!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  window.ensureLiveCamera=function(){
    if(hasLiveVideo())return Promise.resolve(true);
    if(pending)return pending;
    if(failedOnce)return Promise.resolve(false);

    var self=this,args=arguments;
    pending=Promise.resolve().then(function(){
      return oldEnsure.apply(self,args);
    }).then(function(ok){
      if(hasLiveVideo())return true;
      if(ok===false)failedOnce=true;
      return !!ok;
    }).catch(function(){
      failedOnce=true;
      return false;
    }).finally(function(){
      pending=null;
    });
    return pending;
  };
})();
