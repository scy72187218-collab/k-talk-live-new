/* K-Talk 터치 복구 전용. 화면 내용/기능은 바꾸지 않고 눌러야 하는 요소만 터치 가능하게 유지한다. */
(function(){
  if(window.__ktTouchUnlockAllInstalled)return;
  window.__ktTouchUnlockAllInstalled=true;

  var selector=[
    'button:not(:disabled)',
    'a[href]',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[role="button"]:not([aria-disabled="true"])',
    '[onclick]',
    '[data-bottom]',
    '[data-tab]',
    '.room-switch',
    '.prep-item',
    '.modes span',
    '.creator-foot span',
    '.prep-bottom span',
    '.kt-room',
    '.kt-short',
    '.kt-iconbtn',
    '.kt-pill'
  ].join(',');

  function unlock(root){
    root=root||document;
    var list=[];
    try{
      if(root.matches&&root.matches(selector))list.push(root);
      if(root.querySelectorAll)list=list.concat([].slice.call(root.querySelectorAll(selector)));
    }catch(e){}
    list.forEach(function(el){
      if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;
      try{
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      }catch(e){}
    });
  }

  function installStyle(){
    if(document.getElementById('ktTouchUnlockAllStyle'))return;
    var st=document.createElement('style');
    st.id='ktTouchUnlockAllStyle';
    st.textContent=''
      +'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[role="button"]:not([aria-disabled="true"]),[onclick],[data-bottom],[data-tab],.room-switch,.prep-item,.modes span,.creator-foot span,.prep-bottom span,.kt-room,.kt-short,.kt-iconbtn,.kt-pill{pointer-events:auto!important;touch-action:manipulation!important}'
      +'.bottom,.kt-bottom,.header,.creator-top,.creator-tools,.creator-bottom,.live-prep,.sheet.show,.sheet.show .sheet-body{pointer-events:auto!important}'
      +'.bottom button,.kt-bottom button,.header button,.creator button,.live-prep button,.sheet.show button{pointer-events:auto!important;touch-action:manipulation!important}'
      +'.creator.show{pointer-events:auto!important}'
      +'.creator .shade,.creator #camera,.creator #cameraBg,.creator #ktCreatorPreview{pointer-events:none!important}';
    document.head.appendChild(st);
  }

  function interactive(el){
    if(!el||!el.closest)return null;
    var hit=el.closest(selector);
    if(!hit||hit.disabled||hit.getAttribute('aria-disabled')==='true')return null;
    return hit;
  }

  /* 장식 레이어가 버튼 위를 덮은 경우에만 바로 아래 실제 버튼으로 터치를 전달한다. */
  document.addEventListener('pointerup',function(ev){
    if(ev.button!=null&&ev.button!==0)return;
    if(interactive(ev.target))return;
    var stack=[];
    try{stack=document.elementsFromPoint(ev.clientX,ev.clientY)||[];}catch(e){}
    var hit=null;
    for(var i=0;i<stack.length;i++){
      hit=interactive(stack[i]);
      if(hit)break;
    }
    if(!hit)return;
    try{
      ev.preventDefault();
      hit.click();
    }catch(e){}
  },true);

  /* 아래 방송하기 버튼만 별도로 보강: 누르면 기존 카메라/방송 준비 흐름을 그대로 연다. */
  document.addEventListener('click',function(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('.bottom .plus,.kt-bottom .livebtn'):null;
    if(!btn)return;
    try{ev.preventDefault();ev.stopImmediatePropagation();}catch(e){}
    try{
      if(typeof window.quickStartBroadcast==='function')window.quickStartBroadcast();
      else if(typeof window.openCreator==='function')window.openCreator();
    }catch(e){}
  },true);

  installStyle();
  unlock(document);

  var ob=new MutationObserver(function(records){
    records.forEach(function(r){
      [].slice.call(r.addedNodes||[]).forEach(function(n){if(n&&n.nodeType===1)unlock(n);});
    });
  });
  try{ob.observe(document.documentElement||document.body,{childList:true,subtree:true});}catch(e){}

  window.addEventListener('pageshow',function(){installStyle();unlock(document);});
  window.addEventListener('focus',function(){unlock(document);});
  [0,100,300,800,1600,3000].forEach(function(ms){setTimeout(function(){installStyle();unlock(document);},ms);});
})();

/* 라이브 준비 화면의 방 선택 스위치와 라이브 시작 버튼 터치만 보강. 다른 기능/UI는 변경하지 않음. */
(function(){
  if(window.__ktRoomSwitchTouchOnlyInstalled)return;
  window.__ktRoomSwitchTouchOnlyInstalled=true;

  function addStyle(){
    if(document.getElementById('ktRoomSwitchTouchOnlyStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomSwitchTouchOnlyStyle';
    s.textContent=''
      +'.live-prep .room-switch-row{position:relative!important;z-index:30!important;pointer-events:auto!important}'
      +'.live-prep .room-switch,.live-prep .prep-start{position:relative!important;z-index:31!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-user-select:none!important;user-select:none!important}';
    document.head.appendChild(s);
  }

  function spec(btn){
    var t=String((btn&&btn.textContent)||'').replace(/\s+/g,'');
    if(t.indexOf('1인')>-1)return {type:'solo',name:'1인 방송',max:1};
    if(t.indexOf('9명')>-1)return {type:'group9',name:'9명 방송',max:9};
    if(t.indexOf('13명')>-1)return {type:'group',name:'13명 방송',max:13};
    if(t.indexOf('15명')>-1)return {type:'group15',name:'15명 방송',max:15};
    if(t.indexOf('구독자')>-1)return {type:'subscriber',name:'구독자 방송',max:10};
    if(t.indexOf('비밀')>-1)return {type:'password',name:'비밀방',max:7};
    return null;
  }

  function select(btn){
    var x=spec(btn);
    if(!x)return;
    try{
      if(window.state){
        state.liveRoomType=x.type;
        state.liveRoomName=x.name;
        state.liveRoomMax=x.max;
      }
      document.querySelectorAll('.live-prep .room-switch').forEach(function(b){
        var on=b===btn;
        b.classList.toggle('on',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
      var title=document.getElementById('liveTitle');
      if(title){title.value=x.name;title.dataset.autoRoom='1';}
      var pw=document.getElementById('ktSecretPasswordBox');
      if(pw){
        if(x.type==='password'){pw.style.removeProperty('display');pw.classList.add('on');}
        else{pw.classList.remove('on');pw.style.setProperty('display','none','important');}
      }
    }catch(e){}
  }

  function hit(e){
    var b=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(b)select(b);
  }

  document.addEventListener('pointerdown',hit,true);
  document.addEventListener('click',hit,true);

  function refresh(){
    addStyle();
    document.querySelectorAll('.live-prep .room-switch,.live-prep .prep-start').forEach(function(b){
      try{b.style.setProperty('pointer-events','auto','important');b.style.setProperty('touch-action','manipulation','important');}catch(e){}
    });
  }

  refresh();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(refresh,ms);});
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktRoomSwitchTouchOnlyTimer);window.__ktRoomSwitchTouchOnlyTimer=setTimeout(refresh,25);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
