/* K-Talk 멀티방: 호스트/운영자 자리 이동 + 소리 반응 파장
   - 호스트/운영자만 자리 이동 가능: 칸 길게 누르기 -> 옮길 자리 탭
   - 9명/13명/구독자/비밀방 공통
   - 마이크/미디어 스트림 소리가 있을 때만 파장 표시, 조용하면 자동 숨김
   - 기존 방송/입장/게스트 승인 로직은 변경하지 않음
*/
(function(){
  if(window.__ktSeatMoveSoundWave20260928)return;
  window.__ktSeatMoveSoundWave20260928=true;

  var HOLD_MS=650;
  var selected=null;
  var holdTimer=0;
  var audioCtx=null;
  var audioMap=new WeakMap();

  function isAdminOrHost(){
    try{if(typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin())return true;}catch(e){}
    try{
      var s=window.state||{};
      if(s.ktOwnerAdmin||s.isAdmin||s.admin||s.isHost||s.hosting||s.liveStarted)return true;
    }catch(e){}
    try{
      var v=document.getElementById('ktLiveVideo');
      if(v&&v.srcObject&&v.srcObject.getVideoTracks&&v.srcObject.getVideoTracks().length)return true;
    }catch(e){}
    return false;
  }

  function roomRoot(node){
    return node&&node.closest?node.closest('.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room'):null;
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
    }else if(root.matches('.ktsecret-room')){
      root.querySelectorAll('.ktsecret-slot').forEach(function(x){arr.push(x);});
    }
    return arr;
  }

  function tileFromTarget(t){
    if(!t||!t.closest)return null;
    return t.closest('.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot');
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
    toast('옮길 자리를 한 번 눌러주세요');
  }

  function swapSeats(a,b){
    if(!a||!b||a===b)return clearSelected();
    var ra=roomRoot(a),rb=roomRoot(b);
    if(!ra||ra!==rb)return clearSelected();
    ensureOrders(ra);
    var oa=parseInt(a.dataset.ktSeatOrder,10);
    var ob=parseInt(b.dataset.ktSeatOrder,10);
    if(!isFinite(oa)||!isFinite(ob))return clearSelected();
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
    clearSelected();
    toast('자리를 이동했습니다');
  }

  document.addEventListener('pointerdown',function(e){
    if(!isAdminOrHost())return;
    var tile=tileFromTarget(e.target);
    if(!tile)return;
    clearTimeout(holdTimer);
    holdTimer=setTimeout(function(){chooseSource(tile);},HOLD_MS);
  },true);

  ['pointerup','pointercancel','pointermove'].forEach(function(ev){
    document.addEventListener(ev,function(){clearTimeout(holdTimer);},true);
  });

  document.addEventListener('click',function(e){
    if(!selected)return;
    var tile=tileFromTarget(e.target);
    if(!tile)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    swapSeats(selected,tile);
  },true);

  function ensureStyle(){
    if(document.getElementById('ktSeatMoveSoundWaveStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktSeatMoveSoundWaveStyle20260928';
    s.textContent=''
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

  function init(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room').forEach(ensureOrders);
    scanAudio();
  }

  init();
  setInterval(init,1200);
  requestAnimationFrame(animateAudio);
})();