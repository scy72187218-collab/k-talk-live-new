/* K-Talk 2026-09-21: 모든 승인 게스트 화면에 본인 수익/장미/수익률 표시.
   대상: 1인방 / 9명방 / 13명방 / 구독방 / 비밀방.
   다른 방 배치, 영상통신, 채팅, 선물, 스위치에는 손대지 않음. */
(function(){
  if(window.__ktAllRoomGuestEarningsHud20260921)return;
  window.__ktAllRoomGuestEarningsHud20260921=true;

  var localRoses=0;

  function live(st){
    try{
      return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function approvedGuestActive(){
    try{
      if(document.querySelector('.kt-guest-hostlike-room,.kt-remote-live.kt-approved-guest-room'))return true;
      if(live(window.__ktApprovedGuestSelfStream))return true;
      var v=document.getElementById('ktRemoteGuestSelfVideo');
      if(v&&live(v.srcObject))return true;
      var main=document.getElementById('ktRemoteLiveVideo');
      if(main&&main.muted&&live(main.srcObject)&&window.__ktRemoteHostStream&&main.srcObject!==window.__ktRemoteHostStream)return true;
    }catch(e){}
    return false;
  }

  function rateInfo(){
    try{
      var saved=localStorage.getItem('ktalk_member_type');
      if(saved==='subscriber')return {rate:.40,label:'구독자회원 40%'};
    }catch(e){}
    try{
      if(window.state&&(state.memberType==='subscriber'||state.subscribed===true||state.subscriptionActive===true)){
        return {rate:.40,label:'구독자회원 40%'};
      }
    }catch(e){}
    return {rate:.35,label:'일반회원 35%'};
  }

  function currentRoseCount(){
    try{
      var e=document.getElementById('ktGuestEarnRoses');
      if(e){
        var n=parseInt(String(e.textContent||'').replace(/[^0-9]/g,''),10);
        if(isFinite(n))return n;
      }
    }catch(e){}
    return Math.max(0,localRoses||0);
  }

  function money(roses){
    var r=rateInfo();
    return Math.round((parseInt(roses,10)||0)*30*r.rate).toLocaleString('ko-KR')+'원';
  }

  function ensureStyle(){
    if(document.getElementById('ktAllRoomGuestEarningsHudStyle20260921'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomGuestEarningsHudStyle20260921';
    s.textContent=''
      +'.kt-allroom-guest-earn{position:absolute!important;right:7px!important;bottom:72px!important;z-index:2147482000!important;width:108px!important;min-width:108px!important;height:62px!important;max-height:62px!important;padding:3px 4px!important;box-sizing:border-box!important;border:1px solid #d2a936!important;border-radius:10px!important;background:linear-gradient(135deg,rgba(23,20,11,.94),rgba(13,13,18,.94))!important;color:#fff!important;text-align:center!important;overflow:hidden!important;box-shadow:0 2px 8px rgba(0,0,0,.35)!important;pointer-events:auto!important}'
      +'.kt-allroom-guest-earn .kt-ge-top{display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;white-space:nowrap!important}'
      +'.kt-allroom-guest-earn .kt-ge-top span{font-size:5.7px!important;color:#8fe8ff!important;font-weight:950!important}'
      +'.kt-allroom-guest-earn .kt-ge-top b{font-size:8.5px!important;color:#ffe071!important;font-weight:950!important}'
      +'.kt-allroom-guest-earn .kt-ge-detail{display:grid!important;grid-template-columns:1fr auto!important;gap:1px 3px!important;margin-top:2px!important;font-size:5.5px!important;line-height:1.08!important;color:#ddd!important;white-space:nowrap!important}'
      +'.kt-allroom-guest-earn .kt-ge-detail .full{grid-column:1/-1!important;text-align:right!important}'
      +'.kt-allroom-guest-earn .kt-ge-detail .note{grid-column:1/-1!important;text-align:right!important;color:#ffe071!important;font-size:5px!important}'
      +'.kt-guest-hostlike-room .kgh-earn{display:block!important;visibility:visible!important;opacity:1!important}'
      +'.kt-guest-hostlike-room .kgh-earn-detail{display:grid!important}'
      +'@media(max-width:390px){.kt-allroom-guest-earn{right:5px!important;bottom:68px!important;width:101px!important;min-width:101px!important;height:59px!important;max-height:59px!important;padding:2px 3px!important}.kt-allroom-guest-earn .kt-ge-top span{font-size:5.2px!important}.kt-allroom-guest-earn .kt-ge-top b{font-size:8px!important}.kt-allroom-guest-earn .kt-ge-detail{font-size:5.1px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function syncExistingHud(){
    var existing=document.getElementById('ktGuestEarnHud');
    if(!existing)return false;
    existing.style.setProperty('display','block','important');
    existing.style.setProperty('visibility','visible','important');
    existing.style.setProperty('opacity','1','important');
    var d=document.getElementById('ktGuestEarnDetail');
    if(d)d.style.setProperty('display','grid','important');
    return true;
  }

  function buildGeneric(root){
    var h=document.getElementById('ktAllRoomGuestEarnHud20260921');
    if(!h){
      h=document.createElement('div');
      h.id='ktAllRoomGuestEarnHud20260921';
      h.className='kt-allroom-guest-earn';
      h.setAttribute('aria-label','게스트 본인 수익');
      root.appendChild(h);
    }else if(h.parentElement!==root){
      root.appendChild(h);
    }

    var roses=currentRoseCount();
    var r=rateInfo();
    h.innerHTML=''
      +'<div class="kt-ge-top"><span>🔒 내 수익 · 본인만 표시</span><b>'+money(roses)+'</b></div>'
      +'<div class="kt-ge-detail">'
        +'<span>🌹 '+roses.toLocaleString('ko-KR')+'송이</span><span>'+r.label+'</span>'
        +'<span class="full">구독자회원 40% · 소속사 65%</span>'
        +'<span class="note">소속사 가입은 소속사가 결정</span>'
      +'</div>';
  }

  function render(){
    ensureStyle();
    var root=document.querySelector('.kt-remote-live');
    var generic=document.getElementById('ktAllRoomGuestEarnHud20260921');

    if(!root){
      if(generic)generic.remove();
      return;
    }

    /* 일부 게스트 화면은 승인/본인영상 표시 마커가 달리지 않으므로
       실제 원격 방송방(.kt-remote-live)이 열려 있으면 수익표를 항상 표시한다. */
    var existing=root.querySelector('#ktGuestEarnHud');
    if(existing){
      existing.style.setProperty('display','block','important');
      existing.style.setProperty('visibility','visible','important');
      existing.style.setProperty('opacity','1','important');
      var ed=existing.querySelector('#ktGuestEarnDetail')||document.getElementById('ktGuestEarnDetail');
      if(ed)ed.style.setProperty('display','grid','important');
      if(generic)generic.remove();
      return;
    }

    try{
      var cs=getComputedStyle(root);
      if(cs.position==='static')root.style.setProperty('position','relative','important');
    }catch(e){}
    buildGeneric(root);
  }

  function wrapEarnFunction(){
    var old=window.ktGuestAddEarnedRoses;
    if(old&&old.__ktAllRoomGuestEarnWrapped20260921)return;
    var wrapped=function(count){
      var n=parseInt(count,10)||0;
      if(n<=0)return;
      if(typeof old==='function'){
        try{old.apply(window,arguments);}catch(e){}
      }
      localRoses+=n;
      setTimeout(render,0);
      setTimeout(render,80);
    };
    wrapped.__ktAllRoomGuestEarnWrapped20260921=true;
    window.ktGuestAddEarnedRoses=wrapped;
  }

  function keep(){
    wrapEarnFunction();
    render();
  }

  keep();
  [60,180,400,800,1500,2600].forEach(function(ms){setTimeout(keep,ms);});
  setInterval(keep,500);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomGuestEarnTimer20260921);
      window.__ktAllRoomGuestEarnTimer20260921=setTimeout(keep,30);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();