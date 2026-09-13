/* 구독자방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자는 그대로 두고, 매치만 보이는 보물상자 글씨 바로 밑에서 조금 위로 붙인다. */
(function(){
  if(window.__ktSubscriberRightFiveFixInstalled)return;
  window.__ktSubscriberRightFiveFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSubscriberRightFiveFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberRightFiveFixStyle';
    s.textContent=''
      +'.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 56px!important}'
      +'.ktsubscriber-room .ktsubscriber-right{gap:6px!important;overflow:visible!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;font-size:18px!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button:not(.kt-room-camera-flip){border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:60px!important;min-height:60px!important;border-radius:20px!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button small{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like b{font-size:9px!important;line-height:1!important}'
      +'#ktSubscriberMatchFloating{position:fixed!important;z-index:9998!important;display:flex!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important;border-radius:50%!important;border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;color:#fff!important;font-size:18px!important;font-weight:950!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;box-sizing:border-box!important;touch-action:manipulation!important;visibility:visible!important;opacity:1!important}'
      +'#ktSubscriberMatchFloating small{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important;color:#fff!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 54px!important}.ktsubscriber-room .ktsubscriber-right{gap:5px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:58px!important;min-height:58px!important}#ktSubscriberMatchFloating{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}}';
    document.head.appendChild(s);
  }

  function labelOf(el){
    if(!el)return '';
    var small=el.querySelector&&el.querySelector('small');
    return String((small&&small.textContent)||(el.getAttribute&&el.getAttribute('aria-label'))||'').trim();
  }

  function isMatch(el){
    if(!el)return false;
    var label=(el.getAttribute&&el.getAttribute('aria-label'))||'';
    return label==='매치'||labelOf(el)==='매치';
  }

  function removeFloating(){
    var f=document.getElementById('ktSubscriberMatchFloating');
    if(f)f.remove();
  }

  function install(){
    var room=document.querySelector('.ktsubscriber-room');
    var box=document.querySelector('.ktsubscriber-right');
    if(!room||!box){removeFloating();return;}
    ensureStyle();

    var treasures=[].slice.call(box.querySelectorAll(':scope > button')).filter(function(btn){
      return labelOf(btn)==='보물상자';
    });
    if(treasures.length>1){
      treasures.slice(1).forEach(function(btn){try{btn.remove();}catch(e){}});
      treasures=treasures.slice(0,1);
    }
    var treasure=treasures[0]||[].slice.call(box.querySelectorAll(':scope > button')).find(function(btn){
      return labelOf(btn)==='보물상자';
    });
    if(!treasure)return;

    [].slice.call(box.children||[]).forEach(function(el){
      if(isMatch(el)){try{el.remove();}catch(e){}}
    });

    var match=document.getElementById('ktSubscriberMatchFloating');
    if(!match){
      match=document.createElement('div');
      match.id='ktSubscriberMatchFloating';
      match.setAttribute('role','button');
      match.setAttribute('tabindex','0');
      match.setAttribute('aria-label','매치');
      match.innerHTML='⚔<small>매치</small>';
      match.onclick=function(){
        try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
        try{if(window.openMatchArena)window.openMatchArena('1대1');}catch(e){}
      };
      match.onkeydown=function(e){
        if(e&&(e.key==='Enter'||e.key===' ')){e.preventDefault();this.click();}
      };
      document.body.appendChild(match);
    }

    /* 실제 보물상자 글씨 기준에서 매치만 8px 위로 당긴다. */
    var r=treasure.getBoundingClientRect();
    var label=treasure.querySelector('small');
    var lr=label?label.getBoundingClientRect():r;
    var size=window.innerWidth<=390?48:50;
    var left=Math.round(r.left+(r.width-size)/2);
    var top=Math.round(lr.bottom-6);
    match.style.setProperty('left',left+'px','important');
    match.style.setProperty('top',top+'px','important');
  }

  install();
  [60,180,420,900,1500,2500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,700);
  window.addEventListener('resize',install);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSubscriberRightFiveFixTimer);
      window.__ktSubscriberRightFiveFixTimer=setTimeout(install,40);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 13명방·구독자방·비밀방 호스트 칸: 사진처럼 카메라 열림/잠김 + 마이크 버튼만 아래에 표시. */
(function(){
  if(window.__ktThreeRoomHostCameraMicInstalled)return;
  window.__ktThreeRoomHostCameraMicInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktThreeRoomHostCameraMicStyle'))return;
    var s=document.createElement('style');
    s.id='ktThreeRoomHostCameraMicStyle';
    s.textContent=''
      +'.ktg13-room .ktg13-host,.ktsubscriber-room .ktsubscriber-host,.ktsecret-room .ktsecret-slot.host{position:relative!important}'
      +'.ktg13-room .ktg13-host>.kt-person-mic,.ktsubscriber-room .ktsubscriber-host>.kt-person-mic,.ktsecret-room .ktsecret-slot.host>.kt-person-mic{top:auto!important;right:5px!important;bottom:5px!important;z-index:31!important}'
      +'.ktg13-room .ktg13-camera-toggle,.ktsubscriber-room .kt-host-camera-toggle,.ktsecret-room .kt-host-camera-toggle{position:absolute!important;right:36px!important;bottom:5px!important;z-index:31!important;height:25px!important;min-width:54px!important;padding:0 7px!important;margin:0!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:13px!important;background:rgba(8,8,12,.82)!important;color:#fff!important;font:900 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;box-shadow:0 1px 5px rgba(0,0,0,.45)!important;touch-action:manipulation!important}'
      +'.ktsubscriber-room .kt-host-camera-toggle.locked,.ktsecret-room .kt-host-camera-toggle.locked{background:rgba(112,18,32,.88)!important}'
      +'@media(max-width:390px){.ktg13-room .ktg13-host>.kt-person-mic,.ktsubscriber-room .ktsubscriber-host>.kt-person-mic,.ktsecret-room .ktsecret-slot.host>.kt-person-mic{right:3px!important;bottom:3px!important}.ktg13-room .ktg13-camera-toggle,.ktsubscriber-room .kt-host-camera-toggle,.ktsecret-room .kt-host-camera-toggle{right:31px!important;bottom:3px!important;height:22px!important;min-width:49px!important;padding:0 5px!important;font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function tracks(host){
    try{
      if(window.state&&state.stream&&state.stream.getVideoTracks){
        var a=state.stream.getVideoTracks();
        if(a&&a.length)return a;
      }
    }catch(e){}
    try{
      var v=host&&host.querySelector?host.querySelector('video'):null;
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
    }catch(e){}
    return [];
  }

  function isOpen(host){
    var a=tracks(host);
    if(!a.length)return true;
    return a.some(function(t){return t.enabled!==false;});
  }

  function sync(host,btn){
    var open=isOpen(host);
    btn.classList.toggle('locked',!open);
    btn.innerHTML=open?'📷 <span>열림</span>':'🔒 <span>잠김</span>';
    btn.title=open?'카메라 잠그기':'카메라 열기';
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(host,btn){
    var a=tracks(host);
    if(!a.length)return;
    var open=isOpen(host);
    a.forEach(function(t){try{t.enabled=!open;}catch(e){}});
    sync(host,btn);
  }

  function addCamera(host){
    if(!host)return;
    var existing=host.querySelector(':scope > .ktg13-camera-toggle');
    if(existing){sync(host,existing);return;}
    var btn=host.querySelector(':scope > .kt-host-camera-toggle');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-host-camera-toggle';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        toggle(host,this);
      };
      host.appendChild(btn);
    }
    sync(host,btn);
  }

  function install(){
    ensureStyle();
    addCamera(document.querySelector('.ktg13-room .ktg13-host'));
    addCamera(document.querySelector('.ktsubscriber-room .ktsubscriber-host'));
    addCamera(document.querySelector('.ktsecret-room .ktsecret-slot.host'));
  }

  install();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,1000);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktThreeRoomHostCameraMicTimer);
      window.__ktThreeRoomHostCameraMicTimer=setTimeout(install,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
