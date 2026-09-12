/* K-Talk 9명 방송: 기존 13명방 코드를 그대로 이용하되, 9명방에서만 호스트 1명 + 게스트 8명으로 표시한다. 기존 방은 변경하지 않음. */
(function(){
  if(window.__ktGroup9ApprovedRoomInstalled)return;
  window.__ktGroup9ApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;

  function isGroup9(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group9'||n==='9명 방송';
    }catch(e){return false;}
  }

  function hideSecretPassword(){
    var box=document.getElementById('ktSecretPasswordBox');
    if(box){
      box.classList.remove('on');
      box.style.setProperty('display','none','important');
    }
  }

  function selectGroup9(btn){
    try{
      document.querySelectorAll('.live-prep .room-switch').forEach(function(b){
        var on=b===btn;
        b.classList.toggle('on',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 방송';
        state.liveRoomMax=9;
      }
      var title=document.getElementById('liveTitle');
      if(title){title.value='9명 방송';title.dataset.autoRoom='1';}
      hideSecretPassword();
    }catch(e){}
  }

  function addNineSwitch(){
    var prep=document.querySelector('.live-prep');
    if(!prep)return;
    if(prep.querySelector('.kt-room9-switch'))return;
    var buttons=[].slice.call(prep.querySelectorAll('.room-switch'));
    var thirteen=buttons.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;});
    if(!thirteen)return;
    var b=thirteen.cloneNode(true);
    b.classList.remove('on');
    b.classList.add('kt-room9-switch');
    b.setAttribute('aria-pressed','false');
    b.innerHTML=String(thirteen.innerHTML||thirteen.textContent||'13명 방송').replace(/13명/g,'9명');
    thirteen.insertAdjacentElement('afterend',b);
  }

  window.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.kt-room9-switch'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    selectGroup9(btn);
  },true);

  window.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var btn=e.target&&e.target.closest?e.target.closest('.kt-room9-switch'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    selectGroup9(btn);
  },true);

  if(!document.getElementById('ktGroup9OnlyStyle')){
    var st=document.createElement('style');
    st.id='ktGroup9OnlyStyle';
    st.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host{grid-column:1!important;grid-row:1!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host-extra{display:none!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video{width:100%!important;height:100%!important;left:0!important;top:0!important;position:absolute!important;object-fit:cover!important;object-position:center!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:13px!important}'
      +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:11px!important}}';
    document.head.appendChild(st);
  }

  window.ktGroup9Mission=function(){
    if(typeof window.showSheet==='function')showSheet('🎯 미션','<div class="rowbox"><b>9명방 미션</b><br>방송 중 진행할 미션을 확인하는 자리입니다.</div>');
  };
  window.ktGroup9Friends=function(){
    if(typeof window.showSheet==='function')showSheet('친구','<div class="rowbox"><b>친구 초대</b><br>친구에게 현재 9명 방송을 알려 함께 들어올 수 있습니다.</div><button class="act" onclick="closeSheet();shareApp()">친구에게 공유</button>');
  };

  function adaptNineRoom(){
    if(!isGroup9())return;
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    room.setAttribute('data-kt-room','9');

    var head=room.querySelector('.ktg13-air strong');
    if(head)head.innerHTML='<i>●</i> 9명 방송';

    var stats=room.querySelectorAll('.ktg13-stats > button');
    if(stats[1]){
      stats[1].innerHTML='🎯 미션';
      stats[1].onclick=function(){window.ktGroup9Mission();};
    }

    var guests=[].slice.call(room.querySelectorAll('.ktg13-guests > .ktg13-guest'));
    guests.slice(8).forEach(function(g){try{g.remove();}catch(e){}});

    var extra=room.querySelector('.ktg13-host-extra');
    if(extra)extra.style.setProperty('display','none','important');

    room.querySelectorAll('.ktg13-tool').forEach(function(btn){
      var label=btn.querySelector('span');
      if(label&&String(label.textContent||'').trim()==='친구')btn.onclick=function(){window.ktGroup9Friends();};
    });

    try{
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 방송';
        state.liveRoomMax=9;
      }
    }catch(e){}
  }

  window.startBroadcast=async function(){
    if(!isGroup9())return oldStartBroadcast.apply(this,arguments);

    try{
      state.liveRoomType='group13';
      state.liveRoomName='13명 방송';
      state.liveRoomMax=13;
    }catch(e){}

    var result=await oldStartBroadcast.apply(this,arguments);

    try{
      state.liveRoomType='group9';
      state.liveRoomName='9명 방송';
      state.liveRoomMax=9;
    }catch(e){}

    [0,20,80,180,400].forEach(function(ms){setTimeout(adaptNineRoom,ms);});
    return result;
  };

  addNineSwitch();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(addNineSwitch,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup9RoomTimer);
      window.__ktGroup9RoomTimer=setTimeout(function(){
        addNineSwitch();
        adaptNineRoom();
      },20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 15명 방송: 13명방 구조를 그대로 이용하고 호스트 1명 + 게스트 14명으로만 확장. */
(function(){
  if(window.__ktGroup15ApprovedRoomInstalled)return;
  window.__ktGroup15ApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;

  function isGroup15(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group15'||n==='15명 방송';
    }catch(e){return false;}
  }

  function hideSecretPassword(){
    var box=document.getElementById('ktSecretPasswordBox');
    if(box){box.classList.remove('on');box.style.setProperty('display','none','important');}
  }

  function selectGroup15(btn){
    try{
      document.querySelectorAll('.live-prep .room-switch').forEach(function(b){
        var on=b===btn;
        b.classList.toggle('on',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
      if(window.state){state.liveRoomType='group15';state.liveRoomName='15명 방송';state.liveRoomMax=15;}
      var title=document.getElementById('liveTitle');
      if(title){title.value='15명 방송';title.dataset.autoRoom='1';}
      hideSecretPassword();
    }catch(e){}
  }

  function addFifteenSwitch(){
    var prep=document.querySelector('.live-prep');
    if(!prep||prep.querySelector('.kt-room15-switch'))return;
    var buttons=[].slice.call(prep.querySelectorAll('.room-switch'));
    var thirteen=buttons.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;});
    if(!thirteen)return;
    var b=thirteen.cloneNode(true);
    b.classList.remove('on');
    b.classList.add('kt-room15-switch');
    b.setAttribute('aria-pressed','false');
    b.innerHTML=String(thirteen.innerHTML||thirteen.textContent||'13명 방송').replace(/13명/g,'15명');
    var nine=prep.querySelector('.kt-room9-switch');
    (nine||thirteen).insertAdjacentElement('afterend',b);
  }

  window.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.kt-room15-switch'):null;
    if(!btn)return;
    e.preventDefault();e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    selectGroup15(btn);
  },true);

  window.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var btn=e.target&&e.target.closest?e.target.closest('.kt-room15-switch'):null;
    if(!btn)return;
    e.preventDefault();e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    selectGroup15(btn);
  },true);

  if(!document.getElementById('ktGroup15OnlyStyle')){
    var st=document.createElement('style');
    st.id='ktGroup15OnlyStyle';
    st.textContent=''
      +'.ktg13-room[data-kt-room="15"] .ktg13-main{grid-template-rows:minmax(0,1fr)!important}'
      +'.ktg13-room[data-kt-room="15"] .ktg13-host{grid-column:1!important;grid-row:1!important}'
      +'.ktg13-room[data-kt-room="15"] .ktg13-guests{grid-column:2!important;grid-row:1!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(5,minmax(0,1fr))!important}'
      +'.ktg13-room[data-kt-room="15"] .ktg13-host-extra{display:none!important}'
      +'#screen .ktg13-room[data-kt-room="15"] .ktg13-host>video{width:100%!important;height:100%!important;left:0!important;top:0!important;position:absolute!important;object-fit:cover!important;object-position:center!important}'
      +'.ktg13-room[data-kt-room="15"] .ktg13-guest{font-size:12px!important}'
      +'@media(max-width:390px){.ktg13-room[data-kt-room="15"] .ktg13-guest{font-size:10px!important}}';
    document.head.appendChild(st);
  }

  window.ktGroup15Mission=function(){
    if(typeof window.showSheet==='function')showSheet('🎯 미션','<div class="rowbox"><b>15명방 미션</b><br>방송 중 진행할 미션을 확인하는 자리입니다.</div>');
  };

  function adaptFifteenRoom(){
    if(!isGroup15())return;
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    room.setAttribute('data-kt-room','15');
    var head=room.querySelector('.ktg13-air strong');
    if(head)head.innerHTML='<i>●</i> 15명 방송';
    var stats=room.querySelectorAll('.ktg13-stats > button');
    if(stats[1]){stats[1].innerHTML='🎯 미션';stats[1].onclick=function(){window.ktGroup15Mission();};}
    var box=room.querySelector('.ktg13-guests');
    if(box){
      var guests=[].slice.call(box.querySelectorAll(':scope > .ktg13-guest'));
      while(guests.length<14){
        var g=document.createElement('div');
        g.className='ktg13-guest';
        g.innerHTML='<span>게스트</span>';
        box.appendChild(g);
        guests.push(g);
      }
      guests.slice(14).forEach(function(g){try{g.remove();}catch(e){}});
    }
    var extra=room.querySelector('.ktg13-host-extra');
    if(extra)extra.style.setProperty('display','none','important');
    try{if(window.state){state.liveRoomType='group15';state.liveRoomName='15명 방송';state.liveRoomMax=15;}}catch(e){}
  }

  window.startBroadcast=async function(){
    if(!isGroup15())return oldStartBroadcast.apply(this,arguments);
    try{state.liveRoomType='group13';state.liveRoomName='13명 방송';state.liveRoomMax=13;}catch(e){}
    var result=await oldStartBroadcast.apply(this,arguments);
    try{state.liveRoomType='group15';state.liveRoomName='15명 방송';state.liveRoomMax=15;}catch(e){}
    [0,20,80,180,400].forEach(function(ms){setTimeout(adaptFifteenRoom,ms);});
    return result;
  };

  addFifteenSwitch();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(addFifteenSwitch,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup15RoomTimer);
      window.__ktGroup15RoomTimer=setTimeout(function(){addFifteenSwitch();adaptFifteenRoom();},20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 방 생성 레벨 조건만 적용: 9명방은 기본, 13명방은 레벨21+, 15명방은 레벨35+. 구독자 입장 규칙은 변경하지 않음. */
(function(){
  if(window.__ktRoomCreateLevelGateInstalled)return;
  window.__ktRoomCreateLevelGateInstalled=true;

  window.ktGetUserLevel=function(){
    var v='';
    try{
      if(window.state){
        if(state.userLevel!=null)v=state.userLevel;
        else if(state.level!=null)v=state.level;
        else if(state.memberLevel!=null)v=state.memberLevel;
      }
    }catch(e){}
    if(v===''||v==null){
      try{v=localStorage.getItem('kt_user_level')||localStorage.getItem('ktalk_user_level')||'1';}catch(e){v='1';}
    }
    v=parseInt(v,10);
    return isFinite(v)&&v>0?v:1;
  };

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;

  window.startBroadcast=async function(){
    var t='',n='';
    try{t=(window.state&&state.liveRoomType)||'';n=(window.state&&state.liveRoomName)||'';}catch(e){}
    var lv=window.ktGetUserLevel();
    var is13=(t==='group'||t==='group13'||n==='13명 방송');
    var is15=(t==='group15'||n==='15명 방송');
    if(is15&&lv<35){
      alert('15명방은 레벨 35부터 만들 수 있습니다.');
      return false;
    }
    if(is13&&lv<21){
      alert('13명방은 레벨 21부터 만들 수 있습니다.');
      return false;
    }
    return oldStartBroadcast.apply(this,arguments);
  };
})();
