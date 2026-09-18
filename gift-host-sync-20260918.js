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

  function showGift(row){
    try{
      var data=JSON.parse(String(row.message||'{}'));
      var cost=parseInt(data.cost||0,10)||0;
      if(cost<=0)return;
      if(cost>=1000&&typeof window.showPremiumGiftFx==='function'){
        window.showPremiumGiftFx(String(data.name||'큰 선물'),cost,String(row.sender_name||'회원'));
      }else if(typeof window.showSmallGiftFx==='function'){
        window.showSmallGiftFx(String(data.name||'선물'),cost,String(row.sender_name||'회원'));
      }
      try{if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{sender:row.sender_name||'',name:data.name||'선물',count:cost});}catch(e){}
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
  [300,900,1600].forEach(function(ms){setTimeout(poll,ms);});
})();