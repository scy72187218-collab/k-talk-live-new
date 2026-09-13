/* K-Talk 원격 시청 상호작용: 채팅·출석체크·좋아요·선물·공유를 호스트와 실시간 연결. */
(function(){
  if(window.__ktLiveViewerInteractionInstalled)return;
  window.__ktLiveViewerInteractionInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var remote={hostId:'',viewerId:'',viewerName:'',roomStart:'',timer:null,lastLikeAt:0};
  var hostTimer=null,hostRoomStart='';

  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){opt=opt||{};opt.headers=headers(opt.headers);var r=await fetch(BASE+path,opt);if(!r.ok)throw new Error('live interaction api '+r.status);if(r.status===204)return null;var t=await r.text();return t?JSON.parse(t):null;}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}return id;}
  function profile(){var p={name:'K-Talk',photo:''};try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.nickname||x.name||x.displayName||p.name);p.photo=String(x.photo||'');}}catch(e){}try{var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.nickname||s.name||s.displayName||p.name);p.photo=String(s.photo||p.photo);}}catch(e){}try{p.name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}return p;}
  async function activeRoom(hostId){try{var rows=await req('ktalk_live_rooms?select=host_id,host_name,title,room_name,started_at,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1');return rows&&rows[0]?rows[0]:null;}catch(e){return null;}}
  async function postMessage(hostId,senderId,senderName,message,type){if(!hostId||!message)return false;try{await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:hostId,sender_id:senderId||'guest',sender_name:senderName||'게스트',message:String(message).slice(0,300),message_type:type||'chat'})});return true;}catch(e){return false;}}

  function systemType(t){t=String(t||'');return t==='system'||t==='attendance'||t==='like'||t.indexOf('gift:')===0;}
  function ensureStyle(){
    if(document.getElementById('ktLiveViewerInteractionStyle'))return;
    var s=document.createElement('style');s.id='ktLiveViewerInteractionStyle';
    s.textContent=''
      +'.kt-remote-chat{position:absolute;left:12px;right:62px;bottom:78px;z-index:7;max-height:154px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;pointer-events:none}'
      +'.kt-remote-chat-line{display:flex;align-items:baseline;gap:6px;margin-top:5px;min-width:0;color:#fff;font-size:12px;font-weight:850;line-height:1.28;text-shadow:0 1px 3px #000,0 0 7px #000}.kt-remote-chat-line b{flex:0 0 auto;color:#70d7ff;font-size:12px;font-weight:950;max-width:38%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-remote-chat-line span{min-width:0;color:#fff;overflow-wrap:anywhere}.kt-remote-chat-line.system b{color:#ffd75e}.kt-remote-chat-line.system span{color:#ffe99a;font-weight:900}'
      +'.kt-remote-attendance{position:absolute;z-index:10;right:12px;top:62px;height:34px;padding:0 12px;border:2px solid #ff2bbd;border-radius:18px;background:#130714;color:#ffd52f;font-size:12px;font-weight:950;box-shadow:0 0 9px #ff2bbd;touch-action:manipulation}.kt-remote-attendance.done{border-color:#55d98b;color:#baffcf;box-shadow:0 0 8px #39c976}'
      +'.kt-remote-bottom{position:absolute;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:8;display:flex;align-items:center;gap:7px}.kt-remote-bottom input{flex:1 1 auto;min-width:0;height:44px;border:1px solid rgba(255,255,255,.16);border-radius:23px;background:rgba(28,28,34,.88);color:#fff;padding:0 14px;font-size:14px;font-weight:750;outline:none;backdrop-filter:blur(5px)}.kt-remote-bottom input::placeholder{color:#c9c9ce}.kt-remote-action{width:44px;height:44px;flex:0 0 44px;border:1px solid rgba(255,255,255,.17);border-radius:50%;background:rgba(23,23,29,.9);color:#fff;font-size:20px;display:grid;place-items:center;touch-action:manipulation}.kt-remote-action.heart{background:rgba(77,16,50,.92);color:#ff65ad}.kt-remote-action.gift{background:rgba(62,37,11,.92)}.kt-remote-action.share{font-size:19px}'
      +'.kt-remote-heart-pop{position:absolute;right:18px;bottom:126px;z-index:9;font-size:31px;pointer-events:none;animation:ktRemoteHeartFloat 1.15s ease-out forwards}@keyframes ktRemoteHeartFloat{0%{opacity:0;transform:translateY(15px) scale(.7)}20%{opacity:1}100%{opacity:0;transform:translateY(-95px) scale(1.25)}}'
      +'@media(max-width:390px){.kt-remote-chat{left:9px;right:54px;bottom:72px;max-height:140px}.kt-remote-attendance{right:8px;top:58px;height:31px;font-size:11px;padding:0 9px}.kt-remote-bottom{left:6px;right:6px;gap:5px}.kt-remote-bottom input{height:42px;padding:0 12px;font-size:13px}.kt-remote-action{width:40px;height:40px;flex-basis:40px;font-size:18px}.kt-remote-chat-line,.kt-remote-chat-line b{font-size:11px}}';
    document.head.appendChild(s);
  }

  function attendanceKey(){return 'kt_remote_attendance_once:'+remote.hostId+':'+(remote.roomStart||'live')+':'+remote.viewerId;}
  function markAttendance(){var b=document.getElementById('ktRemoteAttendance');if(!b)return;var done=false;try{done=localStorage.getItem(attendanceKey())==='1';}catch(e){}b.classList.toggle('done',done);b.textContent=done?'✓ 출석 완료':'🌹 출석체크';b.disabled=done;}
  function ensureRemoteUi(){
    ensureStyle();var root=document.querySelector('.kt-remote-live');if(!root)return false;
    if(!document.getElementById('ktRemoteAttendance')){var at=document.createElement('button');at.id='ktRemoteAttendance';at.type='button';at.className='kt-remote-attendance';at.textContent='🌹 출석체크';at.onclick=function(){window.ktRemoteAttendance();};root.appendChild(at);}
    markAttendance();
    if(!document.getElementById('ktRemoteChatList')){var chat=document.createElement('div');chat.id='ktRemoteChatList';chat.className='kt-remote-chat';root.appendChild(chat);}
    if(!document.getElementById('ktRemoteBottom')){var bar=document.createElement('div');bar.id='ktRemoteBottom';bar.className='kt-remote-bottom';bar.innerHTML='<input id="ktRemoteChatInput" maxlength="100" placeholder="입력하세요…" aria-label="라이브 채팅 입력">'+'<button type="button" class="kt-remote-action heart" onclick="ktRemoteLike()" aria-label="좋아요">♥</button>'+'<button type="button" class="kt-remote-action gift" onclick="ktRemoteOpenGifts()" aria-label="선물">🎁</button>'+'<button type="button" class="kt-remote-action share" onclick="ktRemoteShare()" aria-label="공유">↗</button>';root.appendChild(bar);var input=bar.querySelector('#ktRemoteChatInput');if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();window.ktRemoteSendChat();}});}
    return true;
  }

  async function fetchMessages(hostId,start){if(!hostId)return [];var path='ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(hostId);if(start)path+='&created_at=gte.'+enc(start);path+='&order=created_at.asc&limit=80';try{var rows=await req(path);return Array.isArray(rows)?rows:[];}catch(e){return [];}}
  function paintRemoteMessages(rows){var box=document.getElementById('ktRemoteChatList');if(!box)return;var list=(rows||[]).slice(-7);box.innerHTML=list.map(function(m){var sys=systemType(m.message_type);return '<div class="kt-remote-chat-line'+(sys?' system':'')+'"><b>'+(sys?'●':esc(m.sender_name||'게스트'))+'</b><span>'+esc(m.message||'')+'</span></div>';}).join('');box.scrollTop=box.scrollHeight;}
  async function refreshRemote(){if(!remote.hostId||!document.querySelector('.kt-remote-live'))return;ensureRemoteUi();paintRemoteMessages(await fetchMessages(remote.hostId,remote.roomStart));}
  function clearRemote(){clearInterval(remote.timer);remote={hostId:'',viewerId:'',viewerName:'',roomStart:'',timer:null,lastLikeAt:0};}
  async function startRemote(hostId){clearRemote();var p=profile(),room=await activeRoom(hostId);remote.hostId=String(hostId||'');remote.viewerId='viewer_'+deviceId();remote.viewerName=p.name||'게스트';remote.roomStart=room&&room.started_at?room.started_at:'';ensureRemoteUi();await refreshRemote();remote.timer=setInterval(refreshRemote,1300);}

  window.ktRemoteAttendance=async function(){
    if(!remote.hostId)return;var done=false;try{done=localStorage.getItem(attendanceKey())==='1';}catch(e){}if(done){markAttendance();return;}
    var msg='🌹 '+remote.viewerName+'님이 출석했습니다. 호스트에게 장미 1송이가 들어왔습니다.';
    var ok=await postMessage(remote.hostId,remote.viewerId,remote.viewerName,msg,'attendance');
    if(ok){try{localStorage.setItem(attendanceKey(),'1');}catch(e){}markAttendance();await refreshRemote();}
  };
  window.ktRemoteSendChat=async function(){if(!remote.hostId)return;var input=document.getElementById('ktRemoteChatInput'),text=input?String(input.value||'').trim():'';if(!text)return;if(input){input.value='';input.disabled=true;}await postMessage(remote.hostId,remote.viewerId,remote.viewerName,text,'chat');if(input){input.disabled=false;input.focus();}await refreshRemote();};
  window.ktRemoteLike=async function(){if(!remote.hostId)return;var now=Date.now();if(now-remote.lastLikeAt<700)return;remote.lastLikeAt=now;var root=document.querySelector('.kt-remote-live');if(root){var h=document.createElement('div');h.className='kt-remote-heart-pop';h.textContent='♥';root.appendChild(h);setTimeout(function(){if(h.parentNode)h.remove();},1250);}await postMessage(remote.hostId,remote.viewerId,remote.viewerName,'💗 '+remote.viewerName+'님이 좋아요를 눌렀습니다.','like');refreshRemote();};
  window.ktRemoteOpenGifts=function(){try{if(window.state)state.currentViewRoomTitle=remote.hostId||state.currentViewRoomTitle;}catch(e){}if(window.openGifts)window.openGifts();};
  window.ktRemoteShare=async function(){try{if(navigator.share){await navigator.share({title:'K-Talk LIVE',text:'K-Talk 라이브 방송',url:location.href});return;}if(navigator.clipboard){await navigator.clipboard.writeText(location.href);alert('K-Talk 주소를 복사했습니다.');return;}if(window.shareApp)window.shareApp();}catch(e){}};

  function currentHostBox(){if(document.documentElement.classList.contains('kt-remote-viewing'))return null;var defs=[['ktsoloChatList','ktsolo-chat-line'],['ktsubscriberChatList','ktsubscriber-chat-line'],['ktsecretChatList','ktsecret-chat-line'],['ktg13ChatList','ktg13-chat-line']];for(var i=0;i<defs.length;i++){var el=document.getElementById(defs[i][0]);if(el)return {el:el,line:defs[i][1]};}return null;}
  function processedKey(m){return 'kt_live_host_event_done:'+(m&&m.id!=null?String(m.id):'');}
  function wasProcessed(m){if(!m||m.id==null)return true;try{return localStorage.getItem(processedKey(m))==='1';}catch(e){return false;}}
  function markProcessed(m){if(!m||m.id==null)return;try{localStorage.setItem(processedKey(m),'1');}catch(e){}}
  function speakIfNeeded(text){if(!text||window.__ktChatBenefitAIReaderInstalled)return;try{if(typeof window.ktSpeak==='function')window.ktSpeak(text);}catch(e){}}
  function addLikeToHost(){try{if(typeof window.addHostLike==='function'){window.addHostLike(1);return;}}catch(e){}['hostLikeCount','ktg13LikeCount'].forEach(function(id){var n=document.getElementById(id);if(n)n.textContent=String((parseInt(n.textContent||'0',10)||0)+1);});}
  function processHostEvents(rows){
    (rows||[]).forEach(function(m){if(wasProcessed(m))return;var type=String(m.message_type||'');
      if(type==='attendance'){
        var akey='kt_host_attendee_done:'+(hostRoomStart||'live')+':'+String(m.sender_id||'guest');var done=false;try{done=localStorage.getItem(akey)==='1';}catch(e){}
        if(!done){try{if(typeof window.addMyEarnedRoses==='function')window.addMyEarnedRoses(1);}catch(e){}try{localStorage.setItem(akey,'1');}catch(e){}speakIfNeeded(m.message);}markProcessed(m);return;
      }
      if(type==='like'){addLikeToHost();speakIfNeeded(m.message);markProcessed(m);return;}
      if(type.indexOf('gift:')===0){var n=parseInt(type.slice(5),10)||0;if(n>0){try{if(typeof window.addMyEarnedRoses==='function')window.addMyEarnedRoses(n);}catch(e){}}speakIfNeeded(m.message);markProcessed(m);return;}
    });
  }
  function paintHostMessages(box,rows){if(!box||!box.el)return;var list=(rows||[]).slice(-6);box.el.innerHTML=list.map(function(m){var sys=systemType(m.message_type);return '<div class="'+box.line+'"><b>'+(sys?'●':esc(m.sender_name||'게스트'))+'</b><span>'+esc(m.message||'')+'</span></div>';}).join('');box.el.scrollTop=box.el.scrollHeight;}
  async function refreshHost(){var box=currentHostBox();if(!box)return;var hid=deviceId(),room=await activeRoom(hid);if(!room)return;hostRoomStart=room.started_at||hostRoomStart;var rows=await fetchMessages(hid,hostRoomStart);processHostEvents(rows);paintHostMessages(box,rows);}
  async function sendHostChat(text){text=String(text||'').trim();if(!text)return;var hid=deviceId(),room=await activeRoom(hid);if(!room)return;var p=profile();await postMessage(hid,hid,p.name||'호스트',text,'chat');setTimeout(refreshHost,80);}
  function wrapHostSend(name,inputId){var old=window[name];if(typeof old!=='function'||old.__ktDbChatWrapped)return;var fn=function(){var input=document.getElementById(inputId),text=input?String(input.value||'').trim():'';var r=old.apply(this,arguments);if(text)sendHostChat(text);return r;};fn.__ktDbChatWrapped=true;window[name]=fn;}
  function ensureHostSendWraps(){wrapHostSend('ktSoloSendChat','ktsoloChatInput');wrapHostSend('ktSubscriberSendChat','ktsubscriberChatInput');wrapHostSend('ktSecretSendChat','ktsecretChatInput');wrapHostSend('ktGroup13SendChat','ktg13ChatInput');}

  function installPublicWraps(){
    var enter=window.ktEnterRemoteLive;if(typeof enter==='function'&&!enter.__ktInteractionWrapped){var wrappedEnter=async function(hostId){var r=await enter.apply(this,arguments);if(document.querySelector('.kt-remote-live'))await startRemote(hostId);return r;};wrappedEnter.__ktInteractionWrapped=true;window.ktEnterRemoteLive=wrappedEnter;}
    var leave=window.ktLeaveRemoteLive;if(typeof leave==='function'&&!leave.__ktInteractionWrapped){var wrappedLeave=async function(){clearRemote();return leave.apply(this,arguments);};wrappedLeave.__ktInteractionWrapped=true;window.ktLeaveRemoteLive=wrappedLeave;}
    var gift=window.giftSend;if(typeof gift==='function'&&!gift.__ktRemoteGiftWrapped){var wrappedGift=function(name,cost,sender){var activeHost=remote.hostId,viewerId=remote.viewerId,viewerName=remote.viewerName;var r=gift.apply(this,arguments);if(activeHost){var n=parseInt(String(cost||0).replace(/,/g,''),10)||0;postMessage(activeHost,viewerId,viewerName,'🎁 '+viewerName+'님이 '+String(name||'선물')+' '+n+'개를 선물했습니다.','gift:'+n).then(refreshRemote);}return r;};wrappedGift.__ktRemoteGiftWrapped=true;window.giftSend=wrappedGift;}
  }

  ensureStyle();ensureHostSendWraps();installPublicWraps();
  hostTimer=setInterval(function(){ensureHostSendWraps();installPublicWraps();refreshHost();},1200);
})();
