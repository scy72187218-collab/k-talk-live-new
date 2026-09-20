/* K-Talk 13명 방송: 호스트 채팅에 참여 신청을 직접 표시하고 올리기/거부하기/차단하기만 제공. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktGuestRequestHostActionFix)return;
  window.__ktGuestRequestHostActionFix=true;

  var BASE='',KEY='',timer=null;
  var MEM_INTERACT='/api/live-interaction-memory',MEM_BEACON='/api/live-beacon-memory';

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}return id;}

  async function ensureConfig(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260914-hostaction',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text();
      var bm=t.match(/var BASE='([^']+)'/),km=t.match(/var KEY='([^']+)'/);
      if(!bm||!km)return false;
      BASE=bm[1];KEY=km[1];return true;
    }catch(e){return false;}
  }
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  function qeq(sp,name){var v=String(sp.get(name)||'');return v.indexOf('eq.')===0?v.slice(3):v;}
  async function memReq(path,opt){
    opt=opt||{};var u=new URL('https://kt.local/'+path),sp=u.searchParams,method=String(opt.method||'GET').toUpperCase();
    var table=u.pathname.replace(/^\//,''),body={};try{body=opt.body?JSON.parse(opt.body):{};}catch(e){}
    if(table==='ktalk_live_rooms'&&method==='GET'){
      var r=await fetch(MEM_BEACON+'?t='+Date.now(),{cache:'no-store'}),j=await r.json(),rows=Array.isArray(j&&j.rooms)?j.rooms:[];
      var hid=qeq(sp,'host_id');if(hid)rows=rows.filter(function(x){return String(x.host_id||'')===hid;});
      return rows.map(function(x){return {host_id:x.host_id,started_at:new Date(Date.now()-30*60*1000).toISOString(),active:true,updated_at:x.updated_at};});
    }
    if(table==='ktalk_live_messages'&&method==='POST'){
      await fetch(MEM_INTERACT+'?t='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'message',host_id:String(body.host_id||''),sender_id:String(body.sender_id||''),sender_name:String(body.sender_name||'호스트'),message:String(body.message||''),message_type:String(body.message_type||'chat')})});
      return null;
    }
    if(table==='ktalk_live_messages'&&method==='GET'){
      var hid=qeq(sp,'host_id'),r=await fetch(MEM_INTERACT+'?action=messages&host_id='+enc(hid)+'&t='+Date.now(),{cache:'no-store'}),j=await r.json();
      var rows=Array.isArray(j&&j.messages)?j.messages:[];
      rows.sort(function(a,b){return (Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0);});
      return rows;
    }
    throw new Error('memory unsupported');
  }
  async function req(path,opt){
    if(Number(window.__ktPrimaryLiveDbDownUntil||0)>Date.now())return memReq(path,opt);
    if(!(await ensureConfig()))return memReq(path,opt);
    opt=opt||{};
    var ctrl=typeof AbortController!=='undefined'?new AbortController():null,timer=ctrl?setTimeout(function(){ctrl.abort();},650):null;
    try{
      var next=Object.assign({},opt);next.headers=headers(next.headers);if(!next.cache)next.cache='no-store';if(ctrl)next.signal=ctrl.signal;
      var r=await fetch(BASE+path,next);if(timer)clearTimeout(timer);
      if(!r.ok)throw new Error('api '+r.status);
      window.__ktPrimaryLiveDbDownUntil=0;
      if(r.status===204)return null;
      var t=await r.text();return t?JSON.parse(t):[];
    }catch(e){
      if(timer)clearTimeout(timer);
      window.__ktPrimaryLiveDbDownUntil=Date.now()+120000;
      return memReq(path,opt);
    }
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
    var s=document.createElement('style');s.id='ktGuestHostActionStyle';
    s.textContent=''
      +'.ktg13-mid{position:relative!important}'
      +'.ktg13-chat .ktGuestPendingLine{pointer-events:auto!important;cursor:pointer!important;margin-top:3px!important;padding:2px 5px!important;border-radius:7px!important;background:rgba(5,35,46,.78)!important;border:1px solid #55dfff88!important;box-shadow:0 0 7px #36d6ff33!important}'
      +'.ktg13-chat .ktGuestPendingLine b{color:#7deaff!important}.ktg13-chat .ktGuestPendingLine span{color:#fff!important}'
      +'#ktGuestHostChoice{position:absolute!important;left:6px!important;bottom:76px!important;z-index:90!important;display:flex!important;align-items:center!important;gap:5px!important;padding:5px!important;border:1px solid #454954!important;border-radius:12px!important;background:rgba(7,9,13,.98)!important;box-shadow:0 4px 18px #000b!important;pointer-events:auto!important}'
      +'#ktGuestHostChoice .kt-choice-name{max-width:92px!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;padding:0 3px!important}'
      +'#ktGuestHostChoice button{height:30px!important;border-radius:10px!important;padding:0 9px!important;font-size:9px!important;font-weight:950!important;color:#fff!important;border:1px solid #444!important;background:#17191f!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2147483001!important}'
      +'#ktGuestHostChoice .approve{border-color:#52dfff!important;background:#073342!important}'
      +'#ktGuestHostChoice .reject{border-color:#a8acb7!important;background:#292b31!important}'
      +'#ktGuestHostChoice .block{border-color:#ff657e!important;background:#43131c!important}'
      +'@media(max-width:390px){#ktGuestHostChoice{gap:3px!important;padding:4px!important;bottom:74px!important}#ktGuestHostChoice button{height:28px!important;padding:0 7px!important;font-size:8px!important}#ktGuestHostChoice .kt-choice-name{max-width:72px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function closeChoice(){var b=document.getElementById('ktGuestHostChoice');if(b)b.remove();}
  function clearPendingLines(){document.querySelectorAll('.ktGuestPendingLine[data-kt-managed="1"]').forEach(function(x){x.remove();});}

  function approve(x){
    if(typeof window.ktApproveGuest==='function'){
      closeChoice();try{window.ktApproveGuest(x.vid,x.name,null);}catch(e){}setTimeout(tick,250);return;
    }
    var tries=0,t=setInterval(function(){tries++;if(typeof window.ktApproveGuest==='function'){clearInterval(t);closeChoice();try{window.ktApproveGuest(x.vid,x.name,null);}catch(e){}setTimeout(tick,250);}else if(tries>8){clearInterval(t);}},250);
  }
  async function reject(x){closeChoice();await postState('guest_rejected',x,'❌ '+(x.name||'게스트')+'님 참여 신청을 거부했습니다.');setTimeout(tick,180);}
  async function block(x){closeChoice();setBlocked(x.vid,x.name);await postState('guest_blocked',x,'⛔ '+(x.name||'게스트')+'님 참여 신청을 차단했습니다.');setTimeout(tick,180);}

  function openChoice(x){
    ensureStyle();closeChoice();
    var mid=document.querySelector('.ktg13-mid');if(!mid)return;
    var box=document.createElement('div');box.id='ktGuestHostChoice';
    box.dataset.viewerId=String(x.vid||'');
    box.dataset.viewerName=String(x.name||'게스트');
    box.innerHTML='<span class="kt-choice-name">👤 '+esc(x.name||'게스트')+'</span>'
      +'<button type="button" class="approve">올리기</button>'
      +'<button type="button" class="reject">거부하기</button>'
      +'<button type="button" class="block">차단하기</button>';
    box.querySelector('.approve').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}approve(x);};
    box.querySelector('.reject').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}reject(x);};
    box.querySelector('.block').onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}block(x);};
    mid.appendChild(box);
  }

  function syncPendingLines(pending){
    var list=document.getElementById('ktg13ChatList')||document.querySelector('.ktg13-chat');
    if(!list){clearPendingLines();return;}
    var wanted=pending.map(function(x){return x.vid;}).sort().join('|');
    var existing=[].slice.call(list.querySelectorAll('.ktGuestPendingLine[data-kt-managed="1"]'));
    var have=existing.map(function(x){return x.getAttribute('data-viewer-id')||'';}).sort().join('|');
    if(wanted===have&&existing.length===pending.length)return;
    existing.forEach(function(x){x.remove();});
    pending.forEach(function(x){
      var row=document.createElement('div');
      row.className='ktg13-chat-line ktGuestPendingLine';
      row.setAttribute('data-kt-managed','1');row.setAttribute('data-viewer-id',x.vid);
      row.innerHTML='<b>👤 '+esc(x.name||'게스트')+'</b><span> 참여 신청 · 눌러서 선택</span>';
      row.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}openChoice(x);};
      list.appendChild(row);
    });
    try{list.scrollTop=list.scrollHeight;}catch(e){}
  }

  /* 9명방 호스트의 올리기/거부/차단 버튼을 터치 즉시 처리.
     클릭 이벤트가 채팅/오버레이에 먹히는 경우를 막는다. */
  var __ktGuestChoiceLastTap=0;
  function directChoiceTap(e){
    var btn=e.target&&e.target.closest?e.target.closest('#ktGuestHostChoice button'):null;
    if(!btn)return;
    var now=Date.now();
    if(now-__ktGuestChoiceLastTap<450){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}
      return;
    }
    var box=btn.closest('#ktGuestHostChoice');
    if(!box)return;
    var x={vid:String(box.dataset.viewerId||''),name:String(box.dataset.viewerName||'게스트')};
    if(!x.vid)return;
    __ktGuestChoiceLastTap=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}
    if(btn.classList.contains('approve')){approve(x);return;}
    if(btn.classList.contains('reject')){reject(x);return;}
    if(btn.classList.contains('block')){block(x);return;}
  }
  window.__ktGuestChoiceDirectTap20260919=true;
  window.addEventListener('pointerdown',directChoiceTap,true);
  window.addEventListener('touchstart',directChoiceTap,{capture:true,passive:false});

  async function tick(){
    ensureStyle();
    if(!document.querySelector('.ktg13-room')){clearPendingLines();closeChoice();return;}
    var hid=deviceId();if(!hid)return;
    try{
      var roomRows=await req('ktalk_live_rooms?select=started_at&host_id=eq.'+enc(hid)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=roomRows&&roomRows[0];if(!room){clearPendingLines();closeChoice();return;}
      var path='ktalk_live_messages?select=sender_id,sender_name,message_type,created_at&host_id=eq.'+enc(hid);
      if(room.started_at)path+='&created_at=gte.'+enc(room.started_at);
      path+='&order=created_at.desc&limit=120';
      var rows=await req(path),latest={};
      (rows||[]).forEach(function(m){
        var t=String(m.message_type||''),vid='';
        if(t.indexOf('guest_request:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'request',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'approved',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_cancelled:')===0){vid=t.slice(16);if(vid&&!latest[vid])latest[vid]={state:'cancelled',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_rejected:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'rejected',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_blocked:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'blocked',name:String(m.sender_name||'게스트')};}
      });
      var blocked=blockedMap(),pending=[];
      Object.keys(latest).forEach(function(vid){if(latest[vid].state==='request'&&!blocked[vid])pending.push({vid:vid,name:latest[vid].name||'게스트'});});
      syncPendingLines(pending);
    }catch(e){}
  }

  timer=setInterval(tick,700);setTimeout(tick,120);
  window.addEventListener('pagehide',function(){clearInterval(timer);});
})();
