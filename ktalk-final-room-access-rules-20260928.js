/* K-Talk FINAL room access rules — 2026-09-28
   Current saved baseline:
   Lv 1~20  : solo + group9
   Lv 21~40 : + group13 + secret
   Lv 41+   : + subscriber
   Subscriber entry additionally requires mutual follow.
   Owner/admin accounts remain exempt.
*/
(function(){
  if(window.__ktFinalRoomAccessRules20260928)return;
  window.__ktFinalRoomAccessRules20260928=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function n(v){
    var x=parseInt(String(v==null?'':v).replace(/[^0-9]/g,''),10);
    return isFinite(x)?Math.max(0,x):0;
  }
  function clean(v){return String(v==null?'':v).replace(/\s+/g,'').toLowerCase();}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function secretPwToken20260929(v){
    var s=String(v==null?'':v),h=2166136261;
    for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return (h>>>0).toString(36);
  }
  function secretExpectedToken20260929(meta){
    var m=String(meta&&meta.room_name||'').match(/\|pw:([a-z0-9]+)$/i);
    return m?String(m[1]||''):'';
  }
  function askSecretPassword20260929(meta){
    var expected=secretExpectedToken20260929(meta);
    if(!expected){
      try{alert('비밀방 비밀번호 정보를 확인할 수 없습니다. 방송자가 비밀방을 다시 열어 주세요.');}catch(e){}
      return false;
    }
    var v=null;
    try{v=prompt('🔒 비밀방 비밀번호 4자리를 입력하세요.','');}catch(e){}
    if(v===null)return false;
    v=String(v||'').replace(/\D/g,'').slice(0,4);
    if(v.length!==4||secretPwToken20260929(v)!==expected){
      try{alert('비밀번호가 맞지 않습니다.');}catch(e){}
      return false;
    }
    return true;
  }

  function owner(){
    try{if(typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin())return true;}catch(e){}
    try{if(window.state&&(state.ktOwnerAdmin||state.ktOwnerLevelBypass))return true;}catch(e){}
    var names=[];
    try{
      var s=window.state||{};
      [s.nickname,s.nickName,s.userName,s.username,s.profileName,s.displayName,s.name,s.accountName,s.ktSubAccount].forEach(function(x){if(x)names.push(x);});
    }catch(e){}
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        [p.name,p.nickname,p.nickName,p.displayName,p.profileName,p.accountName,p.username,p.userName].forEach(function(x){if(x)names.push(x);});
      }
    }catch(e){}
    try{
      if(typeof window.ktGetSelectedSubAccount==='function')names.push(window.ktGetSelectedSubAccount());
    }catch(e){}
    try{
      var sub=localStorage.getItem('ktalk_sub_account');
      if(sub)names.push(sub);
    }catch(e){}
    return names.some(function(v){
      var x=clean(v);
      return x==='태권1'||x==='하이네2'||x==='taekwon1'||x==='haine2';
    });
  }

  function level(){
    if(owner())return 1000;
    var best=0;
    try{
      if(typeof window.ktLevelGetLevel==='function')best=Math.max(best,n(window.ktLevelGetLevel()));
    }catch(e){}
    try{
      if(typeof window.ktLevelInfo==='function')best=Math.max(best,n((window.ktLevelInfo()||{}).level));
    }catch(e){}
    try{
      var s=window.state||{};
      [s.level,s.userLevel,s.memberLevel,s.hostLevel].forEach(function(v){best=Math.max(best,n(v));});
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'].forEach(function(k){
        best=Math.max(best,n(localStorage.getItem(k)));
      });
    }catch(e){}
    return best>0?best:1;
  }

  function kind(type,name,max){
    var t=clean(type),nm=clean(name),m=n(max);
    if(t.indexOf('subscriber')>-1||nm.indexOf('구독자')>-1)return 'subscriber';
    if(t.indexOf('password')>-1||t.indexOf('secret')>-1||nm.indexOf('비밀')>-1)return 'secret';
    if(t.indexOf('group13')>-1||nm.indexOf('13명')>-1||m===13)return 'group13';
    if(t.indexOf('group9')>-1||nm.indexOf('9명')>-1||m===9)return 'group9';
    return 'solo';
  }

  function minLevel(k){
    if(k==='subscriber')return 41;
    if(k==='group13'||k==='secret')return 21;
    return 1;
  }

  function allowed(k,lv){
    if(owner())return true;
    return n(lv)>=minLevel(k);
  }

  function deny(k,lv){
    var need=minLevel(k);
    var label=k==='subscriber'?'구독자방':k==='secret'?'비밀방':k==='group13'?'13명 방송':k==='group9'?'9명 방송':'1인 방송';
    try{alert(label+'은 레벨 '+need+'부터 이용할 수 있습니다. 현재 레벨 '+lv+'입니다.');}catch(e){}
    return false;
  }

  window.ktFinalRoomMinimumLevel20260928=function(roomType,roomName,max){
    return minLevel(kind(roomType,roomName,max));
  };
  window.ktFinalRoomAllowed20260928=function(roomType,roomName,max,lv){
    var k=kind(roomType,roomName,max);
    return allowed(k,lv==null?level():lv);
  };

  window.ktCanCreateRoomByLevel=function(roomType,lv){
    return allowed(kind(roomType,'',0),lv==null?level():lv);
  };
  window.ktCanEnterRoomByLevel=function(roomType,lv){
    return allowed(kind(roomType,'',0),lv==null?level():lv);
  };
  window.ktLevelCanOpen13=function(){return owner()||level()>=21;};
  window.ktLevelCanUseSecret=function(){return owner()||level()>=21;};

  function myIdentity(){
    var name='K-Talk',id='';
    try{
      var s=window.state||{};
      name=s.profileName||s.currentProfileName||s.accountName||name;
      id=s.profileId||s.currentAccountId||s.accountId||id;
    }catch(e){}
    try{
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    try{
      if(!id&&typeof window.ktGetSelectedSubAccount==='function'){
        var sub=String(window.ktGetSelectedSubAccount()||'');
        if(sub)id='sub:'+sub;
      }
    }catch(e){}
    if(!id){
      try{id=localStorage.getItem('ktalk_device_user_id')||'';}catch(e){}
    }
    return {id:String(id||'').slice(0,80),name:String(name||'K-Talk').slice(0,80)};
  }

  function headers(){
    var me=myIdentity();
    return {apikey:KEY,Authorization:'Bearer '+KEY,'x-ktalk-user-id':me.id};
  }

  async function roomMeta(hostId){
    try{
      var q='ktalk_live_rooms?select=host_id,host_name,room_type,room_name,started_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1';
      var r=await fetch(BASE+q,{headers:headers(),cache:'no-store'});
      if(!r.ok)return null;
      var rows=await r.json();
      return rows&&rows[0]?rows[0]:null;
    }catch(e){return null;}
  }

  async function mutualFollow(hostId,hostName){
    if(owner())return true;
    var me=myIdentity();
    if(!me.id||!hostId)return false;
    try{
      var q1='ktalk_user_follows?select=follower_id,following_id&follower_id=eq.'+enc(me.id)+'&following_id=eq.'+enc(hostId)+'&limit=1';
      var a=await fetch(BASE+q1,{headers:headers(),cache:'no-store'});
      if(!a.ok)return false;
      var ar=await a.json();
      if(!(ar&&ar[0]))return false;

      // Reciprocal match: exact host id first. If host uses a profile id different
      // from its live-device id, accept the reciprocal row carrying the current host name.
      var q2='ktalk_user_follows?select=follower_id,follower_name,following_id&following_id=eq.'+enc(me.id)+'&limit=100';
      var b=await fetch(BASE+q2,{headers:headers(),cache:'no-store'});
      if(!b.ok)return false;
      var br=await b.json();
      br=Array.isArray(br)?br:[];
      var hn=clean(hostName);
      return br.some(function(x){
        return String(x.follower_id||'')===String(hostId) || (hn&&clean(x.follower_name)===hn);
      });
    }catch(e){return false;}
  }


  function hostLiveId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'').slice(0,120);}catch(e){return '';}
  }

  async function secretInviteAllowed(hostId,startedAt){
    if(owner())return true;
    var me=myIdentity();
    if(!hostId||!me.id)return false;
    try{
      var q='ktalk_live_messages?select=id,host_id,sender_id,message,message_type,created_at'
        +'&host_id=eq.'+enc(hostId)
        +'&message_type=eq.secret_invite'
        +'&message=eq.'+enc(me.id);
      if(startedAt)q+='&created_at=gte.'+enc(startedAt);
      q+='&order=created_at.desc&limit=1';
      var r=await fetch(BASE+q,{headers:headers(),cache:'no-store'});
      if(!r.ok)return false;
      var rows=await r.json();
      return !!(rows&&rows[0]);
    }catch(e){return false;}
  }

  async function mutualFollowPeople(){
    var me=myIdentity();
    if(!me.id)return [];
    try{
      var outQ='ktalk_user_follows?select=following_id,following_name&follower_id=eq.'+enc(me.id)+'&limit=100';
      var a=await fetch(BASE+outQ,{headers:headers(),cache:'no-store'});
      if(!a.ok)return [];
      var outgoing=await a.json(); outgoing=Array.isArray(outgoing)?outgoing:[];

      var inQ='ktalk_user_follows?select=follower_id,follower_name&following_id=eq.'+enc(me.id)+'&limit=100';
      var b=await fetch(BASE+inQ,{headers:headers(),cache:'no-store'});
      if(!b.ok)return [];
      var incoming=await b.json(); incoming=Array.isArray(incoming)?incoming:[];

      var inIds={};
      incoming.forEach(function(x){inIds[String(x.follower_id||'')]=String(x.follower_name||'');});
      return outgoing.filter(function(x){return !!inIds[String(x.following_id||'')];}).map(function(x){
        return {id:String(x.following_id||''),name:String(x.following_name||inIds[String(x.following_id||'')]||'회원')};
      });
    }catch(e){return [];}
  }

  window.ktOpenSecretInvite20260928=async function(){
    var people=await mutualFollowPeople();
    if(!people.length){
      try{alert('서로 팔로우된 사람이 없습니다. 비밀방은 서로 팔로우된 사람만 초청할 수 있습니다.');}catch(e){}
      return false;
    }
    var html='<div class="rowbox"><b>🔒 비밀방 초청</b><br>서로 팔로우된 사람만 초청할 수 있습니다.</div>';
    people.forEach(function(p){
      var id=String(p.id||'').replace(/'/g,"\\'");
      var nm=String(p.name||'회원').replace(/[&<>"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];});
      html+='<button class="act" type="button" onclick="ktSendSecretInvite20260928(\''+id+'\',\''+String(p.name||'회원').replace(/'/g,"\\'")+'\')">👤 '+nm+' 초청</button>';
    });
    try{
      if(typeof window.showSheet==='function')window.showSheet('🔒 비밀방 초청',html);
      else alert('초청할 사람을 선택할 수 없습니다.');
    }catch(e){}
    return false;
  };

  window.ktSendSecretInvite20260928=async function(targetId,targetName){
    var hostId=hostLiveId();
    var me=myIdentity();
    if(!hostId||!targetId){
      try{alert('초청 정보를 확인할 수 없습니다.');}catch(e){}
      return false;
    }
    var people=await mutualFollowPeople();
    var ok=people.some(function(p){return String(p.id)===String(targetId);});
    if(!ok){
      try{alert('서로 팔로우된 사람만 비밀방에 초청할 수 있습니다.');}catch(e){}
      return false;
    }
    try{
      var res=await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:Object.assign({},headers(),{'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({
          host_id:hostId,
          sender_id:me.id,
          sender_name:me.name,
          message:String(targetId).slice(0,140),
          message_type:'secret_invite'
        })
      });
      if(!res.ok)throw new Error('invite '+res.status);
      try{alert((targetName||'회원')+'님을 비밀방에 초청했습니다.');}catch(e){}
      try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
      return true;
    }catch(e){
      try{alert('초청을 보내지 못했습니다. 다시 눌러 주세요.');}catch(x){}
      return false;
    }
  };

  function installLocalGates(){
    if(typeof window.selectPrepRoom==='function'&&!window.selectPrepRoom.__ktFinalAccessRules){
      var oldSelect=window.selectPrepRoom;
      var sel=function(btn,type,name,max){
        var k=kind(type,name,max),lv=level();
        if(!allowed(k,lv))return deny(k,lv);
        return oldSelect.apply(this,arguments);
      };
      sel.__ktFinalAccessRules=true;
      window.selectPrepRoom=sel;
    }

    if(typeof window.startBroadcast==='function'&&!window.startBroadcast.__ktFinalAccessRules){
      var oldStart=window.startBroadcast;
      var st=function(){
        var s=window.state||{};
        var k=kind(s.liveRoomType||s.prepRoomType||s.roomType,s.liveRoomName||s.prepRoomName,s.liveRoomMax||s.prepRoomMax);
        var lv=level();
        if(!allowed(k,lv))return deny(k,lv);
        return oldStart.apply(this,arguments);
      };
      st.__ktFinalAccessRules=true;
      window.startBroadcast=st;
    }

    if(typeof window.ktEnterRemoteLive==='function'&&!window.ktEnterRemoteLive.__ktFinalAccessRules){
      var oldEnter=window.ktEnterRemoteLive;
      var ent=async function(hostId){
        var meta=await roomMeta(hostId);
        var k=kind(meta&&meta.room_type,meta&&meta.room_name,0);

        /* 비밀방은 관리자/대표 계정 포함, 시청자로 들어갈 때마다 비밀번호 확인 */
        if(k==='secret'&&!askSecretPassword20260929(meta))return false;

        if(!owner()){
          var lv=level();
          if(!allowed(k,lv))return deny(k,lv);
          if(k==='subscriber'){
            var ok=await mutualFollow(hostId,meta&&meta.host_name);
            if(!ok){
              try{alert('구독자방은 서로 팔로우된 사람만 참여할 수 있습니다.');}catch(e){}
              return false;
            }
          }
          if(k==='secret'){
            var followed=await mutualFollow(hostId,meta&&meta.host_name);
            if(!followed){
              try{alert('비밀방은 서로 팔로우된 사람만 초청받을 수 있습니다.');}catch(e){}
              return false;
            }
            var invited=await secretInviteAllowed(hostId,meta&&meta.started_at);
            if(!invited){
              try{alert('비밀방은 호스트에게 초청받은 사람만 들어갈 수 있습니다.');}catch(e){}
              return false;
            }
          }
        }
        return oldEnter.apply(this,arguments);
      };
      ent.__ktFinalAccessRules=true;
      window.ktEnterRemoteLive=ent;
    }
  }

  function keep(){
    // Re-assert final rules after legacy patches try to overwrite them.
    window.ktCanCreateRoomByLevel=function(roomType,lv){return allowed(kind(roomType,'',0),lv==null?level():lv);};
    window.ktCanEnterRoomByLevel=function(roomType,lv){return allowed(kind(roomType,'',0),lv==null?level():lv);};
    window.ktLevelCanOpen13=function(){return owner()||level()>=21;};
    window.ktLevelCanUseSecret=function(){return owner()||level()>=21;};
    installLocalGates();
  }

  keep();
  [60,180,420,900,1600,3000,5000].forEach(function(ms){setTimeout(keep,ms);});
  setInterval(keep,1200);
  window.addEventListener('pageshow',keep);
  window.addEventListener('focus',keep);
})();