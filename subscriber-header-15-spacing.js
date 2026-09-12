/* 구독자방 상단만 수정: 15명 표시 + 출석체크를 제목에서 조금 오른쪽으로 띄움. 다른 화면/버튼은 변경하지 않음. */
(function(){
  if(window.__ktSubscriberHeader15SpacingInstalled)return;
  window.__ktSubscriberHeader15SpacingInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSubscriberHeader15SpacingStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberHeader15SpacingStyle';
    s.textContent=''
      +'.ktsubscriber-room .ktsubscriber-att{transform:translateX(16px)!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-att{transform:translateX(10px)!important}}';
    document.head.appendChild(s);
  }

  function apply(){
    ensureStyle();
    var room=document.querySelector('.ktsubscriber-room');
    if(!room)return;
    var title=room.querySelector('.ktsubscriber-title');
    if(title&&title.textContent.indexOf('15명')<0){
      title.innerHTML='<i>●</i> 구독자 방송 15명';
    }
  }

  apply();
  setTimeout(apply,80);
  setTimeout(apply,250);
  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
})();