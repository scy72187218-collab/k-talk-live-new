/* 1인방·구독자방·비밀방: 13명방의 일일 랭킹 / 미션 / 시청자 수 줄만 추가. 13명방은 '지금 추가'를 '미션'으로만 바꿈. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktRoomStatsMissionCopyInstalled)return;
  window.__ktRoomStatsMissionCopyInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktRoomStatsMissionCopyStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomStatsMissionCopyStyle';
    s.textContent='\
      #screen .kt-room-stats-copy{flex:0 0 42px!important;display:grid!important;grid-template-columns:1fr 1fr 1.35fr!important;gap:5px!important;min-height:42px!important;width:100%!important;background:#000!important;position:relative!important;z-index:5!important;visibility:visible!important;opacity:1!important;}\
      #screen .kt-room-stats-copy button,#screen .kt-room-stats-copy .kt-room-viewers-copy{border:0!important;border-radius:12px!important;background:#111114!important;color:#fff!important;font:950 13px/1.1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;white-space:nowrap!important;overflow:hidden!important;padding:0 5px!important;}\
      @media(max-width:390px){#screen .kt-room-stats-copy{flex-basis:38px!important;min-height:38px!important;gap:3px!important}#screen .kt-room-stats-copy button,#screen .kt-room-stats-copy .kt-room-viewers-copy{font-size:11px!important;padding:0 3px!important}}';
    document.head.appendChild(s);
  }

  function viewerCount(){
    var n=1;
    try{
      if(window.state){
        n=Number(state.viewerCount||state.liveViewerCount||state.viewers||1);
      }
    }catch(e){}
    if(!isFinite(n)||n<1)n=1;
    return Math.floor(n);
  }

  function openRanking(){
    try{
      if(typeof window.ktGroup13Ranking==='function'){window.ktGroup13Ranking();return;}
      if(typeof window.showSheet==='function')window.showSheet('🔥 일일 랭킹','<div class="rowbox"><b>일일 랭킹</b><br>오늘의 방송 랭킹을 확인합니다.</div>');
    }catch(e){}
  }

  function openMission(){
    try{
      if(typeof window.showSheet==='function')window.showSheet('🎯 미션','<div class="rowbox"><b>미션</b><br>방송 미션을 확인하는 자리입니다.</div>');
    }catch(e){}
  }

  function makeRow(){
    var row=document.createElement('div');
    row.className='kt-room-stats-copy';
    row.innerHTML='<button type="button" data-kt-room-rank>🔥 일일 랭킹</button><button type="button" data-kt-room-mission>🎯 미션</button><div class="kt-room-viewers-copy">시청자 <b>'+viewerCount()+'</b>명이 시청중 🏃</div>';
    var r=row.querySelector('[data-kt-room-rank]');
    var m=row.querySelector('[data-kt-room-mission]');
    if(r)r.onclick=openRanking;
    if(m)m.onclick=openMission;
    return row;
  }

  function addAfter(room,anchorSelector){
    if(!room||room.querySelector('.kt-room-stats-copy'))return;
    var anchor=room.querySelector(anchorSelector);
    if(!anchor)return;
    anchor.insertAdjacentElement('afterend',makeRow());
  }

  function ensureSecretRow(){
    var room=document.querySelector('.ktsecret-room');
    if(!room)return;
    var anchor=room.querySelector('.ktsecret-led');
    if(!anchor)return;
    var row=room.querySelector('.kt-room-stats-copy');
    if(!row){
      row=makeRow();
      anchor.insertAdjacentElement('afterend',row);
    }else if(row.previousElementSibling!==anchor){
      anchor.insertAdjacentElement('afterend',row);
    }
  }

  function renameGroup13Mission(){
    var row=document.querySelector('.ktg13-room .ktg13-stats');
    if(!row)return;
    var buttons=row.querySelectorAll('button');
    if(buttons[1]&&buttons[1].textContent.indexOf('미션')===-1)buttons[1].textContent='🎯 미션';
  }

  function refreshViewers(){
    document.querySelectorAll('.kt-room-viewers-copy b').forEach(function(b){b.textContent=String(viewerCount());});
  }

  function install(){
    ensureStyle();
    addAfter(document.querySelector('.ktsolo-room'),'.ktsolo-led');
    addAfter(document.querySelector('.ktsubscriber-room'),'.ktsubscriber-led');
    ensureSecretRow();
    renameGroup13Mission();
    refreshViewers();
  }

  install();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktRoomStatsMissionCopyTimer);
      window.__ktRoomStatsMissionCopyTimer=setTimeout(install,40);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(refreshViewers,1500);
})();
