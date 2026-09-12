/* K-Talk 자리 이동 간단 선택: 13명방·구독자방·비밀방만. 다른 방은 변경하지 않음. */
(function(){
  if(window.__ktSimpleSeatLayoutThreeRoomsInstalled)return;
  window.__ktSimpleSeatLayoutThreeRoomsInstalled=true;

  function addStyle(){
    if(document.getElementById('ktSimpleSeatLayoutThreeRoomsStyle'))return;
    var s=document.createElement('style');
    s.id='ktSimpleSeatLayoutThreeRoomsStyle';
    s.textContent=''
      +'.kt-seat-layout-mount{position:relative!important}'
      +'.kt-seat-layout-wrap{position:absolute!important;z-index:45!important;top:5px!important;left:50%!important;transform:translateX(-50%)!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:4px!important;pointer-events:auto!important}'
      +'.kt-seat-layout-trigger{height:29px!important;padding:0 12px!important;border:1px solid #ff2bbd88!important;border-radius:12px!important;background:#111116e8!important;color:#fff!important;font-size:11px!important;font-weight:900!important;box-shadow:0 2px 10px #000a!important;white-space:nowrap!important}'
      +'.kt-seat-layout-picker{display:none!important;gap:4px!important;padding:4px!important;border-radius:12px!important;background:#050507ec!important;border:1px solid #ff2bbd77!important;box-shadow:0 2px 10px #000a!important}'
      +'.kt-seat-layout-picker.open{display:flex!important}'
      +'.kt-seat-layout-btn{height:27px!important;min-width:44px!important;padding:0 7px!important;border:1px solid #494951!important;border-radius:9px!important;background:#17171c!important;color:#fff!important;font-size:10px!important;font-weight:900!important;line-height:1!important}'
      +'.kt-seat-layout-btn.on{border-color:#ff32c7!important;background:#33102e!important;color:#ffe8fb!important}'

      /* 13명방 */
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="grid"] .ktg13-main{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="grid"] .ktg13-host{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="grid"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="grid"] .ktg13-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="side"] .ktg13-main{display:grid!important;grid-template-columns:43% 57%!important;grid-template-rows:minmax(0,1fr)!important;gap:3px!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="side"] .ktg13-host{grid-column:1!important;grid-row:1!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="side"] .ktg13-guests{display:grid!important;grid-column:2!important;grid-row:1!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="focus"] .ktg13-main{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="focus"] .ktg13-host{grid-column:1 / 3!important;grid-row:1 / 3!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="focus"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])[data-kt-seat-layout="focus"] .ktg13-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'

      /* 구독자방 */
      +'.ktsubscriber-room[data-kt-seat-layout="grid"] .ktsubscriber-people{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="grid"] .ktsubscriber-host,.ktsubscriber-room[data-kt-seat-layout="grid"] .ktsubscriber-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="side"] .ktsubscriber-people{display:grid!important;grid-template-columns:40% 30% 30%!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="side"] .ktsubscriber-host{grid-column:1!important;grid-row:1 / 4!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="focus"] .ktsubscriber-people{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="focus"] .ktsubscriber-host{grid-column:1 / 3!important;grid-row:1 / 3!important;min-width:0!important;min-height:0!important}'
      +'.ktsubscriber-room[data-kt-seat-layout="focus"] .ktsubscriber-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'

      /* 비밀방 */
      +'.ktsecret-room[data-kt-seat-layout="grid"] .ktsecret-six-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsecret-room[data-kt-seat-layout="grid"] .ktsecret-slot{grid-column:auto!important;grid-row:auto!important}'
      +'.ktsecret-room[data-kt-seat-layout="side"] .ktsecret-six-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsecret-room[data-kt-seat-layout="side"] .ktsecret-slot{grid-column:auto!important;grid-row:auto!important}'
      +'.ktsecret-room[data-kt-seat-layout="side"] .ktsecret-slot.host{grid-column:1!important;grid-row:1 / 4!important}'
      +'.ktsecret-room[data-kt-seat-layout="focus"] .ktsecret-six-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important}'
      +'.ktsecret-room[data-kt-seat-layout="focus"] .ktsecret-slot{grid-column:auto!important;grid-row:auto!important}'
      +'.ktsecret-room[data-kt-seat-layout="focus"] .ktsecret-slot.host{grid-column:1 / 3!important;grid-row:1 / 3!important}'
      +'@media(max-width:390px){.kt-seat-layout-wrap{top:4px!important}.kt-seat-layout-trigger{height:26px!important;padding:0 10px!important;font-size:10px!important}.kt-seat-layout-btn{height:25px!important;min-width:39px!important;padding:0 5px!important;font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function roomInfo(){
    var r=document.querySelector('.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])');
    if(r)return {room:r,key:'group13',mount:r.querySelector('.ktg13-main'),def:'side'};
    r=document.querySelector('.ktsubscriber-room');
    if(r)return {room:r,key:'subscriber',mount:r.querySelector('.ktsubscriber-people'),def:'side'};
    r=document.querySelector('.ktsecret-room');
    if(r)return {room:r,key:'secret',mount:r.querySelector('.ktsecret-six-grid'),def:'grid'};
    return null;
  }

  function saved(info){
    try{
      var v=localStorage.getItem('kt_simple_seat_layout_'+info.key);
      if(v==='grid'||v==='side'||v==='focus')return v;
    }catch(e){}
    return info.def;
  }

  function applyLayout(info,layout,save){
    if(!info||!info.room)return;
    if(layout!=='grid'&&layout!=='side'&&layout!=='focus')layout=info.def;
    info.room.setAttribute('data-kt-seat-layout',layout);
    info.room.querySelectorAll('.kt-seat-layout-btn').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-layout')===layout);
    });
    if(save){try{localStorage.setItem('kt_simple_seat_layout_'+info.key,layout);}catch(e){}}
  }

  function ensurePicker(){
    addStyle();
    var info=roomInfo();
    if(!info||!info.mount)return;
    info.mount.classList.add('kt-seat-layout-mount');
    var wrap=info.mount.querySelector(':scope > .kt-seat-layout-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='kt-seat-layout-wrap';
      wrap.innerHTML=''
        +'<button type="button" class="kt-seat-layout-trigger">↔ 자리 이동</button>'
        +'<div class="kt-seat-layout-picker">'
          +'<button type="button" class="kt-seat-layout-btn" data-layout="grid">격자</button>'
          +'<button type="button" class="kt-seat-layout-btn" data-layout="side">좌측</button>'
          +'<button type="button" class="kt-seat-layout-btn" data-layout="focus">큰칸</button>'
        +'</div>';
      var trigger=wrap.querySelector('.kt-seat-layout-trigger');
      var picker=wrap.querySelector('.kt-seat-layout-picker');
      trigger.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();picker.classList.toggle('open');
      },true);
      picker.addEventListener('click',function(e){
        var b=e.target&&e.target.closest?e.target.closest('.kt-seat-layout-btn'):null;
        if(!b)return;
        e.preventDefault();e.stopPropagation();
        var now=roomInfo();
        if(now)applyLayout(now,b.getAttribute('data-layout'),true);
        picker.classList.remove('open');
      },true);
      info.mount.appendChild(wrap);
    }
    applyLayout(info,saved(info),false);
  }

  ensurePicker();
  setTimeout(ensurePicker,80);
  setTimeout(ensurePicker,300);
  setInterval(ensurePicker,350);
})();