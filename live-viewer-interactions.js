/* K-Talk 원격 시청 상호작용: 채팅·출석체크·좋아요·선물·공유를 호스트와 실시간 연결. */
(function(){
  if(window.__ktLiveViewerInteractionInstalled)return;
  window.__ktLiveViewerInteractionInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var MEM_INTERACT='/api/live-interaction-memory';
  var MEM_BEACON='/api/live-beacon-memory';
  var remote={hostId:'',viewerId:'',viewerName:'',roomStart:'',timer:null,lastLikeAt:0};
  var hostTimer=null,hostRoomStart='',attendancePending=false;
  var lastHostLikeBySender={};
  var giftVisitSince20261014=Date.now();
  var attendanceContexts={},attendanceSendQueue=Promise.resolve();
  var guestClockStarts={};
  function epoch(v){var n=typeof v==='number'?v:Date.parse(v||'');return Number.isFinite(n)&&n>0?n:0;}
  function clockText(start,now){var sec=Math.max(0,Math.floor((now-start)/1000));return [Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(function(n){return String(n).padStart(2,'0');}).join(':');}
  window.ktGuestBroadcastClockText5062=function(){var root=document.querySelector('#screen .kt-remote-live');if(!root)return null;var id=String(root.getAttribute('data-kt-host-id')||remote.hostId||'');var start=guestClockStarts[id]||0;return start?clockText(start,Date.now()):null;};
  window.addEventListener('kt-host-session-ready',function(e){var d=e.detail||{},start=epoch(d.started_at);if(d.role!=='host'&&d.host_id&&start)guestClockStarts[String(d.host_id)]=start;});
  setInterval(function(){var text=window.ktGuestBroadcastClockText5062(),root=document.querySelector('#screen .kt-remote-live');if(!root||!text)return;root.querySelectorAll('#ktLiveClock,[data-solo-viewer-clock],.ktg9-copy-clock,.kt-sgfh-clock,.ktg13-air small>span:not(.kt-clock-like-20260927):not(.kt-live-clock-heart)').forEach(function(el){if(el.textContent!==text)el.textContent=text;});},500);
  var hostChatStableBuffer=[];

  var completedGiftChats20261015=Object.create(null);
  try{completedGiftChats20261015=JSON.parse(localStorage.getItem('kt_gift_chat_completed:'+deviceId())||'{}')||{};}catch(e){}
  function giftChatKey20261015(text){
    return String(text||'').replace(/님이|님께서|님/g,'').replace(/선물했습니다|선물하셨습니다|선물을\s*보냈습니다|선물/g,'').replace(/개를/g,'개').replace(/[^가-힣a-zA-Z0-9]/g,'').toLowerCase();
  }
  function completedGiftChat20261015(message,createdAt){
    var key=giftChatKey20261015(message),done=completedGiftChats20261015[key]||0,stamp=epoch(createdAt);
    return !!(done&&(!stamp||stamp<=done));
  }
  window.ktGiftChatIsCompleted20261015=completedGiftChat20261015;
  window.addEventListener('kt-gift-announcement-finished',function(e){
    var d=e&&e.detail||{},key=giftChatKey20261015(d.text);if(!key)return;
    completedGiftChats20261015[key]=Number(d.at||Date.now());
    try{var saved={},keys=Object.keys(completedGiftChats20261015).sort(function(a,b){return completedGiftChats20261015[b]-completedGiftChats20261015[a];}).slice(0,100);keys.forEach(function(k){saved[k]=completedGiftChats20261015[k];});completedGiftChats20261015=saved;localStorage.setItem('kt_gift_chat_completed:'+deviceId(),JSON.stringify(saved));}catch(e){}
    hostChatStableBuffer=hostChatStableBuffer.filter(function(m){return !completedGiftChat20261015(m.message,m.created_at);});
    document.querySelectorAll('#screen [class*="-chat-line"]').forEach(function(line){
      if(giftChatKey20261015(line.textContent)===key)line.remove();
    });
    var box=currentHostBox();window.__ktHostChatStableHtml=box&&box.el?box.el.innerHTML:'';
  });

  window.__ktHostChatStableHtml=window.__ktHostChatStableHtml||'';
  var chatGeneration20261015=0,hostChatRun20261015='',hostChatFloor20261015=0;
  function clearHostChat20261015(){
    chatGeneration20261015++;hostChatStableBuffer=[];window.__ktHostChatStableHtml='';
    document.querySelectorAll('#screen .ktg13-chat,#screen #ktsoloChatList,#screen #ktsubscriberChatList,#screen #ktsecretChatList,#screen #ktg13ChatList').forEach(function(el){el.innerHTML='';});
  }
  function chatCut20261015(serverStart,localStart){
    var cut=Math.max(epoch(serverStart),epoch(localStart));return cut?new Date(cut).toISOString():'';
  }
  window.addEventListener('kt-broadcast-ended',function(){hostChatRun20261015='';hostChatFloor20261015=0;hostRoomStart='';clearHostChat20261015();});
  window.addEventListener('kt-host-session-ready',function(e){
    var d=e&&e.detail||{},key=String(d.run_id||''),start=epoch(d.started_at);
    if(d.role==='host'&&key&&key!==hostChatRun20261015){
      hostChatRun20261015=key;hostChatFloor20261015=start||Date.now();
      hostRoomStart=new Date(hostChatFloor20261015).toISOString();
      giftVisitSince20261014=Date.now();clearHostChat20261015();
    }else if(d.role!=='host'&&remote.hostId===String(d.host_id||'')&&start){
      var next=chatCut20261015(remote.roomStart,start);
      if(next!==remote.roomStart){remote.roomStart=next;var box=document.getElementById('ktRemoteChatList');if(box)box.innerHTML='';}
    }
  });


  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){
    if(Number(window.__ktPrimaryLiveDbDownUntil||0)>Date.now())throw new Error('primary live db temporarily unavailable');
    opt=opt||{};
    var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
    var timer=ctrl?setTimeout(function(){ctrl.abort();},650):null;
    try{
      var next=Object.assign({},opt);next.headers=headers(next.headers);if(ctrl)next.signal=ctrl.signal;
      var r=await fetch(BASE+path,next);
      if(timer)clearTimeout(timer);
      if(!r.ok)throw new Error('live interaction api '+r.status);
      window.__ktPrimaryLiveDbDownUntil=0;
      if(r.status===204)return null;
      var t=await r.text();return t?JSON.parse(t):null;
    }catch(e){
      if(timer)clearTimeout(timer);
      window.__ktPrimaryLiveDbDownUntil=Date.now()+120000;
      throw e;
    }
  }
  async function memGet(url){
    var r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('live memory '+r.status);return r.json();
  }
  async function memPost(body){
    var r=await fetch(MEM_INTERACT+'?t='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!r.ok)throw new Error('live memory '+r.status);return r.json();
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}return id;}
  function profile(){var p={name:'K-Talk',photo:''};try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.nickname||x.name||x.displayName||p.name);p.photo=String(x.photo||'');}}catch(e){}try{var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.nickname||s.name||s.displayName||p.name);p.photo=String(s.photo||p.photo);}}catch(e){}try{p.name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}return p;}
  async function activeRoom(hostId){
    try{
      var rows=await req('ktalk_live_rooms?select=host_id,host_name,title,room_name,started_at,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      if(rows&&rows[0])return rows[0];
    }catch(e){}
    try{
      var j=await memGet(MEM_BEACON+'?t='+Date.now());
      var rows=Array.isArray(j&&j.rooms)?j.rooms:[];
      var x=rows.find(function(r){return String(r.host_id||'')===String(hostId);});
      return x?{host_id:x.host_id,host_name:x.host_name,title:x.title,room_name:x.room_name,started_at:x.run_started_at?new Date(Number(x.run_started_at)).toISOString():'',run_id:x.run_id||'',active:true,updated_at:x.updated_at}:null;
    }catch(e){return null;}
  }
  async function postMessage(hostId,senderId,senderName,message,type){
    if(!hostId||!message)return false;
    var payload={host_id:hostId,sender_id:senderId||'guest',sender_name:senderName||'게스트',message:String(message).slice(0,300),message_type:type||'chat'};
    var ok=false;

    /* Write to shared memory first so host chat appears immediately even when
       the host device is temporarily using the fallback channel. */
    try{
      await memPost({action:'message',host_id:payload.host_id,sender_id:payload.sender_id,sender_name:payload.sender_name,message:payload.message,message_type:payload.message_type});
      ok=true;
    }catch(e){}

    /* Also write to the primary DB. Host/guest devices may temporarily use
       different paths, so writing both keeps chat synchronized. */
    try{
      await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)});
      ok=true;
    }catch(e){}

    return ok;
  }

  var movieModeQueue=Promise.resolve();
  window.ktNotifyMovieTheaterMode=function(on){
    if(document.documentElement.classList.contains('kt-remote-viewing')||!document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room'))return Promise.resolve(false);
    var extra=typeof window.ktGetMovieCatalogMode==='function'?window.ktGetMovieCatalogMode():{};
    var host=deviceId(),message=JSON.stringify({on:!!on,run:String(window.__ktHostRunId20260924||''),film_id:on?String(extra.film_id||''):''});
    movieModeQueue=movieModeQueue.then(function(){return postMessage(host,host,'호스트',message,'movie_mode');}).catch(function(){return false;});
    return movieModeQueue;
  };
  async function refreshMovieMode(rows){
    var host=remote.hostId,start=remote.roomStart;
    var modes=(rows||[]).filter(function(m){return m.message_type==='movie_mode'&&String(m.sender_id)===host;});
    try{
      var path='ktalk_live_messages?select=sender_id,message,message_type,created_at&host_id=eq.'+enc(host)+'&sender_id=eq.'+enc(host)+'&message_type=eq.movie_mode';
      if(start)path+='&created_at=gte.'+enc(start);
      var latest=await req(path+'&order=created_at.desc&limit=1');
      if(Array.isArray(latest))modes=modes.concat(latest);
    }catch(e){}
    if(host!==remote.hostId)return;
    modes.sort(function(a,b){return Date.parse(b.created_at)-Date.parse(a.created_at);});
    var on=false,mode={};
    try{mode=modes[0]?JSON.parse(modes[0].message):{};on=!!mode.on;}catch(e){}
    if(typeof window.ktSetViewerMovieTheater==='function')window.ktSetViewerMovieTheater(on,host,mode);
  }

  function systemType(t){t=String(t||'');return t==='system'||(t==='attendance'||t.indexOf('attendance:')===0)||(t==='like'||t.indexOf('like:')===0)||t.indexOf('gift:')===0;}
  function ensureStyle(){
    if(document.getElementById('ktLiveViewerInteractionStyle'))return;
    var s=document.createElement('style');s.id='ktLiveViewerInteractionStyle';
    s.textContent=''
      +'.kt-remote-chat{position:absolute;left:12px;right:62px;bottom:64px;z-index:7;max-height:70px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;pointer-events:none}'
      +'.kt-remote-chat-line{display:flex;align-items:baseline;gap:6px;margin-top:5px;min-width:0;color:#fff;font-size:12px;font-weight:850;line-height:1.28;text-shadow:0 1px 3px #000,0 0 7px #000}.kt-remote-chat-line b{flex:0 0 auto;color:#70d7ff;font-size:12px;font-weight:950;max-width:38%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-remote-chat-line span{min-width:0;color:#fff;overflow-wrap:anywhere}.kt-remote-chat-line.system b{color:#ffd75e}.kt-remote-chat-line.system span{color:#ffe99a;font-weight:900}'
      +'.kt-remote-attendance{position:absolute;z-index:10;right:12px;top:62px;height:34px;padding:0 12px;border:2px solid #ff2bbd;border-radius:18px;background:#130714;color:#ffd52f;font-size:12px;font-weight:950;box-shadow:0 0 9px #ff2bbd;touch-action:manipulation}.kt-remote-attendance.done{border-color:#55d98b;color:#baffcf;box-shadow:0 0 8px #39c976}'
      +'.kt-remote-bottom{position:absolute;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:8;display:flex;align-items:center;gap:7px}.kt-remote-bottom input{flex:1 1 auto;min-width:0;height:44px;border:1px solid rgba(255,255,255,.16);border-radius:23px;background:rgba(28,28,34,.88);color:#fff;padding:0 14px;font-size:14px;font-weight:750;outline:none;backdrop-filter:blur(5px)}.kt-remote-bottom input::placeholder{color:#c9c9ce}.kt-remote-action{width:44px;height:44px;flex:0 0 44px;border:1px solid rgba(255,255,255,.17);border-radius:50%;background:rgba(23,23,29,.9);color:#fff;font-size:20px;display:grid;place-items:center;touch-action:manipulation}.kt-remote-action.heart{background:rgba(77,16,50,.92);color:#ff65ad}.kt-remote-action.gift{background:rgba(62,37,11,.92)}.kt-remote-action.share{font-size:19px}'
      +'#ktRemoteChatList{pointer-events:auto!important}'
      +'.kt-remote-heart-pop{position:absolute;right:18px;bottom:126px;z-index:9;font-size:31px;pointer-events:none;animation:ktRemoteHeartFloat 1.15s ease-out forwards}@keyframes ktRemoteHeartFloat{0%{opacity:0;transform:translateY(15px) scale(.7)}20%{opacity:1}100%{opacity:0;transform:translateY(-95px) scale(1.25)}}'
      +'@media(max-width:390px){.kt-remote-chat{left:9px;right:54px;bottom:60px;max-height:66px}.kt-remote-attendance{right:8px;top:58px;height:31px;font-size:11px;padding:0 9px}.kt-remote-bottom{left:6px;right:6px;gap:5px}.kt-remote-bottom input{height:42px;padding:0 12px;font-size:13px}.kt-remote-action{width:40px;height:40px;flex-basis:40px;font-size:18px}.kt-remote-chat-line,.kt-remote-chat-line b{font-size:11px}}';
    document.head.appendChild(s);
  }

  function attendanceType(type){return type==='attendance'||String(type).indexOf('attendance:')===0;}
  function attendanceEventKey(m){
    var type=String(m&&m.message_type||'');
    if(!attendanceType(type))return '';
    return type==='attendance'?'legacy:'+String(m.sender_id||m.sender_name||''):type;
  }
  function attendanceCount(rows){var seen={};(rows||[]).forEach(function(m){var key=attendanceEventKey(m);if(key)seen[key]=1;});return Object.keys(seen).length;}
  function attendanceContext(){
    var key='kt_attendance_clicks_v2:'+remote.hostId+':'+(remote.roomStart||'live');
    if(!attendanceContexts[key]){var seen={};try{seen=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
      attendanceContexts[key]={key:key,hostId:remote.hostId,viewerId:remote.viewerId,viewerName:remote.viewerName,seen:seen,pending:{}};
    }
    return attendanceContexts[key];
  }
  function saveAttendanceContext(ctx){try{localStorage.setItem(ctx.key,JSON.stringify(ctx.seen));}catch(e){}}
  function attendanceTotal(ctx){var all=Object.assign({},ctx.seen,ctx.pending);return Object.keys(all).length;}
  function mergeAttendanceRows(rows){var ctx=attendanceContext();(rows||[]).forEach(function(m){var key=attendanceEventKey(m);if(key)ctx.seen[key]=1;});saveAttendanceContext(ctx);return attendanceTotal(ctx);}
  function markAttendance(){
    var root=document.querySelector('#screen .kt-remote-live');if(!root)return;
    var b=root.querySelector('#ktRemoteAttendance');if(!b)return;
    var ctx=attendanceContext(),n=attendanceTotal(ctx);
    var heart=root.querySelector('.kt-attendance-heart-badge');
    if(!heart){heart=document.createElement('span');heart.className='kt-attendance-heart-badge';heart.style.setProperty('position','static','important');heart.style.setProperty('transform','none','important');heart.style.setProperty('margin-left','4px','important');heart.style.setProperty('flex','0 0 auto','important');}
    var pair=b.closest('.kt-guest-attendance-inline');
    if(!pair){pair=document.createElement('span');pair.className='kt-guest-attendance-inline';pair.style.cssText='display:inline-flex;align-items:center;gap:4px;min-width:0';b.insertAdjacentElement('beforebegin',pair);pair.appendChild(b);}
    if(heart.parentElement!==pair)pair.appendChild(heart);
    b.dataset.count=String(n);b.disabled=false;b.classList.remove('done');
    if(b.textContent!=='🌹 출석체크')b.textContent='🌹 출석체크';
    b.setAttribute('aria-label','출석체크 · 누를 때마다 장미 1송이');
    var text='💗 '+n;if(heart.textContent!==text)heart.textContent=text;
    heart.setAttribute('aria-label','출석 체크 '+n+'회');
  }
  function ensureRemoteUi(){
    ensureStyle();var root=document.querySelector('.kt-remote-live');if(!root)return false;
    var kind=String(root.getAttribute('data-kt-room-type')||'');
    var name=String(root.getAttribute('data-kt-room-name')||'');
    var thirteen=!!root.querySelector('[data-kt-remote13="1"]')||kind==='group13'||(/^(?:general|group)?$/.test(kind)&&/13\s*명/.test(name));
    var solo=kind==='solo'||/1\s*인|solo/i.test(name);
    // Guest attendance/heart controls removed at owner's request; host controls stay.
    if(!document.getElementById('ktRemoteChatList')){var chat=document.createElement('div');chat.id='ktRemoteChatList';chat.className='kt-remote-chat';root.appendChild(chat);}
    if(!document.getElementById('ktRemoteBottom')){var bar=document.createElement('div');bar.id='ktRemoteBottom';bar.className='kt-remote-bottom';bar.innerHTML='<input id="ktRemoteChatInput" maxlength="100" placeholder="입력하세요…" aria-label="라이브 채팅 입력">'+'<button type="button" class="kt-remote-action send" onclick="ktRemoteSendChat()" aria-label="채팅 보내기">➤</button>'+'<button type="button" class="kt-remote-action gift" onclick="ktRemoteOpenGifts()" aria-label="선물">🎁</button>'+'<button type="button" class="kt-remote-action share" onclick="ktRemoteShare()" aria-label="공유">↗</button>';root.appendChild(bar);var input=bar.querySelector('#ktRemoteChatInput');if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();window.ktRemoteSendChat();}});}
    return true;
  }

  async function fetchMessages(hostId,start){
    if(!hostId)return [];
    var primary=[],memory=[];
    var path='ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(hostId);
    if(start)path+='&created_at=gte.'+enc(start);
    path+='&order=created_at.desc&limit=300';

    try{
      var rows=await req(path);
      if(Array.isArray(rows))primary=rows;
    }catch(e){}

    try{
      var j=await memGet(MEM_INTERACT+'?action=messages&host_id='+enc(hostId)+'&t='+Date.now());
      var rows2=Array.isArray(j&&j.messages)?j.messages:[];
      if(start){
        var cut=Date.parse(start)||0;
        rows2=rows2.filter(function(x){return (Date.parse(x.created_at)||0)>=cut;});
      }
      memory=rows2;
    }catch(e){}

    var seen={},all=[];
    var cutoff=epoch(start);
    primary.concat(memory).forEach(function(m){
      if(cutoff&&epoch(m&&m.created_at)<cutoff)return;
      var key=String(
        (m&&m.id!=null?m.id:'')+'|'+
        String(m&&m.sender_id||'')+'|'+
        String(m&&m.message_type||'')+'|'+
        String(m&&m.message||'')+'|'+
        String(m&&m.created_at||'')
      );
      if(seen[key])return;
      seen[key]=1;
      all.push(m);
    });
    all.sort(function(a,b){return (Date.parse(a&&a.created_at)||0)-(Date.parse(b&&b.created_at)||0);});
    return all.slice(-300);
  }
  function paintRemoteMessages(rows){var box=document.getElementById('ktRemoteChatList');if(!box)return;var list=(rows||[]).filter(function(m){return !(window.ktIsInternalLiveMessage&&window.ktIsInternalLiveMessage(m.message,m.message_type));}).slice(-80);box.innerHTML=list.map(function(m){var sys=systemType(m.message_type);return '<div class="kt-remote-chat-line'+(sys?' system':'')+'"><b>'+(sys?'●':esc(m.sender_name||'게스트'))+'</b><span>'+esc(m.message||'')+'</span></div>';}).join('');box.scrollTop=box.scrollHeight;}
  async function refreshRemote(){
    if(!remote.hostId||!document.querySelector('.kt-remote-live'))return;
    ensureRemoteUi();
    var context=remote,cut=remote.roomStart;
    var rows=await fetchMessages(context.hostId,cut);
    if(remote!==context||remote.roomStart!==cut)return;
    mergeAttendanceRows(rows);markAttendance();
    paintRemoteMessages(rows);
    await refreshMovieMode(rows);
  }
  function clearRemote(){if(typeof window.ktSetViewerMovieTheater==='function')window.ktSetViewerMovieTheater(false,remote.hostId);clearInterval(remote.timer);remote={hostId:'',viewerId:'',viewerName:'',roomStart:'',timer:null,lastLikeAt:0};}
  async function startRemote(hostId){clearRemote();var p=profile(),room=await activeRoom(hostId);remote.hostId=String(hostId||'');remote.viewerId='viewer_'+deviceId();remote.viewerName=p.name||'게스트';remote.roomStart=chatCut20261015(room&&room.started_at,window.__ktRemoteHostSessionStartedAt20260924);var start=epoch(remote.roomStart);if(start&&!guestClockStarts[remote.hostId])guestClockStarts[remote.hostId]=start;ensureRemoteUi();await refreshRemote();remote.timer=setInterval(refreshRemote,1300);}

  window.ktRemoteAttendance=function(){
    if(!remote.hostId)return Promise.resolve(false);
    var ctx=attendanceContext(),id='attendance:'+(window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12));
    ctx.pending[id]=1;markAttendance();
    var job=attendanceSendQueue.then(async function(){
      var msg='🌹 '+ctx.viewerName+'님이 출석 체크를 눌렀습니다. 호스트에게 장미 1송이가 들어왔습니다.';
      var ok=false;try{ok=await postMessage(ctx.hostId,ctx.viewerId,ctx.viewerName,msg,id);}catch(e){}
      if(ok){ctx.seen[id]=1;saveAttendanceContext(ctx);}
      delete ctx.pending[id];
      if(ctx===attendanceContext()){markAttendance();if(!ok){var button=document.getElementById('ktRemoteAttendance');if(button){button.textContent='전송 실패 · 다시 눌러주세요';button.setAttribute('aria-label','출석 전송 실패 · 다시 눌러주세요');}}}
      return ok;
    });
    attendanceSendQueue=job.catch(function(){return false;});
    return job;
  };
  window.ktRemoteSendChat=async function(){
    var hostId=String(remote.hostId||'');
    if(!hostId){
      try{hostId=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'');}catch(e){hostId='';}
      if(hostId)remote.hostId=hostId;
    }
    if(!hostId)return false;

    var input=document.getElementById('ktRemoteChatInput');
    var text=input?String(input.value||'').trim():'';
    if(!text)return false;

    if(input){input.value='';input.disabled=true;}
    var ok=await postMessage(hostId,remote.viewerId||('viewer_'+deviceId()),remote.viewerName||profile().name||'게스트',text,'chat');
    if(input){input.disabled=false;try{input.blur();}catch(e){}}
    await refreshRemote();
    return ok;
  };
  window.ktRemoteLike=async function(){
    if(!remote.hostId)return false;
    var ctx=remote,id='like:'+(window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12));
    if(window.ktFloatLikeHeart20261017)window.ktFloatLikeHeart20261017();
    var ok=await postMessage(ctx.hostId,ctx.viewerId,ctx.viewerName,'💗 '+ctx.viewerName+'님이 좋아요를 눌렀습니다.',id);
    if(remote===ctx)refreshRemote();
    return ok;
  };
  window.ktRemoteOpenGifts=function(){try{if(window.state)state.currentViewRoomTitle=remote.hostId||state.currentViewRoomTitle;}catch(e){}if(window.openGifts)window.openGifts();};
  window.ktRemoteSendOneRose=async function(){if(!remote.hostId)return;var receipt=window.ktNewLevelGiftReceipt20261015?window.ktNewLevelGiftReceipt20261015():'',levelAccount=window.ktLevelAccountKey20261015?window.ktLevelAccountKey20261015():'';var type=receipt?'gift:1:level:'+receipt:'gift:1';var ok=await postMessage(remote.hostId,remote.viewerId,remote.viewerName,'🌹 '+remote.viewerName+'님이 장미 1송이를 선물했습니다.',type);if(ok){if(receipt&&window.ktLevelCreditGiftReceipt20261015)window.ktLevelCreditGiftReceipt20261015({id:receipt,account:levelAccount,direction:'sent',count:1,createdAt:new Date().toISOString()});await refreshRemote();}};
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#ktRemoteBottom button'):null;if(!b)return;var label=(String(b.getAttribute('aria-label')||'')+' '+String(b.textContent||'')).replace(/\s+/g,'');if(label.indexOf('🌹')===-1&&label.indexOf('장미')===-1)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();window.ktRemoteSendOneRose();},true);
  window.ktRemoteShare=async function(){try{if(navigator.share){await navigator.share({title:'K-Talk LIVE',text:'K-Talk 라이브 방송',url:location.href});return;}if(navigator.clipboard){await navigator.clipboard.writeText(location.href);alert('K-Talk 주소를 복사했습니다.');return;}if(window.shareApp)window.shareApp();}catch(e){}};

  function currentHostBox(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return null;

    /* Prefer the chat box inside the room that is actually on screen.
       A stale duplicate id can remain during room transitions; writing to that
       invisible box made AI read the message while no text appeared to the host. */
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"],#screen .ktg13-room');
    if(room){
      var liveChat=room.querySelector('.ktg13-chat');
      if(liveChat)return {el:liveChat,line:'ktg13-chat-line'};
    }

    var defs=[['ktsoloChatList','ktsolo-chat-line'],['ktsubscriberChatList','ktsubscriber-chat-line'],['ktsecretChatList','ktsecret-chat-line'],['ktg13ChatList','ktg13-chat-line']];
    for(var i=0;i<defs.length;i++){
      var el=document.getElementById(defs[i][0]);
      if(el&&el.isConnected)return {el:el,line:defs[i][1]};
    }
    return null;
  }
  function processedKey(m){return 'kt_live_host_event_done:'+(m&&m.id!=null?String(m.id):'');}
  function wasProcessed(m){if(!m||m.id==null)return true;try{return localStorage.getItem(processedKey(m))==='1';}catch(e){return false;}}
  function markProcessed(m){if(!m||m.id==null)return;try{localStorage.setItem(processedKey(m),'1');}catch(e){}}
  function speakIfNeeded(text){if((window.ktIsInternalLiveMessage&&window.ktIsInternalLiveMessage(text))||!text||window.__ktChatBenefitAIReaderInstalled)return;try{if(typeof window.ktSpeak==='function')window.ktSpeak(text);}catch(e){}}
  function addLikeToHost(){try{if(typeof window.addHostLike==='function'){window.addHostLike(1);return;}}catch(e){}['hostLikeCount','ktg13LikeCount'].forEach(function(id){var n=document.getElementById(id);if(n)n.textContent=String((parseInt(n.textContent||'0',10)||0)+1);});}
  function currentHostRoom(){
    return document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
  }
  function hostRoomKey(room){
    if(!room)return 'room';
    if(room.classList.contains('ktsolo-room'))return 'solo';
    if(room.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(room.classList.contains('ktsecret-room'))return 'secret';
    if(room.classList.contains('ktg13-room'))return room.getAttribute('data-kt-room')==='9'?'group9':'group13';
    return 'room';
  }
  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function incrementHostAttendanceCount(){
    try{
      var room=currentHostRoom();if(!room)return;
      var key='ktalk_room_attendance_count:'+todayKey()+':'+hostRoomKey(room);
      var n=Math.max(0,parseInt(localStorage.getItem(key)||'0',10)||0)+1;
      localStorage.setItem(key,String(n));
      var btn=room.querySelector('.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.kt-live-attendance,[data-kt-attendance]');
      room.querySelectorAll('.kt-attendance-heart-badge').forEach(function(el){el.textContent='💗 '+n;el.setAttribute('aria-label','출석 체크 '+n+'회');});
      if(btn){
        var badge=btn.querySelector('.kt-attendance-room-count');
        if(!badge){badge=document.createElement('span');badge.className='kt-attendance-room-count';btn.appendChild(badge);}
        badge.textContent=String(n);
      }
    }catch(e){}
  }
  function processHostEvents(rows){
    (rows||[]).forEach(function(m){if(wasProcessed(m))return;var type=String(m.message_type||'');if(type==='movie_mode'){markProcessed(m);return;}
      if(attendanceType(type)){
        var akey='kt_host_attendee_done:'+deviceId()+':'+(hostRoomStart||'live')+':'+(type==='attendance'?String(m.sender_id||'guest'):type);var done=false;try{done=localStorage.getItem(akey)==='1';}catch(e){}
        if(!done){
          try{if(typeof window.addMyEarnedRoses==='function')window.addMyEarnedRoses(1);}catch(e){}
          try{if(typeof window.ktRecordReceivedRose==='function')window.ktRecordReceivedRose(String(m.sender_name||'회원'),1,'출석 장미','host');}catch(e){}
          incrementHostAttendanceCount();
          try{localStorage.setItem(akey,'1');}catch(e){}
          speakIfNeeded(m.message);
        }
        markProcessed(m);return;
      }
      if(type.indexOf('like:')===0){
        var key='kt_host_like_event:'+deviceId()+':'+(hostRoomStart||'live')+':'+type,done=false;
        try{done=localStorage.getItem(key)==='1';}catch(e){}
        if(!done){addLikeToHost();try{localStorage.setItem(key,'1');}catch(e){}}
        markProcessed(m);return;
      }
      if(type==='like'){var sender=String(m.sender_id||''),stamp=Date.parse(m.created_at||'')||0,prior=lastHostLikeBySender[sender]||0;if(!stamp||!prior||Math.abs(stamp-prior)>500){addLikeToHost();speakIfNeeded(m.message);lastHostLikeBySender[sender]=stamp;}markProcessed(m);return;}
      if(type.indexOf('gift:')===0){
        var n=parseInt(type.slice(5),10)||0;
        var levelReceipt=type.match(/:level:(level_[a-z0-9]+_[a-z0-9]+)$/);
        if(levelReceipt&&n>0&&window.ktLevelCreditGiftReceipt20261015)window.ktLevelCreditGiftReceipt20261015({id:levelReceipt[1],direction:'received',count:n,createdAt:m.created_at});
        if(n>0){
          try{if(typeof window.addMyEarnedRoses==='function')window.addMyEarnedRoses(n);}catch(e){}
          try{
            if(!m.created_at||Date.parse(m.created_at)<giftVisitSince20261014){markProcessed(m);return;}
            var text=String(m.message||''),name='선물';
            var effectKey=String(m.sender_id||m.sender_name||'')+'|'+type+'|'+text,stamp=Date.parse(m.created_at)||0;
            var prior=(window.__ktGiftReceiptEffectTimes20261015||{})[effectKey]||0;
            if((prior&&Math.abs(stamp-prior)<1500)||completedGiftChat20261015(text,m.created_at)){markProcessed(m);return;}
            window.__ktGiftReceiptEffectTimes20261015=window.__ktGiftReceiptEffectTimes20261015||{};window.__ktGiftReceiptEffectTimes20261015[effectKey]=stamp;
            var names=(window.ktalkGifts||[]).map(function(g){return String(g[0]);}).sort(function(a,b){return b.length-a.length;});
            name=names.find(function(v){return text.indexOf('님이 '+v+' ')>=0;})||(/장미/.test(text)?'장미':'선물');
            if(typeof window.ktPresentReceivedGift3D20261014==='function')window.ktPresentReceivedGift3D20261014(name,n,String(m.sender_name||'회원'),null,{eventId:String(m.id||''),createdAt:m.created_at});
            else if(typeof window.showSmallGiftFx==='function')window.showSmallGiftFx(name,n,String(m.sender_name||'회원'));
            if(n>=1000&&typeof window.ktMarkPremiumGiftClip20260928==='function')window.ktMarkPremiumGiftClip20260928(name,n,String(m.sender_name||'회원'));
            if(typeof window.ktSpeakGift20261014==='function'){
              window.__ktRecentGiftSpeech20261014=window.__ktRecentGiftSpeech20261014||{};
              window.__ktRecentGiftSpeech20261014[text.replace(/\s+/g,' ').trim()]=Date.now();
              window.ktSpeakGift20261014(String(m.sender_name||'회원')+'님이 '+name+' '+n+'개를 선물했습니다.',String(m.id||m.created_at||''),m.created_at);
            }else speakIfNeeded(m.message);
          }catch(e){}
        }
        markProcessed(m);return;
      }
      if(type==='chat'){speakIfNeeded((m.sender_name?String(m.sender_name)+'님, ':'')+String(m.message||''));markProcessed(m);return;}
    });
  }
  function installHostChatKeepAlive(){
    if(window.__ktHostChatKeepAliveInstalled)return;
    window.__ktHostChatKeepAliveInstalled=true;

    function restore(){
      var html=String(window.__ktHostChatStableHtml||'');
      if(!html)return;
      document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"] .ktg13-chat').forEach(function(el){
        if(!el||!el.isConnected)return;
        if(!el.innerHTML||el.querySelectorAll('.ktg13-chat-line').length===0){
          el.innerHTML=html;
          el.scrollTop=el.scrollHeight;
        }
      });
    }

    try{
      new MutationObserver(function(){
        clearTimeout(window.__ktHostChatKeepAliveTimer);
        window.__ktHostChatKeepAliveTimer=setTimeout(restore,20);
      }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
    }catch(e){}

    setInterval(restore,500);
  }

  function paintHostMessages(box,rows){
    if(!box||!box.el)return;
    rows=(rows||[]).filter(function(m){return !(window.ktIsInternalLiveMessage&&window.ktIsInternalLiveMessage(m.message,m.message_type))&&!completedGiftChat20261015(m.message,m.created_at);});
    hostChatStableBuffer=hostChatStableBuffer.filter(function(m){return !(window.ktIsInternalLiveMessage&&window.ktIsInternalLiveMessage(m.message,m.message_type))&&!completedGiftChat20261015(m.message,m.created_at);});

    /* Keep a stable visible history. A temporary empty/partial fetch must not
       erase a chat line that just appeared. New lines stack from the bottom
       and push older lines upward; only the oldest line is dropped past 7. */
    (rows||[]).forEach(function(m){
      var key=String(
        (m&&m.id!=null?m.id:'')+'|'+
        String(m&&m.sender_id||'')+'|'+
        String(m&&m.message_type||'')+'|'+
        String(m&&m.message||'')
      );
      if(!key.replace(/\|/g,''))return;
      var exists=hostChatStableBuffer.some(function(x){return x.__ktKey===key;});
      if(exists)return;
      var copy=Object.assign({},m);
      copy.__ktKey=key;
      hostChatStableBuffer.push(copy);
    });

    if(hostChatStableBuffer.length>40){
      hostChatStableBuffer=hostChatStableBuffer.slice(-40);
    }

    var full13=box.el.closest('.ktg13-room[data-kt-room="13"]');
    var list=hostChatStableBuffer.slice(-40);
    if(!list.length){window.__ktHostChatStableHtml='';if(box.el.innerHTML)box.el.innerHTML='';return;}

    var html=list.map(function(m){
      var sys=systemType(m.message_type);
      return '<div class="'+box.line+'" data-kt-created-at="'+esc(m.created_at||'')+'"><b>'+(sys?'●':esc(m.sender_name||'게스트'))+'</b><span>'+esc(m.message||'')+'</span></div>';
    }).join('');

    window.__ktHostChatStableHtml=html;
    box.el.innerHTML=html;
    box.el.scrollTop=box.el.scrollHeight;

    if(box.line==='ktg13-chat-line'){
      document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"] .ktg13-chat').forEach(function(el){
        if(el===box.el)return;
        el.innerHTML=html;
        el.scrollTop=el.scrollHeight;
      });
    }
  }

  async function refreshHostOnce(){
    var box=currentHostBox();if(!box){giftVisitSince20261014=Date.now();return;}
    var generation=chatGeneration20261015;
    var hid=deviceId(),room=await activeRoom(hid);if(!room||generation!==chatGeneration20261015)return;
    var nextStart=chatCut20261015(room.started_at,hostChatFloor20261015||window.__ktHostRunStartedAt20260924);
    if(hostRoomStart&&nextStart&&hostRoomStart!==nextStart){clearHostChat20261015();generation=chatGeneration20261015;}
    hostRoomStart=nextStart||hostRoomStart;
    var rows=await fetchMessages(hid,hostRoomStart);
    if(generation!==chatGeneration20261015)return;
    processHostEvents(rows);
    // Reconstruct the display from attendance records even if reward events were already processed.
    var attendanceRoom=currentHostRoom();
    if(attendanceRoom){try{var key='ktalk_room_attendance_count:'+todayKey()+':'+hostRoomKey(attendanceRoom);var total=Math.max(Number(localStorage.getItem(key)||0),attendanceCount(rows));localStorage.setItem(key,String(total));attendanceRoom.querySelectorAll('.kt-attendance-heart-badge').forEach(function(el){el.textContent='💗 '+total;el.setAttribute('aria-label','출석 체크 '+total+'회');});attendanceRoom.querySelectorAll('#ktAttendanceTopCount,.kt-attendance-room-count').forEach(function(el){el.textContent=String(total);});}catch(e){}}
    paintHostMessages(box,rows);
  }
  var hostRefreshPending=false;
  async function refreshHost(){if(hostRefreshPending)return;hostRefreshPending=true;try{await refreshHostOnce();}finally{hostRefreshPending=false;}}
  async function sendHostChat(text){text=String(text||'').trim();if(!text)return;var hid=deviceId(),room=await activeRoom(hid);if(!room)return;var p=profile();await postMessage(hid,hid,p.name||'호스트',text,'chat');setTimeout(refreshHost,80);}
  function wrapHostSend(name,inputId){var old=window[name];if(typeof old!=='function'||old.__ktDbChatWrapped)return;var fn=function(){var input=document.getElementById(inputId),text=input?String(input.value||'').trim():'';var r=old.apply(this,arguments);if(text)sendHostChat(text);return r;};fn.__ktDbChatWrapped=true;window[name]=fn;}
  function ensureHostSendWraps(){wrapHostSend('ktSoloSendChat','ktsoloChatInput');wrapHostSend('ktSubscriberSendChat','ktsubscriberChatInput');wrapHostSend('ktSecretSendChat','ktsecretChatInput');wrapHostSend('ktGroup13SendChat','ktg13ChatInput');}

  function installPublicWraps(){
    var enter=window.ktEnterRemoteLive;if(typeof enter==='function'&&!enter.__ktInteractionWrapped){var wrappedEnter=async function(hostId){var r=await enter.apply(this,arguments);if(document.querySelector('.kt-remote-live'))await startRemote(hostId);return r;};wrappedEnter.__ktInteractionWrapped=true;window.ktEnterRemoteLive=wrappedEnter;}
    var leave=window.ktLeaveRemoteLive;if(typeof leave==='function'&&!leave.__ktInteractionWrapped){var wrappedLeave=async function(){clearRemote();return leave.apply(this,arguments);};wrappedLeave.__ktInteractionWrapped=true;window.ktLeaveRemoteLive=wrappedLeave;}
    var gift=window.giftSend;if(typeof gift==='function'&&!gift.__ktRemoteGiftWrapped){var wrappedGift=function(name,cost,sender){var activeHost=remote.hostId,viewerId=remote.viewerId,viewerName=remote.viewerName;var outer=!window.__ktGiftSendDepth20261015;window.__ktGiftSendDepth20261015=(window.__ktGiftSendDepth20261015||0)+1;var r;try{r=gift.apply(this,arguments);}finally{window.__ktGiftSendDepth20261015--;}if(outer&&activeHost){var n=parseInt(String(cost||0).replace(/,/g,''),10)||0;postMessage(activeHost,viewerId,viewerName,'🎁 '+viewerName+'님이 '+String(name||'선물')+' '+n+'개를 선물했습니다.','gift:'+n).then(refreshRemote);}return r;};wrappedGift.__ktRemoteGiftWrapped=true;window.giftSend=wrappedGift;}
  }

  ensureStyle();installHostChatKeepAlive();ensureHostSendWraps();installPublicWraps();
  hostTimer=setInterval(function(){ensureHostSendWraps();installPublicWraps();refreshHost();},400);
})();