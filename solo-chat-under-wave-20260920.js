/* K-Talk 1인방 채팅 위치 전용.
   매치/친구/메시지/장미/선물 버튼줄 바로 위에서 채팅이 시작해 위로 쌓이게 함.
   다른 방/버튼/카메라/선물/프로필/스위치는 변경하지 않음. */
(function(){
  if(window.__ktSoloChatAboveTools20260920)return;
  window.__ktSoloChatAboveTools20260920=true;

  function escCssPx(n){ return Math.max(0,Math.round(Number(n)||0))+'px'; }

  function place(){
    try{
      var room=document.querySelector('#screen .ktsolo-room');
      if(!room)return;
      var chat=document.getElementById('ktsoloChatList')||room.querySelector('.ktsolo-chat');
      var tools=room.querySelector('.ktsolo-tools');
      if(!chat||!tools)return;

      /* 채팅 요소만 room 바로 아래로 옮겨 메인 영상의 overflow 영향 제거 */
      if(chat.parentElement!==room)room.appendChild(chat);

      var rr=room.getBoundingClientRect();
      var tr=tools.getBoundingClientRect();
      if(!rr.width||!tr.width)return;

      var h=Math.min(180,Math.max(130,Math.round((rr.height||window.innerHeight)*0.16)));
      var gap=4;
      var top=Math.round(tr.top-h-gap);
      var left=Math.round(rr.left+10);
      var width=Math.max(210,Math.round(rr.width*0.62));

      chat.style.setProperty('position','fixed','important');
      chat.style.setProperty('left',escCssPx(left),'important');
      chat.style.setProperty('right','auto','important');
      chat.style.setProperty('top',escCssPx(top),'important');
      chat.style.setProperty('bottom','auto','important');
      chat.style.setProperty('width',escCssPx(width),'important');
      chat.style.setProperty('height',escCssPx(h),'important');
      chat.style.setProperty('min-height','0','important');
      chat.style.setProperty('max-height',escCssPx(h),'important');
      chat.style.setProperty('display','flex','important');
      chat.style.setProperty('flex-direction','column','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
      chat.style.setProperty('padding','0 5px 2px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('background','transparent','important');
      chat.style.setProperty('border','0','important');
      chat.style.setProperty('box-shadow','none','important');
      chat.style.setProperty('transform','none','important');
      chat.style.setProperty('z-index','700','important');
      chat.style.setProperty('pointer-events','none','important');
      chat.dataset.ktSoloChatAboveTools='1';

      try{chat.scrollTop=chat.scrollHeight;}catch(e){}

      /* 안내 문구가 별도 DOM으로 있으면 같은 시작선으로 내림 */
      var target='채팅을 입력하면 아래에서 위로 올라옵니다';
      room.querySelectorAll('*').forEach(function(el){
        if(el===chat||chat.contains(el)||el.children.length)return;
        var t=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(t!==target)return;
        el.style.setProperty('position','fixed','important');
        el.style.setProperty('left',escCssPx(left),'important');
        el.style.setProperty('right','auto','important');
        el.style.setProperty('top','auto','important');
        el.style.setProperty('bottom',escCssPx(Math.max(0,window.innerHeight-tr.top+6)),'important');
        el.style.setProperty('z-index','701','important');
        el.style.setProperty('background','transparent','important');
        el.style.setProperty('border','0','important');
        el.style.setProperty('pointer-events','none','important');
      });
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktSoloChatAboveToolsStyle20260920'))return;
    var s=document.createElement('style');
    s.id='ktSoloChatAboveToolsStyle20260920';
    s.textContent=
      '.ktsolo-chat-line{flex:0 0 auto!important;animation:ktSoloChatRiseFromTools .24s ease-out both!important}'+
      '@keyframes ktSoloChatRiseFromTools{from{opacity:.08;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }

  function run(){style();place();}
  run();
  [60,160,320,650,1200,2200].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloChatAboveToolsTimer);
      window.__ktSoloChatAboveToolsTimer=setTimeout(run,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(place,300);
  window.addEventListener('resize',place);
  window.addEventListener('orientationchange',function(){setTimeout(place,120);});
})();