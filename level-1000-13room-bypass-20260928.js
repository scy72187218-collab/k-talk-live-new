/* K-Talk: 레벨 1000/관리자 13명방 구형 제한 우회.
   다른 팝업/방/기능은 변경하지 않는다. */
(function(){
  if(window.__ktLevel1000Room13Bypass20260928)return;
  window.__ktLevel1000Room13Bypass20260928=true;

  function n(v){
    var x=parseInt(String(v==null?'':v).replace(/[^0-9]/g,''),10);
    return isFinite(x)?x:0;
  }

  function currentLevel(){
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
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel']
        .forEach(function(k){best=Math.max(best,n(localStorage.getItem(k)));});
    }catch(e){}
    try{
      if(typeof window.ktIsOwnerLevelExempt==='function'&&window.ktIsOwnerLevelExempt())best=1000;
    }catch(e){}
    try{
      var s2=window.state||{};
      if(s2.ktOwnerAdmin||s2.ktOwnerLevelBypass)best=1000;
    }catch(e){}
    return best;
  }

  function isOld13LevelMessage(msg){
    msg=String(msg||'');
    return msg.indexOf('13명방')>-1 &&
      msg.indexOf('레벨')>-1 &&
      (msg.indexOf('만들 수 있습니다')>-1||msg.indexOf('사용할 수 있습니다')>-1||msg.indexOf('입장')>-1);
  }

  var nativeAlert=window.alert;
  window.alert=function(msg){
    if(currentLevel()>=20 && isOld13LevelMessage(msg))return;
    return nativeAlert.apply(this,arguments);
  };

  function keepLevel(){
    try{
      if(window.state){
        var lv=currentLevel();
        if(lv>=20){
          state.level=Math.max(n(state.level),lv);
          state.userLevel=Math.max(n(state.userLevel),lv);
          state.memberLevel=Math.max(n(state.memberLevel),lv);
          state.hostLevel=Math.max(n(state.hostLevel),lv);
        }
      }
    }catch(e){}
    try{
      window.ktLevelCanOpen13=function(){return true;};
      window.ktCanCreateRoomByLevel=function(roomType,level){
        var t=String(roomType||'').toLowerCase();
        if(t==='group'||t==='group13'||t==='13')return true;
        return true;
      };
      window.ktCanEnterRoomByLevel=function(roomType,level,isSubscriber){
        var t=String(roomType||'').toLowerCase();
        if(t==='group'||t==='group13'||t==='13')return true;
        return true;
      };
    }catch(e){}
  }

  keepLevel();
  [50,150,400,900,1800,3500].forEach(function(ms){setTimeout(keepLevel,ms);});
  setInterval(keepLevel,1500);
})();