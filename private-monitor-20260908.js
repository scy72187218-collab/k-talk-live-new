/* K-Talk 13명 방송: 참여자 안쪽에 '내 수익' 버튼만 추가. 호스트는 매치 유지. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktGroup13PrivateEarnings20260908Installed)return;
  window.__ktGroup13PrivateEarnings20260908Installed=true;

  function txt(id,fallback){
    try{
      var el=document.getElementById(id);
      return el&&String(el.textContent||'').trim()?String(el.textContent||'').trim():fallback;
    }catch(e){return fallback;}
  }

  window.ktGroup13OpenMyEarnings=function(){
    /* 기존 개인 수익 기능이 있으면 그것만 사용한다. 각 기기에서 자기 수익만 보게 된다. */
    try{
      if(typeof window.toggleMyEarnings==='function'){
        window.toggleMyEarnings();
        return;
      }
    }catch(e){}

    var net=txt('hudEarnNet','0원');
    var roses=txt('hudEarnRoses','🌹 0송이');
    var rate=txt('hudEarnRate','일반회원 · 35%');
    if(typeof window.showSheet==='function'){
      showSheet('🔒 내 수익 · 본인만 보기',
        '<div class="rowbox"><b>내 수익</b><br>이 금액은 현재 사용하는 본인 화면에서만 확인됩니다.</div>'+
        '<div style="padding:16px;border:1px solid #d5ae39;border-radius:15px;background:#17140b;color:#fff;text-align:center">'+
          '<div style="font-size:23px;font-weight:950;color:#ffe36a">'+net+'</div>'+
          '<div style="margin-top:7px;font-size:12px">'+roses+' · '+rate+'</div>'+
          '<div style="margin-top:6px;font-size:10px;color:#ffd76a;font-weight:850">소속사: 소속사에서 지급 결정</div>'+
        '</div>');
    }
  };

  function addStyle(){
    if(document.getElementById('ktg13PrivateEarningsStyle'))return;
    var s=document.createElement('style');
    s.id='ktg13PrivateEarningsStyle';
    s.textContent=''
      +'.ktg13-person-btn.earn{border-color:#d7ad39!important;background:rgba(48,38,7,.90)!important;color:#ffe36a!important;box-shadow:0 0 7px rgba(255,210,60,.28),inset 0 0 8px rgba(255,255,255,.06)!important}'
      +'.ktg13-host .ktg13-person-controls{gap:4px!important}'
      +'.ktg13-guest .ktg13-person-controls{gap:2px!important}'
      +'/* 선물상자 바로 위 기존 개인 수익표만 조금 작게 */'
      +'.ktg13-earn #myEarnHud{width:90%!important;min-width:0!important;margin-left:auto!important;padding:1px 5px!important;border-radius:9px!important}'
      +'.ktg13-earn #myEarnHud #hudEarnNet,.ktg13-earn #myEarnHud #hudEarnRoses,.ktg13-earn #myEarnHud #hudEarnRate{font-size:10px!important;line-height:1.08!important}'
      +'.ktg13-earn #myEarnHud #hudEarnAgency{grid-column:1/-1!important;text-align:center!important;color:#ffd76a!important;font-size:8px!important;line-height:1.1!important;font-weight:850!important;white-space:normal!important}'
      +'@media(max-width:390px){.ktg13-earn #myEarnHud{width:88%!important;padding:1px 4px!important}.ktg13-earn #myEarnHud #hudEarnNet,.ktg13-earn #myEarnHud #hudEarnRoses,.ktg13-earn #myEarnHud #hudEarnRate{font-size:9px!important}.ktg13-earn #myEarnHud #hudEarnAgency{font-size:7px!important}}';
    document.head.appendChild(s);
  }

  function ensureAgencyNote(){
    try{
      var detail=document.getElementById('myEarnDetail');
      if(!detail)return;
      var note=document.getElementById('hudEarnAgency');
      if(!note){
        note=document.createElement('span');
        note.id='hudEarnAgency';
        detail.appendChild(note);
      }
      note.textContent='소속사: 소속사에서 지급 결정';
    }catch(e){}
  }

  function makeEarnButton(host){
    var b=document.createElement('button');
    b.type='button';
    b.className='ktg13-person-btn earn';
    b.setAttribute('aria-label','내 수익 · 본인만 보기');
    b.title='내 수익 · 본인만 보기';
    b.innerHTML='💰';
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      window.ktGroup13OpenMyEarnings();
    });
    return b;
  }

  function ensureHostMatch(controls){
    if(!controls)return;
    var exists=controls.querySelector('.ktg13-person-btn.match');
    if(exists)return;
    /* 호스트 안쪽 매치가 빠진 경우에만 복구한다. */
    var b=document.createElement('button');
    b.type='button';
    b.className='ktg13-person-btn match';
    b.setAttribute('aria-label','호스트 매치');
    b.title='호스트 매치';
    b.innerHTML='⚔';
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      try{
        if(typeof window.ktGroup13HostMatchOnly==='function')window.ktGroup13HostMatchOnly();
        else if(typeof window.openHostMatchArena==='function')window.openHostMatchArena('1대1');
      }catch(err){}
    });
    controls.appendChild(b);
  }

  function addEarningsToControls(controls,isHost){
    if(!controls||controls.querySelector('.ktg13-person-btn.earn')){
      if(isHost)ensureHostMatch(controls);
      return;
    }
    var buttons=Array.prototype.slice.call(controls.querySelectorAll('.ktg13-person-btn'));
    var messageBtn=null;
    for(var i=0;i<buttons.length;i++){
      var a=String(buttons[i].getAttribute('aria-label')||'');
      var t=String(buttons[i].title||'');
      if(a.indexOf('쪽지')>-1||a.indexOf('메시지')>-1||t.indexOf('쪽지')>-1||t.indexOf('메시지')>-1){messageBtn=buttons[i];break;}
    }
    var earn=makeEarnButton(isHost);
    if(messageBtn)messageBtn.insertAdjacentElement('afterend',earn);
    else controls.appendChild(earn);
    if(isHost)ensureHostMatch(controls);
  }

  function enhance(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();
    ensureAgencyNote();

    /* 예전에 잘못 들어간 '모니터' 버튼이 있으면 이것만 제거 */
    room.querySelectorAll('.ktg13-monitor-tool').forEach(function(b){try{b.remove();}catch(e){}});
    var tools=room.querySelector('.ktg13-tools');
    if(tools)tools.classList.remove('kt-private-monitor-ready');

    var hostControls=room.querySelector('.ktg13-host .ktg13-person-controls');
    if(hostControls)addEarningsToControls(hostControls,true);

    room.querySelectorAll('.ktg13-guest .ktg13-person-controls').forEach(function(c){
      addEarningsToControls(c,false);
    });
  }

  var obs=new MutationObserver(function(){enhance();});
  try{obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(enhance,0);
  setTimeout(enhance,250);
  setTimeout(enhance,1000);
  setInterval(enhance,700);
})();
