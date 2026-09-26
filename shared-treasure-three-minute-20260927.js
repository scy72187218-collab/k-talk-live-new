/* K-Talk shared treasure chest: 3-minute host-head display + public one-per-person claims.
   Uses existing ktalk_live_messages so viewers on other phones can see/join/wait/claim.
   No room layout or video transport changes. */
(function(){
  if(window.__ktSharedTreasureThreeMin20260927)return;
  window.__ktSharedTreasureThreeMin20260927=true;

  var BASE='',KEY='',syncing=false,lastRemoteId='',pollTimer=null;
  var TTL=3*60*1000;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function myName(){
    try{
      var p=window.ktProfileLoad?window.ktProfileLoad():null;
      if(p&&(p.nickname||p.name||p.displayName))return String(p.nickname||p.name||p.displayName);
    }catch(e){}
    try{return localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_nickname')||'K-Talk 회원';}catch(e){}
    return 'K-Talk 회원';
  }
  async function config(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260926-followstatus16',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text(),b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);
      if(!b||!k)return false;
      BASE=b[1];KEY=k[1];return true;
    }catch(e){return false;}
  }
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    if(!(await config()))throw new Error('treasure config');
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('treasure api '+r.status);
    if(r.status===204)return null;
    var tx=await r.text();return tx?JSON.parse(tx):null;
  }
  function currentTitle(){
    try{return String((window.state&&(state.currentLiveRoomTitle||state.currentViewRoomTitle||state.liveRoomName))||'K-Talk LIVE');}catch(e){return 'K-Talk LIVE';}
  }
  function currentHostId(){
    try{
      if(window.__ktCurrentRemoteHostId)return String(window.__ktCurrentRemoteHostId);
      if(window.state&&(state.remoteHostId||state.hostId))return String(state.remoteHostId||state.hostId);
    }catch(e){}
    return deviceId();
  }

  function ensureStyle(){
    if(document.getElementById('ktSharedTreasureThreeMinStyle'))return;
    var s=document.createElement('style');
    s.id='ktSharedTreasureThreeMinStyle';
    s.textContent=''
      +'.kt-treasure-host-head{position:absolute!important;left:50%!important;top:7px!important;transform:translateX(-50%)!important;z-index:850!important;pointer-events:auto!important}'
      +'.kt-treasure-host-head .kt-live-treasure{min-width:78px!important;max-width:104px!important;padding:5px 7px!important;border-radius:16px!important;border:1px solid #ffd85f!important;background:rgba(25,13,4,.92)!important;color:#fff!important;box-shadow:0 0 14px #ffb52f88!important}'
      +'.kt-treasure-host-head .kt-chest-art{transform:scale(.70)!important;transform-origin:center!important;margin:-4px auto!important}'
      +'.kt-treasure-host-head strong,.kt-treasure-host-head .kt-treasure-time,.kt-treasure-host-head small,.kt-treasure-host-head .kt-treasure-caption{display:block!important;text-align:center!important;font-size:8px!important;line-height:1.15!important}'
      +'.kt-treasure-host-head.ready .kt-live-treasure{animation:ktTreasurePulse .8s ease-in-out infinite alternate!important}'
      +'@keyframes ktTreasurePulse{from{transform:scale(1)}to{transform:scale(1.05)}}';
    document.head.appendChild(s);
  }

  function hostTile(){
    return document.querySelector(
      '.ktsolo-main,'+
      '.ktg13-host,'+
      '.ktg13-room[data-kt-room="9"] .ktg13-host,'+
      '.ktsubscriber-host,'+
      '.ktsecret-slot.host,'+
      '.ktsecret-host'
    );
  }
  function ensureZone(){
    ensureStyle();
    var tile=hostTile();
    if(!tile)return null;
    try{tile.style.setProperty('position','relative','important');}catch(e){}
    var z=tile.querySelector(':scope > .kt-treasure-host-head');
    if(!z){
      z=document.createElement('div');
      z.id='ktLiveTreasureZone';
      z.className='kt-live-treasure-zone kt-treasure-host-head';
      tile.appendChild(z);
    }
    return z;
  }

  function localSave(t){
    try{
      if(t)localStorage.setItem('ktalk_active_treasure',JSON.stringify(t));
      else localStorage.removeItem('ktalk_active_treasure');
    }catch(e){}
    try{if(window.state)state.activeTreasure=t||null;}catch(e){}
  }

  async function postChest(t){
    try{
      await req('ktalk_live_messages',{
        method:'POST',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:String(t.hostId||currentHostId()),
          sender_id:'treasure:'+deviceId(),
          sender_name:String(t.sender||myName()),
          message:JSON.stringify(t),
          message_type:'treasure'
        })
      });
    }catch(e){}
  }

  async function loadLatestChest(){
    if(syncing)return;
    syncing=true;
    try{
      var since=new Date(Date.now()-6*60*60*1000).toISOString();
      var rows=await req('ktalk_live_messages?select=id,host_id,sender_name,message,created_at&message_type=eq.treasure&created_at=gte.'+enc(since)+'&order=created_at.desc&limit=12');
      var best=null;
      (rows||[]).some(function(r){
        try{
          var t=JSON.parse(String(r.message||'{}'));
          if(!t||!t.id||!t.unlockAt)return false;
          if(Date.now() > Number(t.unlockAt||0)+30*60*1000)return false;
          t.hostId=t.hostId||r.host_id||'';
          best=t;return true;
        }catch(e){return false;}
      });
      if(best){
        var claims=await loadClaims(best.id);
        best.claimedBy=claims.ids;
        best.claimedCount=claims.count;
        best.remaining=Math.max(0,(parseInt(best.amount,10)||0)-claims.count);
        best.claimed=best.remaining<=0;
        localSave(best);
        lastRemoteId=best.id;
        ensureZone();
        if(typeof window.ktRenderTreasure==='function')window.ktRenderTreasure();
      }
    }catch(e){}
    syncing=false;
  }

  async function loadClaims(chestId){
    var out={ids:[],count:0};
    try{
      var since=new Date(Date.now()-6*60*60*1000).toISOString();
      var type='treasure_claim:'+String(chestId);
      var rows=await req('ktalk_live_messages?select=sender_id,sender_name,created_at&message_type=eq.'+enc(type)+'&created_at=gte.'+enc(since)+'&order=created_at.asc&limit=500');
      var seen={};
      (rows||[]).forEach(function(r){
        var id=String(r.sender_id||'');
        if(!id||seen[id])return;
        seen[id]=1;out.ids.push(id);
      });
      out.count=out.ids.length;
    }catch(e){}
    return out;
  }

  window.placeTreasureChest=async function(n,sender,roomTitle){
    n=parseInt(n,10)||50;
    var now=Date.now();
    var item={
      id:'treasure-'+now+'-'+Math.random().toString(36).slice(2,7),
      amount:n,
      remaining:n,
      sender:sender||myName(),
      roomTitle:roomTitle||currentTitle(),
      hostId:currentHostId(),
      placedAt:now,
      unlockAt:now+TTL,
      claimed:false
    };
    localSave(item);
    ensureZone();
    if(typeof window.ktRenderTreasure==='function')window.ktRenderTreasure();
    await postChest(item);
    try{if(window.ktSpeak)ktSpeak('보물상자가 올라왔습니다. 3분 후 누구나 한 개씩 받을 수 있습니다.');}catch(e){}
    alert('보물상자가 호스트 머리 위에 올라갔습니다. 3분 후 '+n+'명이 한 개씩 받을 수 있습니다.');
  };

  window.ktTreasureStatus=function(t){
    if(!t)return null;
    var left=Number(t.unlockAt||0)-Date.now();
    return {left:left,ready:left<=0};
  };

  window.claimTreasureChest=async function(){
    var t=window.ktGetTreasure?window.ktGetTreasure():null;
    if(!t)return;
    var st=window.ktTreasureStatus(t);
    if(!st.ready){
      var msg='아직 '+(window.ktTreasureFormat?ktTreasureFormat(st.left):Math.ceil(st.left/1000)+'초')+' 남았습니다.';
      try{if(window.ktSpeak)ktSpeak(msg);}catch(e){}
      alert(msg);return;
    }

    var me='claim:'+deviceId();
    var claims=await loadClaims(t.id);
    if(claims.ids.indexOf(me)>-1){
      alert('이 보물상자는 이미 받았습니다.');return;
    }
    var remaining=Math.max(0,(parseInt(t.amount,10)||0)-claims.count);
    if(remaining<=0){
      t.claimed=true;t.remaining=0;localSave(t);
      if(window.ktRenderTreasure)ktRenderTreasure();
      alert('보물상자가 모두 소진되었습니다.');return;
    }

    try{
      await req('ktalk_live_messages',{
        method:'POST',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:String(t.hostId||''),
          sender_id:me,
          sender_name:myName(),
          message:JSON.stringify({chestId:t.id,amount:1,roomTitle:t.roomTitle||''}),
          message_type:'treasure_claim:'+String(t.id)
        })
      });
      t.remaining=Math.max(0,remaining-1);
      t.claimed=t.remaining<=0;
      localSave(t);
      if(typeof window.ktRenderTreasure==='function')window.ktRenderTreasure();
      try{if(window.ktSpeak)ktSpeak('보물상자에서 한 개를 받았습니다.');}catch(e){}
      alert('🎉 보물상자에서 1개를 받았습니다! 남은 수량 '+t.remaining+'개');
    }catch(e){
      alert('보물상자를 받지 못했습니다. 다시 눌러 주세요.');
    }
  };

  var oldOpen=window.openTreasure;
  window.openTreasure=function(){
    if(typeof oldOpen==='function')oldOpen();
    setTimeout(function(){
      try{
        var body=document.getElementById('sheetBody');
        if(!body)return;
        body.querySelectorAll('.kt-treasure-help span').forEach(function(s){
          s.innerHTML='호스트 머리 위에 <b>3분 동안</b> 표시됩니다.<br>3분이 지나면 표시된 개수만큼, 들어온 사람들이 <b>한 사람당 1개씩</b> 눌러 받아 갈 수 있습니다.';
        });
      }catch(e){}
    },20);
  };

  function patchRender(){
    ensureZone();
    var t=window.ktGetTreasure?window.ktGetTreasure():null;
    var z=document.getElementById('ktLiveTreasureZone');
    if(!z)return;
    if(!t){z.innerHTML='';return;}
    var st=window.ktTreasureStatus(t);
    var remain=(typeof t.remaining==='number'?t.remaining:(parseInt(t.amount,10)||0));
    z.classList.toggle('ready',!!st.ready);
    z.innerHTML='<button class="kt-live-treasure '+(st.ready?'ready':'locked')+'" onclick="claimTreasureChest()">'
      +'<span class="kt-treasure-caption">'+(st.ready?'눌러서 받기':'3분 대기')+'</span>'
      +(window.ktTreasureArt?ktTreasureArt():'🎁')
      +'<strong>'+remain+'개</strong>'
      +'<b class="kt-treasure-time">'+(st.ready?'열림!':(window.ktTreasureFormat?ktTreasureFormat(st.left):''))+'</b>'
      +'</button>';
  }

  var oldRender=window.ktRenderTreasure;
  window.ktRenderTreasure=function(){
    try{if(typeof oldRender==='function')oldRender.apply(this,arguments);}catch(e){}
    setTimeout(patchRender,0);
  };

  function tick(){
    ensureZone();
    patchRender();
    loadLatestChest();
  }
  tick();
  [100,300,800,1500,2600].forEach(function(ms){setTimeout(tick,ms);});
  pollTimer=setInterval(tick,2500);
  window.addEventListener('pageshow',tick);
  window.addEventListener('focus',tick);
})();
