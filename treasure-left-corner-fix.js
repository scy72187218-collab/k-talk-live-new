/* K-Talk 보물상자 표시 위치만 수정: 활성 보물상자는 호스트 영상 왼쪽 위 구석에 표시. 기존 보물상자 버튼/기능은 그대로 유지. */
(function(){
  if(window.__ktTreasureLeftCornerFixInstalled)return;
  window.__ktTreasureLeftCornerFixInstalled=true;

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
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn,.ktg13-room[data-kt-room="9"] .kt9-layout-close{height:34px!important;min-width:58px!important;padding:0 9px!important;border:1px solid #555560!important;border-radius:10px!important;background:#17171c!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1!important;display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn.on{border-color:#ff32c7!important;background:#33102e!important;color:#ffe8fb!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-close{min-width:190px!important;border-color:#ffffff55!important;background:#24242b!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-hint{width:100%!important;text-align:center!important;color:#ffe16a!important;font-size:10px!important;font-weight:900!important;line-height:1.25!important;padding:1px 2px!important}'
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
      +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .kt9-layout-wrap{top:4px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-trigger{height:34px!important;padding:0 13px!important;font-size:13px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-picker{width:205px!important;padding:5px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-btn,.ktg13-room[data-kt-room="9"] .kt9-layout-close{height:32px!important;min-width:54px!important;padding:0 7px!important;font-size:11px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-close{min-width:177px!important}.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:10px!important}}';
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

  function swapGuestToHost(guest){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room||!guest)return false;
    var host=room.querySelector('.ktg13-host');
    var guestMedia=mediaOf(guest);
    if(!host||!guestMedia)return false;
    var hostMedia=mediaOf(host);
    if(hostMedia===guestMedia)return false;

    var guestMark=document.createComment('kt9-guest');
    guestMedia.parentNode.insertBefore(guestMark,guestMedia);
    var hostMark=null;
    if(hostMedia){
      hostMark=document.createComment('kt9-host');
      hostMedia.parentNode.insertBefore(hostMark,hostMedia);
    }

    host.appendChild(guestMedia);
    if(hostMedia&&guestMark.parentNode)guestMark.parentNode.insertBefore(hostMedia,guestMark);
    if(guestMark.parentNode)guestMark.remove();
    if(hostMark&&hostMark.parentNode)hostMark.remove();

    var label=guest.querySelector(':scope > span');
    if(label)label.style.setProperty('display',mediaOf(guest)?'none':'','important');
    try{document.dispatchEvent(new CustomEvent('kt-person-seat-change',{detail:{room:'9',to:'host'}}));}catch(e){}
    return true;
  }

  function bindGuestToHost(main,picker){
    if(!main||main.dataset.kt9GuestHostBound==='1')return;
    main.dataset.kt9GuestHostBound='1';
    main.addEventListener('click',function(e){
      if(!picker.classList.contains('open'))return;
      if(e.target.closest('.kt9-layout-wrap,button,a,input,select,textarea,label'))return;
      var guest=e.target.closest('.ktg13-guest');
      if(!guest||!main.contains(guest))return;
      if(!swapGuestToHost(guest))return;
      e.preventDefault();
      e.stopPropagation();
      picker.classList.remove('open');
    },true);
  }

  function ensureNineLayoutPicker(){
    ensureNineRoomLayoutStyle();
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var main=room.querySelector('.ktg13-main');
    if(!main)return;
    var wrap=main.querySelector('.kt9-layout-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='kt9-layout-wrap';
      wrap.innerHTML=''
        +'<button type="button" class="kt9-layout-trigger">↔ 자리 이동</button>'
        +'<div class="kt9-layout-picker">'
          +'<div class="kt9-layout-hint">노래 부르는 사람을 누르면 호스트 자리로 이동</div>'
          +'<button type="button" class="kt9-layout-btn" data-layout="grid">격자</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="side">좌측</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="focus">큰칸</button>'
          +'<button type="button" class="kt9-layout-close">✕ 닫기</button>'
        +'</div>';
      var trigger=wrap.querySelector('.kt9-layout-trigger');
      var picker=wrap.querySelector('.kt9-layout-picker');
      trigger.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        picker.classList.toggle('open');
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
      bindGuestToHost(main,picker);
    }else{
      var existingPicker=wrap.querySelector('.kt9-layout-picker');
      if(existingPicker)bindGuestToHost(main,existingPicker);
    }
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