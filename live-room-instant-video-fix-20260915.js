/* K-Talk 방송 입장 영상 끊김/깜빡임만 보강. 기존 카메라 화면을 최종 방송 영상이 실제 재생될 때까지 그대로 이어 보여준다. 다른 UI/방/선물/보정/사운드는 변경하지 않음. */
(function(){
  if(window.__ktLiveRoomInstantVideoFixInstalled)return;
  window.__ktLiveRoomInstantVideoFixInstalled=true;

  var handoff=null;
  var observer=null;
  var fallbackTimer=null;

  function currentStream(){
    try{
      var s=window.state&&state.stream;
      if(!s||!s.getVideoTracks)return null;
      var ok=s.getVideoTracks().some(function(t){return t.readyState==='live';});
      return ok?s:null;
    }catch(e){return null;}
  }

  function stopObserver(){
    try{if(observer)observer.disconnect();}catch(e){}
    observer=null;
  }

  function restoreCamera(){
    if(!handoff)return;
    var h=handoff;
    handoff=null;
    stopObserver();
    clearTimeout(fallbackTimer);
    fallbackTimer=null;
    try{
      if(h.parent&&h.camera){
        if(h.next&&h.next.parentNode===h.parent)h.parent.insertBefore(h.camera,h.next);
        else h.parent.appendChild(h.camera);
        if(h.oldStyle===null)h.camera.removeAttribute('style');
        else h.camera.setAttribute('style',h.oldStyle);
      }
    }catch(e){}
    try{if(h.box&&h.box.parentNode)h.box.parentNode.removeChild(h.box);}catch(e){}
  }

  function finishWhenStable(v){
    if(!handoff||!v)return;
    setTimeout(function(){
      if(!handoff)return;
      var now=document.getElementById('ktLiveVideo');
      if(now!==v||!v.isConnected||v.readyState<2)return;
      restoreCamera();
    },160);
  }

  function attachLiveVideo(v){
    if(!handoff||!v)return;
    var s=currentStream();
    if(!s)return;
    try{
      v.autoplay=true;
      v.muted=true;
      v.defaultMuted=true;
      v.playsInline=true;
      v.preload='auto';
      v.setAttribute('autoplay','');
      v.setAttribute('muted','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      if(v.srcObject!==s)v.srcObject=s;
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
    if(!v.dataset.ktInstantReadyWatch){
      v.dataset.ktInstantReadyWatch='1';
      v.addEventListener('playing',function(){finishWhenStable(v);},{once:true});
      v.addEventListener('loadeddata',function(){finishWhenStable(v);},{once:true});
      v.addEventListener('canplay',function(){finishWhenStable(v);},{once:true});
    }
    if(v.readyState>=2)finishWhenStable(v);
  }

  function scan(){
    if(!handoff)return;
    var v=document.getElementById('ktLiveVideo');
    if(v)attachLiveVideo(v);
  }

  function beginHandoff(){
    if(handoff)return;
    var cam=document.getElementById('camera');
    var s=currentStream();
    if(!cam||!cam.parentNode||!s||cam.readyState<2)return;

    var parent=cam.parentNode;
    var next=cam.nextSibling;
    var oldStyle=cam.getAttribute('style');
    var box=document.createElement('div');
    box.id='ktLiveInstantHandoff';
    box.style.cssText='position:fixed;inset:0;z-index:99990;overflow:hidden;background:transparent;pointer-events:none;';
    document.body.appendChild(box);
    box.appendChild(cam);

    try{
      cam.style.setProperty('display','block','important');
      cam.style.setProperty('position','absolute','important');
      cam.style.setProperty('inset','0','important');
      cam.style.setProperty('width','100%','important');
      cam.style.setProperty('height','100%','important');
      cam.style.setProperty('object-fit','cover','important');
      cam.style.setProperty('object-position','center center','important');
      cam.style.setProperty('border-radius','0','important');
      cam.style.setProperty('z-index','1','important');
      if(!cam.style.transform)cam.style.setProperty('transform','scaleX(-1) scale(.84)','important');
      cam.style.setProperty('transform-origin','center center','important');
      if(cam.srcObject!==s)cam.srcObject=s;
      var p=cam.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}

    handoff={camera:cam,parent:parent,next:next,oldStyle:oldStyle,box:box};

    try{
      observer=new MutationObserver(function(){scan();});
      observer.observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
    }catch(e){}

    scan();
    fallbackTimer=setTimeout(restoreCamera,4200);
  }

  var oldCountdown=window.ktLiveStartCountdown;
  if(typeof oldCountdown==='function'&&!oldCountdown.__ktInstantVideoWrapped){
    var countdownWrap=async function(){
      var r=await oldCountdown.apply(this,arguments);
      beginHandoff();
      return r;
    };
    countdownWrap.__ktInstantVideoWrapped=true;
    window.ktLiveStartCountdown=countdownWrap;
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'&&!oldStart.__ktInstantVideoWrapped){
    var startWrap=async function(){
      try{
        var r=await oldStart.apply(this,arguments);
        if(!handoff)beginHandoff();
        setTimeout(scan,0);
        setTimeout(scan,40);
        setTimeout(scan,120);
        return r;
      }catch(e){
        restoreCamera();
        throw e;
      }
    };
    startWrap.__ktInstantVideoWrapped=true;
    window.startBroadcast=startWrap;
  }
})();
