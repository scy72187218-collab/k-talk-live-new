/* K-Talk 라이브 상단 프로필 바의 + / 종 버튼만 숨김 (2026-09-19)
   다른 버튼·방송·게스트·채팅·카메라·스위치는 변경하지 않음. */
(function(){
  if(window.__ktHideLiveTopPlusBell20260919)return;
  window.__ktHideLiveTopPlusBell20260919=true;

  function liveOpen(){
    return !!document.querySelector(
      '.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room,'+
      '.kt-remote-live,.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-guest-room-grid'
    );
  }

  function normalize(v){
    return String(v||'').replace(/\s+/g,'').trim();
  }

  function isPlusOrBell(btn){
    var txt=normalize(btn.textContent);
    var aria=normalize(btn.getAttribute('aria-label'));
    var title=normalize(btn.getAttribute('title'));

    var plus=(txt==='+'||txt==='＋'||txt==='✚'||txt==='➕'||aria==='추가'||aria==='팔로우');
    var bell=(txt==='🔔'||txt==='🔕'||aria.indexOf('알림')>-1||title.indexOf('알림')>-1);

    if(!plus&&!bell)return false;

    try{
      var r=btn.getBoundingClientRect();
      /* 사진처럼 방송 화면 상단의 프로필 줄에 있는 버튼만 */
      if(r.top>230)return false;
    }catch(e){}
    return true;
  }

  function hide(){
    if(!liveOpen())return;
    document.querySelectorAll('button,[role="button"]').forEach(function(btn){
      if(!isPlusOrBell(btn))return;
      try{
        btn.style.setProperty('display','none','important');
        btn.setAttribute('aria-hidden','true');
        btn.dataset.ktTopPlusBellHidden='1';
      }catch(e){}
    });
  }

  hide();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(hide,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktHideLiveTopPlusBellTimer);
      window.__ktHideLiveTopPlusBellTimer=setTimeout(hide,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();