/* K-Talk LIVE: shared host/viewer chat input + host join/guest notices. */
(function(){
  if(window.__ktLiveRoomChatLoaded)return;
  window.__ktLiveRoomChatLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var currentViewerHostId='';
  var pollBusy=false;
  var presenceSeen={};
  var guestSeen={};
  var notices=[];
  var lastSendAt=0;

  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function viewerId(){var id='';try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}if(!id){id='viewer_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('ktalk_viewer_id',id);}catch(e){}}return id;}
  function me(){
    var id=viewerId(),name='게스트 '+id.slice(-4);
    try{name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||name;}catch(e){}
    try{
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub&&window.ktSubAccountInfo){var si=ktSubAccountInfo(sub);if(si&&si.name)name=si.name;}
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    if(!name||name==='K-Talk')name='게스트 '+viewerId().slice(-4);
    return {id:String(id).slice(0,80),name:String(name).slice(0,80)};
  }
  function hostId(){
    if(currentViewerHostId)return String(currentViewerHostId);
    var id='guest';
    try{id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return String(id).slice(0,80);
  }
  function isHost(){return !!document.getElementById('ktSept2Live');}
  function isViewer(){return !!document.getElementById('ktRemoteLive');}

  function addNotice(text,kind){
    notices.push({text:String(text||''),kind:kind||'system',at:Date.now()});
    if(notices.length>12)notices.shift();
  }

  function installCss(){
    if(document.getElementById('ktRoomChatCss'))return;
    var s=document.createElement('style');s.id='ktRoomChatCss';
    s.textContent='\
#ktRoomChat{position:absolute;z-index:75;left:10px;width:min(58vw,300px);font-family:inherit;pointer-events:auto;}\
#ktRoomChatLog{max-height:142px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding:5px 3px;scrollbar-width:none;}\
#ktRoomChatLog::-webkit-scrollbar{display:none;}\
.kt-room-chat-line{padding:5px 8px;border-radius:10px;background:rgba(0,0,0,.58);color:#fff;font-size:11px;font-weight:750;line-height:1.3;text-shadow:0 1px 2px #000;word-break:break-word;}\
.kt-room-chat-line b{color:#ff8fca;margin-right:4px;}\
.kt-room-chat-line.system{background:rgba(31,22,40,.72);color:#ffe9f7;}\
.kt-room-chat-line.system b{color:#ffd45f;}\
#ktRoomChatForm{display:grid;grid-template-columns:1fr 52px;gap:6px;align-items:center;margin-top:5px;}\
#ktRoomChatInput{width:100%;height:38px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(0,0,0,.72);color:#fff;padding:0 13px;outline:none;font-family:inherit;font-size:12px;font-weight:800;box-shadow:0 3px 12px #0008;}\
#ktRoomChatInput::placeholder{color:#cfcbd3;}\
#ktRoomChatSend{height:38px;border:0;border-radius:999px;background:linear-gradient(135deg,#ff315f,#b04cff);color:#fff;font-family:inherit;font-size:12px;font-weight:950;box-shadow:0 3px 12px #0008;}\
@media(max-width:430px){#ktRoomChat{width:min(62vw,270px)}#ktRoomChatLog{max-height:118px}}';
    document.head.appendChild(s);
  }

  function chatParent(){
    var host=document.getElementById('ktSept2Live');if(host)return host;
    var remote=document.getElementById('ktRemoteLive');
    if(remote){var p=remote.closest('section')||remote.parentElement;if(p){if(getComputedStyle(p).position==='static')p.style.position='relative';return p;}}
    return null;
  }

  function ensureChat(){
    installCss();
    var parent=chatParent();if(!parent)return null;
    var box=document.getElementById('ktRoomChat');
    if(box&&box.parentElement!==parent){box.remove();box=null;}
    if(!box){
      box=document.createElement('div');box.id='ktRoomChat';
      box.innerHTML='<div id="ktRoomChatLog" aria-live="polite"></div><form id="ktRoomChatForm"><input id="ktRoomChatInput" maxlength="300" autocomplete="off" placeholder="채팅을 입력하세요"><button id="ktRoomChatSend" type="submit">전송</button></form>';
      parent.appendChild(box);
      box.querySelector('#ktRoomChatForm').addEventListener('submit',function(e){e.preventDefault();sendMessage();});
    }
    box.style.bottom=isHost()?'188px':'88px';
    return box;
  }

  async function inferCurrentHost(){
    if(currentViewerHostId||(!isHost()&&!isViewer()))return;
    try{
      var since=new Date(Date.now()-180000).toISOString();
      var r=await fetch(SB+'/rest/v1/ktalk_live_rooms?select=host_id&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=1',{headers:headers()});
      if(r.ok){var rows=await r.json();if(rows&&rows[0])currentViewerHostId=String(rows[0].host_id||'guest');}
    }catch(e){}
  }

  async function sendMessage(){
    var input=document.getElementById('ktRoomChatInput');if(!input)return;
    var text=String(input.value||'').trim();if(!text)return;
    if(Date.now()-lastSendAt<600)return;
    lastSendAt=Date.now();
    await inferCurrentHost();
    var h=hostId(),p=me();
    input.value='';
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_live_messages',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({host_id:h,sender_id:p.id,sender_name:p.name,message:text,message_type:'chat'})});
      if(!r.ok){input.value=text;}
      else pollAll();
    }catch(e){input.value=text;}
  }

  function render(rows){
    var log=document.getElementById('ktRoomChatLog');if(!log)return;
    var html='';
    notices.forEach(function(n){html+='<div class="kt-room-chat-line system"><b>알림</b>'+esc(n.text)+'</div>';});
    (rows||[]).forEach(function(x){html+='<div class="kt-room-chat-line"><b>'+esc(x.sender_name||'게스트')+'</b>'+esc(x.message||'')+'</div>';});
    log.innerHTML=html||'<div class="kt-room-chat-line system"><b>채팅</b>방송에 들어오면 여기에서 인사할 수 있습니다.</div>';
    log.scrollTop=log.scrollHeight;
  }

  async function pollMessages(){
    await inferCurrentHost();
    var h=hostId();if(!h)return [];
    try{
      var since=new Date(Date.now()-3600000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_messages?select=id,sender_name,message,message_type,created_at&host_id=eq.'+encodeURIComponent(h)+'&created_at=gte.'+encodeURIComponent(since)+'&order=created_at.desc&limit=35';
      var r=await fetch(u,{headers:headers()});if(!r.ok)return [];
      var rows=await r.json();return (rows||[]).reverse();
    }catch(e){return [];}
  }

  async function pollPresence(){
    if(!isHost())return;
    await inferCurrentHost();
    var h=hostId();
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_viewers?select=id,viewer_id,viewer_name,updated_at&host_id=eq.'+encodeURIComponent(h)+'&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.asc&limit=30';
      var r=await fetch(u,{headers:headers()});if(!r.ok)return;
      var rows=await r.json();(rows||[]).forEach(function(x){var k=String(x.id||x.viewer_id||'');if(!k||presenceSeen[k])return;presenceSeen[k]=1;addNotice((x.viewer_name||'게스트')+'님이 들어왔습니다.','join');});
    }catch(e){}
  }

  async function pollGuestSessions(){
    if(!isHost())return;
    await inferCurrentHost();
    var h=hostId();
    try{
      var since=new Date(Date.now()-180000).toISOString();
      var u=SB+'/rest/v1/ktalk_guest_sessions?select=id,guest_name,status,updated_at&host_id=eq.'+encodeURIComponent(h)+'&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.asc&limit=30';
      var r=await fetch(u,{headers:headers()});if(!r.ok)return;
      var rows=await r.json();(rows||[]).forEach(function(x){var key=String(x.id||'')+':'+String(x.status||'');if(!x.id||guestSeen[key])return;guestSeen[key]=1;if(x.status==='requested')addNotice((x.guest_name||'게스트')+'님이 게스트 참여를 요청했습니다.','guest');else if(x.status==='accepted')addNotice((x.guest_name||'게스트')+'님이 게스트로 올라왔습니다.','guest');});
    }catch(e){}
  }

  async function pollAll(){
    if(pollBusy||(!isHost()&&!isViewer()))return;
    pollBusy=true;ensureChat();
    try{await inferCurrentHost();await Promise.all([pollPresence(),pollGuestSessions()]);var rows=await pollMessages();render(rows);}catch(e){}
    pollBusy=false;
  }

  function wrapJoin(){
    var old=window.ktJoinLive;if(typeof old!=='function'||old.__ktRoomChatWrapped)return;
    var wrapped=async function(hostIdArg){currentViewerHostId=String(hostIdArg||'guest');var out=await old.apply(this,arguments);setTimeout(function(){ensureChat();pollAll();},250);return out;};
    wrapped.__ktRoomChatWrapped=true;wrapped.__ktOriginal=old;window.ktJoinLive=wrapped;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;if(typeof old!=='function'||old.__ktRoomChatLeaveWrapped)return;
    var wrapped=function(){var out=old.apply(this,arguments);currentViewerHostId='';return out;};
    wrapped.__ktRoomChatLeaveWrapped=true;wrapped.__ktOriginal=old;window.ktLeaveRemoteLive=wrapped;
  }
  function sync(){wrapJoin();wrapLeave();if(isHost()||isViewer()){ensureChat();pollAll();}}

  try{new MutationObserver(function(){setTimeout(sync,40);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(sync,300);setInterval(sync,900);
})();