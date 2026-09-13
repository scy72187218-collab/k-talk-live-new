/* K-Talk: 모든 라이브방에서 뒤집기 버튼만 좋아요 위에 보강. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomFlipButtonFix20260913)return;
  window.__ktAllRoomFlipButtonFix20260913=true;

  async function flipCamera(){
    try{
      var next=(window.state&&state.cameraFacing==='environment')?'user':'environment';
      if(window.state)state.cameraFacing=next;
      if(typeof window.ensureLiveCamera==='function'){
        var ok=await window.ensureLiveCamera(next);
        if(ok===false)return;
      }
      document.querySelectorAll('.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          if(window.state&&state.stream)v.srcObject=state.stream;
          v.style.transform=next==='user'?'scaleX(-1)':'none';
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
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

  function ensure(){
    addFlip('.ktsolo-room','.ktsolo-right');
    addFlip('.ktg13-room','.ktg13-right-quick');
    addFlip('.ktsubscriber-room','.ktsubscriber-right');
    addFlip('.ktsecret-room','.ktsecret-right');
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
