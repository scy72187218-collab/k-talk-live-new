/* K-Talk 레벨 규칙 + 태권이·하이네 계정 레벨 1000. 방 입장 기준은 13명방 20, 15명방 35로 잠금. */
(function(){
  if(window.__ktLevelCostRulesInstalled)return;
  window.__ktLevelCostRulesInstalled=true;

  function cleanName(v){
    return String(v==null?'':v).replace(/\s+/g,'').trim();
  }

  function accountNames(){
    var list=[];
    function add(v){
      var n=cleanName(v);
      if(n&&list.indexOf(n)<0)list.push(n);
    }
    try{
      if(window.state){
        [state.nickname,state.nickName,state.userName,state.username,state.profileName,state.displayName,state.name,state.accountName].forEach(add);
      }
    }catch(e){}
    try{
      ['ktalk_nickname','ktalk_username','ktalk_profile_name','nickname','userName','username','profileName','displayName','accountName'].forEach(function(k){
        add(localStorage.getItem(k));
      });
    }catch(e){}
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad();
        if(p)add(p.name);
      }
    }catch(e){}
    return list;
  }

  function isFixedOwnerName(n){
    n=cleanName(n);
    return n==='태권'||n==='태권이'||n==='하이네';
  }

  /* 태권이·하이네는 레벨 1000으로 유지. */
  window.ktIsOwnerLevelExempt=function(){
    return accountNames().some(isFixedOwnerName);
  };

  window.ktEffectiveLevel=function(level){
    if(window.ktIsOwnerLevelExempt())return 1000;
    var lv=parseInt(level,10);
    return isFinite(lv)&&lv>0?lv:1;
  };

  /* 방 생성 기준도 동일: 13명방 20+, 15명방 35+. */
  window.ktCanCreateRoomByLevel=function(roomType,level){
    var lv=window.ktEffectiveLevel(level);
    var t=String(roomType||'').toLowerCase();
    if(t.indexOf('15')>-1||t==='group15')return lv>=35;
    if(t.indexOf('13')>-1||t==='group13')return lv>=20;
    return true;
  };

  /* 방 입장 기준 다시 잠금: 구독 여부와 상관없이 레벨 기준 적용. */
  window.ktCanEnterRoomByLevel=function(roomType,level,isSubscriber){
    var lv=window.ktEffectiveLevel(level);
    var t=String(roomType||'').toLowerCase();
    if(t.indexOf('15')>-1||t==='group15')return lv>=35;
    if(t.indexOf('13')>-1||t==='group13')return lv>=20;
    return true;
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
      keys.forEach(function(k){old[k]=s[k];s[k]=1000;});
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
