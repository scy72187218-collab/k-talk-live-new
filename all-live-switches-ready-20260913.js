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
      +'.live-prep button,.live-prep input,.live-prep .prep-item,.live-prep .room-switch,.live-prep .prep-bottom span,.live-prep .prep-bottom button,.creator-tools button,.kt-switch,[role="switch"]{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;position:relative!important;z-index:41!important}'
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
      var sc=document.createElement('script');sc.src=src+'?v=20260919-chat-lower1';sc.onload=function(){if(done)done();};sc.onerror=function(){if(done)done();};document.body.appendChild(sc);
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


/* 2026-09-14 모든 스위치 완전 작동 보강 */
(function(){
  if(window.__ktEverySwitchWorks20260914)return;
  window.__ktEverySwitchWorks20260914=true;

  function markOne(group,item){
    if(!item)return;
    group.forEach(function(x){
      var on=x===item;
      x.classList.toggle('on',on);
      x.classList.toggle('active',on);
      x.setAttribute('aria-pressed',on?'true':'false');
    });
  }

  function clickRoom(b){
    var text=String(b.textContent||b.getAttribute('aria-label')||'').replace(/\s+/g,'');
    var d=null;
    if(text.indexOf('1인')>-1)d={type:'solo',name:'1인 방송',max:1};
    else if(text.indexOf('9명')>-1)d={type:'group9',name:'9명 일반방',max:9};
    else if(text.indexOf('13명')>-1)d={type:'group',name:'13명 방송',max:13};
    else if(text.indexOf('15명')>-1)d={type:'group15',name:'15명 방송',max:15};
    else if(text.indexOf('구독자')>-1)d={type:'subscriber',name:'구독자 방송',max:10};
    else if(text.indexOf('비밀')>-1)d={type:'password',name:'비밀방',max:7};
    if(!d)return;
    var buttons=[].slice.call(document.querySelectorAll('.live-prep .room-switch'));
    markOne(buttons,b);
    try{
      if(window.state){
        state.prepRoomType=d.type;
        state.roomType=d.type;
        state.prepRoomName=d.name;
        state.prepRoomMax=d.max;
      }
      var title=document.getElementById('liveTitle');
      if(title){title.value=d.name;title.dataset.autoRoom='1';}
      if(typeof window.selectPrepRoom==='function')window.selectPrepRoom(b,d.type,d.name,d.max);
      var secret=document.getElementById('secretPasswordBox');
      if(secret)secret.style.display=d.type==='password'?'block':'none';
    }catch(e){}
  }

  function clickBottomTab(el){
    var tabs=[].slice.call(document.querySelectorAll('.live-prep .prep-bottom span,.live-prep .prep-bottom button'));
    markOne(tabs,el);
    var text=String(el.textContent||'').replace(/\s+/g,'');

    var d=null,label='';
    if(text.indexOf('1인')>-1){d={type:'solo',name:'1인 방송',max:1};label='1인';}
    else if(text.indexOf('9명')>-1){d={type:'group9',name:'9명 방송',max:9};label='9명';}
    else if(text.indexOf('13명')>-1){d={type:'group13',name:'13명 방송',max:13};label='13명';}
    else if(text.indexOf('구독')>-1){d={type:'subscriber',name:'구독자 방송',max:10};label='구독자';}
    else if(text.indexOf('비밀')>-1){d={type:'password',name:'비밀방',max:7};label='비밀';}

    if(d){
      if(typeof window.ktPickBottomRoom==='function'){
        window.ktPickBottomRoom(el,label,d.type,d.name,d.max);
      }else{
        try{
          if(window.state){
            state.liveRoomType=d.type;
            state.liveRoomName=d.name;
            state.liveRoomMax=d.max;
          }
          var title=document.getElementById('liveTitle');
          if(title){title.value=d.name;title.dataset.autoRoom='1';}
          var rooms=[].slice.call(document.querySelectorAll('.live-prep .room-switch'));
          var rb=rooms.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf(label)>-1;});
          if(rb&&typeof window.selectPrepRoom==='function')window.selectPrepRoom(rb,d.type,d.name,d.max);
          var secret=document.getElementById('ktSecretPasswordBox');
          if(secret){
            secret.classList.toggle('on',d.type==='password');
            secret.style.setProperty('display',d.type==='password'?'block':'none','important');
          }
        }catch(e){}
      }
      return;
    }

    if(text.indexOf('뷰티')>-1||text.indexOf('보정')>-1){
      if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();
    }else if(text.indexOf('편집')>-1||text.indexOf('효과')>-1){
      if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();
    }else if(text.indexOf('멀티')>-1||text.indexOf('게스트')>-1||text.indexOf('방송선택')>-1){
      if(typeof window.openRoomTypeChooser==='function')window.openRoomTypeChooser();
      else{
        var row=document.querySelector('.live-prep .room-switch-row');
        if(row)row.scrollIntoView({behavior:'smooth',block:'center'});
      }
    }
  }

  function clickMode(el){
    var modes=[].slice.call(el.parentNode.querySelectorAll('span,button'));
    markOne(modes,el);
    var text=String(el.textContent||'').replace(/\s+/g,'');
    var ms=0;
    if(text.indexOf('10분')>-1)ms=600000;
    else if(text.indexOf('60초')>-1)ms=60000;
    else if(text.indexOf('15초')>-1)ms=15000;
    try{
      if(window.state){
        state.creatorMode=text.indexOf('라이브')>-1?'live':'record';
        if(ms>0)state.recordSeconds=Math.round(ms/1000);
      }
      if(text.indexOf('라이브')>-1){
        if(typeof window.openTikLivePrep==='function')window.openTikLivePrep();
      }else if(ms>0&&typeof window.selectCreatorDuration==='function'){
        window.selectCreatorDuration(el,ms);
      }
    }catch(e){}
  }

  window.addEventListener('click',function(e){
    var target=e.target&&e.target.closest?e.target.closest('button,span,[role="switch"],label'):null;
    if(!target)return;

    var room=target.closest('.live-prep .room-switch');
    if(room){
      e.preventDefault();
      e.stopPropagation();
      clickRoom(room);
      return;
    }

    var bottom=target.closest('.live-prep .prep-bottom span,.live-prep .prep-bottom button');
    if(bottom){
      e.preventDefault();
      e.stopPropagation();
      clickBottomTab(bottom);
      return;
    }

    var mode=target.closest('.creator-bottom .modes span,.creator-bottom .modes button');
    if(mode){
      e.preventDefault();
      e.stopPropagation();
      clickMode(mode);
      return;
    }

    var creatorTool=target.closest('.creator-tools button');
    if(creatorTool&&!creatorTool.getAttribute('onclick')){
      var label=String(creatorTool.getAttribute('aria-label')||creatorTool.textContent||'').replace(/\s+/g,'');
      if(label.indexOf('플래시')>-1){
        e.preventDefault();e.stopPropagation();
        var next=!creatorTool.classList.contains('on');
        creatorTool.classList.toggle('on',next);
        creatorTool.setAttribute('aria-pressed',next?'true':'false');
        try{
          var stream=(window.state&&state.stream)||null;
          var track=stream&&stream.getVideoTracks?stream.getVideoTracks()[0]:null;
          var caps=track&&track.getCapabilities?track.getCapabilities():null;
          if(track&&caps&&caps.torch){
            track.applyConstraints({advanced:[{torch:next}]}).catch(function(){
              creatorTool.classList.remove('on');
              creatorTool.setAttribute('aria-pressed','false');
            });
          }else if(typeof window.showSheet==='function'){
            window.showSheet('플래시','<div class="rowbox"><b>플래시</b><br>이 휴대폰 카메라에서 지원되는 경우 켜고 끌 수 있습니다.</div>');
          }
        }catch(err){}
        return;
      }
      if(label.indexOf('타이머')>-1){
        e.preventDefault();e.stopPropagation();
        var cur=parseInt(creatorTool.getAttribute('data-kt-timer')||'0',10)||0;
        var nextTimer=cur===0?3:(cur===3?10:0);
        creatorTool.setAttribute('data-kt-timer',String(nextTimer));
        creatorTool.classList.toggle('on',nextTimer>0);
        creatorTool.setAttribute('aria-pressed',nextTimer>0?'true':'false');
        creatorTool.textContent=nextTimer?('◔ '+nextTimer+'초'):'◔';
        try{if(window.state)state.creatorTimerSeconds=nextTimer;}catch(err){}
        return;
      }
      if(label.indexOf('더보기')>-1||String(creatorTool.textContent||'').indexOf('⌄')>-1){
        e.preventDefault();e.stopPropagation();
        if(typeof window.openLiveSettings==='function')window.openLiveSettings();
        return;
      }
    }

    var sw=target.closest('[role="switch"]');
    if(sw&&!sw.getAttribute('onclick')){
      var attr=sw.hasAttribute('aria-pressed')?'aria-pressed':'aria-checked';
      var checked=sw.getAttribute(attr)==='true';
      sw.setAttribute(attr,checked?'false':'true');
      sw.classList.toggle('on',!checked);
    }
  },true);

  function strengthen(){
    var q='.live-prep button,.live-prep span,.creator button,.creator [role="switch"],.sheet button,.sheet [role="switch"],.kt-switch,.live-prep .prep-bottom button';
    document.querySelectorAll(q).forEach(function(el){
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      if(el.tagName==='BUTTON'&&!el.getAttribute('type'))el.setAttribute('type','button');
    });
  }

  strengthen();
  [100,300,700,1200,2200].forEach(function(ms){setTimeout(strengthen,ms);});
  try{
    var observer=new MutationObserver(function(){clearTimeout(window.__ktSwitchStrengthenTimer);window.__ktSwitchStrengthenTimer=setTimeout(strengthen,25);});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();


/* 2026-09-19 스위치 관련만 전체 잠금 해제/터치 보강 */
(function(){
  if(window.__ktSwitchOnlyUnlock20260919)return;
  window.__ktSwitchOnlyUnlock20260919=true;

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .room-switch',
    '.live-prep .prep-bottom span',
    '.live-prep .prep-bottom button',
    '.creator-bottom .modes span',
    '.creator-bottom .modes button'
  ].join(',');

  function unlockSwitches(root){
    root=root||document;
    var list=[];
    try{
      if(root.matches&&root.matches(selector))list.push(root);
      if(root.querySelectorAll)list=list.concat([].slice.call(root.querySelectorAll(selector)));
    }catch(e){}

    list.forEach(function(el){
      if(!el)return;
      try{
        /* 스위치만 잠금 해제. 다른 버튼/화면은 손대지 않음 */
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
        el.style.setProperty('user-select','none','important');
      }catch(e){}
    });
  }

  /* 별도 onclick이 없는 순수 스위치만, 기존 코드가 상태를 안 바꿨을 때 fallback 토글 */
  document.addEventListener('click',function(e){
    var sw=e.target&&e.target.closest?e.target.closest('.kt-switch,[role="switch"]'):null;
    if(!sw)return;

    var attr=sw.hasAttribute('aria-checked')?'aria-checked':'aria-pressed';
    var before=sw.getAttribute(attr);
    if(before!=='true'&&before!=='false')before=sw.classList.contains('on')?'true':'false';

    setTimeout(function(){
      try{
        var after=sw.getAttribute(attr);
        var classChanged=sw.classList.contains('on')!==(before==='true');
        /* 기존 기능이 이미 바꿨으면 그대로 둔다 */
        if(after!==before||classChanged)return;

        /* onclick이 있는 스위치는 기존 동작을 존중한다 */
        if(sw.getAttribute('onclick'))return;

        var next=before!=='true';
        sw.classList.toggle('on',next);
        sw.setAttribute(attr,next?'true':'false');
      }catch(x){}
    },0);
  },false);

  function refresh(){unlockSwitches(document);}
  refresh();
  [80,220,500,1000,1800,3000].forEach(function(ms){setTimeout(refresh,ms);});

  try{
    var mo=new MutationObserver(function(records){
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(n&&n.nodeType===1)unlockSwitches(n);
        });
      });
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
})();
