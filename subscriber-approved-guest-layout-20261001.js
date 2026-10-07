/* K-Talk 2026-10-01 — 5555
   구독자방 승인 게스트 화면만 조정.
   1) 승인 뒤 되돌리기/패키지 상자/매치 3칸 표시
   2) 그 3칸이 들어간 만큼 게스트 칸은 자연스럽게 작아짐
   3) 수익률 박스는 구독자 호스트방의 작은 크기(76px)와 동일
   다른 방/통신/승인/퇴장/하단 버튼은 변경하지 않음. */
(function(){
  if(window.__ktSubscriberApprovedGuestLayout20261001)return;
  window.__ktSubscriberApprovedGuestLayout20261001=true;

  function live(st){
    try{return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));}
    catch(e){return false;}
  }

  function localViewerId(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      return d?'viewer_'+d:'';
    }catch(e){return '';}
  }

  function approved(){
    try{
      if(document.querySelector('.kt-remote-live .kt-guest-hostlike-room,.kt-remote-live.kt-approved-guest-room'))return true;
      var id=localViewerId(), map=window.__ktApprovedGuestIds20260924||{};
      if(id&&map[id]===true)return true;
      if(live(window.__ktApprovedGuestSelfStream)||live(window.__ktLocalGuestCameraStream20260926))return true;
    }catch(e){}
    return false;
  }

  function isSubscriberRoom(root){
    var t='';
    try{
      var st=window.state||{};
      t+=' '+String(st.liveRoomType||'')+' '+String(st.liveRoomName||'');
    }catch(e){}
    try{
      var r=window.__ktLastLiveRoom||{};
      t+=' '+String(r.room_type||'')+' '+String(r.room_name||'')+' '+String(r.title||'');
    }catch(e){}
    try{t+=' '+String(window.__ktRemoteRoomType||'')+' '+String(window.__ktRemoteRoomName||'');}catch(e){}
    try{t+=' '+String(root&&root.textContent||'');}catch(e){}
    return /subscriber|구독자/i.test(t);
  }

  /* 4444: 구독자 15명방 게스트에서는 되돌리기/보물상자/매치 3개를 표시하지 않는다. */
  function ensureStyle(){
    if(document.getElementById('ktSubscriberApprovedGuestLayoutStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberApprovedGuestLayoutStyle20261001';
    s.textContent=''
      +'.kt-remote-live.kt-sub-approved-5555 .kt-sub-approved-quick-5555,'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-quick{display:none!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kt-guest-hostlike-room{gap:4px!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-chat{grid-template-columns:minmax(0,1fr) 76px!important;gap:4px!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important;align-self:end!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn .top{gap:1px!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn .top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn .top b{font-size:7px!important;line-height:1!important}'
      +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'.kt-remote-live.kt-sub-approved-5555>#ktAllRoomGuestEarnHud20260921{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important;right:7px!important}'
      +'.kt-remote-live.kt-sub-approved-5555>#ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-remote-live.kt-sub-approved-5555>#ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}'
      +'.kt-remote-live.kt-sub-approved-5555>#ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'@media(max-width:390px){'
        +'.kt-remote-live.kt-sub-approved-5555 .kgh-chat{grid-template-columns:minmax(0,1fr) 72px!important}'
        +'.kt-remote-live.kt-sub-approved-5555 .kgh-earn,.kt-remote-live.kt-sub-approved-5555>#ktAllRoomGuestEarnHud20260921{width:72px!important;min-width:72px!important;max-width:72px!important;height:43px!important;max-height:43px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function findStats(root){
    var sel=['.kgh-stats','.kt-approved-guest-stats','.kt-prejoin-room-stats','.kt-guest-room-stats','.ktg13-stats'];
    for(var i=0;i<sel.length;i++){
      var el=root.querySelector(sel[i]);
      if(el)return el;
    }
    var nodes=[].slice.call(root.querySelectorAll('div,section,nav'));
    return nodes.find(function(el){
      if(el.closest('.kt-remote-bottom,.kt-remote-chat,.kgh-chat'))return false;
      var t=String(el.textContent||'').replace(/\s+/g,'');
      return /일일랭킹/.test(t)&&/미션/.test(t)&&/시청자/.test(t);
    })||null;
  }

  function findGrid(root){
    var sel=['.kgh-main','.kt-approved-guest-grid','.kt-guest-room-grid','.kt-prejoin-room-grid','.ktg13-main','.ktsubscriber-people'];
    for(var i=0;i<sel.length;i++){
      var el=root.querySelector(sel[i]);
      if(el)return el;
    }
    return null;
  }

  function install(){
    ensureStyle();
    if(!approved())return;
    var root=document.querySelector('.kt-remote-live');
    if(!root||!isSubscriberRoom(root))return;
    root.classList.add('kt-sub-approved-5555');

    root.querySelectorAll('.kgh-quick,.kt-sub-approved-quick-5555,.kt-viewer-quick-20261001,.kt-remote-guest-upper-quick-5555').forEach(function(x){try{x.remove();}catch(e){}});
  }

  window.addEventListener('kt-guest-approval-received',function(){
    [0,20,60,140,300,600].forEach(function(ms){setTimeout(install,ms);});
  });
  window.addEventListener('kt-any-guest-approved',function(){setTimeout(install,0);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(install,0);});

  install();
  [50,150,350,700,1200,2200].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSubApproved5555Timer);
      window.__ktSubApproved5555Timer=setTimeout(install,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();