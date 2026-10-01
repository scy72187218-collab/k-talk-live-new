/* K-Talk 9명 호스트방: 게스트 화면과 같은 3x3 동일 크기 칸.
   9명 호스트방의 영상/게스트 칸만 맞추고 다른 방/채팅/선물/스위치/효과는 변경하지 않음. */
(function(){
  if(window.__ktGroup9HostGridMatchGuest20260919V2)return;
  window.__ktGroup9HostGridMatchGuest20260919V2=true;

  function isGroup9State(){
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      var m=Number((window.state&&state.liveRoomMax)||0);
      if(t==='group9'||m===9||n.indexOf('9명')>-1)return true;

      /* 1111: viewer phones do not share the host's local state object.
         When they entered a real 9-person room, use the remote room label
         already shown on that viewer to normalize only that room to 3x3. */
      var meta=document.querySelector('#screen .kt-remote-meta span,.kt-remote-meta span');
      var txt=String(meta&&meta.textContent||'');
      if(/9\s*명\s*방송/.test(txt))return true;

      try{
        var r=window.__ktLastLiveRoom||{};
        if(String(r.room_type||'')==='group9'||String(r.room_name||'').indexOf('9명')>-1)return true;
      }catch(_e){}
      try{
        if(String(window.__ktRemoteRoomType||'')==='group9'||String(window.__ktRemoteRoomName||'').indexOf('9명')>-1)return true;
      }catch(_e){}
      return false;
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktGroup9HostGridMatchGuestStyleV2'))return;
    var s=document.createElement('style');
    s.id='ktGroup9HostGridMatchGuestStyleV2';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main{position:relative!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;min-width:0!important;min-height:0!important;overflow:hidden!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host,#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest{position:relative!important;min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;display:grid!important;place-items:center!important;border:1px solid #28282d!important;border-radius:7px!important;background:linear-gradient(145deg,#17181b,#111214)!important;color:#bdbdc4!important;font-size:13px!important;font-weight:900!important;overflow:hidden!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host{grid-column:1!important;grid-row:1!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video,#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center center!important;margin:0!important;padding:0!important;border:0!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests{display:contents!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host-extra{display:none!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host .kt-allhost-profile{display:flex!important;left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;transform:none!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host .ktg13-host-label{display:none!important}';
    document.head.appendChild(s);
  }

  function ktConfirmNineRoomNow20261001(){
    try{
      if(isGroup9State())return true;

      var room=document.querySelector('#screen .ktg13-room');
      var txt='';
      try{
        txt=String((document.querySelector('#screen .kt-remote-meta span,.kt-remote-meta span')||{}).textContent||'');
      }catch(e){}
      if(/9\s*명\s*방송/.test(txt)){
        try{
          window.__ktRemoteRoomType='group9';
          window.__ktRemoteRoomName='9명 방송';
        }catch(e){}
        try{
          if(room){
            room.setAttribute('data-kt-room','9');
            room.setAttribute('data-kt-group9-confirmed','1');
          }
        }catch(e){}
        return true;
      }

      try{
        if(room&&room.getAttribute('data-kt-group9-confirmed')==='1')return true;
      }catch(e){}
      return false;
    }catch(e){return false;}
  }

  function normalizeNineRoom(){
    ensureStyle();
    if(!ktConfirmNineRoomNow20261001())return;
    var room=document.querySelector('#screen .ktg13-room');
    if(!room)return;
    room.setAttribute('data-kt-room','9');

    var host=room.querySelector('.ktg13-host');
    if(host){
      var profile=host.querySelector(':scope > .kt-allhost-profile');
      if(profile){
        profile.style.setProperty('display','flex','important');
        profile.style.setProperty('left','4px','important');
        profile.style.setProperty('right','auto','important');
        profile.style.setProperty('top','auto','important');
        profile.style.setProperty('bottom','4px','important');
        profile.style.setProperty('transform','none','important');
      }
      var hostLabel=host.querySelector(':scope > .ktg13-host-label');
      if(hostLabel)hostLabel.style.setProperty('display','none','important');
    }

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

  var __ktGroup9RemoteConfirmedHost20261001='';
  async function confirmRemoteNineRoom20261001(){
    try{
      var hid=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();
      if(!hid)return false;
      if(__ktGroup9RemoteConfirmedHost20261001===hid){
        normalizeNineRoom();
        return true;
      }
      var r=await fetch('/api/live-beacon-memory?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return false;
      var j=await r.json();
      var rooms=Array.isArray(j&&j.rooms)?j.rooms:[];
      var room=rooms.find(function(x){return String(x&&x.host_id||'')===hid;})||null;
      if(!room)return false;
      var typ=String(room.room_type||'');
      var nam=String(room.room_name||'');
      if(typ==='group9'||/9\s*명/.test(nam)){
        __ktGroup9RemoteConfirmedHost20261001=hid;
        try{
          window.__ktRemoteRoomType='group9';
          window.__ktRemoteRoomName='9명 방송';
        }catch(e){}
        normalizeNineRoom();
        return true;
      }
      return false;
    }catch(e){return false;}
  }

  normalizeNineRoom();
  [20,80,180,400,800,1400,2400,4000].forEach(function(ms){setTimeout(normalizeNineRoom,ms);});
  [60,180,420,800,1400,2400,4000,6500,9000].forEach(function(ms){setTimeout(confirmRemoteNineRoom20261001,ms);});
  setInterval(function(){
    try{
      var room=document.querySelector('#screen .ktg13-room');
      if(!room)return;
      if(isGroup9State()){normalizeNineRoom();return;}
      confirmRemoteNineRoom20261001();
    }catch(e){}
  },1200);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9HostGridMatchGuestTimerV2);
      window.__ktGroup9HostGridMatchGuestTimerV2=setTimeout(function(){
        ktConfirmNineRoomNow20261001();
        normalizeNineRoom();
      },20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();