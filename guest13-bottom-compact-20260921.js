/* K-Talk 13명 승인 게스트방 하단 전용 보정.
   현재 실제 게스트 화면(.kt-approved-guest-room / .kt-approved-guest-grid.is13)을 직접 잡는다.
   채팅입력/보내기/사람/장미/선물/공유 하단줄을 브라우저 흰선 바로 위로 내리고,
   수익표만 작게 한다. 다른 방/통신/스위치/영상은 변경하지 않음. */
(function(){
  if(window.__ktGuest13BottomCompact20260921v4)return;
  window.__ktGuest13BottomCompact20260921v4=true;

  function ensureStyle(){
    var old=document.getElementById('ktGuest13BottomCompactStyle20260921');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktGuest13BottomCompactStyle20260921';
    s.textContent=''
      +'.kt-remote-live.kt-guest13-bottom-compact>.kt-remote-bottom{position:fixed!important;left:6px!important;right:6px!important;bottom:2px!important;transform:none!important;z-index:2147482500!important;margin:0!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-remote-bottom .kt-remote-action{transform:none!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-remote-bottom .kt-remote-action.gift{position:relative!important;top:0!important;transform:none!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn{width:78px!important;min-width:78px!important;max-width:78px!important;height:46px!important;max-height:46px!important;right:4px!important;bottom:52px!important;padding:2px!important;border-radius:8px!important;z-index:2147482490!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top{gap:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top span{font-size:4.6px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-top b{font-size:7.1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail{font-size:4.4px!important;gap:1px!important;line-height:1!important;margin-top:1px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kt-allroom-guest-earn .kt-ge-detail .note{font-size:4px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn{width:76px!important;min-width:76px!important;max-width:76px!important;height:43px!important;max-height:43px!important;right:4px!important;padding:2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top span{font-size:4.7px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn .top b{font-size:7.2px!important}'
      +'.kt-remote-live.kt-guest13-bottom-compact .kgh-earn-detail{font-size:4.4px!important;gap:1px!important;margin-top:1px!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function isApproved13(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-approved-guest-grid.is13'))return true;
      if(root.querySelector('.kt-guest-hostlike-room .kgh-main.is13'))return true;
      var approved=root.classList.contains('kt-approved-guest-room')||
                   root.classList.contains('kt-guest-hostlike-active')||
                   !!root.querySelector('.kt-approved-guest-grid,.kt-guest-hostlike-room');
      if(!approved)return false;
      var meta=root.querySelector('.kt-remote-meta');
      var txt=String((meta&&meta.textContent)||root.textContent||'');
      return txt.indexOf('13명')>-1;
    }catch(e){return false;}
  }

  function force(root){
    try{
      var bottom=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(bottom){
        bottom.style.setProperty('position','fixed','important');
        bottom.style.setProperty('left','6px','important');
        bottom.style.setProperty('right','6px','important');
        bottom.style.setProperty('bottom','2px','important');
        bottom.style.setProperty('transform','none','important');
        bottom.style.setProperty('z-index','2147482500','important');
        bottom.style.setProperty('margin','0','important');
      }

      var gift=root.querySelector('.kt-remote-bottom .kt-remote-action.gift');
      if(gift){
        gift.style.setProperty('top','0px','important');
        gift.style.setProperty('transform','none','important');
      }

      var generic=root.querySelector('.kt-allroom-guest-earn');
      if(generic){
        generic.style.setProperty('width','78px','important');
        generic.style.setProperty('min-width','78px','important');
        generic.style.setProperty('max-width','78px','important');
        generic.style.setProperty('height','46px','important');
        generic.style.setProperty('max-height','46px','important');
        generic.style.setProperty('right','4px','important');
        generic.style.setProperty('bottom','52px','important');
        generic.style.setProperty('padding','2px','important');
      }

      var earn=root.querySelector('.kgh-earn');
      if(earn){
        earn.style.setProperty('width','76px','important');
        earn.style.setProperty('min-width','76px','important');
        earn.style.setProperty('max-width','76px','important');
        earn.style.setProperty('height','43px','important');
        earn.style.setProperty('max-height','43px','important');
        earn.style.setProperty('right','4px','important');
      }
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    [].slice.call(document.querySelectorAll('.kt-remote-live')).forEach(function(root){
      var yes=isApproved13(root);
      root.classList.toggle('kt-guest13-bottom-compact',yes);
      if(yes)force(root);
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2400,4000].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,250);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest13BottomCompactTimer20260921);
      window.__ktGuest13BottomCompactTimer20260921=setTimeout(apply,10);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();