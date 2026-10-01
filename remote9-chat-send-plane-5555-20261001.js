/* K-Talk 9-room remote chat send airplane restore — 2026-10-01 — 5555
   ONLY add the missing paper-airplane send button beside chat input
   on remote/guest 9-room screens (the two side screens).
   Do not change grid, host room, approval, camera/mic, gifts, earnings, or signaling.
*/
(function(){
  if(window.__ktRemote9SendPlane5555_20261001)return;
  window.__ktRemote9SendPlane5555_20261001=true;

  function isNineRemote(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid')){
        var txt=String(root.textContent||'');
        var st=window.state||{};
        txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
        var last=window.__ktLastLiveRoom||{};
        txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
        if(/9\s*명|group9/i.test(txt))return true;
      }
      if(root.classList.contains('kt-g9-final-5555'))return true;
    }catch(e){}
    return false;
  }

  function sendChat(){
    try{
      if(typeof window.ktRemoteSendChat==='function')return window.ktRemoteSendChat();
    }catch(e){}
  }

  function apply(){
    document.querySelectorAll('#screen .kt-remote-live,.kt-remote-live').forEach(function(root){
      if(!isNineRemote(root))return;
      var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(!bar)return;
      var input=bar.querySelector('input');
      if(!input)return;

      var existing=bar.querySelector('[data-kt-send-plane-5555],.kt-remote-action.send');
      if(existing){
        existing.setAttribute('data-kt-send-plane-5555','1');
        existing.onclick=sendChat;
        return;
      }

      var b=document.createElement('button');
      b.type='button';
      b.className='kt-remote-action send';
      b.setAttribute('data-kt-send-plane-5555','1');
      b.setAttribute('aria-label','채팅 보내기');
      b.textContent='➤';
      b.onclick=sendChat;
      input.insertAdjacentElement('afterend',b);
    });
  }

  apply();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,30);setTimeout(apply,180);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemote9SendPlane5555Timer);
      window.__ktRemote9SendPlane5555Timer=setTimeout(apply,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();