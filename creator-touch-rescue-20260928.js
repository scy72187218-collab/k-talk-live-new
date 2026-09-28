/* Creator touch rescue - UI unchanged */
(function(){
  if(window.__ktCreatorTouchRescue20260928)return;
  window.__ktCreatorTouchRescue20260928=true;

  var lastEl=null,lastAt=0;

  function inCreator(){
    var c=document.getElementById('creator');
    return c&&c.classList.contains('show');
  }

  async function flip(){
    try{
      if(typeof window.ktAllRoomsFlipCamera==='function'){
        var r=window.ktAllRoomsFlipCamera();
        if(r!==false)return true;
      }
    }catch(e){}
    try{
      if(typeof window.toggleCreatorCamera==='function'){
        var r2=window.toggleCreatorCamera();
        if(r2!==false)return true;
      }
    }catch(e){}
    try{
      if(window.state&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
        var cur=state.cameraFacing||'user';
        var next=cur==='environment'?'user':'environment';
        var old=state.stream;
        var aud=[];
        if(old&&old.getAudioTracks)aud=old.getAudioTracks().filter(function(t){return t.readyState==='live';});
        if(old&&old.getVideoTracks)old.getVideoTracks().forEach(function(t){try{t.stop();}catch(_e){}});
        var vs=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:next}},audio:false});
        var tracks=(vs.getVideoTracks?vs.getVideoTracks():[]).concat(aud);
        var merged=new MediaStream(tracks);
        state.stream=merged;state.cameraFacing=next;
        var cam=document.getElementById('camera');
        if(cam){cam.srcObject=merged;try{cam.play();}catch(_e){}}
        return true;
      }
    }catch(e){}
    return false;
  }

  function openEffect(){
    try{
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('face');
        var sh=document.getElementById('sheet');
        if(sh){sh.classList.add('show');sh.style.setProperty('pointer-events','auto','important');}
        return true;
      }
    }catch(e){}
    return false;
  }

  function addText(){
    try{
      var c=document.getElementById('creator');
      var input=prompt('화면에 넣을 글을 입력하세요.');
      if(!input||!c)return true;
      var old=c.querySelector('.kt-creator-text-overlay');
      if(!old){
        old=document.createElement('div');
        old.className='kt-creator-text-overlay';
        old.style.cssText='position:absolute;left:50%;top:24%;transform:translateX(-50%);z-index:90;max-width:78%;padding:7px 10px;border-radius:10px;background:rgba(0,0,0,.30);color:#fff;font-size:28px;font-weight:900;text-align:center;text-shadow:0 2px 5px #000;pointer-events:none;white-space:pre-wrap;word-break:break-word';
        c.appendChild(old);
      }
      old.textContent=input;
      return true;
    }catch(e){return false;}
  }

  function run(el,e){
    if(!el)return false;
    if(el.matches('.creator-rotate')){flip();return true;}
    if(el.matches('.kt-edit-under-rotate'))return openEffect();
    if(el.matches('.kt-text-under-effect'))return addText();
    if(el.id==='creatorSoundBtn'&&typeof window.openSoundPanel==='function'){window.openSoundPanel();return true;}
    if(el.matches('.creator-top .circle:not(.creator-rotate)')&&typeof window.closeCreator==='function'){window.closeCreator();return true;}
    if(el.matches('.creator-bottom .record')&&typeof el.onclick==='function'){return false;}
    return false;
  }

  function rescue(e){
    if(!inCreator())return;
    var t=e.target&&e.target.closest?e.target.closest(
      '#creator .creator-rotate,#creator .kt-edit-under-rotate,#creator .kt-text-under-effect,#creator #creatorSoundBtn,#creator .creator-top .circle'
    ):null;
    if(!t)return;
    var now=Date.now();
    if(lastEl===t&&now-lastAt<450){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      return;
    }
    if(run(t,e)){
      lastEl=t;lastAt=now;
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    }
  }

  function unlock(){
    try{
      document.querySelectorAll(
        '#creator .creator-rotate,#creator .kt-edit-under-rotate,#creator .kt-text-under-effect,#creator #creatorSoundBtn,#creator .creator-top .circle'
      ).forEach(function(el){
        el.disabled=false;
        el.removeAttribute('inert');
        el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  document.addEventListener('pointerdown',rescue,true);
  if(!window.PointerEvent)document.addEventListener('touchstart',rescue,true);

  unlock();
  [60,180,420,900,1600].forEach(function(ms){setTimeout(unlock,ms);});
  window.addEventListener('pageshow',unlock);
  window.addEventListener('focus',unlock);
})();