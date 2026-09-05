/* K-Talk LIVE: show viewer joins in the host chat area and greet by nickname with AI voice. */
(function(){
  if(window.__ktLiveViewerJoinChatLoaded)return;
  window.__ktLiveViewerJoinChatLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var viewerHostId='';
  var viewerBeat=null;
  var hostSeen={};
  var hostPollBusy=false;

  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
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
  function hostId(){
    var id='guest';
    try{id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return String(id).slice(0,80);
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
    box.style.cssText='position:absolute;left:9px;bottom:188px;z-index:26;width:min(56vw,240px);max-height:112px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;pointer-events:none;font-family:inherit';
    live.appendChild(box);return box;
  }
  function addJoinMessage(name){
    var box=ensureChat();if(!box)return;
    var d=document.createElement('div');d.className='kt-live-join-msg';
    d.style.cssText='padding:6px 9px;border-radius:10px;background:rgba(0,0,0,.62);color:#fff;font-size:11px;font-weight:800;line-height:1.3;text-shadow:0 1px 2px #000';
    d.innerHTML='<span style="color:#ff78b6">● LIVE</span> <b>'+esc(name)+'</b>님이 들어왔습니다.';
    box.appendChild(d);
    while(box.children.length>4)box.removeChild(box.firstChild);
    setTimeout(function(){try{d.style.opacity='0';d.style.transition='opacity .45s';setTimeout(function(){if(d.parentNode)d.remove();},500);}catch(e){}},8000);
  }
  function greet(name){
    addJoinMessage(name);
    try{
      if(window.ktAnnounceEvent)ktAnnounceEvent('join',{name:name});
      else if(window.ktSpeak)ktSpeak(name+'님, K-Talk에 오신 것을 환영합니다.');
    }catch(e){}
  }

  async function scanHost(){
    if(hostPollBusy||!document.getElementById('ktSept2Live'))return;
    hostPollBusy=true;
    try{
      var since=new Date(Date.now()-150000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_viewers?select=id,viewer_id,viewer_name,active,created_at,updated_at&host_id=eq.'+encodeURIComponent(hostId())+'&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=created_at.asc&limit=30';
      var r=await fetch(u,{headers:headers()});
      if(r.ok){
        var rows=await r.json();
        rows.forEach(function(x){
          var k=String(x.id||x.viewer_id||'');
          if(!k||hostSeen[k])return;
          hostSeen[k]=1;
          greet(String(x.viewer_name||'게스트'));
        });
      }
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
  setTimeout(sync,250);setInterval(sync,900);
  window.addEventListener('pagehide',function(){markViewer(false);});
})();
