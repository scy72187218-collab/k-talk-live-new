/* K-Talk 9-room visual lock — 2026-10-01 — PIN 5555
   User-approved scope only:
   - Make host + approved guest 9-room grid/layout match the first/reference room.
   - Keep the host earnings appearance as the reference; guest earnings use same compact footprint.
   - DO NOT touch signaling, camera, approval, entry/exit, switches, chat behavior, gifts, or other room types.
*/
(function(){
  if(window.__ktFirstRoomVisualLock5555_20261001)return;
  window.__ktFirstRoomVisualLock5555_20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktFirstRoomVisualLock5555Style'))return;
    var s=document.createElement('style');
    s.id='ktFirstRoomVisualLock5555Style';
    s.textContent=''
      /* Host 9-room: same 3x3 size/spacing as the reference first room. */
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main{'
        +'display:grid!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;'
        +'flex:0 0 auto!important;'
        +'height:min(calc(100vw - 14px),calc(100dvh - 410px))!important;'
        +'min-height:0!important;max-height:none!important;overflow:hidden!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host,'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest{'
        +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;'
      +'}'
      /* Approved guest 9-room: force every approved device to the same reference geometry. */
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-approved-guest-grid,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-prejoin-room-grid,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-guest-room-grid{'
        +'display:grid!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;'
        +'flex:0 0 auto!important;'
        +'height:min(calc(100vw - 14px),calc(100dvh - 410px))!important;'
        +'min-height:0!important;max-height:none!important;overflow:hidden!important;'
      +'}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-cell,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-approved-guest-cell,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-prejoin-room-cell,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-guest-room-cell{'
        +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;'
      +'}'
      /* Keep the reference three-button row size without changing button actions. */
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-quick,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-g9-final-quick{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'gap:5px!important;flex:0 0 35px!important;min-height:35px!important;'
        +'width:100%!important;margin:0!important;padding:0!important;'
      +'}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-quick>button,'
      +'#screen .kt-remote-live.kt-first-room-5555 .kt-g9-final-quick>button{'
        +'min-width:0!important;font-size:11px!important;white-space:nowrap!important;padding:0 3px!important;'
      +'}'
      /* Reference chat height. No chat logic/content changes. */
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-chat{'
        +'position:relative!important;display:block!important;'
        +'flex:0 0 54px!important;height:54px!important;min-height:54px!important;max-height:54px!important;'
        +'padding:1px 4px 2px!important;'
      +'}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-chatbox{'
        +'width:calc(100% - 90px)!important;height:52px!important;max-height:52px!important;'
      +'}'
      /* Guest earnings compact like the host reference. Host earnings itself is intentionally untouched. */
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-earn{'
        +'position:absolute!important;right:4px!important;left:auto!important;bottom:3px!important;'
        +'width:82px!important;min-width:82px!important;max-width:82px!important;'
        +'height:40px!important;min-height:40px!important;max-height:40px!important;'
        +'padding:1px 2px!important;border-radius:8px!important;box-sizing:border-box!important;overflow:hidden!important;'
      +'}'
      +'#screen .kt-remote-live.kt-first-room-5555 #ktAllRoomGuestEarnHud20260921{'
        +'right:6px!important;left:auto!important;bottom:58px!important;'
        +'width:82px!important;min-width:82px!important;max-width:82px!important;'
        +'height:40px!important;min-height:40px!important;max-height:40px!important;'
        +'padding:1px 2px!important;border-radius:8px!important;box-sizing:border-box!important;overflow:hidden!important;'
      +'}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-earn .top span,'
      +'#screen .kt-remote-live.kt-first-room-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:5px!important;line-height:1!important}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-earn .top b,'
      +'#screen .kt-remote-live.kt-first-room-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}'
      +'#screen .kt-remote-live.kt-first-room-5555 .kgh-earn-detail,'
      +'#screen .kt-remote-live.kt-first-room-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.7px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'@media(max-width:390px){'
        +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-approved-guest-grid,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-prejoin-room-grid,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-guest-room-grid{'
          +'height:min(calc(100vw - 8px),calc(100dvh - 395px))!important;'
        +'}'
        +'#screen .kt-remote-live.kt-first-room-5555 .kgh-quick,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-g9-final-quick{flex-basis:31px!important;min-height:31px!important;gap:4px!important}'
        +'#screen .kt-remote-live.kt-first-room-5555 .kgh-quick>button,'
        +'#screen .kt-remote-live.kt-first-room-5555 .kt-g9-final-quick>button{font-size:10px!important}'
        +'#screen .kt-remote-live.kt-first-room-5555 .kgh-earn,'
        +'#screen .kt-remote-live.kt-first-room-5555 #ktAllRoomGuestEarnHud20260921{'
          +'width:78px!important;min-width:78px!important;max-width:78px!important;'
          +'height:39px!important;min-height:39px!important;max-height:39px!important;'
        +'}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function isApprovedNine(root){
    if(!root)return false;
    try{
      var hostlike=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]');
      if(hostlike)return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var grid=root.querySelector('.kt-approved-guest-grid,.kt-prejoin-room-grid,.kt-guest-room-grid');
      if(!grid)return false;
      var cells=grid.querySelectorAll('.kt-approved-guest-cell,.kt-prejoin-room-cell,.kt-guest-room-cell,[data-guest-slot]');
      if(cells.length===9)return true;
      var txt=String(root.textContent||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(isApprovedNine(root))root.classList.add('kt-first-room-5555');
      else root.classList.remove('kt-first-room-5555');
    });
  }

  apply();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktFirstRoomVisualLock5555Timer);
      window.__ktFirstRoomVisualLock5555Timer=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();