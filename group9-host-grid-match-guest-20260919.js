/* K-Talk 9명 호스트방: 게스트 화면과 같은 3x3 동일 크기 칸.
   9명 호스트방의 영상 칸만 조정하고 다른 방/채팅/선물/스위치는 변경하지 않음. */
(function(){
  if(window.__ktGroup9HostGridMatchGuest20260919)return;
  window.__ktGroup9HostGridMatchGuest20260919=true;

  function isGroup9State(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group9'||n==='9명 방송';
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktGroup9HostGridMatchGuestStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup9HostGridMatchGuestStyle';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;min-width:0!important;min-height:0!important;overflow:hidden!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host{grid-column:1!important;grid-row:1!important;min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;border:1px solid #28282d!important;border-radius:7px!important;background:linear-gradient(145deg,#17181b,#111214)!important;overflow:hidden!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center center!important;margin:0!important;padding:0!important;border:0!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests{display:contents!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest{min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;display:grid!important;place-items:center!important;border:1px solid #28282d!important;border-radius:7px!important;background:linear-gradient(145deg,#17181b,#111214)!important;color:#bdbdc4!important;overflow:hidden!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host-extra{display:none!important}';
    document.head.appendChild(s);
  }

  function normalizeNineRoom(){
    ensureStyle();
    if(!isGroup9State())return;
    var room=document.querySelector('#screen .ktg13-room');
    if(!room)return;
    room.setAttribute('data-kt-room','9');

    var guestBox=room.querySelector('.ktg13-guests');
    if(!guestBox)return;

    var guests=[].slice.call(guestBox.querySelectorAll(':scope > .ktg13-guest'));
    while(guests.length<8){
      var g=document.createElement('div');
      g.className='ktg13-guest';
      g.innerHTML='<span>게스트</span>';
      guestBox.appendChild(g);
      guests.push(g);
    }
    guests.slice(8).forEach(function(g){try{g.remove();}catch(e){}});
  }

  normalizeNineRoom();
  [20,80,180,400,800,1400,2400].forEach(function(ms){setTimeout(normalizeNineRoom,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9HostGridMatchGuestTimer);
      window.__ktGroup9HostGridMatchGuestTimer=setTimeout(normalizeNineRoom,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();