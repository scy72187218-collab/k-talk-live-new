/* K-Talk 원격 시청 채팅: 입력창 옆 전송 화살표 1개만 추가. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktRemoteChatSendArrowInstalled)return;
  window.__ktRemoteChatSendArrowInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktRemoteChatSendArrowStyle'))return;
    var s=document.createElement('style');
    s.id='ktRemoteChatSendArrowStyle';
    s.textContent=''
      +'.kt-remote-bottom #ktRemoteChatSend{font-size:22px!important;font-weight:950!important;line-height:1!important}'
      +'@media(max-width:390px){.kt-remote-bottom #ktRemoteChatSend{font-size:20px!important}}';
    document.head.appendChild(s);
  }

  function apply(){
    ensureStyle();
    var bar=document.getElementById('ktRemoteBottom');
    var input=document.getElementById('ktRemoteChatInput');
    if(!bar||!input)return;
    if(document.getElementById('ktRemoteChatSend'))return;

    var btn=document.createElement('button');
    btn.id='ktRemoteChatSend';
    btn.type='button';
    btn.className='kt-remote-action';
    btn.setAttribute('aria-label','채팅 보내기');
    btn.textContent='↑';
    btn.addEventListener('click',function(){
      if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();
    });
    input.insertAdjacentElement('afterend',btn);
  }

  var obs=new MutationObserver(function(){setTimeout(apply,0);});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',apply);
  setTimeout(apply,0);
})();
