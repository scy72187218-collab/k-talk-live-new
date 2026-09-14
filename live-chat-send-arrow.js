/* K-Talk 원격 시청 채팅: 입력창 옆 전송 버튼 1개만 추가. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktRemoteChatSendArrowInstalled)return;
  window.__ktRemoteChatSendArrowInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktRemoteChatSendArrowStyle'))return;
    var s=document.createElement('style');
    s.id='ktRemoteChatSendArrowStyle';
    s.textContent=''
      +'.kt-remote-bottom #ktRemoteChatSend{font-size:0!important;font-weight:950!important;line-height:1!important}'
      +'.kt-remote-bottom #ktRemoteChatSend svg{width:20px!important;height:20px!important;display:block!important;fill:currentColor!important}'
      +'@media(max-width:390px){.kt-remote-bottom #ktRemoteChatSend svg{width:18px!important;height:18px!important}}';
    document.head.appendChild(s);
  }

  function apply(){
    ensureStyle();
    var bar=document.getElementById('ktRemoteBottom');
    var input=document.getElementById('ktRemoteChatInput');
    if(!bar||!input)return;
    if(document.getElementById('ktRemoteChatSend'))return;
    var existing=bar.querySelector('.kt-remote-action.send');
    if(existing){existing.id='ktRemoteChatSend';return;}

    var btn=document.createElement('button');
    btn.id='ktRemoteChatSend';
    btn.type='button';
    btn.className='kt-remote-action';
    btn.setAttribute('aria-label','채팅 보내기');
    btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 2.3a1 1 0 0 0-1-.24L3.2 8.15a1 1 0 0 0-.08 1.86l7.07 3.12 3.12 7.07a1 1 0 0 0 .91.6h.05a1 1 0 0 0 .91-.69l6.76-16.82a1 1 0 0 0-.24-.99ZM14.25 17.1l-2.13-4.83 5.27-5.27-6.42 4.15-4.07-1.79 11.84-4.12-4.49 11.86Z"/></svg>';
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

/* 원격 영상이 검게 멈출 때만 재연결 보강 파일 연결. */
(function(){
  if(document.querySelector('script[data-kt-remote-video-fallback]'))return;
  var s=document.createElement('script');
  s.src='remote-live-video-fallback-20260914.js?v=20260914-video2';
  s.async=false;
  s.setAttribute('data-kt-remote-video-fallback','1');
  document.head.appendChild(s);
})();

/* 일부 휴대폰에서 앞카메라 요청이 뒷카메라로 떨어질 때만 보강. */
(function(){
  if(document.querySelector('script[data-kt-front-camera-user-fallback]'))return;
  var s=document.createElement('script');
  s.src='front-camera-user-fallback-20260914.js?v=20260914-front1';
  s.async=false;
  s.setAttribute('data-kt-front-camera-user-fallback','1');
  document.head.appendChild(s);
})();
