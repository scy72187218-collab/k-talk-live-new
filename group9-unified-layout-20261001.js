/* K-Talk 9-room host/approved-guest visual unification — 2026-10-01
   5555: Only unify the 9-person grid size and approved-guest earnings size.
   Keep top controls, bottom controls, video, signaling, gifts, chat behavior untouched. */
(function(){
  if(window.__ktGroup9UnifiedVisual20261001)return;
  window.__ktGroup9UnifiedVisual20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup9UnifiedVisualStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktGroup9UnifiedVisualStyle20261001';
    s.textContent=''
      /* Host 9-room: use the exact same 3x3 square-area rule as the approved guest room. */
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main{'
        +'flex:0 0 auto!important;'
        +'height:calc(100vw - 14px)!important;'
        +'max-height:calc(100dvh - 410px)!important;'
        +'min-height:0!important;'
        +'display:grid!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;'
        +'overflow:hidden!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host,'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-guests>.ktg13-guest{'
        +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;'
      +'}'
      /* Approved guest 9-room: explicitly lock to the same rule. */
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{'
        +'flex:0 0 auto!important;'
        +'height:calc(100vw - 14px)!important;'
        +'max-height:calc(100dvh - 410px)!important;'
        +'min-height:0!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;'
      +'}'
      /* Approved guest earnings: match the compact host earnings size, without moving other controls. */
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-chat{'
        +'grid-template-columns:minmax(0,1fr) 180px!important;'
      +'}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn{'
        +'width:180px!important;min-width:180px!important;max-width:180px!important;'
        +'height:40px!important;min-height:40px!important;max-height:40px!important;'
        +'padding:2px 4px!important;box-sizing:border-box!important;'
        +'align-self:end!important;justify-self:end!important;'
        +'overflow:hidden!important;'
      +'}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn .top span{font-size:7px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn .top b{font-size:10px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn-detail{font-size:6.5px!important;margin-top:1px!important}'
      +'@media(max-width:390px){'
        +'#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'
        +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{'
          +'height:calc(100vw - 8px)!important;'
          +'max-height:calc(100dvh - 395px)!important;'
        +'}'
        +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-chat{grid-template-columns:minmax(0,1fr) 165px!important}'
        +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn{width:165px!important;min-width:165px!important;max-width:165px!important}'
      +'}';
    document.head.appendChild(s);
  }

  function keepTreasureText(){
    document.querySelectorAll(
      '#screen .ktg13-room[data-kt-room="9"] button,'+
      '#screen .kt-guest-hostlike-room[data-kt-room="9"] button'
    ).forEach(function(b){
      var t=String(b.textContent||'').replace(/\s+/g,' ').trim();
      if(/패키지\s*상자/.test(t)) b.innerHTML=b.innerHTML.replace(/패키지\s*상자/g,'보물 상자');
      if(/보물\s*패키지/.test(t)) b.innerHTML=b.innerHTML.replace(/보물\s*패키지/g,'보물 상자');
    });
  }

  function apply(){
    ensureStyle();
    keepTreasureText();
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9UnifiedVisualTimer20261001);
      window.__ktGroup9UnifiedVisualTimer20261001=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();