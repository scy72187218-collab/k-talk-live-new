/* K-Talk 9-room bottom-label + slight grid trim — 2026-10-01 — 5555
   VISUAL ONLY.
   Scope:
   - 9-person HOST room: show bottom tool labels fully.
   - approved guest 9-room grid is intentionally untouched here so it matches the side screens.
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
        +'#screen .kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom{min-height:56px!important;padding-bottom:5px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensureStyle();
})();