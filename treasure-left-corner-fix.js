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

  function ensureNineRoomCompactStyle(){
    if(document.getElementById('ktNineRoomCompactGridStyle'))return;
    var s=document.createElement('style');
    s.id='ktNineRoomCompactGridStyle';
    s.textContent=''
      +'.ktg13-room[data-kt-room="9"] .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host{grid-column:1!important;grid-row:1!important;min-width:0!important;min-height:0!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-guests{display:contents!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-guest{min-width:0!important;min-height:0!important;font-size:12px!important}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host>video{width:100%!important;height:100%!important;left:0!important;top:0!important;position:absolute!important;object-fit:cover!important;object-position:center!important}'
      +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .ktg13-guest{font-size:10px!important}}';
    document.head.appendChild(s);
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

  function apply(){ensureStyle();ensureNineRoomCompactStyle();moveGlobal();moveFallback();}
  apply();
  setTimeout(apply,80);
  setTimeout(apply,300);
  setInterval(apply,300);
})();