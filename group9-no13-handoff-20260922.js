/* K-Talk 9명방: 시작 순간 13명방 화면이 한 프레임이라도 보였다가
   9명방으로 바뀌는 현상만 차단.
   9명방 선택 상태를 유지하고, 생성되는 공용 ktg13 DOM을 브라우저가 그리기 전에
   즉시 9명방으로 표시/정리한다. 다른 방은 변경하지 않음. */
(function(){
  if(window.__ktGroup9No13Handoff20260922)return;
  window.__ktGroup9No13Handoff20260922=true;

  function isNine(){
    try{
      if(window.__ktNineRoomSelectedBeforeStart===true)return true;
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      return t==='group9'||m===9||n.indexOf('9명')>-1||title.indexOf('9명')>-1;
    }catch(e){return false;}
  }

  function forceNineState(){
    try{
      if(!window.state)return;
      state.liveRoomType='group9';
      state.liveRoomName='9명 방송';
      state.liveRoomMax=9;
      state.prepRoomType='group9';
      state.prepRoomName='9명 방송';
      state.prepRoomMax=9;
      state.roomType='group9';
      var title=document.getElementById('liveTitle');
      if(title&&String(title.value||'').indexOf('9명')<0)title.value='9명 방송';
    }catch(e){}
  }

  function adaptRoomNow(){
    if(!isNine())return false;
    forceNineState();

    var room=document.querySelector('#screen .ktg13-room');
    if(!room)return false;

    room.setAttribute('data-kt-room','9');
    room.removeAttribute('data-kt-approved13');

    var head=room.querySelector('.ktg13-air strong');
    if(head)head.innerHTML='<i>●</i> 9명 방송';

    var guests=[].slice.call(room.querySelectorAll('.ktg13-guests > .ktg13-guest'));
    guests.slice(8).forEach(function(g){try{g.remove();}catch(e){}});

    var stats=room.querySelectorAll('.ktg13-stats > button');
    if(stats[1]&&String(stats[1].textContent||'').indexOf('지금 추가')>-1){
      stats[1].textContent='🎯 미션';
      stats[1].classList.add('ktg9-mission-btn');
      if(typeof window.ktGroup9Mission==='function')stats[1].onclick=function(){window.ktGroup9Mission();};
    }
    return true;
  }

  /* DOM 삽입 직후, 다음 페인트 전에 9명방으로 바꾼다. */
  try{
    new MutationObserver(function(){
      if(isNine())adaptRoomNow();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'&&!oldStart.__ktGroup9No13Handoff){
    var wrapped=async function(){
      if(!isNine())return oldStart.apply(this,arguments);

      forceNineState();
      var result=await oldStart.apply(this,arguments);
      adaptRoomNow();
      requestAnimationFrame(function(){adaptRoomNow();});
      return result;
    };
    wrapped.__ktGroup9No13Handoff=true;
    wrapped.__ktGroup9No13HandoffBase=oldStart;
    window.startBroadcast=wrapped;
  }

  document.addEventListener('pointerdown',function(e){
    try{
      var b=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(b&&isNine())forceNineState();
    }catch(err){}
  },true);
})();