/* K-Talk side guest 9-room quick row + single send arrow lock — 2026-10-01 — PIN 5555
   ONLY remote/guest 9-room screens:
   - restore top quick row: undo / treasure box / match
   - keep exactly ONE paper-airplane send button beside chat input
   Do not touch host room, grid geometry, earnings, chat position, signaling, approval, camera/mic, or other rooms.
*/
(function(){
  if(window.__ktSideGuest9QuickSingleSend5555_20261001)return;
  window.__ktSideGuest9QuickSingleSend5555_20261001=true;

  function isNine(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function wireQuick(q){
    if(!q)return;
    var bs=q.querySelectorAll(':scope > button');
    if(bs[0])bs[0].onclick=function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
      }catch(e){}
    };
    if(bs[1])bs[1].onclick=function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openPackageBox==='function')return window.openPackageBox();
        if(typeof window.openGifts==='function')return window.openGifts();
      }catch(e){}
    };
    if(bs[2])bs[2].onclick=function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    };
  }

  function ensureQuick(root){
    var q=root.querySelector('.kt-guest-hostlike-room .kgh-quick,.kt-g9-final-quick');
    if(q){
      q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물상자</button><button type="button">⚔ 매치</button>';
      wireQuick(q);
      return;
    }

    var grid=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"] .kgh-main,.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid');
    if(!grid)return;

    q=document.createElement('div');
    q.className='kt-g9-final-quick';
    q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물상자</button><button type="button">⚔ 매치</button>';
    q.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;flex:0 0 35px;min-height:35px;width:100%;margin:0;padding:0;position:relative;z-index:90;';
    [].slice.call(q.children).forEach(function(b){
      b.style.cssText='min-width:0;border:0;border-radius:11px;background:#101014;color:#fff;font-size:11px;font-weight:900;white-space:nowrap;padding:0 3px;';
    });
    wireQuick(q);
    grid.parentNode.insertBefore(q,grid);
  }


  function apply(){
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNine(root))return;
      ensureQuick(root);
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,200,500].forEach(function(ms){setTimeout(apply,ms);});});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSideGuest9QuickSingleSend5555Timer);
      window.__ktSideGuest9QuickSingleSend5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();