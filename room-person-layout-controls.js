/* K-Talk 사람 화면 배치 조절 전용: 13명방/구독자방/비밀방만. 호스트·운영진만 조작. */
(function(){
  if(window.__ktRoomPersonLayoutControlsV2Installed)return;
  window.__ktRoomPersonLayoutControlsV2Installed=true;

  var selected=null;
  var drag=null;

  function roomInfo(){
    var room=document.querySelector('.ktg13-room');
    if(room)return {room:room,key:'group13',tiles:'.ktg13-host,.ktg13-guest',guests:'.ktg13-guest'};
    room=document.querySelector('.ktsubscriber-room');
    if(room)return {room:room,key:'subscriber',tiles:'.ktsubscriber-host,.ktsubscriber-guest',guests:'.ktsubscriber-guest'};
    room=document.querySelector('.ktsecret-room');
    if(room)return {room:room,key:'secret',tiles:'.ktsecret-slot,.ktsecret-guest-slot',guests:'.ktsecret-slot:not(.host),.ktsecret-guest-slot:not(.host)'};
    return null;
  }

  function mediaOf(tile){
    if(!tile)return null;
    return tile.querySelector('video,img.ktsecret-guest-photo,img.ktsubscriber-guest-photo,img[data-kt-live-person],img');
  }

  function localRoleText(){
    var s=window.state||{};
    var vals=[s.role,s.userRole,s.memberRole,s.levelName,s.gradeName,s.rankName,s.membershipName,s.userGrade,s.userLevel];
    try{
      ['kt_role','kt_user_role','kt_member_role','kt_grade','kt_level_name'].forEach(function(k){var v=localStorage.getItem(k);if(v)vals.push(v);});
    }catch(e){}
    return vals.filter(Boolean).join(' ');
  }

  function isManager(){
    var s=window.state||{};
    if(s.isHost===true||s.isAdmin===true||s.isOperator===true||s.isStaff===true||window.KT_IS_ADMIN===true||window.KT_IS_OPERATOR===true)return true;
    if(/최고\s*운영자|운영자|관리자|admin|operator|staff/i.test(localRoleText()))return true;
    try{
      if(s.stream){
        var host=document.querySelector('.ktg13-host video,.ktsubscriber-host video,.ktsecret-slot.host video');
        if(host&&host.srcObject&&host.srcObject===s.stream)return true;
      }
    }catch(e){}
    return false;
  }

  function allTiles(info){return info?[].slice.call(info.room.querySelectorAll(info.tiles)):[];}
  function guestTiles(info){return info?[].slice.call(info.room.querySelectorAll(info.guests)):[];}
  function tileIndex(info,tile){return Math.max(0,allTiles(info).indexOf(tile));}
  function stateKey(info,tile){return 'kt_person_layout_'+info.key+'_'+tileIndex(info,tile);}

  function readState(info,tile){
    var base={x:50,y:50,zoom:1,shape:1};
    try{
      var v=JSON.parse(localStorage.getItem(stateKey(info,tile))||'null');
      if(v&&typeof v==='object'){
        if(isFinite(v.x))base.x=Math.max(0,Math.min(100,Number(v.x)));
        if(isFinite(v.y))base.y=Math.max(0,Math.min(100,Number(v.y)));
        if(isFinite(v.zoom))base.zoom=Math.max(.75,Math.min(1.65,Number(v.zoom)));
        if(isFinite(v.shape))base.shape=Math.max(1,Math.min(3,Number(v.shape)));
      }
    }catch(e){}
    return base;
  }

  function writeState(info,tile,st){try{localStorage.setItem(stateKey(info,tile),JSON.stringify(st));}catch(e){}}
  function shapeRadius(n){return n===1?'7px':n===2?'18px':'32px';}

  function applyState(info,tile,st){
    if(!tile)return;
    var m=mediaOf(tile);
    tile.style.setProperty('border-radius',shapeRadius(st.shape),'important');
    if(m){
      m.style.setProperty('object-position',st.x+'% '+st.y+'%','important');
      try{m.style.setProperty('scale',String(st.zoom),'important');}catch(e){}
      m.dataset.ktPersonLayout='1';
    }
    tile.dataset.ktPersonX=String(st.x);
    tile.dataset.ktPersonY=String(st.y);
    tile.dataset.ktPersonZoom=String(st.zoom);
    tile.dataset.ktPersonShape=String(st.shape);
  }

  function currentState(info,tile){
    var st=readState(info,tile);
    if(tile&&tile.dataset){
      if(tile.dataset.ktPersonX)st.x=Number(tile.dataset.ktPersonX)||50;
      if(tile.dataset.ktPersonY)st.y=Number(tile.dataset.ktPersonY)||50;
      if(tile.dataset.ktPersonZoom)st.zoom=Number(tile.dataset.ktPersonZoom)||1;
      if(tile.dataset.ktPersonShape)st.shape=Number(tile.dataset.ktPersonShape)||1;
    }
    return st;
  }

  function seatNumber(info,tile){
    if(!info||!tile)return 0;
    var gs=guestTiles(info);
    var n=gs.indexOf(tile);
    return n<0?0:n+1;
  }

  function updatePanelTitle(){
    var info=roomInfo();
    var t=document.getElementById('ktPersonLayoutSelectedText');
    var input=document.getElementById('ktPersonSeatTarget');
    if(!t||!info)return;
    var n=seatNumber(info,selected);
    t.textContent=n?('선택: 게스트 '+n+'번'):'선택: 호스트';
    if(input){
      input.max=String(Math.max(1,guestTiles(info).length));
      if(n)input.value=String(n);
    }
  }

  function selectTile(tile){
    var info=roomInfo();
    if(!info||!tile||!isManager())return;
    if(selected)selected.classList.remove('kt-person-layout-selected');
    selected=tile;
    selected.classList.add('kt-person-layout-selected');
    applyState(info,tile,currentState(info,tile));
    var p=document.getElementById('ktPersonLayoutPanel');
    if(p)p.classList.add('on');
    updatePanelTitle();
  }

  function changeSelected(kind,value){
    var info=roomInfo();
    if(!info||!selected||!info.room.contains(selected)||!isManager())return;
    var st=currentState(info,selected);
    var step=Math.max(1,Math.min(3,Number(document.getElementById('ktPersonMoveStep')&&document.getElementById('ktPersonMoveStep').value)||1))*7;
    if(kind==='up')st.y=Math.max(0,st.y-step);
    if(kind==='down')st.y=Math.min(100,st.y+step);
    if(kind==='left')st.x=Math.max(0,st.x-step);
    if(kind==='right')st.x=Math.min(100,st.x+step);
    if(kind==='bigger')st.zoom=Math.min(1.65,Math.round((st.zoom+.1)*100)/100);
    if(kind==='smaller')st.zoom=Math.max(.75,Math.round((st.zoom-.1)*100)/100);
    if(kind==='shape')st.shape=value;
    if(kind==='reset')st={x:50,y:50,zoom:1,shape:1};
    applyState(info,selected,st);
    writeState(info,selected,st);
  }

  function moveMediaBetween(a,b){
    if(!a||!b||a===b)return;
    var ma=mediaOf(a),mb=mediaOf(b);
    var markA=document.createComment('kt-a'),markB=document.createComment('kt-b');
    if(ma)ma.parentNode.insertBefore(markA,ma);
    if(mb)mb.parentNode.insertBefore(markB,mb);
    if(ma)markB.parentNode.insertBefore(ma,markB);
    if(mb)markA.parentNode.insertBefore(mb,markA);
    if(markA.parentNode)markA.remove();
    if(markB.parentNode)markB.remove();
  }

  function moveSeat(delta,targetNumber){
    var info=roomInfo();
    if(!info||!selected||!isManager())return;
    var gs=guestTiles(info);
    var cur=gs.indexOf(selected);
    if(cur<0)return;
    var next=typeof targetNumber==='number'?targetNumber-1:cur+delta;
    next=Math.max(0,Math.min(gs.length-1,next));
    if(next===cur)return;
    var target=gs[next];
    moveMediaBetween(selected,target);
    selected.classList.remove('kt-person-layout-selected');
    selected=target;
    selected.classList.add('kt-person-layout-selected');
    updateNumberBadges();
    updatePanelTitle();
    setTimeout(function(){try{document.dispatchEvent(new Event('kt-person-seat-change'));}catch(e){}},0);
  }

  function addStyle(){
    if(document.getElementById('ktPersonLayoutControlsStyleV2'))return;
    var s=document.createElement('style');
    s.id='ktPersonLayoutControlsStyleV2';
    s.textContent=`
      .kt-person-seat-number{position:absolute!important;right:4px!important;top:4px!important;z-index:18!important;min-width:22px!important;height:22px!important;padding:0 5px!important;border-radius:999px!important;display:grid!important;place-items:center!important;background:#000c!important;border:1px solid #ffd43b!important;color:#ffd43b!important;font:950 11px/1 system-ui!important;pointer-events:none!important}
      .kt-person-layout-launch{position:fixed!important;right:7px!important;top:45%!important;z-index:2147482000!important;width:44px!important;height:36px!important;border:1px solid #ffffff45!important;border-radius:13px!important;background:#111d!important;color:#fff!important;font-size:11px!important;font-weight:950!important;box-shadow:0 2px 12px #0009!important}
      .kt-person-layout-panel{position:fixed!important;right:7px!important;top:calc(45% + 42px)!important;z-index:2147482000!important;width:174px!important;padding:7px!important;border:1px solid #ffffff38!important;border-radius:14px!important;background:#0d0d11f2!important;box-shadow:0 8px 28px #000c!important;display:none!important;grid-template-columns:repeat(3,1fr)!important;gap:5px!important}
      .kt-person-layout-panel.on{display:grid!important}
      .kt-person-layout-panel button,.kt-person-layout-panel select,.kt-person-layout-panel input{height:34px!important;border:1px solid #ffffff2b!important;border-radius:10px!important;background:#1b1b22!important;color:#fff!important;font-size:11px!important;font-weight:900!important;padding:0 4px!important;min-width:0!important}
      .kt-person-layout-panel .wide{grid-column:span 3!important}
      .kt-person-layout-panel .span2{grid-column:span 2!important}
      .kt-person-layout-panel .title{grid-column:span 3!important;color:#ffd43b!important;font-size:11px!important;font-weight:950!important;text-align:center!important;padding:3px 0!important}
      .kt-person-layout-selected{outline:2px solid #ffd43b!important;outline-offset:-2px!important}
      .ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-guest-slot{touch-action:none}
    `;
    document.head.appendChild(s);
  }

  function updateNumberBadges(){
    var info=roomInfo();
    if(!info)return;
    allTiles(info).forEach(function(tile){
      var n=seatNumber(info,tile);
      var b=tile.querySelector(':scope > .kt-person-seat-number');
      if(!b){b=document.createElement('span');b.className='kt-person-seat-number';tile.appendChild(b);}
      b.textContent=n?String(n):'H';
      b.title=n?('게스트 '+n+'번'):'호스트';
    });
  }

  function ensurePanel(){
    var info=roomInfo();
    var oldBtn=document.getElementById('ktPersonLayoutLaunch');
    var oldPanel=document.getElementById('ktPersonLayoutPanel');
    if(!info){if(oldBtn)oldBtn.remove();if(oldPanel)oldPanel.remove();selected=null;return;}
    addStyle();
    updateNumberBadges();

    if(!isManager()){
      if(oldBtn)oldBtn.remove();
      if(oldPanel)oldPanel.remove();
      if(selected)selected.classList.remove('kt-person-layout-selected');
      selected=null;
      return;
    }

    if(!oldBtn){
      var b=document.createElement('button');
      b.id='ktPersonLayoutLaunch';b.className='kt-person-layout-launch';b.type='button';b.textContent='배치';
      b.onclick=function(e){e.stopPropagation();var p=document.getElementById('ktPersonLayoutPanel');if(p)p.classList.toggle('on');};
      document.body.appendChild(b);
    }
    if(!oldPanel){
      var p=document.createElement('div');
      p.id='ktPersonLayoutPanel';p.className='kt-person-layout-panel';
      p.innerHTML=''
        +'<div id="ktPersonLayoutSelectedText" class="title">사람 사진을 눌러 선택</div>'
        +'<button data-act="seatUp">자리↑</button><input id="ktPersonSeatTarget" type="number" min="1" value="1"><button data-act="seatDown">자리↓</button>'
        +'<select id="ktPersonMoveStep"><option value="1">1칸</option><option value="2">2칸</option><option value="3">3칸</option></select><button class="span2" data-act="seatGo">번호 자리로 이동</button>'
        +'<button data-act="shape" data-v="1">박스1</button><button data-act="shape" data-v="2">박스2</button><button data-act="shape" data-v="3">박스3</button>'
        +'<button data-act="left">←</button><button data-act="up">사람↑</button><button data-act="right">→</button>'
        +'<button data-act="smaller">작게</button><button data-act="down">사람↓</button><button data-act="bigger">크게</button>'
        +'<button class="wide" data-act="reset">원래대로</button>';
      p.addEventListener('click',function(e){
        var btn=e.target.closest('button');if(!btn)return;e.stopPropagation();
        var act=btn.dataset.act;
        if(act==='shape')changeSelected('shape',Number(btn.dataset.v)||1);
        else if(act==='seatUp')moveSeat(-1);
        else if(act==='seatDown')moveSeat(1);
        else if(act==='seatGo'){
          var inp=document.getElementById('ktPersonSeatTarget');
          moveSeat(0,Math.max(1,Number(inp&&inp.value)||1));
        }else changeSelected(act);
      });
      document.body.appendChild(p);
    }

    allTiles(info).forEach(function(tile){
      if(tile.dataset.ktPersonLayoutBoundV2==='1')return;
      tile.dataset.ktPersonLayoutBoundV2='1';
      applyState(info,tile,readState(info,tile));

      tile.addEventListener('click',function(e){
        if(!isManager())return;
        if(e.target.closest('button,.kt-person-seat-number'))return;
        e.stopPropagation();
        selectTile(tile);
      },true);

      tile.addEventListener('pointerdown',function(e){
        var panel=document.getElementById('ktPersonLayoutPanel');
        if(!isManager()||!panel||!panel.classList.contains('on')||!mediaOf(tile))return;
        selectTile(tile);
        var cur=currentState(info,tile);
        drag={tile:tile,startX:e.clientX,startY:e.clientY,x:cur.x,y:cur.y};
        try{tile.setPointerCapture(e.pointerId);}catch(err){}
        e.preventDefault();
      },true);

      tile.addEventListener('pointermove',function(e){
        if(!drag||drag.tile!==tile)return;
        var r=tile.getBoundingClientRect();if(!r.width||!r.height)return;
        var st=currentState(info,tile);
        st.x=Math.max(0,Math.min(100,drag.x+(e.clientX-drag.startX)/r.width*100));
        st.y=Math.max(0,Math.min(100,drag.y+(e.clientY-drag.startY)/r.height*100));
        applyState(info,tile,st);e.preventDefault();
      },true);

      function finishDrag(){if(!drag||drag.tile!==tile)return;writeState(info,tile,currentState(info,tile));drag=null;}
      tile.addEventListener('pointerup',finishDrag,true);
      tile.addEventListener('pointercancel',finishDrag,true);
    });
  }

  ensurePanel();
  [100,350,800,1500].forEach(function(ms){setTimeout(ensurePanel,ms);});
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktPersonLayoutTimerV2);window.__ktPersonLayoutTimerV2=setTimeout(ensurePanel,45);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
