/* K-Talk 13명 승인 게스트방 하단 미세조정 전용.
   다른 방/통신/채팅/스위치/영상은 건드리지 않음. */
(function(){
  if(window.__ktGuest13BottomCompact20260921)return;
  window.__ktGuest13BottomCompact20260921=true;

  function ensureStyle(){
    if(document.getElementById('ktGuest13BottomCompactStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktGuest13BottomCompactStyle20260921';
    s.textContent=''
      +'.kt-remote-live.kt-guest13-bottom-compact>.kt-remote-bottom .kt-remote-action.gift{transform:translateY(5px)!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn{width:92px!important;min-width:92px!important;height:52px!important;max-height:52px!important;padding:2px 3px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top span{font-size:5.6px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top b{font-size:8.5px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn-detail{font-size:5.6px!important;gap:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn{width:96px!important;min-width:96px!important;max-width:96px!important;height:58px!important;max-height:58px!important;padding:2px 3px!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-guest13-bottom-compact>.kt-remote-bottom .kt-remote-action.gift{transform:translateY(5px)!important}.kt-remote-live.kt-guest13-bottom-compact .kgh-earn{width:88px!important;min-width:88px!important;height:50px!important;max-height:50px!important}.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn{width:92px!important;min-width:92px!important;max-width:92px!important;height:56px!important;max-height:56px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    ensureStyle();
    var roots=[].slice.call(document.querySelectorAll('.kt-remote-live'));
    roots.forEach(function(root){
      var room=root.querySelector('.kt-guest-hostlike-room');
      var is13=!!(room&&room.querySelector('.kgh-main.is13'));
      root.classList.toggle('kt-guest13-bottom-compact',is13);
    });
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest13BottomCompactTimer20260921);
      window.__ktGuest13BottomCompactTimer20260921=setTimeout(apply,40);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();
