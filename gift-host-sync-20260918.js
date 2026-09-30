/* K-Talk 선물 호스트 화면 동기화.
   장미 1송이부터 모든 선물을 호스트 화면에 표시하고, 1000개 이상은 약 10초 크게 표시. */
(function(){
  if(window.__ktGiftHostSync20260918)return;
  window.__ktGiftHostSync20260918=true;

  var BASE='',KEY='',lastSeen={},polling=false;

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
  function senderName(){
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
      var r=await fetch('live-presence.js?v=20260914-guestflow',{cache:'no-store'});
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
    if(!(await config()))throw new Error('gift config');
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('gift api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function isHostRoom(){
    return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
  }
  async function targetHost(){
    if(isHostRoom())return deviceId();
    if(!document.querySelector('.kt-remote-live'))return '';
    try{
      var vid='viewer_'+deviceId();
      var rows=await req('ktalk_live_viewers?select=host_id&viewer_id=eq.'+enc(vid)+'&active=eq.true&order=updated_at.desc&limit=1');
      return rows&&rows[0]?String(rows[0].host_id||''):'';
    }catch(e){return '';}
  }
  window.ktSyncGiftToHost=async function(name,cost,sender){
    var c=parseInt(cost||0,10)||0;
    if(c<=0)return;

    /* 사진으로 선택한 사람에게 직접 선물: 호스트↔게스트, 게스트↔게스트. */
    try{
      var selected=window.ktGiftTarget20260928||null;
      var legacy=window.ktGuestGiftTarget||null;
      var target=selected||(legacy&&legacy.viewerId?{kind:'guest',viewerId:legacy.viewerId,name:legacy.name}:null);

      if(target&&target.kind==='guest'&&target.viewerId){
        var hostId=await targetHost();
        if(hostId){
          var payloadToGuest={
            name:String(name||'선물'),
            cost:c,
            targetViewerId:String(target.viewerId||''),
            targetName:String(target.name||'게스트')
          };
          await req('ktalk_live_messages',{
            method:'POST',headers:{Prefer:'return=minimal'},
            body:JSON.stringify({
              host_id:hostId,
              sender_id:(isHostRoom()?'hostgift:':'guestgift:')+deviceId(),
              sender_name:String(sender||senderName()),
              message:JSON.stringify(payloadToGuest),
              message_type:(isHostRoom()?'host_gift:':'guest_gift:')+String(target.viewerId)
            })
          });
          return;
        }
      }

      /* 게스트가 호스트 사진을 선택하면 기존 호스트 선물 경로 사용. */
      if(target&&target.kind==='host'){
        // fall through to normal host gift below
      }
    }catch(e){}

    var host=await targetHost();
    if(!host)return;
    var payload={name:String(name||'선물'),cost:c};
    try{
      await req('ktalk_live_messages',{
        method:'POST',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:host,
          sender_id:'gift:'+deviceId(),
          sender_name:String(sender||senderName()),
          message:JSON.stringify(payload),
          message_type:'gift'
        })
      });
    }catch(e){}
  };

  window.ktRecordReceivedRose=window.ktRecordReceivedRose||function(){};

  function showGift(row){
    try{
      var data=JSON.parse(String(row.message||'{}'));
      var cost=parseInt(data.cost||0,10)||0;
      if(cost<=0)return;
      try{if(typeof window.ktRecordReceivedRose==='function')window.ktRecordReceivedRose(String(row.sender_name||'회원'),cost,String(data.name||'선물'),'host');}catch(e){}
      if(cost>=1000){
        try{
          if(typeof window.ktMarkPremiumGiftClip20260928==='function')
            window.ktMarkPremiumGiftClip20260928(String(data.name||'큰 선물'),cost,String(row.sender_name||'회원'));
        }catch(e){}
        if(typeof window.showPremiumGiftFx==='function'){
          window.showPremiumGiftFx(String(data.name||'큰 선물'),cost,String(row.sender_name||'회원'));
        }
      }else if(typeof window.showSmallGiftFx==='function'){
        window.showSmallGiftFx(String(data.name||'선물'),cost,String(row.sender_name||'회원'));
      }
      try{if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{sender:row.sender_name||'',name:data.name||'선물',count:cost});}catch(e){}
    }catch(e){}
  }

  /* 모든 일반 시청자도 방송방에서 같은 선물 연출을 본다.
     이 경로는 표시 전용이며 장미·정산·결제·선물 수량을 변경하지 않는다. */
  var viewerGiftSeen={},viewerGiftPollBusy=false;
  async function pollViewerGiftEffects20260930(){
    if(viewerGiftPollBusy||isHostRoom())return;
    if(!document.querySelector('#screen .kt-remote-live')&&!document.documentElement.classList.contains('kt-remote-viewing'))return;
    viewerGiftPollBusy=true;
    try{
      var host='';
      try{host=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
      if(!host)return;
      var since=new Date(Date.now()-12000).toISOString();
      var rows=await req('ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(host)+'&message_type=eq.gift&created_at=gte.'+enc(since)+'&order=created_at.asc&limit=20');
      (rows||[]).forEach(function(row){
        try{
          var id=String(row.id||'');
          if(!id||viewerGiftSeen[id])return;
          viewerGiftSeen[id]=Date.now();
          /* 보낸 본인 화면에서는 giftSend가 이미 애니메이션을 보여 준다. */
          if(String(row.sender_id||'')==='gift:'+deviceId())return;
          var data=JSON.parse(String(row.message||'{}'));
          var cost=parseInt(data.cost||0,10)||0;
          if(cost<=0)return;
          var name=String(data.name||'선물'),sender=String(row.sender_name||'회원');
          if(cost>=1000&&typeof window.showPremiumGiftFx==='function')window.showPremiumGiftFx(name,cost,sender);
          else if(typeof window.showSmallGiftFx==='function')window.showSmallGiftFx(name,cost,sender);
        }catch(e){}
      });
      var cutoff=Date.now()-60000;
      Object.keys(viewerGiftSeen).forEach(function(k){if(viewerGiftSeen[k]<cutoff)delete viewerGiftSeen[k];});
    }catch(e){}finally{viewerGiftPollBusy=false;}
  }

  async function pollIncomingGuestGift(){
    if(!document.querySelector('.kt-remote-live'))return;
    try{
      var host=await targetHost();
      if(!host)return;
      var vid='viewer_'+deviceId();
      var since=new Date(Date.now()-15000).toISOString();
      var mt='(host_gift:'+vid+',guest_gift:'+vid+')';
      var rows=await req('ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(host)+'&message_type=in.'+enc(mt)+'&created_at=gte.'+enc(since)+'&order=created_at.asc&limit=20');
      (rows||[]).forEach(function(row){
        var id=String(row.id||'');
        if(!id||lastSeen[id])return;
        lastSeen[id]=1;
        try{
          var data=JSON.parse(String(row.message||'{}'));
          var cost=parseInt(data.cost||0,10)||0;
          if(cost<=0)return;
          try{if(typeof window.ktRecordReceivedRose==='function')window.ktRecordReceivedRose(String(row.sender_name||'호스트'),cost,String(data.name||'선물'),'guest');}catch(e){}
          try{if(typeof window.ktGuestAddEarnedRoses==='function')window.ktGuestAddEarnedRoses(cost);}catch(e){}
          if(cost>=1000&&typeof window.showPremiumGiftFx==='function'){
            window.showPremiumGiftFx(String(data.name||'큰 선물'),cost,String(row.sender_name||'호스트'));
          }else if(typeof window.showSmallGiftFx==='function'){
            window.showSmallGiftFx(String(data.name||'선물'),cost,String(row.sender_name||'호스트'));
          }
          try{if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{sender:row.sender_name||'호스트',name:data.name||'선물',count:cost});}catch(e){}
        }catch(e){}
      });
    }catch(e){}
  }

  async function poll(){
    if(polling||!isHostRoom())return;
    polling=true;
    try{
      var host=deviceId();
      var since=new Date(Date.now()-15000).toISOString();
      var rows=await req('ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(host)+'&message_type=eq.gift&created_at=gte.'+enc(since)+'&order=created_at.asc&limit=20');
      (rows||[]).forEach(function(row){
        var id=String(row.id||'');
        if(!id||lastSeen[id])return;
        lastSeen[id]=1;
        if(String(row.sender_id||'')==='gift:'+deviceId())return;
        showGift(row);
      });
    }catch(e){}
    polling=false;
  }
  setInterval(poll,800);
  setInterval(pollIncomingGuestGift,900);
  setInterval(pollViewerGiftEffects20260930,900);
  [300,900,1600].forEach(function(ms){setTimeout(poll,ms);setTimeout(pollIncomingGuestGift,ms+120);setTimeout(pollViewerGiftEffects20260930,ms+150);});
})();