/* K-Talk 채팅 단일 통합 배치 2026-09-29
   호스트+게스트 공통: 표시 채팅은 수익률 박스 위 중앙에 공중으로 표시.
   채팅 입력/버튼/카메라/수익률 자체는 변경하지 않음. */
(function(){
  if(window.__ktChatCenterAboveEarningsAllRooms20260929)return;
  window.__ktChatCenterAboveEarningsAllRooms20260929=true;
  var H=96,GAP=7;
  function setImp(el,k,v){if(el)el.style.setProperty(k,v,'important');}
  function floatChat(chat,anchor){
    if(!chat||!anchor)return;
    var ar=anchor.getBoundingClientRect();
    if(!ar.width)return;
    var vw=Math.min(window.innerWidth||9999,document.documentElement.clientWidth||9999);
    var width=Math.min(360,Math.max(220,Math.round(vw*0.76)));
    var top=Math.max(8,Math.round(ar.top-H-GAP));
    [['position','fixed'],['left','50%'],['right','auto'],['top',top+'px'],['bottom','auto'],
     ['width',width+'px'],['min-width','0'],['max-width',width+'px'],
     ['height',H+'px'],['min-height','0'],['max-height',H+'px'],
     ['margin','0'],['padding','0 7px 3px'],['box-sizing','border-box'],
     ['display','flex'],['flex-direction','column'],['justify-content','flex-end'],['align-items','stretch'],
     ['overflow','hidden'],['background','transparent'],['border','0'],['box-shadow','none'],
     ['transform','translateX(-50%)'],['z-index','2147482990'],['pointer-events','none']]
     .forEach(function(p){setImp(chat,p[0],p[1]);});
    try{chat.scrollTop=chat.scrollHeight;}catch(e){}
  }
  function host(){
    var room,chat,earn;
    room=document.querySelector('#screen .ktsolo-room');
    if(room){chat=room.querySelector('.ktsolo-chat');earn=room.querySelector('.ktsolo-earn #myEarnHud');floatChat(chat,earn);}
    room=document.querySelector('#screen .ktg13-room');
    if(room){chat=room.querySelector('.ktg13-chat');earn=room.querySelector('.ktg13-earn #myEarnHud');floatChat(chat,earn);}
    room=document.querySelector('#screen .ktsubscriber-room');
    if(room){chat=room.querySelector('.ktsubscriber-chat');earn=room.querySelector('#ktSubscriberEarnHud');floatChat(chat,earn);}
    room=document.querySelector('#screen .ktsecret-room');
    if(room){chat=room.querySelector('.ktsecret-chat');earn=room.querySelector('.ktsecret-earn-row #myEarnHud');floatChat(chat,earn);}
  }
  function guests(){
    document.querySelectorAll('#screen .kt-guest-hostlike-room').forEach(function(room){
      var chat=room.querySelector('.kgh-chatbox');
      var earn=room.querySelector('#ktGuestEarnHud,.kgh-earn');
      floatChat(chat,earn);
    });
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      var display=root.querySelector('.kt-remote-chat-display,.kt-remote-chat-list,[data-kt-chat-display]');
      if(!display)return;
      var earn=root.querySelector('#ktGuestEarnHud,#ktAllRoomGuestEarnHud20260921,.kgh-earn');
      if(earn){floatChat(display,earn);return;}
      var tools=root.querySelector('.kt-remote-bottom');
      if(!tools)return;
      var tr=tools.getBoundingClientRect();
      var fake={getBoundingClientRect:function(){return {top:tr.top-54,width:110};}};
      floatChat(display,fake);
    });
  }
  function style(){
    if(document.getElementById('ktChatCenterAboveEarningsStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktChatCenterAboveEarningsStyle20260929';
    s.textContent=''
      +'.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.kgh-chatbox>div{'
      +'flex:0 0 auto!important;font-size:11px!important;line-height:1.25!important;text-align:left!important;'
      +'text-shadow:0 1px 3px #000,0 0 5px #000!important;animation:ktChatCenterRise20260929 .22s ease-out both!important}'
      +'@keyframes ktChatCenterRise20260929{from{opacity:.08;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}'
      +'@media(max-width:390px){.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.kgh-chatbox>div{font-size:10.5px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }
  function apply(){style();host();guests();}
  apply();
  [20,80,180,400,900,1600].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,250);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktChatCenterAboveEarningsTimer20260929);
      window.__ktChatCenterAboveEarningsTimer20260929=setTimeout(apply,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(apply,30);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
})();