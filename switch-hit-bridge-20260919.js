/* K-Talk 스위치 전용 최종 안정화 (2026-09-19)
   스위치/방 선택만 잠금 해제하고 직접 작동시킨다.
   카메라/보정/편집효과/방송화면/게스트/채팅/레이아웃은 건드리지 않음. */
(function(){
  if(window.__ktSwitchFinalStable20260919)return;
  window.__ktSwitchFinalStable20260919=true;

  var lastEl=null;
  var lastAt=0;

  function selectors(){
    return [
      '.kt-switch',
      '[role="switch"]',
      '.live-prep .room-switch',
      '.live-prep .prep-bottom button',
      '.kt-total-admin-row',
      '.kt-owner-monitor button'
    ].join(',');
  }

  function visible(el){
    if(!el||!el.isConnected)return false;
    try{
      var cs=getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      var r=el.getBoundingClientRect();
      return r.width>2&&r.height>2;
    }catch(e){return false;}
  }

  function unlock(root){
    root=root||document;
    var list=[];
    try{
      if(root.matches&&root.matches(selectors()))list.push(root);
      if(root.querySelectorAll)list=list.concat([].slice.call(root.querySelectorAll(selectors())));
    }catch(e){}

    list.forEach(function(el){
      if(!el)return;
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
        el.style.setProperty('user-select','none','important');
      }catch(e){}
    });
  }

  function roomDef(text){
    text=String(text||'').replace(/\s+/g,'');
    if(text.indexOf('9명')>-1)return {label:'9명',type:'group9',name:'9명 방송',max:9};
    if(text.indexOf('13명')>-1)return {label:'13명',type:'group13',name:'13명 방송',max:13};
    if(text.indexOf('구독')>-1)return {label:'구독자',type:'subscriber',name:'구독자 방송',max:10};
    if(text.indexOf('비밀')>-1)return {label:'비밀',type:'password',name:'비밀방',max:7};
    if(text.indexOf('1인')>-1)return {label:'1인',type:'solo',name:'1인 방송',max:1};
    return null;
  }

  function run(el){
    if(!el)return false;

    try{
      if(el.matches('.kt-total-admin-row')){
        if(typeof window.ktToggleTotalAdminPanel==='function'){
          window.ktToggleTotalAdminPanel();
          return true;
        }
        return false;
      }

      if(el.matches('.kt-owner-monitor button')){
        if(typeof window.ktToggleOwnerMonitorMode==='function'){
          window.ktToggleOwnerMonitorMode();
          return true;
        }
        return false;
      }

      if(el.matches('.live-prep .room-switch')){
        var d=roomDef(el.textContent);
        if(!d)return false;
        if(typeof window.selectPrepRoom==='function'){
          window.selectPrepRoom(el,d.type,d.name,d.max);
          return true;
        }
        return false;
      }

      if(el.matches('.live-prep .prep-bottom button')){
        var b=roomDef(el.textContent);
        if(!b)return false;
        if(typeof window.ktPickBottomRoom==='function'){
          window.ktPickBottomRoom(el,b.label,b.type,b.name,b.max);
          return true;
        }
        return false;
      }

      if(el.matches('.kt-switch')){
        var row=el.closest('.kt-setting-row');
        var label=row?String(row.textContent||'').replace(/\s+/g,''):'';

        if(label.indexOf('AI음성안내')>-1&&typeof window.toggleAIVoice==='function'){
          window.toggleAIVoice(el);
          return true;
        }

        if(typeof window.toggleLiveSetting==='function'){
          window.toggleLiveSetting(el);
          return true;
        }
      }

      if(el.getAttribute('role')==='switch'){
        var attr=el.hasAttribute('aria-checked')?'aria-checked':'aria-pressed';
        var on=el.getAttribute(attr)==='true'||el.classList.contains('on');
        el.classList.toggle('on',!on);
        el.setAttribute(attr,!on?'true':'false');
        return true;
      }
    }catch(e){}

    return false;
  }

  function findAt(x,y,eTarget){
    if(eTarget&&eTarget.closest){
      var direct=eTarget.closest(selectors());
      if(direct&&visible(direct))return direct;
    }

    var stack=[];
    try{stack=document.elementsFromPoint(x,y)||[];}catch(e){}
    for(var i=0;i<stack.length;i++){
      var node=stack[i];
      if(!node||!node.closest)continue;
      var el=node.closest(selectors());
      if(el&&visible(el))return el;
    }
    return null;
  }

  function point(e){
    if(e.changedTouches&&e.changedTouches[0]){
      return {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    }
    return {x:e.clientX,y:e.clientY};
  }

  function activate(e){
    var p=point(e);
    if(!isFinite(p.x)||!isFinite(p.y))return;

    var el=findAt(p.x,p.y,e.target);
    if(!el)return;

    var now=Date.now();
    if(lastEl===el&&now-lastAt<450)return;

    if(!run(el))return;

    lastEl=el;
    lastAt=now;

    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
  }

  /* 모바일에서는 손을 대는 첫 순간부터 스위치를 잡는다.
     일부 Android WebView에서 pointerup/touchend가 다른 레이어에 먹히는 경우가 있어
     pointerdown을 1차 실행으로 사용한다. 아래 중복 방지 시간으로 한 번만 실행된다. */
  window.addEventListener('pointerdown',activate,true);
  window.addEventListener('pointerup',activate,true);
  window.addEventListener('touchend',activate,true);

  /* 포인터 이벤트가 없는 브라우저용 클릭 보강. */
  window.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest(selectors()):null;
    if(!el)return;

    if(lastEl===el&&Date.now()-lastAt<700){
      try{
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      }catch(x){}
      return;
    }

    if(run(el)){
      lastEl=el;
      lastAt=Date.now();
      try{
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      }catch(x){}
    }
  },true);

  function refresh(){unlock(document);}

  refresh();
  [80,200,450,900,1600,2800].forEach(function(ms){setTimeout(refresh,ms);});

  /* 화면이 다시 그려져도 스위치만 자동으로 다시 풀어 준다. */
  try{
    var mo=new MutationObserver(function(records){
      var changed=false;
      for(var i=0;i<records.length;i++){
        if(records[i].addedNodes&&records[i].addedNodes.length){changed=true;break;}
      }
      if(!changed)return;
      clearTimeout(window.__ktSwitchFinalStableTimer);
      window.__ktSwitchFinalStableTimer=setTimeout(refresh,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(refresh,40);
  });

  /* 자동으로 다시 잠기는 경우에도 스위치만 해제 */
  setInterval(function(){
    try{refresh();}catch(e){}
  },900);
})();