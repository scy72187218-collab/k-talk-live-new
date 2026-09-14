/* K-Talk: 모든 라이브방에서 뒤집기 버튼만 좋아요 위에 보강. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomFlipButtonFix20260913)return;
  window.__ktAllRoomFlipButtonFix20260913=true;

  /* 뒤집기 = 좌우 반전이 아니라 실제 앞카메라 ↔ 뒷카메라 전환 */
  async function flipCamera(){
    var current=(window.state&&state.cameraFacing)||'user';
    var next=current==='environment'?'user':'environment';
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;

      var oldStream=(window.state&&state.stream)?state.stream:null;
      var audioTracks=[];
      if(oldStream&&oldStream.getAudioTracks){
        audioTracks=oldStream.getAudioTracks().filter(function(t){return t.readyState==='live';});
      }

      if(oldStream&&oldStream.getVideoTracks){
        oldStream.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});
      }

      var videoStream=null;
      var base={width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}};
      try{
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }catch(firstErr){
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }

      var tracks=[];
      if(videoStream&&videoStream.getVideoTracks)tracks=tracks.concat(videoStream.getVideoTracks());
      tracks=tracks.concat(audioTracks);
      var merged=new MediaStream(tracks);

      if(window.state){
        state.stream=merged;
        state.cameraFacing=next;
      }

      document.querySelectorAll('#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          v.srcObject=merged;
          v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
      return true;
    }catch(e){
      try{if(window.state)state.cameraFacing=current;}catch(x){}
      return false;
    }
  }
  window.ktAllRoomsFlipCamera=flipCamera;

  function isFlip(el){
    if(!el)return false;
    var t=String(el.textContent||'').replace(/\s+/g,'');
    return (el.classList&&(
      el.classList.contains('kt-room-camera-flip')||
      el.classList.contains('kt-solo-camera-flip')
    ))||t.indexOf('뒤집기')>-1||t.indexOf('되돌리기')>-1;
  }

  function addFlip(roomSelector,boxSelector){
    var room=document.querySelector(roomSelector);
    if(!room)return;
    var box=room.querySelector(boxSelector);
    if(!box)return;

    var children=[].slice.call(box.children||[]);
    var flip=children.find(isFlip)||null;
    if(!flip){
      flip=document.createElement('button');
      flip.type='button';
      flip.className='kt-room-camera-flip';
      flip.setAttribute('aria-label','뒤집기');
      flip.innerHTML='<b>↻</b><small>뒤집기</small>';
      flip.onclick=function(e){
        try{if(e){e.preventDefault();e.stopPropagation();}}catch(x){}
        flipCamera();
      };
    }

    if(box.firstElementChild!==flip){
      try{box.insertBefore(flip,box.firstElementChild||null);}catch(e){}
    }
    try{
      flip.style.setProperty('display','flex','important');
      flip.style.setProperty('flex-direction','column','important');
      flip.style.setProperty('align-items','center','important');
      flip.style.setProperty('justify-content','center','important');
      flip.style.setProperty('visibility','visible','important');
      flip.style.setProperty('opacity','1','important');
      flip.style.setProperty('pointer-events','auto','important');
    }catch(e){}

    if(room.classList.contains('ktsubscriber-room')){
      [].slice.call(box.querySelectorAll(':scope > button')).forEach(function(btn){
        try{btn.style.setProperty('display','flex','important');}catch(e){}
      });
    }
  }

  /* 비밀방만: 호스트 1 + 게스트 4 = 총 5명 */
  function isSecretRoomState(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='password'||String(n).indexOf('비밀')>-1||String(title).indexOf('비밀')>-1;
    }catch(e){return false;}
  }

  function enforceSecretFive(){
    try{if(isSecretRoomState()&&window.state)state.liveRoomMax=5;}catch(e){}
    var room=document.querySelector('.ktsecret-room');
    if(!room)return;
    var grid=room.querySelector('.ktsecret-six-grid');
    if(!grid)return;
    var slots=[].slice.call(grid.children||[]).filter(function(el){return el.classList&&el.classList.contains('ktsecret-slot');});
    slots.forEach(function(slot,i){
      try{slot.style.setProperty('display',i<5?'flex':'none','important');}catch(e){}
    });
  }

  var oldSelectPrepRoom=window.selectPrepRoom;
  if(typeof oldSelectPrepRoom==='function'){
    window.selectPrepRoom=function(el,type,name,max){
      var r=oldSelectPrepRoom.apply(this,arguments);
      if(type==='password'||String(name||'').indexOf('비밀')>-1){
        try{if(window.state)state.liveRoomMax=5;}catch(e){}
      }
      return r;
    };
  }

  var oldOpenRoomPrep=window.openRoomPrep;
  if(typeof oldOpenRoomPrep==='function'){
    window.openRoomPrep=function(name,max){
      var r=oldOpenRoomPrep.apply(this,arguments);
      if(String(name||'').indexOf('비밀')>-1){
        try{if(window.state)state.liveRoomMax=5;}catch(e){}
      }
      return r;
    };
  }

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast==='function'){
    window.startBroadcast=function(){
      try{if(isSecretRoomState()&&window.state)state.liveRoomMax=5;}catch(e){}
      return oldStartBroadcast.apply(this,arguments);
    };
  }

  function ensure(){
    addFlip('.ktsolo-room','.ktsolo-right');
    addFlip('.ktg13-room','.ktg13-right-quick');
    addFlip('.ktsubscriber-room','.ktsubscriber-right');
    addFlip('.ktsecret-room','.ktsecret-right');
    enforceSecretFive();
  }

  ensure();
  [60,180,400,800,1400].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,700);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomFlipButtonFixTimer);
      window.__ktAllRoomFlipButtonFixTimer=setTimeout(ensure,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
