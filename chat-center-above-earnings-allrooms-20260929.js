/* K-Talk 채팅 전용 단일 코드 2026-09-29
   요청 5555: 채팅만 수정.
   모든 방 호스트/게스트의 표시 채팅은 카메라·마이크·친구·메시지 하단 도구줄 바로 위에서 시작해 위로 쌓인다.
   수익률/카메라/마이크/버튼/영상/방 구조는 절대 변경하지 않음. */
(function(){
  if(window.__ktChatOnlyAboveBottomTools20260929)return;
  window.__ktChatOnlyAboveBottomTools20260929=true;

  var H=118;
  var GAP=4;

  function imp(el,k,v){
    if(el)el.style.setProperty(k,v,'important');
  }

  function place(chat,tools){
    if(!chat||!tools)return;
    var tr=tools.getBoundingClientRect();
    if(!tr.width)return;

    var vw=Math.min(window.innerWidth||9999,document.documentElement.clientWidth||9999);
    var width=Math.min(390,Math.max(230,Math.round(vw*0.88)));
    var top=Math.max(8,Math.round(tr.top-H-GAP));

    [
      ['position','fixed'],
      ['left','50%'],
      ['right','auto'],
      ['top',top+'px'],
      ['bottom','auto'],
      ['width',width+'px'],
      ['min-width','0'],
      ['max-width',width+'px'],
      ['height',H+'px'],
      ['min-height','0'],
      ['max-height',H+'px'],
      ['margin','0'],
      ['padding','0 8px 3px'],
      ['box-sizing','border-box'],
      ['display','flex'],
      ['flex-direction','column'],
      ['justify-content','flex-end'],
      ['align-items','stretch'],
      ['overflow','hidden'],
      ['background','transparent'],
      ['border','0'],
      ['box-shadow','none'],
      ['transform','translateX(-50%)'],
      ['z-index','2147482500'],
      ['pointer-events','none']
    ].forEach(function(p){imp(chat,p[0],p[1]);});

    try{chat.scrollTop=chat.scrollHeight;}catch(e){}
  }

  function placeHint(room,tools){
    if(!room||!tools)return;
    var tr=tools.getBoundingClientRect();
    if(!tr.width)return;
    var bottom=Math.max(0,Math.round(window.innerHeight-tr.top+8));

    room.querySelectorAll('*').forEach(function(el){
      if(el.children.length)return;
      var t=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(t!=='채팅을 입력하면 아래에서 위로 올라옵니다')return;
      imp(el,'position','fixed');
      imp(el,'left','50%');
      imp(el,'right','auto');
      imp(el,'top','auto');
      imp(el,'bottom',bottom+'px');
      imp(el,'transform','translateX(-50%)');
      imp(el,'width','max-content');
      imp(el,'max-width','88vw');
      imp(el,'text-align','center');
      imp(el,'z-index','2147482490');
      imp(el,'pointer-events','none');
      imp(el,'background','transparent');
      imp(el,'border','0');
      imp(el,'white-space','nowrap');
    });
  }

  function hosts(){
    var room,chat,tools;

    room=document.querySelector('#screen .ktsolo-room');
    if(room){
      chat=room.querySelector('.ktsolo-chat');
      tools=room.querySelector('.ktsolo-tools');
      place(chat,tools); placeHint(room,tools);
    }

    room=document.querySelector('#screen .ktg13-room');
    if(room){
      chat=room.querySelector('.ktg13-chat');
      tools=room.querySelector('.ktg13-tools');
      place(chat,tools); placeHint(room,tools);
    }

    room=document.querySelector('#screen .ktsubscriber-room');
    if(room){
      chat=room.querySelector('.ktsubscriber-chat');
      tools=room.querySelector('.ktsubscriber-tools');
      place(chat,tools); placeHint(room,tools);
    }

    room=document.querySelector('#screen .ktsecret-room');
    if(room){
      chat=room.querySelector('.ktsecret-chat');
      tools=room.querySelector('.ktsecret-tools');
      place(chat,tools); placeHint(room,tools);
    }
  }

  function guests(){
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      var tools=root.querySelector(':scope > .kt-remote-bottom');
      if(!tools)return;

      var hostlike=root.querySelector('.kt-guest-hostlike-room');
      if(hostlike){
        var chatbox=hostlike.querySelector('.kgh-chatbox');
        place(chatbox,tools);
        placeHint(hostlike,tools);
      }

      var display=root.querySelector('.kt-remote-chat-display,.kt-remote-chat-list,[data-kt-chat-display]');
      if(display)place(display,tools);
    });
  }

  function style(){
    if(document.getElementById('ktChatOnlyAboveBottomToolsStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktChatOnlyAboveBottomToolsStyle20260929';
    s.textContent=''
      +'.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.kgh-chatbox>div,'
      +'.kt-remote-chat-display>div,.kt-remote-chat-list>div,[data-kt-chat-display]>div{'
      +'flex:0 0 auto!important;font-size:11px!important;line-height:1.28!important;'
      +'text-shadow:0 1px 3px #000,0 0 5px #000!important;'
      +'animation:ktChatOnlyRise20260929 .22s ease-out both!important}'
      +'@keyframes ktChatOnlyRise20260929{'
      +'from{opacity:.08;transform:translateY(12px)}'
      +'to{opacity:1;transform:translateY(0)}}'
      +'@media(max-width:390px){'
      +'.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.kgh-chatbox>div,'
      +'.kt-remote-chat-display>div,.kt-remote-chat-list>div,[data-kt-chat-display]>div{font-size:10.5px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    style();
    hosts();
    guests();
  }

  apply();
  [20,80,180,400,900,1600].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,300);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktChatOnlyAboveBottomToolsTimer20260929);
      window.__ktChatOnlyAboveBottomToolsTimer20260929=setTimeout(apply,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('resize',function(){setTimeout(apply,30);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
})();