/* K-Talk: 승인된 게스트끼리도 서로의 카메라가 각 게스트 화면 빈 칸에 보이게 함.
   기존 호스트/내 카메라/채팅/방송 기능은 건드리지 않음. */
(function(){
  if(window.__ktApprovedGuestPeerVideoSync20260918)return;
  window.__ktApprovedGuestPeerVideoSync20260918=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};\n  function ktIceConfig20260921(){return window.ktGetRtcConfig?window.ktGetRtcConfig():ICE;}
  var peers={};
  var ticking=false;
  var lastHost='';
  var lastSelf='';
  var absentSince=0;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('peer api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function nowIso(){return new Date().toISOString();}
  function deviceId(){
    var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  function selfViewerId(){var d=deviceId();return d?'viewer_'+d:'';}
  function live(st){
    try{return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));}
    catch(e){return false;}
  }
  function selfStream(){
    var host=window.__ktRemoteHostStream||null;
    var direct=window.__ktApprovedGuestSelfStream||null;
    if(live(direct)&&direct!==host)return direct;
    var list=[
      document.querySelector('.kt-guest-hostlike-room .kgh-cell.self video'),
      document.querySelector('.kt-approved-guest-grid .kt-approved-guest-cell.self video'),
      document.querySelector('.kt-guest-room-grid .kt-guest-room-cell.self video'),
      document.getElementById('ktRemoteGuestSelfVideo'),
      document.getElementById('ktRemoteLiveVideo')
    ].filter(Boolean);
    for(var i=0;i<list.length;i++){
      var st=list[i].srcObject||null;
      if(live(st)&&st!==host)return st;
    }
    return null;
  }
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||5000);
      function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }
  function pairKey(a,b){
    var x=[String(a||''),String(b||'')].sort();
    return 'mesh:'+x[0]+'|'+x[1];
  }
  function safeName(v){return String(v||'게스트').slice(0,24);}
  function peerCellById(grid,peerId){
    if(!grid)return null;
    var cells=[].slice.call(grid.querySelectorAll('.kgh-cell[data-kt-peer-viewer]'));
    for(var i=0;i<cells.length;i++)if(String(cells[i].dataset.ktPeerViewer||'')===String(peerId||''))return cells[i];
    return null;
  }
  var debugSent={};
  function debug(stage,detail){
    if(debugSent[stage])return;debugSent[stage]=1;
    try{
      req('ktalk_live_debug',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({
        device_id:deviceId(),stage:'peer_'+stage,detail:String(detail||'').slice(0,300),created_at:nowIso()
      })}).catch(function(){});
    }catch(e){}
  }
  debug('loaded','script');

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestPeerVideoSyncStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestPeerVideoSyncStyle';
    s.textContent=''
      +'.kgh-cell.kt-peer-guest,.kt-approved-guest-cell.kt-peer-guest,.kt-guest-room-cell.kt-peer-guest{position:relative!important;background:#090b0f!important;color:#fff!important;overflow:hidden!important}'
      +'.kgh-cell.kt-peer-guest video,.kt-approved-guest-cell.kt-peer-guest video,.kt-guest-room-cell.kt-peer-guest video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center center!important;background:#090b0f!important;transform:none!important}'
      +'.kgh-cell.kt-peer-guest .kgh-label,.kt-approved-guest-cell.kt-peer-guest label,.kt-guest-room-cell.kt-peer-guest label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:4!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}';
    document.head.appendChild(s);
  }

  function gridInfo(){
    var g=document.querySelector('.kt-guest-hostlike-room .kgh-main');
    if(g)return {grid:g,cellClass:'kgh-cell',labelTag:'span',labelClass:'kgh-label'};
    g=document.querySelector('.kt-approved-guest-grid');
    if(g)return {grid:g,cellClass:'kt-approved-guest-cell',labelTag:'label',labelClass:''};
    g=document.querySelector('.kt-guest-room-grid');
    if(g)return {grid:g,cellClass:'kt-guest-room-cell',labelTag:'label',labelClass:''};
    return null;
  }

  function peerCell(peerId,name){
    var info=gridInfo();
    if(!info)return null;
    var grid=info.grid;
    var current=peerCellById(grid,peerId);
    if(current)return current;
    var cells=[].slice.call(grid.querySelectorAll('.'+info.cellClass));
    var free=cells.find(function(cell){
      return !cell.classList.contains('host')&&!cell.classList.contains('self')&&!cell.dataset.ktPeerViewer;
    });
    if(!free)return null;
    free.dataset.ktPeerViewer=peerId;
    free.classList.add('kt-peer-guest');
    free.textContent='';
    var v=document.createElement('video');
    v.autoplay=true;v.playsInline=true;v.muted=true;
    v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
    var l=document.createElement(info.labelTag);
    if(info.labelClass)l.className=info.labelClass;
    l.textContent=safeName(name);
    free.appendChild(v);free.appendChild(l);
    return free;
  }
  function clearPeerCell(peerId){
    var info=gridInfo();
    if(!info)return;
    var c=peerCellById(info.grid,peerId);
    if(!c)return;
    delete c.dataset.ktPeerViewer;
    c.classList.remove('kt-peer-guest');
    c.innerHTML='';
    c.textContent='게스트';
  }
  function showPeer(peerId,name,stream){
    if(!live(stream))return;
    ensureStyle();
    var c=peerCell(peerId,name);if(!c)return;
    var v=c.querySelector('video');if(!v)return;
    if(v.srcObject!==stream)v.srcObject=stream;
    try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }

  async function deactivate(entry){
    if(!entry)return;
    try{if(entry.pc)entry.pc.close();}catch(e){}
    if(entry.sessionId){
      try{await req('ktalk_webrtc_sessions?id=eq.'+enc(entry.sessionId),{
        method:'PATCH',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });}catch(e){}
    }
    clearPeerCell(entry.peerId);
  }
  async function dropPeer(peerId){
    var e=peers[peerId];if(!e)return;
    delete peers[peerId];
    await deactivate(e);
  }

  function wirePc(pc,entry,name){
    pc.ontrack=function(ev){
      var st=ev.streams&&ev.streams[0]?ev.streams[0]:new MediaStream([ev.track]);
      entry.remoteStream=st;
      showPeer(entry.peerId,name,st);
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='failed'||st==='closed'){
        if(peers[entry.peerId]===entry){delete peers[entry.peerId];clearPeerCell(entry.peerId);}
      }else if(st==='disconnected'){
        setTimeout(function(){
          if(peers[entry.peerId]===entry&&pc.connectionState==='disconnected'){
            try{pc.close();}catch(e){}
            delete peers[entry.peerId];
            clearPeerCell(entry.peerId);
          }
        },15000);
      }
    };
  }

  async function makeOffer(hostId,selfId,peerId,name,stream,key){
    if(peers[peerId])return;
    var entry={peerId:peerId,key:key,role:'offer',pc:null,sessionId:'',remoteStream:null};
    peers[peerId]=entry;
    try{
      await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(key)+'&active=eq.true',{
        method:'PATCH',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });
      var pc=new RTCPeerConnection(ktIceConfig20260921());entry.pc=pc;wirePc(pc,entry,name);
      var vt=stream.getVideoTracks()[0];if(vt)pc.addTrack(vt,stream);
      var offer=await pc.createOffer({offerToReceiveVideo:true,offerToReceiveAudio:false});
      await pc.setLocalDescription(offer);await waitIce(pc,5000);
      var rows=await req('ktalk_webrtc_sessions',{
        method:'POST',headers:{Prefer:'return=representation'},
        body:JSON.stringify({host_id:hostId,viewer_id:key,offer_sdp:pc.localDescription.sdp,answer_sdp:null,active:true,updated_at:nowIso()})
      });
      entry.sessionId=rows&&rows[0]?String(rows[0].id||''):'';
      if(!entry.sessionId)throw new Error('mesh session');
      debug('offer_created',selfId+' -> '+peerId);
      var tries=0;
      entry.answerTimer=setInterval(async function(){
        if(peers[peerId]!==entry){clearInterval(entry.answerTimer);return;}
        if(++tries>30){clearInterval(entry.answerTimer);await dropPeer(peerId);return;}
        try{
          var a=await req('ktalk_webrtc_sessions?select=id,answer_sdp,active&id=eq.'+enc(entry.sessionId)+'&limit=1');
          var x=a&&a[0];if(!x||!x.active){clearInterval(entry.answerTimer);await dropPeer(peerId);return;}
          if(x.answer_sdp&&!pc.currentRemoteDescription){
            await pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});
            clearInterval(entry.answerTimer);
          }
        }catch(e){}
      },800);
    }catch(e){
      await dropPeer(peerId);
    }
  }

  async function answerOffer(hostId,selfId,peerId,name,stream,key,row){
    if(peers[peerId])return;
    var entry={peerId:peerId,key:key,role:'answer',pc:null,sessionId:String(row.id||''),remoteStream:null};
    peers[peerId]=entry;
    try{
      var pc=new RTCPeerConnection(ktIceConfig20260921());entry.pc=pc;wirePc(pc,entry,name);
      var vt=stream.getVideoTracks()[0];if(vt)pc.addTrack(vt,stream);
      await pc.setRemoteDescription({type:'offer',sdp:row.offer_sdp});
      var answer=await pc.createAnswer();
      await pc.setLocalDescription(answer);await waitIce(pc,5000);
      await req('ktalk_webrtc_sessions?id=eq.'+enc(entry.sessionId),{
        method:'PATCH',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({answer_sdp:pc.localDescription.sdp,updated_at:nowIso()})
      });
      debug('answer_created',selfId+' <- '+peerId);
    }catch(e){
      await dropPeer(peerId);
    }
  }

  async function currentHost(selfId){
    try{
      var rows=await req('ktalk_live_viewers?select=host_id,viewer_id,active,updated_at&viewer_id=eq.'+enc(selfId)+'&active=eq.true&order=updated_at.desc&limit=1');
      return rows&&rows[0]?String(rows[0].host_id||''):'';
    }catch(e){return '';}
  }

  async function participantInfo(hostId){
    var sessions=[],viewers=[];
    try{
      sessions=await req('ktalk_webrtc_sessions?select=id,viewer_id,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=updated_at.desc&limit=80')||[];
      var cut=new Date(Date.now()-30000).toISOString();
      viewers=await req('ktalk_live_viewers?select=viewer_id,viewer_name,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&updated_at=gte.'+enc(cut)+'&limit=100')||[];
    }catch(e){}
    var names={},fresh={};
    viewers.forEach(function(v){
      var id=String(v.viewer_id||'');
      names[id]=String(v.viewer_name||'게스트');
      fresh[id]=true;
    });
    var ids={};
    sessions.forEach(function(s){
      var tag=String(s.viewer_id||'');
      if(tag.indexOf('guest:')===0){
        var id=tag.slice(6);
        if(id&&fresh[id])ids[id]=true;
      }
    });
    return {ids:Object.keys(ids),names:names};
  }

  async function meshRow(hostId,key){
    try{
      var rows=await req('ktalk_webrtc_sessions?select=id,viewer_id,offer_sdp,answer_sdp,active,updated_at&host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(key)+'&active=eq.true&order=created_at.desc&limit=1');
      return rows&&rows[0]?rows[0]:null;
    }catch(e){return null;}
  }

  async function ensurePeer(hostId,selfId,peerId,name,stream){
    if(peerId===selfId||peers[peerId])return;
    var key=pairKey(selfId,peerId);
    var offerer=String(selfId)<String(peerId);
    if(offerer){
      var existing=await meshRow(hostId,key);
      if(existing&&existing.offer_sdp&&existing.offer_sdp!=='pending'&&!existing.answer_sdp){
        /* 내가 이전 시도에서 만든 행이 남은 경우 새로 정리해서 다시 연결 */
        try{await req('ktalk_webrtc_sessions?id=eq.'+enc(existing.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      }else if(existing&&existing.answer_sdp){
        /* 새 화면 접속에서는 예전 연결을 재사용할 수 없으므로 다시 만든다. */
        try{await req('ktalk_webrtc_sessions?id=eq.'+enc(existing.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      }
      await makeOffer(hostId,selfId,peerId,name,stream,key);
    }else{
      var row=await meshRow(hostId,key);
      if(row&&row.offer_sdp&&row.offer_sdp!=='pending')await answerOffer(hostId,selfId,peerId,name,stream,key,row);
    }
  }

  async function tick(){
    if(ticking)return;ticking=true;
    try{
      var infoGrid=gridInfo();
      var stream=selfStream();
      var selfId=selfViewerId();
      if(!infoGrid||!stream||!selfId){
        debug('waiting',(infoGrid?'grid ':'no-grid ')+(stream?'stream ':'no-stream ')+(selfId?'self':'no-self'));
        if(!absentSince)absentSince=Date.now();
        if(Date.now()-absentSince>12000){
          var ks=Object.keys(peers);for(var i=0;i<ks.length;i++)await dropPeer(ks[i]);
          lastHost='';lastSelf='';
        }
        return;
      }
      absentSince=0;
      var hostId=await currentHost(selfId);if(!hostId){debug('no_host',selfId);return;}
      lastHost=hostId;lastSelf=selfId;
      var info=await participantInfo(hostId);
      debug('ready',selfId+' peers='+info.ids.join(','));
      var active={};
      info.ids.forEach(function(id){if(id!==selfId)active[id]=true;});
      var old=Object.keys(peers);
      for(var j=0;j<old.length;j++)if(!active[old[j]])await dropPeer(old[j]);
      var ids=Object.keys(active);
      for(var k=0;k<ids.length;k++){
        var pid=ids[k];
        await ensurePeer(hostId,selfId,pid,info.names[pid]||'게스트',stream);
      }
      Object.keys(peers).forEach(function(pid){
        var e=peers[pid];if(e&&e.remoteStream)showPeer(pid,info.names[pid]||'게스트',e.remoteStream);
      });
    }catch(e){}
    finally{ticking=false;}
  }

  setInterval(tick,1200);
  [300,700,1300,2200].forEach(function(ms){setTimeout(tick,ms);});

  window.addEventListener('pagehide',function(){
    Object.keys(peers).forEach(function(pid){
      var e=peers[pid];
      try{if(e.pc)e.pc.close();}catch(z){}
      if(e.sessionId&&BASE&&KEY){
        try{fetch(BASE+'ktalk_webrtc_sessions?id=eq.'+enc(e.sessionId),{
          method:'PATCH',headers:headers({Prefer:'return=minimal'}),
          body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true
        });}catch(z){}
      }
    });
    peers={};
  });
})();