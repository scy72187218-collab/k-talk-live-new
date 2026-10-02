/* 9-room only: keyboard opens without moving the people/video grid.
   Freeze the room screen; move only the focused chat row above the keyboard.
   Do not change grid size, buttons, colors, approval, camera, mic or signaling.
*/
(function(){
  if(window.__ktG9KeyboardNoJump20261002)return;
  window.__ktG9KeyboardNoJump20261002=true;

  var stableH=0, savedWinY=0, savedScreenY=0, active=false, raf=0;
  var activeField=null, activeBar=null, saved={};

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
    if(!el||!el.matches||!el.matches('input,textarea,[contenteditable="true"]'))return false;
    if(!el.closest('#screen')||!isNine())return false;
    var ph=String(el.getAttribute('placeholder')||'');
    var parentText=String((el.parentElement&&el.parentElement.textContent)||'');
    return /채팅|입력|message|chat/i.test(ph+' '+parentText) ||
      !!el.closest('.kt-remote-bottom,.ktg13-chat,.kgh-chat,.kt-remote-chat');
  }

  function rememberHeight(){
    if(active||!isNine())return;
    var h=Math.round(
      (window.visualViewport&&window.visualViewport.height>window.innerHeight
        ? window.visualViewport.height
        : window.innerHeight) || document.documentElement.clientHeight || 0
    );
    if(h>500)stableH=h;
  }

  function findChatBar(field){
    if(!field)return null;
    return field.closest(
      '.kt-remote-bottom,.ktg13-chat-input-row,.ktg13-chatbar,.ktg13-compose,'+
      '.kgh-chat-input-row,.kt-chat-input-row,.chat-input-row,.chatbar'
    ) || field.parentElement;
  }

  function keyboardHeight(){
    var vv=window.visualViewport;
    if(!vv||!stableH)return Math.max(0,stableH-window.innerHeight);
    return Math.max(0,Math.round(stableH-vv.height));
  }

  function moveChatOnly(){
    if(!active)return;
    var vv=window.visualViewport;
    var screen=document.getElementById('screen');

    /* Android may pan the visual viewport upward when the keyboard opens.
       Counter that pan so the people/grid stays exactly where it was. */
    if(screen){
      var off=vv?Math.max(0,Math.round(vv.offsetTop||0)):0;
      screen.style.setProperty('top',off+'px','important');
    }

    /* Only the chat entry row rises above the keyboard. */
    if(activeBar){
      var kh=keyboardHeight();
      activeBar.style.setProperty('transform','translateY(-'+kh+'px)','important');
      activeBar.style.setProperty('z-index','2147483646','important');
    }
  }

  function lock(field){
    if(active||!isNine())return;
    rememberHeight();
    active=true;
    activeField=field;
    activeBar=findChatBar(field);

    var screen=document.getElementById('screen');
    savedWinY=window.scrollY||window.pageYOffset||0;
    savedScreenY=screen?screen.scrollTop:0;

    if(screen){
      saved.screenPosition=screen.style.getPropertyValue('position');
      saved.screenTop=screen.style.getPropertyValue('top');
      saved.screenLeft=screen.style.getPropertyValue('left');
      saved.screenRight=screen.style.getPropertyValue('right');
      saved.screenWidth=screen.style.getPropertyValue('width');
      saved.screenHeight=screen.style.getPropertyValue('height');
      saved.screenMinHeight=screen.style.getPropertyValue('min-height');
      saved.screenMaxHeight=screen.style.getPropertyValue('max-height');
      saved.screenOverflow=screen.style.getPropertyValue('overflow');

      screen.style.setProperty('position','fixed','important');
      screen.style.setProperty('top','0','important');
      screen.style.setProperty('left','0','important');
      screen.style.setProperty('right','0','important');
      screen.style.setProperty('width','100%','important');
      if(stableH>0){
        screen.style.setProperty('height',stableH+'px','important');
        screen.style.setProperty('min-height',stableH+'px','important');
        screen.style.setProperty('max-height',stableH+'px','important');
      }
      screen.style.setProperty('overflow','hidden','important');
    }

    if(activeBar){
      saved.barTransform=activeBar.style.getPropertyValue('transform');
      saved.barZ=activeBar.style.getPropertyValue('z-index');
    }

    function hold(){
      if(!active)return;
      try{
        window.scrollTo(0,savedWinY);
        if(screen)screen.scrollTop=savedScreenY;
      }catch(e){}
      moveChatOnly();
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
        moveChatOnly();
      },ms);
    });
  }

  function restore(el,prop,val){
    if(!el)return;
    if(val)el.style.setProperty(prop,val);
    else el.style.removeProperty(prop);
  }

  function unlock(){
    if(!active)return;
    active=false;
    if(raf)cancelAnimationFrame(raf);
    raf=0;

    var screen=document.getElementById('screen');
    if(screen){
      restore(screen,'position',saved.screenPosition);
      restore(screen,'top',saved.screenTop);
      restore(screen,'left',saved.screenLeft);
      restore(screen,'right',saved.screenRight);
      restore(screen,'width',saved.screenWidth);
      restore(screen,'height',saved.screenHeight);
      restore(screen,'min-height',saved.screenMinHeight);
      restore(screen,'max-height',saved.screenMaxHeight);
      restore(screen,'overflow',saved.screenOverflow);
      try{screen.scrollTop=savedScreenY;}catch(e){}
    }

    if(activeBar){
      restore(activeBar,'transform',saved.barTransform);
      restore(activeBar,'z-index',saved.barZ);
    }

    try{window.scrollTo(0,savedWinY);}catch(e){}
    activeField=null;
    activeBar=null;
    saved={};
    setTimeout(rememberHeight,250);
  }

  function finishChatEntry(){
    if(!active)return;
    try{if(activeField&&activeField.blur)activeField.blur();}catch(e){}
    setTimeout(unlock,40);
  }

  document.addEventListener('keydown',function(e){
    if(!active||!isChatField(e.target))return;
    if(e.key==='Enter'&&!e.shiftKey){
      setTimeout(finishChatEntry,30);
    }
  },true);

  document.addEventListener('click',function(e){
    if(!active)return;
    var b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!b)return;
    var t=String((b.getAttribute('aria-label')||'')+' '+(b.textContent||''));
    if(/채팅.*보내|보내기|send|➤|✈|↗/i.test(t)){
      setTimeout(finishChatEntry,30);
    }
  },true);

  document.addEventListener('pointerdown',function(e){
    if(isChatField(e.target)){
      rememberHeight();
      var screen=document.getElementById('screen');
      savedWinY=window.scrollY||window.pageYOffset||0;
      savedScreenY=screen?screen.scrollTop:0;
    }
  },true);

  document.addEventListener('focusin',function(e){
    if(isChatField(e.target))lock(e.target);
  },true);

  document.addEventListener('focusout',function(e){
    if(isChatField(e.target))setTimeout(unlock,100);
  },true);

  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',moveChatOnly);
    window.visualViewport.addEventListener('scroll',moveChatOnly);
  }

  window.addEventListener('resize',function(){
    if(!active)setTimeout(rememberHeight,80);
  });
  window.addEventListener('orientationchange',function(){
    stableH=0;
    setTimeout(rememberHeight,350);
  });

  rememberHeight();
  [100,400,1000].forEach(function(ms){setTimeout(rememberHeight,ms);});
})();