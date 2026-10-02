/* 9-room only: keep the people grid still when the chat keyboard opens.
   Does not change grid size, colors, buttons, chat content, approval, camera or signaling. */
(function(){
  if(window.__ktG9KeyboardNoJump20261002)return;
  window.__ktG9KeyboardNoJump20261002=true;

  var stableH=0, savedWinY=0, savedScreenY=0, active=false, raf=0;

  function isNine(){
    try{
      if(document.querySelector('#screen .ktg13-room[data-kt-room="9"],#screen .ktg9-room'))return true;
      var r=document.querySelector('#screen .kt-remote-live');
      if(!r)return false;
      if(r.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      var st=window.state||{}, last=window.__ktLastLiveRoom||{};
      var txt=[st.liveRoomType,st.liveRoomName,st.liveRoomMax,last.room_type,last.room_name,r.textContent].join(' ');
      return /group9|9\s*명/i.test(String(txt));
    }catch(e){return false;}
  }

  function isChatField(el){
    if(!el||!el.matches)return false;
    if(!el.matches('input,textarea,[contenteditable="true"]'))return false;
    if(!el.closest('#screen'))return false;
    return isNine();
  }

  function rememberHeight(){
    if(active||!isNine())return;
    var h=Math.round(window.innerHeight||document.documentElement.clientHeight||0);
    if(h>300)stableH=h;
  }

  function lock(){
    if(active||!isNine())return;
    active=true;
    rememberHeight();
    var screen=document.getElementById('screen');
    savedWinY=window.scrollY||window.pageYOffset||0;
    savedScreenY=screen?screen.scrollTop:0;

    if(screen&&stableH>0){
      screen.style.setProperty('height',stableH+'px','important');
      screen.style.setProperty('min-height',stableH+'px','important');
      screen.style.setProperty('max-height',stableH+'px','important');
    }

    function hold(){
      if(!active)return;
      try{
        window.scrollTo(0,savedWinY);
        if(screen)screen.scrollTop=savedScreenY;
      }catch(e){}
      raf=requestAnimationFrame(hold);
    }
    hold();

    [0,40,100,180,300,500,800].forEach(function(ms){
      setTimeout(function(){
        if(!active)return;
        try{
          window.scrollTo(0,savedWinY);
          if(screen)screen.scrollTop=savedScreenY;
        }catch(e){}
      },ms);
    });
  }

  function unlock(){
    if(!active)return;
    active=false;
    if(raf)cancelAnimationFrame(raf);
    raf=0;
    var screen=document.getElementById('screen');
    if(screen){
      screen.style.removeProperty('height');
      screen.style.removeProperty('min-height');
      screen.style.removeProperty('max-height');
      try{screen.scrollTop=savedScreenY;}catch(e){}
    }
    try{window.scrollTo(0,savedWinY);}catch(e){}
    setTimeout(rememberHeight,250);
  }

  document.addEventListener('pointerdown',function(e){
    if(isChatField(e.target)){
      rememberHeight();
      var screen=document.getElementById('screen');
      savedWinY=window.scrollY||window.pageYOffset||0;
      savedScreenY=screen?screen.scrollTop:0;
    }
  },true);

  document.addEventListener('focusin',function(e){
    if(isChatField(e.target))lock();
  },true);

  document.addEventListener('focusout',function(e){
    if(isChatField(e.target))setTimeout(unlock,80);
  },true);

  window.addEventListener('resize',function(){
    if(!active)setTimeout(rememberHeight,80);
  });
  window.addEventListener('orientationchange',function(){
    stableH=0;
    setTimeout(rememberHeight,300);
  });

  rememberHeight();
  [100,400,1000].forEach(function(ms){setTimeout(rememberHeight,ms);});
})();