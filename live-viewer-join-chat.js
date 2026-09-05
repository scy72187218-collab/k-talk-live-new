/* K-Talk LIVE: persistent host chat/join panel + viewer/guest nickname notices. */
(function(){
  if(window.__ktLiveViewerJoinChatLoaded)return;
  window.__ktLiveViewerJoinChatLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var viewerHostId='';
  var viewerBeat=null;
  var hostSeen={};
  var guestSeen={};
  var hostPollBusy=false;
  var resolvedHostId='';
  var resolvedAt=0;

  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
  function viewerId(){
    var id='';try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}
    if(!id){id='viewer_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('ktalk_viewer_id',id);}catch(e){}}
    return id;
  }
  function viewerName(){
    var name='';
    try{name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||'';}catch(e){}
    try{
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub&&window.ktSubAccountInfo){var si=ktSubAccountInfo(sub);if(si&&si.name)name=si.name;}
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
    }catch(e){}
    if(!name||name==='K-Talk')name='게스트 '+viewerId().slice(-4);
    return String(name).slice(0,80);
  }
  function localHostId(){
    var id='guest';
    try{id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return String(id).slice(0,80);
  }
  function localHostName(){
    var name='';
    try{name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||'';}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;}catch(e){}
    return String(name||'').slice(0,80);
  }

  async function markViewer(active){
    if(!viewerHostId)return;
    var body={host_id:String(viewerHostId),viewer_id:viewerId(),viewer_name:viewerName(),active:!!active,updated_at:new Date().toISOString()};
    if(active)body.created_at=new Date().toISOString();
    try{
      if(active){
        await fetch(SB+'/rest/v1/ktalk_live_viewers?on_conflict=host_id,viewer_id',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(body)});
        clearInterval(viewerBeat);viewerBeat=setInterval(function(){
          fetch(SB+'/rest/v1/ktalk_live_viewers?host_id=eq.'+encodeURIComponent(viewerHostId)+'&viewer_id=eq.'+encodeURIComponent(viewerId()),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({viewer_name:viewerName(),active:true,updated_at:new Date().toISOString()})}).catch(function(){});
        },20000);
      }else{
        clearInterval(viewerBeat);viewerBeat=null;
        await fetch(SB+'/rest/v1/ktalk_live_viewers?host_id=eq.'+encodeURIComponent(viewerHostId)+'&viewer_id=eq.'+encodeURIComponent(viewerId()),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,updated_at:new Date().toISOString()})});
      }
    }catch(e){}
  }

  function ensureChat(){
    var live=document.getElementById('ktSept2Live');if(!live)return null;
    var box=document.getElementById('ktLiveJoinChat');if(box)return box;
    box=document.createElement('div');box.id='ktLiveJoinChat';
    box.style.cssText='position:absolute;left:9px;bottom:187px;z-index:46;width:min(58vw,250px);height:106px;padding:7px 8px 7px;border:1px solid rgba(255,255,255,.18);border-radius:13px;background:rgba(0,0,0,.46);backdrop-filter:blur(5px);overflow:hidden;display:flex;flex-direction:column;pointer-events:none;font-family:inherit;box-shadow:0 4px 16px #0008';
    box.innerHTML='<div style="flex:0 0 auto;display:flex;align-items:center;gap:5px;color:#fff;font-size:10px;font-weight:950;margin-bottom:4px"><span style="color:#ff5f9f">💬</span><b>채팅</b><small style="margin-left:auto;color:#aaa;font-size:8px">입장 · 게스트 알림</small></div><div id="ktLiveJoinChatList" style="min-height:0;flex:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:3px"><div id="ktLiveChatEmpty" style="color:#cfcfd7;font-size:9px;line-height:1.35;opacity:.85">들어오는 사람의 닉네임이 여기에 표시됩니다.</div></div>';
    live.appendChild(box);return box;
  }
  function addMessage(name,text,color){
    var box=ensureChat();if(!box)return;
    var list=document.getElementById('ktLiveJoinChatList');if(!list)return;
    var empty=document.getElementById('ktLiveChatEmpty');if(empty)empty.remove();
    var d=document.createElement('div');d.className='kt-live-join-msg';
    d.style.cssText='padding:4px 6px;border-radius:8px;background:rgba(12,12,18,.72);color:#fff;font-size:9.5px;font-weight:800;line-height:1.25;text-shadow:0 1px 2px #000;white-space:normal;overflow:hidden';
    d.innerHTML='<b style="color:'+(color||'#ff78b6')+'">'+esc(name)+'</b>님 '+esc(text||'이 들어왔습니다.');
    list.appendChild(d);
    while(list.children.length>5)list.removeChild(list.firstChild);
  }
  function greet(name){
    addMessage(name,'이 들어왔습니다.','#ff78b6');
    try{
      if(window.ktAnnounceEvent)ktAnnounceEvent('join',{name:name});
      else if(window.ktSpeak)ktSpeak(name+'님, K-Talk에 오신 것을 환영합니다.');
    }catch(e){}
  }

  async function resolveHostId(){
    var now=Date.now();
    if(resolvedHostId&&now-resolvedAt<5000)return resolvedHostId;
    var fallback=localHostId();
    try{
      var since=new Date(now-240000).toISOString();
      var url=SB+'/rest/v1/ktalk_live_rooms?select=host_id,host_name,room_name,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=10';
      var r=await fetch(url,{headers:headers()});
      if(r.ok){
        var rows=await r.json();
        if(rows&&rows.length){
          var hn=localHostName();
          var match=hn&&rows.find(function(x){return String(x.host_name||'')===hn;});
          resolvedHostId=String((match||rows[0]).host_id||fallback);
          resolvedAt=now;
          return resolvedHostId;
        }
      }
    }catch(e){}
    resolvedHostId=fallback;resolvedAt=now;return resolvedHostId;
  }

  async function scanViewerJoins(hid){
    var since=new Date(Date.now()-180000).toISOString();
    var u=SB+'/rest/v1/ktalk_live_viewers?select=id,viewer_id,viewer_name,active,created_at,updated_at&host_id=eq.'+encodeURIComponent(hid)+'&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=created_at.asc&limit=40';
    var r=await fetch(u,{headers:headers()});
    if(!r.ok)return;
    var rows=await r.json();
    rows.forEach(function(x){
      var k=String(x.id||x.viewer_id||'');
      if(!k||hostSeen[k])return;
      hostSeen[k]=1;
      greet(String(x.viewer_name||'게스트'));
    });
  }
  async function scanGuestSessions(hid){
    var since=new Date(Date.now()-180000).toISOString();
    var u=SB+'/rest/v1/ktalk_guest_sessions?select=id,guest_name,status,active,created_at,updated_at&host_id=eq.'+encodeURIComponent(hid)+'&created_at=gte.'+encodeURIComponent(since)+'&order=created_at.asc&limit=30';
    var r=await fetch(u,{headers:headers()});
    if(!r.ok)return;
    var rows=await r.json();
    rows.forEach(function(x){
      var id=String(x.id||'');if(!id)return;
      var stateKey=id+':'+String(x.status||'');
      if(guestSeen[stateKey])return;
      guestSeen[stateKey]=1;
      if(x.status==='requested')addMessage(String(x.guest_name||'게스트'),'이 게스트 참여를 요청했습니다.','#7fd7ff');
      else if(x.status==='accepted')addMessage(String(x.guest_name||'게스트'),'이 게스트로 올라왔습니다.','#ffe36d');
    });
  }
  async function scanHost(){
    if(hostPollBusy||!document.getElementById('ktSept2Live'))return;
    hostPollBusy=true;
    try{
      ensureChat();
      var hid=await resolveHostId();
      await Promise.all([scanViewerJoins(hid),scanGuestSessions(hid)]);
    }catch(e){}
    hostPollBusy=false;
  }

  function wrapJoin(){
    var old=window.ktJoinLive;if(typeof old!=='function'||old.__ktJoinNoticeWrapped)return;
    var wrapped=async function(hostIdArg,title,roomName){
      viewerHostId=String(hostIdArg||'guest');
      var out=await old.apply(this,arguments);
      setTimeout(function(){markViewer(true);},250);
      return out;
    };
    wrapped.__ktJoinNoticeWrapped=true;wrapped.__ktOriginal=old;window.ktJoinLive=wrapped;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;if(typeof old!=='function'||old.__ktJoinNoticeLeaveWrapped)return;
    var wrapped=async function(){await markViewer(false);var out=old.apply(this,arguments);viewerHostId='';return out;};
    wrapped.__ktJoinNoticeLeaveWrapped=true;wrapped.__ktOriginal=old;window.ktLeaveRemoteLive=wrapped;
  }
  function sync(){wrapJoin();wrapLeave();if(document.getElementById('ktSept2Live')){ensureChat();scanHost();}}
  try{new MutationObserver(function(){setTimeout(sync,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(sync,200);setInterval(sync,700);
  window.addEventListener('pagehide',function(){markViewer(false);});
})();
