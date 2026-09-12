/* 9명 방 전용 복구: 아까 만든 자리 이동/배치만 복원. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktNineRoomSavedRestoreInstalled)return;
  window.__ktNineRoomSavedRestoreInstalled=true;

  var moveMode=false;
  var selectedGuest=null;
  var repeatTimer=null;
  var repeatDelay=null;
  try{localStorage.setItem('kt9_layout_choice','grid');}catch(e){}

  function ensureStyle(){
    if(document.getElementById('ktNineRoomSavedRestoreStyle'))return;
    var s=document.createElement('style');
    s.id='ktNineRoomSavedRestoreStyle';
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

  function savedLayout(){
    try{var v=localStorage.getItem('kt9_layout_choice');if(v==='grid'||v==='side'||v==='focus')return v;}catch(e){}
    return 'grid';
  }
  function applyLayout(layout,save){
    if(layout!=='grid'&&layout!=='side'&&layout!=='focus')layout='grid';
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    room.setAttribute('data-kt9-layout',layout);
    room.querySelectorAll('.kt9-layout-btn').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-layout')===layout);});
    if(save){try{localStorage.setItem('kt9_layout_choice',layout);}catch(e){}}
  }
  function mediaOf(tile){
    if(!tile)return null;
    var all=[].slice.call(tile.querySelectorAll('video,img[data-kt-live-person],img[data-kt-remote-person="1"],img.ktg13-guest-photo'));
    for(var i=0;i<all.length;i++){
      var m=all[i];
      if(m.tagName==='VIDEO'){try{if(m.srcObject||m.currentSrc||m.getAttribute('src'))return m;}catch(e){}}
      else return m;
    }
    return null;
  }
  function clearSelected(){if(selectedGuest)selectedGuest.classList.remove('kt9-move-selected');selectedGuest=null;}
  function selectGuest(g){if(!g)return;clearSelected();selectedGuest=g;g.classList.add('kt9-move-selected');}
  function swapMedia(a,b){
    if(!a||!b||a===b)return false;
    var ma=mediaOf(a),mb=mediaOf(b);if(!ma)return false;
    var aa=document.createComment('kt9-a'),bb=document.createComment('kt9-b');
    ma.parentNode.insertBefore(aa,ma);if(mb)mb.parentNode.insertBefore(bb,mb);b.appendChild(ma);
    if(mb&&aa.parentNode)aa.parentNode.insertBefore(mb,aa);if(aa.parentNode)aa.remove();if(bb.parentNode)bb.remove();return true;
  }
  function toHost(g){var room=document.querySelector('.ktg13-room[data-kt-room="9"]');if(!room||!g)return false;var h=room.querySelector('.ktg13-host');if(!h||!swapMedia(g,h))return false;try{document.dispatchEvent(new CustomEvent('kt-person-seat-change',{detail:{room:'9',to:'host'}}));}catch(e){}return true;}
  function move(step){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');if(!room)return;
    var gs=[].slice.call(room.querySelectorAll('.ktg13-guest'));if(!gs.length)return;
    if(!selectedGuest||gs.indexOf(selectedGuest)<0){for(var i=0;i<gs.length;i++)if(mediaOf(gs[i])){selectGuest(gs[i]);break;}if(!selectedGuest)return;}
    var cur=gs.indexOf(selectedGuest),next=(cur+step+gs.length)%gs.length,target=gs[next];if(!swapMedia(selectedGuest,target))return;selectGuest(target);
    try{document.dispatchEvent(new CustomEvent('kt-person-seat-change',{detail:{room:'9',direction:step<0?'left':'right'}}));}catch(e){}
  }
  function stopRepeat(){if(repeatDelay){clearTimeout(repeatDelay);repeatDelay=null;}if(repeatTimer){clearInterval(repeatTimer);repeatTimer=null;}}
  function startRepeat(step){stopRepeat();move(step);repeatDelay=setTimeout(function(){repeatTimer=setInterval(function(){move(step);},170);},360);}
  function setMoveMode(on){
    moveMode=!!on;var room=document.querySelector('.ktg13-room[data-kt-room="9"]');if(!room)return;
    var nav=room.querySelector('.kt9-move-nav'),sw=room.querySelector('.kt9-move-switch');if(nav)nav.classList.toggle('on',moveMode);if(sw){sw.classList.toggle('on',moveMode);sw.textContent=moveMode?'자리 이동 켜짐':'자리 이동 스위치';}if(!moveMode){stopRepeat();clearSelected();}
  }
  function ensureMoveNav(main){
    var nav=main.querySelector('.kt9-move-nav');if(nav)return nav;
    nav=document.createElement('div');nav.className='kt9-move-nav';nav.innerHTML='<button type="button" class="kt9-arrow kt9-move-left">◀</button><button type="button" class="kt9-host-go">호스트 자리</button><button type="button" class="kt9-arrow kt9-move-right">▶</button><button type="button" class="kt9-move-exit">나가기</button>';main.appendChild(nav);
    var l=nav.querySelector('.kt9-move-left'),r=nav.querySelector('.kt9-move-right'),h=nav.querySelector('.kt9-host-go'),x=nav.querySelector('.kt9-move-exit');
    l.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();startRepeat(-1);},true);r.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();startRepeat(1);},true);
    ['pointerup','pointercancel','pointerleave'].forEach(function(n){l.addEventListener(n,stopRepeat,true);r.addEventListener(n,stopRepeat,true);});
    h.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(selectedGuest&&toHost(selectedGuest))clearSelected();},true);x.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();setMoveMode(false);},true);return nav;
  }
  function bindMove(main){
    if(!main||main.dataset.kt9SavedMoveBound==='1')return;main.dataset.kt9SavedMoveBound='1';
    main.addEventListener('click',function(e){
      if(!moveMode)return;if(e.target.closest('.kt9-layout-wrap,.kt9-move-nav,button,a,input,select,textarea,label'))return;
      var g=e.target.closest('.ktg13-guest');if(g&&main.contains(g)){e.preventDefault();e.stopPropagation();selectGuest(g);return;}
      var h=e.target.closest('.ktg13-host');if(h&&main.contains(h)&&selectedGuest){e.preventDefault();e.stopPropagation();if(toHost(selectedGuest))clearSelected();}
    },true);
  }
  function install(){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');if(!room)return;
    ensureStyle();var main=room.querySelector('.ktg13-main');if(!main)return;ensureMoveNav(main);bindMove(main);
    var wrap=main.querySelector('.kt9-layout-wrap');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='kt9-layout-wrap';wrap.innerHTML='<button type="button" class="kt9-layout-trigger">↔ 자리 이동</button><div class="kt9-layout-picker"><div class="kt9-layout-hint">안에서 스위치를 켠 뒤 사람을 눌러 이동</div><button type="button" class="kt9-move-switch">자리 이동 스위치</button><button type="button" class="kt9-layout-btn" data-layout="grid">격자</button><button type="button" class="kt9-layout-btn" data-layout="side">좌측</button><button type="button" class="kt9-layout-btn" data-layout="focus">큰칸</button><button type="button" class="kt9-layout-close">✕ 닫기</button></div>';
      var trigger=wrap.querySelector('.kt9-layout-trigger'),picker=wrap.querySelector('.kt9-layout-picker'),sw=wrap.querySelector('.kt9-move-switch');
      trigger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();picker.classList.toggle('open');},true);
      sw.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();setMoveMode(!moveMode);picker.classList.remove('open');},true);
      picker.addEventListener('click',function(e){var c=e.target.closest('.kt9-layout-close');if(c){e.preventDefault();e.stopPropagation();picker.classList.remove('open');return;}var b=e.target.closest('.kt9-layout-btn');if(!b)return;e.preventDefault();e.stopPropagation();applyLayout(b.getAttribute('data-layout'),true);picker.classList.remove('open');},true);
      main.appendChild(wrap);
    }
    setMoveMode(moveMode);applyLayout(savedLayout(),false);
  }

  install();[80,250,600,1200].forEach(function(ms){setTimeout(install,ms);});
  try{var mo=new MutationObserver(function(){clearTimeout(window.__ktNineRoomSavedRestoreTimer);window.__ktNineRoomSavedRestoreTimer=setTimeout(install,40);});mo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();