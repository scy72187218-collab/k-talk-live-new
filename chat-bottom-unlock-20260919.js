/* K-Talk 채팅 위치 전용 보정 (2026-09-19)
   채팅만 하단 버튼줄 바로 위로 내림.
   방 배치/카메라/게스트/선물/스위치/기타 기능은 변경하지 않음. */
(function(){
  if(window.__ktChatBottomUnlock20260919)return;
  window.__ktChatBottomUnlock20260919=true;

  function setImportant(el,k,v){
    try{el.style.setProperty(k,v,'important');}catch(e){}
  }

  function place(chat,room,tools,kind){
    if(!chat||!room||!tools)return;

    try{
      var rr=room.getBoundingClientRect();
      var tr=tools.getBoundingClientRect();
      if(!rr.width||!tr.width)return;

      var h=74;
      if(kind==='solo')h=82;
      if(kind==='remote')h=76;

      var top=Math.round(tr.top-h-3);
      var left=Math.round(rr.left+7);
      var width=Math.round(rr.width*.60);

      /* 1인방은 기존 오른쪽 수익표 공간 유지 */
      if(kind==='solo')width=Math.round(rr.width-132);

      /* 비밀방도 오른쪽 수익표 공간 유지 */
      if(kind==='secret')width=Math.round(rr.width*.58);

      /* 게스트 화면은 하단 툴바 너비에 맞춤 */
      if(kind==='remote')width=Math.round(rr.width*.66);

      if(top<rr.top+90)top=Math.round(rr.top+90);
      if(width<170)width=Math.max(170,Math.round(rr.width*.58));

      setImportant(chat,'position','fixed');
      setImportant(chat,'left',left+'px');
      setImportant(chat,'right','auto');
      setImportant(chat,'top',top+'px');
      setImportant(chat,'bottom','auto');
      setImportant(chat,'width',width+'px');
      setImportant(chat,'height',h+'px');
      setImportant(chat,'min-height',h+'px');
      setImportant(chat,'max-height',h+'px');
      setImportant(chat,'margin','0');
      setImportant(chat,'padding','1px 6px 2px');
      setImportant(chat,'display','flex');
      setImportant(chat,'flex-direction','column');
      setImportant(chat,'justify-content','flex-end');
      setImportant(chat,'overflow','hidden');
      setImportant(chat,'background','transparent');
      setImportant(chat,'border','0');
      setImportant(chat,'box-shadow','none');
      setImportant(chat,'transform','none');
      setImportant(chat,'z-index','150');

      /* 채팅 글은 표시용. 아래 버튼 터치를 막지 않게 유지 */
      setImportant(chat,'pointer-events','none');
      chat.dataset.ktChatBottomUnlock='1';
    }catch(e){}
  }

  function hostRooms(){
    var room,chat,tools;

    room=document.querySelector('#screen .ktsolo-room');
    if(room){
      chat=room.querySelector('#ktsoloChatList,.ktsolo-chat');
      tools=room.querySelector('.ktsolo-tools');
      place(chat,room,tools,'solo');
    }

    document.querySelectorAll('#screen .ktg13-room').forEach(function(r){
      var ch=r.querySelector('#ktg13ChatList,.ktg13-chat');
      var tl=r.querySelector('.ktg13-tools');
      place(ch,r,tl,r.getAttribute('data-kt-room')==='9'?'group9':'group13');
    });

    room=document.querySelector('#screen .ktsubscriber-room');
    if(room){
      chat=room.querySelector('#ktsubscriberChatList,.ktsubscriber-chat');
      tools=room.querySelector('.ktsubscriber-tools');
      place(chat,room,tools,'subscriber');
    }

    room=document.querySelector('#screen .ktsecret-room');
    if(room){
      chat=room.querySelector('#ktsecretChatList,.ktsecret-chat');
      tools=room.querySelector('.ktsecret-tools');
      place(chat,room,tools,'secret');
    }
  }

  function remoteRoom(){
    var room=document.querySelector('.kt-remote-live');
    if(!room)return;
    var chat=room.querySelector('.kt-remote-chat');
    var tools=room.querySelector('.kt-remote-bottom');
    if(chat&&tools)place(chat,room,tools,'remote');
  }

  function apply(){
    hostRooms();
    remoteRoom();
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});

  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
  window.addEventListener('pageshow',apply);
  if(window.visualViewport){
    try{window.visualViewport.addEventListener('resize',apply);}catch(e){}
  }

  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktChatBottomUnlockTimer);
      window.__ktChatBottomUnlockTimer=setTimeout(apply,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();