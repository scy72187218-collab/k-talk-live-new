/* 2026-09-11 요청: 13명방 보물상자 버튼을 누르면 호스트 라벨 바로 옆에 보물상자와 남은 시간이 표시되게 함. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktGroup13TreasureHost20260911)return;
  window.__ktGroup13TreasureHost20260911=true;

  var st=document.createElement('style');
  st.id='ktGroup13TreasureHostStyle20260911';
  st.textContent=''
    +'.ktg13-host{position:relative!important}'
    +'.ktg13-host>#ktLiveTreasureZone{position:absolute!important;left:70px!important;top:5px!important;transform:none!important;z-index:20!important;width:112px!important;display:grid!important;place-items:start!important;pointer-events:none!important}'
    +'.ktg13-host>#ktLiveTreasureZone:empty{display:none!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-live-treasure{width:112px!important;min-height:38px!important;display:grid!important;grid-template-columns:34px 1fr!important;grid-template-rows:auto auto!important;column-gap:5px!important;align-items:center!important;justify-items:start!important;padding:3px 6px!important;border-radius:14px!important;background:rgba(10,10,14,.82)!important;border:1px solid rgba(255,211,70,.72)!important;box-shadow:0 0 10px rgba(255,187,48,.42)!important;pointer-events:auto!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-treasure-caption{display:none!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-chest-art{grid-row:1/3!important;grid-column:1!important;width:34px!important;height:28px!important;transform:scale(.34)!important;transform-origin:left center!important;margin:0!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-live-treasure strong{grid-column:2!important;grid-row:1!important;margin:0!important;font-size:10px!important;line-height:1!important;color:#ffe16b!important;white-space:nowrap!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-treasure-time{grid-column:2!important;grid-row:2!important;margin:1px 0 0!important;padding:2px 5px!important;border-radius:7px!important;font-size:11px!important;line-height:1!important;white-space:nowrap!important}'
    +'.ktg13-host>#ktLiveTreasureZone .kt-live-treasure small{display:none!important}'
    +'@media(max-width:390px){.ktg13-host>#ktLiveTreasureZone{left:65px!important;top:4px!important;width:104px!important}.ktg13-host>#ktLiveTreasureZone .kt-live-treasure{width:104px!important;padding:3px 5px!important;grid-template-columns:31px 1fr!important}.ktg13-host>#ktLiveTreasureZone .kt-chest-art{transform:scale(.31)!important}.ktg13-host>#ktLiveTreasureZone .kt-treasure-time{font-size:10px!important}}';
  document.head.appendChild(st);

  function ensureZone(){
    var room=document.querySelector('.ktg13-room');
    var host=room&&room.querySelector('.ktg13-host');
    if(!host)return null;
    var zone=document.getElementById('ktLiveTreasureZone');
    if(zone&&zone.parentNode!==host){
      try{zone.remove();}catch(e){}
      zone=null;
    }
    if(!zone){
      zone=document.createElement('div');
      zone.id='ktLiveTreasureZone';
      zone.className='kt-live-treasure-zone';
      host.appendChild(zone);
    }
    return zone;
  }

  function render(){
    var zone=ensureZone();
    if(!zone)return;
    try{if(typeof window.ktRenderTreasure==='function')window.ktRenderTreasure();}catch(e){}
  }

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.ktg13-right-quick button'):null;
    if(!btn)return;
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    if(text.indexOf('보물상자')===-1)return;
    setTimeout(render,0);
    setTimeout(render,80);
    setTimeout(render,250);
  },true);

  var ob=new MutationObserver(function(){render();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(render,0);
  setTimeout(render,120);
})();
