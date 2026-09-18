/* K-Talk: 채팅 키보드가 올라와도 방송방 전체 높이는 유지하고 입력줄만 키보드 위로 올린다. */
(function(){
  if(window.__ktRoomKeyboardStable20260918)return;
  window.__ktRoomKeyboardStable20260918=true;

  var vv=window.visualViewport||null;
  var baseline=0;
  var lastClosed=0;
  var keyboardOpen=false;

  function editable(el){
    if(!el||el===document.body)return false;
    return !!(el.matches&&el.matches('input,textarea,[contenteditable="true"],[contenteditable=""]'));
  }

  function roomOpen(){
    return !!document.querySelector('.ktg13-room,.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.kt-guest-hostlike-room,.kt-remote-live');
  }

  function viewportHeight(){
    if(vv&&vv.height)return Math.round(vv.height);
    return Math.round(window.innerHeight||document.documentElement.clientHeight||0);
  }

  function fullHeight(){
    return Math.round(Math.max(
      window.innerHeight||0,
      document.documentElement.clientHeight||0,
      vv?vv.height+(vv.offsetTop||0):0
    ));
  }

  function rememberClosed(){
    if(editable(document.activeElement))return;
    var h=fullHeight();
    if(h>0){
      lastClosed=Math.max(lastClosed,h);
      baseline=h;
      document.documentElement.style.setProperty('--kt-stable-room-h',baseline+'px');
    }
  }

  function closeKeyboardMode(){
    keyboardOpen=false;
    document.documentElement.classList.remove('kt-room-keyboard-open');
    document.documentElement.style.setProperty('--kt-keyboard-lift','0px');
    setTimeout(rememberClosed,120);
    setTimeout(rememberClosed,420);
  }

  function apply(){
    if(!roomOpen()){
      closeKeyboardMode();
      return;
    }

    var active=editable(document.activeElement);
    if(!active){
      if(keyboardOpen)closeKeyboardMode();
      else rememberClosed();
      return;
    }

    if(!baseline){
      baseline=lastClosed||fullHeight();
    }
    if(lastClosed>baseline)baseline=lastClosed;

    var visible=viewportHeight();
    var offset=vv?(vv.offsetTop||0):0;
    var lift=Math.max(0,Math.round(baseline-visible-offset));

    /* 작은 주소창 변화는 키보드로 취급하지 않는다. */
    if(lift<110){
      document.documentElement.style.setProperty('--kt-stable-room-h',baseline+'px');
      return;
    }

    keyboardOpen=true;
    document.documentElement.classList.add('kt-room-keyboard-open');
    document.documentElement.style.setProperty('--kt-stable-room-h',baseline+'px');
    document.documentElement.style.setProperty('--kt-keyboard-lift',lift+'px');
  }

  if(!document.getElementById('ktRoomKeyboardStableStyle20260918')){
    var st=document.createElement('style');
    st.id='ktRoomKeyboardStableStyle20260918';
    st.textContent=''
      +'html.kt-room-keyboard-open #screen{height:var(--kt-stable-room-h)!important;min-height:var(--kt-stable-room-h)!important;max-height:var(--kt-stable-room-h)!important;overflow:hidden!important}'
      +'html.kt-room-keyboard-open .ktg13-room,html.kt-room-keyboard-open .ktsolo-room,html.kt-room-keyboard-open .ktsubscriber-room,html.kt-room-keyboard-open .ktsecret-room,html.kt-room-keyboard-open .kt-guest-hostlike-room,html.kt-room-keyboard-open .kt-remote-live{height:var(--kt-stable-room-h)!important;min-height:var(--kt-stable-room-h)!important;max-height:var(--kt-stable-room-h)!important}'
      +'html.kt-room-keyboard-open #ktRemoteBottom{transform:translateY(calc(-1 * var(--kt-keyboard-lift)))!important;transition:none!important}'
      +'html.kt-room-keyboard-open #ktRemoteChatList{transform:translateY(calc(-1 * var(--kt-keyboard-lift)))!important;transition:none!important}'
      +'html.kt-room-keyboard-open body{overflow:hidden!important}';
    document.head.appendChild(st);
  }

  document.addEventListener('focusin',function(e){
    if(!editable(e.target))return;
    if(roomOpen()){
      var h=fullHeight();
      if(h>0){lastClosed=Math.max(lastClosed,h);baseline=lastClosed;}
      setTimeout(apply,40);
      setTimeout(apply,160);
      setTimeout(apply,320);
    }
  },true);

  document.addEventListener('focusout',function(){
    setTimeout(function(){
      if(!editable(document.activeElement))closeKeyboardMode();
    },180);
  },true);

  if(vv){
    vv.addEventListener('resize',apply);
    vv.addEventListener('scroll',apply);
  }
  window.addEventListener('resize',function(){
    if(editable(document.activeElement))apply();
    else setTimeout(rememberClosed,120);
  });

  rememberClosed();
  setTimeout(rememberClosed,350);
})();
