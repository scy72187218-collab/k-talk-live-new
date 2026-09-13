/* 9명방·13명방·구독자방·비밀방: 열쇠 표시만 제거하고, 기존 자리이동 옆에 위/아래 이동만 추가. */
(function(){
  if(window.__ktSeatUpDownNoKeyInstalled)return;
  window.__ktSeatUpDownNoKeyInstalled=true;

  var guestSelector='.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot:not(.host),.ktsecret-room .ktsecret-guest-slot:not(.host)';

  function ensureStyle(){
    if(document.getElementById('ktSeatUpDownNoKeyStyle'))return;
    var s=document.createElement('style');
    s.id='ktSeatUpDownNoKeyStyle';
    s.textContent=''
      +'html body .kt-inside-manager-key{display:none!important}'
      +'.kt-inside-seat-vertical{width:20px!important;height:28px!important;min-width:20px!important;display:grid!important;grid-template-rows:1fr 1fr!important;gap:1px!important;align-items:stretch!important}'
      +'.kt-inside-seat-step{width:20px!important;height:13px!important;min-width:20px!important;min-height:13px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:6px!important;background:rgba(8,8,12,.78)!important;color:#fff!important;font:950 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:grid!important;place-items:center!important;touch-action:manipulation!important}'
      +'.kt-inside-seat-step:disabled{opacity:.28!important}'
      +'.kt-av-self-only>.kt-inside-av-controls .kt-inside-seat-vertical,.kt-av-no-access>.kt-inside-av-controls .kt-inside-seat-vertical{display:none!important}'
      +'@media(max-width:390px){.kt-inside-av-controls{gap:1px!important}.kt-inside-seat-vertical{width:18px!important;min-width:18px!important;height:25px!important}.kt-inside-seat-step{width:18px!important;min-width:18px!important;height:12px!important;min-height:12px!important;font-size:9px!important;border-radius:5px!important}}';
    document.head.appendChild(s);
  }

  function removeKeys(){
    try{document.querySelectorAll('.kt-inside-manager-key').forEach(function(k){k.remove();});}catch(e){}
  }

  function roomOf(tile){
    return tile&&tile.closest?tile.closest('.ktg13-room,.ktsubscriber-room,.ktsecret-room'):null;
  }

  function guestsIn(room){
    if(!room)return [];
    if(room.classList.contains('ktg13-room'))return [].slice.call(room.querySelectorAll('.ktg13-guest'));
    if(room.classList.contains('ktsubscriber-room'))return [].slice.call(room.querySelectorAll('.ktsubscriber-guest'));
    return [].slice.call(room.querySelectorAll('.ktsecret-slot:not(.host),.ktsecret-guest-slot:not(.host)'));
  }

  function verticalStep(room){
    if(!room)return 1;
    if(room.classList.contains('ktg13-room'))return 3;
    if(room.classList.contains('ktsubscriber-room'))return 2;
    if(room.classList.contains('ktsecret-room'))return 2;
    return 1;
  }

  function controlNode(n){
    return !!(n&&n.nodeType===1&&n.matches&&n.matches('.kt-inside-av-controls,.kt-913-camera,.kt-person-mic,.ktg13-camera-toggle,.kt-host-camera-toggle,.kt-person-seat-number'));
  }

  function takeContent(tile){
    var f=document.createDocumentFragment();
    [].slice.call(tile.childNodes).forEach(function(n){if(!controlNode(n))f.appendChild(n);});
    return f;
  }

  function putContent(tile,frag){
    var controls=tile.querySelector(':scope > .kt-inside-av-controls');
    tile.insertBefore(frag,controls||null);
  }

  function swapData(a,b){
    ['userId','participantId','memberId','uid','occupied','self','me','local','own','guestName','nickname','profileName','name','profilePhoto','photo','avatar','roseCount','roses','giftRoses','receivedRoses','coins','coinCount'].forEach(function(k){
      var av=a.dataset?a.dataset[k]:undefined;
      var bv=b.dataset?b.dataset[k]:undefined;
      if(a.dataset){if(bv===undefined)delete a.dataset[k];else a.dataset[k]=bv;}
      if(b.dataset){if(av===undefined)delete b.dataset[k];else b.dataset[k]=av;}
    });
  }

  function swapSeats(a,b){
    if(!a||!b||a===b)return;
    var af=takeContent(a),bf=takeContent(b);
    swapData(a,b);
    putContent(a,bf);
    putContent(b,af);
    try{document.dispatchEvent(new Event('kt-person-seat-change'));}catch(e){}
  }

  function moveVertical(tile,dir){
    var room=roomOf(tile);
    var list=guestsIn(room);
    var i=list.indexOf(tile);
    if(i<0)return;
    var step=verticalStep(room);
    var j=i+(dir*step);
    if(j<0||j>=list.length)return;
    swapSeats(tile,list[j]);
    tile.classList.add('kt-av-open');
    list[j].classList.add('kt-av-open');
    setTimeout(install,20);
  }

  function addPair(tile){
    var box=tile.querySelector(':scope > .kt-inside-av-controls');
    if(!box)return;
    var move=box.querySelector('.kt-inside-move-seat');
    if(!move)return;

    var pair=box.querySelector('.kt-inside-seat-vertical');
    if(!pair){
      pair=document.createElement('span');
      pair.className='kt-inside-seat-vertical';

      var up=document.createElement('button');
      up.type='button';
      up.className='kt-inside-seat-step kt-inside-seat-up';
      up.textContent='↑';
      up.title='자리 위로';
      up.setAttribute('aria-label','자리 위로');
      up.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} moveVertical(tile,-1);};

      var down=document.createElement('button');
      down.type='button';
      down.className='kt-inside-seat-step kt-inside-seat-down';
      down.textContent='↓';
      down.title='자리 아래로';
      down.setAttribute('aria-label','자리 아래로');
      down.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} moveVertical(tile,1);};

      pair.appendChild(up);
      pair.appendChild(down);
      box.appendChild(pair);
    }

    var room=roomOf(tile),list=guestsIn(room),i=list.indexOf(tile),step=verticalStep(room);
    var upBtn=pair.querySelector('.kt-inside-seat-up');
    var downBtn=pair.querySelector('.kt-inside-seat-down');
    var managerAllowed=!move.disabled&&!tile.classList.contains('kt-av-self-only')&&!tile.classList.contains('kt-av-no-access');
    pair.style.setProperty('display',managerAllowed?'grid':'none','important');
    if(upBtn)upBtn.disabled=!managerAllowed||i-step<0;
    if(downBtn)downBtn.disabled=!managerAllowed||i+step>=list.length;
  }

  function install(){
    ensureStyle();
    removeKeys();
    document.querySelectorAll(guestSelector).forEach(addPair);
  }

  install();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,500);
  try{
    var mo=new MutationObserver(function(){
      removeKeys();
      clearTimeout(window.__ktSeatUpDownNoKeyTimer);
      window.__ktSeatUpDownNoKeyTimer=setTimeout(install,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 카메라·마이크·자리이동을 한 번 사용하면 안쪽 조작버튼을 바로 숨긴다. 다시 사람 칸을 누르면 다시 표시된다. */
(function(){
  if(window.__ktRoomControlAutoHideInstalled)return;
  window.__ktRoomControlAutoHideInstalled=true;

  var controlSelector='.kt-inside-camera,.kt-inside-mic,.kt-inside-move-seat,.kt-inside-seat-up,.kt-inside-seat-down';
  var tileSelector='.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-guest-slot';

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest(controlSelector):null;
    if(!btn||btn.disabled)return;
    var tile=btn.closest(tileSelector);
    var room=btn.closest('.ktg13-room,.ktsubscriber-room,.ktsecret-room');
    setTimeout(function(){
      try{
        if(tile)tile.classList.remove('kt-av-open');
        if(room)room.querySelectorAll('.kt-av-open').forEach(function(t){t.classList.remove('kt-av-open');});
      }catch(err){}
    },0);
  },true);
})();
