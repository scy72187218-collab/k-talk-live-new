/* K-Talk 2026-09-29 5555
   채팅 글/닉네임 터치 -> 그 사람에게 @답장 입력.
   기존 채팅 전송/방 배치/통신 코드는 수정하지 않는다. */
(function(){
  if(window.__ktChatReplyAllRooms20260929)return;
  window.__ktChatReplyAllRooms20260929=true;

  var LINE_SEL=[
    '.ktsolo-chat-line',
    '.ktg13-chat-line',
    '.ktsubscriber-chat-line',
    '.ktsecret-chat-line',
    '.kgh-chatbox>div',
    '.kt-remote-chat-display>div',
    '.kt-remote-chat-list>div',
    '[data-kt-chat-display]>div',
    '.kt-remote-chat>div'
  ].join(',');

  function cleanName(s){
    s=String(s||'').replace(/^@+/,'').replace(/[:：]\s*$/,'').trim();
    if(!s||s==='나'||s==='호스트'||s==='게스트')return s||'회원';
    return s.slice(0,30);
  }
  function senderOf(line){
    if(!line)return '';
    var n=line.getAttribute('data-sender-name')||line.getAttribute('data-name')||'';
    if(n)return cleanName(n);
    var el=line.querySelector('b,strong,.name,.nickname,[data-sender],[data-name]');
    if(el){
      n=el.getAttribute('data-sender')||el.getAttribute('data-name')||el.textContent||'';
      if(n)return cleanName(n);
    }
    var txt=String(line.textContent||'').trim();
    var m=txt.match(/^@?([^\s:：]{1,30})\s*[:：]/);
    if(m)return cleanName(m[1]);
    var first=txt.split(/\s+/)[0]||'';
    return cleanName(first);
  }
  function putMention(input,name){
    if(!input)return false;
    var mention='@'+name+' ';
    var cur=String(input.value||'');
    if(cur.indexOf(mention)!==0)input.value=mention+cur;
    try{input.focus();var p=input.value.length;input.setSelectionRange(p,p);}catch(e){}
    try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}
    return true;
  }
  function afterOpen(id,name){
    var tries=0;
    var tm=setInterval(function(){
      tries++;
      var input=document.getElementById(id);
      if(input&&putMention(input,name)){clearInterval(tm);return;}
      if(tries>12)clearInterval(tm);
    },40);
  }
  function reply(name,line){
    name=cleanName(name);
    if(!name)return;

    var input=document.getElementById('ktRemoteChatInput');
    if(input){putMention(input,name);return;}

    if(line.closest('.ktsolo-room')){
      if(typeof window.ktSoloOpenMessage==='function')window.ktSoloOpenMessage();
      afterOpen('ktsoloChatInput',name);return;
    }
    if(line.closest('.ktg13-room,.ktg9-room')){
      if(typeof window.ktGroup13OpenMessage==='function')window.ktGroup13OpenMessage();
      afterOpen('ktg13ChatInput',name);return;
    }
    if(line.closest('.ktsubscriber-room')){
      if(typeof window.ktSubscriberOpenMessage==='function')window.ktSubscriberOpenMessage();
      afterOpen('ktsubscriberChatInput',name);return;
    }
    if(line.closest('.ktsecret-room')){
      if(typeof window.ktSecretOpenMessage==='function'){
        window.ktSecretOpenMessage();
        afterOpen('ktsecretChatInput',name);return;
      }
    }

    /* 승인 게스트 화면: 현재 방의 기존 메시지 창을 그대로 사용 */
    var guest=line.closest('.kt-guest-hostlike-room');
    if(guest){
      if(typeof window.ktGroup13OpenMessage==='function'){
        window.ktGroup13OpenMessage();afterOpen('ktg13ChatInput',name);return;
      }
      if(typeof window.ktSoloOpenMessage==='function'){
        window.ktSoloOpenMessage();afterOpen('ktsoloChatInput',name);return;
      }
    }

    /* 마지막 안전 경로: 이미 열려 있는 채팅 입력칸 */
    var any=document.querySelector('#ktsoloChatInput,#ktg13ChatInput,#ktsubscriberChatInput,#ktsecretChatInput,#ktRemoteChatInput');
    if(any)putMention(any,name);
  }

  function onTap(e){
    var t=e.target&&e.target.closest?e.target.closest(LINE_SEL):null;
    if(!t)return;
    var name=senderOf(t);
    if(!name)return;
    try{e.preventDefault();e.stopPropagation();}catch(_e){}
    reply(name,t);
  }

  function style(){
    if(document.getElementById('ktChatReplyAllRoomsStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktChatReplyAllRoomsStyle20260929';
    s.textContent=
      '.ktsolo-chat,.ktg13-chat,.ktsubscriber-chat,.ktsecret-chat,.kgh-chatbox,.kt-remote-chat-display,.kt-remote-chat-list,[data-kt-chat-display],.kt-remote-chat{pointer-events:auto!important}'+
      LINE_SEL+'{pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important}'+
      LINE_SEL+' b,'+LINE_SEL+' strong{pointer-events:auto!important}';
    document.head.appendChild(s);
  }

  style();
  document.addEventListener('click',onTap,true);
})();