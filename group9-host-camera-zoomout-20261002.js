/* 9-room HOST only: keep the video frame full, but ask supported cameras to zoom out.
   This makes the person's face appear smaller without shrinking the video box.
   No layout/button/chat changes. */
(function(){
  if(window.__ktG9HostCameraZoomOut20261002)return;
  window.__ktG9HostCameraZoomOut20261002=true;

  async function apply(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;

      var stream=null;
      try{
        if(window.state&&state.stream&&state.stream.getVideoTracks)stream=state.stream;
      }catch(e){}
      if(!stream){
        var v=room.querySelector('.ktg13-host video');
        if(v&&v.srcObject&&v.srcObject.getVideoTracks)stream=v.srcObject;
      }
      if(!stream)return;

      var track=stream.getVideoTracks()[0];
      if(!track||!track.getCapabilities||!track.applyConstraints)return;

      var caps=track.getCapabilities();
      if(!caps||!caps.zoom)return;

      var min=Number(caps.zoom.min);
      if(!isFinite(min))return;

      await track.applyConstraints({advanced:[{zoom:min}]});
    }catch(e){}
  }

  apply();
  [100,300,700,1500,3000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,80);});
})();