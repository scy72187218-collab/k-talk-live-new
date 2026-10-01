/* K-Talk host video fast retry helper 2026-10-01
   Auxiliary only. Does not modify locked host-video or red-LIVE files.
   If a viewer enters a room but the remote host stream still has not arrived,
   re-announce the same selected host a small number of times. */
(function(){
  if(window.__ktHostVideoFastRetryHelper20261001)return;
  window.__ktHostVideoFastRetryHelper20261001=true;

  var timers=[];

  function clearTimers(){
    timers.forEach(function(t){try{clearTimeout(t);}catch(e){}});
    timers=[];
  }

  function hostId(){
    try{
      return String(
        window.__ktRemoteHostId||
        window.__ktCurrentRemoteHostId||
        sessionStorage.getItem('kt_remote_host_id')||
        ''
      ).trim();
    }catch(e){return '';}
  }

  function streamReady(){
    try{
      /* A MediaStream track can be "live" before Android has rendered a frame.
         Treat it as ready only after a host video element is actually drawing frames. */
      var vids=[].slice.call(document.querySelectorAll(
        '#ktRemoteLiveVideo,#ktRemoteHostPreview,'+
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-host video,'+
        '.kt-guest-hostlike-room .kgh-cell.host video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '.kt-guest-room-grid .kt-guest-room-cell.host video'
      ));
      return vids.some(function(v){
        try{return !!(v&&v.srcObject&&v.readyState>=2&&v.videoWidth>0&&v.videoHeight>0&&v.currentTime>0);}catch(e){return false;}
      });
    }catch(e){return false;}
  }

  function clearHostPreviewWhenPlaying(){
    try{
      if(!streamReady())return;
      document.querySelectorAll(
        '#ktRemoteLiveVideo,#ktRemoteHostPreview,'+
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-host video,'+
        '.kt-guest-hostlike-room .kgh-cell.host video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '.kt-guest-room-grid .kt-guest-room-cell.host video'
      ).forEach(function(v){
        try{
          if(v.srcObject){
            v.removeAttribute('poster');
            v.style.backgroundImage='none';
            var p=v.play();if(p&&p.catch)p.catch(function(){});
          }
        }catch(e){}
      });
    }catch(e){}
  }

  var previewBusy=false,previewLastAt=0;
  function paintHostPreview(frame){
    try{
      frame=String(frame||'');
      if(!/^data:image\/jpeg;base64,/.test(frame)||frame.length>=32000)return false;
      var targets=[];
      function add(v){if(v&&targets.indexOf(v)<0)targets.push(v);}
      add(document.getElementById('ktRemoteLiveVideo'));
      add(document.getElementById('ktRemoteHostPreview'));
      document.querySelectorAll(
        '#screen .ktg13-room[data-kt-room="9"] .ktg13-host video,'+
        '.kt-guest-hostlike-room .kgh-cell.host video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '.kt-guest-room-grid .kt-guest-room-cell.host video'
      ).forEach(add);
      targets.forEach(function(v){
        try{
          if(v.srcObject)return;
          v.setAttribute('poster',frame);
          v.style.backgroundImage='url("'+frame+'")';
          v.style.backgroundSize='cover';
          v.style.backgroundPosition='center';
          v.style.backgroundRepeat='no-repeat';
        }catch(e){}
      });
      return !!targets.length;
    }catch(e){return false;}
  }

  function fetchHostPreview(){
    if(streamReady()||previewBusy)return;
    var hid=hostId();
    if(!hid)return;
    var now=Date.now();
    if(now-previewLastAt<220)return;
    previewLastAt=now;
    previewBusy=true;
    try{
      fetch('/api/live-beacon-memory?t='+now,{cache:'no-store'}).then(function(r){
        return r&&r.ok?r.json():null;
      }).then(function(data){
        if(streamReady()||!data||!Array.isArray(data.rooms))return;
        var room=data.rooms.find(function(x){return String(x&&x.host_id||'')===hid;});
        if(room&&room.host_frame)paintHostPreview(room.host_frame);
      }).catch(function(){}).finally(function(){previewBusy=false;});
    }catch(e){previewBusy=false;}
  }

  function kick(expected){
    if(streamReady()){clearHostPreviewWhenPlaying();return;}
    var hid=hostId();
    if(!hid||hid!==expected)return;
    try{
      /* Keep re-attaching the real stream until a frame is actually rendered.
         This prevents the fast preview photo from remaining frozen on screen. */
      if(typeof window.ktRetryRemoteHostVideoOnly20261001==='function'){
        window.ktRetryRemoteHostVideoOnly20261001();
      }
    }catch(e){}
  }

  function arm(){
    clearTimers();
    var hid=hostId();
    if(!hid)return;
    fetchHostPreview();
    [0,80,180,320,520,800,1200,1800,2600,3400].forEach(function(ms){
      timers.push(setTimeout(function(){fetchHostPreview();kick(hid);},ms));
    });
  }

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      if(e&&e.detail&&e.detail.fast_retry_helper)return;
    }catch(_e){}
    setTimeout(arm,0);
  });

  /* Stay on the same room and keep asking only for host video while the
     connection banner is still visible. */
  setInterval(function(){
    try{
      if(streamReady())return;
      var root=document.querySelector('.kt-remote-live');
      var st=document.getElementById('ktRemoteLiveStatus');
      if(!root||!st||st.style.display==='none')return;
      var hid=hostId();
      if(!hid)return;
      fetchHostPreview();
      kick(hid);
      clearHostPreviewWhenPlaying();
    }catch(e){}
  },350);

  window.addEventListener('kt-approved-guest-stream-ready',clearTimers);
  window.addEventListener('kt-broadcast-ended',clearTimers);
  window.addEventListener('kt-remote-host-left',clearTimers);
})();