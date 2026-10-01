/* K-Talk guest 9-room bottom cleanup — 2026-10-01 — PIN 5555
   ONLY remove:
   - black duplicate people button created by g9-final UI
   KEEP blue people, chat send, rose, gift, share, and everything else.
*/
(function(){
  if(window.__ktGuest9BottomCleanup5555_20261001)return;
  window.__ktGuest9BottomCleanup5555_20261001=true;

  function isNine(root){
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function apply(){
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNine(root))return;
      var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(!bar)return;

      var blackPeople=bar.querySelector('[data-kt-g9-final="people"]');
      if(blackPeople){try{blackPeople.remove();}catch(e){}}
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,200,500].forEach(function(ms){setTimeout(apply,ms);});});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9BottomCleanup5555Timer);
      window.__ktGuest9BottomCleanup5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();