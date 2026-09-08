/* K-Talk 13명방: 기존 수익 버튼 위치/크기는 그대로 두고, 눌렀을 때 표시 내용만 보강. */
(function(){
  if(window.__ktGroup13EarningsPopup20260908Installed)return;
  window.__ktGroup13EarningsPopup20260908Installed=true;

  function txt(id,fallback){
    try{
      var el=document.getElementById(id);
      var v=el&&String(el.textContent||'').trim();
      return v||fallback;
    }catch(e){return fallback;}
  }

  function isSubscriber(){
    var rate=txt('hudEarnRate','');
    if(/40\s*%/.test(rate)||/구독/.test(rate))return true;
    try{
      if(window.state){
        if(state.isSubscriber===true||state.subscriber===true||state.paidSubscriber===true)return true;
        var t=String(state.membership||state.memberType||state.grade||state.userGrade||'').toLowerCase();
        if(t.indexOf('subscriber')>-1||t.indexOf('구독')>-1)return true;
      }
    }catch(e){}
    try{
      var keys=['ktalk_is_subscriber','ktalk_subscriber','ktalk_membership','ktalk_member_type','ktalk_grade','ktalk_user_grade'];
      for(var i=0;i<keys.length;i++){
        var v=String(localStorage.getItem(keys[i])||'').toLowerCase();
        if(v==='1'||v==='true'||v.indexOf('subscriber')>-1||v.indexOf('구독')>-1)return true;
      }
    }catch(e){}
    return false;
  }

  function openEarnings(){
    var net=txt('hudEarnNet','0원');
    var roses=txt('hudEarnRoses','🌹 0송이');
    var sub=isSubscriber();
    var member=sub?'구독자':'일반회원';
    var rate=sub?'40%':'35%';
    if(typeof window.showSheet==='function'){
      showSheet('🔒 내 수익 · 본인만 보기',
        '<div class="rowbox"><b>내 수익</b><br>이 내용은 현재 사용하는 본인 화면에서만 확인됩니다.</div>'+
        '<div style="padding:14px;border:1px solid #d5ae39;border-radius:15px;background:#17140b;color:#fff">'+
          '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;padding:7px 2px;border-bottom:1px solid rgba(255,255,255,.1)"><b>🌹 장미 송이</b><strong style="color:#ffd85a">'+roses.replace(/^🌹\s*/, '')+'</strong></div>'+
          '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;padding:9px 2px;border-bottom:1px solid rgba(255,255,255,.1)"><b>🔒 내 수익</b><strong style="font-size:20px;color:#ffe36a">'+net+'</strong></div>'+
          '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;padding:7px 2px"><b>'+member+'</b><strong style="color:#8fe8ff">'+rate+'</strong></div>'+
          '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.1);font-size:11px;color:#ddd;text-align:center">일반회원 35% · 구독자 40%</div>'+
        '</div>');
    }
  }

  window.ktGroup13OpenMyEarnings=openEarnings;
  window.ktGroup13MyEarnings=openEarnings;
})();
