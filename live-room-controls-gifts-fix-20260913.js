/* K-Talk 라이브방 버튼/빠른선물 터치 전용 보강. 화면 배치/크기는 변경하지 않음. */
(function(){
  if(window.__ktLiveRoomControlsGiftsFix20260913)return;
  window.__ktLiveRoomControlsGiftsFix20260913=true;

  var lastPointerControl=null;
  var lastPointerAt=0;

  function inLiveRoom(el){
    return !!(el&&el.closest&&el.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
  }

  function roomKind(el){
    var r=el&&el.closest?el.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'):null;
    if(!r)return '';
    if(r.classList.contains('ktsolo-room'))return 'solo';
    if(r.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(r.classList.contains('ktsecret-room'))return 'secret';
    return 'group13';
  }

  function ensureStyle(){
    if(document.getElementById('ktLiveRoomControlsGiftsFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktLiveRoomControlsGiftsFixStyle';
    s.textContent=''
      +'.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room{pointer-events:auto!important}'
      +'.ktsolo-room button,.ktg13-room button,.ktsubscriber-room button,.ktsecret-room button{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'
      +'.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.ktsolo-right,.ktg13-right-quick,.ktsubscriber-right,.ktsecret-right{pointer-events:auto!important;z-index:80!important}'
      +'.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.ktsolo-right>*,.ktg13-right-quick>*,.ktsubscriber-right>*,.ktsecret-right>*,.ktsolo-gift,.ktg13-gift,.ktsubscriber-gift,.ktsecret-gift{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:81!important;cursor:pointer!important}'
      +'.ktsolo-gifts,.ktg13-gifts,.ktsubscriber-gifts,.ktsecret-gifts,.ktsolo-gifts>*,.ktg13-gifts>*,.ktsubscriber-gifts>*,.ktsecret-gifts>*{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:75!important}'
      +'.ktg13-room .ktg13-tools,.ktg13-room .ktg13-tool,.ktg13-room .ktg13-stats,.ktg13-room .ktg13-stats button{pointer-events:auto!important;position:relative!important;z-index:82!important;touch-action:manipulation!important}'
      +'.ktg13-room .kt-room-live-wave,.ktg13-room .vh-shade,.ktg13-room video{pointer-events:none!important}'
      +'.ktsolo-room .ktsolo-right{top:14px!important;bottom:auto!important;right:8px!important;transform:none!important}'
      +'.kt-live-tap-pressed{transform:scale(.94)!important;filter:brightness(1.18)!important}';
    document.head.appendChild(s);
  }

  function stopEvent(e){
    try{e.preventDefault();}catch(x){}
    try{e.stopPropagation();}catch(x){}
    try{if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
  }

  function press(btn){
    if(!btn)return;
    try{btn.classList.add('kt-live-tap-pressed');setTimeout(function(){btn.classList.remove('kt-live-tap-pressed');},130);}catch(e){}
  }

  /* 뒤집기 = 좌우 반전이 아니라 실제 앞카메라 ↔ 뒷카메라 전환 */
  async function flipCamera(){
    var current=(window.state&&state.cameraFacing)||'user';
    var next=current==='environment'?'user':'environment';
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;

      var oldStream=(window.state&&state.stream)?state.stream:null;
      var audioTracks=[];
      if(oldStream&&oldStream.getAudioTracks){
        audioTracks=oldStream.getAudioTracks().filter(function(t){return t.readyState==='live';});
      }

      if(oldStream&&oldStream.getVideoTracks){
        oldStream.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});
      }

      var videoStream=null;
      var base={width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}};
      try{
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }catch(firstErr){
        videoStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:next},width:base.width,height:base.height,frameRate:base.frameRate},
          audio:false
        });
      }

      var tracks=[];
      if(videoStream&&videoStream.getVideoTracks)tracks=tracks.concat(videoStream.getVideoTracks());
      tracks=tracks.concat(audioTracks);
      var merged=new MediaStream(tracks);

      if(window.state){
        state.stream=merged;
        state.cameraFacing=next;
      }

      document.querySelectorAll('#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          v.srcObject=merged;
          v.style.setProperty('transform',next==='user'?'scaleX(-1)':'none','important');
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
      return true;
    }catch(e){
      try{if(window.state)state.cameraFacing=current;}catch(x){}
      return false;
    }
  }

  function attendance(){
    try{
      if(typeof window.ktAttendanceCheck==='function'){window.ktAttendanceCheck();return;}
      if(typeof window.openAttendanceBenefits==='function'){window.openAttendanceBenefits();return;}
    }catch(e){}
  }

  function like(){
    try{
      if(typeof window.ktUnifiedQuickLike==='function'){window.ktUnifiedQuickLike();return;}
      if(typeof window.addHostLike==='function'){window.addHostLike(1);return;}
    }catch(e){}
    ['hostLikeCount','ktg13LikeCount'].forEach(function(id){
      var n=document.getElementById(id);if(n)n.textContent=String((parseInt(n.textContent||'0',10)||0)+1);
    });
  }

  function effect(kind){
    try{
      if(typeof window.ktUnifiedQuickEffect==='function'){window.ktUnifiedQuickEffect(kind==='solo'?'solo':'group13');return;}
      if(kind==='solo'&&typeof window.ktSoloEffect==='function'){window.ktSoloEffect();return;}
      if(kind==='subscriber'&&typeof window.ktSubscriberEffect==='function'){window.ktSubscriberEffect();return;}
      if(kind==='secret'&&typeof window.ktSecretEffect==='function'){window.ktSecretEffect();return;}
      if(typeof window.ktGroup13Effect==='function'){window.ktGroup13Effect();return;}
      if(typeof window.openEditEffectPanel==='function'){window.openEditEffectPanel();return;}
    }catch(e){}
  }

  function treasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
      if(typeof window.openTreasure==='function'){window.openTreasure();return;}
      if(typeof window.openGifts==='function'){window.openGifts();return;}
    }catch(e){}
  }

  function match(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
      if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
      if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}
    }catch(e){}
  }

  function sendQuickGift(btn){
    var t=String(btn.textContent||'').replace(/\s+/g,'');
    try{
      if(t.indexOf('선물상자')>-1||t.indexOf('큰선물보기')>-1){
        if(typeof window.openGifts==='function')window.openGifts();
        return true;
      }
      var name='',count=0;
      if(t.indexOf('장미다발')>-1){name='장미다발';count=50;}
      else if(t.indexOf('특대장미')>-1){name='특대장미';count=100;}
      else if(t.indexOf('스포츠카')>-1){name='스포츠카';count=50;}
      else if(t.indexOf('왕관')>-1){name='왕관';count=100;}
      else if(t.indexOf('하트')>-1){name='하트';count=10;}
      else if(t.indexOf('장미')>-1){name='장미';count=1;}
      if(!name)return false;
      if(typeof window.giftSend==='function')window.giftSend(name,count);
      else if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{name:name,count:count});
      return true;
    }catch(e){return false;}
  }

  function isQuickGift(btn){
    return !!(btn&&btn.matches&&btn.matches('.ktsolo-gift,.ktg13-gift,.ktsubscriber-gift,.ktsecret-gift'));
  }

  function directQuickChild(target){
    if(!target||!target.closest)return null;
    var side=target.closest('.ktsolo-right,.ktg13-right-quick,.ktsubscriber-right,.ktsecret-right');
    if(!side)return null;
    var node=target;
    while(node&&node.parentElement!==side)node=node.parentElement;
    return node&&node.parentElement===side?node:null;
  }

  function candidateFromNode(target){
    if(!target||!target.closest)return null;
    var btn=target.closest('button,[role="button"],.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.ktsolo-gift,.ktg13-gift,.ktsubscriber-gift,.ktsecret-gift');
    if(!btn)btn=directQuickChild(target);
    return btn&&inLiveRoom(btn)?btn:null;
  }

  function controlFromEvent(e){
    var btn=candidateFromNode(e&&e.target);
    if(btn)return btn;
    try{
      var x=typeof e.clientX==='number'?e.clientX:null;
      var y=typeof e.clientY==='number'?e.clientY:null;
      if(x===null||y===null||!document.elementsFromPoint)return null;
      var els=document.elementsFromPoint(x,y)||[];
      for(var i=0;i<els.length;i++){
        btn=candidateFromNode(els[i]);
        if(btn)return btn;
      }
    }catch(err){}
    return null;
  }

  function handle(e){
    var btn=controlFromEvent(e);
    if(!btn)return;

    var now=Date.now();
    if(e.type==='click'&&lastPointerControl===btn&&now-lastPointerAt<900){
      stopEvent(e);
      return;
    }

    if(e.type==='pointerup'){
      lastPointerControl=btn;
      lastPointerAt=now;
    }

    if(isQuickGift(btn)){
      stopEvent(e);press(btn);sendQuickGift(btn);return;
    }

    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var aria=String(btn.getAttribute&&btn.getAttribute('aria-label')||'').replace(/\s+/g,'');
    var key=text+' '+aria;
    var kind=roomKind(btn);

    if(btn.matches&&btn.matches('.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att')||key.indexOf('출석체크')>-1){
      stopEvent(e);press(btn);attendance();return;
    }
    if(key.indexOf('뒤집기')>-1||key.indexOf('되돌리기')>-1){
      stopEvent(e);press(btn);flipCamera();return;
    }
    if(key.indexOf('좋아요')>-1){
      stopEvent(e);press(btn);like();return;
    }
    if(key.indexOf('효과')>-1){
      stopEvent(e);press(btn);effect(kind);return;
    }
    if(key.indexOf('보물상자')>-1){
      stopEvent(e);press(btn);treasure();return;
    }
    if(key.indexOf('매치')>-1){
      stopEvent(e);press(btn);match();return;
    }
  }

  ensureStyle();
  window.addEventListener('pointerup',handle,true);
  window.addEventListener('click',handle,true);
  setInterval(ensureStyle,1500);
})();

/* 보물상자 팝업의 닫기 버튼만 터치 안정화. 다른 팝업/화면은 변경하지 않음. */
(function(){
  if(window.__ktTreasureCloseOnly20260914)return;
  window.__ktTreasureCloseOnly20260914=true;

  function isTreasureSheet(){
    var sh=document.getElementById('sheet');
    var title=document.getElementById('sheetTitle');
    return !!(sh&&sh.classList.contains('show')&&title&&String(title.textContent||'').indexOf('보물상자')>-1);
  }

  function closeTreasure(e){
    if(!isTreasureSheet())return;
    var sh=document.getElementById('sheet');
    var close=sh&&sh.querySelector('.sheet-head button');
    if(!close)return;
    var hit=false;
    try{hit=!!(e.target&&e.target.closest&&e.target.closest('#sheet .sheet-head button')===close);}catch(x){}
    if(!hit){
      try{
        var r=close.getBoundingClientRect();
        var x=e.clientX,y=e.clientY;
        hit=typeof x==='number'&&typeof y==='number'&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
      }catch(x){}
    }
    if(!hit)return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(x){}
    try{
      sh.classList.remove('show');
      var body=document.getElementById('sheetBody');
      if(body)body.innerHTML='';
    }catch(x){}
  }

  window.addEventListener('pointerup',closeTreasure,true);
  window.addEventListener('click',closeTreasure,true);
})();

/* 보물상자 '닫기' 첫 터치 즉시 닫기 전용. 다른 요소는 변경하지 않음. */
(function(){
  if(window.__ktTreasureCloseOneTap20260915)return;
  window.__ktTreasureCloseOneTap20260915=true;

  function isTreasureOpen(){
    var sh=document.getElementById('sheet');
    var title=document.getElementById('sheetTitle');
    return !!(sh&&sh.classList.contains('show')&&title&&String(title.textContent||'').indexOf('보물상자')>-1);
  }

  function closeButton(){
    var sh=document.getElementById('sheet');
    if(!sh)return null;
    var list=sh.querySelectorAll('.sheet-head button');
    for(var i=0;i<list.length;i++){
      if(String(list[i].textContent||'').replace(/\s+/g,'').indexOf('닫기')>-1)return list[i];
    }
    return list[0]||null;
  }

  function hardClose(){
    if(!isTreasureOpen())return;
    var sh=document.getElementById('sheet');
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    try{
      if(sh){
        sh.classList.remove('show');
        sh.style.removeProperty('pointer-events');
      }
      var body=document.getElementById('sheetBody');
      if(body)body.innerHTML='';
    }catch(e){}
  }

  function hitClose(e){
    if(!isTreasureOpen())return false;
    var btn=closeButton();
    if(!btn)return false;
    try{
      if(e&&e.target&&e.target.closest&&e.target.closest('#sheet .sheet-head button')===btn)return true;
    }catch(x){}
    try{
      var p=(e&&e.touches&&e.touches[0])||(e&&e.changedTouches&&e.changedTouches[0])||e;
      var x=p&&p.clientX,y=p&&p.clientY;
      if(typeof x!=='number'||typeof y!=='number')return false;
      var r=btn.getBoundingClientRect();
      return x>=r.left-8&&x<=r.right+8&&y>=r.top-8&&y<=r.bottom+8;
    }catch(x){return false;}
  }

  function onFirstTouch(e){
    if(!hitClose(e))return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    hardClose();
  }

  function strengthenClose(){
    if(!isTreasureOpen())return;
    var btn=closeButton();
    if(!btn)return;
    try{
      btn.style.setProperty('pointer-events','auto','important');
      btn.style.setProperty('touch-action','manipulation','important');
      btn.style.setProperty('position','relative','important');
      btn.style.setProperty('z-index','2147483647','important');
      if(btn.dataset.ktTreasureOneTap!=='1'){
        btn.dataset.ktTreasureOneTap='1';
        btn.addEventListener('pointerdown',onFirstTouch,true);
        btn.addEventListener('touchstart',onFirstTouch,{capture:true,passive:false});
        btn.addEventListener('mousedown',onFirstTouch,true);
      }
    }catch(e){}
  }

  window.addEventListener('pointerdown',onFirstTouch,true);
  window.addEventListener('touchstart',onFirstTouch,{capture:true,passive:false});
  window.addEventListener('mousedown',onFirstTouch,true);
  window.addEventListener('click',onFirstTouch,true);

  try{
    new MutationObserver(function(){setTimeout(strengthenClose,0);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
  setInterval(strengthenClose,300);
})();

/* 방송 시작 직후 예전 화면이 잠깐 보이는 것만 가림. 최종 방 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomOpenFlashGuard20260915)return;
  window.__ktRoomOpenFlashGuard20260915=true;

  function selectedRoom(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      if(t==='group9'||n==='9명 방송')return null; /* 9명방은 검은 가림막 없이 바로 연다 */
      if(t==='group15'||n==='15명 방송')return {selector:'.ktg13-room[data-kt-room="15"]'};
      if(t==='group'||t==='group13'||n==='13명 방송')return {selector:'.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])'};
      if(t==='subscriber'||String(n).indexOf('구독자')>-1)return {selector:'.ktsubscriber-room'};
      if(t==='secret'||String(n).indexOf('비밀')>-1)return {selector:'.ktsecret-room'};
      if(t==='solo'||String(n).indexOf('1인')>-1)return {selector:'.ktsolo-room'};
    }catch(e){}
    return null;
  }

  function makeCover(){
    var old=document.getElementById('ktRoomOpeningFlashCover');
    if(old)try{old.remove();}catch(e){}
    var c=document.createElement('div');
    c.id='ktRoomOpeningFlashCover';
    c.setAttribute('aria-hidden','true');
    c.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000;pointer-events:auto;';
    (document.body||document.documentElement).appendChild(c);
    return c;
  }

  function removeCover(c){
    try{if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
  }

  function watchFinalRoom(info,c){
    var ended=false;
    var mo=null;
    var timer=null;
    function finish(){
      if(ended)return;
      ended=true;
      try{if(mo)mo.disconnect();}catch(e){}
      try{if(timer)clearTimeout(timer);}catch(e){}
      removeCover(c);
    }
    function check(){
      if(ended)return;
      try{if(info&&info.selector&&document.querySelector(info.selector)){finish();return;}}catch(e){}
    }
    try{
      mo=new MutationObserver(check);
      mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-kt-room']});
    }catch(e){}
    timer=setTimeout(finish,4500);
    check();
    return finish;
  }

  function install(){
    var previous=window.startBroadcast;
    if(typeof previous!=='function'||previous.__ktRoomOpenFlashGuard)return;

    var guarded=async function(){
      var info=selectedRoom();
      if(!info)return previous.apply(this,arguments);
      var cover=makeCover();
      var stopWatch=watchFinalRoom(info,cover);
      try{
        return await previous.apply(this,arguments);
      }catch(err){
        stopWatch();
        throw err;
      }
    };
    guarded.__ktRoomOpenFlashGuard=true;
    guarded.__ktRoomOpenFlashGuardBase=previous;
    window.startBroadcast=guarded;
  }

  if(document.readyState==='complete')install();
  else window.addEventListener('load',install,{once:true});
})();