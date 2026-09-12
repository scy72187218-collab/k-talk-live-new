/* K-Talk 동영상/방송 화면: 왼쪽 위에 '📶 대중교통' 표시. 공유 버튼과 겹치지 않음. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktWifiStatusIndicatorInstalled)return;
  window.__ktWifiStatusIndicatorInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktWifiStatusIndicatorStyle'))return;
    var s=document.createElement('style');
    s.id='ktWifiStatusIndicatorStyle';
    s.textContent=''
      +'#ktWifiStatusIndicator{position:fixed!important;left:10px!important;right:auto!important;top:12px!important;bottom:auto!important;z-index:2147483000!important;display:inline-flex!important;align-items:center!important;gap:5px!important;height:30px!important;padding:0 10px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.30)!important;background:rgba(10,10,14,.82)!important;color:#fff!important;box-shadow:0 4px 14px rgba(0,0,0,.35)!important;font-size:11px!important;font-weight:900!important;line-height:1!important;white-space:nowrap!important;opacity:1!important;pointer-events:auto!important;touch-action:manipulation!important;transition:opacity .16s ease,transform .16s ease!important}'
      +'#ktWifiStatusIndicator .kt-net-icon{font-size:15px!important;line-height:1!important}'
      +'#ktWifiStatusIndicator.kt-hide{opacity:0!important;transform:scale(.92)!important;pointer-events:none!important}'
      +'@media(max-width:390px){#ktWifiStatusIndicator{left:8px!important;right:auto!important;top:10px!important;bottom:auto!important;height:28px!important;padding:0 8px!important;font-size:10px!important}}'
      +'@media(min-width:700px){#ktWifiStatusIndicator{left:14px!important;right:auto!important;top:14px!important;bottom:auto!important;height:32px!important;font-size:12px!important}}';
    document.head.appendChild(s);
  }

  function show(){
    ensureStyle();
    var old=document.getElementById('ktWifiStatusIndicator');
    if(old)return old;
    var el=document.createElement('button');
    el.type='button';
    el.id='ktWifiStatusIndicator';
    el.setAttribute('aria-label','대중교통 와이파이 표시 닫기');
    el.innerHTML='<span class="kt-net-icon">📶</span><span>대중교통</span>';
    el.addEventListener('click',function(){
      el.classList.add('kt-hide');
      setTimeout(function(){if(el&&el.parentNode)el.remove();},170);
    });
    document.body.appendChild(el);
    return el;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});
  else show();
})();

/* 방송 선택 화면의 '15명 방송' 항목만 제거. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktRemove15RoomButtonOnlyInstalled)return;
  window.__ktRemove15RoomButtonOnlyInstalled=true;

  function removeOnly15(){
    var roots=document.querySelectorAll('.live-prep,.kt-creator-room-shortcuts');
    roots.forEach(function(root){
      [].slice.call(root.querySelectorAll('button,.room-switch,[role="button"]')).forEach(function(btn){
        var text=String(btn.textContent||'').replace(/\s+/g,'').trim();
        if(text.indexOf('15명')>-1){
          try{btn.remove();}catch(e){}
        }
      });
    });
  }

  removeOnly15();
  [20,50,100,150,250,350,500,700,900,1200,1800].forEach(function(ms){setTimeout(removeOnly15,ms);});
  try{
    var mo=new MutationObserver(function(){removeOnly15();});
    mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();

/* 2026-09-12 방송 연결 복구 전용: 방송을 열었는데 방송목록에 안 뜨거나 다른 기기가 못 들어오는 경우만 보강. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveConnectionRecoveryInstalled)return;
  window.__ktLiveConnectionRecoveryInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXAiLCJyZWYiOiJ6dXB3YmZtYWN3emV4eXZ6bmx6cSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg4NDYxMDc2LCJleHAiOjIxMDQwMzcwNzZ9.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var roomId='',ownRoom=false,heartbeat=null,signalTimer=null,peers={},miss=0,working=false;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('live recovery '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function now(){return new Date().toISOString();}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function stream(){try{return window.state&&state.stream?state.stream:null;}catch(e){return null;}}
  function liveStream(){
    var s=stream();
    try{return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }
  function isLiveScreen(){
    return !!(document.getElementById('ktLiveVideo')&&document.getElementById('ktLiveClock')&&liveStream());
  }
  function profile(){
    var name='K-Talk 방송자',photo='';
    try{if(window.ktProfileLoad){var p=window.ktProfileLoad()||{};name=String(p.name||name);photo=String(p.photo||'');}}catch(e){}
    try{if((!name||name==='K-Talk 방송자')&&window.state)name=String(state.profileName||state.currentProfileName||state.accountName||name);}catch(e){}
    if(photo&&photo.length>240000)photo='';
    return {name:name||'K-Talk 방송자',photo:photo};
  }
  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    try{type=String((window.state&&state.liveRoomType)||'solo');name=String((window.state&&state.liveRoomName)||'1인 방송');}catch(e){}
    if(type==='group')type='group13';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||5000);
      function finish(){if(done)return;done=true;clearTimeout(t);pc.removeEventListener('icegatheringstatechange',on);resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }

  async function processSignals(){
    if(!ownRoom||!roomId||!isLiveScreen())return;
    var hostId=deviceId(),s=stream();if(!s)return;
    try{
      var rows=await req('ktalk_webrtc_sessions?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=created_at.asc&limit=30');
      for(var i=0;i<(rows||[]).length;i++){
        var x=rows[i],entry=peers[x.id];
        if(!entry&&x.offer_sdp==='pending'){
          var pc=new RTCPeerConnection(ICE);peers[x.id]={pc:pc,remoteSet:false};entry=peers[x.id];
          s.getTracks().forEach(function(t){try{pc.addTrack(t,s);}catch(e){}});
          pc.onconnectionstatechange=(function(id,p){return function(){if(['failed','closed','disconnected'].indexOf(p.connectionState)>-1&&peers[id]){try{p.close();}catch(e){}delete peers[id];}};})(x.id,pc);
          try{
            var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
            await pc.setLocalDescription(offer);await waitIce(pc,5000);
            await req('ktalk_webrtc_sessions?id=eq.'+enc(x.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({offer_sdp:pc.localDescription.sdp,updated_at:now()})});
          }catch(e){try{pc.close();}catch(z){}delete peers[x.id];}
        }else if(entry&&x.answer_sdp&&!entry.remoteSet){
          try{await entry.pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});entry.remoteSet=true;}catch(e){}
        }
      }
    }catch(e){}
  }

  async function ensureRoom(){
    if(working||roomId||!isLiveScreen())return;
    working=true;
    var hostId=deviceId(),p=profile(),r=roomInfo(),stamp=now();
    try{
      var existing=await req('ktalk_live_rooms?select=id,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      if(existing&&existing[0]&&Date.now()-new Date(existing[0].updated_at).getTime()<50000){
        roomId=existing[0].id;ownRoom=false;
      }else{
        await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
        var rows=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
        roomId=rows&&rows[0]?rows[0].id:'';ownRoom=!!roomId;
      }
      if(roomId){
        clearInterval(heartbeat);clearInterval(signalTimer);
        heartbeat=setInterval(async function(){
          if(!roomId||!isLiveScreen())return;
          try{await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:now()})});}catch(e){}
        },9000);
        if(ownRoom){signalTimer=setInterval(processSignals,1200);processSignals();}
        try{if(window.ktRefreshLiveCards)setTimeout(window.ktRefreshLiveCards,100);}catch(e){}
      }
    }catch(e){roomId='';ownRoom=false;}
    working=false;
  }

  async function stopRoom(){
    if(!roomId)return;
    var id=roomId,hostId=deviceId();roomId='';ownRoom=false;
    clearInterval(heartbeat);clearInterval(signalTimer);heartbeat=signalTimer=null;
    Object.keys(peers).forEach(function(k){try{peers[k].pc.close();}catch(e){}});peers={};
    try{await req('ktalk_live_rooms?id=eq.'+enc(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
    try{await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
    try{if(window.ktRefreshLiveCards)setTimeout(window.ktRefreshLiveCards,100);}catch(e){}
  }

  setInterval(function(){
    if(isLiveScreen()){
      miss=0;
      if(!roomId)ensureRoom();
    }else if(roomId){
      miss++;
      if(miss>=2)stopRoom();
    }
  },1000);

  window.addEventListener('pagehide',function(){
    if(!roomId)return;
    try{fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:now()}),keepalive:true});}catch(e){}
  });
})();
