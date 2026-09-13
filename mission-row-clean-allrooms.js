/* K-Talk 5개 방송방 미션 줄 정리: 1인/9명/13명/구독/비밀. 미션 칸만 깔끔하게, 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktMissionRowCleanAllRoomsInstalled)return;
  window.__ktMissionRowCleanAllRoomsInstalled=true;

  function ensureStyle(){
    var old=document.getElementById('ktMissionRowCleanAllRoomsStyle');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktMissionRowCleanAllRoomsStyle';
    s.textContent=''
      +'#screen .kt-room-stats-copy{grid-template-columns:minmax(0,.9fr) minmax(82px,.9fr) minmax(0,1.2fr)!important;gap:3px!important;overflow:hidden!important}'
      +'#screen .kt-room-stats-copy>[data-kt-room-rank],#screen .kt-room-stats-copy>[data-kt-room-mission],#screen .kt-room-stats-copy>.kt-room-viewers-copy{min-width:0!important;max-width:100%!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important;padding-left:3px!important;padding-right:3px!important}'
      +'#screen .kt-room-stats-copy>[data-kt-room-mission]{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;font-weight:950!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats{grid-template-columns:minmax(0,.9fr) minmax(82px,.9fr) minmax(0,1.2fr)!important;gap:3px!important;overflow:hidden!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>.ktg13-viewers{min-width:0!important;max-width:100%!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important;padding-left:3px!important;padding-right:3px!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button:nth-child(2){position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;font-weight:950!important}'
      +'#screen .kt-room-stats-copy .kt-mission-stage-badge,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button:nth-child(2) .kt-mission-stage-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;margin-left:2px!important;padding:1px 3px!important;border-radius:999px!important;font-size:7px!important;line-height:1!important;white-space:nowrap!important;max-width:none!important;overflow:visible!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-room-stats-copy,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats{grid-template-columns:minmax(0,.88fr) minmax(76px,.88fr) minmax(0,1.24fr)!important;gap:2px!important}'
        +'#screen .kt-room-stats-copy button,#screen .kt-room-stats-copy .kt-room-viewers-copy,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>.ktg13-viewers{font-size:10px!important;padding-left:2px!important;padding-right:2px!important}'
        +'#screen .kt-room-stats-copy .kt-mission-stage-badge,#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button:nth-child(2) .kt-mission-stage-badge{font-size:6.5px!important;padding:1px 2px!important;margin-left:1px!important}'
      +'}';
    document.head.appendChild(s);
  }

  function compactBadge(b){
    if(!b)return;
    var t=String(b.textContent||'');
    if(t.indexOf('1단계')===0)b.textContent='1단계🌹';
    else if(t.indexOf('2단계')===0)b.textContent='2단계🏎️';
    else if(t.indexOf('3단계')===0)b.textContent='3단계💎';
  }

  function tidy(){
    ensureStyle();
    document.querySelectorAll('.ktsolo-room [data-kt-room-mission],.ktsubscriber-room [data-kt-room-mission],.ktsecret-room [data-kt-room-mission],.ktg13-room:not([data-kt-room="15"]) .ktg13-stats>button:nth-child(2)').forEach(function(btn){
      btn.style.setProperty('white-space','nowrap','important');
      btn.style.setProperty('overflow','hidden','important');
      btn.style.setProperty('text-overflow','clip','important');
      compactBadge(btn.querySelector('.kt-mission-stage-badge'));
    });
  }

  tidy();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(tidy,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktMissionRowCleanAllRoomsTimer);
      window.__ktMissionRowCleanAllRoomsTimer=setTimeout(tidy,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();
