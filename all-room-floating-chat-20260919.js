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
  animation:none!important;transition:none!important;opacity:1!important;
}
@keyframes ktChatFloatUp{
  from{transform:translateY(10px);opacity:.15}
  to{transform:translateY(0);opacity:1}
}

/* 13명방: 메시지 수에 관계없이 행을 압축하지 않고 경계 안에서 위로 쌓는다. */
#screen .ktg13-room .ktg13-chat-line,
#screen .kt-remote-live .kt-remote-chat-line{flex:0 0 auto!important;min-height:min-content!important;overflow-wrap:anywhere!important}
#screen .ktg13-room[data-kt-room="13"] .ktg13-chat-line span{min-width:0!important;overflow-wrap:anywhere!important}

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
  function placeNineChat(){placeThirteenHostChat();}

  function guestBottom(grid){
    var cells=grid.querySelectorAll?grid.querySelectorAll('.ktg13-host,.ktg13-guest'):[];
    var bottom=0;
    cells.forEach(function(cell){var r=cell.getBoundingClientRect();if(r.width&&r.height)bottom=Math.max(bottom,r.bottom);});
    return bottom||grid.getBoundingClientRect().bottom;
  }

  function placeThirteenGuestChat(){
    try{
      var root=document.querySelector('#screen .kt-remote-live');
      if(!root)return;
      var room=root.querySelector('.ktg13-room[data-kt-room="13"],.ktg13-room[data-kt-room="9"]');
      var chat=root.querySelector('#ktRemoteChatList'),bar=root.querySelector('#ktRemoteBottom');
      var grid=room&&room.querySelector('.ktg13-main');
      if(!room||!chat||!bar||!grid)return;
      var rr=room.getBoundingClientRect(),br=bar.getBoundingClientRect(),gr=grid.getBoundingClientRect();
      if(!rr.width||!br.height)return;
      if(chat.parentElement&&chat.parentElement!==root)root.appendChild(chat);
      var top=Math.round(guestBottom(grid)+4),height=Math.max(0,Math.round(br.top-4)-top);
      var values={position:'fixed',left:Math.round(rr.left+8)+'px',right:'auto',top:top+'px',bottom:'auto',
        width:Math.max(0,Math.round(rr.width)-16)+'px',height:height+'px','min-height':height+'px','max-height':height+'px',
        'box-sizing':'border-box',padding:'0 4px',margin:'0',display:'flex','flex-direction':'column','justify-content':'flex-end',
        overflow:'hidden',background:'transparent',border:'0',transform:'none','z-index':'500','pointer-events':'none'};
      Object.keys(values).forEach(function(key){if(chat.style.getPropertyValue(key)!==values[key])chat.style.setProperty(key,values[key],'important');});
    }catch(e){}
  }

  function placeThirteenHostChat(){
    placeThirteenGuestChat();
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="13"],#screen .ktg13-room[data-kt-room="9"]');
      if(!room||room.closest('.kt-remote-live')||room.hasAttribute('data-kt-remote13'))return;
      var chat=room.querySelector('.ktg13-chat');
      var tools=room.querySelector('.ktg13-tools');
      var grid=room.querySelector('.ktg13-main');
      if(!chat||!tools||!grid)return;
      var rr=room.getBoundingClientRect(),tr=tools.getBoundingClientRect(),gr=grid.getBoundingClientRect();
      if(!rr.width||!tr.height)return;
      if(chat.parentElement&&chat.parentElement!==room)room.appendChild(chat);
      var top=Math.round(guestBottom(grid)+4);
      var height=Math.max(0,Math.round(tr.top-4)-top);
      var values={
        position:'fixed',left:Math.round(rr.left+8)+'px',right:'auto',
        top:top+'px',bottom:'auto',
        width:Math.max(0,Math.round(rr.width)-16)+'px',
        height:height+'px','min-height':height+'px','max-height':height+'px',
        'box-sizing':'border-box',padding:'0 4px',margin:'0',
        display:'flex','flex-direction':'column','justify-content':'flex-end',
        overflow:'hidden',background:'transparent',border:'0',
        transform:'none','z-index':'500','pointer-events':'none'
      };
      Object.keys(values).forEach(function(key){
        if(chat.style.getPropertyValue(key)!==values[key])chat.style.setProperty(key,values[key],'important');
      });
    }catch(e){}
  }

  function placeSubscriberChat(){
    try{
      var room=document.querySelector('#screen .ktsubscriber-room');
      if(!room)return;
      var chat=room.querySelector('.ktsubscriber-chat');
      var match=room.querySelector('.ktsubscriber-tools .ktsubscriber-tool:first-child');
      if(!chat||!match)return;

      /* 구독자방 채팅만: 매치/친구/메시지/장미 버튼줄 바로 위에서 시작 */
      var mr=match.getBoundingClientRect();
      var rr=room.getBoundingClientRect();
      var h=72;
      var top=Math.round(mr.top-h-4);
      if(!isFinite(top))return;

      chat.style.setProperty('position','fixed','important');
      chat.style.setProperty('left',Math.round(rr.left+8)+'px','important');
      chat.style.setProperty('right','auto','important');
      chat.style.setProperty('top',top+'px','important');
      chat.style.setProperty('bottom','auto','important');
      chat.style.setProperty('width',Math.max(180,Math.round((rr.width||window.innerWidth)*0.58))+'px','important');
      chat.style.setProperty('height',h+'px','important');
      chat.style.setProperty('min-height',h+'px','important');
      chat.style.setProperty('max-height',h+'px','important');
      chat.style.setProperty('padding','0 6px 2px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('display','flex','important');
      chat.style.setProperty('flex-direction','column','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
      chat.style.setProperty('background','transparent','important');
      chat.style.setProperty('border','0','important');
      chat.style.setProperty('box-shadow','none','important');
      chat.style.setProperty('transform','none','important');
      chat.style.setProperty('z-index','500','important');
      chat.style.setProperty('pointer-events','none','important');
      chat.dataset.ktSubscriberChatAtMatch='fixed-exact-above-match-20260919-v1';
    }catch(e){}
  }

  window.__ktNineChatMatchTop20260919=true;

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
    placeThirteenHostChat();
    placeSubscriberChat();
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
  window.addEventListener('resize',function(){setTimeout(function(){placeNineChat();placeThirteenHostChat();placeSubscriberChat();},30);});
  window.addEventListener('orientationchange',function(){setTimeout(function(){placeNineChat();placeThirteenHostChat();placeSubscriberChat();},120);});
  window.__ktNineChatExactFollowTimer20260919=setInterval(function(){placeNineChat();placeThirteenHostChat();placeSubscriberChat();},300);

  /* 2026-10-03: keep chat stable in every room.
     Do not periodically hide host chat; that fought other room scripts and caused flicker. */
  var __ktHostChatHiddenOnly20261003=false;
  function ktKeepChatStable20261003(){
    var sel='#screen .ktsolo-room .ktsolo-chat,#screen .ktg13-room .ktg13-chat,#screen .ktsubscriber-room .ktsubscriber-chat,#screen .ktsecret-room .ktsecret-chat,#screen .ktsecret-room .ktsecret-chat-compose,#screen .kt-remote-live .kt-remote-chat,#screen .kt-guest-hostlike-room .kgh-chatbox';
    document.querySelectorAll(sel).forEach(function(el){
      el.style.setProperty('visibility','visible','important');
      el.style.setProperty('opacity','1','important');
      el.style.setProperty('animation','none','important');
      el.style.setProperty('transition','none','important');
    });
  }
  setTimeout(ktKeepChatStable20261003,50);
  setInterval(ktKeepChatStable20261003,1000);
})();
