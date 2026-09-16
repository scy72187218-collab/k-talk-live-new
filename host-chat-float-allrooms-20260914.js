/* K-Talk 호스트 방송 화면 채팅 높이/위치만 보강: 1인·9명·13명·구독자·비밀방 공통. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktHostChatFloatAllRooms20260914)return;
  window.__ktHostChatFloatAllRooms20260914=true;

  function install(){
    if(document.getElementById('ktHostChatFloatAllRoomsStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostChatFloatAllRoomsStyle';
    s.textContent=''
      /* 1인 방송: 카메라 위 채팅을 어깨 높이까지 위로 쌓이게 */
      +'.ktsolo-main{position:relative!important}'
      +'.ktsolo-chat{left:8px!important;right:120px!important;bottom:70px!important;height:min(36vh,280px)!important;max-height:min(36vh,280px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 5px 7px!important;background:transparent!important;border-radius:0!important;z-index:12!important;pointer-events:none!important}'
      +'.ktsolo-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsolo-chat-line b,.ktsolo-chat-line span{font-size:11.5px!important}'

      /* 9명/13명 방송: 아래 짧은 칸이 아니라 메인 화면 위로 떠서 위쪽까지 표시 */
      +'.ktg13-mid{position:relative!important;overflow:visible!important}'
      +'.ktg13-chat{position:absolute!important;left:6px!important;right:auto!important;bottom:0!important;width:57%!important;height:min(35vh,285px)!important;max-height:min(35vh,285px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 6px 7px!important;background:transparent!important;border-radius:0!important;z-index:35!important;pointer-events:none!important}'
      +'.ktg13-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktg13-chat-line b,.ktg13-chat-line span{font-size:11.5px!important}'
      +'.ktg13-chat .ktGuestPendingLine{pointer-events:auto!important}'

      /* 구독자 방송: 정보칸 안에 갇히지 않고 화면 위로 떠서 표시 */
      +'.ktsubscriber-main{position:relative!important}'
      +'.ktsubscriber-info{overflow:visible!important;position:relative!important;z-index:12!important}'
      +'.ktsubscriber-leftinfo{overflow:visible!important;position:relative!important}'
      +'.ktsubscriber-chat{position:absolute!important;left:5px!important;right:4px!important;bottom:0!important;width:auto!important;height:min(35vh,285px)!important;max-height:min(35vh,285px)!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 5px 7px!important;background:transparent!important;border-radius:0!important;z-index:20!important;pointer-events:none!important}'
      +'.ktsubscriber-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsubscriber-chat-line b,.ktsubscriber-chat-line span{font-size:11.5px!important}'

      /* 비밀방: 기존 위치는 유지하고 높이만 같은 느낌으로 위까지 확장 */
      +'.ktsecret-main{position:relative!important}'
      +'.ktsecret-chat{bottom:70px!important;height:min(38vh,300px)!important;max-height:min(38vh,300px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;background:transparent!important;z-index:22!important;pointer-events:none!important}'
      +'.ktsecret-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsecret-chat-line b,.ktsecret-chat-line span{font-size:11.5px!important}'

      +'@media(max-width:390px){'
        +'.ktsolo-chat{right:105px!important;bottom:64px!important;height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktg13-chat{left:4px!important;width:60%!important;height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktsubscriber-chat{height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktsecret-chat{bottom:64px!important;height:min(36vh,270px)!important;max-height:min(36vh,270px)!important}'
        +'.ktsolo-chat-line,.ktsolo-chat-line b,.ktsolo-chat-line span,.ktg13-chat-line,.ktg13-chat-line b,.ktg13-chat-line span,.ktsubscriber-chat-line,.ktsubscriber-chat-line b,.ktsubscriber-chat-line span,.ktsecret-chat-line,.ktsecret-chat-line b,.ktsecret-chat-line span{font-size:10.5px!important}'
      +'}';
    document.head.appendChild(s);
  }

  install();
  document.addEventListener('DOMContentLoaded',install);
})();

/* 2026-09-15 구독자방 채팅만 보강: 글이 아래에서 계속 쌓여 위로 밀리고, 맨 위를 지난 글만 사라지게 한다. */
(function(){
  if(window.__ktSubscriberChatContinuousFlow20260915)return;
  window.__ktSubscriberChatContinuousFlow20260915=true;

  var syncing=false;
  var lastKey='';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function ensureStyle(){
    if(document.getElementById('ktSubscriberChatContinuousFlowStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberChatContinuousFlowStyle';
    s.textContent=''
      +'.ktsubscriber-chat-line{flex:0 0 auto!important;opacity:1!important;visibility:visible!important;}'
      +'.ktsubscriber-chat-line.kt-chat-new{animation:ktSubscriberChatRiseIn .22s ease-out both!important;}'
      +'@keyframes ktSubscriberChatRiseIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }

  function syncSubscriberChat(){
    var box=document.getElementById('ktsubscriberChatList');
    if(!box||syncing)return;
    var msgs=window.ktSubscriberChatMessages;
    if(!Array.isArray(msgs)||!msgs.length)return;

    var view=msgs.slice(-24);
    var key=view.map(function(m,i){return i+'|'+String(m&&m.name||'')+'|'+String(m&&m.text||'');}).join('\u0001');
    var currentCount=box.querySelectorAll('.ktsubscriber-chat-line').length;
    if(key===lastKey&&currentCount===view.length)return;

    syncing=true;
    box.innerHTML=view.map(function(m){
      return '<div class="ktsubscriber-chat-line"><b>'+esc(m&&m.name||'나')+'</b><span>'+esc(m&&m.text||'')+'</span></div>';
    }).join('');
    var lines=box.querySelectorAll('.ktsubscriber-chat-line');
    if(lines.length)lines[lines.length-1].classList.add('kt-chat-new');
    box.scrollTop=box.scrollHeight;
    lastKey=key;
    syncing=false;
  }

  function attach(){
    ensureStyle();
    var box=document.getElementById('ktsubscriberChatList');
    if(!box)return;
    if(!box.__ktContinuousChatObserver){
      box.__ktContinuousChatObserver=new MutationObserver(function(){
        setTimeout(syncSubscriberChat,0);
      });
      box.__ktContinuousChatObserver.observe(box,{childList:true,subtree:false});
    }
    syncSubscriberChat();
  }

  attach();
  [100,300,700,1200].forEach(function(ms){setTimeout(attach,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSubscriberChatAttachTimer);
      window.__ktSubscriberChatAttachTimer=setTimeout(attach,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 2026-09-15 호스트 방송 채팅: 모든 방에서 아래에서 위로 올라가고 약 7줄만 남긴 뒤 오래된 글은 사라지게 한다. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktHostChatSevenLineFlow20260915)return;
  window.__ktHostChatSevenLineFlow20260915=true;

  var configs=[
    {box:'.ktsolo-chat',line:'.ktsolo-chat-line'},
    {box:'.ktg13-chat',line:'.ktg13-chat-line'},
    {box:'.ktsubscriber-chat',line:'.ktsubscriber-chat-line'},
    {box:'.ktsecret-chat',line:'.ktsecret-chat-line'}
  ];

  function ensureStyle(){
    if(document.getElementById('ktHostChatSevenLineFlowStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostChatSevenLineFlowStyle';
    s.textContent=''
      +'.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line{flex:0 0 auto!important;opacity:1!important;visibility:visible!important;transition:transform .22s ease,opacity .22s ease!important}'
      +'.kt-host-chat-new{animation:ktHostChatFloatUp .24s ease-out both!important}'
      +'@keyframes ktHostChatFloatUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }

  function trim(box,lineSelector){
    if(!box||box.__ktSevenLineTrimming)return;
    box.__ktSevenLineTrimming=true;
    try{
      var lines=[].slice.call(box.querySelectorAll(lineSelector));
      while(lines.length>7){
        var old=lines.shift();
        if(old&&old.parentNode===box)old.parentNode.removeChild(old);
      }
      if(lines.length){
        var newest=lines[lines.length-1];
        if(newest&&!newest.dataset.ktFloatSeen){
          newest.dataset.ktFloatSeen='1';
          newest.classList.add('kt-host-chat-new');
          setTimeout(function(){try{newest.classList.remove('kt-host-chat-new');}catch(e){}},320);
        }
      }
      box.scrollTop=box.scrollHeight;
    }catch(e){}
    box.__ktSevenLineTrimming=false;
  }

  function attachOne(cfg){
    document.querySelectorAll(cfg.box).forEach(function(box){
      trim(box,cfg.line);
      if(box.__ktSevenLineObserver)return;
      box.__ktSevenLineObserver=new MutationObserver(function(){
        setTimeout(function(){trim(box,cfg.line);},0);
      });
      box.__ktSevenLineObserver.observe(box,{childList:true,subtree:false});
    });
  }

  function attach(){
    ensureStyle();
    configs.forEach(attachOne);
  }

  attach();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(attach,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktHostChatSevenAttachTimer);
      window.__ktHostChatSevenAttachTimer=setTimeout(attach,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
