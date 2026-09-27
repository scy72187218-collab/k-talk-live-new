/* K-Talk: 모든 방 사람 사진/영상 터치 -> 선물 대상 선택.
   호스트↔게스트, 게스트↔게스트. 자기 자신은 선택 제외.
   화면 확대/통신/채팅/기존 배치는 변경하지 않음. */
(function(){
  if(window.__ktAllRoomPersonGiftTarget20260928)return;
  window.__ktAllRoomPersonGiftTarget20260928=true;

  function clean(v){return String(v||'').replace(/^\s*[👤🌹]+\s*/,'').replace(/\s+Lv\.?\s*\d+.*$/i,'').trim()||'회원';}
  function selfViewerId(){
    var d='';try{d=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return d?'viewer_'+d:'';
  }
  function isLocalHostRoom(){
    return !!document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room') &&
      !document.documentElement.classList.contains('kt-remote-viewing');
  }
  function tileOf(el){
    return el&&el.closest?el.closest(
      '.ktg13-host,.ktg13-guest,.ktg9-host,.ktg9-guest,'+
      '.ktsubscriber-host,.ktsubscriber-guest,'+
      '.ktsecret-slot,.ktsecret-host,.ktsecret-guest-slot,'+
      '.ktsolo-main,.kgh-cell,.kt-approved-guest-cell,.kt-guest-room-cell'
    ):null;
  }
  function viewerId(tile){
    if(!tile)return '';
    var d=tile.dataset||{};
    return String(d.ktGuestViewerId||d.ktDirectGuest||d.ktPeerViewer||d.viewerId||d.userId||d.participantId||'').trim();
  }
  function nameOf(tile){
    if(!tile)return '회원';
    var d=tile.dataset||{};
    var n=d.nickname||d.displayName||d.guestName||d.viewerName||d.name||'';
    if(n)return clean(n);
    var el=tile.querySelector&&tile.querySelector('.kt-allguest-name,.kt-guest-name,.kgh-label,.ktsecret-guest-name,label');
    if(el&&String(el.textContent||'').trim())return clean(el.textContent);
    return tile.classList.contains('host')?'호스트':'게스트';
  }
  function kindOf(tile){
    if(!tile)return '';
    if(tile.classList.contains('host')||tile.matches('.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsolo-main,.ktsecret-host,.ktsecret-slot.host'))return 'host';
    return 'guest';
  }
  function clearMarks(){
    document.querySelectorAll('.kt-person-gift-target-20260928').forEach(function(x){x.classList.remove('kt-person-gift-target-20260928');});
  }
  function choose(tile){
    if(!tile)return;
    var kind=kindOf(tile),vid=viewerId(tile),self=selfViewerId();

    // local host cannot gift self; remote guest cannot gift self.
    if(kind==='host'&&isLocalHostRoom())return;
    if(kind==='guest'&&vid&&self&&vid===self)return;
    if(tile.classList.contains('self'))return;

    if(kind==='guest'&&!vid)return; // specific recipient ID required

    clearMarks();
    tile.classList.add('kt-person-gift-target-20260928');
    window.ktGiftTarget20260928={kind:kind,viewerId:vid,name:nameOf(tile),at:Date.now()};

    // keep old host->guest gift path compatible
    if(kind==='guest'){
      window.ktGuestGiftTarget={viewerId:vid,name:nameOf(tile)};
    }else{
      window.ktGuestGiftTarget=null;
    }

    try{
      if(typeof window.showSmallGiftFx==='function')
        window.showSmallGiftFx('🎁 선물 대상: '+nameOf(tile),'','K-Talk');
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktPersonGiftTargetStyle20260928'))return;
    var s=document.createElement('style');s.id='ktPersonGiftTargetStyle20260928';
    s.textContent=''
      +'.kt-person-gift-target-20260928{outline:2px solid #ffd75a!important;outline-offset:-2px!important;box-shadow:inset 0 0 18px #ffd75a44,0 0 10px #ffd75a55!important}'
      +'.kt-person-gift-target-20260928:after{content:"🎁 선물 대상"!important;display:block!important;position:absolute!important;right:4px!important;top:4px!important;z-index:140!important;padding:3px 6px!important;border-radius:9px!important;background:rgba(20,13,0,.9)!important;border:1px solid #ffd75a!important;color:#ffe56e!important;font-size:8px!important;font-weight:950!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function onDown(e){
    var tile=tileOf(e.target);if(!tile)return;
    // only when actual person media/photo area is touched
    var media=e.target.closest&&e.target.closest('video,img,.kt-allguest-profile,.kt-five-host-profile,.kgh-cell,.kt-approved-guest-cell,.kt-guest-room-cell');
    if(!media)return;
    choose(tile);
  }

  style();
  document.addEventListener('pointerdown',onDown,true);
  document.addEventListener('touchstart',onDown,{capture:true,passive:true});
})();