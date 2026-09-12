/* K-Talk 보물상자 표시 위치만 수정: 활성 보물상자는 호스트 영상 왼쪽 위 구석에 표시. 기존 보물상자 버튼/기능은 그대로 유지. */
(function(){
  if(window.__ktTreasureLeftCornerFixInstalled)return;
  window.__ktTreasureLeftCornerFixInstalled=true;

  var kt9MoveMode=false;
  var kt9SelectedGuest=null;
  var kt9RepeatTimer=null;
  var kt9RepeatDelay=null;

  function ensureStyle(){
    if(document.getElementById('ktTreasureLeftCornerFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktTreasureLeftCornerFixStyle';
    s.textContent=''
      +'#ktGlobalTreasureHostBadge{left:6px!important;right:auto!important;top:22px!important}'
      +'#ktTreasureHostHeadFallback{right:auto!important}'
      +'@media(max-width:390px){#ktGlobalTreasureHostBadge{left:4px!important;right:auto!important;top:18px!important}}';
    document.head.appendChild(s);
  }

  function ensureNineRoomLayoutStyle(){
    if(document.getElementById('ktNineRoomLayoutChoicesStyle'))return;
    var s=document.createElement('style');
    s.id='ktNineRoomLayoutChoicesStyle';
    s.textContent=''
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-wrap{position:absolute!important;z-index:40!important;top:5px!important;left:50%!important;transform:translateX(-50%)!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:5px!important;pointer-events:auto!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-trigger{height:38px!important;padding:0 16px!important;border:2px solid #ff2bbdcc!important;border-radius:14px!important;background:#111116ee!important;color:#fff!important;font-size:14px!important;font-weight:950!important;box-shadow:0 2px 12px #000a!important;white-space:nowrap!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-picker{display:none!important;width:222px!important;flex-wrap:wrap!important;justify-content:center!important;gap:5px!important;padding:6px!important;border-radius:14px!important;background:#050507f2!important;border:1px solid #ff2bbd99!important;box-shadow:0 3px 14px #000c!important;pointer-events:auto!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-picker.open{display:flex!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn,.ktg13-room[data-kt-room="9"] .kt9-layout-close,.ktg13-room[data-kt-room="9"] .kt9-move-switch{height:34px!important;min-width:58px!important;padding:0 9px!important;border:1px solid #555560!important;border-radius:10px!important;background:#17171c!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1!important;display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn.on{border-color:#ff32c7!important;background:#33102e!important;color:#ffe8fb!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-switch{min-width:190px!important;border-color:#ffcf35!important;background:#221d0a!important;color:#ffe36a!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-switch.on{background:#4b1642!important;border-color:#ff35cf!important;color:#fff!important;box-shadow:0 0 10px #ff35cf88!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-close{min-width:190px!important;border-color:#ffffff55!important;background:#24242b!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-hint{width:100%!important;text-align:center!important;color:#ffe16a!important;font-size:10px!important;font-weight:900!important;line-height:1.25!important;padding:1px 2px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-selected{outline:3px solid #ffe13b!important;outline-offset:-3px!important;box-shadow:inset 0 0 0 2px #0008!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-nav{position:absolute!important;left:8px!important;right:8px!important;bottom:10px!important;z-index:42!important;display:none!important;grid-template-columns:52px minmax(90px,1fr) 52px 64px!important;gap:7px!important;align-items:center!important;pointer-events:none!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-nav.on{display:grid!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-nav button{height:46px!important;border:2px solid #ffffff55!important;border-radius:15px!important;background:#111116ee!important;color:#fff!important;font-size:14px!important;font-weight:950!important;box-shadow:0 3px 12px #000b!important;pointer-events:auto!important;touch-action:none!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-nav .kt9-arrow{font-size:26px!important;color:#ffe13b!important;border-color:#ffe13b99!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-host-go{border-color:#ff35cfaa!important;background:#42113aee!important;color:#fff!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-move-exit{border-color:#ffffff66!important;background:#2b2b32ee!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host-extra{display:none!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video{width:100%!important;height:100%!important;left:0!important;top:0!important;position:absolute!important;object-fit:cover!important;object-position:center!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="grid"] .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="grid"] .ktg13-host{grid-column:1!important;grid-row:1!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="grid"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="side"] .ktg13-main{display:grid!important;grid-template-columns:42% 58%!important;grid-template-rows:minmax(0,1fr)!important;gap:3px!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="side"] .ktg13-host{grid-column:1!important;grid-row:1!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="side"] .ktg13-guests{display:grid!important;grid-column:2!important;grid-row:1!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="focus"] .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="focus"] .ktg13-host{grid-column:1 / 3!important;grid-row:1 / 3!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room[data-kt-room="9"][data-kt9-layout="focus"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-guest{min-width:0!important;min-height:0!important;font-size:12px!important}'
      +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .kt9-layout-wrap{top:4px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-trigger{height:34px!important;padding:0 13px!important;font-size:13px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-picker{width:205px!important;padding:5px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-btn,.ktg13-room[data-kt-room="9"] .kt9-layout-close,.ktg13-room[data-kt-room="9"] .kt9-move-switch{height:32px!important;min-width:54px!important;padding:0 7px!important;font-size:11px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-close,.ktg13-room[data-kt-room="9"] .kt9-move-switch{min-width:177px!important}.ktg13-room[data-kt-room="9"] .kt9-move-nav{left:5px!important;right:5px!important;bottom:7px!important;grid-template-columns:46px minmax(78px,1fr) 46px 58px!important;gap:5px!important}.ktg13-room[data-kt-room="9"] .kt9-move-nav button{height:42px!important;font-size:12px!important}.ktg13-room[data-kt-room="9"] .kt9-move-nav .kt9-arrow{font-size:23px!important}.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function savedNineLayout(){
    try{
      var v=localStorage.getItem('kt9_layout_choice');
      if(v==='grid'||v==='side'||v==='focus')return v;
    }catch(e){}
    return 'grid';
  }

  function applyNineLayout(layout,save){
    if(layout!=='grid'&&layout!=='side'&&layout!=='focus')layout='grid';
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    room.setAttribute('data-kt9-layout',layout);
    room.querySelectorAll('.kt9-layout-btn').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-layout')===layout);
    });
    if(save){
      try{localStorage.setItem('kt9_layout_choice',layout);}catch(e){}
    }
  }

  function mediaOf(tile){
    if(!tile)return null;
    var all=[].slice.call(tile.querySelectorAll('video,img[data-kt-live-person],img[data-kt-remote-person="1"],img.ktg13-guest-photo'));
    for(var i=0;i<all.length;i++){
      var m=all[i];
      if(m.tagName==='VIDEO'){
        try{if(m.srcObject||m.currentSrc||m.getAttribute('src'))return m;}catch(e){}
      }else return m;
    }
    return null;
  }

  function clearSelected(){
    if(kt9SelectedGuest)kt9SelectedGuest.classList.remove('kt9-move-selected');
    kt9SelectedGuest=null;
  }

  function selectGuest(guest){
    if(!guest)return;
    clearSelected();
    kt9SelectedGuest=guest;
    guest.classList.add('kt9-move-selected');
  }

  function swapMedia(a,b){
    if(!a||!b||a===b)return false;
    var ma=mediaOf(a),mb=mediaOf(b);
    if(!ma)return false;
    var markA=document.createComment('kt9-a');
    var markB=document.createComment('kt9-b');
    ma.parentNode.insertBefore(markA,ma);
    if(mb)mb.parentNode.insertBefore(markB,mb);
    b.appendChild(ma);
    if(mb&&markA.parentNode)markA.parentNode.insertBefore(mb,markA);
    if(markA.parentNode)markA.remove();
    if(markB.parentNode)markB.remove();
    return true;
  }

  function swapGuestToHost(guest){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room||!guest)return false;
    var host=room.querySelector('.ktg13-host');
    if(!host)return false;
    if(!swapMedia(guest,host))return false;
    try{document.dispatchEvent(new CustomEvent('kt-person-seat-change',{detail:{room:'9',to:'host'}}));}catch(e){}
    return true;
  }

  function moveSelectedGuest(step){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var guests=[].slice.call(room.querySelectorAll('.ktg13-guest'));
    if(!guests.length)return;
    if(!kt9SelectedGuest||guests.indexOf(kt9SelectedGuest)<0){
      for(var i=0;i<guests.length;i++)if(mediaOf(guests[i])){selectGuest(guests[i]);break;}
      if(!kt9SelectedGuest)return;
    }
    var cur=guests.indexOf(kt9SelectedGuest);
    var next=(cur+step+guests.length)%guests.length;
    var target=guests[next];
    if(!swapMedia(kt9SelectedGuest,target))return;
    selectGuest(target);
    try{document.dispatchEvent(new CustomEvent('kt-person-seat-change',{detail:{room:'9',direction:step<0?'left':'right'}}));}catch(e){}
  }

  function stopRepeat(){
    if(kt9RepeatDelay){clearTimeout(kt9RepeatDelay);kt9RepeatDelay=null;}
    if(kt9RepeatTimer){clearInterval(kt9RepeatTimer);kt9RepeatTimer=null;}
  }

  function startRepeat(step){
    stopRepeat();
    moveSelectedGuest(step);
    kt9RepeatDelay=setTimeout(function(){
      kt9RepeatTimer=setInterval(function(){moveSelectedGuest(step);},170);
    },360);
  }

  function setMoveMode(on){
    kt9MoveMode=!!on;
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var nav=room.querySelector('.kt9-move-nav');
    var sw=room.querySelector('.kt9-move-switch');
    if(nav)nav.classList.toggle('on',kt9MoveMode);
    if(sw){sw.classList.toggle('on',kt9MoveMode);sw.textContent=kt9MoveMode?'자리 이동 켜짐':'자리 이동 스위치';}
    if(!kt9MoveMode){stopRepeat();clearSelected();}
  }

  function ensureMoveNav(main){
    var nav=main.querySelector('.kt9-move-nav');
    if(nav)return nav;
    nav=document.createElement('div');
    nav.className='kt9-move-nav';
    nav.innerHTML=''
      +'<button type="button" class="kt9-arrow kt9-move-left" aria-label="왼쪽 자리">◀</button>'
      +'<button type="button" class="kt9-host-go">호스트 자리</button>'
      +'<button type="button" class="kt9-arrow kt9-move-right" aria-label="오른쪽 자리">▶</button>'
      +'<button type="button" class="kt9-move-exit">나가기</button>';
    main.appendChild(nav);

    var left=nav.querySelector('.kt9-move-left');
    var right=nav.querySelector('.kt9-move-right');
    var hostGo=nav.querySelector('.kt9-host-go');
    var exit=nav.querySelector('.kt9-move-exit');

    left.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();startRepeat(-1);},true);
    right.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();startRepeat(1);},true);
    ['pointerup','pointercancel','pointerleave'].forEach(function(name){
      left.addEventListener(name,stopRepeat,true);
      right.addEventListener(name,stopRepeat,true);
    });
    hostGo.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      if(kt9SelectedGuest&&swapGuestToHost(kt9SelectedGuest)){clearSelected();}
    },true);
    exit.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();setMoveMode(false);},true);
    return nav;
  }

  function bindMoveMode(main){
    if(!main||main.dataset.kt9MoveModeBound==='1')return;
    main.dataset.kt9MoveModeBound='1';
    main.addEventListener('click',function(e){
      if(!kt9MoveMode)return;
      if(e.target.closest('.kt9-layout-wrap,.kt9-move-nav,button,a,input,select,textarea,label'))return;
      var guest=e.target.closest('.ktg13-guest');
      if(guest&&main.contains(guest)){
        e.preventDefault();e.stopPropagation();selectGuest(guest);return;
      }
      var host=e.target.closest('.ktg13-host');
      if(host&&main.contains(host)&&kt9SelectedGuest){
        e.preventDefault();e.stopPropagation();
        if(swapGuestToHost(kt9SelectedGuest)){clearSelected();}
      }
    },true);
  }

  function ensureNineLayoutPicker(){
    ensureNineRoomLayoutStyle();
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var main=room.querySelector('.ktg13-main');
    if(!main)return;
    ensureMoveNav(main);
    bindMoveMode(main);
    var wrap=main.querySelector('.kt9-layout-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='kt9-layout-wrap';
      wrap.innerHTML=''
        +'<button type="button" class="kt9-layout-trigger">↔ 자리 이동</button>'
        +'<div class="kt9-layout-picker">'
          +'<div class="kt9-layout-hint">안에서 스위치를 켠 뒤 사람을 눌러 이동</div>'
          +'<button type="button" class="kt9-move-switch">자리 이동 스위치</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="grid">격자</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="side">좌측</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="focus">큰칸</button>'
          +'<button type="button" class="kt9-layout-close">✕ 닫기</button>'
        +'</div>';
      var trigger=wrap.querySelector('.kt9-layout-trigger');
      var picker=wrap.querySelector('.kt9-layout-picker');
      var moveSwitch=wrap.querySelector('.kt9-move-switch');
      trigger.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        picker.classList.toggle('open');
      },true);
      moveSwitch.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        setMoveMode(!kt9MoveMode);
        picker.classList.remove('open');
      },true);
      picker.addEventListener('click',function(e){
        var close=e.target&&e.target.closest?e.target.closest('.kt9-layout-close'):null;
        if(close){
          e.preventDefault();
          e.stopPropagation();
          picker.classList.remove('open');
          return;
        }
        var b=e.target&&e.target.closest?e.target.closest('.kt9-layout-btn'):null;
        if(!b)return;
        e.preventDefault();
        e.stopPropagation();
        applyNineLayout(b.getAttribute('data-layout'),true);
        picker.classList.remove('open');
      },true);
      main.appendChild(wrap);
    }
    setMoveMode(kt9MoveMode);
    applyNineLayout(savedNineLayout(),false);
  }

  function moveFallback(){
    var b=document.getElementById('ktTreasureHostHeadFallback');
    if(!b)return;
    var host=document.querySelector('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host');
    if(!host)return;
    var r=host.getBoundingClientRect();
    b.style.setProperty('left',Math.max(4,r.left+6)+'px','important');
    b.style.setProperty('right','auto','important');
    b.style.setProperty('top',Math.max(4,r.top+22)+'px','important');
  }

  function moveGlobal(){
    var b=document.getElementById('ktGlobalTreasureHostBadge');
    if(b){
      b.style.setProperty('left','6px','important');
      b.style.setProperty('right','auto','important');
      b.style.setProperty('top','22px','important');
    }
  }

  function apply(){ensureStyle();ensureNineLayoutPicker();moveGlobal();moveFallback();}
  apply();
  setTimeout(apply,80);
  setTimeout(apply,300);
  setInterval(apply,300);
})();