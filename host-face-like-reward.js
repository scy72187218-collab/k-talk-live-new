/* K-Talk 호스트 좋아요: 호스트 화면/좋아요 버튼을 한 번 누를 때마다 하트 1개가 즉시 올라가고 좋아요 1개 반영. */
(function(){
  if(window.__ktHostFaceLikeRewardInstalledV2)return;
  window.__ktHostFaceLikeRewardInstalledV2=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFjZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
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

  function ensureStyle(){
    if(document.getElementById('ktHostTapLikeStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostTapLikeStyle';
    s.textContent=''
      +'.kt-host-tap-heart{position:fixed;z-index:99999;pointer-events:none;font-size:34px;line-height:1;filter:drop-shadow(0 0 8px #ff3c91);animation:ktHostTapHeartUp .78s ease-out forwards}'
      +'@keyframes ktHostTapHeartUp{0%{opacity:.2;transform:translate(-50%,-10%) scale(.72)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-105px) scale(1.38)}}';
    document.head.appendChild(s);
  }

  function showHeartBurst(x,y){
    ensureStyle();
    try{
      var d=document.createElement('div');
      d.className='kt-host-tap-heart';
      d.textContent='💗';
      d.style.left=Math.max(22,Math.min(innerWidth-22,Number(x)||innerWidth/2))+'px';
      d.style.top=Math.max(70,Math.min(innerHeight-55,Number(y)||innerHeight/2))+'px';
      document.body.appendChild(d);
      setTimeout(function(){if(d.parentNode)d.remove();},900);
    }catch(e){}
  }

  function currentRemoteName(){
    try{
      var b=document.querySelector('.kt-remote-meta b');
      var s=b?String(b.textContent||'').trim():'';
      return s.replace(/^LIVE\s*/i,'').replace(/^●\s*/,'').trim()||remoteHostName;
    }catch(e){return remoteHostName;}
  }

  function ensureLikeBadge(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return null;
    var b=document.getElementById('ktHostFaceLikeCount');
    if(!b){
      b=document.createElement('div');
      b.id='ktHostFaceLikeCount';
      b.style.cssText='position:absolute;left:10px;bottom:72px;z-index:10;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font:900 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif;pointer-events:none';
      b.textContent='💗 0';
      root.appendChild(b);
    }
    return b;
  }

  function optimisticRemoteCount(){
    var b=ensureLikeBadge();
    if(!b)return;
    var m=String(b.textContent||'').match(/(\d[\d,]*)/);
    var n=m?parseInt(m[1].replace(/,/g,''),10)||0:0;
    b.textContent='💗 '+(n+1).toLocaleString('ko-KR');
  }

  async function flushLikes(){
    if(sending||pendingLikes<1)return;
    if(!remoteHostId){
      try{remoteHostId=String(window.__ktCurrentRemoteHostId||'');}catch(e){}
    }
    if(!remoteHostId)return;
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
      if(pendingLikes>0&&remoteHostId)setTimeout(flushLikes,80);
    }
  }

  function addRemoteLike(ev){
    if(!remoteHostId){
      try{remoteHostId=String(window.__ktCurrentRemoteHostId||'');}catch(e){}
    }
    optimisticRemoteCount();
    if(ev)showHeartBurst(ev.clientX||innerWidth*.72,ev.clientY||innerHeight*.48);
    else showHeartBurst(innerWidth*.72,innerHeight*.48);
    if(remoteHostId){pendingLikes++;flushLikes();}
  }

  function localHostArea(target){
    if(!target||!target.closest)return null;
    var area=target.closest('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host');
    if(area)return area;
    var v=target.closest('#ktLiveVideo');
    return v?(v.parentElement||v):null;
  }

  function localHostLike(ev){
    try{if(typeof window.addHostLike==='function')window.addHostLike(1);}catch(e){}
    var x=ev&&ev.clientX?ev.clientX:innerWidth*.45;
    var y=ev&&ev.clientY?ev.clientY:innerHeight*.45;
    showHeartBurst(x,y);
  }

  function wrapEnter(){
    var fn=window.ktEnterRemoteLive;
    if(typeof fn!=='function'||fn.__ktHostFaceLikeWrappedV2)return false;
    var wrapped=async function(hostId){
      remoteHostId=String(hostId||'');
      window.__ktCurrentRemoteHostId=remoteHostId;
      var r=await fn.apply(this,arguments);
      setTimeout(function(){
        remoteHostName=currentRemoteName();
        var b=ensureLikeBadge();
        if(!remoteHostId)return;
        rpc('ktalk_host_face_like_status',{p_host_id:remoteHostId}).then(function(out){
          var row=Array.isArray(out)?out[0]:out;
          if(row&&b)b.textContent='💗 '+(parseInt(row.likes||0,10)||0).toLocaleString('ko-KR');
        }).catch(function(){});
      },180);
      return r;
    };
    wrapped.__ktHostFaceLikeWrappedV2=true;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  /* 호스트 화면을 직접 누르면: 매번 하트 1개 + 좋아요 1개 */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;

    /* 원격 방송 호스트 영상 영역 */
    var remoteRoot=t.closest('.kt-remote-live');
    if(remoteRoot){
      if(t.closest('button,input,textarea,a'))return;
      if(t.id==='ktRemoteLiveVideo'||t.classList.contains('kt-remote-shade')||t.classList.contains('kt-remote-status')||t.closest('#ktRemoteLiveVideo')){
        addRemoteLike(e);
      }
      return;
    }

    /* 내 방송방 호스트 영상/호스트 칸 */
    var area=localHostArea(t);
    if(area&&!t.closest('button,input,textarea,a')){
      localHostLike(e);
    }
  },true);

  /* 기존 좋아요 버튼도 누를 때마다 하트가 1개씩 올라가도록 보강 */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!b)return;
    var txt=String(b.textContent||'');
    var aria=String(b.getAttribute('aria-label')||'');
    var isLike=b.classList.contains('like')||b.classList.contains('heart')||aria==='좋아요'||txt.indexOf('좋아요')>-1;
    if(!isLike)return;

    if(b.closest('.kt-remote-live')){
      /* 원격 좋아요 버튼: 서버 좋아요도 1개씩 즉시 반영 */
      addRemoteLike(e);
      return;
    }

    if(b.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room')||b.querySelector('#hostLikeCount')){
      /* 버튼 자체의 기존 addHostLike 호출은 그대로 두고 하트 표시만 추가 */
      showHeartBurst(e.clientX||innerWidth*.78,e.clientY||innerHeight*.42);
    }
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
      }
    }catch(e){}
  }

  ensureStyle();
  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(wrapEnter()||tries>120)clearInterval(timer);
  },150);
  setTimeout(wrapEnter,0);
  setTimeout(wrapEnter,500);
  setInterval(pollHostReward,4000);
  setTimeout(pollHostReward,1200);
})();

/* 메인 화면 바깥의 무료 아침·점심·저녁 돌리기만 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-daily-spin]'))return;
  var s=document.createElement('script');
  s.src='daily-spin-reward.js?v=20260911-spin2';
  s.async=false;
  s.setAttribute('data-kt-daily-spin','1');
  document.head.appendChild(s);
})();
