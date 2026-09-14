/* K-Talk 라이브 준비 화면: 모든 스위치/버튼 터치 보강 + 1/9/13/15/구독자/비밀방 선택 안정화. */
(function(){
  if(window.__ktAllLiveSwitchesReady20260913)return;
  window.__ktAllLiveSwitchesReady20260913=true;

  function ensureStyle(){
    if(document.getElementById('ktAllLiveSwitchesReadyStyle'))return;
    var s=document.createElement('style');
    s.id='ktAllLiveSwitchesReadyStyle';
    s.textContent=''
      +'.live-prep,.live-prep .prep-grid,.live-prep .prep-card,.live-prep .room-switch-row,.live-prep .prep-bottom{pointer-events:auto!important;position:relative!important;z-index:40!important}'
      +'.live-prep button,.live-prep input,.live-prep .prep-item,.live-prep .room-switch,.live-prep .prep-bottom span{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;position:relative!important;z-index:41!important}'
      +'.live-prep .room-switch-row{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}'
      +'.live-prep .room-switch{min-height:48px!important;white-space:nowrap!important}'
      +'.live-prep .room-switch.on{outline:2px solid #ff5ccf!important;box-shadow:0 0 14px rgba(255,76,196,.55)!important}'
      +'.live-prep .prep-item:active,.live-prep .room-switch:active,.live-prep .prep-bottom span:active{transform:scale(.96)!important}'
      +'@media(max-width:390px){.live-prep .room-switch-row{grid-template-columns:repeat(3,minmax(0,1fr))!important}.live-prep .room-switch{font-size:10px!important;padding:6px 1px!important}}';
    document.head.appendChild(s);
  }

  var defs={
    solo:{type:'solo',name:'1인 방송',max:1},
    group9:{type:'group9',name:'9명 방송',max:9},
    group13:{type:'group13',name:'13명 방송',max:13},
    group15:{type:'group15',name:'15명 방송',max:15},
    subscriber:{type:'subscriber',name:'구독자 방송',max:10},
    password:{type:'password',name:'비밀방',max:7}
  };

  function defFromText(text){
    text=String(text||'').replace(/\s+/g,'');
    if(text.indexOf('15명')>-1)return defs.group15;
    if(text.indexOf('13명')>-1)return defs.group13;
    if(text.indexOf('9명')>-1)return defs.group9;
    if(text.indexOf('구독자')>-1)return defs.subscriber;
    if(text.indexOf('비밀')>-1)return defs.password;
    if(text.indexOf('1인')>-1)return defs.solo;
    return null;
  }

  function showSecretBox(on){
    var box=document.getElementById('ktSecretPasswordBox');
    if(box){
      box.classList.toggle('on',!!on);
      box.style.setProperty('display',on?'block':'none','important');
    }
  }

  function applyRoom(btn,def){
    if(!btn||!def)return;
    document.querySelectorAll('.live-prep .room-switch').forEach(function(b){
      var on=b===btn;
      b.classList.toggle('on',on);
      b.setAttribute('aria-pressed',on?'true':'false');
    });
    try{
      if(window.state){
        state.liveRoomType=def.type;
        state.liveRoomName=def.name;
        state.liveRoomMax=def.max;
      }
    }catch(e){}
    var title=document.getElementById('liveTitle');
    if(title){title.value=def.name;title.dataset.autoRoom='1';}
    try{
      if(typeof window.selectPrepRoom==='function')window.selectPrepRoom(btn,def.type,def.name,def.max);
    }catch(e){}
    showSecretBox(def.type==='password');
  }

  function makeRoomButton(def,cls){
    var b=document.createElement('button');
    b.type='button';
    b.className='room-switch '+cls;
    b.textContent=def.name;
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      applyRoom(b,def);
    });
    return b;
  }

  function ensureRoomButtons(){
    var row=document.querySelector('.live-prep .room-switch-row');
    if(!row)return;
    var buttons=[].slice.call(row.querySelectorAll('.room-switch'));
    var has9=buttons.some(function(b){return /9\s*명/.test(b.textContent||'');});
    var has15=buttons.some(function(b){return /15\s*명/.test(b.textContent||'');});
    var b13=buttons.find(function(b){return /13\s*명/.test(b.textContent||'');});
    if(!has9){
      var b9=makeRoomButton(defs.group9,'kt-room9-switch');
      if(b13)b13.insertAdjacentElement('afterend',b9);else row.appendChild(b9);
    }
    buttons=[].slice.call(row.querySelectorAll('.room-switch'));
    var b9now=buttons.find(function(b){return /9\s*명/.test(b.textContent||'');});
    if(!has15){
      var b15=makeRoomButton(defs.group15,'kt-room15-switch');
      if(b9now)b9now.insertAdjacentElement('afterend',b15);else if(b13)b13.insertAdjacentElement('afterend',b15);else row.appendChild(b15);
    }
    row.querySelectorAll('.room-switch').forEach(function(b){
      b.type='button';
      b.style.setProperty('pointer-events','auto','important');
      b.style.setProperty('touch-action','manipulation','important');
    });
  }

  function safeSheet(title,body){
    try{if(typeof window.showSheet==='function')window.showSheet(title,'<div class="rowbox">'+body+'</div>');}catch(e){}
  }

  function runPrepAction(btn){
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    try{
      if(text.indexOf('전환')>-1){
        if(typeof window.toggleCreatorCamera==='function')window.toggleCreatorCamera();
        else if(typeof window.prepTap==='function')window.prepTap(btn,'전환');
        return;
      }
      if(text.indexOf('AI보정')>-1||text.indexOf('보정')>-1){
        if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();
        else safeSheet('AI 보정','AI 보정 기능을 여는 버튼입니다.');
        return;
      }
      if(text.indexOf('편집효과')>-1){
        if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();
        else safeSheet('편집 효과','편집 효과를 선택하는 버튼입니다.');
        return;
      }
      if(text.indexOf('설정')>-1){
        if(typeof window.openLiveSettings==='function')window.openLiveSettings();
        else safeSheet('설정','라이브 설정을 여는 버튼입니다.');
        return;
      }
      if(text.indexOf('멀티게스트')>-1){
        if(typeof window.openRoomTypeChooser==='function')window.openRoomTypeChooser();
        else safeSheet('멀티게스트','방송 인원과 방 종류를 선택할 수 있습니다.');
        return;
      }
      if(text.indexOf('서비스+')>-1||text.indexOf('서비스')>-1){
        safeSheet('서비스+','K-Talk 라이브 서비스+ 기능을 이용할 수 있습니다.');
        return;
      }
      if(text.indexOf('팬클럽')>-1){
        if(typeof window.openSubs==='function')window.openSubs();
        else safeSheet('팬클럽','팬클럽 및 구독 기능을 이용할 수 있습니다.');
        return;
      }
      if(text.indexOf('소통하기')>-1){
        if(typeof window.openCommunicationPanel==='function')window.openCommunicationPanel();
        else safeSheet('소통하기','채팅과 시청자 소통 기능을 이용할 수 있습니다.');
        return;
      }
      if(text.indexOf('공유')>-1){
        if(typeof window.shareApp==='function')window.shareApp();
        else safeSheet('공유','K-Talk 방송을 공유하는 기능입니다.');
        return;
      }
      if(typeof window.prepTap==='function')window.prepTap(btn,String(btn.textContent||'').trim());
    }catch(e){}
  }

  /* 준비화면 기능 버튼은 캡처 단계에서 직접 실행해 겹침/무반응을 막는다. */
  window.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.live-prep .prep-item'):null;
    if(!t)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    t.classList.add('test-active');
    setTimeout(function(){t.classList.remove('test-active');},180);
    runPrepAction(t);
  },true);

  /* 9명/15명은 기존 4개 방 스위치 처리와 충돌하지 않도록 가장 먼저 직접 선택한다. */
  window.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(!b)return;
    var d=defFromText(b.textContent);
    if(!d)return;
    if(d.type==='group9'||d.type==='group15'){
      e.preventDefault();e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      applyRoom(b,d);
    }
  },true);

  function loadScript(src,guard,done){
    try{
      if(guard&&window[guard]){if(done)done();return;}
      var exists=[].slice.call(document.scripts).some(function(s){return String(s.src||'').indexOf(src)>-1;});
      if(exists){if(done)setTimeout(done,80);return;}
      var sc=document.createElement('script');sc.src=src+'?v=20260913-switchall1';sc.onload=function(){if(done)done();};sc.onerror=function(){if(done)done();};document.body.appendChild(sc);
    }catch(e){if(done)done();}
  }

  function install(){ensureStyle();ensureRoomButtons();}
  install();
  [80,220,500,900,1500,2500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktAllLiveSwitchTimer);window.__ktAllLiveSwitchTimer=setTimeout(install,30);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* 13명/9명/15명 방송 전용 화면 코드가 빠져 있어도 자동 보강한다. */
  loadScript('group13-approved-room.js','__ktGroup13ApprovedRoomInstalled',function(){
    loadScript('group9-approved-room.js','__ktGroup9ApprovedRoomInstalled',install);
  });
})();
