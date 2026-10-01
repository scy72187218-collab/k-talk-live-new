/* K-Talk 9-room bottom-label + slight grid trim — 2026-10-01 — 5555
   VISUAL ONLY.
   Scope:
   - 9-person HOST room: show bottom tool labels fully.
   - approved guest 9-room: trim grid slightly so bottom labels are visible and layout matches.
   No signaling, camera, approval, entry/exit, button actions, chat, earnings logic, or other rooms.
*/
(function(){
  if(window.__ktG9BottomLabelsAndGridTrim5555_20261001)return;
  window.__ktG9BottomLabelsAndGridTrim5555_20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktG9BottomLabelsAndGridTrim5555Style'))return;
    var s=document.createElement('style');
    s.id='ktG9BottomLabelsAndGridTrim5555Style';
    s.textContent=''
      /* host 9-room: reserve a little more room for the 8 labels */
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools{'
        +'flex:0 0 58px!important;'
        +'min-height:58px!important;'
        +'padding-bottom:6px!important;'
        +'box-sizing:border-box!important;'
        +'align-items:start!important;'
        +'margin-top:auto!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools .ktg13-tool span{'
        +'display:block!important;'
        +'visibility:visible!important;'
        +'opacity:1!important;'
        +'line-height:1.1!important;'
        +'font-size:8px!important;'
        +'padding-bottom:1px!important;'
      +'}'
      /* approved guest 9-room: reduce square grid slightly to free bottom space */
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main{'
        +'height:calc(100vw - 34px)!important;'
        +'min-height:calc(100vw - 34px)!important;'
        +'max-height:none!important;'
        +'flex:0 0 calc(100vw - 34px)!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;'
      +'}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main>.kgh-cell{'
        +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;'
      +'}'
      /* remote bottom labels in approved guest view */
      +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom{'
        +'min-height:58px!important;'
        +'padding-bottom:6px!important;'
        +'box-sizing:border-box!important;'
        +'align-items:flex-start!important;'
      +'}'
      +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom .kt-remote-action{'
        +'overflow:visible!important;'
      +'}'
      +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom .kt-remote-action span,'
      +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom .kt-remote-action small{'
        +'display:block!important;visibility:visible!important;opacity:1!important;line-height:1.1!important;'
      +'}'
      +'@media(max-width:390px){'
        +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-tools{flex-basis:56px!important;min-height:56px!important;padding-bottom:5px!important}'
        +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main{'
          +'height:calc(100vw - 28px)!important;'
          +'min-height:calc(100vw - 28px)!important;'
          +'flex-basis:calc(100vw - 28px)!important;'
        +'}'
        +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom{min-height:56px!important;padding-bottom:5px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensureStyle();
})();