/* K-Talk 13명 승인 게스트방 하단 미세조정 전용.
   13명 게스트방에서만 수익표를 더 작게 하고,
   채팅 입력/사람/장미/선물박스/공유가 있는 하단줄을 흰 브라우저선 바로 위로 내림.
   다른 방/통신/채팅 기능/스위치/영상은 건드리지 않음. */
(function(){
  if(window.__ktGuest13BottomCompact20260921v3)return;
  window.__ktGuest13BottomCompact20260921v3=true;

  function ensureStyle(){
    var old=document.getElementById('ktGuest13BottomCompactStyle20260921');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktGuest13BottomCompactStyle20260921';
    s.textContent=''
      +'.kt-remote-live.kt-guest13-bottom-compact>.kt-remote-bottom{bottom:0!important;transform:none!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-remote-bottom .kt-remote-action.gift{position:relative!important;top:0!important;transform:none!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn{width:62px!important;min-width:62px!important;max-width:62px!important;height:36px!important;max-height:36px!important;right:2px!important;padding:1px 2px!important;border-radius:7px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top{gap:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top span{font-size:4.3px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top b{font-size:6.8px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn-detail{font-size:4.1px!important;gap:1px!important;margin-top:1px!important;line-height:1!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn{width:64px!important;min-width:64px!important;max-width:64px!important;height:38px!important;max-height:38px!important;right:3px!important;bottom:48px!important;padding:1px 2px!important;border-radius:7px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top span{font-size:4.2px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top b{font-size:6.7px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail{font-size:4px!important;gap:1px!important;line-height:1!important;margin-top:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail .note{font-size:3.8px!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function forceInline(root){
    try{
      /* 13명 게스트방 하단 한 줄 전체를 흰 브라우저선 바로 위로 */
      var bottom=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(bottom){
        bottom.style.setProperty('bottom','0px','important');
        bottom.style.setProperty('transform','none','important');
      }

      /* 선물만 따로 내려가던 이전 보정은 해제해서 나머지 아이콘과 같은 높이 */
      var gift=root.querySelector('.kt-remote-bottom .kt-remote-action.gift');
      if(gift){
        gift.style.setProperty('position','relative','important');
        gift.style.setProperty('top','0px','important');
        gift.style.setProperty('transform','none','important');
      }

      /* 기존 게스트 수익표만 더 작게 */
      var earn=root.querySelector('.kgh-earn');
      if(earn){
        earn.style.setProperty('width','62px','important');
        earn.style.setProperty('min-width','62px','important');
        earn.style.setProperty('max-width','62px','important');
        earn.style.setProperty('height','36px','important');
        earn.style.setProperty('max-height','36px','important');
        earn.style.setProperty('right','2px','important');
        earn.style.setProperty('padding','1px 2px','important');
      }

      var generic=root.querySelector('.kt-allroom-guest-earn');
      if(generic){
        generic.style.setProperty('width','64px','important');
        generic.style.setProperty('min-width','64px','important');
        generic.style.setProperty('max-width','64px','important');
        generic.style.setProperty('height','38px','important');
        generic.style.setProperty('max-height','38px','important');
        generic.style.setProperty('right','3px','important');
        generic.style.setProperty('bottom','48px','important');
        generic.style.setProperty('padding','1px 2px','important');
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
  [20,60,120,260,500,900,1500,2400].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,300);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest13BottomCompactTimer20260921);
      window.__ktGuest13BottomCompactTimer20260921=setTimeout(apply,15);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();