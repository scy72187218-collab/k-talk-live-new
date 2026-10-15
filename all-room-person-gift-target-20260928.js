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
  function isRemoteViewer(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
        !!document.querySelector('#screen .kt-remote-live,#screen .kt-guest-hostlike-room,#screen .kt-approved-guest-grid,#screen .kt-guest-room-grid');
    }catch(e){return false;}
  }
  function isLocalHostRoom(){
    if(isRemoteViewer())return false;
    return !!document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
  }
  function tileOf(el){
    return el&&el.closest?el.closest(
      '.ktg13-host,.ktg13-guest,.ktg9-host,.ktg9-guest,'+
      '.ktsubscriber-host,.ktsubscriber-guest,'+
      '.ktsecret-slot,.ktsecret-host,.ktsecret-guest-slot,'+
      '.ktsolo-main,.kgh-cell,.kt-approved-guest-cell,.kt-guest-room-cell,#ktRemoteLiveVideo'
    ):null;
  }
  function viewerId(tile){
    if(!tile)return '';
    var d=tile.dataset||{};
    return String(d.ktGuestViewerId||d.ktDirectGuest||d.ktPeerViewer||d.viewerId||d.userId||d.participantId||'').trim();
  }
  function nameOf(tile){
    if(!tile)return '회원';
    if(kindOf(tile)==='host'){var r=window.__ktLastLiveRoom||{},root=tile.closest('.kt-remote-live'),id=root&&root.getAttribute('data-kt-host-id');if(id&&String(r.host_id||'')===String(id)&&r.host_name)return clean(r.host_name);var hostLabel=tile.querySelector('.kt-allhost-name,.kt-hg-name,.ktg13-host-name,.kt-sgfh-host-name,label');return clean(hostLabel&&hostLabel.textContent||'호스트');}
    var d=tile.dataset||{};
    var n=d.nickname||d.displayName||d.guestName||d.viewerName||d.name||'';
    if(n)return clean(n);
    var el=tile.querySelector&&tile.querySelector('.kt-allguest-name,.kt-guest-name,.kgh-label,.ktsecret-guest-name,label');
    if(el&&String(el.textContent||'').trim())return clean(el.textContent);
    return tile.classList.contains('host')?'호스트':'게스트';
  }
  function kindOf(tile){
    if(!tile)return '';
    if(tile.id==='ktRemoteLiveVideo')return 'host';
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

    return true;
  }

  function style(){
    if(document.getElementById('ktPersonGiftTargetStyle20260928'))return;
    var s=document.createElement('style');s.id='ktPersonGiftTargetStyle20260928';
    s.textContent=''
      +'.kt-person-gift-target-20260928{outline:2px solid #ffd75a!important;outline-offset:-2px!important;box-shadow:inset 0 0 18px #ffd75a44,0 0 10px #ffd75a55!important}'
      +'.kt-person-gift-target-20260928:after{content:"🎁 선물 대상"!important;display:block!important;position:absolute!important;right:4px!important;top:4px!important;z-index:140!important;padding:3px 6px!important;border-radius:9px!important;background:rgba(20,13,0,.9)!important;border:1px solid #ffd75a!important;color:#ffe56e!important;font-size:8px!important;font-weight:950!important;pointer-events:none!important}';
    s.textContent+='.kt-host-movie-menu-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:10px}.kt-host-movie-menu-actions>button{min-height:58px;border:1px solid #ffffff25;border-radius:12px;background:#232329;color:#fff;font-weight:800}';
    document.head.appendChild(s);
  }

  var openTimer=0,lastOpenAt=0,lastTile=null;
  function openHostMovieMenu(tile){
    var root=tile.closest('.kt-movie-theater');
    if(!root||!isLocalHostRoom()||kindOf(tile)!=='host')return false;
    var now=Date.now();if(now-lastOpenAt<300&&lastTile===tile)return true;
    lastOpenAt=now;lastTile=tile;
    if(typeof window.showSheet!=='function')return false;
    var panel=document.createElement('div');panel.className='kt-person-gift-menu';
    panel.innerHTML='<div class="kt-person-gift-menu-head"><div class="kt-person-gift-menu-face">👤</div><b>내 방송 도구</b><button type="button" data-close>닫기</button></div><div class="kt-host-movie-menu-actions"></div>';
    var image=tile.querySelector('img'),face=panel.querySelector('.kt-person-gift-menu-face');
    if(image){var photo=document.createElement('img');photo.src=image.currentSrc||image.src;photo.alt='내 사진';face.textContent='';face.appendChild(photo);}
    var actions=panel.querySelector('.kt-host-movie-menu-actions');
    var bar=root.querySelector('.ktsolo-tools,.ktg13-tools,.ktg9-tools,.ktsubscriber-tools,.ktsecret-tools');
    if(bar)bar.querySelectorAll('button').forEach(function(original){
      var button=document.createElement('button');button.type='button';button.textContent=String(original.textContent||'').trim();
      button.onclick=function(){if(window.closeSheet)window.closeSheet();original.click();};
      actions.appendChild(button);
    });
    var gift=document.createElement('button');gift.type='button';gift.textContent='🎁 선물 상자';gift.onclick=function(){if(window.openGifts)window.openGifts();};actions.appendChild(gift);
    window.showSheet('내 방송 도구','');
    var body=document.getElementById('sheetBody'),sheet=document.getElementById('sheet');if(!body||!sheet)return false;
    sheet.classList.add('kt-person-gift-menu-open');body.appendChild(panel);
    panel.querySelector('[data-close]').onclick=function(){sheet.classList.remove('kt-person-gift-menu-open');if(window.closeSheet)window.closeSheet();};
    return true;
  }

  function openGiftFor(tile){
    if(kindOf(tile)==='host'&&isLocalHostRoom()&&tile.closest('.kt-movie-theater'))return openHostMovieMenu(tile);
    if(!choose(tile))return false;
    var now=Date.now();
    if(now-lastOpenAt<300&&lastTile===tile)return true;
    lastOpenAt=now;lastTile=tile;
    clearTimeout(openTimer);
    if(typeof window.showSheet!=='function')return false;
    var panel=document.createElement('div');panel.className='kt-person-gift-menu';
    panel.innerHTML='<div class="kt-person-gift-menu-head"><div class="kt-person-gift-menu-face"></div><b></b><button type="button" data-close>닫기</button></div><button type="button" class="kt-person-gift-menu-open">🎁 선물 상자</button>';
    panel.querySelector('b').textContent=nameOf(tile);
    var face=panel.querySelector('.kt-person-gift-menu-face'),source=tile.matches('video')?tile:tile.querySelector('video'),image=tile.querySelector('img.kt-allhost-photo,img.kt-guest-profile-photo,img[class*="profile"],img[class*="avatar"]');
    if(image){var img=document.createElement('img');img.src=image.currentSrc||image.src;img.alt='선물 받을 사람';face.appendChild(img);}
    else if(source&&source.srcObject){var v=document.createElement('video');v.autoplay=true;v.muted=true;v.playsInline=true;v.srcObject=source.srcObject;face.appendChild(v);}
    else if(source&&source.poster){var photo=document.createElement('img');photo.src=source.poster;photo.alt='선물 받을 사람';face.appendChild(photo);}
    else face.textContent='👤';
    window.showSheet('', '');
    var body=document.getElementById('sheetBody'),sheet=document.getElementById('sheet');
    if(!body||!sheet)return false;
    sheet.classList.remove('kt-gift-force');sheet.classList.add('kt-person-gift-menu-open');
    body.appendChild(panel);
    panel.querySelector('[data-close]').onclick=function(){sheet.classList.remove('kt-person-gift-menu-open');if(window.closeSheet)window.closeSheet();};
    panel.querySelector('.kt-person-gift-menu-open').onclick=function(){sheet.classList.remove('kt-person-gift-menu-open');if(window.openGifts)window.openGifts();};
    if(window.ktCanDragSeat20261015&&window.ktCanDragSeat20261015(tile)&&window.ktBeginSeatTapMove20261015){
      var move=document.createElement('button');move.type='button';move.textContent='↔ 자리 이동';move.className='kt-person-gift-menu-open';
      move.onclick=function(){sheet.classList.remove('kt-person-gift-menu-open');if(window.closeSheet)window.closeSheet();window.ktBeginSeatTapMove20261015(tile);};panel.appendChild(move);
    }
    var preview=face.querySelector('video');if(preview){var play=preview.play();if(play&&play.catch)play.catch(function(){});}

    return true;
  }

  function excludedUi(el){
    try{
      return !!(el&&el.closest&&el.closest(
        'button,input,textarea,select,a,[role="button"],'+
        '.kt-live-tools,.kt-room-tools,.creator-tools,.creator-bottom,'+
        '.ktsolo-right,.ktg13-right-quick,.ktsubscriber-right,.ktsecret-right,'+
        '.kt-photo-zoom-overlay,#sheet,.kt-live-profile-pop'
      ));
    }catch(e){return false;}
  }

  var lastPersonLikeAt=0,lastPersonLikeTile=null,lastPersonLikeType='';
  function personTap(e){
    var target=e&&e.target;
    var tile=tileOf(target);if(!tile||excludedUi(target))return false;
    if(window.ktSeatTapModeActive20261015&&window.ktSeatTapModeActive20261015(tile))return false;
    // Keep short taps as before; an eligible long press belongs to seat dragging.
    if((e.type==='pointerdown'||e.type==='touchstart')&&window.ktCanDragSeat20261015&&window.ktCanDragSeat20261015(tile))return false;

    /* 사진 위에 닉네임/레벨/작은 오버레이가 있어도 같은 사람 칸이면 인정.
       빈 게스트 칸은 viewer id가 없어 choose()에서 자동 제외된다. */
    var kind=kindOf(tile);
    if(kind==='guest'&&!viewerId(tile))return false;

    try{
      if(e&&e.cancelable)e.preventDefault();
      if(e&&e.stopPropagation)e.stopPropagation();
      if(e&&e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(_e){}
    var now=Date.now(),duplicate=lastPersonLikeTile===tile&&now-lastPersonLikeAt<900&&e.type!==lastPersonLikeType&&(lastPersonLikeType==='pointerdown'||lastPersonLikeType==='touchstart');
    if(!duplicate){
      lastPersonLikeAt=now;lastPersonLikeTile=tile;lastPersonLikeType=e.type;
      if(isRemoteViewer()){if(typeof window.ktRemoteLike==='function')window.ktRemoteLike();}
      else if((kind==='guest'||tile.matches('.ktsubscriber-host'))&&typeof window.addHostLike==='function'){window.__ktHostPhotoLikeTapAt=now;window.addHostLike(1);}
    }
    return openGiftFor(tile);
  }

  style();
  document.addEventListener('pointerdown',personTap,true);
  document.addEventListener('touchstart',personTap,{capture:true,passive:false});
  document.addEventListener('click',personTap,true);
})();