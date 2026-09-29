/* K-Talk 매치 3분 / 3회 녹화 전용 2026-09-29
   - 매치 화면에서만 동작
   - 3분 동안 1분씩 총 3개 영상으로 자동 녹화
   - 각 1분 영상은 완료 즉시 '내 동영상' DB에 저장
   - 녹화 버튼은 나가기 버튼 바로 왼쪽
   - 다른 방/카메라/채팅/수익률/버튼은 변경하지 않음 */
(function(){
  if(window.__ktMatchThreeClipRecorder20260929)return;
  window.__ktMatchThreeClipRecorder20260929=true;

  var recorder=null;
  var stream=null;
  var clipIndex=0;
  var active=false;
  var clipStartedAt=0;
  var chunks=[];
  var timer=null;

  function inMatch(){
    return !!document.querySelector('.match-arena-sheet .kt-match-arena');
  }

  function hostStream(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return s;
    }catch(e){}
    try{
      var v=document.getElementById('ktMatchHostVideo');
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject;
    }catch(e){}
    return null;
  }

  function bestMime(){
    try{
      if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus'))return 'video/webm;codecs=vp8,opus';
      if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))return 'video/webm;codecs=vp8';
      if(MediaRecorder.isTypeSupported('video/webm'))return 'video/webm';
    }catch(e){}
    return '';
  }

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

  async function saveClip(blob,index){
    if(!blob||!blob.size)return;
    try{
      var db=await openDb();
      var item={
        id:'match-clip-'+Date.now()+'-'+index+'-'+Math.random().toString(36).slice(2,6),
        name:'매치 자랑 영상 '+index+'/3',
        type:blob.type||'video/webm',
        blob:blob,
        createdAt:Date.now(),
        matchClip:true,
        matchClipIndex:index,
        matchDurationSeconds:60
      };
      await new Promise(function(resolve,reject){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=resolve;
        tx.onerror=function(){reject(tx.error||new Error('save'));};
        tx.onabort=function(){reject(tx.error||new Error('abort'));};
      });
      try{db.close();}catch(e){}
    }catch(e){}
  }

  function stopRecorderOnly(){
    try{if(recorder&&recorder.state!=='inactive')recorder.stop();}catch(e){}
  }

  function reset(){
    clearInterval(timer);timer=null;
    active=false;
    clipIndex=0;
    clipStartedAt=0;
    chunks=[];
    try{stopRecorderOnly();}catch(e){}
    recorder=null;stream=null;
    updateButton();
  }

  function updateButton(){
    var b=document.getElementById('ktMatchThreeClipRecordBtn20260929');
    if(!b)return;
    if(!active){
      b.innerHTML='🎥 녹화 <b>0/3</b>';
      return;
    }
    var sec=Math.max(0,60-Math.floor((Date.now()-clipStartedAt)/1000));
    b.innerHTML='🎥 녹화 <b>'+Math.min(clipIndex+1,3)+'/3 · '+String(sec).padStart(2,'0')+'초</b>';
  }

  function finishCurrentAndContinue(){
    if(!recorder)return;
    try{if(recorder.state!=='inactive')recorder.stop();}catch(e){}
  }

  function startClip(){
    if(!active||clipIndex>=3||!inMatch()){reset();return;}
    var s=hostStream(); if(!s){setTimeout(startClip,500);return;}
    stream=s;chunks=[];
    try{
      var clone=new MediaStream();
      s.getVideoTracks().forEach(function(t){try{clone.addTrack(t);}catch(e){}});
      s.getAudioTracks().forEach(function(t){try{clone.addTrack(t);}catch(e){}});
      if(!clone.getVideoTracks().length)return;

      var opt={videoBitsPerSecond:2500000,audioBitsPerSecond:96000};
      var mime=bestMime();if(mime)opt.mimeType=mime;
      recorder=new MediaRecorder(clone,opt);
      clipStartedAt=Date.now();

      recorder.ondataavailable=function(e){
        if(e.data&&e.data.size>0)chunks.push(e.data);
      };
      recorder.onerror=function(){reset();};
      recorder.onstop=async function(){
        var idx=clipIndex+1;
        var type=(chunks[0]&&chunks[0].type)||mime||'video/webm';
        var blob=new Blob(chunks,{type:type});
        await saveClip(blob,idx);
        clipIndex++;
        chunks=[];
        recorder=null;
        updateButton();
        if(active&&clipIndex<3&&inMatch()){
          setTimeout(startClip,120);
        }else{
          active=false;
          clearInterval(timer);timer=null;
          updateButton();
          try{alert('✅ 매치 3분 녹화 완료! 1분 영상 3개가 내 동영상에 저장되었습니다.');}catch(e){}
        }
      };
      recorder.start(1000);
      updateButton();
      setTimeout(function(){
        if(active&&recorder&&recorder.state==='recording')finishCurrentAndContinue();
      },60000);
    }catch(e){reset();}
  }

  function startThree(){
    if(active)return;
    if(!inMatch())return;
    clipIndex=0;
    active=true;
    startClip();
    clearInterval(timer);
    timer=setInterval(function(){
      if(!inMatch()){reset();return;}
      updateButton();
    },500);
  }

  function ensureButton(){
    var top=document.querySelector('.match-arena-sheet .kt-match-top');
    if(!top)return;

    /* 기존 큰선물 녹화 버튼은 매치 화면에서는 숨김 */
    var old=document.querySelector('.match-arena-sheet .kt-premium-clip-switch-20260928');
    if(old)old.style.setProperty('display','none','important');

    var exit=top.querySelector('button[onclick*="closeSheet"]');
    if(!exit)return;
    var b=document.getElementById('ktMatchThreeClipRecordBtn20260929');
    if(!b){
      b=document.createElement('button');
      b.id='ktMatchThreeClipRecordBtn20260929';
      b.type='button';
      b.style.cssText='height:38px;padding:0 10px;border-radius:12px;border:1px solid #ff587c99;background:rgba(25,9,15,.92);color:#fff;font-size:11px;font-weight:950;box-shadow:0 0 9px #ff3e6844;touch-action:manipulation;flex:0 0 auto;';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        if(!active)startThree();
      };
      top.insertBefore(b,exit);
    }
    updateButton();
  }

  function tick(){
    if(inMatch())ensureButton();
    else if(active)reset();
  }

  setInterval(tick,300);
  tick();
})();