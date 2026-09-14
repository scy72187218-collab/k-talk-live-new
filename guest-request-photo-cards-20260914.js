/* K-Talk 13명 방송: 게스트 참여신청을 프로필 사진 카드로 보여 주고 누르면 올리기/거부/차단 선택. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktGuestRequestPhotoCards20260914)return;
  window.__ktGuestRequestPhotoCards20260914=true;

  var BASE='',KEY='',photoCache={},timer=null;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}return id;}
  function viewerId(){return 'viewer_'+deviceId();}
  function profile(){
    var p={name:'K-Talk',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.nickname||x.name||x.displayName||p.name);p.photo=String(x.photo||'');}}catch(e){}
    try{var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.nickname||s.name||s.displayName||p.name);p.photo=String(s.photo||p.photo);}}catch(e){}
    try{p.name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}
    if(p.photo&&p.photo.length>260000)p.photo='';
    return p;
  }

  async function ensureConfig(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260914-guestphoto',{cache:'no-store'});if(!r.ok)return false;
      var t=await r.text(),b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);if(!b||!k)return false;
      BASE=b[1];KEY=k[1];return true;
    }catch(e){return false;}
  }
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){if(!(await ensureConfig()))throw new Error('config');opt=opt||{};opt.headers=headers(opt.headers);if(!opt.cache)opt.cache='no-store';var r=await fetch(BASE+path,opt);if(!r.ok)throw new Error('api '+r.status);if(r.status===204)return null;var t=await r.text();return t?JSON.parse(t):[];}

  async function syncViewerProfile(){
    var vid=viewerId(),p=profile();if(!vid)return;
    try{
      await req('ktalk_profiles?on_conflict=account_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({account_key:vid,nickname:String(p.name||'게스트').slice(0,80),photo:String(p.photo||''),updated_at:new Date().toISOString()})});
      photoCache[vid]={name:p.name||'게스트',photo:p.photo||'',at:Date.now()};
    }catch(e){}
  }

  function wrapGuestRequest(){
    var fn=window.ktRequestGuestJoin;if(typeof fn!=='function'||fn.__ktPhotoWrapped)return;
    var wrapped=async function(){await syncViewerProfile();return fn.apply(this,arguments);};
    wrapped.__ktPhotoWrapped=true;window.ktRequestGuestJoin=wrapped;
  }

  async function getPhoto(vid,name){
    var c=photoCache[vid];if(c&&Date.now()-c.at<30000)return c;
    try{
      var rows=await req('ktalk_profiles?select=account_key,nickname,photo&account_key=eq.'+enc(vid)+'&limit=1');
      var r=rows&&rows[0]?rows[0]:null;
      c={name:String((r&&r.nickname)||name||'게스트'),photo:String((r&&r.photo)||''),at:Date.now()};
    }catch(e){c={name:name||'게스트',photo:'',at:Date.now()};}
    photoCache[vid]=c;return c;
  }

  function blockedMap(){var x={};try{x=JSON.parse(localStorage.getItem('kt_guest_blocked:'+deviceId())||'{}')||{};}catch(e){}return x;}
  function setBlocked(vid,name){var x=blockedMap();x[String(vid)]=String(name||'게스트');try{localStorage.setItem('kt_guest_blocked:'+deviceId(),JSON.stringify(x));}catch(e){}}
  async function postState(type,x,msg){try{await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:deviceId(),sender_id:deviceId(),sender_name:'호스트',message:msg,message_type:type+':'+x.vid})});}catch(e){}}

  function ensureStyle(){
    if(document.getElementById('ktGuestPhotoRequestStyle'))return;
    var s=document.createElement('style');s.id='ktGuestPhotoRequestStyle';
    s.textContent=''
      +'#ktGuestPhotoRequestRail{position:absolute!important;right:7px!important;top:132px!important;z-index:120!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:7px!important;max-height:52%!important;overflow-y:auto!important;padding:5px!important;border-radius:18px!important;background:rgba(5,8,12,.42)!important;backdrop-filter:blur(3px)!important;scrollbar-width:none!important;pointer-events:auto!important}'
      +'#ktGuestPhotoRequestRail::-webkit-scrollbar{display:none!important}'
      +'.kt-guest-photo-request{position:relative!important;width:52px!important;height:52px!important;flex:0 0 52px!important;border:2px solid #59ddff!important;border-radius:50%!important;background:#11151c!important;color:#fff!important;padding:0!important;overflow:visible!important;box-shadow:0 0 11px #35d8ff88!important;display:grid!important;place-items:center!important;touch-action:manipulation!important}'
      +'.kt-guest-photo-request img{width:100%!important;height:100%!important;border-radius:50%!important;object-fit:cover!important;display:block!important}'
      +'.kt-guest-photo-request .fallback{font-size:25px!important;line-height:1!important}'
      +'.kt-guest-photo-request .name{position:absolute!important;right:58px!important;top:50%!important;transform:translateY(-50%)!important;max-width:105px!important;padding:4px 7px!important;border-radius:9px!important;background:rgba(7,10,15,.94)!important;border:1px solid #4fcff088!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:0 2px 10px #0008!important}'
      +'.kt-guest-photo-request .dot{position:absolute!important;right:-2px!important;bottom:-2px!important;width:14px!important;height:14px!important;border-radius:50%!important;background:#39e575!important;border:2px solid #071018!important}'
      +'#ktGuestPhotoChoice{position:absolute!important;right:66px!important;top:132px!important;z-index:121!important;display:flex!important;gap:5px!important;align-items:center!important;padding:6px!important;border-radius:12px!important;background:rgba(7,9,13,.98)!important;border:1px solid #454954!important;box-shadow:0 4px 18px #000b!important;pointer-events:auto!important}'
      +'#ktGuestPhotoChoice button{height:31px!important;padding:0 9px!important;border-radius:9px!important;border:1px solid #444!important;background:#17191f!important;color:#fff!important;font-size:9px!important;font-weight:950!important}'
      +'#ktGuestPhotoChoice .approve{border-color:#52dfff!important;background:#073342!important}#ktGuestPhotoChoice .block{border-color:#ff657e!important;background:#43131c!important}'
      +'@media(max-width:390px){#ktGuestPhotoRequestRail{right:4px!important;top:122px!important}.kt-guest-photo-request{width:46px!important;height:46px!important;flex-basis:46px!important}.kt-guest-photo-request .name{right:51px!important;max-width:88px!important;font-size:8px!important}#ktGuestPhotoChoice{right:56px!important;top:122px!important;gap:3px!important;padding:4px!important}#ktGuestPhotoChoice button{height:28px!important;padding:0 7px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function closeChoice(){var b=document.getElementById('ktGuestPhotoChoice');if(b)b.remove();}
  function removeRail(){var r=document.getElementById('ktGuestPhotoRequestRail');if(r)r.remove();closeChoice();}
  function openChoice(x){
    var oldLine=document.querySelector('.ktGuestPendingLine[data-viewer-id="'+String(x.vid).replace(/"/g,'\\"')+'"]');
    if(oldLine){try{oldLine.click();return;}catch(e){}}
    closeChoice();var room=document.querySelector('.ktg13-room');if(!room)return;
    var b=document.createElement('div');b.id='ktGuestPhotoChoice';
    b.innerHTML='<button type="button" class="approve">올리기</button><button type="button" class="reject">거부하기</button><button type="button" class="block">차단하기</button>';
    b.querySelector('.approve').onclick=function(e){e.preventDefault();e.stopPropagation();closeChoice();if(typeof window.ktApproveGuest==='function')window.ktApproveGuest(x.vid,x.name,null);};
    b.querySelector('.reject').onclick=async function(e){e.preventDefault();e.stopPropagation();closeChoice();await postState('guest_rejected',x,'❌ '+x.name+'님 참여 신청을 거부했습니다.');setTimeout(tick,180);};
    b.querySelector('.block').onclick=async function(e){e.preventDefault();e.stopPropagation();closeChoice();setBlocked(x.vid,x.name);await postState('guest_blocked',x,'⛔ '+x.name+'님 참여 신청을 차단했습니다.');setTimeout(tick,180);};
    room.appendChild(b);
  }

  async function render(pending){
    ensureStyle();var room=document.querySelector('.ktg13-room');if(!room){removeRail();return;}
    if(!pending.length){removeRail();return;}
    var rail=document.getElementById('ktGuestPhotoRequestRail');if(!rail){rail=document.createElement('div');rail.id='ktGuestPhotoRequestRail';room.appendChild(rail);}
    var infos=await Promise.all(pending.map(function(x){return getPhoto(x.vid,x.name);}));
    rail.innerHTML='';
    pending.forEach(function(x,i){var p=infos[i]||{},btn=document.createElement('button');btn.type='button';btn.className='kt-guest-photo-request';btn.setAttribute('aria-label',(x.name||'게스트')+' 참여 신청');
      var photo=String(p.photo||'');btn.innerHTML=(photo&&(/^data:image/.test(photo)||/^https?:/.test(photo))?'<img src="'+esc(photo)+'" alt="">':'<span class="fallback">👤</span>')+'<span class="name">'+esc(x.name||p.name||'게스트')+' 신청</span><span class="dot"></span>';
      btn.onclick=function(e){e.preventDefault();e.stopPropagation();openChoice(x);};rail.appendChild(btn);
    });
  }

  async function tick(){
    wrapGuestRequest();
    if(document.documentElement.classList.contains('kt-remote-viewing')||!document.querySelector('.ktg13-room')){removeRail();return;}
    var hid=deviceId();if(!hid)return;
    try{
      var rr=await req('ktalk_live_rooms?select=started_at&host_id=eq.'+enc(hid)+'&active=eq.true&order=started_at.desc&limit=1');var room=rr&&rr[0];if(!room){removeRail();return;}
      var path='ktalk_live_messages?select=sender_id,sender_name,message_type,created_at&host_id=eq.'+enc(hid);if(room.started_at)path+='&created_at=gte.'+enc(room.started_at);path+='&order=created_at.desc&limit=120';
      var rows=await req(path),latest={};(rows||[]).forEach(function(m){var t=String(m.message_type||''),vid='';
        if(t.indexOf('guest_request:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'request',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'approved',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_rejected:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'rejected',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_blocked:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'blocked',name:String(m.sender_name||'게스트')};}
      });
      var blocked=blockedMap(),pending=[];Object.keys(latest).forEach(function(vid){if(latest[vid].state==='request'&&!blocked[vid])pending.push({vid:vid,name:latest[vid].name||'게스트'});});
      await render(pending);
    }catch(e){}
  }

  ensureStyle();timer=setInterval(tick,900);setTimeout(tick,180);setInterval(wrapGuestRequest,700);
  window.addEventListener('pagehide',function(){clearInterval(timer);});
})();
