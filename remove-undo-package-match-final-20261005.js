/* Final top quick-row cleanup - 2026-10-06
   Remove only exact 3-button rows made of:
   되돌리기 + (보물상자 or 패키지상자) + 매치.
   Applies to 1/9/13/subscriber/secret rooms, host and guest views.
   Keep ranking/mission/viewer row, bottom tools, chat, gifts, earnings, signaling. */
(function(){
  if(window.__ktRemoveTopThreeQuickFinal20261006)return;
  window.__ktRemoveTopThreeQuickFinal20261006=true;

  function norm(x){return String(x||'').replace(/\s+/g,'').trim();}

  function isFiveRoom(el){
    try{
      return !!(el&&el.closest&&el.closest(
        '#screen .ktsolo-room,'+
        '#screen .ktg13-room[data-kt-room="9"],'+
        '#screen .ktg13-room[data-kt-room="13"],'+
        '#screen .ktsubscriber-room,'+
        '#screen .ktsecret-room,'+
        '#screen .kt-remote-live'
      ));
    }catch(e){return false;}
  }

  function exactTop3Row(el){
    if(!el||!isFiveRoom(el))return false;
    var buttons=[].slice.call(el.querySelectorAll(':scope > button'));
    if(buttons.length!==3)return false;
    var labs=buttons.map(function(b){
      return norm((b&&b.textContent)||b.getAttribute('aria-label')||'');
    });
    var undo=labs.some(function(x){return x.indexOf('되돌리기')>-1;});
    var treasure=labs.some(function(x){return x.indexOf('보물상자')>-1||x.indexOf('패키지상자')>-1;});
    var match=labs.some(function(x){return x.indexOf('매치')>-1;});
    return undo&&treasure&&match;
  }

  function clean(){
    try{
      document.querySelectorAll(
        '#screen .kt-all-five-utm-hard1111,'+
        '#screen .kt-g9-host-top3-restore-20261005,'+
        '#screen .kt-room-second-stats-row-20260927,'+
        '#screen .kt-g9-host-utm-20261005,'+
        '#screen [data-kt-locked-duplicate-package-row],'+
        '#screen .ktg13-quick'
      ).forEach(function(row){
        try{
          if(exactTop3Row(row) ||
             row.classList.contains('kt-all-five-utm-hard1111') ||
             row.classList.contains('kt-g9-host-top3-restore-20261005') ||
             row.classList.contains('kt-room-second-stats-row-20260927') ||
             row.classList.contains('kt-g9-host-utm-20261005') ||
             row.hasAttribute('data-kt-locked-duplicate-package-row')){
            row.remove();
          }
        }catch(e){}
      });

      /* Catch equivalent rows whose class name changed. */
      document.querySelectorAll(
        '#screen .ktsolo-room>div,'+
        '#screen .ktg13-room>div,'+
        '#screen .ktsubscriber-room>div,'+
        '#screen .ktsecret-room>div,'+
        '#screen .kt-remote-live>div,'+
        '#screen .kt-remote-live section>div'
      ).forEach(function(el){
        try{if(exactTop3Row(el))el.remove();}catch(e){}
      });
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktRemoveTopThreeQuickFinalStyle20261006'))return;
    var s=document.createElement('style');
    s.id='ktRemoveTopThreeQuickFinalStyle20261006';
    s.textContent=''
      +'#screen .kt-all-five-utm-hard1111,'
      +'#screen .kt-g9-host-top3-restore-20261005,'
      +'#screen .kt-room-second-stats-row-20260927,'
      +'#screen .kt-g9-host-utm-20261005,'
      +'#screen [data-kt-locked-duplicate-package-row],'
      +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-quick{'
      +'display:none!important;visibility:hidden!important;pointer-events:none!important;'
      +'height:0!important;min-height:0!important;max-height:0!important;'
      +'margin:0!important;padding:0!important;overflow:hidden!important;}';
    (document.head||document.documentElement).appendChild(s);
  }

  style();
  clean();
  [0,20,60,120,250,500,900,1600,2600].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,500);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoveTopThreeQuickFinalTimer20261006);
      window.__ktRemoveTopThreeQuickFinalTimer20261006=setTimeout(clean,10);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();