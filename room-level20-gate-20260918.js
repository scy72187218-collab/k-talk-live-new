/* K-Talk 레벨 방 입장 제한 해제.
   레벨 표시는 유지하고, 방 입장/방 만들기에서 레벨 조건만 사용하지 않는다.
   비밀방 비밀번호/구독자 전용 조건 등 다른 조건은 건드리지 않음. */
(function(){
  if(window.__ktRoomLevel20Gate20260918)return;
  window.__ktRoomLevel20Gate20260918=true;

  var MIN=20;
  var warnedAt=0;

  function num(v){
    var n=parseInt(v,10);
    return isFinite(n)?n:0;
  }

  function ownerExempt(){
    try{
      var k=localStorage.getItem('ktalk_sub_account')||'';
      if(k==='taekwon1'||k==='haine2')return true;
    }catch(e){}
    try{
      var s=window.state||{};
      if(s.ktSubAccount==='taekwon1'||s.ktSubAccount==='haine2')return true;
    }catch(e){}
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var x=window.ktGetSelectedSubAccount();
        if(x==='taekwon1'||x==='haine2')return true;
      }
    }catch(e){}
    try{if(typeof window.ktIsOwnerLevelExempt==='function'&&window.ktIsOwnerLevelExempt())return true;}catch(e){}
    try{if(window.state&&(state.ktOwnerAdmin||state.ktOwnerLevelBypass))return true;}catch(e){}
    return false;
  }

  function currentLevel(){
    if(ownerExempt())return 1000;
    try{
      if(typeof window.ktLevelGetLevel==='function'){
        var a=num(window.ktLevelGetLevel());
        if(a>=0)return a;
      }
    }catch(e){}
    try{
      if(typeof window.ktLevelInfo==='function'){
        var info=window.ktLevelInfo()||{};
        var b=num(info.level);
        if(b>=0)return b;
      }
    }catch(e){}
    var vals=[];
    try{
      if(window.state){
        [state.level,state.userLevel,state.memberLevel,state.hostLevel].forEach(function(v){vals.push(num(v));});
      }
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel']
        .forEach(function(k){vals.push(num(localStorage.getItem(k)));});
    }catch(e){}
    var best=0;
    vals.forEach(function(v){if(v>best)best=v;});
    return best;
  }

  function is13(type,label,max){
    var t=String(type||'').toLowerCase().replace(/\s+/g,'');
    var n=String(label||'').replace(/\s+/g,'');
    return t==='group'||t==='group13'||t==='13'||Number(max)===13||n.indexOf('13명')>-1;
  }

  function isSecret(type,label){
    var t=String(type||'').toLowerCase().replace(/\s+/g,'');
    var n=String(label||'').replace(/\s+/g,'');
    return t==='password'||t==='secret'||t==='private'||n.indexOf('비밀')>-1;
  }

  function restricted(type,label,max){
    return is13(type,label,max)||isSecret(type,label);
  }

  function allowed(type,label,max){
    return true;
  }

  function notice(type,label,max){
    var now=Date.now();
    if(now-warnedAt<650)return false;
    warnedAt=now;
    var lv=currentLevel();
    var name=isSecret(type,label)?'비밀방':'13명방';
    var msg=name+'은 레벨 20부터 사용할 수 있습니다. 현재 레벨 '+lv+'입니다.';
    try{if(typeof window.ktSpeak==='function')window.ktSpeak(msg);}catch(e){}
    try{alert(msg);}catch(e){}
    return false;
  }

  window.ktLevel20RoomAllowed=allowed;
  window.ktLevelCanOpen13=function(){return true;};
  window.ktLevelCanUseSecret=function(){return true;};

  var oldCreate=window.ktCanCreateRoomByLevel;
  window.ktCanCreateRoomByLevel=function(roomType,level){
    if(restricted(roomType,'',0))return true;
    return typeof oldCreate==='function'?oldCreate.apply(this,arguments):true;
  };

  var oldEnter=window.ktCanEnterRoomByLevel;
  window.ktCanEnterRoomByLevel=function(roomType,level,isSubscriber){
    if(restricted(roomType,'',0))return true;
    return typeof oldEnter==='function'?oldEnter.apply(this,arguments):true;
  };

  function wrap(name,checker){
    var old=window[name];
    if(typeof old!=='function'||old.__ktLevel20Gate)return;
    var fn=function(){
      var r=checker.apply(this,arguments);
      if(r===false)return false;
      return old.apply(this,arguments);
    };
    fn.__ktLevel20Gate=true;
    window[name]=fn;
  }

  wrap('selectPrepRoom',function(el,type,label,max){
    if(allowed(type,label,max))return true;
    return notice(type,label,max);
  });

  wrap('ktPickBottomRoom',function(el,shortName,type,label,max){
    if(allowed(type,label,max))return true;
    return notice(type,label,max);
  });

  wrap('openRoomPrep',function(name,max){
    var type=Number(max)===13?'group13':(String(name||'').indexOf('비밀')>-1?'password':'');
    if(allowed(type,name,max))return true;
    return notice(type,name,max);
  });

  wrap('startBroadcast',function(){
    try{
      var s=window.state||{};
      var type=s.liveRoomType||s.prepRoomType||s.roomType||'';
      var label=s.liveRoomName||s.prepRoomName||'';
      var max=s.liveRoomMax||s.prepRoomMax||0;
      if(allowed(type,label,max))return true;
      return notice(type,label,max);
    }catch(e){return true;}
  });

  /* 인라인 onclick이 state를 먼저 바꾸기 전에 선택 자체를 차단 */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!b)return;
    var area=b.closest&&b.closest('.creator,.live-prep,.kt-dashboard,.sheet');
    if(!area)return;
    var txt=String(b.textContent||'').replace(/\s+/g,'');
    var oc=String(b.getAttribute('onclick')||'');
    var type='',label='',max=0;
    if(txt.indexOf('13명')>-1&&(oc.indexOf('selectPrepRoom')>-1||oc.indexOf('ktPickBottomRoom')>-1||oc.indexOf('openRoomPrep')>-1||b.closest('.kt-creator-room-shortcuts,.room-switch-row,.kt-room-bottom5'))){
      type='group13';label='13명방';max=13;
    }else if(txt.indexOf('비밀')>-1&&(oc.indexOf('selectPrepRoom')>-1||oc.indexOf('ktPickBottomRoom')>-1||oc.indexOf('openRoomPrep')>-1||b.closest('.kt-creator-room-shortcuts,.room-switch-row,.kt-room-bottom5'))){
      type='password';label='비밀방';max=7;
    }else return;

    if(allowed(type,label,max))return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    notice(type,label,max);
  },true);

  /* 다른 스크립트가 함수들을 나중에 다시 감싸도 제한을 복구 */
  function reinstall(){
    if(typeof window.selectPrepRoom==='function'&&!window.selectPrepRoom.__ktLevel20Gate){
      var old=window.selectPrepRoom;
      var fn=function(el,type,label,max){
        if(!allowed(type,label,max))return notice(type,label,max);
        return old.apply(this,arguments);
      };
      fn.__ktLevel20Gate=true;
      window.selectPrepRoom=fn;
    }
    if(typeof window.startBroadcast==='function'&&!window.startBroadcast.__ktLevel20Gate){
      var os=window.startBroadcast;
      var sf=function(){
        var s=window.state||{};
        var type=s.liveRoomType||s.prepRoomType||s.roomType||'';
        var label=s.liveRoomName||s.prepRoomName||'';
        var max=s.liveRoomMax||s.prepRoomMax||0;
        if(!allowed(type,label,max))return notice(type,label,max);
        return os.apply(this,arguments);
      };
      sf.__ktLevel20Gate=true;
      window.startBroadcast=sf;
    }
  }
  [100,300,800,1600,3200].forEach(function(ms){setTimeout(reinstall,ms);});
})();