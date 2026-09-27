/* K-Talk reward rules 2026-09-28
   - First join + verified adult status => +300 coins once.
   - Friend-entry join + 2h active use per day for 5 distinct days => +300 coins once.
   This file does NOT perform adult identity verification itself. It only grants
   the reward after an external verification flow marks the member verified. */
(function(){
  if(window.__ktSignupAdultFriendRewards20260928)return;
  window.__ktSignupAdultFriendRewards20260928=true;

  var COIN_KEY='ktalk_coin_balance';
  var ADULT_REWARD_KEY='ktalk_reward_adult_signup_300';
  var FRIEND_JOIN_KEY='ktalk_friend_site_joined';
  var FRIEND_REWARD_KEY='ktalk_reward_friend_2h_5days_300';
  var FRIEND_DAYS_KEY='ktalk_friend_mission_days_v1';
  var ACTIVE_TICK_MS=30000;

  function today(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function joined(){
    try{return localStorage.getItem('ktalk_joined')==='1';}catch(e){return false;}
  }
  function adultVerified(){
    try{
      if(localStorage.getItem('ktalk_adult_verified')==='1')return true;
      if(localStorage.getItem('ktalk_adult_auth_complete')==='1')return true;
    }catch(e){}
    try{return !!(window.state&&state.adult===true);}catch(e){return false;}
  }
  function friendJoined(){
    try{
      if(localStorage.getItem(FRIEND_JOIN_KEY)==='1')return true;
      var q=new URLSearchParams(location.search||'');
      if(q.get('from')==='friend'||q.get('ref')==='friend'){
        localStorage.setItem(FRIEND_JOIN_KEY,'1');
        return true;
      }
    }catch(e){}
    return false;
  }
  function coinBalance(){
    try{return Math.max(0,parseInt(localStorage.getItem(COIN_KEY)||'0',10)||0);}catch(e){return 0;}
  }
  function addCoins(n,reason){
    n=Math.max(0,parseInt(n,10)||0);if(!n)return;
    var next=coinBalance()+n;
    try{localStorage.setItem(COIN_KEY,String(next));}catch(e){}
    try{
      if(window.state){
        state.coins=next;
        state.coinBalance=next;
      }
    }catch(e){}
    try{
      window.dispatchEvent(new CustomEvent('ktalk-coin-reward',{detail:{amount:n,balance:next,reason:reason||''}}));
    }catch(e){}
    try{
      if(typeof window.ktSpeak==='function')window.ktSpeak('코인 '+n+'개 보상이 지급되었습니다.');
    }catch(e){}
    try{
      if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('reward',{text:(reason||'미션 성공')+' · 코인 '+n+'개 지급'});
    }catch(e){}
  }

  function grantAdultSignupReward(){
    if(!joined()||!adultVerified())return false;
    try{if(localStorage.getItem(ADULT_REWARD_KEY)==='1')return false;}catch(e){}
    try{localStorage.setItem(ADULT_REWARD_KEY,'1');}catch(e){}
    addCoins(300,'첫 가입 · 성인 인증 완료 보상');
    try{alert('🎉 첫 가입 + 성인 인증 완료 보상으로 코인 300개가 지급되었습니다.');}catch(e){}
    return true;
  }

  function loadDays(){
    try{
      var x=JSON.parse(localStorage.getItem(FRIEND_DAYS_KEY)||'{}');
      return x&&typeof x==='object'?x:{};
    }catch(e){return {};}
  }
  function saveDays(x){try{localStorage.setItem(FRIEND_DAYS_KEY,JSON.stringify(x||{}));}catch(e){}}
  function completedDays(x){
    return Object.keys(x||{}).filter(function(k){return Number(x[k]||0)>=7200000;}).length;
  }
  function grantFriendMissionReward(){
    if(!friendJoined()||!joined())return false;
    try{if(localStorage.getItem(FRIEND_REWARD_KEY)==='1')return false;}catch(e){}
    var days=loadDays();
    if(completedDays(days)<5)return false;
    try{localStorage.setItem(FRIEND_REWARD_KEY,'1');}catch(e){}
    addCoins(300,'친구 가입 · 2시간 이상 5일 참석 미션');
    try{alert('🎉 친구 사이트 미션 성공! 코인 300개가 지급되었습니다.');}catch(e){}
    return true;
  }

  function tickFriendMission(){
    if(document.hidden||!friendJoined()||!joined())return;
    var d=today(),days=loadDays();
    var cur=Math.max(0,Number(days[d]||0));
    if(cur<7200000){
      days[d]=Math.min(7200000,cur+ACTIVE_TICK_MS);
      saveDays(days);
    }
    grantFriendMissionReward();
  }

  window.ktGrantAdultSignupReward20260928=grantAdultSignupReward;
  window.ktFriendMissionStatus20260928=function(){
    var days=loadDays(),done=completedDays(days),todayMs=Number(days[today()]||0);
    return {
      joined:friendJoined(),
      completedDays:done,
      todayMinutes:Math.floor(todayMs/60000),
      rewarded:(function(){try{return localStorage.getItem(FRIEND_REWARD_KEY)==='1';}catch(e){return false;}})()
    };
  };

  function run(){
    grantAdultSignupReward();
    grantFriendMissionReward();
  }

  run();
  setInterval(function(){run();tickFriendMission();},ACTIVE_TICK_MS);
  window.addEventListener('focus',run);
  window.addEventListener('pageshow',run);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)run();});
})();