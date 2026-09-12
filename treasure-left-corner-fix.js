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
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-wrap{position:absolute!important;z-index:40!important;top:5px!important;left:50%!important;transform:translateX(-50%)!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:4px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-trigger{height:29px!important;padding:0 12px!important;border:1px solid #ff2bbd88!important;border-radius:12px!important;background:#111116e8!important;color:#fff!important;font-size:11px!important;font-weight:900!important;box-shadow:0 2px 10px #000a!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-picker{display:none!important;gap:4px!important;padding:4px!important;border-radius:12px!important;background:#050507ec!important;border:1px solid #ff2bbd77!important;box-shadow:0 2px 10px #000a!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-picker.open{display:flex!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn{height:27px!important;min-width:44px!important;padding:0 7px!important;border:1px solid #494951!important;border-radius:9px!important;background:#17171c!important;color:#fff!important;font-size:10px!important;font-weight:900!important;line-height:1!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt9-layout-btn.on{border-color:#ff32c7!important;background:#33102e!important;color:#ffe8fb!important}'
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
      +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .kt9-layout-wrap{top:4px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-trigger{height:26px!important;padding:0 10px!important;font-size:10px!important}.ktg13-room[data-kt-room="9"] .kt9-layout-btn{height:25px!important;min-width:39px!important;padding:0 5px!important;font-size:9px!important}.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:10px!important}}';
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
          +'<button type="button" class="kt9-layout-btn" data-layout="grid">격자</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="side">좌측</button>'
          +'<button type="button" class="kt9-layout-btn" data-layout="focus">큰칸</button>'
        +'</div>';
      var trigger=wrap.querySelector('.kt9-layout-trigger');
      var picker=wrap.querySelector('.kt9-layout-picker');
      trigger.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        picker.classList.toggle('open');
      },true);
      picker.addEventListener('click',function(e){
        var b=e.target&&e.target.closest?e.target.closest('.kt9-layout-btn'):null;
        if(!b)return;
        e.preventDefault();
        e.stopPropagation();
        applyNineLayout(b.getAttribute('data-layout'),true);
        picker.classList.remove('open');
      },true);
      main.appendChild(wrap);
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