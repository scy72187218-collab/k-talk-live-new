/* K-Talk 13명 방만 이전 모양으로 복구: 호스트는 왼쪽에서 아래까지 길게, 게스트는 오른쪽 3x4. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13LayoutRestoreInstalled)return;
  window.__ktGroup13LayoutRestoreInstalled=true;

  function apply(){
    var room=document.querySelector('.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])');
    if(!room)return;
    try{localStorage.setItem('kt_simple_seat_layout_group13','side');}catch(e){}
    room.setAttribute('data-kt-seat-layout','side');

    var main=room.querySelector('.ktg13-main');
    var host=room.querySelector('.ktg13-host');
    var guests=room.querySelector('.ktg13-guests');
    if(main){
      main.style.setProperty('display','grid','important');
      main.style.setProperty('grid-template-columns','43% 57%','important');
      main.style.setProperty('grid-template-rows','minmax(0,1fr)','important');
      main.style.setProperty('gap','3px','important');
    }
    if(host){
      host.style.setProperty('grid-column','1','important');
      host.style.setProperty('grid-row','1','important');
      host.style.setProperty('min-height','0','important');
      host.style.setProperty('height','100%','important');
    }
    if(guests){
      guests.style.setProperty('display','grid','important');
      guests.style.setProperty('grid-column','2','important');
      guests.style.setProperty('grid-row','1','important');
      guests.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      guests.style.setProperty('grid-template-rows','repeat(4,minmax(0,1fr))','important');
      guests.style.setProperty('gap','2px','important');
      guests.style.setProperty('min-height','0','important');
    }
  }

  apply();
  setTimeout(apply,80);
  setTimeout(apply,300);
  var ob=new MutationObserver(function(){setTimeout(apply,0);});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
})();