/* 9명 일반방 버튼만 방송 선택에 보이게 정리. 다른 방 기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup9GeneralButtonInstalled)return;
  window.__ktGroup9GeneralButtonInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup9GeneralButtonStyle'))return;
    var st=document.createElement('style');
    st.id='ktGroup9GeneralButtonStyle';
    st.textContent=''
      +'.live-prep .kt-room9-general{min-height:52px!important;padding:7px 3px!important;font-size:12px!important;border-radius:14px!important;border:1px solid rgba(255,255,255,.12)!important;background:rgba(255,255,255,.07)!important;color:#d8d8df!important;font-weight:900!important;touch-action:manipulation!important}'
      +'.live-prep .kt-room9-general.on{color:#fff!important;border-color:#ff63b6!important;background:linear-gradient(135deg,#ff315f,#b14cff 65%,#704cff)!important;box-shadow:0 0 16px rgba(255,71,171,.35)!important}'
      +'.kt-creator-room-shortcuts.kt-has-room9{grid-template-columns:repeat(5,minmax(0,1fr))!important;width:min(98%,430px)!important}'
      +'.kt-creator-room-shortcuts .kt-room9-general-shortcut{font-size:9px!important;padding:0 1px!important}';
    document.head.appendChild(st);
  }

  function installPrepButton(){
    var prep=document.querySelector('.live-prep');
    if(!prep)return;
    var row=prep.querySelector('.room-switch-row');
    if(!row)return;
    ensureStyle();

    var thirteen=[].slice.call(row.querySelectorAll('.room-switch')).find(function(b){
      return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;
    });
    if(!thirteen)return;

    var b=row.querySelector('.kt-room9-switch,.kt-room9-general');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-room9-switch kt-room9-general';
      b.setAttribute('aria-pressed','false');
    }else{
      b.classList.remove('room-switch');
      b.classList.add('kt-room9-switch','kt-room9-general');
    }
    b.textContent='9명 일반방';
    b.removeAttribute('onclick');
    if(b.nextElementSibling!==thirteen)row.insertBefore(b,thirteen);
  }

  function selectNine(){
    try{
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 일반방';
        state.liveRoomMax=9;
      }
      var title=document.getElementById('liveTitle');
      if(title){title.value='9명 일반방';title.dataset.autoRoom='1';}
      var box=document.getElementById('ktSecretPasswordBox');
      if(box){box.classList.remove('on');box.style.setProperty('display','none','important');}
    }catch(err){}
  }

  function installCreatorShortcut(){
    var row=document.querySelector('.kt-creator-room-shortcuts');
    if(!row)return;
    ensureStyle();
    row.classList.add('kt-has-room9');

    var buttons=[].slice.call(row.querySelectorAll('button'));
    var thirteen=buttons.find(function(b){
      return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;
    });
    if(!thirteen)return;

    var b=row.querySelector('.kt-room9-general-shortcut');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-room9-general-shortcut';
      b.textContent='9명 일반방';
      b.onclick=function(){
        selectNine();
        if(window.openTikLivePrep)window.openTikLivePrep();
        setTimeout(function(){
          installPrepButton();
          var p=document.querySelector('.live-prep .kt-room9-general,.live-prep .kt-room9-switch');
          if(p&&p.click)p.click();
        },30);
      };
    }
    if(b.nextElementSibling!==thirteen)row.insertBefore(b,thirteen);
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.kt-room9-general'):null;
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    try{
      document.querySelectorAll('.live-prep .room-switch,.live-prep .kt-room9-general').forEach(function(x){
        x.classList.toggle('on',x===b);
        x.setAttribute('aria-pressed',x===b?'true':'false');
      });
      selectNine();
    }catch(err){}
  },true);

  function install(){
    installPrepButton();
    installCreatorShortcut();
  }

  install();
  [60,160,350,700,1200].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup9GeneralButtonTimer);
      window.__ktGroup9GeneralButtonTimer=setTimeout(install,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 비밀방 오른쪽에 겹쳐 보이는 검은 매치 버튼 하나만 제거. 아래 메뉴의 매치는 유지. */
(function(){
  if(window.__ktSecretDuplicateMatchFixInstalled)return;
  window.__ktSecretDuplicateMatchFixInstalled=true;

  function removeDuplicateMatch(){
    var side=document.querySelector('.ktsecret-right');
    if(!side)return;
    [].slice.call(side.children).forEach(function(btn){
      if(!btn||btn.tagName!=='BUTTON')return;
      var small=btn.querySelector('small');
      if(small&&String(small.textContent||'').trim()==='매치'){
        try{btn.remove();}catch(e){}
      }
    });
  }

  removeDuplicateMatch();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(removeDuplicateMatch,ms);});
  try{
    var mo=new MutationObserver(function(){removeDuplicateMatch();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 자리 이동/배치 창: 원래대로 버튼 아래 나가기 버튼만 복구. */
(function(){
  if(window.__ktPersonLayoutExitButtonInstalled)return;
  window.__ktPersonLayoutExitButtonInstalled=true;

  function installExitButton(){
    var panel=document.getElementById('ktPersonLayoutPanel');
    if(!panel||panel.querySelector('.kt-person-layout-exit'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='wide kt-person-layout-exit';
    b.textContent='나가기';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(err){}
      panel.classList.remove('on');
      document.querySelectorAll('.kt-person-layout-selected').forEach(function(el){el.classList.remove('kt-person-layout-selected');});
    };
    panel.appendChild(b);
  }

  installExitButton();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(installExitButton,ms);});
  try{
    var mo=new MutationObserver(function(){installExitButton();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 13명방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자·매치 5개 유지, 크기만 조금 키움. */
(function(){
  if(window.__ktGroup13RightFiveFixInstalled)return;
  window.__ktGroup13RightFiveFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup13RightFiveFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13RightFiveFixStyle';
    s.textContent=''
      +'.ktg13-right-quick{right:5px!important;gap:6px!important;top:50%!important;transform:translateY(-50%)!important}'
      +'.ktg13-right-quick>button{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important}'
      +'.ktg13-right-quick>.ktg13-like{height:58px!important;min-height:58px!important;border-radius:18px!important}'
      +'.ktg13-right-quick>button b{font-size:20px!important;line-height:1!important}'
      +'.ktg13-right-quick>button span{font-size:9px!important;line-height:1!important;margin-top:3px!important}'
      +'.ktg13-right-quick>.ktg13-like em{font-size:9px!important}';
    document.head.appendChild(s);
  }

  function install(){
    var box=document.querySelector('.ktg13-right-quick');
    if(!box)return;
    ensureStyle();

    var like=box.querySelector('.ktg13-like');
    if(like&&!box.querySelector('.kt-room-camera-flip')){
      var flip=document.createElement('button');
      flip.type='button';
      flip.className='kt-room-camera-flip';
      flip.setAttribute('aria-label','카메라 뒤집기');
      flip.innerHTML='<b>↻</b><span>뒤집기</span>';
      flip.onclick=function(){if(window.ktSoloFlipCamera)window.ktSoloFlipCamera(this);};
      box.insertBefore(flip,like);
    }

    var hasMatch=[].slice.call(box.querySelectorAll('button')).some(function(btn){
      return btn.getAttribute('aria-label')==='매치'||String(btn.textContent||'').indexOf('매치')>-1;
    });
    if(!hasMatch){
      var match=document.createElement('button');
      match.type='button';
      match.className='ktg13-match-restored';
      match.setAttribute('aria-label','매치');
      match.innerHTML='<b>⚔</b><span>매치</span>';
      match.onclick=function(){
        try{if(window.ktUnifiedQuickMatch){window.ktUnifiedQuickMatch();return;}}catch(e){}
        try{if(window.openHostMatchArena)window.openHostMatchArena('1대1');}catch(e){}
      };
      box.appendChild(match);
    }
  }

  install();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){install();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 9명 방만: 저장해 둔 자리 이동/배치 복구 파일 로드 */
(function(){
  if(document.querySelector('script[data-kt-nine-saved-restore]'))return;
  var s=document.createElement('script');
  s.src='nine-room-saved-restore.js?v=20260912-1';
  s.async=false;
  s.setAttribute('data-kt-nine-saved-restore','1');
  document.head.appendChild(s);
})();
