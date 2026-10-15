/* K-Talk 멀티방: 호스트/운영자 자리 이동 + 소리 반응 파장
   - 호스트/승인 게스트: 자리 이동 표시 -> 사람 탭 -> 목적지 탭; 기존 끌기도 유지
   - 9명/13명/구독자/비밀방 공통
   - 마이크/미디어 스트림 소리가 있을 때만 파장 표시, 조용하면 자동 숨김
   - 기존 방송/입장/게스트 승인 로직은 변경하지 않음
*/
(function(){
  if(window.__ktSeatMoveSoundWave20260928)return;
  window.__ktSeatMoveSoundWave20260928=true;

  var HOLD_MS=650;
  var selected=null,tapModeRoot=null,tapPointer=null;
  var holdTimer=0;
  var audioCtx=null;
  var audioMap=new WeakMap();

  function isAdminOrHost(){
    var root=document.querySelector('#screen .kt-remote-live');
    var st=window.__ktLiveKitSfuState20260924||{};
    if(root){
      if(st.role==='guest'&&st.connected)return true;
      try{
        var device=localStorage.getItem('kt_live_device_id')||'';
        var approved=window.__ktApprovedGuestIds20260924||{};
        var own=window.__ktApprovedGuestSelfStream;
        return !!(device&&approved['viewer_'+device]===true&&own&&own.getVideoTracks().some(function(t){return t.readyState==='live';}));
      }catch(e){return false;}
    }
    try{var state=window.state||{};return !!(state.isHost||state.hosting||state.liveStarted||st.role==='host'&&st.connected);}catch(e){return false;}
  }
  window.ktCanDragSeat20261015=function(tile){return !!(roomRoot(tile)&&isAdminOrHost());};

  function roomRoot(node){
    return node&&node.closest?node.closest('.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room,.kt-sgfh-room'):null;
  }

  function tiles(root){
    if(!root)return [];
    var arr=[];
    if(root.matches('.ktg13-room,.ktg9-room')){
      var h=root.querySelector('.ktg13-host');
      if(h)arr.push(h);
      root.querySelectorAll('.ktg13-guest').forEach(function(x){arr.push(x);});
    }else if(root.matches('.ktsubscriber-room')){
      root.querySelectorAll('.ktsubscriber-host,.ktsubscriber-guest').forEach(function(x){arr.push(x);});
    }else if(root.matches('.ktsecret-room,.kt-sgfh-room')){
      root.querySelectorAll('.ktsecret-slot,.kt-sgfh-cell').forEach(function(x){arr.push(x);});
    }
    return arr;
  }

  function tileFromTarget(t){
    if(!t||!t.closest)return null;
    return t.closest('.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.kt-sgfh-cell');
  }

  function ensureOrders(root){
    tiles(root).forEach(function(t,i){
      if(!t.dataset.ktSeatOrder)t.dataset.ktSeatOrder=String(i);
      var n=parseInt(t.dataset.ktSeatOrder,10);
      if(!isFinite(n))n=i;
      t.style.setProperty('order',String(n),'important');
      t.classList.add('kt-seat-movable-20260928');
    });
  }

  function clearSelected(){
    if(selected)selected.classList.remove('kt-seat-selected-20260928');
    selected=null;
  }

  function toast(msg){
    var old=document.getElementById('ktSeatMoveToast20260928');
    if(old)old.remove();
    var d=document.createElement('div');
    d.id='ktSeatMoveToast20260928';
    d.textContent=msg;
    d.style.cssText='position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:2147483647;padding:10px 14px;border-radius:999px;background:rgba(10,10,14,.94);border:1px solid #a95cff;color:#fff;font:900 12px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif;box-shadow:0 0 18px #7e38ff55;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis';
    document.body.appendChild(d);
    setTimeout(function(){if(d.parentNode)d.remove();},1800);
  }

  function chooseSource(tile){
    if(!isAdminOrHost())return;
    var root=roomRoot(tile); if(!root)return;
    ensureOrders(root);
    clearSelected();
    selected=tile;
    tile.classList.add('kt-seat-selected-20260928');
    toast(tapModeRoot?'옮길 자리를 한 번 누르세요':'원하는 자리로 끌어 놓으세요');
  }

  function swapSeats(a,b){
    if(!a||!b||a===b)return clearSelected();
    var ra=roomRoot(a),rb=roomRoot(b);
    if(!ra||ra!==rb)return clearSelected();
    ensureOrders(ra);
    var oa=parseInt(a.dataset.ktSeatOrder,10);
    var ob=parseInt(b.dataset.ktSeatOrder,10);
    if(!isFinite(oa)||!isFinite(ob))return clearSelected();
    try{
      var ac=getComputedStyle(a),bc=getComputedStyle(b);
      var ag={column:ac.gridColumn,row:ac.gridRow},bg={column:bc.gridColumn,row:bc.gridRow};
      if(ag.column!=='auto'&&bg.column!=='auto'){
        a.style.setProperty('grid-column',bg.column,'important');b.style.setProperty('grid-column',ag.column,'important');
      }
      if(ag.row!=='auto'&&bg.row!=='auto'){
        a.style.setProperty('grid-row',bg.row,'important');b.style.setProperty('grid-row',ag.row,'important');
      }
    }catch(e){}
    a.dataset.ktSeatOrder=String(ob);
    b.dataset.ktSeatOrder=String(oa);
    a.style.setProperty('order',String(ob),'important');
    b.style.setProperty('order',String(oa),'important');

    /* 9명방에서 호스트를 첫 칸에 강제로 고정하던 좌표만 자리 이동 시 해제 */
    if(ra.getAttribute('data-kt-room')==='9'){
      [a,b].forEach(function(t){
        if(t.classList.contains('ktg13-host')){
          t.style.setProperty('grid-column','auto','important');
          t.style.setProperty('grid-row','auto','important');
        }
      });
    }
    twoLarge(ra);
    clearSelected();
    toast('자리를 이동했습니다');
  }

  function endTapMove(){if(tapModeRoot)tapModeRoot.classList.remove('kt-seat-tap-mode-20261015');tapModeRoot=null;tapPointer=null;clearSelected();}
  window.ktSeatTapModeActive20261015=function(tile){return !!(tapModeRoot&&isAdminOrHost()&&(!tile||roomRoot(tile)===tapModeRoot));};
  window.ktBeginSeatTapMove20261015=function(tile){
    if(!isAdminOrHost())return false;var root=roomRoot(tile);if(!root)return false;
    if(tapModeRoot===root){endTapMove();toast('자리 이동을 취소했습니다');return true;}
    endTapMove();tapModeRoot=root;root.classList.add('kt-seat-tap-mode-20261015');toast('옮길 사람을 한 번 누르세요');return true;
  };
  function tapSeat(tile){
    if(!tapModeRoot||!isAdminOrHost()||!tapModeRoot.isConnected){endTapMove();return;}
    if(roomRoot(tile)!==tapModeRoot)return;
    if(selected&&!selected.isConnected)clearSelected();
    if(!selected){
      var person=tile.matches('.ktg13-host,.ktsubscriber-host,.host')||tile.querySelector('video,img')||Object.keys(tile.dataset||{}).some(function(k){return /viewer|guest|participant|userId/i.test(k)&&tile.dataset[k]&&k!=='guestSlot';});
      if(!person){toast('먼저 옮길 사람을 눌러 주세요');return;}chooseSource(tile);return;
    }
    if(selected===tile){clearSelected();toast('옮길 사람을 한 번 누르세요');return;}
    var from=selected;swapSeats(from,tile);endTapMove();
  }
  var gesture=null,dropTarget=null,suppressClickUntil=0;
  function stopGestureEvent(e){if(e.cancelable)e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
  function clearDrop(){if(dropTarget)dropTarget.classList.remove('kt-seat-drop-20261015');dropTarget=null;}
  function restoreDrag(g){
    if(!g)return;g.tile.style.setProperty('translate',g.translate,g.priority);
    if(!g.translate)g.tile.style.removeProperty('translate');
    try{g.tile.releasePointerCapture(g.id);}catch(e){}
    clearDrop();clearSelected();
  }
  function dropAt(x,y,root){
    var nodes=document.elementsFromPoint?document.elementsFromPoint(x,y):[document.elementFromPoint(x,y)];
    for(var i=0;i<nodes.length;i++){var tile=tileFromTarget(nodes[i]);if(tile&&tile!==selected&&roomRoot(tile)===root)return tile;}
    return null;
  }
  window.addEventListener('pointerdown',function(e){
    if(e.isPrimary===false||e.button>0||!isAdminOrHost())return;
    if(e.target.closest&&e.target.closest('button,input,textarea,a,[role="button"],#sheet,.kt-inside-av-controls'))return;
    var tile=tileFromTarget(e.target),root=roomRoot(tile);if(!tile||!root)return;
    if(tapModeRoot&&root===tapModeRoot){tapPointer={tile:tile,id:e.pointerId,x:e.clientX,y:e.clientY};stopGestureEvent(e);return;}
    clearTimeout(holdTimer);
    gesture={tile:tile,root:root,id:e.pointerId,x:e.clientX,y:e.clientY,active:false,translate:tile.style.getPropertyValue('translate'),priority:tile.style.getPropertyPriority('translate')};
    var g=gesture;
    holdTimer=setTimeout(function(){
      if(gesture!==g||!g.tile.isConnected||!isAdminOrHost())return;
      chooseSource(g.tile);g.active=true;
      try{g.tile.setPointerCapture(g.id);}catch(e){}
    },HOLD_MS);
  },true);
  window.addEventListener('pointermove',function(e){
    var g=gesture;if(!g||e.pointerId!==g.id)return;
    if(!g.active){if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>12){clearTimeout(holdTimer);gesture=null;}return;}
    if(!isAdminOrHost()){clearTimeout(holdTimer);gesture=null;restoreDrag(g);return;}
    stopGestureEvent(e);
    g.tile.style.setProperty('translate',(e.clientX-g.x)+'px '+(e.clientY-g.y)+'px','important');
    var target=dropAt(e.clientX,e.clientY,g.root);
    clearDrop();dropTarget=target;if(target)target.classList.add('kt-seat-drop-20261015');
  },{capture:true,passive:false});
  function finishGesture(e){
    if(tapPointer&&e.pointerId===tapPointer.id){
      var tap=tapPointer;tapPointer=null;stopGestureEvent(e);suppressClickUntil=Date.now()+900;
      if(e.type==='pointerup'&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=12)tapSeat(tap.tile);return;
    }
    var g=gesture;if(!g||e.pointerId!==g.id)return;clearTimeout(holdTimer);gesture=null;
    if(!g.active)return;
    stopGestureEvent(e);suppressClickUntil=Date.now()+900;
    var destination=e.type==='pointerup'&&isAdminOrHost()?dropAt(e.clientX,e.clientY,g.root):null;
    restoreDrag(g);
    if(destination)swapSeats(g.tile,destination);
  }
  window.addEventListener('pointerup',finishGesture,true);
  window.addEventListener('pointercancel',finishGesture,true);
  window.addEventListener('blur',function(){clearTimeout(holdTimer);var g=gesture;gesture=null;restoreDrag(g);});
  window.addEventListener('click',function(e){
    var button=e.target.closest&&e.target.closest('.kt-inside-move-seat');
    if(button){if(isAdminOrHost()){stopGestureEvent(e);window.ktBeginSeatTapMove20261015(tileFromTarget(button));}return;}
    var tile=tileFromTarget(e.target);
    if(Date.now()<suppressClickUntil&&tile){stopGestureEvent(e);return;}
    if(tapModeRoot&&tile&&roomRoot(tile)===tapModeRoot){stopGestureEvent(e);tapSeat(tile);}
  },true);
  window.addEventListener('keydown',function(e){if(e.key==='Escape')endTapMove();});
  window.addEventListener('kt-remote-host-left',endTapMove);
  window.addEventListener('kt-broadcast-ended',endTapMove);

  function ensureStyle(){
    if(document.getElementById('ktSeatMoveSoundWaveStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktSeatMoveSoundWaveStyle20260928';
    s.textContent=''
      +'.kt-seat-drag-enabled-20261015 .kt-seat-movable-20260928{touch-action:none!important;user-select:none!important;-webkit-user-select:none!important}'
      +'.kt-seat-drop-20261015{outline:3px dashed #ffd95a!important;outline-offset:-3px!important}'
      +'.kt-seat-selected-20260928{outline:3px solid #b45cff!important;box-shadow:0 0 18px #9d4dff!important;z-index:120!important}'
      +'.kt-active-sound-wave-20260928{position:absolute!important;left:50%!important;bottom:5px!important;transform:translateX(-50%)!important;z-index:115!important;height:17px!important;display:flex!important;align-items:flex-end!important;gap:2px!important;padding:2px 5px!important;border-radius:999px!important;background:rgba(0,0,0,.48)!important;pointer-events:none!important;opacity:0!important;transition:opacity .12s ease!important}'
      +'.kt-active-sound-wave-20260928.on{opacity:1!important}'
      +'.kt-active-sound-wave-20260928 i{display:block!important;width:3px!important;height:5px!important;border-radius:3px!important;background:#67e8ff!important;box-shadow:0 0 5px #4acfff!important;animation:ktSoundBar20260928 .45s ease-in-out infinite alternate!important}'
      +'.kt-active-sound-wave-20260928 i:nth-child(2){animation-delay:.08s!important}.kt-active-sound-wave-20260928 i:nth-child(3){animation-delay:.16s!important}.kt-active-sound-wave-20260928 i:nth-child(4){animation-delay:.24s!important}.kt-active-sound-wave-20260928 i:nth-child(5){animation-delay:.32s!important}'
      +'@keyframes ktSoundBar20260928{from{height:4px}to{height:14px}}';
    document.head.appendChild(s);
  }

  function ensureWave(tile){
    if(!tile)return null;
    var w=tile.querySelector(':scope > .kt-active-sound-wave-20260928');
    if(!w){
      w=document.createElement('div');
      w.className='kt-active-sound-wave-20260928';
      w.innerHTML='<i></i><i></i><i></i><i></i><i></i>';
      tile.appendChild(w);
    }
    return w;
  }

  function getAudioContext(){
    if(audioCtx)return audioCtx;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return null;
    try{audioCtx=new AC();}catch(e){return null;}
    return audioCtx;
  }

  function attachAnalyser(video,tile){
    try{
      var stream=video.srcObject;
      if(!stream||!stream.getAudioTracks||!stream.getAudioTracks().length)return null;
      var old=audioMap.get(video);
      if(old&&old.stream===stream)return old;
      var ctx=getAudioContext(); if(!ctx)return null;
      var source=ctx.createMediaStreamSource(stream);
      var analyser=ctx.createAnalyser();
      analyser.fftSize=256;
      analyser.smoothingTimeConstant=.72;
      source.connect(analyser);
      var obj={stream:stream,source:source,analyser:analyser,data:new Uint8Array(analyser.fftSize),tile:tile};
      audioMap.set(video,obj);
      return obj;
    }catch(e){return null;}
  }

  function scanAudio(){
    document.querySelectorAll('.ktg13-host video,.ktg13-guest video,.ktsubscriber-host video,.ktsubscriber-guest video,.ktsecret-slot video').forEach(function(v){
      var tile=tileFromTarget(v); if(!tile)return;
      ensureWave(tile);
      attachAnalyser(v,tile);
    });
  }

  function animateAudio(){
    scanAudio();
    document.querySelectorAll('.kt-active-sound-wave-20260928').forEach(function(w){w.classList.remove('on');});
    document.querySelectorAll('.ktg13-host video,.ktg13-guest video,.ktsubscriber-host video,.ktsubscriber-guest video,.ktsecret-slot video').forEach(function(v){
      var obj=audioMap.get(v); if(!obj)return;
      try{
        obj.analyser.getByteTimeDomainData(obj.data);
        var sum=0;
        for(var i=0;i<obj.data.length;i++){
          var x=(obj.data[i]-128)/128;
          sum+=x*x;
        }
        var rms=Math.sqrt(sum/obj.data.length);
        var tracks=obj.stream.getAudioTracks();
        var live=tracks.some(function(t){return t.enabled&&t.readyState==='live';});
        var w=ensureWave(obj.tile);
        if(w&&live&&rms>.035)w.classList.add('on');
      }catch(e){}
    });
    requestAnimationFrame(animateAudio);
  }

  function resumeAudio(){
    var ctx=getAudioContext();
    if(ctx&&ctx.state==='suspended')ctx.resume().catch(function(){});
  }
  ['click','touchstart','pointerdown'].forEach(function(ev){document.addEventListener(ev,resumeAudio,{passive:true});});


  var layoutSnapshots=new WeakMap();
  function canChangeLayout(){var st=window.state||{};return !!(st.isHost||st.hosting||st.liveStarted||st.isAdmin||st.isOperator||st.operator||st.role==='admin'||st.role==='operator');}
  function stageOf(root){return root.querySelector('.ktg13-main,.ktsubscriber-people');}
  function twoLarge(root){
    if(root.dataset.ktTwoLarge!=='1')return;
    var stage=stageOf(root),list=tiles(root);if(!stage)return;
    stage.style.setProperty('grid-template-columns','repeat(4,minmax(0,1fr))','important');
    stage.style.setProperty('grid-template-rows','repeat('+(2+Math.ceil(Math.max(0,list.length-2)/4))+',minmax(0,1fr))','important');
    list.forEach(function(t,i){var n=parseInt(t.dataset.ktSeatOrder,10);if(!isFinite(n))n=i;
      t.style.setProperty('grid-column',n<2?(n===0?'1 / span 2':'3 / span 2'):String((n-2)%4+1),'important');
      t.style.setProperty('grid-row',n<2?'1 / span 2':String(3+Math.floor((n-2)/4)),'important');
    });
  }
  function toggleLayout(root){
    if(!canChangeLayout())return;
    var stage=stageOf(root);if(!stage)return;
    if(root.dataset.ktTwoLarge==='1'){
      var snap=layoutSnapshots.get(root);if(snap)snap.forEach(function(x){x.node.setAttribute('style',x.style);});
      delete root.dataset.ktTwoLarge;layoutSnapshots.delete(root);
    }else{
      layoutSnapshots.set(root,[stage].concat(tiles(root)).map(function(n){return {node:n,style:n.getAttribute('style')||''};}));
      root.dataset.ktTwoLarge='1';ensureOrders(root);twoLarge(root);
    }
    var b=root.querySelector('.kt-seat-layout-choice');if(b)b.textContent=root.dataset.ktTwoLarge==='1'?'방 모양 · 기본으로':'방 모양 · 큰 두 칸';
  }
  function installSeatControls(root){
    if(!root.matches('.ktg13-room,.ktg9-room,.ktsubscriber-room'))return;
    var host=root.querySelector('.ktg13-host,.ktsubscriber-host');var remote=root.closest('.kt-remote-live');if(remote){var device='';try{device=localStorage.getItem('kt_live_device_id')||'';}catch(e){}host=tiles(root).find(function(t){return Array.from(t.querySelectorAll('video')).some(function(v){return v.srcObject&&v.srcObject===window.__ktApprovedGuestSelfStream;})||device&&Object.keys(t.dataset).some(function(k){return /viewer|participant|userId/i.test(k)&&String(t.dataset[k])==='viewer_'+device;});});}if(!host)return;
    var box=host.querySelector('.kt-seat-own-controls');
    if(!canChangeLayout()){if(box)box.remove();return;}
    if(!box){
      box=document.createElement('div');box.className='kt-seat-own-controls';
      box.style.cssText='position:absolute;right:3px;top:25px;z-index:40;display:flex;flex-direction:column;gap:3px;max-width:95%';
      var layout=document.createElement('button');layout.type='button';layout.className='kt-seat-layout-choice';layout.textContent='방 모양 · 큰 두 칸';
      var move=document.createElement('button');move.type='button';move.textContent='자리 이동';
      [layout,move].forEach(function(b){b.style.cssText='border:1px solid #ffffff66;border-radius:7px;background:#141019bb;color:white;padding:5px;font-size:10px;font-weight:900';box.appendChild(b);});
      layout.onclick=function(e){e.stopPropagation();toggleLayout(root);};
      move.onclick=function(e){e.stopPropagation();window.ktBeginSeatTapMove20261015(host);};
      host.appendChild(box);
    }
    twoLarge(root);
  }

  function init(){
    ensureStyle();
    if(tapModeRoot&&(!tapModeRoot.isConnected||!isAdminOrHost()))endTapMove();
    document.querySelectorAll('.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room').forEach(function(root){ensureOrders(root);installSeatControls(root);root.classList.toggle('kt-seat-drag-enabled-20261015',isAdminOrHost());});
    scanAudio();
  }

  init();
  setInterval(init,1200);
  requestAnimationFrame(animateAudio);
})();