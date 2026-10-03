/* K-Talk 구독자방 + 비밀방 채팅 위치만 수정
   목표: 9명방처럼 매치/친구/메시지 버튼 바로 위에서 채팅 시작
   다른 방/버튼/스위치/게스트/방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktSubscriberSecretChatBottom20260919)return;
  window.__ktSubscriberSecretChatBottom20260919=true;

  function put(roomSel,chatSel,toolsSel,mark){
    try{
      var room=document.querySelector('#screen '+roomSel);
      if(!room)return;
      var chat=room.querySelector(chatSel);
      var match=room.querySelector(toolsSel+' > *:first-child');
      if(!chat||!match)return;

      /* 비밀방은 채팅이 ktsecret-main 안에 있으면 overflow에 걸릴 수 있으므로
         채팅 요소만 room 바로 아래로 이동한다. 다른 요소는 건드리지 않음. */
      if(roomSel==='.ktsecret-room'&&chat.parentElement!==room){
        room.appendChild(chat);
      }

      var rr=room.getBoundingClientRect();
      var mr=match.getBoundingClientRect();
      if(!rr.width||!mr.width)return;

      var h=72;
      var top=Math.round(mr.top-h-4);
      var left=Math.round(rr.left+8);
      var width=Math.max(180,Math.round(rr.width*0.58));

      chat.style.setProperty('position','fixed','important');
      chat.style.setProperty('left',left+'px','important');
      chat.style.setProperty('right','auto','important');
      chat.style.setProperty('top',top+'px','important');
      chat.style.setProperty('bottom','auto','important');
      chat.style.setProperty('width',width+'px','important');
      chat.style.setProperty('height',h+'px','important');
      chat.style.setProperty('min-height',h+'px','important');
      chat.style.setProperty('max-height',h+'px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('padding','0 6px 2px','important');
      chat.style.setProperty('display','flex','important');
      chat.style.setProperty('flex-direction','column','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
      chat.style.setProperty('background','transparent','important');
      chat.style.setProperty('border','0','important');
      chat.style.setProperty('box-shadow','none','important');
      chat.style.setProperty('transform','none','important');
      chat.style.setProperty('z-index','600','important');
      chat.style.setProperty('pointer-events','none','important');
      chat.dataset.ktBottomChat=mark;
    }catch(e){}
  }

  function apply(){
    put('.ktsubscriber-room','.ktsubscriber-chat','.ktsubscriber-tools','subscriber-bottom-v1');
    put('.ktsecret-room','.ktsecret-chat','.ktsecret-tools','secret-bottom-v1');
  }

  apply();
  [40,100,220,450,800,1400,2400].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSubscriberSecretChatBottomTimer);
      window.__ktSubscriberSecretChatBottomTimer=setTimeout(apply,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(apply,250);
  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
})();