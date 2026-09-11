/* K-Talk 레벨 규칙 + 태권 계정만 레벨 제한 예외. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLevelCostRulesInstalled)return;
  window.__ktLevelCostRulesInstalled=true;

  function cleanName(v){
    return String(v==null?'':v).replace(/\s+/g,'').trim();
  }

  function currentAccountName(){
    var list=[];
    try{
      if(window.state){
        list.push(state.nickname,state.nickName,state.userName,state.username,state.profileName,state.displayName,state.name,state.accountName);
      }
    }catch(e){}
    try{
      ['ktalk_nickname','ktalk_username','ktalk_profile_name','nickname','userName','username','profileName','displayName','accountName'].forEach(function(k){
        var v=localStorage.getItem(k);
        if(v)list.push(v);
      });
    }catch(e){}
    for(var i=0;i<list.length;i++){
      var n=cleanName(list[i]);
      if(n)return n;
    }
    return '';
  }

  /* 사용자 요청: '태권' 계정은 레벨 제한 없이 모든 방 입장/생성 허용. */
  window.ktIsOwnerLevelExempt=function(){
    return currentAccountName()==='태권';
  };

  window.ktEffectiveLevel=function(level){
    if(window.ktIsOwnerLevelExempt())return 999;
    var lv=parseInt(level,10);
    return isFinite(lv)&&lv>0?lv:1;
  };

  window.ktCanCreateRoomByLevel=function(roomType,level){
    if(window.ktIsOwnerLevelExempt())return true;
    var lv=window.ktEffectiveLevel(level);
    var t=String(roomType||'').toLowerCase();
    if(t.indexOf('15')>-1||t==='group15')return lv>=35;
    if(t.indexOf('13')>-1||t==='group13')return lv>=21;
    return true;
  };

  window.ktCanEnterRoomByLevel=function(roomType,level,isSubscriber){
    if(window.ktIsOwnerLevelExempt())return true;
    if(isSubscriber===true)return true;
    return window.ktCanCreateRoomByLevel(roomType,level);
  };

  function wrapOwnerBypass(name){
    var original=window[name];
    if(typeof original!=='function'||original.__ktTaekwonWrapped)return;
    var wrapped=function(){
      if(!window.ktIsOwnerLevelExempt())return original.apply(this,arguments);
      var s=window.state;
      if(!s)return original.apply(this,arguments);
      var keys=['level','userLevel','memberLevel','hostLevel'];
      var old={};
      keys.forEach(function(k){old[k]=s[k];s[k]=999;});
      s.ktOwnerLevelBypass=true;
      var result;
      try{
        result=original.apply(this,arguments);
      }catch(err){
        keys.forEach(function(k){if(old[k]===undefined)delete s[k];else s[k]=old[k];});
        delete s.ktOwnerLevelBypass;
        throw err;
      }
      if(result&&typeof result.then==='function'){
        return result.finally(function(){
          keys.forEach(function(k){if(old[k]===undefined)delete s[k];else s[k]=old[k];});
          delete s.ktOwnerLevelBypass;
        });
      }
      keys.forEach(function(k){if(old[k]===undefined)delete s[k];else s[k]=old[k];});
      delete s.ktOwnerLevelBypass;
      return result;
    };
    wrapped.__ktTaekwonWrapped=true;
    window[name]=wrapped;
  }

  wrapOwnerBypass('openRoomPrep');
  wrapOwnerBypass('startBroadcast');

  /* 올라갈 목표 레벨 기준: 2~10은 5,000 / 11부터는 10,000 */
  window.ktLevelUpCostForTarget=function(targetLevel){
    var lv=parseInt(targetLevel,10);
    if(!isFinite(lv)||lv<2)lv=2;
    return lv<=10?5000:10000;
  };

  /* 현재 레벨에서 다음 1레벨 올리는 비용 */
  window.ktNextLevelCost=function(currentLevel){
    var lv=parseInt(currentLevel,10);
    if(!isFinite(lv)||lv<1)lv=1;
    return window.ktLevelUpCostForTarget(lv+1);
  };
})();
