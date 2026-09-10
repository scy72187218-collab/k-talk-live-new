/* K-Talk Wi-Fi 재연결 보강: 네트워크가 잠깐 끊겼다가 다시 연결되면 현재 화면의 영상/카메라를 다시 재생한다. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktNetworkReconnectFixInstalled)return;
  window.__ktNetworkReconnectFixInstalled=true;

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  async function recoverMedia(){
    try{
      var stream=window.state&&state.stream;
      if(hasLiveVideo(stream)){
        ['camera','cameraBg'].forEach(function(id){
          try{
            var v=document.getElementById(id);
            if(v){if(v.srcObject!==stream)v.srcObject=stream;v.muted=true;v.setAttribute('playsinline','');var p=v.play();if(p&&p.catch)p.catch(function(){});}
          }catch(e){}
        });
        try{
          document.querySelectorAll('#screen video').forEach(function(v){
            if(!v.srcObject&&hasLiveVideo(stream)){v.srcObject=stream;v.muted=true;v.setAttribute('playsinline','');var p=v.play();if(p&&p.catch)p.catch(function(){});}
          });
        }catch(e){}
      }

      try{
        document.querySelectorAll('video[src],video source').forEach(function(el){
          var v=el.tagName==='VIDEO'?el:el.parentElement;
          if(v&&v.tagName==='VIDEO'){var p=v.play();if(p&&p.catch)p.catch(function(){});}
        });
      }catch(e){}

      var creator=document.getElementById('creator');
      if(creator&&creator.classList.contains('show')&&!hasLiveVideo(stream)){
        var allowed=false;
        try{allowed=sessionStorage.getItem('kt_camera_allowed_this_session')==='1';}catch(e){}
        if(!allowed&&navigator.permissions&&navigator.permissions.query){
          try{var ps=await navigator.permissions.query({name:'camera'});allowed=ps&&ps.state==='granted';}catch(e){}
        }
        if(allowed&&typeof window.ensureLiveCamera==='function'){
          try{await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
        }
      }
    }catch(e){}
  }

  window.addEventListener('online',function(){setTimeout(recoverMedia,250);});
  window.addEventListener('pageshow',function(){if(navigator.onLine)setTimeout(recoverMedia,300);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine)setTimeout(recoverMedia,300);});
})();
