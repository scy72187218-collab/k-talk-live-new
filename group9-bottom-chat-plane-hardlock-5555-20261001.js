/* K-Talk 9-room bottom chat + send airplane HARD LOCK — 2026-10-01 — PIN 5555
   ONLY:
   1) host + remote 9-room chat messages stay bottom-aligned and grow upward.
   2) remote 9-room chat input always keeps the paper-airplane send button next to it.
   DO NOT touch grid, earnings, camera/mic, approval, signaling, gifts, switches, or other rooms.
*/
(function(){
  if(window.__ktG9BottomChatPlaneHardLock5555_20261001)return;
  window.__ktG9BottomChatPlaneHardLock5555_20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktG9BottomChatPlaneHardLock5555Style'))return;
    var s=document.createElement('style');
    s.id='ktG9BottomChatPlaneHardLock5555Style';
    s.textContent=''
      /* HOST 9-room: chat lines stay at bottom of their chat box and stack upward */
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-chat{'
        +'display:flex!important;'
        +'flex-direction:column!important;'
        +'justify-content:flex-end!important;'
        +'align-items:stretch!important;'
        +'overflow:hidden!important;'
        +'transform:none!important;'
      +'}'
      /* REMOTE/GUEST 9-room: chat messages fixed above input and stack upward */
      +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-chat{'
        +'position:absolute!important;'
        +'left:8px!important;'
        +'right:92px!important;'
        +'bottom:58px!important;'
        +'top:auto!important;'
        +'height:62px!important;'
        +'min-height:62px!important;'
        +'max-height:62px!important;'
        +'display:flex!important;'
        +'flex-direction:column!important;'
        +'justify-content:flex-end!important;'
        +'align-items:stretch!important;'
        +'overflow:hidden!important;'
        +'margin:0!important;'
        +'transform:none!important;'
        +'z-index:2147482300!important;'
      +'}'
      /* REMOTE/GUEST 9-room: bottom input bar fixed */
      +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-bottom{'
        +'position:absolute!important;'
        +'left:6px!important;right:6px!important;'
        +'bottom:calc(6px + env(safe-area-inset-bottom))!important;'
        +'top:auto!important;'
        +'height:44px!important;'
        +'min-height:44px!important;'
        +'max-height:44px!important;'
        +'display:flex!important;'
        +'align-items:center!important;'
        +'gap:5px!important;'
        +'padding:0!important;margin:0!important;'
        +'transform:none!important;'
        +'z-index:2147482500!important;'
      +'}'
      +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-bottom input{'
        +'flex:1 1 auto!important;'
        +'min-width:0!important;'
      +'}'
      +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-bottom [data-kt-send-plane-hard-5555]{'
        +'display:grid!important;'
        +'place-items:center!important;'
        +'flex:0 0 40px!important;'
        +'width:40px!important;'
        +'height:40px!important;'
        +'border-radius:50%!important;'
        +'font-size:18px!important;'
      +'}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-chat{'
          +'right:88px!important;bottom:54px!important;'
          +'height:58px!important;min-height:58px!important;max-height:58px!important;'
        +'}'
        +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-bottom{'
          +'height:42px!important;min-height:42px!important;max-height:42px!important;'
          +'bottom:calc(5px + env(safe-area-inset-bottom))!important;'
        +'}'
        +'#screen .kt-remote-live.kt-g9-chat-bottom-5555>.kt-remote-bottom [data-kt-send-plane-hard-5555]{'
          +'width:38px!important;height:38px!important;flex-basis:38px!important;'
        +'}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function isNineRemote(root){
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

  function sendChat(){
    try{
      if(typeof window.ktRemoteSendChat==='function')return window.ktRemoteSendChat();
    }catch(e){}
  }

  function ensurePlane(root){
    var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
    if(!bar)return;
    var input=bar.querySelector('input');
    if(!input)return;

    var b=bar.querySelector('[data-kt-send-plane-hard-5555]');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-remote-action send';
      b.setAttribute('data-kt-send-plane-hard-5555','1');
      b.setAttribute('aria-label','채팅 보내기');
      b.textContent='➤';
      input.insertAdjacentElement('afterend',b);
    }
    b.onclick=sendChat;
  }

  function apply(){
    ensureStyle();

    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(isNineRemote(root)){
        root.classList.add('kt-g9-chat-bottom-5555');
        ensurePlane(root);
      }else{
        root.classList.remove('kt-g9-chat-bottom-5555');
      }
    });

    /* host chat alignment only */
    document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"] .ktg13-chat').forEach(function(chat){
      chat.style.setProperty('display','flex','important');
      chat.style.setProperty('flex-direction','column','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,200,500].forEach(function(ms){setTimeout(apply,ms);});});
  window.addEventListener('kt-livekit-state',function(){setTimeout(apply,40);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9BottomChatPlaneHardLock5555Timer);
      window.__ktG9BottomChatPlaneHardLock5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();