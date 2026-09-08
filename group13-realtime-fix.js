/* K-Talk 13명 방송 실시간 표시 보강: 채팅 + 참여요청만. 다른 UI/보정은 건드리지 않음. */
(function(){
  if(window.__ktGroup13RealtimeFixInstalled)return;
  window.__ktGroup13RealtimeFixInstalled=true;

  var BRIDGE='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-realtime-bridge';
  var roomHostId='';
  var lastRequestSig='';
  var polling=false;
  var timer=null;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
  function deviceId(){
    try{
      var v=localStorage.getItem('kt_rt_device_id');
      if(v)return v;
      v='rt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);
      localStorage.setItem('kt_rt_device_id',v);return v;
    }catch(e){return 'rt_'+Date.now().toString(36);}
  }
  function displayName(){
    try{return localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('nickname')||'K-Talk';}catch(e){return 'K-Talk';}
  }
  async function bridge(payload){
    var r=await fetch(BRIDGE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{}),cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    var j=await r.json();
    if(j&&j.error)throw new Error(j.error);
    return j&&j.data!=null?j.data:j;
  }
  function isHostRoomVisible(){return !!document.querySelector('.ktg13-room');}

  async function resolveHostId(){
    if(roomHostId)return roomHostId;
    try{
      var rows=await bridge({action:'latest_room'});
      if(rows&&rows[0]&&rows[0].host_id){roomHostId=rows[0].host_id;return roomHostId;}
    }catch(e){}
    return '';
  }

  function ensureStyle(){
    if(document.getElementById('ktg13RealtimeFixStyle'))return;
    var s=document.createElement('style');s.id='ktg13RealtimeFixStyle';
    s.textContent=''
      +'.ktg13-room{position:relative!important}'
      +'#ktg13RequestTray{position:absolute;right:10px;top:118px;z-index:70;width:min(320px,46%);display:grid;gap:6px;pointer-events:auto}'
      +'.ktg13-req{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:5px;align-items:center;padding:7px 8px;border-radius:12px;border:1px solid #ff5ecb;background:rgba(18,10,22,.94);box-shadow:0 0 12px rgba(255,62,194,.34);color:#fff;font-size:11px;font-weight:900}'
      +'.ktg13-req b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#ffe06b}'
      +'.ktg13-req button{height:28px;border:0;border-radius:9px;padding:0 8px;font-size:10px;font-weight:950;color:#fff;background:#7b42ff}'
      +'.ktg13-req button:last-child{background:#3a3a42}'
      +'@media(max-width:520px){#ktg13RequestTray{top:104px;width:58%;right:5px}.ktg13-req{grid-template-columns:1fr auto;}.ktg13-req button:last-child{display:none}}';
    document.head.appendChild(s);
  }

  function renderMessages(rows){
    var box=document.getElementById('ktg13ChatList');
    if(!box)return;
    rows=(rows||[]).slice(-8);
    box.innerHTML=rows.map(function(m){return '<div class="ktg13-chat-line"><b>'+esc(m.sender_name||'게스트')+'</b><span>'+esc(m.message||'')+'</span></div>';}).join('');
    try{box.scrollTop=box.scrollHeight;}catch(e){}
  }

  function renderRequests(rows){
    ensureStyle();
    var room=document.querySelector('.ktg13-room');if(!room)return;
    var tray=document.getElementById('ktg13RequestTray');
    if(!tray){tray=document.createElement('div');tray.id='ktg13RequestTray';room.appendChild(tray);}
    rows=rows||[];
    tray.innerHTML=rows.slice(0,4).map(function(r){
      return '<div class="ktg13-req"><b>🙋 '+esc(r.guest_name||'게스트')+' 참여 요청</b>'
        +'<button type="button" data-accept="'+esc(r.id)+'">승인</button>'
        +'<button type="button" data-reject="'+esc(r.id)+'">거절</button></div>';
    }).join('');
    tray.querySelectorAll('[data-accept]').forEach(function(btn){btn.onclick=function(){acceptRequest(btn.getAttribute('data-accept'),btn.closest('.ktg13-req'));};});
    tray.querySelectorAll('[data-reject]').forEach(function(btn){btn.onclick=function(){rejectRequest(btn.getAttribute('data-reject'));};});
    var sig=rows.map(function(r){return r.id;}).join('|');
    if(sig&&sig!==lastRequestSig){
      lastRequestSig=sig;
      try{if(window.ktSpeak)window.ktSpeak('새 참여 요청이 있습니다.');}catch(e){}
    }
  }

  async function acceptRequest(id,rowEl){
    try{
      await bridge({action:'update_request',host_id:await resolveHostId(),id:id,status:'accepted'});
      if(rowEl){var name=(rowEl.querySelector('b')||{}).textContent||'게스트';var slot=[].slice.call(document.querySelectorAll('.ktg13-guest')).find(function(x){return !x.dataset.rtUsed;});if(slot){slot.dataset.rtUsed='1';slot.innerHTML='<span>'+esc(name.replace(/^🙋\s*/,'').replace(/\s*참여 요청$/,''))+'<br>승인됨</span>';}}
      pollOnce();
    }catch(e){}
  }
  async function rejectRequest(id){
    try{await bridge({action:'update_request',host_id:await resolveHostId(),id:id,status:'rejected'});pollOnce();}catch(e){}
  }

  async function postHostChat(text){
    var host=await resolveHostId();if(!host||!text)return;
    await bridge({action:'send_message',host_id:host,sender_id:deviceId(),sender_name:displayName(),message:String(text).slice(0,300)});
  }

  function installSendOverride(){
    if(window.__ktGroup13RealtimeSendOverride)return;
    if(typeof window.ktGroup13SendChat!=='function')return;
    window.__ktGroup13RealtimeSendOverride=true;
    window.ktGroup13SendChat=async function(){
      var input=document.getElementById('ktg13ChatInput');if(!input)return;
      var text=String(input.value||'').trim();if(!text)return;
      input.value='';
      try{await postHostChat(text);}catch(e){}
      try{if(window.closeSheet)window.closeSheet();}catch(e){}
      setTimeout(pollOnce,60);
    };
  }

  async function heartbeat(host){
    if(!host||!isHostRoomVisible())return;
    try{await bridge({action:'heartbeat',host_id:host});}catch(e){}
  }

  async function pollOnce(){
    if(polling||!isHostRoomVisible())return;
    polling=true;
    try{
      installSendOverride();
      var host=await resolveHostId();
      if(!host)return;
      var pair=await Promise.all([
        bridge({action:'messages',host_id:host}),
        bridge({action:'requests',host_id:host})
      ]);
      renderMessages(pair[0]||[]);
      renderRequests(pair[1]||[]);
      if(!window.__ktG13LastHeartbeat||Date.now()-window.__ktG13LastHeartbeat>8000){window.__ktG13LastHeartbeat=Date.now();heartbeat(host);}
    }catch(e){}finally{polling=false;}
  }

  function start(){
    if(timer)return;
    timer=setInterval(function(){if(isHostRoomVisible())pollOnce();},900);
    setTimeout(pollOnce,200);
  }
  start();

  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){roomHostId='';setTimeout(pollOnce,100);}});
  window.addEventListener('pageshow',function(){roomHostId='';setTimeout(pollOnce,100);});
})();
