/* K-Talk 원격 시청 하단: 채팅 전송 종이비행기와 방송 참여 신청 버튼만 보강. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktRemoteChatSendArrowInstalled)return;
  window.__ktRemoteChatSendArrowInstalled=true;

  var planeSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 2.3a1 1 0 0 0-1-.24L3.2 8.15a1 1 0 0 0-.08 1.86l7.07 3.12 3.12 7.07a1 1 0 0 0 .91.6h.05a1 1 0 0 0 .91-.69l6.76-16.82a1 1 0 0 0-.24-.99ZM14.25 17.1l-2.13-4.83 5.27-5.27-6.42 4.15-4.07-1.79 11.84-4.12-4.49 11.86Z"/></svg>';
  var peopleSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6.5 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20c0-4 3.1-7 7-7s7 3 7 7v1H2v-1Zm13.4-6.4c3.5.4 6.1 2.9 6.6 6.4H18c-.1-2.5-1-4.7-2.6-6.4Z"/></svg>';

  function ensureStyle(){
    if(document.getElementById('ktRemoteChatSendArrowStyle'))return;
    var s=document.createElement('style');
    s.id='ktRemoteChatSendArrowStyle';
    s.textContent=''
      +'.kt-remote-bottom #ktRemoteChatSend{font-size:0!important;font-weight:950!important;line-height:1!important}'
      +'.kt-remote-bottom #ktRemoteChatSend svg{width:23px!important;height:23px!important;display:block!important;fill:currentColor!important}'
      +'.kt-remote-bottom #ktRemoteGuestRequest{font-size:0!important;color:#77e7ff!important}'
      +'.kt-remote-bottom #ktRemoteGuestRequest svg{width:24px!important;height:24px!important;display:block!important;fill:currentColor!important}'
      +'.kt-remote-bottom .kt-remote-action.heart{display:none!important}'
      +'@media(max-width:390px){.kt-remote-bottom #ktRemoteChatSend svg{width:21px!important;height:21px!important}.kt-remote-bottom #ktRemoteGuestRequest svg{width:22px!important;height:22px!important}}';
    document.head.appendChild(s);
  }

  function ensureSend(bar,input){
    var btn=document.getElementById('ktRemoteChatSend')||bar.querySelector('.kt-remote-action.send');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-remote-action send';
      input.insertAdjacentElement('afterend',btn);
    }
    btn.id='ktRemoteChatSend';
    btn.classList.add('kt-remote-action','send');
    btn.setAttribute('aria-label','채팅 올리기');
    btn.innerHTML=planeSvg;
    if(!btn.onclick){
      btn.onclick=function(){
        if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();
      };
    }
    return btn;
  }

  function ensureGuestRequest(bar,sendBtn){
    var btn=document.getElementById('ktRemoteGuestRequest');
    if(!btn){
      btn=document.createElement('button');
      btn.id='ktRemoteGuestRequest';
      btn.type='button';
      btn.className='kt-remote-action kt-remote-guest-request';
      btn.setAttribute('aria-label','방송 참여 신청');
      btn.setAttribute('title','방송 참여 신청');
      btn.innerHTML=peopleSvg;
    }
    if(!btn.__ktDirectGuestRequestBound){
      btn.__ktDirectGuestRequestBound=true;
      btn.onclick=function(e){
        if(e)e.preventDefault();
        if(typeof window.ktRequestGuestJoin==='function'){
          window.ktRequestGuestJoin();
          return;
        }
        var input=document.getElementById('ktRemoteChatInput');
        if(!input||typeof window.ktRemoteSendChat!=='function')return;
        input.value='👥 방송 참여 신청합니다.';
        var r=window.ktRemoteSendChat();
        try{Promise.resolve(r).finally(function(){if(input.value==='👥 방송 참여 신청합니다.')input.value='';});}catch(err){}
      };
    }
    if(sendBtn&&sendBtn.nextElementSibling!==btn){
      try{sendBtn.insertAdjacentElement('afterend',btn);}catch(e){}
    }
    return btn;
  }

  function ensureRoseButton(bar,guestBtn){
    var btn=document.getElementById('ktRemoteRoseButton');
    if(!btn){
      btn=document.createElement('button');
      btn.id='ktRemoteRoseButton';
      btn.type='button';
      btn.className='kt-remote-action kt-remote-rose';
      btn.setAttribute('aria-label','장미');
      btn.setAttribute('title','장미');
      btn.textContent='🌹';
      btn.onclick=function(){
        if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();
      };
    }
    var heart=bar.querySelector('.kt-remote-action.heart');
    if(heart&&heart.textContent!=='♥')heart.textContent='♥';
    if(guestBtn&&guestBtn.nextElementSibling!==btn){
      try{guestBtn.insertAdjacentElement('afterend',btn);}catch(e){}
    }else if(!guestBtn&&heart&&heart.previousElementSibling!==btn){
      try{heart.insertAdjacentElement('beforebegin',btn);}catch(e){}
    }
    return btn;
  }

  function apply(){
    ensureStyle();
    var bar=document.getElementById('ktRemoteBottom');
    var input=document.getElementById('ktRemoteChatInput');
    if(!bar||!input)return;
    var sendBtn=ensureSend(bar,input);
    var guestBtn=ensureGuestRequest(bar,sendBtn);
    ensureRoseButton(bar,guestBtn);
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

/* 13명 방송 참여신청/호스트 올리기 흐름만 추가. */
(function(){
  if(document.querySelector('script[data-kt-guest-request-flow]'))return;
  var s=document.createElement('script');
  s.src='live-guest-request-flow.js?v=20260914-guest2';
  s.async=false;
  s.setAttribute('data-kt-guest-request-flow','1');
  document.head.appendChild(s);
})();
