/* K-Talk 13명방 채팅 위치만: 매치·친구·메시지 도구줄 바로 위에 맞춤.
   다른 방/영상/게스트/선물/수익/스위치 기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13ChatAboveTools20260919)return;
  window.__ktGroup13ChatAboveTools20260919=true;

  function isThirteen(room){
    try{
      if(!room)return false;
      if(room.getAttribute('data-kt-room')==='9')return false;
      var guests=room.querySelectorAll('.ktg13-guests > .ktg13-guest').length;
      if(guests>=12)return true;
      var m=Number((window.state&&state.liveRoomMax)||0);
      var n=String((window.state&&state.liveRoomName)||'');
      var t=String((window.state&&state.liveRoomType)||'');
      return m===13||t==='group13'||n.indexOf('13명')>-1;
    }catch(e){return false;}
  }

  function align(){
    try{
      var room=document.querySelector('#screen .ktg13-room');
      if(!isThirteen(room))return;
      var chat=room.querySelector('.ktg13-chat');
      var match=room.querySelector('.ktg13-tools .ktg13-tool:first-child');
      if(!chat||!match)return;

      chat.style.setProperty('position','absolute','important');
      chat.style.setProperty('top','auto','important');
      chat.style.setProperty('height','auto','important');
      chat.style.setProperty('min-height','0','important');
      chat.style.setProperty('max-height','105px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
      chat.style.setProperty('z-index','25','important');

      /* 다른 CSS가 준 이동값을 먼저 지우고 실제 매치 버튼 좌표 기준으로 맞춘다. */
      chat.style.setProperty('transform','none','important');
      var cr=chat.getBoundingClientRect();
      var mr=match.getBoundingClientRect();
      var delta=(mr.top-4)-cr.bottom;
      if(isFinite(delta)){
        delta=Math.max(-260,Math.min(260,delta));
        chat.style.setProperty('transform','translateY('+delta.toFixed(1)+'px)','important');
      }
      chat.dataset.ktGroup13ChatAboveTools='1';
    }catch(e){}
  }

  align();
  [40,100,220,450,800,1300,2200,3500].forEach(function(ms){setTimeout(align,ms);});
  setInterval(align,300);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup13ChatAboveToolsTimer);
      window.__ktGroup13ChatAboveToolsTimer=setTimeout(align,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('resize',function(){setTimeout(align,30);});
  window.addEventListener('orientationchange',function(){setTimeout(align,120);});
})();
