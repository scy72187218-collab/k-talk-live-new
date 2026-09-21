/* K-Talk 13명 승인 게스트방 하단 미세조정 전용.
   선물 버튼을 확실히 아래로 내리고 수익표만 작게 조정.
   다른 방/통신/채팅/스위치/영상은 건드리지 않음. */
(function(){
  if(window.__ktGuest13BottomCompact20260921v2)return;
  window.__ktGuest13BottomCompact20260921v2=true;

  function ensureStyle(){
    var old=document.getElementById('ktGuest13BottomCompactStyle20260921');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktGuest13BottomCompactStyle20260921';
    s.textContent=''
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-remote-bottom .kt-remote-action.gift{position:relative!important;top:14px!important;transform:translateY(0)!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn{width:82px!important;min-width:82px!important;max-width:82px!important;height:46px!important;max-height:46px!important;right:2px!important;padding:2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top{gap:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top span{font-size:5px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top b{font-size:7.6px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn-detail{font-size:4.9px!important;gap:1px!important;margin-top:2px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn{width:84px!important;min-width:84px!important;max-width:84px!important;height:49px!important;max-height:49px!important;right:3px!important;bottom:58px!important;padding:2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top span{font-size:4.8px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top b{font-size:7.4px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail{font-size:4.6px!important;gap:1px 2px!important;line-height:1.02!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail .note{font-size:4.3px!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function forceInline(root){
    try{
      var gift=root.querySelector('.kt-remote-bottom .kt-remote-action.gift');
      if(gift){
        gift.style.setProperty('position','relative','important');
        gift.style.setProperty('top','14px','important');
        gift.style.setProperty('transform','translateY(0)','important');
      }

      var earn=root.querySelector('.kgh-earn');
      if(earn){
        earn.style.setProperty('width','82px','important');
        earn.style.setProperty('min-width','82px','important');
        earn.style.setProperty('max-width','82px','important');
        earn.style.setProperty('height','46px','important');
        earn.style.setProperty('max-height','46px','important');
        earn.style.setProperty('right','2px','important');
      }

      var generic=root.querySelector('.kt-allroom-guest-earn');
      if(generic){
        generic.style.setProperty('width','84px','important');
        generic.style.setProperty('min-width','84px','important');
        generic.style.setProperty('max-width','84px','important');
        generic.style.setProperty('height','49px','important');
        generic.style.setProperty('max-height','49px','important');
        generic.style.setProperty('right','3px','important');
        generic.style.setProperty('bottom','58px','important');
      }
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    var roots=[].slice.call(document.querySelectorAll('.kt-remote-live'));
    roots.forEach(function(root){
      var room=root.querySelector('.kt-guest-hostlike-room');
      var txt=room?String(room.textContent||''):'';
      var is13=!!(room&&(room.querySelector('.kgh-main.is13')||txt.indexOf('13명')>-1));
      root.classList.toggle('kt-guest13-bottom-compact',is13);
      if(is13)forceInline(root);
    });
  }

  apply();
  [40,120,260,500,900,1500,2400].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,450);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest13BottomCompactTimer20260921);
      window.__ktGuest13BottomCompactTimer20260921=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();