/* K-Talk: 내부 노래/게스트 마이크 제어 알림은 방송 화면 채팅에 표시하지 않음.
   1인/9명/13명/구독자/비밀방 + 게스트 화면 공통. 실제 마이크 제어 기능은 변경하지 않음. */
(function(){
  if(window.__ktHideSongMicControlNotice20261003)return;
  window.__ktHideSongMicControlNotice20261003=true;

  function isControlText(t){
    t=String(t||'').replace(/\s+/g,' ').trim();
    return t.indexOf('노래 시작 · 게스트 마이크 잠금')>-1 ||
           t.indexOf('노래 종료 · 게스트 마이크 해제')>-1 ||
           t.indexOf('노래 시작·게스트 마이크 잠금')>-1 ||
           t.indexOf('노래 종료·게스트 마이크 해제')>-1;
  }

  function clean(){
    try{
      var roots=document.querySelectorAll(
        '#screen .ktsolo-room,'+
        '#screen .ktg9-room,'+
        '#screen .ktg13-room,'+
        '#screen .ktsubscriber-room,'+
        '#screen .ktsecret-room,'+
        '#screen .kt-remote-live,'+
        '#screen .kt-guest-hostlike-room'
      );
      roots.forEach(function(root){
        root.querySelectorAll('div,span,p,li').forEach(function(el){
          if(!isControlText(el.textContent))return;
          var target=el.closest(
            '.ktg13-chat-line,.kt-remote-chat-line,.ktsolo-chat-line,'+
            '.ktsubscriber-chat-line,.kgh-chat-line,.ktsecret-chat-line,'+
            '.kt-live-activity-toast'
          )||el;
          try{target.remove();}catch(e){}
        });
      });
    }catch(e){}
  }

  clean();
  [40,120,300,800].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHideSongMicControlNoticeTimer20261003);
      window.__ktHideSongMicControlNoticeTimer20261003=setTimeout(clean,20);
    }).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();