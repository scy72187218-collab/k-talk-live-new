/* K-Talk 관리자 계정 전용: 모든 방 레벨 제한 우회 + 관리/선물 권한 플래그. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktOwnerAdminAllAccess20260913)return;
  window.__ktOwnerAdminAllAccess20260913=true;

  function clean(v){
    return String(v==null?'':v).replace(/\s+/g,'').replace(/[‐‑‒–—―-]/g,'-').toLowerCase();
  }

  function isOwnerName(v){
    var n=clean(v);
    return ['태권','태권이','하이네','태권1','태권2','하이네2','k톡태권','k-톡태권'].indexOf(n)>-1;
  }

  function names(){
    var out=[];
    function add(v){var n=String(v==null?'':v).trim();if(n&&out.indexOf(n)<0)out.push(n);}
    try{
      if(window.state){
        [state.nickname,state.nickName,state.userName,state.username,state.profileName,state.displayName,state.name,state.accountName].forEach(add);
      }
    }catch(e){}
    try{
      ['ktalk_nickname','ktalk_username','ktalk_profile_name','nickname','userName','username','profileName','displayName','accountName'].forEach(function(k){add(localStorage.getItem(k));});
    }catch(e){}
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        [p.name,p.nickname,p.nickName,p.displayName,p.profileName,p.accountName,p.username,p.userName].forEach(add);
      }
    }catch(e){}
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var sub=window.ktGetSelectedSubAccount();
        add(sub);
        if(sub&&typeof window.ktSubProfileCard==='function'){
          var sp=window.ktSubProfileCard(sub)||{};
          [sp.name,sp.nickname,sp.nickName,sp.displayName,sp.profileName,sp.accountName,sp.username,sp.userName].forEach(add);
        }
      }
    }catch(e){}
    return out;
  }

  function detected(){return names().some(isOwnerName);}

  function apply(){
    if(!detected())return false;
    try{
      if(window.state){
        state.level=1000;
        state.userLevel=1000;
        state.memberLevel=1000;
        state.hostLevel=1000;
        state.ktOwnerLevelBypass=true;
        state.ktOwnerAdmin=true;
        state.ktOwnerGiftPermission=true;
      }
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'].forEach(function(k){localStorage.setItem(k,'1000');});
      localStorage.setItem('ktalk_owner_admin','1');
      localStorage.setItem('ktalk_owner_gift_permission','1');
    }catch(e){}
    return true;
  }

  var oldForce=window.ktForceOwnerLevel1000;
  window.ktForceOwnerLevel1000=function(){
    if(apply())return true;
    if(typeof oldForce==='function')return !!oldForce.apply(this,arguments);
    return false;
  };
  window.ktIsOwnerLevelExempt=function(){return apply();};
  window.ktIsOwnerAdmin=function(){return apply();};
  window.ktOwnerHasGiftPermission=function(){return apply();};

  var oldEffective=window.ktEffectiveLevel;
  window.ktEffectiveLevel=function(level){
    if(apply())return 1000;
    if(typeof oldEffective==='function')return oldEffective.apply(this,arguments);
    var lv=parseInt(level,10);return isFinite(lv)&&lv>0?lv:1;
  };

  function wrapAccess(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktOwnerAllAccessWrapped)return;
    var fn=function(){
      if(apply())return true;
      return old.apply(this,arguments);
    };
    fn.__ktOwnerAllAccessWrapped=true;
    window[name]=fn;
  }

  function wrapAction(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktOwnerAdminWrapped)return;
    var fn=function(){apply();return old.apply(this,arguments);};
    fn.__ktOwnerAdminWrapped=true;
    window[name]=fn;
  }

  function install(){
    apply();
    wrapAccess('ktCanCreateRoomByLevel');
    wrapAccess('ktCanEnterRoomByLevel');
    wrapAction('openRoomPrep');
    wrapAction('startBroadcast');
    wrapAction('selectPrepRoom');
    wrapAction('openProfile');
  }

  document.addEventListener('pointerdown',install,true);
  document.addEventListener('click',install,true);
  window.addEventListener('pageshow',install);
  window.addEventListener('focus',install);
  install();
  [100,300,800,1600,3200].forEach(function(ms){setTimeout(install,ms);});
})();
