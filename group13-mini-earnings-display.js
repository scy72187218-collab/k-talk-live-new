/* K-Talk 13명방: 메시지 옆 작은 개인 수익 표시만 보강. 다른 화면은 변경하지 않음. */
(function(){
  if(window.__ktGroup13MiniEarningsDisplayInstalled)return;
  window.__ktGroup13MiniEarningsDisplayInstalled=true;

  function text(id,fallback){
    try{
      var el=document.getElementById(id);
      var v=el&&String(el.textContent||'').trim();
      return v||fallback;
    }catch(e){return fallback;}
  }

  function subscriberByState(){
    try{
      if(window.state){
        if(state.isSubscriber===true||state.subscriber===true||state.paidSubscriber===true)return true;
        var tier=String(state.membership||state.memberType||state.grade||state.userGrade||'').toLowerCase();
        if(tier.indexOf('subscriber')>-1||tier.indexOf('구독')>-1)return true;
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

  function earningInfo(){
    var roses=text('hudEarnRoses','🌹 0송이');
    var net=text('hudEarnNet','0원');
    var raw=text('hudEarnRate','');
    var sub=/40\s*%/.test(raw)||/구독/.test(raw)||subscriberByState();
    return {
      roses:roses,
      net:net,
      member:sub?'구독자':'일반',
      rate:sub?'40%':'35%',
      fullMember:sub?'구독자':'일반회원'
    };
  }

  function addStyle(){
    if(document.getElementById('ktg13MiniEarningsDisplayStyle'))return;
    var s=document.createElement('style');
    s.id='ktg13MiniEarningsDisplayStyle';
    s.textContent=''
      +'.ktg13-person-btn.earn.ktg13-mini-earn{width:auto!important;min-width:46px!important;height:auto!important;min-height:28px!important;padding:2px 4px!important;border-radius:7px!important;border:1px solid #d7ad39!important;background:rgba(28,23,8,.96)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;line-height:1.02!important;white-space:nowrap!important;box-shadow:0 0 5px rgba(215,173,57,.22)!important}'
      +'.ktg13-mini-earn span{display:block!important;font-size:7px!important;font-weight:900!important;letter-spacing:-.2px!important}'
      +'.ktg13-mini-earn .r{color:#ffdb5a!important}.ktg13-mini-earn .n{color:#8fe8ff!important}.ktg13-mini-earn .p{color:#fff!important}'
      +'.ktg13-host .ktg13-mini-earn{min-width:62px!important;min-height:32px!important;padding:2px 5px!important}.ktg13-host .ktg13-mini-earn span{font-size:8px!important}'
      +'.ktg13-guest .ktg13-mini-earn{min-width:43px!important;min-height:25px!important;padding:1px 3px!important}.ktg13-guest .ktg13-mini-earn span{font-size:6.4px!important}'
      +'@media(max-width:390px){.ktg13-guest .ktg13-mini-earn{min-width:39px!important;min-height:23px!important;padding:1px 2px!important}.ktg13-guest .ktg13-mini-earn span{font-size:5.8px!important}.ktg13-host .ktg13-mini-earn{min-width:56px!important}.ktg13-host .ktg13-mini-earn span{font-size:7px!important}}';
    document.head.appendChild(s);
  }

  function paint(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();
    var info=earningInfo();

    /* 아래 기존 수익표도 회원 구분만 정확히 표시 */
    try{
      var rate=document.getElementById('hudEarnRate');
      if(rate)rate.textContent=info.fullMember+' · '+info.rate;
    }catch(e){}

    room.querySelectorAll('.ktg13-person-btn.earn').forEach(function(btn){
      btn.classList.add('ktg13-mini-earn');
      btn.setAttribute('aria-label','내 수익 · 본인만 보기');
      btn.title='내 수익 · 본인만 보기';
      btn.innerHTML='<span class="r">'+info.roses+'</span><span class="n">🔒 내 수익 '+info.net+'</span><span class="p">'+info.member+' '+info.rate+'</span>';
    });
  }

  var ob=new MutationObserver(function(){paint();});
  try{ob.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(paint,0);
  setTimeout(paint,300);
  setTimeout(paint,1000);
  setInterval(paint,800);
})();
