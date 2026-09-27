/* K-Talk host-only premium gift clip recorder.
   Keeps a short rolling host-camera buffer, marks gifts >=1000,
   and lets the host save each marked section to My Videos.
   Does not modify guest/viewer behavior. */
(function(){
  if(window.__ktHostPremiumGiftClipRecorder20260928)return;
  window.__ktHostPremiumGiftClipRecorder20260928=true;

  var recorder=null;
  var chunks=[]; // {blob,ts}
  var markers=[]; // {id,name,cost,sender,ts}
  var sourceStream=null;
  var starting=false;
  var MAX_BUFFER_MS=90000;
  var PRE_MS=10000;
  var POST_MS=20000;

  function inHostRoom(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return !!document.querySelector(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      );
    }catch(e){return false;}
  }

  function hostStream(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return s;
    }catch(e){}
    try{
      var v=document.querySelector(
        '#screen .ktsolo-main video,'+
        '#screen .ktg13-host video,'+
        '#screen .ktsubscriber-host video,'+
        '#screen .ktsecret-slot.host video,'+
        '#screen .ktsecret-host video'
      );
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject;
    }catch(e){}
    return null;
  }

  function prune(){
    var cut=Date.now()-MAX_BUFFER_MS;
    while(chunks.length&&chunks[0].ts<cut)chunks.shift();
    markers=markers.filter(function(m){return Date.now()-m.ts<20*60*1000;}).slice(-40);
  }

  function bestMime(){
    try{
      if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus'))return 'video/webm;codecs=vp8,opus';
      if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))return 'video/webm;codecs=vp8';
      if(MediaRecorder.isTypeSupported('video/webm'))return 'video/webm';
    }catch(e){}
    return '';
  }

  function stopRecorder(){
    try{if(recorder&&recorder.state!=='inactive')recorder.stop();}catch(e){}
    recorder=null;sourceStream=null;
  }

  function startRecorder(){
    if(starting||!inHostRoom()||typeof MediaRecorder==='undefined')return;
    var s=hostStream();if(!s)return;
    if(recorder&&recorder.state==='recording'&&sourceStream===s)return;

    starting=true;
    stopRecorder();
    try{
      var tracks=[];
      s.getVideoTracks().forEach(function(t){tracks.push(t);});
      s.getAudioTracks().forEach(function(t){tracks.push(t);});
      var clone=new MediaStream();
      tracks.forEach(function(t){try{clone.addTrack(t);}catch(e){}});
      if(!clone.getVideoTracks().length){starting=false;return;}

      var mime=bestMime(),opt={videoBitsPerSecond:2500000,audioBitsPerSecond:96000};
      if(mime)opt.mimeType=mime;
      recorder=new MediaRecorder(clone,opt);
      sourceStream=s;
      recorder.ondataavailable=function(e){
        if(e.data&&e.data.size>0){
          chunks.push({blob:e.data,ts:Date.now()});
          prune();
        }
      };
      recorder.onerror=function(){stopRecorder();};
      recorder.onstop=function(){};
      recorder.start(1000);
    }catch(e){
      recorder=null;sourceStream=null;
    }
    starting=false;
  }

  function ensureStyle(){
    if(document.getElementById('ktPremiumClipStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktPremiumClipStyle20260928';
    st.textContent=''
      +'.kt-premium-clip-switch-20260928{position:absolute!important;right:8px!important;top:8px!important;z-index:170!important;height:34px!important;padding:0 10px!important;border-radius:999px!important;border:1px solid #ff587c99!important;background:rgba(25,9,15,.9)!important;color:#fff!important;font-size:11px!important;font-weight:950!important;box-shadow:0 0 9px #ff3e6844!important;touch-action:manipulation!important}'
      +'.kt-premium-clip-switch-20260928 b{color:#ff6b88!important;margin-left:4px!important}'
      +'.kt-premium-clip-list{display:flex!important;flex-direction:column!important;gap:8px!important}'
      +'.kt-premium-clip-row{padding:10px!important;border-radius:13px!important;background:#15151a!important;border:1px solid #ffffff18!important}'
      +'.kt-premium-clip-row strong{display:block!important;color:#ffe06d!important;font-size:13px!important}.kt-premium-clip-row small{display:block!important;margin-top:3px!important;color:#bbb!important;font-size:10px!important}'
      +'.kt-premium-clip-row button{width:100%!important;height:42px!important;margin-top:8px!important;border:0!important;border-radius:11px!important;background:#ff2d67!important;color:#fff!important;font-weight:950!important}'
      +'.kt-premium-clip-row button:disabled{opacity:.45!important}';
    document.head.appendChild(st);
  }

  function switchHost(){
    return document.querySelector(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
    );
  }

  function ensureSwitch(){
    ensureStyle();
    if(!inHostRoom()){
      document.querySelectorAll('.kt-premium-clip-switch-20260928').forEach(function(x){x.remove();});
      return;
    }
    var room=switchHost();if(!room)return;
    try{room.style.setProperty('position','relative','important');}catch(e){}
    var b=room.querySelector('.kt-premium-clip-switch-20260928');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-premium-clip-switch-20260928';
      b.innerHTML='🎥 녹화 <b>0</b>';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        openMarkers();
      };
      room.appendChild(b);
    }
    var n=b.querySelector('b');if(n)n.textContent=String(markers.length);
  }

  function fmtTime(ts){
    try{return new Date(ts).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}catch(e){return '';}
  }

  function esc(v){
    return String(v||'').replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function clipReady(m){
    return Date.now()>=m.ts+POST_MS && chunks.some(function(x){return x.ts>=m.ts-PRE_MS&&x.ts<=m.ts+POST_MS;});
  }

  function openMarkers(){
    if(!inHostRoom())return;
    prune();
    var html='<div class="rowbox"><b>🎥 큰 선물 구간</b><br>큰 선물이 들어온 앞 10초부터 뒤 20초까지 찾아서 내 동영상에 올릴 수 있습니다.</div>';
    if(!markers.length){
      html+='<div class="rowbox">아직 기록된 큰 선물이 없습니다.</div>';
    }else{
      html+='<div class="kt-premium-clip-list">'+markers.slice().reverse().map(function(m){
        var ready=clipReady(m);
        return '<div class="kt-premium-clip-row">'
          +'<strong>🎁 '+esc(m.name)+' · '+Number(m.cost||0).toLocaleString('ko-KR')+'개</strong>'
          +'<small>'+esc(m.sender||'회원')+' · '+esc(fmtTime(m.ts))+'</small>'
          +'<button type="button" '+(ready?'':'disabled')+' onclick="ktSavePremiumGiftClip20260928(\''+m.id+'\')">'
          +(ready?'내 동영상에 올리기':'구간 저장 중…')+'</button>'
          +'</div>';
      }).join('')+'</div>';
    }
    if(typeof window.showSheet==='function')window.showSheet('🎥 큰 선물 녹화',html);
  }
  window.ktOpenPremiumGiftClips20260928=openMarkers;

  async function openDb(){
    return await new Promise(function(resolve,reject){
      if(!('indexedDB' in window)){reject(new Error('no indexedDB'));return;}
      var rq=indexedDB.open('KTALK_VIDEO_DB',1);
      rq.onupgradeneeded=function(){
        var db=rq.result;
        if(!db.objectStoreNames.contains('videos'))db.createObjectStore('videos',{keyPath:'id'});
      };
      rq.onsuccess=function(){resolve(rq.result);};
      rq.onerror=function(){reject(rq.error||new Error('db'));};
    });
  }

  window.ktSavePremiumGiftClip20260928=async function(id){
    if(!inHostRoom())return false;
    var m=markers.find(function(x){return x.id===id;});
    if(!m)return false;
    var selected=chunks.filter(function(x){
      return x.ts>=m.ts-PRE_MS&&x.ts<=m.ts+POST_MS;
    });
    if(!selected.length){
      try{alert('이 구간의 녹화 조각을 찾지 못했습니다.');}catch(e){}
      return false;
    }
    try{
      var type=(selected[0].blob&&selected[0].blob.type)||'video/webm';
      var blob=new Blob(selected.map(function(x){return x.blob;}),{type:type});
      var db=await openDb();
      var item={
        id:'premium-gift-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
        name:'큰 선물 · '+String(m.name||'선물')+' · '+String(m.sender||'회원'),
        type:type,
        blob:blob,
        createdAt:Date.now(),
        giftName:String(m.name||''),
        giftCost:Number(m.cost||0),
        giftSender:String(m.sender||'')
      };
      await new Promise(function(resolve,reject){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=resolve;
        tx.onerror=function(){reject(tx.error||new Error('save'));};
        tx.onabort=function(){reject(tx.error||new Error('abort'));};
      });
      try{db.close();}catch(e){}
      try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
      try{alert('✅ 큰 선물 구간을 내 동영상에 올렸습니다.');}catch(e){}
      try{if(typeof window.openMyVideoLibrary==='function')window.openMyVideoLibrary();}catch(e){}
      return true;
    }catch(e){
      try{alert('이 기기에서는 큰 선물 구간을 저장하지 못했습니다.');}catch(_e){}
      return false;
    }
  };

  window.ktMarkPremiumGiftClip20260928=function(name,cost,sender){
    if(!inHostRoom())return;
    var n=parseInt(String(cost||0).replace(/[^0-9]/g,''),10)||0;
    if(n<1000)return;
    var now=Date.now();
    var last=markers[markers.length-1];
    if(last&&now-last.ts<1200&&String(last.name)===String(name)&&String(last.sender)===String(sender))return;
    markers.push({
      id:'gift-'+now+'-'+Math.random().toString(36).slice(2,6),
      name:String(name||'큰 선물'),
      cost:n,
      sender:String(sender||'회원'),
      ts:now
    });
    prune();
    ensureSwitch();
  };

  function tick(){
    if(inHostRoom()){
      startRecorder();
      ensureSwitch();
    }else{
      stopRecorder();
      document.querySelectorAll('.kt-premium-clip-switch-20260928').forEach(function(x){x.remove();});
    }
  }

  ensureStyle();
  tick();
  setInterval(tick,900);
  window.addEventListener('pagehide',stopRecorder);
})();