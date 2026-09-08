/* K-Talk 13명방: 기존 메시지 옆 수익 버튼 안에 작은 장미·내수익·회원 정산율만 표시. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktGroup13InlineEarnings20260908Installed)return;
  window.__ktGroup13InlineEarnings20260908Installed=true;

  function text(id,fallback){
    try{
      var el=document.getElementById(id);
      var v=el&&String(el.textContent||'').trim();
      return v||fallback;
    }catch(e){return fallback;}
  }

  function isSubscriber(raw){
    raw=String(raw||'').toLowerCase();
    if(/40\s*%/.test(raw)||raw.indexOf('구독')>-1||raw.indexOf('subscriber')>-1)return true;
    try{
      if(window.state){
        if(state.isSubscriber===true||state.subscriber===true||state.paidSubscriber===true)return true;
        var t=String(state.membership||state.memberType||state.grade||state.userGrade||'').toLowerCase();
        if(t.indexOf('구독')>-1||t.indexOf('subscriber')>-1)return true;
      }
    }catch(e){}
    try{
      var keys=['ktalk_is_subscriber','ktalk_subscriber','ktalk_membership','ktalk_member_type','ktalk_grade','ktalk_user_grade'];
      for(var i=0;i<keys.length;i++){
        var v=String(localStorage.getItem(keys[i])||'').toLowerCase();
        if(v==='1'||v==='true'||v.indexOf('구독')>-1||v.indexOf('subscriber')>-1)return true;
      }
    }catch(e){}
    return false;
  }

  function info(){
    var roses=text('hudEarnRoses','🌹 0송이').replace(/^🌹\s*/, '');
    var net=text('hudEarnNet','0원');
    var raw=text('hudEarnRate','');
    var sub=isSubscriber(raw);
    return {roses:roses,net:net,label:sub?'구독자':'일반',rate:sub?'40%':'35%'};
  }

  function addStyle(){
    if(document.getElementById('ktg13InlineEarningsStyle'))return;
    var s=document.createElement('style');
    s.id='ktg13InlineEarningsStyle';
    s.textContent=''
      +'.ktg13-person-btn.earn.ktg13-inline-earn{width:auto!important;height:auto!important;min-width:50px!important;min-height:25px!important;padding:2px 4px!important;border-radius:7px!important;border:1px solid #d7ad39!important;background:rgba(25,21,8,.96)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;line-height:1!important;white-space:nowrap!important;box-shadow:0 0 5px rgba(215,173,57,.28)!important}'
      +'.ktg13-inline-earn span{display:block!important;font-weight:900!important;letter-spacing:-.35px!important;line-height:1.05!important}'
      +'.ktg13-inline-earn .kt-ie-r{color:#ffdf5d!important}.ktg13-inline-earn .kt-ie-n{color:#8fe8ff!important}.ktg13-inline-earn .kt-ie-p{color:#fff!important}'
      +'.ktg13-guest .ktg13-inline-earn{min-width:47px!important;min-height:23px!important;padding:1px 3px!important}.ktg13-guest .ktg13-inline-earn span{font-size:6px!important}'
      +'.ktg13-host .ktg13-inline-earn{min-width:66px!important;min-height:30px!important;padding:2px 5px!important}.ktg13-host .ktg13-inline-earn span{font-size:8px!important}'
      +'@media(max-width:420px){.ktg13-guest .ktg13-inline-earn{min-width:38px!important;min-height:20px!important;padding:1px 2px!important}.ktg13-guest .ktg13-inline-earn span{font-size:5px!important;letter-spacing:-.5px!important}.ktg13-host .ktg13-inline-earn{min-width:56px!important}.ktg13-host .ktg13-inline-earn span{font-size:7px!important}}';
    document.head.appendChild(s);
  }

  function paint(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();
    var x=info();
    var html='<span class="kt-ie-r">🌹 '+x.roses+'</span>'
      +'<span class="kt-ie-n">🔒 '+x.net+'</span>'
      +'<span class="kt-ie-p">'+x.label+' '+x.rate+'</span>';

    room.querySelectorAll('.ktg13-person-controls').forEach(function(c){
      var earn=c.querySelector('.ktg13-person-btn.earn');
      if(!earn)return;
      earn.classList.add('ktg13-inline-earn');
      earn.setAttribute('aria-label','내 수익 · 본인만 보기');
      earn.title='내 수익 · 본인만 보기';
      if(earn.innerHTML!==html)earn.innerHTML=html;
    });
  }

  var ob=new MutationObserver(function(){paint();});
  try{ob.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(paint,0);
  setTimeout(paint,250);
  setTimeout(paint,900);
  setInterval(paint,900);
})();
