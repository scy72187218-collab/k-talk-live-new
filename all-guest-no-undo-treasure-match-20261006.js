/* K-Talk 2026-10-06: guest/viewer screens only.
   Remove only the horizontal trio: 되돌리기 / 보물상자 / 매치.
   Keep ranking/mission/viewer row, chat, gifts, earnings, video, signaling, and host screens unchanged. */
(function(){
  if(window.__ktAllGuestNoUndoTreasureMatch20261006)return;
  window.__ktAllGuestNoUndoTreasureMatch20261006=true;

  function isRemote(){
    try{return document.documentElement.classList.contains('kt-remote-viewing');}catch(e){return false;}
  }

  function exactTrio(el){
    if(!el)return false;
    var t='';
    try{t=String(el.textContent||'').replace(/\s+/g,'');}catch(e){}
    return t.indexOf('되돌리기')>=0&&t.indexOf('보물상자')>=0&&t.indexOf('매치')>=0;
  }

  function clean(){
    if(!isRemote())return;
    var root=document.querySelector('#screen .kt-remote-live')||document.querySelector('#screen');
    if(!root)return;

    [
      '.ktg13-quick',
      '.ktsolo-quick',
      '.ktsubscriber-quick',
      '.ktsecret-quick',
      '.kt-all-five-utm-hard1111',
      '[data-kt-all-five-utm]'
    ].forEach(function(sel){
      try{root.querySelectorAll(sel).forEach(function(el){try{el.remove();}catch(e){}});}catch(e){}
    });

    try{
      root.querySelectorAll('.kt-three-quick-box').forEach(function(el){
        if(exactTrio(el))try{el.remove();}catch(e){}
      });
    }catch(e){}

    try{
      [].slice.call(root.querySelectorAll(
        '.ktsolo-room>div,.ktg13-room>div,.ktsubscriber-room>div,.ktsecret-room>div,'+
        '.kt-prejoin-room-view>div,.kt-approved-guest-room>div,.kt-guest-hostlike-room>div'
      )).forEach(function(el){
        if(exactTrio(el)){
          try{el.remove();}catch(e){}
        }
      });
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktAllGuestNoUndoTreasureMatchStyle20261006'))return;
    var s=document.createElement('style');
    s.id='ktAllGuestNoUndoTreasureMatchStyle20261006';
    s.textContent=''
      +'html.kt-remote-viewing #screen .kt-remote-live .ktg13-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsolo-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsubscriber-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .ktsecret-quick,'
      +'html.kt-remote-viewing #screen .kt-remote-live .kt-all-five-utm-hard1111,'
      +'html.kt-remote-viewing #screen .kt-remote-live [data-kt-all-five-utm]{'
      +'display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;'
      +'min-height:0!important;max-height:0!important;flex-basis:0!important;margin:0!important;padding:0!important;overflow:hidden!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  style();
  clean();
  [0,30,80,160,320,700,1400].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,900);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllGuestNoUTMTimer20261006);
      window.__ktAllGuestNoUTMTimer20261006=setTimeout(clean,15);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();