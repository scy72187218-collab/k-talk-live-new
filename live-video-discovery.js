/* K-Talk: 동영상 시청 중 현재 방송자를 작게 표시. 기존 화면/방송 UI는 건드리지 않음. */
(function(){
  if(window.__ktLiveVideoDiscoveryInstalled)return;
  window.__ktLiveVideoDiscoveryInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFjZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var STALE_MS=50000;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function js(v){return String(v==null?'':v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r?\n/g,' ');}
  function me(){
    var name='K-Talk',id='';
    try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    if(!id){
      try{id=localStorage.getItem('ktalk_device_user_id')||'';}catch(e){}
      if(!id){id='device_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);try{localStorage.setItem('ktalk_device_user_id',id);}catch(e){}}
    }
    return {id:String(id).slice(0,80),name:String(name||'K-Talk').slice(0,80)};
  }
  function apiHeaders(extra){
    var m=me();
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'x-ktalk-user-id':m.id};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  async function activeRooms(){
    var cut=new Date(Date.now()-STALE_MS).toISOString();
    try{
      var r=await fetch(BASE+'ktalk_live_rooms?select=host_id,host_name,title,room_name,host_photo,updated_at&active=eq.true&updated_at=gte.'+enc(cut)+'&order=started_at.desc&limit=5',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(!r.ok)return [];
      var rows=await r.json();return Array.isArray(rows)?rows:[];
    }catch(e){return [];}
  }

  async function followState(hostId){
    var m=me();
    if(!hostId||hostId===m.id)return {following:false,notify:false};
    try{
      var q='ktalk_user_follows?select=notify_live&follower_id=eq.'+enc(m.id)+'&following_id=eq.'+enc(hostId)+'&limit=1';
      var r=await fetch(BASE+q,{headers:apiHeaders()});
      if(!r.ok)return {following:false,notify:false};
      var rows=await r.json();
      return rows&&rows[0]?{following:true,notify:!!rows[0].notify_live}:{following:false,notify:false};
    }catch(e){return {following:false,notify:false};}
  }

  async function saveFollow(hostId,hostName,notify){
    var m=me();
    if(!hostId||hostId===m.id)return false;
    try{
      var r=await fetch(BASE+'ktalk_user_follows?on_conflict=follower_id,following_id',{
        method:'POST',
        headers:apiHeaders({'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'}),
        body:JSON.stringify({follower_id:m.id,follower_name:m.name,following_id:String(hostId).slice(0,80),following_name:String(hostName||'K-Talk 방송자').slice(0,80),notify_live:!!notify,updated_at:new Date().toISOString()})
      });
      return r.ok;
    }catch(e){return false;}
  }

  async function removeFollow(hostId){
    var m=me();
    try{
      var r=await fetch(BASE+'ktalk_user_follows?follower_id=eq.'+enc(m.id)+'&following_id=eq.'+enc(hostId),{method:'DELETE',headers:apiHeaders({'Prefer':'return=minimal'})});
      return r.ok;
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktLiveVideoDiscoveryStyle'))return;
    var s=document.createElement('style');s.id='ktLiveVideoDiscoveryStyle';
    s.textContent=''
      +'@keyframes ktVideoLivePulse{0%,45%{opacity:1}55%,100%{opacity:.45}}'
      +'.kt-video-live-peek{position:absolute!important;left:10px!important;top:56px!important;z-index:18!important;max-width:min(94vw,330px)!important;height:48px!important;padding:5px!important;border:1px solid rgba(255,64,103,.75)!important;border-radius:999px!important;background:rgba(8,8,12,.78)!important;color:#fff!important;display:flex!important;align-items:center!important;gap:5px!important;box-shadow:0 0 14px rgba(255,35,82,.3)!important;backdrop-filter:blur(5px)!important;touch-action:manipulation!important}'
      +'.kt-video-live-peek button{border:0!important;color:#fff!important;touch-action:manipulation!important}'
      +'.kt-video-live-peek .ktvl-person{min-width:0!important;flex:1 1 auto!important;height:38px!important;padding:0!important;background:transparent!important;display:flex!important;align-items:center!important;gap:7px!important;text-align:left!important}'
      +'.kt-video-live-peek .ktvl-avatar{width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#70214e,#193d79)!important;font-size:19px!important;border:2px solid #ff315f!important}'
      +'.kt-video-live-peek .ktvl-avatar img{width:100%!important;height:100%!important;object-fit:cover!important}'
      +'.kt-video-live-peek .ktvl-copy{min-width:0!important;text-align:left!important;line-height:1.15!important}.kt-video-live-peek .ktvl-copy b{display:block!important;color:#fff!important;font-size:11px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.kt-video-live-peek .ktvl-copy small{display:block!important;margin-top:3px!important;color:#ddd!important;font-size:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.kt-video-live-peek .ktvl-follow{width:28px!important;height:28px!important;flex:0 0 28px!important;border-radius:50%!important;background:#e91845!important;font-size:18px!important;font-weight:950!important;line-height:1!important}'
      +'.kt-video-live-peek .ktvl-follow.on{background:#4a4a52!important;font-size:13px!important}'
      +'.kt-video-live-peek .ktvl-bell{width:28px!important;height:28px!important;flex:0 0 28px!important;border-radius:50%!important;background:#23232b!important;font-size:14px!important}.kt-video-live-peek .ktvl-bell.on{background:#ff9f1a!important}'
      +'.kt-video-live-peek .ktvl-live{flex:0 0 auto!important;color:#fff!important;background:#e91845!important;border-radius:999px!important;padding:5px 7px!important;font-size:8px!important;font-weight:950!important;animation:ktVideoLivePulse .9s linear infinite!important}'
      +'.kt-live-host-actions{padding:4px 0 8px!important}.kt-live-host-actions .head{display:flex;align-items:center;gap:11px;padding:8px 2px 14px}.kt-live-host-actions .avatar{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#70214e,#193d79);font-size:26px;border:2px solid #ff315f;overflow:hidden}.kt-live-host-actions .avatar img{width:100%;height:100%;object-fit:cover}.kt-live-host-actions .name{font-size:18px;font-weight:950}.kt-live-host-actions .buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.kt-live-host-actions .buttons button{min-height:54px;border:1px solid rgba(255,255,255,.15);border-radius:14px;background:#17171d;color:#fff;font-weight:900}.kt-live-host-actions .buttons button.follow{background:#e91845}.kt-live-host-actions .buttons button.on{background:#ff9f1a;color:#111}'
      +'@media(max-width:390px){.kt-video-live-peek{max-width:96vw!important;height:44px!important;top:52px!important}.kt-video-live-peek .ktvl-person{height:34px!important}.kt-video-live-peek .ktvl-avatar{width:32px!important;height:32px!important;flex-basis:32px!important}.kt-video-live-peek .ktvl-copy small{display:none!important}.kt-video-live-peek .ktvl-follow,.kt-video-live-peek .ktvl-bell{width:26px!important;height:26px!important;flex-basis:26px!important}}';
    document.head.appendChild(s);
  }

  window.ktOpenLiveHostActions=async function(hostId,hostName,hostPhoto){
    if(!hostId)return;
    var m=me();
    if(hostId===m.id){if(window.openProfile)window.openProfile();return;}
    var st=await followState(hostId);
    var photo=(hostPhoto&&(/^data:image/.test(hostPhoto)||/^https?:/.test(hostPhoto)))?'<img src="'+esc(hostPhoto)+'" alt="">':'🎥';
    var html='<div class="kt-live-host-actions">'
      +'<div class="head"><div class="avatar">'+photo+'</div><div><div class="name">'+esc(hostName||'K-Talk 방송자')+'</div><small>방송자 프로필</small></div></div>'
      +'<div class="buttons">'
      +'<button id="ktLiveHostFollowBtn" class="follow'+(st.following?' on':'')+'" onclick="ktToggleLiveHostFollow(\''+js(hostId)+'\',\''+js(hostName)+'\',this)">'+(st.following?'✓ 팔로잉':'+ 팔로우')+'</button>'
      +'<button onclick="ktOpenLiveHostMessage(\''+js(hostId)+'\',\''+js(hostName)+'\')">✉ 쪽지</button>'
      +'<button id="ktLiveHostAlertBtn" class="'+(st.notify?'on':'')+'" onclick="ktToggleLiveHostAlert(\''+js(hostId)+'\',\''+js(hostName)+'\',this)">🔔 '+(st.notify?'알림 ON':'방송 알림')+'</button>'
      +'</div></div>';
    if(window.showSheet)showSheet('방송자',html);
  };

  window.ktToggleLiveHostFollow=async function(hostId,hostName,btn){
    var st=await followState(hostId),ok=false;
    if(st.following)ok=await removeFollow(hostId);else ok=await saveFollow(hostId,hostName,false);
    if(!ok){alert('팔로우를 처리하지 못했습니다. 다시 눌러 주세요.');return;}
    var now=!st.following;
    if(btn){btn.classList.toggle('on',now);btn.textContent=now?'✓ 팔로잉':'+ 팔로우';}
    document.querySelectorAll('.ktvl-follow[data-host="'+CSS.escape(String(hostId))+'"]').forEach(function(b){b.classList.toggle('on',now);b.textContent=now?'✓':'+';});
  };

  window.ktToggleLiveHostAlert=async function(hostId,hostName,btn){
    var st=await followState(hostId);
    var next=!st.notify;
    var ok=await saveFollow(hostId,hostName,next);
    if(!ok){alert('방송 알림을 처리하지 못했습니다. 다시 눌러 주세요.');return;}
    if(btn){btn.classList.toggle('on',next);btn.textContent='🔔 '+(next?'알림 ON':'방송 알림');}
    document.querySelectorAll('.ktvl-bell[data-host="'+CSS.escape(String(hostId))+'"]').forEach(function(b){b.classList.toggle('on',next);b.textContent=next?'🔔':'🔔';});
    document.querySelectorAll('.ktvl-follow[data-host="'+CSS.escape(String(hostId))+'"]').forEach(function(b){b.classList.add('on');b.textContent='✓';});
  };

  window.ktOpenLiveHostMessage=function(hostId,hostName){
    var html='<div class="rowbox"><b>'+esc(hostName||'K-Talk 방송자')+'님에게 쪽지</b><br>보낼 내용을 입력하세요.</div>'
      +'<textarea id="ktLiveHostMessageText" maxlength="500" placeholder="쪽지 입력" style="width:100%;min-height:120px;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:#15151a;color:#fff;font-size:15px;resize:none"></textarea>'
      +'<button class="act" onclick="ktSendLiveHostMessage(\''+js(hostId)+'\',\''+js(hostName)+'\')">쪽지 보내기</button>';
    if(window.showSheet)showSheet('✉ 쪽지',html);
    setTimeout(function(){var t=document.getElementById('ktLiveHostMessageText');if(t)t.focus();},60);
  };

  window.ktSendLiveHostMessage=async function(hostId,hostName){
    var t=document.getElementById('ktLiveHostMessageText');
    var body=t?String(t.value||'').trim():'';
    if(!body)return;
    var m=me();
    try{
      var r=await fetch(BASE+'ktalk_direct_messages',{
        method:'POST',
        headers:apiHeaders({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({sender_id:m.id,sender_name:m.name,recipient_id:String(hostId).slice(0,80),recipient_name:String(hostName||'K-Talk 방송자').slice(0,80),body:body.slice(0,500)})
      });
      if(!r.ok)throw new Error('send');
      alert('쪽지를 보냈습니다.');
      if(window.closeSheet)closeSheet();
    }catch(e){alert('쪽지를 보내지 못했습니다. 다시 눌러 주세요.');}
  };

  async function paintSocialState(hostId){
    var st=await followState(hostId);
    document.querySelectorAll('.ktvl-follow[data-host="'+CSS.escape(String(hostId))+'"]').forEach(function(b){b.classList.toggle('on',st.following);b.textContent=st.following?'✓':'+';b.title=st.following?'팔로잉':'팔로우';});
    document.querySelectorAll('.ktvl-bell[data-host="'+CSS.escape(String(hostId))+'"]').forEach(function(b){b.classList.toggle('on',st.notify);b.title=st.notify?'방송 알림 켜짐':'방송 알림 켜기';});
  }

  async function render(){
    ensureStyle();
    var old=document.getElementById('ktVideoLivePeek');if(old)old.remove();
    if(document.documentElement.classList.contains('kt-remote-viewing'))return;
    var host=document.querySelector('.video-home')||document.querySelector('#screen .media');
    if(!host)return;
    var rooms=await activeRooms();if(!rooms.length)return;
    var r=rooms[0];
    var hostId=String(r.host_id||''),hostName=String(r.host_name||'K-Talk 방송자'),hostPhoto=String(r.host_photo||'');
    var photo=(hostPhoto&&(/^data:image/.test(hostPhoto)||/^https?:/.test(hostPhoto)))?'<img src="'+esc(hostPhoto)+'" alt="">':'🎥';
    var b=document.createElement('div');
    b.id='ktVideoLivePeek';b.className='kt-video-live-peek';
    b.innerHTML='<button type="button" class="ktvl-person" aria-label="방송자 프로필"><span class="ktvl-avatar">'+photo+'</span><span class="ktvl-copy"><b>'+esc(hostName)+'</b><small>'+esc(r.title||r.room_name||'방송 중')+'</small></span></button>'
      +'<button type="button" class="ktvl-follow" data-host="'+esc(hostId)+'" title="팔로우">+</button>'
      +'<button type="button" class="ktvl-bell" data-host="'+esc(hostId)+'" title="방송 알림 켜기">🔔</button>'
      +'<button type="button" class="ktvl-live">● LIVE</button>';
    var person=b.querySelector('.ktvl-person');
    var follow=b.querySelector('.ktvl-follow');
    var bell=b.querySelector('.ktvl-bell');
    var live=b.querySelector('.ktvl-live');
    if(person)person.onclick=function(e){e.stopPropagation();window.ktOpenLiveHostActions(hostId,hostName,hostPhoto);};
    if(follow)follow.onclick=function(e){e.stopPropagation();window.ktToggleLiveHostFollow(hostId,hostName,this);};
    if(bell)bell.onclick=function(e){e.stopPropagation();window.ktToggleLiveHostAlert(hostId,hostName,this);};
    if(live)live.onclick=function(e){e.stopPropagation();if(window.ktEnterRemoteLive)window.ktEnterRemoteLive(hostId);};
    host.appendChild(b);
    paintSocialState(hostId);
  }

  window.ktRefreshVideoLivePeek=render;
  var mo=new MutationObserver(function(){setTimeout(render,80);});
  var screen=document.getElementById('screen');if(screen)mo.observe(screen,{childList:true,subtree:false});
  setInterval(render,5000);
  setTimeout(render,1000);
})();