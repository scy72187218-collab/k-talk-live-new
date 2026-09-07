/* K-Talk 요청 수정: 주름살 완화, 보정 뒤로가기, 첫 화면 동영상 즉시 표시. */
(function(){
  if(window.__ktRequestedFixes20260907Installed)return;
  window.__ktRequestedFixes20260907Installed=true;

  /* 1) 보정에 '주름살 완화' 한 항목만 추가. 기존 보정 로직은 그대로 사용한다. */
  var oldBeautyInfo=window.getBeautyControlInfo;
  if(typeof oldBeautyInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='wrinkle')return {label:'주름살 완화',key:'beautyWrinkle',def:65};
      return oldBeautyInfo.apply(this,arguments);
    };
  }

  var oldSetBeautyValue=window.setBeautyValue;
  if(typeof oldSetBeautyValue==='function'){
    window.setBeautyValue=function(kind,value){
      if(kind==='wrinkle'){
        value=Math.max(1,Math.min(100,parseInt(value||1,10)));
        try{state.beautyWrinkle=value;}catch(e){}
        /* 주름 완화는 기존 피부 부드러움 엔진을 이용해 자연스럽게 적용 */
        var skin=Math.round(55+(value*0.43));
        oldSetBeautyValue.call(this,'skin',skin);
        var v=document.getElementById('beautySingleValue');
        if(v)v.textContent=value;
        return;
      }
      return oldSetBeautyValue.apply(this,arguments);
    };
  }

  function decorateBeautyPanel(){
    try{
      var controls=document.querySelector('.kt-beauty-controls-pro');
      if(controls&&!controls.querySelector('[data-beauty-kind="wrinkle"]')){
        var btn=document.createElement('button');
        btn.setAttribute('data-beauty-kind','wrinkle');
        btn.innerHTML='<b>〰</b><span>주름살</span><i></i>';
        btn.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl('wrinkle');};
        controls.appendChild(btn);
      }
      if(controls&&window.state&&state.beautyControl==='wrinkle'){
        controls.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-beauty-kind')==='wrinkle');});
      }

      /* 2) 보정 화면에서 바로 빠져나오는 왼쪽 화살표 */
      var headBtn=document.querySelector('#sheet .sheet-head button');
      if(headBtn&&document.getElementById('sheet')&&document.getElementById('sheet').classList.contains('beauty-control-sheet')){
        headBtn.textContent='←';
        headBtn.setAttribute('aria-label','보정 화면 나가기');
        headBtn.title='뒤로';
        headBtn.style.fontSize='28px';
        headBtn.style.fontWeight='900';
        headBtn.style.minWidth='44px';
      }
    }catch(e){}
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(decorateBeautyPanel,0);
      return r;
    };
  }

  var oldResetBeauty=window.resetBeautyAll;
  if(typeof oldResetBeauty==='function'){
    window.resetBeautyAll=function(){
      try{state.beautyWrinkle=65;}catch(e){}
      var r=oldResetBeauty.apply(this,arguments);
      setTimeout(decorateBeautyPanel,0);
      return r;
    };
  }

  /* 3) 첫 페이지에서 네트워크 동영상 목록을 기다리는 동안 검정 화면이 보이지 않게 즉시 기본 동영상을 먼저 재생 */
  function quickHomeVideo(){
    var host=document.getElementById('screen');
    if(!host)return;
    try{
      if(document.body.classList.contains('kt-home'))return;
      if(host.querySelector('video'))return;
    }catch(e){}
    document.body.classList.remove('kt-home');
    document.body.classList.add('kt-video-mode');
    host.innerHTML='<section class="video-home">'
      +'<video id="homeVideo" autoplay muted loop playsinline preload="auto" poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80">'
      +'<source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button aria-label="검색">⌕</button></div>'
      +'<div class="vh-title"><b>♛ K-Talk</b><span>추천 동영상 · 화면을 눌러 재생하거나 멈출 수 있습니다.</span></div>'
      +'<div class="vh-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div>'
      +'</section>';
    var v=document.getElementById('homeVideo');
    if(v){
      v.addEventListener('click',function(){if(v.paused)v.play().catch(function(){});else v.pause();});
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
  }

  var loadedHome=window.home;
  if(typeof loadedHome==='function'&&!loadedHome.__ktInstantFirstVideo){
    var wrappedHome=function(){
      quickHomeVideo();
      return loadedHome.apply(this,arguments);
    };
    wrappedHome.__ktInstantFirstVideo=true;
    window.home=wrappedHome;
  }

  /* 첫 진입 때 이미 동영상이 있으면 건드리지 않고, 검정/빈 화면일 때만 채운다. */
  setTimeout(quickHomeVideo,0);
})();

/* 촬영 화면의 '편집효과' 버튼이 아래 라이브 영역에 가려지거나 잘못 눌리지 않도록 터치 영역만 분리한다. */
(function(){
  if(window.__ktEditEffectTouchFixInstalled)return;
  window.__ktEditEffectTouchFixInstalled=true;

  function ensureEditTouchStyle(){
    if(document.getElementById('ktEditEffectTouchFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktEditEffectTouchFixStyle';
    s.textContent=''
      +'#creator .creator-tools{z-index:24!important;pointer-events:auto!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]{position:relative!important;z-index:30!important;transform:translateY(-10px)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="편집 효과"] *{pointer-events:none!important}';
    document.head.appendChild(s);
  }

  ensureEditTouchStyle();

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try{
      if(window.openEditEffectPanel)window.openEditEffectPanel();
    }catch(err){}
  },true);
})();
