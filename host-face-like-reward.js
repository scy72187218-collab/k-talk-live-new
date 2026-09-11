/* K-Talk 호스트 얼굴 좋아요 보상 전용. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktHostFaceLikeRewardInstalled)return;
  window.__ktHostFaceLikeRewardInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var remoteHostId='';
  var remoteHostName='K-Talk 호스트';
  var pendingLikes=0;
  var sending=false;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  async function rpc(name,body){
    var r=await fetch(BASE+'rpc/'+name,{
      method:'POST',
      headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},
      body:JSON.stringify(body||{})
    });
    if(!r.ok)throw new Error('host like '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):null;
  }

  function addRoseToVisibleHost(delta){
    if(!delta||delta<1)return;
    var el=document.getElementById('hudEarnRoses')||document.getElementById('ktSubscriberEarnRoses');
    if(!el)return;
    var text=String(el.textContent||'');
    var m=text.match(/(\d[\d,]*)/);
    var n=m?parseInt(m[1].replace(/,/g,''),10)||0:0;
    el.textContent='🌹 '+(n+delta)+'송이';
  }

  function ensureLikeBadge(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return null;
    var b=document.getElementById('ktHostFaceLikeCount');
    if(!b){
      b=document.createElement('div');
      b.id='ktHostFaceLikeCount';
      b.style.cssText='position:absolute;left:10px;bottom:22px;z-index:7;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font:900 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif;pointer-events:none';
      b.textContent='💗 0';
      root.appendChild(b);
    }
    return b;
  }

  function showHeartBurst(x,y){
    try{
      var d=document.createElement('div');
      d.textContent='💗';
      d.style.cssText='position:fixed;left:'+(x-16)+'px;top:'+(y-22)+'px;z-index:99999;font-size:34px;pointer-events:none;transition:.55s ease;filter:drop-shadow(0 0 8px #ff3c91)';
      document.body.appendChild(d);
      requestAnimationFrame(function(){d.style.transform='translateY(-55px) scale(1.35)';d.style.opacity='0';});
      setTimeout(function(){if(d.parentNode)d.remove();},650);
    }catch(e){}
  }

  function currentRemoteName(){
    try{
      var b=document.querySelector('.kt-remote-meta b');
      var s=b?String(b.textContent||'').trim():'';
      return s.replace(/^LIVE\s*/i,'').trim()||remoteHostName;
    }catch(e){return remoteHostName;}
  }

  async function flushLikes(){
    if(sending||pendingLikes<1||!remoteHostId)return;
    sending=true;
    try{
      while(pendingLikes>0&&remoteHostId){
        pendingLikes--;
        remoteHostName=currentRemoteName();
        var out=await rpc('ktalk_add_host_face_like',{
          p_host_id:remoteHostId,
          p_host_name:remoteHostName,
          p_viewer_id:deviceId()
        });
        var row=Array.isArray(out)?out[0]:out;
        if(row){
          var likes=parseInt(row.likes||0,10)||0;
          var badge=ensureLikeBadge();
          if(badge)badge.textContent='💗 '+likes.toLocaleString('ko-KR');
        }
      }
    }catch(e){}finally{
      sending=false;
      if(pendingLikes>0)setTimeout(flushLikes,80);
    }
  }

  function addLike(ev){
    if(!remoteHostId)return;
    pendingLikes++;
    if(ev)showHeartBurst(ev.clientX||innerWidth/2,ev.clientY||innerHeight/2);
    flushLikes();
  }

  function wrapEnter(){
    var fn=window.ktEnterRemoteLive;
    if(typeof fn!=='function'||fn.__ktHostFaceLikeWrapped)return false;
    var wrapped=async function(hostId){
      remoteHostId=String(hostId||'');
      window.__ktCurrentRemoteHostId=remoteHostId;
      var r=await fn.apply(this,arguments);
      setTimeout(function(){
        remoteHostName=currentRemoteName();
        ensureLikeBadge();
        rpc('ktalk_host_face_like_status',{p_host_id:remoteHostId}).then(function(out){
          var row=Array.isArray(out)?out[0]:out;
          var b=ensureLikeBadge();
          if(row&&b)b.textContent='💗 '+(parseInt(row.likes||0,10)||0).toLocaleString('ko-KR');
        }).catch(function(){});
      },180);
      return r;
    };
    wrapped.__ktHostFaceLikeWrapped=true;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||t.id!=='ktRemoteLiveVideo')return;
    e.preventDefault();
    addLike(e);
  },true);

  async function pollHostReward(){
    var hostId=deviceId();
    if(!hostId)return;
    try{
      var out=await rpc('ktalk_host_face_like_status',{p_host_id:hostId});
      var row=Array.isArray(out)?out[0]:out;
      if(!row)return;
      var rewarded=parseInt(row.roses_rewarded||0,10)||0;
      var key='ktalk_host_like_reward_seen:'+hostId;
      var seen=0;
      try{seen=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}
      if(rewarded>seen){
        var delta=rewarded-seen;
        try{localStorage.setItem(key,String(rewarded));}catch(e){}
        addRoseToVisibleHost(delta);
        try{if(window.ktAnnounceEvent)window.ktAnnounceEvent('reward',{text:'K-Talk 좋아요 보상으로 장미 '+delta+'송이를 받았습니다.'});}catch(e){}
        try{alert('🌹 K-Talk 좋아요 보상! 장미 '+delta+'송이를 받았습니다.');}catch(e){}
      }
    }catch(e){}
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(wrapEnter()||tries>80)clearInterval(timer);
  },150);
  setTimeout(wrapEnter,0);
  setInterval(pollHostReward,4000);
  setTimeout(pollHostReward,1200);
})();

/* 메인 화면 바깥의 무료 아침·점심·저녁 돌리기만 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-daily-spin]'))return;
  var s=document.createElement('script');
  s.src='daily-spin-reward.js?v=20260911-spin1';
  s.async=false;
  s.setAttribute('data-kt-daily-spin','1');
  document.head.appendChild(s);
})();
