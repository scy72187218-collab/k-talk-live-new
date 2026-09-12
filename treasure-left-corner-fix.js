/* K-Talk 보물상자 표시 위치 유지 + 9명 방에서만 호스트 길이 축소. 다른 방은 변경하지 않음. */
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

  function isNineRoom(){
    try{
      var room=document.querySelector('.ktg13-room');
      if(room&&room.getAttribute('data-kt-room')==='9')return true;
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group9'||n==='9명 방송';
    }catch(e){return false;}
  }

  function compactNineRoom(){
    if(!isNineRoom())return;
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    room.setAttribute('data-kt-room','9');

    var main=room.querySelector('.ktg13-main');
    var host=room.querySelector('.ktg13-host');
    var guests=room.querySelector('.ktg13-guests');
    if(!main||!host||!guests)return;

    main.style.setProperty('display','grid','important');
    main.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    main.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    main.style.setProperty('gap','2px','important');

    host.style.setProperty('grid-column','1','important');
    host.style.setProperty('grid-row','1','important');
    host.style.setProperty('min-width','0','important');
    host.style.setProperty('min-height','0','important');
    host.style.setProperty('height','auto','important');

    guests.style.setProperty('display','contents','important');
    guests.style.setProperty('grid-column','auto','important');
    guests.style.setProperty('grid-row','auto','important');

    var cells=[].slice.call(room.querySelectorAll('.ktg13-guests > .ktg13-guest'));
    cells.slice(8).forEach(function(g){try{g.remove();}catch(e){}});
    cells.slice(0,8).forEach(function(g){
      g.style.setProperty('min-width','0','important');
      g.style.setProperty('min-height','0','important');
      g.style.setProperty('height','auto','important');
    });

    var v=host.querySelector('video');
    if(v){
      v.style.setProperty('position','absolute','important');
      v.style.setProperty('left','0','important');
      v.style.setProperty('top','0','important');
      v.style.setProperty('width','100%','important');
      v.style.setProperty('height','100%','important');
      v.style.setProperty('object-fit','cover','important');
    }
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

  function apply(){ensureStyle();compactNineRoom();moveGlobal();moveFallback();}
  apply();
  setTimeout(apply,80);
  setTimeout(apply,300);
  setInterval(apply,300);
})();