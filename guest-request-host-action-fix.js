/* K-Talk 13명 방송: 참여 신청을 누른 호스트에게 올리기/거부하기/차단하기만 제공. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktGuestRequestHostActionFix)return;
  window.__ktGuestRequestHostActionFix=true;

  var BASE='',KEY='',timer=null,currentPending=[];

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  async function ensureConfig(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260914-hostaction',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text();
      var bm=t.match(/var BASE='([^']+)'/),km=t.match(/var KEY='([^']+)'/);
      if(!bm||!km)return false;
      BASE=bm[1];KEY=km[1];
      return true;
    }catch(e){return false;}
  }
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){
    if(!(await ensureConfig()))throw new Error('config');
    opt=opt||{};opt.headers=headers(opt.headers);if(!opt.cache)opt.cache='no-store';
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();
    return t?JSON.parse(t):[];
  }
  function blockedMap(){var x={};try{x=JSON.parse(localStorage.getItem('kt_guest_blocked:'+deviceId())||'{}')||{};}catch(e){}return x;}
  function setBlocked(vid,name){var x=blockedMap();x[String(vid)]=String(name||'게스트');try{localStorage.setItem('kt_guest_blocked:'+deviceId(),JSON.stringify(x));}catch(e){}}
  async function postState(type,x,message){
    try{
      await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:deviceId(),sender_id:deviceId(),sender_name:'호스트',message:message,message_type:type+':'+x.vid})});
      return true;
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktGuestHostActionStyle'))return;
    var s=document.createElement('style');
    s.id='ktGuestHostActionStyle';
    s.textContent=''
      +'.ktg13-mid{position:relative!important}'
      +'#ktGuestHostActionBar{position:absolute!important;left:6px!important;bottom:4px!important;z-index:40!important;display:flex!important;gap:5px!important;max-width:62%!important;overflow-x:auto!important;pointer-events:auto!important;scrollbar-width:none!important}'
      +'#ktGuestHostActionBar::-webkit-scrollbar{display:none!important}'
      +'.ktGuestHostActionBtn{flex:0 0 auto!important;height:30px!important;max-width:142px!important;padding:0 10px!important;border:1px solid #57e4ff!important;border-radius:15px!important;background:#07151eef!important;color:#fff!important;font-size:9px!important;font-weight:950!important;box-shadow:0 0 9px #38d8ff66!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.ktGuestHostActionBtn b{color:#7deaff!important}'
      +'#ktGuestHostChoice{position:absolute!important;left:6px!important;bottom:38px!important;z-index:80!important;display:flex!important;align-items:center!important;gap:5px!important;padding:5px!important;border:1px solid #454954!important;border-radius:12px!important;background:rgba(7,9,13,.97)!important;box-shadow:0 4px 18px #000b!important;pointer-events:auto!important}'
      +'#ktGuestHostChoice .kt-choice-name{max-width:92px!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;padding:0 3px!important}'
      +'#ktGuestHostChoice button{height:30px!important;border-radius:10px!important;padding:0 9px!important;font-size:9px!important;font-weight:950!important;color:#fff!important;border:1px solid #444!important;background:#17191f!important}'
      +'#ktGuestHostChoice .approve{border-color:#52dfff!important;background:#073342!important}'
      +'#ktGuestHostChoice .reject{border-color:#a8acb7!important;background:#292b31!important}'
      +'#ktGuestHostChoice .block{border-color:#ff657e!important;background:#43131c!important}'
      +'.ktg13-chat-line[data-kt-guest-request="1"]{pointer-events:auto!important;cursor:pointer!important;border-radius:7px!important}'
      +'@media(max-width:390px){#ktGuestHostActionBar{max-width:66%!important}.ktGuestHostActionBtn{height:28px!important;max-width:120px!important;font-size:8px!important}#ktGuestHostChoice{gap:3px!important;padding:4px!important;bottom:35px!important}#ktGuestHostChoice button{height:28px!important;padding:0 7px!important;font-size:8px!important}#ktGuestHostChoice .kt-choice-name{max-width:72px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function removeBar(){var b=document.getElementById('ktGuestHostActionBar');if(b)b.remove();}
  function closeChoice(){var b=document.getElementById('ktGuestHostChoice');if(b)b.remove();}

  function approve(x){
    if(typeof window.ktApproveGuest==='function'){
      closeChoice();
      try{window.ktApproveGuest(x.vid,x.name,null);}catch(e){}
      setTimeout(tick,350);
      return;
    }
    var tries=0,t=setInterval(function(){tries++;if(typeof window.ktApproveGuest==='function'){clearInterval(t);closeChoice();try{window.ktApproveGuest(x.vid,x.name,null);}catch(e){}setTimeout(tick,350);}else if(tries>8){clearInterval(t);}},250);
  }
  async function reject(x){
    closeChoice();
    await postState('guest_rejected',x,'❌ '+(x.name||'게스트')+'님 참여 신청을 거부했습니다.');
    setTimeout(tick,200);
  }
  async function block(x){
    closeChoice();setBlocked(x.vid,x.name);
    await postState('guest_blocked',x,'⛔ '+(x.name||'게스트')+'님 참여 신청을 차단했습니다.');
    setTimeout(tick,200);
  }
  function openChoice(x){
    ensureStyle();closeChoice();
    var mid=document.querySelector('.ktg13-mid');if(!mid)return;
    var box=document.createElement('div');box.id='ktGuestHostChoice';
    box.innerHTML='<span class="kt-choice-name">👤 '+esc(x.name||'게스트')+'</span>'
      +'<button type="button" class="approve">올리기</button>'
      +'<button type="button" class="reject">거부하기</button>'
      +'<button type="button" class="block">차단하기</button>';
    box.querySelector('.approve').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}approve(x);};
    box.querySelector('.reject').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}reject(x);};
    box.querySelector('.block').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}block(x);};
    mid.appendChild(box);
  }

  function bindChatRequests(pending){
    var rows=[].slice.call(document.querySelectorAll('#ktg13ChatList .ktg13-chat-line,.ktg13-chat .ktg13-chat-line'));
    rows.forEach(function(row){
      row.removeAttribute('data-kt-guest-request');row.onclick=null;
      var text=String(row.textContent||'');
      for(var i=0;i<pending.length;i++){
        var x=pending[i],name=String(x.name||'');
        if(name&&text.indexOf(name)>=0&&(text.indexOf('참여')>=0||text.indexOf('신청')>=0)){
          row.setAttribute('data-kt-guest-request','1');
          row.onclick=(function(item){return function(e){if(e){e.preventDefault();e.stopPropagation();}openChoice(item);};})(x);
          break;
        }
      }
    });
  }

  function render(pending){
    currentPending=pending.slice();
    var mid=document.querySelector('.ktg13-mid');
    if(!mid||!pending.length){removeBar();closeChoice();bindChatRequests([]);return;}
    var bar=document.getElementById('ktGuestHostActionBar');
    if(!bar){bar=document.createElement('div');bar.id='ktGuestHostActionBar';mid.appendChild(bar);}
    bar.innerHTML='';
    pending.forEach(function(x){
      var btn=document.createElement('button');
      btn.type='button';btn.className='ktGuestHostActionBtn';
      btn.innerHTML='👤 <b>'+esc(x.name)+'</b> 참여신청';
      btn.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}openChoice(x);};
      bar.appendChild(btn);
    });
    bindChatRequests(pending);
  }

  async function tick(){
    ensureStyle();
    if(!document.querySelector('.ktg13-room')){removeBar();closeChoice();return;}
    var hid=deviceId();if(!hid)return;
    try{
      var roomRows=await req('ktalk_live_rooms?select=started_at&host_id=eq.'+enc(hid)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=roomRows&&roomRows[0];if(!room){removeBar();closeChoice();return;}
      var path='ktalk_live_messages?select=sender_id,sender_name,message_type,created_at&host_id=eq.'+enc(hid);
      if(room.started_at)path+='&created_at=gte.'+enc(room.started_at);
      path+='&order=created_at.desc&limit=100';
      var rows=await req(path),latest={};
      (rows||[]).forEach(function(m){
        var t=String(m.message_type||''),vid='';
        if(t.indexOf('guest_request:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'request',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'approved',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_rejected:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'rejected',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_blocked:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'blocked',name:String(m.sender_name||'게스트')};}
      });
      var blocked=blockedMap(),pending=[];
      Object.keys(latest).forEach(function(vid){if(latest[vid].state==='request'&&!blocked[vid])pending.push({vid:vid,name:latest[vid].name||'게스트'});});
      render(pending);
    }catch(e){}
  }

  timer=setInterval(tick,900);setTimeout(tick,150);
  window.addEventListener('pagehide',function(){clearInterval(timer);});
})();
