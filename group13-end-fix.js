/* K-Talk 13명 방송 종료 버튼 전용 보강. 다른 방송방/기능은 건드리지 않음. */
(function(){
  if(window.__ktGroup13EndFixInstalled)return;
  window.__ktGroup13EndFixInstalled=true;

  function isGroup13Active(){
    try{
      if(document.querySelector('.ktg13-room'))return true;
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group'||t==='group13'||n==='13명 방송';
    }catch(e){return false;}
  }

  function stopGroup13Now(){
    if(!isGroup13Active())return false;
    try{if(window.closeSheet)window.closeSheet();}catch(e){}
    try{
      if(window.__ktGroup13ClockTimer){clearInterval(window.__ktGroup13ClockTimer);window.__ktGroup13ClockTimer=null;}
      if(window.__ktGroup13Timer){clearInterval(window.__ktGroup13Timer);window.__ktGroup13Timer=null;}
    }catch(e){}
    try{
      if(window.state&&state.stream){
        state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
        state.stream=null;
      }
    }catch(e){}
    try{
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      if(cam)cam.srcObject=null;
      if(bg)bg.srcObject=null;
    }catch(e){}
    try{
      if(window.state){
        state.liveRoomType='';
        state.liveRoomName='';
        state.liveRoomMax=0;
        state.currentLiveRoomTitle='';
      }
    }catch(e){}
    try{
      var c=document.getElementById('creator');
      if(c)c.classList.remove('show','camera-on','live-prep-open','creator-recording','creator-review');
    }catch(e){}
    try{
      var exit=document.exitFullscreen||document.webkitExitFullscreen;
      if(exit&&(document.fullscreenElement||document.webkitFullscreenElement)){
        var p=exit.call(document);if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
    try{if(window.home){window.home();return true;}}catch(e){}
    try{location.reload();return true;}catch(e){}
    return true;
  }

  window.ktGroup13EndBroadcast=stopGroup13Now;

  /* 기존 더보기 안의 '방송 종료' 버튼이 눌려도 확실히 종료되게 가로챈다. */
  document.addEventListener('click',function(e){
    if(!isGroup13Active())return;
    var btn=e.target&&e.target.closest?e.target.closest('#sheet button'):null;
    if(!btn)return;
    var text=String(btn.textContent||'').replace(/\s+/g,' ').trim();
    if(text.indexOf('방송 종료')===-1)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    stopGroup13Now();
  },true);
})();

/* 태블릿에서만 카메라 중복 연결/고해상도 부담을 줄이는 파일을 마지막에 한 번 로드 */
(function(){
  if(document.querySelector('script[data-kt-tablet-performance]'))return;
  var s=document.createElement('script');
  s.src='tablet-performance-fix.js?v=20260908a';
  s.async=false;
  s.setAttribute('data-kt-tablet-performance','1');
  document.head.appendChild(s);
})();

/* 요청대로 다른 화면은 건드리지 않고 선물 버튼 위치만 이동 */
(function(){
  if(document.querySelector('script[data-kt-gift-position-only]'))return;
  var s=document.createElement('script');
  s.src='gift-position-only-fix.js?v=20260908-giftpos01';
  s.defer=true;
  s.setAttribute('data-kt-gift-position-only','1');
  document.head.appendChild(s);
})();

/* 13명 방송에만 첫 번째 사진과 같은 오른쪽 버튼 4개 추가: 좋아요 / 선물상자 / 매치 / 효과음 */
(function(){
  if(document.querySelector('script[data-kt-group13-side-controls]'))return;
  var s=document.createElement('script');
  s.src='group13-side-controls-20260908.js?v=20260908-side01';
  s.defer=true;
  s.setAttribute('data-kt-group13-side-controls','1');
  document.head.appendChild(s);
})();
