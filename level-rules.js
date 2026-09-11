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

  function ownerAccountDetected(){
    return accountNames().some(isFixedOwnerName);
  }

  /* 태권이·하이네 계정은 어느 화면/방 판정에서도 레벨 1000으로 고정한다. */
  window.ktForceOwnerLevel1000=function(){
    if(!ownerAccountDetected())return false;
    try{
      if(window.state){
        state.level=1000;
        state.userLevel=1000;
        state.memberLevel=1000;
        state.hostLevel=1000;
        state.ktOwnerLevelBypass=true;
      }
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'].forEach(function(k){
        localStorage.setItem(k,'1000');
      });
    }catch(e){}
    return true;
  };

  window.ktIsOwnerLevelExempt=function(){
    return window.ktForceOwnerLevel1000();
  };

  window.ktEffectiveLevel=function(level){
    if(window.ktForceOwnerLevel1000())return 1000;
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
      window.ktForceOwnerLevel1000();
      return original.apply(this,arguments);
    };
    wrapped.__ktTaekwonWrapped=true;
    window[name]=wrapped;
  }

  wrapOwnerBypass('openRoomPrep');
  wrapOwnerBypass('startBroadcast');
  wrapOwnerBypass('selectPrepRoom');
  wrapOwnerBypass('openProfile');

  /* 비밀방 등 다른 파일이 레벨값을 직접 읽어도 클릭 전에 1000으로 맞춘다. */
  document.addEventListener('pointerdown',function(){window.ktForceOwnerLevel1000();},true);
  document.addEventListener('click',function(){window.ktForceOwnerLevel1000();},true);
  window.addEventListener('pageshow',function(){window.ktForceOwnerLevel1000();});
  window.addEventListener('focus',function(){window.ktForceOwnerLevel1000();});
  [0,120,350,800,1600,3200,6000].forEach(function(ms){
    setTimeout(function(){window.ktForceOwnerLevel1000();},ms);
  });

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

/* 구독 요금/혜택 규칙은 별도 파일만 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-sub-tier-rules]'))return;
  var s=document.createElement('script');
  s.src='subscription-tier-rules.js?v=20260911-subtier2';
  s.async=false;
  s.setAttribute('data-kt-sub-tier-rules','1');
  document.head.appendChild(s);
})();

/* 혜택 화면 안내문만 별도 파일로 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-sub-benefits-summary]'))return;
  var s=document.createElement('script');
  s.src='subscriber-benefits-summary.js?v=20260911-benefits1';
  s.async=false;
  s.setAttribute('data-kt-sub-benefits-summary','1');
  document.head.appendChild(s);
})();

/* 닉네임·프로필 사진 여러 기기 동기화만 별도 파일로 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-profile-device-sync]'))return;
  var s=document.createElement('script');
  s.src='profile-device-sync.js?v=20260911-sync1';
  s.async=false;
  s.setAttribute('data-kt-profile-device-sync','1');
  document.head.appendChild(s);
})();

/* 새 채팅과 혜택·보상 화면 AI 읽기만 별도 파일로 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-chat-benefit-ai-reader]'))return;
  var s=document.createElement('script');
  s.src='chat-benefit-ai-reader.js?v=20260911-ai-chat1';
  s.async=false;
  s.setAttribute('data-kt-chat-benefit-ai-reader','1');
  document.head.appendChild(s);
})();

/* 기존 실시간 방송 등록/입장 + 동영상 화면 방송 상태 표시만 다시 연결한다. */
(function(){
  if(document.querySelector('script[data-kt-live-presence]'))return;
  var a=document.createElement('script');
  a.src='live-presence.js?v=20260912-live-restore1';
  a.async=false;
  a.setAttribute('data-kt-live-presence','1');
  a.onload=function(){
    if(document.querySelector('script[data-kt-live-video-discovery]'))return;
    var b=document.createElement('script');
    b.src='live-video-discovery.js?v=20260912-live-restore1';
    b.async=false;
    b.setAttribute('data-kt-live-video-discovery','1');
    document.head.appendChild(b);
  };
  document.head.appendChild(a);
})();
