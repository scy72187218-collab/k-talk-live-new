/* K-Talk 모든 방송방 채팅: 아래에서 시작해 화면 위에 떠서 보이도록 정리.
   채팅 위치/표시만 변경. 카메라·게스트·선물·수익·스위치·방송 로직은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomFloatingChat20260919)return;
  window.__ktAllRoomFloatingChat20260919=true;

  function install(){
    if(document.getElementById('ktAllRoomFloatingChatStyle'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomFloatingChatStyle';
    s.textContent=`
/* 공통: 채팅은 투명하게, 아래 정렬, 새 글은 아래에서 살짝 올라오며 표시 */
.ktsolo-chat,.ktg13-chat,.ktsubscriber-chat,.ktsecret-chat,
.kt-remote-chat,.kgh-chatbox{
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
}
.ktsolo-chat,.ktg13-chat,.ktsubscriber-chat,.ktsecret-chat,.kgh-chatbox{
  display:flex!important;
  flex-direction:column!important;
  justify-content:flex-end!important;
}
.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,
.kgh-chatbox>div{
  text-shadow:0 1px 3px #000,0 0 5px #000!important;
}
.ktsolo-chat-line:last-child,.ktg13-chat-line:last-child,
.ktsubscriber-chat-line:last-child,.ktsecret-chat-line:last-child,
.kgh-chatbox>div:last-child{
  animation:ktChatFloatUp .24s ease-out both!important;
}
@keyframes ktChatFloatUp{
  from{transform:translateY(10px);opacity:.15}
  to{transform:translateY(0);opacity:1}
}

/* 1인방/비밀방은 현재 정상 위치를 그대로 유지하고 떠 보이는 표시만 적용 */
.ktsolo-chat,.ktsecret-chat{
  z-index:18!important;
  overflow:hidden!important;
  pointer-events:none!important;
}

/* 9명방/13명방: 기존 채팅 전용 줄에 갇히지 않고
   장미/도구 바로 위에서 화면 위로 떠서 보이게 */
.ktg13-room{position:relative!important}
.ktg13-room .ktg13-chat{
  position:absolute!important;
  left:8px!important;
  right:40%!important;
  bottom:108px!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  max-height:96px!important;
  padding:4px 6px 5px!important;
  overflow:hidden!important;
  z-index:18!important;
  pointer-events:none!important;
  transform:none!important;
}
.ktg13-room[data-kt-room="9"] .ktg13-chat{
  bottom:58px!important;
}

/* 구독자방: 채팅을 하단 선물/도구 바로 위 영상 위에 띄움 */
.ktsubscriber-room{position:relative!important}
.ktsubscriber-room .ktsubscriber-chat{
  position:absolute!important;
  left:8px!important;
  right:112px!important;
  bottom:108px!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  max-height:94px!important;
  padding:4px 6px 5px!important;
  overflow:hidden!important;
  z-index:18!important;
  pointer-events:none!important;
  transform:none!important;
}

/* 게스트 화면 채팅도 검은 박스 없이 하단에서 위로 보이게 */
.kt-remote-live .kt-remote-chat{
  background:transparent!important;
  box-shadow:none!important;
}
.kt-guest-hostlike-room .kgh-chat{
  background:transparent!important;
}
.kt-guest-hostlike-room .kgh-chatbox{
  align-self:flex-end!important;
  max-height:60px!important;
  overflow:hidden!important;
}

@media(max-width:390px){
  .ktg13-room .ktg13-chat{
    left:5px!important;
    right:41%!important;
    bottom:101px!important;
    max-height:88px!important;
    padding-left:3px!important;
    padding-right:3px!important;
  }
  .ktg13-room[data-kt-room="9"] .ktg13-chat{
    bottom:54px!important;
  }
  .ktsubscriber-room .ktsubscriber-chat{
    left:5px!important;
    right:104px!important;
    bottom:101px!important;
    max-height:86px!important;
  }
}
`;
    document.head.appendChild(s);
  }

  /* 9명방 채팅의 마지막 줄을 하단 '매치' 버튼 바로 위에 맞춘다.
     다른 방/버튼/게스트칸은 건드리지 않음. */
  function placeNineChat(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var chat=room.querySelector('.ktg13-chat');
      var match=room.querySelector('.ktg13-tools .ktg13-tool:first-child');
      if(!chat||!match)return;

      /* 9명 호스트방만: 채팅 최신 줄을 실제 화면의 '매치' 버튼 바로 위 4px에 맞춤. */
      chat.style.setProperty('position','absolute','important');
      chat.style.setProperty('left','8px','important');
      chat.style.setProperty('right','40%','important');
      chat.style.setProperty('top','auto','important');
      chat.style.setProperty('bottom','58px','important');
      chat.style.setProperty('height','auto','important');
      chat.style.setProperty('min-height','0','important');
      chat.style.setProperty('max-height','96px','important');
      chat.style.setProperty('padding','0 6px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('transform','none','important');

      /* 기존 CSS/브라우저 하단바 높이가 달라도 실제 좌표를 재서 자동 보정 */
      var last=chat.lastElementChild;
      var cr=(last||chat).getBoundingClientRect();
      var mr=match.getBoundingClientRect();
      var delta=(mr.top-4)-cr.bottom;
      if(isFinite(delta)){
        delta=Math.max(-180,Math.min(180,delta));
        chat.style.setProperty('transform','translateY('+delta.toFixed(1)+'px)','important');
      }
      chat.dataset.ktNineChatAtMatch='1';
    }catch(e){}
  }
  window.__ktNineChatMatchTop20260919=true;

  /* 13명방/구독방/비밀방도 최신 채팅 줄의 끝을
     맨 아래 '매치 · 친구 · 메시지' 도구줄 바로 위 4px에 맞춘다.
     세 방의 채팅 위치만 조정하고 다른 UI/기능은 변경하지 않는다. */
  function placeChatAboveTools(roomSel,chatSel,matchSel,mark){
    try{
      var room=document.querySelector('#screen '+roomSel);
      if(!room)return;
      var chat=room.querySelector(chatSel);
      var match=room.querySelector(matchSel);
      if(!chat||!match)return;

      chat.style.setProperty('position','absolute','important');
      chat.style.setProperty('top','auto','important');
      chat.style.setProperty('height','auto','important');
      chat.style.setProperty('min-height','0','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('margin','0','important');

      /* 먼저 기존 변환을 지운 뒤 실제 화면 좌표로 정확히 맞춤 */
      chat.style.setProperty('transform','none','important');
      var last=chat.lastElementChild;
      var cr=(last||chat).getBoundingClientRect();
      var mr=match.getBoundingClientRect();
      var delta=(mr.top-4)-cr.bottom;
      if(isFinite(delta)){
        delta=Math.max(-220,Math.min(220,delta));
        chat.style.setProperty('transform','translateY('+delta.toFixed(1)+'px)','important');
      }
      chat.dataset[mark]='1';
    }catch(e){}
  }

  function placeRequestedChats(){
    /* 13명방만: 9명방은 위의 전용 보정이 따로 있음 */
    var r13=document.querySelector('#screen .ktg13-room:not([data-kt-room="9"])');
    if(r13)placeChatAboveTools('.ktg13-room:not([data-kt-room="9"])','.ktg13-chat','.ktg13-tools .ktg13-tool:first-child','ktChatAtTools');
    placeChatAboveTools('.ktsubscriber-room','.ktsubscriber-chat','.ktsubscriber-tools .ktsubscriber-tool:first-child','ktChatAtTools');
    placeChatAboveTools('.ktsecret-room','.ktsecret-chat','.ktsecret-tools .ktsecret-tool:first-child','ktChatAtTools');
  }

  function keepBottom(){
    [
      document.getElementById('ktsoloChatList'),
      document.getElementById('ktg13ChatList'),
      document.getElementById('ktsubscriberChatList'),
      document.getElementById('ktsecretChatList')
    ].forEach(function(box){
      if(!box)return;
      try{box.scrollTop=box.scrollHeight;}catch(e){}
    });
    placeNineChat();
    placeRequestedChats();
  }

  install();
  keepBottom();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(function(){install();keepBottom();},ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomFloatingChatTimer);
      window.__ktAllRoomFloatingChatTimer=setTimeout(keepBottom,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(function(){placeNineChat();placeRequestedChats();},30);});
  window.addEventListener('orientationchange',function(){setTimeout(function(){placeNineChat();placeRequestedChats();},120);});
})();