/* K-Talk - only add 되돌리기 / 보물상자 / 매치 to all five live rooms.
   No other layout, chat, gift, video, signaling or room logic changes. 1150617 */
(function(){
  if(window.__ktAllFiveUndoTreasureMatch20261005)return;
  window.__ktAllFiveUndoTreasureMatch20261005=true;

  function ensureStyle(){
    if(document.getElementById('ktAllFiveUndoTreasureMatchStyle20261005'))return;
    var s=document.createElement('style');
    s.id='ktAllFiveUndoTreasureMatchStyle20261005';
    s.textContent=''
      +'#screen .kt-all-five-utm-20261005{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
      +'gap:4px!important;width:100%!important;box-sizing:border-box!important;margin:0!important;padding:0 2px!important;'
      +'min-height:34px!important;height:34px!important;position:relative!important;z-index:45!important;pointer-events:auto!important}'
      +'#screen .kt-all-five-utm-20261005 button{height:34px!important;min-width:0!important;margin:0!important;padding:2px 3px!important;'
      +'border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;'
      +'background:linear-gradient(180deg,rgba(28,28,34,.96),rgba(10,10,14,.96))!important;color:#fff!important;'
      +'display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;'
      +'font-size:10px!important;font-weight:950!important;white-space:nowrap!important;touch-action:manipulation!important}'
      +'#screen .kt-all-five-utm-20261005 button b{font-size:14px!important;line-height:1!important}'
      +'#screen .kt-all-five-utm-20261005 button span{font-size:10px!important;font-weight:950!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function hasWantedRow(room){
    var rows=[].slice.call(room.querySelectorAll(':scope > .kt-all-five-utm-20261005,:scope > .kt-live-top-quickbar'));
    return rows.some(function(row){
      var t=String(row.textContent||'').replace(/\s+/g,'');
      return t.indexOf('되돌리기')>-1&&t.indexOf('보물상자')>-1&&t.indexOf('매치')>-1;
    });
  }

  function makeRow(){
    var row=document.createElement('div');
    row.className='kt-all-five-utm-20261005';
    row.setAttribute('data-kt-utm','1150617');
    row.innerHTML=''
      +'<button type="button" aria-label="되돌리기"><b>↻</b><span>되돌리기</span></button>'
      +'<button type="button" aria-label="보물상자"><b>🎁</b><span>보물상자</span></button>'
      +'<button type="button" aria-label="매치"><b>⚔</b><span>매치</span></button>';
    return row;
  }

  function anchor(room){
    if(room.classList.contains('ktsolo-room'))
      return room.querySelector('.ktsolo-stats,.ktsolo-main');
    if(room.classList.contains('ktg13-room'))
      return room.querySelector('.ktg13-stats,.ktg13-main');
    if(room.classList.contains('ktsubscriber-room'))
      return room.querySelector('.ktsubscriber-stats,.ktsubscriber-main');
    if(room.classList.contains('ktsecret-room'))
      return room.querySelector('.ktsecret-stats,.ktsecret-main');
    if(room.classList.contains('kt-remote-live'))
      return room.querySelector('.kgh-stats,.ktg13-stats,.ktsolo-stats,.ktsubscriber-stats,.ktsecret-stats,.kgh-main,.ktg13-main,.ktsolo-main,.ktsubscriber-main,.ktsecret-main');
    return null;
  }

  function install(room){
    if(!room||!room.isConnected||hasWantedRow(room))return;
    var a=anchor(room);
    if(!a||!a.parentNode)return;
    a.parentNode.insertBefore(makeRow(),a);
  }

  function run(){
    ensureStyle();
    document.querySelectorAll('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live').forEach(install);
  }

  run();
  [80,250,700,1500,2800].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllFiveUTMTimer20261005);
      window.__ktAllFiveUTMTimer20261005=setTimeout(run,30);
    }).observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  }catch(e){}
})();