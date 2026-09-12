/* K-Talk 스위치/탭 터치 전용 보강. 화면 배치는 바꾸지 않고 눌림과 기존 기능 연결만 복구한다. */
(function(){
  if(window.__ktAllSwitchesFixInstalled)return;
  window.__ktAllSwitchesFixInstalled=true;

  var switchSelector=[
    '.live-prep .room-switch',
    '#creator .prep-item',
    '#creator .prep-bottom span',
    '#creator .creator-foot span',
    '#creator .modes span',
    '#creator .creator-tools button',
    '.kt-multi-layouts button',
    '.kt-sound-tabs button'
  ].join(',');

  function compact(v){return String(v||'').replace(/\s+/g,'').trim();}
  function switchText(el){return compact((el&&el.textContent)||'')+' '+compact((el&&el.getAttribute&&el.getAttribute('aria-label'))||'');}
  function markGroup(el,selector){
    try{
      document.querySelectorAll(selector).forEach(function(x){x.classList.toggle('on',x===el);x.setAttribute('aria-pressed',x===el?'true':'false');});
    }catch(e){}
  }
  function roomInfo(el){
    var t=switchText(el);
    if(t.indexOf('13명')>-1)return {type:'group',label:'13명 방송',max:13};
    if(t.indexOf('구독자')>-1)return {type:'subscriber',label:'구독자 방송',max:10};
    if(t.indexOf('비밀')>-1)return {type:'password',label:'비밀방',max:7};
    return {type:'solo',label:'1인 방송',max:1};
  }
  function pulse(el){
    if(!el)return;
    try{el.classList.add('kt-switch-tapped');setTimeout(function(){el.classList.remove('kt-switch-tapped');},160);}catch(e){}
  }

  function handleRoom(el){
    var r=roomInfo(el);
    markGroup(el,'.live-prep .room-switch');
    try{
      if(window.state){state.liveRoomType=r.type;state.liveRoomName=r.label;state.liveRoomMax=r.max;}
      if(typeof window.selectPrepRoom==='function')window.selectPrepRoom(el,r.type,r.label,r.max);
      var title=document.getElementById('liveTitle');
      if(title&&(!title.value||title.dataset.autoRoom==='1'||title.value==='오늘 라이브 제목을 입력하세요')){title.value=r.label;title.dataset.autoRoom='1';}
    }catch(e){}
    return true;
  }

  function handlePrep(el){
    var t=switchText(el);
    if(t.indexOf('AI보정')>-1||t.indexOf('뷰티')>-1||t==='보정 '||t.indexOf('보정')>-1){
      try{
        if(typeof window.ktOpenRealBeautyPanel==='function')window.ktOpenRealBeautyPanel();
        else if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();
      }catch(e){}
      return true;
    }
    if(t.indexOf('편집효과')>-1||t.indexOf('편집')>-1&&t.indexOf('효과')>-1){
      try{if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();}catch(e){}
      return true;
    }
    if(t.indexOf('멀티게스트')>-1||t.indexOf('게스트')>-1&&t.indexOf('멀티')>-1){
      try{if(typeof window.openRoomTypeChooser==='function')window.openRoomTypeChooser();}catch(e){}
      return true;
    }
    if(t.indexOf('카메라전환')>-1||t==='전환 '||t.indexOf('앞뒤전환')>-1){
      try{
        if(typeof window.toggleCreatorCamera==='function')window.toggleCreatorCamera();
        else if(typeof window.ktSoloFlipCamera==='function')window.ktSoloFlipCamera(el);
      }catch(e){}
      return true;
    }
    if(t.indexOf('사운드')>-1||t.indexOf('음악')>-1){
      try{if(typeof window.openSoundPanel==='function')window.openSoundPanel();}catch(e){}
      return true;
    }
    return false;
  }

  function handleBottom(el){
    markGroup(el,'#creator .prep-bottom span');
    var name=String(el.textContent||'').trim();
    try{if(typeof window.prepBottomTap==='function')window.prepBottomTap(el,name);}catch(e){}
    return handlePrep(el)||true;
  }

  function handleFoot(el){
    markGroup(el,'#creator .creator-foot span');
    var t=switchText(el);
    if(t.indexOf('라이브')>-1){
      try{if(typeof window.openTikLivePrep==='function')window.openTikLivePrep();}catch(e){}
    }
    return true;
  }

  function handleMode(el){
    markGroup(el,'#creator .modes span');
    try{
      var label=String(el.textContent||'').trim();
      if(window.state)state.creatorMode=label;
    }catch(e){}
    return true;
  }

  function handleMulti(el){
    var t=switchText(el),type='grid';
    if(t.indexOf('나란히')>-1)type='side';
    else if(t.indexOf('스포트')>-1)type='spotlight';
    markGroup(el,'.kt-multi-layouts button');
    try{if(typeof window.selectMultiGuestLayout==='function')window.selectMultiGuestLayout(el,type);}catch(e){}
    return true;
  }

  function route(el){
    if(!el||!el.matches)return false;
    pulse(el);
    if(el.matches('.live-prep .room-switch'))return handleRoom(el);
    if(el.matches('#creator .prep-bottom span'))return handleBottom(el);
    if(el.matches('#creator .creator-foot span'))return handleFoot(el);
    if(el.matches('#creator .modes span'))return handleMode(el);
    if(el.matches('.kt-multi-layouts button'))return handleMulti(el);
    if(el.matches('#creator .prep-item,#creator .creator-tools button'))return handlePrep(el);
    return false;
  }

  function findSwitch(target,x,y){
    var el=target&&target.closest?target.closest(switchSelector):null;
    if(el)return el;
    var stack=[];
    try{stack=document.elementsFromPoint(x,y)||[];}catch(e){}
    for(var i=0;i<stack.length;i++){
      if(stack[i]&&stack[i].closest){el=stack[i].closest(switchSelector);if(el)return el;}
    }
    return null;
  }

  function handledRecently(el){
    var n=parseInt(el&&el.dataset&&el.dataset.ktSwitchHandledAt||'0',10)||0;
    return Date.now()-n<380;
  }
  function stamp(el){try{el.dataset.ktSwitchHandledAt=String(Date.now());}catch(e){}}

  document.addEventListener('pointerup',function(e){
    if(e.button!=null&&e.button!==0)return;
    var el=findSwitch(e.target,e.clientX,e.clientY);if(!el)return;
    if(handledRecently(el))return;
    if(route(el)){
      stamp(el);
      try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
    }
  },true);

  document.addEventListener('click',function(e){
    var el=findSwitch(e.target,e.clientX||0,e.clientY||0);if(!el)return;
    if(handledRecently(el)){
      try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
      return;
    }
    if(route(el)){
      stamp(el);
      try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
    }
  },true);

  function unlock(root){
    root=root||document;
    var list=[];
    try{if(root.matches&&root.matches(switchSelector))list.push(root);if(root.querySelectorAll)list=list.concat([].slice.call(root.querySelectorAll(switchSelector)));}catch(e){}
    list.forEach(function(el){
      try{
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
        if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
      }catch(e){}
    });
  }

  if(!document.getElementById('ktAllSwitchesFixStyle')){
    var st=document.createElement('style');st.id='ktAllSwitchesFixStyle';
    st.textContent=''
      +'.live-prep .room-switch,#creator .prep-item,#creator .prep-bottom span,#creator .creator-foot span,#creator .modes span,#creator .creator-tools button,.kt-multi-layouts button,.kt-sound-tabs button{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important;position:relative!important;z-index:40!important}'
      +'.kt-switch-tapped{transform:scale(.96)!important;filter:brightness(1.18)!important}'
      +'.live-prep .room-switch.on,#creator .prep-bottom span.on,#creator .creator-foot span.on,#creator .modes span.on,.kt-multi-layouts button.on{outline:2px solid rgba(255,255,255,.82)!important;outline-offset:-2px!important}';
    document.head.appendChild(st);
  }

  unlock(document);
  var ob=new MutationObserver(function(rs){rs.forEach(function(r){[].slice.call(r.addedNodes||[]).forEach(function(n){if(n&&n.nodeType===1)unlock(n);});});});
  try{ob.observe(document.documentElement||document.body,{childList:true,subtree:true});}catch(e){}
  [0,100,300,800,1600].forEach(function(ms){setTimeout(function(){unlock(document);},ms);});
})();
