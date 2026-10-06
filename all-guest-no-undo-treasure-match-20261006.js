/* K-Talk 2026-10-06 — ALL GUEST/VIEWER rooms only.
   Remove ONLY the upper quick row: 되돌리기 / 보물상자 / 매치.
   Keep ranking, mission, viewer count, chat, gifts, earnings, videos and host rooms unchanged. */
(function(){
  if(window.__ktAllGuestNoUndoTreasureMatch20261006)return;
  window.__ktAllGuestNoUndoTreasureMatch20261006=true;

  function isRemote(){
    return document.documentElement.classList.contains('kt-remote-viewing') ||
      !!document.querySelector('#screen .kt-remote-live');
  }

  function norm(s){return String(s||'').replace(/\s+/g,'');}

  function exactQuickRow(el){
    if(!el)return false;
    var t=norm(el.textContent);
    return t.indexOf('되돌리기')>-1 && t.indexOf('보물상자')>-1 && t.indexOf('매치')>-1;
  }

  function clean(){
    if(!isRemote())return;

    var root=document.querySelector('#screen .kt-remote-live')||document.getElementById('screen');
    if(!root)return;

    /* Known quick-row containers used by the five viewer/guest rooms. */
    root.querySelectorAll(
      '.ktg13-quick,'+
      '.kt-all-five-utm-hard1111,'+
      '.kt-three-quick-box,'+
      '.ktsolo-quick,'+
      '.ktsubscriber-quick,'+
      '.ktsecret-quick'
    ).forEach(function(el){
      try{
        if(exactQuickRow(el) || el.classList.contains('ktg13-quick') || el.classList.contains('kt-all-five-utm-hard1111')){
          el.remove();
        }
      }catch(e){}
    });

    /* Fallback: remove only a direct row whose combined labels are exactly the
       three unwanted guest controls. Do not touch ranking/mission/viewers. */
    root.querySelectorAll('div,section,nav').forEach(function(el){
      try{
        if(!exactQuickRow(el))return;
        if(el.querySelector('.ktg13-main,.ktsolo-main,.ktsubscriber-main,.ktsecret-main'))return;
        var buttons=el.querySelectorAll(':scope > button');
        if(buttons.length>=2 && buttons.length<=4)el.remove();
      }catch(e){}
    });
  }

  function style(){
    if(document.getElementById('ktAllGuestNoUTMStyle20261006'))return;
    var s=document.createElement('style');
    s.id='ktAllGuestNoUTMStyle20261006';
    s.textContent=''
      +'html.kt-remote-viewing #screen .kt-remote-live .ktg13-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .kt-all-five-utm-hard1111,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsolo-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsubscriber-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsecret-quick'
      +'{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;'
      +'max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  style();
  clean();
  [0,20,60,120,250,500,900,1500].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllGuestNoUTMTimer20261006);
      window.__ktAllGuestNoUTMTimer20261006=setTimeout(clean,10);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();