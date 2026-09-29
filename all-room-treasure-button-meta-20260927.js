/* 모든 방송방 보물 패키지 버튼 표시 통일
   보물 패키지 / 100개 / 03:00 카운트다운
   아이콘 50% 축소
   다른 기능/배치 변경 없음 */
(function(){
  if(window.__ktAllRoomTreasureMeta20260927)return;
  window.__ktAllRoomTreasureMeta20260927=true;

  function remainingSec(){
    var remaining=180;
    try{
      if(window.__ktTreasure&&window.__ktTreasure.unlock_at){
        remaining=Math.max(0,Math.ceil((Number(window.__ktTreasure.unlock_at)-Date.now())/1000));
      }else if(window.state&&state.treasure&&state.treasure.unlock_at){
        remaining=Math.max(0,Math.ceil((Number(state.treasure.unlock_at)-Date.now())/1000));
      }
    }catch(e){}
    return remaining;
  }

  function textTime(sec){
    var m=Math.floor(sec/60),s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function isTreasureButton(btn){
    if(!btn)return false;
    var t=String(btn.textContent||'').replace(/\s+/g,'');
    var a=String(btn.getAttribute('aria-label')||'').replace(/\s+/g,'');
    return t.indexOf('보물 패키지')>-1||a.indexOf('보물 패키지')>-1||
      btn.classList.contains('kt-three-quick-treasure')||
      btn.classList.contains('kt-solo-treasure-btn');
  }

  function normalizeButton(btn){
    if(!btn||!isTreasureButton(btn))return;
    btn.classList.add('kt-room-treasure-meta-btn');
    btn.setAttribute('aria-label','보물 패키지');
    var icon='🎁';
    btn.innerHTML='<b class="kt-room-treasure-icon">'+icon+'</b>'
      +'<span class="kt-room-treasure-label">보물 패키지</span>';
  }

  function roomRoots(){
    return document.querySelectorAll(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    );
  }

  function run(){
    roomRoots().forEach(function(room){
      room.querySelectorAll('button').forEach(function(btn){
        if(isTreasureButton(btn))normalizeButton(btn);
      });
    });
    document.querySelectorAll('#screen .kt-room-treasure-count,#screen .kt-room-treasure-time').forEach(function(el){
      el.remove();
    });
  }

  function style(){
    if(document.getElementById('ktAllRoomTreasureMetaStyle'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomTreasureMetaStyle';
    s.textContent=''
      +'#screen .kt-room-treasure-meta-btn{'
        +'display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;'
        +'gap:5px!important;line-height:1!important;'
      +'}'
      +'#screen .kt-room-treasure-meta-btn .kt-room-treasure-icon{'
        +'font-size:20px!important;line-height:1!important;transform:none!important;flex:none!important;'
      +'}'
      +'#screen .kt-room-treasure-meta-btn .kt-room-treasure-label{'
        +'font-size:10px!important;font-weight:950!important;line-height:1!important;white-space:nowrap!important;'
      +'}'
      +'#screen .kt-room-treasure-meta-btn .kt-room-treasure-count,#screen .kt-room-treasure-meta-btn .kt-room-treasure-time{display:none!important}';
    document.head.appendChild(s);
  }

  style();
  run();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomTreasureMetaTimer);
      window.__ktAllRoomTreasureMetaTimer=setTimeout(run,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(run,1000);
})();