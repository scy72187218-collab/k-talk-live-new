/* 9명방 가운데 게스트 영상 세로 위치만 보정 — 2026-10-04
   범위: 호스트 화면의 첫 번째 게스트 칸 비디오만.
   다른 칸/배치/버튼/채팅/수익률은 변경하지 않는다. */
(function(){
  if(window.__ktG9CenterGuestVideoPosition20261004)return;
  window.__ktG9CenterGuestVideoPosition20261004=true;

  function apply(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return;
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var guest=room.querySelector('.ktg13-main .ktg13-guest');
      var v=guest&&guest.querySelector('video');
      if(!v)return;
      v.style.setProperty('object-fit','cover','important');
      v.style.setProperty('object-position','center 68%','important');
    }catch(e){}
  }

  apply();
  [30,100,250,600,1200,2400].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9CenterGuestVideoPositionTimer20261004);
      window.__ktG9CenterGuestVideoPositionTimer20261004=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
