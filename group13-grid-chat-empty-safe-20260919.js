/* K-Talk 13명방 전용 안전 배치:
   - 호스트/게스트 화면의 13칸만 4-4-4-1로 정렬
   - 마지막 줄의 빈 3칸(2~4열)에 채팅 표시
   - 스위치/방송연결/선물/카메라/마이크/다른 방은 건드리지 않음 */
(function(){
  if(window.__ktGroup13GridChatEmptySafe20260919)return;
  window.__ktGroup13GridChatEmptySafe20260919=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup13GridChatEmptySafeStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13GridChatEmptySafeStyle';
    s.textContent='#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-main{position:relative!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important;overflow:hidden!important;}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-host{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important;}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-guests{display:contents!important;}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-chat{grid-column:2/5!important;grid-row:4!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;margin:0!important;padding:5px 7px!important;align-self:stretch!important;justify-self:stretch!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;overflow:hidden!important;background:transparent!important;border:0!important;box-shadow:none!important;transform:none!important;z-index:18!important;pointer-events:none!important;}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-chat:empty:before{content:""!important;}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-chat-line{font-size:11px!important;line-height:1.3!important;margin-top:2px!important;text-shadow:0 1px 3px #000,0 0 5px #000!important;}.kt-guest-hostlike-room.kt-grid-chat-empty-safe .kgh-main.is13{position:relative!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important;overflow:hidden!important;}.kt-guest-hostlike-room.kt-grid-chat-empty-safe .kgh-main.is13>.kgh-chatbox{grid-column:2/5!important;grid-row:4!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;margin:0!important;padding:5px 7px!important;align-self:stretch!important;justify-self:stretch!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;overflow:hidden!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#fff!important;z-index:18!important;pointer-events:none!important;}.kt-guest-hostlike-room.kt-grid-chat-empty-safe .kgh-main.is13>.kgh-chatbox>div{font-size:10px!important;line-height:1.3!important;text-shadow:0 1px 3px #000,0 0 5px #000!important;}@media(max-width:390px){#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-chat{padding:3px 5px!important}#screen .ktg13-room.kt-grid-chat-empty-safe .ktg13-chat-line{font-size:9px!important}.kt-guest-hostlike-room.kt-grid-chat-empty-safe .kgh-main.is13>.kgh-chatbox{padding:3px 5px!important}.kt-guest-hostlike-room.kt-grid-chat-empty-safe .kgh-main.is13>.kgh-chatbox>div{font-size:9px!important;}}';
    document.head.appendChild(s);
  }

  function isHost13(room){
    if(!room)return false;
    if(room.getAttribute('data-kt-room')==='9'||room.getAttribute('data-kt-room')==='15')return false;
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      if(t==='group'||t==='group13'||n==='13명 방송')return true;
    }catch(e){}
    try{
      var txt=String(room.textContent||'');
      return txt.indexOf('13명 방송')>-1;
    }catch(e){return false;}
  }

  function applyHost(){
    var room=document.querySelector('#screen .ktg13-room');
    if(!isHost13(room))return;
    var main=room.querySelector('.ktg13-main');
    var chat=document.getElementById('ktg13ChatList')||room.querySelector('.ktg13-chat');
    if(!main||!chat)return;
    ensureStyle();
    room.classList.add('kt-grid-chat-empty-safe');
    if(chat.parentElement!==main)main.appendChild(chat);
  }

  function applyGuest(){
    document.querySelectorAll('.kt-guest-hostlike-room').forEach(function(room){
      var main=room.querySelector('.kgh-main.is13');
      if(!main)return;
      var chatbox=room.querySelector('.kgh-chatbox');
      if(!chatbox)return;
      ensureStyle();
      room.classList.add('kt-grid-chat-empty-safe');
      if(chatbox.parentElement!==main)main.appendChild(chatbox);
    });
  }

  function apply(){
    try{applyHost();}catch(e){}
    try{applyGuest();}catch(e){}
  }

  ensureStyle();
  apply();
  [50,120,250,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13GridChatEmptySafeTimer);
      window.__ktGroup13GridChatEmptySafeTimer=setTimeout(apply,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();