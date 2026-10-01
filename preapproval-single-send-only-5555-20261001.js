/* K-Talk PRE-APPROVAL guest 9-room single send arrow ONLY — 2026-10-01 — PIN 5555
   Scope: guest 9-room BEFORE approval only.
   Keep exactly one paper-airplane send button next to chat input.
   Do not touch approved guest screen, host room, grid, chat position, earnings, signaling, camera/mic, buttons, or other rooms.
*/
(function(){
  if(window.__ktPreApprovalSingleSend5555_20261001)return;
  window.__ktPreApprovalSingleSend5555_20261001=true;

  function isPreApprovalNine(root){
    if(!root)return false;
    try{
      /* approved guest screen: never touch */
      if(root.querySelector('.kt-guest-hostlike-room'))return false;
      if(root.classList.contains('kt-approved-guest-room')||
         root.classList.contains('kt-approved-now-5555')||
         root.classList.contains('kt-approved-roster-5555'))return false;

      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      if(/9\s*명|group9/i.test(txt))return true;

      var g=root.querySelector('.kt-prejoin-room-grid,.kt-guest-room-grid,.kt-approved-guest-grid');
      if(g){
        var cells=g.querySelectorAll(':scope > *');
        if(cells.length===9)return true;
      }
    }catch(e){}
    return false;
  }

  function sendChat(){
    try{
      if(typeof window.ktRemoteSendChat==='function')return window.ktRemoteSendChat();
    }catch(e){}
  }

  function apply(){
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isPreApprovalNine(root))return;

      var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(!bar)return;
      var input=bar.querySelector('input');
      if(!input)return;

      var candidates=[].slice.call(bar.querySelectorAll(
        '.kt-remote-action.send,'+
        '[data-kt-g9-final="send"],'+
        '[data-kt-send-plane-5555],'+
        '[data-kt-send-plane-hard-5555],'+
        '[data-kt-single-send-5555]'
      ));

      var keep=null;
      /* Prefer a visible paper-airplane/arrow button */
      candidates.forEach(function(b){
        if(!keep && /➤|✈|➢|▶|►/.test(String(b.textContent||'')))keep=b;
      });
      if(!keep)keep=candidates[0]||null;

      if(!keep){
        keep=document.createElement('button');
        keep.type='button';
        keep.className='kt-remote-action send';
        keep.textContent='➤';
      }

      /* Always place the single send button immediately after the input */
      if(keep.previousElementSibling!==input){
        input.insertAdjacentElement('afterend',keep);
      }

      keep.setAttribute('data-kt-preapproval-single-send-5555','1');
      keep.setAttribute('aria-label','채팅 보내기');
      keep.textContent='➤';
      keep.onclick=sendChat;

      candidates.forEach(function(b){
        if(b!==keep){
          try{b.remove();}catch(e){}
        }
      });

      /* Remove any stray plain arrow-like buttons immediately after input */
      var n=keep.nextElementSibling;
      while(n){
        var next=n.nextElementSibling;
        var txt=String(n.textContent||'').trim();
        if((/^(➤|✈|➢|▶|►|→|↗)$/.test(txt)) && n.tagName==='BUTTON'){
          try{n.remove();}catch(e){}
        }
        n=next;
      }
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktPreApprovalSingleSend5555Timer);
      window.__ktPreApprovalSingleSend5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();