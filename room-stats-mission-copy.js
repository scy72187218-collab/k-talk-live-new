/* 1인방·구독자방·비밀방: 일일 랭킹 / 미션 / 시청자 줄만 유지. 비밀방은 3칸이 항상 전부 보이게 고정. */
(function(){
  if(window.__ktRoomStatsMissionCopyInstalled)return;
  window.__ktRoomStatsMissionCopyInstalled=true;

  function ensureStyle(){
    var old=document.getElementById('ktRoomStatsMissionCopyStyle');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktRoomStatsMissionCopyStyle';
    s.textContent='\
      #screen .kt-room-stats-copy{box-sizing:border-box!important;flex:0 0 42px!important;display:grid!important;grid-template-columns:.92fr .72fr 1.36fr!important;gap:3px!important;min-height:42px!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;background:#000!important;position:relative!important;z-index:25!important;visibility:visible!important;opacity:1!important;overflow:visible!important;}\
      #screen .kt-room-stats-copy button,#screen .kt-room-stats-copy .kt-room-viewers-copy{box-sizing:border-box!important;min-width:0!important;border:0!important;border-radius:10px!important;background:#111114!important;color:#fff!important;font:950 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;white-space:nowrap!important;overflow:hidden!important;padding:0 2px!important;}\
      #screen .ktsecret-room .kt-room-stats-copy{display:grid!important;grid-template-columns:.95fr .7fr 1.35fr!important;width:100%!important;left:0!important;right:auto!important;transform:none!important;}\
      #screen .ktsecret-room .kt-room-stats-copy>[data-kt-room-rank]{display:flex!important;visibility:visible!important;opacity:1!important;}\
      @media(max-width:390px){#screen .kt-room-stats-copy{flex-basis:38px!important;min-height:38px!important;gap:2px!important}#screen .kt-room-stats-copy button,#screen .kt-room-stats-copy .kt-room-viewers-copy{font-size:10px!important;padding:0 1px!important}}';
    document.head.appendChild(s);
  }

  function viewerCount(){
    var n=1;
    try{if(window.state)n=Number(state.viewerCount||state.liveViewerCount||state.viewers||1);}catch(e){}
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
      if(typeof window.showSheet!=='function')return;
      window.showSheet('🎯 미션',''
        +'<div class="rowbox"><b>🌹 장미 미션</b><br>장미 1개짜리 30개 깨기</div>'
        +'<div class="rowbox"><b>🏎️ 스포츠카 미션</b><br>스포츠카 50개짜리 10개 깨기</div>'
        +'<div class="rowbox"><b>💎💗 다이아몬드 하트 미션</b><br>다이아몬드 하트 400개짜리 10개 깨기</div>');
    }catch(e){}
  }

  function fillRow(row){
    if(!row)return;
    row.innerHTML='<button type="button" data-kt-room-rank>🔥 일일 랭킹</button><button type="button" data-kt-room-mission>🎯 미션</button><div class="kt-room-viewers-copy">시청자 <b>'+viewerCount()+'</b>명이 시청중 🏃</div>';
    var r=row.querySelector('[data-kt-room-rank]');
    var m=row.querySelector('[data-kt-room-mission]');
    if(r)r.onclick=openRanking;
    if(m)m.onclick=openMission;
  }

  function makeRow(){
    var row=document.createElement('div');
    row.className='kt-room-stats-copy';
    fillRow(row);
    return row;
  }

  function addAfter(room,anchorSelector){
    if(!room)return;
    var anchor=room.querySelector(anchorSelector);
    if(!anchor)return;
    var row=room.querySelector('.kt-room-stats-copy');
    if(!row){row=makeRow();anchor.insertAdjacentElement('afterend',row);}
    if(!row.querySelector('[data-kt-room-rank]')||!row.querySelector('[data-kt-room-mission]')||!row.querySelector('.kt-room-viewers-copy'))fillRow(row);
  }

  function ensureSecretRow(){
    var room=document.querySelector('.ktsecret-room');
    if(!room)return;
    var anchor=room.querySelector('.ktsecret-led');
    if(!anchor)return;
    var row=room.querySelector('.kt-room-stats-copy');
    if(!row){row=makeRow();anchor.insertAdjacentElement('afterend',row);}
    if(row.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',row);
    if(!row.querySelector('[data-kt-room-rank]')||!row.querySelector('[data-kt-room-mission]')||!row.querySelector('.kt-room-viewers-copy'))fillRow(row);
    var rank=row.querySelector('[data-kt-room-rank]');
    if(rank){rank.style.setProperty('display','flex','important');rank.style.setProperty('visibility','visible','important');rank.style.setProperty('opacity','1','important');}
  }

  function renameGroup13Mission(){
    var row=document.querySelector('.ktg13-room .ktg13-stats');
    if(!row)return;
    var buttons=row.querySelectorAll('button');
    if(buttons[1]){
      if(buttons[1].textContent.indexOf('미션')===-1)buttons[1].textContent='🎯 미션';
      buttons[1].onclick=openMission;
    }
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
      window.__ktRoomStatsMissionCopyTimer=setTimeout(install,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(install,900);
})();

/* 다섯 방송방의 미션 버튼만 같은 내용으로 고정. 15명방과 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktFiveRoomMissionOnlyInstalled)return;
  window.__ktFiveRoomMissionOnlyInstalled=true;

  function showMission(){
    try{
      if(typeof window.showSheet!=='function')return;
      window.showSheet('🎯 미션',''
        +'<div class="rowbox"><b>🌹 장미 미션</b><br>장미 1개짜리 30개 깨기</div>'
        +'<div class="rowbox"><b>🏎️ 스포츠카 미션</b><br>스포츠카 50개짜리 10개 깨기</div>'
        +'<div class="rowbox"><b>💎💗 다이아몬드 하트 미션</b><br>다이아몬드 하트 400개짜리 10개 깨기</div>');
    }catch(e){}
  }

  window.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var copied=t.closest('.ktsolo-room [data-kt-room-mission],.ktsubscriber-room [data-kt-room-mission],.ktsecret-room [data-kt-room-mission]');
    var groupBtn=t.closest('.ktg13-room .ktg13-stats > button:nth-child(2)');
    if(!copied&&!groupBtn)return;
    if(groupBtn){
      var room=groupBtn.closest('.ktg13-room');
      if(room&&String(room.getAttribute('data-kt-room')||'')==='15')return;
    }
    try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(err){}
    showMission();
  },true);
})();
