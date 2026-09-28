/* K-Talk owner/admin internal room bypass — 2026-09-28
   태권1 / 하이네2: 내부 레벨·방 개설·방 입장 제한만 우회.
   성인인증/법적 연령 제한은 건드리지 않음. */
(function(){
  if(window.__ktOwnerAdminRoomBypass20260928)return;
  window.__ktOwnerAdminRoomBypass20260928=true;

  function clean(v){return String(v==null?'':v).replace(/\s+/g,'').toLowerCase();}

  function owner(){
    var vals=[];
    function add(v){if(v!=null&&v!=='')vals.push(v);}
    try{add(localStorage.getItem('ktalk_sub_account'));}catch(e){}
    try{if(typeof window.ktGetSelectedSubAccount==='function')add(window.ktGetSelectedSubAccount());}catch(e){}
    try{
      var s=window.state||{};
      [s.ktSubAccount,s.nickname,s.nickName,s.userName,s.username,s.profileName,s.displayName,s.name,s.accountName].forEach(add);
    }catch(e){}
    return vals.some(function(v){
      var x=clean(v);
      return x==='taekwon1'||x==='haine2'||x==='태권1'||x==='하이네2'||x==='태권'||x==='하이네';
    });
  }

  function forceLevel(){
    if(!owner())return false;
    try{
      if(window.state){
        state.level=1000;
        state.userLevel=1000;
        state.memberLevel=1000;
        state.hostLevel=1000;
        state.ktOwnerLevelBypass=true;
        state.ktOwnerAdmin=true;
      }
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel']
        .forEach(function(k){localStorage.setItem(k,'1000');});
    }catch(e){}
    return true;
  }

  window.ktOwnerAdminInternalPass20260928=function(){return owner()&&forceLevel();};

  function install(){
    if(!owner())return;
    forceLevel();

    window.ktCanCreateRoomByLevel=function(){return true;};
    window.ktCanEnterRoomByLevel=function(){return true;};
    window.ktLevelCanOpen13=function(){return true;};
    window.ktLevelCanUseSecret=function(){return true;};

    try{
      var oldEffective=window.ktEffectiveLevel;
      if(typeof oldEffective!=='function'||!oldEffective.__ktOwner1000Final){
        var fn=function(level){
          if(owner()){forceLevel();return 1000;}
          if(typeof oldEffective==='function')return oldEffective.apply(this,arguments);
          var n=parseInt(level,10);return isFinite(n)&&n>0?n:1;
        };
        fn.__ktOwner1000Final=true;
        window.ktEffectiveLevel=fn;
      }
    }catch(e){}
  }

  install();
  [50,150,350,700,1200,2200].forEach(function(ms){setTimeout(install,ms);});
  window.addEventListener('pageshow',install);
  window.addEventListener('focus',install);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(install,30);
  });
  setInterval(install,1000);
})();